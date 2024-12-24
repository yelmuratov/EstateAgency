import api from '@/lib/api';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

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
    isFetchingUsers: boolean;
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
    isFetchingUsers: false,

    setUsers: (users) => set({ users }),

    fetchUsers: async () => {
        set((state) => {
            if (state.isFetchingUsers) return state; // Prevent multiple calls
            return { isFetchingUsers: true };
        });
    
        try {
            set({ loading: true });
            const response = await api.get('/user');
    
            // Ensure unique keys using uuid
            const users = response.data.map((user: User) => ({
                ...user,
                key: uuidv4(),
            }));
    
            set({ users, loading: false });
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : "Failed to fetch users.",
            });
            set({ isFetchingUsers: false }); // Reset flag
        } finally {
            set({ isFetchingUsers: false }); // Reset flag
        }
    },
    fetchUserById: async (id: string) => {
        try {
            set({ loading: true });
            const response = await api.get(`/user/${id}`);
            set({ user: response.data, loading: false });
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : "Failed to fetch user.",
            });
            throw error;
        }
    },

    updateUser: async (id: string, data: Partial<User>) => {
        try {
            set({ loading: true });
            await api.put(`/user/${id}`, data);
            set((state) => ({
                users: state.users.map((user) =>
                    user.id === id ? { ...user, ...data } : user
                ),
                loading: false,
            }));
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : "Failed to update user.",
            });
            throw error;
        }
    },

    deleteUser: async (id: string) => {
        try {
            set({ loading: true });
            await api.delete(`/user/${id}`);
            set((state) => ({
                users: state.users.filter((user) => user.id !== id),
                loading: false,
            }));
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : "Failed to delete user.",
            });
            throw error;
        }
    },

    createUser: async (data: IUserCreate) => {
        try {
            set({ loading: true });
            // Map password to hashed_password
            const payload = { ...data, hashed_password: data.password };
            delete payload.password;
            const response = await api.post('/user', payload);
            set((state) => ({
                users: [...state.users, response.data],
                loading: false,
            }));
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : "Failed to create user.",
            });
            throw error;
        }
    },
}));
