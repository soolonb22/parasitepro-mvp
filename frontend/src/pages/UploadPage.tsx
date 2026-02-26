import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Camera, FileImage, AlertCircle, Loader, X,
  Calendar, MapPin, Sun, Focus, Ruler,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import PrivacyConsentModal from '../components/PrivacyConsentModal';
import PricingConfirmModal from '../components/PricingConfirmModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PRIVACY_CONSENT_KEY = 'parasite_privacy_accepted';

const CAPTURE_TIPS = [
  {
    icon: Sun,
    title: 'Use good lighting',
    detail: 'Natural daylight or a bright torch gives the clearest images.',
  },
  {
    icon: Focus,
    title: 'Focus on the parasite',
    detail: 'Tap to focus on the specimen. Keep your hand steady.',
  },
  {
    icon: Ruler,
    title: 'Include a scale if possible',
    detail: 'Place a ruler or coin next to the sample for size reference.',
  },
];

const UploadPage = () => {
  const navigate = useNavigate();
  const { user, accessToken, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Metadata
  const [sampleType, setSampleType] = useState<string>('');
  const [collectionDate, setCollectionDate] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [showMetadata, setShowMetadata] = useState(false);

  // Modal states
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const [showPricingConfirm, setShowPricingConfirm] = useState(false);
  const [pendingUpload, setPendingUpload] = useState(false);

  const hasCredits = (user?.imageCredits || 0) > 0;

  // When user tries to upload, check privacy consent first
  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }
    if (!hasCredits) {
      toast.error('You need credits to analyse images');
      navigate('/pricing');
      return;
    }

    // Check if user has accepted privacy policy
    const privacyAccepted = localStorage.getItem(PRIVACY_CONSENT_KEY);
    if (!privacyAccepted) {
      setShowPrivacyConsent(true);
      setPendingUpload(true);
      return;
    }

    // Show pricing confirmation
    setShowPricingConfirm(true);
  };

  const handlePrivacyAccept = (consents: { aiImprovement: boolean; research: boolean }) => {
    localStorage.setItem(PRIVACY_CONSENT_KEY, JSON.stringify({ ...consents, accepted: true, date: new Date().toISOString() }));
    setShowPrivacyConsent(false);
    if (pendingUpload) {
      setPendingUpload(false);
      setShowPricingConfirm(true);
    }
  };

  const handlePrivacyDecline = () => {
    setShowPrivacyConsent(false);
    setPendingUpload(false);
  };

  const handleUploadConfirmed = async () => {
    setShowPricingConfirm(false);
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile!);
      if (sampleType) formData.append('sampleType', sampleType);
      if (collectionDate) formData.append('collectionDate', collectionDate);
      if (location) formData.append('location', location);

      const response = await axios.post(`${API_URL}/analysis/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      // Update credit balance in store
      if (user) {
        await updateUser({ imageCredits: (user.imageCredits || 0) - 1 } as any);
      }

      toast.success('Upload successful! Processing your image...');
      setTimeout(() => navigate(`/analysis/${response.data.analysisId}`), 800);
    } catch (error: any) {
      console.error('Upload error:', error);
      if (error.response?.status === 402) {
        toast.error('Insufficient credits. Please purchase more.');
        setTimeout(() => navigate('/pricing'), 2000);
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.error || 'Invalid file. Please try again.');
      } else {
        toast.error('Upload failed. Please try again.');
      }
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file?: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      toast.error('Only JPEG and PNG images are allowed');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    processFile(e.dataTransfer.files[0]);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Privacy Consent Modal */}
      <PrivacyConsentModal
        isOpen={showPrivacyConsent}
        onAccept={handlePrivacyAccept}
        onDecline={handlePrivacyDecline}
      />

      {/* Pricing Confirm Modal */}
      <PricingConfirmModal
        isOpen={showPricingConfirm}
        imagePreview={preview}
        creditBalance={user?.imageCredits || 0}
        onConfirm={handleUploadConfirmed}
        onCancel={() => setShowPricingConfirm(false)}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Sample Image</h1>
          <p className="text-gray-400">
            Upload a clear photo of your stool, blood, or skin sample for AI analysis
          </p>
        </div>

        {/* Capture tips — shown prominently above the upload zone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {CAPTURE_TIPS.map(({ icon: Icon, title, detail }) => (
            <div key={title} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 bg-blue-900 rounded-lg flex-shrink-0">
                <Icon size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{title}</p>
                <p className="text-gray-400 text-xs mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Credit balance / no credits warning */}
        {!hasCredits ? (
          <div className="mb-6 bg-orange-900 border border-orange-600 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="text-orange-400 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-100 mb-1">No Credits Available</h3>
              <p className="text-orange-200 text-sm mb-3">
                Each analysis costs 1 credit (~AUD $7.50). Purchase credits to continue.
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-medium transition-colors"
              >
                Purchase Credits
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Available Credits</div>
              <div className="text-2xl font-bold">{user?.imageCredits || 0}</div>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              Buy More
            </button>
          </div>
        )}

        {!preview ? (
          <div className="space-y-4">
            {/* Drag & Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-800"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Upload className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium mb-2">Drag and drop your image here</h3>
              <p className="text-gray-400 text-sm mb-4">or click to browse files</p>
              <p className="text-gray-500 text-xs">Supports: JPEG, PNG • Max size: 10MB</p>
            </div>

            {/* Camera / Gallery buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-3 p-5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-colors"
              >
                <FileImage size={24} />
                <span className="font-medium">Choose from Gallery</span>
              </button>
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-3 p-5 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
              >
                <Camera size={24} />
                <span className="font-medium">Take Photo</span>
              </button>
            </div>

            {/* Hidden inputs */}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleFileSelect} className="hidden" />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
          </div>
        ) : (
          /* Preview & Metadata */
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Selected Image</h3>
                <button
                  onClick={clearSelection}
                  disabled={uploading}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  aria-label="Remove image"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-96 object-contain" />
              </div>
              <div className="mt-3 text-sm text-gray-400">
                <span>{selectedFile?.name}</span>
                <span className="mx-2">•</span>
                <span>{((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>

            {/* Optional Metadata */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <button
                onClick={() => setShowMetadata(!showMetadata)}
                className="flex items-center justify-between w-full"
              >
                <h3 className="font-semibold">Sample Information (Optional)</h3>
                <span className="text-sm text-gray-400">{showMetadata ? 'Hide ▲' : 'Show ▼'}</span>
              </button>

              {showMetadata && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sample Type</label>
                    <select
                      value={sampleType}
                      onChange={(e) => setSampleType(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select type...</option>
                      <option value="stool">Stool Sample</option>
                      <option value="blood">Blood Sample</option>
                      <option value="skin">Skin Sample</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Calendar size={16} className="inline mr-1" />Collection Date
                    </label>
                    <input
                      type="date"
                      value={collectionDate}
                      onChange={(e) => setCollectionDate(e.target.value)}
                      max={getTodayDate()}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <MapPin size={16} className="inline mr-1" />Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Mackay, QLD"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && uploadProgress > 0 && (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm text-gray-400">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={clearSelection}
                disabled={uploading}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                Choose Different Image
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !hasCredits}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Analyse Image (1 credit)
                  </>
                )}
              </button>
            </div>

            {/* Medical disclaimer reminder */}
            <p className="text-center text-gray-500 text-xs">
              Results are for informational purposes only and are not a substitute for professional medical diagnosis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
