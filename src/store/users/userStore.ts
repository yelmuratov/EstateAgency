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
    user: User | null;
    loading: boolean;
    error: string | null;
    setUsers: (users: User[]) => void;
    fetchUsers: () => void;
    fetchUserById: (id: string) => void;
    updateUser: (id: string, data: User) => void;
    deleteUser: (id: string) => void;
}

export const UserStore = create<UserState>((set) => ({
    users: [],
    loading: false,
    error: null,
    user: null,

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
    fetchUserById: async (id: string) => {
        try {
            set({loading: true});
            const response = await api.get(`/user/${id}`);
            set({user: response.data, loading: false});
        } catch (error) {
            set({loading: false, error: error instanceof Error ? error.message : "Failed to fetch user."});
            throw error;
        }
    },
    updateUser: async (id: string, data: User) => {
        try {
            set({loading: true});
            await api.put(`/user/${id}`, data);
            set({loading: false});
        } catch (error) {
            set({loading: false, error: error instanceof Error ? error.message : "Failed to update user."});
            throw error;
        }
    },
    deleteUser: async (id: string) => {
        try {
            set({loading: true});
            await api.delete(`/user/${id}`);
            set({loading: false});
        } catch (error) {
            set({loading: false, error: error instanceof Error ? error.message : "Failed to delete user."});
            throw error;
        }
    }
}));