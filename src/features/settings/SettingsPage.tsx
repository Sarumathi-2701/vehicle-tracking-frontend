import React, { useState } from 'react'
import { User, Bell, Shield, Eye, Database, Check } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/forms/Input'

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'appearance' | 'api'>('profile')
  const [name, setName] = useState('Admin')
  const [email, setEmail] = useState('admin@company.com')
  const [phone, setPhone] = useState('+91 98765 43210')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Eye },
    { id: 'api', label: 'API Integration', icon: Database },
  ]

  return (
    <div className="space-y-6 text-left max-w-5xl">
      <PageHeader
        title="Settings"
        subtitle="Manage account preferences, alerts triggers, and system configuration"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Vertical Tabs matching Mockup Screen 9 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2 space-y-1 shadow-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isSelected = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Right Settings Form matching Mockup Screen 9 */}
        <div className="md:col-span-3">
          <Card title="Profile Settings" subtitle="Update your system administrator identity and credentials">
            <form onSubmit={handleSave} className="space-y-5">
              {/* Profile Avatar Banner */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-500 overflow-hidden shrink-0 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                    alt="Admin"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{name}</h4>
                  <span className="text-xs text-slate-500">Super Admin</span>
                </div>
              </div>

              <Input
                label="Admin Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <div className="pt-2 flex justify-start">
                <Button
                  type="submit"
                  variant="primary"
                  icon={saved ? <Check className="w-4 h-4 text-emerald-200" /> : undefined}
                >
                  {saved ? 'Changes Saved!' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
