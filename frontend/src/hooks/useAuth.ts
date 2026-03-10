import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, accessToken, isLoading, login, logout, refreshUser } = useAuthStore();
  return { user, token: accessToken, isLoading, login, logout, refreshUser, isAuthenticated: !!user };
};
