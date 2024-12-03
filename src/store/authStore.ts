import { create } from 'zustand'

interface AuthState {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
}

// Helper function to get token from cookies (client-side only)
const getAuthTokenFromCookies = (): string | null => {
  if (typeof window === 'undefined') {
    // If running on the server, return null
    return null
  }
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('auth_token='))
    ?.split('=')[1] || null
}

// Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  token: null, // Default to null initially
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

// Initialize the token on the client side
if (typeof window !== 'undefined') {
  const token = getAuthTokenFromCookies()
  useAuthStore.setState({ token })
}
