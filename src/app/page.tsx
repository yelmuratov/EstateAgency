'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import LogoutButton from '@/components/local-components/logoutButton'
import Spinner from '@/components/local-components/spinner'

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { token } = useAuthStore()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser()
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        router.push('/login') // Redirect to login if unauthorized
      } finally {
        setLoading(false)
      }
    }

    if (!token) {
      router.push('/login') // Redirect to login if no token
    } else {
      fetchUserData()
    }
  }, [token, router])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
      {user && (
        <div className="p-4 bg-white shadow rounded w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <LogoutButton />
        </div>
      )}
    </div>
  )
}
