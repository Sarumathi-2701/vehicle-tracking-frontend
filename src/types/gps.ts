export interface LatLng {
  lat: number
  lng: number
}

export interface GpsLocation extends LatLng {
  altitude?: number
  heading: number // 0-360 degrees
  speedKmh: number
  accuracyMeters?: number
  satellitesCount?: number
  timestamp: string
  address?: string
}

export interface VehicleTelemetry {
  vehicleId: string
  location: GpsLocation
  ignition: boolean
  batteryVolts: number
  batteryPercent: number
  fuelLevelPercent: number
  engineTempCelsius: number
  odometerKm: number
  isOverspeeding: boolean
  isGeofenceViolated: boolean
}

export interface Geofence {
  id: string
  name: string
  center: LatLng
  radiusMeters: number
  color?: string
  alertOnExit: boolean
  alertOnEntry: boolean
  assignedVehicleIds: string[]
}

export interface TripPoint extends LatLng {
  timestamp: string
  speedKmh: number
}

export interface Trip {
  id: string
  vehicleId: string
  driverName: string
  startTime: string
  endTime: string
  startAddress: string
  endAddress: string
  distanceKm: number
  durationMinutes: number
  maxSpeedKmh: number
  averageSpeedKmh: number
  idleMinutes: number
  routePoints: TripPoint[]
}

export type AlertSeverity = 'critical' | 'warning' | 'info'
export type AlertType = 'overspeed' | 'geofence_entry' | 'geofence_exit' | 'sos' | 'low_fuel' | 'low_battery' | 'harsh_braking'

export interface VehicleAlert {
  id: string
  vehicleId: string
  vehicleName: string
  plateNumber: string
  type: AlertType
  severity: AlertSeverity
  message: string
  timestamp: string
  location: LatLng
  isAcknowledged: boolean
}
