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
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})
  const trailPolylineRef = useRef<L.Polyline | null>(null)
  const geofenceLayersRef = useRef<L.Circle[]>([])

  const [showTrails, setShowTrails] = useState(true)
  const [showGeofences, setShowGeofences] = useState(true)
  const [mapStyle, setMapStyle] = useState<'dark' | 'streets'>('dark')

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapRef.current) {
      const defaultLat = parseFloat(import.meta.env.VITE_MAP_DEFAULT_LAT || '12.9716')
      const defaultLng = parseFloat(import.meta.env.VITE_MAP_DEFAULT_LNG || '77.5946')
      const defaultZoom = parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM || '13', 10)

      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: defaultZoom,
        zoomControl: false,
      })

      // Add Zoom control in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Add Tile Layer
      const tileUrl =
        mapStyle === 'dark'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

      L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
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

  // Update Tile Layer if Map Style Changes
  useEffect(() => {
    if (!mapRef.current) return

    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapRef.current?.removeLayer(layer)
      }
    })

    const tileUrl =
      mapStyle === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapRef.current)
  }, [mapStyle])

  // Helper to construct custom vehicle SVG icon
  const createVehicleIcon = (
    veh: Vehicle,
    telemetry?: VehicleTelemetry,
    isSelected: boolean = false
  ) => {
    const heading = telemetry?.location?.heading ?? 0
    const speed = telemetry?.location?.speedKmh ?? veh.currentSpeedKmh

    let color = '#64748b' // offline
    let pulseClass = ''

    if (veh.status === 'moving' || speed > 2) {
      color = '#06b6d4'
      pulseClass = 'vehicle-pulse'
    } else if (veh.status === 'idle') {
      color = '#f59e0b'
    } else if (veh.status === 'stopped') {
      color = '#f43f5e'
    }

    const ringColor = isSelected ? '#38bdf8' : color

    const html = `
      <div class="relative flex items-center justify-center cursor-pointer group" style="width: 44px; height: 44px;">
        <div class="absolute inset-0 rounded-full ${pulseClass}" style="border: 2px solid ${ringColor}; background-color: rgba(15, 23, 42, 0.85); box-shadow: 0 0 15px ${ringColor}44;"></div>
        <div style="transform: rotate(${heading}deg); transition: transform 0.4s ease-out; display: flex; align-items: center; justify-content: center;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${ringColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 19 21 12 17 5 21 12 2" fill="${ringColor}40" />
          </svg>
        </div>
        <div class="absolute -bottom-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-900 border border-slate-700 text-white shadow">
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

  // Sync Vehicle Markers
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    vehicles.forEach((veh) => {
      const telemetry = liveTelemetry[veh.id]
      const lat = telemetry?.location?.lat ?? 12.9716
      const lng = telemetry?.location?.lng ?? 77.5946
      const isSelected = veh.id === selectedVehicleId

      if (!markersRef.current[veh.id]) {
        // Create new marker
        const marker = L.marker([lat, lng], {
          icon: createVehicleIcon(veh, telemetry, isSelected),
        }).addTo(map)

        marker.on('click', () => {
          if (onSelectVehicle) onSelectVehicle(veh.id)
        })

        // Popup template
        const popupContent = `
          <div class="p-4 text-xs font-sans min-w-[220px]">
            <div class="flex items-center justify-between pb-2 border-b border-slate-800">
              <span class="font-bold text-sm text-white">${veh.name}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-cyan-400 border border-slate-700">
                ${veh.plateNumber}
              </span>
            </div>
            <div class="mt-2.5 space-y-1.5 text-slate-300">
              <div class="flex justify-between">
                <span class="text-slate-500">Speed:</span>
                <span class="font-semibold text-white">${formatSpeed(telemetry?.location?.speedKmh ?? veh.currentSpeedKmh)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Driver:</span>
                <span class="text-slate-200">${veh.assignedDriver?.name || 'Unassigned'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Battery:</span>
                <span class="text-emerald-400 font-medium">${telemetry?.batteryPercent ?? 95}% (${telemetry?.batteryVolts ?? 12.6}V)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Fuel Level:</span>
                <span class="text-cyan-400 font-medium">${telemetry?.fuelLevelPercent ?? 75}%</span>
              </div>
            </div>
          </div>
        `
        marker.bindPopup(popupContent)
        markersRef.current[veh.id] = marker
      } else {
        // Update position and icon
        const marker = markersRef.current[veh.id]
        marker.setLatLng([lat, lng])
        marker.setIcon(createVehicleIcon(veh, telemetry, isSelected))
      }
    })

    // Auto-center on selected vehicle if available
    if (autoCenter && selectedVehicleId) {
      const activeTelemetry = liveTelemetry[selectedVehicleId]
      if (activeTelemetry?.location) {
        map.panTo([activeTelemetry.location.lat, activeTelemetry.location.lng], {
          animate: true,
          duration: 0.8,
        })
      }
    }
  }, [vehicles, liveTelemetry, selectedVehicleId, autoCenter, onSelectVehicle])

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
          color: '#06b6d4',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '4, 8',
        }).addTo(map)
      }
    }
  }, [trails, selectedVehicleId, showTrails])

  // Sync Geofences
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clean old
    geofenceLayersRef.current.forEach((layer) => map.removeLayer(layer))
    geofenceLayersRef.current = []

    if (showGeofences) {
      geofences.forEach((geo) => {
        const circle = L.circle([geo.center.lat, geo.center.lng], {
          radius: geo.radiusMeters,
          color: geo.color || '#3b82f6',
          fillColor: geo.color || '#3b82f6',
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '6, 6',
        }).addTo(map)

        circle.bindTooltip(`<b>${geo.name}</b><br>Zone: ${geo.radiusMeters}m`, {
          direction: 'top',
          className: 'bg-slate-900 border border-slate-800 text-white text-xs rounded p-1 shadow',
        })

        geofenceLayersRef.current.push(circle)
      })
    }
  }, [geofences, showGeofences])

  const handleRecenter = () => {
    if (!mapRef.current) return
    if (selectedVehicleId && liveTelemetry[selectedVehicleId]?.location) {
      const loc = liveTelemetry[selectedVehicleId].location
      mapRef.current.setView([loc.lat, loc.lng], 14, { animate: true })
    } else {
      const defaultLat = parseFloat(import.meta.env.VITE_MAP_DEFAULT_LAT || '12.9716')
      const defaultLng = parseFloat(import.meta.env.VITE_MAP_DEFAULT_LNG || '77.5946')
      mapRef.current.setView([defaultLat, defaultLng], 12, { animate: true })
    }
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Controls */}
      <MapControls
        onRecenter={handleRecenter}
        showTrails={showTrails}
        onToggleTrails={() => setShowTrails(!showTrails)}
        showGeofences={showGeofences}
        onToggleGeofences={() => setShowGeofences(!showGeofences)}
        isStreaming={isStreaming}
        onToggleStream={onToggleStream}
        mapStyle={mapStyle}
        onToggleMapStyle={() => setMapStyle(mapStyle === 'dark' ? 'streets' : 'dark')}
      />
    </div>
  )
}

export default VehicleMap
