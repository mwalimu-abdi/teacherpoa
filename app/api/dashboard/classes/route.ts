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

export async function GET() {
  try {
    const session = await getTeacherSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const classes = await prisma.classTeacherRole.findMany({
      where: {
        teacherId: session.teacher.id,
      },
      include: {
        schoolClass: true,
      },
      orderBy: [
        { schoolClass: { level: "asc" } },
        { schoolClass: { stream: "asc" } },
        { createdAt: "desc" },
      ],
    })

    const formatted = classes.map((item) => ({
      id: item.id,
      classId: item.schoolClass.id,
      level: item.schoolClass.level,
      stream: item.schoolClass.stream,
      roleType: item.roleType,
      subject: item.subject,
      createdAt: item.createdAt,
    }))

    return NextResponse.json({ classes: formatted })
  } catch (error) {
    console.error("GET CLASSES ERROR:", error)
    return NextResponse.json(
      { error: "Failed to load classes." },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getTeacherSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const body = await req.json()

    const level = String(body.level || "").trim()
    const stream = String(body.stream || "").trim()
    const roleType = String(body.roleType || "").trim()
    const subject = String(body.subject || "").trim()

    if (!level || !stream || !roleType) {
      return NextResponse.json(
        { error: "Level, stream and role are required." },
        { status: 400 }
      )
    }

    if (
      roleType !== "Class Teacher" &&
      roleType !== "Subject Teacher"
    ) {
      return NextResponse.json(
        { error: "Invalid role selected." },
        { status: 400 }
      )
    }

    if (roleType === "Subject Teacher" && !subject) {
      return NextResponse.json(
        { error: "Subject is required for subject teacher." },
        { status: 400 }
      )
    }

    const schoolClass = await prisma.schoolClass.upsert({
      where: {
        level_stream: {
          level,
          stream,
        },
      },
      update: {},
      create: {
        level,
        stream,
        createdById: session.teacher.id,
      },
    })

    const existingRole = await prisma.classTeacherRole.findFirst({
      where: {
        classId: schoolClass.id,
        teacherId: session.teacher.id,
        roleType,
        subject: roleType === "Subject Teacher" ? subject : null,
      },
    })

    if (existingRole) {
      return NextResponse.json(
        { error: "This class assignment already exists." },
        { status: 400 }
      )
    }

    const createdRole = await prisma.classTeacherRole.create({
      data: {
        classId: schoolClass.id,
        teacherId: session.teacher.id,
        roleType,
        subject: roleType === "Subject Teacher" ? subject : null,
      },
      include: {
        schoolClass: true,
      },
    })

    return NextResponse.json({
      success: true,
      classItem: {
        id: createdRole.id,
        classId: createdRole.schoolClass.id,
        level: createdRole.schoolClass.level,
        stream: createdRole.schoolClass.stream,
        roleType: createdRole.roleType,
        subject: createdRole.subject,
        createdAt: createdRole.createdAt,
      },
    })
  } catch (error) {
    console.error("CREATE CLASS ERROR:", error)
    return NextResponse.json(
      { error: "Failed to create class." },
      { status: 500 }
    )
  }
}