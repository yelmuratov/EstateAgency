import {create} from 'zustand';

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
    clearUser: () => void;
}

export const UserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));