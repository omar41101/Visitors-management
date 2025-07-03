"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

const VisitDetails = () => {
  const { visitId } = useParams()
  const navigate = useNavigate()
  const [visit, setVisit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVisitDetails = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          setError("Authentication required")
          setLoading(false)
          return
        }

        const response = await fetch(`http://localhost:5005/api/visits/${visitId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            setError("Visit not found")
          } else {
            setError("Failed to load visit details")
          }
          setLoading(false)
          return
        }

        const data = await response.json()
        setVisit(data)
      } catch (error) {
        console.error("Error fetching visit details:", error)
        setError("Failed to load visit details")
      } finally {
        setLoading(false)
      }
    }

    fetchVisitDetails()
  }, [visitId])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const handleExit = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5005/api/visits/${visitId}/exit`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const updatedVisit = await response.json()
        setVisit(updatedVisit)
      }
    } catch (error) {
      console.error("Error recording exit:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-emerald-600 mx-auto mb-6"></div>
          <p className="text-slate-700 font-semibold text-lg">Loading visit details...</p>
          <p className="text-slate-500">Please wait while we fetch the information</p>
        </div>
      </div>
    )
  }

  if (error) {
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
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Error</h1>
          <p className="text-slate-600 mb-8">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!visit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Visit Not Found</h1>
          <p className="text-slate-600 mb-8">The visit you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Visit Details
              </h1>
              <p className="text-slate-600 text-lg">Comprehensive visitor profile and visit information</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/visits")}
                className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Visits
              </button>
              {/* Profile Button */}
              {visit && (
                <button
                  onClick={() => navigate(`/visitors/${visit.visitor._id}`)}
                  className="bg-gradient-to-r from-blue-500 to-sky-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Profile
                </button>
              )}
              {visit.status === "active" && (
                <button
                  onClick={handleExit}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Record Exit
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visitor Profile */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              Visitor Profile
            </h2>

            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-slate-600 mb-1">Full Name</label>
                <p className="text-lg font-medium text-slate-900">{visit.visitor.name}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address</label>
                <p className="text-slate-800">{visit.visitor.email}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-slate-600 mb-1">Phone Number</label>
                <p className="text-slate-800">{visit.visitor.phone || "Not provided"}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-slate-600 mb-1">Company</label>
                <p className="text-slate-800">{visit.visitor.company || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Visit Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              Visit Information
            </h2>

            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-slate-600 mb-1">Visit ID</label>
                <p className="text-sm text-slate-600 font-mono">{visit._id}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-slate-600 mb-1">Purpose</label>
                <p className="text-slate-900 font-medium">{visit.purpose}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-slate-600 mb-1">Host</label>
                <p className="text-slate-900 font-medium">{visit.host}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-slate-600 mb-1">Status</label>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    visit.status === "active"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-slate-100 text-slate-800 border border-slate-200"
                  }`}
                >
                  {visit.status === "active" ? "Active" : "Completed"}
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-slate-600 mb-1">Entry Time</label>
                <p className="text-slate-900 font-medium">{formatDate(visit.entryTime)}</p>
              </div>

              {visit.exitTime && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Exit Time</label>
                  <p className="text-slate-900 font-medium">{formatDate(visit.exitTime)}</p>
                </div>
              )}

              {visit.durationFormatted && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Duration</label>
                  <p className="text-slate-900 font-medium">{visit.durationFormatted}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Documents Signed */}
        {visit.documentsSigned && visit.documentsSigned.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mt-8 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              Documents Signed
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visit.documentsSigned.map((doc, index) => (
                <div
                  key={index}
                  className="border-2 border-emerald-200 bg-emerald-50 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-emerald-800 text-lg mb-2">{doc.documentId.title}</h3>
                      <p className="text-sm text-emerald-600 mb-1">
                        <span className="font-semibold">Type:</span> {doc.documentId.type}
                      </p>
                      <p className="text-sm text-emerald-600">
                        <span className="font-semibold">Signed:</span> {formatDate(doc.signedAt)}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Signed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QR Code */}
        {visit.qrCode && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mt-8 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              Visit QR Code
            </h2>

            <div className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-slate-200 mb-6">
                <img src={visit.qrCode || "/placeholder.svg"} alt="Visit QR Code" className="w-56 h-56" />
              </div>
              <div className="text-center bg-slate-50 rounded-xl p-4 max-w-md">
                <p className="text-sm font-semibold text-slate-700 mb-2">Scan this QR code to access visit details</p>
                <p className="text-xs text-slate-500">
                  This code provides quick access to visitor information and visit status
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VisitDetails
