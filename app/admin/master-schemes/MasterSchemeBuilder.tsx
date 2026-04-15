"use client"

import { useEffect, useState } from "react"

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

const defaultHeaders = [
  "Week",
  "Lesson",
  "Strand",
  "Sub-Strand",
  "Specific Learning Outcomes",
  "Key Inquiry Questions",
  "Learning Experiences",
  "Core Competencies",
  "Values",
  "PCIs",
  "Assessment",
  "Reflections",
]

function createEmptyRow(headers: string[]) {
  return headers.map(() => "")
}

function normalizeRows(rows: string[][], headers: string[]) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [createEmptyRow(headers)]
  }

  return rows.map((row) => {
    const safeRow = Array.isArray(row) ? [...row] : []

    while (safeRow.length < headers.length) {
      safeRow.push("")
    }

    if (safeRow.length > headers.length) {
      return safeRow.slice(0, headers.length)
    }

    return safeRow
  })
}

export default function MasterSchemeBuilder() {
  const [term, setTerm] = useState("Term 1")
  const [level, setLevel] = useState("Grade 1")
  const [subject, setSubject] = useState("Mathematics")

  const [headers, setHeaders] = useState<string[]>(defaultHeaders)
  const [rows, setRows] = useState<string[][]>([createEmptyRow(defaultHeaders)])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const [weekToGenerate, setWeekToGenerate] = useState("")
  const [lessonsPerWeek, setLessonsPerWeek] = useState("")

  async function loadScheme() {
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(
        `/api/admin/master-schemes?term=${encodeURIComponent(term)}&level=${encodeURIComponent(level)}&subject=${encodeURIComponent(subject)}`,
        {
          cache: "no-store",
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Failed to load scheme.")
        setHeaders(defaultHeaders)
        setRows([createEmptyRow(defaultHeaders)])
        return
      }

      if (data.scheme) {
        const loadedHeaders =
          Array.isArray(data.scheme.headers) && data.scheme.headers.length > 0
            ? data.scheme.headers
            : defaultHeaders

        const loadedRows = normalizeRows(data.scheme.rows, loadedHeaders)

        setHeaders(loadedHeaders)
        setRows(loadedRows)
        setMessage("Loaded saved scheme.")
      } else {
        setHeaders(defaultHeaders)
        setRows([createEmptyRow(defaultHeaders)])
        setMessage("No saved scheme found. You can create a new one.")
      }
    } catch (error) {
      setHeaders(defaultHeaders)
      setRows([createEmptyRow(defaultHeaders)])
      setMessage("Failed to load scheme.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadScheme()
  }, [term, level, subject])

  function updateCell(rowIndex: number, colIndex: number, value: string) {
    setRows((prev) => {
      const next = [...prev]
      next[rowIndex] = [...next[rowIndex]]
      next[rowIndex][colIndex] = value
      return next
    })
  }

  function updateHeader(index: number, value: string) {
    setHeaders((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  function addRow() {
    setRows((prev) => [...prev, createEmptyRow(headers)])
  }

  function deleteRow(rowIndex: number) {
    setRows((prev) => {
      const next = prev.filter((_, index) => index !== rowIndex)
      return next.length > 0 ? next : [createEmptyRow(headers)]
    })
  }

  function addColumn() {
    const newHeaders = [...headers, `Column ${headers.length + 1}`]
    setHeaders(newHeaders)
    setRows((prev) => prev.map((row) => [...row, ""]))
  }

  function deleteColumn(colIndex: number) {
    if (headers.length <= 1) return

    const newHeaders = headers.filter((_, index) => index !== colIndex)
    setHeaders(newHeaders)
    setRows((prev) =>
      prev.map((row) => row.filter((_, index) => index !== colIndex))
    )
  }

  function addLessonRowBelow(rowIndex: number) {
    setRows((prev) => {
      const next = [...prev]
      const sourceRow = [...next[rowIndex]]

      const newRow = headers.map((_, colIndex) => {
        if (colIndex === 0) {
          return sourceRow[0] || ""
        }

        if (colIndex === 1) {
          const currentLesson = Number(sourceRow[1] || 0)
          return currentLesson ? String(currentLesson + 1) : ""
        }

        return ""
      })

      next.splice(rowIndex + 1, 0, newRow)
      return next
    })
  }

  function generateWeekRows() {
    const week = weekToGenerate.trim()
    const lessons = Number(lessonsPerWeek)

    if (!week) {
      setMessage("Enter the week number first.")
      return
    }

    if (!Number.isInteger(lessons) || lessons <= 0) {
      setMessage("Lessons per week must be a number greater than 0.")
      return
    }

    const newRows = Array.from({ length: lessons }, (_, index) =>
      headers.map((_, colIndex) => {
        if (colIndex === 0) return week
        if (colIndex === 1) return String(index + 1)
        return ""
      })
    )

    setRows((prev) => {
      const hasOnlyOneEmptyRow =
        prev.length === 1 && prev[0].every((cell) => String(cell).trim() === "")

      if (hasOnlyOneEmptyRow) {
        return newRows
      }

      return [...prev, ...newRows]
    })

    setMessage(`Added ${lessons} lesson rows for week ${week}.`)
  }

  async function saveScheme() {
    setSaving(true)
    setMessage("")

    try {
      const cleanedHeaders = headers.map(
        (header) => header.trim() || "Untitled Column"
      )
      const cleanedRows = normalizeRows(rows, cleanedHeaders)

      const res = await fetch("/api/admin/master-schemes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          term,
          level,
          subject,
          headers: cleanedHeaders,
          rows: cleanedRows,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Failed to save scheme.")
        return
      }

      setHeaders(cleanedHeaders)
      setRows(cleanedRows)
      setMessage("Scheme saved successfully.")

      await loadScheme()
    } catch (error) {
      setMessage("Failed to save scheme.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium mb-1">Term</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            {terms.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Class / Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            {levels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            {subjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={saveScheme}
            disabled={saving}
            className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Scheme"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium mb-1">Week Number</label>
          <input
            type="text"
            value={weekToGenerate}
            onChange={(e) => setWeekToGenerate(e.target.value)}
            placeholder="e.g. 1"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Lessons Per Week
          </label>
          <input
            type="number"
            min="1"
            value={lessonsPerWeek}
            onChange={(e) => setLessonsPerWeek(e.target.value)}
            placeholder="e.g. 5"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={generateWeekRows}
            className="w-full rounded border px-4 py-2 hover:bg-gray-50"
          >
            Generate Week Rows
          </button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={addRow}
          type="button"
          className="rounded border px-4 py-2 hover:bg-gray-50"
        >
          Add Single Row
        </button>

        <button
          onClick={addColumn}
          type="button"
          className="rounded border px-4 py-2 hover:bg-gray-50"
        >
          Add Column
        </button>

        <button
          onClick={loadScheme}
          type="button"
          disabled={loading}
          className="rounded border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Reload"}
        </button>
      </div>

      {message && (
        <div className="rounded border bg-gray-50 px-4 py-3 text-sm">
          {message}
        </div>
      )}

      <div className="overflow-auto rounded border">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header, colIndex) => (
                <th key={colIndex} className="min-w-[180px] border p-2 align-top">
                  <div className="space-y-2">
                    <input
                      value={header}
                      onChange={(e) => updateHeader(colIndex, e.target.value)}
                      className="w-full rounded border px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => deleteColumn(colIndex)}
                      className="w-full rounded border px-2 py-1 text-xs hover:bg-gray-50"
                    >
                      Delete Column
                    </button>
                  </div>
                </th>
              ))}
              <th className="min-w-[140px] border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((_, colIndex) => (
                  <td key={colIndex} className="border p-2 align-top">
                    <textarea
                      value={row[colIndex] || ""}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="min-h-[80px] w-full rounded border px-2 py-1 text-sm"
                    />
                  </td>
                ))}
                <td className="border p-2 align-top">
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => addLessonRowBelow(rowIndex)}
                      className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      Add Lesson Below
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteRow(rowIndex)}
                      className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      Delete Row
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}