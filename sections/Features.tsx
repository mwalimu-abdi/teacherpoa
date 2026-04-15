"use client";

import {
  BookOpenCheck,
  ClipboardList,
  School,
  Users,
} from "lucide-react";

const features = [
  {
    icon: BookOpenCheck,
    title: "Generate Documents",
    description: "Create schemes of work, lesson plans, records of work, and other teacher documents quickly.",
  },
  {
    icon: ClipboardList,
    title: "Track Progress",
    description: "Keep clear teaching records and monitor learner performance with less paperwork.",
  },
  {
    icon: School,
    title: "School Solutions",
    description: "Schools can register and access a complete digital system with setup and support.",
  },
  {
    icon: Users,
    title: "Referral Rewards",
    description: "Invite other teachers and earn from successful referrals. Coming soon.",
  },
];

export default function Features() {
  return (
    <section
      id="services"
      className="border-y border-[#e6dfd3] bg-white"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className={`flex items-start gap-4 px-5 py-6 sm:px-8 sm:py-8 ${
                index !== features.length - 1
                  ? "border-b md:border-b-0 xl:border-r"
                  : ""
              }`}
              style={{ borderColor: "#e6dfd3" }}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#f7efe3] text-[#1f4f7a] sm:h-14 sm:w-14">
                <Icon className="h-6 w-6 stroke-[2] sm:h-7 sm:w-7" />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#1f4f7a] sm:text-lg">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-gray-600 sm:text-[15px]">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}