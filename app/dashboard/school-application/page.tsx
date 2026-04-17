"use client"

import { useState } from "react"
import Link from "next/link"

type FormState = {
  applicantName: string
  schoolName: string
  phone: string
  email: string
  schoolType: string
  county: string
  studentCount: string
  teacherCount: string
  message: string
}

const initialState: FormState = {
  applicantName: "",
  schoolName: "",
  phone: "",
  email: "",
  schoolType: "",
  county: "",
  studentCount: "",
  teacherCount: "",
  message: "",
}

export default function SchoolApplicationPage() {
  const [form, setForm] = useState<FormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  function updateField(name: keyof FormState, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      const response = await fetch("/api/school-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to submit application.")
        setSubmitting(false)
        return
      }

      setSuccessMessage(
        "School application submitted successfully. You can now wait to be contacted."
      )
      setForm(initialState)
    } catch (error) {
      console.error(error)
      setErrorMessage("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-500 px-6 py-8 text-white sm:px-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-100">
              TeacherPoa School Plan
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              School Application Form
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-sky-50 sm:text-base">
              Fill in the details below. After submission, the application is
              saved and you will contact the school manually. No payment is
              required at this stage.
            </p>
          </div>

          <div className="px-6 py-6 sm:px-8">
            {successMessage ? (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="applicantName"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Applicant Name *
                  </label>
                  <input
                    id="applicantName"
                    type="text"
                    value={form.applicantName}
                    onChange={(e) =>
                      updateField("applicantName", e.target.value)
                    }
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="schoolName"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    School Name *
                  </label>
                  <input
                    id="schoolName"
                    type="text"
                    value={form.schoolName}
                    onChange={(e) => updateField("schoolName", e.target.value)}
                    placeholder="Enter school name"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Contact Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="e.g. 0712345678"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="e.g. school@email.com"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="schoolType"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    School Type
                  </label>
                  <select
                    id="schoolType"
                    value={form.schoolType}
                    onChange={(e) => updateField("schoolType", e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="">Select school type</option>
                    <option value="Pre-Primary">Pre-Primary</option>
                    <option value="Primary">Primary</option>
                    <option value="Junior School">Junior School</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Mixed School">Mixed School</option>
                    <option value="Private School">Private School</option>
                    <option value="College">College</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="county"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    County
                  </label>
                  <input
                    id="county"
                    type="text"
                    value={form.county}
                    onChange={(e) => updateField("county", e.target.value)}
                    placeholder="e.g. Nairobi"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="studentCount"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Number of Students
                  </label>
                  <input
                    id="studentCount"
                    type="number"
                    min="0"
                    value={form.studentCount}
                    onChange={(e) => updateField("studentCount", e.target.value)}
                    placeholder="e.g. 450"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="teacherCount"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Number of Teachers
                  </label>
                  <input
                    id="teacherCount"
                    type="number"
                    min="0"
                    value={form.teacherCount}
                    onChange={(e) => updateField("teacherCount", e.target.value)}
                    placeholder="e.g. 25"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Additional Message
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Tell us what the school needs..."
                  rows={6}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>

                <Link
                  href="/dashboard/choose-plan"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back to Plans
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}