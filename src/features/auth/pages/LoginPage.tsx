import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigation, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '../authStore'
import Input from '@/components/forms/Input'
import Button from '@/components/common/Button'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()

  const [email, setEmail] = useState('admin@fleetpro.io')
  const [password, setPassword] = useState('password123')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login({ email, password })
    if (success) {
      navigate('/dashboard')
    }
  }

  const selectDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('password123')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20 border border-cyan-400/30 mb-4">
            <Navigation className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            FleetPulse <span className="text-cyan-400">Telematics</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Enterprise GPS Vehicle Tracking & Operations</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-left">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@fleet.io"
              required
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              icon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 cursor-pointer"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Fleet Console
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 text-left">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Demo Credentials (Click to fill)
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => selectDemoAccount('admin@fleetpro.io')}
                className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 text-left transition flex items-center justify-between text-xs cursor-pointer group"
              >
                <div>
                  <span className="font-semibold text-white block group-hover:text-cyan-400">
                    Fleet Administrator
                  </span>
                  <span className="text-slate-500">admin@fleetpro.io / password123</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={() => selectDemoAccount('dispatcher@fleetpro.io')}
                className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/40 text-left transition flex items-center justify-between text-xs cursor-pointer group"
              >
                <div>
                  <span className="font-semibold text-white block group-hover:text-blue-400">
                    Route Dispatcher
                  </span>
                  <span className="text-slate-500">dispatcher@fleetpro.io / password123</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-slate-600 group-hover:text-blue-400" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 FleetPulse Telematics Systems. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
