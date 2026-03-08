/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string; // pk_live_51SEURXKP9uxdve7jnKzYboXV37u42eKc5uM21TQ15iXhYLUPQi8Jz7b3VR7yJTGtXBj4EMi9DwnV8TNqb1DhDKmH00U4I1qbyF
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
