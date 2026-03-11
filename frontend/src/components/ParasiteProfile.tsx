// @ts-nocheck
import { useState } from 'react';
import {
  Globe, Microscope, AlertCircle, Shield, BookOpen,
  Activity, ChevronDown, ChevronUp, Zap, Eye
} from 'lucide-react';

interface ParasiteProfileData {
  commonName: string;
  scientificName: string;
  classification?: {
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
    genus?: string;
    species?: string;
  };
  description?: string;
  appearance?: string;
  size?: string;
  lifecycle?: string;
  transmission?: string[];
  geographicDistribution?: string;
  australianRelevance?: string;
  symptomsInHumans?: string[];
  symptomsInAnimals?: string[];
  incubationPeriod?: string;
  treatmentOverview?: string;
  preventionTips?: string[];
  riskGroups?: string[];
  funFact?: string;
  dangerLevel?: 'low' | 'moderate' | 'high' | 'critical';
  imageDescription?: string;
}

interface ParasiteProfileProps {
  profileData?: ParasiteProfileData;
  primaryFinding?: string;
  scientificName?: string;
}

const DANGER_COLOURS = {
  low:      { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  text: '#10B981', label: 'Low Risk' },
  moderate: { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  text: '#F59E0B', label: 'Moderate Risk' },
  high:     { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   text: '#EF4444', label: 'High Risk' },
  critical: { bg: 'rgba(153,27,27,0.15)',  border: 'rgba(153,27,27,0.5)',   text: '#FCA5A5', label: 'Critical Risk' },
};

const Tab = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
      background: active ? 'rgba(217,119,6,0.2)' : 'transparent',
      border: active ? '1px solid rgba(217,119,6,0.4)' : '1px solid transparent',
      color: active ? '#F59E0B' : '#6B7280',
      cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
      fontFamily: "'DM Sans', sans-serif",
    }}
  >{label}</button>
);

const InfoRow = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'JetBrains Mono, monospace', minWidth: 100, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12.5, color: '#D1D5DB', flex: 1, lineHeight: 1.4 }}>{value}</span>
    </div>
  );
};

// Fallback profile generator when AI doesn't return structured profile
function buildFallbackProfile(primaryFinding: string, scientificName?: string): ParasiteProfileData {
  return {
    commonName: primaryFinding,
    scientificName: scientificName || 'Species identification pending',
    description: `${primaryFinding} is a parasitic organism identified through AI-assisted image analysis. Consult a healthcare professional for confirmation and further information about this specific species.`,
    geographicDistribution: 'Varies by species — your geographic location and travel history are factored into the analysis.',
    australianRelevance: 'Australia hosts a diverse range of parasitic organisms, particularly in tropical regions such as North Queensland and the Northern Territory.',
    treatmentOverview: 'Treatment should be guided by a qualified healthcare professional following laboratory confirmation. Various antiparasitic medications may be appropriate depending on the species confirmed.',
    preventionTips: [
      'Wash hands thoroughly before eating and after handling animals or soil',
      'Cook meat and seafood to recommended temperatures',
      'Avoid drinking untreated water',
      'Use appropriate footwear in high-risk environments',
      'Maintain regular deworming protocols for pets',
    ],
    dangerLevel: 'moderate',
  };
}

export default function ParasiteProfile({ profileData, primaryFinding, scientificName }: ParasiteProfileProps) {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'clinical' | 'prevention' | 'facts'>('overview');

  const profile = profileData || (primaryFinding ? buildFallbackProfile(primaryFinding, scientificName) : null);
  if (!profile) return null;

  const danger = DANGER_COLOURS[profile.dangerLevel || 'moderate'];

  return (
    <div className="pp-card" style={{ overflow: 'hidden', border: '1px solid rgba(217,119,6,0.2)', background: 'rgba(217,119,6,0.02)' }}>

      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
          padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
        }}
      >
        {/* Organism icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(217,119,6,0.2), rgba(245,158,11,0.1))',
          border: '1px solid rgba(217,119,6,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Microscope size={20} style={{ color: '#D97706' }}/>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#F5F0E8', fontFamily: "'Syne', sans-serif" }}>
              Parasite Profile
            </span>
            <span style={{
              fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
              padding: '2px 8px', borderRadius: 6,
              background: danger.bg, border: `1px solid ${danger.border}`, color: danger.text,
            }}>
              {danger.label}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>
            {profile.commonName}
            {profile.scientificName && <em style={{ marginLeft: 6, opacity: 0.7 }}>({profile.scientificName})</em>}
          </p>
        </div>

        <div style={{ color: '#6B7280', flexShrink: 0 }}>
          {expanded ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, padding: '12px 16px 0', overflowX: 'auto', flexWrap: 'nowrap' }}>
            {(['overview', 'clinical', 'prevention', 'facts'] as const).map(tab => (
              <Tab key={tab} label={tab.charAt(0).toUpperCase() + tab.slice(1)} active={activeTab === tab} onClick={() => setActiveTab(tab)}/>
            ))}
          </div>

          <div style={{ padding: '16px 20px 20px' }}>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                {profile.description && (
                  <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.65, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>
                    {profile.description}
                  </p>
                )}

                {/* Classification table */}
                {profile.classification && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <BookOpen size={13} style={{ color: '#D97706' }}/>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#F5F0E8', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                        Taxonomy
                      </span>
                    </div>
                    <div style={{ background: 'rgba(14,15,17,0.6)', borderRadius: 10, padding: '4px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <InfoRow label="Kingdom" value={profile.classification.kingdom}/>
                      <InfoRow label="Phylum" value={profile.classification.phylum}/>
                      <InfoRow label="Class" value={profile.classification.class}/>
                      <InfoRow label="Order" value={profile.classification.order}/>
                      <InfoRow label="Family" value={profile.classification.family}/>
                      <InfoRow label="Genus" value={profile.classification.genus}/>
                      <InfoRow label="Species" value={profile.classification.species}/>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {profile.appearance && (
                    <div style={{ background: 'rgba(14,15,17,0.6)', borderRadius: 10, padding: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 10, color: '#6B7280', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>Appearance</div>
                      <p style={{ fontSize: 12.5, color: '#D1D5DB', lineHeight: 1.45 }}>{profile.appearance}</p>
                    </div>
                  )}
                  {profile.size && (
                    <div style={{ background: 'rgba(14,15,17,0.6)', borderRadius: 10, padding: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 10, color: '#6B7280', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>Size Range</div>
                      <p style={{ fontSize: 12.5, color: '#D1D5DB', lineHeight: 1.45 }}>{profile.size}</p>
                    </div>
                  )}
                </div>

                {profile.geographicDistribution && (
                  <div style={{ marginTop: 12, background: 'rgba(14,15,17,0.6)', borderRadius: 10, padding: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Globe size={12} style={{ color: '#60A5FA' }}/>
                      <span style={{ fontSize: 10, color: '#6B7280', fontFamily: 'JetBrains Mono, monospace' }}>Geographic Distribution</span>
                    </div>
                    <p style={{ fontSize: 12.5, color: '#D1D5DB', lineHeight: 1.45 }}>{profile.geographicDistribution}</p>
                  </div>
                )}

                {profile.australianRelevance && (
                  <div style={{ marginTop: 10, background: 'rgba(16,185,129,0.05)', borderRadius: 10, padding: '12px', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <div style={{ fontSize: 10, color: '#10B981', fontFamily: 'JetBrains Mono, monospace', marginBottom: 5 }}>🇦🇺 Australian Context</div>
                    <p style={{ fontSize: 12.5, color: '#A7F3D0', lineHeight: 1.45 }}>{profile.australianRelevance}</p>
                  </div>
                )}
              </div>
            )}

            {/* Clinical Tab */}
            {activeTab === 'clinical' && (
              <div>
                {profile.lifecycle && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <Activity size={13} style={{ color: '#D97706' }}/>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#F5F0E8', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>Life Cycle</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>{profile.lifecycle}</p>
                  </div>
                )}

                {profile.transmission && profile.transmission.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#F5F0E8', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>Transmission Routes</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {profile.transmission.map((t, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <Zap size={12} style={{ color: '#F59E0B', marginTop: 3, flexShrink: 0 }}/>
                          <span style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.45, fontFamily: "'DM Sans', sans-serif" }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.incubationPeriod && (
                  <InfoRow label="Incubation" value={profile.incubationPeriod}/>
                )}

                {profile.symptomsInHumans && profile.symptomsInHumans.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#F5F0E8', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>Symptoms in Humans</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {profile.symptomsInHumans.map((s, i) => (
                        <span key={i} style={{
                          padding: '4px 10px', borderRadius: 20, fontSize: 12,
                          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5',
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.symptomsInAnimals && profile.symptomsInAnimals.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#F5F0E8', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>Symptoms in Animals</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {profile.symptomsInAnimals.map((s, i) => (
                        <span key={i} style={{
                          padding: '4px 10px', borderRadius: 20, fontSize: 12,
                          background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', color: '#93C5FD',
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.riskGroups && profile.riskGroups.length > 0 && (
                  <div style={{ marginTop: 14, background: 'rgba(245,158,11,0.06)', borderRadius: 10, padding: '12px', border: '1px solid rgba(245,158,11,0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <AlertCircle size={12} style={{ color: '#F59E0B' }}/>
                      <span style={{ fontSize: 10, color: '#F59E0B', fontFamily: 'JetBrains Mono, monospace' }}>High-Risk Groups</span>
                    </div>
                    <p style={{ fontSize: 12.5, color: '#FDE68A', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{profile.riskGroups.join(' · ')}</p>
                  </div>
                )}

                {profile.treatmentOverview && (
                  <div style={{ marginTop: 12, background: 'rgba(16,185,129,0.05)', borderRadius: 10, padding: '12px', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <div style={{ fontSize: 10, color: '#10B981', fontFamily: 'JetBrains Mono, monospace', marginBottom: 5 }}>Treatment Overview</div>
                    <p style={{ fontSize: 12.5, color: '#A7F3D0', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{profile.treatmentOverview}</p>
                    <p style={{ fontSize: 11, color: '#6B7280', marginTop: 8 }}>⚠️ Do not self-medicate. Consult a GP for diagnosis and treatment guidance.</p>
                  </div>
                )}
              </div>
            )}

            {/* Prevention Tab */}
            {activeTab === 'prevention' && (
              <div>
                {profile.preventionTips && profile.preventionTips.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                      <Shield size={13} style={{ color: '#10B981' }}/>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#F5F0E8', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>Prevention Strategies</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {profile.preventionTips.map((tip, i) => (
                        <div key={i} style={{
                          display: 'flex', gap: 10, padding: '10px 12px',
                          background: 'rgba(16,185,129,0.05)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.12)',
                          alignItems: 'flex-start',
                        }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 700, color: '#10B981', fontFamily: 'JetBrains Mono, monospace',
                          }}>
                            {i + 1}
                          </div>
                          <span style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Facts Tab */}
            {activeTab === 'facts' && (
              <div>
                {profile.funFact && (
                  <div style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.08), rgba(245,158,11,0.04))', borderRadius: 12, padding: '16px', border: '1px solid rgba(217,119,6,0.2)', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <Eye size={13} style={{ color: '#D97706' }}/>
                      <span style={{ fontSize: 10, color: '#D97706', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>Did You Know?</span>
                    </div>
                    <p style={{ fontSize: 13.5, color: '#FDE68A', lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic' }}>{profile.funFact}</p>
                  </div>
                )}

                {/* Scientific summary */}
                <div style={{ background: 'rgba(14,15,17,0.8)', borderRadius: 10, padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 10, color: '#6B7280', fontFamily: 'JetBrains Mono, monospace', marginBottom: 10 }}>Reference Summary</div>
                  <InfoRow label="Common Name" value={profile.commonName}/>
                  <InfoRow label="Scientific" value={profile.scientificName}/>
                  <InfoRow label="Distribution" value={profile.geographicDistribution}/>
                  <InfoRow label="Incubation" value={profile.incubationPeriod}/>
                  <InfoRow label="Risk Level" value={danger.label}/>
                </div>

                <div style={{ marginTop: 12, fontSize: 11, color: '#4B5563', lineHeight: 1.5, textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
                  Profile data is generated by ParasitePro AI and is for educational reference only. Always verify with a qualified healthcare professional.
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
