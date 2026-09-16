import React, { useState } from 'react'
import { Download, Calendar, BarChart3, TrendingUp, Fuel, Award } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import StatsCard from '@/components/common/StatsCard'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import { formatDistance, formatSpeed } from '@/utils/formatUtils'

export const ReportsPage: React.FC = () => {
  const { vehicles } = useVehicles()
  const [dateRange, setDateRange] = useState('7d')

  const exportCSV = () => {
    const headers = ['Vehicle ID', 'Vehicle Name', 'Plate', 'Type', 'Driver', 'Odometer (km)', 'Current Speed']
    const rows = vehicles.map((v) => [
      v.id,
      v.name,
      v.plateNumber,
      v.type,
      v.assignedDriver?.name || 'Unassigned',
      v.odometerKm,
      v.currentSpeedKmh,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `fleet_telematics_report_${dateRange}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Fleet Telematics Reports"
        subtitle="Performance analytics, fuel efficiency audit, and compliance exports"
        action={
          <Button
            variant="primary"
            icon={<Download className="w-4 h-4" />}
            onClick={exportCSV}
          >
            Export CSV Report
          </Button>
        }
      />

      {/* Date Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span>Reporting Period:</span>
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: 'quarter', label: 'This Quarter' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setDateRange(item.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                dateRange === item.id
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Fleet Mileage"
          value="18,490 km"
          trend={{ value: '14.2%', isPositive: true }}
          icon={<BarChart3 className="w-5 h-5" />}
          iconColorClass="bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
        />

        <StatsCard
          label="Total Fuel Consumed"
          value="4,820 L"
          subValue="26.1 L/100km avg"
          icon={<Fuel className="w-5 h-5" />}
          iconColorClass="bg-blue-500/10 text-blue-400 border-blue-500/20"
        />

        <StatsCard
          label="Fleet Utilization"
          value="88.4%"
          trend={{ value: '4.1%', isPositive: true }}
          icon={<TrendingUp className="w-5 h-5" />}
          iconColorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        />

        <StatsCard
          label="Safety Score"
          value="94/100"
          subValue="Low violation index"
          icon={<Award className="w-5 h-5" />}
          iconColorClass="bg-purple-500/10 text-purple-400 border-purple-500/20"
        />
      </div>

      {/* Vehicle Detailed Breakdown Table */}
      <Card title="Vehicle Telematics Performance Breakdown" subtitle="Detailed mileage, running hours, and efficiency scores">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Distance</th>
                <th className="px-4 py-3">Engine Hours</th>
                <th className="px-4 py-3">Fuel Economy</th>
                <th className="px-4 py-3">Safety Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {vehicles.map((v, i) => (
                <tr key={v.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-white block">{v.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{v.plateNumber}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    {v.assignedDriver?.name || 'Unassigned'}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">
                    {formatDistance(Math.round(v.odometerKm / 10))}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {(48 + i * 12)} hrs
                  </td>
                  <td className="px-4 py-3 text-cyan-400 font-mono">
                    {(24.5 + (i % 3) * 1.8).toFixed(1)} L/100km
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {96 - i * 2}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default ReportsPage
