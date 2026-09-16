import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Search, LogOut, Radio, Clock } from 'lucide-react'
import { useAuthStore } from '@/features/auth/authStore'
import { useTrackingStore } from '@/features/tracking/trackingStore'
import { formatTimeOnly } from '@/utils/dateUtils'

export const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { alerts, isStreaming } = useTrackingStore()
  const [currentTime, setCurrentTime] = useState(new Date().toISOString())
  const [showAlertMenu, setShowAlertMenu] = useState(false)

  const unreadAlerts = alerts.filter((a) => !a.isAcknowledged)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toISOString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Search & Telemetry status */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vehicle, driver or plate..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-slate-200">{formatTimeOnly(currentTime)} UTC</span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
          <Radio className={`w-3.5 h-3.5 ${isStreaming ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <span className={isStreaming ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
            {isStreaming ? 'Live Stream' : 'Stream Paused'}
          </span>
        </div>
      </div>

      {/* Actions & User Menu */}
      <div className="flex items-center gap-3">
        {/* Alerts Bell Notification Popover */}
        <div className="relative">
          <button
            onClick={() => setShowAlertMenu(!showAlertMenu)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition relative cursor-pointer"
            title="Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
            )}
          </button>

          {showAlertMenu && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-3 text-left animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Recent Alerts ({unreadAlerts.length})
                </span>
                <Link
                  to="/alerts"
                  onClick={() => setShowAlertMenu(false)}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {alerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{alert.vehicleName}</span>
                      <span className="text-[10px] text-slate-500">{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-400 mt-1 line-clamp-2">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'FL'}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-100">{user?.name || 'Fleet Admin'}</span>
            <span className="text-[10px] text-slate-400 capitalize">{user?.role?.replace('_', ' ') || 'Fleet Manager'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
