 
import { useEffect, useState } from "react"
import { BarChart, Calendar, CheckCircle, Clock, Download, FileText, TrendingUp, Users } from "lucide-react"
import api from "../api"

const Dashboard = () => {
  const [overview, setOverview] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const overviewRes = await api.get("/dashboard/overview")
        setOverview(overviewRes.data)
        const statsRes = await api.get("/dashboard/stats")
        setStats(statsRes.data)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !overview || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-emerald-600"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 animate-ping"></div>
          </div>
          <div className="text-center">
            <p className="text-slate-700 font-semibold text-lg">Loading Dashboard</p>
            <p className="text-slate-500">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
                Dashboard Overview
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                Monitor your visitor management system with real-time insights and analytics
              </p>
            </div>
            <div className="lg:text-right">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-slate-800">Connected as: {user.role || "Admin"}</span>
                </div>
                <div className="text-sm text-slate-500 font-mono">
                  Session: {token ? token.slice(0, 12) + "..." : "Not available"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Total Visits"
            value={overview.totalVisits}
            icon={<BarChart className="w-7 h-7" />}
            gradient="from-emerald-500 to-teal-600"
            bgPattern="bg-emerald-50"
          />
          <StatsCard
            title="Today's Visits"
            value={overview.todayVisits}
            icon={<Calendar className="w-7 h-7" />}
            gradient="from-violet-500 to-purple-600"
            bgPattern="bg-violet-50"
          />
          <StatsCard
            title="Upcoming"
            value={overview.upcomingVisits}
            icon={<Clock className="w-7 h-7" />}
            gradient="from-amber-500 to-orange-600"
            bgPattern="bg-amber-50"
          />
          <StatsCard
            title="Completed"
            value={overview.completedVisits}
            icon={<CheckCircle className="w-7 h-7" />}
            gradient="from-rose-500 to-pink-600"
            bgPattern="bg-rose-50"
          />
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          <TableSection title="Upcoming Visits" data={overview.nextVisits} />
          <TableSection title="Recent Visits" data={overview.pastVisits} />
        </div>

        {/* Statistics Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8 mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Analytics & Insights</h2>
              <p className="text-slate-600">Detailed breakdown of your visitor data</p>
            </div>
          </div>
          <StatsCharts stats={stats} />
        </div>

        {/* Export Section */}
        <ExportButtons />
      </div>
    </div>
  )
}

const StatsCard = ({ title, value, icon, gradient, bgPattern }) => (
  <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}></div>
    <div className={`absolute inset-0 ${bgPattern} opacity-10`}></div>
    <div className="relative p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">{icon}</div>
        <div className="text-right">
          <div className="text-3xl font-bold mb-1">{value}</div>
          <div className="text-white/90 font-medium text-sm">{title}</div>
        </div>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <div className="bg-white h-2 rounded-full w-3/4 shadow-sm"></div>
      </div>
    </div>
  </div>
)

const TableSection = ({ title, data }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
    <div className="px-6 py-4 bg-gradient-to-r from-slate-700 to-slate-800">
      <h3 className="text-xl font-bold text-white flex items-center gap-3">
        <Users className="w-5 h-5" />
        {title}
      </h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50/80 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Visitor</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Host</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((visit, i) => (
            <tr key={visit._id} className="hover:bg-slate-50/50 transition-colors duration-200">
              <td className="px-6 py-4 text-sm font-semibold text-slate-900">{visit.visitor?.name}</td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {visit.entryTime ? new Date(visit.entryTime).toLocaleString("en-US") : ""}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{visit.host}</td>
              <td className="px-6 py-4">
                <StatusBadge status={visit.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: { color: "bg-emerald-100 text-emerald-800 border-emerald-200", label: "Completed" },
    active: { color: "bg-amber-100 text-amber-800 border-amber-200", label: "Active" },
    pending: { color: "bg-violet-100 text-violet-800 border-violet-200", label: "Pending" },
  }

  const config = statusConfig[status] || { color: "bg-slate-100 text-slate-800 border-slate-200", label: status }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      {config.label}
    </span>
  )
}

const StatsCharts = ({ stats }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
        Visit Types
      </h3>
      <div className="space-y-3">
        {stats.byType.map((t) => (
          <div
            key={t._id}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:shadow-md transition-all duration-200"
          >
            <span className="font-semibold text-slate-700">{t._id}</span>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              {t.count}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
        Compliance
      </h3>
      <div className="space-y-3">
        {stats.compliance.map((c) => (
          <div
            key={c._id ? "Yes" : "No"}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100 hover:shadow-md transition-all duration-200"
          >
            <span className="font-semibold text-slate-700">{c._id ? "Compliant" : "Non-compliant"}</span>
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              {c.count}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
        Monthly Trends
      </h3>
      <div className="space-y-3">
        {stats.byMonth.map((m) => (
          <div
            key={m._id}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100 hover:shadow-md transition-all duration-200"
          >
            <span className="font-semibold text-slate-700">{m._id}</span>
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              {m.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const ExportButtons = () => {
  const handleExport = (type) => {
    window.open(`/api/dashboard/export?type=${type}`, "_blank")
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Export Data</h3>
          <p className="text-slate-600">Download your reports in various formats</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleExport("pdf")}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          <FileText className="w-5 h-5" />
          Export as PDF
        </button>
        <button
          onClick={() => handleExport("excel")}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          <BarChart className="w-5 h-5" />
          Export as Excel
        </button>
      </div>
    </div>
  )
}

export default Dashboard
