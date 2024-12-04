import axios from 'axios';
import { getAuthToken, clearAuthToken } from './tokenHelper';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  timeout: 5000,
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('%cRequest Error:', 'color: red', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        clearAuthToken(); // Centralized function to remove token from cookies/local storage
        console.warn('Session expired. Redirecting to login.');
        window.location.href = '/login'; // Or use your routing solution
      } else if (status === 403) {
        console.error('Access denied. Insufficient permissions.');
      } else {
        console.error('An error occurred:', error.response.data?.message || error.message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
