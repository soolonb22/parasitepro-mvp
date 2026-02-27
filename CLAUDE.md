# CLAUDE.md — ParasitePro MVP

AI-powered parasite detection platform. Users upload microscopy/sample images, the system analyses them for parasites, and results are returned with confidence scores. Access is gated by a credit system purchased via Stripe.

---

## Repository Structure

```
parasitepro-mvp/
├── backend/          # Node.js/Express/TypeScript API (Railway)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts       # PostgreSQL pool, query(), withTransaction()
│   │   │   └── cloudinary.ts     # Image upload helper
│   │   ├── middleware/
│   │   │   └── auth.ts           # JWT middleware + token generation
│   │   ├── routes/
│   │   │   ├── auth.ts           # /api/auth/*
│   │   │   ├── analysis.ts       # /api/analysis/*
│   │   │   └── payment.ts        # /api/payment/*
│   │   ├── services/
│   │   │   └── aiAnalysis.ts     # MOCK AI — replace in Phase 2
│   │   └── index.ts              # App entry, middleware, route mounting
│   ├── schema.sql                # PostgreSQL schema (run once to initialise DB)
│   ├── railway.toml              # Railway build/deploy config
│   ├── tsconfig.json
│   └── package.json
├── frontend/         # React 18/TypeScript/Vite SPA (Vercel)
│   ├── src/
│   │   ├── components/           # Modals and shared UI
│   │   ├── pages/                # Full page components
│   │   ├── store/
│   │   │   └── authStore.ts      # Zustand auth state (localStorage-persisted)
│   │   ├── api.ts                # Axios instance + authAPI/analysisAPI/paymentAPI
│   │   └── App.tsx               # Router, Login, Signup, ProtectedRoute
│   ├── vite.config.ts
│   ├── vercel.json
│   └── package.json
├── docs/
│   └── NEXT_STEPS.md
├── scripts/
│   └── create-all-files.sh
├── .env.example                  # Frontend env template
└── CLAUDE.md                     # This file
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend runtime | Node.js 20+, TypeScript 5 (strict) |
| Backend framework | Express 4 |
| Database | PostgreSQL 15+ (UUID PKs via `gen_random_uuid()`) |
| Image storage | Cloudinary |
| AI analysis | Mock service (Phase 2: real model) |
| Authentication | JWT (`jsonwebtoken`) — Bearer tokens, 1h expiry |
| Payments | Stripe (Payment Intents API) |
| Frontend framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| State management | Zustand (persisted to localStorage, key: `parasitepro-auth`) |
| HTTP client | Axios (with auth + refresh interceptors) |
| Backend deployment | Railway (Nixpacks) |
| Frontend deployment | Vercel |

---

## Development Setup

### Backend

```bash
cd backend
cp .env.example .env   # fill in values
npm install
npm run dev            # nodemon + ts-node, hot-reload on port 5000
```

Required environment variables (see `backend/.env.example`):

| Variable | Notes |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Min 32 chars |
| `FRONTEND_URL` | Used for CORS origin (e.g. `http://localhost:3000`) |
| `CLOUDINARY_CLOUD_NAME` | |
| `CLOUDINARY_API_KEY` | |
| `CLOUDINARY_API_SECRET` | |
| `STRIPE_SECRET_KEY` | `sk_test_...` for dev |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `STRIPE_PRICE_PER_CREDIT` | Cents, default `499` |
| `PORT` | Default `5000` |
| `NODE_ENV` | `development` / `production` |

**Initialise the database** (first time only):

```bash
psql $DATABASE_URL -f schema.sql
```

Backend scripts:

```bash
npm run dev      # ts-node with nodemon
npm run build    # tsc → dist/
npm start        # node dist/index.js (production)
```

### Frontend

```bash
cd frontend
cp .env.example .env   # set VITE_API_URL
npm install
npm run dev            # Vite dev server on port 3000
```

Required environment variables (see `frontend/.env.example`):

| Variable | Notes |
|---|---|
| `VITE_API_URL` | Backend URL, e.g. `http://localhost:5000/api` |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_test_...` |

Frontend scripts:

```bash
npm run dev      # Vite dev server (port 3000)
npm run build    # tsc + vite build → dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint (zero max-warnings)
```

---

## API Reference

All authenticated routes require: `Authorization: Bearer <accessToken>`

Error response shape: `{ error: string, details?: object }`

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/signup` | No | Register: `{ email, password, firstName?, lastName? }` → `{ user, accessToken }` |
| POST | `/login` | No | Login: `{ email, password }` → `{ user, accessToken }` |

### Analysis — `/api/analysis`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/upload` | Yes | `multipart/form-data`: `image` (JPEG/PNG ≤10MB) + optional `sampleType`, `collectionDate`, `location`. Costs 1 credit. Returns `{ analysisId, status: 'processing' }` |
| GET | `/:id` | Yes | Get analysis + detections by UUID |
| GET | `/user/history` | Yes | Paginated history: `?limit=20&offset=0&status=&sampleType=` |

Sample types: `stool | blood | skin | other`

Analysis status lifecycle: `pending → processing → completed | failed`

### Payment — `/api/payment`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/pricing` | No | Credit package pricing (1/5/10 credits with discounts) |
| POST | `/create-intent` | Yes | `{ credits: number }` → Stripe PaymentIntent `clientSecret` |
| POST | `/confirm` | Yes | `{ paymentIntentId }` → add credits to user account |
| POST | `/webhook` | No | Stripe webhook (raw body, signature verified) |
| GET | `/history` | Yes | User's payment history (last 50) |

**Credit pricing**: 1 credit = $4.99; 5+ credits = 20% off; 10+ credits = 30% off.

### Health checks (no auth)

- `GET /` → service info
- `GET /health` → `{ status: 'healthy' }`
- `GET /api/health` → `{ status: 'healthy' }`

---

## Database Schema

Four tables, all using UUID primary keys:

- **`users`** — `id`, `email` (unique), `password_hash` (bcrypt, 12 rounds), `first_name`, `last_name`, `image_credits` (default 0), `created_at`, `last_login_at`
- **`analyses`** — `id`, `user_id` (FK), `image_url`, `thumbnail_url`, `status`, `sample_type`, `collection_date`, `location`, timestamps
- **`detections`** — `id`, `analysis_id` (FK), `parasite_id`, `common_name`, `scientific_name`, `confidence_score` (0–1 decimal), `parasite_type` (`protozoa|helminth|ectoparasite`), `urgency_level` (`low|moderate|high|emergency`), `life_stage`, bounding box coords
- **`payments`** — `id`, `user_id` (FK), `stripe_payment_intent_id` (unique), `amount`, `currency`, `credits_purchased`, `status`

Use `withTransaction(async (client) => { ... })` from `src/config/database.ts` for any multi-step DB write.

---

## Key Conventions

### TypeScript

- Both workspaces use `"strict": true`.
- Backend: `"module": "commonjs"`, `"target": "ES2022"`, compiled to `dist/`.
- Frontend: ESM (`"type": "module"` in root `package.json`).
- Prefer explicit `Promise<void>` return types on Express handlers.

### Naming

- TypeScript/JS: camelCase for objects and fields.
- Database: snake_case for column names (e.g. `first_name`, `image_credits`).
- Map snake_case → camelCase when serialising DB rows to API responses.

### Authentication flow

1. Client calls `/api/auth/login` → receives `accessToken` (JWT, 1h).
2. Zustand store (`authStore.ts`) persists token to localStorage under key `parasitepro-auth`.
3. `api.ts` Axios interceptor reads token from localStorage and attaches `Authorization: Bearer <token>` header.
4. On 401, interceptor attempts token refresh via `/api/auth/refresh`; on failure it clears storage and redirects to `/login`.
5. Backend middleware (`authenticateToken`) verifies the token and sets `req.userId` / `req.userEmail`.

### Image upload flow

1. Frontend compresses image client-side (`browser-image-compression`) before sending.
2. Backend receives via `multer` (memory storage, 10MB limit, JPEG/PNG only).
3. Buffer is streamed to Cloudinary (`uploadImage()`), which returns `url`, `thumbnailUrl`, `publicId`.
4. A DB transaction atomically: decrements user credits and inserts the `analyses` row.
5. `analyzeImage()` runs **asynchronously** (fire-and-forget from the request handler). The endpoint returns `202` immediately with `{ analysisId, status: 'processing' }`.
6. When analysis completes, `detections` rows are inserted and `analyses.status` is set to `completed` (or `failed`).

### AI Service (Phase 2 placeholder)

`backend/src/services/aiAnalysis.ts` is a **mock** that returns randomised detections after a 3–5 second delay. Replace `analyzeImage()` with real model integration when ready. The interface (`AIDetection`) and function signatures must remain stable.

### Frontend routing

All routes fall back to `index.html` (configured in `vercel.json`). Protected routes use `<ProtectedRoute>` which checks `useAuthStore().isAuthenticated`. Unauthenticated users are redirected to `/login`.

### Error handling

- Backend: 404 and 500 global handlers in `index.ts`. Route handlers return early after `res.status(...).json(...)` — do not call `next()` for response-sending paths.
- Frontend: `react-hot-toast` (`toast.error()` / `toast.success()`) for user-facing notifications.

---

## Deployment

### Backend → Railway

Config: `backend/railway.toml`

- Build: `npm install --include=dev && npm run build`
- Start: `npm start` (runs `dist/index.js`)
- Set all backend env vars in Railway's environment settings.
- The server binds to `process.env.PORT` (Railway injects this automatically).

### Frontend → Vercel

Config: `frontend/vercel.json`

- Framework: Vite, root directory: `frontend/`, output: `dist/`
- SPA rewrite: all routes → `index.html`
- Static assets cached for 1 year (immutable).
- Set `VITE_API_URL` and `VITE_STRIPE_PUBLIC_KEY` in Vercel environment settings.

---

## Git Workflow

Active branch: `claude/claude-md-mm4sbrh6ts33nijz-APGil`

```bash
git push -u origin claude/claude-md-mm4sbrh6ts33nijz-APGil
```

Never push to `master` directly. Branch names must start with `claude/` for automated CI.

---

## Phase 2 Roadmap (Not Yet Implemented)

- Replace mock `aiAnalysis.ts` with real vision model (e.g. Google Vision API, custom CNN).
- Add `/api/auth/refresh` endpoint for the refresh-token flow already wired in `api.ts`.
- Add `/api/auth/me` endpoint (referenced in `api.ts` as `authAPI.getProfile()`).
- Stripe webhook: currently only logs events — implement automated credit fulfilment via webhook for reliability.
- Add a types directory in frontend (`src/types/`) for shared TypeScript interfaces.
