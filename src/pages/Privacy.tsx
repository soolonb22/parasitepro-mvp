// src/pages/Privacy.tsx
import React from 'react';
import ParaGuide from '../components/ParaGuide';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-semibold text-navy">Privacy & Safety</h1>
        <p className="mt-4 text-xl text-slate-600">Your data is protected. Your trust matters.</p>
      </div>

      <div className="space-y-16">
        {/* Data Privacy */}
        <div className="bg-white rounded-3xl p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-3xl">🔒</div>
            <h2 className="text-3xl font-semibold text-navy">Data Privacy</h2>
          </div>
          <ul className="space-y-4 text-slate-600">
            <li className="flex gap-3">
              <span className="text-teal-600 mt-1">•</span>
              Photos are processed securely and deleted after analysis unless you choose to save them.
            </li>
            <li className="flex gap-3">
              <span className="text-teal-600 mt-1">•</span>
              We do not share your personal information with third parties without your consent.
            </li>
            <li className="flex gap-3">
              <span className="text-teal-600 mt-1">•</span>
              All data is stored on secure Australian servers.
            </li>
          </ul>
        </div>

        {/* Security Measures */}
        <div className="bg-white rounded-3xl p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-3xl">🛡️</div>
            <h2 className="text-3xl font-semibold text-navy">Security Measures</h2>
          </div>
          <ul className="space-y-4 text-slate-600">
            <li className="flex gap-3">
              <span className="text-teal-600 mt-1">•</span>
              End-to-end encryption for photo uploads and reports.
            </li>
            <li className="flex gap-3">
              <span className="text-teal-600 mt-1">•</span>
              Regular security audits and compliance with Australian Privacy Principles.
            </li>
            <li className="flex gap-3">
              <span className="text-teal-600 mt-1">•</span>
              You control your data — delete anytime.
            </li>
          </ul>
        </div>

        {/* How We Use Your Photos */}
        <div className="bg-white rounded-3xl p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-3xl">📸</div>
            <h2 className="text-3xl font-semibold text-navy">How We Use Your Photos</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Photos are used solely for AI analysis within Parasite Pro. 
            They are never shared for marketing or sold to third parties. 
            Anonymised data may optionally contribute to regional parasite mapping to help public health efforts.
          </p>
        </div>
      </div>

      <div className="mt-20 text-center">
        <ParaGuide 
          variant="inline" 
          message="Your privacy and safety are our top priority." 
        />
      </div>
    </div>
  );
};

export default Privacy;
