# ParasitePro — High Priority Features Integration Guide

## What Was Built

7 new production-ready files:

| File | Purpose |
|------|---------|
| `server/services/imagePreprocessing.js` | Sharp pipeline — resize, sharpen, normalise, auto-rotate |
| `server/services/aiAnalysis.js` | Claude Vision + GPT-4o fallback + confidence calibration + holistic treatments |
| `server/data/parasiteEncyclopedia.js` | 15+ parasites with symptoms, holistic treatments, Australian prevalence |
| `server/routes/encyclopediaRoutes.js` | Searchable encyclopedia API |
| `server/services/pdfReport.js` | Professional PDF export (pdfkit) |
| `server/routes/shareRoutes.js` | Secure shareable links (30-day expiry) |
| `server/routes/analysisRoutes.js` | Updated analysis routes wiring everything together |

---

## Step 1 — Copy Files to Your GitHub Repo

Upload all 7 files into your project at these exact paths:
```
server/
  services/
    imagePreprocessing.js
    aiAnalysis.js
    pdfReport.js
  routes/
    analysisRoutes.js
    encyclopediaRoutes.js
    shareRoutes.js
  data/
    parasiteEncyclopedia.js
```

---

## Step 2 — Update Your Main Server File

In your `server/index.js` (or `server/app.js`), add these imports and route registrations:

```javascript
// Add these imports near the top
import analysisRouter from './routes/analysisRoutes.js';
import encyclopediaRouter from './routes/encyclopediaRoutes.js';
import shareRouter from './routes/shareRoutes.js';

// Replace your existing analysis routes with:
app.use('/api/analysis', analysisRouter);

// Add these new routes:
app.use('/api/encyclopedia', encyclopediaRouter);
app.use('/api/share', shareRouter);
```

If you use `req.db` for database pool access, make sure your middleware sets it:
```javascript
// Add this middleware before routes (if not already present)
app.use((req, res, next) => {
  req.db = pool;  // your pg Pool instance
  next();
});
```

---

## Step 3 — Run Database Migration

Connect to your Railway PostgreSQL and run this SQL to add the shared_results table:

```sql
CREATE TABLE IF NOT EXISTS shared_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  share_token VARCHAR(64) UNIQUE NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  expires_at TIMESTAMP NOT NULL,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shared_results_token ON shared_results(share_token);
CREATE INDEX IF NOT EXISTS idx_shared_results_analysis ON shared_results(analysis_id);

-- Add ai_result column to analyses if not already there
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS ai_result JSONB;
```

Run via Railway CLI:
```bash
railway run psql $DATABASE_URL -f migration.sql
```
Or paste directly into Railway's query console.

---

## Step 4 — Verify Environment Variables

Make sure these are set in Railway:

| Variable | Required | Purpose |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | ✅ Required | Claude Vision (primary AI) |
| `OPENAI_API_KEY` | ✅ Required | GPT-4o fallback |
| `CLOUDINARY_CLOUD_NAME` | ✅ Required | Image storage |
| `CLOUDINARY_API_KEY` | ✅ Required | Image storage |
| `CLOUDINARY_API_SECRET` | ✅ Required | Image storage |
| `FRONTEND_URL` | ✅ Required | Share link generation (e.g. `https://parasitepro.com`) |
| `JWT_SECRET` | ✅ Required | Auth tokens |

---

## Step 5 — Deploy

Push to GitHub → Railway auto-deploys.

```bash
git add server/services/ server/routes/ server/data/
git commit -m "feat: enhanced AI analysis, confidence calibration, PDF export, share links, encyclopedia"
git push origin main
```

---

## New API Endpoints Available

### Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analysis/upload` | Upload + AI analyse image |
| GET | `/api/analysis/:id` | Get full result with reasoning steps |
| GET | `/api/analysis/user/history` | User's analysis history |
| GET | `/api/analysis/:id/pdf` | Download PDF report |

### Encyclopedia
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/encyclopedia` | List/search all parasites |
| GET | `/api/encyclopedia?q=giardia` | Search by keyword |
| GET | `/api/encyclopedia?type=protozoa` | Filter by type |
| GET | `/api/encyclopedia/:id` | Full parasite details |

### Share Links
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/share/:analysisId` | Create share link |
| GET | `/api/share/view/:token` | View shared result (no auth) |
| GET | `/api/share/:analysisId/status` | Check if share exists |
| DELETE | `/api/share/:analysisId` | Revoke share link |

---

## What the Enhanced AI Now Returns

Each analysis result now includes:

```json
{
  "aiProvider": "claude",
  "imageQuality": {
    "qualityLabel": "good",
    "overallQuality": 0.78,
    "resolutionScore": 0.8,
    "sharpnessScore": 0.7,
    "lightingScore": 0.85
  },
  "analysisSteps": [
    { "step": 1, "title": "Image Quality Assessment", "observation": "...", "significance": "..." },
    { "step": 2, "title": "Morphological Feature Identification", "observation": "...", "significance": "..." }
  ],
  "detections": [
    {
      "commonName": "Giardia",
      "scientificName": "Giardia lamblia",
      "confidenceScore": 0.82,
      "confidenceLabel": "high",
      "urgencyLevel": "moderate",
      "visualEvidence": "Oval cysts ~10μm with 4 visible nuclei...",
      "holisticTreatment": {
        "herbal": [...],
        "dietary": [...],
        "supplements": [...]
      },
      "encyclopediaEntry": {
        "australianPrevalence": "common",
        "transmission": [...],
        "prevention": [...]
      }
    }
  ],
  "overallConclusion": "...",
  "recommendedActions": [...],
  "recommendedTests": ["Stool PCR for Giardia lamblia"]
}
```

---

## Frontend Updates Needed (Optional but Recommended)

Once backend is deployed, these frontend components would display the new data:

1. **Results page** — Add accordion sections for:
   - "How we reached this result" (analysisSteps)
   - "Holistic Support Options" (holisticTreatment)
   - "Recommended Next Steps" (recommendedActions + recommendedTests)

2. **Download PDF button** — `GET /api/analysis/:id/pdf`

3. **Share button** — `POST /api/share/:analysisId` → display URL in modal

4. **Encyclopedia page** — Browse/search at `/api/encyclopedia`

Want me to build the React frontend components for any of these next?
