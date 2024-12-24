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

interface IUserCreate {
    full_name: string;
    phone: string;
    email: string;
    password?: string;
    is_superuser: boolean;
}

interface UserState {
    users: User[];
    user: User | null;
    loading: boolean;
    error: string | null;
    createUser: (data: IUserCreate) => void;
    setUsers: (users: User[]) => void;
    fetchUsers: () => void;
    fetchUserById: (id: string) => void;
    updateUser: (id: string, data: Partial<User>) => void;
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
    updateUser: async (id: string, data: Partial<User>) => {
        try {
            set({loading: true});
            await api.put(`/user/${id}`, data);
            set((state) => ({
                users: state.users.map(user => user.id === id ? { ...user, ...data } : user),
                loading: false
            }));
        } catch (error) {
            set({loading: false, error: error instanceof Error ? error.message : "Failed to update user."});
            throw error;
        }
    },
    deleteUser: async (id: string) => {
        try {
            set({loading: true});
            await api.delete(`/user/${id}`);
            set((state) => ({
                users: state.users.filter(user => user.id !== id),
                loading: false
            }));
        } catch (error) {
            set({loading: false, error: error instanceof Error ? error.message : "Failed to delete user."});
            throw error;
        }
    },
    createUser: async (data: IUserCreate) => {
        try {
            set({loading: true});
            // Map password to hashed_password
            const payload = { ...data, hashed_password: data.password };
            delete payload.password;
            const response = await api.post('/user', payload);
            set((state) => ({
                users: [...state.users, response.data],
                loading: false
            }));
        } catch (error) {
            set({loading: false, error: error instanceof Error ? error.message : "Failed to create user."});
            throw error;
        }
    },    
}));