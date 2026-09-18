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

  // Helper to render clean professional 3D vehicle SVG models with realistic lighting & shadows
  const get3DVehicleSvg = (
    type: string = 'truck',
    statusColor: string,
    isSelected: boolean
  ) => {
    const isTruck = type === 'truck' || type === 'lorry'
    const isBus = type === 'bus'
    const idPrefix = `${type}-${statusColor.replace('#', '')}-${isSelected ? 'sel' : 'def'}`

    if (isBus) {
      return `
        <svg width="36" height="60" viewBox="0 0 36 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
          <defs>
            <linearGradient id="busBody-${idPrefix}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
              <stop offset="30%" stop-color="${statusColor}"/>
              <stop offset="100%" stop-color="#090d16"/>
            </linearGradient>
            <linearGradient id="busGlass-${idPrefix}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#7dd3fc"/>
              <stop offset="40%" stop-color="#0284c7"/>
              <stop offset="100%" stop-color="#082f49"/>
            </linearGradient>
            <filter id="busShadow-${idPrefix}" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#0b132b" flood-opacity="0.45"/>
            </filter>
          </defs>

          <g filter="url(#busShadow-${idPrefix})">
            <!-- 3D Ground Shadow Ring -->
            <ellipse cx="18" cy="35" rx="14" ry="22" fill="#000000" opacity="0.25"/>

            <!-- Main Bus Chassis -->
            <rect x="6" y="6" width="24" height="48" rx="6.5" fill="url(#busBody-${idPrefix})" stroke="${isSelected ? '#3b82f6' : '#1e293b'}" stroke-width="${isSelected ? '2' : '1'}"/>

            <!-- Dual Side Windows Strips -->
            <rect x="6.5" y="14" width="1.5" height="34" rx="0.5" fill="#0369a1" opacity="0.8"/>
            <rect x="28" y="14" width="1.5" height="34" rx="0.5" fill="#0369a1" opacity="0.8"/>

            <!-- Roof Top AC Climate Unit -->
            <rect x="10" y="24" width="16" height="13" rx="2" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.7"/>
            <line x1="13" y1="28" x2="23" y2="28" stroke="#64748b" stroke-width="0.8"/>
            <line x1="13" y1="31" x2="23" y2="31" stroke="#64748b" stroke-width="0.8"/>
            <line x1="13" y1="34" x2="23" y2="34" stroke="#64748b" stroke-width="0.8"/>

            <!-- Curved Panoramic Windshield -->
            <path d="M8 12C8 9 10.5 7 14 7H22C25.5 7 28 9 28 12V16H8V12Z" fill="url(#busGlass-${idPrefix})"/>
            <line x1="11" y1="8.5" x2="17" y2="14" stroke="#ffffff" stroke-width="1.2" opacity="0.7" stroke-linecap="round"/>

            <!-- Rear Window -->
            <rect x="9" y="50" width="18" height="2.5" rx="1" fill="url(#busGlass-${idPrefix})"/>

            <!-- Headlights & Taillights -->
            <circle cx="9" cy="8" r="1.5" fill="#fef08a"/>
            <circle cx="27" cy="8" r="1.5" fill="#fef08a"/>
            <circle cx="9" cy="52.5" r="1.3" fill="#ef4444"/>
            <circle cx="27" cy="52.5" r="1.3" fill="#ef4444"/>
          </g>
        </svg>
      `
    }

    if (isTruck) {
      return `
        <svg width="36" height="60" viewBox="0 0 36 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
          <defs>
            <linearGradient id="truckBody-${idPrefix}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
              <stop offset="35%" stop-color="${statusColor}"/>
              <stop offset="100%" stop-color="#0b132b" stop-opacity="0.7"/>
            </linearGradient>
            <linearGradient id="truckGlass-${idPrefix}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#7dd3fc"/>
              <stop offset="60%" stop-color="#0284c7"/>
              <stop offset="100%" stop-color="#0369a1"/>
            </linearGradient>
            <linearGradient id="cargoRoof-${idPrefix}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="40%" stop-color="#f1f5f9"/>
              <stop offset="80%" stop-color="#e2e8f0"/>
              <stop offset="100%" stop-color="#cbd5e1"/>
            </linearGradient>
            <filter id="truckShadow-${idPrefix}" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#0b132b" flood-opacity="0.45"/>
            </filter>
          </defs>

          <g filter="url(#truckShadow-${idPrefix})">
            <!-- Ambient Ground Shadow -->
            <ellipse cx="18" cy="35" rx="13" ry="23" fill="#000000" opacity="0.3"/>

            <!-- 1. 3D Articulated Cargo Container -->
            <rect x="6" y="23" width="24" height="32" rx="3.5" fill="url(#truckBody-${idPrefix})" stroke="${isSelected ? '#3b82f6' : '#334155'}" stroke-width="${isSelected ? '2' : '1'}"/>
            <!-- 3D Beveled Roof Panel -->
            <rect x="7.5" y="24.5" width="21" height="28" rx="2" fill="url(#cargoRoof-${idPrefix})"/>
            <!-- Corrugated Cargo Ridges with Embossed Highlights -->
            <line x1="10" y1="29" x2="26" y2="29" stroke="#94a3b8" stroke-width="0.9" opacity="0.7"/>
            <line x1="10" y1="34" x2="26" y2="34" stroke="#94a3b8" stroke-width="0.9" opacity="0.7"/>
            <line x1="10" y1="39" x2="26" y2="39" stroke="#94a3b8" stroke-width="0.9" opacity="0.7"/>
            <line x1="10" y1="44" x2="26" y2="44" stroke="#94a3b8" stroke-width="0.9" opacity="0.7"/>
            <line x1="10" y1="49" x2="26" y2="49" stroke="#94a3b8" stroke-width="0.9" opacity="0.7"/>

            <!-- Rear Step Bumper with Reflectors & LED Brake Lights -->
            <rect x="7" y="53.5" width="22" height="2" rx="0.5" fill="#1e293b"/>
            <circle cx="9.5" cy="54.5" r="1.3" fill="#ef4444"/>
            <circle cx="26.5" cy="54.5" r="1.3" fill="#ef4444"/>

            <!-- Articulation Chassis Hitch Connection -->
            <rect x="15" y="19" width="6" height="5" rx="1" fill="#0f172a"/>

            <!-- 2. 3D Truck Tractor Cab -->
            <path d="M8 8C8 5.5 10 3.5 13 3.5H23C26 3.5 28 5.5 28 8V20C28 21.1 27.1 22 26 22H10C8.9 22 8 21.1 8 20V8Z" fill="url(#truckBody-${idPrefix})" stroke="${isSelected ? '#3b82f6' : '#334155'}" stroke-width="${isSelected ? '1.8' : '1'}"/>
            <!-- Cab Aerodynamic Roof Fairing -->
            <path d="M9.5 9C9.5 7 11.5 5.5 13.5 5.5H22.5C24.5 5.5 26.5 7 26.5 9V19C26.5 19.55 26.05 20 25.5 20H10.5C9.95 20 9.5 19.55 9.5 19V9Z" fill="url(#cargoRoof-${idPrefix})" opacity="0.85"/>

            <!-- Tinted Windshield with 3D Specular Sun Sheen -->
            <path d="M10 10C10 8.5 11.5 7.5 13.5 7.5H22.5C24.5 7.5 26 8.5 26 10V14H10V10Z" fill="url(#truckGlass-${idPrefix})"/>
            <line x1="12" y1="8.5" x2="17" y2="13" stroke="#ffffff" stroke-width="1.2" opacity="0.75" stroke-linecap="round"/>

            <!-- Dual Projection Headlights -->
            <circle cx="10.5" cy="5" r="1.5" fill="#fef08a"/>
            <circle cx="25.5" cy="5" r="1.5" fill="#fef08a"/>

            <!-- Chrome Grille Trim Accent -->
            <line x1="14" y1="4.5" x2="22" y2="4.5" stroke="#f8fafc" stroke-width="1" stroke-linecap="round"/>

            <!-- Extended 3D Side Mirrors -->
            <rect x="4.5" y="9" width="3" height="1.8" rx="0.6" fill="#0f172a"/>
            <rect x="28.5" y="9" width="3" height="1.8" rx="0.6" fill="#0f172a"/>
          </g>
        </svg>
      `
    }

    // Default: 3D Fleet Car / SUV / Van
    return `
      <svg width="34" height="54" viewBox="0 0 34 54" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
        <defs>
          <linearGradient id="carBody-${idPrefix}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
            <stop offset="35%" stop-color="${statusColor}"/>
            <stop offset="100%" stop-color="#0b132b" stop-opacity="0.65"/>
          </linearGradient>
          <linearGradient id="carGlass-${idPrefix}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#7dd3fc"/>
            <stop offset="60%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#0369a1"/>
          </linearGradient>
          <filter id="carShadow-${idPrefix}" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#0b132b" flood-opacity="0.45"/>
          </filter>
        </defs>

        <g filter="url(#carShadow-${idPrefix})">
          <!-- Ambient Ground Shadow -->
          <ellipse cx="17" cy="30" rx="12" ry="20" fill="#000000" opacity="0.3"/>

          <!-- Sculpted Car Body -->
          <path d="M9 11C9 6.5 12.5 3 17 3C21.5 3 25 6.5 25 11V41C25 45.5 21.5 49 17 49C12.5 49 9 45.5 9 41V11Z" fill="url(#carBody-${idPrefix})" stroke="${isSelected ? '#3b82f6' : '#334155'}" stroke-width="${isSelected ? '2' : '1'}"/>

          <!-- Front Hood Creases -->
          <path d="M10.5 11C10.5 8 13 5.5 17 5.5C21 5.5 23.5 8 23.5 11V15H10.5V11Z" fill="${statusColor}" opacity="0.95"/>

          <!-- Windshield with Specular Reflection -->
          <path d="M10.5 15H23.5L22 22H12L10.5 15Z" fill="url(#carGlass-${idPrefix})"/>
          <line x1="13" y1="16" x2="18" y2="21" stroke="#ffffff" stroke-width="1.1" opacity="0.75" stroke-linecap="round"/>

          <!-- Glass Panoramic Sunroof -->
          <rect x="12" y="22" width="10" height="11" rx="1.5" fill="#0f172a" opacity="0.8"/>
          <rect x="13.5" y="23.5" width="7" height="8" rx="1" fill="url(#carGlass-${idPrefix})" opacity="0.6"/>

          <!-- Rear Window -->
          <path d="M12 34H22L23 39H11L12 34Z" fill="url(#carGlass-${idPrefix})"/>

          <!-- Rear Trunk & Integrated Spoiler -->
          <path d="M11 39H23V44C23 46 20 48 17 48C14 48 11 46 11 44V39Z" fill="${statusColor}"/>

          <!-- Projection Headlights -->
          <circle cx="11.5" cy="5.5" r="1.4" fill="#fef08a"/>
          <circle cx="22.5" cy="5.5" r="1.4" fill="#fef08a"/>

          <!-- LED Taillights Bar -->
          <circle cx="11.5" cy="46" r="1.3" fill="#ef4444"/>
          <circle cx="22.5" cy="46" r="1.3" fill="#ef4444"/>

          <!-- Aerodynamic Side Mirrors -->
          <rect x="6" y="16" width="3" height="1.6" rx="0.5" fill="#0f172a"/>
          <rect x="25" y="16" width="3" height="1.6" rx="0.5" fill="#0f172a"/>
        </g>
      </svg>
    `
  }

  // Helper to construct clean 3D vehicle SVG icon - Only the 3D vehicle is displayed
  const createVehicleIcon = (
    veh: Vehicle,
    telemetry?: VehicleTelemetry,
    isSelected: boolean = false
  ) => {
    const heading = telemetry?.location?.heading ?? veh.headingDeg ?? 0

    let color = '#ef4444' // offline red

    if (veh.status === 'running' || veh.status === 'moving' || (telemetry?.location?.speedKmh ?? veh.currentSpeedKmh) > 2) {
      color = '#10b981' // green
    } else if (veh.status === 'idle') {
      color = '#f59e0b' // yellow
    } else if (veh.status === 'parked' || veh.status === 'stopped') {
      color = '#3b82f6' // blue
    }

    const html = `
      <div class="relative flex items-center justify-center cursor-pointer group" style="width: 44px; height: 54px;">
        <!-- 3D Vehicle Icon Only - Rotated Smoothly by Compass Heading -->
        <div class="relative z-10 transition-transform duration-300 ease-out flex items-center justify-center filter hover:scale-115 cursor-pointer" style="transform: rotate(${heading}deg); transform-origin: center;">
          ${get3DVehicleSvg(veh.type, color, isSelected)}
        </div>
      </div>
    `

    return L.divIcon({
      className: 'custom-vehicle-marker-3d',
      html,
      iconSize: [44, 54],
      iconAnchor: [22, 27],
      popupAnchor: [0, -27],
    })
  }

  // Helper to build rich hover tooltip with vehicle details
  const createTooltipContent = (veh: Vehicle, telemetry?: VehicleTelemetry) => {
    const speed = Math.round(telemetry?.location?.speedKmh ?? veh.currentSpeedKmh)
    let statusClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    if (veh.status === 'idle') statusClass = 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    else if (veh.status === 'parked' || veh.status === 'stopped') statusClass = 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    else if (veh.status === 'offline') statusClass = 'bg-rose-500/20 text-rose-400 border-rose-500/30'

    return `
      <div class="p-3 text-xs font-sans min-w-[210px] bg-slate-900/95 text-white rounded-xl shadow-2xl border border-slate-700/80 backdrop-blur-md text-left pointer-events-none">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <span class="font-extrabold text-white text-xs tracking-tight">${veh.plateNumber}</span>
          <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${statusClass}">
            ${veh.status}
          </span>
        </div>
        <div class="mt-2 space-y-1.5 text-[11px] text-slate-300">
          <div class="flex justify-between items-center">
            <span class="text-slate-400">Speed:</span>
            <span class="font-extrabold text-white text-xs">${speed} km/h</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-400">Driver:</span>
            <span class="font-medium text-slate-200">${veh.assignedDriver?.name || 'Unassigned'}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-400">Location:</span>
            <span class="font-medium text-slate-200">${veh.locationCity || 'Tamil Nadu'}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-400">Vehicle Type:</span>
            <span class="font-medium text-slate-200 capitalize">${veh.type}</span>
          </div>
        </div>
      </div>
    `
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

        // Rich Hover Tooltip showing vehicle details
        marker.bindTooltip(createTooltipContent(veh, telemetry), {
          direction: 'top',
          offset: [0, -20],
          className: 'custom-vehicle-hover-tooltip',
          opacity: 1,
        })

        // Popup matching mockup on click
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
        marker.setTooltipContent(createTooltipContent(veh, telemetry))
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
