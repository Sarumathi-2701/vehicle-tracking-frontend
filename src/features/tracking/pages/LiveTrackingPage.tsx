import React, { useState } from 'react'
import VehicleListSidebar from '../components/VehicleListSidebar'
import TelemetrySidebar from '../components/TelemetrySidebar'
import VehicleMap from '@/components/map/VehicleMap'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import { useLiveTracking } from '../hooks/useLiveTracking'
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Radio, Sparkles } from 'lucide-react'

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

  const [showLeftSidebar, setShowLeftSidebar] = useState(true)
  const [showRightSidebar, setShowRightSidebar] = useState(true)

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Top Operations Header Bar */}
      <div className="h-12 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-20 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={showLeftSidebar ? 'Hide Fleet Units' : 'Show Fleet Units'}
          >
            {showLeftSidebar ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Operations Center
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
              Active: <strong className="text-cyan-400">{selectedVehicle?.name || 'All Units'}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px]">
            <Radio className={`w-3 h-3 ${isStreaming ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className={isStreaming ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
              {isStreaming ? 'Telemetry Streaming (2.5s)' : 'Simulation Paused'}
            </span>
          </div>

          <button
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={showRightSidebar ? 'Hide Telemetry Diagnostics' : 'Show Telemetry Diagnostics'}
          >
            {showRightSidebar ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 3-Column Split Workspace */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Left Column: Vehicle List */}
        {showLeftSidebar && (
          <div className="shrink-0 h-full z-10">
            <VehicleListSidebar
              vehicles={vehicles}
              liveTelemetry={liveTelemetry}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={setSelectedVehicleId}
            />
          </div>
        )}

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
          />
        </div>

        {/* Right Column: Telemetry Instrument Sidebar */}
        {showRightSidebar && (
          <div className="shrink-0 h-full z-10">
            <TelemetrySidebar
              vehicle={selectedVehicle}
              telemetry={selectedTelemetry}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveTrackingPage
