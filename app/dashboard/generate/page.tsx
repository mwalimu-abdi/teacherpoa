"use client"

import { useMemo, useState } from "react"

const terms = ["Term 1", "Term 2", "Term 3"]

const levels = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Form 1",
  "Form 2",
  "Form 3",
  "Form 4",
]

const subjects = [
  "Mathematics",
  "English",
  "Kiswahili",
  "Agriculture",
  "Science & Technology",
  "Social Studies",
  "Creative Arts",
  "Biology",
  "Chemistry",
  "Physics",
  "History",
  "Geography",
  "CRE",
  "IRE",
  "Business Studies",
  "Computer Studies",
  "Home Science",
]

const weekColors = [
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-indigo-100",
  "bg-orange-100",
  "bg-teal-100",
]

type BreakItem = {
  id: string
  name: string
  startWeek: number
  startLesson: number
  endWeek: number
  endLesson: number
}

type PreviewCell =
  | string
  | {
      content: string
      colSpan?: number
      isBreak?: boolean
    }

type PreviewScheme = {
  headers: string[]
  rows: PreviewCell[][]
  meta?: {
    teacherName?: string
    school?: string
    term?: string
    level?: string
    subject?: string
    lessonsPerWeek?: number
    totalWeeks?: number
    referenceBook?: string
  }
}

function slotNumber(week: number, lesson: number, lessonsPerWeek: number) {
  return (week - 1) * lessonsPerWeek + lesson
}

export default function GenerateDocumentsPage() {
  const [term, setTerm] = useState("Term 1")
  const [level, setLevel] = useState("Grade 1")
  const [subject, setSubject] = useState("Mathematics")
  const [referenceBook, setReferenceBook] = useState("")
  const [lessonsPerWeek, setLessonsPerWeek] = useState("5")
  const [totalWeeks, setTotalWeeks] = useState("14")

  const [breakName, setBreakName] = useState("")
  const [startWeek, setStartWeek] = useState("")
  const [startLesson, setStartLesson] = useState("")
  const [endWeek, setEndWeek] = useState("")
  const [endLesson, setEndLesson] = useState("")

  const [breaks, setBreaks] = useState<BreakItem[]>([])
  const [message, setMessage] = useState("")
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [previewScheme, setPreviewScheme] = useState<PreviewScheme | null>(null)

  const parsedLessonsPerWeek = Number(lessonsPerWeek)
  const parsedTotalWeeks = Number(totalWeeks)

  const weekLabels = useMemo(() => {
    if (!Number.isInteger(parsedTotalWeeks) || parsedTotalWeeks <= 0) return []
    return Array.from({ length: parsedTotalWeeks }, (_, index) => `WK ${index + 1}`)
  }, [parsedTotalWeeks])

  const weekIndex = useMemo(() => {
    if (!previewScheme?.headers?.length) return 0
    const normalized = previewScheme.headers.map((header) =>
      header.toLowerCase().trim()
    )
    const found = normalized.findIndex(
      (header) => header === "week" || header === "wk" || header.includes("week")
    )
    return found >= 0 ? found : 0
  }, [previewScheme])

  function resetBreakForm() {
    setBreakName("")
    setStartWeek("")
    setStartLesson("")
    setEndWeek("")
    setEndLesson("")
  }

  function addBreak() {
    setMessage("")

    const lpw = Number(lessonsPerWeek)
    const weeks = Number(totalWeeks)
    const sWeek = Number(startWeek)
    const sLesson = Number(startLesson)
    const eWeek = Number(endWeek)
    const eLesson = Number(endLesson)
    const trimmedName = breakName.trim()

    if (!trimmedName) {
      setMessage("Enter break name.")
      return
    }

    if (!Number.isInteger(lpw) || lpw <= 0) {
      setMessage("Lessons per week must be greater than 0.")
      return
    }

    if (!Number.isInteger(weeks) || weeks <= 0) {
      setMessage("Total weeks must be greater than 0.")
      return
    }

    if (
      !Number.isInteger(sWeek) ||
      !Number.isInteger(sLesson) ||
      !Number.isInteger(eWeek) ||
      !Number.isInteger(eLesson)
    ) {
      setMessage("Break start and end values must be complete numbers.")
      return
    }

    if (sWeek < 1 || sWeek > weeks || eWeek < 1 || eWeek > weeks) {
      setMessage("Break week values must be within the total weeks.")
      return
    }

    if (sLesson < 1 || sLesson > lpw || eLesson < 1 || eLesson > lpw) {
      setMessage("Break lesson values must be within lessons per week.")
      return
    }

    const startSlot = slotNumber(sWeek, sLesson, lpw)
    const endSlot = slotNumber(eWeek, eLesson, lpw)

    if (startSlot > endSlot) {
      setMessage("Break end must come after break start.")
      return
    }

    const collides = breaks.some((item) => {
      const itemStart = slotNumber(item.startWeek, item.startLesson, lpw)
      const itemEnd = slotNumber(item.endWeek, item.endLesson, lpw)
      return !(endSlot < itemStart || startSlot > itemEnd)
    })

    if (collides) {
      setMessage("This break collides with an existing break.")
      return
    }

    const newBreak: BreakItem = {
      id: crypto.randomUUID(),
      name: trimmedName,
      startWeek: sWeek,
      startLesson: sLesson,
      endWeek: eWeek,
      endLesson: eLesson,
    }

    setBreaks((prev) =>
      [...prev, newBreak].sort((a, b) => {
        const aSlot = slotNumber(a.startWeek, a.startLesson, lpw)
        const bSlot = slotNumber(b.startWeek, b.startLesson, lpw)
        return aSlot - bSlot
      })
    )

    setMessage("Break added successfully.")
    resetBreakForm()
  }

  function deleteBreak(id: string) {
    setBreaks((prev) => prev.filter((item) => item.id !== id))
    setMessage("Break removed.")
  }

  async function previewSchemeNow() {
    setLoadingPreview(true)
    setMessage("")
    setPreviewScheme(null)

    try {
      const res = await fetch("/api/dashboard/generate-scheme/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          term,
          level,
          subject,
          referenceBook,
          lessonsPerWeek: Number(lessonsPerWeek),
          totalWeeks: Number(totalWeeks),
          breaks,
        }),
      })

      const contentType = res.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        const text = await res.text()
        setMessage(`Preview route error: ${text.slice(0, 200)}`)
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Failed to preview scheme.")
        return
      }

      setPreviewScheme({
        headers: data.headers || [],
        rows: data.rows || [],
        meta: data.meta || {},
      })
      setMessage("Preview loaded successfully.")
    } catch (error) {
      console.error("PREVIEW FETCH ERROR:", error)
      setMessage("Failed to preview scheme.")
    } finally {
      setLoadingPreview(false)
    }
  }

  async function downloadSchemeNow() {
    setDownloading(true)
    setMessage("")

    try {
      const res = await fetch("/api/dashboard/generate-scheme/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          term,
          level,
          subject,
          referenceBook,
          lessonsPerWeek: Number(lessonsPerWeek),
          totalWeeks: Number(totalWeeks),
          breaks,
        }),
      })

      const contentType = res.headers.get("content-type") || ""

      if (!res.ok) {
        if (contentType.includes("application/json")) {
          const data = await res.json()
          setMessage(data.error || "Failed to download scheme.")
        } else {
          const text = await res.text()
          setMessage(`Download route error: ${text.slice(0, 200)}`)
        }
        return
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${subject}-${level}-${term}-scheme.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

      setMessage("Scheme downloaded and saved to My Documents.")
    } catch (error) {
      console.error("DOWNLOAD FETCH ERROR:", error)
      setMessage("Failed to download scheme.")
    } finally {
      setDownloading(false)
    }
  }

  function getResolvedWeek(rowIndex: number) {
    if (!previewScheme) return ""
    for (let i = rowIndex; i >= 0; i--) {
      const cell = previewScheme.rows[i]?.[weekIndex]
      if (typeof cell === "string" && cell.trim() !== "") {
        return cell
      }
    }
    return ""
  }

  function isWeekStart(rowIndex: number) {
    if (!previewScheme) return false
    const current = getResolvedWeek(rowIndex)
    const previous = rowIndex > 0 ? getResolvedWeek(rowIndex - 1) : ""
    return rowIndex === 0 || current !== previous
  }

  function isWeekEnd(rowIndex: number) {
    if (!previewScheme) return false
    const current = getResolvedWeek(rowIndex)
    const next =
      rowIndex < previewScheme.rows.length - 1 ? getResolvedWeek(rowIndex + 1) : ""
    return rowIndex === previewScheme.rows.length - 1 || current !== next
  }

  function getWeekCellClass(rowIndex: number) {
    const top = isWeekStart(rowIndex) ? "border-t" : "border-t-0"
    const bottom = isWeekEnd(rowIndex) ? "border-b" : "border-b-0"
    return `border-l border-r border-black ${top} ${bottom} p-2 text-[10px] align-top`
  }

  return (
    <main className="max-w-7xl mx-auto px-3 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold mb-1">Generate Scheme of Work</h1>
        <p className="text-sm text-gray-600">
          Configure the scheme, preview it, then download.
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-6">
        <div>
          <label className="block text-xs font-medium mb-1">Term</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full rounded border px-2 py-1.5 text-xs"
          >
            {terms.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Class</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full rounded border px-2 py-1.5 text-xs"
          >
            {levels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded border px-2 py-1.5 text-xs"
          >
            {subjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Ref Book</label>
          <input
            value={referenceBook}
            onChange={(e) => setReferenceBook(e.target.value)}
            className="w-full rounded border px-2 py-1.5 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Lessons/Wk</label>
          <input
            type="number"
            min="1"
            value={lessonsPerWeek}
            onChange={(e) => setLessonsPerWeek(e.target.value)}
            className="w-full rounded border px-2 py-1.5 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Total Wks</label>
          <input
            type="number"
            min="1"
            value={totalWeeks}
            onChange={(e) => setTotalWeeks(e.target.value)}
            className="w-full rounded border px-2 py-1.5 text-xs"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded border p-3">
          <h2 className="text-sm font-semibold mb-3">Break Configuration</h2>

          <div className="grid gap-2 md:grid-cols-5">
            <div className="md:col-span-5">
              <label className="block text-xs font-medium mb-1">Break Name</label>
              <input
                value={breakName}
                onChange={(e) => setBreakName(e.target.value)}
                className="w-full rounded border px-2 py-1.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Start Wk</label>
              <input
                type="number"
                min="1"
                value={startWeek}
                onChange={(e) => setStartWeek(e.target.value)}
                className="w-full rounded border px-2 py-1.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Start Lsn</label>
              <input
                type="number"
                min="1"
                value={startLesson}
                onChange={(e) => setStartLesson(e.target.value)}
                className="w-full rounded border px-2 py-1.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">End Wk</label>
              <input
                type="number"
                min="1"
                value={endWeek}
                onChange={(e) => setEndWeek(e.target.value)}
                className="w-full rounded border px-2 py-1.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">End Lsn</label>
              <input
                type="number"
                min="1"
                value={endLesson}
                onChange={(e) => setEndLesson(e.target.value)}
                className="w-full rounded border px-2 py-1.5 text-xs"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={addBreak}
                className="w-full rounded border px-2 py-1.5 text-xs hover:bg-gray-50"
              >
                Add Break
              </button>
            </div>
          </div>

          <div className="mt-2">
            <button
              type="button"
              onClick={resetBreakForm}
              className="rounded border px-2 py-1.5 text-xs hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </section>

        <section className="rounded border p-3">
          <h2 className="text-sm font-semibold mb-3">Weeks</h2>

          <div className="flex flex-wrap gap-1">
            {weekLabels.map((item, index) => {
              const color = weekColors[index % weekColors.length]

              return (
                <div
                  key={item}
                  className={`${color} w-12 rounded border text-center px-1 py-1 text-[9px] font-semibold`}
                >
                  {item}
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <section className="rounded border p-3">
        <h2 className="text-sm font-semibold mb-2">Saved Breaks</h2>

        {breaks.length === 0 ? (
          <p className="text-xs text-gray-600">No breaks added yet.</p>
        ) : (
          <div className="space-y-2">
            {breaks.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded border p-2 md:flex-row md:items-center md:justify-between"
              >
                <div className="text-xs">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-gray-600">
                    Start: Week {item.startWeek}, Lesson {item.startLesson}
                  </div>
                  <div className="text-gray-600">
                    End: Week {item.endWeek}, Lesson {item.endLesson}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteBreak(item.id)}
                  className="rounded border px-2 py-1.5 text-xs hover:bg-gray-50"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={previewSchemeNow}
          disabled={loadingPreview}
          className="rounded bg-black px-3 py-2 text-xs text-white disabled:opacity-50"
        >
          {loadingPreview ? "Loading Preview..." : "Preview Scheme"}
        </button>

        <button
          type="button"
          onClick={downloadSchemeNow}
          disabled={downloading}
          className="rounded border px-3 py-2 text-xs hover:bg-gray-50 disabled:opacity-50"
        >
          {downloading ? "Downloading..." : "Download Scheme"}
        </button>
      </div>

      {message && (
        <div className="rounded border bg-gray-50 px-3 py-2 text-xs">
          {message}
        </div>
      )}

      {previewScheme && (
        <section className="space-y-6">
          {/* Cover page */}
          <div className="rounded border bg-white min-h-[1056px] flex flex-col justify-between">
            <div className="text-xs px-4 pt-4">{previewScheme.meta?.school || "-"}</div>

            <div className="text-center space-y-3">
              <div className="text-3xl font-bold">SCHEME OF WORK</div>
              <div className="text-2xl font-semibold">
                {(previewScheme.meta?.subject || subject).toUpperCase()}
              </div>
              <div className="text-2xl font-semibold">
                {(previewScheme.meta?.level || level).toUpperCase()}
              </div>
              <div className="text-2xl font-semibold">
                {(previewScheme.meta?.term || term).toUpperCase()}
              </div>
              <div className="text-2xl font-semibold">
                {(previewScheme.meta?.school || "-").toUpperCase()}
              </div>
            </div>

            <div className="pb-6" />
          </div>

          {/* First page after cover */}
          <div className="rounded border bg-white min-h-[1056px] flex flex-col">
            <div className="overflow-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    {previewScheme.headers.map((header, index) => (
                      <th
                        key={index}
                        className="border border-black p-2 text-[10px] font-semibold text-left bg-white"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {previewScheme.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => {
                        if (
                          typeof cell === "object" &&
                          cell !== null &&
                          "content" in cell
                        ) {
                          return (
                            <td
                              key={colIndex}
                              colSpan={cell.colSpan || 1}
                              className="border border-black p-2 text-[10px] align-top text-center font-semibold"
                            >
                              {cell.content}
                            </td>
                          )
                        }

                        if (colIndex === weekIndex) {
                          return (
                            <td key={colIndex} className={getWeekCellClass(rowIndex)}>
                              {String(cell ?? "")}
                            </td>
                          )
                        }

                        return (
                          <td
                            key={colIndex}
                            className="border border-black p-2 text-[10px] align-top"
                          >
                            {String(cell ?? "")}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-auto py-3">
              <div className="text-center text-xs">Page 1</div>
              <div className="text-center text-xs italic pt-2">
                This document is created by {previewScheme.meta?.teacherName || "-"}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}