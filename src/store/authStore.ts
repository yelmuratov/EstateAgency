import { create } from 'zustand'

interface AuthState {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
}

// Helper function to get token from cookies
const getAuthTokenFromCookies = (): string | null => {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('auth_token='))
    ?.split('=')[1] || null
}

export const useAuthStore = create<AuthState>((set) => ({
  token: getAuthTokenFromCookies(), // Initialize token from cookies
  setToken: (token) => {
    // Save token in cookies
    document.cookie = `auth_token=${token}; path=/; secure;`
    set({ token })
  },
  clearToken: () => {
    // Remove token from cookies
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure;'
    set({ token: null })
  },
}))
