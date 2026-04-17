import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const email = String(body?.email || "").trim().toLowerCase()
    const code = String(body?.code || "").trim()
    const newPassword = String(body?.newPassword || "")
    const confirmPassword = String(body?.confirmPassword || "")

    if (!email || !code || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      )
    }

    if (code.length !== 6) {
      return NextResponse.json(
        { success: false, message: "Enter a valid 6-digit code." },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match." },
        { status: 400 }
      )
    }

    if (!isStrongPassword(newPassword)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
        },
        { status: 400 }
      )
    }

    const teacher = await prisma.teacher.findUnique({
      where: { email },
    })

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Invalid code or email." },
        { status: 400 }
      )
    }

    const otpRecord = await prisma.passwordResetOtp.findFirst({
      where: {
        teacherId: teacher.id,
        usedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "No reset code found. Request a new one." },
        { status: 400 }
      )
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, message: "The code has expired. Request a new one." },
        { status: 400 }
      )
    }

    const codeMatches = await bcrypt.compare(code, otpRecord.codeHash)

    if (!codeMatches) {
      return NextResponse.json(
        { success: false, message: "Invalid code or email." },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.$transaction([
      prisma.teacher.update({
        where: { id: teacher.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetOtp.update({
        where: { id: otpRecord.id },
        data: { usedAt: new Date() },
      }),
      prisma.session.deleteMany({
        where: { teacherId: teacher.id },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: "Password reset successful. You can now log in.",
    })
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error)
    return NextResponse.json(
      { success: false, message: "Failed to reset password." },
      { status: 500 }
    )
  }
}