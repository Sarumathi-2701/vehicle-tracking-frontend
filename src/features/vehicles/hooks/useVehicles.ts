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
        veh.assignedDriver?.name.toLowerCase().includes(filters.search.toLowerCase())

      const matchesStatus =
        filters.status === 'all' || veh.status === filters.status

      const matchesType =
        filters.type === 'all' || veh.type === filters.type

      return matchesSearch && matchesStatus && matchesType
    })
  }, [vehicles, filters])

  const stats = useMemo(() => {
    const total = vehicles.length
    const moving = vehicles.filter((v) => v.status === 'moving').length
    const idle = vehicles.filter((v) => v.status === 'idle').length
    const stopped = vehicles.filter((v) => v.status === 'stopped').length
    const offline = vehicles.filter((v) => v.status === 'offline').length

    return { total, moving, idle, stopped, offline }
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
