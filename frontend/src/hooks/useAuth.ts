import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, accessToken, login, logout, refreshUser } = useAuthStore();
  return { user, token: accessToken, login, logout, refreshUser, isAuthenticated: !!user };
};
