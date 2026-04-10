import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';

const API_URL = (() => {
  const b = import.meta.env.VITE_API_URL || 'https://parasitepro-mvp-production-b051.up.railway.app';
  return b.endsWith('/api') ? b : `${b}/api`;
})();

export default function EncyclopediaPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [parasites, setParasites] = useState([]);
  const [selectedParasite, setSelectedParasite] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: '', search: '', letter: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchParasites();
    fetchCategories();
  }, [filter.category]);

  useEffect(() => {
    if (slug) {
      fetchParasiteDetails(slug);
    } else {
      setSelectedParasite(null);
    }
  }, [slug]);

  const fetchParasites = async () => {
    try {
      const params = {};
      if (filter.category) params.category = filter.category;
      if (filter.search) params.search = filter.search;

      const response = await axios.get(`${API_URL}/encyclopedia`, { params });
      setParasites(response.data.parasites);
    } catch (error) {
      console.error('Failed to fetch parasites:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/encyclopedia/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchParasiteDetails = async (parasiteSlug) => {
    try {
      const response = await axios.get(`${API_URL}/encyclopedia/${parasiteSlug}`);
      setSelectedParasite(response.data.parasite);
    } catch (error) {
      console.error('Failed to fetch parasite details:', error);
      navigate('/encyclopedia');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchParasites();
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const filteredParasites = useMemo(() => {
    let result = parasites;
    if (filter.letter) {
      result = result.filter(p => p.common_name.toUpperCase().startsWith(filter.letter));
    }
    return result;
  }, [parasites, filter.letter]);

  const groupedParasites = useMemo(() => {
    const groups = {};
    filteredParasites.forEach(p => {
      const letter = p.common_name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(p);
    });
    return groups;
  }, [filteredParasites]);

  const getRiskColor = (risk) => {
    const colors = {
      low: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
      moderate: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
      high: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' }
    };
    return colors[risk] || colors.moderate;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Protozoa': { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
      'Helminths': { bg: '#f3e8ff', text: '#6b21a8', border: '#d8b4fe' },
      'Ectoparasite': { bg: '#ffedd5', text: '#9a3412', border: '#fdba74' }
    };
    return colors[category] || { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    },
    pageWrapper: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    header: {
      backgroundColor: '#1e3a5f',
      color: 'white',
      padding: '2rem 1.5rem',
      marginBottom: '0'
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    headerTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '0.5rem',
      letterSpacing: '-0.025em'
    },
    headerSubtitle: {
      fontSize: '1rem',
      opacity: '0.9',
      fontWeight: '400'
    },
    mainLayout: {},
    sidebar: {},
    sidebarSection: {
      marginBottom: '1.5rem'
    },
    sidebarLabel: {
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: '#64748b',
      marginBottom: '0.75rem'
    },
    searchInput: {
      width: '100%',
      padding: '0.625rem 0.875rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'border-color 0.15s, box-shadow 0.15s'
    },
    searchButton: {
      width: '100%',
      padding: '0.625rem',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      marginTop: '0.5rem',
      transition: 'background-color 0.15s'
    },
    categorySelect: {
      width: '100%',
      padding: '0.625rem 0.875rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    alphabetGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '0.25rem'
    },
    alphabetButton: (isActive, hasEntries) => ({
      padding: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      border: 'none',
      borderRadius: '0.25rem',
      cursor: hasEntries ? 'pointer' : 'default',
      backgroundColor: isActive ? '#2563eb' : (hasEntries ? '#f1f5f9' : 'transparent'),
      color: isActive ? 'white' : (hasEntries ? '#334155' : '#cbd5e1'),
      transition: 'all 0.15s'
    }),
    mainContent: {
      minWidth: 0
    },
    statsBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      padding: '0.75rem 1rem',
      backgroundColor: 'white',
      borderRadius: '0.375rem',
      border: '1px solid #e2e8f0'
    },
    statsText: {
      fontSize: '0.875rem',
      color: '#64748b'
    },
    letterSection: {
      marginBottom: '2rem'
    },
    letterHeader: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1e3a5f',
      padding: '0.5rem 0',
      borderBottom: '2px solid #2563eb',
      marginBottom: '1rem'
    },
    entryCard: {
      backgroundColor: 'white',
      padding: '1rem 1.25rem',
      borderRadius: '0.375rem',
      border: '1px solid #e2e8f0',
      marginBottom: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.15s',
      display: 'block',
      textDecoration: 'none',
      color: 'inherit'
    },
    entryTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '0.25rem'
    },
    entryScientific: {
      fontSize: '0.875rem',
      fontStyle: 'italic',
      color: '#64748b',
      marginBottom: '0.5rem'
    },
    entryDescription: {
      fontSize: '0.875rem',
      color: '#475569',
      lineHeight: '1.5',
      marginBottom: '0.75rem',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    badgeRow: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap'
    },
    badge: (colors) => ({
      padding: '0.25rem 0.625rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      borderRadius: '9999px',
      backgroundColor: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`
    }),
    mobileFilterToggle: {}
  };

  const detailStyles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem 1rem'
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#2563eb',
      fontSize: '0.875rem',
      fontWeight: '500',
      textDecoration: 'none',
      marginBottom: '1.5rem'
    },
    headerCard: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0',
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1e3a5f',
      marginBottom: '0.25rem'
    },
    scientific: {
      fontSize: '1.125rem',
      fontStyle: 'italic',
      color: '#64748b',
      marginBottom: '1rem'
    },
    description: {
      fontSize: '1rem',
      lineHeight: '1.7',
      color: '#374151',
      marginTop: '1.5rem'
    },
    section: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0',
      marginBottom: '1rem'
    },
    sectionTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e3a5f',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid #e2e8f0'
    },
    sectionContent: {
      fontSize: '0.9375rem',
      lineHeight: '1.7',
      color: '#475569'
    },
    list: {
      paddingLeft: '1.25rem',
      margin: 0
    },
    listItem: {
      marginBottom: '0.5rem',
      lineHeight: '1.6'
    },
    tagList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem'
    },
    tag: (bgColor) => ({
      padding: '0.5rem 1rem',
      backgroundColor: bgColor,
      borderRadius: '9999px',
      fontSize: '0.875rem',
      color: '#374151'
    }),
    remedyCard: {
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0',
      marginBottom: '0.75rem'
    },
    remedyName: {
      fontWeight: '600',
      color: '#1e3a5f',
      marginBottom: '0.5rem'
    },
    remedyGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '0.5rem',
      fontSize: '0.875rem',
      marginBottom: '0.5rem'
    },
    remedyNotes: {
      fontSize: '0.8125rem',
      color: '#64748b',
      fontStyle: 'italic'
    },
    disclaimer: {
      marginTop: '2rem',
      padding: '1rem 1.5rem',
      backgroundColor: '#fef3c7',
      borderRadius: '0.5rem',
      border: '1px solid #fcd34d'
    },
    disclaimerText: {
      fontSize: '0.875rem',
      color: '#92400e',
      lineHeight: '1.6'
    }
  };

  if (selectedParasite) {
    const riskColors = getRiskColor(selectedParasite.risk_level);
    const categoryColors = getCategoryColor(selectedParasite.category);

    return (
      <div style={styles.container}>
        <SEO 
          title={`${selectedParasite.common_name} - Parasite Encyclopedia`}
          description={selectedParasite.description}
        />
        <Navbar />
        
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.headerTitle}>Parasite Encyclopedia</h1>
            <p style={styles.headerSubtitle}>Comprehensive parasitology reference database</p>
          </div>
        </div>

        <div style={detailStyles.container}>
          <Link to="/encyclopedia" style={detailStyles.backLink}>
            ← Back to Encyclopedia
          </Link>

          <div style={detailStyles.headerCard}>
            <h1 style={detailStyles.title}>{selectedParasite.common_name}</h1>
            <p style={detailStyles.scientific}>{selectedParasite.scientific_name}</p>
            
            <div style={styles.badgeRow}>
              <span style={styles.badge(categoryColors)}>{selectedParasite.category}</span>
              <span style={styles.badge(riskColors)}>{selectedParasite.risk_level} risk</span>
            </div>
            
            <p style={detailStyles.description}>{selectedParasite.description}</p>
          </div>

          <div style={detailStyles.section}>
            <h2 style={detailStyles.sectionTitle}>Lifecycle</h2>
            <p style={detailStyles.sectionContent}>{selectedParasite.lifecycle}</p>
          </div>

          <div style={detailStyles.section}>
            <h2 style={detailStyles.sectionTitle}>Symptoms</h2>
            <div style={detailStyles.tagList}>
              {(selectedParasite.symptoms || []).map((symptom, index) => (
                <span key={index} style={detailStyles.tag('#fef3c7')}>{symptom}</span>
              ))}
            </div>
          </div>

          <div style={detailStyles.section}>
            <h2 style={detailStyles.sectionTitle}>Transmission Routes</h2>
            <ul style={detailStyles.list}>
              {(selectedParasite.transmission || []).map((item, index) => (
                <li key={index} style={detailStyles.listItem}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={{ ...detailStyles.section, backgroundColor: '#f0fdf4', borderColor: '#86efac' }}>
            <h2 style={{ ...detailStyles.sectionTitle, color: '#166534', borderColor: '#86efac' }}>Natural Remedies</h2>
            {(selectedParasite.natural_remedies || []).map((remedy, index) => (
              <div key={index} style={detailStyles.remedyCard}>
                <div style={detailStyles.remedyName}>{remedy.name}</div>
                <div style={detailStyles.remedyGrid}>
                  <div><strong>Dosage:</strong> {remedy.dosage}</div>
                  <div><strong>Duration:</strong> {remedy.duration}</div>
                </div>
                {remedy.notes && (
                  <div style={detailStyles.remedyNotes}>{remedy.notes}</div>
                )}
              </div>
            ))}
          </div>

          <div style={detailStyles.section}>
            <h2 style={detailStyles.sectionTitle}>Prevention</h2>
            <ul style={detailStyles.list}>
              {(selectedParasite.prevention || []).map((item, index) => (
                <li key={index} style={detailStyles.listItem}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={detailStyles.section}>
            <h2 style={detailStyles.sectionTitle}>Affected Regions</h2>
            <div style={detailStyles.tagList}>
              {(selectedParasite.affected_regions || []).map((region, index) => (
                <span key={index} style={detailStyles.tag('#dbeafe')}>{region}</span>
              ))}
            </div>
          </div>

          <div style={detailStyles.disclaimer}>
            <p style={detailStyles.disclaimerText}>
              <strong>Medical Disclaimer:</strong> This information is for educational purposes only and is not intended as medical advice. 
              Natural remedies should be used under professional guidance. Always consult with a qualified healthcare provider for diagnosis and treatment of parasitic infections.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const availableLetters = new Set(parasites.map(p => p.common_name.charAt(0).toUpperCase()));

  return (
    <div style={styles.container}>
      <SEO 
        title="Parasite Encyclopedia - Parasite Identification Pro"
        description="Comprehensive educational database of parasites with lifecycle, symptoms, transmission, and natural remedies"
      />
      <Navbar />
      
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Parasite Encyclopedia</h1>
          <p style={styles.headerSubtitle}>Comprehensive parasitology reference database with symptoms, transmission, and natural treatment options</p>
        </div>
      </div>

      <button 
        className="mobile-filter-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? 'Hide Filters' : 'Show Filters & Search'}
      </button>

      <div style={styles.mainLayout} className="encyclopedia-layout">
        <aside style={styles.sidebar} className={`encyclopedia-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div style={styles.sidebarSection}>
            <div style={styles.sidebarLabel}>Search</div>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search parasites..."
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                style={styles.searchInput}
              />
              <button type="submit" style={styles.searchButton}>
                Search
              </button>
            </form>
          </div>

          <div style={styles.sidebarSection}>
            <div style={styles.sidebarLabel}>Category</div>
            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              style={styles.categorySelect}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.category} value={cat.category}>
                  {cat.category} ({cat.count})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.sidebarSection}>
            <div style={styles.sidebarLabel}>Browse A-Z</div>
            <div style={styles.alphabetGrid}>
              <button
                style={styles.alphabetButton(filter.letter === '', true)}
                onClick={() => setFilter(prev => ({ ...prev, letter: '' }))}
              >
                All
              </button>
              {alphabet.map(letter => (
                <button
                  key={letter}
                  style={styles.alphabetButton(filter.letter === letter, availableLetters.has(letter))}
                  onClick={() => availableLetters.has(letter) && setFilter(prev => ({ ...prev, letter }))}
                  disabled={!availableLetters.has(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Quick Stats</div>
            <div style={{ fontSize: '0.875rem', color: '#334155' }}>
              <div><strong>{parasites.length}</strong> total entries</div>
              <div style={{ marginTop: '0.25rem' }}>
                {categories.map(c => (
                  <div key={c.category} style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    {c.category}: {c.count}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main style={styles.mainContent}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              Loading encyclopedia...
            </div>
          ) : filteredParasites.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              backgroundColor: 'white', 
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#334155' }}>No parasites found</p>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Try adjusting your search or filters</p>
              {parasites.length === 0 && (
                <button 
                  onClick={async () => {
                    await axios.post('/api/encyclopedia/seed');
                    fetchParasites();
                    fetchCategories();
                  }}
                  style={styles.searchButton}
                >
                  Load Encyclopedia Data
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={styles.statsBar}>
                <span style={styles.statsText}>
                  Showing {filteredParasites.length} of {parasites.length} entries
                  {filter.letter && ` starting with "${filter.letter}"`}
                  {filter.category && ` in ${filter.category}`}
                </span>
                {(filter.letter || filter.category || filter.search) && (
                  <button
                    onClick={() => setFilter({ category: '', search: '', letter: '' })}
                    style={{
                      padding: '0.375rem 0.75rem',
                      fontSize: '0.75rem',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      color: '#475569'
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {Object.keys(groupedParasites).sort().map(letter => (
                <div key={letter} style={styles.letterSection} id={`letter-${letter}`}>
                  <h2 style={styles.letterHeader}>{letter}</h2>
                  {groupedParasites[letter].map(parasite => {
                    const riskColors = getRiskColor(parasite.risk_level);
                    const categoryColors = getCategoryColor(parasite.category);
                    
                    return (
                      <Link
                        key={parasite.id}
                        to={`/encyclopedia/${parasite.slug}`}
                        style={styles.entryCard}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#2563eb';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={styles.entryTitle}>{parasite.common_name}</div>
                        <div style={styles.entryScientific}>{parasite.scientific_name}</div>
                        <p style={styles.entryDescription}>{parasite.description}</p>
                        <div style={styles.badgeRow}>
                          <span style={styles.badge(categoryColors)}>{parasite.category}</span>
                          <span style={styles.badge(riskColors)}>{parasite.risk_level} risk</span>
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
