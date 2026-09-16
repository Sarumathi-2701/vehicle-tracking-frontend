import React from 'react'
import {
  Gauge,
  Zap,
  Battery,
  Fuel,
  Thermometer,
  Compass,
  MapPin,
  User,
  Phone,
  Radio,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import { Vehicle } from '@/types/vehicle'
import { VehicleTelemetry } from '@/types/gps'
import { headingToCompass } from '@/utils/gpsUtils'
import { formatSpeed } from '@/utils/formatUtils'
import { timeAgo } from '@/utils/dateUtils'

export interface TelemetrySidebarProps {
  vehicle: Vehicle | null
  telemetry: VehicleTelemetry | null
}

export const TelemetrySidebar: React.FC<TelemetrySidebarProps> = ({ vehicle, telemetry }) => {
  if (!vehicle) {
    return (
      <div className="w-80 h-full bg-slate-900/90 border-l border-slate-800 p-6 flex items-center justify-center text-slate-500 text-xs text-center">
        Select a vehicle on the map or list to view real-time diagnostics.
      </div>
    )
  }

  const speed = telemetry?.location?.speedKmh ?? vehicle.currentSpeedKmh
  const heading = telemetry?.location?.heading ?? 0
  const compass = headingToCompass(heading)
  const isIgnitionOn = telemetry?.ignition ?? (vehicle.status === 'moving' || vehicle.status === 'idle')

  return (
    <div className="w-80 h-full flex flex-col bg-slate-900/90 border-l border-slate-800 backdrop-blur-xl text-left overflow-y-auto">
      {/* Vehicle Identity */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Telemetry Feed
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isIgnitionOn
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isIgnitionOn ? 'IGNITION ON' : 'IGNITION OFF'}
          </span>
        </div>

        <h3 className="font-bold text-white text-base mt-2">{vehicle.name}</h3>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          {vehicle.plateNumber} • VIN: {vehicle.vin.slice(-8)}
        </p>
      </div>

      {/* Speedometer Gauge Widget */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/40 text-center">
        <div className="inline-flex flex-col items-center justify-center p-6 rounded-full border-4 border-cyan-500/30 bg-slate-900/80 shadow-2xl shadow-cyan-500/10 w-36 h-36 mx-auto relative">
          <span className="text-3xl font-black text-white tabular-nums tracking-tight">
            {Math.round(speed)}
          </span>
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">km/h</span>
          <div className="text-[10px] text-slate-400 mt-1">Limit: {vehicle.speedLimitKmh}</div>
        </div>

        {speed > vehicle.speedLimitKmh && (
          <div className="mt-3 py-1 px-2.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold animate-pulse">
            ⚠️ Overspeeding Detected!
          </div>
        )}
      </div>

      {/* Diagnostic Sensors Grid */}
      <div className="p-4 space-y-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Live Sensor Readouts
        </h4>

        {/* Location & GPS Fix */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> GPS Address
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-ping" /> {telemetry?.location?.satellitesCount ?? 14} Sats
            </span>
          </div>
          <p className="text-slate-200 text-xs font-medium">
            {telemetry?.location?.address || 'MG Road Transit Sector, Bangalore'}
          </p>
          <div className="text-[10px] font-mono text-slate-500 flex justify-between">
            <span>Lat: {telemetry?.location?.lat?.toFixed(4) ?? '12.9716'}</span>
            <span>Lng: {telemetry?.location?.lng?.toFixed(4) ?? '77.5946'}</span>
          </div>
        </div>

        {/* Fuel & Battery */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="flex items-center gap-1"><Fuel className="w-3.5 h-3.5 text-blue-400" /> Fuel</span>
              <span className="font-bold text-white">{telemetry?.fuelLevelPercent ?? 75}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${telemetry?.fuelLevelPercent ?? 75}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="flex items-center gap-1"><Battery className="w-3.5 h-3.5 text-emerald-400" /> Battery</span>
              <span className="font-bold text-white">{telemetry?.batteryVolts ?? 24.2}V</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${telemetry?.batteryPercent ?? 95}%` }}
              />
            </div>
          </div>
        </div>

        {/* Heading & Temp */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>Heading</span>
            </div>
            <span className="font-bold text-white font-mono">{compass} ({Math.round(heading)}°)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>Engine</span>
            </div>
            <span className="font-bold text-white font-mono">{telemetry?.engineTempCelsius ?? 88}°C</span>
          </div>
        </div>

        {/* Driver Card */}
        {vehicle.assignedDriver && (
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Driver</span>
              <span className="text-[10px] text-cyan-400">Verified</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">{vehicle.assignedDriver.name}</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Phone className="w-2.5 h-2.5" /> {vehicle.assignedDriver.phone}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Last telemetry ping */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> Last Ping:
          </span>
          <span className="font-mono">
            {timeAgo(telemetry?.location?.timestamp || vehicle.lastUpdated)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TelemetrySidebar
