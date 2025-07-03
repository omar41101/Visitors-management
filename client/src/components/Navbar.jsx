"use client"

import React from "react"
import { Link, useNavigate } from "react-router-dom"

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-white/20 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-3 group transition-all duration-200 hover:scale-105">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Visitor Management
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <NavLink to="/dashboard" icon="dashboard">
                  Dashboard
                </NavLink>
                <NavLink to="/visitors" icon="users">
                  Visitors
                </NavLink>
                <NavLink to="/visits" icon="calendar">
                  Visits
                </NavLink>
                <NavLink to="/visit-history" icon="history">
                  History
                </NavLink>
                <NavLink to="/qr-scanner" icon="qr">
                  QR Scanner
                </NavLink>
                <NavLink to="/documents" icon="documents">
                  Documents
                </NavLink>
                <NavLink to="/send-email" icon="email">
                  Email
                </NavLink>

                {/* User Profile & Logout */}
                <div className="flex items-center ml-6 pl-6 border-l border-slate-200">
                  <div className="flex items-center gap-3 mr-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-violet-700 font-semibold text-sm">
                        {user.username
                          ? user.username
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </span>
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-semibold text-slate-800">{user.username || "User"}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role || "Member"}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" icon="login">
                  Login
                </NavLink>
                <NavLink to="/register" icon="register">
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <MobileMenu user={user} handleLogout={handleLogout} />
          </div>
        </div>
      </div>
    </nav>
  )
}

// Navigation Link Component
const NavLink = ({ to, children, icon }) => {
  const getIcon = (iconName) => {
    const icons = {
      dashboard: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
      ),
      users: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      ),
      calendar: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      ),
      history: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      qr: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      ),
      documents: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      ),
      email: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      ),
      login: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
        />
      ),
      register: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      ),
    }
    return icons[iconName] || icons.dashboard
  }

  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200 font-medium group"
    >
      <svg
        className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {getIcon(icon)}
      </svg>
      <span className="text-sm">{children}</span>
    </Link>
  )
}

// Mobile Menu Component
const MobileMenu = ({ user, handleLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 py-4 z-50">
          {user ? (
            <>
              {/* User Info */}
              <div className="px-4 py-3 border-b border-slate-200 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-violet-700 font-semibold text-sm">
                      {user.username
                        ? user.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{user.username || "User"}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role || "Member"}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1 px-2">
                <MobileNavLink to="/dashboard" icon="dashboard" onClick={() => setIsOpen(false)}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/visitors" icon="users" onClick={() => setIsOpen(false)}>
                  Visitors
                </MobileNavLink>
                <MobileNavLink to="/visits" icon="calendar" onClick={() => setIsOpen(false)}>
                  Visits
                </MobileNavLink>
                <MobileNavLink to="/visit-history" icon="history" onClick={() => setIsOpen(false)}>
                  Visit History
                </MobileNavLink>
                <MobileNavLink to="/qr-scanner" icon="qr" onClick={() => setIsOpen(false)}>
                  QR Scanner
                </MobileNavLink>
                <MobileNavLink to="/documents" icon="documents" onClick={() => setIsOpen(false)}>
                  Documents
                </MobileNavLink>
                <MobileNavLink to="/send-email" icon="email" onClick={() => setIsOpen(false)}>
                  Send Email
                </MobileNavLink>
              </div>

              {/* Logout Button */}
              <div className="px-2 pt-4 border-t border-slate-200 mt-4">
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-1 px-2">
              <MobileNavLink to="/login" icon="login" onClick={() => setIsOpen(false)}>
                Login
              </MobileNavLink>
              <MobileNavLink to="/register" icon="register" onClick={() => setIsOpen(false)}>
                Register
              </MobileNavLink>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Mobile Navigation Link Component
const MobileNavLink = ({ to, children, icon, onClick }) => {
  const getIcon = (iconName) => {
    const icons = {
      dashboard: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
      ),
      users: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      ),
      calendar: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      ),
      history: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      qr: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      ),
      documents: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      ),
      email: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      ),
      login: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
        />
      ),
      register: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      ),
    }
    return icons[iconName] || icons.dashboard
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200 font-medium group"
    >
      <svg
        className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {getIcon(icon)}
      </svg>
      <span>{children}</span>
    </Link>
  )
}

export default Navbar
