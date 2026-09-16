import { Vehicle, VehicleStatus, VehicleType } from '@/types/vehicle'

export interface VehicleFilterState {
  search: string
  status: VehicleStatus | 'all'
  type: VehicleType | 'all'
}

export interface VehicleFormData {
  plateNumber: string
  name: string
  type: VehicleType
  make: string
  model: string
  year: number
  vin: string
  deviceImei: string
  simCardNumber: string
  fuelCapacityLiters: number
  speedLimitKmh: number
  driverName?: string
  driverPhone?: string
}
