import { Router, Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// ══════════════════════════════════════════════════════════════════════════════
// PARASITE ENCYCLOPEDIA DATA
// 25 parasites — Australian-focused, clinically accurate
// ══════════════════════════════════════════════════════════════════════════════

export const PARASITES = [
  {
    id: 'giardia',
    slug: 'giardia',
    common_name: 'Giardia',
    scientific_name: 'Giardia lamblia (Giardia intestinalis)',
    category: 'Protozoa',
    risk_level: 'moderate',
    australian_prevalence: 'common',
    description: 'One of the most common gut parasites in Australia. Often called "beaver fever", picked up from contaminated water including streams, rivers and poorly filtered tap water.',
    aliases: ['beaver fever', "traveller's diarrhoea"],
    regions: ['Worldwide', 'Australia', 'Tropical', 'Subtropical'],
    symptoms: ['Watery or greasy diarrhoea', 'Sulphur-smelling burps', 'Abdominal cramps and bloating', 'Nausea', 'Fatigue', 'Weight loss', 'Excess gas'],
    transmission: ['Contaminated water', 'Person-to-person (faecal-oral)', 'Contaminated food', 'Soil contact'],
    incubation_days: { min: 7, max: 14 },
    microscopy: 'Cysts: oval, 8–12 μm, 4 nuclei visible. Trophozoites: pear-shaped with 2 nuclei and 4 pairs of flagella.',
    sample_types: ['stool'],
    urgency_level: 'moderate',
    conventional_treatment: 'Metronidazole (Flagyl) or Tinidazole — prescription required',
    remedies: [
      { name: 'Berberine (Goldenseal, Barberry)', dosage: '400mg 3x daily', duration: '4 weeks', evidence: 'strong', notes: 'Most evidence-backed natural option' },
      { name: 'Oregano oil', dosage: '200mg 2x daily with meals', duration: '4 weeks', evidence: 'moderate', notes: null },
      { name: 'Wormwood (Artemisia absinthium)', dosage: '200mg 3x daily', duration: '3 weeks', evidence: 'moderate', notes: null },
    ],
    dietary_advice: ['Eliminate refined sugars and processed foods', 'Increase raw garlic consumption', 'Eat pumpkin seeds daily (¼ cup raw)', 'Coconut oil 2–3 tablespoons daily', 'Drink only filtered water'],
    prevention: ['Filter or boil water when travelling or camping', 'Wash hands regularly', 'Avoid swallowing water when swimming in natural water bodies'],
    affected_regions: ['Queensland', 'NSW', 'Victoria', 'All Australian states'],
  },
  {
    id: 'blastocystis',
    slug: 'blastocystis',
    common_name: 'Blastocystis',
    scientific_name: 'Blastocystis hominis',
    category: 'Protozoa',
    risk_level: 'low',
    australian_prevalence: 'very common',
    description: 'The most commonly found gut organism in Australian stool tests. Often asymptomatic, but linked to IBS-like symptoms and chronic gut issues. Many practitioners debate whether it needs treatment.',
    aliases: ['blasto'],
    regions: ['Worldwide', 'Australia'],
    symptoms: ['Intermittent diarrhoea', 'Abdominal pain', 'Bloating and gas', 'Nausea', 'Fatigue', 'Skin rashes (urticaria)', 'IBS-like symptoms', 'Often asymptomatic'],
    transmission: ['Contaminated water', 'Contaminated food', 'Person-to-person'],
    incubation_days: { min: 7, max: 30 },
    microscopy: 'Large central vacuole, 6–40 μm diameter. Vacuolar form most common in stool samples.',
    sample_types: ['stool'],
    urgency_level: 'low',
    conventional_treatment: 'Metronidazole or Trimethoprim-sulfamethoxazole — treatment controversial, often not required',
    remedies: [
      { name: 'Berberine', dosage: '400mg 3x daily', duration: '4–6 weeks', evidence: 'strong', notes: 'Best-supported natural treatment' },
      { name: 'Saccharomyces boulardii', dosage: '500mg 2x daily', duration: '4 weeks', evidence: 'moderate', notes: 'Probiotic yeast' },
    ],
    dietary_advice: ['Low-FODMAP diet to reduce symptoms', 'Eliminate refined carbohydrates', 'Stress management — stress worsens symptoms'],
    prevention: ['Drink filtered water', 'Wash produce thoroughly', 'Good hand hygiene'],
    affected_regions: ['All Australian states', 'Tropical Queensland'],
  },
  {
    id: 'cryptosporidium',
    slug: 'cryptosporidium',
    common_name: 'Cryptosporidium',
    scientific_name: 'Cryptosporidium parvum',
    category: 'Protozoa',
    risk_level: 'moderate',
    australian_prevalence: 'common',
    description: 'Unique because it is chlorine-resistant — it survives in swimming pools and treated water. A serious risk for immunocompromised people. Notable for several Australian waterborne outbreaks.',
    aliases: ['crypto'],
    regions: ['Worldwide', 'Australia'],
    symptoms: ['Profuse watery diarrhoea', 'Stomach cramps', 'Nausea and vomiting', 'Mild fever', 'Symptoms last 1–2 weeks in healthy people, much longer in immunocompromised'],
    transmission: ['Contaminated water (chlorine resistant)', 'Person-to-person', 'Animal contact', 'Swimming pools'],
    incubation_days: { min: 2, max: 10 },
    microscopy: 'Oocysts: round, 4–6 μm. Require acid-fast staining — appear pink/red on green background.',
    sample_types: ['stool'],
    urgency_level: 'moderate',
    conventional_treatment: 'Nitazoxanide (prescription) — no reliably effective treatment in immunocompromised',
    remedies: [
      { name: 'Bovine colostrum', dosage: '10g daily', duration: '4 weeks', evidence: 'moderate', notes: 'Some evidence for reducing duration' },
    ],
    dietary_advice: ['Stay well hydrated with bottled or filtered water', 'Oral rehydration salts if diarrhoea is severe'],
    prevention: ['Do not swim in pools for 2 weeks after symptoms resolve', 'Avoid swallowing pool water', 'Filter drinking water'],
    affected_regions: ['All Australian states'],
  },
  {
    id: 'entamoeba-histolytica',
    slug: 'entamoeba-histolytica',
    common_name: 'Amoeba / Amoebiasis',
    scientific_name: 'Entamoeba histolytica',
    category: 'Protozoa',
    risk_level: 'high',
    australian_prevalence: 'uncommon (higher in returned travellers)',
    description: 'Rare in Australia but a serious risk for returned travellers, especially from Southeast Asia, India, and sub-Saharan Africa. Can cause liver abscesses if untreated.',
    aliases: ['amoebic dysentery', 'amoebiasis'],
    regions: ['Tropical regions', 'Developing countries', 'Southeast Asia', 'India', 'Africa'],
    symptoms: ['Bloody diarrhoea (amoebic dysentery)', 'Severe abdominal cramps', 'Fever', 'Liver pain (if abscess)', 'Weight loss', 'Many carriers are asymptomatic'],
    transmission: ['Contaminated food and water', 'Person-to-person (faecal-oral)', 'Sexual contact'],
    incubation_days: { min: 7, max: 28 },
    microscopy: 'Cysts: 10–20 μm, 1–4 nuclei with central karyosome. Trophozoites may contain ingested red blood cells.',
    sample_types: ['stool'],
    urgency_level: 'high',
    conventional_treatment: 'Metronidazole followed by Diloxanide furoate — prescription required',
    remedies: [],
    dietary_advice: ['Medical treatment is essential — do not rely on natural remedies for this parasite'],
    prevention: ['Safe food and water practices when travelling', 'Peel or cook all food in high-risk areas', 'Bottled water only'],
    affected_regions: ['Returned travellers', 'Remote communities'],
  },
  {
    id: 'dientamoeba-fragilis',
    slug: 'dientamoeba-fragilis',
    common_name: 'Dientamoeba',
    scientific_name: 'Dientamoeba fragilis',
    category: 'Protozoa',
    risk_level: 'low',
    australian_prevalence: 'common (often missed)',
    description: 'Very commonly missed in standard stool tests because it has no cyst form — the specimen must be examined while still warm. Australian GPs are increasingly aware of this one.',
    aliases: ['D. fragilis'],
    regions: ['Worldwide', 'Australia'],
    symptoms: ['Loose stools', 'Abdominal pain', 'Fatigue', 'Loss of appetite', 'Nausea'],
    transmission: ['Possibly via pinworm eggs', 'Contaminated food/water', 'Faecal-oral'],
    incubation_days: { min: 7, max: 30 },
    microscopy: 'Trophozoite: 5–15 μm, characteristically bi-nucleate. No cyst form — requires fresh warm stool specimen.',
    sample_types: ['stool'],
    urgency_level: 'low',
    conventional_treatment: 'Doxycycline or Metronidazole — prescription required',
    remedies: [
      { name: 'Berberine', dosage: '400mg 3x daily', duration: '4 weeks', evidence: 'emerging', notes: null },
    ],
    dietary_advice: ['Reduce refined sugars', 'Support gut microbiome with fermented foods'],
    prevention: ['Good hand hygiene', 'Treat household members if pinworm is also present'],
    affected_regions: ['All Australian states'],
  },
  {
    id: 'pinworm',
    slug: 'pinworm',
    common_name: 'Pinworm / Threadworm',
    scientific_name: 'Enterobius vermicularis',
    category: 'Helminths',
    risk_level: 'low',
    australian_prevalence: 'very common (especially children)',
    description: 'The most common worm infection in Australia, particularly in school-age children. Highly contagious — entire households and classrooms often need treatment simultaneously.',
    aliases: ['threadworm', 'seat worm'],
    regions: ['Australia', 'Worldwide', 'Temperate climates'],
    symptoms: ['Intense perianal itch — especially at night', 'Disturbed sleep in children', 'Visible white thread-like worms around anus', 'Irritability', 'Teeth grinding (sometimes)'],
    transmission: ['Ingestion of eggs via contaminated hands/surfaces', 'Autoinfection', 'Contaminated bedding and clothing'],
    incubation_days: { min: 14, max: 42 },
    microscopy: 'Eggs: oval, 50–60 x 20–30 μm, asymmetric (one side flattened). Adult female: 8–13mm white worm. Scotch tape test perianally first thing morning before wiping.',
    sample_types: ['scotch tape test', 'visual inspection'],
    urgency_level: 'low',
    conventional_treatment: 'Mebendazole or Pyrantel pamoate (Combantrin) — available OTC in Australia. Treat entire household.',
    remedies: [
      { name: 'Raw pumpkin seeds', dosage: '¼ cup on empty stomach', duration: '3 days', evidence: 'traditional', notes: 'Contains cucurbitacin — paralyses worms' },
      { name: 'Coconut oil', dosage: '2 tbsp daily + apply topically around anus', duration: '2 weeks', evidence: 'traditional', notes: 'May reduce itch and eggs' },
      { name: 'Black walnut hull tincture', dosage: '1 tsp in water 3x daily', duration: '2 weeks', evidence: 'moderate', notes: null },
    ],
    dietary_advice: ['No sugar or refined carbs during treatment', 'Raw garlic daily', 'High-fibre diet to support gut motility'],
    prevention: ['Wash hands thoroughly — especially before eating and after toilet', 'Short fingernails', 'Daily showering', 'Wash bedding and underwear in hot water', 'Treat all household members simultaneously'],
    affected_regions: ['All Australian states', 'School-age children nationwide'],
  },
  {
    id: 'roundworm',
    slug: 'roundworm',
    common_name: 'Roundworm',
    scientific_name: 'Ascaris lumbricoides',
    category: 'Helminths',
    risk_level: 'moderate',
    australian_prevalence: 'rare (common in returned travellers)',
    description: 'The largest intestinal worm — adults can reach 35cm. Can cause a cough during the larval migration phase through the lungs before settling in the gut.',
    aliases: ['large roundworm'],
    regions: ['Tropical and subtropical regions', 'Developing countries', 'Southeast Asia'],
    symptoms: ['Cough during larval migration', 'Abdominal pain', 'Visible worms in stool (up to 35cm)', 'Nausea', 'Nutritional deficiencies in heavy infection'],
    transmission: ['Ingestion of soil-contaminated food or water', 'Contaminated hands', 'Unwashed vegetables'],
    incubation_days: { min: 60, max: 90 },
    microscopy: 'Fertilised eggs: oval, 45–70 μm, thick shell with mammillated outer coat, brown bile-stained.',
    sample_types: ['stool'],
    urgency_level: 'moderate',
    conventional_treatment: 'Mebendazole or Albendazole — prescription required',
    remedies: [
      { name: 'Papaya seeds', dosage: '1 tbsp ground with honey, morning empty stomach', duration: '7 days', evidence: 'moderate', notes: 'Contains carpaine' },
      { name: 'Wormwood', dosage: '200mg 3x daily', duration: '3 weeks', evidence: 'moderate', notes: null },
    ],
    dietary_advice: ['Wash all vegetables thoroughly', 'Peel fruit when travelling'],
    prevention: ['Wash hands before eating', 'Avoid raw produce in high-risk countries', 'Safe sanitation practices'],
    affected_regions: ['Returned travellers', 'Remote communities with poor sanitation'],
  },
  {
    id: 'hookworm',
    slug: 'hookworm',
    common_name: 'Hookworm',
    scientific_name: 'Ancylostoma duodenale / Necator americanus',
    category: 'Helminths',
    risk_level: 'moderate',
    australian_prevalence: 'uncommon (Indigenous communities in remote areas, returned travellers)',
    description: 'Enters through bare feet on contaminated soil. Can cause significant iron deficiency anaemia in heavy infections. Common in remote Northern Australia and Cape York.',
    aliases: ['ground itch worm'],
    regions: ['Tropical Australia', 'Northern Territory', 'Cape York', 'Developing countries'],
    symptoms: ['Itchy skin where larvae entered (ground itch)', 'Iron deficiency anaemia', 'Fatigue', 'Pale skin', 'Abdominal pain', 'Cough during migration'],
    transmission: ['Larval skin penetration (walking barefoot on contaminated soil)', 'Ingestion (Ancylostoma)'],
    incubation_days: { min: 42, max: 90 },
    microscopy: 'Eggs: oval, 55–75 x 35–40 μm, thin shell, 2–8 cell cleavage stage in fresh stool.',
    sample_types: ['stool', 'blood (for anaemia assessment)'],
    urgency_level: 'moderate',
    conventional_treatment: 'Mebendazole or Albendazole — prescription required. Iron supplementation for anaemia.',
    remedies: [
      { name: 'Thyme oil extract', dosage: '200mg 2x daily', duration: '4 weeks', evidence: 'emerging', notes: null },
    ],
    dietary_advice: ['Iron-rich foods: red meat, spinach, legumes', 'Vitamin C with meals to enhance iron absorption'],
    prevention: ['Wear shoes in soil-contaminated areas', 'Avoid walking barefoot in tropical regions', 'Improve sanitation'],
    affected_regions: ['Remote NT', 'Cape York', 'Tropical Queensland', 'Returned travellers from developing countries'],
  },
  {
    id: 'strongyloides',
    slug: 'strongyloides',
    common_name: 'Strongyloides (Threadworm)',
    scientific_name: 'Strongyloides stercoralis',
    category: 'Helminths',
    risk_level: 'high',
    australian_prevalence: 'common in Indigenous Australians, returned travellers',
    description: 'Unique among parasites — it can autoinfect, meaning it can persist in the body for decades without re-exposure. Dangerous and potentially fatal in immunocompromised patients (hyperinfection syndrome). Common in remote Indigenous communities.',
    aliases: ['threadworm (different from pinworm)', 'strongy'],
    regions: ['Tropical Queensland', 'Northern Territory', 'Remote Australia', 'Southeast Asia', 'Africa'],
    symptoms: ['Larva currens — fast-moving urticarial rash on trunk and buttocks', 'Abdominal pain', 'Diarrhoea', 'Cough', 'Can be asymptomatic for years', 'Hyperinfection in immunocompromised: severe and potentially fatal'],
    transmission: ['Skin penetration from contaminated soil', 'Autoinfection (unique — can persist lifelong without re-exposure)'],
    incubation_days: { min: 14, max: 42 },
    microscopy: 'Rhabditiform larvae in fresh stool: 180–380 μm. Short buccal cavity distinguishes from hookworm larvae.',
    sample_types: ['stool', 'blood (serology)'],
    urgency_level: 'high',
    conventional_treatment: 'Ivermectin (first line) — prescription required. MUST treat before starting immunosuppression.',
    remedies: [],
    dietary_advice: ['Medical treatment is essential for this parasite — do not rely on natural remedies'],
    prevention: ['Wear shoes in endemic areas', 'Screening recommended before immunosuppressive therapy', 'Screen Indigenous Australians from remote communities'],
    affected_regions: ['Remote NT', 'Remote Queensland', 'Cape York', 'Returned travellers from tropics'],
  },
  {
    id: 'tapeworm-beef',
    slug: 'tapeworm-beef',
    common_name: 'Beef Tapeworm',
    scientific_name: 'Taenia saginata',
    category: 'Helminths',
    risk_level: 'high',
    australian_prevalence: 'rare',
    description: 'Acquired from eating undercooked beef. Can grow several metres long in the intestine. Segments (proglottids) look like flat white rice grains or cucumber seeds and may be seen moving in underwear or stool.',
    aliases: ['beef tapeworm', 'Taenia'],
    regions: ['Worldwide', 'Areas with poorly inspected beef'],
    symptoms: ['Passage of flat white segments in stool or underwear', 'Mild abdominal discomfort', 'Increased appetite', 'Weight loss', 'Often minimal symptoms'],
    transmission: ['Eating undercooked beef containing cysticerci'],
    incubation_days: { min: 60, max: 90 },
    microscopy: 'Gravid proglottids: 16–20 uterine branches each side. Eggs: round, 30–40 μm, radially striated embryophore.',
    sample_types: ['stool', 'visual (segments)'],
    urgency_level: 'high',
    conventional_treatment: 'Praziquantel (single dose) — prescription required',
    remedies: [
      { name: 'Pumpkin seed protocol', dosage: '400g raw seeds blended with milk/honey, followed by castor oil after 2 hours', duration: '1 day treatment', evidence: 'traditional', notes: 'Traditional parasite purge — seek medical treatment first' },
    ],
    dietary_advice: ['Cook all beef to minimum 65°C internal temperature'],
    prevention: ['Cook beef thoroughly', 'Freeze beef at -10°C for 5 days before eating rare'],
    affected_regions: ['Returned travellers', 'Areas with limited meat inspection'],
  },
  {
    id: 'tapeworm-pork',
    slug: 'tapeworm-pork',
    common_name: 'Pork Tapeworm / Neurocysticercosis',
    scientific_name: 'Taenia solium',
    category: 'Helminths',
    risk_level: 'high',
    australian_prevalence: 'rare (returned travellers)',
    description: 'IMPORTANT: There are two distinct infections. Eating the adult worm from undercooked pork causes intestinal tapeworm (similar to beef tapeworm). But ingesting the EGGS (from contaminated food/hands) causes cysticercosis — cysts form in muscles and the BRAIN, causing seizures and headaches.',
    aliases: ['pork tapeworm', 'neurocysticercosis'],
    regions: ['Latin America', 'Sub-Saharan Africa', 'Southeast Asia', 'India'],
    symptoms: ['INTESTINAL: Passage of proglottids, mild gut symptoms', 'CYSTICERCOSIS: Seizures, headaches, visual disturbances, spinal symptoms', 'Neurological symptoms may appear years after exposure'],
    transmission: ['Undercooked pork (intestinal)', 'Ingestion of eggs from contaminated food or infected person (cysticercosis)'],
    incubation_days: { min: 60, max: 365 },
    microscopy: 'Scolex has 4 suckers plus rostellum with 2 rows of hooklets (distinguishes from T. saginata).',
    sample_types: ['stool', 'blood (serology)', 'MRI (neurocysticercosis)'],
    urgency_level: 'high',
    conventional_treatment: 'Praziquantel or Albendazole — urgent specialist referral for neurocysticercosis',
    remedies: [],
    dietary_advice: ['Medical treatment is essential — do not use natural remedies'],
    prevention: ['Cook pork thoroughly', 'Safe sanitation in endemic areas', 'Wash hands before eating'],
    affected_regions: ['Returned travellers from Latin America, SE Asia, Africa'],
  },
  {
    id: 'whipworm',
    slug: 'whipworm',
    common_name: 'Whipworm',
    scientific_name: 'Trichuris trichiura',
    category: 'Helminths',
    risk_level: 'moderate',
    australian_prevalence: 'rare (returned travellers, some remote communities)',
    description: 'Named for its whip-like shape. Mostly mild but heavy infections can cause bloody diarrhoea and even rectal prolapse in children. Very characteristic barrel-shaped eggs with bipolar plugs.',
    aliases: ['trichuris'],
    regions: ['Tropical and subtropical regions', 'Remote communities'],
    symptoms: ['Often asymptomatic in mild infection', 'Abdominal pain', 'Diarrhoea', 'Bloody stools in heavy infection', 'Rectal prolapse in severe cases'],
    transmission: ['Ingestion of embryonated eggs from contaminated soil or food'],
    incubation_days: { min: 60, max: 90 },
    microscopy: 'Distinctive football/barrel-shaped eggs, 50–55 x 20–22 μm, with bipolar plugs (plugs at each end), bile-stained brown shell.',
    sample_types: ['stool'],
    urgency_level: 'moderate',
    conventional_treatment: 'Mebendazole or Albendazole — prescription required',
    remedies: [
      { name: 'Papaya leaf extract', dosage: '20ml 2x daily', duration: '3 weeks', evidence: 'emerging', notes: null },
    ],
    dietary_advice: ['Wash all vegetables and fruit thoroughly'],
    prevention: ['Wash hands', 'Safe sanitation', 'Wash produce'],
    affected_regions: ['Remote NT', 'Cape York', 'Returned travellers'],
  },
  {
    id: 'scabies',
    slug: 'scabies',
    common_name: 'Scabies Mite',
    scientific_name: 'Sarcoptes scabiei',
    category: 'Ectoparasite',
    risk_level: 'moderate',
    australian_prevalence: 'common (crusted scabies endemic in Indigenous communities)',
    description: 'A microscopic mite that burrows into skin. The intense itch is caused by an allergic reaction to mite faeces. Crusted (Norwegian) scabies is a severe form endemic in remote Indigenous communities in Australia.',
    aliases: ['itch mite', 'Norwegian scabies (crusted form)'],
    regions: ['Worldwide', 'Remote Indigenous communities', 'Aged care facilities'],
    symptoms: ['Intense itch — worse at night', 'S-shaped burrow tracks between fingers, wrists, genitals', 'Pimple-like rash', 'Crusted thickened skin in severe cases'],
    transmission: ['Prolonged skin-to-skin contact', 'Sharing bedding/clothing (crusted scabies)'],
    incubation_days: { min: 14, max: 42 },
    microscopy: 'Adult mite: 0.3–0.45mm, round, 8 legs. Skin scraping in mineral oil — eggs (oval, 100–150 μm) and mites visible.',
    sample_types: ['skin scraping', 'visual inspection'],
    urgency_level: 'moderate',
    conventional_treatment: 'Permethrin 5% cream (OTC) or Ivermectin oral (prescription for crusted/outbreak). Treat entire household.',
    remedies: [
      { name: 'Tea tree oil (diluted 5%)', dosage: 'Apply to affected areas 2x daily', duration: '2 weeks', evidence: 'moderate', notes: 'Must be diluted — do not apply undiluted to skin' },
      { name: 'Neem oil', dosage: 'Apply to skin 2x daily', duration: '2 weeks', evidence: 'moderate', notes: null },
    ],
    dietary_advice: ['No specific dietary advice — focus on environmental decontamination'],
    prevention: ['Treat all household contacts simultaneously', 'Wash bedding/clothing at 60°C', 'Bag items that cannot be washed for 72 hours'],
    affected_regions: ['Remote NT', 'Remote Queensland', 'Aged care facilities', 'All Australian states'],
  },
  {
    id: 'head-lice',
    slug: 'head-lice',
    common_name: 'Head Lice',
    scientific_name: 'Pediculus humanus capitis',
    category: 'Ectoparasite',
    risk_level: 'low',
    australian_prevalence: 'very common (school-age children)',
    description: 'Extremely common in Australian primary schools. Nits (eggs) are glued to hair shafts close to the scalp. Cannot jump — spread only by direct head-to-head contact.',
    aliases: ['nits', 'lice'],
    regions: ['Worldwide', 'School environments', 'All Australian states'],
    symptoms: ['Scalp itch', 'Visible nits glued to hair shaft within 1cm of scalp', 'Moving lice visible at scalp', 'Sores from scratching'],
    transmission: ['Head-to-head contact (primary)', 'Sharing hats/brushes (rare)'],
    incubation_days: { min: 7, max: 14 },
    microscopy: 'Nits: oval, 0.8mm, glued to hair shaft. Adult: 2–3mm, 6 legs. Nymph: smaller version of adult.',
    sample_types: ['visual inspection', 'fine-tooth comb'],
    urgency_level: 'low',
    conventional_treatment: 'Permethrin 1% lotion or Maldison lotion (OTC). Conditioner and fine-tooth combing effective alternative.',
    remedies: [
      { name: 'Conditioner + fine-tooth comb', dosage: 'Apply conditioner, comb every 2 days', duration: '2 weeks', evidence: 'strong', notes: 'Most effective non-chemical method' },
      { name: 'Tea tree oil shampoo', dosage: 'Use as regular shampoo', duration: '2 weeks', evidence: 'moderate', notes: 'Preventive and treatment use' },
    ],
    dietary_advice: [],
    prevention: ['Tie long hair back at school', 'Regular checking with fine-tooth comb', 'Do not share hats, brushes, or hair accessories'],
    affected_regions: ['All Australian states', 'Primary schools nationwide'],
  },
  {
    id: 'demodex',
    slug: 'demodex',
    common_name: 'Demodex Face Mite',
    scientific_name: 'Demodex folliculorum / Demodex brevis',
    category: 'Ectoparasite',
    risk_level: 'low',
    australian_prevalence: 'universal in adults (nearly everyone has them)',
    description: 'Microscopic mites that live in hair follicles and sebaceous glands. Almost every adult human has them — they are a normal part of the skin microbiome at low numbers. Problems arise when populations overgrow.',
    aliases: ['eyelash mite', 'face mite'],
    regions: ['Worldwide — universal in adults'],
    symptoms: ['Usually none (normal flora)', 'Rosacea-like redness when overgrown', 'Blepharitis (eyelid inflammation)', 'Itchy eyelids', 'Rough skin texture'],
    transmission: ['Skin-to-skin contact during early childhood', 'Universal by adulthood'],
    incubation_days: { min: 14, max: 21 },
    microscopy: 'Elongated mite, 0.3–0.4mm, 8 stubby legs near head. Extracted from follicle by squeezing or tape strip.',
    sample_types: ['skin scraping', 'eyelash sampling'],
    urgency_level: 'low',
    conventional_treatment: 'Ivermectin cream or tea tree oil-based cleansers for symptomatic cases',
    remedies: [
      { name: 'Tea tree oil eyelid scrub (diluted)', dosage: 'Clean eyelids with diluted TTO daily', duration: '6 weeks', evidence: 'strong', notes: 'Keep away from eyes — use diluted formula' },
    ],
    dietary_advice: ['Reduce alcohol consumption (increases rosacea symptoms)', 'Anti-inflammatory diet'],
    prevention: ['Regular facial cleansing', 'Clean pillowcases frequently', 'Avoid sharing towels'],
    affected_regions: ['Universal — all adults'],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function toListItem(p: typeof PARASITES[0]) {
  return {
    id: p.id,
    slug: p.slug,
    common_name: p.common_name,
    scientific_name: p.scientific_name,
    category: p.category,
    risk_level: p.risk_level,
    australian_prevalence: p.australian_prevalence,
    description: p.description,
    affected_regions: p.affected_regions,
    urgency_level: p.urgency_level,
    sample_types: p.sample_types,
    symptom_count: p.symptoms.length,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/encyclopedia
// Public — returns list view (no sensitive detail)
router.get('/', (_req: Request, res: Response) => {
  try {
    const { search, category } = _req.query as Record<string, string>;
    let results = PARASITES;

    if (search?.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(p =>
        p.common_name.toLowerCase().includes(q) ||
        p.scientific_name.toLowerCase().includes(q) ||
        p.aliases.some(a => a.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (category?.trim()) {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    res.json({
      parasites: results.map(toListItem),
      total: results.length,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch encyclopedia' });
  }
});

// GET /api/encyclopedia/categories
// Public
router.get('/categories', (_req: Request, res: Response) => {
  const counts: Record<string, number> = {};
  PARASITES.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  res.json({
    categories: Object.entries(counts).map(([category, count]) => ({ category, count })),
  });
});

// GET /api/encyclopedia/:slug
// 🔒 Protected — requires login to see full detail
router.get('/:slug', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const parasite = PARASITES.find(p => p.slug === slug || p.id === slug);

    if (!parasite) {
      return res.status(404).json({ error: 'Parasite not found' });
    }

    // Full detail — only for logged-in users
    res.json({ parasite });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch parasite details' });
  }
});

// POST /api/encyclopedia/seed (legacy compatibility — returns success, data is hardcoded now)
router.post('/seed', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Encyclopedia is ready', count: PARASITES.length });
});

export default router;
