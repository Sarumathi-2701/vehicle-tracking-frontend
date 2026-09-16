import { VehicleStatus } from '@/types/vehicle'
import { AlertSeverity } from '@/types/gps'

export function formatSpeed(speedKmh: number): string {
  return `${Math.round(speedKmh)} km/h`
}

export function formatDistance(distanceKm: number): string {
  return `${distanceKm.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`
}

export function formatOdometer(odometerKm: number): string {
  return `${Math.round(odometerKm).toLocaleString()} km`
}

export function formatFuel(liters: number, capacity: number): string {
  const pct = Math.round((liters / capacity) * 100)
  return `${liters}L (${pct}%)`
}

export function getStatusBadgeConfig(status: VehicleStatus): {
  label: string
  bg: string
  text: string
  border: string
  dot: string
} {
  switch (status) {
    case 'moving':
      return {
        label: 'Moving',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
      }
    case 'idle':
      return {
        label: 'Idle',
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-400',
      }
    case 'stopped':
      return {
        label: 'Stopped',
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        dot: 'bg-rose-400',
      }
    case 'offline':
    default:
      return {
        label: 'Offline',
        bg: 'bg-slate-700/30',
        text: 'text-slate-400',
        border: 'border-slate-700',
        dot: 'bg-slate-500',
      }
  }
}

export function getAlertSeverityConfig(severity: AlertSeverity): {
  label: string
  bg: string
  text: string
  border: string
} {
  switch (severity) {
    case 'critical':
      return {
        label: 'Critical',
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
      }
    case 'warning':
      return {
        label: 'Warning',
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
      }
    case 'info':
    default:
      return {
        label: 'Info',
        bg: 'bg-cyan-500/15',
        text: 'text-cyan-400',
        border: 'border-cyan-500/30',
      }
  }
}
