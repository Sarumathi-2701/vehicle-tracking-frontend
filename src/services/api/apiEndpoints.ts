export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  VEHICLES: {
    BASE: '/vehicles',
    DETAIL: (id: string) => `/vehicles/${id}`,
    TELEMETRY: (id: string) => `/vehicles/${id}/telemetry`,
    STATS: '/vehicles/stats',
  },
  TRACKING: {
    LIVE_POSITIONS: '/tracking/live',
    VEHICLE_HISTORY: (id: string) => `/tracking/history/${id}`,
  },
  TRIPS: {
    BASE: '/trips',
    DETAIL: (id: string) => `/trips/${id}`,
    BY_VEHICLE: (vehicleId: string) => `/trips/vehicle/${vehicleId}`,
  },
  ALERTS: {
    BASE: '/alerts',
    ACKNOWLEDGE: (id: string) => `/alerts/${id}/ack`,
    STATS: '/alerts/stats',
  },
  GEOFENCES: {
    BASE: '/geofences',
    DETAIL: (id: string) => `/geofences/${id}`,
  },
  REPORTS: {
    FLEET_SUMMARY: '/reports/fleet-summary',
    FUEL_CONSUMPTION: '/reports/fuel',
    SPEED_VIOLATIONS: '/reports/speed-violations',
  },
} as const
