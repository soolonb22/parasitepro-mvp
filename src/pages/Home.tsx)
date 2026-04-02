// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ParaGuide from '../components/ParaGuide';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl leading-tight font-semibold text-navy">
              Found something concerning in your stool?<br />
              <span className="text-teal-600">Get fast AI-powered analysis in 60 seconds</span> — no lab visit required.
            </h1>
            
            <p className="mt-6 text-xl text-slate-600">
              Your supportive guide PARA is ready to help you understand what you're seeing.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/upload')}
                className="bg-teal-600 text-white px-10 py-5 rounded-3xl text-xl font-medium flex items-center gap-3 hover:bg-teal-700 transition-all active:scale-95"
              >
                <i className="fas fa-camera"></i>
                Upload Photo for Analysis
              </button>

              <button 
                onClick={() => alert('Export modal would open here')}
                className="border-2 border-navy text-navy px-8 py-5 rounded-3xl text-xl font-medium flex items-center gap-3 hover:bg-navy hover:text-white transition-all"
              >
                <i className="fas fa-file-export"></i>
                Export to My Health Record
              </button>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <i className="fas fa-lock text-teal-600"></i> Privacy First
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-teal-600"></i> Built in Australia
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-graduation-cap text-teal-600"></i> Educational Tool Only
              </div>
            </div>
          </div>

          {/* PARA Hero Visual */}
          <div className="flex justify-center">
            <div className="relative w-96">
              <img 
                src="https://via.placeholder.com/420x480/00BFA5/ffffff?text=PARA" 
                alt="PARA" 
                className="w-full rounded-3xl shadow-2xl para-hat" 
              />
              <div className="absolute -bottom-6 left-10 bg-white px-6 py-4 rounded-3xl shadow-xl flex items-center gap-3">
                <span className="text-3xl">👋</span>
                <div>
                  <p className="font-medium text-navy">G'day, I'm PARA</p>
                  <p className="text-sm text-slate-500">Your supportive guide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white py-6 border-y">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-teal-600">🇦🇺</span> Built in Australia for Australian conditions
          </div>
          <div className="flex items-center gap-2">
            🔒 Secure Australian servers
          </div>
          <div className="flex items-center gap-2">
            📋 Educational tool only – not a medical diagnosis
          </div>
        </div>
      </div>

      {/* Quick PARA */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <ParaGuide variant="hero" onStartAnalysis={() => navigate('/upload')} />
      </div>
    </div>
  );
};

export default Home;
