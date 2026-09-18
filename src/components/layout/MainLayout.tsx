import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useAppStore } from '@/store/appStore'

export const MainLayout: React.FC = () => {
  const { sidebarOpen } = useAppStore()

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex">
      {/* Persistent Desktop Sidebar / Slide-out Mobile Drawer */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ml-0 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <Navbar />
        <main className="flex-1 p-3 sm:p-5 lg:p-7 max-w-[1600px] w-full mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
