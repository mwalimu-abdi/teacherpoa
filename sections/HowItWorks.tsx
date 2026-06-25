"use client"

import { motion } from "framer-motion"
import {
  FileText,
  PencilLine,
  Sparkles,
  Download,
} from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Choose Document Type",
    description:
      "Select schemes of work, lesson plans, records of work, assessments, exams and more.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Enter Your Details",
    description:
      "Fill in your subject, grade, learning area and curriculum requirements.",
    icon: PencilLine,
  },
  {
    number: "03",
    title: "Generate Instantly",
    description:
      "TeacherPoa intelligently creates professional CBC-aligned documents in seconds.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Download & Use",
    description:
      "Export polished documents ready for classroom use immediately.",
    icon: Download,
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-gradient-to-b from-black via-slate-950 to-black py-24"
    >
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Simple Process
          </span>

          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Create Teaching Documents
            <span className="block bg-gradient-to-r from-[#60A5FA] to-[#34D399] bg-clip-text text-transparent">
              In Four Easy Steps
            </span>
          </h2>

          <p className="mt-6 text-xl leading-8 text-neutral-200">
            No complicated setup. Generate professional CBC teaching documents
            in minutes using a simple guided workflow.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              className="group relative h-full"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[60%] top-10 hidden h-[2px] w-[80%] bg-gradient-to-r from-blue-500/40 to-emerald-500/20 xl:block" />
              )}

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 transition-all duration-500 group-hover:opacity-100">
  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#34D399] p-[2px]">
    <div className="h-full w-full rounded-3xl bg-transparent" />
  </div>
</div>
<div className="absolute inset-[-2px] overflow-hidden rounded-[26px] opacity-0 transition-all duration-500 group-hover:opacity-100">
  {/* Bright Gradient Border */}
  <div className="absolute inset-0 rounded-[26px] bg-gradient-to-r from-[#2563EB] via-[#60A5FA] via-[#34D399] to-[#2563EB] p-[3px]">
    <div className="h-full w-full rounded-[22px] bg-transparent" />
  </div>

  {/* Moving Shine */}
  <div className="absolute -left-full top-0 h-full w-[60%] rotate-12 bg-gradient-to-r from-transparent via-white/90 to-transparent blur-md transition-all duration-1000 group-hover:left-[140%]" />
</div>
<div className="relative z-10 flex h-full flex-col rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:-translate-y-1">                {/* Number */}
                <div className="mb-5 text-sm font-bold tracking-[0.25em] text-blue-600">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-6 inline-flex w-fit rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#60A5FA] p-4 text-white shadow-lg">
                  <step.icon className="h-7 w-7" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold tracking-tight text-[#2563EB]">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-4 flex-1 text-base font-medium leading-8 text-slate-800">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}