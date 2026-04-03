// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const C = { bg:'#8AADA6', text:'#0F2733', teal:'#1B6B5F', muted:'#4A6B62', card:'rgba(255,255,255,0.85)' };

const ResourceTropicalAustraliaPage = () => (
  <>
    <Helmet>
      <title>Parasites in Tropical Australia – What You Need to Know | notworms.com</title>
      <meta name="description" content="Living in Queensland or tropical Australia? Find out which parasites are actually common, what the real risk factors are, and when to see your GP." />
      <meta name="keywords" content="parasites tropical Australia, Queensland parasites, tropical worms Australia, parasite risk Queensland, hookworm Australia, strongyloides Australia" />
      <link rel="canonical" href="https://notworms.com/resources/tropical-australia-parasites" />
      <meta property="og:title" content="Parasites in Tropical Australia – What You Need to Know" />
      <meta property="og:description" content="Evidence-based guide to parasite risk in Queensland and tropical Australia. Educational only — not medical advice." />
      <meta property="og:url" content="https://notworms.com/resources/tropical-australia-parasites" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">{JSON.stringify({
        "@context":"https://schema.org","@type":"Article",
        "headline":"Parasites in Tropical Australia – What You Need to Know",
        "author":{"@type":"Organization","name":"notworms.com"},
        "publisher":{"@type":"Organization","name":"notworms.com","url":"https://notworms.com"},
        "url":"https://notworms.com/resources/tropical-australia-parasites",
        "description":"Evidence-based guide to parasite exposure risk in Queensland and tropical Australia.",
      })}</script>
    </Helmet>

    <div style={{ background:C.bg, minHeight:'100vh', fontFamily:'"DM Sans","Inter",system-ui,sans-serif' }}>
      {/* Breadcrumb */}
      <div style={{ padding:'1rem 1.5rem', fontSize:'0.78rem', color:C.text, opacity:0.6 }}>
        <Link to="/resources" style={{ color:C.teal, textDecoration:'none', fontWeight:600 }}>← Resources</Link>
        {' '}&nbsp;/&nbsp; Tropical Australia Parasites
      </div>

      <article style={{ maxWidth:760, margin:'0 auto', padding:'0 1.5rem 4rem' }}>

        {/* Header */}
        <div style={{ background:C.card, borderRadius:16, padding:'2rem 2.5rem', marginBottom:'1.5rem', backdropFilter:'blur(8px)' }}>
          <p style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:C.teal, margin:'0 0 0.75rem' }}>EDUCATIONAL GUIDE</p>
          <h1 style={{ fontSize:'clamp(1.75rem,4vw,2.6rem)', fontWeight:900, color:C.text, lineHeight:1.1, letterSpacing:'-0.025em', margin:'0 0 1rem' }}>
            Parasites in Tropical Australia – What You Need to Know
          </h1>
          <p style={{ fontSize:'1.05rem', color:C.muted, lineHeight:1.65, margin:0 }}>
            If you live in Queensland or Northern Australia — or you've recently returned from a trip there — you're right to be more aware than most Australians about parasite exposure. But the picture is more nuanced than you might think.
          </p>
        </div>

        {/* Article body */}
        {[
          {
            heading: 'Why tropical Australia is different',
            body: `Queensland's warm, humid climate creates conditions that many parasites thrive in. The combination of heat, moisture, and proximity to wildlife means genuine exposure risks that don't exist in southern states. That said, "tropical Australia" covers an enormous range — suburban Brisbane is very different from remote Cape York.

The key factors that actually elevate your risk: walking barefoot on soil, contact with animal faeces (especially dogs, cats, wildlife), swimming in freshwater, eating undercooked meat or unwashed produce, and living or working in areas with poor sanitation.`,
          },
          {
            heading: 'The parasites most commonly found in Queensland and tropical regions',
            body: `**Hookworm (Ancylostoma and Necator):** Still endemic in some remote and Indigenous communities in northern Australia. Larvae penetrate skin (usually feet) from contaminated soil. Causes an itchy rash at entry point, then gut symptoms weeks later. Preventable with footwear.

**Strongyloides stercoralis:** A soil-dwelling roundworm that's more common in tropical Australia than most people realise. Unlike most intestinal parasites, Strongyloides can self-replicate in the body for decades, meaning people infected years ago in the tropics may still carry it. Immunosuppression (including steroid use) can trigger serious illness.

**Giardia:** Found in contaminated water Australia-wide, but exposure risk is elevated near rivers and waterholes in rural Queensland. Not just a travellers' problem — it's in local waterways too.

**Cryptosporidium:** Similar to Giardia, spread via contaminated water or direct contact with infected animals. Common in farming communities.

**Toxocara (roundworm from dogs and cats):** Eggs passed in pet faeces contaminate soil in backyards and parks. Children playing in soil are at highest risk. Largely preventable with regular pet deworming and handwashing.

**Scabies:** While technically a mite, not a worm, scabies is hyperendemic in some remote Queensland and NT communities and worth mentioning. Highly contagious through skin contact.`,
          },
          {
            heading: 'What\'s NOT particularly elevated in Queensland',
            body: `Despite the tropical climate, several parasites commonly feared in Australian communities are actually rare or absent in local populations:

- **Tapeworms from beef (Taenia saginata):** Risk is very low with Australian beef standards
- **Liver flukes:** Mostly veterinary concern; human cases are rare in Australia  
- **Malaria:** Not endemic in Australia (though travel-acquired cases exist)
- **Dengue-associated parasites:** Dengue is a virus, not a parasite

The internet tends to conflate tropical Asian parasite profiles with Australian ones. They're not the same.`,
          },
          {
            heading: 'When to actually see a GP',
            body: `See a doctor if you have:
- Persistent gut symptoms (diarrhoea, cramping, bloating) lasting more than 2 weeks
- Unexplained weight loss
- Visible worms or unusual shapes in stool
- A creeping, linear rash on skin after soil or beach exposure
- Fatigue, anaemia, or eosinophilia on a blood test
- Recent travel to a rural/remote northern area combined with any of the above

Tell your GP where you've been and what you might have been exposed to. Many GPs in southern cities are unfamiliar with tropical parasites — requesting specific stool PCR testing (rather than just microscopy) is often worth asking about.`,
          },
          {
            heading: 'Prevention in tropical Queensland',
            body: `The most effective steps are simple:
- Wear footwear outdoors, especially on soil or grass in areas with animal activity
- Wash hands thoroughly after gardening, animal contact, and before eating
- Deworm pets regularly (every 3 months minimum in tropical areas)
- Use safe drinking water; boil or filter when hiking or in rural areas
- Shower after swimming in freshwater
- Wash produce thoroughly`,
          },
        ].map(({ heading, body }) => (
          <div key={heading} style={{ background:C.card, borderRadius:14, padding:'1.75rem 2rem', marginBottom:'1rem', backdropFilter:'blur(6px)' }}>
            <h2 style={{ fontSize:'1.15rem', fontWeight:800, color:C.text, margin:'0 0 0.75rem', letterSpacing:'-0.01em' }}>{heading}</h2>
            {body.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize:'0.9rem', color:C.muted, lineHeight:1.7, margin:'0 0 0.75rem' }}
                dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#0F2733">$1</strong>').replace(/\n/g, '<br/>') }}/>
            ))}
          </div>
        ))}

        {/* CTA */}
        <div style={{ background:'rgba(27,107,95,0.15)', border:'1.5px solid rgba(27,107,95,0.4)', borderRadius:14, padding:'1.5rem 2rem', marginBottom:'1.5rem' }}>
          <p style={{ fontWeight:800, color:C.text, margin:'0 0 0.5rem', fontSize:'1rem' }}>Seen something concerning?</p>
          <p style={{ fontSize:'0.85rem', color:C.muted, margin:'0 0 1rem' }}>Upload a photo for a structured educational assessment — designed to help you prepare for a GP conversation.</p>
          <Link to="/signup" style={{ display:'inline-block', background:C.teal, color:'white', padding:'11px 24px', borderRadius:10, fontWeight:700, fontSize:'0.9rem', textDecoration:'none' }}>
            Start Free Analysis →
          </Link>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize:'0.75rem', color:C.text, opacity:0.5, lineHeight:1.6, textAlign:'center' }}>
          ⚠️ This article is for educational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional for diagnosis and treatment.
        </p>
      </article>
    </div>
  </>
);

export default ResourceTropicalAustraliaPage;
