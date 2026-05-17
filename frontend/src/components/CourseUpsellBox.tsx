// src/components/CourseUpsellBox.tsx
import React from 'react';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';

export const CourseUpsellBox: React.FC = () => {
  return (
    <div className="mt-12 border-2 rounded-2xl overflow-hidden" style={{ borderColor: '#1B6B5F', background: 'linear-gradient(to bottom right, #D6EFE4, #FFFFFF)' }}>
      {/* Header */}
      <div className="px-6 py-4" style={{ background: '#1B6B5F' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)' }}>
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Want to understand the science behind this assessment?</h3>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>Go deeper with our evidence-based course</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0">
            <Sparkles className="w-5 h-5 mt-1" style={{ color: '#1B6B5F' }} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Clearing the Body of Toxins &amp; Parasites
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              The only science-based course that replaces fear-marketing with real biology. 
              <strong className="text-gray-900"> 5 modules, interactive tools, and an AI-powered doctor letter generator</strong> — 
              all built around your body's natural detoxification system.
            </p>
          </div>
        </div>

        {/* What's Included - Compact Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 rounded-lg p-4" style={{ background: '#D6EFE4' }}>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1B6B5F' }} />
            5 complete modules (3-5 hours)
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1B6B5F' }} />
            30-Day Protocol Builder
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1B6B5F' }} />
            AI Doctor Letter Generator
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1B6B5F' }} />
            Queensland-specific risk guide
          </div>
        </div>

        {/* Pricing + CTA */}
        <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: '#C8DDD8' }}>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">$77 AUD</span>
              <span className="text-sm text-gray-500 line-through">$97</span>
              <span className="text-xs font-semibold px-2 py-1 rounded" style={{ color: '#073D2B', background: '#D6EFE4' }}>
                ParasitePro exclusive
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">One-time payment • Lifetime access</p>
          </div>
          
          <a 
            href="https://notworms.com/course?ref=gp-report&discount=PARA20"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold shadow-sm transition-colors"
            style={{ background: '#1B6B5F', color: 'white' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#147A52'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1B6B5F'}
            onClick={() => {
              // Track course CTA click in Google Analytics
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'course_cta_click', {
                  event_category: 'Course Funnel',
                  event_label: 'GP Report Upsell Box',
                  value: 77,
                  source: 'gp_report',
                  discount_code: 'PARA20'
                });
              }
            }}
          >
            View Course
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Trust Badge */}
        <div className="mt-4 pt-4 border-t" style={{ borderColor: '#C8DDD8' }}>
          <p className="text-xs text-gray-500 text-center">
            🔒 30-day satisfaction guarantee • Secure checkout via Stripe
          </p>
        </div>
      </div>
    </div>
  );
};
