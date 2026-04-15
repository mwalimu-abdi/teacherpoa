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

function getNairobiParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })

  const parts = formatter.formatToParts(date)
  const value = (type: string) => parts.find((p) => p.type === type)?.value || ""

  return {
    year: Number(value("year")),
    month: Number(value("month")),
    day: Number(value("day")),
    hour: Number(value("hour")),
    minute: Number(value("minute")),
    second: Number(value("second")),
    dateKey: `${value("year")}-${value("month")}-${value("day")}`,
  }
}

function toUtcDateOnlyFromParts(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day))
}

function getTodayNairobiDate() {
  const now = getNairobiParts()
  return {
    ...now,
    utcDate: toUtcDateOnlyFromParts(now.year, now.month, now.day),
  }
}

function getAcademicTerm(month: number) {
  if (month >= 1 && month <= 4) return "Term 1"
  if (month >= 5 && month <= 8) return "Term 2"
  return "Term 3"
}

function getAcademicTermRange(year: number, term: string) {
  if (term === "Term 1") {
    return {
      start: new Date(Date.UTC(year, 0, 1)),
      end: new Date(Date.UTC(year, 3, 30, 23, 59, 59, 999)),
    }
  }

  if (term === "Term 2") {
    return {
      start: new Date(Date.UTC(year, 4, 1)),
      end: new Date(Date.UTC(year, 7, 31, 23, 59, 59, 999)),
    }
  }

  return {
    start: new Date(Date.UTC(year, 8, 1)),
    end: new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)),
  }
}

function getIsoWeekInfo(year: number, month: number, day: number) {
  const target = new Date(Date.UTC(year, month - 1, day))
  const dayNumber = target.getUTCDay() || 7
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber)
  const isoYear = target.getUTCFullYear()
  const yearStart = new Date(Date.UTC(isoYear, 0, 1))
  const week = Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)

  const original = new Date(Date.UTC(year, month - 1, day))
  const originalDay = original.getUTCDay() || 7
  const weekStart = new Date(original)
  weekStart.setUTCDate(original.getUTCDate() - originalDay + 1)
  weekStart.setUTCHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6)
  weekEnd.setUTCHours(23, 59, 59, 999)

  return {
    isoYear,
    week,
    weekLabel: `${isoYear}-W${String(week).padStart(2, "0")}`,
    weekStart,
    weekEnd,
  }
}

async function saveAttendanceSummary(args: {
  classId: number
  periodType: "Daily" | "Weekly" | "Termly"
  periodKey: string
  reportDate?: Date | null
  year: number
  term?: string | null
  weekLabel?: string | null
  totalStudents: number
  totalPresent: number
  totalAbsent: number
  mostAbsentStudentId?: number | null
  mostAbsentStudentName?: string | null
  mostAbsentCount?: number
  mostPresentStudentId?: number | null
  mostPresentStudentName?: string | null
  mostPresentCount?: number
}) {
  const percentage =
    args.totalStudents > 0 && args.totalPresent + args.totalAbsent > 0
      ? Number(
          (
            (args.totalPresent / (args.totalPresent + args.totalAbsent)) *
            100
          ).toFixed(2)
        )
      : 0

  await prisma.attendanceSummary.upsert({
    where: {
      class_periodType_periodKey: {
        classId: args.classId,
        periodType: args.periodType,
        periodKey: args.periodKey,
      },
    },
    update: {
      reportDate: args.reportDate ?? null,
      year: args.year,
      term: args.term ?? null,
      weekLabel: args.weekLabel ?? null,
      totalStudents: args.totalStudents,
      totalPresent: args.totalPresent,
      totalAbsent: args.totalAbsent,
      attendancePercentage: percentage,
      mostAbsentStudentId: args.mostAbsentStudentId ?? null,
      mostAbsentStudentName: args.mostAbsentStudentName ?? null,
      mostAbsentCount: args.mostAbsentCount ?? 0,
      mostPresentStudentId: args.mostPresentStudentId ?? null,
      mostPresentStudentName: args.mostPresentStudentName ?? null,
      mostPresentCount: args.mostPresentCount ?? 0,
    },
    create: {
      classId: args.classId,
      periodType: args.periodType,
      periodKey: args.periodKey,
      reportDate: args.reportDate ?? null,
      year: args.year,
      term: args.term ?? null,
      weekLabel: args.weekLabel ?? null,
      totalStudents: args.totalStudents,
      totalPresent: args.totalPresent,
      totalAbsent: args.totalAbsent,
      attendancePercentage: percentage,
      mostAbsentStudentId: args.mostAbsentStudentId ?? null,
      mostAbsentStudentName: args.mostAbsentStudentName ?? null,
      mostAbsentCount: args.mostAbsentCount ?? 0,
      mostPresentStudentId: args.mostPresentStudentId ?? null,
      mostPresentStudentName: args.mostPresentStudentName ?? null,
      mostPresentCount: args.mostPresentCount ?? 0,
    },
  })
}

async function recomputeAttendanceSummaries(
  classId: number,
  reportDate: Date,
  reportDateKey: string
) {
  const todayParts = getNairobiParts(reportDate)
  const term = getAcademicTerm(todayParts.month)
  const termRange = getAcademicTermRange(todayParts.year, term)
  const weekInfo = getIsoWeekInfo(todayParts.year, todayParts.month, todayParts.day)

  const students = await prisma.student.findMany({
    where: { classId },
    select: {
      id: true,
      fullName: true,
    },
  })

  const totalStudents = students.length
  const studentNameMap = new Map(students.map((s) => [s.id, s.fullName]))

  const dailyRecord = await prisma.attendanceRecord.findFirst({
    where: {
      classId,
      date: reportDate,
    },
    include: {
      entries: true,
    },
  })

  const dailyPresent = dailyRecord
    ? dailyRecord.entries.filter((entry) => entry.status === "Present").length
    : 0
  const dailyAbsent = dailyRecord
    ? dailyRecord.entries.filter((entry) => entry.status === "Absent").length
    : 0

  const dailyAbsentEntry = dailyRecord?.entries.find((entry) => entry.status === "Absent")
  const dailyPresentEntry = dailyRecord?.entries.find((entry) => entry.status === "Present")

  await saveAttendanceSummary({
    classId,
    periodType: "Daily",
    periodKey: reportDateKey,
    reportDate,
    year: todayParts.year,
    term,
    weekLabel: weekInfo.weekLabel,
    totalStudents,
    totalPresent: dailyPresent,
    totalAbsent: dailyAbsent,
    mostAbsentStudentId: dailyAbsentEntry?.studentId ?? null,
    mostAbsentStudentName: dailyAbsentEntry
      ? studentNameMap.get(dailyAbsentEntry.studentId) || null
      : null,
    mostAbsentCount: dailyAbsentEntry ? 1 : 0,
    mostPresentStudentId: dailyPresentEntry?.studentId ?? null,
    mostPresentStudentName: dailyPresentEntry
      ? studentNameMap.get(dailyPresentEntry.studentId) || null
      : null,
    mostPresentCount: dailyPresentEntry ? 1 : 0,
  })

  const weeklyRecords = await prisma.attendanceRecord.findMany({
    where: {
      classId,
      date: {
        gte: weekInfo.weekStart,
        lte: weekInfo.weekEnd,
      },
    },
    include: {
      entries: true,
    },
  })

  const weeklyAbsentCount = new Map<number, number>()
  const weeklyPresentCount = new Map<number, number>()
  let weeklyPresent = 0
  let weeklyAbsent = 0

  for (const record of weeklyRecords) {
    for (const entry of record.entries) {
      if (entry.status === "Present") {
        weeklyPresent += 1
        weeklyPresentCount.set(
          entry.studentId,
          (weeklyPresentCount.get(entry.studentId) || 0) + 1
        )
      } else {
        weeklyAbsent += 1
        weeklyAbsentCount.set(
          entry.studentId,
          (weeklyAbsentCount.get(entry.studentId) || 0) + 1
        )
      }
    }
  }

  const mostAbsentWeekly = [...weeklyAbsentCount.entries()].sort((a, b) => b[1] - a[1])[0]
  const mostPresentWeekly = [...weeklyPresentCount.entries()].sort((a, b) => b[1] - a[1])[0]

  await saveAttendanceSummary({
    classId,
    periodType: "Weekly",
    periodKey: weekInfo.weekLabel,
    reportDate,
    year: weekInfo.isoYear,
    term,
    weekLabel: weekInfo.weekLabel,
    totalStudents,
    totalPresent: weeklyPresent,
    totalAbsent: weeklyAbsent,
    mostAbsentStudentId: mostAbsentWeekly?.[0] ?? null,
    mostAbsentStudentName: mostAbsentWeekly
      ? studentNameMap.get(mostAbsentWeekly[0]) || null
      : null,
    mostAbsentCount: mostAbsentWeekly?.[1] ?? 0,
    mostPresentStudentId: mostPresentWeekly?.[0] ?? null,
    mostPresentStudentName: mostPresentWeekly
      ? studentNameMap.get(mostPresentWeekly[0]) || null
      : null,
    mostPresentCount: mostPresentWeekly?.[1] ?? 0,
  })

  const termRecords = await prisma.attendanceRecord.findMany({
    where: {
      classId,
      date: {
        gte: termRange.start,
        lte: termRange.end,
      },
    },
    include: {
      entries: true,
    },
  })

  const termAbsentCount = new Map<number, number>()
  const termPresentCount = new Map<number, number>()
  let termPresent = 0
  let termAbsent = 0

  for (const record of termRecords) {
    for (const entry of record.entries) {
      if (entry.status === "Present") {
        termPresent += 1
        termPresentCount.set(
          entry.studentId,
          (termPresentCount.get(entry.studentId) || 0) + 1
        )
      } else {
        termAbsent += 1
        termAbsentCount.set(
          entry.studentId,
          (termAbsentCount.get(entry.studentId) || 0) + 1
        )
      }
    }
  }

  const mostAbsentTerm = [...termAbsentCount.entries()].sort((a, b) => b[1] - a[1])[0]
  const mostPresentTerm = [...termPresentCount.entries()].sort((a, b) => b[1] - a[1])[0]

  await saveAttendanceSummary({
    classId,
    periodType: "Termly",
    periodKey: `${todayParts.year}-${term}`,
    reportDate,
    year: todayParts.year,
    term,
    weekLabel: null,
    totalStudents,
    totalPresent: termPresent,
    totalAbsent: termAbsent,
    mostAbsentStudentId: mostAbsentTerm?.[0] ?? null,
    mostAbsentStudentName: mostAbsentTerm
      ? studentNameMap.get(mostAbsentTerm[0]) || null
      : null,
    mostAbsentCount: mostAbsentTerm?.[1] ?? 0,
    mostPresentStudentId: mostPresentTerm?.[0] ?? null,
    mostPresentStudentName: mostPresentTerm
      ? studentNameMap.get(mostPresentTerm[0]) || null
      : null,
    mostPresentCount: mostPresentTerm?.[1] ?? 0,
  })
}

export async function GET(
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
      include: {
        schoolClass: true,
      },
    })

    if (!role) {
      return NextResponse.json({ error: "Class not found." }, { status: 404 })
    }

    if (role.roleType !== "Class Teacher") {
      return NextResponse.json(
        { error: "Only class teachers can manage attendance." },
        { status: 403 }
      )
    }

    const today = getTodayNairobiDate()
    const weekInfo = getIsoWeekInfo(today.year, today.month, today.day)
    const term = getAcademicTerm(today.month)

    const students = await prisma.student.findMany({
      where: {
        classId: parsedClassId,
      },
      orderBy: [{ fullName: "asc" }, { admissionNumber: "asc" }],
    })

    const existingRecord = await prisma.attendanceRecord.findFirst({
      where: {
        classId: parsedClassId,
        date: today.utcDate,
      },
      include: {
        entries: true,
      },
    })

    const savedStatuses = existingRecord
      ? Object.fromEntries(
          existingRecord.entries.map((entry) => [entry.studentId, entry.status])
        )
      : {}

    const summaries = await prisma.attendanceSummary.findMany({
      where: {
        classId: parsedClassId,
        OR: [
          { periodType: "Daily", periodKey: today.dateKey },
          { periodType: "Weekly", periodKey: weekInfo.weekLabel },
          { periodType: "Termly", periodKey: `${today.year}-${term}` },
        ],
      },
    })

    const summaryMap = Object.fromEntries(
      summaries.map((summary) => [summary.periodType, summary])
    )

    const locked = today.hour >= 17 && !!existingRecord

    return NextResponse.json({
      classInfo: {
        id: role.schoolClass.id,
        level: role.schoolClass.level,
        stream: role.schoolClass.stream,
        roleType: role.roleType,
      },
      allowedDate: today.dateKey,
      locked,
      students,
      savedStatuses,
      summaries: {
        daily: summaryMap["Daily"] || null,
        weekly: summaryMap["Weekly"] || null,
        termly: summaryMap["Termly"] || null,
      },
    })
  } catch (error) {
    console.error("GET ATTENDANCE ERROR:", error)
    return NextResponse.json(
      { error: "Failed to load attendance." },
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

    if (role.roleType !== "Class Teacher") {
      return NextResponse.json(
        { error: "Only class teachers can save attendance." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const dateValue = String(body.date || "").trim()
    const absentStudentIds = Array.isArray(body.absentStudentIds)
      ? body.absentStudentIds.map((item: unknown) => Number(item)).filter(Number.isInteger)
      : []

    const today = getTodayNairobiDate()

    if (dateValue !== today.dateKey) {
      return NextResponse.json(
        { error: "Attendance can only be marked for today." },
        { status: 400 }
      )
    }

    const students = await prisma.student.findMany({
      where: {
        classId: parsedClassId,
      },
      select: {
        id: true,
      },
    })

    if (students.length === 0) {
      return NextResponse.json(
        { error: "This class has no students yet." },
        { status: 400 }
      )
    }

    const existingRecord = await prisma.attendanceRecord.findFirst({
      where: {
        classId: parsedClassId,
        date: today.utcDate,
      },
    })

    if (today.hour >= 17 && existingRecord) {
      return NextResponse.json(
        { error: "Today's attendance is locked after 5:00 PM." },
        { status: 400 }
      )
    }

    const validStudentIds = new Set(students.map((student) => student.id))

    for (const studentId of absentStudentIds) {
      if (!validStudentIds.has(studentId)) {
        return NextResponse.json(
          { error: "One or more selected students do not belong to this class." },
          { status: 400 }
        )
      }
    }

    const attendanceRecord = await prisma.attendanceRecord.upsert({
      where: {
        class_date_attendance: {
          classId: parsedClassId,
          date: today.utcDate,
        },
      },
      update: {
        createdById: session.teacher.id,
      },
      create: {
        classId: parsedClassId,
        date: today.utcDate,
        createdById: session.teacher.id,
      },
    })

    await prisma.attendanceEntry.deleteMany({
      where: {
        recordId: attendanceRecord.id,
      },
    })

    await prisma.attendanceEntry.createMany({
      data: students.map((student) => ({
        recordId: attendanceRecord.id,
        studentId: student.id,
        status: absentStudentIds.includes(student.id) ? "Absent" : "Present",
      })),
    })

    await recomputeAttendanceSummaries(parsedClassId, today.utcDate, today.dateKey)

    return NextResponse.json({
      success: true,
      locked: today.hour >= 17,
      message:
        today.hour >= 17
          ? "Attendance saved and locked."
          : "Attendance saved successfully.",
    })
  } catch (error) {
    console.error("SAVE ATTENDANCE ERROR:", error)
    return NextResponse.json(
      { error: "Failed to save attendance." },
      { status: 500 }
    )
  }
}