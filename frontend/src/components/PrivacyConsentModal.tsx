import React, { useState } from 'react';
import { Shield, Lock, Trash2 } from 'lucide-react';

interface PrivacyConsentModalProps {
  isOpen: boolean;
  onAccept: (consents: { aiImprovement: boolean; research: boolean }) => void;
  onDecline: () => void;
}

const PrivacyConsentModal: React.FC<PrivacyConsentModalProps> = ({ isOpen, onAccept, onDecline }) => {
  const [aiImprovement, setAiImprovement] = useState(false);
  const [research, setResearch] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6 pb-4 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-600 rounded-lg"><Lock size={20} className="text-white" /></div>
            <h2 className="text-xl font-bold text-white">Privacy Notice</h2>
          </div>
          <p className="text-gray-300 text-sm">Before you upload, please review how we handle your data.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3"><Shield size={16} className="text-green-400 mt-0.5 flex-shrink-0" /><p className="text-gray-300 text-sm">Your images are <strong className="text-white">encrypted in transit (TLS)</strong> and at rest. They are stored securely on Cloudinary.</p></div>
            <div className="flex items-start gap-3"><Shield size={16} className="text-green-400 mt-0.5 flex-shrink-0" /><p className="text-gray-300 text-sm">Your images are <strong className="text-white">never shared</strong> with third parties without your explicit consent.</p></div>
            <div className="flex items-start gap-3"><Trash2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" /><p className="text-gray-300 text-sm">You can <strong className="text-white">delete your images and data</strong> at any time from your account settings.</p></div>
          </div>
          <div className="border-t border-gray-700 pt-4 space-y-3">
            <p className="text-white text-sm font-semibold">Optional permissions</p>
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-0.5"><input type="checkbox" checked={aiImprovement} onChange={(e) => setAiImprovement(e.target.checked)} className="w-4 h-4 accent-blue-500" /></div>
              <div><p className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors">Help improve the AI</p><p className="text-gray-400 text-xs mt-0.5">Allow my anonymised images to be used to improve the AI model. Images are stripped of all personal data before use.</p></div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-0.5"><input type="checkbox" checked={research} onChange={(e) => setResearch(e.target.checked)} className="w-4 h-4 accent-blue-500" /></div>
              <div><p className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors">Contribute to research</p><p className="text-gray-400 text-xs mt-0.5">Share anonymised data with university researchers studying parasitic infections in Australia.</p></div>
            </label>
          </div>
          <p className="text-gray-500 text-xs">By continuing you agree to our <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a> and <a href="/terms" className="text-blue-400 hover:underline">Terms of Service</a>, which comply with the Australian Privacy Principles.</p>
          <div className="flex gap-3 pt-2">
            <button onClick={onDecline} className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm font-medium transition-colors">Cancel</button>
            <button onClick={() => onAccept({ aiImprovement, research })} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors">I Understand — Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyConsentModal;