// src/components/ParaGuide.tsx
import React, { useState, useEffect } from 'react';

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
  const [isSpeaking, setIsSpeaking] = useState(false);

  const defaultMessages = {
    hero: "G'day, I'm PARA — your supportive guide.",
    modal: "G’day, I’m PARA — your supportive guide for ParasitePro! I’m here to help you understand your results with clear, easy-to-follow advice.",
    report: "Here’s what this result likely means, and when it’s worth chatting with your GP.",
    inline: "Need help understanding this?",
  };

  const currentMessage = message || defaultMessages[variant];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-AU';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Audio not supported in this browser.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Modal version with nice entrance animation
  if (variant === 'modal' || isModalOpen) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white rounded-3xl max-w-md w-full overflow-hidden 
                     animate-in fade-in-0 zoom-in-95 duration-300"
        >
          <div className="p-10 text-center">
            {/* PARA Illustration with gentle float animation */}
            <div className="mx-auto w-28 h-28 bg-teal-100 rounded-3xl flex items-center justify-center mb-6 
                            animate-[float_3s_ease-in-out_infinite]">
              <img 
                src="https://via.placeholder.com/120x120/00BFA5/ffffff?text=PARA" 
                alt="PARA" 
                className="w-24 h-24 rounded-2xl para-hat" 
              />
            </div>

            <h2 className="text-3xl font-medium text-navy animate-in slide-in-from-top-2 duration-300">
              G’day, I’m PARA
            </h2>
            <p className="mt-2 text-slate-600">your supportive guide for ParasitePro</p>
            
            <p className="mt-6 text-slate-600 leading-relaxed animate-in fade-in duration-500">
              {currentMessage}
            </p>

            <div className="mt-10 flex gap-4">
              <button 
                onClick={closeModal}
                className="flex-1 py-4 border border-slate-300 rounded-2xl font-medium text-slate-700 
                           hover:bg-slate-50 transition-all active:scale-95"
              >
                Skip
              </button>
              <button 
                onClick={() => speak(currentMessage)}
                disabled={isSpeaking}
                className={`flex-1 py-4 rounded-2xl font-medium flex items-center justify-center gap-2 
                           transition-all active:scale-95 ${isSpeaking 
                           ? 'bg-teal-400 cursor-wait' 
                           : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
              >
                <i className={`fas fa-volume-up ${isSpeaking ? 'animate-pulse' : ''}`}></i> 
                {isSpeaking ? 'Speaking...' : 'Tap to hear PARA'}
              </button>
            </div>

            <button 
              onClick={() => {
                closeModal();
                if (onStartAnalysis) onStartAnalysis();
              }}
              className="mt-6 w-full py-5 bg-teal-600 text-white rounded-3xl text-xl font-semibold 
                         hover:bg-teal-700 active:scale-[0.985] transition-all"
            >
              Start Free Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Inline / Hero version with hover animation
  return (
    <button 
      onClick={openModal}
      className="flex items-center gap-3 group hover:scale-105 active:scale-95 transition-all duration-200"
    >
      <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center overflow-hidden 
                      group-hover:rotate-6 transition-transform duration-300">
        <img 
          src="https://via.placeholder.com/48x48/00BFA5/ffffff?text=PARA" 
          alt="PARA" 
          className="w-10 h-10 rounded-xl para-hat" 
        />
      </div>
      <div className="text-left">
        <p className="font-medium text-navy group-hover:text-teal transition-colors">Meet PARA</p>
        <p className="text-sm text-slate-500">Your supportive guide</p>
      </div>
    </button>
  );
};

export default ParaGuide;
