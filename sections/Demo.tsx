"use client";

import { Monitor, FileCog, Printer } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Monitor,
    title: "Register & Login",
    text: "Create your account and access your teacher dashboard in minutes.",
  },
  {
    number: "2",
    icon: FileCog,
    title: "Create & Manage",
    text: "Generate teaching documents and manage your work from one place.",
  },
  {
    number: "3",
    icon: Printer,
    title: "Download & Print",
    text: "Download professional PDFs instantly, ready for printing and use.",
  },
];

export default function Demo() {
  return (
    <section
      id="demo"
      className="bg-[#f7f4ee] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-center gap-4 sm:mb-12">
          <div className="h-px w-14 bg-[#d8d1c5] sm:w-28" />
          <h2 className="text-center text-2xl font-bold text-[#234d74] sm:text-4xl">
            How It Works
          </h2>
          <div className="h-px w-14 bg-[#d8d1c5] sm:w-28" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-[18px] border border-[#ece6db] bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] sm:p-7"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e89a23] text-lg font-bold text-white shadow-md">
                    {step.number}
                  </div>

                  <h3 className="text-lg font-bold text-[#2b5d88] sm:text-[1.5rem]">
                    {step.title}
                  </h3>
                </div>

                <div className="flex justify-center py-8 sm:py-10">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#f5f7fa] text-[#3f6285] sm:h-32 sm:w-32">
                    <Icon className="h-14 w-14 stroke-[1.8] sm:h-20 sm:w-20" />
                  </div>
                </div>

                <p className="text-sm leading-7 text-[#4d5561] sm:text-base">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}