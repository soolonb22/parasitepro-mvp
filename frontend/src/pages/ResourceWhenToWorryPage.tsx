// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const C = { bg:'#8AADA6', text:'#0F2733', teal:'#1B6B5F', muted:'#4A6B62', card:'rgba(255,255,255,0.85)' };

const ResourceWhenToWorryPage = () => (
  <>
    <Helmet>
      <title>When Should You Worry About Parasites? (And When Not To) | notworms.com</title>
      <meta name="description" content="Most things people think are parasites aren't. A calm, evidence-based guide to knowing when concern is actually warranted  -  and what the common false alarms are." />
      <meta name="keywords" content="when to worry parasites, parasite symptoms Australia, false alarm stool, worm anxiety, health anxiety parasites, parasites vs normal stool" />
      <link rel="canonical" href="https://notworms.com/resources/when-to-worry-about-parasites" />
      <meta property="og:title" content="When Should You Worry About Parasites? (And When Not To)" />
      <meta property="og:url" content="https://notworms.com/resources/when-to-worry-about-parasites" />
      <meta name="robots" content="index, follow" />
    </Helmet>

    <div style={{ background:C.bg, minHeight:'100vh', fontFamily:'"DM Sans","Inter",system-ui,sans-serif' }}>
      <div style={{ padding:'1rem 1.5rem', fontSize:'0.78rem', color:C.text, opacity:0.6 }}>
        <Link to="/resources" style={{ color:C.teal, textDecoration:'none', fontWeight:600 }}>← Resources</Link>
        {' '}&nbsp;/&nbsp; When to Worry About Parasites
      </div>

      <article style={{ maxWidth:760, margin:'0 auto', padding:'0 1.5rem 4rem' }}>

        <div style={{ background:C.card, borderRadius:16, padding:'2rem 2.5rem', marginBottom:'1.5rem', backdropFilter:'blur(8px)' }}>
          <p style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:C.teal, margin:'0 0 0.75rem' }}>EDUCATIONAL GUIDE</p>
          <h1 style={{ fontSize:'clamp(1.75rem,4vw,2.6rem)', fontWeight:900, color:C.text, lineHeight:1.1, letterSpacing:'-0.025em', margin:'0 0 1rem' }}>
            When Should You Worry About Parasites? (And When Not To)
          </h1>
          <p style={{ fontSize:'1.05rem', color:C.muted, lineHeight:1.65, margin:0 }}>
            You are not overreacting for looking. But you may also be seeing something completely normal. Here's a calm, evidence-based breakdown of when parasite concern is genuinely warranted  -  and when it probably isn't.
          </p>
        </div>

        {/* Red/green signal cards */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
          <div style={{ background:'rgba(220,252,231,0.7)', border:'1.5px solid #86EFAC', borderRadius:14, padding:'1.5rem' }}>
            <p style={{ fontWeight:800, color:'#166534', fontSize:'0.95rem', margin:'0 0 0.75rem' }}>🟢 Usually not a parasite</p>
            {['Mucus strands (especially during illness)','Undigested food: corn, seeds, skins, noodles, bean sprouts','Medication or supplement residue (charcoal, iron, certain fibre)','Plant fibres and vegetable husks','Air bubbles or foam in the bowl','Pale stool from high-fat foods or bile changes','Yellowish streaks from mustard or turmeric'].map(item => (
              <p key={item} style={{ fontSize:'0.82rem', color:'#166534', margin:'0 0 0.4rem', lineHeight:1.4 }}>✓ {item}</p>
            ))}
          </div>
          <div style={{ background:'rgba(254,226,226,0.7)', border:'1.5px solid #FCA5A5', borderRadius:14, padding:'1.5rem' }}>
            <p style={{ fontWeight:800, color:'#991B1B', fontSize:'0.95rem', margin:'0 0 0.75rem' }}>🔴 Worth investigating</p>
            {['Visible moving organisms','Rice-like white segments (possible tapeworm)','Spaghetti-like white or tan worms','Creeping rash on skin after soil/sand/beach exposure','Persistent diarrhoea 2+ weeks with no clear cause','Unexplained weight loss with gut symptoms','Eosinophilia on blood test without explanation','Returning from high-risk area with symptoms'].map(item => (
              <p key={item} style={{ fontSize:'0.82rem', color:'#991B1B', margin:'0 0 0.4rem', lineHeight:1.4 }}>⚠ {item}</p>
            ))}
          </div>
        </div>

        {[
          {
            heading: 'The reality: most adults in Australia don\'t have parasites',
            body: `Australia has high sanitation standards, clean water, well-regulated food systems, and a culture of regular pet deworming. Intestinal parasitic infections are genuinely uncommon in urban and suburban Australians who haven't travelled.

That said, certain populations face real elevated risk: residents of remote and rural communities (especially in the tropics), frequent international travellers, people in close contact with young children or livestock, and immunocompromised individuals.

Health anxiety about parasites is also real and common  -  the internet makes it very easy to convince yourself that normal bodily functions are something alarming. This is not a criticism; it's worth naming, because misidentification of harmless things as parasites causes significant distress and often leads to unnecessary treatments.`,
          },
          {
            heading: 'Common false alarms explained',
            body: `**Mucus:** The gut produces mucus constantly. During illness, stress, IBS flares, or dietary changes, visible mucus in stool is common and almost never parasite-related. Mucus can form long, stringy shapes that look alarming.

**Undigested food:** Corn is the classic example  -  the kernel exterior (pericarp) is indigestible and passes through intact. Vegetable fibres, seed skins, mushroom pieces, certain grains, noodles, and even some meats can all appear worm-like if you're looking for it.

**Bile changes:** Stool colour and consistency changes significantly with diet, hydration, illness, and medication. Pale, oily, or unusually coloured stool rarely indicates parasites.

**Fly larvae:** If stool is left outside or in a warm environment and flies land on it, larvae can appear that were never inside the body. This is probably the most alarming false alarm.

**Pinworm anxiety:** Enterobius vermicularis (pinworm) is real and common in children. The diagnostic method is a sticky tape applied to the anal region at night, not looking in stool. Adult worms are small (under 1cm), white, and thread-like and are mainly active at night.`,
          },
          {
            heading: 'Symptoms that genuinely warrant GP attention',
            body: `The key isn't seeing something  -  it's symptoms in combination with context:

**Go to the GP if:**
- Diarrhoea lasting more than 2 weeks (or recurring episodes)
- Abdominal cramping that persists or worsens
- Unexplained weight loss (more than 3-4 kg in a few months without dieting)
- Blood in stool (though this is more often haemorrhoids or IBD than parasites)
- Perianal itching that's persistent and worse at night (possible pinworm)
- A creeping, linear rash on the skin  -  especially on feet or anywhere that touched soil or sand (cutaneous larva migrans from hookworm larvae)
- Fatigue and anaemia with no obvious explanation
- Recent travel to a high-risk region combined with any gut symptoms

**Tell your GP:**
- Exactly where you've been and when
- What you might have eaten or been exposed to
- What your pets' deworming status is
- Whether children in your household have symptoms too`,
          },
          {
            heading: 'The role of anxiety in parasite concerns',
            body: `It's worth being honest about this. Health anxiety is common, and parasites trigger a particular kind of visceral concern that's hard to reason away. If you find yourself checking your stool repeatedly, spending hours on parasite forums, or having bought multiple OTC dewormers without clear evidence of infection  -  that pattern of behaviour is worth discussing with a GP or psychologist, separate from the parasite question itself.

This is not a dismissal. Genuine infections do happen. But the combination of health anxiety and readily available (and often misleading) internet content creates a situation where many people are significantly distressed about something that isn't there.

If you've done multiple tests and they're all negative, and you're still convinced  -  a second opinion from a gastroenterologist or infectious disease specialist can help close the loop and give you real peace of mind.`,
          },
          {
            heading: "If you're not sure, start with a photo",
            body: `notworms.com exists for exactly this situation: you've seen something, you don't know if it's concerning, and you want organised information before calling a GP.

Our AI provides an educational visual assessment  -  not a diagnosis, but a structured breakdown of what you might be seeing, what else it could be, and whether the visual evidence suggests anything worth taking to a doctor.

It's a first step. Not a last step.`,
          },
        ].map(({ heading, body }) => (
          <div key={heading} style={{ background:C.card, borderRadius:14, padding:'1.75rem 2rem', marginBottom:'1rem', backdropFilter:'blur(6px)' }}>
            <h2 style={{ fontSize:'1.15rem', fontWeight:800, color:C.text, margin:'0 0 0.75rem' }}>{heading}</h2>
            {body.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize:'0.9rem', color:C.muted, lineHeight:1.7, margin:'0 0 0.75rem' }}
                dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.+?)\*\*/g,'<strong style="color:#0F2733">$1</strong>').replace(/\n/g,'<br/>') }}/>
            ))}
          </div>
        ))}

        <div style={{ background:'rgba(27,107,95,0.15)', border:'1.5px solid rgba(27,107,95,0.4)', borderRadius:14, padding:'1.5rem 2rem', marginBottom:'1.5rem' }}>
          <p style={{ fontWeight:800, color:C.text, margin:'0 0 0.5rem', fontSize:'1rem' }}>Not sure what you're seeing?</p>
          <p style={{ fontSize:'0.85rem', color:C.muted, margin:'0 0 1rem' }}>Upload a photo for a structured educational report. Calm, clear, and designed to help you have a better GP conversation.</p>
          <Link to="/signup" style={{ display:'inline-block', background:C.teal, color:'white', padding:'11px 24px', borderRadius:10, fontWeight:700, fontSize:'0.9rem', textDecoration:'none' }}>
            Start Free Analysis →
          </Link>
        </div>

        <p style={{ fontSize:'0.75rem', color:C.text, opacity:0.5, lineHeight:1.6, textAlign:'center' }}>
          ⚠️ Educational only. Not medical advice. If you have ongoing symptoms, please see a qualified healthcare professional.
        </p>
      </article>
    </div>
  </>
);

export default ResourceWhenToWorryPage;
