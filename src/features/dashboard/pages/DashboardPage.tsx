import React, { useEffect, useState } from 'react'
import { Truck, Navigation, PauseCircle, Car, AlertOctagon, WifiOff } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import StatsCard from '@/components/common/StatsCard'
import FleetStatusChart from '../components/FleetStatusChart'
import RecentAlertsFeed from '../components/RecentAlertsFeed'
import VehicleMap from '@/components/map/VehicleMap'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import { useLiveTracking } from '@/features/tracking/hooks/useLiveTracking'
import { dashboardService } from '../services/dashboardService'
import { DashboardMetrics } from '../types'

export const DashboardPage: React.FC = () => {
  const { vehicles, stats } = useVehicles()
  const { liveTelemetry, alerts, acknowledgeAlert, selectedVehicleId, setSelectedVehicleId } = useLiveTracking()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)

  useEffect(() => {
    dashboardService.getMetrics().then(setMetrics)
  }, [])

  return (
    <div className="space-y-6 text-left">
      {/* Row of 5 Status KPI Cards matching Mockup */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatsCard
          label="Total Vehicles"
          value={metrics?.totalVehicles || 24}
          subValue="+2 today"
          icon={<Truck className="w-5 h-5 text-slate-700" />}
          iconColorClass="bg-slate-100 text-slate-700"
        />

        <StatsCard
          label="Running"
          value={metrics?.runningVehicles || 16}
          trend={{ value: '66.7%', isPositive: true }}
          icon={<Navigation className="w-5 h-5 text-emerald-600" />}
          iconColorClass="bg-emerald-50 text-emerald-600"
        />

        <StatsCard
          label="Idle"
          value={metrics?.idleVehicles || 5}
          subValue="20.8%"
          icon={<PauseCircle className="w-5 h-5 text-amber-500" />}
          iconColorClass="bg-amber-50 text-amber-500"
        />

        <StatsCard
          label="Parked"
          value={metrics?.parkedVehicles || 2}
          subValue="8.3%"
          icon={<Car className="w-5 h-5 text-blue-600" />}
          iconColorClass="bg-blue-50 text-blue-600"
        />

        <StatsCard
          label="Offline"
          value={metrics?.offlineVehicles || 1}
          subValue="4.2%"
          icon={<WifiOff className="w-5 h-5 text-rose-600" />}
          iconColorClass="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Main Grid: Left Map + Right Charts & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Main Live Map */}
        <div className="lg:col-span-2">
          <VehicleMap
            vehicles={vehicles}
            liveTelemetry={liveTelemetry}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
            height="560px"
            showFilterPills={true}
          />
        </div>

        {/* Right 1 Col: Vehicle Status Donut + Recent Alerts */}
        <div className="space-y-6">
          <FleetStatusChart
            total={metrics?.totalVehicles || 24}
            running={metrics?.runningVehicles || 16}
            idle={metrics?.idleVehicles || 5}
            parked={metrics?.parkedVehicles || 2}
            offline={metrics?.offlineVehicles || 1}
          />

          <RecentAlertsFeed
            alerts={alerts}
            onAcknowledge={acknowledgeAlert}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
