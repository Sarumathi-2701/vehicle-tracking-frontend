import React from 'react'
import { Link } from 'react-router-dom'
import { Truck, User, Battery, Fuel, Gauge, Navigation } from 'lucide-react'
import { Vehicle } from '@/types/vehicle'
import { VehicleTelemetry } from '@/types/gps'
import { getStatusBadgeConfig, formatSpeed } from '@/utils/formatUtils'

export interface VehicleCardProps {
  vehicle: Vehicle
  telemetry?: VehicleTelemetry
  onTrack?: () => void
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, telemetry, onTrack }) => {
  const statusConfig = getStatusBadgeConfig(vehicle.status)
  const speed = telemetry?.location?.speedKmh ?? vehicle.currentSpeedKmh

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition duration-200 backdrop-blur-md flex flex-col justify-between text-left group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/30 transition">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm tracking-tight group-hover:text-cyan-400 transition">
                {vehicle.name}
              </h4>
              <span className="text-xs text-slate-400 font-mono">{vehicle.plateNumber}</span>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
            {statusConfig.label}
          </span>
        </div>

        {/* Specs snippet */}
        <p className="text-xs text-slate-400 mb-4">
          {vehicle.make} {vehicle.model} ({vehicle.year}) • <span className="capitalize">{vehicle.type}</span>
        </p>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span>Speed: <strong className="text-white font-semibold">{formatSpeed(speed)}</strong></span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Fuel className="w-4 h-4 text-blue-400" />
            <span>Fuel: <strong className="text-white font-semibold">{telemetry?.fuelLevelPercent ?? 75}%</strong></span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Battery className="w-4 h-4 text-emerald-400" />
            <span>Battery: <strong className="text-white font-semibold">{telemetry?.batteryPercent ?? 98}%</strong></span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <User className="w-4 h-4 text-purple-400" />
            <span className="truncate">Driver: <strong className="text-white font-semibold">{vehicle.assignedDriver?.name || 'None'}</strong></span>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-4 pt-2 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-mono">
          IMEI: {vehicle.deviceImei}
        </span>

        <Link
          to="/tracking"
          onClick={onTrack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition"
        >
          <Navigation className="w-3.5 h-3.5" />
          Live Track
        </Link>
      </div>
    </div>
  )
}

export default VehicleCard
