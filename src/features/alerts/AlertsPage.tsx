import React, { useState } from 'react'
import { Zap, ShieldAlert, WifiOff, Clock } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import DataTable, { Column } from '@/components/tables/DataTable'
import Pagination from '@/components/tables/Pagination'
import { usePagination } from '@/hooks/usePagination'

interface MockAlertRow {
  id: string
  time: string
  type: 'Speed' | 'Geofence' | 'Offline' | 'Others'
  vehicleNo: string
  message: string
  status: 'Open' | 'Resolved'
}

// Full 21 Alerts across Tamil Nadu fleet
const FULL_ALERTS_DATA: MockAlertRow[] = [
  // Page 1
  { id: '1', time: '16-09-2025 10:24', type: 'Speed', vehicleNo: 'TN01AB1234', message: 'Speed exceeded 85 km/h (Limit: 70 km/h) on NH48', status: 'Open' },
  { id: '2', time: '16-09-2025 09:12', type: 'Geofence', vehicleNo: 'TN03CD5678', message: 'Left Chennai Zone boundary at Madhavaram', status: 'Open' },
  { id: '3', time: '15-09-2025 18:45', type: 'Offline', vehicleNo: 'TN08GH3456', message: 'No GPS signal transmission for 45 mins', status: 'Open' },
  { id: '4', time: '15-09-2025 14:22', type: 'Others', vehicleNo: 'TN10IJ7890', message: 'Engine idle for 2+ hours with ignition ON in Salem yard', status: 'Open' },
  { id: '5', time: '14-09-2025 11:37', type: 'Speed', vehicleNo: 'TN06EF9012', message: 'Speed exceeded 82 km/h on Kanchipuram bypass', status: 'Resolved' },
  { id: '6', time: '13-09-2025 16:01', type: 'Geofence', vehicleNo: 'TN12KL3456', message: 'Entered Restricted Port Corridor Zone', status: 'Resolved' },
  { id: '7', time: '12-09-2025 09:20', type: 'Offline', vehicleNo: 'TN14MN1234', message: 'No GPS signal received near Gingee Ghats', status: 'Resolved' },

  // Page 2
  { id: '8', time: '11-09-2025 21:14', type: 'Speed', vehicleNo: 'TN16OP5678', message: 'Speed reached 78 km/h on Tiruvallur highway', status: 'Resolved' },
  { id: '9', time: '11-09-2025 15:30', type: 'Geofence', vehicleNo: 'TN01AB1234', message: 'Exited Central Warehouse Dock #4 perimeter', status: 'Resolved' },
  { id: '10', time: '10-09-2025 18:10', type: 'Others', vehicleNo: 'TN03CD5678', message: 'Harsh braking detected (-0.6g deceleration)', status: 'Resolved' },
  { id: '11', time: '09-09-2025 12:45', type: 'Speed', vehicleNo: 'TN08GH3456', message: 'Speed warning: 84 km/h in 65 km/h school perimeter', status: 'Resolved' },
  { id: '12', time: '08-09-2025 08:30', type: 'Others', vehicleNo: 'TN10IJ7890', message: 'Battery voltage low (11.4V) before engine start', status: 'Resolved' },
  { id: '13', time: '07-09-2025 14:15', type: 'Geofence', vehicleNo: 'TN06EF9012', message: 'Entered Sriperumbudur Industrial Corridor Zone', status: 'Resolved' },
  { id: '14', time: '06-09-2025 19:50', type: 'Offline', vehicleNo: 'TN12KL3456', message: 'GPS antenna disconnected intermittently', status: 'Resolved' },

  // Page 3
  { id: '15', time: '05-09-2025 11:20', type: 'Speed', vehicleNo: 'TN14MN1234', message: 'Speed reached 88 km/h on Salem express corridor', status: 'Resolved' },
  { id: '16', time: '04-09-2025 16:40', type: 'Geofence', vehicleNo: 'TN16OP5678', message: 'Left Tiruvallur Hub boundary', status: 'Resolved' },
  { id: '17', time: '03-09-2025 10:15', type: 'Others', vehicleNo: 'TN01AB1234', message: 'Fuel level dip detected (-18% in 15 mins)', status: 'Resolved' },
  { id: '18', time: '02-09-2025 22:05', type: 'Others', vehicleNo: 'TN03CD5678', message: 'After-hours unauthorized ignition event', status: 'Resolved' },
  { id: '19', time: '01-09-2025 14:30', type: 'Speed', vehicleNo: 'TN06EF9012', message: 'Speed violation: 76 km/h in city limit', status: 'Resolved' },
  { id: '20', time: '31-08-2025 09:10', type: 'Geofence', vehicleNo: 'TN08GH3456', message: 'Entered Ranipet Logistics Zone', status: 'Resolved' },
  { id: '21', time: '30-08-2025 17:25', type: 'Offline', vehicleNo: 'TN10IJ7890', message: 'Cellular network loss in rural corridor', status: 'Resolved' },
]

export const AlertsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Speed' | 'Geofence' | 'Offline' | 'Others'>('All')

  const tabCounts = {
    All: FULL_ALERTS_DATA.length,
    Speed: FULL_ALERTS_DATA.filter((a) => a.type === 'Speed').length,
    Geofence: FULL_ALERTS_DATA.filter((a) => a.type === 'Geofence').length,
    Offline: FULL_ALERTS_DATA.filter((a) => a.type === 'Offline').length,
    Others: FULL_ALERTS_DATA.filter((a) => a.type === 'Others').length,
  }

  const filtered = FULL_ALERTS_DATA.filter((a) => {
    if (activeTab === 'All') return true
    return a.type === activeTab
  })

  // Sliced reactive pagination
  const {
    paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToPage,
  } = usePagination({
    items: filtered,
    initialPageSize: 7,
    resetTrigger: activeTab,
  })

  const columns: Column<MockAlertRow>[] = [
    {
      key: 'time',
      header: 'Time',
      render: (a) => <span className="text-slate-600 font-medium whitespace-nowrap">{a.time}</span>,
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
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold text-slate-600 overflow-x-auto">
        {(['All', 'Speed', 'Geofence', 'Offline', 'Others'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-xs'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            {tab} ({tabCounts[tab]})
          </button>
        ))}
      </div>

      {/* Alerts Table with Verified Sliced Pagination */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
        <DataTable
          columns={columns}
          data={paginatedItems}
          keyExtractor={(a) => a.id}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={goToPage}
          itemLabel="alerts"
        />
      </div>
    </div>
  )
}

export default AlertsPage
