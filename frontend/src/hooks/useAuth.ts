import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, accessToken, login, logout, signup, refreshUser } = useAuthStore();

  // isSubscribed = any logged-in user.
  // The library is an education/retention feature — locking it from users who've
  // run out of credits punishes them at the exact moment they need to learn and
  // want to re-purchase. Credits are consumed only for AI analyses, not reading.
  const isSubscribed = !!user;

  return {
    user,
    token: accessToken,
    login,
    logout,
    signup,
    refreshUser,
    isAuthenticated: !!user,
    isSubscribed,
  };
};
