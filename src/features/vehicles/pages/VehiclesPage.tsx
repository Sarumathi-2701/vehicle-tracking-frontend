import React, { useState } from 'react'
import { Plus, Search, Filter, LayoutGrid, List, Truck } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/common/Button'
import VehicleCard from '../components/VehicleCard'
import AddVehicleModal from '../components/AddVehicleModal'
import DataTable, { Column } from '@/components/tables/DataTable'
import Pagination from '@/components/tables/Pagination'
import { useVehicles } from '../hooks/useVehicles'
import { useLiveTracking } from '@/features/tracking/hooks/useLiveTracking'
import { Vehicle } from '@/types/vehicle'
import { getStatusBadgeConfig, formatSpeed } from '@/utils/formatUtils'
import { usePagination } from '@/hooks/usePagination'

export const VehiclesPage: React.FC = () => {
  const { vehicles, filters, setFilter, resetFilters, addVehicle } = useVehicles()
  const { liveTelemetry, setSelectedVehicleId } = useLiveTracking()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const {
    paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToPage,
    setPageSize,
  } = usePagination({ items: vehicles, initialPageSize: 6 })

  const columns: Column<Vehicle>[] = [
    {
      key: 'name',
      header: 'Vehicle Name & Info',
      render: (veh) => (
        <div>
          <span className="font-semibold text-white block">{veh.name}</span>
          <span className="text-xs text-slate-400">{veh.make} {veh.model} ({veh.year})</span>
        </div>
      ),
    },
    {
      key: 'plateNumber',
      header: 'License Plate',
      render: (veh) => (
        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200">
          {veh.plateNumber}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (veh) => {
        const config = getStatusBadgeConfig(veh.status)
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${config.bg} ${config.text} ${config.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>
        )
      },
    },
    {
      key: 'speed',
      header: 'Current Speed',
      render: (veh) => {
        const spd = liveTelemetry[veh.id]?.location?.speedKmh ?? veh.currentSpeedKmh
        return <span className="font-semibold text-white">{formatSpeed(spd)}</span>
      },
    },
    {
      key: 'driver',
      header: 'Driver',
      render: (veh) => (
        <div>
          <span className="text-slate-200 block">{veh.assignedDriver?.name || 'Unassigned'}</span>
          {veh.assignedDriver?.phone && (
            <span className="text-[10px] text-slate-500">{veh.assignedDriver.phone}</span>
          )}
        </div>
      ),
    },
    {
      key: 'odometer',
      header: 'Odometer',
      render: (veh) => (
        <span className="font-mono text-xs text-slate-400">
          {Math.round(liveTelemetry[veh.id]?.odometerKm ?? veh.odometerKm).toLocaleString()} km
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'text-right',
      render: (veh) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedVehicleId(veh.id)}
        >
          Track
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Fleet Vehicle Registry"
        subtitle="Manage fleet units, GPS hardware telemetry sensors, and driver assignments"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Enroll New Vehicle
          </Button>
        }
      />

      {/* Filter and View Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by vehicle name, plate or driver..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status / Type Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
            <select
              value={filters.status}
              onChange={(e) => setFilter('status', e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Statuses</option>
              <option value="moving">Moving</option>
              <option value="idle">Idle</option>
              <option value="stopped">Stopped</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Type:</span>
            <select
              value={filters.type}
              onChange={(e) => setFilter('type', e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Types</option>
              <option value="truck">Trucks</option>
              <option value="van">Vans</option>
              <option value="bus">Buses</option>
              <option value="car">Cars</option>
            </select>
          </div>

          {/* Grid / List toggle */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'table' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Grid or Table */}
      {viewMode === 'grid' ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedItems.map((veh) => (
              <VehicleCard
                key={veh.id}
                vehicle={veh}
                telemetry={liveTelemetry[veh.id]}
                onTrack={() => setSelectedVehicleId(veh.id)}
              />
            ))}
          </div>

          <div className="mt-6 rounded-2xl overflow-hidden border border-slate-800">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={goToPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <DataTable
            columns={columns}
            data={paginatedItems}
            keyExtractor={(veh) => veh.id}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={goToPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addVehicle}
      />
    </div>
  )
}

export default VehiclesPage
