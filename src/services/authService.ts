import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/router';

interface LoginResponse {
  access_token: string,
  error: string,
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
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (err) {
    const apiError = err as {
      response?: {
        status?: number;
        data?: {
          message?: string;
        };
      };
      message?: string;
    };

    if (apiError.response?.status === 401) {
      const { clearToken } = useAuthStore.getState();
      const router = useRouter(); // Get the router instance
      clearToken(router); // Pass the router to clearToken
    }
    return err;
  }
};

