import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import { useAuthStore } from '../store/authStore';

const _BASE = import.meta.env.VITE_API_URL || 'https://parasitepro-mvp-production-b051.up.railway.app';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

const RISK_STYLES = {
  low:      { background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)' },
  moderate: { background: 'rgba(217,119,6,0.1)',  color: '#D97706', border: '1px solid rgba(217,119,6,0.25)' },
  high:     { background: 'rgba(239,68,68,0.1)',  color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' },
};

const CAT_STYLES = {
  'Protozoa':     { background: 'rgba(59,130,246,0.1)',  color: '#60A5FA', border: '1px solid rgba(59,130,246,0.25)' },
  'Helminths':    { background: 'rgba(167,139,250,0.1)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.25)' },
  'Ectoparasite': { background: 'rgba(251,146,60,0.1)',  color: '#FB923C', border: '1px solid rgba(251,146,60,0.25)' },
};
const fallbackStyle = { background: 'rgba(156,163,175,0.1)', color: '#9CA3AF', border: '1px solid rgba(156,163,175,0.25)' };

function Badge({ style, children }) {
  return (
    <span style={{ ...style, padding: '2px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>
      {children}
    </span>
  );
}

export default function EncyclopediaPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  const [parasites, setParasites] = useState([]);
  const [selectedParasite, setSelectedParasite] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filter, setFilter] = useState({ category: '', search: '', letter: '' });

  useEffect(() => { fetchParasites(); }, [filter.category]);

  useEffect(() => {
    if (slug) fetchParasiteDetails(slug);
    else setSelectedParasite(null);
  }, [slug]);

  useEffect(() => { fetchCategories(); }, []);

  const fetchParasites = async () => {
    try {
      const params = {};
      if (filter.category) params.category = filter.category;
      if (filter.search) params.search = filter.search;
      const res = await axios.get(`${API_URL}/encyclopedia`, { params });
      setParasites(res.data.parasites || []);
    } catch (err) {
      console.error('Encyclopedia fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/encyclopedia/categories`);
      setCategories(res.data.categories || []);
    } catch {}
  };

  const fetchParasiteDetails = async (parasiteSlug) => {
    setDetailLoading(true);
    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const res = await axios.get(`${API_URL}/encyclopedia/${parasiteSlug}`, { headers });
      setSelectedParasite(res.data.parasite);
    } catch (err) {
      console.error('Detail fetch failed:', err);
      navigate('/encyclopedia');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchParasites();
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const availableLetters = useMemo(() => new Set(parasites.map(p => p.common_name.charAt(0).toUpperCase())), [parasites]);

  const filteredParasites = useMemo(() => {
    let r = parasites;
    if (filter.letter) r = r.filter(p => p.common_name.toUpperCase().startsWith(filter.letter));
    return r;
  }, [parasites, filter.letter]);

  const groupedParasites = useMemo(() => {
    const g = {};
    filteredParasites.forEach(p => {
      const l = p.common_name.charAt(0).toUpperCase();
      if (!g[l]) g[l] = [];
      g[l].push(p);
    });
    return g;
  }, [filteredParasites]);

  // ── Detail view ────────────────────────────────────────────────────────────
  if (detailLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--amber)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          Loading…
        </div>
      </div>
    );
  }

  if (selectedParasite) {
    const riskStyle = RISK_STYLES[selectedParasite.risk_level] || RISK_STYLES.moderate;
    const catStyle = CAT_STYLES[selectedParasite.category] || fallbackStyle;

    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <SEO title={`${selectedParasite.common_name} — Parasite Encyclopedia`} description={selectedParasite.description} />

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem' }}>
          <Link to="/encyclopedia" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--amber)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', marginBottom: '1.5rem' }}>
            ← Back to Encyclopedia
          </Link>

          {/* Header card */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: 12, padding: '1.75rem', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>{selectedParasite.common_name}</h1>
            <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-muted)', margin: '0 0 1rem' }}>{selectedParasite.scientific_name}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
              <Badge style={catStyle}>{selectedParasite.category}</Badge>
              <Badge style={riskStyle}>{selectedParasite.risk_level} risk</Badge>
              {selectedParasite.australian_prevalence && (
                <Badge style={fallbackStyle}>{selectedParasite.australian_prevalence}</Badge>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{selectedParasite.description}</p>
          </div>

          {/* Symptoms */}
          {selectedParasite.symptoms?.length > 0 && (
            <Section title="Symptoms">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedParasite.symptoms.map((s, i) => (
                  <span key={i} style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', color: 'var(--amber)', padding: '4px 12px', borderRadius: 9999, fontSize: '0.8125rem' }}>{s}</span>
                ))}
              </div>
            </Section>
          )}

          {/* Transmission */}
          {selectedParasite.transmission?.length > 0 && (
            <Section title="Transmission">
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {selectedParasite.transmission.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </Section>
          )}

          {/* Microscopy */}
          {selectedParasite.microscopy && (
            <Section title="Microscopy Notes">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>{selectedParasite.microscopy}</p>
            </Section>
          )}

          {/* Natural Remedies */}
          {selectedParasite.remedies?.length > 0 && (
            <Section title="Natural Remedies" accent>
              {selectedParasite.remedies.map((r, i) => (
                <div key={i} style={{ background: 'var(--bg-base)', border: '1px solid var(--bg-border)', borderRadius: 8, padding: '0.875rem 1rem', marginBottom: i < selectedParasite.remedies.length - 1 ? 8 : 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{r.name}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: r.notes ? 6 : 0 }}>
                    <span><strong>Dosage:</strong> {r.dosage}</span>
                    <span><strong>Duration:</strong> {r.duration}</span>
                    {r.evidence && <span><strong>Evidence:</strong> {r.evidence}</span>}
                  </div>
                  {r.notes && <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{r.notes}</p>}
                </div>
              ))}
            </Section>
          )}

          {/* Conventional treatment */}
          {selectedParasite.conventional_treatment && (
            <Section title="Conventional Treatment">
              <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>{selectedParasite.conventional_treatment}</p>
            </Section>
          )}

          {/* Dietary advice */}
          {selectedParasite.dietary_advice?.length > 0 && (
            <Section title="Dietary Advice">
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {selectedParasite.dietary_advice.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </Section>
          )}

          {/* Prevention */}
          {selectedParasite.prevention?.length > 0 && (
            <Section title="Prevention">
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {selectedParasite.prevention.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </Section>
          )}

          {/* Affected regions */}
          {selectedParasite.affected_regions?.length > 0 && (
            <Section title="Affected Regions (Australia)">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedParasite.affected_regions.map((r, i) => (
                  <span key={i} style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60A5FA', padding: '4px 12px', borderRadius: 9999, fontSize: '0.8125rem' }}>{r}</span>
                ))}
              </div>
            </Section>
          )}

          <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 8, fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            ⚠️ <strong style={{ color: 'var(--amber)' }}>Medical Disclaimer:</strong> This information is for educational reference only and does not constitute medical advice. Always consult a qualified healthcare provider for diagnosis and treatment of parasitic infections.
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <SEO
        title="Parasite Encyclopedia — ParasitePro"
        description="Comprehensive Australian parasitology reference: symptoms, transmission, natural remedies and treatment for 25+ parasites."
      />

      {/* Header */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--bg-border)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.25rem', fontFamily: 'var(--font-heading)' }}>Parasite Encyclopedia</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9375rem' }}>
            {parasites.length > 0 ? `${parasites.length} parasites` : ''} — Australian-focused, clinically referenced
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* Sidebar */}
        <aside style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: 10, padding: '1.25rem', position: 'sticky', top: 80 }}>
          {/* Search */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>Search</div>
            <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                type="text"
                placeholder="Search parasites…"
                value={filter.search}
                onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
                className="pp-input"
                style={{ fontSize: '0.875rem' }}
              />
              <button type="submit" className="pp-btn-primary" style={{ fontSize: '0.8125rem', padding: '6px 12px' }}>Search</button>
            </form>
          </div>

          {/* Category */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>Category</div>
            <select
              value={filter.category}
              onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
              className="pp-input"
              style={{ fontSize: '0.875rem', cursor: 'pointer' }}
            >
              <option value="">All</option>
              {categories.map(c => (
                <option key={c.category} value={c.category}>{c.category} ({c.count})</option>
              ))}
            </select>
          </div>

          {/* A-Z */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>Browse A–Z</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
              <button
                onClick={() => setFilter(f => ({ ...f, letter: '' }))}
                style={{ padding: '4px 2px', fontSize: '0.6875rem', fontWeight: 600, borderRadius: 4, border: 'none', cursor: 'pointer', background: filter.letter === '' ? 'var(--amber)' : 'var(--bg-elevated)', color: filter.letter === '' ? '#000' : 'var(--text-muted)' }}
              >All</button>
              {alphabet.map(l => (
                <button
                  key={l}
                  disabled={!availableLetters.has(l)}
                  onClick={() => availableLetters.has(l) && setFilter(f => ({ ...f, letter: l }))}
                  style={{ padding: '4px 2px', fontSize: '0.6875rem', fontWeight: 600, borderRadius: 4, border: 'none', cursor: availableLetters.has(l) ? 'pointer' : 'default', background: filter.letter === l ? 'var(--amber)' : (availableLetters.has(l) ? 'var(--bg-elevated)' : 'transparent'), color: filter.letter === l ? '#000' : (availableLetters.has(l) ? 'var(--text-secondary)' : 'var(--bg-border)') }}
                >{l}</button>
              ))}
            </div>
          </div>

          {(filter.letter || filter.category || filter.search) && (
            <button
              onClick={() => setFilter({ category: '', search: '', letter: '' })}
              style={{ marginTop: '1rem', width: '100%', padding: '6px', fontSize: '0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', borderRadius: 6, color: 'var(--text-muted)', cursor: 'pointer' }}
            >Clear filters</button>
          )}
        </aside>

        {/* Main list */}
        <main>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid var(--amber)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
              Loading encyclopedia…
            </div>
          ) : filteredParasites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: 10, color: 'var(--text-muted)' }}>
              No parasites found. Try adjusting your filters.
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredParasites.length}</strong> of {parasites.length} entries
              </div>
              {Object.keys(groupedParasites).sort().map(letter => (
                <div key={letter} style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--amber)', borderBottom: '1px solid var(--bg-border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>{letter}</h2>
                  {groupedParasites[letter].map(p => {
                    const rStyle = RISK_STYLES[p.risk_level] || RISK_STYLES.moderate;
                    const cStyle = CAT_STYLES[p.category] || fallbackStyle;
                    return (
                      <Link
                        key={p.id}
                        to={`/encyclopedia/${p.slug}`}
                        style={{ display: 'block', background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: 8, padding: '1rem 1.125rem', marginBottom: 8, textDecoration: 'none', color: 'inherit', transition: 'border-color 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(217,119,6,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bg-border)'; }}
                      >
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{p.common_name}</div>
                        <div style={{ fontSize: '0.8125rem', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: 6 }}>{p.scientific_name}</div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.625rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <Badge style={cStyle}>{p.category}</Badge>
                          <Badge style={rStyle}>{p.risk_level} risk</Badge>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function Section({ title, children, accent }) {
  return (
    <div style={{ background: accent ? 'rgba(16,185,129,0.04)' : 'var(--bg-surface)', border: `1px solid ${accent ? 'rgba(16,185,129,0.2)' : 'var(--bg-border)'}`, borderRadius: 10, padding: '1.25rem', marginBottom: '0.75rem' }}>
      <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: accent ? '#10B981' : 'var(--text-primary)', margin: '0 0 0.875rem', paddingBottom: '0.625rem', borderBottom: `1px solid ${accent ? 'rgba(16,185,129,0.15)' : 'var(--bg-border)'}` }}>{title}</h2>
      {children}
    </div>
  );
}
