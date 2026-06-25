"use client";

import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";

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
];

interface RegisterDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export default function RegisterDrawer({
  open,
  onClose,
  onOpenLogin,
}: RegisterDrawerProps) {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isClassTeacher, setIsClassTeacher] = useState("no");
  const [className, setClassName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");

  function addSubject(subject: string) {
    if (!subject) return;
    if (subjects.includes(subject)) return;
    setSubjects((prev) => [...prev, subject]);
    setSelectedSubject("");
  }

  function removeSubject(subject: string) {
    setSubjects((prev) => prev.filter((item) => item !== subject));
  }

  function isStrongPassword(value: string) {
    return (
      value.length >= 8 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value) &&
      /[^A-Za-z0-9]/.test(value)
    );
  }

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);
    setMessage("");
    setMessageType("");

    if (!name.trim() || !school.trim() || !email.trim() || !password || !confirmPassword) {
      setMessage("Please fill in all required fields.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (subjects.length === 0) {
      setMessage("Please add at least one subject.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (isClassTeacher === "yes" && !className.trim()) {
      setMessage("Please enter your class name.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!isStrongPassword(password)) {
      setMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      });

      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("NON-JSON RESPONSE:", text);
        setMessage("Server returned invalid response. Check server logs.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (res.ok) {
        setMessage("Account created successfully. Please sign in.");
        setMessageType("success");

        setTimeout(() => {
          onOpenLogin();
        }, 1500);

        return;
      }

      setMessage(data.message || "Something went wrong.");
      setMessageType("error");
    } catch (error) {
      console.error("REGISTER DRAWER ERROR:", error);
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setMessage("");
    setMessageType("");
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
        className={`fixed right-0 top-0 z-[100] h-screen w-full max-w-[700px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
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

        {/* CONTENT — scrollable */}
        <div className="relative z-20 h-full overflow-y-auto px-8 py-16">
          <div
            className={`mx-auto w-full max-w-[520px] transform transition-all duration-700 ${
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

              <h2 className="text-3xl font-bold text-white">Create Account</h2>
              <p className="mt-2 text-sm text-slate-200">
                Register and start using TeacherPoa.
              </p>

              {/* NOTICE */}
              <div className="mt-5 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs leading-5 text-blue-100">
                <strong className="text-white">Important:</strong> Your name and school
                name are used in document generation — make sure they are correct.
              </div>

              <div className="mt-6 space-y-5">

                {/* TEACHER NAME */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Teacher&apos;s Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-white/30 bg-white/5 px-4 py-3 text-white placeholder:text-slate-300 outline-none backdrop-blur-md focus:border-blue-400"
                  />
                </div>

                {/* SCHOOL NAME */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    School Name
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Enter school name"
                    className="w-full rounded-2xl border border-white/30 bg-white/5 px-4 py-3 text-white placeholder:text-slate-300 outline-none backdrop-blur-md focus:border-blue-400"
                  />
                </div>

                {/* EMAIL */}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full rounded-2xl border border-white/30 bg-white/5 px-4 py-3 text-white placeholder:text-slate-300 outline-none backdrop-blur-md focus:border-blue-400"
                  />
                </div>

                {/* SUBJECTS */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Subjects
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-white outline-none backdrop-blur-md focus:border-blue-400 [&>option]:bg-slate-800 [&>option]:text-white"
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
                      className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      Add
                    </button>
                  </div>

                  {/* SUBJECT TAGS */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {subjects.length > 0 ? (
                      subjects.map((subject) => (
                        <div
                          key={subject}
                          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white"
                        >
                          <span>{subject}</span>
                          <button
                            type="button"
                            onClick={() => removeSubject(subject)}
                            className="rounded-full p-0.5 transition hover:bg-white/20"
                            aria-label={`Remove ${subject}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No subject selected yet</p>
                    )}
                  </div>
                </div>

                {/* CLASS TEACHER */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Are you a class teacher?
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsClassTeacher("yes")}
                      className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                        isClassTeacher === "yes"
                          ? "bg-cyan-500 text-white"
                          : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsClassTeacher("no")}
                      className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                        isClassTeacher === "no"
                          ? "bg-cyan-500 text-white"
                          : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* CLASS NAME (conditional) */}
                {isClassTeacher === "yes" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      Class Name
                    </label>
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="e.g. Grade 5 North"
                      className="w-full rounded-2xl border border-white/30 bg-white/5 px-4 py-3 text-white placeholder:text-slate-300 outline-none backdrop-blur-md focus:border-blue-400"
                    />
                  </div>
                )}

                {/* PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full rounded-2xl border border-white/30 bg-white/5 px-4 py-3 pr-12 text-white placeholder:text-slate-300 outline-none backdrop-blur-md focus:border-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-slate-300">
                    Min. 8 characters with uppercase, lowercase, number, and special character.
                  </p>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full rounded-2xl border border-white/30 bg-white/5 px-4 py-3 pr-12 text-white placeholder:text-slate-300 outline-none backdrop-blur-md focus:border-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
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

                {/* MESSAGE */}
                {message && (
                  <p
                    className={`text-center text-sm font-medium ${
                      messageType === "error" ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {message}
                  </p>
                )}

                {/* SUBMIT */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-semibold text-white transition hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                {/* BACK TO LOGIN */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      onOpenLogin();
                    }, 150);
                  }}
                  className="w-full rounded-2xl border border-white/20 py-3 text-sm text-white transition hover:bg-white/10"
                >
                  Already have an account? Sign In
                </button>

              </div>
            </div>

            {/* BOTTOM PADDING */}
            <div className="h-8" />
          </div>
        </div>
      </aside>
    </>
  );
}