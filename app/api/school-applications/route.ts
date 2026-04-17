import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("mh_session")?.value

    if (!token) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      )
    }

    const session = await prisma.session.findUnique({
      where: { token },
      include: { teacher: true },
    })

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Session expired. Please log in again." },
        { status: 401 }
      )
    }

    const body = await req.json()

    const applicantName = String(body.applicantName || "").trim()
    const schoolName = String(body.schoolName || "").trim()
    const phone = String(body.phone || "").trim()
    const email = String(body.email || "").trim()
    const schoolType = String(body.schoolType || "").trim()
    const county = String(body.county || "").trim()
    const message = String(body.message || "").trim()

    const studentCount =
      body.studentCount === "" || body.studentCount === undefined
        ? null
        : Number(body.studentCount)

    const teacherCount =
      body.teacherCount === "" || body.teacherCount === undefined
        ? null
        : Number(body.teacherCount)

    if (!applicantName) {
      return NextResponse.json(
        { error: "Applicant name is required." },
        { status: 400 }
      )
    }

    if (!schoolName) {
      return NextResponse.json(
        { error: "School name is required." },
        { status: 400 }
      )
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      )
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      )
    }

    if (Number.isNaN(studentCount) && studentCount !== null) {
      return NextResponse.json(
        { error: "Student count must be a valid number." },
        { status: 400 }
      )
    }

    if (Number.isNaN(teacherCount) && teacherCount !== null) {
      return NextResponse.json(
        { error: "Teacher count must be a valid number." },
        { status: 400 }
      )
    }

    const application = await prisma.schoolApplication.create({
      data: {
        teacherId: session.teacher.id,
        applicantName,
        schoolName,
        phone,
        email,
        schoolType: schoolType || null,
        county: county || null,
        studentCount,
        teacherCount,
        message: message || null,
        status: "pending",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
      application,
    })
  } catch (error) {
    console.error("School application submit error:", error)
    return NextResponse.json(
      { error: "Something went wrong while submitting the application." },
      { status: 500 }
    )
  }
}