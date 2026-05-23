/**
 * validParasites.ts
 * Authoritative list of 24 valid parasites for ParasitePro analysis.
 * Used to validate Claude's responses and reject hallucinations like "blood worm".
 * 
 * Synced from: frontend/src/data/parasites.ts
 * Last updated: 2026-05-23
 */

export interface ValidParasite {
  id: string;
  scientificName: string;
  commonName: string;
  category: 'protozoa' | 'nematode' | 'cestode' | 'trematode' | 'ectoparasite';
}

export const VALID_PARASITES: ValidParasite[] = [
  // Protozoa (7)
  { id: 'giardia', scientificName: 'Giardia lamblia', commonName: 'Giardia', category: 'protozoa' },
  { id: 'cryptosporidium', scientificName: 'Cryptosporidium parvum', commonName: 'Crypto', category: 'protozoa' },
  { id: 'toxoplasma', scientificName: 'Toxoplasma gondii', commonName: 'Toxoplasma', category: 'protozoa' },
  { id: 'malaria', scientificName: 'Plasmodium species', commonName: 'Malaria', category: 'protozoa' },
  { id: 'amoeba', scientificName: 'Entamoeba histolytica', commonName: 'Amoeba', category: 'protozoa' },
  { id: 'trichomonas', scientificName: 'Trichomonas vaginalis', commonName: 'Trich', category: 'protozoa' },
  { id: 'trypanosoma', scientificName: 'Trypanosoma brucei', commonName: 'Sleeping Sickness', category: 'protozoa' },
  { id: 'leishmania', scientificName: 'Leishmania species', commonName: 'Leishmaniasis', category: 'protozoa' },

  // Nematodes (6)
  { id: 'ascaris', scientificName: 'Ascaris lumbricoides', commonName: 'Giant Roundworm', category: 'nematode' },
  { id: 'strongyloides', scientificName: 'Strongyloides stercoralis', commonName: 'Threadworm', category: 'nematode' },
  { id: 'onchocerca', scientificName: 'Onchocerca volvulus', commonName: 'River Blindness', category: 'nematode' },
  { id: 'wuchereria', scientificName: 'Wuchereria bancrofti', commonName: 'Lymphatic Filariasis', category: 'nematode' },
  { id: 'trichinella', scientificName: 'Trichinella spiralis', commonName: 'Trichinellosis', category: 'nematode' },
  { id: 'enterobius', scientificName: 'Enterobius vermicularis', commonName: 'Pinworm', category: 'nematode' },
  { id: 'necator', scientificName: 'Necator americanus', commonName: 'Hookworm', category: 'nematode' },
  { id: 'toxocara', scientificName: 'Toxocara canis', commonName: 'Toxocariasis', category: 'nematode' },

  // Cestodes (3)
  { id: 'taenia', scientificName: 'Taenia saginata / solium', commonName: 'Tapeworm', category: 'cestode' },
  { id: 'echinococcus', scientificName: 'Echinococcus granulosus', commonName: 'Hydatid Disease', category: 'cestode' },
  { id: 'diphyllobothrium', scientificName: 'Diphyllobothrium latum', commonName: 'Fish Tapeworm', category: 'cestode' },

  // Trematodes (3)
  { id: 'schistosoma', scientificName: 'Schistosoma species', commonName: 'Schistosomiasis (Bilharzia)', category: 'trematode' },
  { id: 'opisthorchis', scientificName: 'Opisthorchis viverrini', commonName: 'Chinese Liver Fluke', category: 'trematode' },
  { id: 'fasciola', scientificName: 'Fasciola hepatica', commonName: 'Liver Fluke', category: 'trematode' },

  // Ectoparasites (2)
  { id: 'sarcoptes', scientificName: 'Sarcoptes scabiei', commonName: 'Scabies', category: 'ectoparasite' },
  { id: 'ixodes', scientificName: 'Ixodes ricinus', commonName: 'Paralysis Tick / Deer Tick', category: 'ectoparasite' },
  { id: 'tunga', scientificName: 'Tunga penetrans', commonName: 'Jigger Flea', category: 'ectoparasite' },
];

/**
 * Validate that a parasite detection matches our known list.
 * Returns true if the organism is in VALID_PARASITES, false otherwise.
 */
export function isValidParasite(commonName: string, scientificName: string): boolean {
  return VALID_PARASITES.some(
    p => p.commonName.toLowerCase() === commonName.toLowerCase() ||
         p.scientificName.toLowerCase() === scientificName.toLowerCase()
  );
}

/**
 * Get a valid parasite record by common or scientific name.
 * Returns null if not found.
 */
export function getValidParasite(nameQuery: string): ValidParasite | null {
  const query = nameQuery.toLowerCase();
  return VALID_PARASITES.find(
    p => p.commonName.toLowerCase() === query || 
         p.scientificName.toLowerCase().includes(query)
  ) || null;
}

/**
 * Generate a formatted list of all valid parasites for the Claude prompt.
 */
export function getValidParasiteList(): string {
  const grouped = {
    protozoa: VALID_PARASITES.filter(p => p.category === 'protozoa'),
    nematode: VALID_PARASITES.filter(p => p.category === 'nematode'),
    cestode: VALID_PARASITES.filter(p => p.category === 'cestode'),
    trematode: VALID_PARASITES.filter(p => p.category === 'trematode'),
    ectoparasite: VALID_PARASITES.filter(p => p.category === 'ectoparasite'),
  };

  const lines: string[] = [];
  lines.push('STANDARD PARASITES — APPROVED IDENTIFICATIONS ONLY:');
  lines.push('');

  Object.entries(grouped).forEach(([cat, parasites]) => {
    const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
    lines.push(`${catLabel}s (${parasites.length}):`);
    parasites.forEach(p => {
      lines.push(`  - "${p.commonName}" (${p.scientificName})`);
    });
    lines.push('');
  });

  return lines.join('\n');
}
