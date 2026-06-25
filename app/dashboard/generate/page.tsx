"use client"

import { useMemo, useState } from "react"

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
  const [level, setLevel] = useState("PP1")
  const [subject, setSubject] = useState("LANGUAGE ACTIVITIES")
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

  const availableSubjects = useMemo(() => {
    return SUBJECTS_BY_LEVEL[level] || []
  }, [level])

  const availableReferences = useMemo(() => {
    return REFERENCES_BY_LEVEL_AND_SUBJECT[level]?.[subject] || []
  }, [level, subject])

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
            onChange={(e) => {
              const nextLevel = e.target.value
              const nextSubjects = SUBJECTS_BY_LEVEL[nextLevel] || []

              setLevel(nextLevel)
              setSubject(nextSubjects[0] || "")
              setReferenceBook("")
            }}
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
            onChange={(e) => {
              setSubject(e.target.value)
              setReferenceBook("")
            }}
            className="w-full rounded border px-2 py-1.5 text-xs"
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
          <label className="block text-xs font-medium mb-1">Ref Book</label>
          <select
            value={referenceBook}
            onChange={(e) => setReferenceBook(e.target.value)}
            className="w-full rounded border px-2 py-1.5 text-xs"
          >
            <option value="">Select Reference</option>
            {availableReferences.map((ref) => (
              <option key={ref} value={ref}>
                {ref}
              </option>
            ))}
          </select>
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
            <div className="text-xs px-4 pt-4">
              {previewScheme.meta?.school || "-"}
            </div>

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