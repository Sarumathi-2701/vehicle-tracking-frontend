import { useEffect } from 'react'
import { useTrackingStore } from '../trackingStore'
import { useVehicleStore } from '@/features/vehicles/vehicleStore'

export function useLiveTracking() {
  const {
    liveTelemetry,
    trails,
    selectedVehicleId,
    geofences,
    alerts,
    isStreaming,
    settings,
    setSelectedVehicleId,
    acknowledgeAlert,
    updateSettings,
    initTracking,
    startStream,
    stopStream,
  } = useTrackingStore()

  const { vehicles } = useVehicleStore()

  useEffect(() => {
    initTracking()
  }, [initTracking])

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0]
  const selectedTelemetry = selectedVehicleId ? liveTelemetry[selectedVehicleId] : null
  const selectedTrail = selectedVehicleId ? trails[selectedVehicleId] || [] : []

  return {
    liveTelemetry,
    trails,
    selectedVehicleId,
    selectedVehicle,
    selectedTelemetry,
    selectedTrail,
    geofences,
    alerts,
    isStreaming,
    settings,
    setSelectedVehicleId,
    acknowledgeAlert,
    updateSettings,
    startStream,
    stopStream,
  }
}

export default useLiveTracking
