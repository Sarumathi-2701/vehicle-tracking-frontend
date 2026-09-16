import React, { useState } from 'react'
import Modal from '@/components/common/Modal'
import Input from '@/components/forms/Input'
import Select from '@/components/forms/Select'
import Button from '@/components/common/Button'
import { VehicleFormData } from '../types'
import { VehicleType } from '@/types/vehicle'

export interface AddVehicleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: VehicleFormData) => Promise<boolean>
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<VehicleFormData>({
    plateNumber: '',
    name: '',
    type: 'truck',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    deviceImei: '',
    simCardNumber: '',
    fuelCapacityLiters: 100,
    speedLimitKmh: 80,
    driverName: '',
    driverPhone: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const success = await onSubmit(formData)
    setIsSubmitting(false)
    if (success) {
      onClose()
      // reset form
      setFormData({
        plateNumber: '',
        name: '',
        type: 'truck',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        vin: '',
        deviceImei: '',
        simCardNumber: '',
        fuelCapacityLiters: 100,
        speedLimitKmh: 80,
        driverName: '',
        driverPhone: '',
      })
    }
  }

  const typeOptions = [
    { value: 'truck', label: 'Heavy Truck' },
    { value: 'van', label: 'Delivery Van' },
    { value: 'bus', label: 'Transit Bus / Shuttle' },
    { value: 'car', label: 'Fleet Car / Sedan' },
    { value: 'motorcycle', label: 'Motorcycle / Courier' },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll New Fleet Vehicle"
      subtitle="Register a new vehicle with GPS hardware unit and assigned driver"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Vehicle Name / Code"
            placeholder="e.g. Hauler Unit #105"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="License Plate Number"
            placeholder="e.g. KA-01-AB-1234"
            required
            value={formData.plateNumber}
            onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Vehicle Type"
            options={typeOptions}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as VehicleType })}
          />

          <Input
            label="Make (Brand)"
            placeholder="e.g. Volvo / Tata"
            required
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          />

          <Input
            label="Model"
            placeholder="e.g. FH16 / Prima"
            required
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Manufacturing Year"
            type="number"
            min={2000}
            max={2030}
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
          />

          <Input
            label="Speed Limit (km/h)"
            type="number"
            min={40}
            max={150}
            value={formData.speedLimitKmh}
            onChange={(e) => setFormData({ ...formData, speedLimitKmh: Number(e.target.value) })}
          />

          <Input
            label="Fuel Tank Capacity (L)"
            type="number"
            min={10}
            max={1000}
            value={formData.fuelCapacityLiters}
            onChange={(e) => setFormData({ ...formData, fuelCapacityLiters: Number(e.target.value) })}
          />
        </div>

        <div className="border-t border-slate-800 pt-3">
          <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
            GPS Telematics Hardware
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GPS Device IMEI"
              placeholder="15-digit IMEI number"
              required
              value={formData.deviceImei}
              onChange={(e) => setFormData({ ...formData, deviceImei: e.target.value })}
            />

            <Input
              label="SIM Card MSISDN / Phone"
              placeholder="+91 98000 00000"
              required
              value={formData.simCardNumber}
              onChange={(e) => setFormData({ ...formData, simCardNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="border-t border-slate-800 pt-3">
          <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
            Assigned Driver (Optional)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Driver Name"
              placeholder="e.g. Ramesh Patel"
              value={formData.driverName || ''}
              onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
            />

            <Input
              label="Driver Contact"
              placeholder="+91 98450 00000"
              value={formData.driverPhone || ''}
              onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Register Vehicle
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddVehicleModal
