// src/components/DashboardCourseBanner.tsx
import React, { useState, useEffect } from 'react';
import { X, BookOpen, Sparkles } from 'lucide-react';

export const DashboardCourseBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  // Check if user has already dismissed this banner (localStorage)
  useEffect(() => {
    const hasAlreadyDismissed = localStorage.getItem('course_banner_dismissed');
    if (hasAlreadyDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    // Track banner dismissal in Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'course_banner_dismissed', {
        event_category: 'Course Funnel',
        event_label: 'Dashboard Banner Dismissed',
        source: 'dashboard'
      });
    }
    
    localStorage.setItem('course_banner_dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="mb-6 rounded-xl p-4 relative" style={{ background: 'linear-gradient(to right, #D6EFE4, #E0F2FE)', border: '1px solid #C8DDD8' }}>
      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4 pr-8">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: '#1B6B5F' }}>
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">
              Want to understand the science behind your analyses?
            </h3>
            <span className="text-xs font-semibold px-2 py-1 rounded" style={{ color: '#073D2B', background: '#D6EFE4' }}>
              $20 off
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            Our evidence-based course covers everything from Nrf2 pathways to parasite lifecycles — 
            plus interactive tools to build your 30-day protocol and generate a professional GP letter.
          </p>

          {/* CTA Row */}
          <div className="flex items-center gap-3">
            <a 
              href="https://notworms.com/course?ref=dashboard&discount=PARA20"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ background: '#1B6B5F', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#147A52'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#1B6B5F'}
              onClick={() => {
                // Track course CTA click in Google Analytics
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'course_cta_click', {
                    event_category: 'Course Funnel',
                    event_label: 'Dashboard Banner',
                    value: 77,
                    source: 'dashboard',
                    discount_code: 'PARA20'
                  });
                }
              }}
            >
              <Sparkles className="w-4 h-4" />
              View Course — $77 AUD
            </a>
            
            <span className="text-xs text-gray-500">
              One-time payment • Lifetime access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
