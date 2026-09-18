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
  className?: string
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
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`py-3 px-4 rounded-xl bg-white border transition duration-200 shadow-2xs flex items-center justify-between text-left ${
        active ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200/80 hover:border-slate-300'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="min-w-0 flex-1 pr-2">
        <span className="text-[11px] font-semibold text-slate-500 truncate block">{label}</span>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {value}
          </span>
        </div>
        {(subValue || trend) && (
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] leading-tight">
            {trend && (
              <span className={`font-semibold shrink-0 ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend.isPositive ? '▲' : '▼'} {trend.value}
              </span>
            )}
            {subValue && <span className="text-slate-400 font-medium truncate">{subValue}</span>}
          </div>
        )}
      </div>

      {icon && (
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 [&>svg]:w-4.5 [&>svg]:h-4.5 ${iconColorClass}`}>
          {icon}
        </div>
      )}
    </div>
  )
}

export default StatsCard
