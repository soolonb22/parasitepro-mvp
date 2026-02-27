# ParasitePro Frontend

React + TypeScript + Vite frontend for ParasitePro MVP - AI-powered parasite detection platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API running (Railway or local)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your backend URL:
   ```
   VITE_API_URL=http://localhost:5000/api  # For local development
   # OR
   VITE_API_URL=https://parasite-backend-production.up.railway.app/api  # For production
   ```

3. **Start dev server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📦 Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **Icons:** Lucide React
- **Payments:** Stripe
- **Image Compression:** browser-image-compression

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Configure frontend for production"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Import repository: `soolonb22/parasitepro-mvp`
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

3. **Add Environment Variables:**
   ```
   VITE_API_URL=https://parasite-backend-production.up.railway.app/api
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
   ```

4. **Deploy:** Click "Deploy" and wait ~2-3 minutes

5. **Configure Custom Domain:**
   - In Vercel Dashboard → Settings → Domains
   - Add `notworms.com` and `www.notworms.com`
   - Update DNS records at your registrar:
     ```
     A     @     76.76.21.21
     CNAME www   cname.vercel-dns.com
     ```

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── store/          # Zustand store (auth state)
│   ├── types/          # TypeScript types
│   ├── App.tsx         # Main app component with routing
│   ├── main.tsx        # App entry point
│   └── index.css       # Global styles + Tailwind
├── .env.example        # Environment variables template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config
└── tailwind.config.js  # Tailwind config
```

## 🔑 Features

- ✅ User authentication (signup/login/logout)
- ✅ Protected routes with auth guards
- ✅ Dashboard with credit display
- ✅ Image upload with client-side compression
- ✅ Analysis results display with confidence scores
- ✅ User settings and profile management
- ✅ FAQ page
- ✅ Stripe payment integration (credits purchase)
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Dark theme

## 🔧 Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key | Yes (for payments) |

## 🔗 API Integration

The frontend expects the backend API to be available at `VITE_API_URL` with the following endpoints:

- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /analyze` - Upload and analyze image
- `GET /analyses` - Get user's analysis history
- `POST /payment/create-checkout-session` - Create Stripe checkout

## 🐛 Troubleshooting

### Build fails with "VITE_API_URL is not defined"
Make sure `.env` file exists in the `frontend/` directory with `VITE_API_URL` set.

### API calls fail with CORS errors
Ensure backend has CORS configured to allow requests from frontend domain.

### Images not uploading
Check that backend endpoint accepts `multipart/form-data` and file size is under limit (5MB compressed).

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
