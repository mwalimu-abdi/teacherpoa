"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"error" | "success" | "">("")

  async function handleLogin() {
    if (loading) return

    setLoading(true)
    setMessage("")
    setMessageType("")

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const contentType = res.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        setMessage("Server returned an invalid response.")
        setMessageType("error")
        return
      }

      const data = await res.json()

      if (res.ok) {
        setMessage("Login successful.")
        setMessageType("success")
        window.location.href = "/dashboard"
        return
      }

      setMessage(data.message || "Invalid email or password.")
      setMessageType("error")
    } catch (error) {
      console.error("LOGIN ERROR:", error)
      setMessage("Login failed. Please try again.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  function handlePasswordKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      handleLogin()
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ee] px-4 py-6">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg">
        {/* Top Design */}
        <div className="relative h-36 bg-gradient-to-br from-orange-400 to-orange-300">
          <div className="pointer-events-none absolute bottom-0 left-0 h-16 w-full rounded-t-[40px] bg-white" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 pb-8 pt-4">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            Sign In
          </h2>
          <p className="mb-6 text-center text-sm text-gray-500">
            Sign in to your account
          </p>

          <div className="space-y-4">
            {/* Email */}
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
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm text-gray-600"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handlePasswordKeyDown}
                  className="mt-1 w-full rounded-xl border bg-gray-50 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  style={{ touchAction: "manipulation" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="cursor-pointer text-sm text-orange-500">
                Forgot Password?
              </span>
            </div>

            {/* Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                style={{ touchAction: "manipulation" }}
                className="block w-full rounded-xl bg-orange-400 py-3 font-semibold text-white transition hover:bg-orange-500 active:scale-[0.99] disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
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

          {/* Register */}
          <p className="mt-5 text-center text-sm">
            Don’t have an account?{" "}
            <Link href="/register" className="font-semibold text-orange-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}