import React, { useState } from 'react';
import { Gift, Copy, CheckCircle, Share2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReferralSectionProps {
  userId: string;
  referralCode?: string;
  referralCount?: number;
  creditsEarned?: number;
}

const ReferralSection: React.FC<ReferralSectionProps> = ({
  userId,
  referralCode,
  referralCount = 0,
  creditsEarned = 0,
}) => {
  const [copied, setCopied] = useState(false);

  const code = referralCode || `PARA-${userId.slice(0, 6).toUpperCase()}`;
  const referralLink = `https://parasitepro.com/signup?ref=${code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ParasitePro — AI Parasite Detection',
          text: 'Check out ParasitePro — AI-powered parasite identification from your phone. Much cheaper than a GP visit!',
          url: referralLink,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-600 rounded-lg">
          <Gift size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold">Referral Programme</h3>
          <p className="text-gray-400 text-xs">Invite a friend — you both get 1 free credit</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users size={16} className="text-blue-400" />
            <span className="text-2xl font-bold text-white">{referralCount}</span>
          </div>
          <p className="text-gray-400 text-xs">Friends referred</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Gift size={16} className="text-yellow-400" />
            <span className="text-2xl font-bold text-white">{creditsEarned}</span>
          </div>
          <p className="text-gray-400 text-xs">Credits earned</p>
        </div>
      </div>
      <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-3 mb-4">
        <p className="text-yellow-200 text-xs">
          <strong>How it works:</strong> Share your referral link. When a friend signs up and purchases their first credit, you both receive <strong>1 free analysis credit</strong> automatically.
        </p>
      </div>
      <div className="mb-3">
        <label className="block text-gray-400 text-xs mb-1.5">Your referral link</label>
        <div className="flex gap-2">
          <input type="text" value={referralLink} readOnly className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 text-sm font-mono truncate focus:outline-none" />
          <button onClick={handleCopy} className={`px-3 py-2 rounded-lg transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`} title="Copy link">
            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3 mb-4">
        <div>
          <p className="text-gray-400 text-xs">Your referral code</p>
          <p className="text-white font-bold font-mono tracking-wider">{code}</p>
        </div>
        <button onClick={handleCopy} className="text-blue-400 hover:text-blue-300 text-xs transition-colors">Copy link</button>
      </div>
      <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-semibold transition-colors">
        <Share2 size={18} />
        Share with Friends
      </button>
    </div>
  );
};

export default ReferralSection;