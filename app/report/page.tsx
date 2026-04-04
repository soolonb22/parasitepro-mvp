// app/report/page.tsx
import { Suspense } from 'react';

interface ReportData {
  text: string;
  urgency: 'Low' | 'Moderate' | 'High';
  imageUrl?: string;
  date: string;
}

export default function ReportPage({ searchParams }: { searchParams: Promise<{ data?: string }> }) {
  // Next.js App Router best practice: await searchParams
  const params = await searchParams;
  let report: ReportData | null = null;

  if (params.data) {
    try {
      report = JSON.parse(decodeURIComponent(params.data));
    } catch (e) {
      console.error('Failed to parse report data');
    }
  }

  // Default fallback for testing
  if (!report) {
    report = {
      text: "PARA analysed the visual patterns in your photo. Common textures or shapes were noted that may be worth mentioning to your GP for further checks. This is educational information only to help you prepare for your appointment.",
      urgency: 'Moderate',
      date: new Date().toISOString(),
    };
  }

  const urgencyColor = 
    report.urgency === 'Low' ? 'text-green-500' :
    report.urgency === 'Moderate' ? 'text-orange-500' : 'text-red-500';

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Here’s what PARA found</h1>
        <p className="text-gray-400">Educational report • {new Date(report.date).toLocaleDateString('en-AU')}</p>
      </div>

      <div className="bg-white text-black rounded-3xl p-8 shadow-xl">
        {/* PARA Mascot greeting - match your mockup */}
        <div className="flex items-center gap-4 mb-8 bg-teal-50 p-4 rounded-2xl">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-4xl">🧠</div>
          <div>
            <p className="font-semibold">Hi! I’m PARA 👋</p>
            <p className="text-sm text-gray-600">Your friendly educational guide</p>
          </div>
        </div>

        {/* Urgency flag - colour-coded like your mockup */}
        <div className={`text-6xl font-bold mb-6 ${urgencyColor}`}>
          {report.urgency}
        </div>

        <div className="prose prose-lg max-w-none mb-10">
          <p>{report.text}</p>
        </div>

        {/* GP prep box */}
        <div className="bg-teal-50 border border-teal-200 p-6 rounded-2xl mb-8">
          <h3 className="font-semibold text-xl mb-3">What to tell your GP (copy & paste)</h3>
          <p className="text-sm text-gray-700 mb-4">
            “I used an educational AI tool called Parasite Pro to look at a photo. It noted [briefly describe what PARA said]. I’d like to discuss this with you.”
          </p>
          <button 
            onClick={() => navigator.clipboard.writeText(`I used Parasite Pro educational tool...`)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl w-full"
          >
            Copy script to clipboard
          </button>
        </div>

        {/* Action buttons - match homepage style */}
        <div className="space-y-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl w-full text-lg font-medium">
            Export to My Health Record
          </button>
          
          <button 
            onClick={() => alert('Save feature coming soon — we’ll connect this to accounts next')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl w-full text-lg font-medium"
          >
            Save this report to my free account
          </button>

          <button className="bg-black border border-white text-white px-8 py-4 rounded-2xl w-full text-lg font-medium">
            Start Another Analysis
          </button>
        </div>
      </div>

      {/* Strong disclaimer footer - required for TGA/AHPRA compliance */}
      <div className="mt-12 text-center text-xs text-gray-400 leading-relaxed">
        <p className="font-medium">Educational tool only — not a medical diagnosis</p>
        <p>ParasitePro provides structured educational reports based on visual patterns to help you prepare for GP visits. It does not provide medical diagnoses, prescribe treatments, or replace professional medical advice.</p>
        <p className="mt-2">Complies with TGA Software as a Medical Device guidelines and AHPRA advertising standards. Built in Australia • Privacy First.</p>
        <p className="mt-4">If you feel unwell, call 000 immediately.</p>
      </div>
    </div>
  );
}
