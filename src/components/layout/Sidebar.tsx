import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Navigation,
  Truck,
  Route,
  Bell,
  BarChart3,
  MapPin,
  Settings,
  Radio,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useTrackingStore } from '@/features/tracking/trackingStore'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tracking', label: 'Live Tracking', icon: Navigation },
  { path: '/vehicles', label: 'Vehicles', icon: Truck },
  { path: '/trips', label: 'Trips', icon: Route },
  { path: '/alerts', label: 'Alerts', icon: Bell, badgeCount: 3 },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/geofences', label: 'Geofences', icon: MapPin },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppStore()
  const { alerts } = useTrackingStore()
  const unreadAlertsCount = alerts.filter((a) => !a.isAcknowledged).length || 3

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#0B132B] border-r border-slate-800 text-slate-300 transition-all duration-300 flex flex-col justify-between shadow-2xl ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-20 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/30 text-white">
              <MapPin className="w-5 h-5 fill-white text-blue-600" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-sm text-white tracking-tight leading-snug">
                  GPS Vehicle Tracking
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Track • Monitor • Manage
                </span>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
            title={sidebarOpen ? 'Collapse Menu' : 'Expand Menu'}
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5 mt-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group relative ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />

                {sidebarOpen && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {sidebarOpen && item.badgeCount && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white shadow-sm">
                    {item.label === 'Alerts' ? unreadAlertsCount : item.badgeCount}
                  </span>
                )}

                {/* Tooltip when collapsed */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Footer Quick Status */}
      <div className="p-3 border-t border-slate-800/80">
        <div
          className={`p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center ${
            sidebarOpen ? 'justify-between' : 'justify-center'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {sidebarOpen && (
              <span className="text-[11px] text-slate-300 font-medium">GPS Engine Online</span>
            )}
          </div>
          {sidebarOpen && <Radio className="w-3.5 h-3.5 text-emerald-400" />}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
