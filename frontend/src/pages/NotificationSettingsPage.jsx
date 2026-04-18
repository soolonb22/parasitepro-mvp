import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const _BASE = import.meta.env.VITE_API_URL || 'https://parasitepro-mvp-production-b051.up.railway.app';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

const NotificationSettingsPage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [notificationSupported, setNotificationSupported] = useState(true);
  const [preferences, setPreferences] = useState({
    treatment_reminders: true,
    daily_checkin: true,
    analysis_complete: true,
    weekly_summary: true,
    reminder_time: '09:00',
    email_notifications: false
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setNotificationSupported(false);
    }

    fetchPreferences();
    fetchNotificationHistory();
  }, [navigate, accessToken]);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications/preferences`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setPreferences(response.data.preferences);
      setHasActiveSubscription(response.data.hasActiveSubscription);
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
      setError('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications/history?limit=10`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notification history:', err);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setError('Notification permission denied. Please enable notifications in your browser settings.');
        return false;
      }
      return true;
    } catch (err) {
      setError('Failed to request notification permission');
      return false;
    }
  };

  const subscribeToPushNotifications = async () => {
    try {
      setSaving(true);
      setError('');

      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        setSaving(false);
        return;
      }

      const vapidResponse = await axios.get(`${API_URL}/notifications/vapid-public-key`);
      const vapidPublicKey = vapidResponse.data.publicKey;

      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      await axios.post(`${API_URL}/notifications/subscribe`,
        { subscription: subscription.toJSON() },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setHasActiveSubscription(true);
      setSuccess('Push notifications enabled successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Subscribe error:', err);
      setError('Failed to enable push notifications. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const unsubscribeFromPushNotifications = async () => {
    try {
      setSaving(true);
      setError('');

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await axios.delete(`${API_URL}/notifications/subscribe`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          data: { endpoint: subscription.endpoint }
        });
        await subscription.unsubscribe();
      }

      setHasActiveSubscription(false);
      setSuccess('Push notifications disabled');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Unsubscribe error:', err);
      setError('Failed to disable push notifications');
    } finally {
      setSaving(false);
    }
  };

  const updatePreferences = async (updates) => {
    try {
      setSaving(true);
      setError('');
      const payload = {
        treatmentReminders: updates.treatment_reminders ?? preferences.treatment_reminders,
        dailyCheckin: updates.daily_checkin ?? preferences.daily_checkin,
        analysisComplete: updates.analysis_complete ?? preferences.analysis_complete,
        weeklySummary: updates.weekly_summary ?? preferences.weekly_summary,
        reminderTime: updates.reminder_time ?? preferences.reminder_time,
        emailNotifications: updates.email_notifications ?? preferences.email_notifications
      };

      const response = await axios.put(`${API_URL}/notifications/preferences`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      setPreferences(response.data.preferences);
      setSuccess('Preferences updated');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Update preferences error:', err);
      setError('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      setSaving(true);
      const response = await axios.post(`${API_URL}/notifications/test`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (response.data.success) {
        setSuccess('Test notification sent! Check your device.');
      } else {
        setError('Could not send test notification: ' + (response.data.reason || 'Unknown error'));
      }
      setTimeout(() => { setSuccess(''); setError(''); }, 3000);
    } catch (err) {
      setError('Failed to send test notification');
    } finally {
      setSaving(false);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(`${API_URL}/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleToggle = (key) => {
    const newValue = !preferences[key];
    setPreferences(prev => ({ ...prev, [key]: newValue }));
    updatePreferences({ [key]: newValue });
  };

  if (loading) {
    return (
      <div>
        <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p>Loading notification settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEO 
        title="Notification Settings - Parasite Identification Pro"
        description="Manage your notification preferences for treatment reminders and health updates."
      />

      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Notification Settings</h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Manage how and when you receive reminders and updates
        </p>

        {error && (
          <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            {success}
          </div>
        )}

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔔</span> Push Notifications
          </h2>
          
          {!notificationSupported ? (
            <div style={{ padding: '1rem', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '0.5rem' }}>
              Your browser doesn't support push notifications. Try using a modern browser like Chrome, Firefox, or Edge.
            </div>
          ) : (
            <div>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Receive instant notifications for treatment reminders, analysis completions, and health updates.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {hasActiveSubscription ? (
                  <>
                    <button
                      onClick={unsubscribeFromPushNotifications}
                      disabled={saving}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      {saving ? 'Processing...' : 'Disable Notifications'}
                    </button>
                    <button
                      onClick={sendTestNotification}
                      disabled={saving}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#e0e7ff',
                        color: '#3730a3',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Send Test Notification
                    </button>
                  </>
                ) : (
                  <button
                    onClick={subscribeToPushNotifications}
                    disabled={saving}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 1.5rem' }}
                  >
                    {saving ? 'Enabling...' : 'Enable Push Notifications'}
                  </button>
                )}
              </div>

              {hasActiveSubscription && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#dcfce7', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#166534' }}>✓</span>
                  <span style={{ color: '#166534' }}>Push notifications are enabled on this device</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚙️</span> Notification Types
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <div>
                <div style={{ fontWeight: '500' }}>Treatment Reminders</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Daily reminders for your treatment protocols</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.treatment_reminders}
                onChange={() => handleToggle('treatment_reminders')}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <div>
                <div style={{ fontWeight: '500' }}>Daily Check-in</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Reminder to log your symptoms and meals</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.daily_checkin}
                onChange={() => handleToggle('daily_checkin')}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <div>
                <div style={{ fontWeight: '500' }}>Analysis Complete</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Notification when your image analysis is ready</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.analysis_complete}
                onChange={() => handleToggle('analysis_complete')}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <div>
                <div style={{ fontWeight: '500' }}>Weekly Summary</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Weekly health progress and insights digest</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.weekly_summary}
                onChange={() => handleToggle('weekly_summary')}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⏰</span> Reminder Time
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label>
              <span style={{ marginRight: '0.5rem' }}>Daily reminders at:</span>
              <input
                type="time"
                value={preferences.reminder_time || '09:00'}
                onChange={(e) => {
                  setPreferences(prev => ({ ...prev, reminder_time: e.target.value }));
                  updatePreferences({ reminder_time: e.target.value });
                }}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  fontSize: '1rem'
                }}
              />
            </label>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Set the time you'd like to receive daily treatment and check-in reminders
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📬</span> Recent Notifications
                {unreadCount > 0 && (
                  <span style={{ 
                    backgroundColor: '#ef4444', 
                    color: 'white', 
                    padding: '0.125rem 0.5rem', 
                    borderRadius: '999px', 
                    fontSize: '0.75rem' 
                  }}>
                    {unreadCount}
                  </span>
                )}
              </h2>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    color: '#2563eb',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: notif.read_at ? '#f9fafb' : '#eff6ff',
                    borderRadius: '0.5rem',
                    borderLeft: notif.read_at ? 'none' : '3px solid #2563eb'
                  }}
                >
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{notif.title}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{notif.body}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                    {new Date(notif.sent_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
