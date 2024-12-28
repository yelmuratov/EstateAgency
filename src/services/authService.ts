import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore';

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

interface User {
  id: number;
  full_name: string;
  disabled: boolean;
  created_at: string;
  updated_at: string;
  phone: string;
  hashed_password: string; // This may not need to be exposed in your UI
  email: string;
  is_superuser: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface ExtendedAuthResponse extends AuthResponse {
  key: number;
}
export const getUser = async (): Promise<ExtendedAuthResponse | null> => {
  try {
    const response = await api.get<AuthResponse>('/auth/me');
    return { ...response.data, key: response.data.user.id };
  } catch (err) {
    const apiError = err as {
      response?: {
        status?: number;
        data?: {
          detail?: string;
        };
      };
      message?: string;
    };

    if (apiError.response?.status === 401) {
      const { clearToken } = useAuthStore.getState();
      clearToken(); 
    }

    return null; // Return null in case of an error
  }
};
