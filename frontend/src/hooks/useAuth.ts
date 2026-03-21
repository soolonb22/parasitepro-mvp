import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, accessToken, login, logout, signup, refreshUser } = useAuthStore();
  return { user, token: accessToken, login, logout, signup, refreshUser, isAuthenticated: !!user };
};
