"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.message || "Login failed.")
        setLoading(false)
        return
      }

      router.push("/admin/dashboard")
    } catch (error) {
      console.error(error)
      setMessage("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full border px-4 py-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2">Password</label>
          <input
            type="password"
            className="w-full border px-4 py-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="w-full bg-black text-white py-3 rounded"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-red-600">{message}</p>
      )}
    </main>
  )
}