import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

type BreakItem = {
  id?: string
  name: string
  startWeek: number
  startLesson: number
  endWeek: number
  endLesson: number
}

type Payload = {
  term: string
  level: string
  subject: string
  referenceBook?: string
  lessonsPerWeek: number
  totalWeeks: number
  breaks?: BreakItem[]
}

type ValidateBreaksResult =
  | { ok: true; breaks: BreakItem[] }
  | { ok: false; error: string }

type PreviewCell =
  | string
  | {
      content: string
      colSpan?: number
    }

function safeParseArray(value: string | null | undefined): unknown[] {
  try {
    const parsed = JSON.parse(value || "[]")
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function normalizeHeaders(headers: unknown[]): string[] {
  return headers.map((item) => String(item ?? "").trim())
}

function normalizeRows(rows: unknown[], headerCount: number): string[][] {
  if (!Array.isArray(rows)) return []

  return rows.map((row) => {
    const cells = Array.isArray(row) ? row.map((cell) => String(cell ?? "")) : []
    while (cells.length < headerCount) cells.push("")
    return cells.slice(0, headerCount)
  })
}

function slotNumber(week: number, lesson: number, lessonsPerWeek: number) {
  return (week - 1) * lessonsPerWeek + lesson
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

function validateBreaks(
  breaks: BreakItem[],
  totalWeeks: number,
  lessonsPerWeek: number
): ValidateBreaksResult {
  const normalized: BreakItem[] = breaks.map((item) => ({
    id: item.id,
    name: String(item.name || "").trim(),
    startWeek: Number(item.startWeek),
    startLesson: Number(item.startLesson),
    endWeek: Number(item.endWeek),
    endLesson: Number(item.endLesson),
  }))

  for (const item of normalized) {
    if (!item.name) {
      return { ok: false, error: "Every break must have a name." }
    }

    if (
      !Number.isInteger(item.startWeek) ||
      !Number.isInteger(item.startLesson) ||
      !Number.isInteger(item.endWeek) ||
      !Number.isInteger(item.endLesson)
    ) {
      return { ok: false, error: "Break values must be complete whole numbers." }
    }

    if (
      item.startWeek < 1 ||
      item.endWeek < 1 ||
      item.startWeek > totalWeeks ||
      item.endWeek > totalWeeks
    ) {
      return { ok: false, error: "Break weeks must be within total weeks." }
    }

    if (
      item.startLesson < 1 ||
      item.endLesson < 1 ||
      item.startLesson > lessonsPerWeek ||
      item.endLesson > lessonsPerWeek
    ) {
      return { ok: false, error: "Break lessons must be within lessons per week." }
    }

    const startSlot = slotNumber(item.startWeek, item.startLesson, lessonsPerWeek)
    const endSlot = slotNumber(item.endWeek, item.endLesson, lessonsPerWeek)

    if (startSlot > endSlot) {
      return { ok: false, error: "Break end must come after break start." }
    }
  }

  const sorted = [...normalized].sort((a, b) => {
    const aSlot = slotNumber(a.startWeek, a.startLesson, lessonsPerWeek)
    const bSlot = slotNumber(b.startWeek, b.startLesson, lessonsPerWeek)
    return aSlot - bSlot
  })

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]
    const current = sorted[i]

    const prevEnd = slotNumber(prev.endWeek, prev.endLesson, lessonsPerWeek)
    const currentStart = slotNumber(
      current.startWeek,
      current.startLesson,
      lessonsPerWeek
    )

    if (currentStart <= prevEnd) {
      return { ok: false, error: "Breaks must not collide." }
    }
  }

  return { ok: true, breaks: sorted }
}

function buildGeneratedScheme(
  headers: string[],
  masterRows: string[][],
  lessonsPerWeek: number,
  totalWeeks: number,
  breaks: BreakItem[]
) {
  const { weekIndex, lessonIndex } = getColumnIndexes(headers)
  const breakBySlot = new Map<number, string>()

  for (const item of breaks) {
    const startSlot = slotNumber(item.startWeek, item.startLesson, lessonsPerWeek)
    const endSlot = slotNumber(item.endWeek, item.endLesson, lessonsPerWeek)

    for (let slot = startSlot; slot <= endSlot; slot++) {
      breakBySlot.set(slot, item.name)
    }
  }

  const maxSlots = lessonsPerWeek * totalWeeks
  const finalRows: string[][] = []

  for (const sourceRow of masterRows) {
    const rawLesson = String(sourceRow[lessonIndex] || "").trim()
    const absoluteLesson = Number(rawLesson)

    if (!Number.isInteger(absoluteLesson) || absoluteLesson < 1) {
      continue
    }

    if (absoluteLesson > maxSlots) {
      break
    }

    const weekNumber = Math.ceil(absoluteLesson / lessonsPerWeek)
    const lessonWithinWeek = ((absoluteLesson - 1) % lessonsPerWeek) + 1
    const breakName = breakBySlot.get(absoluteLesson)

    const row = [...sourceRow]
    row[weekIndex] = `WK ${weekNumber}`
    row[lessonIndex] = String(lessonWithinWeek)

    if (breakName) {
      headers.forEach((_, index) => {
        if (index !== weekIndex && index !== lessonIndex) {
          row[index] = breakName
        }
      })
    }

    finalRows.push(row)
  }

  return finalRows
}

function buildPreviewRows(rows: string[][], headers: string[]) {
  const { weekIndex, lessonIndex } = getColumnIndexes(headers)
  const firstContentIndex = headers.findIndex(
    (_, index) => index !== weekIndex && index !== lessonIndex
  )

  const previewRows: PreviewCell[][] = []

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
        const plainRow: PreviewCell[] = [...current]
        if (!startsNewWeek) plainRow[weekIndex] = ""
        previewRows.push(plainRow)
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

      const row: PreviewCell[] = []
      row.push(startsNewWeek ? `WK ${weekNumber}` : "")
      row.push(lessonDisplay)

      if (firstContentIndex >= 0) {
        row.push({
          content: breakName,
          colSpan: headers.length - firstContentIndex,
        })
      }

      previewRows.push(row)
      previousWeekGroup = `WK ${weekNumber}`
      i = j + 1
      continue
    }

    const normalRow: PreviewCell[] = [...current]
    if (!startsNewWeek) {
      normalRow[weekIndex] = ""
    }

    previewRows.push(normalRow)
    previousWeekGroup = weekGroup || previousWeekGroup
    i++
  }

  return previewRows
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

export async function POST(req: NextRequest) {
  try {
    const session = await getTeacherSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const body = (await req.json()) as Payload

    const term = String(body.term || "").trim()
    const level = String(body.level || "").trim()
    const subject = String(body.subject || "").trim()
    const lessonsPerWeek = Number(body.lessonsPerWeek)
    const totalWeeks = Number(body.totalWeeks)
    const breaks = Array.isArray(body.breaks) ? body.breaks : []

    if (!term || !level || !subject) {
      return NextResponse.json(
        { error: "Term, class and subject are required." },
        { status: 400 }
      )
    }

    if (!Number.isInteger(lessonsPerWeek) || lessonsPerWeek <= 0) {
      return NextResponse.json(
        { error: "Lessons per week must be greater than 0." },
        { status: 400 }
      )
    }

    if (!Number.isInteger(totalWeeks) || totalWeeks <= 0) {
      return NextResponse.json(
        { error: "Total weeks must be greater than 0." },
        { status: 400 }
      )
    }

    const validatedBreaks = validateBreaks(breaks, totalWeeks, lessonsPerWeek)

    if (!validatedBreaks.ok) {
      return NextResponse.json(
        { error: validatedBreaks.error },
        { status: 400 }
      )
    }

    const masterScheme = await prisma.masterScheme.findUnique({
      where: {
        term_level_subject: {
          term,
          level,
          subject,
        },
      },
    })

    if (!masterScheme) {
      return NextResponse.json(
        { error: "No master scheme found for this configuration." },
        { status: 404 }
      )
    }

    const headers = normalizeHeaders(safeParseArray(masterScheme.headersJson))
    const masterRows = normalizeRows(
      safeParseArray(masterScheme.rowsJson),
      headers.length
    )

    if (headers.length === 0) {
      return NextResponse.json(
        { error: "Master scheme headers are empty." },
        { status: 400 }
      )
    }

    const generatedRows = buildGeneratedScheme(
      headers,
      masterRows,
      lessonsPerWeek,
      totalWeeks,
      validatedBreaks.breaks
    )

    const previewRows = buildPreviewRows(generatedRows, headers)

    return NextResponse.json({
      headers,
      rows: previewRows,
      meta: {
        teacherName: session.teacher.name,
        school: session.teacher.school,
        term,
        level,
        subject,
        lessonsPerWeek,
        totalWeeks,
        referenceBook: String(body.referenceBook || "").trim(),
      },
    })
  } catch (error) {
    console.error("PREVIEW SCHEME ERROR:", error)

    return NextResponse.json(
      { error: "Failed to preview scheme." },
      { status: 500 }
    )
  }
}