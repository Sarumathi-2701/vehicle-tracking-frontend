import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Lock, Mail, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../authStore'
import Input from '@/components/forms/Input'
import Button from '@/components/common/Button'
import loginBg from '@/assets/images/login-bg.jpg'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()

  const [email, setEmail] = useState('admin@fleetpro.io')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="relative min-h-screen w-full flex items-center justify-center md:justify-end p-4 sm:p-6 md:p-10 lg:pr-16 xl:pr-24 overflow-x-hidden font-sans text-left">
      {/* Full Page Background Image: Lightly Blurred */}
      <img
        src={loginBg}
        alt="GPS Vehicle Tracking Background"
        className="fixed inset-0 w-full h-full object-cover object-center pointer-events-none filter blur-[0 .5px] scale-105 transition-all duration-500"
      />

      {/* Login Form Card on the Right Side - Compact Height */}
      <div className="relative z-10 w-full max-w-[390px] sm:max-w-[400px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-5 sm:p-6 flex flex-col justify-between my-auto">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-600/30">
              <MapPin className="w-4 h-4 fill-white text-blue-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                GPS Vehicle Tracking
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                Track • Monitor • Manage
              </p>
            </div>
          </div>

          <div className="mb-3">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back!
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.5">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5">
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
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
              icon={<Mail className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              icon={<Lock className="w-4 h-4 text-slate-400" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              }
            />

            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-3.5 h-3.5"
                />
                <span>Remember me</span>
              </label>

              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Password reset link has been dispatched to admin@fleetpro.io')
                }}
                className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center mt-1.5 shadow-md shadow-blue-600/25 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition text-xs"
              isLoading={isLoading}
            >
              Login
            </Button>

            {/* Google OAuth Mock Button */}
            <button
              type="button"
              onClick={() => selectDemoAccount('admin@fleetpro.io')}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
        <div className="mt-3.5 pt-3 border-t border-slate-100 text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            Demo Roles (Click to autofill)
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => selectDemoAccount('admin@fleetpro.io')}
              className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                email === 'admin@fleetpro.io'
                  ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500/40'
                  : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Admin</span>
                {email === 'admin@fleetpro.io' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                )}
              </div>
              <span className="text-[9px] text-slate-500 block truncate">admin@fleetpro.io</span>
            </button>

            <button
              type="button"
              onClick={() => selectDemoAccount('dispatcher@fleetpro.io')}
              className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                email === 'dispatcher@fleetpro.io'
                  ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500/40'
                  : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Dispatcher</span>
                {email === 'dispatcher@fleetpro.io' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                )}
              </div>
              <span className="text-[9px] text-slate-500 block truncate">dispatcher@fleetpro.io</span>
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-400 mt-2.5">
            Don't have an account? <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Contact administrator</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
