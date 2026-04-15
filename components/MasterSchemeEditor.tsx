"use client"

import { useState } from "react"

type Entry = {
  id?: number
  week: number | string
  lessonNumber: number | string
  strand: string
  subStrand: string
  lessonLearningOutcomes: string
  learningExperiences: string
  keyInquiryQuestions: string
  learningResources: string
  assessmentMethods: string
  reflection: string | null
}

type Scheme = {
  id: number
  term: string
  level: string
  subject: string
  entries: Entry[]
}

export default function MasterSchemeEditor({ scheme }: { scheme: Scheme }) {
  const [entries, setEntries] = useState<Entry[]>(
    scheme.entries.length > 0
      ? scheme.entries
      : [
          {
            week: "",
            lessonNumber: "",
            strand: "",
            subStrand: "",
            lessonLearningOutcomes: "",
            learningExperiences: "",
            keyInquiryQuestions: "",
            learningResources: "",
            assessmentMethods: "",
            reflection: "",
          },
        ]
  )

  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  function updateEntry(index: number, field: keyof Entry, value: string) {
    const updated = [...entries]
    updated[index] = { ...updated[index], [field]: value }
    setEntries(updated)
  }

  function addRow() {
    setEntries([
      ...entries,
      {
        week: "",
        lessonNumber: "",
        strand: "",
        subStrand: "",
        lessonLearningOutcomes: "",
        learningExperiences: "",
        keyInquiryQuestions: "",
        learningResources: "",
        assessmentMethods: "",
        reflection: "",
      },
    ])
  }

  function removeRow(index: number) {
    if (entries.length === 1) return
    setEntries(entries.filter((_, i) => i !== index))
  }

  async function saveRows() {
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(`/api/admin/master-schemes/${scheme.id}/entries`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entries }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.message || "Failed to save rows.")
        setLoading(false)
        return
      }

      setMessage("Master scheme saved successfully.")
      setEditing(false)
    } catch (error) {
      console.error(error)
      setMessage("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 overflow-x-auto">
      <div className="flex gap-3">
        <button
          onClick={() => setEditing(true)}
          className="border px-4 py-2 rounded"
        >
          Edit
        </button>

        <button
          onClick={saveRows}
          disabled={!editing || loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <button
          onClick={addRow}
          disabled={!editing}
          className="border px-4 py-2 rounded disabled:opacity-60"
        >
          Add Row
        </button>
      </div>

      {message && <p className="text-sm text-blue-700">{message}</p>}

      <table className="min-w-full border border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">WK</th>
            <th className="border p-2">LSN</th>
            <th className="border p-2">STRAND</th>
            <th className="border p-2">SUB-STRAND</th>
            <th className="border p-2">LESSON LEARNING OUTCOMES</th>
            <th className="border p-2">LEARNING EXPERIENCES</th>
            <th className="border p-2">KEY INQUIRY QUESTIONS</th>
            <th className="border p-2">LEARNING RESOURCES</th>
            <th className="border p-2">ASSESSMENT METHODS</th>
            <th className="border p-2">REFLECTION</th>
            {editing && <th className="border p-2">ACTION</th>}
          </tr>
        </thead>

        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td className="border p-2">
                <input
                  disabled={!editing}
                  value={entry.week}
                  onChange={(e) => updateEntry(index, "week", e.target.value)}
                  className="w-16 border px-2 py-1"
                />
              </td>

              <td className="border p-2">
                <input
                  disabled={!editing}
                  value={entry.lessonNumber}
                  onChange={(e) =>
                    updateEntry(index, "lessonNumber", e.target.value)
                  }
                  className="w-16 border px-2 py-1"
                />
              </td>

              <td className="border p-2">
                <textarea
                  disabled={!editing}
                  value={entry.strand}
                  onChange={(e) => updateEntry(index, "strand", e.target.value)}
                  className="w-40 border px-2 py-1"
                  rows={2}
                />
              </td>

              <td className="border p-2">
                <textarea
                  disabled={!editing}
                  value={entry.subStrand}
                  onChange={(e) =>
                    updateEntry(index, "subStrand", e.target.value)
                  }
                  className="w-40 border px-2 py-1"
                  rows={2}
                />
              </td>

              <td className="border p-2">
                <textarea
                  disabled={!editing}
                  value={entry.lessonLearningOutcomes}
                  onChange={(e) =>
                    updateEntry(index, "lessonLearningOutcomes", e.target.value)
                  }
                  className="w-64 border px-2 py-1"
                  rows={5}
                />
              </td>

              <td className="border p-2">
                <textarea
                  disabled={!editing}
                  value={entry.learningExperiences}
                  onChange={(e) =>
                    updateEntry(index, "learningExperiences", e.target.value)
                  }
                  className="w-64 border px-2 py-1"
                  rows={5}
                />
              </td>

              <td className="border p-2">
                <textarea
                  disabled={!editing}
                  value={entry.keyInquiryQuestions}
                  onChange={(e) =>
                    updateEntry(index, "keyInquiryQuestions", e.target.value)
                  }
                  className="w-48 border px-2 py-1"
                  rows={3}
                />
              </td>

              <td className="border p-2">
                <textarea
                  disabled={!editing}
                  value={entry.learningResources}
                  onChange={(e) =>
                    updateEntry(index, "learningResources", e.target.value)
                  }
                  className="w-48 border px-2 py-1"
                  rows={4}
                />
              </td>

              <td className="border p-2">
                <textarea
                  disabled={!editing}
                  value={entry.assessmentMethods}
                  onChange={(e) =>
                    updateEntry(index, "assessmentMethods", e.target.value)
                  }
                  className="w-48 border px-2 py-1"
                  rows={4}
                />
              </td>

              <td className="border p-2">
                <textarea
                  disabled={!editing}
                  value={entry.reflection || ""}
                  onChange={(e) =>
                    updateEntry(index, "reflection", e.target.value)
                  }
                  className="w-40 border px-2 py-1"
                  rows={3}
                />
              </td>

              {editing && (
                <td className="border p-2">
                  <button
                    onClick={() => removeRow(index)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}