export type VehicleType = 'truck' | 'van' | 'car' | 'bus' | 'motorcycle'

export type VehicleStatus = 'moving' | 'idle' | 'stopped' | 'offline'

export interface Driver {
  id: string
  name: string
  phone: string
  licenseNumber: string
  avatar?: string
}

export interface Vehicle {
  id: string
  plateNumber: string
  name: string
  type: VehicleType
  make: string
  model: string
  year: number
  vin: string
  deviceImei: string
  simCardNumber: string
  assignedDriver?: Driver
  status: VehicleStatus
  lastUpdated: string
  fuelCapacityLiters: number
  currentFuelLiters: number
  odometerKm: number
  speedLimitKmh: number
  currentSpeedKmh: number
}
