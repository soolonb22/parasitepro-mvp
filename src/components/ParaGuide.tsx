import React, { useState } from 'react';

interface ParaGuideProps {
  variant?: 'hero' | 'modal' | 'report' | 'inline';
  message?: string;
  onStartAnalysis?: () => void;
}

const ParaGuide: React.FC<ParaGuideProps> = ({
  variant = 'inline',
  message,
  onStartAnalysis,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultMessages = {
    hero: "G'day, I'm PARA — your supportive guide.",
    modal: "G’day, I’m PARA — your supportive guide for ParasitePro! I’m here to help you understand your results with clear, easy-to-follow advice.",
    report: "Here’s what this result likely means, and when it’s worth chatting with your GP.",
    inline: "Need help understanding this?",
  };

  const currentMessage = message || defaultMessages[variant];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-AU';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Audio not supported in this browser.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (variant === 'modal' || isModalOpen) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden">
          <div className="p-10 text-center">
            <div className="mx-auto w-28 h-28 bg-teal-100 rounded-3xl flex items-center justify-center mb-6">
              <img 
                src="https://via.placeholder.com/120x120/00BFA5/ffffff?text=PARA" 
                alt="PARA" 
                className="w-24 h-24 rounded-2xl" 
              />
            </div>

            <h2 className="text-3xl font-medium text-navy">G’day, I’m PARA</h2>
            <p className="mt-2 text-slate-600">your supportive guide for ParasitePro</p>
            
            <p className="mt-6 text-slate-600 leading-relaxed">
              {currentMessage}
            </p>

            <div className="mt-10 flex gap-4">
              <button 
                onClick={closeModal}
                className="flex-1 py-4 border border-slate-300 rounded-2xl font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Skip
              </button>
              <button 
                onClick={() => speak(currentMessage)}
                className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-teal-700 transition"
              >
                <i className="fas fa-volume-up"></i> Tap to hear PARA
              </button>
            </div>

            <button 
              onClick={() => {
                closeModal();
                if (onStartAnalysis) onStartAnalysis();
              }}
              className="mt-6 w-full py-5 bg-teal-600 text-white rounded-3xl text-xl font-semibold hover:bg-teal-700 transition"
            >
              Start Free Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={openModal}
      className="flex items-center gap-3 group hover:scale-105 transition"
    >
      <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center overflow-hidden">
        <img 
          src="https://via.placeholder.com/48x48/00BFA5/ffffff?text=PARA" 
          alt="PARA" 
          className="w-10 h-10 rounded-xl" 
        />
      </div>
      <div className="text-left">
        <p className="font-medium text-navy group-hover:text-teal">Meet PARA</p>
        <p className="text-sm text-slate-500">Your supportive guide</p>
      </div>
    </button>
  );
};

export default ParaGuide;
