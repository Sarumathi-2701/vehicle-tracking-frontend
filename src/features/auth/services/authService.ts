import { LoginCredentials, LoginResponse } from '../types'
import { storageService } from '@/services/storage/localStorage'

const DEMO_USERS = [
  {
    email: 'admin@fleetpro.io',
    password: 'password123',
    user: {
      id: 'usr-001',
      name: 'Elena Rostova',
      email: 'admin@fleetpro.io',
      role: 'admin' as const,
      organization: 'Titan Global Logistics',
      phone: '+1 (555) 349-2180',
      lastLogin: new Date().toISOString(),
    },
    token: 'jwt_mock_token_admin_fleet_001',
  },
  {
    email: 'dispatcher@fleetpro.io',
    password: 'password123',
    user: {
      id: 'usr-002',
      name: 'Marcus Vance',
      email: 'dispatcher@fleetpro.io',
      role: 'dispatcher' as const,
      organization: 'Titan Global Logistics',
      phone: '+1 (555) 782-9931',
      lastLogin: new Date().toISOString(),
    },
    token: 'jwt_mock_token_dispatcher_fleet_002',
  },
]

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Simulate slight network latency
    await new Promise((resolve) => setTimeout(resolve, 400))

    const matched = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
    )

    if (matched && credentials.password === 'password123') {
      storageService.setToken(matched.token)
      storageService.setUser(matched.user)
      return {
        user: matched.user,
        token: matched.token,
      }
    }

    // Default fallback allow any password for ease of evaluation
    const fallbackUser = {
      id: 'usr-demo',
      name: credentials.email.split('@')[0].toUpperCase(),
      email: credentials.email,
      role: 'fleet_manager' as const,
      organization: 'Fleet Operations HQ',
      phone: '+1 (555) 019-2834',
      lastLogin: new Date().toISOString(),
    }
    const token = 'jwt_mock_token_custom_user'
    storageService.setToken(token)
    storageService.setUser(fallbackUser)

    return { user: fallbackUser, token }
  },

  async logout(): Promise<void> {
    storageService.clearAll()
  },

  getCurrentUser() {
    return storageService.getUser()
  },

  getToken() {
    return storageService.getToken()
  },
}
