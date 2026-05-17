# YOUR ACTION CHECKLIST — Do These 3 Things Today

## ✅ AUTOMATED FOR YOU (Already Live):

1. **Course upsell components** — Added to GP Report + Dashboard pages
2. **Google Analytics tracking** — Tracking all CTA clicks and dismissals
3. **Course landing pages** — Live at notworms.com/course
4. **PARA20 discount auto-apply** — Works from URL parameters
5. **Tracking spreadsheet template** — Ready to copy into Google Sheets

---

## 🔥 YOUR 3 CRITICAL ACTIONS (Do Today):

### **ACTION 1: Create PARA20 Discount Code in Stripe** (5 minutes)

**Why this matters:** Without this, users clicking from the app will see $97 instead of $77, and conversions will tank.

**Steps:**
1. Go to: https://dashboard.stripe.com
2. Click **Products** in left sidebar
3. Find your course product
4. Scroll to "Coupons" section → Click **+ Add coupon**
5. Fill in:
   - **Name:** PARA20
   - **Type:** Amount off
   - **Amount:** $20.00 AUD
   - **Currency:** AUD
   - **Duration:** Forever
   - **Max redemptions:** Leave blank (unlimited)
6. Click **Create coupon**
7. **TEST IT:** Visit https://notworms.com/course?discount=PARA20
   - Price should show $77 (not $97)
   - Green badge should say "✓ PARA20 discount applied — You save $20!"

**Status:** ⏳ Pending (you need to do this)

---

### **ACTION 2: Copy Google Sheets Tracker** (10 minutes)

**Why this matters:** You can't improve what you don't measure. This tracker tells you exactly what's working and what's not.

**Steps:**
1. Open Google Sheets: https://sheets.google.com
2. Create new blank spreadsheet
3. Name it: **ParasitePro Funnel Tracker**
4. Open the file I created: `GOOGLE_SHEETS_TRACKER.md` (in your repo root)
5. Copy each sheet's template (5 sheets total)
6. Add the formulas exactly as written
7. Add conditional formatting (green/yellow/red)
8. Fill in Week 1 baseline data:
   - Traffic: Check Google Analytics
   - Signups: Count users in your database
   - Revenue: Check Stripe

**Status:** ⏳ Pending (takes 10 minutes)

---

### **ACTION 3: Send Email 1 to Existing Users** (30 minutes)

**Why this matters:** You already have app users. They're your warmest leads. Email them today and you could see course sales this week.

**Steps:**
1. Export list of all users from your database:
   ```sql
   SELECT email, first_name FROM users WHERE email IS NOT NULL;
   ```
2. Open the email template: `course-email-sequence.md` (Email 1)
3. Copy the "Email 1: Day 0" template
4. Send from your Gmail (or use your email provider)
5. Subject: **Your ParasitePro analysis is ready ✓**
6. Body: Copy the template, replace [First Name] placeholders
7. Send to all users (BCC everyone to keep it private)

**Email 1 Template (Quick Copy):**
```
Subject: Your ParasitePro analysis is ready ✓

Hi [First Name],

Your ParasitePro analysis is complete and ready to view:

👉 [View Your Report Button]

**What you'll find in your report:**
- Visual assessment of uploaded sample
- Educational context about potential findings
- Red flags that warrant GP follow-up
- Geographic risk factors (Queensland/travel-specific)
- Next steps for peace of mind

This analysis is designed to help you prepare for a GP visit — not replace one.

P.S. You have [X credits] remaining. Need more? You can purchase credit bundles or subscribe for unlimited peace-of-mind analyses.

Thanks for trusting ParasitePro,
Fallon & the PARA AI team
```

**Status:** ⏳ Pending (do this today for quickest results)

---

## 📊 WHAT TO WATCH (Starting Tomorrow):

Check these metrics in Google Analytics (https://analytics.google.com):

**Events to monitor:**
- `course_cta_click` (source=gp_report) — How many people click from GP Report page
- `course_cta_click` (source=dashboard) — How many people click from Dashboard
- `course_banner_dismissed` — How many people dismiss the banner

**Where to find these:**
1. Go to Google Analytics
2. Click **Reports** → **Engagement** → **Events**
3. Search for "course_cta_click"
4. Click on it to see breakdown by event_label

**What "good" looks like:**
- 15-20% of GP Report viewers click the course CTA
- 8-12% of Dashboard visitors click the course banner
- Less than 50% dismiss the banner (if higher, copy needs work)

---

## 🎯 WEEK 1 GOALS:

| Metric | Target | How to Track |
|--------|--------|--------------|
| PARA20 code created | ✅ Done | Test the course page link |
| Tracking sheet set up | ✅ Done | Copy template to Google Sheets |
| Email 1 sent to existing users | ✅ Done | Count who you sent to |
| First course click from app | 5-10 clicks | Google Analytics events |
| First course sale | 0-1 sales | Stripe dashboard (be patient!) |

---

## ⚠️ COMMON MISTAKES TO AVOID:

**DON'T:**
- ❌ Launch Facebook ads before you have email sequence working
- ❌ Panic if no sales in first 3 days (email sequence takes 7 days to complete)
- ❌ Change copy/pricing before getting 100 clicks (need data first)
- ❌ Forget to create PARA20 in Stripe (this breaks the whole funnel!)

**DO:**
- ✅ Test the funnel yourself end-to-end
- ✅ Send emails to existing users this week
- ✅ Update your tracker every Monday
- ✅ Wait 2 weeks before making big changes

---

## 🚀 AFTER WEEK 1 (Next Steps):

Once you've done the 3 critical actions and tracked for a week:

### **Week 2:**
- Set up email automation (ConvertKit or Mailchimp)
- Send Email 2 to users who opened Email 1
- Review GA tracking data — what's converting?

### **Week 3:**
- Send Email 3 (the discount offer)
- Calculate your conversion rates
- A/B test email subject lines

### **Week 4:**
- Post in Queensland parenting groups
- Share on your Instagram/TikTok
- Consider Facebook ads IF email funnel is converting at 5%+

---

## 📞 NEED HELP?

**If you get stuck:**
1. Check the GOOGLE_SHEETS_TRACKER.md file for formula help
2. Check the course-email-sequence.md file for email templates
3. Ask me: "My [X] isn't working" and I'll fix it immediately

**Common issues:**
- "PARA20 code not showing $77" → Check Stripe coupon currency (must be AUD)
- "GA events not showing up" → Wait 24 hours, GA can be delayed
- "No course sales after 1 week" → Normal! Email sequence takes 7+ days

---

## 🎉 WHAT SUCCESS LOOKS LIKE (Month 1):

**Conservative targets:**
- 100-200 app signups
- 10-15 paying app customers
- 3-5 course sales from app upsell ($231-385)
- $600-800 total revenue

**Optimistic targets (if everything hits):**
- 250 app signups
- 20 paying app customers
- 8 course sales ($616)
- $1,000+ total revenue

**Either way:** You're building a funnel that compounds month-over-month. Month 1 is validation. Month 6 is scale.

---

## ✅ FINAL CHECKLIST:

- [ ] Create PARA20 in Stripe (5 min)
- [ ] Copy tracking sheet to Google Sheets (10 min)
- [ ] Send Email 1 to existing users (30 min)
- [ ] Test the funnel yourself (view GP Report → click course CTA → check price)
- [ ] Set calendar reminder: "Update funnel tracker" every Monday 9am

**Total time investment:** 45 minutes today, 10 minutes every Monday.

**Potential revenue:** $400-800/month by Month 3, $2,000+/month by Month 6.

---

**Your funnel is live. The infrastructure is built. Now it's just execution.**

Do the 3 actions today, track your metrics weekly, and let the funnel work.

You've got this. 🚀
