import React, { useState } from 'react'
import { Search, Navigation, MapPin } from 'lucide-react'
import { Vehicle } from '@/types/vehicle'
import { VehicleTelemetry } from '@/types/gps'
import { getStatusBadgeConfig, formatSpeed } from '@/utils/formatUtils'

export interface VehicleListSidebarProps {
  vehicles: Vehicle[]
  liveTelemetry: Record<string, VehicleTelemetry>
  selectedVehicleId: string | null
  onSelectVehicle: (id: string) => void
}

export const VehicleListSidebar: React.FC<VehicleListSidebarProps> = ({
  vehicles,
  liveTelemetry,
  selectedVehicleId,
  onSelectVehicle,
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.locationCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.assignedDriver?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-80 h-full flex flex-col bg-white border-r border-slate-200 text-left">
      {/* Header & Search */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">
            Vehicles ({vehicles.length})
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
            Real Time
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Vehicle List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
        {filtered.map((veh) => {
          const telemetry = liveTelemetry[veh.id]
          const isSelected = veh.id === selectedVehicleId
          const statusConfig = getStatusBadgeConfig(veh.status)
          const speed = telemetry?.location?.speedKmh ?? veh.currentSpeedKmh

          return (
            <div
              key={veh.id}
              onClick={() => onSelectVehicle(veh.id)}
              className={`p-3 rounded-xl transition cursor-pointer text-left ${
                isSelected
                  ? 'bg-blue-50/70 border border-blue-200 shadow-xs'
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                  {veh.plateNumber}
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                  {statusConfig.label}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span>Speed: <strong className="text-slate-700 font-semibold">{formatSpeed(speed)}</strong></span>
                  <span>Driver: <strong className="text-slate-700">{veh.assignedDriver?.name || 'Kumar'}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-[10px] pt-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{veh.locationCity || 'Chennai'}, Tamil Nadu</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VehicleListSidebar
