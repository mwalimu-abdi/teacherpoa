"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function handleSendCode(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const res = await fetch("/api/forgot-password-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to send code.")
        return
      }

      setMessage(data.message || "Reset code sent.")
      setStep(2)
    } catch (error) {
      console.error("SEND CODE ERROR:", error)
      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const res = await fetch("/api/forgot-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code,
          newPassword,
          confirmPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to reset password.")
        return
      }

      setMessage(data.message || "Password reset successful.")
      setCode("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error)
      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ee] px-4 py-6">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className="relative h-36 bg-gradient-to-br from-orange-400 to-orange-300">
          <div className="pointer-events-none absolute bottom-0 left-0 h-16 w-full rounded-t-[40px] bg-white" />
        </div>

        <div className="relative z-10 px-6 pb-8 pt-4">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            Forgot Password
          </h2>
          <p className="mb-6 text-center text-sm text-gray-500">
            Receive a 6-digit code and reset your password
          </p>

          {message && (
            <p className="mb-4 text-center text-sm font-medium text-green-600">
              {message}
            </p>
          )}

          {error && (
            <p className="mb-4 text-center text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm text-gray-600"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="example@gmail.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="block w-full rounded-xl bg-orange-400 py-3 font-semibold text-white transition hover:bg-orange-500 active:scale-[0.99] disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send 6-digit code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="mt-1 w-full rounded-xl border bg-gray-100 px-4 py-3 text-gray-500"
                />
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="mb-1 block text-sm text-gray-600"
                >
                  6-digit code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="mt-1 w-full rounded-xl border bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter code"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-1 block text-sm text-gray-600"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1 block text-sm text-gray-600"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="block w-full rounded-xl bg-orange-400 py-3 font-semibold text-white transition hover:bg-orange-500 active:scale-[0.99] disabled:opacity-70"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1)
                  setCode("")
                  setNewPassword("")
                  setConfirmPassword("")
                  setMessage("")
                  setError("")
                }}
                className="block w-full rounded-xl border border-orange-300 py-3 font-semibold text-orange-500 transition hover:bg-orange-50"
              >
                Request another code
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-sm">
            Back to{" "}
            <Link href="/login" className="font-semibold text-orange-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}