export interface DashboardMetrics {
  totalVehicles: number
  runningVehicles: number
  idleVehicles: number
  parkedVehicles: number
  offlineVehicles: number
  totalDistanceKm: number
  totalTrips: number
  avgSpeedKmh: number
  fuelUsageLiters: number
}

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    return {
      totalVehicles: 24,
      runningVehicles: 16,
      idleVehicles: 5,
      parkedVehicles: 2,
      offlineVehicles: 1,
      totalDistanceKm: 18460,
      totalTrips: 612,
      avgSpeedKmh: 56,
      fuelUsageLiters: 3420,
    }
  },
}
