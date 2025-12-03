import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies (refresh token)
});

// Add request interceptor to include access token
api.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.accessToken) {
                    config.headers.Authorization = `Bearer ${user.accessToken}`;
                }
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth Service
export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    refreshToken: async () => {
        const response = await api.post('/auth/refresh-token');
        return response.data;
    },
};

// Shipment Service
export const shipmentService = {
    getAll: async () => {
        const response = await api.get('/shipments');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/shipments/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/shipments', data);
        return response.data;
    },

    updateStatus: async (id, status, location) => {
        const response = await api.patch(`/shipments/${id}/status`, { status, location });
        return response.data;
    },

    track: async (trackingNumber) => {
        const response = await api.get(`/shipments/track/${trackingNumber}`);
        return response.data;
    },
};

// Driver Service
export const driverService = {
    getAll: async () => {
        const response = await api.get('/drivers');
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/drivers/me');
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/drivers', data);
        return response.data;
    },
};

export default api;
