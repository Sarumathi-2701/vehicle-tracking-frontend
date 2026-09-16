import { LatLng } from '@/types/gps'

/**
 * Calculates the great-circle distance between two points using the Haversine formula in Kilometers.
 */
export function calculateDistanceKm(point1: LatLng, point2: LatLng): number {
  const R = 6371 // Earth radius in km
  const dLat = degToRad(point2.lat - point1.lat)
  const dLng = degToRad(point2.lng - point1.lng)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(point1.lat)) *
      Math.cos(degToRad(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 100) / 100
}

/**
 * Computes bearing (heading in degrees 0-360) from point1 to point2.
 */
export function calculateBearing(point1: LatLng, point2: LatLng): number {
  const lat1 = degToRad(point1.lat)
  const lat2 = degToRad(point2.lat)
  const dLng = degToRad(point2.lng - point1.lng)

  const y = Math.sin(dLng) * Math.cos(lat2)
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)

  const brng = radToDeg(Math.atan2(y, x))
  return (Math.round(brng) + 360) % 360
}

/**
 * Checks if a point is within a circular geofence.
 */
export function isPointInsideGeofence(
  point: LatLng,
  center: LatLng,
  radiusMeters: number
): boolean {
  const distanceKm = calculateDistanceKm(point, center)
  return distanceKm * 1000 <= radiusMeters
}

/**
 * Converts degrees to compass cardinal direction.
 */
export function headingToCompass(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8
  return directions[index]
}

function degToRad(deg: number): number {
  return deg * (Math.PI / 180)
}

function radToDeg(rad: number): number {
  return rad * (180 / Math.PI)
}
