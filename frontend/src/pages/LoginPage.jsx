import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SEO from '../components/SEO';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [verificationLink, setVerificationLink] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRequiresVerification(false);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response?.data?.requiresVerification) {
        setRequiresVerification(true);
        setVerificationEmail(err.response.data.email);
        setVerificationLink(err.response.data.verificationLink || '');
        setError(err.response.data.error);
      } else {
        const errorMsg = err.response?.data?.error 
          || err.message 
          || 'Login failed. Please try again.';
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const res = await axios.post('/api/auth/resend-verification', { email: verificationEmail });
      setError('Verification email sent! Check your inbox.');
      if (res.data.verificationLink) {
        setVerificationLink(res.data.verificationLink);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend verification email');
    }
  };

  if (requiresVerification) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <SEO 
          title="Verify Your Email - Parasite Identification Pro"
          description="Please verify your email to login."
          canonical="/login"
        />
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem 1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
            </div>
            
            <h1 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Email Verification Required</h1>
            
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Please verify your email address <strong>{verificationEmail}</strong> before logging in.
            </p>
            
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
              onClick={handleResendVerification}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'white',
                backgroundColor: '#2563eb',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              Resend Verification Email
            </button>
            
            <button
              onClick={() => {
                setRequiresVerification(false);
                setError('');
              }}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: '500',
                color: '#6b7280',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <SEO 
        title="Login - Parasite Identification Pro | Access Your Account"
        description="Login to your Parasite Identification Pro account to view your analysis history and upload new samples."
        canonical="/login"
      />
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        paddingTop: 'env(safe-area-inset-top, 1rem)',
        paddingBottom: 'env(safe-area-inset-bottom, 1rem)',
        paddingLeft: 'env(safe-area-inset-left, 1rem)',
        paddingRight: 'env(safe-area-inset-right, 1rem)',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem 1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <h1 style={{ 
            textAlign: 'center', 
            marginBottom: '0.5rem',
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#111827'
          }}>
            Welcome Back
          </h1>
          <p style={{
            textAlign: 'center',
            color: '#6b7280',
            marginBottom: '1.5rem',
            fontSize: '1rem'
          }}>
            Login to access your analyses
          </p>

          {error && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '0.75rem',
              marginBottom: '1rem',
              fontSize: '0.9375rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Email
              </label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  fontSize: '16px',
                  borderRadius: '0.75rem',
                  border: '2px solid #e5e7eb',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  WebkitAppearance: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '0.875rem 3.5rem 0.875rem 1rem',
                    fontSize: '16px',
                    borderRadius: '0.75rem',
                    border: '2px solid #e5e7eb',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    WebkitAppearance: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.75rem',
                    color: '#6b7280',
                    fontSize: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '44px',
                    minHeight: '44px',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'white',
                backgroundColor: loading ? '#93c5fd' : '#2563eb',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s, transform 0.1s',
                minHeight: '52px',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
              onTouchStart={(e) => {
                if (!loading) e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span style={{
                    width: '1rem',
                    height: '1rem',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Logging in...
                </span>
              ) : 'Login'}
            </button>
          </form>

          <p style={{ 
            textAlign: 'center', 
            marginTop: '1rem', 
            color: '#6b7280',
            fontSize: '0.9375rem'
          }}>
            <Link 
              to="/forgot-password" 
              style={{ 
                color: '#6b7280', 
                textDecoration: 'none',
                padding: '0.25rem',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              Forgot password?
            </Link>
          </p>

          <p style={{ 
            textAlign: 'center', 
            marginTop: '1rem', 
            color: '#6b7280',
            fontSize: '0.9375rem'
          }}>
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              style={{ 
                color: '#2563eb', 
                fontWeight: '600',
                textDecoration: 'none',
                padding: '0.25rem',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
