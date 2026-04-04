import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle, Target, Clock, Plane, MessageSquare } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';

const OnboardingSurvey = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({
    reason: '',
    urgency: '',
    travelHistory: '',
    additionalNotes: ''
  });

  const totalSteps = 4;

  const steps = [
    {
      id: 1,
      title: "What brings you here today?",
      subtitle: "Help us personalize your experience",
      icon: <Target size={32} />,
      field: 'reason',
      options: [
        { value: 'symptoms', label: 'I have symptoms I want to check', description: 'Digestive issues, skin problems, etc.' },
        { value: 'prevention', label: 'Prevention and education', description: 'Learning about parasites and health' },
        { value: 'confirmation', label: 'Confirming a suspected condition', description: 'Want a second opinion' },
        { value: 'curiosity', label: 'Just exploring', description: 'Curious about the technology' }
      ]
    },
    {
      id: 2,
      title: "How urgent is your concern?",
      subtitle: "This helps us prioritize your results",
      icon: <Clock size={32} />,
      field: 'urgency',
      options: [
        { value: 'immediate', label: 'Immediate - I need answers now', color: '#ef4444' },
        { value: 'soon', label: 'Soon - Within a few days', color: '#f59e0b' },
        { value: 'routine', label: 'Routine - Just a checkup', color: '#22c55e' },
        { value: 'research', label: 'No rush - Doing research', color: '#6b7280' }
      ]
    },
    {
      id: 3,
      title: "Any recent travel history?",
      subtitle: "Some parasites are region-specific",
      icon: <Plane size={32} />,
      field: 'travelHistory',
      options: [
        { value: 'tropical', label: 'Tropical/developing regions', description: 'Africa, Southeast Asia, Central America, etc.' },
        { value: 'domestic', label: 'Domestic travel only', description: 'Within my home country' },
        { value: 'none', label: 'No recent travel', description: 'Stayed local recently' },
        { value: 'prefer_not', label: 'Prefer not to say', description: '' }
      ]
    },
    {
      id: 4,
      title: "Anything else we should know?",
      subtitle: "Optional - Add any relevant details",
      icon: <MessageSquare size={32} />,
      field: 'additionalNotes',
      isTextArea: true
    }
  ];

  const currentStepData = steps[currentStep - 1];

  const handleOptionSelect = (value) => {
    setAnswers(prev => ({ ...prev, [currentStepData.field]: value }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      setLoading(true);
      try {
        await axios.post('/api/onboarding/submit', {
          reason: answers.reason,
          urgency: answers.urgency,
          travelHistory: answers.travelHistory,
          additionalNotes: answers.additionalNotes
        });
        navigate('/signup', { state: { fromOnboarding: true } });
      } catch (error) {
        console.error('Failed to save onboarding:', error);
        navigate('/signup', { state: { fromOnboarding: true } });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = currentStepData.isTextArea || answers[currentStepData.field];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <SEO 
        title="Get Started - Parasite Identification Pro"
        description="Tell us about your health concerns so we can personalize your experience."
      />
      <Navbar />

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '2rem'
        }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: '60px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: i + 1 <= currentStep ? '#0d9488' : 'rgba(255,255,255,0.2)',
                transition: 'background-color 0.3s'
              }}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'white'
          }}>
            {currentStepData.icon}
          </div>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            {currentStepData.title}
          </h2>
          <p style={{ color: '#94a3b8' }}>{currentStepData.subtitle}</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          {currentStepData.isTextArea ? (
            <textarea
              value={answers.additionalNotes}
              onChange={(e) => setAnswers(prev => ({ ...prev, additionalNotes: e.target.value }))}
              placeholder="Any symptoms, concerns, or details you'd like to share..."
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentStepData.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    borderRadius: '0.75rem',
                    border: answers[currentStepData.field] === option.value 
                      ? '2px solid #0d9488' 
                      : '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: answers[currentStepData.field] === option.value 
                      ? 'rgba(13, 148, 136, 0.2)' 
                      : 'rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: answers[currentStepData.field] === option.value 
                      ? '2px solid #0d9488' 
                      : '2px solid rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: answers[currentStepData.field] === option.value ? '#0d9488' : 'transparent'
                  }}>
                    {answers[currentStepData.field] === option.value && (
                      <CheckCircle size={14} color="white" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      color: option.color || 'white', 
                      fontWeight: 500,
                      marginBottom: option.description ? '0.25rem' : 0
                    }}>
                      {option.label}
                    </div>
                    {option.description && (
                      <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                        {option.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              <ArrowLeft size={18} />
              Back
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={!canProceed && !currentStepData.isTextArea}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: canProceed || currentStepData.isTextArea
                ? 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)'
                : '#4b5563',
              color: 'white',
              cursor: canProceed || currentStepData.isTextArea ? 'pointer' : 'not-allowed',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            {loading ? 'Saving...' : currentStep === totalSteps ? 'Complete & Sign Up' : 'Continue'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </div>

        <p style={{ 
          textAlign: 'center', 
          color: '#64748b', 
          fontSize: '0.875rem', 
          marginTop: '1.5rem' 
        }}>
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
};

export default OnboardingSurvey;
