import {
  FileText,
  BookOpen,
  ClipboardCheck,
  FolderOpen,
  Search,
  Plus,
  BarChart3,
  GraduationCap,
  FileSpreadsheet,
  ClipboardList,
} from "lucide-react"

const stats = [
  {
    label: "Schemes Generated",
    value: "128",
    icon: FileSpreadsheet,
    trend: "+12%",
  },
  {
    label: "Lesson Plans Created",
    value: "342",
    icon: BookOpen,
    trend: "+8%",
  },
  {
    label: "Records Updated",
    value: "96",
    icon: ClipboardCheck,
    trend: "+5%",
  },
  {
    label: "Documents Downloaded",
    value: "1,247",
    icon: FolderOpen,
    trend: "+18%",
  },
]

const quickActions = [
  {
    title: "Generate Scheme",
    icon: FileSpreadsheet,
  },
  {
    title: "Lesson Plan",
    icon: BookOpen,
  },
  {
    title: "Record of Work",
    icon: ClipboardList,
  },
  {
    title: "Assessment Tool",
    icon: GraduationCap,
  },
]

const recentDocs = [
  {
    title: "Grade 7 Mathematics Scheme of Work",
    type: "Scheme of Work",
    status: "Ready",
  },
  {
    title: "English Lesson Plan - Week 4",
    type: "Lesson Plan",
    status: "Ready",
  },
  {
    title: "CBC Assessment Rubric",
    type: "Assessment Tool",
    status: "Ready",
  },
  {
    title: "Record of Work - Term 2",
    type: "Record of Work",
    status: "Draft",
  },
]

const bars = [35, 60, 45, 75, 58, 92, 70]

export default function DashboardPreview() {
  return (
<section
  id="features"
  className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black py-24"
>      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
            TeacherPoa Platform
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Everything a Teacher Needs in One Place
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Generate schemes of work, lesson plans, records of work,
            assessments, exams and other CBC teaching documents
            in seconds.
          </p>
        </div>

        {/* Dashboard */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          
          {/* Browser Bar */}
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-300"></span>
              <span className="h-3 w-3 rounded-full bg-slate-300"></span>
              <span className="h-3 w-3 rounded-full bg-slate-300"></span>
            </div>

            <div className="ml-4 hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 sm:flex">
              <Search className="h-3 w-3" />
              app.teacherpoa.com/dashboard
            </div>
          </div>

          <div className="grid lg:grid-cols-[240px_1fr]">
            
            {/* Sidebar */}
            <aside className="hidden border-r border-slate-200 bg-slate-50 lg:block">
              <div className="p-5">
                <div className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Workspace
                </div>

                <div className="space-y-1">
                  {[
                    {
                      label: "Dashboard",
                      icon: BarChart3,
                      active: true,
                    },
                    {
                      label: "Schemes of Work",
                      icon: FileSpreadsheet,
                    },
                    {
                      label: "Lesson Plans",
                      icon: BookOpen,
                    },
                    {
                      label: "Records of Work",
                      icon: ClipboardCheck,
                    },
                    {
                      label: "Assessments",
                      icon: GraduationCap,
                    },
                    {
                      label: "Document Library",
                      icon: FolderOpen,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                        item.active
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="p-5 sm:p-8">
              
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Welcome Back, Teacher
                  </h3>

                  <p className="text-sm text-slate-500">
                    Generate professional CBC teaching documents
                    in minutes.
                  </p>
                </div>

                <button className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:flex">
                  <Plus className="h-4 w-4" />
                  Generate Document
                </button>
              </div>

              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                        <stat.icon className="h-5 w-5" />
                      </div>

                      <span className="text-xs font-semibold text-emerald-600">
                        {stat.trend}
                      </span>
                    </div>

                    <div className="mt-4 text-2xl font-bold text-slate-900">
                      {stat.value}
                    </div>

                    <div className="text-sm text-slate-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-semibold text-slate-700">
                  Quick Actions
                </h4>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {quickActions.map((action) => (
                    <div
                      key={action.title}
                      className="cursor-pointer rounded-2xl border border-slate-200 p-4 transition-all hover:border-blue-200 hover:bg-blue-50"
                    >
                      <action.icon className="mb-3 h-5 w-5 text-blue-600" />

                      <div className="text-sm font-medium text-slate-900">
                        {action.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Grid */}
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                
                {/* Productivity */}
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h4 className="font-semibold text-slate-900">
                    Teacher Productivity
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Hours saved this week
                  </p>

                  <div className="mt-6 flex h-32 items-end gap-2">
                    {bars.map((height, index) => (
                      <div
                        key={index}
                        className={`flex-1 rounded-t-lg ${
                          index === 5
                            ? "bg-blue-600"
                            : "bg-blue-200"
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Recent Documents */}
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h4 className="mb-4 font-semibold text-slate-900">
                    Recent Documents
                  </h4>

                  <div className="space-y-3">
                    {recentDocs.map((doc) => (
                      <div
                        key={doc.title}
                        className="flex items-center gap-3"
                      >
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                          <FileText className="h-4 w-4" />
                        </div>

                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900">
                            {doc.title}
                          </div>

                          <div className="text-xs text-slate-500">
                            {doc.type}
                          </div>
                        </div>

                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            doc.status === "Ready"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}