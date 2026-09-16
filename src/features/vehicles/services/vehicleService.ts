import { Vehicle } from '@/types/vehicle'
import { VehicleFormData } from '../types'

const INITIAL_FLEET: Vehicle[] = [
  {
    id: 'veh-001',
    plateNumber: 'KA-01-MJ-4921',
    name: 'Prime Logistics Hauler #101',
    type: 'truck',
    make: 'Volvo',
    model: 'FH16 Heavy',
    year: 2023,
    vin: 'YV2RT40A5NA819201',
    deviceImei: '862910048912831',
    simCardNumber: '+91 98450 11201',
    assignedDriver: {
      id: 'drv-01',
      name: 'Rajesh Kumar',
      phone: '+91 98450 44321',
      licenseNumber: 'DL-0420110023419',
    },
    status: 'moving',
    lastUpdated: new Date().toISOString(),
    fuelCapacityLiters: 400,
    currentFuelLiters: 328,
    odometerKm: 12450.5,
    speedLimitKmh: 80,
    currentSpeedKmh: 58,
  },
  {
    id: 'veh-002',
    plateNumber: 'KA-03-EX-9912',
    name: 'Express Courier Van #42',
    type: 'van',
    make: 'Mercedes-Benz',
    model: 'Sprinter 316',
    year: 2024,
    vin: 'WDB9066331S847192',
    deviceImei: '862910048912832',
    simCardNumber: '+91 98450 11202',
    assignedDriver: {
      id: 'drv-02',
      name: 'Anil Sharma',
      phone: '+91 98450 44322',
      licenseNumber: 'DL-0420180098124',
    },
    status: 'moving',
    lastUpdated: new Date().toISOString(),
    fuelCapacityLiters: 85,
    currentFuelLiters: 54,
    odometerKm: 48902.0,
    speedLimitKmh: 75,
    currentSpeedKmh: 44,
  },
  {
    id: 'veh-003',
    plateNumber: 'KA-05-CC-3321',
    name: 'Cold Chain Pharma Truck #12',
    type: 'truck',
    make: 'Tata',
    model: 'Prima 2830.K',
    year: 2022,
    vin: 'MAT422001N8192834',
    deviceImei: '862910048912833',
    simCardNumber: '+91 98450 11203',
    assignedDriver: {
      id: 'drv-03',
      name: 'Vikram Singh',
      phone: '+91 98450 44323',
      licenseNumber: 'DL-0420160077812',
    },
    status: 'moving',
    lastUpdated: new Date().toISOString(),
    fuelCapacityLiters: 300,
    currentFuelLiters: 273,
    odometerKm: 8931.2,
    speedLimitKmh: 80,
    currentSpeedKmh: 68,
  },
  {
    id: 'veh-004',
    plateNumber: 'KA-51-AP-7700',
    name: 'Executive Airport Shuttle #07',
    type: 'bus',
    make: 'Toyota',
    model: 'Coaster Luxury',
    year: 2023,
    vin: 'JT3HN81V5H0029182',
    deviceImei: '862910048912834',
    simCardNumber: '+91 98450 11204',
    assignedDriver: {
      id: 'drv-04',
      name: 'Suresh Babu',
      phone: '+91 98450 44324',
      licenseNumber: 'DL-0420140033190',
    },
    status: 'stopped',
    lastUpdated: new Date().toISOString(),
    fuelCapacityLiters: 95,
    currentFuelLiters: 45,
    odometerKm: 64100.8,
    speedLimitKmh: 70,
    currentSpeedKmh: 0,
  },
  {
    id: 'veh-005',
    plateNumber: 'KA-04-CT-5544',
    name: 'City Rapid Transit #19',
    type: 'bus',
    make: 'Ashok Leyland',
    model: 'Viking City',
    year: 2021,
    vin: 'MB1A123C4D5678901',
    deviceImei: '862910048912835',
    simCardNumber: '+91 98450 11205',
    assignedDriver: {
      id: 'drv-05',
      name: 'Gopal Nair',
      phone: '+91 98450 44325',
      licenseNumber: 'DL-0420120019283',
    },
    status: 'idle',
    lastUpdated: new Date().toISOString(),
    fuelCapacityLiters: 160,
    currentFuelLiters: 88,
    odometerKm: 112340.0,
    speedLimitKmh: 60,
    currentSpeedKmh: 0,
  },
  {
    id: 'veh-006',
    plateNumber: 'KA-02-MD-1188',
    name: 'Emergency Maintenance Van #03',
    type: 'van',
    make: 'Ford',
    model: 'Transit Custom',
    year: 2022,
    vin: 'WF0XXXTTGXDK12984',
    deviceImei: '862910048912836',
    simCardNumber: '+91 98450 11206',
    status: 'offline',
    lastUpdated: new Date(Date.now() - 3600000 * 5).toISOString(),
    fuelCapacityLiters: 70,
    currentFuelLiters: 35,
    odometerKm: 78200.4,
    speedLimitKmh: 80,
    currentSpeedKmh: 0,
  },
]

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    // Return cloned mock vehicles
    return [...INITIAL_FLEET]
  },

  async createVehicle(formData: VehicleFormData): Promise<Vehicle> {
    const newVehicle: Vehicle = {
      id: `veh-${Date.now().toString().slice(-4)}`,
      plateNumber: formData.plateNumber,
      name: formData.name,
      type: formData.type,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      vin: formData.vin,
      deviceImei: formData.deviceImei,
      simCardNumber: formData.simCardNumber,
      status: 'stopped',
      lastUpdated: new Date().toISOString(),
      fuelCapacityLiters: formData.fuelCapacityLiters,
      currentFuelLiters: formData.fuelCapacityLiters,
      odometerKm: 0,
      speedLimitKmh: formData.speedLimitKmh,
      currentSpeedKmh: 0,
      assignedDriver: formData.driverName
        ? {
            id: `drv-${Date.now().toString().slice(-3)}`,
            name: formData.driverName,
            phone: formData.driverPhone || '+91 90000 00000',
            licenseNumber: 'DL-TEMP-001',
          }
        : undefined,
    }
    return newVehicle
  },

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    const existing = INITIAL_FLEET.find((v) => v.id === id)
    if (!existing) throw new Error('Vehicle not found')
    return { ...existing, ...updates, lastUpdated: new Date().toISOString() }
  },

  async deleteVehicle(id: string): Promise<void> {
    const idx = INITIAL_FLEET.findIndex((v) => v.id === id)
    if (idx !== -1) {
      INITIAL_FLEET.splice(idx, 1)
    }
  },
}
