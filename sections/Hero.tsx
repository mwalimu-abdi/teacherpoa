"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

type Stage = "intro" | "merge" | "flip" | "wake" | "teacher";

const flipFrames = [
  "/hero/schemes-open-1.png",
  "/hero/schemes-open-2.png",
  "/hero/schemes-open-3.png",
  "/hero/schemes-open-4.png",
  "/hero/schemes-open-5.png",
];

const files = [
  {
    id: "schemes",
    src: "/hero/schemes-file.png",
    alt: "TeacherPoa schemes of work file",
  },
  {
    id: "lesson",
    src: "/hero/lesson-plans-file.png",
    alt: "TeacherPoa lesson plans file",
  },
  {
    id: "records",
    src: "/hero/records-file.png",
    alt: "TeacherPoa records of work file",
  },
  {
    id: "revision",
    src: "/hero/revision-questions-file.png",
    alt: "TeacherPoa revision questions file",
  },
];

export default function Hero() {
  const [stage, setStage] = useState<Stage>("intro");
  const [visibleCount, setVisibleCount] = useState(1);
  const [flipStep, setFlipStep] = useState(0);

  const totalFlipSteps = flipFrames.length * 3;
  const currentFlipFrame = flipFrames[flipStep % flipFrames.length];

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (stage === "intro") {
      if (visibleCount < 4) {
        timer = setTimeout(() => {
          setVisibleCount((prev) => prev + 1);
        }, 650);
      } else {
        timer = setTimeout(() => {
          setStage("merge");
        }, 1400);
      }
    }

    if (stage === "merge") {
      timer = setTimeout(() => {
        setStage("flip");
        setFlipStep(0);
      }, 1200);
    }

    if (stage === "flip") {
      if (flipStep < totalFlipSteps - 1) {
        timer = setTimeout(() => {
          setFlipStep((prev) => prev + 1);
        }, 220);
      } else {
        timer = setTimeout(() => {
          setStage("wake");
        }, 250);
      }
    }

    if (stage === "wake") {
      timer = setTimeout(() => {
        setStage("teacher");
      }, 1400);
    }

    if (stage === "teacher") {
      timer = setTimeout(() => {
        setStage("intro");
        setVisibleCount(1);
        setFlipStep(0);
      }, 2200);
    }

    return () => clearTimeout(timer);
  }, [stage, visibleCount, flipStep, totalFlipSteps]);

  const introLayout = useMemo(
    () => [
      { left: "6%", top: "10%", rotate: -10, z: 10 },
      { left: "53%", top: "12%", rotate: 8, z: 9 },
      { left: "12%", top: "50%", rotate: -6, z: 8 },
      { left: "58%", top: "50%", rotate: 10, z: 7 },
    ],
    []
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            Trusted teaching documents for modern educators
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Create professional teaching documents with ease
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Generate schemes of work, lesson plans, records of work, and revision
            questions faster with TeacherPoa.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Get Started
            </Link>

            <a
              href="#demo"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Demo
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Schemes</p>
              <p className="mt-1 text-sm text-slate-600">Well organized</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Lesson Plans</p>
              <p className="mt-1 text-sm text-slate-600">Ready faster</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Records</p>
              <p className="mt-1 text-sm text-slate-600">Easy to manage</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Revision</p>
              <p className="mt-1 text-sm text-slate-600">Quick preparation</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="relative mx-auto flex h-[320px] w-full max-w-[620px] items-center justify-center overflow-hidden rounded-[30px] bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4 shadow-xl sm:h-[380px] lg:h-[460px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_32%)]" />

            <div className="absolute inset-0 z-0 opacity-60">
              <div className="absolute left-[8%] top-[10%] h-28 w-28 rounded-full bg-blue-100 blur-3xl" />
              <div className="absolute bottom-[8%] right-[10%] h-32 w-32 rounded-full bg-orange-100 blur-3xl" />
            </div>

            {(stage === "intro" || stage === "merge") && (
              <div className="relative z-10 h-full w-full">
                {files.map((file, index) => {
                  const isVisible = index < visibleCount;
                  const layout = introLayout[index];
                  const isMain = file.id === "schemes";

                  return (
                    <motion.div
                      key={file.id}
                      initial={{
                        opacity: 0,
                        x: index % 2 === 0 ? -60 : 60,
                        y: 40,
                        scale: 0.85,
                        rotate: layout.rotate,
                      }}
                      animate={
                        stage === "intro"
                          ? {
                              opacity: isVisible ? 1 : 0,
                              x: isVisible ? 0 : index % 2 === 0 ? -60 : 60,
                              y: isVisible ? [0, -6, 0] : 40,
                              scale: isVisible ? 1 : 0.85,
                              rotate: layout.rotate,
                              transition: {
                                opacity: { duration: 0.55, ease: "easeOut" },
                                x: { duration: 0.55, ease: "easeOut" },
                                scale: { duration: 0.55, ease: "easeOut" },
                                y: {
                                  duration: 2.8,
                                  repeat: Infinity,
                                  repeatType: "mirror",
                                  ease: "easeInOut",
                                },
                              },
                            }
                          : {
                              opacity: isMain ? 1 : 0,
                              left: "50%",
                              top: "50%",
                              x: "-50%",
                              y: "-50%",
                              scale: isMain ? 1.15 : 0.55,
                              rotate: isMain ? -6 : 0,
                              transition: {
                                duration: 0.9,
                                ease: [0.22, 1, 0.36, 1],
                              },
                            }
                      }
                      className="absolute"
                      style={{
                        left: stage === "intro" ? layout.left : undefined,
                        top: stage === "intro" ? layout.top : undefined,
                        zIndex: layout.z,
                        width: "36%",
                        maxWidth: 190,
                      }}
                    >
                      <div className="relative aspect-[4/5] w-full drop-shadow-[0_18px_30px_rgba(15,23,42,0.16)]">
                        <Image
                          src={file.src}
                          alt={file.alt}
                          fill
                          priority
                          className="object-contain"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {stage === "flip" && (
              <div className="relative z-10 flex h-full w-full items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: -40, rotate: -8, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    scale: 1,
                    transition: { duration: 0.55, ease: "easeOut" },
                  }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={currentFlipFrame}
                    alt="TeacherPoa schemes file opening and flipping pages"
                    fill
                    priority
                    className="object-contain"
                  />
                </motion.div>
              </div>
            )}

            {stage === "wake" && (
              <div className="relative z-10 flex h-full w-full items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 30, rotate: -6 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.8, 1.06, 1, 0.96],
                    y: [30, -12, 0, 0],
                    rotate: [-6, -2, 0, 0],
                    transition: {
                      duration: 1.35,
                      times: [0, 0.25, 0.65, 1],
                      ease: "easeInOut",
                    },
                  }}
                  className="relative aspect-[4/5] w-[42%] max-w-[230px] drop-shadow-[0_22px_34px_rgba(15,23,42,0.18)]"
                >
                  <Image
                    src="/hero/schemes-file.png"
                    alt="TeacherPoa schemes of work file waking up"
                    fill
                    priority
                    className="object-contain"
                  />
                </motion.div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {stage === "teacher" && (
                <motion.div
                  key="teacher"
                  initial={{ opacity: 0, scale: 0.96, y: 24 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -6, 0],
                    transition: {
                      opacity: { duration: 0.35 },
                      scale: { duration: 0.35 },
                      y: {
                        duration: 2.2,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      },
                    },
                  }}
                  exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.25 } }}
                  className="relative z-10 h-full w-full"
                >
                  <Image
                    src="/hero/happy-teacher.png"
                    alt="Happy teacher showing thumbs up"
                    fill
                    priority
                    className="object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}