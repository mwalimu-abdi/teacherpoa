import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
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

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-2">
        Welcome, {session.teacher.name}
      </h1>

      <p className="text-gray-600 mb-8">
        {session.teacher.school}
      </p>

      <div className="grid md:grid-cols-2 gap-4">

        <Link
          href="/dashboard/generate"
          className="border rounded p-5 block hover:bg-gray-50"
        >
          <h2 className="font-semibold text-lg mb-2">
            Generate Documents
          </h2>
          <p>
            Create Scheme of Work, Lesson Plan and Record of Work.
          </p>
        </Link>

        <Link
          href="/dashboard/documents"
          className="border rounded p-5 block hover:bg-gray-50"
        >
          <h2 className="font-semibold text-lg mb-2">
            My Documents
          </h2>
          <p>
            See all generated documents and download them anytime.
          </p>
        </Link>

        <Link
          href="/dashboard/classes"
          className="border rounded p-5 block hover:bg-gray-50"
        >
          <h2 className="font-semibold text-lg mb-2">
            My Classes
          </h2>
          <p>
            Create classes, register students and manage marks.
          </p>
        </Link>

        <Link
          href="/dashboard/timetable"
          className="border rounded p-5 block hover:bg-gray-50"
        >
          <h2 className="font-semibold text-lg mb-2">
            My Timetable
          </h2>
          <p>
            Create and manage your personal timetable.
          </p>
        </Link>

      </div>

      {/* Admin Access */}

      <div className="mt-10 border-t pt-6">

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