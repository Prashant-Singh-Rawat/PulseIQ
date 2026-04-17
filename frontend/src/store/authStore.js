import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('priocardix_user')) || null,
  isAuthenticated: !!localStorage.getItem('priocardix_user'),

  loginSuccess: (userData) => {
    localStorage.setItem('priocardix_user', JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('priocardix_user');
    set({ user: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
