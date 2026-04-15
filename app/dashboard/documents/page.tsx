"use client"

import { useEffect, useMemo, useState } from "react"

type DocumentItem = {
  id: number
  year: number
  term: string
  documentType: string
  classLevel: string | null
  subject: string
  createdAt: string
}

const terms = ["Term 1", "Term 2", "Term 3"]

const documentTypes = [
  "Scheme of Work",
  "Lesson Plan",
  "Record of Work",
  "Learners Progress Record",
]

export default function MyDocumentsPage() {
  const currentYear = new Date().getFullYear()

  const yearOptions = useMemo(() => {
    return Array.from({ length: 6 }, (_, index) => currentYear - index)
  }, [currentYear])

  const [year, setYear] = useState(String(currentYear))
  const [term, setTerm] = useState("Term 1")
  const [documentType, setDocumentType] = useState("Scheme of Work")
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function loadDocuments() {
    setLoading(true)
    setMessage("")

    try {
      const params = new URLSearchParams({
        year,
        term,
        documentType,
      })

      const res = await fetch(`/api/dashboard/documents?${params.toString()}`)
      const contentType = res.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        const text = await res.text()
        console.error("NON JSON DOCUMENTS RESPONSE:", text)
        setMessage("Documents route not found or returned invalid response.")
        setDocuments([])
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Failed to load documents.")
        setDocuments([])
        return
      }

      setDocuments(data.documents || [])
    } catch (error) {
      console.error("LOAD DOCUMENTS ERROR:", error)
      setMessage("Failed to load documents.")
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [year, term, documentType])

  function formatDate(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "-"
    return date.toLocaleDateString()
  }

  async function downloadDocument(id: number) {
    try {
      const res = await fetch(`/api/dashboard/documents/${id}/download`)
      const contentType = res.headers.get("content-type") || ""

      if (!res.ok) {
        if (contentType.includes("application/json")) {
          const data = await res.json()
          setMessage(data.error || "Failed to download document.")
        } else {
          const text = await res.text()
          console.error("NON JSON DOWNLOAD RESPONSE:", text)
          setMessage("Download route not found or returned invalid response.")
        }
        return
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `document-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("DOWNLOAD DOCUMENT ERROR:", error)
      setMessage("Failed to download document.")
    }
  }

  async function deleteDocument(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    )

    if (!confirmed) return

    try {
      const res = await fetch(`/api/dashboard/documents/${id}`, {
        method: "DELETE",
      })

      const contentType = res.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        const text = await res.text()
        console.error("NON JSON DELETE RESPONSE:", text)
        setMessage("Delete route not found or returned invalid response.")
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Failed to delete document.")
        return
      }

      setDocuments((prev) => prev.filter((item) => item.id !== id))
      setMessage("Document deleted successfully.")
    } catch (error) {
      console.error("DELETE DOCUMENT ERROR:", error)
      setMessage("Failed to delete document.")
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Documents</h1>
        <p className="text-sm text-gray-600">
          View, download, and delete your saved teaching documents.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            {yearOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

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
          <label className="block text-sm font-medium mb-1">Document Type</label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            {documentTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={loadDocuments}
            className="w-full rounded bg-black px-4 py-2 text-white"
          >
            {loading ? "Loading..." : "Reload"}
          </button>
        </div>
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
              <th className="border p-2 text-left text-sm">S/N</th>
              <th className="border p-2 text-left text-sm">Class</th>
              <th className="border p-2 text-left text-sm">Subject</th>
              <th className="border p-2 text-left text-sm">Date Created</th>
              <th className="border p-2 text-left text-sm">PDF</th>
              <th className="border p-2 text-left text-sm">Download</th>
              <th className="border p-2 text-left text-sm">Delete</th>
            </tr>
          </thead>

          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={7} className="border p-4 text-center text-sm text-gray-500">
                  {loading ? "Loading documents..." : "No documents found."}
                </td>
              </tr>
            ) : (
              documents.map((item, index) => (
                <tr key={item.id}>
                  <td className="border p-2 text-sm">{index + 1}</td>
                  <td className="border p-2 text-sm">{item.classLevel || "-"}</td>
                  <td className="border p-2 text-sm">{item.subject}</td>
                  <td className="border p-2 text-sm">{formatDate(item.createdAt)}</td>
                  <td className="border p-2 text-sm">PDF</td>
                  <td className="border p-2 text-sm">
                    <button
                      onClick={() => downloadDocument(item.id)}
                      className="rounded border px-3 py-1 hover:bg-gray-50"
                    >
                      Download
                    </button>
                  </td>
                  <td className="border p-2 text-sm">
                    <button
                      onClick={() => deleteDocument(item.id)}
                      className="rounded border px-3 py-1 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}