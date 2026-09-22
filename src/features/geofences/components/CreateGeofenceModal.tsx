import React, { useState } from 'react'
import Modal from '@/components/common/Modal'
import Input from '@/components/forms/Input'
import Select from '@/components/forms/Select'
import Button from '@/components/common/Button'
import { MapPin, Shield, Circle, Pentagon, Sparkles } from 'lucide-react'

export interface GeofenceZoneData {
  id: string
  name: string
  type: 'Circle' | 'Polygon'
  vehicleCount: number
  color: string
  center: [number, number]
  radiusMeters?: number
  polygonPoints?: [number, number][]
}

export interface CreateGeofenceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: GeofenceZoneData) => void
}

const TAMIL_NADU_CITIES = [
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
  { name: 'Trichy', lat: 10.7905, lng: 78.7047 },
  { name: 'Salem', lat: 11.6643, lng: 78.1460 },
  { name: 'Tiruvallur', lat: 13.1437, lng: 79.9083 },
  { name: 'Vellore', lat: 12.9165, lng: 79.1325 },
  { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567 },
]

const COLOR_PRESETS = [
  { label: 'Blue', value: '#3b82f6', bg: 'bg-blue-500' },
  { label: 'Emerald', value: '#10b981', bg: 'bg-emerald-500' },
  { label: 'Purple', value: '#8b5cf6', bg: 'bg-purple-500' },
  { label: 'Amber', value: '#f59e0b', bg: 'bg-amber-500' },
  { label: 'Rose', value: '#ef4444', bg: 'bg-rose-500' },
  { label: 'Cyan', value: '#06b6d4', bg: 'bg-cyan-500' },
]

export const CreateGeofenceModal: React.FC<CreateGeofenceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('')
  const [type, setType] = useState<'Circle' | 'Polygon'>('Circle')
  const [city, setCity] = useState(TAMIL_NADU_CITIES[0].name)
  const [lat, setLat] = useState(TAMIL_NADU_CITIES[0].lat)
  const [lng, setLng] = useState(TAMIL_NADU_CITIES[0].lng)
  const [radiusMeters, setRadiusMeters] = useState(3000)
  const [color, setColor] = useState(COLOR_PRESETS[0].value)
  const [alertOnExit, setAlertOnExit] = useState(true)
  const [alertOnEntry, setAlertOnEntry] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCityChange = (cityName: string) => {
    setCity(cityName)
    const found = TAMIL_NADU_CITIES.find((c) => c.name === cityName)
    if (found) {
      setLat(found.lat)
      setLng(found.lng)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)

    const newZone: GeofenceZoneData = {
      id: `geo-${Date.now()}`,
      name: name.trim(),
      type,
      vehicleCount: Math.floor(Math.random() * 6) + 1,
      color,
      center: [Number(lat), Number(lng)],
      radiusMeters: type === 'Circle' ? Number(radiusMeters) : undefined,
      polygonPoints:
        type === 'Polygon'
          ? [
              [Number(lat) + 0.03, Number(lng) - 0.03],
              [Number(lat) + 0.02, Number(lng) + 0.04],
              [Number(lat) - 0.03, Number(lng) + 0.03],
              [Number(lat) - 0.02, Number(lng) - 0.04],
            ]
          : undefined,
    }

    onSubmit(newZone)
    setIsSubmitting(false)
    onClose()

    // Reset form
    setName('')
    setType('Circle')
    setRadiusMeters(3000)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Geofence Zone"
      subtitle="Define a virtual boundary and setup real-time security alert triggers"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
        {/* Zone Name */}
        <Input
          label="Geofence Name"
          placeholder="e.g. Madurai Industrial Hub, Trichy Airport Zone"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Boundary Geometry Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Boundary Geometry Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('Circle')}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                type === 'Circle'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Circle className="w-4 h-4" />
              Radial Circle
            </button>
            <button
              type="button"
              onClick={() => setType('Polygon')}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                type === 'Polygon'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Pentagon className="w-4 h-4" />
              Custom Polygon
            </button>
          </div>
        </div>

        {/* City Quick Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Select
              label="Location / City"
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              options={TAMIL_NADU_CITIES.map((c) => ({
                label: c.name,
                value: c.name,
              }))}
            />
          </div>
          <div>
            <Input
              label="Latitude"
              type="number"
              step="0.0001"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value))}
              required
            />
          </div>
          <div>
            <Input
              label="Longitude"
              type="number"
              step="0.0001"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value))}
              required
            />
          </div>
        </div>

        {/* Radius in Meters (for circle) */}
        {type === 'Circle' && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Radius (Meters)
              </label>
              <span className="text-xs font-bold text-blue-600">{radiusMeters} m ({((radiusMeters / 1000).toFixed(1))} km)</span>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="500"
              value={radiusMeters}
              onChange={(e) => setRadiusMeters(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        )}

        {/* Color Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Zone Boundary Color
          </label>
          <div className="flex items-center gap-3">
            {COLOR_PRESETS.map((p) => {
              const isSelected = color === p.value
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setColor(p.value)}
                  className={`w-7 h-7 rounded-full ${p.bg} transition transform hover:scale-110 flex items-center justify-center cursor-pointer ring-2 ${
                    isSelected ? 'ring-slate-900 ring-offset-2' : 'ring-transparent'
                  }`}
                  title={p.label}
                />
              )
            })}
          </div>
        </div>

        {/* Security Rule Alerts */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-600" /> Security Violation Rules
          </span>
          <label className="flex items-center gap-2 cursor-pointer text-slate-600">
            <input
              type="checkbox"
              checked={alertOnExit}
              onChange={(e) => setAlertOnExit(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            Dispatch alert immediately when any vehicle exits zone
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-600">
            <input
              type="checkbox"
              checked={alertOnEntry}
              onChange={(e) => setAlertOnEntry(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            Dispatch alert on after-hours entry
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting || !name.trim()}>
            {isSubmitting ? 'Saving...' : 'Save Geofence'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateGeofenceModal
