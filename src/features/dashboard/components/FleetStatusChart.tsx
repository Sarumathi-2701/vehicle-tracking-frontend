import React from 'react'
import { Link } from 'react-router-dom'
import Card from '@/components/common/Card'

export interface FleetStatusChartProps {
  running: number
  idle: number
  parked: number
  offline: number
  total: number
}

export const FleetStatusChart: React.FC<FleetStatusChartProps> = ({
  running = 16,
  idle = 5,
  parked = 2,
  offline = 1,
  total = 24,
}) => {
  const runningPct = total ? (running / total) * 100 : 0
  const idlePct = total ? (idle / total) * 100 : 0
  const parkedPct = total ? (parked / total) * 100 : 0
  const offlinePct = total ? (offline / total) * 100 : 0

  // Circumference for r=40 is 2 * PI * 40 = 251.32
  const c = 251.32
  const strokeRunning = (runningPct / 100) * c
  const strokeIdle = (idlePct / 100) * c
  const strokeParked = (parkedPct / 100) * c
  const strokeOffline = (offlinePct / 100) * c

  const offsetRunning = 0
  const offsetIdle = -strokeRunning
  const offsetParked = -(strokeRunning + strokeIdle)
  const offsetOffline = -(strokeRunning + strokeIdle + strokeParked)

  return (
    <Card
      title="Vehicle Status"
      action={
        <Link to="/vehicles" className="text-xs text-blue-600 hover:underline font-semibold">
          View All
        </Link>
      }
    >
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        {/* SVG Donut Chart */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />

            {/* Running segment (Emerald) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#10b981"
              strokeWidth="12"
              strokeDasharray={`${strokeRunning} ${c}`}
              strokeDashoffset={offsetRunning}
              className="transition-all duration-700 ease-out"
            />

            {/* Idle segment (Amber) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="12"
              strokeDasharray={`${strokeIdle} ${c}`}
              strokeDashoffset={offsetIdle}
              className="transition-all duration-700 ease-out"
            />

            {/* Parked segment (Blue) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="12"
              strokeDasharray={`${strokeParked} ${c}`}
              strokeDashoffset={offsetParked}
              className="transition-all duration-700 ease-out"
            />

            {/* Offline segment (Rose) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ef4444"
              strokeWidth="12"
              strokeDasharray={`${strokeOffline} ${c}`}
              strokeDashoffset={offsetOffline}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Central Metric Number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-slate-800 tracking-tight">{total}</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total</span>
          </div>
        </div>

        {/* Breakdown Legend Table */}
        <div className="space-y-2.5 w-full max-w-[180px] text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600 font-medium">Running</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">{running}</span>
              <span className="text-[10px] text-slate-400">({runningPct.toFixed(1)}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-600 font-medium">Idle</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">{idle}</span>
              <span className="text-[10px] text-slate-400">({idlePct.toFixed(1)}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-600 font-medium">Parked</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">{parked}</span>
              <span className="text-[10px] text-slate-400">({parkedPct.toFixed(1)}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-600 font-medium">Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">{offline}</span>
              <span className="text-[10px] text-slate-400">({offlinePct.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default FleetStatusChart
