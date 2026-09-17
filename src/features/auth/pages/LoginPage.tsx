import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '../authStore'
import Input from '@/components/forms/Input'
import Button from '@/components/common/Button'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()

  const [email, setEmail] = useState('admin@fleetpro.io')
  const [password, setPassword] = useState('password123')
  const [rememberMe, setRememberMe] = useState(true)

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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-6 text-left">
      <div className="w-full max-w-5xl bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[640px] border border-slate-200">
        {/* Left Side: Truck Hero Image & Caption matching Mockup Screen 1 */}
        <div className="relative md:w-1/2 min-h-[260px] md:min-h-full bg-slate-900 overflow-hidden flex flex-col justify-end p-8 md:p-12 text-white">
          <img
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1000&auto=format&fit=crop&q=80"
            alt="Fleet Logistics Truck"
            className="absolute inset-0 w-full h-full object-cover object-center brightness-75 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Floating Caption matching mockup */}
          <div className="relative z-10 space-y-2">
            <div className="w-12 h-1 bg-blue-500 rounded-full mb-4" />
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
              Real-time tracking for a safer and smarter fleet management
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              Enterprise telematics, route efficiency & GPS tracking operations.
            </p>
          </div>
        </div>

        {/* Right Side: Clean White Sign-in Form matching Mockup Screen 1 */}
        <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Brand Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                <MapPin className="w-5 h-5 fill-white text-blue-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                  GPS Vehicle Tracking
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  Track • Monitor • Manage
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back!
              </h1>
              <p className="text-xs text-slate-500 mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                  {error}
                </div>
              )}

              <Input
                label="Email or Username"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or username"
                required
                icon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                icon={<Lock className="w-4 h-4" />}
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>

                <a href="#forgot" className="text-blue-600 hover:underline font-semibold">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center mt-2 shadow-md shadow-blue-600/20"
                isLoading={isLoading}
              >
                Login
              </Button>

              {/* Google OAuth Mock Button matching Mockup */}
              <button
                type="button"
                onClick={() => selectDemoAccount('admin@fleetpro.io')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z" />
                </svg>
                Login with Google
              </button>
            </form>
          </div>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-left">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Demo Roles (Click to autofill)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => selectDemoAccount('admin@fleetpro.io')}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 text-left transition cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-800 block">Admin</span>
                <span className="text-[10px] text-slate-400">admin@fleetpro.io</span>
              </button>

              <button
                type="button"
                onClick={() => selectDemoAccount('dispatcher@fleetpro.io')}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 text-left transition cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-800 block">Dispatcher</span>
                <span className="text-[10px] text-slate-400">dispatcher@fleetpro.io</span>
              </button>
            </div>

            <p className="text-center text-[11px] text-slate-400 mt-4">
              Don't have an account? <span className="text-blue-600 font-semibold cursor-pointer">Contact administrator</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
