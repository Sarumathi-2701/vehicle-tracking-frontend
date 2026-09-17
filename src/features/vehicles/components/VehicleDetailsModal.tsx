import React, { useState } from 'react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import { Vehicle } from '@/types/vehicle'
import { Truck, MapPin, Gauge, Fuel, Compass, Zap, Route, Calendar, ArrowLeft } from 'lucide-react'
import { formatSpeed, formatDistance } from '@/utils/formatUtils'

export interface VehicleDetailsModalProps {
  vehicle: Vehicle | null
  isOpen: boolean
  onClose: () => void
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'maintenance' | 'documents'>('overview')

  if (!vehicle) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vehicle Details"
      subtitle={`Live telemetry inspection for ${vehicle.plateNumber}`}
      maxWidth="2xl"
    >
      <div className="space-y-5 text-left">
        {/* Top Vehicle Header */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-xs">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900">{vehicle.plateNumber}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium capitalize mt-0.5">
                {vehicle.type} • {vehicle.make} {vehicle.model} ({vehicle.year})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-700">
              ● Running
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 gap-6 text-xs font-semibold text-slate-500">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'trips', label: 'Trips' },
            { id: 'maintenance', label: 'Maintenance' },
            { id: 'documents', label: 'Documents' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 transition border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content: Overview matching Mockup */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Specs & Driver Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block">Vehicle No:</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{vehicle.plateNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Type:</span>
                <span className="font-bold text-slate-800 mt-0.5 block capitalize">{vehicle.type}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Driver:</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{vehicle.assignedDriver?.name || 'Kumar'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone:</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{vehicle.assignedDriver?.phone || '+91 98765 43210'}</span>
              </div>
            </div>

            {/* Fuel Level Gauge Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Fuel className="w-4 h-4 text-blue-600" /> Fuel Level
                </span>
                <span className="font-extrabold text-blue-600">{vehicle.fuelPercent || 75}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${vehicle.fuelPercent || 75}%` }}
                />
              </div>
            </div>

            {/* 4 Metric Cards matching Mockup */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block">Speed</span>
                <span className="text-base font-extrabold text-slate-800 mt-1 block">
                  {formatSpeed(vehicle.currentSpeedKmh || 62)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block">Direction</span>
                <span className="text-base font-extrabold text-slate-800 mt-1 block">
                  {vehicle.headingDeg || 120}°
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block">Ignition</span>
                <span className="text-base font-extrabold text-emerald-600 mt-1 block">
                  ON
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block">Total Distance</span>
                <span className="text-base font-extrabold text-slate-800 mt-1 block">
                  {formatDistance(vehicle.odometerKm || 12450)}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trips' && (
          <div className="py-6 text-center text-slate-400 text-xs">
            Trip logs for {vehicle.plateNumber} are archived. View detailed replays in Trip History.
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="py-6 text-center text-slate-400 text-xs">
            Next regular scheduled oil and brake checkup in 2,400 km. All sensors functional.
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="py-6 text-center text-slate-400 text-xs">
            Insurance and pollution certificates valid until Dec 2026.
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default VehicleDetailsModal
