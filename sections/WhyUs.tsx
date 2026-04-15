"use client";

import { Lightbulb, Clock3, Coins, Headphones } from "lucide-react";

const reasons = [
  {
    icon: Lightbulb,
    title: "Easy to Use",
    text: "A simple and clear platform built for teachers and schools.",
  },
  {
    icon: Clock3,
    title: "Time Saving",
    text: "Create documents and manage school work much faster.",
  },
  {
    icon: Coins,
    title: "Affordable",
    text: "Friendly pricing designed for both individual teachers and schools.",
  },
  {
    icon: Headphones,
    title: "Reliable Support",
    text: "Get direct assistance whenever you need help.",
  },
];

export default function WhyUs() {
  return (
    <section
      id="why-us"
      className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-center gap-4 sm:mb-12">
          <div className="h-px w-14 bg-[#d8d1c5] sm:w-28" />
          <h2 className="text-center text-2xl font-bold text-[#234d74] sm:text-4xl">
            Why Choose Teacher Poa?
          </h2>
          <div className="h-px w-14 bg-[#d8d1c5] sm:w-28" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <div key={reason.title} className="flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff4df] text-[#e89a23]">
                    <Icon className="h-6 w-6 stroke-[2]" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-[#2b5d88]">
                      {reason.title}
                    </h3>
                    <div className="mt-1 h-[2px] w-16 bg-[#dca24c]" />
                  </div>
                </div>

                <p className="mt-3 pl-[60px] text-sm leading-6 text-[#4d5561]">
                  {reason.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}