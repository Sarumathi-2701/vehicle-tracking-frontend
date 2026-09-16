import { create } from 'zustand'
import { User } from '@/types/user'
import { authService } from './services/authService'
import { LoginCredentials } from './types'

interface AuthStoreState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: authService.getCurrentUser() as User | null,
  token: authService.getToken(),
  isAuthenticated: !!authService.getToken(),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const { user, token } = await authService.login(credentials)
      set({ user, token, isAuthenticated: true, isLoading: false })
      return true
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false })
      return false
    }
  },

  logout: () => {
    authService.logout()
    set({ user: null, token: null, isAuthenticated: false, error: null })
  },

  checkAuth: () => {
    const user = authService.getCurrentUser() as User | null
    const token = authService.getToken()
    set({ user, token, isAuthenticated: !!token })
  },
}))
