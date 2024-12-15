'use client'

import { useAuthStore } from '@/store/authStore'
import { logout } from '@/services/authService'
import { useRouter } from 'next/router';

export default function LogoutButton() {
  const router = useRouter()
  const { clearToken } = useAuthStore()

  const handleLogout = async () => {
    try {
      await logout()

      const routerInstance = router;
      clearToken(routerInstance);
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure;'

      // Redirect to login
      router.push('/login')
    } catch (err) {
      return err;
    }
  }

  return <button onClick={handleLogout}>Log Out</button>
}
