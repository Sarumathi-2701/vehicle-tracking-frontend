export type UserRole = 'admin' | 'fleet_manager' | 'dispatcher' | 'driver'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  organization: string
  phone?: string
  lastLogin?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
