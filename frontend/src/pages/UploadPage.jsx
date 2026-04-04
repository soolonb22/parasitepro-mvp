import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import ErrorModal from '../components/ErrorModal';
import axios from 'axios';
import { Camera, Image, Info, Zap } from 'lucide-react';
import { trackError } from '../utils/analytics';

const SAMPLE_TYPES = [
  { value: 'auto', label: '🔍 Auto-Detect', description: 'Let AI determine the image type' },
  { value: 'stool', label: '🧪 Stool Sample', description: 'Fecal matter, parasites, worms' },
  { value: 'skin', label: '🩹 Skin / Rash', description: 'Rashes, bumps, lesions, bites, skin conditions' },
  { value: 'bruise', label: '💜 Bruise', description: 'Bruises, contusions, discoloration' },
  { value: 'wound', label: '🩸 Wound', description: 'Cuts, scrapes, burns, bites' },
  { value: 'blood', label: '🔬 Blood Sample', description: 'Microscopy blood smear' },
  { value: 'other', label: '❓ Other', description: 'Any other health concern' }
];

const SYMPTOM_CHECKLIST = [
  { id: 'itching', label: 'Itching (especially at night)', category: 'skin' },
  { id: 'abdominal_pain', label: 'Abdominal pain or cramping', category: 'digestive' },
  { id: 'diarrhea', label: 'Diarrhea', category: 'digestive' },
  { id: 'constipation', label: 'Constipation', category: 'digestive' },
  { id: 'bloating', label: 'Bloating or gas', category: 'digestive' },
  { id: 'nausea', label: 'Nausea or vomiting', category: 'digestive' },
  { id: 'fatigue', label: 'Fatigue or weakness', category: 'general' },
  { id: 'weight_loss', label: 'Unexplained weight loss', category: 'general' },
  { id: 'appetite_changes', label: 'Changes in appetite', category: 'general' },
  { id: 'visible_worms', label: 'Visible worms in stool', category: 'parasitic' },
  { id: 'anal_itching', label: 'Anal/rectal itching', category: 'parasitic' },
  { id: 'skin_rash', label: 'Skin rash or hives', category: 'skin' },
  { id: 'fever', label: 'Fever', category: 'general' },
  { id: 'muscle_pain', label: 'Muscle or joint pain', category: 'general' },
  { id: 'sleep_disturbance', label: 'Sleep disturbances', category: 'general' },
  { id: 'teeth_grinding', label: 'Teeth grinding (bruxism)', category: 'parasitic' }
];

const DATE_FORMATS = [
  { value: 'international', label: 'DD/MM/YYYY (International)', example: '02/12/2025' },
  { value: 'us', label: 'MM/DD/YYYY (US)', example: '12/02/2025' },
  { value: 'iso', label: 'YYYY-MM-DD (ISO)', example: '2025-12-02' }
];

const TEMPERATURE_UNITS = [
  { value: 'celsius', label: '°C (Celsius)', example: '37°C' },
  { value: 'fahrenheit', label: '°F (Fahrenheit)', example: '98.6°F' }
];

const UploadPage = () => {
  const { user, isSubscribed } = useAuth();
  const navigate = useNavigate();
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    sampleType: 'auto',
    collectionDate: '',
    location: '',
    symptoms: '',
    symptomChecklist: [],
    duration: '',
    travelHistory: '',
    additionalInfo: '',
    dateFormat: 'international',
    temperatureUnit: 'celsius'
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showSymptoms, setShowSymptoms] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalData, setErrorModalData] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif', 'image/bmp', 'image/tiff'];
      if (!allowedTypes.includes(file.type)) {
        setError('Unsupported image format. Please use JPEG, PNG, GIF, WebP, HEIC, BMP, or TIFF.');
        return;
      }
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSymptomToggle = (symptomId) => {
    setFormData(prev => ({
      ...prev,
      symptomChecklist: prev.symptomChecklist.includes(symptomId)
        ? prev.symptomChecklist.filter(id => id !== symptomId)
        : [...prev.symptomChecklist, symptomId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      setError('Please select an image to upload');
      return;
    }

    if (user.imageCredits < 1) {
      setError('Insufficient credits. Please purchase more credits.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', imageFile);
      formDataToSend.append('sampleType', formData.sampleType);
      formDataToSend.append('collectionDate', formData.collectionDate);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('symptoms', formData.symptoms);
      formDataToSend.append('symptomChecklist', JSON.stringify(formData.symptomChecklist));
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('travelHistory', formData.travelHistory);
      formDataToSend.append('additionalInfo', formData.additionalInfo);
      formDataToSend.append('dateFormat', formData.dateFormat);
      formDataToSend.append('temperatureUnit', formData.temperatureUnit);

      const response = await axios.post('/api/analysis/upload', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate(`/results/${response.data.analysisId}`);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Upload failed. Please try again.';
      setError(errorMessage);
      setErrorModalData({
        title: 'Upload Failed',
        message: errorMessage,
        type: 'upload',
        canRetry: true
      });
      setShowErrorModal(true);
      trackError('upload', errorMessage, { file: imageFile?.name });
    } finally {
      setUploading(false);
    }
  };

  const selectedSymptoms = SYMPTOM_CHECKLIST.filter(s => formData.symptomChecklist.includes(s.id));

  return (
    <div>
      <SEO 
        title="Upload for Analysis - Health Image AI | Parasite Identification Pro"
        description="Upload your health image for instant AI-powered analysis. Supports stool samples, skin rashes, bruises, wounds, and more."
        canonical="/upload"
      />
      <Navbar />
      <div className="upload-container">
        {!isSubscribed ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '1rem' 
            }}>🔒</div>
            <h1 style={{ marginBottom: '1rem' }}>Subscription Required</h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
              To access AI-powered health analysis, please subscribe to our monthly plan. 
              You'll get 3 analysis credits per month plus access to all premium features.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="btn btn-primary"
              style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
            >
              View Subscription Plans
            </button>
          </div>
        ) : (
          <>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>
            Upload Your Sample
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            Take or upload a clear photo for AI analysis
          </p>
        </div>

        <div style={{
          backgroundColor: user.imageCredits > 0 ? '#f0fdf4' : '#fef3c7',
          border: user.imageCredits > 0 ? '1px solid #86efac' : '1px solid #fcd34d',
          borderRadius: '0.75rem',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                backgroundColor: user.imageCredits > 0 ? '#16a34a' : '#f59e0b',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.1rem'
              }}>
                {user.imageCredits}
              </div>
              <div>
                <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: '0.95rem' }}>
                  Credits Available
                </p>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>
                  1 credit per analysis
                </p>
              </div>
            </div>
            {user.imageCredits < 1 && (
              <Link 
                to="/pricing"
                style={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Get Credits
              </Link>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: 'white',
              fontWeight: 700,
              padding: '1.25rem 1.5rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              fontSize: '1.1rem',
              boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)',
              marginBottom: '0.75rem'
            }}
          >
            <Camera size={24} />
            Take Photo with Camera
          </button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '0.75rem 0',
            gap: '0.75rem'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
            <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
          </div>

          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            style={{
              width: '100%',
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              color: '#374151',
              fontWeight: 600,
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              fontSize: '1rem'
            }}
          >
            <Image size={22} />
            Choose from Gallery
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif,image/bmp,image/tiff"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="form-group">
              <label style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'block' }}>
                What would you like analyzed?
              </label>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {SAMPLE_TYPES.map(type => (
                  <label
                    key={type.value}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '1rem',
                      border: formData.sampleType === type.value ? '2px solid #0d9488' : '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      backgroundColor: formData.sampleType === type.value ? '#f0fdfa' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="radio"
                      name="sampleType"
                      value={type.value}
                      checked={formData.sampleType === type.value}
                      onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                      style={{ marginTop: '0.25rem' }}
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>{type.label}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label style={{ fontWeight: 600 }}>Upload Image</label>
              <div 
                className="upload-dropzone"
                style={{ backgroundColor: preview ? '#f9fafb' : 'white' }}
                onClick={() => document.getElementById('imageInput').click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '250px',
                      borderRadius: '0.5rem'
                    }}
                  />
                ) : (
                  <div>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📷</div>
                    <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>Tap to upload or take a photo</p>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      JPEG, PNG, GIF, WebP, HEIC - max 10MB
                    </p>
                  </div>
                )}
                <input
                  id="imageInput"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif,image/bmp,image/tiff"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  capture="environment"
                />
              </div>
              {preview && (
                <button
                  type="button"
                  onClick={() => { setPreview(null); setImageFile(null); }}
                  style={{
                    marginTop: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  ✕ Remove image
                </button>
              )}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setShowSymptoms(!showSymptoms)}
                style={{
                  background: 'none',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  width: '100%',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.95rem',
                  color: '#374151',
                  backgroundColor: showSymptoms ? '#f0fdfa' : 'white'
                }}
              >
                <span>
                  <span style={{ marginRight: '0.5rem' }}>📋</span>
                  Symptoms & Health Context (Recommended)
                  {selectedSymptoms.length > 0 && (
                    <span style={{ 
                      marginLeft: '0.5rem', 
                      backgroundColor: '#0d9488', 
                      color: 'white',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem'
                    }}>
                      {selectedSymptoms.length} selected
                    </span>
                  )}
                </span>
                <span style={{ transform: showSymptoms ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  ▼
                </span>
              </button>
              
              {showSymptoms && (
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderTop: 'none',
                  borderRadius: '0 0 0.5rem 0.5rem',
                  padding: '1rem',
                  backgroundColor: '#fafafa'
                }}>
                  <div className="form-group">
                    <label style={{ fontWeight: 500, marginBottom: '0.75rem', display: 'block' }}>
                      Select any symptoms you're experiencing:
                    </label>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '0.5rem'
                    }}>
                      {SYMPTOM_CHECKLIST.map(symptom => (
                        <label
                          key={symptom.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem',
                            backgroundColor: formData.symptomChecklist.includes(symptom.id) ? '#ccfbf1' : 'white',
                            border: formData.symptomChecklist.includes(symptom.id) ? '1px solid #0d9488' : '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            transition: 'all 0.2s'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={formData.symptomChecklist.includes(symptom.id)}
                            onChange={() => handleSymptomToggle(symptom.id)}
                            style={{ accentColor: '#0d9488' }}
                          />
                          {symptom.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label style={{ fontWeight: 500 }}>Describe Additional Symptoms (Optional)</label>
                    <textarea
                      value={formData.symptoms}
                      onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                      placeholder="Describe any other symptoms not listed above..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.375rem',
                        fontSize: '0.95rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label style={{ fontWeight: 500 }}>How Long Have You Had These Symptoms?</label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.375rem',
                        fontSize: '0.95rem',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">Select duration...</option>
                      <option value="less_than_24h">Less than 24 hours</option>
                      <option value="1_3_days">1-3 days</option>
                      <option value="1_week">About a week</option>
                      <option value="2_weeks">2 weeks</option>
                      <option value="1_month">About a month</option>
                      <option value="more_than_month">More than a month</option>
                      <option value="recurring">Recurring/Chronic</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label style={{ fontWeight: 500 }}>Recent Travel History (Optional)</label>
                    <textarea
                      value={formData.travelHistory}
                      onChange={(e) => setFormData({ ...formData, travelHistory: e.target.value })}
                      placeholder="Countries or regions visited in the past 6 months (e.g., Southeast Asia, Central America, Sub-Saharan Africa...)"
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.375rem',
                        fontSize: '0.95rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label style={{ fontWeight: 500 }}>Additional Information (Optional)</label>
                    <textarea
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                      placeholder="Pet exposure, water source (well/municipal), dietary habits, outdoor activities, swimming in freshwater..."
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.375rem',
                        fontSize: '0.95rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: '#ecfdf5',
                    borderRadius: '0.375rem',
                    fontSize: '0.85rem',
                    color: '#047857'
                  }}>
                    💡 Adding symptom details significantly improves AI analysis accuracy. The more context you provide, the better the results.
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  background: 'none',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  width: '100%',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.95rem',
                  color: '#6b7280',
                  backgroundColor: showAdvanced ? '#f9fafb' : 'white'
                }}
              >
                <span>
                  <span style={{ marginRight: '0.5rem' }}>⚙️</span>
                  Location & Preferences (Optional)
                </span>
                <span style={{ transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  ▼
                </span>
              </button>
              
              {showAdvanced && (
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderTop: 'none',
                  borderRadius: '0 0 0.5rem 0.5rem',
                  padding: '1rem',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label style={{ fontWeight: 500 }}>When did this appear?</label>
                      <input
                        type="date"
                        value={formData.collectionDate}
                        onChange={(e) => setFormData({ ...formData, collectionDate: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontWeight: 500 }}>Your Location (Country/Region)</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., Brazil, India, UK..."
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div className="form-group">
                      <label style={{ fontWeight: 500 }}>Preferred Date Format</label>
                      <select
                        value={formData.dateFormat}
                        onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          fontSize: '0.95rem',
                          backgroundColor: 'white'
                        }}
                      >
                        {DATE_FORMATS.map(format => (
                          <option key={format.value} value={format.value}>
                            {format.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label style={{ fontWeight: 500 }}>Temperature Unit</label>
                      <select
                        value={formData.temperatureUnit}
                        onChange={(e) => setFormData({ ...formData, temperatureUnit: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          fontSize: '0.95rem',
                          backgroundColor: 'white'
                        }}
                      >
                        {TEMPERATURE_UNITS.map(unit => (
                          <option key={unit.value} value={unit.value}>
                            {unit.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '0.375rem',
                    fontSize: '0.85rem',
                    color: '#0369a1'
                  }}>
                    🌍 Location helps the AI consider region-specific parasites. Your preferences will be used for displaying results.
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading || user.imageCredits < 1 || !imageFile}
              style={{ 
                width: '100%', 
                marginTop: '1.5rem',
                padding: '1rem',
                fontSize: '1.1rem'
              }}
            >
              {uploading ? (
                <span>🔬 Analyzing your image...</span>
              ) : (
                <span>Analyze Image (Uses 1 Credit)</span>
              )}
            </button>
          </div>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1.25rem',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          borderRadius: '0.75rem',
          border: '1px solid #f59e0b'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#92400e' }}>
            ⚠️ Important Medical Disclaimer
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#78350f', lineHeight: 1.6 }}>
            This AI analysis is for <strong>educational and informational purposes only</strong> and does not constitute medical advice, diagnosis, or treatment. 
            The AI may make errors. Always consult with a qualified healthcare professional in your area for medical advice and treatment. 
            <strong> If you have a medical emergency, contact your local emergency services immediately.</strong>
          </p>
        </div>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '0.5rem',
          border: '1px solid #0ea5e9'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#0369a1' }}>
            💡 Tips for Best Results
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#0c4a6e' }}>
            <li>Use good lighting - natural daylight works best</li>
            <li>Keep the camera steady and image in focus</li>
            <li>Include the entire affected area in the image</li>
            <li>For scale, include a coin or ruler nearby if possible</li>
            <li>Add symptoms to significantly improve analysis accuracy</li>
          </ul>
        </div>
          </>
        )}
      </div>

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={errorModalData}
        onRetry={() => {
          setShowErrorModal(false);
          setError('');
        }}
      />
    </div>
  );
};

export default UploadPage;
