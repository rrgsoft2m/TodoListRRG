import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://todolist-api-860x.onrender.com/api',
});

api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                // We can't use the store hook here easily outside a component, 
                // but we can manually redirect or use a custom event.
                // For now, let's just ensure the token is gone so the app reacts on reload/check.
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
