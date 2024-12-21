import api from '@/lib/api';
import {create} from 'zustand';


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

// all users state
interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
    setUsers: (users: User[]) => void;
    fetchUsers: () => void;
}

export const UserStore = create<UserState>((set) => ({
    users: [],
    loading: false,
    error: null,

    setUsers: (users) => set({users}),

    fetchUsers: async () => {
        try {
            set({loading: true});
            const response = await api.get('/user');
            set({users: response.data, loading: false});
        } catch (error) {
            set({loading: false, error: error instanceof Error ? error.message : "Failed to fetch users."});
            throw error;
        }
    },
}));