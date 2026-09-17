import React from 'react'

export interface StatsCardProps {
  label: string
  value: string | number
  subValue?: string
  trend?: {
    value: string
    isPositive: boolean
  }
  icon?: React.ReactNode
  iconColorClass?: string
  onClick?: () => void
  active?: boolean
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  subValue,
  trend,
  icon,
  iconColorClass = 'bg-blue-50 text-blue-600',
  onClick,
  active = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 sm:p-5 rounded-2xl bg-white border transition duration-200 shadow-xs flex items-center justify-between text-left ${
        active ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200/80 hover:border-slate-300'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div>
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </span>
        </div>
        {(subValue || trend) && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            {trend && (
              <span className={`font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend.isPositive ? '▲' : '▼'} {trend.value}
              </span>
            )}
            {subValue && <span className="text-slate-400 font-medium">{subValue}</span>}
          </div>
        )}
      </div>

      {icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconColorClass}`}>
          {icon}
        </div>
      )}
    </div>
  )
}

export default StatsCard
