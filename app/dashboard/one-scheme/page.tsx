import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function OneDocumentPage() {
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
            Generate One Scheme of Work
          </h2>
          <p>
            Generate one scheme of work using your KES 30 one-document plan.
          </p>
        </Link>
      </div>

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