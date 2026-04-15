import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

async function getTeacherSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("mh_session")?.value

  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { token },
    include: { teacher: true },
  })

  if (!session || session.expiresAt < new Date()) return null

  return session
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ classId: string }> }
) {
  try {
    const session = await getTeacherSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const { classId } = await context.params
    const parsedClassId = Number(classId)

    if (!Number.isInteger(parsedClassId)) {
      return NextResponse.json({ error: "Invalid class id." }, { status: 400 })
    }

    const role = await prisma.classTeacherRole.findFirst({
      where: {
        classId: parsedClassId,
        teacherId: session.teacher.id,
      },
      include: {
        schoolClass: true,
      },
    })

    if (!role) {
      return NextResponse.json({ error: "Class not found." }, { status: 404 })
    }

    const students = await prisma.student.findMany({
      where: {
        classId: parsedClassId,
      },
      orderBy: [
        { fullName: "asc" },
        { admissionNumber: "asc" },
      ],
    })

    return NextResponse.json({
      classInfo: {
        id: role.schoolClass.id,
        level: role.schoolClass.level,
        stream: role.schoolClass.stream,
        roleType: role.roleType,
        subject: role.subject,
      },
      students,
    })
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error)
    return NextResponse.json(
      { error: "Failed to load students." },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ classId: string }> }
) {
  try {
    const session = await getTeacherSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const { classId } = await context.params
    const parsedClassId = Number(classId)

    if (!Number.isInteger(parsedClassId)) {
      return NextResponse.json({ error: "Invalid class id." }, { status: 400 })
    }

    const role = await prisma.classTeacherRole.findFirst({
      where: {
        classId: parsedClassId,
        teacherId: session.teacher.id,
      },
    })

    if (!role) {
      return NextResponse.json({ error: "Class not found." }, { status: 404 })
    }

    const body = await req.json()

    const admissionNumber = String(body.admissionNumber || "").trim()
    const fullName = String(body.fullName || "").trim()
    const gender = String(body.gender || "").trim()
    const parentName = String(body.parentName || "").trim()
    const parentPhone = String(body.parentPhone || "").trim()

    if (!admissionNumber || !fullName) {
      return NextResponse.json(
        { error: "Admission number and full name are required." },
        { status: 400 }
      )
    }

    const existingStudent = await prisma.student.findFirst({
      where: {
        classId: parsedClassId,
        admissionNumber,
      },
    })

    if (existingStudent) {
      return NextResponse.json(
        { error: "A student with that admission number already exists in this class." },
        { status: 400 }
      )
    }

    const student = await prisma.student.create({
      data: {
        classId: parsedClassId,
        admissionNumber,
        fullName,
        gender: gender || null,
        parentName: parentName || null,
        parentPhone: parentPhone || null,
      },
    })

    return NextResponse.json({
      success: true,
      student,
    })
  } catch (error) {
    console.error("CREATE STUDENT ERROR:", error)
    return NextResponse.json(
      { error: "Failed to create student." },
      { status: 500 }
    )
  }
}