import { create } from 'zustand';
import { useRouter } from 'next/router';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

// Helper function to get token from cookies (client-side only)
const getAuthTokenFromCookies = (): string | null => {
  if (typeof window === 'undefined') {
    // If running on the server, return null
    return null;
  }
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('auth_token='))
    ?.split('=')[1] || null;
};

// Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  token: null, // Default to null initially
  setToken: (token) => {
    // Save token in cookies (no 'secure' attribute for HTTP)
    document.cookie = `auth_token=${token}; path=/;`;
    set({ token });
  },
  clearToken: () => {
    // Remove token from cookies (no 'secure' attribute for HTTP)
    document.cookie = `auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    set({ token: null });
    const router = useRouter();
    router.push('/login');
  },
}));

// Initialize the token on the client side
if (typeof window !== 'undefined') {
  const token = getAuthTokenFromCookies();
  useAuthStore.setState({ token });
}
