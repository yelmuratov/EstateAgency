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
    
}