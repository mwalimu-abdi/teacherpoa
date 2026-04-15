import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export const runtime = "nodejs"

// ✅ helper to safely uppercase nullable values
function safeUpper(value: string | null | undefined) {
  return (value || "-").toUpperCase()
}

function safeParseStringArray(value: string | null | undefined): string[] {
  try {
    const parsed = JSON.parse(value || "[]")
    return Array.isArray(parsed) ? parsed.map((item) => String(item ?? "")) : []
  } catch {
    return []
  }
}

function safeParseRows(value: string | null | undefined): string[][] {
  try {
    const parsed = JSON.parse(value || "[]")
    return Array.isArray(parsed)
      ? parsed.map((row) =>
          Array.isArray(row) ? row.map((cell) => String(cell ?? "")) : []
        )
      : []
  } catch {
    return []
  }
}

function getColumnIndexes(headers: string[]) {
  const normalized = headers.map((header) => header.toLowerCase().trim())

  let weekIndex = normalized.findIndex(
    (header) => header === "week" || header === "wk" || header.includes("week")
  )

  let lessonIndex = normalized.findIndex(
    (header) =>
      header === "lesson" ||
      header === "lsn" ||
      header.includes("lesson") ||
      header.includes("lsn")
  )

  if (weekIndex < 0) weekIndex = 0
  if (lessonIndex < 0) lessonIndex = headers.length > 1 ? 1 : 0

  return { weekIndex, lessonIndex }
}

type PdfCell =
  | string
  | {
      content: string
      colSpan?: number
      styles?: Record<string, unknown>
    }

type PdfRowMeta = {
  startsNewWeek: boolean
  endsWeek: boolean
  weekGroup: string
}

function buildPdfRows(rows: string[][], headers: string[]) {
  const { weekIndex, lessonIndex } = getColumnIndexes(headers)
  const firstContentIndex = headers.findIndex(
    (_, index) => index !== weekIndex && index !== lessonIndex
  )

  const pdfBody: PdfCell[][] = []
  const meta: PdfRowMeta[] = []

  let i = 0
  let previousWeekGroup = ""

  while (i < rows.length) {
    const current = rows[i]
    const currentWeek = String(current[weekIndex] || "")
    const currentLesson = String(current[lessonIndex] || "")

    const contentCells = current.map((cell, index) =>
      index === weekIndex || index === lessonIndex ? "" : String(cell || "").trim()
    )

    const filledCells = contentCells.filter((cell) => cell !== "")
    const isBreak =
      filledCells.length > 0 && filledCells.every((cell) => cell === filledCells[0])

    const weekGroup = currentWeek
    const startsNewWeek = weekGroup !== previousWeekGroup

    if (isBreak) {
      const breakName = filledCells[0] || ""
      const weekMatch = currentWeek.match(/\d+/)
      const lessonStart = Number(currentLesson)

      if (!weekMatch || !Number.isInteger(lessonStart)) {
        const plainRow = [...current]
        if (!startsNewWeek) plainRow[weekIndex] = ""

        pdfBody.push(plainRow)
        meta.push({
          startsNewWeek,
          endsWeek: false,
          weekGroup,
        })

        previousWeekGroup = weekGroup || previousWeekGroup
        i++
        continue
      }

      const weekNumber = Number(weekMatch[0])
      let j = i
      let lessonEnd = lessonStart

      while (j + 1 < rows.length) {
        const next = rows[j + 1]
        const nextWeek = String(next[weekIndex] || "")
        const nextLesson = Number(next[lessonIndex])

        const nextCells = next.map((cell, index) =>
          index === weekIndex || index === lessonIndex ? "" : String(cell || "").trim()
        )
        const nextFilled = nextCells.filter((cell) => cell !== "")
        const nextBreakName = nextFilled[0] || ""
        const nextWeekMatch = nextWeek.match(/\d+/)

        if (
          !nextWeekMatch ||
          Number(nextWeekMatch[0]) !== weekNumber ||
          !Number.isInteger(nextLesson) ||
          nextLesson !== lessonEnd + 1 ||
          nextBreakName !== breakName
        ) {
          break
        }

        lessonEnd = nextLesson
        j++
      }

      const lessonDisplay =
        lessonStart === lessonEnd ? String(lessonStart) : `${lessonStart}-${lessonEnd}`

      const row: PdfCell[] = []
      row.push(startsNewWeek ? `WK ${weekNumber}` : "")
      row.push(lessonDisplay)

      if (firstContentIndex >= 0) {
        row.push({
          content: breakName,
          colSpan: headers.length - firstContentIndex,
          styles: {
            halign: "center",
            fontStyle: "bold",
            valign: "middle",
          },
        })
      }

      pdfBody.push(row)
      meta.push({
        startsNewWeek,
        endsWeek: false,
        weekGroup: `WK ${weekNumber}`,
      })

      previousWeekGroup = `WK ${weekNumber}`
      i = j + 1
      continue
    }

    const normalRow = [...current]
    if (!startsNewWeek) {
      normalRow[weekIndex] = ""
    }

    pdfBody.push(normalRow)
    meta.push({
      startsNewWeek,
      endsWeek: false,
      weekGroup,
    })

    previousWeekGroup = weekGroup || previousWeekGroup
    i++
  }

  for (let idx = 0; idx < meta.length; idx++) {
    const currentWeekGroup = meta[idx].weekGroup
    const nextWeekGroup = idx < meta.length - 1 ? meta[idx + 1].weekGroup : ""
    meta[idx].endsWeek = idx === meta.length - 1 || nextWeekGroup !== currentWeekGroup
  }

  return { pdfBody, meta }
}

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
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 })
    }

    const headers = safeParseStringArray(document.schemeHeadersJson)
    const rows = safeParseRows(document.schemeRowsJson)

    const doc = new jsPDF("l", "mm", "a4")
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFont("times", "bold")
    doc.setFontSize(16)
    doc.text(document.subject.toUpperCase(), pageWidth / 2, 84, { align: "center" })

    // ✅ FIXED LINE
    doc.text(safeUpper(document.classLevel), pageWidth / 2, 98, { align: "center" })

    doc.text(document.term.toUpperCase(), pageWidth / 2, 112, { align: "center" })

    return new NextResponse("OK")
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}