import React from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ShieldAlert, Zap, ArrowRight } from 'lucide-react'
import { VehicleAlert } from '@/types/gps'
import Card from '@/components/common/Card'
import { getAlertSeverityConfig } from '@/utils/formatUtils'
import { timeAgo } from '@/utils/dateUtils'

export interface RecentAlertsFeedProps {
  alerts: VehicleAlert[]
  onAcknowledge?: (alertId: string) => void
}

export const RecentAlertsFeed: React.FC<RecentAlertsFeedProps> = ({ alerts, onAcknowledge }) => {
  return (
    <Card
      title="Real-Time Alerts"
      subtitle="Critical fleet notifications & violations"
      action={
        <Link
          to="/alerts"
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No recent alerts triggered</p>
        ) : (
          alerts.slice(0, 5).map((alert) => {
            const config = getAlertSeverityConfig(alert.severity)

            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border text-left transition-all ${config.bg} ${config.border} flex items-start justify-between gap-3`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {alert.severity === 'critical' ? (
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                    ) : alert.type === 'overspeed' ? (
                      <Zap className="w-4 h-4 text-amber-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{alert.vehicleName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">[{alert.plateNumber}]</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{alert.message}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {timeAgo(alert.timestamp)}
                    </span>
                  </div>
                </div>

                {!alert.isAcknowledged && onAcknowledge && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="shrink-0 px-2 py-1 text-[10px] font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}

export default RecentAlertsFeed
