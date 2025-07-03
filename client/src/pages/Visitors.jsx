"use client"

import { useEffect, useState } from "react"
import api from "../api"
import Alert from "../components/Alert"
import useAlert from "../hooks/useAlert"

const Visitors = () => {
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "" })
  const [editingId, setEditingId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { alert, showSuccess, showError, showWarning, hideAlert } = useAlert()

  const fetchVisitors = async () => {
    setLoading(true)
    try {
      const res = await api.get("/visitors")
      setVisitors(res.data)
    } catch (err) {
      showError("Failed to fetch visitors")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchVisitors()
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    hideAlert()

    try {
      if (editingId) {
        await api.put(`/visitors/${editingId}`, form)
        showSuccess("Visitor updated successfully!")
      } else {
        await api.post("/visitors", form)
        showSuccess("Visitor added successfully!")
      }
      setForm({ name: "", email: "", phone: "", company: "" })
      setEditingId(null)
      fetchVisitors()
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to save visitor"
      showError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (visitor) => {
    setForm({ name: visitor.name, email: visitor.email, phone: visitor.phone, company: visitor.company })
    setEditingId(visitor._id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visitor?")) return

    try {
      await api.delete(`/visitors/${id}`)
      showSuccess("Visitor deleted successfully!")
      fetchVisitors()
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete visitor"
      showError(errorMessage)
    }
  }

  const handleCancelEdit = () => {
    setForm({ name: "", email: "", phone: "", company: "" })
    setEditingId(null)
    hideAlert()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Visitor Management
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Manage your visitor database with ease - add, edit, and organize visitor information
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{editingId ? "Edit Visitor" : "Add New Visitor"}</h3>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Enter company name"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          editingId
                            ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            : "M12 6v6m0 0v6m0-6h6m-6 0H6"
                        }
                      />
                    </svg>
                    {editingId ? "Update" : "Add"}
                  </>
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gradient-to-r from-slate-400 to-slate-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Visitor Directory</h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-600 mb-4"></div>
              <p className="text-slate-600 font-medium">Loading visitors...</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-8 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visitors.map((v, i) => (
                    <tr
                      key={v._id}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-emerald-50/50 transition-colors duration-200`}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-emerald-700 font-semibold text-sm">
                              {v.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                          </div>
                          <span className="font-semibold text-slate-800">{v.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-700">{v.email}</td>
                      <td className="px-8 py-6 text-slate-700">{v.phone || "-"}</td>
                      <td className="px-8 py-6 text-slate-700">{v.company || "-"}</td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(v)}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(v._id)}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

export default Visitors
