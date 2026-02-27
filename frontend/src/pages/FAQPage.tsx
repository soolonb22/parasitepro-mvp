import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail } from 'lucide-react';

interface FAQItem { question: string; answer: string; category: string; }

const FAQ_ITEMS: FAQItem[] = [
  { category: 'Image Quality', question: 'What makes a good image for analysis?', answer: 'For best results: (1) Use good lighting — natural daylight or a bright torch. (2) Hold your camera steady and focus on the specimen. (3) Include a ruler or coin for scale if possible. (4) Make sure the subject fills at least 50% of the frame. Blurry or dark images will reduce accuracy.' },
  { category: 'Image Quality', question: 'What sample types can I upload?', answer: 'You can upload stool sample images, blood smear images, and skin lesion or scraping images. For stool samples, photograph the sample on a white background in good light. For blood smears, a microscope image gives the best results. For skin samples, photograph the affected area clearly.' },
  { category: 'Image Quality', question: 'What file formats are accepted?', answer: "We accept JPEG and PNG images only. The maximum file size is 10MB. If your image is larger, resize it before uploading using your phone's built-in photo editor." },
  { category: 'Pricing', question: 'How much does each analysis cost?', answer: 'Each image analysis costs 1 credit. Credits are priced at USD $4.99 each (~AUD $7.50). We also offer bulk packs: 5 credits for USD $19.99 (save 20%) and 10 credits for USD $34.99 (save 30%).' },
  { category: 'Pricing', question: 'Do my credits expire?', answer: 'No, your credits never expire. You can purchase credits now and use them whenever you need.' },
  { category: 'Pricing', question: 'Can I get a refund?', answer: 'Credits are non-refundable once used. If you have unused credits and are unhappy with the service, please contact us at support@notworms.com within 14 days of purchase and we will review your case under Australian Consumer Law.' },
  { category: 'Understanding Results', question: 'How accurate is the AI?', answer: 'Our AI uses dual-model analysis (Claude Vision + GPT-4o) to achieve high accuracy. Each detection includes a confidence score. Results above 80% confidence are generally reliable, but the quality of the input image is the biggest factor in accuracy. Always consult a healthcare professional to confirm findings.' },
  { category: 'Understanding Results', question: 'What do the urgency levels mean?', answer: 'LOW: Routine parasite, monitor symptoms and consider treatment. MODERATE: See a doctor within a few days. HIGH: See a doctor within 24 hours. EMERGENCY: Seek medical attention immediately — visit an emergency department or call 000.' },
  { category: 'Understanding Results', question: 'Can I share my results with a doctor?', answer: 'Yes. From the results page, you can download a PDF report that includes your image, AI findings, confidence scores, and treatment information. This is designed to assist your conversation with a healthcare professional.' },
  { category: 'Privacy & Data', question: 'How is my data stored?', answer: 'Your images are encrypted in transit (TLS 1.3) and stored securely on Cloudinary with encryption at rest. Your personal data is stored on our secure database and is never sold to third parties. We comply with the Australian Privacy Principles (APPs).' },
  { category: 'Privacy & Data', question: 'Can I delete my data?', answer: 'Yes. You can delete individual images from the analysis history page, or delete your entire account and all associated data from Settings → Delete Account. Deletions are permanent and processed within 30 days.' },
  { category: 'Technical', question: 'How long does analysis take?', answer: 'Analysis typically takes 30–90 seconds. The page will update automatically when results are ready. If your analysis takes longer than 3 minutes, please contact support.' },
  { category: 'Technical', question: "I'm having trouble uploading. What should I try?", answer: 'Try these steps: (1) Ensure your image is JPEG or PNG under 10MB. (2) Check your internet connection. (3) Try a different browser. (4) Clear your browser cache. If the problem persists, contact support@notworms.com with a description of the issue.' },
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
        <div><h1 className="text-3xl font-bold text-white">Help & FAQ</h1><p className="text-gray-400 text-sm">Find answers to common questions</p></div>
      </div>
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (<button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{cat}</button>))}
      </div>
      <div className="space-y-2 mb-10">
        {filtered.map((item, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <button onClick={() => toggle(i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-750 transition-colors">
              <div className="flex-1 pr-4"><span className="text-xs text-blue-400 font-medium">{item.category}</span><p className="text-white font-medium mt-0.5">{item.question}</p></div>
              {openIndex === i ? <ChevronUp size={20} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />}
            </button>
            {openIndex === i && (<div className="px-4 pb-4 border-t border-gray-700"><p className="text-gray-300 text-sm leading-relaxed pt-3">{item.answer}</p></div>)}
          </div>
        ))}
      </div>
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
        <h2 className="text-white font-bold text-lg mb-2">Still need help?</h2>
        <p className="text-gray-400 text-sm mb-5">Our support team is available Monday–Friday, 9am–5pm AEST.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:support@notworms.com" className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"><Mail size={18} />Email Support</a>
          <a href="https://www.facebook.com/groups/theparasiteunderground" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-semibold transition-colors"><MessageCircle size={18} />Community Group</a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;