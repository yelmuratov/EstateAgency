import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  id: string | null;
  full_name: string;
  disabled: boolean;
  created_at: string;
  updated_at: string;
  phone: string;
  email: string;
  hashed_password: string;
  is_superuser: boolean;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  logoutUser: () => void;
}

export const UserStore = create<UserState>((set) => ({
  user: null,
  loading: true, // Set loading to true initially
  error: null,
  
  setUser: (user) => set({ user, loading: false }), // Set loading to false when user is set

  logoutUser: async () => {
    try {
      set({ loading: true });
      await api.post('/auth/logout'); // Call logout API
      set({ user: null, loading: false }); // Reset user state
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : "Logout failed." });
      throw error; // Re-throw for handling in the calling function
    }
  },
}));
