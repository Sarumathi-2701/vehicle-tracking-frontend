import { create } from 'zustand'
import { VehicleTelemetry, GpsLocation, Geofence, VehicleAlert } from '@/types/gps'
import { TrackingSettings } from './types'
import { trackingService } from './services/trackingService'
import signalRService from '@/services/signalr/signalrConnection'
import { useVehicleStore } from '@/features/vehicles/vehicleStore'

interface TrackingStoreState {
  liveTelemetry: Record<string, VehicleTelemetry>
  trails: Record<string, GpsLocation[]>
  selectedVehicleId: string | null
  geofences: Geofence[]
  alerts: VehicleAlert[]
  isStreaming: boolean
  settings: TrackingSettings

  setSelectedVehicleId: (id: string | null) => void
  updateTelemetry: (telemetry: VehicleTelemetry) => void
  addAlert: (alert: VehicleAlert) => void
  acknowledgeAlert: (alertId: string) => void
  updateSettings: (newSettings: Partial<TrackingSettings>) => void

  initTracking: () => Promise<void>
  startStream: () => void
  stopStream: () => void
}

const defaultSettings: TrackingSettings = {
  followSelectedVehicle: true,
  showGeofences: true,
  showTrails: true,
  maxTrailPoints: 60,
  refreshRateSec: 2.5,
}

export const useTrackingStore = create<TrackingStoreState>((set, get) => ({
  liveTelemetry: {},
  trails: {},
  selectedVehicleId: 'veh-001',
  geofences: [],
  alerts: [],
  isStreaming: false,
  settings: defaultSettings,

  setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),

  updateTelemetry: (telemetry) => {
    const { vehicleId, location, ignition } = telemetry
    const maxPoints = get().settings.maxTrailPoints

    set((state) => {
      const existingTrail = state.trails[vehicleId] || []
      const newTrail = [...existingTrail, location].slice(-maxPoints)

      return {
        liveTelemetry: {
          ...state.liveTelemetry,
          [vehicleId]: telemetry,
        },
        trails: {
          ...state.trails,
          [vehicleId]: newTrail,
        },
      }
    })

    // Also update general vehicle store live speed and status
    const status = !ignition ? 'stopped' : telemetry.location.speedKmh > 2 ? 'moving' : 'idle'
    useVehicleStore.getState().updateVehicleLiveTelemetry(
      vehicleId,
      telemetry.location.speedKmh,
      status,
      telemetry.odometerKm
    )
  },

  addAlert: (alert) => {
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 50),
    }))
  },

  acknowledgeAlert: async (alertId) => {
    await trackingService.acknowledgeAlert(alertId)
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, isAcknowledged: true } : a
      ),
    }))
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }))
  },

  initTracking: async () => {
    const [geofences, alerts] = await Promise.all([
      trackingService.getGeofences(),
      trackingService.getRecentAlerts(),
    ])
    set({ geofences, alerts })
    get().startStream()
  },

  startStream: () => {
    if (get().isStreaming) return
    set({ isStreaming: true })

    signalRService.subscribeTelemetry((telemetry) => {
      get().updateTelemetry(telemetry)
    })

    signalRService.subscribeAlerts((alert) => {
      get().addAlert(alert)
    })

    signalRService.startConnection()
  },

  stopStream: () => {
    signalRService.stopConnection()
    set({ isStreaming: false })
  },
}))
