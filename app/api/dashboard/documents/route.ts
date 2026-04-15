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

export async function GET(req: NextRequest) {
  try {
    const session = await getTeacherSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)

    const yearParam = searchParams.get("year")
    const term = String(searchParams.get("term") || "").trim()
    const documentType = String(searchParams.get("documentType") || "").trim()

    const where: {
      teacherId: number
      year?: number
      term?: string
      documentType?: string
    } = {
      teacherId: session.teacher.id,
    }

    if (yearParam && !Number.isNaN(Number(yearParam))) {
      where.year = Number(yearParam)
    }

    if (term) {
      where.term = term
    }

    if (documentType) {
      where.documentType = documentType
    }

    const documents = await prisma.generatedDocument.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        year: true,
        term: true,
        documentType: true,
        classLevel: true,
        subject: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ documents })
  } catch (error) {
    console.error("DOCUMENTS API ERROR:", error)

    return NextResponse.json(
      { error: "Failed to load documents." },
      { status: 500 }
    )
  }
}