"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

// ── Text content that cycles ────────────────────────────────────────────────
type HeroSlide = {
  eyebrow: string
  title: string
  highlight: string
  subtitle: string
}

const slides: HeroSlide[] = [
  {
    eyebrow: "AI built for the CBC curriculum",
    title: "Spend Less Time Preparing.",
    highlight: "Spend More Time Teaching.",
    subtitle:
      "Generate schemes of work, lesson plans, records of work, and assessments in minutes — fully aligned with the CBC curriculum.",
  },
  {
    eyebrow: "Your documents, beautifully organized",
    title: "Every Teaching Document,",
    highlight: "One Smart Platform.",
    subtitle:
      "Create, store, and download professional teaching documents from anywhere, on any device.",
  },
  {
    eyebrow: "Trusted by teachers across Kenya",
    title: "Join a Community",
    highlight: "Built for Educators.",
    subtitle:
      "Thousands of teachers save hours every week with TeacherPoa. Start today and experience smarter document creation.",
  },
  {
    eyebrow: "Professional results instantly",
    title: "Create Documents That",
    highlight: "Look Truly Professional.",
    subtitle:
      "Export polished, ready-to-use teaching documents in seconds and walk into class fully prepared.",
  },
]

// ── Letter-fall animation component ────────────────────────────────────────
function FallingLetters({
  text,
  className = "",
  baseDelay = 0,
}: {
  text: string
  className?: string
  baseDelay?: number
}) {
  // Split into words, animate letter by letter, preserve word spacing
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((char, ci) => {
            const globalIndex =
              text
                .split(" ")
                .slice(0, wi)
                .join(" ")
                .length +
              (wi > 0 ? 1 : 0) +
              ci
            return (
              <motion.span
                key={ci}
                className="inline-block"
                initial={{ opacity: 0, y: -60, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: 40, rotateX: 60 }}
                transition={{
                  duration: 0.55,
                  delay: baseDelay + globalIndex * 0.032,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char}
              </motion.span>
            )
          })}
          {/* word gap */}
          {wi < text.split(" ").length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  )
}

// ── Props ───────────────────────────────────────────────────────────────────
interface HeroProps {
  onOpenRegister?: () => void
}

// ── Component ───────────────────────────────────────────────────────────────
export default function Hero({ onOpenRegister }: HeroProps) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, 6500)
    return () => clearInterval(id)
  }, [])

  const slide = slides[active]

  return (
    <section
      id="home"
      className="relative isolate h-[92vh] min-h-[680px] overflow-hidden bg-black"
    >
      {/* ── Static background image with subtle Ken Burns ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.06 }}
        transition={{ duration: 14, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
      >
        <Image
          src="/hero-slide-1.png"
          alt="Teacher in a bright classroom"
          fill
          priority
          className="object-cover object-center"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/55 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">

          {/* Eyebrow pill */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`eyebrow-${active}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {slide.eyebrow}
            </motion.div>
          </AnimatePresence>

          {/* Main heading — letter fall */}
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            <AnimatePresence mode="wait">
              <motion.span
                key={`title-${active}`}
                className="block"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FallingLetters text={slide.title} baseDelay={0} />
              </motion.span>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.span
                key={`highlight-${active}`}
                className="mt-1 block"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FallingLetters
                  text={slide.highlight}
                  className="bg-gradient-to-r from-[#60A5FA] to-[#34D399] bg-clip-text text-transparent"
                  baseDelay={0.15}
                />
              </motion.span>
            </AnimatePresence>
          </h1>

          {/* Subtitle */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${active}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-200"
            >
              {slide.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              onClick={() => onOpenRegister?.()}
              className="group h-14 bg-[#2563EB] px-8 text-white shadow-[0_10px_40px_rgba(37,99,235,0.35)] transition-all duration-300 hover:scale-[1.03] hover:bg-[#1D4ED8]"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-14 border-white/40 bg-white/10 px-8 text-white backdrop-blur hover:bg-white/20 hover:text-white"
            >
              <Play className="mr-2 h-4 w-4 text-[#34D399]" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Slide progress indicators — minimal dots only */}
          <div className="mt-10 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === active
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}