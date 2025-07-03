"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api"
import Alert from "../components/Alert"
import useAlert from "../hooks/useAlert"

const VisitorProfile = () => {
  const { visitorId } = useParams()
  const navigate = useNavigate()
  const { alert, showSuccess, showError, hideAlert } = useAlert()
  const [visitor, setVisitor] = useState(null)
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        setLoading(true)

        const visitorResponse = await api.get(`/visitors/${visitorId}`)
        setVisitor(visitorResponse.data)

        const visitsResponse = await api.get(`/visits/visitor/${visitorId}/history`)
        setVisits(visitsResponse.data.visits || [])
      } catch (error) {
        console.error("Error fetching visitor data:", error)
        showError("Failed to load visitor profile")
      } finally {
        setLoading(false)
      }
    }

    if (visitorId) {
      fetchVisitorData()
    }
  }, [visitorId])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "completed":
        return "bg-violet-100 text-violet-800 border-violet-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const calculateVisitStats = () => {
    const totalVisits = visits.length
    const activeVisits = visits.filter((v) => v.status === "active").length
    const completedVisits = visits.filter((v) => v.status === "completed").length

    const totalDuration = visits.filter((v) => v.duration).reduce((sum, v) => sum + v.duration, 0)

    return {
      totalVisits,
      activeVisits,
      completedVisits,
      totalDuration: Math.floor(totalDuration / 60),
      averageDuration: totalVisits > 0 ? Math.floor(totalDuration / totalVisits / 60) : 0,
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-emerald-600 mx-auto mb-6"></div>
          <p className="text-slate-700 font-semibold text-lg">Loading visitor profile...</p>
          <p className="text-slate-500">Please wait while we fetch the data</p>
        </div>
      </div>
    )
  }

  if (!visitor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Visitor Not Found</h1>
          <p className="text-slate-600 mb-8">The visitor you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/visitors")}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Back to Visitors
          </button>
        </div>
      </div>
    )
  }

  const stats = calculateVisitStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Visitor Profile
              </h1>
              <p className="text-slate-600 text-lg">Complete visitor information and activity history</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/visitors")}
                className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Visitors
              </button>
              <button
                onClick={() => navigate(`/visitors/edit/${visitor._id}`)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-slate-600">Total Visits</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalVisits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-slate-600">Active Visits</p>
                <p className="text-3xl font-bold text-slate-900">{stats.activeVisits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-slate-600">Total Hours</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalDuration}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-slate-600">Avg Duration</p>
                <p className="text-3xl font-bold text-slate-900">{stats.averageDuration}h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-6 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                  activeTab === "profile"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("visits")}
                className={`py-6 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                  activeTab === "visits"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                Visit History ({visits.length})
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "profile" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Full Name</label>
                      <p className="text-lg font-medium text-slate-900">{visitor.name}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address</label>
                      <p className="text-slate-800">{visitor.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Phone Number</label>
                      <p className="text-slate-800">{visitor.phone || "Not provided"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Company</label>
                      <p className="text-slate-800">{visitor.company || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Additional Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Visitor ID</label>
                      <p className="text-sm text-slate-600 font-mono bg-white rounded-lg p-2">{visitor._id}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Registration Date</label>
                      <p className="text-slate-800">
                        {visitor.createdAt ? formatDate(visitor.createdAt) : "Not available"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Last Updated</label>
                      <p className="text-slate-800">
                        {visitor.updatedAt ? formatDate(visitor.updatedAt) : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "visits" && (
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Visit History
                </h3>
                {visits.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-600 text-lg">No visits recorded yet.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Purpose
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Host
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Entry Time
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Exit Time
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {visits.map((visit, index) => (
                          <tr
                            key={visit._id}
                            className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-emerald-50/50 transition-colors duration-200`}
                          >
                            <td className="px-6 py-4 font-medium text-slate-900">{visit.purpose}</td>
                            <td className="px-6 py-4 text-slate-700">{visit.host}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {visit.entryTime ? formatDate(visit.entryTime) : "-"}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {visit.exitTime ? formatDate(visit.exitTime) : "-"}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-700">
                              {visit.durationFormatted || "-"}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(visit.status)}`}
                              >
                                {visit.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => navigate(`/visit-details/${visit._id}`)}
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                                title="View Details"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Alert
        type={alert.type}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        autoClose={alert.autoClose}
        autoCloseTime={alert.autoCloseTime}
      />
    </div>
  )
}

export default VisitorProfile
