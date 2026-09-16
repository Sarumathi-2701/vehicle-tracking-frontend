import React, { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import { Play, Pause, RotateCcw, Calendar, Clock, MapPin, Route, Gauge } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import { Trip } from '@/types/gps'
import { formatDuration, formatDate } from '@/utils/dateUtils'
import { formatDistance, formatSpeed } from '@/utils/formatUtils'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'

const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-001',
    vehicleId: 'veh-001',
    driverName: 'Rajesh Kumar',
    startTime: new Date(Date.now() - 3600000 * 5).toISOString(),
    endTime: new Date(Date.now() - 3600000 * 2).toISOString(),
    startAddress: 'Central Warehouse Dock #4, MG Road, Bangalore',
    endAddress: 'Whitefield Tech Park Distribution Center',
    distanceKm: 28.4,
    durationMinutes: 180,
    maxSpeedKmh: 76,
    averageSpeedKmh: 42,
    idleMinutes: 24,
    routePoints: [
      { lat: 12.9716, lng: 77.5946, timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), speedKmh: 0 },
      { lat: 12.9740, lng: 77.6050, timestamp: new Date(Date.now() - 3600000 * 4.5).toISOString(), speedKmh: 35 },
      { lat: 12.9780, lng: 77.6200, timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), speedKmh: 52 },
      { lat: 12.9820, lng: 77.6350, timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(), speedKmh: 68 },
      { lat: 12.9860, lng: 77.6600, timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), speedKmh: 76 },
      { lat: 12.9890, lng: 77.7000, timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(), speedKmh: 48 },
      { lat: 12.9698, lng: 77.7500, timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), speedKmh: 0 },
    ],
  },
  {
    id: 'trip-002',
    vehicleId: 'veh-002',
    driverName: 'Anil Sharma',
    startTime: new Date(Date.now() - 3600000 * 9).toISOString(),
    endTime: new Date(Date.now() - 3600000 * 6.5).toISOString(),
    startAddress: 'Koramangala 4th Block Dispatch Bay',
    endAddress: 'Electronic City Phase 1 Logistics Gate',
    distanceKm: 19.8,
    durationMinutes: 150,
    maxSpeedKmh: 64,
    averageSpeedKmh: 38,
    idleMinutes: 18,
    routePoints: [
      { lat: 12.9352, lng: 77.6245, timestamp: new Date(Date.now() - 3600000 * 9).toISOString(), speedKmh: 0 },
      { lat: 12.9180, lng: 77.6050, timestamp: new Date(Date.now() - 3600000 * 8.5).toISOString(), speedKmh: 42 },
      { lat: 12.8900, lng: 77.6400, timestamp: new Date(Date.now() - 3600000 * 7.5).toISOString(), speedKmh: 64 },
      { lat: 12.8399, lng: 77.6770, timestamp: new Date(Date.now() - 3600000 * 6.5).toISOString(), speedKmh: 0 },
    ],
  },
]

export const TripHistoryPage: React.FC = () => {
  const { vehicles } = useVehicles()
  const [selectedTrip, setSelectedTrip] = useState<Trip>(MOCK_TRIPS[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackIndex, setPlaybackIndex] = useState(0)

  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const polylineRef = useRef<L.Polyline | null>(null)

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.9716, 77.5946],
        zoom: 12,
        zoomControl: false,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Draw Trip Route when selectedTrip changes
  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedTrip) return

    if (polylineRef.current) map.removeLayer(polylineRef.current)
    if (markerRef.current) map.removeLayer(markerRef.current)

    const latLngs = selectedTrip.routePoints.map((pt) => [pt.lat, pt.lng] as [number, number])

    if (latLngs.length > 0) {
      // Draw path line
      polylineRef.current = L.polyline(latLngs, {
        color: '#06b6d4',
        weight: 4,
        opacity: 0.85,
      }).addTo(map)

      // Fit map bounds
      map.fitBounds(polylineRef.current.getBounds(), { padding: [40, 40] })

      // Create animated vehicle marker
      const startPt = latLngs[0]
      const icon = L.divIcon({
        className: 'playback-marker',
        html: `
          <div class="w-8 h-8 rounded-full bg-cyan-500 border-2 border-white shadow-xl flex items-center justify-center text-slate-950 font-bold text-xs">
            🏎️
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      markerRef.current = L.marker(startPt, { icon }).addTo(map)
    }

    setPlaybackIndex(0)
    setIsPlaying(false)
  }, [selectedTrip])

  // Playback timer
  useEffect(() => {
    let timer: any = null
    if (isPlaying && selectedTrip) {
      timer = setInterval(() => {
        setPlaybackIndex((prev) => {
          if (prev >= selectedTrip.routePoints.length - 1) {
            setIsPlaying(false)
            return prev
          }
          const next = prev + 1
          const pt = selectedTrip.routePoints[next]
          if (markerRef.current && mapRef.current) {
            markerRef.current.setLatLng([pt.lat, pt.lng])
          }
          return next
        })
      }, 1200)
    }
    return () => clearInterval(timer)
  }, [isPlaying, selectedTrip])

  const currentPoint = selectedTrip.routePoints[playbackIndex]

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Trip History & Route Replay"
        subtitle="Historical trip logs, telemetry analysis, and animated GPS playback"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Trip Selector & Trip Details */}
        <div className="space-y-4">
          <Card title="Recorded Trips" subtitle="Select a trip to inspect or replay">
            <div className="space-y-2.5">
              {MOCK_TRIPS.map((trip) => {
                const isSelected = trip.id === selectedTrip.id

                return (
                  <div
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-white mb-1">
                      <span>{trip.driverName}</span>
                      <span className="text-cyan-400 font-bold">{formatDistance(trip.distanceKm)}</span>
                    </div>

                    <div className="text-slate-400 space-y-1">
                      <p className="truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" /> {trip.startAddress}
                      </p>
                      <p className="truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" /> {trip.endAddress}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-500">
                      <span>{formatDate(trip.startTime)}</span>
                      <span>{formatDuration(trip.durationMinutes)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Trip Analytics Stats */}
          <Card title="Trip Summary Analytics">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block">Distance</span>
                <span className="text-base font-bold text-white mt-1 block">
                  {formatDistance(selectedTrip.distanceKm)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block">Duration</span>
                <span className="text-base font-bold text-white mt-1 block">
                  {formatDuration(selectedTrip.durationMinutes)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block">Max Speed</span>
                <span className="text-base font-bold text-rose-400 mt-1 block">
                  {formatSpeed(selectedTrip.maxSpeedKmh)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block">Idle Time</span>
                <span className="text-base font-bold text-amber-400 mt-1 block">
                  {selectedTrip.idleMinutes} mins
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Route Map & Playback Scrubbing Bar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 backdrop-blur-md p-4 space-y-4">
            {/* Map Canvas */}
            <div className="h-96 w-full rounded-xl overflow-hidden border border-slate-800 relative">
              <div ref={mapContainerRef} className="w-full h-full" />
            </div>

            {/* Playback Controls & Timeline Scrubber */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isPlaying ? 'secondary' : 'primary'}
                    icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? 'Pause' : 'Play Route'}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setPlaybackIndex(0)
                      setIsPlaying(false)
                      if (markerRef.current && selectedTrip.routePoints[0]) {
                        markerRef.current.setLatLng([
                          selectedTrip.routePoints[0].lat,
                          selectedTrip.routePoints[0].lng,
                        ])
                      }
                    }}
                  >
                    Reset
                  </Button>
                </div>

                {currentPoint && (
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400">
                      Speed: <strong className="text-white">{formatSpeed(currentPoint.speedKmh)}</strong>
                    </span>
                    <span className="text-slate-500 font-mono">
                      Waypoint {playbackIndex + 1} of {selectedTrip.routePoints.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Slider */}
              <input
                type="range"
                min={0}
                max={selectedTrip.routePoints.length - 1}
                value={playbackIndex}
                onChange={(e) => {
                  const idx = Number(e.target.value)
                  setPlaybackIndex(idx)
                  const pt = selectedTrip.routePoints[idx]
                  if (markerRef.current) markerRef.current.setLatLng([pt.lat, pt.lng])
                }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripHistoryPage
