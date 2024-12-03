'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import LogoutButton from '@/components/local-components/logoutButton'
import Spinner from '@/components/local-components/spinner'

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true) // Loading state
  const router = useRouter()
  const { token } = useAuthStore()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        router.push('/login') // Redirect if no token
        return
      }

      try {
        const userData = await getUser()
        setUser(userData) // Set the user data
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        router.push('/login') // Redirect to login on error
      } finally {
        setLoading(false) // Fetching is complete
      }
    }

    fetchUserData()
  }, [token, router])

  // Show spinner while loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  // Show error message only if loading is complete and user is still null
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Unable to load user data. Please log in again.</p>
      </div>
    )
  }

  // Render dashboard when user is available
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
      <div className="p-4 bg-white shadow rounded w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <LogoutButton />
      </div>
    </div>
  )
}
