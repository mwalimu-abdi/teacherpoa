import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/mailer"

function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body?.email || "").trim().toLowerCase()

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      )
    }

    // 🔍 Check if teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { email },
    })

    // 🔒 Do not expose whether email exists
    if (!teacher) {
      return NextResponse.json({
        success: true,
        message: "If that email exists, a reset code has been sent.",
      })
    }

    // 🧹 Delete old OTPs
    await prisma.passwordResetOtp.deleteMany({
      where: {
        teacherId: teacher.id,
      },
    })

    // 🔢 Generate OTP
    const code = generateSixDigitCode()
    const codeHash = await bcrypt.hash(code, 10)

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // 💾 Save OTP
    await prisma.passwordResetOtp.create({
      data: {
        teacherId: teacher.id,
        codeHash,
        expiresAt,
      },
    })

    // 📧 Send email
    await sendPasswordResetEmail(teacher.email, code)

    return NextResponse.json({
      success: true,
      message: "Reset code sent successfully.",
    })
  } catch (error) {
    console.error("❌ FORGOT PASSWORD ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send reset code.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}