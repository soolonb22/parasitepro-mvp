import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import SignupAssistant from '../components/SignupAssistant';
import axios from 'axios';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    promoCode: ''
  });
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
              <input
                type="text"
                placeholder="Enter promo code for free credits"
                value={formData.promoCode}
                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                style={{ textTransform: 'uppercase' }}
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
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ParasitePro Signup Assistant</title>
  <style>
    body { margin:0; font-family: system-ui, sans-serif; background:#0f172a; color:#e0f2fe; }
    #signup-assistant {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 380px;
      background: #0f172a;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.6);
      overflow: hidden;
      z-index: 9999;
    }
    .header {
      background: linear-gradient(90deg, #0ea5e9, #22d3ee);
      padding: 14px;
      color: white;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 3px solid white;
      object-fit: cover;
    }
    #chat-area {
      height: 420px;
      overflow-y: auto;
      padding: 20px;
      background: #1e2937;
      line-height: 1.5;
    }
    .message {
      margin: 12px 0;
      padding: 14px;
      border-radius: 16px;
      max-width: 85%;
    }
    .bot {
      background: #334155;
    }
    .user {
      background: #22d3ee;
      margin-left: auto;
      color: #0f172a;
    }
    .input-area {
      padding: 16px;
      background: #0f172a;
      border-top: 1px solid #334155;
    }
    #user-input {
      width: 100%;
      padding: 12px;
      border-radius: 12px;
      border: none;
      background: #334155;
      color: white;
      box-sizing: border-box;
    }
    #quick-buttons {
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .quick-btn {
      padding: 10px 16px;
      background: #0ea5e9;
      color: white;
      border: none;
      border-radius: 999px;
      cursor: pointer;
      font-size: 14px;
    }
  </style>
</head>
<body>

<div id="signup-assistant">
  <!-- Header -->
  <div class="header">
    <img src="https://i.imgur.com/YOUR-TONED-DOWN-AVATAR-HERE.png" alt="Zed" class="avatar">
    <span>ParasitePro AI Guide – Zed</span>
  </div>

  <div id="chat-area">
    <!-- Messages appear here -->
  </div>

  <div class="input-area">
    <input id="user-input" type="text" placeholder="Type here or tap a button...">
    <div id="quick-buttons"></div>
  </div>
</div>

<script>
// ============== PARASITEPRO SIGNUP ASSISTANT ==============
const avatarName = "Zed";
let step = 0;
let collectedData = {};

// Intro messages
const messages = [
  { bot: `G'day Fallon! I'm Zed, your cheeky ParasitePro AI sidekick. Welcome to the app that finally puts those "is this worms?" meltdowns to bed. 😏`, options: ["Tell me more"] },
  
  { bot: `ParasitePro uses AI to look at photos or symptoms and tell you in seconds whether it's likely worms (spoiler: most of the time it's not). Fast. Free. No drama.`, options: ["Sounds good", "Privacy?"] },
  
  { bot: `Quick heads-up, mate: This is an **educational tool only** — not medical advice. We're not vets or doctors. Always double-check with a real professional for anything serious. Cool with that?`, options: ["Got it", "Understood"] },
  
  { bot: `Sweet. To make your report stupidly accurate, I just need a few quick details. Ready when you are!`, options: ["Fire away"] }
];

// Intake questions (collects data for better accuracy)
const intakeQuestions = [
  "Are you using this for yourself or a pet? (Human / Dog / Cat / Other)",
  "Rough age of the person/pet?",
  "Where in Australia are you right now? (helps with local parasites)",
  "Any recent travel, beach walks, or wet-season adventures?",
  "What's the main symptom you're worried about? (itch, rash, tummy issues, etc.)",
  "How long has it been going on?"
];

function addMessage(text, isUser = false) {
  const area = document.getElementById('chat-area');
  const div = document.createElement('div');
  div.className = `message ${isUser ? 'user' : 'bot'}`;
  div.innerHTML = text;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}

function showButtons(options) {
  const container = document.getElementById('quick-buttons');
  container.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quick-btn';
    btn.textContent = opt;
    btn.onclick = () => handleResponse(opt);
    container.appendChild(btn);
  });
}

function handleResponse(answer) {
  addMessage(answer, true);

  // Store intake answers
  if (step >= messages.length) {
    const qIndex = intakeQuestions.indexOf(intakeQuestions[0]);
    if (qIndex >= 0) {
      collectedData[`q${qIndex}`] = answer;
      console.log("Collected data:", collectedData); // → send to backend later
    }
  }

  // Move to next step
  if (step < messages.length) {
    setTimeout(() => {
      addMessage(messages[step].bot);
      showButtons(messages[step].options);
      step++;
    }, 800);
  } else if (intakeQuestions.length > 0) {
    // Ask next intake question
    setTimeout(() => {
      const nextQ = intakeQuestions.shift();
      addMessage(nextQ);
      showButtons([]); // user types answer
    }, 800);
  } else {
    // All done
    setTimeout(() => {
      addMessage("Legend! All your info is locked in — it'll make your report way more spot-on. Ready to sign up?");
      // Here you can trigger real signup form or redirect
    }, 800);
  }
}

// Start assistant on page load
window.addEventListener('load', () => {
  addMessage(messages[0].bot);
  showButtons(messages[0].options);
});
</script>
</body>
</html>
  );
};

export default SignupPage;
