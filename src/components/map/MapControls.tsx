import React from 'react'
import { Navigation, Layers, Eye, EyeOff, Radio, RefreshCw } from 'lucide-react'

export interface MapControlsProps {
  onRecenter: () => void
  showTrails: boolean
  onToggleTrails: () => void
  showGeofences: boolean
  onToggleGeofences: () => void
  isStreaming: boolean
  onToggleStream: () => void
  mapStyle: 'dark' | 'streets'
  onToggleMapStyle: () => void
}

export const MapControls: React.FC<MapControlsProps> = ({
  onRecenter,
  showTrails,
  onToggleTrails,
  showGeofences,
  onToggleGeofences,
  isStreaming,
  onToggleStream,
  mapStyle,
  onToggleMapStyle,
}) => {
  return (
    <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-2xl p-1.5 shadow-2xl">
      <button
        onClick={onRecenter}
        className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center group relative cursor-pointer"
        title="Recenter Map"
      >
        <Navigation className="w-4 h-4 text-cyan-400" />
        <span className="sr-only">Recenter</span>
      </button>

      <button
        onClick={onToggleTrails}
        className={`p-2.5 rounded-xl transition flex items-center justify-center cursor-pointer ${
          showTrails
            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            : 'hover:bg-slate-800 text-slate-400'
        }`}
        title={showTrails ? 'Hide GPS Trails' : 'Show GPS Trails'}
      >
        {showTrails ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>

      <button
        onClick={onToggleGeofences}
        className={`p-2.5 rounded-xl transition flex items-center justify-center cursor-pointer ${
          showGeofences
            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
            : 'hover:bg-slate-800 text-slate-400'
        }`}
        title="Toggle Geofences"
      >
        <Radio className="w-4 h-4" />
      </button>

      <button
        onClick={onToggleMapStyle}
        className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center cursor-pointer"
        title={`Map Theme: ${mapStyle === 'dark' ? 'Dark' : 'Standard'}`}
      >
        <Layers className="w-4 h-4 text-blue-400" />
      </button>

      <div className="h-px bg-slate-800 my-0.5" />

      <button
        onClick={onToggleStream}
        className={`p-2.5 rounded-xl transition flex items-center justify-center cursor-pointer ${
          isStreaming
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
        }`}
        title={isStreaming ? 'Live Stream Active (Click to Pause)' : 'Live Stream Paused (Click to Resume)'}
      >
        <RefreshCw className={`w-4 h-4 ${isStreaming ? 'animate-spin' : ''}`} />
      </button>
    </div>
  )
}

export default MapControls
