// src/pages/UploadPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnalysingScreen from '../components/AnalysingScreen';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'human' | 'pet'>('human');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const startAnalysis = () => {
    if (!selectedFile) return;
    setIsAnalysing(true);
  };

  const handleAnalysisComplete = () => {
    setIsAnalysing(false);
    navigate('/report');   // Change this to your actual report route
  };

  if (isAnalysing) {
    return <AnalysingScreen onComplete={handleAnalysisComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-navy">Upload Your Sample</h1>
          <p className="mt-3 text-slate-600">Choose whether this is for you or your pet</p>
        </div>

        {/* Human / Pet Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-100 rounded-3xl p-1.5">
            <button
              onClick={() => setMode('human')}
              className={`px-10 py-3.5 rounded-3xl font-medium transition-all ${
                mode === 'human' 
                  ? 'bg-white shadow text-navy' 
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              Human
            </button>
            <button
              onClick={() => setMode('pet')}
              className={`px-10 py-3.5 rounded-3xl font-medium transition-all ${
                mode === 'pet' 
                  ? 'bg-white shadow text-navy' 
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              Pet (Dogs, Cats, etc.)
            </button>
          </div>
        </div>

        {/* Upload Zone */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
          className={`border-4 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all
            ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-300 hover:border-teal-400'}`}
        >
          <div className="mx-auto w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
            <i className="fas fa-cloud-upload-alt text-4xl text-teal-600"></i>
          </div>
          
          <p className="text-xl font-medium text-navy">
            {selectedFile ? selectedFile.name : "Drop your photo here or click to upload"}
          </p>
          <p className="text-slate-500 mt-2">Well-lit, close-up photos give the best results</p>

          <input 
            id="fileInput"
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileSelect}
          />
        </div>

        {/* PARA Guidance */}
        <div className="mt-8 flex justify-center">
          <p className="text-sm text-center" style={{color:"var(--text-muted)"}}>💡 For best results, make sure the area is well-lit and in focus.</p>
        </div>

        {/* Start Analysis Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={startAnalysis}
            disabled={!selectedFile}
            className={`px-16 py-6 rounded-3xl text-xl font-semibold flex items-center gap-4 transition-all
              ${selectedFile 
                ? 'bg-teal-600 text-white hover:bg-teal-700' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            <i className="fas fa-magic"></i>
            Analyse with PARA
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          This is an educational tool only. Not a medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default UploadPage;
