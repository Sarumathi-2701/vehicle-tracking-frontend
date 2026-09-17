import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { Vehicle } from '@/types/vehicle'
import { VehicleTelemetry, GpsLocation, Geofence } from '@/types/gps'
import MapControls from './MapControls'
import { formatSpeed } from '@/utils/formatUtils'

export interface VehicleMapProps {
  vehicles: Vehicle[]
  liveTelemetry: Record<string, VehicleTelemetry>
  selectedVehicleId: string | null
  onSelectVehicle?: (vehicleId: string) => void
  trails?: Record<string, GpsLocation[]>
  geofences?: Geofence[]
  height?: string
  autoCenter?: boolean
  isStreaming?: boolean
  onToggleStream?: () => void
  showFilterPills?: boolean
}

export const VehicleMap: React.FC<VehicleMapProps> = ({
  vehicles,
  liveTelemetry,
  selectedVehicleId,
  onSelectVehicle,
  trails = {},
  geofences = [],
  height = '100%',
  autoCenter = true,
  isStreaming = true,
  onToggleStream = () => {},
  showFilterPills = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})
  const trailPolylineRef = useRef<L.Polyline | null>(null)
  const geofenceLayersRef = useRef<L.Circle[]>([])

  const [showTrails, setShowTrails] = useState(true)
  const [showGeofences, setShowGeofences] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'idle' | 'parked' | 'offline'>('all')

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapRef.current) {
      // Default to Chennai coordinates (13.0827, 80.2707) matching the mockup
      const map = L.map(mapContainerRef.current, {
        center: [13.0827, 80.2707],
        zoom: 12,
        zoomControl: false,
      })

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Use Carto Voyager Light Tiles matching mockup
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current = {}
      }
    }
  }, [])

  // Helper to construct custom vehicle SVG icon
  const createVehicleIcon = (
    veh: Vehicle,
    telemetry?: VehicleTelemetry,
    isSelected: boolean = false
  ) => {
    const heading = telemetry?.location?.heading ?? veh.headingDeg ?? 0
    const speed = telemetry?.location?.speedKmh ?? veh.currentSpeedKmh

    let color = '#ef4444' // offline red
    let pulseClass = ''

    if (veh.status === 'running' || veh.status === 'moving' || speed > 2) {
      color = '#10b981' // green
      pulseClass = 'vehicle-pulse'
    } else if (veh.status === 'idle') {
      color = '#f59e0b' // yellow
    } else if (veh.status === 'parked' || veh.status === 'stopped') {
      color = '#3b82f6' // blue
    }

    const ringColor = isSelected ? '#1d4ed8' : color

    const html = `
      <div class="relative flex items-center justify-center cursor-pointer group" style="width: 44px; height: 44px;">
        <div class="absolute inset-0 rounded-full ${pulseClass}" style="border: 2.5px solid ${ringColor}; background-color: #ffffff; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);"></div>
        <div style="transform: rotate(${heading}deg); transition: transform 0.4s ease-out; display: flex; align-items: center; justify-content: center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="${ringColor}" stroke="${ringColor}" stroke-width="1.5">
            <polygon points="12 2 19 21 12 17 5 21 12 2" />
          </svg>
        </div>
        <div class="absolute -bottom-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-900 text-white shadow-xs">
          ${Math.round(speed)}k
        </div>
      </div>
    `

    return L.divIcon({
      className: 'custom-vehicle-marker',
      html,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    })
  }

  // Filter vehicles
  const displayedVehicles = vehicles.filter((v) => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'running') return v.status === 'running' || v.status === 'moving'
    if (statusFilter === 'idle') return v.status === 'idle'
    if (statusFilter === 'parked') return v.status === 'parked' || v.status === 'stopped'
    if (statusFilter === 'offline') return v.status === 'offline'
    return true
  })

  // Sync Markers
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Remove old markers not in displayed
    Object.keys(markersRef.current).forEach((id) => {
      if (!displayedVehicles.find((v) => v.id === id)) {
        map.removeLayer(markersRef.current[id])
        delete markersRef.current[id]
      }
    })

    displayedVehicles.forEach((veh) => {
      const telemetry = liveTelemetry[veh.id]
      const lat = telemetry?.location?.lat ?? veh.latitude ?? 13.0827
      const lng = telemetry?.location?.lng ?? veh.longitude ?? 80.2707
      const isSelected = veh.id === selectedVehicleId

      if (!markersRef.current[veh.id]) {
        const marker = L.marker([lat, lng], {
          icon: createVehicleIcon(veh, telemetry, isSelected),
        }).addTo(map)

        marker.on('click', () => {
          if (onSelectVehicle) onSelectVehicle(veh.id)
        })

        // Popup matching mockup
        const popupContent = `
          <div class="p-3 text-xs font-sans min-w-[210px]">
            <div class="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span class="font-bold text-slate-800 text-sm">${veh.plateNumber}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                ${veh.status}
              </span>
            </div>
            <div class="mt-2 space-y-1 text-slate-600">
              <div class="flex justify-between">
                <span class="text-slate-400">Speed:</span>
                <span class="font-bold text-slate-800">${formatSpeed(telemetry?.location?.speedKmh ?? veh.currentSpeedKmh)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Driver:</span>
                <span class="font-medium text-slate-800">${veh.assignedDriver?.name || 'Unassigned'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Location:</span>
                <span class="font-medium text-slate-800">${veh.locationCity || 'Chennai'}</span>
              </div>
            </div>
          </div>
        `
        marker.bindPopup(popupContent)
        markersRef.current[veh.id] = marker
      } else {
        const marker = markersRef.current[veh.id]
        marker.setLatLng([lat, lng])
        marker.setIcon(createVehicleIcon(veh, telemetry, isSelected))
      }
    })

    if (autoCenter && selectedVehicleId) {
      const activeTelemetry = liveTelemetry[selectedVehicleId]
      const activeVeh = vehicles.find((v) => v.id === selectedVehicleId)
      const lat = activeTelemetry?.location?.lat ?? activeVeh?.latitude
      const lng = activeTelemetry?.location?.lng ?? activeVeh?.longitude
      if (lat && lng) {
        map.panTo([lat, lng], { animate: true, duration: 0.8 })
      }
    }
  }, [displayedVehicles, liveTelemetry, selectedVehicleId, autoCenter, onSelectVehicle])

  // Sync Trail Polyline
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (trailPolylineRef.current) {
      map.removeLayer(trailPolylineRef.current)
      trailPolylineRef.current = null
    }

    if (showTrails && selectedVehicleId && trails[selectedVehicleId]) {
      const coords = trails[selectedVehicleId].map((pt) => [pt.lat, pt.lng] as [number, number])
      if (coords.length > 1) {
        trailPolylineRef.current = L.polyline(coords, {
          color: '#2563eb',
          weight: 4,
          opacity: 0.8,
        }).addTo(map)
      }
    }
  }, [trails, selectedVehicleId, showTrails])

  // Sync Geofences
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    geofenceLayersRef.current.forEach((layer) => map.removeLayer(layer))
    geofenceLayersRef.current = []

    if (showGeofences) {
      geofences.forEach((geo) => {
        const circle = L.circle([geo.center.lat, geo.center.lng], {
          radius: geo.radiusMeters,
          color: geo.color || '#3b82f6',
          fillColor: geo.color || '#3b82f6',
          fillOpacity: 0.12,
          weight: 2,
        }).addTo(map)

        circle.bindTooltip(`<b>${geo.name}</b>`, {
          direction: 'top',
          className: 'bg-white border border-slate-200 text-slate-800 text-xs rounded-lg p-1.5 shadow-sm',
        })

        geofenceLayersRef.current.push(circle)
      })
    }
  }, [geofences, showGeofences])

  const handleRecenter = () => {
    if (!mapRef.current) return
    mapRef.current.setView([13.0827, 80.2707], 12, { animate: true })
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-white" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Controls */}
      <MapControls
        onRecenter={handleRecenter}
        showTrails={showTrails}
        onToggleTrails={() => setShowTrails(!showTrails)}
        showGeofences={showGeofences}
        onToggleGeofences={() => setShowGeofences(!showGeofences)}
        isStreaming={isStreaming}
        onToggleStream={onToggleStream}
        mapStyle="streets"
        onToggleMapStyle={() => {}}
      />

      {/* Bottom Status Filter Pills matching Mockup */}
      {showFilterPills && (
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-md flex items-center gap-3 text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full transition cursor-pointer ${
              statusFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('running')}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full transition cursor-pointer ${
              statusFilter === 'running' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Running
          </button>
          <button
            onClick={() => setStatusFilter('idle')}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full transition cursor-pointer ${
              statusFilter === 'idle' ? 'bg-amber-100 text-amber-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Idle
          </button>
          <button
            onClick={() => setStatusFilter('parked')}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full transition cursor-pointer ${
              statusFilter === 'parked' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Parked
          </button>
          <button
            onClick={() => setStatusFilter('offline')}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full transition cursor-pointer ${
              statusFilter === 'offline' ? 'bg-rose-100 text-rose-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Offline
          </button>
        </div>
      )}
    </div>
  )
}

export default VehicleMap
