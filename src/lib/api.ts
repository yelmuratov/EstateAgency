import axios from 'axios';
import { getAuthToken, clearAuthToken } from './tokenHelper';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
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
        return Promise.reject(new Error('You do not have permission to perform this action.'));
      } else {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
