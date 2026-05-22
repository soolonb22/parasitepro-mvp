import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ─── Register Service Worker (PWA) ─────────────────────────────────────────
// Only in production — dev mode HMR conflicts with SW caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => console.log('[SW] registered:', reg.scope))
      .catch((err) => console.warn('[SW] registration failed:', err));
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
