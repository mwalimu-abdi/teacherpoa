"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  X,
  ArrowRight,
} from "lucide-react";

interface LoginDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  onOpenForgot: () => void;
}

export default function LoginDrawer({
  open,
  onClose,
  onOpenRegister,
  onOpenForgot,
}: LoginDrawerProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = "/dashboard/choose-plan";
        return;
      }
      alert(data.message || "Invalid email or password");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    onClose();
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-[90] bg-transparent transition-all duration-500 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-[100] h-screen w-full max-w-[640px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-slide-2.png')" }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-blue-950/20 to-slate-950/35" />

        {/* CLOSE */}
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 z-30 rounded-full bg-white/15 p-2 text-slate-100 backdrop-blur-md transition hover:bg-white/25"
        >
          <X className="h-5 w-5" />
        </button>

        {/* CONTENT */}
        <div className="relative z-20 flex h-full items-center justify-center px-8 py-16">
          <div
            className={`w-full max-w-[520px] transform transition-all duration-700 ${
              open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {/* TEACHERPOA TITLE */}
            <div className="mb-8 text-center">
              <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.35)]">
                Teacher<span className="text-cyan-300">Poa</span>
              </h1>
              <p className="mt-3 text-blue-100">Smart Teaching Resources Platform</p>
            </div>

            {/* GLASS CARD */}
            <div className="rounded-[32px] border border-white/20 bg-white/10 p-8 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]">

              <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
              <p className="mt-2 text-sm text-slate-200">
                Sign in to continue to your account
              </p>

              {/* EMAIL */}
              <div className="mt-8">
                <label className="mb-2 block text-sm font-medium text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@example.com"
                  className="w-full rounded-2xl border border-white/30 bg-white/5 px-4 py-3 text-white placeholder:text-slate-300 outline-none backdrop-blur-md focus:border-blue-400"
                />
              </div>

              {/* PASSWORD */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-2xl border border-white/30 bg-white/5 px-4 py-3 pr-12 text-white placeholder:text-slate-300 outline-none backdrop-blur-md focus:border-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* FORGOT PASSWORD */}
              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={onOpenForgot}
                  className="text-sm text-blue-300 transition hover:text-white"
                >
                  Forgot Password?
                </button>
              </div>

              {/* SIGN IN */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-semibold text-white transition hover:from-blue-700 hover:to-cyan-600"
              >
                {loading ? (
                  "Signing In..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* CREATE ACCOUNT */}
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-200">Don't have an account?</p>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Create Free Account
                </button>
              </div>

            </div>
          </div>
        </div>
      </aside>
    </>
  );
}