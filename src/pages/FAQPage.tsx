import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail } from 'lucide-react';

interface FAQItem { question: string; answer: string; category: string; }

const FAQ_ITEMS: FAQItem[] = [
  { category: 'Image Quality', question: 'What makes a good image for analysis?', answer: 'Use good lighting, hold steady, include scale reference, fill 50% of frame. Blurry or dark images reduce accuracy.' },
  { category: 'Image Quality', question: 'What sample types can I upload?', answer: 'Stool samples, blood smear images, and skin lesion images. Photograph on white background in good light.' },
  { category: 'Image Quality', question: 'What file formats are accepted?', answer: 'JPEG and PNG only. Maximum file size is 10MB.' },
  { category: 'Pricing', question: 'How much does each analysis cost?', answer: 'USD $4.99 per credit (~AUD $7.50). Bulk packs: 5 credits USD $19.99, 10 credits USD $34.99.' },
  { category: 'Pricing', question: 'Do my credits expire?', answer: 'No, credits never expire.' },
  { category: 'Pricing', question: 'Can I get a refund?', answer: 'Credits non-refundable once used. Unused credits — contact support@parasitepro.com within 14 days under Australian Consumer Law.' },
  { category: 'Understanding Results', question: 'How accurate is the AI?', answer: 'Dual-model analysis (Claude Vision + GPT-4o). Results above 80% confidence are generally reliable. Always consult a healthcare professional.' },
  { category: 'Understanding Results', question: 'What do the urgency levels mean?', answer: 'LOW: monitor. MODERATE: see doctor within days. HIGH: see doctor within 24hrs. EMERGENCY: seek care immediately, call 000.' },
  { category: 'Understanding Results', question: 'Can I share my results with a doctor?', answer: 'Yes. Download a PDF report from the results page to share with a healthcare professional.' },
  { category: 'Privacy & Data', question: 'How is my data stored?', answer: 'Encrypted in transit (TLS 1.3) and at rest on Cloudinary. Complies with Australian Privacy Principles.' },
  { category: 'Privacy & Data', question: 'Can I delete my data?', answer: 'Yes. Delete individual images or your entire account from Settings. Processed within 30 days.' },
  { category: 'Technical', question: 'How long does analysis take?', answer: 'Typically 30-90 seconds. Page updates automatically. Contact support if over 3 minutes.' },
  { category: 'Technical', question: "I'm having trouble uploading. What should I try?", answer: 'Check image is JPEG/PNG under 10MB, check internet connection, try different browser, clear cache. Contact support if persists.' },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', ...Array.from(new Set(FAQ_ITEMS.map((f) => f.category)))];
  const filtered = activeCategory === 'All' ? FAQ_ITEMS : FAQ_ITEMS.filter((f) => f.category === activeCategory);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="max-w-3xl mx-auto p-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-600 rounded-xl"><HelpCircle size={28} className="text-white" /></div>
        <div>
          <h1 className="text-3xl font-bold text-white">Help &amp; FAQ</h1>
          <p className="text-gray-400 text-sm">Find answers to common questions</p>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{cat}</button>
        ))}
      </div>
      <div className="space-y-2 mb-10">
        {filtered.map((item, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <button onClick={() => toggle(i)} className="w-full flex items-center justify-between p-4 text-left transition-colors">
              <div className="flex-1 pr-4">
                <span className="text-xs text-blue-400 font-medium">{item.category}</span>
                <p className="text-white font-medium mt-0.5">{item.question}</p>
              </div>
              {openIndex === i ? <ChevronUp size={20} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />}
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 border-t border-gray-700">
                <p className="text-gray-300 text-sm leading-relaxed pt-3">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
        <h2 className="text-white font-bold text-lg mb-2">Still need help?</h2>
        <p className="text-gray-400 text-sm mb-5">Support available Mon–Fri, 9am–5pm AEST.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:support@parasitepro.com" className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"><Mail size={18} />Email Support</a>
          <a href="https://www.facebook.com/groups/theparasiteunderground" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-semibold transition-colors"><MessageCircle size={18} />Community Group</a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;