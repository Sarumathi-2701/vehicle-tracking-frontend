const TOKEN_KEY = 'gps_auth_token'
const USER_KEY = 'gps_auth_user'
const SETTINGS_KEY = 'gps_app_settings'

export const storageService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY)
  },
  getUser<T>(): T | null {
    const item = localStorage.getItem(USER_KEY)
    if (!item) return null
    try {
      return JSON.parse(item) as T
    } catch {
      return null
    }
  },
  setUser<T>(user: T): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  removeUser(): void {
    localStorage.removeItem(USER_KEY)
  },
  getSettings<T>(defaults: T): T {
    const item = localStorage.getItem(SETTINGS_KEY)
    if (!item) return defaults
    try {
      return { ...defaults, ...JSON.parse(item) }
    } catch {
      return defaults
    }
  },
  saveSettings<T>(settings: T): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  },
  clearAll(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}
