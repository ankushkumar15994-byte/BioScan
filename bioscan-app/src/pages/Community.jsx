import React, { useState, useEffect } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

const Community = () => {
  const [recentScans, setRecentScans] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [stats, setStats] = useState({
    active_members: '...',
    total_scans: '...',
    disease_classes: '...',
    system_uptime: '24/7'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const [statsRes, scansRes, contribRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/community/stats`),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/community/recent-scans`),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/community/top-contributors`)
        ]);
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        if (scansRes.ok) {
          const scansData = await scansRes.json();
          setRecentScans(scansData.scans || []);
        }
        if (contribRes.ok) {
          const contribData = await contribRes.json();
          setContributors(contribData.contributors || []);
        }
      } catch (err) {
        console.error("Failed to fetch community data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommunityData();
  }, []);

  const discussions = [
    { title: 'Best practices for tomato disease prevention', replies: 24, author: 'Dr. Rajesh M.', tag: 'Prevention' },
    { title: 'Early blight vs Late blight identification tips', replies: 18, author: 'Sunita K.', tag: 'Diagnosis' },
    { title: 'Organic treatments for powdery mildew', replies: 31, author: 'Anand P.', tag: 'Treatment' },
    { title: 'Using Bioscan API for automated monitoring', replies: 12, author: 'DevTeam', tag: 'Technical' },
    { title: 'Seasonal disease patterns in South India', replies: 9, author: 'Dr. Lakshmi V.', tag: 'Research' },
  ];

  const cardStyle = {
    padding: '28px',
    background: 'rgba(28, 33, 28, 0.6)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(59, 75, 62, 0.3)',
    borderRadius: '16px',
  };

  return (
    <>
      <TopNavBar />
      <main style={{ minHeight: '100vh', paddingTop: '80px', background: 'var(--background)' }}>
        <div style={{ maxWidth: 'var(--spacing-container-max)', margin: '0 auto', padding: '48px var(--spacing-gutter)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(28, 33, 28, 0.8)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(59, 75, 62, 0.5)', borderRadius: '9999px',
              padding: '6px 16px', marginBottom: '24px'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-fixed-dim)' }}></span>
              <span style={{ fontFamily: 'var(--font-label-sm)', fontSize: '12px', color: 'var(--on-surface-variant)', letterSpacing: '0.05em' }}>Global Network</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display-lg)', fontSize: '48px', color: 'var(--on-surface)', marginBottom: '12px' }}>
              Community <span className="text-primary-fixed-dim">Hub</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body-lg)', fontSize: '16px', color: 'var(--on-surface-variant)', lineHeight: '1.6' }}>
              Connect with agronomists, pathologists, and researchers worldwide. Share findings and collaborate on plant disease research.
            </p>
          </div>
          
          {loading && (
            <div style={{textAlign: 'center', padding: '2rem', color: '#00ff88', fontFamily: 'monospace'}}>
              INITIALIZING LIVE DATA STREAM...
            </div>
          )}

          {!loading && (
            <>
              {/* Stats Bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px', marginBottom: '48px'
          }}>
            {[
              { value: stats.active_members.toLocaleString(), label: 'Active Members' },
              { value: stats.total_scans.toLocaleString(), label: 'Total Scans' },
              { value: stats.disease_classes, label: 'Disease Classes' },
              { value: stats.system_uptime, label: 'System Uptime' },
            ].map((s, i) => (
              <div key={i} style={{
                ...cardStyle, textAlign: 'center', padding: '20px'
              }}>
                <div style={{ fontFamily: 'var(--font-headline-lg)', fontSize: '28px', fontWeight: '700', color: 'var(--primary-fixed-dim)', marginBottom: '4px' }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--font-label-sm)', fontSize: '12px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
            {/* Recent Scans */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>activity_zone</span>
                <h2 style={{ fontFamily: 'var(--font-headline-md)', fontSize: '22px', color: 'var(--on-surface)' }}>Recent Activity</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentScans.map((scan, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 16px', background: 'rgba(16, 21, 16, 0.5)',
                    borderRadius: '10px', border: '1px solid rgba(59, 75, 62, 0.15)',
                    flexWrap: 'wrap', gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: 'rgba(0, 227, 131, 0.1)', border: '1px solid rgba(0, 227, 131, 0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-label-md)', fontSize: '14px', color: 'var(--primary-fixed-dim)'
                      }}>
                        {scan.user.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-body-md)', fontSize: '14px', color: 'var(--on-surface)' }}>{scan.user}</div>
                        <div style={{ fontFamily: 'var(--font-label-sm)', fontSize: '12px', color: 'var(--on-surface-variant)' }}>
                          {scan.crop} — {scan.disease}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-label-md)', fontSize: '14px', color: 'var(--primary-fixed-dim)', fontWeight: '600' }}>{scan.confidence}%</div>
                      <div style={{ fontFamily: 'var(--font-label-sm)', fontSize: '11px', color: 'var(--on-surface-variant)' }}>{scan.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two Column: Discussions + Contributors */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Discussions */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
                  <h2 style={{ fontFamily: 'var(--font-headline-md)', fontSize: '22px', color: 'var(--on-surface)' }}>Discussions</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {discussions.map((d, i) => (
                    <div key={i} style={{
                      padding: '14px', background: 'rgba(16, 21, 16, 0.5)',
                      borderRadius: '10px', border: '1px solid rgba(59, 75, 62, 0.15)',
                      cursor: 'pointer', transition: 'border-color 0.3s'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                        <h4 style={{ fontFamily: 'var(--font-body-md)', fontSize: '14px', color: 'var(--on-surface)', lineHeight: '1.4' }}>{d.title}</h4>
                        <span style={{
                          padding: '3px 10px', borderRadius: '9999px', fontSize: '11px',
                          fontFamily: 'var(--font-label-sm)', background: 'rgba(0, 227, 131, 0.1)',
                          color: 'var(--primary-fixed-dim)', border: '1px solid rgba(0, 227, 131, 0.2)',
                          whiteSpace: 'nowrap'
                        }}>{d.tag}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-label-sm)', fontSize: '12px', color: 'var(--on-surface-variant)' }}>
                        {d.author} · {d.replies} replies
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                  <h2 style={{ fontFamily: 'var(--font-headline-md)', fontSize: '22px', color: 'var(--on-surface)' }}>Top Contributors</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {contributors.map((c, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '16px', background: 'rgba(16, 21, 16, 0.5)',
                      borderRadius: '10px', border: '1px solid rgba(59, 75, 62, 0.15)'
                    }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        background: i === 0 ? 'rgba(0, 227, 131, 0.2)' : 'rgba(59, 75, 62, 0.3)',
                        border: i === 0 ? '2px solid var(--primary-fixed-dim)' : '1px solid rgba(59, 75, 62, 0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-headline-md)', fontSize: '18px',
                        color: i === 0 ? 'var(--primary-fixed-dim)' : 'var(--on-surface-variant)'
                      }}>
                        #{i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-body-md)', fontSize: '15px', color: 'var(--on-surface)', fontWeight: '500' }}>{c.name}</div>
                        <div style={{ fontFamily: 'var(--font-label-sm)', fontSize: '12px', color: 'var(--on-surface-variant)' }}>{c.role}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--font-headline-md)', fontSize: '20px', color: 'var(--primary-fixed-dim)', fontWeight: '700' }}>{c.scans}</div>
                        <div style={{ fontFamily: 'var(--font-label-sm)', fontSize: '11px', color: 'var(--on-surface-variant)' }}>scans</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Community;