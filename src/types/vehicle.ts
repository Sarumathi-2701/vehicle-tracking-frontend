export type VehicleType = 'truck' | 'van' | 'car' | 'bus' | 'lorry' | 'motorcycle'

export type VehicleStatus = 'running' | 'moving' | 'idle' | 'parked' | 'stopped' | 'offline'

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
  locationCity: string
  assignedDriver?: Driver
  status: VehicleStatus
  lastUpdated: string
  fuelCapacityLiters: number
  currentFuelLiters: number
  fuelPercent: number
  odometerKm: number
  speedLimitKmh: number
  currentSpeedKmh: number
  headingDeg: number
  latitude: number
  longitude: number
}
