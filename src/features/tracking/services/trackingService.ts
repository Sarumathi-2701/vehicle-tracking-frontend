import { Geofence, VehicleAlert } from '@/types/gps'

const INITIAL_GEOFENCES: Geofence[] = [
  {
    id: 'geo-01',
    name: 'Central Warehouse & Hub',
    center: { lat: 12.9716, lng: 77.5946 },
    radiusMeters: 1800,
    color: '#06b6d4',
    alertOnExit: true,
    alertOnEntry: true,
    assignedVehicleIds: ['veh-001', 'veh-002', 'veh-003'],
  },
  {
    id: 'geo-02',
    name: 'Electronic City Industrial Zone',
    center: { lat: 12.8399, lng: 77.6770 },
    radiusMeters: 2500,
    color: '#3b82f6',
    alertOnExit: true,
    alertOnEntry: false,
    assignedVehicleIds: ['veh-001', 'veh-003'],
  },
  {
    id: 'geo-03',
    name: 'Kempegowda Airport Logistics Bay',
    center: { lat: 13.1986, lng: 77.7066 },
    radiusMeters: 3000,
    color: '#10b981',
    alertOnExit: true,
    alertOnEntry: true,
    assignedVehicleIds: ['veh-004'],
  },
]

const INITIAL_ALERTS: VehicleAlert[] = [
  {
    id: 'alt-101',
    vehicleId: 'veh-003',
    vehicleName: 'Cold Chain Pharma Truck #12',
    plateNumber: 'KA-05-CC-3321',
    type: 'overspeed',
    severity: 'warning',
    message: 'Speed exceeded 80 km/h (Recorded: 86 km/h) on Outer Ring Road',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    location: { lat: 13.0100, lng: 77.5700 },
    isAcknowledged: false,
  },
  {
    id: 'alt-102',
    vehicleId: 'veh-001',
    vehicleName: 'Prime Logistics Hauler #101',
    plateNumber: 'KA-01-MJ-4921',
    type: 'geofence_exit',
    severity: 'info',
    message: 'Exited Central Warehouse & Hub boundary',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    location: { lat: 12.9820, lng: 77.6350 },
    isAcknowledged: true,
  },
  {
    id: 'alt-103',
    vehicleId: 'veh-002',
    vehicleName: 'Express Courier Van #42',
    plateNumber: 'KA-03-EX-9912',
    type: 'low_fuel',
    severity: 'warning',
    message: 'Fuel level below 15% remaining',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    location: { lat: 12.9250, lng: 77.6180 },
    isAcknowledged: false,
  },
]

export const trackingService = {
  async getGeofences(): Promise<Geofence[]> {
    return [...INITIAL_GEOFENCES]
  },

  async getRecentAlerts(): Promise<VehicleAlert[]> {
    return [...INITIAL_ALERTS]
  },

  async acknowledgeAlert(alertId: string): Promise<void> {
    const item = INITIAL_ALERTS.find((a) => a.id === alertId)
    if (item) {
      item.isAcknowledged = true
    }
  },
}
