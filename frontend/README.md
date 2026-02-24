# ParasitePro MVP Frontend

React + TypeScript frontend for Parasite Identification Pro.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Zustand (state management)
- Axios
- React Hot Toast
- Lucide React (icons)
- Stripe

## Environment Setup

Create `.env.local`:
```bash
VITE_API_URL=https://parasite-backend-production.up.railway.app/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Import repository from GitHub
2. Set Root Directory: `frontend`
3. Framework: Vite (auto-detected)
4. Add Environment Variables:
   - `VITE_API_URL=https://parasite-backend-production.up.railway.app/api`
   - `VITE_STRIPE_PUBLIC_KEY=your_stripe_key`
5. Deploy

## Features

- User authentication (signup/login)
- Image upload for parasite analysis
- Analysis results display
- Credit-based system
- Payment processing with Stripe
- User settings
- FAQ page
