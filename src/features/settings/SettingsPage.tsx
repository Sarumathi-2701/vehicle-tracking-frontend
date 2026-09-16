import React, { useState } from 'react'
import { Settings, Bell, Map, Sliders, Check } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Switch from '@/components/forms/Switch'
import Input from '@/components/forms/Input'
import Select from '@/components/forms/Select'
import { useAppStore } from '@/store/appStore'

export const SettingsPage: React.FC = () => {
  const { mapStyle, setMapStyle, speedUnit, setSpeedUnit } = useAppStore()

  const [saved, setSaved] = useState(false)
  const [speedLimitDefault, setSpeedLimitDefault] = useState(80)
  const [pollingRate, setPollingRate] = useState('2.5')
  const [alertOverspeed, setAlertOverspeed] = useState(true)
  const [alertGeofence, setAlertGeofence] = useState(true)
  const [alertLowFuel, setAlertLowFuel] = useState(true)
  const [alertLowBattery, setAlertLowBattery] = useState(true)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <PageHeader
        title="Telematics System Settings"
        subtitle="Configure real-time GPS telemetry refresh rates, thresholds, map styles, and alert notifications"
        action={
          <Button
            variant="primary"
            icon={saved ? <Check className="w-4 h-4 text-emerald-300" /> : undefined}
            onClick={handleSave}
          >
            {saved ? 'Preferences Saved!' : 'Save Changes'}
          </Button>
        }
      />

      {/* Map & Visual Settings */}
      <Card title="Map & Display Preferences" subtitle="Customize the live map tracking layers and telemetry visualization">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Default Map Style"
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value as any)}
              options={[
                { value: 'dark', label: 'Dark High-Contrast Theme (Recommended)' },
                { value: 'streets', label: 'OpenStreetMap Streets (Standard)' },
              ]}
            />

            <Select
              label="Speed Units"
              value={speedUnit}
              onChange={(e) => setSpeedUnit(e.target.value as any)}
              options={[
                { value: 'kmh', label: 'Kilometers per hour (km/h)' },
                { value: 'mph', label: 'Miles per hour (mph)' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Select
              label="Telemetry Polling Interval"
              value={pollingRate}
              onChange={(e) => setPollingRate(e.target.value)}
              options={[
                { value: '1.0', label: '1.0s (Ultra High Frequency)' },
                { value: '2.5', label: '2.5s (Standard Real-Time)' },
                { value: '5.0', label: '5.0s (Bandwidth Saver)' },
              ]}
            />

            <Input
              label="Global Overspeed Alert Threshold (km/h)"
              type="number"
              value={speedLimitDefault}
              onChange={(e) => setSpeedLimitDefault(Number(e.target.value))}
            />
          </div>
        </div>
      </Card>

      {/* Alert Notifications */}
      <Card title="Automated Alert Triggers" subtitle="Toggle automated telemetry violation triggers">
        <div className="space-y-4">
          <Switch
            checked={alertOverspeed}
            onChange={setAlertOverspeed}
            label="Overspeeding Trigger"
            description="Generate immediate alert when any vehicle crosses the designated speed limit"
          />

          <div className="border-t border-slate-800/80 pt-3">
            <Switch
              checked={alertGeofence}
              onChange={setAlertGeofence}
              label="Geofence Boundary Violations"
              description="Notify dispatch when a vehicle enters or exits a restricted customer or logistics zone"
            />
          </div>

          <div className="border-t border-slate-800/80 pt-3">
            <Switch
              checked={alertLowFuel}
              onChange={setAlertLowFuel}
              label="Critical Low Fuel Alerts"
              description="Alert when fuel level dips below 15% of tank capacity"
            />
          </div>

          <div className="border-t border-slate-800/80 pt-3">
            <Switch
              checked={alertLowBattery}
              onChange={setAlertLowBattery}
              label="Vehicle Battery Voltage Drop"
              description="Warn if battery voltage drops below 11.8V (12V system) or 23.6V (24V system)"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SettingsPage
