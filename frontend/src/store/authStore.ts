import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const _BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || 'http://localhost:5000';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageCredits: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setAccessToken: (token: string) => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken: refreshToken || null,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setAccessToken: (token) => set({ accessToken: token }),

      refreshUser: async () => {
        const { accessToken } = get();
        if (!accessToken) return;
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            set((state) => ({
              user: state.user ? {
                ...state.user,
                imageCredits: data.imageCredits,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
              } : null,
            }));
          }
        } catch { /* silent fail */ }
      },
    }),
    {
      name: 'parasitepro-auth',
    }
  )
);
