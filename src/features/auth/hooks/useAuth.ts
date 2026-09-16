import { useAuthStore } from '../authStore'

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, error, login, logout } = useAuthStore()

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  }
}
export default useAuth
