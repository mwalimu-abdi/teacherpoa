"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ForgotPasswordDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export default function ForgotPasswordDrawer({
  open,
  onClose,
  onOpenLogin,
}: ForgotPasswordDrawerProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSendCode() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/forgot-password-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to send code.");
        return;
      }

      setMessage(data.message || "Reset code sent.");
      setStep(2);
    } catch (err) {
      console.error("SEND CODE ERROR:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/forgot-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to reset password.");
        return;
      }

      setMessage(data.message || "Password reset successful.");
      setCode("");
      setNewPassword("");
      setConfirmPassword("");

      // Auto-navigate back to login after short delay
      setTimeout(() => {
        handleClose();
        onOpenLogin();
      }, 2000);
    } catch (err) {
      console.error("RESET PASSWORD ERROR:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleRequestAnotherCode() {
    setStep(1);
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    setError("");
  }

  function handleClose() {
    onClose();
  }

  const inputClass =
    "w-full rounded-2xl border border-white/30 bg-white/5 px-4 py-3 text-white placeholder:text-slate-300 outline-none backdrop-blur-md focus:border-blue-400";

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
        <div className="relative z-20 flex h-full items-center justify-center overflow-y-auto px-8 py-16">
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

              {/* HEADER */}
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-white">Forgot Password</h2>
                <p className="mt-2 text-sm text-slate-200">
                  Receive a 6-digit code and reset your password
                </p>
              </div>

              {/* STEP INDICATOR */}
              <div className="mb-6 flex items-center justify-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${
                  step >= 1 ? "bg-cyan-500 text-white" : "border border-white/30 text-slate-300"
                }`}>
                  1
                </div>
                <div className={`h-px w-12 transition ${step === 2 ? "bg-cyan-500" : "bg-white/20"}`} />
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${
                  step === 2 ? "bg-cyan-500 text-white" : "border border-white/30 text-slate-300"
                }`}>
                  2
                </div>
              </div>

              {/* MESSAGES */}
              {message && (
                <p className="mb-4 text-center text-sm font-medium text-green-400">
                  {message}
                </p>
              )}
              {error && (
                <p className="mb-4 text-center text-sm font-medium text-red-400">
                  {error}
                </p>
              )}

              {/* ── STEP 1: SEND CODE ──────────────────────── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      Email Address
                    </label>
                    <input
                      type="email"
                      inputMode="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={loading}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-semibold text-white transition hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Send 6-digit Code"}
                  </button>

                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="w-full rounded-2xl border border-white/20 py-3 text-sm text-white transition hover:bg-white/10"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}

              {/* ── STEP 2: RESET PASSWORD ─────────────────── */}
              {step === 2 && (
                <div className="space-y-5">

                  {/* EMAIL (read-only) */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-slate-300 outline-none backdrop-blur-md cursor-default"
                    />
                  </div>

                  {/* 6-DIGIT CODE */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      6-digit Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter code"
                      className={inputClass}
                    />
                  </div>

                  {/* NEW PASSWORD */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className={inputClass}
                    />
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className={inputClass}
                    />
                  </div>

                  {/* RESET BUTTON */}
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-semibold text-white transition hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>

                  {/* REQUEST ANOTHER CODE */}
                  <button
                    type="button"
                    onClick={handleRequestAnotherCode}
                    className="w-full rounded-2xl border border-white/20 py-3 text-sm text-white transition hover:bg-white/10"
                  >
                    Request Another Code
                  </button>

                </div>
              )}

              {/* BACK TO SIGN IN (bottom link) */}
              <p className="mt-6 text-center text-sm text-slate-300">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="font-semibold text-cyan-300 transition hover:text-white"
                >
                  Sign In
                </button>
              </p>

            </div>

            {/* BOTTOM PADDING */}
            <div className="h-8" />
          </div>
        </div>
      </aside>
    </>
  );
}