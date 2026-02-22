import React from 'react';
import { X, Microscope, Upload, CreditCard, ShieldCheck } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  firstName?: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, firstName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-lg w-full shadow-2xl">
        {/* Header */}
        <div className="relative p-6 pb-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close welcome screen"
          >
            <X size={20} className="text-gray-400" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Microscope size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Welcome{firstName ? `, ${firstName}` : ''}! 👋
              </h2>
              <p className="text-blue-400 text-sm font-medium">ParasitePro — AI Parasite Detection</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6">
          <div className="bg-gray-700 rounded-xl p-4 mb-6">
            <p className="text-gray-200 text-sm leading-relaxed">
              Upload a photo of a suspected parasite. Our AI will analyse it and provide 
              identification, treatment information, and myth-busting insights — 
              <span className="text-blue-400 font-medium"> for just 1 credit per image</span>.
            </p>
          </div>

          {/* How it works steps */}
          <h3 className="text-white font-semibold mb-4">How it works</h3>
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <div className="flex items-center gap-2">
                  <Upload size={16} className="text-blue-400" />
                  <span className="text-white font-medium text-sm">Upload your image</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">Take a photo or upload from your gallery. Stool, blood, or skin samples accepted.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <div className="flex items-center gap-2">
                  <Microscope size={16} className="text-blue-400" />
                  <span className="text-white font-medium text-sm">AI analyses in seconds</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">Our AI detects parasite species, life stage, and urgency level with confidence scoring.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-blue-400" />
                  <span className="text-white font-medium text-sm">1 credit per analysis</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">Each image analysis costs 1 credit (~AUD $7.50). Much more affordable than a GP visit.</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 bg-yellow-900 border border-yellow-700 rounded-lg p-3 mb-6">
            <ShieldCheck size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-200 text-xs">
              <strong>Medical Disclaimer:</strong> This tool is for informational purposes only and is not a substitute for professional medical diagnosis. Always consult a qualified healthcare professional.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            Get Started →
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;