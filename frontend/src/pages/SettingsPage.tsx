import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Shield, Trash2, Bell, Lock, LogOut, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const PRIVACY_CONSENT_KEY = 'parasite_privacy_accepted';

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
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete account');
    } finally { setDeleting(false); setShowDeleteConfirm(false); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gray-700 rounded-xl"><Settings size={28} className="text-white" /></div>
        <div><h1 className="text-3xl font-bold text-white">Settings</h1><p className="text-gray-400 text-sm">{user?.email}</p></div>
      </div>
      <div className="space-y-5">
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-700"><Bell size={20} className="text-blue-400" /><h2 className="text-white font-semibold">Notifications</h2></div>
          <div className="p-5 space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div><p className="text-white text-sm font-medium">Email notifications</p><p className="text-gray-400 text-xs">Receive an email when your analysis results are ready</p></div>
              <button onClick={() => setEmailNotifications(!emailNotifications)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? 'bg-blue-600' : 'bg-gray-600'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} /></button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div><p className="text-white text-sm font-medium">Push notifications</p><p className="text-gray-400 text-xs">Receive push notifications in your browser</p></div>
              <button onClick={() => setPushNotifications(!pushNotifications)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pushNotifications ? 'bg-blue-600' : 'bg-gray-600'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} /></button>
            </label>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-700"><Shield size={20} className="text-green-400" /><h2 className="text-white font-semibold">Privacy & Data</h2></div>
          <div className="p-5 space-y-4">
            <p className="text-gray-400 text-sm">Your images are encrypted and never shared without consent. You can delete them anytime from your analysis history.</p>
            <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={aiImprovement} onChange={(e) => setAiImprovement(e.target.checked)} className="mt-0.5 w-4 h-4 accent-blue-500" /><div><p className="text-white text-sm font-medium">Help improve the AI</p><p className="text-gray-400 text-xs">Allow anonymised images to improve the detection model</p></div></label>
            <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={research} onChange={(e) => setResearch(e.target.checked)} className="mt-0.5 w-4 h-4 accent-blue-500" /><div><p className="text-white text-sm font-medium">Contribute to research</p><p className="text-gray-400 text-xs">Share anonymised data with Australian parasitology researchers</p></div></label>
            <button onClick={savePrivacySettings} className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">Save Privacy Settings</button>
            <div className="border-t border-gray-700 pt-4"><p className="text-gray-400 text-xs">We comply with the <a href="https://www.oaic.gov.au/privacy/the-privacy-act" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Australian Privacy Principles</a>. Read our <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a>.</p></div>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-700"><Lock size={20} className="text-yellow-400" /><h2 className="text-white font-semibold">Account</h2></div>
          <div className="p-5 space-y-3">
            <button onClick={() => navigate('/profile')} className="w-full flex items-center justify-between px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"><span className="text-white text-sm">Edit Profile</span><ChevronRight size={18} className="text-gray-400" /></button>
            <button onClick={() => navigate('/pricing')} className="w-full flex items-center justify-between px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"><span className="text-white text-sm">Purchase Credits</span><ChevronRight size={18} className="text-gray-400" /></button>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors"><LogOut size={18} /><span className="text-sm">Sign Out</span></button>
          </div>
        </div>
        <div className="bg-gray-800 border border-red-900 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-red-900"><Trash2 size={20} className="text-red-400" /><h2 className="text-white font-semibold">Danger Zone</h2></div>
          <div className="p-5">
            <p className="text-gray-400 text-sm mb-4">Permanently delete your account, all images, analysis history, and personal data. This action cannot be undone.</p>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-4 py-2 bg-red-900 hover:bg-red-800 border border-red-700 text-red-200 rounded-xl text-sm font-medium transition-colors"><Trash2 size={16} />Delete My Account</button>
            ) : (
              <div className="space-y-3">
                <div className="bg-red-900 border border-red-700 rounded-lg p-3 flex items-start gap-2"><AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" /><p className="text-red-200 text-sm">This will permanently delete all your data including images, analyses, credits, and journal entries. <strong>This cannot be undone.</strong></p></div>
                <div><label className="block text-gray-400 text-xs mb-1.5">Type <strong className="text-white">DELETE</strong> to confirm</label><input type="text" value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} placeholder="DELETE" className="w-full px-3 py-2 bg-gray-700 border border-red-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" /></div>
                <div className="flex gap-3">
                  <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm transition-colors">Cancel</button>
                  <button onClick={handleDeleteAccount} disabled={deleteInput !== 'DELETE' || deleting} className="flex-1 py-2 bg-red-700 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">{deleting ? 'Deleting...' : 'Delete Account'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;