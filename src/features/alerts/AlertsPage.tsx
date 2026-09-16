import React, { useState } from 'react'
import { Bell, ShieldAlert, Zap, AlertTriangle, CheckCircle, CheckCheck, Filter } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import { useTrackingStore } from '@/features/tracking/trackingStore'
import { AlertSeverity } from '@/types/gps'
import { getAlertSeverityConfig } from '@/utils/formatUtils'
import { formatDate } from '@/utils/dateUtils'

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert } = useTrackingStore()
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'unacknowledged' | 'acknowledged'>('all')

  const filteredAlerts = alerts.filter((a) => {
    const matchesSeverity = severityFilter === 'all' || a.severity === severityFilter
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'unacknowledged' && !a.isAcknowledged) ||
      (statusFilter === 'acknowledged' && a.isAcknowledged)
    return matchesSeverity && matchesStatus
  })

  const acknowledgeAll = () => {
    alerts.forEach((a) => {
      if (!a.isAcknowledged) acknowledgeAlert(a.id)
    })
  }

  const unreadCount = alerts.filter((a) => !a.isAcknowledged).length

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Fleet Security & Violation Alerts"
        subtitle="Manage critical telemetry exceptions, geofence breaches, and driver speeding violations"
        action={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              icon={<CheckCheck className="w-4 h-4" />}
              onClick={acknowledgeAll}
            >
              Acknowledge All ({unreadCount})
            </Button>
          ) : undefined
        }
      />

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">Severity:</span>
          <div className="flex items-center gap-1">
            {(['all', 'critical', 'warning', 'info'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-xl capitalize font-medium transition cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Alerts</option>
            <option value="unacknowledged">Unacknowledged Only</option>
            <option value="acknowledged">Acknowledged</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <Card title={`Alert Records (${filteredAlerts.length})`}>
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No alerts matching the selected filters.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const config = getAlertSeverityConfig(alert.severity)

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${config.bg} ${config.border}`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="mt-1">
                      {alert.severity === 'critical' ? (
                        <ShieldAlert className="w-5 h-5 text-rose-400" />
                      ) : alert.type === 'overspeed' ? (
                        <Zap className="w-5 h-5 text-amber-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">
                          {alert.vehicleName}
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950/80 text-slate-300 border border-slate-800">
                          {alert.plateNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.bg} ${config.text} ${config.border}`}
                        >
                          {alert.severity}
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 mt-1">{alert.message}</p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2">
                        <span>{formatDate(alert.timestamp)}</span>
                        <span>•</span>
                        <span className="font-mono">
                          Coordinates: {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {alert.isAcknowledged ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <CheckCircle className="w-4 h-4" /> Acknowledged
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Card>
    </div>
  )
}

export default AlertsPage
