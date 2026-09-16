import { create } from 'zustand'
import { Vehicle, VehicleStatus, VehicleType } from '@/types/vehicle'
import { vehicleService } from './services/vehicleService'
import { VehicleFilterState, VehicleFormData } from './types'

interface VehicleStoreState {
  vehicles: Vehicle[]
  selectedVehicle: Vehicle | null
  isLoading: boolean
  error: string | null

  filters: VehicleFilterState
  setFilter: (key: keyof VehicleFilterState, value: any) => void
  resetFilters: () => void

  fetchVehicles: () => Promise<void>
  selectVehicle: (vehicle: Vehicle | null) => void
  addVehicle: (formData: VehicleFormData) => Promise<boolean>
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<boolean>
  deleteVehicle: (id: string) => Promise<boolean>
  updateVehicleLiveTelemetry: (vehicleId: string, speedKmh: number, status: VehicleStatus, odometer: number) => void
}

const defaultFilters: VehicleFilterState = {
  search: '',
  status: 'all',
  type: 'all',
}

export const useVehicleStore = create<VehicleStoreState>((set, get) => ({
  vehicles: [],
  selectedVehicle: null,
  isLoading: false,
  error: null,
  filters: defaultFilters,

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }))
  },

  resetFilters: () => set({ filters: defaultFilters }),

  fetchVehicles: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await vehicleService.getVehicles()
      set({ vehicles: data, isLoading: false })
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch vehicles', isLoading: false })
    }
  },

  selectVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  addVehicle: async (formData) => {
    try {
      const newVeh = await vehicleService.createVehicle(formData)
      set((state) => ({
        vehicles: [newVeh, ...state.vehicles],
      }))
      return true
    } catch {
      return false
    }
  },

  updateVehicle: async (id, updates) => {
    try {
      const updated = await vehicleService.updateVehicle(id, updates)
      set((state) => ({
        vehicles: state.vehicles.map((v) => (v.id === id ? updated : v)),
        selectedVehicle:
          state.selectedVehicle?.id === id ? updated : state.selectedVehicle,
      }))
      return true
    } catch {
      return false
    }
  },

  deleteVehicle: async (id) => {
    try {
      await vehicleService.deleteVehicle(id)
      set((state) => ({
        vehicles: state.vehicles.filter((v) => v.id !== id),
        selectedVehicle:
          state.selectedVehicle?.id === id ? null : state.selectedVehicle,
      }))
      return true
    } catch {
      return false
    }
  },

  updateVehicleLiveTelemetry: (vehicleId, speedKmh, status, odometer) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              currentSpeedKmh: speedKmh,
              status,
              odometerKm: odometer || v.odometerKm,
              lastUpdated: new Date().toISOString(),
            }
          : v
      ),
    }))
  },
}))
