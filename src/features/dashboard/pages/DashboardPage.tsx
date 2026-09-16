import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Truck, Navigation, Route, AlertTriangle, ArrowRight, Gauge, Fuel } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import StatsCard from '@/components/common/StatsCard'
import FleetStatusChart from '../components/FleetStatusChart'
import RecentAlertsFeed from '../components/RecentAlertsFeed'
import VehicleMap from '@/components/map/VehicleMap'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import { useLiveTracking } from '@/features/tracking/hooks/useLiveTracking'
import { dashboardService } from '../services/dashboardService'
import { DashboardMetrics } from '../types'
import { getStatusBadgeConfig, formatSpeed } from '@/utils/formatUtils'

export const DashboardPage: React.FC = () => {
  const { vehicles, stats } = useVehicles()
  const { liveTelemetry, alerts, acknowledgeAlert, selectedVehicleId, setSelectedVehicleId } = useLiveTracking()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)

  useEffect(() => {
    dashboardService.getMetrics().then(setMetrics)
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet Operations Dashboard"
        subtitle="Real-time telematics, status tracking, and dispatch analytics"
        action={
          <Link
            to="/tracking"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            Launch Live Operations Map
          </Link>
        }
      />

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Fleet Vehicles"
          value={stats.total}
          subValue={`${stats.moving} on road`}
          icon={<Truck className="w-5 h-5" />}
          iconColorClass="bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
        />

        <StatsCard
          label="Active Moving"
          value={stats.moving}
          trend={{ value: '12%', isPositive: true }}
          icon={<Navigation className="w-5 h-5" />}
          iconColorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        />

        <StatsCard
          label="Distance Today"
          value={`${metrics?.fleetDistanceKmToday || 1420} km`}
          trend={{ value: '8.4%', isPositive: true }}
          icon={<Route className="w-5 h-5" />}
          iconColorClass="bg-blue-500/10 text-blue-400 border-blue-500/20"
        />

        <StatsCard
          label="Active Alerts"
          value={alerts.filter((a) => !a.isAcknowledged).length}
          subValue="Requires action"
          icon={<AlertTriangle className="w-5 h-5" />}
          iconColorClass="bg-amber-500/10 text-amber-400 border-amber-500/20"
        />
      </div>

      {/* Middle Section: Mini Interactive Live Map + Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Real-Time Fleet Positioning
                </h3>
                <p className="text-xs text-slate-400">Live telemetry stream updated every 2.5s</p>
              </div>
              <Link
                to="/tracking"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                Full screen map <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Embedded Live Map */}
            <div className="h-80 w-full rounded-xl overflow-hidden border border-slate-800">
              <VehicleMap
                vehicles={vehicles}
                liveTelemetry={liveTelemetry}
                selectedVehicleId={selectedVehicleId}
                onSelectVehicle={setSelectedVehicleId}
                height="320px"
              />
            </div>
          </div>

          {/* Fleet Status Breakdown Chart */}
          <FleetStatusChart
            total={stats.total}
            moving={stats.moving}
            idle={stats.idle}
            stopped={stats.stopped}
            offline={stats.offline}
          />
        </div>

        {/* Right Column: Recent Alerts & Telemetry Highlights */}
        <div className="space-y-6">
          <RecentAlertsFeed alerts={alerts} onAcknowledge={acknowledgeAlert} />

          {/* Quick Metrics Widget */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md space-y-4 text-left">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Fleet Health Telemetry
            </h4>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Avg Fleet Speed</span>
                  <span className="text-sm font-bold text-white">{metrics?.averageFleetSpeedKmh || 48} km/h</span>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-medium">Optimal</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Fuel className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Avg Consumption</span>
                  <span className="text-sm font-bold text-white">{metrics?.averageFuelConsumptionL100Km || 26.4} L/100km</span>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">Euro 6 Std</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Active Vehicles Quick Status Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md text-left">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Active Fleet Units</h3>
            <p className="text-xs text-slate-400">Current status and live telemetry snapshot</p>
          </div>
          <Link
            to="/vehicles"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            Manage all units <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Live Speed</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Odometer</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {vehicles.map((veh) => {
                const telemetry = liveTelemetry[veh.id]
                const statusConfig = getStatusBadgeConfig(veh.status)
                const currentSpeed = telemetry?.location?.speedKmh ?? veh.currentSpeedKmh

                return (
                  <tr key={veh.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{veh.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{veh.plateNumber} • {veh.make} {veh.model}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {formatSpeed(currentSpeed)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-200">{veh.assignedDriver?.name || 'Unassigned'}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono">
                      {Math.round(telemetry?.odometerKm ?? veh.odometerKm).toLocaleString()} km
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to="/tracking"
                        onClick={() => setSelectedVehicleId(veh.id)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-medium border border-cyan-500/30 transition"
                      >
                        Track Live
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
