"use client";

import { Check, School, FileText, Layers3 } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    icon: Layers3,
    name: "Unlimited Term Plan",
    price: "KSh 120",
    period: "per term",
    description:
      "Best for teachers who want unlimited access for the whole term.",
    features: [
      "Unlimited documents for the term",
      "Class management tools",
      "Access to affiliate programme",
      "Simple teacher dashboard",
    ],
    buttonText: "Get Started",
    buttonHref: "/register",
    featured: true,
  },
  {
    icon: FileText,
    name: "Per Scheme Plan",
    price: "KSh 30",
    period: "per scheme",
    description:
      "Perfect for teachers who want to pay only when generating a scheme.",
    features: [
      "One scheme of work",
      "Free lesson plan for the term",
      "Free record of work for the term",
      "Fast and affordable option",
    ],
    buttonText: "Choose Plan",
    buttonHref: "/register",
    featured: false,
  },
  {
    icon: School,
    name: "School System",
    price: "KSh 700",
    period: "starting price",
    description:
      "For schools that want a separate school system and direct support.",
    features: [
      "School onboarding request",
      "Contact collection and follow-up",
      "Discussion for school setup",
      "Separate school solution",
    ],
    buttonText: "Request Setup",
    buttonHref: "/register",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="bg-[#f7f4ee] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-center gap-4 sm:mb-12">
          <div className="h-px w-14 bg-[#d8d1c5] sm:w-28" />
          <h2 className="text-center text-2xl font-bold text-[#234d74] sm:text-4xl">
            Pricing
          </h2>
          <div className="h-px w-14 bg-[#d8d1c5] sm:w-28" />
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm leading-7 text-[#5a6470] sm:text-base">
            Affordable plans designed for individual teachers and schools.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`rounded-[22px] border bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] sm:p-7 ${
                  plan.featured
                    ? "border-[#2b5d88] ring-2 ring-[#2b5d88]/10"
                    : "border-[#ece6db]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff4df] text-[#e89a23]">
                    <Icon className="h-6 w-6 stroke-[2]" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-[#2b5d88]">
                      {plan.name}
                    </h3>
                    {plan.featured && (
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#e89a23]">
                        Most Popular
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-extrabold text-[#1f2937] sm:text-4xl">
                      {plan.price}
                    </span>
                    <span className="pb-1 text-sm text-[#6b7280]">
                      {plan.period}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#5a6470] sm:text-base">
                    {plan.description}
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  {plan.features.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8f3ff] text-[#2b5d88]">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                      <p className="text-sm leading-6 text-[#4d5561]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.buttonHref}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition ${
                    plan.featured
                      ? "bg-[#0B67B2] text-white hover:bg-[#095895]"
                      : "border border-[#d7dce2] text-[#2b5d88] hover:bg-[#f8fafc]"
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}