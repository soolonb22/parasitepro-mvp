# ParasitePro Course Funnel Tracker — Google Sheets Template

## INSTRUCTIONS:
1. Open Google Sheets: https://sheets.google.com
2. Create a new blank spreadsheet
3. Name it "ParasitePro Funnel Tracker"
4. Copy each sheet below (5 sheets total)
5. Update every Monday morning (takes 10 minutes)

---

## SHEET 1: Weekly Dashboard (Main View)

Copy this into Sheet 1:

| Week Starting | Traffic | Signups | Signup % | App Paid | App % | Course (Upsell) | Course (Direct) | Total Course | Total Revenue | Notes |
|---------------|---------|---------|----------|----------|-------|-----------------|-----------------|--------------|---------------|-------|
| 2025-05-26 | | | | | | | | | | Week 1 |
| 2025-06-02 | | | | | | | | | | |
| 2025-06-09 | | | | | | | | | | |
| 2025-06-16 | | | | | | | | | | |
| 2025-06-23 | | | | | | | | | | |
| 2025-06-30 | | | | | | | | | | |

**FORMULAS TO ADD:**

Column C (Signup %):
```
=IF(B2=0,"",C2/B2)
```
Format as percentage, then drag down

Column F (App %):
```
=IF(C2=0,"",E2/C2)
```
Format as percentage, then drag down

Column I (Total Course):
```
=F2+G2
```
Drag down

Column J (Total Revenue):
```
=(E2*25)+(F2*77)+(G2*97)
```
(Assumes $25 avg app purchase, $77 course upsell, $97 direct course)
Format as currency, then drag down

**Where to get these numbers:**

- **Traffic:** Google Analytics → Realtime → Last 7 days → Users
  - Or: Vercel Analytics (if enabled)
  
- **Signups:** Your database
  - Option 1: Count new users in your Postgres database
  - Option 2: Stripe customer count (if all signups go through Stripe)
  
- **App Paid:** Stripe → Payments → Filter last 7 days → Count credit bundle purchases
  
- **Course (Upsell):** Stripe → Search "ref=gp-report" OR "ref=dashboard" in metadata
  - These are course sales from app users
  
- **Course (Direct):** All other course sales not from app referral links

---

## SHEET 2: Email Performance

Copy this into Sheet 2:

| Week | Email 1 Sent | Email 1 Opens | Email 1 Open % | Email 2 Sent | Email 2 Opens | Email 2 Open % | Email 3 Sent | Email 3 Opens | Email 3 Open % | Course Sales | Email Conv % |
|------|--------------|---------------|----------------|--------------|---------------|----------------|--------------|---------------|----------------|--------------|--------------|
| Week 1 | | | | | | | | | | | |
| Week 2 | | | | | | | | | | | |
| Week 3 | | | | | | | | | | | |

**FORMULAS TO ADD:**

Column D (Email 1 Open %):
```
=IF(B2=0,"",C2/B2)
```
Format as percentage, drag down

Column G (Email 2 Open %):
```
=IF(E2=0,"",F2/E2)
```
Format as percentage, drag down

Column J (Email 3 Open %):
```
=IF(H2=0,"",I2/H2)
```
Format as percentage, drag down

Column L (Email Conv %):
```
=IF(B2=0,"",K2/B2)
```
Format as percentage, drag down

**Targets to hit:**
- Email 1 Open %: 60-70% (it's transactional, should be high)
- Email 2 Open %: 40-50%
- Email 3 Open %: 35-45%
- Email Conv %: 5-8% (this is your money metric)

**Where to get these numbers:**

If using ConvertKit:
- Go to Sequences → "Course Upsell Sequence"
- Click each email → View Stats
- "Sent" = total recipients, "Opens" = unique opens

If sending manually:
- Track in this sheet yourself
- Mark who you sent to, check Gmail for opened emails

---

## SHEET 3: Google Analytics Events

Copy this into Sheet 3:

| Week | GP Report CTA Clicks | Dashboard CTA Clicks | Banner Dismissals | Course Page Views | Total Clicks | Click-to-Visit % |
|------|---------------------|---------------------|-------------------|-------------------|--------------|------------------|
| Week 1 | | | | | | |
| Week 2 | | | | | | |

**FORMULAS TO ADD:**

Column F (Total Clicks):
```
=B2+C2
```
Drag down

Column G (Click-to-Visit %):
```
=IF(F2=0,"",E2/F2)
```
Format as percentage, drag down

**Where to get these numbers:**

Google Analytics 4 (GA4):
1. Go to https://analytics.google.com
2. Click "Reports" → "Engagement" → "Events"
3. Find these events:
   - `course_cta_click` (with event_label = "GP Report Upsell Box") = Column B
   - `course_cta_click` (with event_label = "Dashboard Banner") = Column C
   - `course_banner_dismissed` = Column D
4. For Course Page Views:
   - Reports → Engagement → Pages and screens
   - Filter by page path = "/course"
   - Total views = Column E

**What "good" looks like:**
- If 100 people see GP Report, 15-20 should click = 15-20% CTR
- If 100 people see Dashboard, 8-12 should click = 8-12% CTR
- Click-to-Visit should be 90%+ (means links aren't broken)

---

## SHEET 4: Revenue Breakdown

Copy this into Sheet 4:

| Week | App Credits ($) | App Subs ($) | Course Upsell ($77) | Course Direct ($97) | Total Revenue | MRR (Recurring) |
|------|----------------|--------------|---------------------|---------------------|---------------|-----------------|
| Week 1 | | | | | | |
| Week 2 | | | | | | |

**FORMULAS TO ADD:**

Column F (Total Revenue):
```
=B2+C2+D2+E2
```
Drag down, format as currency

**Where to get these numbers:**

Stripe Dashboard:
1. Go to Payments → Filter by date range (last 7 days)
2. **App Credits:** Count all payments with description containing "credits" → multiply by amounts
3. **App Subs:** Billing → Subscriptions → Active → sum MRR
4. **Course Upsell:** Search metadata for "ref=gp-report" or "ref=dashboard" → count × $77
5. **Course Direct:** All other course payments → count × $97

**What to watch:**
- Course revenue should be 50-60% of total by Month 6
- MRR should grow 10-20% week-over-week
- Course Upsell should be 2-3x higher than Course Direct (app funnel stronger)

---

## SHEET 5: Conversion Funnel

Copy this into Sheet 5:

| Stage | This Week | Last Week | Change % | Target | Status |
|-------|-----------|-----------|----------|--------|--------|
| Traffic | | | | 500+ | |
| Signups | | | | 50+ | |
| App Paid | | | | 10+ | |
| Course Upsell | | | | 3+ | |
| Course Direct | | | | 2+ | |

**FORMULAS TO ADD:**

Column D (Change %):
```
=IF(C2=0,"N/A",(B2-C2)/C2)
```
Format as percentage, drag down

Column F (Status):
```
=IF(B2>=E2,"✅ On track",IF(B2>=E2*0.8,"⚠️ Close","❌ Need to fix"))
```
Drag down

**How to use this:**
1. Update "This Week" every Monday
2. Move "This Week" to "Last Week" next Monday
3. Watch the Change % — you want positive growth
4. Status tells you what needs attention

**Action triggers:**
- ❌ Traffic: Ramp up content, launch ads
- ❌ Signups: Test different homepage copy
- ❌ App Paid: Improve zero-credit modal
- ❌ Course: A/B test email subject lines

---

## CONDITIONAL FORMATTING (Make it visual)

### For Weekly Dashboard (Sheet 1):

1. Select Column J (Total Revenue)
2. Format → Conditional formatting
3. Rules:
   - Green: Greater than or equal to 500
   - Yellow: Between 200 and 499
   - Red: Less than 200

### For Email Performance (Sheet 2):

1. Select Column L (Email Conv %)
2. Format → Conditional formatting
3. Rules:
   - Green: Greater than or equal to 0.05 (5%)
   - Yellow: Between 0.03 and 0.049 (3-4.9%)
   - Red: Less than 0.03 (3%)

### For Conversion Funnel (Sheet 5):

1. Select Column F (Status)
2. Format → Conditional formatting
3. Rules:
   - If text contains "✅" → Green background
   - If text contains "⚠️" → Yellow background
   - If text contains "❌" → Red background

---

## QUICK START CHECKLIST

**First Week Setup (30 minutes):**
- [ ] Create Google Sheet from this template
- [ ] Add formulas to each sheet
- [ ] Add conditional formatting
- [ ] Fill in Week 1 baseline data
- [ ] Set Calendar reminder: "Update funnel tracker" every Monday 9am

**Every Monday (10 minutes):**
- [ ] Open Google Analytics → Get traffic & event counts
- [ ] Open Stripe Dashboard → Get revenue numbers
- [ ] Check email provider (ConvertKit) → Get email stats
- [ ] Update all 5 sheets
- [ ] Review % changes — what's working? What's not?

**Monthly Review (30 minutes):**
- [ ] Create a chart: Total Revenue over time
- [ ] Identify best-performing traffic source
- [ ] Identify highest-converting email
- [ ] Make 1-2 optimization decisions

---

## EXAMPLE: What a "Good" Week 4 Looks Like

| Metric | Value | Why This Is Good |
|--------|-------|------------------|
| Traffic | 650 | Growing 15% week-over-week |
| Signups | 85 | 13% conversion (in target range) |
| App Paid | 10 | 11.7% of signups (in target) |
| Course Upsell | 3 | 30% of app customers bought course (excellent!) |
| Course Direct | 2 | Starting to see SEO/email traction |
| Total Revenue | $685 | On track for $2,000+ by Month 6 |
| Email Conv % | 5.8% | Exactly in target range |

**What to do when you hit this:** Scale up! Launch Facebook ads, post in more groups, create more SEO content.

---

## EXPORT THIS TEMPLATE

To share with team or backup:
1. File → Download → Microsoft Excel (.xlsx)
2. Or: File → Make a copy (creates backup in Google Drive)
3. Or: File → Publish to web (for read-only sharing)

---

## NEED HELP?

If any formula breaks or you need to add custom metrics, just ask Claude to fix it. Copy this entire file and say "My [X] formula isn't working" and I'll debug it.
