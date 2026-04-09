import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }
      
      try {
        const response = await axios.post('/api/auth/verify-email', { token });
        setStatus('success');
        setMessage(response.data.message);
      } catch (err) {
        setStatus('error');
        setMessage((err as any)?.response?.data?.error || 'Verification failed');
      }
    };
    
    verifyEmail();
  }, [token]);

  return (
    <div>
      <SEO 
        title="Email Verification - Parasite Identification Pro"
        description="Verify your email address to complete registration."
        canonical="/verify-email"
      />

      <div className="auth-container">
        <div className="card auth-card" style={{ textAlign: 'center' }}>
          {status === 'verifying' && (
            <>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                animation: 'pulse 2s infinite'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h1>Verifying Your Email...</h1>
              <p style={{ color: '#6b7280' }}>Please wait while we verify your email address.</p>
            </>
          )}
          
          {status === 'success' && (
            <>
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
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h1 style={{ color: '#059669' }}>Email Verified!</h1>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{message}</p>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => navigate('/login')}
              >
                Continue to Login
              </button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <h1 style={{ color: '#dc2626' }}>Verification Failed</h1>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{message}</p>
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '1rem' }}
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Need a new verification link? Log in and request one from your dashboard.
              </p>
            </>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default VerifyEmailPage;
