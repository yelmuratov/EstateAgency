'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { logout } from '@/services/authService'

export default function LogoutButton() {
  const router = useRouter()
  const { clearToken } = useAuthStore()

  const handleLogout = async () => {
    try {
      await logout()

      // Clear the token from Zustand store and cookies
      clearToken()
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure;'

      // Redirect to login
      router.push('/login')
    } catch (err) {
      console.error('Failed to log out:', err)
    }
  }

  return <button onClick={handleLogout}>Log Out</button>
}