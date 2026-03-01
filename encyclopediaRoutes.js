/**
 * encyclopediaRoutes.js
 * Parasite Encyclopedia API for ParasitePro
 * Public endpoints — no auth required for browsing
 * Auth required for tracking user favourites (future)
 */

import express from 'express';
import {
  PARASITE_DATABASE,
  searchEncyclopedia,
  getParasiteById,
  getParasitesByType,
  getParasitesByUrgency
} from '../data/parasiteEncyclopedia.js';

const router = express.Router();

/**
 * GET /api/encyclopedia
 * List all parasites or search by keyword
 * Query params: q (search), type (protozoa|helminth|ectoparasite), urgency
 */
router.get('/', (req, res) => {
  const { q, type, urgency, limit = 50, offset = 0 } = req.query;

  let results = PARASITE_DATABASE;

  // Apply search filter
  if (q && q.trim().length >= 2) {
    results = searchEncyclopedia(q.trim());
  }

  // Apply type filter
  if (type) {
    results = results.filter(p => p.type === type);
  }

  // Apply urgency filter
  if (urgency) {
    results = results.filter(p => p.urgencyLevel === urgency);
  }

  // Pagination
  const total = results.length;
  const paginated = results.slice(Number(offset), Number(offset) + Number(limit));

  // Return lightweight list (no holistic details in list view)
  const listItems = paginated.map(p => ({
    id: p.id,
    commonName: p.commonName,
    scientificName: p.scientificName,
    type: p.type,
    urgencyLevel: p.urgencyLevel,
    australianPrevalence: p.australianPrevalence,
    regions: p.regions,
    aliases: p.aliases,
    symptomCount: (p.symptoms || []).length,
    sampleTypes: p.sampleTypes
  }));

  res.json({
    parasites: listItems,
    total,
    limit: Number(limit),
    offset: Number(offset)
  });
});

/**
 * GET /api/encyclopedia/:id
 * Get full details for a single parasite
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const parasite = getParasiteById(id);

  if (!parasite) {
    return res.status(404).json({ error: 'Parasite not found in database.' });
  }

  res.json(parasite);
});

/**
 * GET /api/encyclopedia/type/:type
 * Get all parasites of a given type
 */
router.get('/type/:type', (req, res) => {
  const { type } = req.params;
  const validTypes = ['protozoa', 'helminth', 'ectoparasite'];

  if (!validTypes.includes(type)) {
    return res.status(400).json({
      error: `Invalid type. Must be one of: ${validTypes.join(', ')}`
    });
  }

  const results = getParasitesByType(type);
  res.json({ parasites: results, total: results.length });
});

export default router;
