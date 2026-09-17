import React, { useState } from 'react'
import { Calendar, Download, FileText, ArrowUpRight } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import StatsCard from '@/components/common/StatsCard'
import FleetStatusChart from '@/features/dashboard/components/FleetStatusChart'

export const ReportsPage: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState('Vehicle Summary')

  const reportTabs = [
    'Vehicle Summary',
    'Trip Report',
    'Distance Report',
    'Speed Report',
    'Idle Report',
    'GPS Status',
  ]

  const BAR_DATA = [
    { vehicle: 'TN01', distance: 1840 },
    { vehicle: 'TN03', distance: 1320 },
    { vehicle: 'TN06', distance: 2150 },
    { vehicle: 'TN08', distance: 980 },
    { vehicle: 'TN10', distance: 1650 },
    { vehicle: 'TN12', distance: 1120 },
    { vehicle: 'TN14', distance: 1480 },
    { vehicle: 'TN16', distance: 1920 },
  ]

  const maxDistance = Math.max(...BAR_DATA.map((d) => d.distance))

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Reports"
        subtitle="Performance metrics, fuel usage, and distance breakdown"
      />

      {/* Sub Tabs matching Mockup Screen 8 */}
      <div className="flex items-center gap-6 border-b border-slate-200 pb-3 text-xs font-semibold text-slate-500 overflow-x-auto">
        {reportTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveReportTab(tab)}
            className={`pb-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeReportTab === tab
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Control Actions Row matching Mockup */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>01-09-2025 - 16-09-2025</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Export:</span>
            <span className="font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
              PDF - 16-Unit
            </span>
          </div>
        </div>

        <Button variant="primary" icon={<Download className="w-4 h-4" />}>
          Generate Report
        </Button>
      </div>

      {/* 4 Summary Cards matching Mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Distance"
          value="18,460 km"
          trend={{ value: '12% vs last period', isPositive: true }}
        />

        <StatsCard
          label="Total Trips"
          value="612"
          trend={{ value: '5% vs last period', isPositive: true }}
        />

        <StatsCard
          label="Avg. Speed"
          value="56 km/h"
          trend={{ value: '2% vs last period', isPositive: false }}
        />

        <StatsCard
          label="Fuel Usage"
          value="3,420 L"
          trend={{ value: '8% vs last period', isPositive: true }}
        />
      </div>

      {/* Charts Grid: Distance Bar Chart + Vehicle Status Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Distance by Vehicle Bar Chart */}
        <Card title="Distance by Vehicle" subtitle="Recorded kilometers across main units">
          <div className="h-64 flex items-end justify-between gap-3 pt-8 px-2">
            {BAR_DATA.map((item) => {
              const heightPct = (item.distance / maxDistance) * 100

              return (
                <div key={item.vehicle} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition">
                    {item.distance}k
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-lg h-44 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-blue-600 rounded-t-lg group-hover:bg-blue-700 transition-all duration-500 shadow-xs"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">{item.vehicle}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Vehicle Status Donut Chart */}
        <FleetStatusChart
          total={24}
          running={16}
          idle={5}
          parked={2}
          offline={1}
        />
      </div>
    </div>
  )
}

export default ReportsPage
