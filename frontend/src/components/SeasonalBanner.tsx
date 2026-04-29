// @ts-nocheck
// SeasonalBanner.tsx — Contextual urgency strip above the navbar
// Shows a seasonally-relevant message based on current month
// Hidden on print, hidden if user dismisses for session

import { useState, useEffect } from 'react';

const BANNERS: Record<number, { emoji: string; text: string; cta: string }> = {
  // Jan — wet season peak + post-Xmas travel
  0:  { emoji: '🌧️', text: "Wet season peak in QLD — warm soil and bare feet are the #1 exposure risk for families right now.", cta: "Check now" },
  // Feb — wet season
  1:  { emoji: '🌧️', text: "February wet season: tropical Queensland's highest parasite activity period. Are your kids covered?", cta: "Check now" },
  // Mar — late wet, school term 1
  2:  { emoji: '🏫', text: "School Term 1 winds down — childcare and classroom sharing means pinworm season. That itch at bedtime? It matters.", cta: "Check now" },
  // Apr — Easter travel, Bali season starts
  3:  { emoji: '✈️', text: "Easter travel season: 1 in 3 Australians return from Bali with an uninvited gut passenger.", cta: "Check now" },
  // May — school Term 2 + pinworms
  4:  { emoji: '🏫', text: "School Term 2: GPs say the #1 call from parents this week is 'itchy bottom at bedtime.' Pinworms are highly treatable — if you know.", cta: "Check now" },
  // Jun — mid-year, school term 2
  5:  { emoji: '🏫', text: "Mid-year school term: one infected child can spread pinworms to an entire classroom silently.", cta: "Is your child affected?" },
  // Jul — dry season travel, Bali, SE Asia
  6:  { emoji: '✈️', text: "July school holidays: heading to Bali or SE Asia? Pack more than sunscreen — gut parasites peak in tropical travel.", cta: "Learn what to watch for" },
  // Aug — dry season, camping QLD
  7:  { emoji: '🏕️', text: "Camping season in QLD: freshwater swimming and outdoor play are the two biggest exposure risks for families.", cta: "Check now" },
  // Sep — spring, school Term 3
  8:  { emoji: '🌱', text: "Spring school term: soil contact and playground exposure increases. Dog owners — this is zoonotic season.", cta: "Check now" },
  // Oct — pre wet season, wet season prep
  9:  { emoji: '🌧️', text: "Wet season starts soon in Queensland. If you're in tropical QLD — now is the time to think about your family's exposure risk.", cta: "Check now" },
  // Nov — wet season beginning
  10: { emoji: '🌧️', text: "Wet season has arrived. Northern Queensland families — this is the highest-risk window of the year. Don't wait.", cta: "Check now" },
  // Dec — wet season + Xmas travel
  11: { emoji: '✈️', text: "Summer + school holidays = travel exposure risk. Bali, SE Asia, or just camping in QLD — we've got a report for that.", cta: "Check now" },
};

const DISMISS_KEY = 'para_seasonal_banner_dismissed';

const SeasonalBanner = () => {
  const [visible, setVisible] = useState(false);
  const navigate_fn = typeof window !== 'undefined' ? null : null;

  useEffect(() => {
    // Don't show if dismissed this session
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    setVisible(true);
  }, []);

  if (!visible) return null;

  const month = new Date().getMonth();
  const banner = BANNERS[month];
  if (!banner) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  const handleCta = () => {
    window.location.href = '/upload';
  };

  return (
    <div
      className="no-print"
      style={{
        background: 'linear-gradient(90deg, #0F2733 0%, #1B6B5F 100%)',
        color: 'white',
        fontSize: '0.82rem',
        padding: '9px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        position: 'relative',
        zIndex: 9998,
        lineHeight: 1.4,
      }}
    >
      {/* Left: message */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: '1rem', flexShrink: 0 }}>{banner.emoji}</span>
        <span style={{ color: 'rgba(255,255,255,0.88)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {banner.text}
        </span>
      </div>

      {/* Right: CTA + dismiss */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button
          onClick={handleCta}
          style={{
            background: '#5AB89A',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '5px 13px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {banner.cta} →
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.45)',
            cursor: 'pointer',
            fontSize: '1rem',
            lineHeight: 1,
            padding: '2px 4px',
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default SeasonalBanner;
