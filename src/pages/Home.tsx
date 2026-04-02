// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ParaGuide from '../components/ParaGuide';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-600"></span>
              </span>
              AI-Powered • Australian Built
            </div>

            <h1 className="text-5xl lg:text-6xl leading-tight font-semibold text-navy tracking-tight">
              Found something concerning in your stool?
            </h1>

            <p className="text-2xl text-slate-700">
              Get fast AI-powered analysis in 60 seconds — no lab visit required.
            </p>

            <p className="text-lg text-slate-600 max-w-lg">
              Your supportive guide PARA is here to help you understand what you're seeing with clarity and care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={() => navigate('/upload')}
                className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-5 rounded-3xl text-lg font-medium flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                <i className="fas fa-camera"></i>
                Upload Photo for Analysis
              </button>

              <button 
                onClick={() => alert('Export to My Health Record modal would open here')}
                className="border-2 border-navy hover:bg-navy hover:text-white text-navy px-8 py-5 rounded-3xl text-lg font-medium flex items-center justify-center gap-3 transition-all"
              >
                <i className="fas fa-file-export"></i>
                Export to My Health Record
              </button>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <i className="fas fa-lock text-teal-600"></i>
                Privacy First
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🇦🇺</span>
                Built in Australia
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-shield-alt text-teal-600"></i>
                Educational Tool Only
              </div>
            </div>
          </div>

          {/* Right Side - PARA Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative max-w-xs lg:max-w-md">
              <div className="bg-white rounded-3xl shadow-2xl p-6">
                <img 
                  src="https://via.placeholder.com/420x480/00BFA5/ffffff?text=PARA" 
                  alt="PARA" 
                  className="w-full rounded-2xl para-hat" 
                />
              </div>
              
              {/* Speech bubble */}
              <div className="absolute -bottom-6 -left-4 bg-white px-6 py-4 rounded-3xl shadow-xl max-w-[220px]">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👋</span>
                  <div>
                    <p className="font-medium text-navy">G'day, I'm PARA</p>
                    <p className="text-sm text-slate-500">Your supportive guide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Trust Bar */}
      <div className="bg-white py-6 border-t border-b">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-slate-500">
          <div>🔒 Secure Australian servers</div>
          <div>📋 Not a medical diagnosis — educational only</div>
          <div>🇦🇺 Designed for Australian conditions</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
