# ParasitePro — notworms.com

> AI-assisted educational parasite identification for Australians.  
> **Educational tool only — not a medical diagnosis service.**

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your API keys

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
parasitepro/
├── app/
│   ├── layout.tsx              # Root layout (Navbar, Footer, fonts)
│   ├── page.tsx                # Homepage with updated CTAs
│   ├── globals.css             # Tailwind + custom design tokens
│   │
│   ├── chat/page.tsx           # Free AI chatbot (streaming, PARA persona)
│   ├── analyzer/page.tsx       # AI image analyser (waitlist state)
│   ├── assistant/page.tsx      # PARA capabilities showcase
│   ├── research/page.tsx       # Educational article library
│   ├── dashboard/page.tsx      # User account + credits
│   ├── privacy/page.tsx        # Full Australian Privacy Policy
│   ├── terms/page.tsx          # Full Australian Terms of Service
│   │
│   └── api/
│       ├── chat/route.ts       # Anthropic streaming chat endpoint
│       └── waitlist/route.ts   # Email waitlist capture
│
├── components/
│   ├── Navbar.tsx              # Fixed top navigation
│   ├── Footer.tsx              # Footer with disclaimer + legal links
│   ├── WaitlistModal.tsx       # ShadCN modal for "Start Free Analysis" CTA
│   └── ui/                     # ShadCN components
│
├── lib/
│   └── utils.ts                # cn() helper
│
├── .env.example                # Environment variables template
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Key Pages

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Homepage — hero, features, pricing | No |
| `/chat` | Free PARA chatbot (streaming) | No |
| `/analyzer` | AI image analyser (waitlist) | No (account needed to use) |
| `/assistant` | PARA capabilities + examples | No |
| `/research` | Educational article library | No |
| `/dashboard` | User account + credit management | Yes (TODO: add auth) |
| `/privacy` | Australian Privacy Policy | No |
| `/terms` | Australian Terms of Service | No |

---

## Homepage CTA Changes

**Before:**
- "Start Free Analysis" → direct to analyzer
- "Upload Photo for Analysis" → direct to analyzer

**After:**
- ✅ **"Try the Free AI Chatbot"** → `/chat` (always live, no account needed)
- ✅ **"Start Free Analysis"** → opens `<WaitlistModal>` with email capture + "Coming in days" messaging

---

## Environment Variables

See `.env.example` for full list. Required for core features:

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Powers `/api/chat` — PARA chatbot |
| `NEXT_PUBLIC_CLOUDINARY_*` | Image hosting for analyzer |
| `STRIPE_SECRET_KEY` | Credit purchase processing |
| `DATABASE_URL` | PostgreSQL via Railway |

---

## Compliance Notes

- **TGA SaMD**: This tool is classified as educational information only and does not constitute a Software as a Medical Device. No diagnostic claims are made anywhere in the codebase.
- **AHPRA**: All copy uses compliant language — "consistent with", "visual pattern suggests", "educational assessment". No claims of medical diagnosis.
- **Australian Consumer Law**: Terms of Service includes ACL consumer guarantee provisions.
- **Privacy Act 1988**: Privacy Policy covers all APPs including sensitive health information handling.

---

## TODO: Auth Integration

The `/dashboard` page currently uses demo data. To wire up real auth:

1. Add your preferred auth provider (e.g. NextAuth, Clerk, Supabase Auth)
2. Wrap protected routes in middleware (see `middleware.ts` — create as needed)
3. Replace `DEMO_USER` in `dashboard/page.tsx` with real session data
4. Connect credit balance to your PostgreSQL `users` table

---

## Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel (if using Vercel CLI)
vercel --prod
```

Set all `.env.example` variables in your Vercel project settings.

---

## Support

support@notworms.com  
notworms.com · Queensland, Australia
