import React, { useState } from 'react'
import { Plus, Search, Eye, Trash2, Edit } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/common/Button'
import AddVehicleModal from '../components/AddVehicleModal'
import VehicleDetailsModal from '../components/VehicleDetailsModal'
import DataTable, { Column } from '@/components/tables/DataTable'
import Pagination from '@/components/tables/Pagination'
import { useVehicles } from '../hooks/useVehicles'
import { useLiveTracking } from '@/features/tracking/hooks/useLiveTracking'
import { Vehicle } from '@/types/vehicle'
import { getStatusBadgeConfig, formatSpeed } from '@/utils/formatUtils'
import { usePagination } from '@/hooks/usePagination'

export const VehiclesPage: React.FC = () => {
  const { vehicles, filters, setFilter, addVehicle, deleteVehicle } = useVehicles()
  const { liveTelemetry } = useLiveTracking()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [inspectVehicle, setInspectVehicle] = useState<Vehicle | null>(null)

  // Use bulletproof pagination hook with reset trigger on filter changes
  const {
    paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToPage,
  } = usePagination({
    items: vehicles,
    initialPageSize: 8,
    resetTrigger: `${filters.search}_${filters.status}_${filters.type}`,
  })

  const columns: Column<Vehicle>[] = [
    {
      key: 'plateNumber',
      header: 'Vehicle No',
      render: (veh) => (
        <span className="font-bold text-slate-900">{veh.plateNumber}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (veh) => (
        <span className="capitalize text-slate-600 font-medium">{veh.type}</span>
      ),
    },
    {
      key: 'driver',
      header: 'Driver',
      render: (veh) => (
        <span className="text-slate-800 font-medium">{veh.assignedDriver?.name || 'Unassigned'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (veh) => {
        const config = getStatusBadgeConfig(veh.status)
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${config.bg} ${config.text} ${config.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>
        )
      },
    },
    {
      key: 'speed',
      header: 'Speed',
      render: (veh) => {
        const spd = liveTelemetry[veh.id]?.location?.speedKmh ?? veh.currentSpeedKmh
        return <span className="font-semibold text-slate-700">{formatSpeed(spd)}</span>
      },
    },
    {
      key: 'location',
      header: 'Location',
      render: (veh) => (
        <span className="text-slate-600 font-medium">{veh.locationCity || 'Chennai'}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (veh) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setInspectVehicle(veh)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setInspectVehicle(veh)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteVehicle(veh.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Vehicles"
        subtitle="Manage fleet inventory, hardware IMEI telemetry, and driver allocations"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Vehicle
          </Button>
        }
      />

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="idle">Idle</option>
            <option value="parked">Parked</option>
            <option value="offline">Offline</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilter('type', e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="truck">Trucks</option>
            <option value="car">Cars</option>
            <option value="bus">Buses</option>
            <option value="van">Vans</option>
            <option value="lorry">Lorries</option>
          </select>
        </div>
      </div>

      {/* Clean White Table with Dynamic Sliced Pagination */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
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
          itemLabel="vehicles"
        />
      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addVehicle}
      />

      {/* Inspect Vehicle Modal */}
      <VehicleDetailsModal
        vehicle={inspectVehicle}
        isOpen={!!inspectVehicle}
        onClose={() => setInspectVehicle(null)}
      />
    </div>
  )
}

export default VehiclesPage
