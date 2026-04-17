import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function OneDocumentDashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("mh_session")?.value

  if (!token) {
    redirect("/login")
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { teacher: true },
  })

  if (!session || session.expiresAt < new Date()) {
    redirect("/login")
  }

  const activeOneDocumentPlan = await prisma.subscription.findFirst({
    where: {
      teacherId: session.teacher.id,
      planType: "ONE_DOCUMENT",
      status: "active",
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  if (
    !activeOneDocumentPlan ||
    (activeOneDocumentPlan.documentsAllowed !== null &&
      activeOneDocumentPlan.documentsUsed >=
        activeOneDocumentPlan.documentsAllowed)
  ) {
    redirect("/dashboard/choose-plan")
  }

  const documentsAllowed = activeOneDocumentPlan.documentsAllowed ?? 1
  const documentsUsed = activeOneDocumentPlan.documentsUsed
  const remaining = Math.max(documentsAllowed - documentsUsed, 0)

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">
        Welcome, {session.teacher.name}
      </h1>

      <p className="text-gray-600 mb-2">{session.teacher.school}</p>

      <div className="mb-8">
        <div className="inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
          Active Plan: KES 30 One Document
        </div>
      </div>

      <div className="grid md:grid-cols-1 gap-4">
        <Link
          href="/dashboard/generate"
          className="border rounded p-5 block hover:bg-gray-50"
        >
          <h2 className="font-semibold text-lg mb-2">
            Generate One Scheme of Work
          </h2>
          <p>
            Use your current one-document payment to generate one scheme of
            work.
          </p>
        </Link>
      </div>

      <div className="mt-8 border rounded p-4 bg-orange-50 text-orange-800">
        <p className="font-medium mb-1">Document Balance</p>
        <p>
          Used: {documentsUsed} / {documentsAllowed}
        </p>
        <p>Remaining: {remaining}</p>
      </div>

      <div className="mt-10 border-t pt-6 flex flex-wrap gap-4">
        <Link
          href="/dashboard/choose-plan"
          className="text-sm text-blue-600 underline"
        >
          Back to Plans
        </Link>

        <Link
          href="/admin/login"
          className="text-sm text-blue-600 underline"
        >
          Admin Panel
        </Link>
      </div>
    </main>
  )
}