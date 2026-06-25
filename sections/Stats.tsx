"use client"

import { motion } from "framer-motion"

const stats = [
  {
    number: "50,000+",
    label: "Documents Generated",
  },
  {
    number: "3,200+",
    label: "Teachers Using TeacherPoa",
  },
  {
    number: "120,000+",
    label: "Hours Saved",
  },
  {
    number: "24/7",
    label: "Access Anywhere",
  },
]

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-black py-24">
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Trusted By Teachers Across Kenya
          </span>

          <h2 className="mt-5 text-4xl font-bold text-white sm:text-5xl">
            Real Results.
            <span className="block bg-gradient-to-r from-[#60A5FA] to-[#34D399] bg-clip-text text-transparent">
              Real Time Saved.
            </span>
          </h2>

          <p className="mt-4 text-lg text-neutral-300">
            Thousands of teachers rely on TeacherPoa every day to generate
            professional CBC teaching documents faster and more efficiently.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -8,
              }}
              className="group rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl transition-all duration-300 hover:border-blue-400/40 hover:shadow-[0_0_40px_rgba(37,99,235,0.25)]"
            >
              <h3 className="bg-gradient-to-r from-[#60A5FA] to-[#34D399] bg-clip-text text-5xl font-bold text-transparent">
                {item.number}
              </h3>

              <p className="mt-3 text-sm font-medium text-neutral-300">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}