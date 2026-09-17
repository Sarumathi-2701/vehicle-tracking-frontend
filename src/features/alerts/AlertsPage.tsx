import React, { useState } from 'react'
import { Zap, ShieldAlert, WifiOff, Clock, CheckCircle } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import DataTable, { Column } from '@/components/tables/DataTable'

interface MockAlertRow {
  id: string
  time: string
  type: 'Speed' | 'Geofence' | 'Offline' | 'Others'
  vehicleNo: string
  message: string
  status: 'Open' | 'Resolved'
}

const MOCK_ALERTS_DATA: MockAlertRow[] = [
  { id: '1', time: '16-09-2025 10:24', type: 'Speed', vehicleNo: 'TN01AB1234', message: 'Speed exceeded 85 km/h (Limit: 70 km/h)', status: 'Open' },
  { id: '2', time: '16-09-2025 09:12', type: 'Geofence', vehicleNo: 'TN03CD5678', message: 'Left Chennai Zone boundary', status: 'Open' },
  { id: '3', time: '15-09-2025 18:45', type: 'Offline', vehicleNo: 'TN08GH3456', message: 'No GPS signal transmission', status: 'Open' },
  { id: '4', time: '15-09-2025 14:22', type: 'Others', vehicleNo: 'TN10IJ7890', message: 'Engine idle for 2+ hours with ignition ON', status: 'Open' },
  { id: '5', time: '14-09-2025 11:37', type: 'Speed', vehicleNo: 'TN06EF9012', message: 'Speed exceeded 80 km/h', status: 'Resolved' },
  { id: '6', time: '13-09-2025 16:01', type: 'Geofence', vehicleNo: 'TN12KL3456', message: 'Entered Restricted Zone', status: 'Resolved' },
  { id: '7', time: '12-09-2025 09:20', type: 'Offline', vehicleNo: 'TN14MN1234', message: 'No GPS signal received', status: 'Resolved' },
]

export const AlertsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Speed' | 'Geofence' | 'Offline' | 'Others'>('All')

  const tabCounts = {
    All: 12,
    Speed: 4,
    Geofence: 3,
    Offline: 2,
    Others: 3,
  }

  const filtered = MOCK_ALERTS_DATA.filter((a) => {
    if (activeTab === 'All') return true
    return a.type === activeTab
  })

  const columns: Column<MockAlertRow>[] = [
    {
      key: 'time',
      header: 'Time',
      render: (a) => <span className="text-slate-600 font-medium">{a.time}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (a) => {
        const icons = {
          Speed: <Zap className="w-4 h-4 text-amber-500" />,
          Geofence: <ShieldAlert className="w-4 h-4 text-rose-500" />,
          Offline: <WifiOff className="w-4 h-4 text-rose-600" />,
          Others: <Clock className="w-4 h-4 text-blue-500" />,
        }
        return (
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            {icons[a.type]}
            <span>{a.type}</span>
          </div>
        )
      },
    },
    {
      key: 'vehicleNo',
      header: 'Vehicle No',
      render: (a) => <span className="font-bold text-slate-900">{a.vehicleNo}</span>,
    },
    {
      key: 'message',
      header: 'Message',
      render: (a) => <span className="text-slate-700 font-medium">{a.message}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            a.status === 'Open'
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {a.status}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Alerts"
        subtitle="Real-time violations, geofence breaches, and device telemetry warnings"
      />

      {/* Tabs matching Mockup Screen 7 */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold text-slate-600">
        {(['All', 'Speed', 'Geofence', 'Offline', 'Others'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-xs'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            {tab} ({tabCounts[tab]})
          </button>
        ))}
      </div>

      {/* Alerts Table */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(a) => a.id}
        />
      </div>
    </div>
  )
}

export default AlertsPage
