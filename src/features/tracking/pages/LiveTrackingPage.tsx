import React, { useState } from 'react'
import VehicleListSidebar from '../components/VehicleListSidebar'
import TelemetrySidebar from '../components/TelemetrySidebar'
import VehicleMap from '@/components/map/VehicleMap'
import VehicleDetailsModal from '@/features/vehicles/components/VehicleDetailsModal'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import { useLiveTracking } from '../hooks/useLiveTracking'

export const LiveTrackingPage: React.FC = () => {
  const { vehicles } = useVehicles()
  const {
    liveTelemetry,
    trails,
    selectedVehicleId,
    selectedVehicle,
    selectedTelemetry,
    geofences,
    isStreaming,
    setSelectedVehicleId,
    startStream,
    stopStream,
  } = useLiveTracking()

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
      {/* 3-Column Split Workspace */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Left Column: Vehicle List */}
        <div className="shrink-0 h-full z-10">
          <VehicleListSidebar
            vehicles={vehicles}
            liveTelemetry={liveTelemetry}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
          />
        </div>

        {/* Center: Full-Screen Interactive Leaflet Map */}
        <div className="flex-1 h-full relative z-0">
          <VehicleMap
            vehicles={vehicles}
            liveTelemetry={liveTelemetry}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
            trails={trails}
            geofences={geofences}
            isStreaming={isStreaming}
            onToggleStream={isStreaming ? stopStream : startStream}
            height="100%"
            showFilterPills={true}
          />
        </div>

        {/* Right Column: Telemetry Instrument Sidebar */}
        <div className="shrink-0 h-full z-10">
          <TelemetrySidebar
            vehicle={selectedVehicle}
            telemetry={selectedTelemetry}
            onOpenDetailsModal={() => setIsDetailsModalOpen(true)}
          />
        </div>
      </div>

      {/* Vehicle Details Modal */}
      <VehicleDetailsModal
        vehicle={selectedVehicle}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  )
}

export default LiveTrackingPage
