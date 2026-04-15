"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type StudentItem = {
  id: number
  admissionNumber: string
  fullName: string
  gender: string | null
  parentName: string | null
  parentPhone: string | null
}

type ClassInfo = {
  id: number
  level: string
  stream: string
  roleType: string
}

type AttendanceMode =
  | "ALL_PRESENT"
  | "ALL_PRESENT_EXCEPT"
  | "ALL_ABSENT"
  | "ALL_ABSENT_EXCEPT"

export default function ClassAttendancePage({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const [classId, setClassId] = useState("")
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null)
  const [students, setStudents] = useState<StudentItem[]>([])
  const [attendanceDate, setAttendanceDate] = useState(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  })

  const [mode, setMode] = useState<AttendanceMode>("ALL_PRESENT")
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params
      setClassId(resolved.classId)
    }

    resolveParams()
  }, [params])

  async function loadAttendance() {
    if (!classId) return

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(
        `/api/dashboard/classes/${classId}/attendance?date=${encodeURIComponent(attendanceDate)}`
      )

      const contentType = res.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        const text = await res.text()
        console.error("NON JSON ATTENDANCE RESPONSE:", text)
        setMessage("Attendance route not found or returned invalid response.")
        setStudents([])
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Failed to load attendance.")
        setStudents([])
        return
      }

      const loadedStudents: StudentItem[] = data.students || []
      setClassInfo(data.classInfo || null)
      setStudents(loadedStudents)

      const savedStatuses = data.savedStatuses || {}
      const absentIds = loadedStudents
        .filter((student) => savedStatuses[student.id] === "Absent")
        .map((student) => student.id)

      if (loadedStudents.length > 0) {
        if (absentIds.length === 0) {
          setMode("ALL_PRESENT")
          setSelectedIds([])
        } else if (absentIds.length === loadedStudents.length) {
          setMode("ALL_ABSENT")
          setSelectedIds([])
        } else if (absentIds.length <= loadedStudents.length / 2) {
          setMode("ALL_PRESENT_EXCEPT")
          setSelectedIds(absentIds)
        } else {
          const presentIds = loadedStudents
            .filter((student) => !absentIds.includes(student.id))
            .map((student) => student.id)

          setMode("ALL_ABSENT_EXCEPT")
          setSelectedIds(presentIds)
        }
      } else {
        setMode("ALL_PRESENT")
        setSelectedIds([])
      }
    } catch (error) {
      console.error("LOAD ATTENDANCE ERROR:", error)
      setMessage("Failed to load attendance.")
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAttendance()
  }, [classId, attendanceDate])

  function setAttendanceMode(nextMode: AttendanceMode) {
    setMode(nextMode)
    setSelectedIds([])

    if (nextMode === "ALL_PRESENT") {
      setMessage("All students marked present.")
    } else if (nextMode === "ALL_PRESENT_EXCEPT") {
      setMessage("All students marked present except selected ones.")
    } else if (nextMode === "ALL_ABSENT") {
      setMessage("All students marked absent.")
    } else if (nextMode === "ALL_ABSENT_EXCEPT") {
      setMessage("All students marked absent except selected ones.")
    }
  }

  function toggleSelected(studentId: number) {
    setSelectedIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    )
  }

  function isStudentAbsent(studentId: number) {
    if (mode === "ALL_PRESENT") return false
    if (mode === "ALL_PRESENT_EXCEPT") return selectedIds.includes(studentId)
    if (mode === "ALL_ABSENT") return true
    return !selectedIds.includes(studentId)
  }

  const absentIdsForSave = useMemo(() => {
    return students
      .filter((student) => isStudentAbsent(student.id))
      .map((student) => student.id)
  }, [students, mode, selectedIds])

  const presentCount = students.length - absentIdsForSave.length
  const absentCount = absentIdsForSave.length

  function selectionLabel() {
    if (mode === "ALL_PRESENT_EXCEPT") return "Choose absent students"
    if (mode === "ALL_ABSENT_EXCEPT") return "Choose present students"
    return "No manual selection needed"
  }

  async function saveAttendance() {
    if (!classId) return

    setSaving(true)
    setMessage("")

    try {
      const res = await fetch(`/api/dashboard/classes/${classId}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: attendanceDate,
          absentStudentIds: absentIdsForSave,
        }),
      })

      const contentType = res.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        const text = await res.text()
        console.error("NON JSON SAVE ATTENDANCE RESPONSE:", text)
        setMessage("Attendance save route returned invalid response.")
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Failed to save attendance.")
        return
      }

      setMessage("Attendance saved successfully.")
      await loadAttendance()
    } catch (error) {
      console.error("SAVE ATTENDANCE ERROR:", error)
      setMessage("Failed to save attendance.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Attendance Register</h1>
          <p className="text-sm text-gray-600">
            Mark class attendance by date.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/dashboard/classes/${classId}`}
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Back to Class
          </Link>

          <Link
            href="/dashboard/classes"
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            All Classes
          </Link>
        </div>
      </div>

      <section className="rounded border p-4 space-y-3">
        <h2 className="text-lg font-semibold">Class Information</h2>

        {classInfo ? (
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded border p-3 text-sm">
              <span className="font-semibold">Class:</span> {classInfo.level}
            </div>
            <div className="rounded border p-3 text-sm">
              <span className="font-semibold">Stream:</span> {classInfo.stream}
            </div>
            <div className="rounded border p-3 text-sm">
              <span className="font-semibold">Role:</span> {classInfo.roleType}
            </div>
          </div>
        ) : (
          <div className="rounded border p-3 text-sm text-gray-500">
            {loading ? "Loading class..." : "Class information not found."}
          </div>
        )}
      </section>

      <section className="rounded border p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div className="rounded border p-3 text-sm">
            <span className="font-semibold">Present:</span> {presentCount}
          </div>

          <div className="rounded border p-3 text-sm">
            <span className="font-semibold">Absent:</span> {absentCount}
          </div>

          <div className="rounded border p-3 text-sm">
            <span className="font-semibold">Mode:</span>{" "}
            {mode === "ALL_PRESENT"
              ? "All Present"
              : mode === "ALL_PRESENT_EXCEPT"
              ? "All Present Except"
              : mode === "ALL_ABSENT"
              ? "All Absent"
              : "All Absent Except"}
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-4">
          <button
            onClick={() => setAttendanceMode("ALL_PRESENT")}
            className={`rounded border px-4 py-2 text-sm ${
              mode === "ALL_PRESENT" ? "bg-black text-white" : "hover:bg-gray-50"
            }`}
          >
            All Present
          </button>

          <button
            onClick={() => setAttendanceMode("ALL_PRESENT_EXCEPT")}
            className={`rounded border px-4 py-2 text-sm ${
              mode === "ALL_PRESENT_EXCEPT"
                ? "bg-black text-white"
                : "hover:bg-gray-50"
            }`}
          >
            All Present Except
          </button>

          <button
            onClick={() => setAttendanceMode("ALL_ABSENT")}
            className={`rounded border px-4 py-2 text-sm ${
              mode === "ALL_ABSENT" ? "bg-black text-white" : "hover:bg-gray-50"
            }`}
          >
            All Absent
          </button>

          <button
            onClick={() => setAttendanceMode("ALL_ABSENT_EXCEPT")}
            className={`rounded border px-4 py-2 text-sm ${
              mode === "ALL_ABSENT_EXCEPT"
                ? "bg-black text-white"
                : "hover:bg-gray-50"
            }`}
          >
            All Absent Except
          </button>
        </div>

        <div className="rounded border bg-gray-50 px-4 py-3 text-sm">
          <span className="font-semibold">Selection:</span> {selectionLabel()}
        </div>

        {message && (
          <div className="rounded border bg-gray-50 px-4 py-3 text-sm">
            {message}
          </div>
        )}
      </section>

      <section className="rounded border p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Students</h2>
          <div className="flex gap-2">
            <button
              onClick={loadAttendance}
              className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
            >
              {loading ? "Loading..." : "Reload"}
            </button>

            <button
              onClick={saveAttendance}
              disabled={saving}
              className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>

        <div className="overflow-auto rounded border">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left text-sm">S/N</th>
                <th className="border p-2 text-left text-sm">Admission No.</th>
                <th className="border p-2 text-left text-sm">Full Name</th>
                <th className="border p-2 text-left text-sm">Parent Name</th>
                <th className="border p-2 text-left text-sm">Parent Phone</th>
                <th className="border p-2 text-left text-sm">Status</th>
                <th className="border p-2 text-left text-sm">Select</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="border p-4 text-center text-sm text-gray-500">
                    {loading ? "Loading students..." : "No students found."}
                  </td>
                </tr>
              ) : (
                students.map((student, index) => {
                  const isAbsent = isStudentAbsent(student.id)
                  const isSelectable =
                    mode === "ALL_PRESENT_EXCEPT" || mode === "ALL_ABSENT_EXCEPT"

                  return (
                    <tr
                      key={student.id}
                      className={isAbsent ? "bg-red-50" : "bg-white"}
                    >
                      <td className="border p-2 text-sm">{index + 1}</td>
                      <td className="border p-2 text-sm">{student.admissionNumber}</td>
                      <td className="border p-2 text-sm">{student.fullName}</td>
                      <td className="border p-2 text-sm">{student.parentName || "-"}</td>
                      <td className="border p-2 text-sm">{student.parentPhone || "-"}</td>
                      <td className="border p-2 text-sm">
                        {isAbsent ? "Absent" : "Present"}
                      </td>
                      <td className="border p-2 text-sm">
                        {isSelectable ? (
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(student.id)}
                              onChange={() => toggleSelected(student.id)}
                            />
                            <span>
                              {mode === "ALL_PRESENT_EXCEPT"
                                ? "Mark absent"
                                : "Mark present"}
                            </span>
                          </label>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}