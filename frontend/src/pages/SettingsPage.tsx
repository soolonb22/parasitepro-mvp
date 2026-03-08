// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, Shield, Trash2, LogOut, ArrowLeft, Microscope, AlertTriangle, CreditCard, User } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const _BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;
const PRIVACY_CONSENT_KEY = 'parasite_privacy_accepted';

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className="relative inline-flex h-6 w-11 items-center rounded-full transition-all flex-shrink-0"
    style={{ background: checked ? 'var(--amber)' : 'var(--bg-border)' }}
  >
    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
      style={{ transform: checked ? 'translateX(24px)' : 'translateX(2px)' }} />
  </button>
);

const Section = ({ icon: Icon, title, children }) => (
  <div className="pp-card overflow-hidden animate-slide-up">
    <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--bg-border)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)' }}>
        <Icon size={15} style={{ color: 'var(--amber)' }} />
      </div>
      <h2 className="font-heading font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, accessToken, logout } = useAuthStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const rawConsent = localStorage.getItem(PRIVACY_CONSENT_KEY);
  const consent = rawConsent ? JSON.parse(rawConsent) : null;
  const [aiImprovement, setAiImprovement] = useState(consent?.aiImprovement || false);
  const [research, setResearch] = useState(consent?.research || false);

  const savePrivacySettings = () => {
    localStorage.setItem(PRIVACY_CONSENT_KEY, JSON.stringify({ accepted: true, aiImprovement, research, date: new Date().toISOString() }));
    toast.success('Privacy settings saved');
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') { toast.error('Please type DELETE to confirm'); return; }
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/auth/account`, { headers: { Authorization: `Bearer ${accessToken}` } });
      toast.success('Account deleted');
      logout(); navigate('/');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to delete account');
    } finally { setDeleting(false); setShowDeleteConfirm(false); }
  };

  return (
    <div className="pp-page">
      {/* Nav */}
      <nav className="pp-nav">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)' }}>
            <Microscope size={15} style={{ color: 'var(--amber)' }} />
          </div>
          <span className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>ParasitePro</span>
        </div>
        <div />
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-20 pb-12 space-y-4">
        {/* Header */}
        <div className="mb-6 animate-slide-up">
          <p className="pp-section-title mb-1">Account</p>
          <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>Settings</h1>
          {user?.email && <p className="text-sm mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>{user.email}</p>}
        </div>

        {/* Account overview */}
        <Section icon={User} title="Account">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
            <div className="text-right">
              <p className="pp-section-title">Credits</p>
              <p className="font-display font-bold text-xl" style={{ color: 'var(--amber-bright)' }}>{user?.imageCredits || 0}</p>
            </div>
          </div>
          <div className="pp-divider my-4" />
          <div className="flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.15)' }}>
            <CreditCard size={13} style={{ color: 'var(--amber)', marginTop: '1px', flexShrink: 0 }} />
            <span style={{ color: 'var(--text-muted)' }}>Each analysis costs 1 credit. Contact support to purchase additional credits.</span>
          </div>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Email notifications</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Get an email when analysis results are ready</p>
              </div>
              <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Push notifications</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Browser push notifications</p>
              </div>
              <Toggle checked={pushNotifications} onChange={setPushNotifications} />
            </div>
          </div>
        </Section>

        {/* Privacy */}
        <Section icon={Shield} title="Privacy & Data">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>AI model improvement</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Allow anonymised images to help improve detection</p>
              </div>
              <Toggle checked={aiImprovement} onChange={setAiImprovement} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Research participation</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Contribute anonymised data to parasitology research</p>
              </div>
              <Toggle checked={research} onChange={setResearch} />
            </div>
            <div className="pp-divider" />
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              All images are processed in accordance with Australian Privacy Principles. Data is never sold or shared with third parties.
            </div>
            <button onClick={savePrivacySettings} className="pp-btn-ghost text-xs" style={{ padding: '8px 16px' }}>
              Save Privacy Settings
            </button>
          </div>
        </Section>

        {/* Danger zone */}
        <div className="pp-card p-5 animate-slide-up" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Trash2 size={15} style={{ color: '#EF4444' }} />
            </div>
            <h2 className="font-heading font-semibold text-sm" style={{ color: '#EF4444' }}>Danger Zone</h2>
          </div>

          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Delete account</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Permanently delete your account and all data</p>
              </div>
              <button onClick={() => setShowDeleteConfirm(true)} className="pp-btn-ghost text-xs flex-shrink-0 ml-4"
                style={{ padding: '8px 14px', borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444' }}>
                Delete Account
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444' }}>
                <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
                This action is permanent. All your analyses, credits, and data will be deleted.
              </div>
              <label className="pp-label">Type DELETE to confirm</label>
              <input value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} placeholder="DELETE" className="pp-input" />
              <div className="flex gap-2">
                <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }} className="pp-btn-ghost flex-1" style={{ padding: '10px' }}>
                  Cancel
                </button>
                <button onClick={handleDeleteAccount} disabled={deleting || deleteInput !== 'DELETE'} className="pp-btn flex-1 rounded-lg font-semibold text-sm transition-all"
                  style={{ padding: '10px', background: deleteInput === 'DELETE' ? '#EF4444' : 'var(--bg-elevated)', color: deleteInput === 'DELETE' ? 'white' : 'var(--text-muted)', cursor: deleteInput === 'DELETE' ? 'pointer' : 'not-allowed' }}>
                  {deleting ? 'Deleting…' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button onClick={() => { logout(); navigate('/login'); }} className="pp-btn-ghost w-full flex items-center justify-center gap-2 animate-slide-up" style={{ padding: '12px' }}>
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
