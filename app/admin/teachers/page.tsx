import prisma from "@/lib/prisma"
import Link from "next/link"

type TeacherRow = {
  id: number
  name: string
  school: string
  email: string
  subjects: string
  isClassTeacher: boolean
  className: string | null
  createdAt: Date
}

export default async function AdminTeachersPage() {
  const teachers: TeacherRow[] = await prisma.teacher.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      school: true,
      email: true,
      subjects: true,
      isClassTeacher: true,
      className: true,
      createdAt: true,
    },
  })

  const totalTeachers = teachers.length
  const totalClassTeachers = teachers.filter((teacher: TeacherRow) => teacher.isClassTeacher).length
  const totalNormalTeachers = teachers.filter((teacher: TeacherRow) => !teacher.isClassTeacher).length

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="mt-2 text-gray-600">
            View all registered teachers in the system.
          </p>
        </div>

        <Link
          href="/admin/dashboard"
          className="w-fit rounded border px-4 py-2 hover:bg-gray-50"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded border bg-white p-5">
          <p className="mb-1 text-sm text-gray-500">Total Teachers</p>
          <h2 className="text-2xl font-bold">{totalTeachers}</h2>
        </div>

        <div className="rounded border bg-white p-5">
          <p className="mb-1 text-sm text-gray-500">Class Teachers</p>
          <h2 className="text-2xl font-bold">{totalClassTeachers}</h2>
        </div>

        <div className="rounded border bg-white p-5">
          <p className="mb-1 text-sm text-gray-500">Normal Teachers</p>
          <h2 className="text-2xl font-bold">{totalNormalTeachers}</h2>
        </div>
      </div>

      <div className="overflow-hidden rounded border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">School</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Class</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Subjects</th>
                <th className="px-4 py-3 text-left font-semibold">Registered On</th>
              </tr>
            </thead>

            <tbody>
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No teachers registered yet.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher: TeacherRow, index: number) => (
                  <tr key={teacher.id} className="border-t">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{teacher.name}</td>
                    <td className="px-4 py-3">{teacher.school}</td>
                    <td className="px-4 py-3">
                      {teacher.isClassTeacher ? (
                        <span className="inline-block rounded bg-green-100 px-2 py-1 text-sm text-green-700">
                          Class Teacher
                        </span>
                      ) : (
                        <span className="inline-block rounded bg-blue-100 px-2 py-1 text-sm text-blue-700">
                          Normal Teacher
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {teacher.isClassTeacher ? teacher.className || "-" : "-"}
                    </td>
                    <td className="px-4 py-3">{teacher.email}</td>
                    <td className="px-4 py-3">{teacher.subjects}</td>
                    <td className="px-4 py-3">
                      {new Date(teacher.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}