import React, { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import { MapPin, Plus, Radio, ShieldCheck, ChevronRight } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import CreateGeofenceModal, { GeofenceZoneData } from './components/CreateGeofenceModal'

interface GeofenceZone {
  id: string
  name: string
  type: 'Polygon' | 'Circle'
  vehicleCount: number
  color: string
  center: [number, number]
  radiusMeters?: number
  polygonPoints?: [number, number][]
}

const INITIAL_GEOFENCE_ZONES: GeofenceZone[] = [
  {
    id: 'geo-01',
    name: 'Chennai City',
    type: 'Polygon',
    vehicleCount: 8,
    color: '#3b82f6',
    center: [13.0827, 80.2707],
    polygonPoints: [
      [13.1400, 80.2200],
      [13.1200, 80.3000],
      [13.0400, 80.2800],
      [13.0200, 80.2100],
      [13.0900, 80.1900],
    ],
  },
  {
    id: 'geo-02',
    name: 'Coimbatore Zone',
    type: 'Circle',
    vehicleCount: 5,
    color: '#8b5cf6',
    center: [11.0168, 76.9558],
    radiusMeters: 4000,
  },
  {
    id: 'geo-03',
    name: 'Tiruvallur Zone',
    type: 'Polygon',
    vehicleCount: 4,
    color: '#10b981',
    center: [13.1437, 79.9083],
    polygonPoints: [
      [13.1700, 79.8800],
      [13.1600, 79.9400],
      [13.1100, 79.9300],
      [13.1200, 79.8700],
    ],
  },
  {
    id: 'geo-04',
    name: 'Salem Zone',
    type: 'Circle',
    vehicleCount: 3,
    color: '#f59e0b',
    center: [11.6643, 78.1460],
    radiusMeters: 3500,
  },
]

export const GeofencesPage: React.FC = () => {
  const [zones, setZones] = useState<GeofenceZone[]>(INITIAL_GEOFENCE_ZONES)
  const [selectedZone, setSelectedZone] = useState<GeofenceZone>(INITIAL_GEOFENCE_ZONES[0])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerGroupRef = useRef<L.LayerGroup | null>(null)

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    let map = mapRef.current
    if (!map) {
      map = L.map(mapContainerRef.current, {
        center: selectedZone.center,
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      })

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      layerGroupRef.current = L.layerGroup().addTo(map)
      mapRef.current = map
    }

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize()
      }
    })
    resizeObserver.observe(mapContainerRef.current)

    return () => {
      resizeObserver.disconnect()
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Sync Geofences on Map
  useEffect(() => {
    const map = mapRef.current
    const layerGroup = layerGroupRef.current
    if (!map || !layerGroup) return

    layerGroup.clearLayers()

    zones.forEach((zone) => {
      const isSelected = zone.id === selectedZone.id

      if (zone.type === 'Circle' && zone.radiusMeters) {
        const circle = L.circle(zone.center, {
          radius: zone.radiusMeters,
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: isSelected ? 0.35 : 0.15,
          weight: isSelected ? 3 : 1.5,
        }).addTo(layerGroup)

        circle.bindTooltip(`<b>${zone.name}</b> (${zone.vehicleCount} vehicles)`, {
          direction: 'top',
          className: 'bg-white border border-slate-200 text-slate-800 text-xs rounded-lg p-1.5 shadow-sm',
        })
      } else if (zone.type === 'Polygon' && zone.polygonPoints) {
        const polygon = L.polygon(zone.polygonPoints, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: isSelected ? 0.35 : 0.15,
          weight: isSelected ? 3 : 1.5,
        }).addTo(layerGroup)

        polygon.bindTooltip(`<b>${zone.name}</b> (${zone.vehicleCount} vehicles)`, {
          direction: 'top',
          className: 'bg-white border border-slate-200 text-slate-800 text-xs rounded-lg p-1.5 shadow-sm',
        })
      }
    })

    // Pan to selected
    map.panTo(selectedZone.center, { animate: true, duration: 0.6 })
  }, [selectedZone, zones])

  const handleCreateGeofence = (newZoneData: GeofenceZoneData) => {
    const newZone: GeofenceZone = {
      ...newZoneData,
    }
    setZones((prev) => [newZone, ...prev])
    setSelectedZone(newZone)
    if (mapRef.current) {
      mapRef.current.setView(newZone.center, 12, { animate: true })
    }
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Geofences"
        subtitle="Manage virtual boundary security zones, checkpoints, and entry/exit alerts"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Geofence
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Column: Zone List matching Mockup */}
        <div className="space-y-3 flex flex-col justify-between h-full">
          <Card title={`Active Zones (${zones.length})`}>
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {zones.map((zone) => {
                const isSelected = zone.id === selectedZone.id

                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${zone.color}20`, color: zone.color }}
                      >
                        <Radio className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{zone.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span>Type: <strong className="text-slate-700">{zone.type}</strong></span>
                          <span>•</span>
                          <span>Vehicles: <strong className="text-slate-700">{zone.vehicleCount}</strong></span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Zone Rules Info */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Zone Violation Rules
            </h4>
            <p className="text-slate-500">
              Immediate dispatch alerts trigger upon unauthorized exit or after-hours entry across all {selectedZone.name} perimeters.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Map Canvas */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="flex-1 w-full h-full min-h-[560px] rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-white relative">
            <div ref={mapContainerRef} className="w-full h-full min-h-[560px]" />
          </div>
        </div>
      </div>

      {/* Create Geofence Modal */}
      <CreateGeofenceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGeofence}
      />
    </div>
  )
}

export default GeofencesPage
