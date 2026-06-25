"use client"

import { motion } from "framer-motion"
import {
  Clock3,
  BadgeCheck,
  Smartphone,
} from "lucide-react"

const benefits = [
  {
    title: "Save Hours Every Week",
    description:
      "Generate schemes of work, lesson plans, records of work, assessments and exams in minutes instead of spending hours preparing them manually.",
    icon: Clock3,
  },
  {
    title: "Professional Quality Documents",
    description:
      "Create polished, consistent and CBC-aligned teaching documents that are ready for classroom use and administrative review.",
    icon: BadgeCheck,
  },
  {
    title: "Access Anywhere",
    description:
      "Use TeacherPoa on your phone, tablet or computer and access your teaching documents whenever and wherever you need them.",
    icon: Smartphone,
  },
]

export default function Benefits() {
  return (
    <section
      id="benefits"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-black to-slate-950 py-24"
    >
      {/* Background Effects */}
      <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Why Teachers Choose TeacherPoa
          </span>

          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            More Teaching.
            <span className="block bg-gradient-to-r from-[#60A5FA] to-[#34D399] bg-clip-text text-transparent">
              Less Paperwork.
            </span>
          </h2>

          <p className="mt-6 text-xl leading-8 text-neutral-200">
            TeacherPoa helps educators create professional CBC teaching
            documents faster, stay organized, and focus more on learners.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                bg-white
                p-8
                shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                transition-all
                duration-500
                hover:shadow-[0_0_100px_rgba(37,99,235,0.55)]
              "
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-[-3px] rounded-3xl bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#34D399] blur-2xl" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#60A5FA] p-4 text-white shadow-lg">
                  <benefit.icon className="h-7 w-7" />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-2xl font-bold tracking-tight text-[#2563EB]">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-base font-medium leading-8 text-slate-700">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl"
        >
          <p className="text-lg font-medium leading-8 text-white">
            Join thousands of teachers who are already creating professional
            teaching documents faster, saving valuable time, and improving
            classroom preparation with TeacherPoa.
          </p>
        </motion.div>
      </div>
    </section>
  )
}