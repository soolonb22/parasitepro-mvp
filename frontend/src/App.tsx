import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import AnalysisResultsPage from './pages/AnalysisResultsPage';
import SettingsPage from './pages/SettingsPage';
import FAQPage from './pages/FAQPage';
import PricingPage from './pages/PricingPage';
import JournalPage from './pages/JournalPage';
import ProfilePage from './pages/ProfilePage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function LoginPage() {
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.accessToken, data.refreshToken);
        window.location.href = '/dashboard';
      } else {
        alert(data.error || 'Login failed');
      }
    } catch {
      alert('Failed to connect to server');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-6">🦠 ParasitePro</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" placeholder="Email" required
            className="w-full border rounded px-4 py-2 text-sm" />
          <input name="password" type="password" placeholder="Password" required
            className="w-full border rounded px-4 py-2 text-sm" />
          <button type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
            Sign In
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-500">
          No account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}

function SignupPage() {
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value;
    const lastName = (form.elements.namedItem('lastName') as HTMLInputElement).value;

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.accessToken, data.refreshToken);
        window.location.href = '/dashboard';
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch {
      alert('Failed to connect to server');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-6">🦠 Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="firstName" type="text" placeholder="First name"
            className="w-full border rounded px-4 py-2 text-sm" />
          <input name="lastName" type="text" placeholder="Last name"
            className="w-full border rounded px-4 py-2 text-sm" />
          <input name="email" type="email" placeholder="Email" required
            className="w-full border rounded px-4 py-2 text-sm" />
          <input name="password" type="password" placeholder="Password" required
            className="w-full border rounded px-4 py-2 text-sm" />
          <button type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
            Create Account
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/upload"
          element={<ProtectedRoute><UploadPage /></ProtectedRoute>}
        />
        <Route
          path="/analysis/:id"
          element={<ProtectedRoute><AnalysisResultsPage /></ProtectedRoute>}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute><SettingsPage /></ProtectedRoute>}
        />
        <Route
          path="/pricing"
          element={<ProtectedRoute><PricingPage /></ProtectedRoute>}
        />
        <Route
          path="/journal"
          element={<ProtectedRoute><JournalPage /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
