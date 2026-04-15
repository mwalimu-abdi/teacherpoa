"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[520px] overflow-hidden sm:min-h-[620px] lg:min-h-[680px]">
      <Image
        src="/images/hero/mwalimu-hero.png"
        alt="Teacher Poa Hero"
        fill
        priority
        className="object-cover object-[68%_center] sm:object-center"
      />

      <div className="absolute inset-0 bg-black/45 sm:bg-black/35" />

      <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-center px-4 py-16 sm:min-h-[620px] sm:px-6 sm:py-20 lg:min-h-[680px] lg:px-8">
        <div className="max-w-[92%] sm:max-w-xl lg:max-w-2xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Teach Smarter. Plan Faster. Achieve More.
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-white/95 sm:mt-5 sm:max-w-xl sm:text-base sm:leading-7 lg:text-lg">
            TeacherPoa helps teachers create professional documents, manage school work with ease, and save valuable time every term.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center rounded-md bg-[#0B67B2] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#095895] sm:w-auto sm:px-7 sm:py-3"
            >
              Get Started
            </Link>

            <a
              href="#demo"
              className="inline-flex w-full items-center justify-center rounded-md border border-white/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto sm:px-7 sm:py-3"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}