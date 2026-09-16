import React from 'react'
import Card from '@/components/common/Card'

export interface FleetStatusChartProps {
  moving: number
  idle: number
  stopped: number
  offline: number
  total: number
}

export const FleetStatusChart: React.FC<FleetStatusChartProps> = ({
  moving,
  idle,
  stopped,
  offline,
  total,
}) => {
  const movingPct = total ? Math.round((moving / total) * 100) : 0
  const idlePct = total ? Math.round((idle / total) * 100) : 0
  const stoppedPct = total ? Math.round((stopped / total) * 100) : 0
  const offlinePct = total ? Math.round((offline / total) * 100) : 0

  return (
    <Card title="Fleet Operational Status" subtitle="Live health & utilization breakdown">
      {/* Progress Bar Breakdown */}
      <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden flex shadow-inner mb-6">
        <div style={{ width: `${movingPct}%` }} className="bg-emerald-500 transition-all duration-500" title={`Moving: ${moving}`} />
        <div style={{ width: `${idlePct}%` }} className="bg-amber-500 transition-all duration-500" title={`Idle: ${idle}`} />
        <div style={{ width: `${stoppedPct}%` }} className="bg-rose-500 transition-all duration-500" title={`Stopped: ${stopped}`} />
        <div style={{ width: `${offlinePct}%` }} className="bg-slate-600 transition-all duration-500" title={`Offline: ${offline}`} />
      </div>

      {/* Breakdown Legend Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-400">Moving</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-white">{moving}</span>
            <span className="text-[10px] text-emerald-400">({movingPct}%)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-xs text-slate-400">Idle</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-white">{idle}</span>
            <span className="text-[10px] text-amber-400">({idlePct}%)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="text-xs text-slate-400">Stopped</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-white">{stopped}</span>
            <span className="text-[10px] text-rose-400">({stoppedPct}%)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="text-xs text-slate-400">Offline</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-white">{offline}</span>
            <span className="text-[10px] text-slate-400">({offlinePct}%)</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default FleetStatusChart
