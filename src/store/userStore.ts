import {create} from 'zustand';
import api from '@/lib/api';

interface User{
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
    setUser: (user: User) => void;
    logoutUser: ()=> void;
    loading: boolean;
    error: string | null;
}

export const UserStore = create<UserState>((set) => ({
    user: null,
    loading: false,
    error: null,
    setUser: (user) => set({ user }),
    logoutUser: async() => {
        try{
            set({ loading: true });
            await api.post('/auth/logout').then(() => set({ user: null })),
            set({ loading: false });
        }catch(error){
            set({ loading: false, error: error instanceof Error ? error.message : String(error) });
            return error;
        }
    }
}));