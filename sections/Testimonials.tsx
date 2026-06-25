"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Ahmed Ali",
    role: "Mathematics Teacher",
    image: "/testimonials/teacher-1.jpg",
    review:
      "TeacherPoa has reduced my lesson preparation time dramatically. I can now focus more on teaching and supporting my learners instead of spending hours creating documents.",
  },
  {
    name: "Mary Wanjiku",
    role: "Junior School Teacher",
    image: "/testimonials/teacher-2.jpg",
    review:
      "The schemes of work and lesson plans are professional, well-organized and save me several hours every week. It has become an essential teaching tool.",
  },
  {
    name: "David Otieno",
    role: "Science Teacher",
    image: "/testimonials/teacher-3.jpg",
    review:
      "Everything I need is available in one platform. From lesson plans to assessments, TeacherPoa helps me stay organized and productive.",
  },
  {
    name: "Fatuma Hassan",
    role: "CBC Educator",
    image: "/testimonials/teacher-4.jpg",
    review:
      "TeacherPoa has transformed how I prepare teaching documents. The quality is excellent and the platform is incredibly easy to use.",
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-gradient-to-b from-black via-slate-950 to-black py-24"
    >
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Testimonials
          </span>

          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Trusted By Teachers
            <span className="block bg-gradient-to-r from-[#60A5FA] to-[#34D399] bg-clip-text text-transparent">
              Across Kenya
            </span>
          </h2>

          <p className="mt-6 text-xl leading-8 text-neutral-200">
            Real experiences from teachers using TeacherPoa to create
            professional CBC teaching documents faster and smarter.
          </p>
        </div>
         </div>
{/* Featured Testimonial */}
<div className="mt-20">
  <AnimatePresence mode="wait">
    <motion.div
      key={active}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl"
    >
      {/* Glow Effects */}
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="relative z-10 grid items-center gap-12 p-8 md:grid-cols-[320px_1fr] md:p-16">
        
        {/* Teacher Photo */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#60A5FA] to-[#34D399] blur-2xl opacity-40" />

            <Image
              src={testimonials[active].image}
              alt={testimonials[active].name}
              width={260}
              height={260}
              className="relative h-52 w-52 rounded-full border-4 border-white/20 object-cover shadow-[0_30px_80px_rgba(37,99,235,0.35)] md:h-64 md:w-64"
            />
          </motion.div>
        </div>

        {/* Content */}
        <div className="text-center md:text-left">
          <div className="mb-6 text-7xl font-bold leading-none text-blue-500/20 md:text-8xl">
            "
          </div>

          <p className="text-xl font-medium italic leading-relaxed text-white md:text-3xl">
            {testimonials[active].review}
          </p>

          <div className="mt-8">
            <h3 className="bg-gradient-to-r from-[#60A5FA] to-[#34D399] bg-clip-text text-2xl font-bold text-transparent">
              {testimonials[active].name}
            </h3>

            <p className="mt-2 text-neutral-400">
              {testimonials[active].role}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  </AnimatePresence>

  {/* Teacher Selector */}
  <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
    {testimonials.map((teacher, index) => (
      <button
        key={teacher.name}
        onClick={() => setActive(index)}
        className={`group relative transition-all duration-300 ${
          active === index ? "scale-110" : "opacity-70 hover:opacity-100"
        }`}
      >
        <Image
          src={teacher.image}
          alt={teacher.name}
          width={64}
          height={64}
          className={`h-14 w-14 rounded-full border-2 object-cover transition-all duration-300 md:h-16 md:w-16 ${
            active === index
              ? "border-[#60A5FA]"
              : "border-white/20"
          }`}
        />

        {active === index && (
          <motion.div
            layoutId="activeTeacher"
            className="absolute inset-0 rounded-full border-2 border-[#34D399]"
          />
        )}
      </button>
    ))}
          </div>
      </div>
    </section>
  )
}