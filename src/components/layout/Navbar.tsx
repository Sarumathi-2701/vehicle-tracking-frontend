import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Bell, Search, LogOut, Menu } from 'lucide-react'
import { useAuthStore } from '@/features/auth/authStore'
import { useTrackingStore } from '@/features/tracking/trackingStore'
import { useAppStore } from '@/store/appStore'

export const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { alerts } = useTrackingStore()
  const { toggleMobileSidebar } = useAppStore()
  const [showAlertMenu, setShowAlertMenu] = useState(false)

  const isVehiclesPage = location.pathname === '/vehicles'
  const unreadAlerts = alerts.filter((a) => !a.isAcknowledged)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Drawer Hamburger Button + Search Input */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {!isVehiclesPage && (
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vehicles, drivers, locations..."
              className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs rounded-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition shadow-2xs"
            />
          </div>
        )}
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlertMenu(!showAlertMenu)}
            className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showAlertMenu && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 p-3 text-left animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Recent Alerts ({unreadAlerts.length})
                </span>
                <Link
                  to="/alerts"
                  onClick={() => setShowAlertMenu(false)}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {alerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{alert.vehicleName}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-1 line-clamp-2">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Card Profile */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-xs shadow-xs overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Admin"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <span>AD</span>
          </div>

          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">Admin</span>
            <span className="text-[11px] text-slate-400 font-medium">Super Admin</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
