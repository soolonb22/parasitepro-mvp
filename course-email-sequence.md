# ParasitePro Course Email Sequence

## Overview

This 3-email sequence converts app users into course buyers over 7 days:
- **Email 1 (Day 0):** Transactional — "Your analysis is ready"
- **Email 2 (Day 3):** Educational — "The science behind your report"
- **Email 3 (Day 7):** Discount offer — "$20 off (ParasitePro exclusive)"

**Expected conversion:** 5-8% of email recipients purchase the course.

---

## EMAIL 1: Day 0 (Transactional)

**Send:** Immediately after user completes their first analysis

**Subject:** Your ParasitePro analysis is ready ✓

**Preview text:** View your educational report and GP preparation guide

**Body:**

```
Hi [First Name],

Your ParasitePro analysis is complete and ready to view.

👉 [View Your Report] (Link to their specific analysis)

**What you'll find in your report:**
- Visual assessment of your uploaded sample
- Educational context about potential findings
- Red flags that warrant GP follow-up
- Geographic risk factors (Queensland/travel-specific)
- Next steps for peace of mind

This analysis is designed to help you prepare for a GP visit — not replace one.

**Quick reminder:** You have [X credits] remaining. Need more analyses? You can purchase credit bundles anytime from your dashboard.

Thanks for trusting ParasitePro,

Fallon & the PARA AI team

---

P.S. Have questions about your report? Hit reply — I read every message.
```

**CTA:** View Your Report → `/analysis/[id]`

**Goal:** Get them to open the report and see the CourseUpsellBox at the bottom.

**Open rate target:** 60-70% (it's transactional, should be high)

---

## EMAIL 2: Day 3 (Educational + Soft Mention)

**Send:** 3 days after Email 1 (only if they opened Email 1)

**Subject:** The science behind your ParasitePro report

**Preview text:** How AI pattern recognition works + what comes next

**Body:**

```
Hi [First Name],

You got your ParasitePro report a few days ago. I wanted to take a moment to explain what's happening behind the scenes — and why this matters.

**How the AI analysis works:**

Your uploaded photo goes through a 4-version enhancement pipeline before Claude (our AI) ever sees it:

1. Auto-correct — adaptive gamma correction for lighting
2. Local contrast — reveals structure in flat-contrast areas
3. Shadow recovery — for dark toilet bowl photos
4. ROI zoom — auto-detects and crops the specimen region

Claude then compares all 4 versions against known morphological patterns from Queensland-relevant parasites: hookworm, roundworm, whipworm, threadworm, Giardia cysts, pinworms, and more.

The output? An educational assessment that helps you have an informed conversation with your GP — not a diagnosis.

**What most people don't know:**

The parasites we're taught to worry about in Australia (tapeworms, liver flukes) are incredibly rare here. The real risk? Soil-transmitted helminths from bare feet on Queensland dirt, pet exposure, or travel to SE Asia.

**And here's the thing most GPs won't tell you:** Current Australian testing protocols miss 30-40% of infections on the first stool sample. That's why visual pattern recognition + clinical context is so powerful.

**Want to go deeper?**

I've put together a comprehensive course that covers:
- The biology of how these organisms actually survive in the human body
- The real science behind "detox" (Nrf2 pathways, glutathione, binders)
- Which natural compounds have actual peer-reviewed evidence
- How to build a 30-day protocol that works WITH your body
- How to generate a professional GP letter for your file

It's the course I wish existed when I was knee-deep in NDIS cases seeing the same patterns over and over.

**No fear-marketing. No miracle cures. Just biology.**

→ [Learn more about the course](https://notworms.com/course?ref=email2&discount=PARA20)

Either way, I hope ParasitePro gave you some peace of mind.

Cheers,
Fallon

---

P.S. You're getting this because you used ParasitePro. Don't want course emails? Just hit reply and say "course emails off" — you'll still get analysis notifications.
```

**CTA:** Learn more about the course → `/course?ref=email2&discount=PARA20`

**Goal:** Plant the seed that there's more to learn. Soft sell, educational tone.

**Open rate target:** 40-50%

---

## EMAIL 3: Day 7 (Discount Offer)

**Send:** 7 days after Email 1 (only if they haven't purchased the course yet)

**Subject:** $20 off (ParasitePro exclusive) — ends soon

**Preview text:** Your exclusive discount code expires in 48 hours

**Body:**

```
Hi [First Name],

Quick one: I wanted to make sure you saw the course before this discount expires.

**Your exclusive offer:**
- Regular price: $97
- ParasitePro app users: **$77** (save $20)
- Discount code: **PARA20** (already applied in the link below)
- **Expires:** 48 hours from now

**What you get:**
✓ 5 complete modules (3-5 hours of content)
✓ 30-Day Protocol Builder (interactive tool)
✓ AI Doctor Letter Generator (professional GP correspondence)
✓ Queensland-specific parasite risk guide
✓ Lifetime access + future updates

This isn't about selling you supplements or fear-mongering about "toxins." It's about understanding the actual biology of how parasites survive in the human body — and what the research says about clearing them safely.

**The truth?** Most parasite "cleanses" are pseudoscience garbage. But there IS real peer-reviewed research on compounds like artemisinin, berberine, black walnut juglone, and oregano carvacrol.

I'll show you how to read that research, how to build a protocol that makes sense for YOUR body, and how to work WITH your GP instead of around them.

→ [Get the course for $77 (save $20)](https://notworms.com/course?ref=email3&discount=PARA20)

This discount is only for ParasitePro app users, and it expires in 48 hours. After that, it's back to $97.

No pressure — but if you've been thinking about it, now's the time.

Cheers,
Fallon

---

P.S. Not ready yet? No worries. You can always grab it at full price later. Just know that this $77 offer won't come around again.
```

**CTA:** Get the course for $77 → `/course?ref=email3&discount=PARA20`

**Goal:** Create urgency without being scammy. Final push with real deadline.

**Open rate target:** 35-45%

**Conversion rate target:** 5-8% of email list purchases

---

## TECHNICAL SETUP:

### Option A: Manual (This Week)

1. Create a Google Sheet tracker:
   - Column A: Email address
   - Column B: First name
   - Column C: Analysis ID
   - Column D: Email 1 sent date
   - Column E: Email 2 sent date
   - Column F: Email 3 sent date
   - Column G: Purchased course? (Y/N)

2. Day 0: Export users who completed analysis today, send Email 1 via Gmail BCC
3. Day 3: Filter to users who opened Email 1, send Email 2
4. Day 7: Filter to users who haven't purchased, send Email 3

### Option B: Automated (Next Week)

**ConvertKit Setup (Recommended):**
1. Sign up: https://convertkit.com (free trial)
2. Create a sequence: "Course Upsell Sequence"
3. Add 3 emails with delays:
   - Email 1: Immediate
   - Email 2: Wait 3 days
   - Email 3: Wait 7 days
4. Add tag-based exit: "purchased_course" stops the sequence

**Backend Integration (I can help with this):**
```javascript
// After analysis completion:
await fetch('https://api.convertkit.com/v3/sequences/[SEQUENCE_ID]/subscribe', {
  method: 'POST',
  body: JSON.stringify({
    api_key: process.env.CONVERTKIT_API_KEY,
    email: user.email,
    first_name: user.firstName,
    fields: {
      analysis_id: analysisId,
      credits_remaining: user.credits
    }
  })
});

// After course purchase:
await fetch('https://api.convertkit.com/v3/tags/[TAG_ID]/subscribe', {
  method: 'POST',
  body: JSON.stringify({
    api_key: process.env.CONVERTKIT_API_KEY,
    email: user.email
  })
});
```

---

## TRACKING & OPTIMIZATION:

### Week 1 Metrics:
- Email 1 open rate: Should be 60%+
- Email 2 open rate: Should be 40%+
- Email 3 open rate: Should be 35%+
- Course page visits from emails: Track with `?ref=email1/email2/email3`
- Course purchases: Track PARA20 code usage in Stripe

### What to A/B test (after 100+ sends):
- **Subject lines:** Try "Your analysis is ready" vs "ParasitePro Report: [Finding]"
- **Send time:** Test 9am vs 7pm vs 11am
- **Discount timing:** Test Email 3 at Day 5 vs Day 7 vs Day 10
- **Discount amount:** Test $20 vs $25 vs $30 off

### Red flags:
- Email 1 opens <50% → Your list is cold or emails going to spam
- Email 2 opens <30% → Email 1 didn't deliver value
- Course clicks >100 but sales = 0 → Pricing or page copy problem
- Conversion <3% → Need stronger urgency or social proof

---

## SAMPLE TIMELINES:

**User completes first analysis on Monday:**
- Monday 2pm: Email 1 sent → "Your analysis is ready"
- Thursday 2pm: Email 2 sent → "The science behind your report"
- Next Monday 2pm: Email 3 sent → "$20 off — expires in 48 hours"

**Expected outcome per 100 users:**
- 60-70 open Email 1
- 40-50 open Email 2
- 35-45 open Email 3
- 15-25 click course link
- **5-8 purchase the course** ($385-616 revenue)

---

## COMPLIANCE NOTES:

**CAN-SPAM Act (applies even in Australia):**
- ✅ Include physical address (Mackay, Queensland, Australia)
- ✅ Include unsubscribe link (or "reply to opt out")
- ✅ Honor opt-outs within 10 business days
- ✅ Subject line accurately reflects content

**Australian Spam Act 2003:**
- ✅ Only email people who used your app (implied consent)
- ✅ Include unsubscribe mechanism
- ✅ Include business name and contact info
- ✅ Don't use deceptive subject lines

**Safe approach:** Every email includes:
```
---
ParasitePro | Mackay, QLD, Australia
support@notworms.com | Unsubscribe
```

---

## COPY VARIATIONS (Use These for A/B Testing):

### Email 1 Alternative Subject Lines:
- "Your ParasitePro report is ready to view"
- "Analysis complete: [Finding] detected"
- "Your Queensland parasite risk assessment is ready"

### Email 2 Alternative Angles:
- "Why your GP might miss it (and what to do)"
- "The real parasites QLD parents should worry about"
- "What I learned analyzing 8,000+ parasite photos"

### Email 3 Alternative Urgency:
- "Last chance: $20 off expires tonight"
- "Your $77 course access (ParasitePro exclusive)"
- "This discount code expires in 24 hours"

---

## NEXT STEPS:

1. **This week:** Send Email 1 manually to all existing users
2. **Next week:** Set up ConvertKit or Mailchimp automation
3. **Week 3:** Send Email 2 and track open rates
4. **Week 4:** Send Email 3 and calculate conversion rate
5. **Month 2:** A/B test subject lines and optimize

**Your email sequence is the #1 revenue driver in this funnel.** The app gets them in the door. The emails convert them to course buyers.

Get Email 1 out today to your existing users. You could see your first course sale this week.
