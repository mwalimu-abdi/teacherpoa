"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

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

type ClassItem = {
  id: number
  classId: number
  level: string
  stream: string
  roleType: string
  subject: string | null
  createdAt: string
}

export default function MyClassesPage() {
  const [level, setLevel] = useState("Grade 1")
  const [stream, setStream] = useState("")
  const [roleType, setRoleType] = useState("Class Teacher")
  const [subject, setSubject] = useState("Mathematics")

  const [classes, setClasses] = useState<ClassItem[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  async function loadClasses() {
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/dashboard/classes")
      const contentType = res.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        const text = await res.text()
        console.error("NON JSON CLASSES RESPONSE:", text)
        setMessage("Classes route not found or returned invalid response.")
        setClasses([])
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Failed to load classes.")
        setClasses([])
        return
      }

      setClasses(data.classes || [])
    } catch (error) {
      console.error("LOAD CLASSES ERROR:", error)
      setMessage("Failed to load classes.")
      setClasses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClasses()
  }, [])

  async function createClass() {
    setSaving(true)
    setMessage("")

    try {
      const res = await fetch("/api/dashboard/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level,
          stream,
          roleType,
          subject: roleType === "Subject Teacher" ? subject : "",
        }),
      })

      const contentType = res.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        const text = await res.text()
        console.error("NON JSON CREATE CLASS RESPONSE:", text)
        setMessage("Create class route returned invalid response.")
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Failed to create class.")
        return
      }

      setMessage("Class created successfully.")
      setStream("")
      await loadClasses()
    } catch (error) {
      console.error("CREATE CLASS ERROR:", error)
      setMessage("Failed to create class.")
    } finally {
      setSaving(false)
    }
  }

  function formatDate(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "-"
    return date.toLocaleDateString()
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Classes</h1>
        <p className="text-sm text-gray-600">
          Create and manage your classes.
        </p>
      </div>

      <section className="rounded border p-4 space-y-4">
        <h2 className="text-lg font-semibold">Create Class</h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
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
            <label className="block text-sm font-medium mb-1">Stream</label>
            <input
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              placeholder="Green, East, West..."
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Create As</label>
            <select
              value={roleType}
              onChange={(e) => setRoleType(e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              <option value="Class Teacher">Class Teacher</option>
              <option value="Subject Teacher">Subject Teacher</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={roleType !== "Subject Teacher"}
              className="w-full rounded border px-3 py-2 disabled:bg-gray-100"
            >
              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <button
            onClick={createClass}
            disabled={saving}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Class"}
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
          <h2 className="text-lg font-semibold">My Created / Assigned Classes</h2>
          <button
            onClick={loadClasses}
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
                <th className="border p-2 text-left text-sm">Class</th>
                <th className="border p-2 text-left text-sm">Stream</th>
                <th className="border p-2 text-left text-sm">Role</th>
                <th className="border p-2 text-left text-sm">Subject</th>
                <th className="border p-2 text-left text-sm">Date Created</th>
                <th className="border p-2 text-left text-sm">Open</th>
              </tr>
            </thead>

            <tbody>
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="border p-4 text-center text-sm text-gray-500">
                    {loading ? "Loading classes..." : "No classes found."}
                  </td>
                </tr>
              ) : (
                classes.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border p-2 text-sm">{index + 1}</td>
                    <td className="border p-2 text-sm">{item.level}</td>
                    <td className="border p-2 text-sm">{item.stream}</td>
                    <td className="border p-2 text-sm">{item.roleType}</td>
                    <td className="border p-2 text-sm">{item.subject || "-"}</td>
                    <td className="border p-2 text-sm">{formatDate(item.createdAt)}</td>
                    <td className="border p-2 text-sm">
                      <Link
                        href={`/dashboard/classes/${item.classId}`}
                        className="inline-block rounded border px-3 py-1 hover:bg-gray-50"
                      >
                        Open
                      </Link>
                    </td>
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