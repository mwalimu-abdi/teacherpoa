"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function ChoosePlanPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-6xl w-full">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Choose Your Plan
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Select how you want to use TeacherPoa
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* SCHOOL PLAN */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-md p-6 border hover:border-blue-500 transition"
          >
            <h2 className="text-xl font-semibold mb-2">🏫 School Plan</h2>
            <p className="text-gray-600 mb-4">
              For schools that need a full system setup including exams,
              attendance, and management tools.
            </p>

            <ul className="text-sm text-gray-500 mb-6 space-y-1">
              <li>• Custom school system</li>
              <li>• No upfront payment</li>
              <li>• We contact you directly</li>
            </ul>

            <button
              onClick={() => router.push("/dashboard/school-application")}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Apply Now
            </button>
          </motion.div>

          {/* TERMLY PLAN */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-md p-6 border-2 border-green-500"
          >
            <h2 className="text-xl font-semibold mb-2">
              📘 Termly Plan - KES 120
            </h2>
            <p className="text-gray-600 mb-4">
              Unlimited access to all teacher resources for one term.
            </p>

            <ul className="text-sm text-gray-500 mb-6 space-y-1">
              <li>• Unlimited schemes</li>
              <li>• Lesson plans</li>
              <li>• Records of work</li>
              <li>• Full dashboard access</li>
            </ul>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Continue
            </button>
          </motion.div>

          {/* ONE SCHEME PLAN */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-md p-6 border hover:border-orange-500 transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              📄 One Scheme - KES 30
            </h2>
            <p className="text-gray-600 mb-4">
              Pay once and generate a single scheme only.
            </p>

            <ul className="text-sm text-gray-500 mb-6 space-y-1">
              <li>• One scheme only</li>
              <li>• No full dashboard access</li>
              <li>• Quick and affordable</li>
            </ul>

            <button
              onClick={() => router.push("/dashboard/one-scheme")}
              className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
            >
              Pay & Continue
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  )
}