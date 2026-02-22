import React from 'react';
import { CreditCard, AlertCircle, X } from 'lucide-react';

interface PricingConfirmModalProps {
  isOpen: boolean;
  imagePreview: string;
  creditBalance: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const PricingConfirmModal: React.FC<PricingConfirmModalProps> = ({ isOpen, imagePreview, creditBalance, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  const remainingAfter = creditBalance - 1;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between p-5 pb-0">
          <div className="flex items-center gap-2"><CreditCard size={20} className="text-blue-400" /><h2 className="text-lg font-bold text-white">Confirm Analysis</h2></div>
          <button onClick={onCancel} className="p-1 hover:bg-gray-700 rounded-lg transition-colors" aria-label="Cancel"><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          {imagePreview && (<img src={imagePreview} alt="Image to analyse" className="w-full h-40 object-cover rounded-xl bg-gray-900" />)}
          <div className="bg-blue-900 border border-blue-700 rounded-xl p-4">
            <p className="text-blue-100 text-sm text-center font-medium mb-1">This image will be analysed for</p>
            <p className="text-white text-3xl font-bold text-center">1 credit</p>
            <p className="text-blue-300 text-xs text-center mt-1">(~USD $4.99 / AUD $7.50)</p>
          </div>
          <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3"><span className="text-gray-400 text-sm">Current balance</span><span className="text-white font-semibold">{creditBalance} credits</span></div>
          {remainingAfter >= 0 && (<div className="flex items-center justify-between bg-gray-700 rounded-lg p-3 -mt-2"><span className="text-gray-400 text-sm">After analysis</span><span className={`font-semibold ${remainingAfter === 0 ? 'text-orange-400' : 'text-green-400'}`}>{remainingAfter} credits</span></div>)}
          {remainingAfter === 0 && (<div className="flex items-start gap-2 bg-orange-900 border border-orange-700 rounded-lg p-3"><AlertCircle size={16} className="text-orange-400 mt-0.5 flex-shrink-0" /><p className="text-orange-200 text-xs">This will use your last credit. You can purchase more anytime from the pricing page.</p></div>)}
          <div className="flex gap-3 pt-1">
            <button onClick={onCancel} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl font-medium transition-colors">Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">Analyse →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingConfirmModal;