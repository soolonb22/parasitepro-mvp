import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import SignupAssistant from '../components/SignupAssistant';
import axios from 'axios';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const promoFromUrl = searchParams.get('promo') || '';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    promoCode: promoFromUrl.toUpperCase()
  });
  const [promoAutoApplied] = useState(!!promoFromUrl);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [verificationLink, setVerificationLink] = useState('');
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [sessionId] = useState(() => `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.post('/api/auth/track-funnel', { step: 'page_view', sessionId }).catch(() => {});
    
    const checkRecaptcha = setInterval(() => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          setRecaptchaReady(true);
        });
        clearInterval(checkRecaptcha);
      }
    }, 100);
    
    return () => clearInterval(checkRecaptcha);
  }, [sessionId]);

  const handleFieldFocus = () => {
    axios.post('/api/auth/track-funnel', { 
      step: 'form_start', 
      sessionId,
      email: formData.email 
    }).catch(() => {});
  };

  const getRecaptchaToken = useCallback(async () => {
    if (!RECAPTCHA_SITE_KEY || !recaptchaReady) {
      return null;
    }
    
    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'signup' });
      return token;
    } catch (err) {
      console.error('reCAPTCHA error:', err);
      return null;
    }
  }, [recaptchaReady]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      axios.post('/api/auth/track-funnel', { 
        step: 'form_submit', 
        sessionId,
        email: formData.email 
      }).catch(() => {});

      const recaptchaToken = await getRecaptchaToken();
      
      const result = await signup(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName, 
        formData.promoCode,
        recaptchaToken,
        sessionId
      );
      
      if (result?.requiresVerification) {
        setShowVerificationMessage(true);
        setVerificationLink(result.verificationLink || '');
        setSuccessMessage(result.message || 'Please check your email to verify your account.');
      } else {
        // BETA: Auto-login flow - redirect directly to dashboard
        // 🔥 Facebook conversion events
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'CompleteRegistration');
          window.fbq('track', 'Lead');
        }
        if (result?.promoApplied) {
          setSuccessMessage(`Welcome! Promo code applied - you received ${result.imageCredits || 3} free credits!`);
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showVerificationMessage) {
    return (
      <div>
        <SEO 
          title="Verify Your Email - Parasite Identification Pro"
          description="Please verify your email to complete registration."
          canonical="/signup"
        />
        <Navbar />
        <div className="auth-container">
          <div className="card auth-card" style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
            </div>
            
            <h1 style={{ marginBottom: '1rem' }}>Check Your Email</h1>
            
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              We've sent a verification link to <strong>{formData.email}</strong>. 
              Please click the link in the email to verify your account.
            </p>
            
            {successMessage && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#d1fae5',
                color: '#065f46',
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}>
                {successMessage}
              </div>
            )}
            
            {verificationLink && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                <strong>Development Mode:</strong> 
                <a 
                  href={verificationLink} 
                  style={{ 
                    color: '#2563eb', 
                    marginLeft: '0.5rem',
                    wordBreak: 'break-all'
                  }}
                >
                  Click here to verify
                </a>
              </div>
            )}
            
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1rem' }}
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
            
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Didn't receive the email?{' '}
              <button 
                onClick={async () => {
                  try {
                    const res = await axios.post('/api/auth/resend-verification', { email: formData.email });
                    setSuccessMessage('Verification email sent!');
                    if (res.data.verificationLink) {
                      setVerificationLink(res.data.verificationLink);
                    }
                  } catch (err) {
                    setError(err.response?.data?.error || 'Failed to resend');
                  }
                }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#2563eb', 
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Resend verification email
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEO 
        title="Sign Up - Parasite Identification Pro | Create Your Account"
        description="Create your Parasite Identification Pro account to start analyzing microscopy images with AI-powered parasite identification."
        canonical="/signup"
      />
      <Navbar />
      <div className="auth-container">
        <div className="card auth-card">
          <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            Create Account
          </h1>
          <p style={{
            textAlign: 'center',
            color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            Sign up to start analyzing samples
          </p>

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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onFocus={handleFieldFocus}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                minLength="6"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Promo Code <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>(optional)</span></label>
              {promoAutoApplied && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'linear-gradient(135deg,#E1F5EE,#CCE8DC)',
                  border: '1px solid #80D3C0', borderRadius: '0.5rem',
                  padding: '0.625rem 0.875rem', marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: 16 }}>🎉</span>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#008B7A' }}>
                      BETA3FREE applied — 3 free credits on signup
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#008B7A', opacity: 0.8 }}>
                      Credits never expire · No credit card required
                    </div>
                  </div>
                </div>
              )}
              <input
                type="text"
                placeholder="Enter promo code for free credits"
                value={formData.promoCode}
                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                style={{
                  textTransform: 'uppercase',
                  ...(promoAutoApplied ? { borderColor: '#00BFA5', background: '#F0FDF4', color: '#008B7A', fontWeight: 700 } : {})
                }}
              />
            </div>

            {successMessage && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#d1fae5',
                color: '#065f46',
                borderRadius: '0.5rem',
                marginTop: '0.5rem'
              }}>
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <p style={{ 
              textAlign: 'center', 
              marginTop: '0.75rem', 
              fontSize: '0.75rem', 
              color: '#9ca3af' 
            }}>
              Protected by reCAPTCHA
            </p>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: '500' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
</div>
    <SignupAssistant />
  );
};

export default SignupPage;