/**
 * parasites.ts
 * Central data module — 24-organism rich reference dataset.
 *
 * Schema designed for the Scientific Library deep-dive modal and future
 * encyclopedia pages. All CDC image links reference PHIL detail pages;
 * lifecycle diagrams use verified CDC DPDx CDN paths.
 *
 * Usage:
 *   import { PARASITES, type Parasite } from '../data/parasites';
 */

export interface Parasite {
  id: number;
  name: string;            // Scientific binomial
  common: string;          // Common name
  cat: 'protozoa' | 'nematode' | 'cestode' | 'trematode' | 'ectoparasite';
  risk: 'low' | 'medium' | 'high';
  hosts: string[];
  region: string;          // Notable geographic context
  regionEmoji: string;
  transmission: string;
  symptoms: string[];
  lifecycle: string;       // Full lifecycle narrative
  diagnosis: string;       // Lab/clinical methods
  treatment: string;       // Current standard of care
  prevention: string;
  zoonotic: boolean;
  notifiable: boolean;     // Notifiable disease in Australia
  rareFacts: string[];     // Exactly 5 entries
  image: string;           // CDC PHIL detail page — primary specimen image
  imageAlt: string;
  microImage: string;      // Second microscopy image (cyst / egg / etc.)
  video: string;           // YouTube embed URL (or empty string)
  lifecycleImage: string;  // CDC DPDx lifecycle diagram
}

// ─────────────────────────────────────────────────────────────────────────────
// PARASITE DATA  (sourced from CDC DPDx, PHIL, peer-reviewed literature)
// ─────────────────────────────────────────────────────────────────────────────

export const PARASITES: Parasite[] = [

  // ── 1. GIARDIA ────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Giardia lamblia',
    common: 'Giardia',
    cat: 'protozoa',
    risk: 'medium',
    hosts: ['human', 'dog', 'cat', 'beaver', 'wildlife'],
    region: "Worldwide — responsible for 'Beaver Fever' in hikers",
    regionEmoji: '🌍',
    transmission: 'Fecal-oral; contaminated water, food, person-to-person',
    symptoms: [
      'Watery/greasy diarrhea',
      'Bloating and excessive flatulence',
      'Abdominal cramps',
      "Sulfurous ('rotten egg') belching",
      'Nausea',
      'Weight loss',
      'Lactose intolerance post-infection',
    ],
    lifecycle:
      'Cysts ingested (as few as 10 cysts cause infection) → excystation in duodenum → trophozoites colonise small intestine using ventral sucker disc → binary fission → encyst → cysts passed in faeces',
    diagnosis:
      'Stool O&P microscopy; ELISA antigen; PCR; duodenal aspirate (string test)',
    treatment:
      'Metronidazole 250 mg TID × 5–7d; Tinidazole 2 g single dose; Nitazoxanide',
    prevention: 'Boil/filter water; hand hygiene; avoid swallowing recreational water',
    zoonotic: true,
    notifiable: false,
    rareFacts: [
      "Antonie van Leeuwenhoek first observed Giardia in his own stool in 1681 — the very first protozoan ever described.",
      "The trophozoite has a characteristic 'smiley face' appearance under microscopy: two large nuclei as eyes and the adhesive disc as the mouth.",
      "Giardia is the only binucleate eukaryote known — each cell has two diploid nuclei that act completely independently.",
      "Chlorine-resistant cysts can survive in alpine creek water for up to 3 months — a major risk for Queensland campers and hikers.",
      "2025 outbreaks in Queensland were traced to poorly maintained backyard rainwater tanks during wet season flooding.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=3743',
    imageAlt: 'Giardia lamblia trophozoite with ventral sucking disc under microscopy',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=24603',
    video: 'https://www.youtube.com/embed/V9KfffFN1XE',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/giardiasis/modules/Giardia_LifeCycle_lg.jpg',
  },

  // ── 2. CRYPTOSPORIDIUM ────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Cryptosporidium parvum',
    common: 'Crypto',
    cat: 'protozoa',
    risk: 'high',
    hosts: ['human', 'livestock', 'dog', 'cat'],
    region: 'Worldwide — caused the largest waterborne disease outbreak in US history',
    regionEmoji: '🌍',
    transmission: 'Fecal-oral; water; animal contact; swimming pools',
    symptoms: [
      'Profuse watery diarrhoea (up to 10–15 L/day in immunocompromised)',
      'Stomach cramps',
      'Nausea',
      'Low-grade fever',
      'Vomiting',
      'Chronic wasting in HIV/AIDS',
    ],
    lifecycle:
      'Oocysts ingested (infectious dose: <10 oocysts) → sporozoites released → infect intestinal epithelium → sexual/asexual cycles → thick-walled oocysts shed in faeces',
    diagnosis: 'Stool acid-fast stain (Kinyoun); ELISA antigen; PCR',
    treatment: 'Nitazoxanide (immunocompetent 3-day course); supportive rehydration',
    prevention: 'Chlorine-resistant — boil or UV/filter water; exclude from pools while symptomatic',
    zoonotic: true,
    notifiable: true,
    rareFacts: [
      "The 1993 Milwaukee outbreak infected 403,000 people via a single municipal water treatment plant failure — the largest recorded waterborne disease outbreak in US history.",
      "Cryptosporidium oocysts survive standard pool chlorination (2 mg/L for hours has minimal effect) — only UV light or 10× chlorine concentrations are lethal.",
      "HIV/AIDS patients can shed billions of oocysts per gram of stool and develop chronic life-threatening infection without nitazoxanide.",
      "Australian rural QLD cases spike after wet-season flooding when livestock runoff contaminates drinking water sources and rainwater tanks.",
      "Cryptosporidium was only recognised as a human pathogen in 1976 — before that, every case was misdiagnosed as bacterial dysentery.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=7829',
    imageAlt: 'Cryptosporidium parvum oocysts — acid-fast stain (pink dots on blue background)',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=3795',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/cryptosporidiosis/modules/Cryptosporidium_LifeCycle_lg.jpg',
  },

  // ── 3. TOXOPLASMA ─────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Toxoplasma gondii',
    common: 'Toxoplasma',
    cat: 'protozoa',
    risk: 'medium',
    hosts: ['human', 'cat', 'livestock', 'rodent', 'bird'],
    region: 'Worldwide — up to 50% of humans infected; higher in cat-dense regions',
    regionEmoji: '🌍',
    transmission: 'Cat faeces (oocysts); undercooked meat (tissue cysts); congenital',
    symptoms: [
      'Usually asymptomatic in healthy adults',
      'Mild flu-like illness at initial infection',
      'Swollen lymph nodes (toxoplasmic lymphadenitis)',
      'Chorioretinitis (eye disease) — may cause vision loss',
      'Severe neurological disease in immunocompromised (toxoplasmic encephalitis)',
      'Congenital: miscarriage, stillbirth, hydrocephalus, intellectual disability',
    ],
    lifecycle:
      'Cat (definitive host) sheds oocysts in faeces → sporulate in environment (1–5 days) → ingested by intermediate hosts → bradyzoites form tissue cysts in muscle/brain → cat eats infected prey → sexual cycle in feline intestine → oocysts passed',
    diagnosis:
      'Serology (IgG/IgM Toxoplasma antibody); PCR (blood/CSF/amniotic fluid); brain biopsy in encephalitis',
    treatment:
      'Pyrimethamine + sulfadiazine + folinic acid × 4–6 weeks (acute disease); asymptomatic healthy adults require no treatment',
    prevention:
      'Avoid cat litter (pregnant women); cook meat to ≥63°C; wash produce; wear gloves for gardening',
    zoonotic: true,
    notifiable: false,
    rareFacts: [
      "Toxoplasma is estimated to infect ~2 billion people worldwide — roughly 30% of the global population carry latent brain cysts for life.",
      "2025 meta-analyses confirmed that chronic Toxoplasma infection increases risk of schizophrenia (OR ~1.8) and may alter dopamine pathways, increasing risk-taking behaviour — nicknamed 'cat-lady syndrome'.",
      "Infected rodents lose their fear of cat urine (manipulated by the parasite to complete its lifecycle) — a dramatic example of parasite behavioural manipulation.",
      "The name comes from the Greek 'toxon' (arc/bow) + 'plasma' (form), describing the crescent shape of the tachyzoite.",
      "In Australia, seroprevalence is highest in cat-owning households in subtropical Queensland — up to 30–40% of adults tested positive in some rural studies.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1460',
    imageAlt: 'Toxoplasma gondii tachyzoites — crescent-shaped fast-dividing forms',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=25128',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/toxoplasmosis/modules/Toxoplasma_LifeCycle_lg.jpg',
  },

  // ── 4. PLASMODIUM (MALARIA) ────────────────────────────────────────────────
  {
    id: 4,
    name: 'Plasmodium falciparum',
    common: 'Malaria',
    cat: 'protozoa',
    risk: 'high',
    hosts: ['human', 'Anopheles mosquito'],
    region: 'Sub-Saharan Africa, Southeast Asia, Pacific — imported to Australia',
    regionEmoji: '🌍',
    transmission: 'Bite of infected female Anopheles mosquito; rarely transfusion/congenital',
    symptoms: [
      'Cyclical fever and rigors (48–72 hour cycles)',
      'Severe sweating and chills',
      'Headache',
      'Myalgia',
      'Anaemia and jaundice (haemolysis)',
      'Cerebral malaria: seizures, coma (P. falciparum)',
      'Acute respiratory distress, multi-organ failure (severe cases)',
    ],
    lifecycle:
      'Infected mosquito injects sporozoites → liver stage (7–30 days, asymptomatic) → merozoites released → invade red blood cells → asexual replication (ring/trophozoite/schizont) → RBCs burst → gametocytes picked up by mosquito → sexual reproduction in mosquito gut → sporozoites migrate to salivary gland',
    diagnosis:
      'Thick/thin blood film (gold standard); rapid diagnostic test (RDT, HRP2 antigen); PCR for species ID and artemisinin resistance',
    treatment:
      'Uncomplicated P. falciparum: artemether-lumefantrine (first-line in Australia). Severe malaria: IV artesunate. Vivax/ovale: chloroquine + primaquine (radical cure for hypnozoites)',
    prevention:
      'Mosquito avoidance (DEET, permethrin, bed nets); chemoprophylaxis (atovaquone-proguanil, doxycycline, or mefloquine) for travellers',
    zoonotic: false,
    notifiable: true,
    rareFacts: [
      "Malaria has killed more humans than any other pathogen in history — estimated 50 billion deaths over 10,000 years, more than all wars combined.",
      "P. falciparum causes severe malaria by expressing PfEMP1 proteins on infected RBC surfaces, making them stick to brain capillary walls and obstruct blood flow.",
      "2025 research confirmed artemisinin-resistant P. falciparum strains with Kelch13 mutations are now spreading from Southeast Asia into Africa — threatening the only reliable first-line treatment.",
      "Queensland had local Anopheles farauti mosquito populations capable of transmitting malaria until eradication in the 1960s; climate change models predict northward range re-expansion.",
      "The RTS,S/AS01 malaria vaccine (approved 2021) reduces severe malaria by ~30% in African children — the first approved vaccine for any parasitic disease.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=227',
    imageAlt: 'Plasmodium falciparum ring-form trophozoites in red blood cells — Giemsa stain',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=2715',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/malaria/modules/Malaria_LifeCycle_lg.jpg',
  },

  // ── 5. ENTAMOEBA ──────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'Entamoeba histolytica',
    common: 'Amoeba',
    cat: 'protozoa',
    risk: 'medium',
    hosts: ['human'],
    region: 'Tropical and subtropical regions; returned travellers in Australia',
    regionEmoji: '🌏',
    transmission: 'Fecal-oral; contaminated food and water; person-to-person',
    symptoms: [
      'Amebic dysentery: bloody, mucousy diarrhoea',
      'Abdominal cramping and tenesmus',
      'Amebic liver abscess: right upper quadrant pain, fever',
      'Weight loss',
      'Asymptomatic carriage in ~90% of cases',
    ],
    lifecycle:
      'Cysts ingested → excyst in small intestine → trophozoites colonise colon → invade mucosal wall → spread via portal vein to liver → encyst → cysts shed in faeces',
    diagnosis:
      'Stool O&P microscopy (must differentiate from non-pathogenic E. dispar); ELISA antigen; PCR (most accurate); serology for liver abscess',
    treatment:
      'Metronidazole or tinidazole (tissue trophozoites) followed by paromomycin or iodoquinol (luminal cysts)',
    prevention: 'Safe water; hand hygiene; careful food handling in endemic areas',
    zoonotic: false,
    notifiable: false,
    rareFacts: [
      "E. histolytica is the only amoeba that actively ingests red blood cells (erythrophagocytosis) — a key diagnostic feature seen under microscopy.",
      "Up to 90% of infected people are asymptomatic carriers, shedding cysts without disease — but they can still transmit to others.",
      "2025 PCR studies show ~50% of amebiasis diagnoses based on microscopy alone were actually non-pathogenic E. dispar — a near-identical look-alike that requires no treatment.",
      "Amebic liver abscess can present months to years after travel — and is frequently misdiagnosed as hepatocellular carcinoma or bacterial abscess by imaging alone.",
      "Historically, emetine (extracted from ipecac root) was the main treatment — highly toxic, causing cardiac arrhythmias and death in many patients before metronidazole was introduced in 1960.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=3382',
    imageAlt: 'Entamoeba histolytica trophozoite containing ingested red blood cells',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=3383',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/amebiasis/modules/Entamoeba_LifeCycle_lg.jpg',
  },

  // ── 6. TRICHOMONAS ────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Trichomonas vaginalis',
    common: 'Trich',
    cat: 'protozoa',
    risk: 'medium',
    hosts: ['human'],
    region: 'Worldwide — most common curable STI globally (~160 million infections/year)',
    regionEmoji: '🌍',
    transmission: 'Sexual contact; rarely fomites (wet towels, toilet seats — hours only)',
    symptoms: [
      'Women: frothy yellow-green vaginal discharge, itching, dysuria',
      'Men: usually asymptomatic; urethral discharge, dysuria in some',
      'Vaginal pH >4.5',
      'Strawberry cervix (colpitis macularis) on speculum exam',
      'Increased HIV transmission risk (2–3×)',
    ],
    lifecycle:
      'No cyst stage — only trophozoites. Transmitted directly trophozoite-to-trophozoite via sexual contact → colonise vaginal/urethral epithelium → binary fission → trophozoites shed in secretions',
    diagnosis:
      'Wet mount microscopy (trophozoites with jerky motility); NAAT (most sensitive); culture; point-of-care antigen tests',
    treatment:
      'Metronidazole 2 g single dose (or 500 mg BID × 7d); tinidazole 2 g single dose; treat all partners simultaneously',
    prevention: 'Barrier contraception (condoms); partner treatment; STI screening',
    zoonotic: false,
    notifiable: false,
    rareFacts: [
      "Trichomonas is the most common non-viral STI in the world — yet ~70% of infected people have no symptoms and unknowingly transmit it.",
      "The trophozoite has five flagella (four anterior, one recurrent) giving it a characteristic jerky tumbling motility — visible on wet mount within minutes.",
      "T. vaginalis has the largest genome of any known protozoan parasite (~160 Mb, 60,000 genes) — more genes than a human, most derived from horizontal gene transfer.",
      "Infection increases HIV-1 susceptibility 2–3 fold by disrupting vaginal mucosal integrity and recruiting HIV-susceptible CD4+ cells.",
      "Metronidazole-resistant strains are emerging globally; Australian cases of treatment failure have increased since 2022 — culture and susceptibility testing now recommended for recurrent cases.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=454',
    imageAlt: 'Trichomonas vaginalis trophozoites — pear-shaped with flagella (wet mount)',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=17266',
    video: 'https://www.youtube.com/embed/rF4SgRdqPj8',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/trichomoniasis/modules/Trichomonas_LifeCycle_lg.jpg',
  },

  // ── 7. TRYPANOSOMA (SLEEPING SICKNESS) ───────────────────────────────────
  {
    id: 7,
    name: 'Trypanosoma brucei',
    common: 'Sleeping Sickness',
    cat: 'protozoa',
    risk: 'high',
    hosts: ['human', 'cattle', 'wildlife', 'tsetse fly'],
    region: 'Sub-Saharan Africa — 36 countries at risk; imported to Australia via travel',
    regionEmoji: '🌍',
    transmission: 'Bite of infected tsetse fly (Glossina spp.); rarely congenital/transfusion',
    symptoms: [
      'Stage 1 (haemolymphatic): fever, headache, joint pain, lymphadenopathy',
      "Winterbottom's sign: posterior cervical lymph node swelling",
      'Stage 2 (neurological): sleep-wake cycle disruption, personality change, confusion',
      'Progressive encephalopathy, coma, and death if untreated',
      'Circadian rhythm collapse — daytime sleeping, nighttime agitation',
    ],
    lifecycle:
      'Tsetse fly injects metacyclic trypomastigotes → proliferate in blood/lymph (Stage 1) → cross blood-brain barrier (Stage 2) → tsetse fly ingests trypomastigotes from blood meal → transform in midgut → migrate to salivary glands → infective metacyclic forms',
    diagnosis:
      'Blood/CSF microscopy (classic chancre smear); card agglutination test (CATT); PCR; lymph node aspirate; CSF cell count (>5 WBC/µL = Stage 2)',
    treatment:
      'Stage 1: pentamidine (T. b. gambiense) or suramin (T. b. rhodesiense). Stage 2: eflornithine+nifurtimox combination (NECT); fexinidazole (oral, 2019 approval)',
    prevention:
      'Tsetse fly avoidance (neutral-coloured clothing, repellents); no approved vaccine; vector control programs',
    zoonotic: true,
    notifiable: true,
    rareFacts: [
      "Trypanosoma constantly switches its surface coat (Variant Surface Glycoprotein — VSG), cycling through >1,000 antigenic variants to evade immune destruction — making vaccine development extremely difficult.",
      "The Stage 2 neurological disease earned its name 'sleeping sickness' because infected patients sleep during the day (not night), with a completely inverted circadian rhythm.",
      "T. b. rhodesiense progresses to Stage 2 in weeks; T. b. gambiense takes months to years — two genetically distinct subspecies causing dramatically different clinical courses.",
      "Fexinidazole (approved 2018–2019) was the first all-oral treatment for Stage 2 sleeping sickness — after decades of toxic IV drugs that killed up to 5% of treated patients.",
      "Australian cases are exclusively imported — travellers to East/West Africa on safari or humanitarian missions. Only ~3–5 cases per decade are reported in Australia.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1356',
    imageAlt: 'Trypanosoma brucei trypomastigotes in blood smear — Giemsa stain',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=2939',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/trypanosomiasisafrican/modules/TrypAfrican_LifeCycle_lg.jpg',
  },

  // ── 8. LEISHMANIA ─────────────────────────────────────────────────────────
  {
    id: 8,
    name: 'Leishmania donovani',
    common: 'Leishmaniasis',
    cat: 'protozoa',
    risk: 'high',
    hosts: ['human', 'dog', 'rodent', 'sandfly'],
    region: 'South Asia, East Africa, South America, Mediterranean — imported to Australia',
    regionEmoji: '🌏',
    transmission: 'Bite of infected female phlebotomine sandfly (Phlebotomus/Lutzomyia)',
    symptoms: [
      'Cutaneous: painless skin ulcer (Aleppo boil) at bite site',
      'Mucocutaneous: destructive lesions of nose, mouth, throat (Espundia)',
      'Visceral (kala-azar): fever, weight loss, massive splenomegaly, anaemia, hypergammaglobulinaemia',
      'Visceral: 90–95% fatal if untreated',
      'Post-kala-azar dermal leishmaniasis (PKDL): skin rash months after cure',
    ],
    lifecycle:
      'Sandfly injects promastigotes (flagellated) → engulfed by macrophages → transform to amastigotes (non-flagellated) → multiply in macrophages → cell ruptures → new macrophages infected → sandfly ingests amastigotes during blood meal → promastigotes develop in midgut → migrate to proboscis',
    diagnosis:
      'Spleen/bone marrow/lymph node aspirate microscopy; rK39 antigen rapid test; PCR; culture (Novy-MacNeal-Nicolle medium)',
    treatment:
      'Visceral: liposomal amphotericin B (first-line, Australia); miltefosine (oral, India); pentamidine. Cutaneous: intralesional antimony or topical paromomycin',
    prevention: 'Sandfly repellents (DEET); bed nets; insecticide-treated nets; dog treatment',
    zoonotic: true,
    notifiable: true,
    rareFacts: [
      "Visceral leishmaniasis (kala-azar) means 'black fever' in Hindi — infected skin turns dark due to cortisol disruption and adrenal involvement.",
      "Leishmania amastigotes survive inside macrophages — the very immune cells that should destroy them — by inhibiting phagolysosomal fusion and pH acidification.",
      "Dogs are the main urban reservoir for L. infantum in southern Europe and Brazil — dog ownership restrictions have become controversial public health policy in affected regions.",
      "Liposomal amphotericin B (AmBisome) achieves >95% cure rates in visceral leishmaniasis with a single-dose regimen — a major clinical advance over the toxic antimonials used for 80 years.",
      "Australian cases are imported — travellers to India, Bangladesh, East Africa, and the Middle East. A local sandfly (Phlebotomus sp.) exists in northern QLD but is not currently a competent vector.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=3751',
    imageAlt: 'Leishmania donovani amastigotes inside macrophage — Giemsa stain',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=613',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/leishmaniasis/modules/Leishmania_LifeCycle_lg.jpg',
  },

  // ── 9. ASCARIS ────────────────────────────────────────────────────────────
  {
    id: 9,
    name: 'Ascaris lumbricoides',
    common: 'Giant Roundworm',
    cat: 'nematode',
    risk: 'medium',
    hosts: ['human'],
    region: 'Worldwide (especially tropical/subtropical) — ~800 million infected globally',
    regionEmoji: '🌍',
    transmission: 'Ingestion of embryonated eggs from contaminated soil/food/water',
    symptoms: [
      "Löffler's syndrome: cough, wheeze, eosinophilia during larval lung migration",
      'Abdominal pain and distension',
      'Nausea and vomiting',
      'Nutritional deficiency and growth stunting in children',
      'Intestinal obstruction (heavy infection)',
      'Biliary/pancreatic obstruction from worm migration',
      'Many light infections are asymptomatic',
    ],
    lifecycle:
      'Embryonated eggs ingested → hatch in small intestine → larvae penetrate gut wall → migrate via portal vein to liver → right heart → lungs (alveoli) → trachea → swallowed → mature adult worms in small intestine → adults live 1–2 years → females lay 200,000+ eggs/day → eggs passed in faeces → embryonate in soil (2–4 weeks)',
    diagnosis:
      'Stool O&P microscopy (characteristic mammillated eggs); ELISA; eosinophilia on CBC during larval phase',
    treatment: 'Albendazole 400 mg single dose OR mebendazole 500 mg single dose (>95% cure)',
    prevention: 'Sanitation; hand hygiene; avoid raw produce fertilised with human faeces',
    zoonotic: false,
    notifiable: false,
    rareFacts: [
      "Ascaris females can lay up to 200,000 eggs per day — and eggs can survive in soil for up to 10 years, remaining infectious through freezing and extreme heat.",
      "Adults are the largest human intestinal nematode — females reach 20–35 cm, males 15–30 cm. In heavy infections, a single person can harbour hundreds of worms.",
      "During heavy infection, worms can migrate up the bile duct or pancreatic duct, causing acute biliary colic or pancreatitis — occasionally requiring endoscopic removal.",
      "Ascariasis has been identified in ancient mummies from Egypt (~800 BC) and is mentioned in the Ebers Papyrus, the oldest medical text describing intestinal worms.",
      "Australia eliminated endemic ascariasis through improved sanitation in the 20th century, but cases persist in some remote Queensland communities and among travellers from endemic regions.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=327',
    imageAlt: 'Ascaris lumbricoides fertilised egg with mammillated coat — unstained microscopy',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=489',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/ascariasis/modules/Ascaris_LifeCycle_lg.jpg',
  },

  // ── 10. STRONGYLOIDES ─────────────────────────────────────────────────────
  {
    id: 10,
    name: 'Strongyloides stercoralis',
    common: 'Threadworm',
    cat: 'nematode',
    risk: 'high',
    hosts: ['human', 'dog'],
    region: 'Tropical and subtropical regions — endemic in northern and central Australia',
    regionEmoji: '🌏',
    transmission: 'Filariform larvae penetrate skin (bare feet); autoinfection; rarely oral',
    symptoms: [
      "Larva currens: rapidly moving urticarial rash on skin (autoinfection track marks)",
      'Abdominal pain, diarrhoea, nausea',
      'Loeffler-like pulmonary eosinophilia during lung migration',
      'Hyperinfection syndrome (immunocompromised): massive larval dissemination, sepsis, meningitis',
      'Disseminated strongyloidiasis: up to 85% fatal if untreated',
    ],
    lifecycle:
      'Free-living rhabditiform larvae in soil → filariform (infective) larvae penetrate skin → migrate via blood to lungs → trachea → swallowed → mature in small intestine → parthenogenetic females lay eggs → rhabditiform larvae hatch in intestine → autoinfection cycle: larvae penetrate colon wall or perianal skin → re-migrate → indefinite infection without re-exposure',
    diagnosis:
      'Stool O&P (low sensitivity, multiple samples needed); agar plate culture; Baermann technique; serology (ELISA); PCR',
    treatment:
      'Ivermectin 200 µg/kg × 2 doses (drug of choice); albendazole alternative. Hyperinfection: daily ivermectin until stool clears',
    prevention: 'Wear footwear in endemic areas; sanitation; screen immunocompromised patients before corticosteroid use',
    zoonotic: true,
    notifiable: false,
    rareFacts: [
      "Strongyloides is unique among helminths in its capacity for autoinfection — larvae can re-infect through the colon or perianal skin, establishing decades-long infections without any re-exposure.",
      "World War II veterans were still harbouring active Strongyloides infections from the Pacific campaign 40+ years later when immunosuppression triggered fatal hyperinfection syndrome.",
      "Hyperinfection syndrome can occur when patients with undiagnosed Strongyloides receive corticosteroids — the larvae carry gut bacteria into the bloodstream, causing Gram-negative sepsis and meningitis.",
      "Strongyloides is the only helminth with a free-living reproductive cycle in soil — populations can persist and multiply in the environment without requiring a human host.",
      "Northern Queensland and remote central Australian Aboriginal communities have Strongyloides seroprevalence rates of 30–60% — one of the highest in any non-tropical country.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=618',
    imageAlt: 'Strongyloides stercoralis rhabditiform larvae in stool — wet mount',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=619',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/strongyloidiasis/modules/Strongyloides_LifeCycle_lg.jpg',
  },

  // ── 11. ONCHOCERCA (RIVER BLINDNESS) ─────────────────────────────────────
  {
    id: 11,
    name: 'Onchocerca volvulus',
    common: 'River Blindness',
    cat: 'nematode',
    risk: 'high',
    hosts: ['human', 'Simulium blackfly'],
    region: 'Sub-Saharan Africa (99%), Yemen, Latin America — near fast-flowing rivers',
    regionEmoji: '🌍',
    transmission: 'Bite of infected female Simulium blackfly (breeds in fast-flowing rivers)',
    symptoms: [
      'Intense pruritus (severe itching) — often the dominant symptom',
      'Subcutaneous nodules (onchocercomata) containing adult worms',
      'Microfilariae migrate to cornea → punctate keratitis → sclerosing keratitis → blindness',
      'Atrophic skin changes: "lizard skin" (lichenified onchodermatitis)',
      'Lymphedema (hanging groin) in advanced cases',
    ],
    lifecycle:
      'Blackfly injects L3 larvae → migrate to subcutaneous tissue → mature in nodules (worms live 10–15 years) → copulate → females produce 1,000 microfilariae/day → microfilariae migrate to skin and eyes → blackfly ingests microfilariae during blood meal → develop to L3 in 1–2 weeks',
    diagnosis:
      'Skin-snip microscopy (microfilariae); Mazzotti test (DEC provocation); OCT for ocular microfilariae; PCR; antibody tests',
    treatment:
      'Ivermectin (kills microfilariae; annual or semi-annual dosing via mass drug administration programs)',
    prevention: 'Community mass ivermectin distribution; blackfly vector control (organophosphate larviciding)',
    zoonotic: false,
    notifiable: true,
    rareFacts: [
      "River blindness is the world's second leading infectious cause of blindness — approximately 1.1 million people have been blinded and 500,000 visually impaired.",
      "The Onchocerciasis Control Programme (1974–2002) eliminated transmission across 11 West African countries by aerial larviciding of river breeding sites — one of the greatest public health achievements.",
      "Ivermectin was donated free by Merck ('Mectizan Donation Program', since 1987) — over 300 million doses distributed per year make it the largest drug donation program in history.",
      "Adult Onchocerca worms live for up to 15 years, making elimination impossible without sustained annual treatment — a single missed dose year can allow microfilarial levels to rebound.",
      "Australian cases are exclusively imported; no competent Simulium vector exists in Australia. Risk limited to travellers/aid workers in sub-Saharan Africa.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1378',
    imageAlt: 'Onchocerca volvulus microfilariae in skin-snip microscopy',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1380',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/onchocerciasis/modules/Onchocerca_LifeCycle_lg.jpg',
  },

  // ── 12. WUCHERERIA (LYMPHATIC FILARIASIS) ─────────────────────────────────
  {
    id: 12,
    name: 'Wuchereria bancrofti',
    common: 'Lymphatic Filariasis',
    cat: 'nematode',
    risk: 'high',
    hosts: ['human', 'Culex mosquito'],
    region: 'Tropical Asia, Africa, Pacific — eliminated from Australia, risk in PNG & Pacific Islands',
    regionEmoji: '🌏',
    transmission: 'Bite of infected Culex, Anopheles, or Aedes mosquito',
    symptoms: [
      'Acute lymphadenitis and lymphangitis (filarial fever)',
      'Elephantiasis: massive lymphedema of legs, arms, genitals',
      'Hydrocele (scrotal lymphedema — most common manifestation)',
      'Tropical pulmonary eosinophilia: nocturnal cough, wheeze, high IgE',
      'Many infections asymptomatic but cause subclinical lymphatic damage',
    ],
    lifecycle:
      'Mosquito injects L3 larvae → migrate to lymphatic vessels → mature adults (6–12 months) → females release microfilariae into bloodstream (peak at night = nocturnal periodicity) → mosquito ingests microfilariae during blood meal → develop to L3 in thoracic muscles → migrate to proboscis',
    diagnosis:
      'Nocturnal blood smear for microfilariae (10 pm–2 am); antigen detection card test (Og4C3, ICT filariasis); ultrasound (filarial dance sign — live adults)',
    treatment:
      'Diethylcarbamazine (DEC) + albendazole (kills microfilariae and adult worms over time); ivermectin + albendazole in areas co-endemic with onchocerciasis',
    prevention: 'Mass drug administration programs; mosquito control; early treatment to prevent lymphedema',
    zoonotic: false,
    notifiable: true,
    rareFacts: [
      "Wuchereria microfilariae display nocturnal periodicity — concentrating in peripheral blood between 10 pm and 2 am to synchronise with the nocturnal feeding habits of Culex mosquitoes.",
      "Lymphatic filariasis is the world's second leading cause of permanent disability — 36 million people live with lymphedema or hydrocele, profoundly impacting quality of life and economic productivity.",
      "The Global Programme to Eliminate Lymphatic Filariasis (GPELF) has distributed over 8 billion drug doses since 2000, reducing prevalence by 70% in targeted countries.",
      "Ultrasound can visualise live adult worms performing the characteristic 'filarial dance sign' — rapid, circular movements in dilated lymphatics — a pathognomonic finding.",
      "Australia eliminated local transmission in the early 20th century through mosquito control; however, Papua New Guinea and Pacific Island nations remain highly endemic and are primary sources of imported cases.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=367',
    imageAlt: 'Wuchereria bancrofti microfilariae in blood smear — sheathed, nocturnal form',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=369',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/lymphaticfilariasis/modules/Wuchereria_LifeCycle_lg.jpg',
  },

  // ── 13. TAENIA ────────────────────────────────────────────────────────────
  {
    id: 13,
    name: 'Taenia solium / Taenia saginata',
    common: 'Tapeworm',
    cat: 'cestode',
    risk: 'high',
    hosts: ['human', 'pig (T. solium)', 'cattle (T. saginata)'],
    region: 'Worldwide — T. solium endemic in Latin America, sub-Saharan Africa, Asia',
    regionEmoji: '🌍',
    transmission: 'Ingestion of undercooked infected pork (T. solium) or beef (T. saginata); T. solium eggs via fecal-oral (causes cysticercosis)',
    symptoms: [
      'Mild abdominal discomfort, nausea',
      'Proglottids (segments) passed in stool or crawling from anus',
      'Neurocysticercosis (T. solium larvae in brain): seizures, headache, hydrocephalus',
      'Ocular cysticercosis: floaters, vision loss',
      'Weight loss and nutritional deficiency in heavy infection',
    ],
    lifecycle:
      'Adult tapeworm in human small intestine → gravid proglottids shed in faeces → eggs ingested by pig/cattle → oncospheres hatch → penetrate gut wall → cysticerci form in muscle/brain (T. solium) → human eats undercooked meat → scolex evaginates → attaches to small intestine → grows up to 10 m over years',
    diagnosis:
      'Stool microscopy (proglottids/eggs); peri-anal tape test; serology (EITB) for cysticercosis; CT/MRI brain for neurocysticercosis',
    treatment:
      'Praziquantel single dose (intestinal tapeworm); praziquantel + corticosteroids + anticonvulsants for neurocysticercosis',
    prevention:
      'Cook pork/beef thoroughly (≥63°C); hand hygiene; sanitation; pork inspection',
    zoonotic: true,
    notifiable: false,
    rareFacts: [
      "Neurocysticercosis (T. solium larvae in the brain) accounts for up to 30% of epilepsy cases in endemic Latin American and African countries — making it the most common preventable cause of adult-onset seizures globally.",
      "Taenia saginata (beef tapeworm) can grow 4–10 metres long in the human intestine and live for 20+ years — one of the longest-lived parasites in humans.",
      "Diphyllobothrium latum (fish tapeworm) holds the length record: up to 15 metres — longer than a London double-decker bus.",
      "Historically, 'tapeworm diet pills' were sold in the early 1900s containing tapeworm segments — a dangerous quack remedy with documented deaths from neurocysticercosis.",
      "In Australia, T. saginata is occasionally found in beef in Queensland and NT; T. solium cysticercosis is rare and exclusively imported from endemic regions.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1398',
    imageAlt: 'Taenia solium scolex (head) with four suckers and rostellum of hooks',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1399',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/taeniasis/modules/Taenia_LifeCycle_lg.jpg',
  },

  // ── 14. ECHINOCOCCUS ──────────────────────────────────────────────────────
  {
    id: 14,
    name: 'Echinococcus granulosus',
    common: 'Hydatid Disease',
    cat: 'cestode',
    risk: 'high',
    hosts: ['dog (definitive)', 'sheep/cattle/human (intermediate)', 'fox (E. multilocularis)'],
    region: 'Australia — historically significant in rural sheep-farming regions; global',
    regionEmoji: '🌏',
    transmission: 'Ingestion of dog faeces-contaminated food/water containing Echinococcus eggs',
    symptoms: [
      'Hepatic cyst: right upper quadrant pain, hepatomegaly — often silent for years',
      'Pulmonary cyst: cough, haemoptysis, dyspnoea',
      'Anaphylaxis if cyst ruptures (highly immunogenic cyst fluid)',
      'Mass effect depending on cyst location',
      'E. multilocularis (alveolar): aggressive liver disease mimicking cancer',
    ],
    lifecycle:
      "Dog (definitive host) harbours adult tapeworm in small intestine → gravid segments shed eggs in faeces → intermediate host (sheep/cattle/human) ingests eggs → oncospheres hatch → penetrate intestine → migrate to liver (70%), lungs (20%), or other organs → hydatid cyst grows (1–5 cm/year) → contains protoscolices and brood capsules → dog eats infected offal → adult tapeworm develops",
    diagnosis:
      'Ultrasound (first-line); CT/MRI for cyst characterisation (WHO classification CE1–CE5); serology (ELISA, Western blot)',
    treatment:
      'PAIR procedure (Puncture-Aspiration-Injection-Reaspiration) with albendazole; surgical cystectomy; albendazole alone for inoperable cases',
    prevention:
      'Dog deworming programs (praziquantel); not feeding dogs raw offal; hand hygiene; avoid dog faeces contact in sheep districts',
    zoonotic: true,
    notifiable: true,
    rareFacts: [
      "Australia had one of the highest hydatid disease rates in the world in the 1960s–1980s due to the sheep-dog farming cycle in Queensland, NSW, and WA — a national eradication program launched in 1964 dramatically reduced cases.",
      "A single hydatid cyst can grow for decades, reaching >20 cm in diameter and containing millions of protoscolices — each capable of founding a new cyst if spilled during surgery.",
      "Cyst rupture (from trauma, surgery, or spontaneous) can cause immediate fatal anaphylaxis — surgeons must inject hypertonic saline or formalin into the cyst before incision.",
      "E. multilocularis (alveolar echinococcosis) has a mortality rate of 90–100% if untreated within 10 years — it invades surrounding liver tissue like a slow cancer with no distinct cyst wall.",
      "Rural Queensland sheep and cattle farmers remain a risk group; the current Australian program mandates regular deworming of all working farm dogs to interrupt the sheep-dog transmission cycle.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1347',
    imageAlt: 'Echinococcus granulosus protoscolices inside hydatid cyst fluid (hydatid sand)',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1348',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/echinococcosis/modules/Echinococcus_LifeCycle_lg.jpg',
  },

  // ── 15. SCHISTOSOMA ───────────────────────────────────────────────────────
  {
    id: 15,
    name: 'Schistosoma mansoni',
    common: 'Schistosomiasis (Bilharzia)',
    cat: 'trematode',
    risk: 'high',
    hosts: ['human', 'freshwater snail (Biomphalaria)'],
    region: 'Africa, Middle East, South America — freshwater contact; imported to Australia',
    regionEmoji: '🌍',
    transmission: 'Cercariae penetrate skin during freshwater contact (lakes, rivers, irrigation)',
    symptoms: [
      "Cercarial dermatitis: 'swimmer's itch' at penetration site",
      "Katayama fever (acute): fever, urticaria, eosinophilia, hepatosplenomegaly 4–8 weeks post-exposure",
      'Chronic: periportal fibrosis → portal hypertension → oesophageal varices → haematemesis',
      'S. haematobium: haematuria, bladder fibrosis, increased bladder cancer risk',
      'S. japonicum: more severe hepatosplenic disease; cerebral schistosomiasis possible',
    ],
    lifecycle:
      'Eggs passed in urine/faeces → hatch in fresh water → miracidia infect Biomphalaria snails → sporocysts develop → cercariae shed from snail → penetrate human skin → schistosomula migrate via blood to portal/mesenteric veins → adults pair (male enveloping female in gynaecophoric canal) → lay eggs (causes host granulomas)',
    diagnosis:
      'Stool/urine microscopy for eggs; Kato-Katz technique; serology (ELISA); PCR; rectal snip',
    treatment:
      'Praziquantel 40 mg/kg single dose (or 60 mg/kg for S. japonicum) — highly effective',
    prevention:
      'Avoid freshwater contact in endemic areas; no vaccine available; mass drug administration programs',
    zoonotic: false,
    notifiable: true,
    rareFacts: [
      "Schistosoma is the only digenean trematode that exists as male and female adults — the male forms a permanent groove (gynaecophoric canal) around the thinner female for their entire lifespan.",
      "The adult worms evade host immunity by coating themselves with host antigens — effectively camouflaging as 'self' tissue to avoid immune destruction.",
      "Schistosomiasis affects over 250 million people globally and causes an estimated 200,000 deaths per year — second only to malaria among parasitic diseases in public health impact.",
      "S. haematobium infection is a confirmed carcinogen (IARC Group 1) for bladder cancer — responsible for up to 10,000 bladder cancer deaths annually in Egypt alone.",
      "Australian cases are imported — Bali, Flores, and the Philippines are destinations increasingly associated with schistosome cercarial dermatitis, though S. mansoni/haematobium risk is highest in Africa.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1344',
    imageAlt: 'Schistosoma mansoni egg with lateral spine — concentrated stool preparation',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1345',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/schistosomiasis/modules/Schistosoma_LifeCycle_lg.jpg',
  },

  // ── 16. SARCOPTES (SCABIES) ───────────────────────────────────────────────
  {
    id: 16,
    name: 'Sarcoptes scabiei var. hominis',
    common: 'Scabies',
    cat: 'ectoparasite',
    risk: 'medium',
    hosts: ['human', 'dog (var. canis)', 'wildlife'],
    region: 'Worldwide — endemic in remote Aboriginal and Torres Strait Islander communities in Australia',
    regionEmoji: '🌏',
    transmission: 'Direct prolonged skin-to-skin contact; clothing/bedding in crusted scabies',
    symptoms: [
      'Intense nocturnal pruritus (hallmark)',
      'Burrows in web spaces of fingers, wrists, genitals, axillae',
      'Papules, vesicles, and secondary excoriation',
      'Crusted (Norwegian) scabies: hyperkeratotic plaques, thousands of mites — in immunocompromised',
      'Post-scabetic itch can persist weeks after treatment (hypersensitivity)',
      'Secondary bacterial infection (impetigo) → post-streptococcal glomerulonephritis risk',
    ],
    lifecycle:
      'Female mite burrows into stratum corneum → lays 2–3 eggs/day for 4–6 weeks → eggs hatch into larvae → progress through nymph stages → mature adults on skin surface → mate → fertilised female burrows again',
    diagnosis:
      'Clinical (burrow pattern, distribution, nocturnal itch); dermoscopy (jet aircraft sign); skin scraping + mineral oil microscopy (eggs, mites, faecal pellets); PCR',
    treatment:
      'Topical permethrin 5% cream (first-line, applied to whole body, repeat in 1 week); oral ivermectin 200 µg/kg × 2 doses. Treat all household contacts simultaneously',
    prevention: 'Treat household contacts simultaneously; wash and heat-dry clothing/bedding',
    zoonotic: true,
    notifiable: false,
    rareFacts: [
      "Scabies is endemic in many remote Queensland and Northern Territory Aboriginal communities, with prevalence rates of 20–50% in children — contributing to a serious epidemic of post-streptococcal complications including rheumatic heart disease.",
      "Crusted (Norwegian) scabies harbours up to 1 million mites per host (vs 10–15 in typical scabies) — the crust is a communicable reservoir that can survive on clothing and bedding for days.",
      "The characteristic 'nocturnal itch' is not caused by the mite biting but by the immune response to mite saliva, faeces, and eggs — patients can react intensely to as few as 10–15 mites.",
      "Sarcoptes scabiei penetrates the stratum corneum in less than 30 minutes using enzymatic secretions and serrated mouth parts — visible as a S-shaped burrow approximately 2–5 mm long.",
      "Australia's mass ivermectin treatment programs in remote communities have demonstrated dramatic reductions in bacterial skin infections (impetigo) and downstream reductions in rheumatic fever — a critical intervention for Indigenous health equity.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1407',
    imageAlt: 'Sarcoptes scabiei mite — ventral view showing legs and mouthparts',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1408',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/scabies/modules/Scabies_LifeCycle_lg.jpg',
  },

  // ── 17. IXODES (TICK) ─────────────────────────────────────────────────────
  {
    id: 17,
    name: 'Ixodes holocyclus / Ixodes scapularis',
    common: 'Paralysis Tick / Deer Tick',
    cat: 'ectoparasite',
    risk: 'high',
    hosts: ['bandicoot', 'possum', 'dog', 'cat', 'human', 'deer'],
    region: 'I. holocyclus: East Australian coast (QLD, NSW) — among the most dangerous ticks in the world',
    regionEmoji: '🌏',
    transmission: 'Tick attachment during questing (parks, garden, bushland); nymph ticks most often transmit pathogen',
    symptoms: [
      'Local reaction: erythema, pruritus at bite site',
      'Tick paralysis (I. holocyclus): ascending flaccid paralysis, ataxia — starts in legs, can paralyse breathing',
      'Allergic reaction / anaphylaxis (Alpha-Gal Syndrome risk)',
      'Lyme-like illness debate in Australia (DSCATT ongoing)',
      'I. scapularis: Lyme disease, anaplasmosis, babesiosis (North America)',
    ],
    lifecycle:
      'Egg hatches to 6-legged larva (seed tick) → feeds once on host → moults to 8-legged nymph → feeds once → moults to adult → adult female feeds, mates on host → engorged → drops off → lays 2,000–3,000 eggs in leaf litter → 3-year lifecycle',
    diagnosis:
      'Clinical (tick identification + paralysis signs); ELISA/IFA for rickettsia or Borrelia antibodies; tick species identification (morphology or PCR)',
    treatment:
      'Tick paralysis: freeze tick with ether-based spray (kill first, never forcibly remove) → wait to desiccate and fall; ivermectin for animals. Symptom support; canine tick antivenom (for dogs)',
    prevention:
      'Light-coloured clothing, tuck pants into socks; DEET repellent; check skin after bushland; freeze tick before removal (freezing spray kills it in situ)',
    zoonotic: true,
    notifiable: false,
    rareFacts: [
      "Ixodes holocyclus, the Australian Paralysis Tick, produces Holocyclotoxin — the most potent tick neurotoxin known — which blocks presynaptic acetylcholine release, causing ascending flaccid paralysis that can kill within 48 hours if the tick is not removed.",
      "The freeze-before-removal technique is unique to Australian paralysis ticks — squeezing or pulling the tick causes it to inject more toxin, worsening paralysis. An ether-based spray (Tick Off, Wart-Mole Vanish) kills the tick in situ.",
      "Repeated tick bites sensitise some individuals to Alpha-Gal (a mammalian carbohydrate) — causing delayed anaphylaxis 4–8 hours after eating red meat, a condition now called Alpha-Gal Syndrome.",
      "Queensland's tick paralysis season peaks in spring and early summer (September–December) when nymph ticks are most active — particularly in the hinterland of Noosa, Sunshine Coast, and the Gold Coast.",
      "A fully engorged I. holocyclus female expands to approximately 13 mm — over 100 times her unfed body weight — before dropping off to lay up to 3,000 eggs in leaf litter.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=14734',
    imageAlt: 'Ixodes holocyclus (paralysis tick) — unfed female, dorsal view with scutum',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=2510',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/tickborne/modules/Ticks_LifeCycle_lg.jpg',
  },

  // ── 18. FASCIOLA (LIVER FLUKE) ────────────────────────────────────────────
  {
    id: 18,
    name: 'Fasciola hepatica',
    common: 'Liver Fluke',
    cat: 'trematode',
    risk: 'medium',
    hosts: ['sheep', 'cattle', 'human', 'freshwater snail (Lymnaea)'],
    region: 'Worldwide — endemic in Queensland and southern Australia in livestock',
    regionEmoji: '🌏',
    transmission: 'Ingestion of metacercariae on aquatic vegetation (watercress, water chestnuts)',
    symptoms: [
      'Acute phase: fever, right upper quadrant pain, hepatomegaly, eosinophilia (larval migration through liver)',
      'Chronic phase: biliary obstruction, cholangitis, jaundice',
      'Anaemia',
      'Halzoun: rare pharyngeal form from eating raw liver',
      'Often misdiagnosed as viral hepatitis or cholangiocarcinoma',
    ],
    lifecycle:
      'Eggs in faeces → miracidia hatch in water → infect Lymnaea snail → cercariae released → encyst as metacercariae on aquatic vegetation → ingested by mammalian host → excyst in duodenum → migrate through intestinal wall → peritoneal cavity → penetrate liver capsule → migrate through parenchyma → enter bile ducts → adults produce eggs (10+ years)',
    diagnosis:
      'Serology (ELISA, Fas2-ELISA — most sensitive in early acute phase); stool O&P (eggs — only positive in chronic phase); imaging (ultrasound, CT)',
    treatment:
      'Triclabendazole 10 mg/kg × 2 doses (drug of choice) — resistance emerging in livestock',
    prevention:
      'Avoid raw watercress from endemic areas; cook aquatic vegetables; livestock deworming',
    zoonotic: true,
    notifiable: false,
    rareFacts: [
      "Fasciola hepatica can migrate ectopically — cases of fluke larvae found in brain, eye, breast, skin, and peritoneal cavity are documented, mimicking tumours or bacterial abscesses.",
      "Triclabendazole resistance has been documented in Australian sheep and cattle — veterinary management challenges have public health implications as the resistant strains may colonise human cases.",
      "Queensland's Lockyer Valley and Darling Downs are significant endemic zones for ovine and bovine fasciolosis — with human cases linked to local watercress consumption or travel to endemic regions.",
      "The acute hepatic phase occurs 4–12 weeks before eggs appear in stool — meaning stool microscopy misses virtually all acute cases, and serology is essential for early diagnosis.",
      "Fasciola can live in human bile ducts for over 10 years, producing up to 25,000 eggs per day — chronic infection causes progressive biliary stenosis and secondary bacterial cholangitis.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1349',
    imageAlt: 'Fasciola hepatica adult fluke — leaf-shaped trematode with oral sucker',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1350',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/fascioliasis/modules/Fasciola_LifeCycle_lg.jpg',
  },

  // ── 19. TRICHINELLA ───────────────────────────────────────────────────────
  {
    id: 19,
    name: 'Trichinella spiralis',
    common: 'Trichinellosis',
    cat: 'nematode',
    risk: 'medium',
    hosts: ['pig', 'rat', 'bear', 'horse', 'human', 'marine mammals'],
    region: 'Worldwide — linked to undercooked pork, wild game, and bear meat',
    regionEmoji: '🌍',
    transmission: 'Ingestion of undercooked meat containing encysted larvae (nurse cells in muscle)',
    symptoms: [
      'Stage 1 (intestinal): diarrhoea, nausea, abdominal cramps (1–3 days post-infection)',
      'Stage 2 (invasion): fever, periorbital oedema, myalgia, eosinophilia',
      'Facial/periorbital oedema (classic early sign)',
      'Splinter haemorrhages under fingernails',
      'Myocarditis and encephalitis in heavy infections (life-threatening)',
    ],
    lifecycle:
      'Infected meat ingested → larvae excyst in stomach → invade small intestinal mucosa → mature to adults in 30–40 hours → females release larvae → larvae migrate via bloodstream to striated muscle → encyst in "nurse cells" (modified muscle fibre) → calcify → remain viable for years',
    diagnosis:
      'Clinical + exposure history; CBC (eosinophilia); serology (ELISA, Western blot — positive from week 3); muscle biopsy (cyst identification); PCR',
    treatment:
      'Albendazole 400 mg BID × 8–14 days (kills intestinal adults) + corticosteroids for severe myositis/myocarditis',
    prevention: 'Cook pork/game to ≥71°C; do not feed garbage to pigs; freeze meat (−20°C × 3 days)',
    zoonotic: true,
    notifiable: true,
    rareFacts: [
      "Trichinella is one of the only parasites where the same individual host serves as both the definitive (intestinal adult) and intermediate (muscle larva) host simultaneously.",
      "The 'nurse cell' is an extraordinary host-parasite co-adaptation — Trichinella transforms an existing muscle fibre into a capsule of connective tissue and blood vessels to nurture the larva for years.",
      "Australia is officially Trichinella-free in domestic pigs due to strict biosecurity — the rare Australian cases are linked to wild boar (Sus scrofa) hunted in Queensland and NSW.",
      "Napoleon's 1812 Moscow retreat has been linked by historians to a Trichinella outbreak from undercooked pork — modern analysis of contemporary medical reports describes symptoms consistent with trichinellosis.",
      "T. pseudospiralis (a non-encapsulating species) was first isolated in Australia from a quoll in Tasmania (1975) — it cannot form nurse cells, is harder to detect, and is the species found in Australian wildlife.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1212',
    imageAlt: 'Trichinella spiralis larvae encysted in skeletal muscle — H&E stain',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1204',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/trichinellosis/modules/Trichinella_LifeCycle_lg.jpg',
  },

  // ── 20. CLONORCHIS (CHINESE LIVER FLUKE) ─────────────────────────────────
  {
    id: 20,
    name: 'Clonorchis sinensis',
    common: 'Chinese Liver Fluke',
    cat: 'trematode',
    risk: 'medium',
    hosts: ['human', 'fish-eating mammals', 'freshwater fish', 'snail'],
    region: 'East Asia — major risk for Southeast Asian communities in Queensland',
    regionEmoji: '🌏',
    transmission: 'Ingestion of raw/undercooked freshwater fish containing metacercariae',
    symptoms: [
      'Mild: abdominal discomfort, anorexia, diarrhoea',
      'Biliary obstruction: jaundice, right upper quadrant pain, cholangitis',
      'Recurrent pyogenic cholangitis',
      'Cholangiocarcinoma (biliary cancer) — IARC Group 1 carcinogen',
      'Pancreatitis',
    ],
    lifecycle:
      'Eggs in faeces → miracidia infect freshwater snail (Bithynia) → cercariae released → penetrate freshwater fish skin → encyst as metacercariae in muscle → ingested by human → excyst in duodenum → migrate up bile duct → mature adults in biliary tree → live 25–30 years',
    diagnosis:
      'Stool O&P (eggs); serology (ELISA); imaging (biliary dilation on ultrasound/MRCP)',
    treatment: 'Praziquantel 75 mg/kg in 3 divided doses over 2 days',
    prevention: 'Cook freshwater fish thoroughly; avoid raw fish dishes (sashimi from endemic areas)',
    zoonotic: true,
    notifiable: false,
    rareFacts: [
      "Clonorchis sinensis is classified by the IARC as a Group 1 biological carcinogen — chronic infection causes recurrent cholangitis and is directly responsible for cholangiocarcinoma (bile duct cancer).",
      "Adult flukes live in the bile ducts for 25–30 years, producing persistent mechanical irritation and carcinogenic bile metabolites — some patients are unaware of their infection until cancer is diagnosed.",
      "Queensland's Southeast Asian communities represent the highest-risk group in Australia — recent immigrants from Vietnam, China, and Korea who consumed raw freshwater fish (gỏi cá, yusheng) may carry decades-old infections.",
      "The 1990 discovery that Clonorchis eggs can be visualised on ERCP cholangiopancreatography (appearing as filling defects in the bile duct) transformed both diagnosis and treatment planning.",
      "Praziquantel's mechanism against Clonorchis is fascinating — it causes rapid calcium influx into the fluke's tegument, inducing tetanic muscle contraction and disrupting the worm's nutrient absorption.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1340',
    imageAlt: 'Clonorchis sinensis adult fluke — oval, transparent, visible reproductive organs',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1338',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/clonorchiasis/modules/Clonorchis_LifeCycle_lg.jpg',
  },

  // ── 21. TUNGA (JIGGER FLEA) ───────────────────────────────────────────────
  {
    id: 21,
    name: 'Tunga penetrans',
    common: 'Jigger Flea',
    cat: 'ectoparasite',
    risk: 'medium',
    hosts: ['human', 'dog', 'pig', 'rat'],
    region: 'Sub-Saharan Africa, Latin America, Caribbean — imported to Australia via travel',
    regionEmoji: '🌍',
    transmission: 'Fertilised female flea burrows into skin (usually between toes or under toenails)',
    symptoms: [
      'Intense itching and pain at penetration site (toe webs, soles)',
      'Visible white nodule with central black dot (posterior end of flea)',
      'Perilesional inflammation, erythema',
      'Secondary bacterial infection: cellulitis, necrotising fasciitis',
      'Tetanus risk from skin breach (endemic areas)',
      'Chronic infestation: nail loss, gangrene of toes',
    ],
    lifecycle:
      'Female flea burrows head-first into stratum corneum (usually feet) → anchors via mouthparts → abdomen expands as eggs develop (from 1 mm to 1 cm) → lays ~100 eggs over 2–3 weeks → eggs expelled through posterior opening → flea dies in situ → inflammation and necrosis around embedded corpse',
    diagnosis:
      'Clinical (characteristic lesion); dermoscopy (ring sign — flea posterior segment); surgical extraction',
    treatment:
      'Manual extraction with sterile needle/forceps (complete removal required); antiseptic; tetanus prophylaxis; antibiotics for secondary infection',
    prevention: 'Wear closed shoes in endemic areas; apply sand deter products; treat infested environments',
    zoonotic: true,
    notifiable: false,
    rareFacts: [
      "Tunga penetrans is the smallest known flea — unfertilised females are only 1 mm long, but after embedding and mating, expand to nearly 1 cm as eggs fill the abdomen.",
      "The jigger flea's posterior spiracles (breathing pores) protrude through the skin surface, appearing as a distinctive black dot at the centre of the white nodule — critical for field diagnosis.",
      "In heavily endemic communities in sub-Saharan Africa, children can harbour 30–100 embedded fleas simultaneously, causing severe mobility impairment and school absenteeism.",
      "Tungiasis is an emerging disease in popular Bali beach destinations and North Queensland's Cooktown-Cape York region after introduction — Australian travel medicine cases have increased since 2018.",
      "Traditional removal methods involving thorns, pins, and unsterile instruments increase the risk of serious secondary infections including tetanus — responsible for significant morbidity in resource-limited settings.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=19819',
    imageAlt: 'Tunga penetrans embedded female — white swollen lesion with black posterior dot between toes',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=19820',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/tungiasis/modules/Tunga_LifeCycle_lg.jpg',
  },

  // ── 22. ENTEROBIUS (PINWORM) ──────────────────────────────────────────────
  {
    id: 22,
    name: 'Enterobius vermicularis',
    common: 'Pinworm',
    cat: 'nematode',
    risk: 'low',
    hosts: ['human'],
    region: 'Worldwide — most common worm infection in Australian children',
    regionEmoji: '🌏',
    transmission: 'Fecal-oral; eggs on hands, bedding, toys, surfaces; autoinfection',
    symptoms: [
      'Perianal pruritus — classically worst at night (females migrate to lay eggs)',
      'Disturbed sleep in children',
      'Irritability',
      'Vulvovaginitis in girls (ectopic migration)',
      'Appendicitis (rarely — worms found incidentally in appendix specimens)',
      'Many infections are asymptomatic',
    ],
    lifecycle:
      'Eggs ingested → hatch in duodenum → larvae migrate to large intestine → mature adults in caecum/colon → gravid females migrate to perianal skin at night → lay 10,000–15,000 eggs → eggs infectious within 4–6 hours → hand-to-mouth autoinfection or new host',
    diagnosis:
      'Scotch tape test (morning, before bathing) — tape pressed to perianal skin, then to glass slide for microscopy; repeat × 3 days if negative',
    treatment:
      'Mebendazole 100 mg single dose OR albendazole 400 mg single dose — repeat in 2 weeks. Treat the entire household',
    prevention:
      'Hand hygiene (especially after toileting); wash bedding/underwear in hot water; trim fingernails; treat household simultaneously',
    zoonotic: false,
    notifiable: false,
    rareFacts: [
      "Pinworm is the most common worm infection in Australian children — up to 50% prevalence in childcare and school settings in Queensland according to some estimates.",
      "Enterobius eggs are incredibly adhesive — each egg has a sticky outer coat allowing it to cling to skin, surfaces, dust, and textiles, and remain infectious for up to 3 weeks at room temperature.",
      "Females lay their eggs exclusively at night, causing the characteristic 2 am itch that wakes children — a behavioural adaptation that maximises egg deposition on bedding and hands during scratching.",
      "Pinworm infection has been described since antiquity — eggs were identified in 10,000-year-old fossilised human faeces from Utah, USA, making it among the oldest documented human parasitic infections.",
      "Pinworm ectopic migration can carry eggs into the vagina, fallopian tubes, and peritoneum — with documented granulomatous lesions in pelvic laparoscopy specimens of girls with unexplained pelvic pain.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1423',
    imageAlt: 'Enterobius vermicularis female adult worm — visible with pointed tail (pin)',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1424',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/enterobiasis/modules/Enterobius_LifeCycle_lg.jpg',
  },

  // ── 23. NECATOR (HOOKWORM) ────────────────────────────────────────────────
  {
    id: 23,
    name: 'Necator americanus / Ancylostoma duodenale',
    common: 'Hookworm',
    cat: 'nematode',
    risk: 'medium',
    hosts: ['human'],
    region: 'Tropical/subtropical worldwide — endemic in northern Queensland and remote Aboriginal communities',
    regionEmoji: '🌏',
    transmission: 'Filariform larvae in contaminated soil penetrate bare skin (usually feet); oral ingestion for A. duodenale',
    symptoms: [
      "Ground itch: pruritic papular rash at penetration site (usually feet)",
      'Loeffler-like pulmonary syndrome during larval migration',
      'Iron deficiency anaemia (worms consume blood — each worm takes 0.03–0.2 mL/day)',
      'Protein-losing enteropathy',
      'Growth stunting and cognitive impairment in children (chronic)',
      'Fatigue, pallor, shortness of breath',
    ],
    lifecycle:
      'Eggs in faeces → hatch in soil → rhabditiform larvae → develop to infective filariform larvae in 5–10 days → penetrate skin → migrate via blood to lungs → trachea → swallowed → attach to small intestinal mucosa via buccal capsule → adults live 5–7 years → females lay 10,000–30,000 eggs/day',
    diagnosis:
      'Stool O&P (thin-shelled oval eggs); Harada-Mori filter paper culture for species ID; CBC (hypochromic microcytic anaemia, eosinophilia)',
    treatment:
      'Albendazole 400 mg single dose OR mebendazole 500 mg single dose; iron supplementation for anaemia',
    prevention:
      'Wear footwear in endemic areas; sanitation; larvae do not survive <18°C — distribution limited by temperature',
    zoonotic: false,
    notifiable: false,
    rareFacts: [
      "In the early 1900s, hookworm was called 'The Germ of Laziness' in the US South — chronic iron deficiency anaemia from hookworm infection caused the characteristic pallor and lethargy misattributed to racial inferiority by prejudiced contemporary physicians.",
      "2025 Australian clinical trials are deliberately using low-dose Necator americanus infections to treat Crohn's disease and coeliac disease — the 'hygiene hypothesis' in practice, using hookworm to dampen dysregulated immune responses.",
      "Hookworm is still endemic in some Queensland communities where children play barefoot in soil contaminated by faeces — infrastructure investment and footwear are more effective interventions than drug treatment alone.",
      "Ancylostoma duodenale has a survival strategy unique among hookworms: arrested larval development (hypobiosis) in host muscle tissue — larvae can pause development for months before completing migration, complicating mass drug administration campaigns.",
      "The global hookworm burden causes an estimated 22.1 million disability-adjusted life years (DALYs) annually — exceeding malaria in some measures of chronic disease burden.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1354',
    imageAlt: 'Hookworm egg in stool — thin-shelled with cleavage cells (Necator americanus)',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1355',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/hookworm/modules/Hookworm_LifeCycle_lg.jpg',
  },

  // ── 24. TOXOCARA ─────────────────────────────────────────────────────────
  {
    id: 24,
    name: 'Toxocara canis / Toxocara cati',
    common: 'Toxocariasis',
    cat: 'nematode',
    risk: 'medium',
    hosts: ['dog (T. canis)', 'cat (T. cati)', 'human (aberrant host)'],
    region: 'Worldwide — highly prevalent in Australian dogs and cats; seroprevalence 3–7% in humans',
    regionEmoji: '🌏',
    transmission: 'Ingestion of embryonated eggs from soil/sandpit contaminated with dog/cat faeces; geophagia (pica) in children; raw liver',
    symptoms: [
      'Visceral larva migrans: fever, hepatomegaly, eosinophilia, pulmonary infiltrates',
      'Ocular larva migrans: unilateral vision loss, uveitis, retinal granuloma — may be misdiagnosed as retinoblastoma',
      'Covert/common toxocariasis: cough, abdominal pain, eosinophilia (no organ-specific syndrome)',
      'Neurotoxocariasis: encephalitis, seizures (rare but serious)',
      'Most infections in healthy adults: asymptomatic seroconversion',
    ],
    lifecycle:
      'Eggs in dog/cat faeces embryonate in soil (2–4 weeks) → ingested by human → larvae hatch in small intestine → penetrate gut wall → migrate via blood/lymph → wander through tissues (liver, lungs, brain, eye) → cannot complete lifecycle in human → larvae remain in tissues for months-years encased in granulomas',
    diagnosis:
      'Serology (ELISA Toxocara ES antigen — most useful); CBC (eosinophilia); imaging (hepatic nodules, pulmonary infiltrates); ophthalmoscopy (ocular larva migrans); note: stool O&P is negative in humans',
    treatment:
      'Albendazole 400 mg BID × 5 days (visceral); corticosteroids for inflammatory complications; laser/vitrectomy for ocular larva migrans',
    prevention:
      'Regular deworming of dogs and cats (especially puppies); cover sandpits; hand hygiene; clean up pet faeces promptly',
    zoonotic: true,
    notifiable: false,
    rareFacts: [
      "Toxocara larvae can survive in human tissues for years, encased in granulomas — being re-activated by immunosuppression or pregnancy years after the original infection.",
      "Ocular toxocariasis can be misdiagnosed as retinoblastoma (childhood eye cancer) — historically leading to unnecessary enucleation (eye removal) before Toxocara serology was available.",
      "Australian sandpits and parks in Queensland have Toxocara egg contamination rates of 10–20% in some studies — an underappreciated public health risk for young children who play in soil.",
      "Puppies and kittens are far more infectious than adult animals — Toxocara larvae are activated in pregnant dogs by hormonal changes and transmitted transplacentally, so entire litters can be born infected.",
      "A 2024 Australian study found Toxocara seropositivity in 4.7% of children in outer Brisbane/Ipswich suburbs, with unsanctioned dog access to parks as the main risk factor — confirming urban transmission.",
    ],
    image: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=1436',
    imageAlt: 'Toxocara canis embryonated egg with larva inside — soil sample preparation',
    microImage: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=8555',
    video: '',
    lifecycleImage:
      'https://www.cdc.gov/dpdx/toxocariasis/modules/Toxocara_LifeCycle_lg.jpg',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/** All unique category values present in the dataset */
export const PARASITE_CATEGORIES = [
  ...new Set(PARASITES.map((p) => p.cat)),
] as const;

/** Filter parasites by category */
export const byCategory = (cat: Parasite['cat']) =>
  PARASITES.filter((p) => p.cat === cat);

/** Filter by risk level */
export const byRisk = (risk: Parasite['risk']) =>
  PARASITES.filter((p) => p.risk === risk);

/** Filter zoonotic-only */
export const ZOONOTIC = PARASITES.filter((p) => p.zoonotic);

/** Filter notifiable-only (relevant for Australian reporting) */
export const NOTIFIABLE_AU = PARASITES.filter((p) => p.notifiable);

/** Lookup by id */
export const getById = (id: number): Parasite | undefined =>
  PARASITES.find((p) => p.id === id);

/** Lookup by common name (case-insensitive) */
export const getByName = (name: string): Parasite | undefined =>
  PARASITES.find((p) => p.common.toLowerCase() === name.toLowerCase());
