import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

function isStrongPassword(password: string) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const name = String(body.name || "").trim()
    const school = String(body.school || "").trim()
    const email = String(body.email || "").trim().toLowerCase()
    const subjects = Array.isArray(body.subjects) ? body.subjects : []
    const isClassTeacher = Boolean(body.isClassTeacher)
    const className = String(body.className || "").trim()
    const password = String(body.password || "")
    const confirmPassword = String(body.confirmPassword || "")

    if (!name || !school || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "Please fill all required fields." },
        { status: 400 }
      )
    }

    if (subjects.length === 0) {
      return NextResponse.json(
        { message: "Please add at least one subject." },
        { status: 400 }
      )
    }

    if (isClassTeacher && !className) {
      return NextResponse.json(
        { message: "Please enter class name." },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match." },
        { status: 400 }
      )
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
        },
        { status: 400 }
      )
    }

    const existingTeacher = await prisma.teacher.findUnique({
      where: { email },
    })

    if (existingTeacher) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.teacher.create({
      data: {
        name,
        school,
        email,
        password: hashedPassword,
        subjects: subjects.join(", "),
        isClassTeacher,
        className: isClassTeacher ? className : null,
      },
    })

    return NextResponse.json(
      { message: "Account created successfully." },
      { status: 201 }
    )
  } catch (error) {
    console.error("REGISTER ERROR:", error)
    return NextResponse.json(
      {
        message: "Server error during registration.",
        error: String(error),
      },
      { status: 500 }
    )
  }
}