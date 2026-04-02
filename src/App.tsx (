// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import UploadPage from './pages/UploadPage';
import Report from './pages/Report';
import PricingPage from './pages/PricingPage';
import DashboardPage from './pages/DashboardPage';
import HowItWorks from './pages/HowItWorks';
import Resources from './pages/Resources';
import Privacy from './pages/Privacy';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/report" element={<Report />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-500">
            <p>Parasite ID Pro is an educational AI tool only. It is not a substitute for professional medical advice.</p>
            <p className="mt-2">Always consult your GP or healthcare provider for diagnosis and treatment.</p>
            <p className="mt-6 text-xs">© 2026 notworms.com • Built in Australia • Privacy First</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
