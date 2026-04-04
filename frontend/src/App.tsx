// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// ── Existing .tsx pages ──────────────────────────────────────────────────────
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import AnalysisResultsPage from './pages/AnalysisResultsPage';
import GPReportPage from './pages/GPReportPage';
import DashboardPage from './pages/DashboardPage';
import PricingPage from './pages/PricingPage';
import SampleReportPage from './pages/SampleReportPage';
import AdminPage from './pages/AdminPage';
import ContactPage from './pages/ContactPage';
import DisclaimerPage from './pages/DisclaimerPage';
import FAQPage from './pages/FAQPage';
import FoodDiaryPage from './pages/FoodDiaryPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PrivacyPage from './pages/PrivacyPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ResourcesPage from './pages/ResourcesPage';
import ResourceAiVsLabPage from './pages/ResourceAiVsLabPage';
import ResourceTropicalAustraliaPage from './pages/ResourceTropicalAustraliaPage';
import ResourceWhenToWorryPage from './pages/ResourceWhenToWorryPage';
import ScientificLibraryPage from './pages/ScientificLibraryPage';
import SettingsPage from './pages/SettingsPage';
import SharedResultsPage from './pages/SharedResultsPage';
import TermsPage from './pages/TermsPage';
import TreatmentTrackerPage from './pages/TreatmentTrackerPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

// ── SEO pages (.tsx) ─────────────────────────────────────────────────────────
import SeoBlackSpecksStoolPage from './pages/SeoBlackSpecksStoolPage';
import SeoCatWormsPage from './pages/SeoCatWormsPage';
import SeoDogWormsPage from './pages/SeoDogWormsPage';
import SeoGiardiaPage from './pages/SeoGiardiaPage';
import SeoNaturalParasiteCleansePage from './pages/SeoNaturalParasiteCleansePage';
import SeoParasiteSymptomsPage from './pages/SeoParasiteSymptomsPage';
import SeoPinwormPage from './pages/SeoPinwormPage';
import SeoQueenslandParasitesPage from './pages/SeoQueenslandParasitesPage';
import SeoRoundwormPage from './pages/SeoRoundwormPage';
import SeoSkinParasitePage from './pages/SeoSkinParasitePage';
import SeoTapewormPage from './pages/SeoTapewormPage';
import SeoWormInStoolPage from './pages/SeoWormInStoolPage';

// ── New .jsx pages ────────────────────────────────────────────────────────────
import BlogPage from './pages/BlogPage';
import DemoExperience from './pages/DemoExperience';
import EncyclopediaPage from './pages/EncyclopediaPage';
import HealthFormsPage from './pages/HealthFormsPage';
import LoginPage from './pages/LoginPage';
import NotificationSettingsPage from './pages/NotificationSettingsPage';
import OnboardingSurvey from './pages/OnboardingSurvey';
import PromoLandingPage from './pages/PromoLandingPage';
import ResultsPage from './pages/ResultsPage';
import SignupPage from './pages/SignupPage';
import SymptomJournalPage from './pages/SymptomJournalPage';
import TravelRiskMapPage from './pages/TravelRiskMapPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Core */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/results/:id" element={<ResultsPage />} />
            <Route path="/analysis" element={<AnalysisResultsPage />} />
            <Route path="/analysis/:id" element={<AnalysisResultsPage />} />
            <Route path="/gp-report/:id" element={<GPReportPage />} />
            <Route path="/sample-report" element={<SampleReportPage />} />
            <Route path="/shared/:id" element={<SharedResultsPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/onboarding" element={<OnboardingSurvey />} />

            {/* Dashboard / User */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationSettingsPage />} />
            <Route path="/food-diary" element={<FoodDiaryPage />} />
            <Route path="/symptom-journal" element={<SymptomJournalPage />} />
            <Route path="/treatment-tracker" element={<TreatmentTrackerPage />} />
            <Route path="/health-forms" element={<HealthFormsPage />} />

            {/* Pricing / Payments */}
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/promo" element={<PromoLandingPage />} />
            <Route path="/promo/:code" element={<PromoLandingPage />} />

            {/* Reference / Info */}
            <Route path="/encyclopedia" element={<EncyclopediaPage />} />
            <Route path="/scientific-library" element={<ScientificLibraryPage />} />
            <Route path="/travel-risk" element={<TravelRiskMapPage />} />
            <Route path="/demo" element={<DemoExperience />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />

            {/* Resources */}
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/ai-vs-lab" element={<ResourceAiVsLabPage />} />
            <Route path="/resources/tropical-australia" element={<ResourceTropicalAustraliaPage />} />
            <Route path="/resources/when-to-worry" element={<ResourceWhenToWorryPage />} />

            {/* Legal */}
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* SEO Landing Pages */}
            <Route path="/parasites/symptoms" element={<SeoParasiteSymptomsPage />} />
            <Route path="/parasites/worm-in-stool" element={<SeoWormInStoolPage />} />
            <Route path="/parasites/tapeworm" element={<SeoTapewormPage />} />
            <Route path="/parasites/pinworm" element={<SeoPinwormPage />} />
            <Route path="/parasites/roundworm" element={<SeoRoundwormPage />} />
            <Route path="/parasites/giardia" element={<SeoGiardiaPage />} />
            <Route path="/parasites/skin" element={<SeoSkinParasitePage />} />
            <Route path="/parasites/black-specks-stool" element={<SeoBlackSpecksStoolPage />} />
            <Route path="/parasites/queensland" element={<SeoQueenslandParasitesPage />} />
            <Route path="/parasites/natural-cleanse" element={<SeoNaturalParasiteCleansePage />} />
            <Route path="/parasites/dog-worms" element={<SeoDogWormsPage />} />
            <Route path="/parasites/cat-worms" element={<SeoCatWormsPage />} />
          </Routes>
        </main>

        <footer className="bg-white border-t py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-500">
            <p className="font-medium">
              ParasitePro is an <span className="text-teal-600">educational AI tool only</span>.
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
