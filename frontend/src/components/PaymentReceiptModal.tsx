import React from 'react';
import { CheckCircle, X, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  transactionId: string;
  creditsAdded: number;
  newBalance: number;
  amountPaid: number;
  onClose: () => void;
}

const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({ isOpen, transactionId, creditsAdded, newBalance, amountPaid, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  const amountUSD = (amountPaid / 100).toFixed(2);
  const amountAUD = ((amountPaid / 100) * 1.55).toFixed(2);
  const receiptDate = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const handleDownloadReceipt = () => {
    const receiptContent = `ParasitePro — Payment Receipt\n==============================\nDate:         ${receiptDate}\nTransaction:  ${transactionId}\nCredits:      ${creditsAdded} analysis credit${creditsAdded > 1 ? 's' : ''}\nAmount (USD): $${amountUSD}\nAmount (AUD): ~$${amountAUD}\nNew Balance:  ${newBalance} credits\n==============================\nThank you for your purchase!\nFor support: support@parasitepro.com`.trim();
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ParasitePro-Receipt-${transactionId.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 className="text-lg font-bold text-white">Payment Successful</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-lg transition-colors" aria-label="Close"><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex flex-col items-center py-4">
            <CheckCircle size={56} className="text-green-400 mb-3" />
            <p className="text-white text-xl font-bold">Payment Complete!</p>
            <p className="text-gray-400 text-sm mt-1">{creditsAdded} credit{creditsAdded > 1 ? 's' : ''} added to your account</p>
          </div>
          <div className="bg-gray-700 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-gray-400">Transaction ID</span><span className="text-white font-mono text-xs">{transactionId.slice(0, 16)}...</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Date</span><span className="text-white">{receiptDate}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Credits purchased</span><span className="text-white font-semibold">{creditsAdded}</span></div>
            <div className="flex justify-between text-sm border-t border-gray-600 pt-3"><span className="text-gray-400">Amount charged</span><div className="text-right"><div className="text-white font-semibold">USD ${amountUSD}</div><div className="text-gray-500 text-xs">~AUD ${amountAUD}</div></div></div>
            <div className="flex justify-between text-sm border-t border-gray-600 pt-3"><span className="text-gray-400">New credit balance</span><span className="text-green-400 font-bold">{newBalance} credits</span></div>
          </div>
          <button onClick={handleDownloadReceipt} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm font-medium transition-colors"><Download size={16} />Download Receipt</button>
          <button onClick={() => { onClose(); navigate('/upload'); }} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"><Upload size={18} />Start First Analysis</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptModal;