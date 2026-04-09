/**
 * ScientificLibraryPage.jsx
 * Route: /scientific-library
 *
 * 44-organism reference library digitised from the ParasitePro Scientific PDF.
 * Data is self-contained — no backend calls needed.
 *
 * ACCESS TIERS
 *  - Anonymous         → can browse the index (names, categories, types)
 *  - Logged in (free)  → same, with a soft "Upgrade" nudge on click
 *  - isSubscribed      → full profile modal unlocked
 *
 * To add this route, open your router config and add:
 *   <Route path="/scientific-library" element={<ScientificLibraryPage />} />
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SEO from '../components/SEO';

// ─────────────────────────────────────────────
// ORGANISM DATA  (sourced from PDF, March 2026)
// ─────────────────────────────────────────────
const ORGANISMS = [
  // ── PARASITES & PROTOZOA ──────────────────────────────────────────────
  {
    id: 1, slug: 'pinworm', category: 'Parasites & Protozoa',
    commonName: 'Pinworm', scientificName: 'Enterobius vermicularis',
    type: 'Intestinal nematode (smallest common human roundworm)',
    uniqueFact: 'Females crawl out at night to lay eggs around the anus — causing the classic 2 a.m. itch. Eggs can survive on bedding/clothes for up to 3 weeks, making whole-family infections ridiculously easy.',
    history: 'Mentioned by Hippocrates. In the 1800s it was so common in schools that "pinworm checks" were routine. Still the most common worm infection in Australian children (up to 50% in some studies).',
    infectionRoute: 'Eggs ingested (hand-to-mouth, contaminated bedding/food); hatch in small intestine and mature in the large intestine.',
    bodyLocation: 'Large intestine/rectum; females migrate to perianal skin at night to lay eggs.',
    treatmentNow: 'Single-dose mebendazole or albendazole (repeat after 2 weeks to catch new hatchlings). Treat the whole household.',
    treatmentHistorical: 'Pomegranate root bark tea, wormwood, or turpentine on sugar (very dangerous).',
    interesting: 'Extremely contagious in households and schools. Often underdiagnosed because symptoms are mild or embarrassing.',
    australiaRelevance: 'Most common worm infection in Australian children — up to 50% prevalence in some studies.',
    riskLevel: 'low',
  },
  {
    id: 2, slug: 'roundworm', category: 'Parasites & Protozoa',
    commonName: 'Roundworm', scientificName: 'Ascaris lumbricoides',
    type: 'Soil-transmitted helminth (nematode roundworm) – the largest intestinal worm in humans',
    uniqueFact: 'A single female can lay up to 200,000 eggs per day — enough to fill a teaspoon in a week — and eggs can survive in soil for up to 10 years, even through freezing or extreme heat.',
    history: 'Described in ancient Egyptian papyruses and found in mummies from ~800 BC. Hippocrates and Aristotle both wrote about it. In the 1800s it was so common in Europe and the US that schoolchildren were routinely dewormed.',
    infectionRoute: 'Eggs ingested from contaminated food, water, or soil hatch in the intestine; larvae penetrate the gut wall, travel via blood to lungs, are coughed up and swallowed again to mature in the small intestine.',
    bodyLocation: 'Small intestine (adults); migrating larvae pass through lungs (causing Löffler\'s syndrome) and occasionally liver or other organs in heavy infections.',
    treatmentNow: 'Single-dose albendazole (400 mg) gives >95% cure rate. Mebendazole or ivermectin as alternatives.',
    treatmentHistorical: 'Oil of chenopodium, santonin, or crude purgatives — often with serious side effects. Routine school deworming programs were common.',
    interesting: 'Still ~800 million infections globally. In heavy infections, worms can migrate into the bile duct or cause intestinal blockage (especially in children).',
    australiaRelevance: 'Rare in modern Australia but risk remains for travellers and in some Indigenous communities.',
    riskLevel: 'moderate',
  },
  {
    id: 3, slug: 'whipworm', category: 'Parasites & Protozoa',
    commonName: 'Whipworm', scientificName: 'Trichuris trichiura',
    type: 'Soil-transmitted helminth (nematode) – named for its whip-like shape',
    uniqueFact: 'The anterior "whip" end buries itself deep into the intestinal wall, making it harder to treat than other worms — some 2025 studies show cure rates as low as 28–36% with standard drugs. A new species, T. incognita, was identified in 2025 showing higher drug resistance.',
    history: 'First described by Hippocrates in 400 BC. Extremely common in the 1800s–early 1900s across Europe and early Australia; "worming day" was a regular family ritual. Infection rates in China dropped dramatically after 2008 sanitation campaigns.',
    infectionRoute: 'Eggs ingested from contaminated soil/food hatch in the small intestine; larvae migrate to the large bowel (caecum/colon) and embed the thin anterior end into the mucosa.',
    bodyLocation: 'Large intestine (caecum and colon) — the "whip" end embeds in mucosa, causing inflammation and bleeding.',
    treatmentNow: 'Mebendazole (first-line) or albendazole for 3 days; ivermectin or oxantel pamoate combinations for resistant cases. Follow-up stool tests recommended.',
    treatmentHistorical: 'Same crude chemicals as other worms (thymol, santonin) plus purgatives — low success rates.',
    interesting: 'Peak in children 5–15 years old. Heavy infections cause chronic dysentery, anaemia, and growth stunting. The new T. incognita species (2025 discovery) is genetically closer to pig whipworms and more drug-resistant.',
    australiaRelevance: 'Historically present in early Australia; now rare in mainstream communities but risk in tropical QLD.',
    riskLevel: 'moderate',
  },
  {
    id: 4, slug: 'hookworm', category: 'Parasites & Protozoa',
    commonName: 'Hookworm', scientificName: 'Necator americanus / Ancylostoma duodenale',
    type: 'Soil-transmitted helminth (nematode roundworm)',
    uniqueFact: 'In 2025 Australian clinical trials, controlled low-dose hookworm infections were deliberately used to treat autoimmune diseases and improve insulin sensitivity in metabolic syndrome patients — nature\'s weirdest anti-inflammatory therapy.',
    history: 'Nicknamed "The American Killer" in the early 1900s, it stunted growth across the southern US during slavery and sharecropping eras. The Rockefeller Sanitary Commission launched the first mass deworming campaigns in the 1910s–1920s.',
    infectionRoute: 'Infective larvae in contaminated soil penetrate bare skin (usually feet), travel through blood to lungs, are coughed up and swallowed, then mature in the small intestine.',
    bodyLocation: 'Primarily the small intestine (attach to mucosa and suck blood); larvae also cause "ground itch" on skin and temporary lung inflammation.',
    treatmentNow: 'Single-dose albendazole (400 mg) or mebendazole (500 mg) — highly effective. Iron supplements for anaemia. Mass drug administration programs still run in endemic areas.',
    treatmentHistorical: 'Thymol, carbon tetrachloride, or oil of chenopodium (dangerous and toxic — many side effects). The Rockefeller campaigns used these crude chemicals in the 1910s–1920s.',
    interesting: 'Still endemic in northern Queensland communities and parts of Australia. Necator americanus is the dominant global species. Recent 2025 research shows emerging drug-resistance concerns in some regions.',
    australiaRelevance: 'Endemic in some northern Queensland and remote Indigenous communities. Risk from walking barefoot in contaminated soil.',
    riskLevel: 'moderate',
  },
  {
    id: 5, slug: 'toxoplasma', category: 'Parasites & Protozoa',
    commonName: 'Toxoplasma', scientificName: 'Toxoplasma gondii',
    type: 'Protozoan parasite (Apicomplexa phylum)',
    uniqueFact: 'This parasite can subtly alter human behaviour — 2025 meta-analyses strengthened links to increased risk-taking, impulsivity, and even higher odds of schizophrenia (OR ~1.8). Some researchers call it "cat-lady syndrome" because chronic carriers may tolerate cats better.',
    history: 'Discovered in 1908 in a North African rodent by Nicolle and Manceaux. The name comes from Greek "toxon" (bow) + "plasma" (form) due to its crescent shape under the microscope. Became infamous in the 1980s–90s for congenital infections causing severe birth defects.',
    infectionRoute: 'Oocysts from cat faeces or tissue cysts in undercooked meat/water are ingested → sporozoites invade intestinal cells → spread via blood/lymph to form tissue cysts (especially in brain/muscle/eye).',
    bodyLocation: 'Most commonly forms dormant cysts in brain, skeletal muscle, heart, and eyes. Reactivation in immunocompromised people hits brain (toxoplasmic encephalitis) hardest.',
    treatmentNow: 'Acute/symptomatic: pyrimethamine + sulfadiazine (with folinic acid to protect bone marrow) for 4–6 weeks. Asymptomatic healthy people usually need no treatment — cysts persist lifelong.',
    treatmentHistorical: 'No specific treatment existed until the 1950s (pyrimethamine discovered 1952). Before that, supportive care only — many congenital cases went undiagnosed or were mislabelled as "idiocy" or "hydrocephalus".',
    interesting: 'Up to 30–50% of the global population carry it lifelong without symptoms. 2025 studies continue exploring its role in altering dopamine pathways — it\'s one of the few parasites that may "hack" host psychology.',
    australiaRelevance: 'High seroprevalence in cat-owning regions of Australia. Pregnant women should avoid cat litter and undercooked meat.',
    riskLevel: 'moderate',
  },
  {
    id: 6, slug: 'giardia', category: 'Parasites & Protozoa',
    commonName: 'Giardia', scientificName: 'Giardia lamblia',
    type: 'Flagellated protozoan parasite',
    uniqueFact: 'The trophozoite has a "face-like" appearance under the microscope (two large nuclei as "eyes", adhesive disc as "mouth") — earning it the nickname "the smiling parasite". 2025 Queensland outbreaks were traced to poorly maintained backyard rainwater tanks during wet season.',
    history: 'First observed in 1681 by Antonie van Leeuwenhoek (the microscope inventor) in his own stool — he described "animalcules". Became a major issue during 19th-century gold rushes when miners drank from contaminated creeks.',
    infectionRoute: 'Cysts ingested from contaminated water/food/hand-to-mouth → excyst in small intestine → trophozoites attach to duodenal/jejunal mucosa with adhesive disc and multiply.',
    bodyLocation: 'Primarily duodenum and upper small intestine — adheres to mucosal surface without invading tissue, causing malabsorption and inflammation.',
    treatmentNow: 'Metronidazole (first-line, 5–7 days), tinidazole (single dose), or nitazoxanide. Rehydration and probiotics help symptoms.',
    treatmentHistorical: 'No effective drugs — bismuth compounds, calomel (mercury-based), or herbal teas (wormwood, black walnut) were used with poor results.',
    interesting: 'Very common in Australian travellers, campers, and childcare settings. Cysts are highly resistant to chlorine — boiling or filtration needed. Chronic infections can mimic IBS and cause long-term fatigue.',
    australiaRelevance: 'Common in QLD childcare settings, campers, and post-travel presentations. Rainwater tanks a local risk in wet season.',
    riskLevel: 'moderate',
  },
  {
    id: 7, slug: 'malaria', category: 'Parasites & Protozoa',
    commonName: 'Malaria', scientificName: 'Plasmodium spp.',
    type: 'Protozoan parasite (Apicomplexa phylum, transmitted by Anopheles mosquitoes)',
    uniqueFact: '2025 research shows climate change is expanding Anopheles mosquito ranges into southern Australia and Europe — imported cases in Queensland rose 40% since 2023. New artemisinin-resistant strains in Southeast Asia rewrite their own proteins to evade drugs.',
    history: 'Described in ancient Chinese texts (2700 BC) as "yellow fever of the jungle". The name "malaria" comes from Italian "mala aria" (bad air) — people blamed swamp miasma until Ronald Ross proved mosquito transmission in 1897.',
    infectionRoute: 'Infected mosquito bites inject sporozoites → liver stage (asymptomatic) → merozoites released into blood → invade red blood cells → multiply and burst RBCs (causing fever cycles).',
    bodyLocation: 'Liver (initial exoerythrocytic stage) then red blood cells (erythrocytic stage). P. falciparum can cause severe cerebral malaria by blocking brain capillaries.',
    treatmentNow: 'Artemisinin-based combination therapies (ACTs) like artemether-lumefantrine (first-line for uncomplicated P. falciparum). Severe cases: IV artesunate. Prophylaxis: atovaquone-proguanil or doxycycline for travellers.',
    treatmentHistorical: 'Quinine (from cinchona bark) was the mainstay — often toxic in high doses. The first synthetic antimalarial (quinacrine) appeared in the 1930s.',
    interesting: 'No local transmission in Australia since the 1960s, but imported/traveller cases remain a risk. P. knowlesi (monkey malaria) is increasingly reported in Southeast Asia and can be severe.',
    australiaRelevance: 'Imported cases only in Australia. Travellers to Southeast Asia, Africa, and the Pacific must use prophylaxis. QLD cases rose 40% since 2023 due to climate-driven range expansion.',
    riskLevel: 'high',
  },
  {
    id: 8, slug: 'tapeworm', category: 'Parasites & Protozoa',
    commonName: 'Tapeworm', scientificName: 'Taenia solium / Taenia saginata / Diphyllobothrium latum',
    type: 'Cestode (flatworm tapeworm)',
    uniqueFact: 'T. solium can cause neurocysticercosis — larval cysts in the brain leading to seizures or epilepsy. Up to 30% of epilepsy cases in endemic areas are parasite-related (2025 meta-analysis). D. latum is the longest human tapeworm — can grow over 10–15 metres (longer than a bus).',
    history: 'T. solium described in ancient Egypt and China; pork tapeworm linked to "measly pork" by Aristotle. In early 20th-century Australia, beef tapeworm was common in butchers and rural families.',
    infectionRoute: 'Ingestion of undercooked/contaminated meat or fish containing larval cysts (cysticerci). Larvae attach to small intestine wall via scolex (head with suckers/hooklets) and grow into adult tapeworm.',
    bodyLocation: 'Adult worms live in small intestine. Larval stage (T. solium) forms cysts in muscles, brain, eyes, or other tissues (neurocysticercosis).',
    treatmentNow: 'Praziquantel (single dose for intestinal tapeworm) or albendazole + steroids for cysticercosis (to reduce brain inflammation). Surgery for large brain cysts or eye involvement.',
    treatmentHistorical: 'Oleoresin of male fern (aspidium) or pumpkin seeds (ineffective for cysts). Surgical removal was common for visible cysts.',
    interesting: 'T. solium is the only tapeworm that can complete its full life cycle in humans (human as both definitive and intermediate host). In Australia, rare but imported cases from travellers eating undercooked pork or fish.',
    australiaRelevance: 'Rare, mostly imported. Risk from undercooked pork or raw fish (e.g., raw barramundi sashimi). Neurocysticercosis cases reported in returned travellers.',
    riskLevel: 'moderate',
  },
  {
    id: 9, slug: 'schistosoma', category: 'Parasites & Protozoa',
    commonName: 'Schistosoma', scientificName: 'Schistosoma mansoni',
    type: 'Trematode (blood fluke)',
    uniqueFact: 'The parasite lives inside blood vessels for decades — adults can survive 20–30 years in mesenteric veins. 2025 WHO updates note emerging praziquantel resistance in some African foci.',
    history: 'First described in 1856 by Theodor Bilharz (hence "bilharzia"). Ancient Egyptian mummies from 2000 BC show calcified eggs in bladder/kidney. Major public health issue during 20th-century dam projects (e.g., Aswan Dam increased transmission).',
    infectionRoute: 'Cercariae (larval stage) from infected freshwater snails penetrate skin during contact with contaminated water → migrate to lungs → mature in portal vein → adults pair in mesenteric veins and lay eggs.',
    bodyLocation: 'Adults live in mesenteric veins (around intestines/liver). Eggs lodge in liver (causing fibrosis), intestines, or bladder (depending on species).',
    treatmentNow: 'Praziquantel (single or split dose) — highly effective against adults. Steroids or surgery for severe complications (e.g., portal hypertension).',
    treatmentHistorical: 'Antimony compounds (tartar emetic) — toxic and painful IV injections. Many patients died from treatment side effects.',
    interesting: 'Still ~240 million people infected globally. In Australia, rare imported cases from travellers to endemic areas. Chronic infection linked to bladder cancer (S. haematobium) and liver fibrosis.',
    australiaRelevance: 'Rare — imported cases only. Risk from swimming in freshwater in sub-Saharan Africa, the Middle East, and parts of Asia.',
    riskLevel: 'moderate',
  },
  {
    id: 10, slug: 'leishmania', category: 'Parasites & Protozoa',
    commonName: 'Leishmania', scientificName: 'Leishmania spp.',
    type: 'Protozoan parasite (kinetoplastid, transmitted by sandflies)',
    uniqueFact: 'Can remain dormant in the body for years or decades before reactivating (especially visceral form). 2025 research shows climate change is expanding sandfly ranges into southern Europe and parts of Australia.',
    history: 'Described in 1903 by Leishman and Donovan. Known as "oriental sore" or "Aleppo evil" in the Middle East for centuries. Became a major issue for soldiers in World War I and recent Middle East conflicts.',
    infectionRoute: 'Infected sandfly bite injects promastigotes → phagocytosed by macrophages → transform into amastigotes that multiply inside cells → spread via blood/lymph.',
    bodyLocation: 'Cutaneous: skin (ulcers). Visceral (kala-azar): spleen, liver, bone marrow. Mucocutaneous: mucous membranes (nose/mouth destruction).',
    treatmentNow: 'Liposomal amphotericin B (visceral), miltefosine, paromomycin, or pentavalent antimonials (depending on species/region). Combination therapies increasingly used.',
    treatmentHistorical: 'Pentavalent antimonials (first introduced 1912) — highly toxic, long courses, many deaths from treatment.',
    interesting: 'No vaccine yet, but 2025 trials show promise for a skin-patch vaccine. In Australia, rare imported cases from travellers to India, Brazil, or the Middle East.',
    australiaRelevance: 'Imported cases only. Risk for travellers to South Asia, Middle East, and Latin America.',
    riskLevel: 'moderate',
  },
  {
    id: 11, slug: 'trypanosoma', category: 'Parasites & Protozoa',
    commonName: 'Trypanosoma (Chagas)', scientificName: 'Trypanosoma cruzi',
    type: 'Protozoan parasite (kinetoplastid, transmitted by triatomine "kissing bugs")',
    uniqueFact: 'The parasite can hide dormant in heart muscle for decades — up to 30% of chronic infections lead to Chagas cardiomyopathy (heart failure) years or even 20–30 years later. 2025 studies show it\'s now considered an emerging imported threat in southern Australia via migration/travel.',
    history: 'Discovered in 1909 by Brazilian physician Carlos Chagas. Ancient mummies in South America show evidence of infection. Became a major issue in rural Latin America in the mid-20th century due to poor housing allowing bug infestations.',
    infectionRoute: 'Infected triatomine bug bites and defecates near the wound → trypomastigotes in faeces enter through bite site, mucous membranes, or broken skin → invade cells → multiply as amastigotes → spread via blood.',
    bodyLocation: 'Acute phase: any tissue. Chronic phase: primarily heart muscle (cardiomyopathy), digestive tract (megaesophagus/megacolon), and nervous system.',
    treatmentNow: 'Benznidazole or nifurtimox (best in acute/early chronic phase; 60–80% cure rate). Chronic cases: symptomatic treatment (pacemakers for heart issues, surgery for mega-organs).',
    treatmentHistorical: 'No effective treatment until the 1970s. Early attempts used arsenic compounds or supportive care only — most chronic cases went undiagnosed or fatal.',
    interesting: 'No vaccine yet, but 2025 trials for a therapeutic vaccine show promise in reducing heart damage. In Australia, rare imported cases from Latin American migrants/travellers. Blood screening for donors is now routine in many countries.',
    australiaRelevance: 'Emerging imported threat in Australia. Rare but blood donor screening is now routine.',
    riskLevel: 'moderate',
  },
  {
    id: 12, slug: 'cryptosporidium', category: 'Parasites & Protozoa',
    commonName: 'Cryptosporidium', scientificName: 'Cryptosporidium parvum',
    type: 'Protozoan parasite (apicomplexan)',
    uniqueFact: 'Oocysts are extremely chlorine-resistant — survives standard pool chlorination (needs 10–30 mg/L free chlorine for hours to kill). 2025 Queensland rural cases spiked due to contaminated rainwater tanks and livestock runoff after heavy wet-season flooding.',
    history: 'Recognized as a human pathogen only in the 1970s (first human case 1976). Major outbreak in Milwaukee 1993 (400,000+ cases from water treatment failure). Became a key concern for immunocompromised patients during the HIV/AIDS epidemic.',
    infectionRoute: 'Oocysts ingested from contaminated water/food → excyst in small intestine → sporozoites invade epithelial cells → multiply asexually and sexually → produce new oocysts shed in faeces.',
    bodyLocation: 'Small intestine (jejunum/ileum) — attaches to brush border of enterocytes without deep invasion, causing villous atrophy and malabsorption.',
    treatmentNow: 'Nitazoxanide (most effective in immunocompetent; 3-day course). Supportive care (rehydration) is key — self-limiting in healthy people.',
    treatmentHistorical: 'No specific treatment — diarrhoea managed with bismuth, kaolin, or opiates. Many cases misdiagnosed as bacterial dysentery.',
    interesting: 'Major cause of childhood diarrhoea in developing countries. Highly infectious — only 10–100 oocysts needed to cause illness. Common in Australian farm animals (calves, lambs) — zoonotic risk for rural Mackay/QLD families.',
    australiaRelevance: 'Significant risk in rural QLD from livestock runoff and rainwater tanks. Common in childcare outbreaks. Chlorine-resistant — boiling is required.',
    riskLevel: 'moderate',
  },
  {
    id: 13, slug: 'entamoeba', category: 'Parasites & Protozoa',
    commonName: 'Entamoeba', scientificName: 'Entamoeba histolytica',
    type: 'Anaerobic protozoan amoeba',
    uniqueFact: 'Only E. histolytica ingests red blood cells — a diagnostic hallmark under the microscope. 2025 PCR-based studies show up to 50% of "amebiasis" diagnoses in labs are actually the harmless E. dispar — overdiagnosis is common.',
    history: 'Described in 1875 by Fedor Lösch in Russia. Major outbreaks in 19th-century wars (e.g., American Civil War dysentery). In Australia, historically linked to returned soldiers from tropical campaigns.',
    infectionRoute: 'Cysts ingested from contaminated water/food/hand-to-mouth → excyst in small intestine → trophozoites colonize large intestine → invade mucosa or spread via portal vein.',
    bodyLocation: 'Large intestine (colon) — causes amebic dysentery. Extraintestinal: liver (amebic liver abscess, most common), rarely lungs, brain, or skin.',
    treatmentNow: 'Metronidazole or tinidazole (kills tissue trophozoites) followed by paromomycin or iodoquinol (eradicates luminal cysts). Drainage for large liver abscesses.',
    treatmentHistorical: 'Emetine (from ipecac root) — toxic, caused heart damage and death in many patients. Arsenicals (e.g., carbarsone) used later.',
    interesting: 'Globally ~50 million symptomatic cases yearly; 100,000 deaths. In Australia, mostly imported from travel to India/Southeast Asia. Liver abscess can present months after travel — often misdiagnosed as bacterial or cancer.',
    australiaRelevance: 'Mostly imported. Risk from travel to India, Southeast Asia, and Latin America. Liver abscess presenting months post-travel is frequently misdiagnosed.',
    riskLevel: 'moderate',
  },

  // ── BACTERIA ──────────────────────────────────────────────────────────
  {
    id: 14, slug: 'e-coli', category: 'Bacteria',
    commonName: 'E. coli (pathogenic)', scientificName: 'Escherichia coli (EPEC, ETEC, EHEC O157:H7)',
    type: 'Gram-negative rod-shaped bacterium (Enterobacteriaceae family)',
    uniqueFact: 'Most E. coli are harmless gut commensals, but pathogenic strains (especially Shiga toxin-producing EHEC O157:H7) can cause haemolytic uraemic syndrome (HUS) — kidney failure in children after bloody diarrhoea. 2025 Australian outbreaks linked to contaminated salads and raw milk.',
    history: 'Discovered 1885 by Theodor Escherich. Pathogenic strains recognized in 1940s–50s. Major E. coli O157:H7 outbreak in 1993 (Jack in the Box hamburgers) killed 4 children and led to food safety reforms.',
    infectionRoute: 'Ingestion of contaminated food/water → attach to intestinal epithelial cells via fimbriae/pili → some produce toxins (Shiga toxin in EHEC) → cause inflammation, diarrhoea, or systemic effects.',
    bodyLocation: 'Small and large intestine (enteritis/colitis). EHEC: toxin enters bloodstream → damages kidneys (HUS) and brain vessels.',
    treatmentNow: 'Supportive care (hydration) — antibiotics contraindicated in EHEC (worsen HUS). Rehydration salts, dialysis for kidney failure. Probiotics under study.',
    treatmentHistorical: 'Supportive — fluids, bismuth, kaolin. Antibiotics unavailable until 1940s. Many children died from dehydration or kidney failure.',
    interesting: 'Normal gut flora but pathogenic strains cause ~1.7 million foodborne illnesses yearly globally. In Mackay/QLD, risk from unpasteurised milk, undercooked mince, or contaminated water during wet season.',
    australiaRelevance: 'Common foodborne risk in QLD — especially undercooked mince, raw milk, and contaminated water. 2025 outbreak linked to salads.',
    riskLevel: 'moderate',
  },
  {
    id: 15, slug: 'salmonella', category: 'Bacteria',
    commonName: 'Salmonella', scientificName: 'Salmonella enterica',
    type: 'Gram-negative rod-shaped bacterium (Enterobacteriaceae family)',
    uniqueFact: 'S. Typhi causes typhoid fever — can establish chronic gallbladder carriage (Typhoid Mary classic case). 2025 global surveillance shows increasing multidrug resistance (MDR) strains, especially in South Asia.',
    history: 'Isolated 1880 by Eberth. Typhoid fever major killer in 19th-century cities (poor sanitation). Mary Mallon (Typhoid Mary) first identified carrier 1907. Australia\'s hygiene standards eliminated local typhoid by mid-20th century.',
    infectionRoute: 'Ingestion of contaminated food/water → invade small intestine M-cells → enter macrophages → survive intracellularly → spread to lymph nodes, bloodstream, liver/spleen.',
    bodyLocation: 'Small intestine (typhoid: systemic spread to reticuloendothelial system). Non-typhoidal: primarily intestine (gastroenteritis).',
    treatmentNow: 'Antibiotics (azithromycin, ceftriaxone, or ciprofloxacin for susceptible strains). MDR strains require carbapenems or newer agents. Supportive rehydration.',
    treatmentHistorical: 'Chloramphenicol (first effective drug 1948). Before that: supportive care, fluids — mortality 10–20%.',
    interesting: '~93 million non-typhoidal cases yearly globally. In Mackay/QLD, common from undercooked eggs, poultry, or reptiles (pet turtles). Vaccine available for typhoid (Typhim Vi or Vivotif).',
    australiaRelevance: 'Common cause of foodborne gastroenteritis in QLD — eggs, poultry, reptiles. Pet reptile owners at particular risk.',
    riskLevel: 'moderate',
  },
  {
    id: 16, slug: 'h-pylori', category: 'Bacteria',
    commonName: 'Helicobacter pylori', scientificName: 'Helicobacter pylori',
    type: 'Gram-negative, spiral-shaped, microaerophilic bacterium',
    uniqueFact: 'H. pylori is the only bacterium known to survive and thrive in the highly acidic human stomach (pH 1–2) — it produces urease enzyme to neutralise acid around itself by creating a protective ammonia cloud. 2025 Nobel-level research continues linking chronic infection to ~80% of gastric ulcers and gastric cancer cases.',
    history: 'Discovered in 1982 by Barry Marshall and Robin Warren (Nobel Prize 2005) — Marshall famously drank a culture of the bacteria to prove causation, developing gastritis. Before 1980s, stomach ulcers were blamed on stress/spicy food.',
    infectionRoute: 'Oral-oral or faecal-oral transmission (often childhood) → colonises gastric mucosa → produces urease → survives acid → adheres to epithelial cells → causes chronic inflammation.',
    bodyLocation: 'Stomach lining (gastric mucosa, especially antrum and body). Can cause gastritis, peptic ulcers, MALT lymphoma, or gastric adenocarcinoma over decades.',
    treatmentNow: 'Triple/quadruple therapy: proton pump inhibitor (PPI) + clarithromycin/amoxicillin/metronidazole + bismuth (for resistant strains). 14-day regimens common due to rising clarithromycin resistance. Test for cure 4 weeks post-treatment.',
    treatmentHistorical: 'No treatment — ulcers managed with milk diets, antacids, bed rest, or surgery (partial gastrectomy). Many patients suffered chronic pain or died from perforation/bleeding.',
    interesting: '~50% of world population infected (higher in developing regions). In Mackay/QLD, prevalence lower but common in Indigenous and migrant communities. Breath test (urea breath test) is gold standard for diagnosis.',
    australiaRelevance: 'Common in Indigenous and migrant communities in QLD. Urea breath test widely available. Rising clarithromycin resistance complicating treatment.',
    riskLevel: 'moderate',
  },
  {
    id: 17, slug: 'c-diff', category: 'Bacteria',
    commonName: 'C. difficile', scientificName: 'Clostridioides difficile',
    type: 'Gram-positive, spore-forming, anaerobic rod-shaped bacterium',
    uniqueFact: 'Produces two major toxins (TcdA and TcdB) causing pseudomembranous colitis. Spores survive months on surfaces and resist most disinfectants except bleach. 2025 data shows hypervirulent strains (e.g., ribotype 027) spreading in Australian hospitals.',
    history: 'First described 1935 as normal gut flora in infants. Recognized as cause of antibiotic-associated diarrhoea in 1978. Became major hospital pathogen in 2000s due to fluoroquinolone overuse.',
    infectionRoute: 'Spores ingested (often from contaminated hands/surfaces) → germinate in colon after antibiotic disruption of normal flora → vegetative bacteria produce toxins → damage colonic mucosa → inflammation and pseudomembrane formation.',
    bodyLocation: 'Large intestine (colon) — causes colitis, toxic megacolon, and severe diarrhoea. Rarely extraintestinal.',
    treatmentNow: 'Vancomycin or fidaxomicin (first-line). Fecal microbiota transplant (FMT) for recurrent cases (>90% cure rate). Bezlotoxumab monoclonal antibody to prevent recurrence.',
    treatmentHistorical: 'N/A — antibiotics didn\'t exist widely. Diarrhoea managed with bismuth or kaolin — many cases fatal if severe.',
    interesting: 'Major cause of healthcare-associated infections. In Mackay/QLD hospitals, strict hand hygiene and bleach cleaning protocols reduce rates. Probiotics (S. boulardii) show some preventive benefit.',
    australiaRelevance: 'Significant healthcare-associated infection risk in QLD hospitals. Hypervirulent ribotype 027 spreading. Bleach essential for environmental decontamination.',
    riskLevel: 'high',
  },
  {
    id: 18, slug: 'staph-aureus', category: 'Bacteria',
    commonName: 'Staphylococcus aureus (MRSA)', scientificName: 'Staphylococcus aureus',
    type: 'Gram-positive coccus (clusters like grapes)',
    uniqueFact: 'Can form biofilms on medical devices (e.g., catheters, prosthetic joints) — biofilms make it 1000× more resistant to antibiotics. 2025 Australian data shows community-acquired MRSA rising in tropical QLD due to skin infections from cuts/insect bites.',
    history: 'Identified 1880 by Pasteur. Penicillin revolutionized treatment in 1940s, but resistance emerged quickly (MRSA first reported 1961). Major cause of post-surgical infections historically.',
    infectionRoute: 'Enters through skin breaks, wounds, or medical devices → adheres via surface proteins → produces toxins/enzymes → forms abscesses or spreads systemically (bacteraemia).',
    bodyLocation: 'Skin/soft tissue (boils, cellulitis), bones/joints (osteomyelitis), heart (endocarditis), lungs (pneumonia), bloodstream (sepsis).',
    treatmentNow: 'MSSA: flucloxacillin or cephazolin. MRSA: vancomycin, daptomycin, linezolid, or newer agents (ceftaroline, dalbavancin). Drain abscesses surgically.',
    treatmentHistorical: 'Incision and drainage of abscesses. No antibiotics until 1940s — many died from sepsis or endocarditis.',
    interesting: '~30% of people carry it asymptomatically in nose. In Mackay/QLD, common in wet-season skin infections (sweat + cuts). Decolonisation (mupirocin nasal ointment + chlorhexidine washes) used pre-surgery.',
    australiaRelevance: 'Community MRSA rising in tropical QLD. Wet-season skin infections (cuts, insect bites) are key entry points. Pre-surgical decolonisation now standard in QLD hospitals.',
    riskLevel: 'high',
  },

  // ── VIRUSES ───────────────────────────────────────────────────────────
  {
    id: 19, slug: 'influenza', category: 'Viruses',
    commonName: 'Influenza A/B', scientificName: 'Influenza A virus / Influenza B virus',
    type: 'Enveloped RNA virus (segmented negative-sense single-stranded RNA)',
    uniqueFact: 'Influenza A can undergo antigenic shift (major genetic reassortment when two strains infect the same cell), potentially creating pandemics. 2025 Australian season saw H3N2 dominance suppress COVID-19 circulation through viral interference.',
    history: 'First described by Hippocrates (~412 BC). The 1918 Spanish Flu killed 50 million worldwide. Modern surveillance began after 1933 virus isolation.',
    infectionRoute: 'Inhaled respiratory droplets or aerosols → virus attaches to sialic acid receptors on respiratory epithelial cells via haemagglutinin (HA) → enters cells → replicates → new virions released, infecting neighbouring cells.',
    bodyLocation: 'Primarily upper and lower respiratory tract (nose, throat, trachea, bronchi, lungs). Can cause secondary bacterial pneumonia.',
    treatmentNow: 'Antivirals: oseltamivir (Tamiflu) or zanamivir within 48 hours of symptoms. Supportive care: rest, fluids, paracetamol. Annual quadrivalent vaccine remains the best prevention.',
    treatmentHistorical: 'No antivirals or vaccines existed. Bed rest, aspirin (often overdosed causing Reye\'s syndrome), quinine, and alcohol rubs.',
    interesting: 'Seasonal in Australia (winter peak in southern states, year-round in tropics). 2025–2026 season was one of the worst since 2017 due to H3N2 drift. New mRNA-based universal flu vaccines in late-stage trials.',
    australiaRelevance: 'Year-round in tropical QLD (unlike southern states). Annual vaccination strongly recommended. 2025–2026 season particularly severe.',
    riskLevel: 'moderate',
  },
  {
    id: 20, slug: 'sars-cov-2', category: 'Viruses',
    commonName: 'SARS-CoV-2 (COVID-19)', scientificName: 'Severe Acute Respiratory Syndrome Coronavirus 2',
    type: 'Enveloped positive-sense single-stranded RNA virus',
    uniqueFact: 'By 2026, over 700 million confirmed cases globally, but true infections likely 3–4× higher. 2025 variants (e.g., JN.1 descendants) show reduced severity but faster immune escape — many people now experience it as a "bad cold" due to hybrid immunity.',
    history: 'First identified in Wuhan, China, December 2019. Declared pandemic March 2020. mRNA vaccines developed in record time. Australia\'s border closures and lockdowns kept deaths low relative to global figures.',
    infectionRoute: 'Respiratory droplets/aerosols → spike protein binds ACE2 receptors on respiratory epithelial cells → enters via TMPRSS2 → replicates → spreads systemically in severe cases.',
    bodyLocation: 'Primarily respiratory tract (nasopharynx to alveoli). Can affect multiple organs in severe cases: heart, kidneys, brain (long COVID), blood vessels (clots).',
    treatmentNow: 'Mild: supportive care + Paxlovid (nirmatrelvir/ritonavir) for high-risk within 5 days. Severe: remdesivir, dexamethasone, monoclonal antibodies. Updated boosters yearly.',
    treatmentHistorical: 'N/A — coronaviruses weren\'t known as human pathogens until 1960s. No antiviral existed for any coronavirus before 2020.',
    interesting: 'Long COVID affects ~5–10% of cases — fatigue, brain fog, dysautonomia. In Mackay/QLD, wet-season spikes remain due to indoor crowding. Wastewater surveillance now standard for early detection.',
    australiaRelevance: 'Ongoing community transmission. Wet-season indoor crowding drives QLD spikes. Wastewater surveillance active in major QLD cities.',
    riskLevel: 'moderate',
  },
  {
    id: 21, slug: 'rsv', category: 'Viruses',
    commonName: 'RSV', scientificName: 'Respiratory Syncytial Virus',
    type: 'Enveloped negative-sense single-stranded RNA virus',
    uniqueFact: 'RSV causes more infant hospitalisations than any other virus — nearly all children are infected by age 2. 2025 new maternal vaccines (Abrysvo) and infant monoclonal antibodies (nirsevimab) reduced severe cases by 70–80% in high-income countries.',
    history: 'Isolated in 1956 from chimpanzees with respiratory illness. Recognized as major cause of infant bronchiolitis in 1960s. Long vaccine development due to antibody-dependent enhancement issues in early trials.',
    infectionRoute: 'Respiratory droplets/aerosols → attaches to ciliated epithelial cells in upper/lower airways via G and F glycoproteins → fuses and enters → replicates → syncytia formation (cells fuse into multinucleated giants).',
    bodyLocation: 'Primarily lower respiratory tract in infants (bronchioles, alveoli) causing bronchiolitis/pneumonia. Upper tract in older children/adults.',
    treatmentNow: 'Supportive care only (oxygen, fluids, suction). High-risk infants: nirsevimab injection (single dose). Maternal vaccination during pregnancy protects newborns.',
    treatmentHistorical: 'Supportive care only — oxygen tents, steam inhalation. Many infants died from secondary bacterial infections.',
    interesting: 'Major winter pathogen in southern Australia; year-round in tropics like Mackay/QLD. Reinfections common throughout life — usually milder in adults but severe in elderly/immunocompromised.',
    australiaRelevance: 'Year-round in tropical QLD (Mackay). Maternal vaccination (Abrysvo) now available. Major cause of paediatric hospital admissions.',
    riskLevel: 'moderate',
  },
  {
    id: 22, slug: 'hiv', category: 'Viruses',
    commonName: 'HIV-1', scientificName: 'Human Immunodeficiency Virus type 1',
    type: 'Enveloped positive-sense single-stranded RNA retrovirus',
    uniqueFact: 'HIV integrates its genetic material into the host\'s DNA permanently — this is why it\'s incurable with current technology (the virus hides in long-lived memory T-cells). By 2026, long-acting injectable treatments (lenacapavir every 6 months) are transforming management.',
    history: 'First identified in 1983 as the cause of AIDS. Originated from simian immunodeficiency virus (SIV) in chimpanzees in Central Africa, crossed to humans likely in the early 20th century. Australia\'s early needle-exchange and education programs kept rates low.',
    infectionRoute: 'Virus enters via blood, semen, vaginal fluids, or breast milk → binds CD4 receptors on T-cells/macrophages via gp120 → fuses and enters → reverse transcribes RNA to DNA → integrates into host genome.',
    bodyLocation: 'Primarily CD4+ T-cells, macrophages, and dendritic cells throughout the immune system. Chronic infection depletes CD4 cells, leading to AIDS-defining illnesses.',
    treatmentNow: 'Combination antiretroviral therapy (ART) — usually 2–3 drugs (e.g., bictegravir/tenofovir/emtricitabine). Goal: undetectable viral load = untransmittable (U=U). Long-acting injectables (lenacapavir) for maintenance.',
    treatmentHistorical: 'No treatment; people died rapidly from opportunistic infections. AZT (first drug) approved 1987 — toxic monotherapy.',
    interesting: '~39 million living with HIV globally (2025 data). In Australia, ~30,000 people living with HIV. PrEP has dramatically reduced new transmissions. Mackay/QLD has low prevalence but ongoing testing/PrEP access is key.',
    australiaRelevance: 'Low prevalence in Mackay/QLD but PrEP access critical for at-risk groups. U=U messaging central to public health campaigns.',
    riskLevel: 'high',
  },
  {
    id: 23, slug: 'hpv', category: 'Viruses',
    commonName: 'HPV', scientificName: 'Human Papillomavirus',
    type: 'Non-enveloped double-stranded DNA virus (over 200 types)',
    uniqueFact: 'High-risk types (16, 18) cause ~95% of cervical cancers. Australia\'s world-leading HPV vaccination program (since 2007) reduced cervical cancer by ~90% in vaccinated cohorts — on track to eliminate it as a public health issue by 2035.',
    history: 'First linked to warts in ancient times. Recognized as cancer cause in 1980s by Harald zur Hausen (Nobel Prize 2008). Gardasil vaccine approved 2006; Australia was first country to implement national school-based program for girls (later boys).',
    infectionRoute: 'Direct skin-to-skin contact (sexual or non-sexual) → virus infects basal epithelial cells through micro-abrasions → replicates as cells differentiate → viral particles released in upper layers.',
    bodyLocation: 'Skin and mucosal surfaces (genitals, anus, mouth/throat, hands/feet). Low-risk types cause warts; high-risk cause precancerous lesions and cancers.',
    treatmentNow: 'No cure for the virus itself — body clears most infections naturally within 1–2 years. Warts: cryotherapy, imiquimod, podophyllotoxin. Precancerous lesions: LEEP/conization. Gardasil-9 vaccine prevents 90%+ of cases.',
    treatmentHistorical: 'Warts: caustics (nitric acid), surgical removal, or folk remedies (duct tape, banana peel). No understanding of cancer link or vaccine.',
    interesting: 'Extremely common — most sexually active people get it at some point. In Mackay/QLD, school vaccination catch-up programs continue for missed cohorts. Oral HPV linked to rising throat cancers in men.',
    australiaRelevance: 'Australia has the world\'s most successful HPV vaccination program. Cervical cancer elimination by 2035 is a realistic goal. QLD school catch-up programs active.',
    riskLevel: 'moderate',
  },
  {
    id: 24, slug: 'hsv1', category: 'Viruses',
    commonName: 'Herpes Simplex (HSV-1)', scientificName: 'Herpes Simplex Virus type 1',
    type: 'Enveloped double-stranded DNA virus',
    uniqueFact: 'Once infected, HSV-1 hides lifelong in sensory nerve ganglia. 2025 research strengthened links to increased Alzheimer\'s risk (chronic inflammation in brain tissue). ~67% of people under 50 globally have it.',
    history: 'Known since ancient times ("herpes" from Greek "to creep"). Genital HSV-1 surged in young adults in the 2010s–2020s due to oral sex. Cold sores described in Roman texts.',
    infectionRoute: 'Direct contact (saliva, skin, mucous membranes) → virus enters epithelial cells → replicates → travels retrograde along nerves to sensory ganglia → establishes latency. Reactivation triggered by stress, UV, illness.',
    bodyLocation: 'Primarily oral mucosa (cold sores), face, eyes (herpetic keratitis). Genital HSV-1 common via oral-genital contact. Rarely spreads to brain (encephalitis).',
    treatmentNow: 'Antivirals: acyclovir, valacyclovir, famciclovir (shortens outbreaks, reduces transmission). Suppressive daily therapy for frequent recurrences. No cure — vaccines in trials (2026 data promising for therapeutic versions).',
    treatmentHistorical: 'Topical idoxuridine (1960s) was first antiviral — limited effect. Before that: drying agents (alcohol), zinc oxide, or nothing — outbreaks just "ran their course".',
    interesting: 'HSV-1 is the main cause of oral herpes but increasingly causes genital herpes. In Australia, ~70% of adults have antibodies. Eye infections (herpetic keratitis) are a leading cause of infectious blindness in developed countries.',
    australiaRelevance: '~70% of Australian adults seropositive. Herpetic keratitis is a significant cause of infectious blindness. Genital HSV-1 rising in young Australians.',
    riskLevel: 'low',
  },
  {
    id: 25, slug: 'hepatitis-b', category: 'Viruses',
    commonName: 'Hepatitis B (HBV)', scientificName: 'Hepatitis B Virus',
    type: 'Enveloped partially double-stranded DNA virus',
    uniqueFact: 'HBV is one of the few viruses that can integrate its DNA into the host genome — this is why chronic carriers have a lifelong risk of liver cancer (hepatocellular carcinoma), even after clearing the virus. Australia\'s universal infant vaccination program (since 2000) has reduced chronic infections in young people by >95%.',
    history: 'Identified in 1965 by Baruch Blumberg (Nobel Prize 1976) as the "Australia antigen". Vaccine developed in 1981 — first cancer-preventing vaccine ever.',
    infectionRoute: 'Bloodborne or sexual/perinatal exposure → virus enters hepatocytes → replicates in liver cells → produces excess surface antigen (HBsAg) particles → chronic infection if immune system fails to clear.',
    bodyLocation: 'Primarily hepatocytes in the liver. Chronic infection leads to cirrhosis, fibrosis, and hepatocellular carcinoma over decades.',
    treatmentNow: 'Chronic: tenofovir or entecavir (lifelong suppression). Functional cure trials (2025–2026) using siRNA + immune modulators show promise (HBsAg loss in ~30% of patients). Acute: supportive care only.',
    treatmentHistorical: 'No treatment existed — "serum hepatitis" was recognized but untreatable. Rest, diet, and avoiding alcohol were the only options.',
    interesting: '~296 million chronic carriers globally (2025 data). In Mackay/QLD, screening is routine in pregnancy and high-risk groups. Vaccination is free and highly effective — 3 doses give lifelong protection.',
    australiaRelevance: 'Universal infant vaccination since 2000. Screening routine in pregnancy in QLD. High rates in some migrant communities — testing and vaccination campaigns ongoing.',
    riskLevel: 'high',
  },
  {
    id: 26, slug: 'hepatitis-c', category: 'Viruses',
    commonName: 'Hepatitis C (HCV)', scientificName: 'Hepatitis C Virus',
    type: 'Enveloped positive-sense single-stranded RNA virus',
    uniqueFact: 'HCV has no proofreading enzyme during replication — it mutates extremely rapidly, creating a "quasispecies" swarm inside each patient. This made vaccine development impossible for decades, but direct-acting antivirals (DAAs) now cure >95% of cases in 8–12 weeks.',
    history: 'Identified in 1989 as the cause of "non-A non-B hepatitis". Before screening, it was the leading reason for liver transplants. Australia\'s 2016 PBS listing of DAAs made treatment free and universal — one of the world\'s most successful elimination programs.',
    infectionRoute: 'Bloodborne (shared needles, unsterile tattoos, transfusions pre-1990s) → virus enters hepatocytes → replicates in liver cells → chronic inflammation.',
    bodyLocation: 'Primarily liver (hepatocytes) — causes chronic hepatitis, cirrhosis, and liver cancer over 20–40 years.',
    treatmentNow: 'Pan-genotypic DAAs (sofosbuvir/velpatasvir or glecaprevir/pibrentasvir) — 8–12 week oral course cures 95–99%. Australia is on track for elimination as a public health threat by 2030.',
    treatmentHistorical: 'N/A — virus unknown. "Chronic liver disease" was managed with rest, milk diets, and avoiding alcohol — many progressed to cirrhosis.',
    interesting: '~58 million chronic cases globally. In Mackay/QLD, needle/syringe programs and community testing have slashed new infections. Reinfection possible after cure — harm reduction key.',
    australiaRelevance: 'Australia is a world leader in HCV elimination. PBS-funded curative treatment. QLD needle/syringe programs effective. Elimination by 2030 is the goal.',
    riskLevel: 'high',
  },
  {
    id: 27, slug: 'norovirus', category: 'Viruses',
    commonName: 'Norovirus', scientificName: 'Norovirus (Caliciviridae family)',
    type: 'Non-enveloped positive-sense single-stranded RNA virus',
    uniqueFact: 'Extremely infectious — as few as 10–100 viral particles can cause illness. 2025–2026 outbreaks in Australian childcare centres and aged care homes were record-high due to new GII.17 variants with better immune escape.',
    history: 'First identified in 1968 in Norwalk, Ohio (hence "Norwalk virus"). Major outbreaks recognized in 1970s on cruise ships and in institutions. Became a notifiable disease in many countries after 2000s.',
    infectionRoute: 'Faecal-oral route (contaminated food/water, surfaces, person-to-person) → virus attaches to histo-blood group antigens on intestinal epithelial cells → invades and replicates → rapid cell death and diarrhoea/vomiting.',
    bodyLocation: 'Small intestine — infects enterocytes, causing villous blunting and malabsorption. No systemic spread.',
    treatmentNow: 'Supportive care only (oral rehydration, anti-emetics). No antivirals or vaccines licensed yet (2026 phase 3 trials promising for GI.1/GII.4 bivalent vaccine).',
    treatmentHistorical: 'Supportive care — fluids, rice water, kaolin. Outbreaks often misdiagnosed as "winter vomiting disease" or food poisoning.',
    interesting: 'Leading cause of viral gastroenteritis worldwide. In Mackay/QLD, wet-season spikes in childcare and aged care. Virus survives on surfaces for weeks — bleach is essential for disinfection.',
    australiaRelevance: 'Common cause of outbreaks in QLD childcare and aged care. GII.17 variants drove record outbreaks in 2025–2026. Bleach-only disinfection works — alcohol gels do not kill norovirus.',
    riskLevel: 'low',
  },
  {
    id: 28, slug: 'rotavirus', category: 'Viruses',
    commonName: 'Rotavirus', scientificName: 'Rotavirus (Reoviridae family)',
    type: 'Non-enveloped double-stranded RNA virus (triple-layered icosahedral capsid)',
    uniqueFact: 'The name "rota" means wheel in Latin — under electron microscopy, the virus looks like a wheel with spokes. Before vaccines, it killed ~500,000 children under 5 yearly worldwide. Australia\'s Rotarix/Rotateq program (introduced 2007) reduced severe cases by >90% in vaccinated kids.',
    history: 'Identified in 1973 by Ruth Bishop in duodenal biopsies of dehydrated infants. Recognized as the leading cause of severe childhood diarrhoea in the 1970s–80s. Vaccines licensed 2006 — one of the most successful paediatric interventions ever.',
    infectionRoute: 'Faecal-oral route (contaminated hands/food/water) → virus attaches to enterocytes in small intestine via VP4 spikes → enters cells → replicates → destroys villi → massive fluid loss.',
    bodyLocation: 'Small intestine (jejunum/ileum) — infects mature enterocytes at villus tips, causing villous blunting, malabsorption, and secretory diarrhoea.',
    treatmentNow: 'Supportive care only (oral rehydration solution, zinc in children). Vaccines (Rotarix 2 doses or RotaTeq 3 doses) prevent 85–98% of severe cases. No antivirals exist.',
    treatmentHistorical: 'Supportive care — oral/IV fluids (often unavailable), rice water, or starvation diets. Many infants died from dehydration.',
    interesting: 'Almost every child gets it by age 5 without vaccination. In Mackay/QLD, wet-season spikes in childcare. Reinfections occur but milder. Global deaths now <200,000/year thanks to vaccines.',
    australiaRelevance: 'Rotarix/RotaTeq on the National Immunisation Program. Severe cases dramatically reduced. QLD childcare wet-season spikes still occur in undervaccinated children.',
    riskLevel: 'low',
  },
  {
    id: 29, slug: 'dengue', category: 'Viruses',
    commonName: 'Dengue Virus', scientificName: 'Dengue virus (serotypes 1–4)',
    type: 'Enveloped positive-sense single-stranded RNA virus (flavivirus)',
    uniqueFact: 'Second infection with a different serotype can cause severe dengue (dengue haemorrhagic fever/shock syndrome) due to antibody-dependent enhancement — the immune system accidentally helps the new virus infect more cells. 2025 climate models predict expansion of Aedes mosquitoes into southern QLD.',
    history: 'Known as "breakbone fever" in 18th–19th century Asia/Caribbean. Virus isolated 1943. Australia sees annual outbreaks in north QLD (Cairns/Townsville) since 1980s.',
    infectionRoute: 'Aedes mosquito bite injects virus → replicates in local skin cells and lymph nodes → spreads via blood → infects monocytes/macrophages → triggers massive cytokine release.',
    bodyLocation: 'Systemic: vascular endothelium (causing leakage/plasma extravasation), liver, bone marrow, skin (rash). Severe cases: multi-organ involvement.',
    treatmentNow: 'Supportive care (fluids, paracetamol — avoid NSAIDs/aspirin). Dengvaxia vaccine (limited use in seropositive individuals). QDenga/TAK-003 approved in some countries for broader protection.',
    treatmentHistorical: 'Supportive — bed rest, quinine, cold sponging. Mortality high in haemorrhagic forms due to no IV fluids or monitoring.',
    interesting: '~400 million infections yearly globally. In Mackay/QLD, risk is low but increasing with climate change — local transmission occurs in wet season if imported cases coincide with Aedes mosquito presence.',
    australiaRelevance: 'North QLD (Cairns, Townsville) sees annual outbreaks. Mackay is in the risk expansion zone. Aedes aegypti present in QLD — local transmission possible.',
    riskLevel: 'moderate',
  },
  {
    id: 30, slug: 'zika', category: 'Viruses',
    commonName: 'Zika Virus', scientificName: 'Zika virus (Flaviviridae family)',
    type: 'Enveloped positive-sense single-stranded RNA virus (flavivirus)',
    uniqueFact: 'Causes microcephaly and congenital Zika syndrome when infecting pregnant women — 2015–2016 Americas outbreak led to thousands of babies born with brain defects. 2025 data shows sexual transmission is more common than previously thought (virus persists in semen for months).',
    history: 'Isolated 1947 in Uganda from a rhesus monkey (Zika forest). First human cases 1950s. Major outbreak in French Polynesia 2013–14, then Americas 2015–16. Australia has had imported cases but no local transmission.',
    infectionRoute: 'Aedes mosquito bite → replicates in skin cells → spreads to lymph nodes → viraemia → crosses placenta in pregnancy or infects neural progenitor cells in foetus. Also sexual transmission.',
    bodyLocation: 'Systemic: skin, joints, eyes (conjunctivitis), nervous system (Guillain-Barré syndrome in adults, brain in foetuses).',
    treatmentNow: 'Supportive care only (rest, fluids, paracetamol). No specific antiviral or vaccine licensed (2026 trials ongoing). Pregnant women: avoid endemic areas, use repellents.',
    treatmentHistorical: 'N/A — virus unknown. Mild illness would have been treated as dengue-like fever with rest and quinine.',
    interesting: '~80% of infections asymptomatic. In Australia, risk is travel-related (South America, Pacific Islands). Long-term effects: congenital cases may have vision/hearing loss, seizures, developmental delays.',
    australiaRelevance: 'Travel-related risk. Pregnant women must avoid travel to endemic Pacific, South American, and Southeast Asian regions. Sexual transmission precautions required after travel.',
    riskLevel: 'moderate',
  },
  {
    id: 31, slug: 'ebola', category: 'Viruses',
    commonName: 'Ebola Virus', scientificName: 'Ebola virus (Filoviridae family)',
    type: 'Enveloped negative-sense single-stranded RNA virus (filovirus)',
    uniqueFact: 'Ebola is one of the deadliest known pathogens — case fatality rates up to 90% in some outbreaks. Survivors can harbour infectious virus in immunologically privileged sites (e.g., semen, eyes) for months to years (2025: viral RNA detected in semen up to 5+ years post-recovery).',
    history: 'First identified in 1976 during simultaneous outbreaks in Sudan and DRC (near Ebola River). Largest outbreak 2014–2016 West Africa (28,000+ cases, 11,000 deaths). Australia has never had local transmission — all cases imported or lab-related.',
    infectionRoute: 'Direct contact with bodily fluids of infected person/animal → virus enters through mucous membranes, broken skin, or needlesticks → replicates in dendritic cells/macrophages → spreads systemically → massive cytokine storm and vascular leakage.',
    bodyLocation: 'Systemic: endothelium (causing haemorrhage), liver, spleen, adrenals, kidneys, brain. Causes multi-organ failure and bleeding.',
    treatmentNow: 'Supportive care + monoclonal antibodies (Ebanga or Inmazeb) — significantly improved survival if given early. Vaccines (Ervebo) highly effective for prevention in outbreak settings.',
    treatmentHistorical: 'N/A — virus unknown. Similar haemorrhagic fevers managed with fluids, blood transfusions (often contaminated), and supportive care — high mortality.',
    interesting: 'Fruit bats are the likely reservoir. In Australia, strict biosecurity for imported cases. 2025–2026 outbreaks in Uganda/DRC were controlled quickly due to vaccine stockpiles and ring vaccination strategy.',
    australiaRelevance: 'Extremely rare imported risk. Australia has strict biosecurity protocols. Healthcare workers returning from outbreak zones are monitored.',
    riskLevel: 'high',
  },

  // ── FUNGI ─────────────────────────────────────────────────────────────
  {
    id: 32, slug: 'cryptococcus', category: 'Fungi',
    commonName: 'Cryptococcus', scientificName: 'Cryptococcus neoformans / C. gattii',
    type: 'Encapsulated yeast (Basidiomycota phylum)',
    uniqueFact: 'The thick polysaccharide capsule makes it look like a "halo" under the microscope — this capsule helps it evade the immune system. C. gattii (more common in Australia) is unique because it infects healthy people, not just immunocompromised ones.',
    history: 'First isolated 1894 from peach juice. Recognized as a human pathogen in 1895. Major increase in C. gattii cases in Australia and Pacific Northwest since 1999 (linked to eucalyptus trees).',
    infectionRoute: 'Inhaled from soil/bird droppings/trees → yeast spores reach alveoli → capsule helps survive phagocytosis → spreads via blood to meninges/brain.',
    bodyLocation: 'Primarily lungs (pulmonary cryptococcosis) and central nervous system (cryptococcal meningitis — most dangerous form). Can affect skin, bones, prostate.',
    treatmentNow: 'Induction: amphotericin B + flucytosine (2 weeks), then fluconazole consolidation/maintenance (months to lifelong in HIV patients).',
    treatmentHistorical: 'No effective treatment — supportive care only. Many died from meningitis before amphotericin B (1950s).',
    interesting: 'Major opportunistic infection in HIV/AIDS patients. In Mackay/QLD, C. gattii linked to eucalyptus/red gum trees — inhaled from disturbed soil or mulch. Antigen test in serum/CSF is highly sensitive.',
    australiaRelevance: 'C. gattii endemic in QLD — linked to eucalyptus trees. Risk from gardening, land clearing, and mulch. Infects immunocompetent people (unlike most fungal pathogens).',
    riskLevel: 'high',
  },
  {
    id: 33, slug: 'candida-auris', category: 'Fungi',
    commonName: 'Candida auris', scientificName: 'Candida auris',
    type: 'Yeast (Ascomycota phylum)',
    uniqueFact: 'Extremely resistant to multiple antifungal classes (pan-resistant strains reported) and survives on dry hospital surfaces for weeks — nicknamed "superbug fungus". First identified 2009; now a global health emergency per WHO/CDC.',
    history: 'Emerged suddenly in 2009 (first isolates in Japan, then India/Pakistan). Spread rapidly in hospitals worldwide by 2015–2020. Australia reported first cases 2018 — mostly healthcare-associated.',
    infectionRoute: 'Colonises skin/gut → enters via catheters, wounds, or invasive devices → causes bloodstream infection (candidemia) or deep-seated infections.',
    bodyLocation: 'Bloodstream (fungemia), wounds, urinary tract, ears (otitis), central venous catheters. Often multidrug-resistant.',
    treatmentNow: 'Echinocandins (caspofungin, micafungin) first-line. Amphotericin B or newer agents (ibrexafungerp, rezafungin) for resistant strains. Strict isolation/contact precautions in hospitals.',
    treatmentHistorical: 'N/A — unknown. Fungal infections treated with crude agents like potassium iodide (ineffective for yeasts).',
    interesting: 'Can colonise patients asymptomatically for months. In Mackay/QLD hospitals, screening of high-risk patients (recent overseas hospitalisation) is routine. Outbreaks hard to control due to environmental persistence.',
    australiaRelevance: 'Present in Australian hospitals since 2018. QLD hospitals screen high-risk patients. Strict contact precautions and bleach cleaning required.',
    riskLevel: 'high',
  },
  {
    id: 34, slug: 'aspergillus', category: 'Fungi',
    commonName: 'Aspergillus fumigatus', scientificName: 'Aspergillus fumigatus',
    type: 'Filamentous mould (Ascomycota phylum)',
    uniqueFact: 'Produces airborne conidia (spores) that are ubiquitous — everyone inhales hundreds daily. In immunocompromised people, it can grow inside lungs (aspergilloma) or invade blood vessels (angioinvasive aspergillosis). Azole-resistant strains rose dramatically 2010s–2020s due to agricultural fungicide use.',
    history: 'Described 1865. Recognized as cause of allergic bronchopulmonary aspergillosis (ABPA) in 1952. Major opportunistic pathogen in transplant/cancer patients since 1970s.',
    infectionRoute: 'Inhaled conidia reach alveoli → germinate into hyphae in immunocompromised hosts → invade tissue/blood vessels → disseminate.',
    bodyLocation: 'Lungs (invasive pulmonary aspergillosis, aspergilloma, ABPA), sinuses, brain, skin (invasive cutaneous).',
    treatmentNow: 'Voriconazole (first-line for invasive), isavuconazole, or liposomal amphotericin B. Echinocandins as salvage. Surgical resection for aspergilloma.',
    treatmentHistorical: 'No antifungals — surgical removal of lung cavities or supportive care. Many fatal in immunocompromised patients.',
    interesting: 'Common environmental mould (compost, soil, decaying vegetation). In Mackay/QLD wet season, higher spore counts — risk for asthmatics (ABPA) or those on steroids/transplants.',
    australiaRelevance: 'QLD wet season drives higher airborne spore counts. Risk for asthmatics, transplant patients, and those on high-dose steroids. Compost and garden work increases exposure.',
    riskLevel: 'moderate',
  },
  {
    id: 35, slug: 'candida-albicans', category: 'Fungi',
    commonName: 'Candida albicans', scientificName: 'Candida albicans',
    type: 'Dimorphic yeast (Ascomycota phylum)',
    uniqueFact: 'C. albicans is one of the few fungi that can switch between yeast (round budding cells) and hyphal (filamentous) forms depending on environment — this dimorphism is key to its virulence (hyphae invade tissue, yeasts spread). It\'s the most common cause of thrush, vaginal yeast infections, and invasive candidiasis in hospitals.',
    history: 'First described 1839 as a cause of oral thrush. Recognized as opportunistic pathogen in immunocompromised patients in 20th century. Became major hospital-acquired infection in the antibiotic/steroid era post-1950s.',
    infectionRoute: 'Colonises skin/mucosa/gut → overgrowth after antibiotic/steroid disruption of normal flora → invades mucosa or enters bloodstream via catheters → disseminates in severe cases.',
    bodyLocation: 'Mouth/throat (thrush), vagina, oesophagus, bloodstream (candidemia), deep organs (kidneys, liver, brain in disseminated disease).',
    treatmentNow: 'Fluconazole (most cases), echinocandins (caspofungin, micafungin) for invasive/resistant strains, amphotericin B for severe disseminated. Remove infected catheters.',
    treatmentHistorical: 'Topical gentian violet or nystatin (late 1950s). Systemic: potassium iodide or amphotericin B (toxic). Many invasive cases fatal.',
    interesting: 'Part of normal flora in ~50–70% of people. In Mackay/QLD, common in diabetics (high sugar promotes growth) and wet-season skin fold infections. Biofilms on dentures/catheter surfaces make it hard to eradicate.',
    australiaRelevance: 'Common in diabetics, antibiotic users, and immunocompromised in QLD. Wet-season skin fold candidiasis a practical concern in humid Mackay climate.',
    riskLevel: 'low',
  },
  {
    id: 36, slug: 'nakaseomyces', category: 'Fungi',
    commonName: 'Nakaseomyces glabrata', scientificName: 'Nakaseomyces glabrata (formerly Candida glabrata)',
    type: 'Yeast (Ascomycota phylum)',
    uniqueFact: 'Naturally resistant to azole antifungals (fluconazole) due to efflux pumps — resistance rates >20% in many hospitals. Increasingly common in elderly and catheter patients; second most frequent cause of candidemia after C. albicans.',
    history: 'First described 1917. Reclassified as Candida in 1980s, then Nakaseomyces in 2021. Emerged as major pathogen in 1990s–2000s with azole overuse.',
    infectionRoute: 'Colonises gut/skin → enters via catheters or mucosal disruption → bloodstream invasion → adheres strongly to plastics (catheters).',
    bodyLocation: 'Bloodstream (candidemia), urinary tract, peritoneal cavity, wounds.',
    treatmentNow: 'Echinocandins (caspofungin/micafungin) first-line due to azole resistance. Amphotericin B for refractory cases. Catheter removal essential.',
    treatmentHistorical: 'N/A — rare/non-pathogenic then. No antifungals existed.',
    interesting: 'Higher mortality in candidemia than C. albicans due to resistance. In Mackay/QLD hospitals, common in ICU patients on broad-spectrum antibiotics. Often polymicrobial with bacterial infections.',
    australiaRelevance: 'Rising in QLD hospitals in ICU settings. Azole resistance means empiric fluconazole is often inadequate. Echinocandin stewardship important.',
    riskLevel: 'high',
  },
  {
    id: 37, slug: 'histoplasma', category: 'Fungi',
    commonName: 'Histoplasma capsulatum', scientificName: 'Histoplasma capsulatum',
    type: 'Dimorphic fungus (Ascomycota phylum)',
    uniqueFact: 'Inhaled spores convert to yeast form at body temperature — appears as small intracellular yeasts (2–4 μm) inside macrophages under microscope. Endemic in bird/bat guano-rich soil (e.g., caves, chicken coops).',
    history: 'Identified 1906 by Samuel Darling. Major outbreaks in 1940s–50s in US Midwest (Ohio/Mississippi River valleys). Australia has sporadic imported cases and small endemic foci in tropical QLD.',
    infectionRoute: 'Inhaled microconidia from soil/guano → reach alveoli → convert to yeast → phagocytosed by macrophages → survive/multiply intracellularly → spread via lymph/blood.',
    bodyLocation: 'Lungs (acute pulmonary histoplasmosis), disseminated disease: liver, spleen, bone marrow, adrenals, skin, CNS.',
    treatmentNow: 'Mild acute: supportive care. Moderate-severe/disseminated: liposomal amphotericin B induction, then itraconazole maintenance (6–12 months).',
    treatmentHistorical: 'No effective treatment — supportive care. Many cases self-resolved; disseminated fatal. Amphotericin B introduced 1950s.',
    interesting: 'Endemic in parts of QLD (bird roosts, bat caves). 2025 cases linked to cave exploration or construction disturbing soil. Antigen test in urine/serum is highly sensitive for disseminated disease.',
    australiaRelevance: 'Endemic in tropical QLD — bat caves, bird roosts, and disturbed soil are risk sites. Cave explorers and construction workers at risk. Urine antigen test widely available.',
    riskLevel: 'moderate',
  },
  {
    id: 38, slug: 'mucorales', category: 'Fungi',
    commonName: 'Mucorales (Black Fungus)', scientificName: 'Rhizopus oryzae (Mucorales order)',
    type: 'Filamentous mould (Zygomycota phylum, order Mucorales)',
    uniqueFact: 'Causes mucormycosis (zygomycosis) — one of the most aggressive fungal infections, with mortality 40–80% even with treatment. 2025 cases surged in India post-COVID due to steroid overuse and diabetes. Hyphae are broad and ribbon-like, allowing rapid angioinvasion.',
    history: 'Described in 1885. Major increase in 2000s with diabetes and transplant patients. Named "black fungus" during 2021 India COVID wave due to necrotic tissue.',
    infectionRoute: 'Inhaled spores or direct inoculation (trauma/burns) → germinate in immunocompromised hosts → broad aseptate hyphae invade tissue and blood vessels → thrombosis and necrosis.',
    bodyLocation: 'Sinuses/orbit/brain (rhinocerebral – most common), lungs, skin/soft tissue, gastrointestinal tract. Rapid spread to brain via vessels.',
    treatmentNow: 'Liposomal amphotericin B (first-line) + aggressive surgical debridement (often multiple surgeries). Posaconazole or isavuconazole as step-down. Control underlying condition (e.g., diabetes, reverse immunosuppression).',
    treatmentHistorical: 'No antifungals — surgical excision only. Almost always fatal once invasive.',
    interesting: 'Spores ubiquitous in soil/decaying matter. In Mackay/QLD wet season, risk higher in diabetics or trauma patients (e.g., farm injuries). Rapid progression (hours to days) — early surgery critical.',
    australiaRelevance: 'Real risk in QLD diabetics and immunocompromised patients, especially after farm trauma or soil contact in wet season. Rapid progression makes early recognition critical.',
    riskLevel: 'high',
  },
  {
    id: 39, slug: 'fusarium', category: 'Fungi',
    commonName: 'Fusarium', scientificName: 'Fusarium spp. (F. solani, F. oxysporum)',
    type: 'Filamentous mould (Ascomycota phylum)',
    uniqueFact: 'Produces mycotoxins (fumonisins, trichothecenes) — contaminates grains worldwide. Highly resistant to most antifungals; F. solani is the most virulent in humans. Eye infections (keratitis) from contact lenses or trauma often require corneal transplant.',
    history: 'Known as plant pathogen since 1800s. Human infections recognized 1970s in neutropenic patients. Major outbreaks of fusarial keratitis 2005–2006 linked to ReNu contact lens solution.',
    infectionRoute: 'Inhaled spores, trauma (plant thorn, soil), or contact lens contamination → invade tissue → angioinvasion in immunocompromised → disseminate.',
    bodyLocation: 'Skin/soft tissue (trauma), cornea (keratitis), sinuses/lungs (invasive in neutropenics), bloodstream (disseminated fusariosis).',
    treatmentNow: 'Voriconazole or amphotericin B (often combination due to resistance). Surgical debridement essential for keratitis or skin lesions. High mortality in disseminated disease (~70%).',
    treatmentHistorical: 'N/A — no antifungals. Traumatic infections treated surgically or with amputation in severe cases.',
    interesting: 'Common environmental mould in soil/plants. In Mackay/QLD tropics, risk from gardening/soil exposure or contact lens mishaps. Produces toxins in stored grains — rare human outbreaks from ingestion.',
    australiaRelevance: 'QLD agricultural workers and gardeners at risk from soil/plant thorn exposure. Contact lens wearers should use fresh solution daily.',
    riskLevel: 'moderate',
  },
  {
    id: 40, slug: 'pneumocystis', category: 'Fungi',
    commonName: 'Pneumocystis jirovecii (PCP)', scientificName: 'Pneumocystis jirovecii',
    type: 'Opportunistic fungus (Ascomycota phylum; cannot be cultured in standard media)',
    uniqueFact: 'It only infects humans (not animals) and was reclassified from protozoan to fungus in the 1980s based on DNA analysis. Causes life-threatening pneumonia almost exclusively in severely immunocompromised people (HIV with CD4 <200, transplant patients, cancer on chemo).',
    history: 'First described 1909 as "plasma cell pneumonia" in malnourished infants. Recognized as major AIDS-defining illness in 1981. Renamed P. jirovecii in 2002 to honour Czech parasitologist Otto Jirovec.',
    infectionRoute: 'Inhaled cysts/trophic forms from environment → colonise alveoli → adhere to type I pneumocytes → proliferate in immunocompromised hosts → trigger inflammation and alveolar filling.',
    bodyLocation: 'Lungs (alveoli) — causes Pneumocystis pneumonia (PCP) with ground-glass opacities on imaging. Rarely extrapulmonary (skin, lymph nodes).',
    treatmentNow: 'Trimethoprim-sulfamethoxazole (TMP-SMX) first-line (21 days). Alternatives: pentamidine, atovaquone, or clindamycin+primaquine. Prophylaxis with low-dose TMP-SMX in high-risk groups.',
    treatmentHistorical: 'Known as "interstitial plasma cell pneumonia" in malnourished infants; supportive oxygen only. Fatal in most cases.',
    interesting: 'Ubiquitous exposure — most people have antibodies by adulthood. In Mackay/QLD, seen in untreated HIV or high-dose steroid patients. PCR on respiratory samples is gold standard diagnosis.',
    australiaRelevance: 'Prophylaxis is standard in QLD for HIV patients with CD4 <200 and transplant recipients. TMP-SMX prophylaxis dramatically reduces incidence.',
    riskLevel: 'high',
  },
  {
    id: 41, slug: 'coccidioides', category: 'Fungi',
    commonName: 'Coccidioides (Valley Fever)', scientificName: 'Coccidioides immitis / C. posadasii',
    type: 'Dimorphic fungus (Ascomycota phylum)',
    uniqueFact: 'In tissue, forms large spherules (30–60 μm) filled with endospores — diagnostic hallmark under microscope. Endemic in arid regions (San Joaquin Valley fever in California, Valley fever). Australia has sporadic imported cases.',
    history: 'Identified 1892 in Argentina. Major endemic areas mapped in 1930s US Southwest. Recognized as cause of desert rheumatism (valley fever) in 1929.',
    infectionRoute: 'Inhaled arthroconidia from soil → convert to spherules in lungs at body temperature → rupture, releasing endospores → cycle repeats → systemic spread in ~1% of cases.',
    bodyLocation: 'Lungs (primary infection), disseminated: skin, bones, meninges, joints.',
    treatmentNow: 'Mild: fluconazole or itraconazole. Severe/disseminated: liposomal amphotericin B induction + azoles. Lifelong therapy in some disseminated cases.',
    treatmentHistorical: 'No antifungals — supportive care. Many self-resolved; disseminated often fatal or chronic.',
    interesting: 'Endemic in dry, alkaline soils (deserts, arid zones). In Australia, rare imported cases from US travel. Can cause chronic fatigue syndrome-like illness post-recovery.',
    australiaRelevance: 'Rare imported risk from US/Latin America travel. Australian clinicians should consider it in returned travellers with pulmonary illness after visiting endemic areas.',
    riskLevel: 'moderate',
  },
  {
    id: 42, slug: 'blastomyces', category: 'Fungi',
    commonName: 'Blastomyces', scientificName: 'Blastomyces dermatitidis',
    type: 'Dimorphic fungus (Ascomycota phylum)',
    uniqueFact: 'In tissue, forms large thick-walled yeast cells (8–15 μm) with broad-based budding — looks like a "figure-8" or "lollipop" under microscope. Endemic in moist, wooded areas around Great Lakes and Ohio/Mississippi River valleys.',
    history: 'First described 1894. Recognized as cause of North American blastomycosis in early 1900s. Outbreaks linked to soil disturbance (e.g., construction, dog digging).',
    infectionRoute: 'Inhaled conidia from soil → convert to yeast in lungs → multiply → spread via blood/lymph to skin/bones in disseminated disease.',
    bodyLocation: 'Lungs (primary), skin (verrucous lesions), bones (osteomyelitis), genitourinary tract.',
    treatmentNow: 'Itraconazole (mild-moderate), liposomal amphotericin B (severe/disseminated or CNS). 6–12 months therapy.',
    treatmentHistorical: 'Potassium iodide (ineffective). Amphotericin B introduced 1950s — toxic but lifesaving.',
    interesting: 'Often misdiagnosed as cancer or TB due to chronic lung/skin lesions. In Australia, rare imported cases from North America. Dogs are highly susceptible — often sentinels for human exposure.',
    australiaRelevance: 'Very rare in Australia — imported cases only. Consider in travellers from North America with chronic pulmonary or skin lesions.',
    riskLevel: 'low',
  },
  {
    id: 43, slug: 'dermatophytes', category: 'Fungi',
    commonName: 'Dermatophytes (Ringworm)', scientificName: 'Trichophyton spp. / Epidermophyton / Microsporum',
    type: 'Filamentous fungi (Ascomycota phylum) – keratinophilic (feed on keratin)',
    uniqueFact: 'Dermatophytes are the only fungi that specifically target and digest keratin — the protein in skin, hair, and nails — which is why they cause superficial infections (ringworm, athlete\'s foot, jock itch) but almost never invade deeper tissues or bloodstream. T. rubrum is the most common global cause of chronic foot infections and nail dystrophy.',
    history: 'Ringworm described in ancient texts (Hippocrates). Fungal cause proven 1839 by Schönlein. T. rubrum spread worldwide in 20th century via footwear, showers, and migration. Athlete\'s foot exploded post-WWI due to trench conditions.',
    infectionRoute: 'Direct contact (skin-to-skin, contaminated surfaces like floors/mats) or autoinoculation → hyphae penetrate stratum corneum → grow along keratin layers → release enzymes to break down keratin for nutrients.',
    bodyLocation: 'Skin (tinea corporis/pedis/cruris), nails (onychomycosis), hair/scalp (tinea capitis). Confined to keratinised layers — no deep invasion in immunocompetent people.',
    treatmentNow: 'Topical antifungals (terbinafine, clotrimazole, miconazole) for skin; oral terbinafine or itraconazole for nails/scalp (6–12 weeks). Laser therapy adjunct for resistant nails.',
    treatmentHistorical: 'Topical iodine, Whitfield\'s ointment (benzoic/salicylic acid), or X-ray radiation (for scalp ringworm — caused hair loss and cancers). Oral griseofulvin introduced 1958.',
    interesting: 'Extremely common — tinea pedis affects ~15–25% of adults globally. In Mackay/QLD wet season, thrives in humid climates (sweaty feet, communal showers). Spreads easily in gyms/pools. Chronic nail infections often misdiagnosed as psoriasis.',
    australiaRelevance: 'Very common in QLD — humid Mackay climate is ideal for dermatophytes. Communal pools, gyms, and schools are transmission hotspots. Tinea pedis a practical everyday concern.',
    riskLevel: 'low',
  },
];

// ─────────────────────────────────────────────
// CATEGORY CONFIG
// ─────────────────────────────────────────────
const CATEGORIES = {
  'All': { emoji: '🔬', color: '#1e3a5f', light: '#e8f0f7', border: '#b8cfdf' },
  'Parasites & Protozoa': { emoji: '🪱', color: '#7c3aed', light: '#ede9fe', border: '#c4b5fd' },
  'Bacteria': { emoji: '🦠', color: '#0891b2', light: '#e0f2fe', border: '#7dd3fc' },
  'Viruses': { emoji: '🔴', color: '#dc2626', light: '#fee2e2', border: '#fca5a5' },
  'Fungi': { emoji: '🍄', color: '#d97706', light: '#fef3c7', border: '#fcd34d' },
};

const RISK_COLORS = {
  low: { bg: '#dcfce7', text: '#166534', border: '#86efac', label: 'Low Risk' },
  moderate: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d', label: 'Moderate Risk' },
  high: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', label: 'High Risk' },
};

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export default function ScientificLibraryPage() {
  const { user, isSubscribed } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrganism, setSelectedOrganism] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);

  // Access: subscribed users only get full profiles
  const hasFullAccess = user && isSubscribed;

  const filtered = useMemo(() => {
    let list = ORGANISMS;
    if (selectedCategory !== 'All') {
      list = list.filter(o => o.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(o =>
        o.commonName.toLowerCase().includes(q) ||
        o.scientificName.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q) ||
        o.type.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const handleCardClick = (organism) => {
    if (hasFullAccess) {
      setSelectedOrganism(organism);
      setShowPaywall(false);
    } else {
      setSelectedOrganism(organism); // show teaser
      setShowPaywall(true);
    }
  };

  const closeModal = () => {
    setSelectedOrganism(null);
    setShowPaywall(false);
  };

  const catCfg = (cat) => CATEGORIES[cat] || CATEGORIES['All'];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <SEO
        title="Scientific Pathogen Library — ParasitePro"
        description="Comprehensive reference database of 44 pathogens — parasites, bacteria, viruses, and fungi — with clinical profiles, history, and Australian relevance."
      />


      {/* ── HEADER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2442 100%)',
        color: 'white',
        padding: '2.5rem 1.5rem 3rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>🔬</span>
            <span style={{
              fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#93c5fd', background: 'rgba(147,197,253,0.15)',
              padding: '0.25rem 0.75rem', borderRadius: '999px', border: '1px solid rgba(147,197,253,0.3)'
            }}>
              Scientific Library — 44 Pathogens
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '800', margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>
            ParasitePro Pathogen Reference
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.85, maxWidth: '600px', lineHeight: 1.6, margin: 0 }}>
            Clinical profiles for 44 organisms — parasites, bacteria, viruses, and fungi — including infection routes, 2026 treatments, historical context, and Queensland relevance.
          </p>

          {/* Access badge */}
          {hasFullAccess ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              marginTop: '1.25rem', background: 'rgba(34,197,94,0.2)',
              border: '1px solid rgba(34,197,94,0.5)', borderRadius: '999px',
              padding: '0.35rem 1rem', fontSize: '0.8125rem', color: '#86efac',
            }}>
              <span>✓</span> Full access — subscriber
            </div>
          ) : user ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              marginTop: '1.25rem', background: 'rgba(251,191,36,0.2)',
              border: '1px solid rgba(251,191,36,0.5)', borderRadius: '999px',
              padding: '0.35rem 1rem', fontSize: '0.8125rem', color: '#fbbf24',
            }}>
              <span>🔒</span> Browsing only — subscribe to unlock full profiles
            </div>
          ) : (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              marginTop: '1.25rem', background: 'rgba(251,191,36,0.2)',
              border: '1px solid rgba(251,191,36,0.5)', borderRadius: '999px',
              padding: '0.35rem 1rem', fontSize: '0.8125rem', color: '#fbbf24',
            }}>
              <span>🔒</span> Sign up to unlock full clinical profiles
            </div>
          )}
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div style={{
        backgroundColor: 'white', borderBottom: '1px solid #e2e8f0',
        padding: '1rem 1.5rem', position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by name, scientific name, or type..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.5rem',
                border: '1px solid #e2e8f0', borderRadius: '0.5rem',
                fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {Object.entries(CATEGORIES).map(([cat, cfg]) => {
              const count = cat === 'All' ? ORGANISMS.length : ORGANISMS.filter(o => o.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.375rem 0.875rem', borderRadius: '999px', cursor: 'pointer',
                    border: `1px solid ${isActive ? cfg.color : '#e2e8f0'}`,
                    backgroundColor: isActive ? cfg.color : 'white',
                    color: isActive ? 'white' : '#475569',
                    fontSize: '0.8125rem', fontWeight: isActive ? '600' : '400',
                    transition: 'all 0.15s',
                  }}
                >
                  <span>{cfg.emoji}</span>
                  <span>{cat}</span>
                  <span style={{
                    background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                    borderRadius: '999px', padding: '0.05rem 0.4rem',
                    fontSize: '0.7rem', fontWeight: '700'
                  }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{
          fontSize: '0.8125rem', color: '#64748b', marginBottom: '1rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span>Showing <strong>{filtered.length}</strong> of {ORGANISMS.length} organisms</span>
          {!hasFullAccess && (
            <Link to="/pricing" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', fontSize: '0.8rem' }}>
              🔓 Unlock all profiles →
            </Link>
          )}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
            <p>No organisms found matching your search.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '0.875rem',
          }}>
            {filtered.map(organism => {
              const cfg = catCfg(organism.category);
              const risk = RISK_COLORS[organism.riskLevel];
              return (
                <OrganismCard
                  key={organism.id}
                  organism={organism}
                  cfg={cfg}
                  risk={risk}
                  hasFullAccess={hasFullAccess}
                  onClick={() => handleCardClick(organism)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      {selectedOrganism && (
        <OrganismModal
          organism={selectedOrganism}
          showPaywall={showPaywall}
          hasFullAccess={hasFullAccess}
          user={user}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ORGANISM CARD
// ─────────────────────────────────────────────
function OrganismCard({ organism, cfg, risk, hasFullAccess, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: 'white',
        borderRadius: '0.625rem',
        border: `1px solid ${hovered ? cfg.border : '#e2e8f0'}`,
        padding: '1rem',
        cursor: 'pointer',
        transition: 'all 0.15s',
        boxShadow: hovered ? `0 4px 16px ${cfg.color}18` : '0 1px 3px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-1px)' : 'none',
        position: 'relative',
      }}
    >
      {/* Lock indicator */}
      {!hasFullAccess && (
        <div style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          fontSize: '0.75rem', color: '#94a3b8',
        }}>🔒</div>
      )}

      {/* Category pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
        background: cfg.light, color: cfg.color,
        border: `1px solid ${cfg.border}`,
        borderRadius: '999px', padding: '0.2rem 0.6rem',
        fontSize: '0.7rem', fontWeight: '600', marginBottom: '0.625rem'
      }}>
        <span>{CATEGORIES[organism.category]?.emoji}</span>
        <span>{organism.category}</span>
      </div>

      <div style={{ fontWeight: '700', fontSize: '0.9375rem', color: '#1e293b', marginBottom: '0.2rem', paddingRight: '1.25rem' }}>
        {organism.commonName}
      </div>
      <div style={{ fontSize: '0.775rem', color: '#64748b', fontStyle: 'italic', marginBottom: '0.5rem' }}>
        {organism.scientificName}
      </div>
      <div style={{ fontSize: '0.775rem', color: '#475569', lineHeight: 1.4, marginBottom: '0.75rem' }}>
        {organism.type}
      </div>

      {/* Risk badge */}
      <div style={{
        display: 'inline-block',
        background: risk.bg, color: risk.text,
        border: `1px solid ${risk.border}`,
        borderRadius: '999px', padding: '0.15rem 0.6rem',
        fontSize: '0.7rem', fontWeight: '600'
      }}>
        {risk.label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ORGANISM MODAL
// ─────────────────────────────────────────────
function OrganismModal({ organism, showPaywall, hasFullAccess, user, onClose }) {
  const cfg = CATEGORIES[organism.category] || CATEGORIES['All'];
  const risk = RISK_COLORS[organism.riskLevel];

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(15,36,66,0.65)',
        zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', backdropFilter: 'blur(2px)',
      }}
    >
      <div style={{
        backgroundColor: 'white', borderRadius: '1rem', maxWidth: '680px', width: '100%',
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Modal header */}
        <div style={{
          background: `linear-gradient(135deg, ${cfg.color}ee, ${cfg.color})`,
          padding: '1.5rem', color: 'white', position: 'relative', flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '1rem', right: '1rem',
              background: 'rgba(255,255,255,0.2)', border: 'none',
              color: 'white', borderRadius: '999px', width: '28px', height: '28px',
              cursor: 'pointer', fontSize: '1rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>{CATEGORIES[organism.category]?.emoji}</span>
            <span style={{
              fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em',
              textTransform: 'uppercase', opacity: 0.85
            }}>{organism.category}</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
            {organism.commonName}
          </h2>
          <p style={{ margin: '0 0 0.75rem', opacity: 0.85, fontStyle: 'italic', fontSize: '0.9rem' }}>
            {organism.scientificName}
          </p>
          <div style={{
            display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.2)', borderRadius: '999px',
              padding: '0.2rem 0.75rem', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.3)'
            }}>
              {organism.type}
            </div>
            <div style={{
              background: risk.bg, color: risk.text, borderRadius: '999px',
              padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: '600'
            }}>
              {risk.label}
            </div>
          </div>
        </div>

        {/* Modal body */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {showPaywall ? (
            /* ── PAYWALL ── */
            <PaywallContent user={user} onClose={onClose} organism={organism} />
          ) : (
            /* ── FULL PROFILE ── */
            <div style={{ padding: '1.5rem' }}>
              {[
                { label: '💡 Unique Fact', key: 'uniqueFact', accent: cfg.color },
                { label: '📖 History', key: 'history' },
                { label: '🦠 How It Infects', key: 'infectionRoute' },
                { label: '📍 Body Location', key: 'bodyLocation' },
                { label: '💊 Treatment Now (2026)', key: 'treatmentNow', accent: '#0f766e' },
                { label: '🏺 Treatment 100 Years Ago', key: 'treatmentHistorical' },
                { label: '🌏 Queensland / Australian Relevance', key: 'australiaRelevance', accent: '#1d4ed8' },
                { label: '🔍 Also Interesting', key: 'interesting' },
              ].map(({ label, key, accent }) => (
                <div key={key} style={{ marginBottom: '1.25rem' }}>
                  <div style={{
                    fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: accent || '#64748b', marginBottom: '0.375rem'
                  }}>
                    {label}
                  </div>
                  <p style={{
                    margin: 0, fontSize: '0.9rem', lineHeight: 1.65, color: '#334155',
                    backgroundColor: accent ? `${accent}08` : '#f8fafc',
                    padding: '0.75rem', borderRadius: '0.375rem',
                    borderLeft: `3px solid ${accent || '#e2e8f0'}`,
                  }}>
                    {organism[key]}
                  </p>
                </div>
              ))}

              {/* Disclaimer */}
              <div style={{
                backgroundColor: '#fef9c3', border: '1px solid #fde047',
                borderRadius: '0.5rem', padding: '0.875rem 1rem',
                fontSize: '0.8rem', color: '#713f12', lineHeight: 1.5
              }}>
                ⚠️ <strong>Educational Use Only.</strong> This information is for reference and is not medical advice. Consult a qualified healthcare professional for diagnosis and treatment.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAYWALL CONTENT
// ─────────────────────────────────────────────
function PaywallContent({ user, onClose, organism }) {
  return (
    <div style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
      {/* Blurred teaser */}
      <div style={{
        position: 'relative', backgroundColor: '#f8fafc',
        borderRadius: '0.625rem', padding: '1.25rem', marginBottom: '1.5rem',
        border: '1px solid #e2e8f0', overflow: 'hidden'
      }}>
        <div style={{ filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
            💡 Unique Fact
          </div>
          <p style={{ color: '#334155', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
            {organism.uniqueFact}
          </p>
        </div>
        {/* Lock overlay */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(248,250,252,0.7)',
        }}>
          <span style={{ fontSize: '2.5rem' }}>🔒</span>
        </div>
      </div>

      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔓</div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e3a5f', margin: '0 0 0.5rem' }}>
        Unlock Full Clinical Profile
      </h3>
      <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
        {user
          ? 'Subscribe to ParasitePro to access all 44 full organism profiles, including infection routes, 2026 treatments, historical context, and Queensland-specific relevance.'
          : 'Create a free account and subscribe to access all 44 full pathogen profiles.'
        }
      </p>

      {/* What you get */}
      <div style={{
        backgroundColor: '#f0fdf4', border: '1px solid #86efac',
        borderRadius: '0.625rem', padding: '1rem', marginBottom: '1.5rem',
        textAlign: 'left'
      }}>
        <div style={{ fontWeight: '700', fontSize: '0.8125rem', color: '#166534', marginBottom: '0.5rem' }}>
          What you'll get access to:
        </div>
        {[
          '44 full pathogen clinical profiles',
          'Infection routes & body locations',
          '2026 treatment options',
          'Historical treatment comparison',
          'Queensland & Australian relevance notes',
          'Unique facts & research highlights',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8375rem', color: '#166534', marginBottom: '0.25rem' }}>
            <span>✓</span><span>{item}</span>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {!user && (
          <Link
            to="/signup"
            onClick={onClose}
            style={{
              display: 'inline-block',
              backgroundColor: '#1e3a5f', color: 'white',
              padding: '0.75rem 1.75rem', borderRadius: '0.5rem',
              fontWeight: '700', fontSize: '0.9375rem', textDecoration: 'none',
            }}
          >
            Create Free Account
          </Link>
        )}
        <Link
          to="/pricing"
          onClick={onClose}
          style={{
            display: 'inline-block',
            backgroundColor: user ? '#1e3a5f' : 'white',
            color: user ? 'white' : '#1e3a5f',
            border: '2px solid #1e3a5f',
            padding: '0.75rem 1.75rem', borderRadius: '0.5rem',
            fontWeight: '700', fontSize: '0.9375rem', textDecoration: 'none',
          }}
        >
          {user ? 'View Plans & Subscribe' : 'See Pricing'}
        </Link>
      </div>

      <button
        onClick={onClose}
        style={{
          marginTop: '1rem', background: 'none', border: 'none',
          color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem'
        }}
      >
        Continue browsing →
      </button>
    </div>
  );
}
