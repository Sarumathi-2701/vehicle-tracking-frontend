import { useEffect, useMemo } from 'react'
import { useVehicleStore } from '../vehicleStore'

export function useVehicles() {
  const {
    vehicles,
    selectedVehicle,
    isLoading,
    error,
    filters,
    setFilter,
    resetFilters,
    fetchVehicles,
    selectVehicle,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  } = useVehicleStore()

  useEffect(() => {
    if (vehicles.length === 0) {
      fetchVehicles()
    }
  }, [vehicles.length, fetchVehicles])

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((veh) => {
      const matchesSearch =
        filters.search === '' ||
        veh.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        veh.plateNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        veh.locationCity?.toLowerCase().includes(filters.search.toLowerCase()) ||
        veh.assignedDriver?.name.toLowerCase().includes(filters.search.toLowerCase())

      const matchesStatus =
        filters.status === 'all' ||
        veh.status === filters.status ||
        (filters.status === 'running' && veh.status === 'moving') ||
        (filters.status === 'parked' && veh.status === 'stopped')

      const matchesType =
        filters.type === 'all' || veh.type === filters.type

      return matchesSearch && matchesStatus && matchesType
    })
  }, [vehicles, filters])

  const stats = useMemo(() => {
    const total = vehicles.length
    const running = vehicles.filter((v) => v.status === 'running' || v.status === 'moving').length
    const idle = vehicles.filter((v) => v.status === 'idle').length
    const parked = vehicles.filter((v) => v.status === 'parked' || v.status === 'stopped').length
    const offline = vehicles.filter((v) => v.status === 'offline').length

    return { total, running, moving: running, idle, parked, stopped: parked, offline }
  }, [vehicles])

  return {
    vehicles: filteredVehicles,
    allVehicles: vehicles,
    selectedVehicle,
    isLoading,
    error,
    filters,
    stats,
    setFilter,
    resetFilters,
    fetchVehicles,
    selectVehicle,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  }
}

export default useVehicles
