import React from 'react'
import { Link } from 'react-router-dom'
import { Truck, Navigation, Route } from 'lucide-react'
import { Vehicle } from '@/types/vehicle'
import { VehicleTelemetry } from '@/types/gps'
import { formatSpeed, getStatusBadgeConfig } from '@/utils/formatUtils'
import Button from '@/components/common/Button'

export interface TelemetrySidebarProps {
  vehicle: Vehicle | null
  telemetry: VehicleTelemetry | null
  onOpenDetailsModal?: () => void
}

export const TelemetrySidebar: React.FC<TelemetrySidebarProps> = ({
  vehicle,
  telemetry,
  onOpenDetailsModal,
}) => {
  if (!vehicle) {
    return (
      <div className="w-80 h-full bg-white border-l border-slate-200 p-6 flex items-center justify-center text-slate-400 text-xs text-center">
        Select a vehicle to view live telemetry.
      </div>
    )
  }

  const speed = telemetry?.location?.speedKmh ?? vehicle.currentSpeedKmh
  const heading = telemetry?.location?.heading ?? vehicle.headingDeg ?? 120
  const statusConfig = getStatusBadgeConfig(vehicle.status)
  const lat = telemetry?.location?.lat ?? vehicle.latitude ?? 13.0827
  const lng = telemetry?.location?.lng ?? vehicle.longitude ?? 80.2707

  return (
    <div className="w-80 h-full flex flex-col bg-white border-l border-slate-200 text-left overflow-y-auto">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Vehicle Details</h3>
        <Link to="/vehicles" className="text-xs text-blue-600 hover:underline font-semibold">
          View All
        </Link>
      </div>

      {/* Vehicle Identity Card */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
          <Truck className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
            {vehicle.plateNumber}
          </h4>
          <p className="text-xs text-slate-500 font-medium capitalize">
            {vehicle.type} - {vehicle.make} {vehicle.model}
          </p>
        </div>
      </div>

      {/* Status Pill */}
      <div className="px-5 py-3 border-b border-slate-100">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
        >
          <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
          {statusConfig.label}
        </span>
      </div>

      {/* Metric List matching Mockup */}
      <div className="p-5 space-y-3.5 text-xs">
        <div className="flex justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Speed</span>
          <span className="font-bold text-slate-800">{formatSpeed(speed)}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Direction</span>
          <span className="font-bold text-slate-800">{Math.round(heading)}°</span>
        </div>

        <div className="flex justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Last Update</span>
          <span className="font-medium text-slate-800">{vehicle.lastUpdated || '2 min ago'}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-slate-100 font-mono text-[11px]">
          <span className="text-slate-500 font-sans">Lat:</span>
          <span className="font-semibold text-slate-800">{lat.toFixed(5)}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-slate-100 font-mono text-[11px]">
          <span className="text-slate-500 font-sans">Long:</span>
          <span className="font-semibold text-slate-800">{lng.toFixed(5)}</span>
        </div>
      </div>

      {/* Action Buttons matching Mockup */}
      <div className="p-5 mt-auto space-y-2.5">
        <Button
          variant="primary"
          className="w-full justify-center"
          onClick={onOpenDetailsModal}
        >
          View Details
        </Button>

        <Link to="/trips" className="block w-full">
          <Button
            variant="outline"
            className="w-full justify-center"
            icon={<Route className="w-4 h-4 text-blue-600" />}
          >
            Track History
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default TelemetrySidebar
