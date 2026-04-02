// src/components/AnalysingScreen.tsx
import React from 'react';
import ParaGuide from './ParaGuide';

const AnalysingScreen: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 18 + 8;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 600);
          return 100;
        }
        return Math.min(next, 100);
      });
    }, 180);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mx-auto w-28 h-28 bg-teal-100 rounded-3xl flex items-center justify-center mb-8 animate-[float_3s_ease-in-out_infinite]">
          <img 
            src="https://via.placeholder.com/120x120/00BFA5/ffffff?text=PARA" 
            alt="PARA" 
            className="w-24 h-24 rounded-2xl" 
          />
        </div>

        <h2 className="text-3xl font-medium text-navy mb-2">Analysing your sample...</h2>
        <p className="text-slate-600 mb-10">PARA is carefully examining the details</p>

        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-teal-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-slate-500 font-medium">
          {Math.round(progress)}% complete
        </p>
      </div>
    </div>
  );
};

export default AnalysingScreen;
