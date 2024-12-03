import axios from 'axios'
import { getAuthToken } from './tokenHelper'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  timeout: 5000,
})

console.log(api.defaults.baseURL);

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log('%cRequest Config:', 'color: blue', config)
    return config
  },
  (error) => {
    console.error('%cRequest Error:', 'color: red', error)
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log('%cResponse Data:', 'color: green', response)
    return response
  },
  (error) => {
    if (error.response) {
      const { status } = error.response

      if (status === 401) {
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure;'
        window.location.href = '/login'
      } else if (status === 403) {
        console.error('Access denied. Insufficient permissions.')
      } else {
        console.error('An error occurred:', error.response.data?.message || error.message)
      }
    }
    return Promise.reject(error)
  }
)

export default api