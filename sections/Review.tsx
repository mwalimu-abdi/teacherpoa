"use client";

import { Star } from "lucide-react";

const reviews = [
  {
    name: "Mr. Kamau",
    role: "Primary School Teacher",
    text: "Teacher Poa has made my work much easier. I can prepare professional documents and manage class work faster than before.",
  },
  {
    name: "Ms. Amina",
    role: "Secondary School Teacher",
    text: "The system is simple to use and saves me a lot of time every term. It has really improved how I organize my work.",
  },
  {
    name: "School Admin",
    role: "School Representative",
    text: "We see great potential in Teacher Poa for both teachers and schools. The workflow is clean, clear and practical.",
  },
];

export default function Review() {
  return (
    <section
      id="review"
      className="bg-[#f7f4ee] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-center gap-4 sm:mb-12">
          <div className="h-px w-14 bg-[#d8d1c5] sm:w-28" />
          <h2 className="text-center text-2xl font-bold text-[#234d74] sm:text-4xl">
            What People Say
          </h2>
          <div className="h-px w-14 bg-[#d8d1c5] sm:w-28" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-[18px] border border-[#ece6db] bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)]"
            >
              <div className="mb-4 flex items-center gap-1 text-[#e89a23]">
                {[...Array(5)].map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className="h-4 w-4 fill-[#e89a23] text-[#e89a23]"
                  />
                ))}
              </div>

              <p className="text-sm leading-7 text-[#4d5561] sm:text-base">
                “{review.text}”
              </p>

              <div className="mt-6">
                <h3 className="text-base font-bold text-[#2b5d88]">
                  {review.name}
                </h3>
                <p className="mt-1 text-sm text-[#7a8088]">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}