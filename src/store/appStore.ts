import { create } from 'zustand'

export interface ToastMessage {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  durationMs?: number
}

interface AppState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  mobileSidebarOpen: boolean
  toggleMobileSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void

  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void

  mapStyle: 'streets' | 'dark' | 'satellite'
  setMapStyle: (style: 'streets' | 'dark' | 'satellite') => void

  speedUnit: 'kmh' | 'mph'
  setSpeedUnit: (unit: 'kmh' | 'mph') => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  mobileSidebarOpen: false,
  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastMessage = { ...toast, id }
    set((state) => ({ toasts: [...state.toasts, newToast] }))

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, toast.durationMs || 4000)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  mapStyle: 'streets',
  setMapStyle: (style) => set({ mapStyle: style }),

  speedUnit: 'kmh',
  setSpeedUnit: (unit) => set({ speedUnit: unit }),
}))
