import React from 'react'

export interface StatsCardProps {
  label: string
  value: string | number
  subValue?: string
  trend?: {
    value: string
    isPositive: boolean
  }
  icon: React.ReactNode
  iconColorClass?: string
  onClick?: () => void
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  subValue,
  trend,
  icon,
  iconColorClass = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg flex items-start justify-between transition duration-200 hover:border-slate-700 ${
        onClick ? 'cursor-pointer hover:bg-slate-900/80' : ''
      }`}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{value}</span>
          {subValue && <span className="text-xs text-slate-400 font-normal">{subValue}</span>}
        </div>
        {trend && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span
              className={`font-semibold ${
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
            <span className="text-slate-500">vs yesterday</span>
          </div>
        )}
      </div>

      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-inner ${iconColorClass}`}
      >
        {icon}
      </div>
    </div>
  )
}

export default StatsCard
