/**
 * parasiteEncyclopedia.js
 * Comprehensive parasite database for ParasitePro
 * 25 parasites covering protozoa, helminths, and ectoparasites
 * Includes Australian prevalence data, holistic treatments, and educational info
 */

export const PARASITE_DATABASE = [
  // ─── PROTOZOA ────────────────────────────────────────────────────────────────
  {
    id: 'giardia-001',
    commonName: 'Giardia',
    scientificName: 'Giardia lamblia (Giardia intestinalis)',
    type: 'protozoa',
    aliases: ['beaver fever', 'traveller\'s diarrhoea'],
    australianPrevalence: 'common',
    regions: ['worldwide', 'tropical', 'subtropical', 'Australia'],
    transmission: ['contaminated water', 'person-to-person contact', 'contaminated food', 'soil contact'],
    symptoms: [
      'Watery or greasy diarrhoea', 'Abdominal cramps and bloating',
      'Nausea', 'Fatigue', 'Weight loss', 'Excess gas',
      'Sulphur-smelling burps', 'Symptoms typically 1–3 weeks after exposure'
    ],
    lifeStages: ['trophozoite', 'cyst'],
    incubationDays: { min: 7, max: 14 },
    urgencyLevel: 'moderate',
    sampleTypes: ['stool'],
    microscopyAppearance: 'Cysts: oval, 8–12 μm, 4 nuclei visible. Trophozoites: pear-shaped with 2 nuclei and 4 pairs of flagella.',
    holistic: {
      herbal: [
        { name: 'Berberine (Goldenseal, Barberry, Oregon Grape)', dose: '400mg 3x daily', evidence: 'strong' },
        { name: 'Black walnut hull extract', dose: '500mg 2x daily', evidence: 'moderate' },
        { name: 'Oregano oil', dose: '200mg 2x daily with meals', evidence: 'moderate' },
        { name: 'Wormwood (Artemisia absinthium)', dose: '200mg 3x daily', evidence: 'moderate' }
      ],
      dietary: [
        'Eliminate refined sugars and processed foods — parasites feed on glucose',
        'Increase garlic consumption (raw is most effective)',
        'Eat pumpkin seeds daily (1/4 cup raw) — contain cucurbitacin',
        'Coconut oil 2–3 tablespoons daily for lauric acid content',
        'Stay well hydrated with filtered water only',
        'Avoid alcohol during treatment',
        'Consider a 3-day liquid fast to starve the parasite'
      ],
      supplements: [
        { name: 'Probiotics (Lactobacillus acidophilus)', dose: '10–50 billion CFU daily', reason: 'Restore gut flora' },
        { name: 'Zinc', dose: '30mg daily with food', reason: 'Immune support' },
        { name: 'Vitamin C', dose: '1000mg 3x daily', reason: 'Antioxidant and immune support' },
        { name: 'Digestive enzymes', dose: 'With each meal', reason: 'Support digestion during recovery' }
      ],
      lifestyle: [
        'Wash hands thoroughly before eating and after toilet',
        'Avoid swimming in natural water bodies during treatment',
        'Wash all produce in filtered water',
        'Treat all household members simultaneously to prevent reinfection'
      ],
      disclaimer: 'Holistic approaches may help support recovery but are not a substitute for medical treatment. Giardia often requires prescription antiparasitic medication.'
    },
    conventionalTreatment: 'Metronidazole (Flagyl) or Tinidazole — prescription required',
    prevention: [
      'Filter or boil water when travelling or camping',
      'Wash hands regularly',
      'Avoid swallowing water when swimming in lakes or rivers'
    ],
    australianResources: [
      'https://www.health.gov.au/diseases/giardiasis',
      'https://www.healthdirect.gov.au/giardia'
    ]
  },

  {
    id: 'blastocystis-001',
    commonName: 'Blastocystis',
    scientificName: 'Blastocystis hominis',
    type: 'protozoa',
    aliases: ['blasto'],
    australianPrevalence: 'very common',
    regions: ['worldwide', 'Australia'],
    transmission: ['contaminated water', 'contaminated food', 'person-to-person'],
    symptoms: [
      'Intermittent diarrhoea', 'Abdominal pain', 'Bloating and gas',
      'Nausea', 'Fatigue', 'Skin rashes (urticaria)', 'IBS-like symptoms',
      'Many carriers are asymptomatic'
    ],
    lifeStages: ['vacuolar form', 'granular form', 'amoeboid form', 'cyst'],
    incubationDays: { min: 7, max: 30 },
    urgencyLevel: 'low',
    sampleTypes: ['stool'],
    microscopyAppearance: 'Large central vacuole, 6–40 μm diameter. Vacuolar form most common in stool samples.',
    holistic: {
      herbal: [
        { name: 'Berberine', dose: '400mg 3x daily for 4 weeks', evidence: 'strong' },
        { name: 'Saccharomyces boulardii', dose: '500mg 2x daily', evidence: 'moderate' },
        { name: 'Thyme oil extract', dose: '200mg 2x daily', evidence: 'emerging' },
        { name: 'Cat\'s claw (Uncaria tomentosa)', dose: '500mg 2x daily', evidence: 'moderate' }
      ],
      dietary: [
        'Low-FODMAP diet to reduce symptoms',
        'Eliminate refined carbohydrates and sugars',
        'Increase fibre from vegetables (not grains)',
        'Fermented foods to rebuild microbiome after treatment',
        'Apple cider vinegar (1 tbsp in water before meals)'
      ],
      supplements: [
        { name: 'Probiotics (multi-strain)', dose: '50 billion CFU daily', reason: 'Competitive exclusion of Blastocystis' },
        { name: 'Zinc', dose: '25mg daily', reason: 'Gut lining repair' },
        { name: 'L-Glutamine', dose: '5g daily', reason: 'Intestinal permeability repair' },
        { name: 'Magnesium', dose: '300mg nightly', reason: 'Bowel motility support' }
      ],
      lifestyle: [
        'Strict food hygiene practices',
        'Stress management (stress worsens symptoms)',
        'Regular gentle exercise to improve gut motility',
        'Test and treat all household members'
      ],
      disclaimer: 'Blastocystis treatment is controversial — many practitioners debate whether to treat asymptomatic carriers. Consult a gastroenterologist or integrative medicine practitioner.'
    },
    conventionalTreatment: 'Metronidazole or Trimethoprim-sulfamethoxazole — often difficult to eradicate',
    prevention: ['Drink filtered water', 'Food hygiene', 'Regular handwashing'],
    australianResources: ['https://www.healthdirect.gov.au/blastocystis-hominis']
  },

  {
    id: 'cryptosporidium-001',
    commonName: 'Cryptosporidium',
    scientificName: 'Cryptosporidium parvum',
    type: 'protozoa',
    aliases: ['crypto'],
    australianPrevalence: 'common',
    regions: ['worldwide', 'Australia'],
    transmission: ['contaminated water (chlorine resistant)', 'person-to-person', 'animal contact'],
    symptoms: [
      'Profuse watery diarrhoea (up to 20x/day in severe cases)',
      'Stomach cramps', 'Nausea and vomiting', 'Fever',
      'Dehydration', 'Weight loss', 'Self-limiting in healthy adults (1–2 weeks)',
      'Severe in immunocompromised individuals'
    ],
    lifeStages: ['oocyst', 'sporozoite', 'trophozoite'],
    incubationDays: { min: 2, max: 10 },
    urgencyLevel: 'moderate',
    sampleTypes: ['stool'],
    microscopyAppearance: 'Oocysts: round, 4–6 μm. Require acid-fast staining — appear pink/red on green background.',
    holistic: {
      herbal: [
        { name: 'Bovine colostrum', dose: '10g daily in water', evidence: 'strong' },
        { name: 'Neem leaf extract', dose: '500mg 3x daily', evidence: 'moderate' },
        { name: 'Grapefruit seed extract', dose: '150mg 3x daily', evidence: 'moderate' }
      ],
      dietary: [
        'Oral rehydration is priority — water with electrolytes',
        'BRAT diet (banana, rice, apple, toast) during acute phase',
        'Avoid dairy, raw fruits and vegetables during infection',
        'Colostrum-rich foods if tolerated'
      ],
      supplements: [
        { name: 'Oral rehydration salts (ORS)', dose: 'As directed', reason: 'Critical — prevent dehydration' },
        { name: 'Bovine colostrum', dose: '10g daily', reason: 'Shown to reduce Cryptosporidium in studies' },
        { name: 'Zinc', dose: '20mg daily', reason: 'Reduces diarrhoea duration' },
        { name: 'Probiotics', dose: '20 billion CFU daily', reason: 'Gut recovery support' }
      ],
      lifestyle: [
        'Stay home and rest — highly contagious',
        'Strict handwashing especially after toilet use',
        'Do not swim in pools for 2 weeks after symptoms resolve',
        'Seek urgent medical care if immunocompromised'
      ],
      disclaimer: 'Cryptosporidiosis can be life-threatening in immunocompromised individuals. Seek medical attention promptly.'
    },
    conventionalTreatment: 'Nitazoxanide (Alinia) — most effective. Supportive care for healthy adults.',
    prevention: ['Filter drinking water (1 micron filter)', 'Avoid swallowing pool or lake water'],
    australianResources: ['https://www.health.gov.au/diseases/cryptosporidiosis']
  },

  {
    id: 'entamoeba-001',
    commonName: 'Amoeba / Amoebiasis',
    scientificName: 'Entamoeba histolytica',
    type: 'protozoa',
    aliases: ['amoebic dysentery', 'intestinal amoebiasis'],
    australianPrevalence: 'uncommon (higher in returned travellers)',
    regions: ['tropical', 'subtropical', 'developing countries', 'returned travellers'],
    transmission: ['contaminated food and water', 'person-to-person (faecal-oral)', 'sexual contact'],
    symptoms: [
      'Bloody diarrhoea', 'Mucus in stool', 'Severe abdominal cramping',
      'Fever', 'Weight loss', 'Liver abscess (if disseminated)',
      'Most infections are asymptomatic'
    ],
    lifeStages: ['trophozoite', 'cyst'],
    incubationDays: { min: 7, max: 28 },
    urgencyLevel: 'high',
    sampleTypes: ['stool', 'blood'],
    microscopyAppearance: 'Cysts: 10–20 μm, 1–4 nuclei with central karyosome. Trophozoites may contain ingested red blood cells.',
    holistic: {
      herbal: [
        { name: 'Berberine', dose: '400mg 3x daily', evidence: 'strong' },
        { name: 'Garlic extract (allicin)', dose: '600mg 3x daily', evidence: 'moderate' },
        { name: 'Pomegranate rind extract', dose: '500mg 2x daily', evidence: 'traditional/emerging' }
      ],
      dietary: [
        'Avoid all raw foods during active infection',
        'Only eat cooked foods and drink boiled or filtered water',
        'Increase garlic intake',
        'Papaya seeds (1 tsp blended with honey daily)'
      ],
      supplements: [
        { name: 'Vitamin A', dose: '10,000 IU daily for 2 weeks', reason: 'Gut mucosa repair' },
        { name: 'Probiotics', dose: '50 billion CFU daily', reason: 'Microbiome restoration' },
        { name: 'Zinc', dose: '30mg daily', reason: 'Immune modulation' }
      ],
      lifestyle: [
        'Strict food and water hygiene',
        'Seek medical care urgently if bloody diarrhoea',
        'Report travel history to doctor'
      ],
      disclaimer: 'Invasive amoebiasis is a medical emergency. Seek professional medical treatment immediately. Holistic measures are supportive only.'
    },
    conventionalTreatment: 'Metronidazole followed by Diloxanide furoate to eliminate cysts',
    prevention: ['Safe food and water practices when travelling', 'Handwashing'],
    australianResources: ['https://www.health.gov.au/diseases/amoebiasis']
  },

  {
    id: 'dientamoeba-001',
    commonName: 'Dientamoeba',
    scientificName: 'Dientamoeba fragilis',
    type: 'protozoa',
    aliases: [],
    australianPrevalence: 'common (often missed)',
    regions: ['worldwide', 'Australia'],
    transmission: ['possibly via pinworm eggs', 'contaminated food/water', 'faecal-oral'],
    symptoms: [
      'Intermittent diarrhoea', 'Abdominal pain', 'Nausea',
      'Fatigue', 'Irritability (especially in children)',
      'IBS-like presentation', 'Often coexists with other parasites'
    ],
    lifeStages: ['trophozoite only (no cyst stage)'],
    incubationDays: { min: 7, max: 14 },
    urgencyLevel: 'low',
    sampleTypes: ['stool'],
    microscopyAppearance: 'Trophozoite: 5–15 μm, characteristically bi-nucleate. No cyst form — requires fresh warm stool specimen.',
    holistic: {
      herbal: [
        { name: 'Berberine', dose: '400mg 3x daily', evidence: 'moderate' },
        { name: 'Oregano oil', dose: '200mg 2x daily', evidence: 'moderate' }
      ],
      dietary: [
        'Anti-inflammatory diet',
        'Eliminate processed sugars',
        'Increase dietary fibre from vegetables'
      ],
      supplements: [
        { name: 'Probiotics', dose: '20 billion CFU daily', reason: 'Microbiome support' },
        { name: 'Zinc', dose: '25mg daily', reason: 'Gut health' }
      ],
      lifestyle: ['Treat simultaneously with Enterobius (pinworm) if coinfection suspected'],
      disclaimer: 'Requires formal stool PCR testing for accurate diagnosis. Often coexists with pinworm.'
    },
    conventionalTreatment: 'Doxycycline, Metronidazole, or Iodoquinol',
    prevention: ['Good hygiene', 'Handwashing'],
    australianResources: []
  },

  // ─── HELMINTHS ────────────────────────────────────────────────────────────────
  {
    id: 'ascaris-001',
    commonName: 'Roundworm',
    scientificName: 'Ascaris lumbricoides',
    type: 'helminth',
    aliases: ['human roundworm', 'giant intestinal roundworm'],
    australianPrevalence: 'rare (common in returned travellers)',
    regions: ['tropical', 'subtropical', 'developing countries'],
    transmission: ['ingestion of soil-contaminated food or water', 'contaminated hands'],
    symptoms: [
      'Often asymptomatic', 'Cough during larval migration (Löffler syndrome)',
      'Abdominal pain and distension', 'Nausea and vomiting',
      'Passing worms in stool', 'Intestinal obstruction (heavy infection)',
      'Malnutrition in children', 'Worms visible in stool (15–35cm)'
    ],
    lifeStages: ['egg (fertilised/unfertilised)', 'larva', 'adult worm'],
    incubationDays: { min: 60, max: 90 },
    urgencyLevel: 'moderate',
    sampleTypes: ['stool'],
    microscopyAppearance: 'Fertilised eggs: oval, 45–70 μm, thick shell with mammillated outer coat, brown bile-stained. Unfertilised eggs: elongated, 85–95 μm.',
    holistic: {
      herbal: [
        { name: 'Wormwood (Artemisia absinthium)', dose: '200mg 3x daily for 2 weeks', evidence: 'strong' },
        { name: 'Black walnut hull', dose: '500mg 3x daily', evidence: 'moderate' },
        { name: 'Clove (eugenol)', dose: '500mg 3x daily', evidence: 'moderate' },
        { name: 'Pumpkin seed extract', dose: '1/2 cup raw seeds daily', evidence: 'traditional/moderate' }
      ],
      dietary: [
        'Raw pumpkin seeds — 1/4 cup fasted in morning',
        'Raw garlic (6 cloves/day in acute phase)',
        'Papaya seeds blended with honey and milk',
        'Avoid sugar and refined carbohydrates',
        'Increase dietary fibre to aid expulsion'
      ],
      supplements: [
        { name: 'Vitamin A', dose: '10,000 IU daily', reason: 'Gut mucosal defence' },
        { name: 'Zinc', dose: '30mg daily', reason: 'Immune enhancement' },
        { name: 'Iron', dose: 'As directed by practitioner', reason: 'Correct anaemia if present' }
      ],
      lifestyle: [
        'Wash hands before eating and after gardening',
        'Wash all vegetables and fruit thoroughly',
        'Cook food to safe temperatures',
        'Wear gloves when gardening'
      ],
      disclaimer: 'Heavy Ascaris infections can cause intestinal obstruction — a medical emergency. Seek immediate medical care if severe abdominal pain occurs.'
    },
    conventionalTreatment: 'Albendazole 400mg single dose or Mebendazole 100mg twice daily for 3 days',
    prevention: ['Hand hygiene', 'Safe food handling', 'Not using human faeces as fertiliser'],
    australianResources: ['https://www.health.gov.au/diseases/roundworm-infection-ascariasis']
  },

  {
    id: 'enterobius-001',
    commonName: 'Pinworm / Threadworm',
    scientificName: 'Enterobius vermicularis',
    type: 'helminth',
    aliases: ['pinworm', 'threadworm', 'seatworm'],
    australianPrevalence: 'very common (especially children)',
    regions: ['worldwide', 'Australia', 'temperate climates'],
    transmission: ['ingestion of eggs via contaminated hands/surfaces', 'autoinfection', 'bedding and clothing'],
    symptoms: [
      'Intense perianal itching (especially at night)',
      'Disturbed sleep', 'Irritability', 'Visible white worms near anus at night',
      'Vaginal itching in girls', 'Teeth grinding (controversial association)',
      'Often asymptomatic'
    ],
    lifeStages: ['egg', 'larva', 'adult worm'],
    incubationDays: { min: 21, max: 42 },
    urgencyLevel: 'low',
    sampleTypes: ['stool', 'perianal swab (Scotch tape test)'],
    microscopyAppearance: 'Eggs: oval, 50–60 x 20–30 μm, asymmetric (one side flattened). Adult female: 8–13mm white worm. Best collected via Scotch tape test perianally at night.',
    holistic: {
      herbal: [
        { name: 'Garlic (raw or suppository)', dose: '3–4 raw cloves daily or garlic enema', evidence: 'traditional/moderate' },
        { name: 'Wormwood tea', dose: '1 cup 3x daily', evidence: 'traditional' },
        { name: 'Papaya seeds', dose: '1 tsp with honey daily', evidence: 'traditional' }
      ],
      dietary: [
        'Raw carrots (fibre creates hostile environment)',
        'Coconut oil 1 tbsp daily',
        'Avoid refined sugars that feed parasites',
        'Pumpkin seeds 1/4 cup daily'
      ],
      supplements: [
        { name: 'Probiotics', dose: '20 billion CFU daily', reason: 'Gut environment support' },
        { name: 'Diatomaceous earth (food grade)', dose: '1 tsp in water daily', reason: 'Mechanical damage to parasites' }
      ],
      lifestyle: [
        'Wash all bedding in hot water (60°C) immediately',
        'Vacuum and mop all floors',
        'Change and wash underwear twice daily during treatment',
        'Trim and clean under fingernails short',
        'Treat ALL household members simultaneously',
        'Bath/shower in the morning (not evening) to remove eggs deposited overnight'
      ],
      disclaimer: 'Pinworm is highly contagious within households. All members must be treated simultaneously to prevent reinfection.'
    },
    conventionalTreatment: 'Mebendazole 100mg single dose, repeat after 2 weeks (or Pyrantel pamoate). Treat all household members.',
    prevention: ['Hand hygiene', 'Short fingernails', 'Wash bedding weekly'],
    australianResources: ['https://www.healthdirect.gov.au/threadworms']
  },

  {
    id: 'taenia-saginata-001',
    commonName: 'Beef Tapeworm',
    scientificName: 'Taenia saginata',
    type: 'helminth',
    aliases: ['tapeworm', 'beef tapeworm'],
    australianPrevalence: 'rare',
    regions: ['worldwide', 'areas with cattle farming'],
    transmission: ['eating undercooked beef containing cysticerci'],
    symptoms: [
      'Passage of proglottid segments in stool',
      'Segments may be seen crawling on skin around anus',
      'Mild abdominal discomfort', 'Nausea', 'Weight loss',
      'Increased appetite', 'Often asymptomatic',
      'Worm can reach 4–12 metres in length'
    ],
    lifeStages: ['egg', 'oncosphere', 'cysticercus', 'scolex', 'adult worm', 'proglottid'],
    incubationDays: { min: 60, max: 90 },
    urgencyLevel: 'high',
    sampleTypes: ['stool'],
    microscopyAppearance: 'Gravid proglottids: 16–20 uterine branches each side. Eggs: round, 30–40 μm, radially striated embryophore. Cannot distinguish from T. solium eggs — species ID via proglottid morphology.',
    holistic: {
      herbal: [
        { name: 'Pumpkin seed extract (cucurbitacin)', dose: '2 cups raw seeds fasted, then castor oil', evidence: 'moderate/traditional' },
        { name: 'Male fern extract (Dryopteris filix-mas)', dose: 'Historical — under practitioner supervision only', evidence: 'historical' }
      ],
      dietary: [
        'Extended fasting (24–48hr) then pumpkin seed protocol',
        'Pineapple (bromelain) large quantities',
        'Papaya and papaya seeds',
        'Pomegranate juice (bark historically used)'
      ],
      supplements: [
        { name: 'Diatomaceous earth (food grade)', dose: '1 tbsp in water daily for 1 month', reason: 'Mechanical debilitation' },
        { name: 'Digestive enzymes (high protease)', dose: 'Between meals', reason: 'Protein digestion of worm cuticle' }
      ],
      lifestyle: [
        'Do not eat undercooked or raw beef',
        'Freeze beef at -10°C for 5 days before eating rare',
        'Cook all beef to internal temperature of 63°C minimum'
      ],
      disclaimer: 'Tapeworm infection requires medical treatment. Holistic approaches are NOT sufficient to eliminate a tapeworm. Seek medical care promptly.'
    },
    conventionalTreatment: 'Praziquantel 5–10mg/kg single dose (extremely effective)',
    prevention: ['Cook beef thoroughly', 'Freeze raw beef before consumption'],
    australianResources: []
  },

  {
    id: 'taenia-solium-001',
    commonName: 'Pork Tapeworm / Neurocysticercosis',
    scientificName: 'Taenia solium',
    type: 'helminth',
    aliases: ['pork tapeworm', 'cysticercosis', 'neurocysticercosis'],
    australianPrevalence: 'rare (returning travellers)',
    regions: ['Latin America', 'sub-Saharan Africa', 'South and Southeast Asia'],
    transmission: ['undercooked pork (intestinal infection)', 'ingestion of eggs (cysticercosis — can affect brain)'],
    symptoms: [
      'INTESTINAL: Passage of proglottids, mild abdominal symptoms',
      'CYSTICERCOSIS (larval infection in tissues): Seizures (brain involvement)',
      'Headaches', 'Visual disturbances', 'Spinal cord symptoms',
      'Subcutaneous nodules', 'This form is DANGEROUS and requires urgent care'
    ],
    lifeStages: ['egg', 'oncosphere', 'cysticercus', 'adult worm'],
    incubationDays: { min: 60, max: 90 },
    urgencyLevel: 'emergency',
    sampleTypes: ['stool', 'blood'],
    microscopyAppearance: 'Eggs morphologically identical to T. saginata. Scolex has 4 suckers plus rostellum with 2 rows of hooklets (distinguishes from T. saginata).',
    holistic: {
      herbal: [],
      dietary: ['Do not delay medical treatment for dietary interventions'],
      supplements: [],
      lifestyle: ['Seek emergency medical care immediately if neurological symptoms present'],
      disclaimer: 'Neurocysticercosis (Taenia solium in the brain) is a MEDICAL EMERGENCY. Do not attempt holistic treatment. Seek immediate emergency medical care.'
    },
    conventionalTreatment: 'Praziquantel or Albendazole with corticosteroids. Neurosurgery may be required.',
    prevention: ['Cook pork thoroughly to 77°C', 'Handwashing', 'Safe food handling'],
    australianResources: ['https://www.health.gov.au/diseases/taeniasis-and-cysticercosis']
  },

  {
    id: 'hookworm-001',
    commonName: 'Hookworm',
    scientificName: 'Ancylostoma duodenale / Necator americanus',
    type: 'helminth',
    aliases: ['hookworm'],
    australianPrevalence: 'uncommon (Indigenous communities in remote areas, returned travellers)',
    regions: ['tropical', 'subtropical', 'remote Australia'],
    transmission: ['larval skin penetration (walking barefoot on contaminated soil)', 'ingestion (A. duodenale)'],
    symptoms: [
      'Ground itch (skin penetration site)', 'Cough during lung migration',
      'Iron-deficiency anaemia (blood-sucking)', 'Fatigue and weakness',
      'Abdominal pain', 'Protein deficiency and malnutrition',
      'Pale skin, oedema in severe cases',
      'Children: cognitive and growth impairment'
    ],
    lifeStages: ['egg', 'rhabditiform larva', 'filariform larva', 'adult worm'],
    incubationDays: { min: 40, max: 60 },
    urgencyLevel: 'moderate',
    sampleTypes: ['stool', 'blood'],
    microscopyAppearance: 'Eggs: oval, 55–75 x 35–40 μm, thin shell, 2–8 cell cleavage stage in fresh stool. Larvae have rhabditiform esophagus.',
    holistic: {
      herbal: [
        { name: 'Wormwood', dose: '200mg 3x daily', evidence: 'moderate' },
        { name: 'Black walnut', dose: '500mg 2x daily', evidence: 'moderate' }
      ],
      dietary: [
        'Iron-rich foods: red meat, leafy greens, legumes',
        'Vitamin C with iron-rich foods to enhance absorption',
        'High-protein diet to address malnutrition'
      ],
      supplements: [
        { name: 'Iron (ferrous sulfate)', dose: 'As prescribed', reason: 'Treat iron-deficiency anaemia' },
        { name: 'Vitamin B12', dose: '1000mcg daily', reason: 'Correct deficiency' },
        { name: 'Folate', dose: '400–800mcg daily', reason: 'Anaemia support' },
        { name: 'Protein supplements', dose: 'As required', reason: 'Address malnutrition' }
      ],
      lifestyle: [
        'Always wear shoes outdoors in tropical areas',
        'Avoid sitting or lying on bare soil',
        'Treat anaemia alongside anti-parasitic treatment'
      ],
      disclaimer: 'Hookworm-associated anaemia can be severe, especially in pregnant women and children. Seek medical evaluation for iron levels.'
    },
    conventionalTreatment: 'Albendazole 400mg single dose or Mebendazole 100mg twice daily for 3 days',
    prevention: ['Wear shoes', 'Avoid contact with potentially contaminated soil'],
    australianResources: ['https://www.health.gov.au/diseases/hookworm-infection']
  },

  {
    id: 'strongyloides-001',
    commonName: 'Threadworm / Strongyloides',
    scientificName: 'Strongyloides stercoralis',
    type: 'helminth',
    aliases: ['threadworm', 'strongy'],
    australianPrevalence: 'common in Indigenous Australians, returned travellers',
    regions: ['tropical', 'subtropical', 'Indigenous Australia', 'Southeast Asia'],
    transmission: ['skin penetration from contaminated soil', 'autoinfection (unique — can persist lifelong)'],
    symptoms: [
      'Larva currens (racing larva skin rash)',
      'Chronic intermittent diarrhoea', 'Abdominal pain',
      'Urticaria and skin reactions', 'Cough during lung migration',
      'HYPERINFECTION SYNDROME (in immunocompromised): Sepsis, meningitis — life-threatening',
      'Can persist asymptomatically for decades due to autoinfection'
    ],
    lifeStages: ['egg', 'rhabditiform larva', 'filariform larva', 'adult worm'],
    incubationDays: { min: 14, max: 28 },
    urgencyLevel: 'high',
    sampleTypes: ['stool', 'blood'],
    microscopyAppearance: 'Rhabditiform larvae in fresh stool: 180–380 μm. Short buccal cavity distinguishes from hookworm larvae. Agar plate culture most sensitive method.',
    holistic: {
      herbal: [
        { name: 'Ivermectin plant sources — NOT effective (require pharmaceutical grade)', dose: 'N/A', evidence: 'insufficient' }
      ],
      dietary: ['Maintain good nutrition', 'Avoid immunosuppressive substances (alcohol, high-sugar diet)'],
      supplements: [
        { name: 'Probiotics', dose: '50 billion CFU daily', reason: 'Support gut immune response' },
        { name: 'Zinc', dose: '30mg daily', reason: 'Immune support' },
        { name: 'Vitamin D', dose: '2000 IU daily', reason: 'Immune modulation' }
      ],
      lifestyle: [
        'Wear shoes at all times in endemic areas',
        'Screen before starting immunosuppressive therapy',
        'Inform all healthcare providers of possible Strongyloides history'
      ],
      disclaimer: 'Strongyloides hyperinfection is potentially fatal. Holistic treatment is NOT appropriate — pharmaceutical ivermectin is required. Seek urgent medical care.'
    },
    conventionalTreatment: 'Ivermectin 200mcg/kg daily for 2 days (drug of choice). Albendazole second-line.',
    prevention: ['Wear shoes', 'Avoid skin contact with soil in endemic areas', 'Screen immigrants and travellers from endemic regions'],
    australianResources: ['https://www.health.gov.au/diseases/strongyloidiasis']
  },

  {
    id: 'trichuris-001',
    commonName: 'Whipworm',
    scientificName: 'Trichuris trichiura',
    type: 'helminth',
    aliases: ['whipworm'],
    australianPrevalence: 'rare (returned travellers, some remote communities)',
    regions: ['tropical', 'subtropical'],
    transmission: ['ingestion of embryonated eggs from contaminated soil/food'],
    symptoms: [
      'Light infection: asymptomatic',
      'Moderate infection: abdominal pain, diarrhoea',
      'Heavy infection: bloody mucoid diarrhoea (trichuris dysentery syndrome)',
      'Rectal prolapse (children)', 'Anaemia', 'Growth retardation'
    ],
    lifeStages: ['egg', 'larva', 'adult worm'],
    incubationDays: { min: 60, max: 90 },
    urgencyLevel: 'moderate',
    sampleTypes: ['stool'],
    microscopyAppearance: 'Eggs: football-shaped (barrel-shaped), 50–55 x 20–22 μm, distinctive bipolar plugs, bile-stained brown shell.',
    holistic: {
      herbal: [
        { name: 'Wormwood complex', dose: '200mg 3x daily', evidence: 'moderate' },
        { name: 'Pomegranate extract', dose: '500mg 2x daily', evidence: 'traditional' }
      ],
      dietary: ['High-fibre diet', 'Pineapple and papaya', 'Raw pumpkin seeds'],
      supplements: [
        { name: 'Iron', dose: 'As needed', reason: 'Address blood loss anaemia' },
        { name: 'Vitamin A', dose: '10,000 IU daily for 2 weeks', reason: 'Gut mucosal repair' }
      ],
      lifestyle: ['Avoid contact with potentially contaminated soil', 'Wash all produce thoroughly'],
      disclaimer: 'Medical treatment is recommended for symptomatic whipworm infection.'
    },
    conventionalTreatment: 'Mebendazole 100mg twice daily for 3 days or Albendazole 400mg daily for 3 days',
    prevention: ['Handwashing', 'Safe food preparation', 'Sanitation'],
    australianResources: []
  },

  // ─── ECTOPARASITES ────────────────────────────────────────────────────────────
  {
    id: 'sarcoptes-001',
    commonName: 'Scabies Mite',
    scientificName: 'Sarcoptes scabiei',
    type: 'ectoparasite',
    aliases: ['scabies', 'itch mite'],
    australianPrevalence: 'common (Indigenous communities — crusted scabies endemic)',
    regions: ['worldwide', 'Australia', 'tropical regions'],
    transmission: ['prolonged skin-to-skin contact', 'sharing bedding/clothing (crusted scabies)'],
    symptoms: [
      'Intense itching (worse at night)', 'Small red burrow tracks on skin',
      'Pimple-like rash between fingers, wrists, armpits, groin',
      'Crusted/Norwegian scabies: thick scaly crusts (highly contagious)',
      'Secondary bacterial infection (common in Australia)'
    ],
    lifeStages: ['egg', 'larva', 'nymph', 'adult mite'],
    incubationDays: { min: 14, max: 42 },
    urgencyLevel: 'moderate',
    sampleTypes: ['skin'],
    microscopyAppearance: 'Adult mite: 0.3–0.45mm, round, 8 legs. Skin scraping in mineral oil — eggs (oval, 100–150 μm), faecal pellets (scybala), and mites visible.',
    holistic: {
      herbal: [
        { name: 'Tea tree oil (5% in carrier oil)', dose: 'Apply to all skin daily for 7 days', evidence: 'moderate' },
        { name: 'Neem oil', dose: 'Full body application, leave 1hr before washing off', evidence: 'moderate' },
        { name: 'Clove oil (diluted 1%)', dose: 'Spot application to burrows', evidence: 'moderate' }
      ],
      dietary: ['Anti-inflammatory diet during treatment', 'Increase zinc and vitamin C intake'],
      supplements: [
        { name: 'Vitamin C', dose: '2000mg daily', reason: 'Wound healing from scratching' },
        { name: 'Zinc', dose: '30mg daily', reason: 'Skin healing' },
        { name: 'Antihistamines (OTC)', dose: 'As directed', reason: 'Itch relief during treatment' }
      ],
      lifestyle: [
        'Wash ALL clothing, bedding, and towels in hot water (60°C) on day 1 of treatment',
        'Items that cannot be washed — bag for 3 days',
        'Treat ALL household members and close contacts simultaneously',
        'Avoid skin-to-skin contact until treatment complete',
        'Itching may continue for 2–4 weeks post-treatment (immune reaction)'
      ],
      disclaimer: 'Tea tree oil and neem oil have some evidence but are not as effective as prescription treatments. Crusted scabies requires urgent medical treatment.'
    },
    conventionalTreatment: 'Permethrin 5% cream (first-line). Ivermectin oral for crusted scabies or treatment failure.',
    prevention: ['Avoid close contact with infected individuals', 'Don\'t share bedding/clothing'],
    australianResources: ['https://www.healthdirect.gov.au/scabies', 'https://www.health.gov.au/diseases/scabies']
  },

  {
    id: 'pediculus-capitis-001',
    commonName: 'Head Lice',
    scientificName: 'Pediculus humanus capitis',
    type: 'ectoparasite',
    aliases: ['nits', 'head lice', 'lice'],
    australianPrevalence: 'very common (school-age children)',
    regions: ['worldwide', 'Australia'],
    transmission: ['head-to-head contact (primary)', 'sharing hats/brushes (rarely)'],
    symptoms: [
      'Scalp itching', 'Feeling of movement in hair',
      'Visible nits (eggs) cemented to hair shafts',
      'Visible lice on scalp', 'Secondary bacterial infection from scratching'
    ],
    lifeStages: ['nit (egg)', 'nymph', 'adult louse'],
    incubationDays: { min: 7, max: 14 },
    urgencyLevel: 'low',
    sampleTypes: ['skin'],
    microscopyAppearance: 'Nits: oval, 0.8mm, glued to hair shaft within 1cm of scalp. Adult: 2–3mm, 6 legs, claw-like. Nymph: smaller version of adult.',
    holistic: {
      herbal: [
        { name: 'Tea tree oil (2% in shampoo)', dose: 'Leave 30 min then comb', evidence: 'moderate' },
        { name: 'Lavender oil + coconut oil combo', dose: 'Apply to scalp overnight, comb morning', evidence: 'moderate' },
        { name: 'Anise oil', dose: 'Diluted spray application', evidence: 'moderate' }
      ],
      dietary: [],
      supplements: [],
      lifestyle: [
        'Wet combing with conditioner every 3–4 days for 2 weeks is effective',
        'Check and treat ALL household contacts',
        'Wash bedding, hats, and hair accessories in hot water',
        'Notify school/childcare so other families can check',
        'Silicone-based dimeticone products (Hedrin) effective if resistance to chemical treatments'
      ],
      disclaimer: 'Head lice do not carry disease and are a social nuisance only. Wet combing is as effective as chemical treatments if done correctly.'
    },
    conventionalTreatment: 'Dimeticone lotion (Hedrin) or Permethrin 1% cream rinse. Treat twice, 7 days apart.',
    prevention: ['Regular scalp checks in children', 'Avoid head-to-head contact'],
    australianResources: ['https://www.healthdirect.gov.au/head-lice']
  },

  {
    id: 'demodex-001',
    commonName: 'Demodex Face Mite',
    scientificName: 'Demodex folliculorum / Demodex brevis',
    type: 'ectoparasite',
    aliases: ['face mite', 'eyelash mite'],
    australianPrevalence: 'nearly universal in adults (usually harmless)',
    regions: ['worldwide'],
    transmission: ['skin-to-skin contact during infancy', 'face-to-face contact'],
    symptoms: [
      'Usually asymptomatic (normal skin flora)',
      'Demodicosis: rosacea-like rash, seborrheic dermatitis',
      'Ocular demodicosis: eyelid irritation, blepharitis, eyelash loss',
      'Itching (especially at night when mites are most active)'
    ],
    lifeStages: ['egg', 'larva', 'protonymph', 'deutonymph', 'adult'],
    incubationDays: { min: 14, max: 18 },
    urgencyLevel: 'low',
    sampleTypes: ['skin'],
    microscopyAppearance: 'D. folliculorum: 0.3–0.4mm, found in hair follicles. D. brevis: 0.15–0.2mm, found in sebaceous glands. Translucent, cigar-shaped body with 8 stubby legs near head.',
    holistic: {
      herbal: [
        { name: 'Tea tree oil (50% solution for eyelids)', dose: 'Weekly eyelid treatment by practitioner only', evidence: 'strong for ocular demodicosis' },
        { name: 'Ivermectin cream 1% (Soolantra)', dose: 'Nightly application', evidence: 'strong' }
      ],
      dietary: [
        'Low-sugar, anti-inflammatory diet',
        'Reduce alcohol consumption (worsens rosacea)',
        'Increase omega-3 fatty acids'
      ],
      supplements: [
        { name: 'Omega-3 fish oil', dose: '2000mg daily', reason: 'Reduce skin inflammation' },
        { name: 'Zinc', dose: '25mg daily', reason: 'Skin health' }
      ],
      lifestyle: [
        'Daily gentle facial cleansing — remove excess sebum',
        'Tea tree oil cleansers/shampoos available OTC',
        'Change pillowcases every 2–3 days',
        'Avoid ocular cosmetics during treatment'
      ],
      disclaimer: 'Low-level Demodex colonisation is normal. Only treat if symptomatic demodicosis is confirmed.'
    },
    conventionalTreatment: 'Ivermectin 1% cream (Soolantra) for demodicosis. Metronidazole for rosacea component.',
    prevention: ['Good facial hygiene', 'Change pillowcases regularly'],
    australianResources: []
  }
];

/**
 * Search encyclopedia by keyword
 */
export function searchEncyclopedia(query) {
  if (!query || query.trim().length < 2) return PARASITE_DATABASE;
  
  const q = query.toLowerCase().trim();
  
  return PARASITE_DATABASE.filter(p => {
    return (
      p.commonName.toLowerCase().includes(q) ||
      p.scientificName.toLowerCase().includes(q) ||
      (p.aliases || []).some(a => a.toLowerCase().includes(q)) ||
      p.type.toLowerCase().includes(q) ||
      (p.symptoms || []).some(s => s.toLowerCase().includes(q)) ||
      (p.transmission || []).some(t => t.toLowerCase().includes(q)) ||
      (p.regions || []).some(r => r.toLowerCase().includes(q))
    );
  });
}

/**
 * Get parasite by ID
 */
export function getParasiteById(id) {
  return PARASITE_DATABASE.find(p => p.id === id) || null;
}

/**
 * Get parasites by type
 */
export function getParasitesByType(type) {
  return PARASITE_DATABASE.filter(p => p.type === type);
}

/**
 * Get parasites by urgency level
 */
export function getParasitesByUrgency(urgency) {
  return PARASITE_DATABASE.filter(p => p.urgencyLevel === urgency);
}
