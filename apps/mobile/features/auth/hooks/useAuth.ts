import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,

  login: async (email: string, password: string) => {
    // TODO: Implement actual login with API
    set({ isAuthenticated: true, userId: 'demo-user-id' });
  },

  logout: () => {
    set({ isAuthenticated: false, userId: null });
  },
}));
