import api from '@/lib/api'

interface LoginResponse {
  access_token: string
}

export const login = async (phone: string, password: string): Promise<LoginResponse> => {
  // Format data as URL-encoded
  const formData = new URLSearchParams()
  formData.append('phone', phone)
  formData.append('password', password)

  const response = await api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  return response.data
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}

export const getUser = async (): Promise<any> => {
  const response = await api.get('/auth/me')
  return response.data
} 
