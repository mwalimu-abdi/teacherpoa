"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface CTAProps {
  onOpenRegister?: () => void
}

export default function CTA({ onOpenRegister }: CTAProps) {
  return (
    <section className="relative overflow-hidden bg-black py-28 lg:bg-white">
      {/* Mobile Glow Effects */}
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-blue-600/15 blur-[140px] lg:hidden" />

      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-emerald-500/15 blur-[140px] lg:hidden" />

      {/* Desktop Decoration */}
      <div className="absolute left-0 top-0 hidden h-[500px] w-[500px] rounded-full bg-blue-50 blur-[120px] lg:block" />

      <div className="absolute bottom-0 right-0 hidden h-[500px] w-[500px] rounded-full bg-emerald-50 blur-[120px] lg:block" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur lg:border-blue-100 lg:bg-blue-50 lg:text-blue-700">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Join Kenya's Fastest Growing Teacher Community
        </div>

        {/* Heading */}
        <h2 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:text-slate-900">
          Ready To Save
          <span className="block bg-gradient-to-r from-[#60A5FA] to-[#34D399] bg-clip-text text-transparent">
            Hours Every Week?
          </span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-neutral-300 sm:text-xl lg:text-slate-600">
          Join thousands of teachers already using TeacherPoa to create
          professional CBC teaching documents in minutes instead of hours.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenRegister?.()}
            className="group inline-flex items-center rounded-xl bg-[#2563EB] px-8 py-4 font-semibold text-white shadow-[0_10px_40px_rgba(37,99,235,0.35)] transition-all hover:bg-[#1D4ED8]"
          >
            Get Started Free

            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>

          <a
            href="#features"
            className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition-all hover:bg-white/20 lg:border-slate-300 lg:bg-white lg:text-slate-700 lg:hover:bg-slate-50"
          >
            Explore Features
          </a>
        </div>

        {/* Trust Text */}
        <p className="mt-8 text-sm text-neutral-400 lg:text-slate-500">
          No installation required • Access anywhere • Professional CBC documents
        </p>
      </div>
    </section>
  )
}