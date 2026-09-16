import React, { useEffect } from 'react'
import { useAuthStore } from '@/features/auth/authStore'
import { useAppStore } from '@/store/appStore'
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react'

export interface ProvidersProps {
  children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const { checkAuth } = useAuthStore()
  const { toasts, removeToast } = useAppStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <>
      {children}

      {/* Global Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const typeIcons = {
            info: <Info className="w-4 h-4 text-cyan-400" />,
            success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
            warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
            error: <AlertCircle className="w-4 h-4 text-rose-400" />,
          }

          const typeBorders = {
            info: 'border-cyan-500/30 bg-slate-900/95',
            success: 'border-emerald-500/30 bg-slate-900/95',
            warning: 'border-amber-500/30 bg-slate-900/95',
            error: 'border-rose-500/30 bg-slate-900/95',
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-start justify-between gap-3 text-left transition-all ${typeBorders[toast.type]}`}
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5">{typeIcons[toast.type]}</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">{toast.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{toast.message}</p>
                </div>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Providers
