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
        { message: "Email and password required." },
        { status: 400 }
      )
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid login credentials." },
        { status: 401 }
      )
    }

    const validPassword = await bcrypt.compare(password, admin.password)

    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid login credentials." },
        { status: 401 }
      )
    }

    const token = crypto.randomUUID()

    const cookieStore = await cookies()

    cookieStore.set("mh_admin_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    })

    return NextResponse.json(
      {
        message: "Admin login successful",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error)

    return NextResponse.json(
      { message: "Server error." },
      { status: 500 }
    )
  }
}