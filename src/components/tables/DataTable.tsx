import React from 'react'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  className?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  isLoading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  compact?: boolean
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
  compact = false,
  className = '',
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="py-12 text-center text-slate-400">
        <div className="inline-block w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs">Loading records...</p>
      </div>
    )
  }

  const thPadding = compact ? 'px-4 py-2.5 text-[11px]' : 'px-5 py-3 text-[11px]'
  const tdPadding = compact ? 'px-4 py-2 text-xs' : 'px-5 py-2.5 text-xs'

  return (
    <div className={`overflow-x-auto w-full bg-white ${className}`}>
      <table className="w-full text-left text-xs text-slate-700">
        <thead className="bg-slate-50/80 uppercase font-bold text-slate-500 border-b border-slate-200">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`${thPadding} ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors duration-100 ${
                  onRowClick
                    ? 'hover:bg-slate-50/80 cursor-pointer'
                    : 'hover:bg-slate-50/40'
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`${tdPadding} ${col.className || ''}`}>
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
