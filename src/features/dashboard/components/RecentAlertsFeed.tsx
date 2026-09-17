import React from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ShieldAlert, Zap, WifiOff } from 'lucide-react'
import { VehicleAlert } from '@/types/gps'
import Card from '@/components/common/Card'
import { timeAgo } from '@/utils/dateUtils'

export interface RecentAlertsFeedProps {
  alerts: VehicleAlert[]
  onAcknowledge?: (alertId: string) => void
}

const MOCK_DISPLAY_ALERTS = [
  {
    id: 'alt-01',
    title: 'Overspeed Alert',
    detail: 'TN01AB1234 - 86 km/h (Limit: 70 km/h)',
    time: '2 min ago',
    type: 'speed',
  },
  {
    id: 'alt-02',
    title: 'Geofence Exit',
    detail: 'TN03CD5678 - Left Chennai Zone',
    time: '12 min ago',
    type: 'geofence',
  },
  {
    id: 'alt-03',
    title: 'Vehicle Offline',
    detail: 'TN08GH3456 - No GPS signal',
    time: '36 min ago',
    type: 'offline',
  },
]

export const RecentAlertsFeed: React.FC<RecentAlertsFeedProps> = ({ alerts = [], onAcknowledge }) => {
  return (
    <Card
      title="Recent Alerts"
      action={
        <Link to="/alerts" className="text-xs text-blue-600 hover:underline font-semibold">
          View All
        </Link>
      }
    >
      <div className="space-y-3">
        {MOCK_DISPLAY_ALERTS.map((alert) => {
          const isRed = alert.type === 'speed' || alert.type === 'offline'

          return (
            <div
              key={alert.id}
              className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3 text-left transition"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isRed ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'
                  }`}
                >
                  {alert.type === 'speed' ? (
                    <Zap className="w-4 h-4" />
                  ) : alert.type === 'geofence' ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : (
                    <WifiOff className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800">{alert.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{alert.detail}</p>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-medium shrink-0">
                {alert.time}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default RecentAlertsFeed
