import React from 'react';
import { BookOpen, X, TrendingUp, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JournalPromptModalProps {
  isOpen: boolean;
  analysisId: string;
  parasiteName?: string;
  onClose: () => void;
}

const JournalPromptModal: React.FC<JournalPromptModalProps> = ({ isOpen, analysisId, parasiteName, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  const handleStartJournal = () => { onClose(); navigate(`/journal?analysisId=${analysisId}`); };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between p-5 pb-4 border-b border-gray-700">
          <div className="flex items-center gap-3"><div className="p-2 bg-purple-600 rounded-lg"><BookOpen size={20} className="text-white" /></div><h2 className="text-lg font-bold text-white">Want to keep an eye on things?</h2></div>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-lg transition-colors" aria-label="Close"><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-gray-300 text-sm">{parasiteName ? `Want to track how you're feeling over the next few days? A symptom journal is a great way to spot patterns with ${parasiteName} - and it gives your GP more to work with.` : "Want to track how you're feeling over the next few days? A symptom journal is a great way to spot patterns - and it gives your GP more to work with. Takes 30 seconds."}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-3"><TrendingUp size={16} className="text-purple-400 flex-shrink-0" /><p className="text-gray-300 text-sm">Log how you are feeling daily - spot patterns your GP will find useful</p></div>
            <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-3"><FileText size={16} className="text-purple-400 flex-shrink-0" /><p className="text-gray-300 text-sm">Add notes, upload follow-up images, and watch your progress over time</p></div>
            <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-3"><Download size={16} className="text-purple-400 flex-shrink-0" /><p className="text-gray-300 text-sm">Export a clean report before your next GP visit - they'll thank you for it</p></div>
          </div>
          <p className="text-gray-500 text-xs text-center">Completely free - Your data stays private - Stop anytime</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded-xl text-sm font-medium transition-colors">Maybe later</button>
            <button onClick={handleStartJournal} className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm transition-colors">Yes - let's track this</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPromptModal;