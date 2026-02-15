import { create } from 'zustand';
import axios from '@/services/api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (userData: any) => void;
    logout: () => void;
    register: (userData: any) => Promise<void>;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: typeof window !== 'undefined' && !!localStorage.getItem('token'),

    login: async (userData) => {
        try {
            const { data } = await axios.post('/auth/login', userData);
            localStorage.setItem('token', data.token);
            set({ user: data, token: data.token, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const { data } = await axios.post('/auth/register', userData);
            localStorage.setItem('token', data.token);
            set({ user: data, token: data.token, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            // Verify token logic if needed, or just set state
            set({ token, isAuthenticated: true });
        }
    }
}));
