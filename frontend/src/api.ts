// Central API base URL helper
// Falls back to production Railway URL so the app works without VITE_API_URL env var set.
// The backend URL is public — not a secret.
const _BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://parasitepro-mvp-production-b051.up.railway.app');
export const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

// Stripe publishable key — intentionally public, safe to commit.
// Cannot make charges; only the secret key (Railway) can do that.
export const STRIPE_PUBLIC_KEY =
  import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
  'pk_live_51SEURXKP9uxdve7jnKzYboXV37u42eKc5uM21TQ15iXhYLUPQi8Jz7b3VR7yJTGtXBj4EMi9DwnV8TNqb1DhDKmH00U4I1qbyF';

export const getApiUrl = (path: string) => `${API_URL}${path.startsWith('/') ? path : '/' + path}`;
