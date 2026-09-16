import { DashboardMetrics } from '../types'

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    return {
      totalVehicles: 6,
      activeMoving: 3,
      idleVehicles: 1,
      stoppedVehicles: 1,
      offlineVehicles: 1,
      activeAlerts: 3,
      fleetDistanceKmToday: 1420.8,
      averageFleetSpeedKmh: 48.5,
      averageFuelConsumptionL100Km: 26.4,
    }
  },
}
