"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, X } from "lucide-react"

const subjectOptions = [
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
  "Agriculture",
  "Business Studies",
  "Computer Studies",
  "Home Science",
  "Science & Technology",
  "Social Studies",
  "Creative Arts",
]

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [school, setSchool] = useState("")
  const [email, setEmail] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [subjects, setSubjects] = useState<string[]>([])
  const [isClassTeacher, setIsClassTeacher] = useState("no")
  const [className, setClassName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"error" | "success" | "">("")

  function addSubject(subject: string) {
    if (!subject) return
    if (subjects.includes(subject)) return
    setSubjects((prev) => [...prev, subject])
    setSelectedSubject("")
  }

  function removeSubject(subject: string) {
    setSubjects((prev) => prev.filter((item) => item !== subject))
  }

  function isStrongPassword(value: string) {
    return (
      value.length >= 8 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value) &&
      /[^A-Za-z0-9]/.test(value)
    )
  }

  async function handleSubmit() {
    if (loading) return

    setLoading(true)
    setMessage("")
    setMessageType("")

    if (!name.trim() || !school.trim() || !email.trim() || !password || !confirmPassword) {
      setMessage("Please fill in all required fields.")
      setMessageType("error")
      setLoading(false)
      return
    }

    if (subjects.length === 0) {
      setMessage("Please add at least one subject.")
      setMessageType("error")
      setLoading(false)
      return
    }

    if (isClassTeacher === "yes" && !className.trim()) {
      setMessage("Please enter class name.")
      setMessageType("error")
      setLoading(false)
      return
    }

    if (!isStrongPassword(password)) {
      setMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      )
      setMessageType("error")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.")
      setMessageType("error")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          school: school.trim(),
          email: email.trim().toLowerCase(),
          subjects,
          isClassTeacher: isClassTeacher === "yes",
          className: isClassTeacher === "yes" ? className.trim() : "",
          password,
          confirmPassword,
        }),
      })

      const contentType = res.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        const text = await res.text()
        console.error("NON JSON RESPONSE:", text)
        setMessage("Server returned invalid response. Check server logs.")
        setMessageType("error")
        setLoading(false)
        return
      }

      const data = await res.json()

      if (res.ok) {
        window.location.href = "/login?registered=success"
        return
      }

      setMessage(data.message || "Something went wrong.")
      setMessageType("error")
    } catch (error) {
      console.error("REGISTER PAGE ERROR:", error)
      setMessage("Something went wrong. Check terminal/server logs.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ee] px-4 py-8">
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.08)]">
        <div className="relative h-36 bg-gradient-to-br from-[#ffb08a] via-[#ffa26f] to-[#ff8a65]">
          <div className="absolute bottom-0 left-0 h-16 w-full rounded-t-[42px] bg-white" />
        </div>

        <div className="px-6 pb-8 pt-3">
          <h1 className="text-2xl font-bold text-gray-800">Sign Up</h1>
          <p className="mt-1 text-sm text-gray-500">
            Register and start using TeacherPoa.
          </p>

          <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs leading-5 text-gray-700">
            <strong>Important:</strong> Teacher&apos;s name and school name are used
            in document generation, so make sure they are correct.
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm text-gray-700">
                Teacher&apos;s Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="school" className="mb-1.5 block text-sm text-gray-700">
                School Name
              </label>
              <input
                id="school"
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white"
                placeholder="Enter school name"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white"
                placeholder="example@gmail.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="mb-1.5 block text-sm text-gray-700">
                Subjects
              </label>

              <div className="flex gap-2">
                <select
                  id="subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white"
                >
                  <option value="">Select subject</option>
                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => addSubject(selectedSubject)}
                  className="rounded-xl bg-orange-100 px-4 py-3 font-medium text-orange-700 transition hover:bg-orange-200"
                >
                  Add
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <div
                      key={subject}
                      className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-medium text-orange-800"
                    >
                      <span>{subject}</span>
                      <button
                        type="button"
                        onClick={() => removeSubject(subject)}
                        className="rounded-full p-0.5 hover:bg-orange-200"
                        aria-label={`Remove ${subject}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No subject selected yet</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700">
                Are you a class teacher?
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsClassTeacher("yes")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isClassTeacher === "yes"
                      ? "bg-orange-400 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Yes
                </button>

                <button
                  type="button"
                  onClick={() => setIsClassTeacher("no")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isClassTeacher === "no"
                      ? "bg-orange-400 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {isClassTeacher === "yes" && (
              <div>
                <label htmlFor="className" className="mb-1.5 block text-sm text-gray-700">
                  Class Name
                </label>
                <input
                  id="className"
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white"
                  placeholder="Enter class name"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 outline-none transition focus:border-orange-400 focus:bg-white"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Must be at least 8 characters and include uppercase, lowercase,
                number, and special character.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 outline-none transition focus:border-orange-400 focus:bg-white"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label={
                    showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-[#ff9b6b] py-3 font-semibold text-white transition hover:bg-[#ff8a56] disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          {message && (
            <p
              className={`mt-4 text-center text-sm font-medium ${
                messageType === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-orange-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}