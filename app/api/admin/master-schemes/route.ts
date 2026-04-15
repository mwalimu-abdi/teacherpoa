import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

function safeParseArray(value: string) {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const term = String(searchParams.get("term") || "").trim()
    const level = String(searchParams.get("level") || "").trim()
    const subject = String(searchParams.get("subject") || "").trim()

    if (!term || !level || !subject) {
      return NextResponse.json(
        { error: "term, level and subject are required" },
        { status: 400 }
      )
    }

    const scheme = await prisma.masterScheme.findUnique({
      where: {
        term_level_subject: {
          term,
          level,
          subject,
        },
      },
    })

    if (!scheme) {
      return NextResponse.json({ scheme: null })
    }

    return NextResponse.json({
      scheme: {
        ...scheme,
        headers: safeParseArray(scheme.headersJson),
        rows: safeParseArray(scheme.rowsJson),
      },
    })
  } catch (error) {
    console.error("GET MASTER SCHEME ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch scheme" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const term = String(body.term || "").trim()
    const level = String(body.level || "").trim()
    const subject = String(body.subject || "").trim()
    const headers = body.headers
    const rows = body.rows

    if (!term || !level || !subject) {
      return NextResponse.json(
        { error: "term, level and subject are required" },
        { status: 400 }
      )
    }

    if (!Array.isArray(headers) || !Array.isArray(rows)) {
      return NextResponse.json(
        { error: "headers and rows must be arrays" },
        { status: 400 }
      )
    }

    const cleanedHeaders = headers.map((header: unknown) =>
      String(header || "").trim()
    )

    const cleanedRows = rows.map((row: unknown) => {
      if (!Array.isArray(row)) return []
      return row.map((cell: unknown) => String(cell || ""))
    })

    const scheme = await prisma.masterScheme.upsert({
      where: {
        term_level_subject: {
          term,
          level,
          subject,
        },
      },
      update: {
        headersJson: JSON.stringify(cleanedHeaders),
        rowsJson: JSON.stringify(cleanedRows),
      },
      create: {
        term,
        level,
        subject,
        headersJson: JSON.stringify(cleanedHeaders),
        rowsJson: JSON.stringify(cleanedRows),
      },
    })

    return NextResponse.json({
      success: true,
      scheme: {
        ...scheme,
        headers: safeParseArray(scheme.headersJson),
        rows: safeParseArray(scheme.rowsJson),
      },
    })
  } catch (error) {
    console.error("SAVE MASTER SCHEME ERROR:", error)

    return NextResponse.json(
      { error: "Failed to save scheme" },
      { status: 500 }
    )
  }
}