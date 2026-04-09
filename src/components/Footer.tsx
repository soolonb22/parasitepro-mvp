// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12 mt-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10 text-sm text-gray-400">
          <a href="/tips" className="hover:text-white transition">Free Education Tips</a>
          <a href="/refer" className="hover:text-white transition">Refer a Mate</a>
          <a href="/subscribe" className="hover:text-white transition">Educational Subscription</a>
          <a href="/privacy" className="hover:text-white transition">Privacy & Photo Policy</a>
        </div>

        <div className="text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed">
          ⚠️ Educational tool only. ParasitePro provides structured educational reports to help you prepare for GP visits. 
          It does not provide medical diagnoses, prescribe treatments, or replace professional medical advice. 
          Complies with TGA Software as a Medical Device guidelines and AHPRA advertising standards. 
          In an emergency, call 000 immediately.
        </div>

        <p className="text-xs text-gray-600 mt-8">
          © 2026 Parasite Pro • Made in Mackay, QLD • For Australian families, travellers & pet owners
        </p>
      </div>
    </footer>
  );
}
