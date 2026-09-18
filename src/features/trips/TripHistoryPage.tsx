import React, { useState, useMemo } from 'react'
import { Calendar, Download, MapPin } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/common/Button'
import DataTable, { Column } from '@/components/tables/DataTable'
import Pagination from '@/components/tables/Pagination'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import { usePagination } from '@/hooks/usePagination'

interface HistoricTrip {
  id: string
  date: string
  vehicleNo: string
  startLocation: string
  endLocation: string
  distanceKm: number
  durationStr: string
}

// Full 24 Historic Trips across Tamil Nadu
const FULL_HISTORIC_TRIPS: HistoricTrip[] = [
  // Page 1 Trips
  { id: 'h-01', date: '16-09-2025', vehicleNo: 'TN01AB1234', startLocation: 'Chennai', endLocation: 'Kanchipuram', distanceKm: 76.4, durationStr: '1h 45m' },
  { id: 'h-02', date: '15-09-2025', vehicleNo: 'TN03CD5678', startLocation: 'Vellore', endLocation: 'Chennai', distanceKm: 132.6, durationStr: '3h 22m' },
  { id: 'h-03', date: '14-09-2025', vehicleNo: 'TN06EF9012', startLocation: 'Tiruvallur', endLocation: 'Chennai', distanceKm: 45.2, durationStr: '1h 10m' },
  { id: 'h-04', date: '13-09-2025', vehicleNo: 'TN08GH3456', startLocation: 'Chengalpattu', endLocation: 'Vellore', distanceKm: 98.7, durationStr: '2h 15m' },
  { id: 'h-05', date: '12-09-2025', vehicleNo: 'TN10IJ7890', startLocation: 'Chennai', endLocation: 'Tiruvallur', distanceKm: 52.8, durationStr: '58m' },
  { id: 'h-06', date: '11-09-2025', vehicleNo: 'TN12KL3456', startLocation: 'Kanchipuram', endLocation: 'Chennai', distanceKm: 74.1, durationStr: '1h 38m' },
  { id: 'h-07', date: '10-09-2025', vehicleNo: 'TN14MN1234', startLocation: 'Salem', endLocation: 'Erode', distanceKm: 64.3, durationStr: '1h 25m' },
  { id: 'h-08', date: '09-09-2025', vehicleNo: 'TN16OP5678', startLocation: 'Thiruvannamalai', endLocation: 'Vellore', distanceKm: 85.0, durationStr: '1h 55m' },

  // Page 2 Trips
  { id: 'h-09', date: '08-09-2025', vehicleNo: 'TN01AB1234', startLocation: 'Chennai Central', endLocation: 'Sriperumbudur', distanceKm: 42.1, durationStr: '1h 05m' },
  { id: 'h-10', date: '07-09-2025', vehicleNo: 'TN03CD5678', startLocation: 'Tiruvallur', endLocation: 'Kanchipuram', distanceKm: 54.0, durationStr: '1h 18m' },
  { id: 'h-11', date: '06-09-2025', vehicleNo: 'TN06EF9012', startLocation: 'Chennai Harbor', endLocation: 'Gummidipoondi', distanceKm: 48.6, durationStr: '1h 12m' },
  { id: 'h-12', date: '05-09-2025', vehicleNo: 'TN08GH3456', startLocation: 'Vellore Fort', endLocation: 'Ranipet', distanceKm: 28.3, durationStr: '42m' },
  { id: 'h-13', date: '04-09-2025', vehicleNo: 'TN10IJ7890', startLocation: 'Salem Steel Plant', endLocation: 'Namakkal', distanceKm: 55.4, durationStr: '1h 20m' },
  { id: 'h-14', date: '03-09-2025', vehicleNo: 'TN12KL3456', startLocation: 'Chengalpattu Junction', endLocation: 'Tambaram', distanceKm: 31.2, durationStr: '48m' },
  { id: 'h-15', date: '02-09-2025', vehicleNo: 'TN14MN1234', startLocation: 'Thiruvannamalai', endLocation: 'Gingee', distanceKm: 39.8, durationStr: '1h 02m' },
  { id: 'h-16', date: '01-09-2025', vehicleNo: 'TN16OP5678', startLocation: 'Tiruvallur Hub', endLocation: 'Arakkonam', distanceKm: 36.5, durationStr: '52m' },

  // Page 3 Trips
  { id: 'h-17', date: '31-08-2025', vehicleNo: 'TN01AB1234', startLocation: 'Chennai North Dock', endLocation: 'Ennore Port', distanceKm: 22.4, durationStr: '38m' },
  { id: 'h-18', date: '30-08-2025', vehicleNo: 'TN03CD5678', startLocation: 'Tiruvallur East', endLocation: 'Avadi', distanceKm: 24.1, durationStr: '40m' },
  { id: 'h-19', date: '29-08-2025', vehicleNo: 'TN06EF9012', startLocation: 'Kanchipuram Silk Park', endLocation: 'Chengalpattu', distanceKm: 35.8, durationStr: '54m' },
  { id: 'h-20', date: '28-08-2025', vehicleNo: 'TN08GH3456', startLocation: 'Vellore Tech Zone', endLocation: 'Katpadi', distanceKm: 12.0, durationStr: '22m' },
  { id: 'h-21', date: '27-08-2025', vehicleNo: 'TN10IJ7890', startLocation: 'Salem Junction', endLocation: 'Attur', distanceKm: 51.2, durationStr: '1h 14m' },
  { id: 'h-22', date: '26-08-2025', vehicleNo: 'TN12KL3456', startLocation: 'Chengalpattu SIPCOT', endLocation: 'Mahabalipuram', distanceKm: 29.5, durationStr: '45m' },
  { id: 'h-23', date: '25-08-2025', vehicleNo: 'TN14MN1234', startLocation: 'Thiruvannamalai Ring Road', endLocation: 'Polur', distanceKm: 34.2, durationStr: '50m' },
  { id: 'h-24', date: '24-08-2025', vehicleNo: 'TN16OP5678', startLocation: 'Chennai Airport Bay', endLocation: 'Guindy', distanceKm: 14.8, durationStr: '28m' },
]

export const TripHistoryPage: React.FC = () => {
  const { vehicles } = useVehicles()
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all')

  // Filter trips if user selects a specific vehicle, or show all 24
  const filteredTrips = useMemo(() => {
    if (selectedVehicle === 'all') return FULL_HISTORIC_TRIPS
    return FULL_HISTORIC_TRIPS.filter((t) => t.vehicleNo === selectedVehicle)
  }, [selectedVehicle])

  // Bulletproof reactive pagination hook
  const {
    paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToPage,
  } = usePagination({
    items: filteredTrips,
    initialPageSize: 8,
    resetTrigger: selectedVehicle,
  })

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
    const rows = filteredTrips.map((t) => [t.date, t.vehicleNo, t.startLocation, t.endLocation, t.distanceKm, t.durationStr])
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

      {/* Filter and Export Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Vehicle Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Vehicle:</span>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Vehicles (24)</option>
              {vehicles.slice(0, 8).map((v) => (
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

      {/* Trips Table with Fully Reactive Paginated Data */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
        <DataTable
          columns={columns}
          data={paginatedItems}
          keyExtractor={(t) => t.id}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={goToPage}
          itemLabel="trips"
        />
      </div>
    </div>
  )
}

export default TripHistoryPage
