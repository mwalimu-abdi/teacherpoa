import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const email = String(body.email || "").trim().toLowerCase()
    const password = String(body.password || "")

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      )
    }

    const teacher = await prisma.teacher.findUnique({
      where: { email },
    })

    if (!teacher) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, teacher.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      )
    }

    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await prisma.session.create({
      data: {
        token,
        teacherId: teacher.id,
        expiresAt,
      },
    })

    const cookieStore = await cookies()

    cookieStore.set("mh_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      path: "/",
    })

    return NextResponse.json(
      {
        message: "Login successful.",
        teacher: {
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("LOGIN ERROR:", error)
    return NextResponse.json(
      {
        message: "Server error during login.",
        error: String(error),
      },
      { status: 500 }
    )
  }
}