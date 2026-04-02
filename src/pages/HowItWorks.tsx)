// src/pages/HowItWorks.tsx
import React from 'react';
import ParaGuide from '../components/ParaGuide';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Upload Your Photo",
      description: "Take a clear, well-lit photo of the sample using your phone. Human or Pet mode available.",
      icon: "📸"
    },
    {
      number: "02",
      title: "PARA Analyzes",
      description: "Our AI examines the image with advanced visual detection. PARA guides you through the process.",
      icon: "🔍"
    },
    {
      number: "03",
      title: "Get Your Report",
      description: "Receive a clear, GP-ready report with highlighted findings, confidence score, and next steps.",
      icon: "📋"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-semibold text-navy">How It Works</h1>
        <p className="mt-4 text-xl text-slate-600">Three simple steps with PARA by your side</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-white rounded-3xl p-10 border border-slate-100 hover:border-teal-200 transition-all">
            <div className="text-6xl mb-6">{step.icon}</div>
            <div className="text-teal-600 font-mono text-sm mb-2">{step.number}</div>
            <h3 className="text-2xl font-semibold text-navy mb-4">{step.title}</h3>
            <p className="text-slate-600 leading-relaxed">{step.description}</p>
            
            {index === 1 && (
              <div className="mt-8">
                <ParaGuide variant="inline" message="I'm here to make sure you feel confident every step of the way." />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-20 bg-slate-100 rounded-3xl p-12 text-center">
        <ParaGuide 
          variant="report" 
          message="Ready to give it a try? I'm here to guide you through your first analysis." 
        />
        <button 
          onClick={() => window.location.href = '/upload'}
          className="mt-8 bg-teal-600 text-white px-12 py-5 rounded-3xl text-xl font-medium hover:bg-teal-700 transition"
        >
          Start Your First Analysis
        </button>
      </div>
    </div>
  );
};

export default HowItWorks;
