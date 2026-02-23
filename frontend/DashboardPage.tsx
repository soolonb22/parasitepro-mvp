import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Microscope, CreditCard, Clock, CheckCircle,
  AlertTriangle, Loader, Filter, Grid, List,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import WelcomeModal from '../components/WelcomeModal';
import ReferralSection from '../components/ReferralSection';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WELCOME_SHOWN_KEY = 'parasite_welcome_shown';

interface Analysis {
  id: string;
  status: string;
  thumbnailUrl: string;
  sampleType?: string;
  uploadedAt: string;
  detections?: any[];
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useAuthStore();

  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    fetchAnalyses();
    // Show welcome modal on first login
    const alreadyShown = localStorage.getItem(WELCOME_SHOWN_KEY);
    if (!alreadyShown) {
      setTimeout(() => setShowWelcome(true), 500);
      localStorage.setItem(WELCOME_SHOWN_KEY, 'true');
    }
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await axios.get(`${API_URL}/analysis/user/history?limit=20`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAnalyses(response.data.analyses || []);
    } catch {
      toast.error('Failed to load analyses');
    } finally {
      setLoading(false);
    }
  };

  const filteredAnalyses = analyses.filter((a) => {
    if (filter === 'all') return true;
    if (['stool', 'blood', 'skin', 'other'].includes(filter)) return a.sampleType === filter;
    return a.status === filter;
  });

  const stats = {
    total: analyses.length,
    completed: analyses.filter((a) => a.status === 'completed').length,
    credits: user?.imageCredits || 0,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={14} className="text-green-400" />;
      case 'processing': return <Loader size={14} className="text-blue-400 animate-spin" />;
      case 'failed': return <AlertTriangle size={14} className="text-red-400" />;
      default: return <Clock size={14} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-900 text-green-300';
      case 'processing': return 'bg-blue-900 text-blue-300';
      case 'failed': return 'bg-red-900 text-red-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      {/* Welcome modal */}
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        firstName={user?.firstName}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {user?.firstName ? `Hello, ${user.firstName}` : 'Dashboard'}
          </h1>
          <p className="text-gray-400 mt-1">Your parasite analysis history</p>
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
        >
          <Upload size={20} />
          New Analysis
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-900 rounded-lg">
              <Microscope size={20} className="text-blue-400" />
            </div>
            <span className="text-gray-400 text-sm">Total Analyses</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-900 rounded-lg">
              <CheckCircle size={20} className="text-green-400" />
            </div>
            <span className="text-gray-400 text-sm">Completed</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.completed}</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-900 rounded-lg">
              <CreditCard size={20} className="text-yellow-400" />
            </div>
            <span className="text-gray-400 text-sm">Credits Remaining</span>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-white">{stats.credits}</p>
            {stats.credits === 0 && (
              <button
                onClick={() => navigate('/pricing')}
                className="mb-1 text-xs text-blue-400 hover:underline"
              >
                Buy more →
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analyses list — 2/3 width */}
        <div className="lg:col-span-2">
          {/* Filters + view mode */}
          <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {['all', 'completed', 'processing', 'stool', 'blood', 'skin'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <Grid size={16} className="text-gray-300" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <List size={16} className="text-gray-300" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader className="animate-spin text-blue-400" size={32} />
            </div>
          ) : filteredAnalyses.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-10 text-center">
              <Microscope size={40} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No analyses yet</p>
              <p className="text-gray-500 text-sm mt-1">Upload your first sample image to get started</p>
              <button
                onClick={() => navigate('/upload')}
                className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Upload Image
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredAnalyses.map((analysis) => (
                <button
                  key={analysis.id}
                  onClick={() => navigate(`/analysis/${analysis.id}`)}
                  className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-colors text-left group"
                >
                  <div className="relative">
                    {analysis.thumbnailUrl ? (
                      <img
                        src={analysis.thumbnailUrl}
                        alt="Sample"
                        className="w-full h-28 object-cover group-hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-28 bg-gray-700 flex items-center justify-center">
                        <Microscope size={24} className="text-gray-500" />
                      </div>
                    )}
                    <span className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                      {getStatusIcon(analysis.status)}
                      {analysis.status}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-white text-xs font-medium capitalize">{analysis.sampleType || 'Unknown'}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {new Date(analysis.uploadedAt).toLocaleDateString('en-AU')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAnalyses.map((analysis) => (
                <button
                  key={analysis.id}
                  onClick={() => navigate(`/analysis/${analysis.id}`)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-4 hover:border-blue-500 transition-colors text-left"
                >
                  {analysis.thumbnailUrl ? (
                    <img src={analysis.thumbnailUrl} alt="Thumbnail" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Microscope size={18} className="text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium capitalize">{analysis.sampleType || 'Unknown type'}</p>
                    <p className="text-gray-400 text-sm">{new Date(analysis.uploadedAt).toLocaleDateString('en-AU')}</p>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(analysis.status)}`}>
                    {getStatusIcon(analysis.status)}
                    {analysis.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar — 1/3 width */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/upload')}
                className="w-full flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Upload size={16} /> New Analysis
              </button>
              <button
                onClick={() => navigate('/journal')}
                className="w-full flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                <Clock size={16} /> Health Journal
              </button>
              <button
                onClick={() => navigate('/faq')}
                className="w-full flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Help & FAQ
              </button>
            </div>
          </div>

          {/* Referral */}
          {user && (
            <ReferralSection
              userId={user.id}
              referralCount={0}
              creditsEarned={0}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
