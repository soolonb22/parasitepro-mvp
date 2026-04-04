// src/pages/Report.tsx
import React from 'react';
import ParaGuide from '../components/ParaGuide';

const Report: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-navy">Parasite Analysis Report</h1>
            <p className="text-slate-500 mt-1">Educational AI Analysis • Not a medical diagnosis</p>
          </div>
          <ParaGuide variant="report" />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Photo with animated green highlights */}
          <div className="relative bg-slate-100 rounded-3xl p-8 overflow-hidden">
            <img 
              src="https://picsum.photos/id/1015/800/600" 
              alt="Sample" 
              className="rounded-2xl w-full" 
            />
            {/* Green AI highlights with animation */}
            <div className="absolute top-24 left-20 w-20 h-20 border-4 border-emerald-400 rounded-full animate-[ping_2s_ease-in-out_infinite]"></div>
            <div className="absolute top-40 right-32 w-16 h-16 border-4 border-emerald-400 rounded-full animate-[ping_2.3s_ease-in-out_infinite_300ms]"></div>
            <div className="absolute bottom-32 left-1/3 w-14 h-14 border-4 border-emerald-400 rounded-full animate-[ping_2.7s_ease-in-out_infinite_600ms]"></div>
          </div>

          {/* Report Details */}
          <div className="space-y-8">
            <div className="flex gap-8">
              <div>
                <p className="text-sm text-slate-500">Urgency Level</p>
                <p className="text-4xl font-bold text-orange-500">Moderate</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">AI Confidence</p>
                <p className="text-4xl font-bold text-emerald-500">92%</p>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">PARA’s note</p>
              <p className="text-slate-600">
                This moderate result suggests a possible parasite. Here’s what it means and when you should see your GP.
              </p>
            </div>

            <div className="pt-6 border-t">
              <button className="w-full py-4 bg-navy text-white rounded-2xl font-medium">
                Download PDF for My Health Record
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
