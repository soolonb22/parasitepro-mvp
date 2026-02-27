import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Zap, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentAPI } from '../api';
import { useAuthStore } from '../store/authStore';

interface PricingTier {
  credits: number;
  price: number;
  label: string;
  popular?: boolean;
}

const PricingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<number | null>(null);

  useEffect(() => {
    paymentAPI.getPricing()
      .then((data) => {
        setPricing(data.tiers || [
          { credits: 1, price: 4.99, label: '1 Analysis' },
          { credits: 5, price: 19.99, label: '5 Analyses', popular: true },
          { credits: 10, price: 34.99, label: '10 Analyses' },
        ]);
      })
      .catch(() => {
        setPricing([
          { credits: 1, price: 4.99, label: '1 Analysis' },
          { credits: 5, price: 19.99, label: '5 Analyses', popular: true },
          { credits: 10, price: 34.99, label: '10 Analyses' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePurchase = async (credits: number) => {
    setPurchasing(credits);
    try {
      await paymentAPI.createIntent(credits);
      toast.success('Redirecting to checkout...');
      // Stripe checkout would be initialized here with the clientSecret
      toast('Stripe checkout integration required', { icon: 'ℹ️' });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to start checkout');
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Analysis Credits</h1>
          <p className="text-gray-500">
            Current balance: <span className="font-semibold text-blue-600">{user?.imageCredits ?? 0} credits</span>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((tier) => (
              <div
                key={tier.credits}
                className={`relative bg-white rounded-xl shadow p-6 flex flex-col items-center ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Most Popular
                  </span>
                )}
                <Zap size={32} className="text-blue-500 mb-3" />
                <div className="text-lg font-bold text-gray-800 mb-1">{tier.label}</div>
                <div className="text-3xl font-bold text-gray-900 mb-4">${tier.price.toFixed(2)}</div>
                <ul className="text-sm text-gray-500 space-y-1 mb-6 w-full">
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> {tier.credits} analysis credit{tier.credits > 1 ? 's' : ''}</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> AI parasite detection</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Detailed results report</li>
                </ul>
                <button
                  onClick={() => handlePurchase(tier.credits)}
                  disabled={purchasing === tier.credits}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
                >
                  <CreditCard size={16} />
                  {purchasing === tier.credits ? 'Processing...' : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          Payments are processed securely via Stripe. Credits never expire.
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
