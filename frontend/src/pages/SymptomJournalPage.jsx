import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SymptomJournalPage = () => (
  <>
    <Helmet><title>Symptom Journal | Parasite Identification Pro</title></Helmet>
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center max-w-md">
        <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>📓</div>
        <h1 className="font-display font-bold text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>Symptom Journal</h1>
        <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
          Log daily symptoms, track patterns over time, and build a health timeline to share with your doctor.
        </p>
        <p className="text-xs mb-8 font-semibold uppercase tracking-wide" style={{ color: 'var(--amber-bright)' }}>
          Coming soon
        </p>
        <Link
          to="/dashboard"
          className="px-6 py-3 rounded-xl font-bold text-sm inline-block transition-all"
          style={{ background: 'var(--amber)', color: '#000' }}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  </>
);

export default SymptomJournalPage;
