import React, { useState } from 'react'
import { Search, Navigation, Battery, Fuel, Radio } from 'lucide-react'
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
      v.assignedDriver?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-80 h-full flex flex-col bg-slate-900/90 border-r border-slate-800 backdrop-blur-xl text-left">
      {/* Header & Search */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Fleet Tracking ({vehicles.length})
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">LIVE FEED</span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search units..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Vehicle List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 p-2 space-y-1">
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
                  ? 'bg-cyan-500/15 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className={`text-xs font-semibold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                  {veh.name}
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                >
                  <span className={`w-1 h-1 rounded-full ${statusConfig.dot}`} />
                  {statusConfig.label}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  {veh.plateNumber}
                </span>
                <span className="font-bold text-white">
                  {formatSpeed(speed)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/40">
                <span>{veh.assignedDriver?.name || 'Unassigned'}</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5 text-blue-400">
                    <Fuel className="w-3 h-3" /> {telemetry?.fuelLevelPercent ?? 75}%
                  </span>
                  <span className="flex items-center gap-0.5 text-emerald-400">
                    <Battery className="w-3 h-3" /> {telemetry?.batteryPercent ?? 98}%
                  </span>
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
