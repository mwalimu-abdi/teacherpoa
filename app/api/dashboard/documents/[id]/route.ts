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

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getTeacherSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const { id } = await context.params
    const documentId = Number(id)

    if (!Number.isInteger(documentId)) {
      return NextResponse.json({ error: "Invalid document id." }, { status: 400 })
    }

    const document = await prisma.generatedDocument.findFirst({
      where: {
        id: documentId,
        teacherId: session.teacher.id,
      },
      select: {
        id: true,
      },
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 })
    }

    await prisma.generatedDocument.delete({
      where: {
        id: documentId,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully.",
    })
  } catch (error) {
    console.error("DELETE DOCUMENT ERROR:", error)

    return NextResponse.json(
      { error: "Failed to delete document." },
      { status: 500 }
    )
  }
}