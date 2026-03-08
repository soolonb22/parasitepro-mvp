// Central API base URL helper
const _BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

// Stripe publishable key — intentionally public, safe to commit.
// Cannot make charges; only the secret key (Railway) can do that.
export const STRIPE_PUBLIC_KEY =
  import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
  'pk_live_51SEURXKP9uxdve7jnKzYboXV37u42eKc5uM21TQ15iXhYLUPQi8Jz7b3VR7yJTGtXBj4EMi9DwnV8TNqb1DhDKmH00U4I1qbyF';
