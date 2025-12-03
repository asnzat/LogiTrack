import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),

    login: (authData) => {
        // authData contains { user, accessToken } from backend
        const userData = {
            ...authData.user,
            accessToken: authData.accessToken,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
    },

    updateToken: (accessToken) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser) {
            const updatedUser = { ...currentUser, accessToken };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser });
        }
    },
}));

export default useAuthStore;
