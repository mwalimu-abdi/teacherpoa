"use client"

import { useEffect, useMemo, useState } from "react"

const terms = ["Term 1", "Term 2", "Term 3"]

const levels = [
  "PP1",
  "PP2",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Form 1",
  "Form 2",
  "Form 3",
  "Form 4",
]

const SUBJECTS_BY_LEVEL: Record<string, string[]> = {
  PP1: [
    "LANGUAGE ACTIVITIES",
    "MATHEMATICS ACTIVITIES",
    "CRE",
    "IRE",
    "CREATIVE ACTIVITIES",
    "ENVIRONMENTAL ACTIVITIES",
  ],
  PP2: [
    "LANGUAGE ACTIVITIES",
    "MATHEMATICS ACTIVITIES",
    "CRE",
    "IRE",
    "CREATIVE ACTIVITIES",
    "ENVIRONMENTAL ACTIVITIES",
  ],
  "Grade 1": [
    "English",
    "Kiswahili",
    "Mathematics",
    "Environmental Activities",
    "CRE",
    "Creative Activities",
  ],
  "Grade 2": [
    "English",
    "Kiswahili",
    "Mathematics",
    "Environmental Activities",
    "CRE",
    "Creative Activities",
  ],
  "Grade 3": [
    "English",
    "Kiswahili",
    "Mathematics",
    "Environmental Activities",
    "CRE",
    "IRE",
    "Creative Activities",
  ],
  "Grade 4": [
    "English",
    "Kiswahili",
    "Mathematics",
    "CRE",
    "IRE",
    "Social Studies",
    "Science and Technology",
    "Agriculture and Nutrition",
    "Creative Arts and Sports",
  ],
  "Grade 5": [
    "English",
    "Kiswahili",
    "Mathematics",
    "CRE",
    "IRE",
    "Social Studies",
    "Science and Technology",
    "Agriculture",
    "Creative Arts and Sports",
  ],
  "Grade 6": [
    "English",
    "Kiswahili",
    "Mathematics",
    "CRE",
    "IRE",
    "Social Studies",
    "Science and Technology",
    "Agriculture",
    "Creative Arts and Sports",
  ],
  "Grade 7": [
    "English",
    "Kiswahili",
    "Mathematics",
    "CRE",
    "IRE",
    "Social Studies",
    "Integrated Science",
    "Agriculture and Nutrition",
    "Pre-Technical Studies",
    "Creative Arts and Sports",
  ],
  "Grade 8": [
    "English",
    "Kiswahili",
    "Mathematics",
    "CRE",
    "IRE",
    "HRE",
    "Social Studies",
    "Integrated Science",
    "Agriculture and Nutrition",
    "Pre-Technical Studies",
    "Creative Arts and Sports",
  ],
  "Grade 9": [
    "English",
    "Kiswahili",
    "Mathematics",
    "CRE",
    "IRE",
    "Social Studies",
    "Integrated Science",
    "Agriculture and Nutrition",
    "Pre-Technical Studies",
    "Creative Arts and Sports",
  ],
  "Grade 10": [
    "English",
    "Kiswahili Lugha",
    "Fasihi ya Kiswahili",
    "Arabic",
    "French",
    "German",
    "Mandarin",
    "Indigenous Languages",
    "CRE",
    "IRE",
    "HRE",
    "Core Mathematics",
    "Essential Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "General Science",
    "Geography",
    "History and Citizenship",
    "Business Studies",
    "Agriculture",
    "Home Science",
    "ICT",
    "Computer Studies",
    "Electricity",
    "Woodwork",
    "Building and Construction",
    "Metal Work",
    "Power Mechanics",
    "Media Technology",
    "Aviation",
    "Marine and Fisheries Technology",
    "Fine Arts",
    "Music and Dance",
    "Theatre and Film",
    "Physical Education",
    "Sports and Recreation",
    "Community Service Learning",
    "Literature in English",
  ],
  "Grade 11": [],
  "Grade 12": [],
  "Form 1": [
    "Mathematics",
    "English",
    "Kiswahili",
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
    "Agriculture",
  ],
  "Form 2": [
    "Mathematics",
    "English",
    "Kiswahili",
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
    "Agriculture",
  ],
  "Form 3": [
    "Mathematics",
    "English",
    "Kiswahili",
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
    "Agriculture",
  ],
  "Form 4": [
    "Mathematics",
    "English",
    "Kiswahili",
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
    "Agriculture",
  ],
}

const REFERENCES_BY_LEVEL_AND_SUBJECT: Record<string, Record<string, string[]>> = {
  PP1: {
    "LANGUAGE ACTIVITIES": ["Queenex"],
    "MATHEMATICS ACTIVITIES": ["Queenex"],
    CRE: ["Queenex"],
    IRE: ["Queenex"],
    "CREATIVE ACTIVITIES": ["Queenex"],
    "ENVIRONMENTAL ACTIVITIES": ["Queenex"],
  },
  PP2: {
    "LANGUAGE ACTIVITIES": ["Queenex"],
    "MATHEMATICS ACTIVITIES": ["Queenex"],
    CRE: ["Queenex"],
    IRE: ["Queenex"],
    "CREATIVE ACTIVITIES": ["Queenex"],
    "ENVIRONMENTAL ACTIVITIES": ["Queenex", "Mastering"],
  },
  "Grade 1": {
    English: ["Moran – Skills in English"],
    Kiswahili: [
      "Mentor – Kielekezi cha Kiswahili",
      "KLB Visionary – Mazoezi ya Kiswahili",
    ],
    Mathematics: ["KLB Mathematical Activities"],
    "Environmental Activities": [
      "Moran Environmental Activities",
      "Oxford – Our Lives Today",
      "Mentor Environmental Activities",
      "Highland Environmental Activities",
    ],
    CRE: [
      "Oxford – Growing in Christ",
      "KLB Visionary CRE",
      "Mentor CRE",
      "Moran CRE",
    ],
    "Creative Activities": [
      "Mentor Creative Activities",
      "Moran Creative Activities",
    ],
  },
  "Grade 2": {
    English: ["Moran – Skills in English", "Mentor English"],
    Kiswahili: [
      "Moran – Stadi za Kiswahili",
      "Oxford Kiswahili Dadisi",
      "Mentor – Mazoezi ya Kiswahili",
    ],
    Mathematics: [
      "Oxford – Let’s Do Mathematics",
      "Mentor Mathematics",
      "KLB Mathematical Activities",
    ],
    "Environmental Activities": [
      "Oxford Environmental Activities",
      "Distinction Environmental Activities",
      "Our World Environmental Activities",
    ],
    CRE: ["Mentor CRE", "Oxford – Growing in Christ", "KLB CRE"],
    "Creative Activities": ["Humming Bird Creative Activities"],
  },
  "Grade 3": {
    English: [
      "Oxford Progressive Primary English",
      "Moran – Skills in English",
      "Mentor English",
      "KLB Visionary English",
    ],
    Kiswahili: [
      "Oxford Kiswahili Dadisi",
      "Mentor – Kielekezi cha Kiswahili",
      "Moran – Stadi za Kiswahili",
    ],
    Mathematics: [
      "Mentor Mathematics",
      "Oxford – Let’s Do Mathematics",
      "KLB Visionary Mathematics",
    ],
    CRE: ["Mentor CRE", "Oxford – Growing in Christ", "KLB Visionary CRE"],
    IRE: ["Default"],
    "Environmental Activities": [
      "Oxford – Our Lives Today",
      "Moran – Our World",
    ],
    "Creative Activities": [
      "Mentor Creative Activities",
      "KLB Visionary Creative Activities",
    ],
  },
  "Grade 4": {
    English: [
      "Moran – Skills in English",
      "Oxford Progressive Primary English",
      "Mentor English",
      "KLB Visionary English",
    ],
    Kiswahili: ["KLB Visionary Kiswahili", "Oxford Kiswahili Dadisi"],
    Mathematics: [
      "Mentor Mathematics",
      "Oxford – Let’s Do Mathematics",
      "KLB Visionary Mathematics",
    ],
    CRE: [
      "One Planet CRE - Knowing God CRE",
      "Oxford – Growing in Christ",
      "KLB Visionary CRE",
    ],
    IRE: ["Default"],
    "Social Studies": [
      "Moran – Our World",
      "Mentor Social Studies",
      "KLB Visionary Social Studies",
    ],
    "Science and Technology": [
      "Oxford Everyday Science and Technology",
      "KLB Science and Technology",
    ],
    "Agriculture and Nutrition": [
      "Oxford Agriculture and Nutrition",
      "KLB Agriculture and Nutrition",
    ],
    "Creative Arts and Sports": [
      "Longhorn Creative Arts and Sports",
      "Mentor Creative Arts",
      "KLB Visionary Creative Arts",
    ],
  },
  "Grade 5": {
    English: ["Oxford New Progressive Primary English", "Mentor English"],
    Kiswahili: ["Mentor – Kielekezi cha Kiswahili"],
    Mathematics: [
      "KLB Visionary Mathematics",
      "Mentor Mathematics",
      "Oxford – Let’s Do Mathematics",
    ],
    CRE: ["KLB Visionary CRE", "Oxford – Growing in Christ"],
    IRE: ["Default"],
    "Social Studies": ["Mentor Social Studies"],
    "Science and Technology": [
      "Mentor Science and Technology",
      "Oxford Everyday Science and Technology",
      "KLB Science and Technology",
    ],
    Agriculture: [
      "Oxford Modern Agriculture",
      "Mentor Agriculture",
      "KLB Visionary Agriculture",
    ],
    "Creative Arts and Sports": ["KLB Creative Arts", "Mentor Creative Arts"],
  },
  "Grade 6": {
    English: ["KLB Top Scholar English", "Mentor English"],
    Kiswahili: [
      "Oxford Kiswahili",
      "Mentor Kiswahili",
      "KLB Top Scholar Kiswahili",
    ],
    Mathematics: [
      "Oxford – Let’s Do Mathematics",
      "KLB Mathematics",
      "Mentor Mathematics",
    ],
    CRE: ["Oxford – Growing in Christ", "Mentor CRE"],
    IRE: ["Default"],
    "Social Studies": [
      "Moran – Our World",
      "KLB Social Studies",
      "Mentor Social Studies",
      "Oxford Social Studies",
    ],
    "Science and Technology": [
      "Oxford Everyday Science and Technology",
      "Superminds Science and Technology",
      "Mentor Science and Technology",
    ],
    Agriculture: [
      "Mentor Agriculture",
      "Oxford Modern Agriculture",
      "KLB Visionary Agriculture",
    ],
    "Creative Arts and Sports": [
      "Mentor Creative Arts",
      "KLB Visionary Creative Arts",
    ],
  },
  "Grade 7": {
    English: ["Oxford Headstart English"],
    Kiswahili: ["JKF – Nyota ya Kiswahili"],
    Mathematics: [
      "Smart Mind Mathematics",
      "Oxford Active Mathematics",
      "KLB Top Scholar Mathematics",
    ],
    CRE: ["Oxford Alive CRE"],
    IRE: ["KLB Top Scholar IRE"],
    "Social Studies": ["Distinction Social Studies"],
    "Integrated Science": ["Master Integrated Science"],
    "Agriculture and Nutrition": ["Highland Agriculture"],
    "Pre-Technical Studies": ["Booklet Master Pre-Technical Studies"],
    "Creative Arts and Sports": ["Humming Bird Creative Arts and Sports"],
  },
  "Grade 8": {
    English: [
      "Moran – Skills in English",
      "EAEP Smart Mind English",
      "KLB Top Scholar English",
    ],
    Kiswahili: [
      "Mentor – Kielekezi cha Kiswahili",
      "Oxford Fasaha Kiswahili",
      "Top Scholar Kiswahili",
    ],
    Mathematics: ["Master Mathematics", "Mentor Mathematics", "KLB Mathematics"],
    CRE: ["Mentor CRE"],
    IRE: ["KLB Top Scholar IRE"],
    HRE: ["Default"],
    "Social Studies": ["Mentor Social Studies"],
    "Integrated Science": [
      "Spotlight Integrated Science",
      "Mentor Integrated Science",
      "KLB Integrated Science",
    ],
    "Agriculture and Nutrition": ["Spark Agriculture"],
    "Pre-Technical Studies": ["Mentor Pre-Technical Studies"],
    "Creative Arts and Sports": ["Moran Creative Arts and Sports"],
  },
  "Grade 9": {
    English: [
      "Moran – Skills in English",
      "KLB Top Scholar English",
      "Booklyst English",
    ],
    Kiswahili: [
      "Kiswahili Mentor",
      "Oxford Kiswahili Fasaha",
      "KLP Top Scholar Kiswahili",
    ],
    Mathematics: ["KLB Mathematics", "Master Mathematics"],
    CRE: ["Oxford Alive CRE", "Mentor CRE", "KLB Top Scholar CRE"],
    IRE: ["KLB Islamic Religious Education"],
    "Social Studies": ["Mentor Social Studies", "KLB Visionary Social Studies"],
    "Integrated Science": [
      "Oxford Integrated Science",
      "Mentor Integrated Science",
      "KLB Integrated Science",
    ],
    "Agriculture and Nutrition": [
      "Mentor Agriculture",
      "KLB Top Scholar Agriculture",
    ],
    "Pre-Technical Studies": [
      "Spotlight Pre-Technical Studies",
      "Oxford Pre-Technical Studies",
      "KLB Pre-Technical Studies",
    ],
    "Creative Arts and Sports": [
      "Mentor Creative Arts",
      "KLB Top Scholar Creative Arts",
    ],
  },
  "Grade 10": {
    English: ["Moran – Skills in English", "KLB – Excelling in English"],
    "Kiswahili Lugha": ["Kiswahili Akili Pevu", "Oxford Kiswahili Fasaha"],
    "Fasihi ya Kiswahili": ["Default"],
    Arabic: ["Default"],
    French: ["Default"],
    German: ["Default"],
    Mandarin: ["Default"],
    "Indigenous Languages": ["Default"],
    CRE: ["Humming Bird CRE", "MTP CRE"],
    IRE: ["Default"],
    HRE: ["Default"],
    "Core Mathematics": ["Master Mathematics", "Mentor Core Mathematics"],
    "Essential Mathematics": ["Mentor Essential Mathematics"],
    Biology: ["Distinction Biology", "Spotlight Biology"],
    Chemistry: ["Access and Learn Chemistry", "Front Row Chemistry"],
    Physics: ["Spotlight Physics", "Triumph Physics"],
    "General Science": ["Mentor General Science", "Humming Bird General Science"],
    Geography: ["Longhorn Comprehensive Geography", "Distinction Geography"],
    "History and Citizenship": [
      "Oxford – Evolving World",
      "MTP History and Citizenship",
    ],
    "Business Studies": ["Booklyst Master Business Studies"],
    Agriculture: ["One Planet – Healthy Planet Agriculture", "MTP Agriculture"],
    "Home Science": ["Mentor Home Science", "MTP Home Science"],
    ICT: ["Spotlight ICT", "KLB Excelling ICT"],
    "Computer Studies": [
      "Modern Technology Computer Studies",
      "Champions Computer Studies",
    ],
    Electricity: ["Booklyst Electricity", "Distinction Electricity"],
    Woodwork: ["MTP Woodwork"],
    "Building and Construction": ["Default"],
    "Metal Work": ["Default"],
    "Power Mechanics": ["Default"],
    "Media Technology": ["Default"],
    Aviation: ["Default"],
    "Marine and Fisheries Technology": ["Default"],
    "Fine Arts": ["Default"],
    "Music and Dance": ["Default"],
    "Theatre and Film": ["Default"],
    "Physical Education": ["Humming Bird Physical Education"],
    "Sports and Recreation": ["Default"],
    "Community Service Learning": [
      "Oxford Essential CSL",
      "MTP Community Service Learning",
    ],
    "Literature in English": ["Default"],
  },
  "Grade 11": {},
  "Grade 12": {},
  "Form 1": {},
  "Form 2": {},
  "Form 3": {},
  "Form 4": {},
}

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
  const [level, setLevel] = useState("PP1")
  const [subject, setSubject] = useState("LANGUAGE ACTIVITIES")
  const [referenceBook, setReferenceBook] = useState("Queenex")

  const [headers, setHeaders] = useState<string[]>(defaultHeaders)
  const [rows, setRows] = useState<string[][]>([createEmptyRow(defaultHeaders)])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const [weekToGenerate, setWeekToGenerate] = useState("")
  const [lessonsPerWeek, setLessonsPerWeek] = useState("")

  const availableSubjects = useMemo(() => {
    return SUBJECTS_BY_LEVEL[level] || []
  }, [level])

  const availableReferences = useMemo(() => {
    return REFERENCES_BY_LEVEL_AND_SUBJECT[level]?.[subject] || []
  }, [level, subject])

  async function loadScheme() {
    if (!term || !level || !subject || !referenceBook) {
      setHeaders(defaultHeaders)
      setRows([createEmptyRow(defaultHeaders)])
      setMessage("Select term, class, subject and reference book.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(
        `/api/admin/master-schemes?term=${encodeURIComponent(
          term
        )}&level=${encodeURIComponent(level)}&subject=${encodeURIComponent(
          subject
        )}&referenceBook=${encodeURIComponent(referenceBook)}`,
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
    if (referenceBook) {
      loadScheme()
    }
  }, [term, level, subject, referenceBook])

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
    if (!term || !level || !subject || !referenceBook) {
      setMessage("Select term, class, subject and reference book before saving.")
      return
    }

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
          referenceBook,
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
      <div className="grid gap-4 md:grid-cols-5">
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
            onChange={(e) => {
              const nextLevel = e.target.value
              const nextSubjects = SUBJECTS_BY_LEVEL[nextLevel] || []
              const nextSubject = nextSubjects[0] || ""
              const nextReferences =
                REFERENCES_BY_LEVEL_AND_SUBJECT[nextLevel]?.[nextSubject] || []

              setLevel(nextLevel)
              setSubject(nextSubject)
              setReferenceBook(nextReferences[0] || "")
            }}
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
            onChange={(e) => {
              const nextSubject = e.target.value
              const nextReferences =
                REFERENCES_BY_LEVEL_AND_SUBJECT[level]?.[nextSubject] || []

              setSubject(nextSubject)
              setReferenceBook(nextReferences[0] || "")
            }}
            className="w-full rounded border px-3 py-2"
          >
            {availableSubjects.length > 0 ? (
              availableSubjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))
            ) : (
              <option value="">No subjects available</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Reference Book</label>
          <select
            value={referenceBook}
            onChange={(e) => setReferenceBook(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            {availableReferences.length > 0 ? (
              availableReferences.map((ref) => (
                <option key={ref} value={ref}>
                  {ref}
                </option>
              ))
            ) : (
              <option value="">No references available</option>
            )}
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