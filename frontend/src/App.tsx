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

        {/* Footer with strong disclaimers */}
        <footer className="bg-white border-t py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-500">
            <p className="font-medium">
              Parasite ID Pro is an <span className="text-teal-600">educational AI tool only</span>. 
              It is not a medical diagnosis and should not replace professional medical advice.
            </p>
            <p className="mt-3">
              Always consult your GP or healthcare provider for diagnosis and treatment. 
              In an emergency, call 000 immediately.
            </p>
            <p className="mt-8 text-xs">
              © 2026 notworms.com • Built in Australia • Privacy First • Secure Australian servers
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
