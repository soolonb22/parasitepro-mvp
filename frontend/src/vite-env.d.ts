/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string; // pk_live_51TSrn2JVcqhzyDhek4ilj0NuzHn2v2ITBezd5ISjfiVeqt2FH4s0g6q17Ub1ASqV1mp8IDTAwdWv1pJAf7MTsWVo00b9Xz8yhi
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
