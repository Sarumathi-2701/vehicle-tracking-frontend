import React, { useState } from 'react'
import { Calendar, Download, Search, Route, MapPin } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import DataTable, { Column } from '@/components/tables/DataTable'
import Pagination from '@/components/tables/Pagination'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'

interface HistoricTrip {
  id: string
  date: string
  vehicleNo: string
  startLocation: string
  endLocation: string
  distanceKm: number
  durationStr: string
}

const HISTORIC_TRIPS: HistoricTrip[] = [
  { id: 'h-1', date: '16-09-2025', vehicleNo: 'TN01AB1234', startLocation: 'Chennai', endLocation: 'Kanchipuram', distanceKm: 76.4, durationStr: '1h 45m' },
  { id: 'h-2', date: '15-09-2025', vehicleNo: 'TN03CD5678', startLocation: 'Vellore', endLocation: 'Chennai', distanceKm: 132.6, durationStr: '3h 22m' },
  { id: 'h-3', date: '14-09-2025', vehicleNo: 'TN06EF9012', startLocation: 'Tiruvallur', endLocation: 'Chennai', distanceKm: 45.2, durationStr: '1h 10m' },
  { id: 'h-4', date: '13-09-2025', vehicleNo: 'TN08GH3456', startLocation: 'Chengalpattu', endLocation: 'Vellore', distanceKm: 98.7, durationStr: '2h 15m' },
  { id: 'h-5', date: '12-09-2025', vehicleNo: 'TN10IJ7890', startLocation: 'Chennai', endLocation: 'Tiruvallur', distanceKm: 52.8, durationStr: '58m' },
  { id: 'h-6', date: '11-09-2025', vehicleNo: 'TN12KL3456', startLocation: 'Kanchipuram', endLocation: 'Chennai', distanceKm: 74.1, durationStr: '1h 38m' },
  { id: 'h-7', date: '10-09-2025', vehicleNo: 'TN14MN1234', startLocation: 'Salem', endLocation: 'Erode', distanceKm: 64.3, durationStr: '1h 25m' },
  { id: 'h-8', date: '09-09-2025', vehicleNo: 'TN16OP5678', startLocation: 'Thiruvannamalai', endLocation: 'Vellore', distanceKm: 85.0, durationStr: '1h 55m' },
]

export const TripHistoryPage: React.FC = () => {
  const { vehicles } = useVehicles()
  const [selectedVehicle, setSelectedVehicle] = useState('TN01AB1234')
  const [currentPage, setCurrentPage] = useState(1)

  const columns: Column<HistoricTrip>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (t) => <span className="text-slate-600 font-medium">{t.date}</span>,
    },
    {
      key: 'vehicleNo',
      header: 'Vehicle No',
      render: (t) => <span className="font-bold text-slate-900">{t.vehicleNo}</span>,
    },
    {
      key: 'startLocation',
      header: 'Start Location',
      render: (t) => (
        <span className="flex items-center gap-1.5 text-slate-700 font-medium">
          <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {t.startLocation}
        </span>
      ),
    },
    {
      key: 'endLocation',
      header: 'End Location',
      render: (t) => (
        <span className="flex items-center gap-1.5 text-slate-700 font-medium">
          <MapPin className="w-3.5 h-3.5 text-rose-500" /> {t.endLocation}
        </span>
      ),
    },
    {
      key: 'distanceKm',
      header: 'Distance',
      render: (t) => <span className="font-bold text-slate-800">{t.distanceKm} km</span>,
    },
    {
      key: 'durationStr',
      header: 'Duration',
      render: (t) => <span className="text-slate-600 font-medium">{t.durationStr}</span>,
    },
  ]

  const exportCSV = () => {
    const headers = ['Date', 'Vehicle No', 'Start Location', 'End Location', 'Distance (km)', 'Duration']
    const rows = HISTORIC_TRIPS.map((t) => [t.date, t.vehicleNo, t.startLocation, t.endLocation, t.distanceKm, t.durationStr])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `trips_history_${selectedVehicle}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Trips / History"
        subtitle="Historical trip logs, route replay records, and mileage logs"
      />

      {/* Filter and Export Bar matching Mockup */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Vehicle Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Vehicle:</span>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.plateNumber}>
                  {v.plateNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Picker */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-800">01-09-2025 - 16-09-2025</span>
          </div>
        </div>

        <Button
          variant="primary"
          icon={<Download className="w-4 h-4" />}
          onClick={exportCSV}
        >
          Export
        </Button>
      </div>

      {/* Trips Table matching Mockup */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
        <DataTable
          columns={columns}
          data={HISTORIC_TRIPS}
          keyExtractor={(t) => t.id}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={3}
          totalItems={24}
          pageSize={8}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export default TripHistoryPage
