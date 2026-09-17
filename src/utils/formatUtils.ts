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

export function getStatusBadgeConfig(status: VehicleStatus): {
  label: string
  bg: string
  text: string
  border: string
  dot: string
} {
  switch (status) {
    case 'running':
    case 'moving':
      return {
        label: 'Running',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      }
    case 'idle':
      return {
        label: 'Idle',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      }
    case 'parked':
    case 'stopped':
      return {
        label: 'Parked',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
      }
    case 'offline':
    default:
      return {
        label: 'Offline',
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
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
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        border: 'border-rose-200',
      }
    case 'warning':
      return {
        label: 'Warning',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-200',
      }
    case 'info':
    default:
      return {
        label: 'Info',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
      }
  }
}
