// src/pages/DashboardPage.tsx
import React from 'react';
import ParaGuide from '../components/ParaGuide';

const DashboardPage: React.FC = () => {
  const recentAnalyses = [
    { id: 1, type: "Human - Stool", date: "2 days ago", result: "Moderate" },
    { id: 2, type: "Pet - Cat", date: "1 week ago", result: "Low" },
    { id: 3, type: "Human - Skin", date: "3 weeks ago", result: "Low" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-semibold text-navy">Welcome back</h1>
          <p className="text-slate-600 mt-2">Here's what PARA found in your recent analyses</p>
        </div>
        <ParaGuide variant="inline" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Credits Card */}
        <div className="bg-white rounded-3xl p-8 border border-teal-200">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-slate-500">Remaining Credits</p>
              <p className="text-6xl font-bold text-teal-600 mt-2">12</p>
            </div>
            <div className="text-6xl">🪙</div>
          </div>
          <button className="mt-8 w-full py-4 bg-teal-600 text-white rounded-2xl font-medium">
            Buy More Credits
          </button>
        </div>

        {/* Recent Analyses */}
        <div className="md:col-span-2 bg-white rounded-3xl p-8">
          <h3 className="font-semibold text-navy mb-6">Recent Analyses</h3>
          
          <div className="space-y-6">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between border-b pb-6 last:border-none last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">
                    📸
                  </div>
                  <div>
                    <p className="font-medium">{analysis.type}</p>
                    <p className="text-sm text-slate-500">{analysis.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium
                    ${analysis.result === 'Low' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                    {analysis.result}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-10 w-full py-5 border-2 border-navy text-navy rounded-3xl font-medium hover:bg-navy hover:text-white transition">
            View All Analyses
          </button>
        </div>
      </div>

      {/* Quick New Analysis */}
      <div className="mt-16 bg-white rounded-3xl p-10 text-center">
        <ParaGuide variant="inline" message="Ready for another check?" />
        <button className="mt-8 bg-teal-600 text-white px-16 py-6 rounded-3xl text-xl font-semibold hover:bg-teal-700 transition">
          Start New Analysis
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
