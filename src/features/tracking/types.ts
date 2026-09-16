import { GpsLocation, VehicleTelemetry, Geofence, VehicleAlert } from '@/types/gps'

export interface LiveVehicleState {
  vehicleId: string
  location: GpsLocation
  telemetry: VehicleTelemetry
  trail: GpsLocation[]
  lastUpdate: string
}

export interface TrackingSettings {
  followSelectedVehicle: boolean
  showGeofences: boolean
  showTrails: boolean
  maxTrailPoints: number
  refreshRateSec: number
}
