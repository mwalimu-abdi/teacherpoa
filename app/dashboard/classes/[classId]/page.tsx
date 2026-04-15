"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

type StudentItem = {
  id: number
  classId: number
  admissionNumber: string
  fullName: string
  gender: string | null
  parentName: string | null
  parentPhone: string | null
  createdAt: string
}

type ClassInfo = {
  id: number
  level: string
  stream: string
  roleType: string
  subject: string | null
}

const genders = ["Male", "Female"]

export default function ClassStudentsPage({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const [classId, setClassId] = useState("")
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null)
  const [students, setStudents] = useState<StudentItem[]>([])

  const [admissionNumber, setAdmissionNumber] = useState("")
  const [fullName, setFullName] = useState("")
  const [gender, setGender] = useState("Male")
  const [parentName, setParentName] = useState("")
  const [parentPhone, setParentPhone] = useState("")

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

  async function loadStudents() {
    if (!classId) return

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(`/api/dashboard/classes/${classId}/students`)
      const contentType = res.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        const text = await res.text()
        console.error("NON JSON STUDENTS RESPONSE:", text)
        setMessage("Students route not found or returned invalid response.")
        setStudents([])
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Failed to load students.")
        setStudents([])
        return
      }

      setClassInfo(data.classInfo || null)
      setStudents(data.students || [])
    } catch (error) {
      console.error("LOAD STUDENTS ERROR:", error)
      setMessage("Failed to load students.")
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [classId])

  async function addStudent() {
    if (!classId) return

    setSaving(true)
    setMessage("")

    try {
      const res = await fetch(`/api/dashboard/classes/${classId}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admissionNumber,
          fullName,
          gender,
          parentName,
          parentPhone,
        }),
      })

      const contentType = res.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        const text = await res.text()
        console.error("NON JSON CREATE STUDENT RESPONSE:", text)
        setMessage("Student route returned invalid response.")
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Failed to add student.")
        return
      }

      setAdmissionNumber("")
      setFullName("")
      setGender("Male")
      setParentName("")
      setParentPhone("")
      setMessage("Student added successfully.")
      await loadStudents()
    } catch (error) {
      console.error("ADD STUDENT ERROR:", error)
      setMessage("Failed to add student.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Class Students</h1>
          <p className="text-sm text-gray-600">
            Add and manage students in this class.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/classes/${classId}/attendance`}
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Attendance
          </Link>

          <Link
            href="/dashboard/classes"
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Back to Classes
          </Link>
        </div>
      </div>

      <section className="rounded border p-4 space-y-2">
        <h2 className="text-lg font-semibold">Class Information</h2>

        {classInfo ? (
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded border p-3 text-sm">
              <span className="font-semibold">Class:</span> {classInfo.level}
            </div>
            <div className="rounded border p-3 text-sm">
              <span className="font-semibold">Stream:</span> {classInfo.stream}
            </div>
            <div className="rounded border p-3 text-sm">
              <span className="font-semibold">Role:</span> {classInfo.roleType}
            </div>
            <div className="rounded border p-3 text-sm">
              <span className="font-semibold">Subject:</span> {classInfo.subject || "-"}
            </div>
          </div>
        ) : (
          <div className="rounded border p-3 text-sm text-gray-500">
            {loading ? "Loading class..." : "Class information not found."}
          </div>
        )}
      </section>

      <section className="rounded border p-4 space-y-4">
        <h2 className="text-lg font-semibold">Add Student</h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="block text-sm font-medium mb-1">Admission No.</label>
            <input
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="ADM001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Student full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              {genders.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Parent Name</label>
            <input
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Parent/Guardian"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Parent Phone</label>
            <input
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="07..."
            />
          </div>
        </div>

        <div>
          <button
            onClick={addStudent}
            disabled={saving}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add Student"}
          </button>
        </div>

        {message && (
          <div className="rounded border bg-gray-50 px-4 py-3 text-sm">
            {message}
          </div>
        )}
      </section>

      <section className="rounded border p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Students List</h2>
          <button
            onClick={loadStudents}
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            {loading ? "Loading..." : "Reload"}
          </button>
        </div>

        <div className="overflow-auto rounded border">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left text-sm">S/N</th>
                <th className="border p-2 text-left text-sm">Admission No.</th>
                <th className="border p-2 text-left text-sm">Full Name</th>
                <th className="border p-2 text-left text-sm">Gender</th>
                <th className="border p-2 text-left text-sm">Parent Name</th>
                <th className="border p-2 text-left text-sm">Parent Phone</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border p-4 text-center text-sm text-gray-500">
                    {loading ? "Loading students..." : "No students found."}
                  </td>
                </tr>
              ) : (
                students.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border p-2 text-sm">{index + 1}</td>
                    <td className="border p-2 text-sm">{item.admissionNumber}</td>
                    <td className="border p-2 text-sm">{item.fullName}</td>
                    <td className="border p-2 text-sm">{item.gender || "-"}</td>
                    <td className="border p-2 text-sm">{item.parentName || "-"}</td>
                    <td className="border p-2 text-sm">{item.parentPhone || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}