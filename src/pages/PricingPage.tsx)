// src/pages/PricingPage.tsx
import React from 'react';
import ParaGuide from '../components/ParaGuide';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: "Free / Guest",
      credits: "1 Analysis",
      price: "Free",
      features: ["One basic analysis", "Email results", "Basic report"],
      buttonText: "Start Free",
      popular: false,
    },
    {
      name: "BETA3FREE",
      credits: "3 Credits",
      price: "Free (limited time)",
      features: ["3 full analyses", "GP-ready PDF export", "My Health Record ready"],
      buttonText: "Claim BETA3FREE",
      popular: true,
    },
    {
      name: "Subscription Lite",
      credits: "Unlimited Basic",
      price: "$20 / month",
      features: ["Unlimited basic scans", "My Health Record sync", "Priority support", "Save 20% annually"],
      buttonText: "Choose Lite",
      popular: false,
    },
    {
      name: "Premium",
      credits: "Full Access",
      price: "$70 / year",
      features: ["Everything in Lite", "Detailed differentials", "Trend tracking", "Telehealth export", "Gut Health insights"],
      buttonText: "Go Premium",
      popular: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-semibold text-navy">Simple Credit System</h1>
        <p className="mt-4 text-2xl text-slate-600">Start free. Scale when you need more.</p>
        <p className="mt-2 text-slate-500">No subscription required for basic use</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`bg-white rounded-3xl p-8 border ${plan.popular ? 'border-teal-500 shadow-xl scale-105' : 'border-slate-200'} 
                        hover:shadow-2xl transition-all duration-300`}
          >
            {plan.popular && (
              <div className="bg-teal-600 text-white text-xs font-medium px-4 py-1 rounded-full inline-block mb-6">
                Most Popular
              </div>
            )}

            <h3 className="text-2xl font-semibold text-navy">{plan.name}</h3>
            <div className="mt-6">
              <span className="text-5xl font-bold text-navy">{plan.price}</span>
            </div>
            <p className="text-teal-600 font-medium mt-1">{plan.credits}</p>

            <ul className="mt-8 space-y-4">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600">
                  <span className="text-teal-600 mt-1">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`mt-10 w-full py-5 rounded-3xl font-semibold transition-all
              ${plan.popular 
                ? 'bg-teal-600 text-white hover:bg-teal-700' 
                : 'bg-slate-100 text-navy hover:bg-slate-200'}`}>
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <ParaGuide 
          variant="inline" 
          message="Credits never expire. You only pay for what you need." 
        />
      </div>

      <p className="text-center text-xs text-slate-500 mt-12">
        All analyses are for educational purposes only. Consult a healthcare professional for medical advice.
      </p>
    </div>
  );
};

export default PricingPage;
