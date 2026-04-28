// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, HelpCircle, ArrowLeft, Microscope, Mail } from 'lucide-react';
import SEO from '../components/SEO';

const FAQ_ITEMS = [
  { category: 'Image Quality', question: 'What makes a good image for analysis?', answer: 'Use natural daylight or a bright torch. Hold steady and focus on the specimen. Include a ruler or coin for scale if possible. Make sure the subject fills at least 50% of the frame — blurry or dark images reduce accuracy.' },
  { category: 'Image Quality', question: 'What sample types can I upload?', answer: 'Stool samples, blood smear images, skin lesion or scraping images, microscopy slides, and environmental samples. For stool, photograph on a white background in good light. For blood smears, a microscope image gives the best results.' },
  { category: 'Image Quality', question: 'What file formats are accepted?', answer: 'JPEG and PNG only. Maximum file size is 10MB. Resize before uploading if needed using your phone\'s built-in photo editor.' },
  { category: 'Pricing', question: 'How much does each analysis cost?', answer: 'Each image analysis costs 1 credit. Credits are priced at ~AUD $7.50 each. Bulk packs are available — contact support for details.' },
  { category: 'Pricing', question: 'Do my credits expire?', answer: 'No. Credits never expire. Purchase now and use whenever you need.' },
  { category: 'Pricing', question: 'Can I get a refund?', answer: 'Credits are non-refundable once used. If you have unused credits and are unhappy with the service, contact support@notworms.com within 14 days of purchase for review under Australian Consumer Law.' },
  { category: 'Results', question: 'How accurate is the AI?', answer: 'Our AI uses Claude Vision for analysis to achieve high accuracy. Each detection includes a confidence score. Results above 80% confidence are generally reliable, but image quality is the biggest factor. Always consult a healthcare professional to confirm findings.' },
  { category: 'Results', question: 'What do the urgency levels mean?', answer: 'LOW: Monitor symptoms. MODERATE: See a doctor within a few days. HIGH: See a doctor within 24 hours. EMERGENCY: Seek medical attention immediately — emergency department or call 000.' },
  { category: 'Results', question: 'Can I share results with a doctor?', answer: 'Yes. From the results page, download a text report including AI findings, confidence scores, and treatment information. This is designed to assist your conversation with a healthcare professional.' },
  { category: 'Privacy', question: 'How is my data stored?', answer: 'Images are encrypted in transit (TLS 1.3) and stored securely. Personal data is never sold to third parties. We comply with Australian Privacy Principles (APPs).' },
  { category: 'Privacy', question: 'Can I delete my data?', answer: 'Yes. Delete your entire account from Settings → Delete Account. Deletions are permanent and processed within 30 days.' },
  { category: 'Technical', question: 'How long does analysis take?', answer: 'Typically 30–90 seconds. The page updates automatically. If it takes longer than 3 minutes, contact support.' },
  { category: 'Technical', question: 'I\'m having trouble uploading. What should I try?', answer: 'Check image is JPEG/PNG under 10MB. Check your internet connection. Try a different browser. Clear your cache. If the problem persists, contact support@notworms.com.' },
];

const FAQPage = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(FAQ_ITEMS.map(f => f.category)))];
  const filtered = activeCategory === 'All' ? FAQ_ITEMS : FAQ_ITEMS.filter(f => f.category === activeCategory);

  return (
    <div className="pp-page">
      <SEO
        title="FAQ — Common Questions About ParasitePro"
        description="Answers to common questions about ParasitePro: photo privacy, how AI analysis works, legal status in Australia, and how the educational reports help you prepare for your GP."
        canonical="/faq"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQ_ITEMS.slice(0, 8).map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
          }))
        }}
      />
      {/* Nav */}
      <nav className="pp-nav">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)' }}>
            <Microscope size={15} style={{ color: 'var(--amber)' }} />
          </div>
          <span className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>ParasitePro</span>
        </div>
        <div />
      </nav>

      <div className="max-w-3xl mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <p className="pp-section-title mb-2">Support</p>
          <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Everything you need to know about ParasitePro.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-6 animate-slide-up delay-100">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all"
              style={activeCategory === cat
                ? { background: 'rgba(217,119,6,0.15)', color: 'var(--amber-bright)', border: '1px solid rgba(217,119,6,0.3)' }
                : { background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--bg-border)' }
              }>
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ items */}
        <div className="space-y-2 mb-10">
          {filtered.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="pp-card overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 0.04}s`, border: isOpen ? '1px solid rgba(217,119,6,0.25)' : undefined }}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <div>
                    <span className="text-xs font-mono mr-2" style={{ color: 'var(--amber)' }}>{item.category}</span>
                    <p className="font-heading font-semibold text-sm mt-1" style={{ color: 'var(--text-primary)' }}>{item.question}</p>
                  </div>
                  <ChevronDown size={16} className="flex-shrink-0 transition-transform"
                    style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none' }} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--bg-border)' }}>
                    <p className="text-sm leading-relaxed pt-4" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="pp-card p-6 text-center animate-slide-up" style={{ border: '1px solid rgba(217,119,6,0.2)', background: 'rgba(217,119,6,0.04)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)' }}>
            <Mail size={20} style={{ color: 'var(--amber)' }} />
          </div>
          <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Still have questions?</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>We typically respond within one business day.</p>
          <a href="mailto:support@notworms.com" className="pp-btn-primary inline-flex" style={{ padding: '10px 20px' }}>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
