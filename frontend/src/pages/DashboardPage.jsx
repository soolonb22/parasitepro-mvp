import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import axios from 'axios';

const DashboardPage = () => {
  const { user, updateUserCredits, isSubscribed, subscriptionStatus, refreshSubscription } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalAnalyses: 0 });
  const [filter, setFilter] = useState({ sampleType: 'all', status: 'all' });
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentType, setPaymentType] = useState('subscription');

  useEffect(() => {
    const payment = searchParams.get('payment');
    const type = searchParams.get('type') || 'subscription';
    if (payment === 'success') {
      setPaymentType(type);
      setShowPaymentConfirm(true);
      searchParams.delete('payment');
      searchParams.delete('type');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const getCreditsForType = (type) => {
    switch(type) {
      case 'subscription': return 3;
      case 'bundle_5': return 5;
      case 'bundle_10': return 10;
      case 'bundle_25': return 25;
      default: return 3;
    }
  };

  const handleConfirmPayment = async () => {
    setConfirmingPayment(true);
    try {
      const credits = getCreditsForType(paymentType);
      const response = await axios.post('/api/payment/confirm-payment', { 
        type: paymentType,
        credits 
      });
      updateUserCredits(response.data.newBalance);
      
      if (paymentType === 'subscription' && refreshSubscription) {
        refreshSubscription();
      }
      
      setPaymentMessage(
        paymentType === 'subscription' 
          ? 'Subscription activated! 3 credits added.' 
          : `Payment confirmed! ${credits} credits added.`
      );
      setTimeout(() => {
        setShowPaymentConfirm(false);
        setPaymentMessage('');
      }, 3000);
    } catch (error) {
      setPaymentMessage('Error confirming payment. Please contact support.');
    } finally {
      setConfirmingPayment(false);
    }
  };

  const fetchData = async () => {
    try {
      const [analysesRes, profileRes] = await Promise.all([
        axios.get('/api/analysis/analyses', { params: filter }),
        axios.get('/api/user/profile')
      ]);

      setAnalyses(analysesRes.data.analyses);
      setStats(profileRes.data.stats);
      updateUserCredits(profileRes.data.user.imageCredits);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SEO 
        title="Dashboard - Parasite Identification Pro | Your Analysis History"
        description="View your parasite detection analysis history and credit balance."
        canonical="/dashboard"
      />
      <Navbar />
      
      {showPaymentConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            {paymentMessage ? (
              <div style={{ color: paymentMessage.includes('Error') ? '#dc2626' : '#10b981', fontSize: '1.125rem' }}>
                {paymentMessage}
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Confirm Your Payment</h3>
                <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                  Did you complete your payment through Stripe? Click below to add your credit.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => setShowPaymentConfirm(false)}
                    className="btn"
                    style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    disabled={confirmingPayment}
                    className="btn btn-primary"
                  >
                    {confirmingPayment ? 'Confirming...' : 'Yes, I Paid'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Half Price Images Coupon Banner */}
        <div style={{
          backgroundColor: '#fffbeb',
          border: '2px solid #f59e0b',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 700, color: '#111827' }}>
            📸 Half Price Images!
          </div>
          <p style={{ color: '#6b7280', marginBottom: '1.25rem', fontSize: '1rem', lineHeight: '1.6' }}>
            Use coupon code <strong style={{ color: '#f59e0b', fontFamily: 'monospace', fontSize: '1.1rem' }}>HALFPRICE</strong> at checkout to get 50% off your image analyses.
          </p>
          <Link to="/pricing" style={{
            display: 'inline-block',
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1rem'
          }}>
            Go to Pricing →
          </Link>
        </div>

        <div className="dashboard-header">
          <div>
            <h1 style={{ marginBottom: '0.5rem', fontWeight: '700' }}>
              Welcome, {user?.firstName}!
            </h1>
            <p style={{ color: '#6b7280' }}>
              Manage your parasite analyses and results
            </p>
          </div>
          <Link to="/upload" className="btn btn-primary">
            + New Analysis
          </Link>
        </div>

        <div className="dashboard-stats-grid">
          <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>
              {user?.imageCredits || 0}
            </div>
            <div style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              Credits Remaining
            </div>
            {user?.imageCredits === 0 && (
              <Link to="/pricing" style={{
                display: 'inline-block',
                marginTop: '1.25rem',
                color: '#2563eb',
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                Buy More Credits →
              </Link>
            )}
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>
              {stats.totalAnalyses}
            </div>
            <div style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              Total Analyses
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Recent Analyses</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <select
                value={filter.sampleType}
                onChange={(e) => setFilter({ ...filter, sampleType: e.target.value })}
                style={{
                  padding: '0.625rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Types</option>
                <option value="stool">Stool</option>
                <option value="blood">Blood</option>
                <option value="skin">Skin</option>
              </select>

              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                style={{
                  padding: '0.625rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', fontSize: '1.1rem' }}>
              Loading...
            </p>
          ) : analyses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                No analyses yet
              </p>
              <Link to="/upload" className="btn btn-primary" style={{ padding: '0.875rem 1.75rem', fontSize: '1rem' }}>
                Upload Your First Sample
              </Link>
            </div>
          ) : (
            <div className="dashboard-analyses-grid">
              {analyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  to={`/results/${analysis.id}`}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    backgroundColor: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <img
                    src={analysis.imageUrl}
                    alt="Sample"
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      backgroundColor: '#f3f4f6'
                    }}
                  />
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem'
                    }}>
                      <span className={`badge badge-${analysis.status}`}>
                        {analysis.status}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: '#6b7280', textTransform: 'capitalize' }}>
                        {analysis.sampleType || 'other'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                      {new Date(analysis.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
