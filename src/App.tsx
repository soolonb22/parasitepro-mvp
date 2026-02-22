import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PricingPage from './pages/PricingPage';
import FAQPage from './pages/FAQPage';

// Protected Pages
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import AnalysisResultsPage from './pages/AnalysisResultsPage';
import AnalysesListPage from './pages/AnalysesListPage';
import SymptomTrackingPage from './pages/SymptomTrackingPage';
import JournalPage from './pages/JournalPage';
import ClinicalAssessmentPage from './pages/ClinicalAssessmentPage';
import EducationModulePage from './pages/EducationModulePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  return <>{children}</>;
};

// Public Route Wrapper (redirects to dashboard if logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

function App() {
  const { initializeAuth, loading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#1F2937', color: '#fff', border: '1px solid #374151' },
            success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />

        <Navbar />
        <ScrollToTop />

        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/help" element={<FAQPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
            <Route path="/analysis/:id" element={<ProtectedRoute><AnalysisResultsPage /></ProtectedRoute>} />
            <Route path="/analyses" element={<ProtectedRoute><AnalysesListPage /></ProtectedRoute>} />
            <Route path="/symptoms" element={<ProtectedRoute><SymptomTrackingPage /></ProtectedRoute>} />
            <Route path="/symptoms/track" element={<ProtectedRoute><SymptomTrackingPage /></ProtectedRoute>} />
            <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
            <Route path="/assessment" element={<ProtectedRoute><ClinicalAssessmentPage /></ProtectedRoute>} />
            <Route path="/education" element={<ProtectedRoute><EducationModulePage /></ProtectedRoute>} />
            <Route path="/education/:moduleId" element={<ProtectedRoute><EducationModulePage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;