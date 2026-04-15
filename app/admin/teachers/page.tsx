import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function AdminTeachersPage() {
  const teachers = await prisma.teacher.findMany({
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
  const totalClassTeachers = teachers.filter((teacher) => teacher.isClassTeacher).length
  const totalNormalTeachers = teachers.filter((teacher) => !teacher.isClassTeacher).length

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-gray-600 mt-2">
            View all registered teachers in the system.
          </p>
        </div>

        <Link
          href="/admin/dashboard"
          className="border rounded px-4 py-2 hover:bg-gray-50 w-fit"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="border rounded p-5 bg-white">
          <p className="text-sm text-gray-500 mb-1">Total Teachers</p>
          <h2 className="text-2xl font-bold">{totalTeachers}</h2>
        </div>

        <div className="border rounded p-5 bg-white">
          <p className="text-sm text-gray-500 mb-1">Class Teachers</p>
          <h2 className="text-2xl font-bold">{totalClassTeachers}</h2>
        </div>

        <div className="border rounded p-5 bg-white">
          <p className="text-sm text-gray-500 mb-1">Normal Teachers</p>
          <h2 className="text-2xl font-bold">{totalNormalTeachers}</h2>
        </div>
      </div>

      <div className="border rounded bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">#</th>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold">School</th>
                <th className="text-left px-4 py-3 font-semibold">Type</th>
                <th className="text-left px-4 py-3 font-semibold">Class</th>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Subjects</th>
                <th className="text-left px-4 py-3 font-semibold">Registered On</th>
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
                teachers.map((teacher, index) => (
                  <tr key={teacher.id} className="border-t">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{teacher.name}</td>
                    <td className="px-4 py-3">{teacher.school}</td>
                    <td className="px-4 py-3">
                      {teacher.isClassTeacher ? (
                        <span className="inline-block rounded bg-green-100 text-green-700 px-2 py-1 text-sm">
                          Class Teacher
                        </span>
                      ) : (
                        <span className="inline-block rounded bg-blue-100 text-blue-700 px-2 py-1 text-sm">
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