export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SchemePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const doc = await prisma.generatedDocument.findUnique({
    where: { id: Number(id) },
    include: { teacher: true },
  });

  if (!doc) return notFound();

  // ✅ Parse JSON safely
  let headers: string[] = [];
  let rows: any[] = [];

  try {
    headers = JSON.parse(doc.schemeHeadersJson || "[]");
    rows = JSON.parse(doc.schemeRowsJson || "[]");
  } catch (e) {
    console.error("JSON parse error", e);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Scheme Preview</h1>

      {/* 📄 INFO */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <p><strong>Teacher:</strong> {doc.teacher.name}</p>
        <p><strong>School:</strong> {doc.teacher.school}</p>
        <p><strong>Subject:</strong> {doc.subject}</p>
        <p><strong>Level:</strong> {doc.classLevel}</p>
        <p><strong>Term:</strong> {doc.term}</p>
      </div>

      {/* 📊 TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-50">
              {headers.map((h, i) => (
                <th key={i} className="border p-2 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row: any, i: number) => (
              <tr key={i}>
                {headers.map((h, j) => (
                  <td key={j} className="border p-2">
                    {row[h] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📥 DOWNLOAD */}
      <div className="mt-6 flex gap-3">
        <Link
          href={`/api/schemes/${doc.id}/pdf`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Download PDF
        </Link>
      </div>
    </main>
  );
}