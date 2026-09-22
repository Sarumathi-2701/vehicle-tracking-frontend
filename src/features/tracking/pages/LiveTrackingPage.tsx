import React, { useState } from 'react'
import VehicleListSidebar from '../components/VehicleListSidebar'
import TelemetrySidebar from '../components/TelemetrySidebar'
import VehicleMap from '@/components/map/VehicleMap'
import VehicleDetailsModal from '@/features/vehicles/components/VehicleDetailsModal'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import { useLiveTracking } from '../hooks/useLiveTracking'
import { Map, Truck, Info } from 'lucide-react'

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
  // Mobile active tab view switcher: 'map' | 'list' | 'details'
  const [mobileView, setMobileView] = useState<'map' | 'list' | 'details'>('map')

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicleId(id)
    // On mobile, automatically switch to map view when a vehicle is selected
    setMobileView('map')
  }

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
      {/* Mobile Top View Switcher (< lg screens matching mobile mockup) */}
      <div className="lg:hidden p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-center gap-1.5 z-20">
        <button
          type="button"
          onClick={() => setMobileView('map')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileView === 'map'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          Map View
        </button>

        <button
          type="button"
          onClick={() => setMobileView('list')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileView === 'list'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          Vehicles ({vehicles.length})
        </button>

        <button
          type="button"
          onClick={() => setMobileView('details')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileView === 'details'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          Details
        </button>
      </div>

      {/* 3-Column Split Workspace on Desktop, Single-View on Mobile */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Left Column: Vehicle List */}
        <div
          className={`shrink-0 h-full z-10 ${
            mobileView === 'list' ? 'w-full block' : 'hidden lg:block lg:w-80'
          }`}
        >
          <VehicleListSidebar
            vehicles={vehicles}
            liveTelemetry={liveTelemetry}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={handleSelectVehicle}
          />
        </div>

        {/* Center: Full-Screen Interactive Leaflet Map */}
        <div
          className={`flex-1 h-full relative z-0 flex flex-col ${
            mobileView === 'map' ? 'w-full block' : 'hidden lg:block'
          }`}
        >
          <VehicleMap
            vehicles={vehicles}
            liveTelemetry={liveTelemetry}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
            trails={trails}
            geofences={geofences}
            isStreaming={isStreaming}
            onToggleStream={isStreaming ? stopStream : startStream}
            showFilterPills={true}
            className="h-full rounded-none border-x border-y-0 border-slate-200"
          />
        </div>

        {/* Right Column: Telemetry Instrument Sidebar */}
        <div
          className={`shrink-0 h-full z-10 ${
            mobileView === 'details' ? 'w-full block' : 'hidden lg:block lg:w-80'
          }`}
        >
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
