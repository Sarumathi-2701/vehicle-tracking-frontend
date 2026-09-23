import React, { useState, useMemo } from 'react'
import {
  Calendar,
  Download,
  Route,
  Navigation,
  Gauge,
  Fuel,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Clock,
  Zap,
} from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import StatsCard from '@/components/common/StatsCard'
import DataTable, { Column } from '@/components/tables/DataTable'
import Pagination from '@/components/tables/Pagination'
import { usePagination } from '@/hooks/usePagination'

interface VehicleReportRecord {
  id: string
  vehicleNo: string
  type: string
  driver: string
  trips: number
  distanceKm: number
  fuelLiters: number
  avgSpeedKmh: number
  efficiencyKml: number
  status: 'running' | 'idle' | 'parked' | 'offline'
}

const REPORT_RECORDS: VehicleReportRecord[] = [
  { id: 'rep-01', vehicleNo: 'TN01AB1234', type: 'Truck', driver: 'Kumar', trips: 42, distanceKm: 1840, fuelLiters: 340.5, avgSpeedKmh: 58, efficiencyKml: 5.4, status: 'running' },
  { id: 'rep-02', vehicleNo: 'TN03CD5678', type: 'Car', driver: 'Ravi', trips: 58, distanceKm: 1320, fuelLiters: 94.2, avgSpeedKmh: 52, efficiencyKml: 14.0, status: 'idle' },
  { id: 'rep-03', vehicleNo: 'TN06EF9012', type: 'Bus', driver: 'Murugan', trips: 64, distanceKm: 2150, fuelLiters: 488.6, avgSpeedKmh: 48, efficiencyKml: 4.4, status: 'running' },
  { id: 'rep-04', vehicleNo: 'TN08GH3456', type: 'Truck', driver: 'Senthil', trips: 28, distanceKm: 980, fuelLiters: 184.9, avgSpeedKmh: 60, efficiencyKml: 5.3, status: 'offline' },
  { id: 'rep-05', vehicleNo: 'TN10IJ7890', type: 'Van', driver: 'Govind', trips: 46, distanceKm: 1650, fuelLiters: 194.1, avgSpeedKmh: 54, efficiencyKml: 8.5, status: 'running' },
  { id: 'rep-06', vehicleNo: 'TN12KL3456', type: 'Truck', driver: 'Moorthy', trips: 38, distanceKm: 1120, fuelLiters: 211.3, avgSpeedKmh: 56, efficiencyKml: 5.3, status: 'parked' },
  { id: 'rep-07', vehicleNo: 'TN14MN1234', type: 'Car', driver: 'Prabhu', trips: 52, distanceKm: 1480, fuelLiters: 105.7, avgSpeedKmh: 55, efficiencyKml: 14.0, status: 'running' },
  { id: 'rep-08', vehicleNo: 'TN16OP5678', type: 'Truck', driver: 'Kishore', trips: 44, distanceKm: 1920, fuelLiters: 355.5, avgSpeedKmh: 57, efficiencyKml: 5.4, status: 'running' },
  { id: 'rep-09', vehicleNo: 'TN18QR9012', type: 'Truck', driver: 'Balaji', trips: 36, distanceKm: 1420, fuelLiters: 268.0, avgSpeedKmh: 59, efficiencyKml: 5.3, status: 'running' },
  { id: 'rep-10', vehicleNo: 'TN20ST3456', type: 'Bus', driver: 'Anand', trips: 60, distanceKm: 1890, fuelLiters: 429.5, avgSpeedKmh: 46, efficiencyKml: 4.4, status: 'idle' },
  { id: 'rep-11', vehicleNo: 'TN22UV7890', type: 'Van', driver: 'Vignesh', trips: 40, distanceKm: 1280, fuelLiters: 150.5, avgSpeedKmh: 53, efficiencyKml: 8.5, status: 'running' },
  { id: 'rep-12', vehicleNo: 'TN24WX1234', type: 'Truck', driver: 'Mani', trips: 48, distanceKm: 1740, fuelLiters: 328.3, avgSpeedKmh: 58, efficiencyKml: 5.3, status: 'running' },
]

const BAR_DATA = [
  { vehicle: 'TN01', label: 'TN-01', distance: 1840 },
  { vehicle: 'TN03', label: 'TN-03', distance: 1320 },
  { vehicle: 'TN06', label: 'TN-06', distance: 2150 },
  { vehicle: 'TN08', label: 'TN-08', distance: 980 },
  { vehicle: 'TN10', label: 'TN-10', distance: 1650 },
  { vehicle: 'TN12', label: 'TN-12', distance: 1120 },
  { vehicle: 'TN14', label: 'TN-14', distance: 1480 },
  { vehicle: 'TN16', label: 'TN-16', distance: 1920 },
]

export const ReportsPage: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState('Vehicle Summary')
  const [dateRange, setDateRange] = useState('01-09-2025 - 16-09-2025')
  const [exportFormat, setExportFormat] = useState('PDF')
  const [isExporting, setIsExporting] = useState(false)

  const reportTabs = [
    'Vehicle Summary',
    'Trip Report',
    'Distance Report',
    'Speed Report',
    'Idle Report',
    'GPS Status',
  ]

  const maxDistance = 2400 // Clean baseline ceiling for bar heights

  // Pagination hook for records table
  const {
    paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToPage,
  } = usePagination({
    items: REPORT_RECORDS,
    initialPageSize: 6,
    resetTrigger: activeReportTab,
  })

  const handleGenerateReport = () => {
    setIsExporting(true)
    setTimeout(() => {
      const csvHeader = 'Vehicle No,Type,Driver,Trips,Distance (km),Fuel (L),Avg Speed (km/h),Efficiency (km/L),Status\n'
      const csvRows = REPORT_RECORDS.map(
        (r) => `${r.vehicleNo},${r.type},${r.driver},${r.trips},${r.distanceKm},${r.fuelLiters},${r.avgSpeedKmh},${r.efficiencyKml},${r.status}`
      ).join('\n')

      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `FleetPro_${activeReportTab.replace(/\s+/g, '_')}_${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
      setIsExporting(false)
    }, 600)
  }

  const columns: Column<VehicleReportRecord>[] = [
    {
      key: 'vehicleNo',
      header: 'Vehicle No',
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900">{r.vehicleNo}</span>
          <span className="text-[10px] text-slate-400 block">{r.type}</span>
        </div>
      ),
    },
    {
      key: 'driver',
      header: 'Driver',
      render: (r) => <span className="font-medium text-slate-800">{r.driver}</span>,
    },
    {
      key: 'trips',
      header: 'Trips',
      render: (r) => <span className="font-bold text-slate-700">{r.trips}</span>,
    },
    {
      key: 'distanceKm',
      header: 'Distance',
      render: (r) => <span className="font-extrabold text-slate-900">{r.distanceKm.toLocaleString()} km</span>,
    },
    {
      key: 'fuelLiters',
      header: 'Fuel Used',
      render: (r) => <span className="font-semibold text-slate-700">{r.fuelLiters} L</span>,
    },
    {
      key: 'avgSpeedKmh',
      header: 'Avg Speed',
      render: (r) => <span className="font-semibold text-slate-700">{r.avgSpeedKmh} km/h</span>,
    },
    {
      key: 'efficiencyKml',
      header: 'Efficiency',
      render: (r) => (
        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
          {r.efficiencyKml} km/L
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => {
        let badge = 'bg-emerald-50 text-emerald-700 border-emerald-200'
        let dot = 'bg-emerald-500'
        if (r.status === 'idle') {
          badge = 'bg-amber-50 text-amber-700 border-amber-200'
          dot = 'bg-amber-500'
        } else if (r.status === 'parked') {
          badge = 'bg-blue-50 text-blue-700 border-blue-200'
          dot = 'bg-blue-500'
        } else if (r.status === 'offline') {
          badge = 'bg-rose-50 text-rose-700 border-rose-200'
          dot = 'bg-rose-500'
        }

        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {r.status}
          </span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Reports"
        subtitle="Performance metrics, fuel usage, and distance breakdown"
      />

      {/* Control Actions Row with Report Type Dropdown, Date Range & Export */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* 1. Report Type Dropdown */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 font-semibold shadow-2xs">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium">Report Type:</span>
            <select
              value={activeReportTab}
              onChange={(e) => setActiveReportTab(e.target.value)}
              className="bg-transparent text-blue-950 font-bold focus:outline-none cursor-pointer"
            >
              {reportTabs.map((tab) => (
                <option key={tab} value={tab} className="text-slate-800 font-medium">
                  {tab}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Date Range Dropdown */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500 font-medium">Period:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="01-09-2025 - 16-09-2025">01-09-2025 - 16-09-2025 (Last 16 Days)</option>
              <option value="01-09-2025 - 07-09-2025">01-09-2025 - 07-09-2025 (Week 1)</option>
              <option value="08-09-2025 - 15-09-2025">08-09-2025 - 15-09-2025 (Week 2)</option>
              <option value="01-08-2025 - 31-08-2025">01-08-2025 - 31-08-2025 (Previous Month)</option>
            </select>
          </div>

          {/* 3. Export Format Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Export Format:</span>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="font-bold text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="PDF">PDF - Fleet Report</option>
              <option value="CSV">CSV - Raw Data</option>
              <option value="Excel">Excel (.xlsx)</option>
            </select>
          </div>
        </div>

        <Button
          variant="primary"
          icon={<Download className="w-4 h-4" />}
          onClick={handleGenerateReport}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting Report...' : 'Generate Report'}
        </Button>
      </div>

      {/* 4 Summary Cards with Colorful Category Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Distance"
          value="18,460 km"
          trend={{ value: '12% vs last period', isPositive: true }}
          icon={<Route className="w-5 h-5 text-blue-600" />}
          iconColorClass="bg-blue-50 text-blue-600"
        />

        <StatsCard
          label="Total Trips"
          value="612"
          trend={{ value: '5% vs last period', isPositive: true }}
          icon={<Navigation className="w-5 h-5 text-emerald-600" />}
          iconColorClass="bg-emerald-50 text-emerald-600"
        />

        <StatsCard
          label="Avg. Speed"
          value="56 km/h"
          trend={{ value: '2% vs last period', isPositive: false }}
          icon={<Gauge className="w-5 h-5 text-amber-600" />}
          iconColorClass="bg-amber-50 text-amber-600"
        />

        <StatsCard
          label="Fuel Usage"
          value="3,420 L"
          trend={{ value: '8% vs last period', isPositive: true }}
          icon={<Fuel className="w-5 h-5 text-indigo-600" />}
          iconColorClass="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* Charts Grid: Distance Bar Chart + Vehicle Status Donut Chart with Balanced Heights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Distance by Vehicle Bar Chart */}
        <Card
          title="Distance by Vehicle"
          subtitle="Recorded kilometers across main fleet units"
          className="h-full flex flex-col justify-between"
          bodyClassName="p-5 sm:p-6 flex-1 flex flex-col justify-between"
        >
          {/* Subtle Benchmark Reference */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 border-b border-slate-100 pb-2">
            <span>Baseline: <strong>2,400 km Max</strong></span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Fleet Fleet Target Achieved
            </span>
          </div>

          {/* Bar Chart Canvas with Labels and Distance Values */}
          <div className="relative pt-4 pb-2">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 pb-7 pt-4">
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-dashed border-slate-300 w-full" />
            </div>

            <div className="h-52 flex items-end justify-between gap-2.5 sm:gap-4 relative z-10">
              {BAR_DATA.map((item) => {
                const heightPct = Math.round((item.distance / maxDistance) * 100)

                return (
                  <div key={item.vehicle} className="flex-1 flex flex-col items-center justify-end h-full group">
                    {/* Value Badge on Top */}
                    <span className="text-[10px] font-bold text-slate-600 mb-1.5 group-hover:text-blue-600 group-hover:scale-110 transition-transform">
                      {item.distance}
                    </span>

                    {/* Bar Pillar with Light Track Background */}
                    <div className="w-full bg-slate-100 rounded-t-xl h-36 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-xl group-hover:from-blue-700 group-hover:to-cyan-400 transition-all duration-500 shadow-xs"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>

                    {/* Bottom Label Badge */}
                    <div className="mt-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px] group-hover:bg-blue-50 group-hover:text-blue-700 transition">
                        {item.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Vehicle Status & Operational Efficiency Card */}
        <Card
          title="Vehicle Status & Fleet Efficiency"
          subtitle="Real-time operational distribution and fuel performance"
          className="h-full flex flex-col justify-between"
          bodyClassName="p-5 sm:p-6 flex-1 flex flex-col justify-between"
        >
          {/* Top Half: Donut Chart and Legend */}
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                {/* Running: 66.7% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray={`${(16 / 24) * 251.32} 251.32`}
                  strokeDashoffset="0"
                />
                {/* Idle: 20.8% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="12"
                  strokeDasharray={`${(5 / 24) * 251.32} 251.32`}
                  strokeDashoffset={`${-(16 / 24) * 251.32}`}
                />
                {/* Parked: 8.3% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDasharray={`${(2 / 24) * 251.32} 251.32`}
                  strokeDashoffset={`${-((16 + 5) / 24) * 251.32}`}
                />
                {/* Offline: 4.2% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="12"
                  strokeDasharray={`${(1 / 24) * 251.32} 251.32`}
                  strokeDashoffset={`${-((16 + 5 + 2) / 24) * 251.32}`}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-800 tracking-tight">24</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total</span>
              </div>
            </div>

            {/* Breakdown Legend */}
            <div className="space-y-2.5 w-full max-w-[200px] text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Running</span>
                </div>
                <div className="flex items-center gap-1.5 tabular-nums">
                  <span className="font-bold text-slate-800 w-6 text-right">16</span>
                  <span className="text-[11px] text-slate-400 w-14 text-right">(66.7%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Idle</span>
                </div>
                <div className="flex items-center gap-1.5 tabular-nums">
                  <span className="font-bold text-slate-800 w-6 text-right">5</span>
                  <span className="text-[11px] text-slate-400 w-14 text-right">(20.8%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-600 font-medium">Parked</span>
                </div>
                <div className="flex items-center gap-1.5 tabular-nums">
                  <span className="font-bold text-slate-800 w-6 text-right">2</span>
                  <span className="text-[11px] text-slate-400 w-14 text-right">(8.3%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600 font-medium">Offline</span>
                </div>
                <div className="flex items-center gap-1.5 tabular-nums">
                  <span className="font-bold text-slate-800 w-6 text-right">1</span>
                  <span className="text-[11px] text-slate-400 w-14 text-right">(4.2%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Half: Fleet Efficiency Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 pt-3 mt-2 border-t border-slate-100">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Fuel Economy</span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-800 mt-0.5 block">5.4 km/L</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Utilization</span>
              <span className="text-xs sm:text-sm font-extrabold text-emerald-600 mt-0.5 block">87.5%</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Avg Idle</span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-800 mt-0.5 block">24 min/day</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Report Table with Compact Rows and Dynamic Pagination */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
              {activeReportTab} Details
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive telemetry, trip log, and efficiency breakdown for the selected period
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={paginatedItems}
          keyExtractor={(r) => r.id}
          compact={true}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={goToPage}
          itemLabel="vehicles"
        />
      </div>
    </div>
  )
}

export default ReportsPage
