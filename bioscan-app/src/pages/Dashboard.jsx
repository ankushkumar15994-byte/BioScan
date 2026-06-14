import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [profile, setProfile] = useState({ name: '', email: '', occupation: '', avatar_url: '' });
  const [scans, setScans] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newOccupation, setNewOccupation] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Interactivity states
  const [activeTab, setActiveTab] = useState('overview'); // overview, support
  const [filterText, setFilterText] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }
    
    const fetchData = async () => {
      try {
        const [profileRes, scansRes] = await Promise.all([
          fetch('http://localhost:8000/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:8000/api/scans/history', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
          setNewName(profileData.name || '');
          setNewOccupation(profileData.occupation || '');
        }
        
        if (scansRes.ok) {
          const scansData = await scansRes.json();
          setScans(scansData.scans || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName, occupation: newOccupation })
      });
      
      if (res.ok) {
        const data = await res.json();
        setProfile({ ...profile, name: data.name, occupation: data.occupation });
        localStorage.setItem('userName', data.name);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to update profile.');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/auth/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setProfile({ ...profile, avatar_url: data.avatar_url });
      }
    } catch (err) {
      console.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/auth');
  };

  const exportToCSV = () => {
    if (scans.length === 0) return;
    
    const headers = ['Timestamp', 'Crop/Species', 'Disease/Detection', 'Confidence', 'Mode'];
    const rows = scans.map(scan => [
      new Date(scan.created_at).toISOString(),
      scan.crop_name,
      scan.disease_name,
      `${scan.confidence}%`,
      scan.mode
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bioscan_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className={styles.dashboardPage}>
        <TopNavBar />
        <div style={{padding: '2rem', textAlign: 'center', color: '#00ff88', fontFamily: 'monospace'}}>
          INITIALIZING SYSTEM CORE...
        </div>
      </div>
    );
  }

  // Dynamic stats calculation
  const isScanHealthy = (name) => {
    if (!name) return false;
    const n = name.toLowerCase();
    return n.includes('healthy') || n.includes('no disease') || n.includes('unknown') || n === 'none';
  };

  const totalScans = scans.length;
  const pathogensDetected = scans.filter(s => !isScanHealthy(s.disease_name)).length;
  const healthyPlantsCount = totalScans - pathogensDetected;

  // Filtering
  const filteredScans = scans.filter(s => 
    s.crop_name.toLowerCase().includes(filterText.toLowerCase()) || 
    s.disease_name.toLowerCase().includes(filterText.toLowerCase())
  );
  
  const displayedScans = filteredScans;

  const renderSimView = (title, icon, text) => (
    <div className={styles.simView}>
      <div className={styles.simHeader}>
        <h2 className={styles.simTitle}><span className="material-symbols-outlined">{icon}</span> {title}</h2>
      </div>
      <div className={styles.simContent}>
        <div className={styles.terminalView}>
          <p>{`>`} INITIALIZING {title.toUpperCase()} PROTOCOL...</p>
          <p>{`>`} CONNECTING TO SATELLITE NODES...</p>
          <p>{`>`} DATA LINK ESTABLISHED.</p>
          <br/>
          <p>{text}</p>
          <br/>
          <p style={{animation: 'blink 1s step-end infinite'}}>{`> _`}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.dashboardPage}>
      <TopNavBar />
      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.systemCore}>
            <h3>System Core</h3>
            <p>AI PROCESSING ACTIVE</p>
          </div>
          <button className={styles.newAnalysisBtn} onClick={() => navigate('/laboratory')}>
            New Analysis
          </button>
          
          <div className={styles.navGroup} style={{ marginTop: '2rem' }}>
            <button className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`} onClick={() => setActiveTab('overview')}>
              <span className="material-symbols-outlined">dashboard</span> Overview
            </button>
            <button className={styles.navItem} onClick={() => {setActiveTab('overview'); setTimeout(() => document.getElementById('history-table')?.scrollIntoView({behavior: 'smooth'}), 100)}}>
              <span className="material-symbols-outlined">history</span> History
            </button>
          </div>
          
          <div className={styles.spacer}></div>
          
          <div className={styles.navGroup}>
            <button className={`${styles.navItem} ${activeTab === 'support' ? styles.active : ''}`} onClick={() => setActiveTab('support')}>
              <span className="material-symbols-outlined">help</span> Support
            </button>
            <button className={styles.navItem} onClick={handleSignOut} style={{color: '#ef4444'}}>
              <span className="material-symbols-outlined">logout</span> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {activeTab === 'overview' && (
            <>
              {/* Stats Row */}
              <div className={styles.statsRow}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>HEALTHY PLANTS SCANNED</div>
                  <div className={`${styles.statValue} ${styles.green}`}>{healthyPlantsCount}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>DISEASED PLANTS</div>
                  <div className={`${styles.statValue} ${styles.red}`}>{pathogensDetected}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>AI STATUS</div>
                  <div className={styles.statValue}>Stable</div>
                  <div className={`${styles.statIndicator} ${styles.stable}`}>
                    <div className={`${styles.dot} ${styles.green}`}></div>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>TOTAL SCANNED PLANTS</div>
                  <div className={styles.statValue}>{totalScans}</div>
                </div>
              </div>

              {/* Profile Row */}
              <div className={styles.profileRow}>
                <div className={styles.profileCard}>
                  <div className={styles.avatarWrapper} onClick={() => fileInputRef.current?.click()}>
                    {isUploading ? (
                      <span className={styles.avatarInitials}><span className="material-symbols-outlined" style={{animation: 'spin 1s linear infinite'}}>refresh</span></span>
                    ) : profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className={styles.avatarImg} />
                    ) : (
                      <span className={styles.avatarInitials}>
                        {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                    <div className={styles.avatarOverlay}>
                      <span className="material-symbols-outlined">photo_camera</span>
                      <p>CHANGE</p>
                    </div>
                    <div className={styles.statusDot}></div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarUpload} 
                      style={{display: 'none'}} 
                      accept="image/*"
                    />
                  </div>
                  <h2 className={styles.profileName}>{profile.name || 'User'}</h2>
                  <div className={styles.profileTitle}>{profile.occupation || 'SENIOR PHYTOPATHOLOGIST'}</div>
                  
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className={styles.editForm}>
                      <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <input 
                          type="text" 
                          className={styles.input}
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Occupation Title</label>
                        <input 
                          type="text" 
                          className={styles.input}
                          value={newOccupation}
                          onChange={(e) => setNewOccupation(e.target.value)}
                          placeholder="e.g. SENIOR PHYTOPATHOLOGIST"
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className={styles.editProfileBtn} style={{ flex: 1, borderColor: '#00ff88', color: '#00ff88' }}>Save</button>
                        <button type="button" className={styles.editProfileBtn} onClick={() => setIsEditing(false)} style={{ flex: 1 }}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className={styles.profileDetails}>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Email</span>
                          <span className={styles.detailValue}>{profile.email}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Node Access</span>
                          <span className={styles.detailValue}>Tier 5 (Full)</span>
                        </div>
                      </div>
                      <button className={styles.editProfileBtn} onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </>
                  )}
                </div>

                <div className={styles.diagnosticsPane}>
                  <div className={styles.liveBadge}>
                    <span className={`${styles.dot} ${styles.green}`} style={{display: 'inline-block', marginRight: '6px'}}></span>
                    LIVE STREAM
                  </div>
                  <div className={styles.diagBox}>
                    <h4 className={styles.diagTitle}>Active Neural Diagnostics</h4>
                    <p className={styles.diagText}>
                      Real-time scan data flowing from the Amazonian Deep-Node-01. Analyzing leaf morphology at 240fps.
                    </p>
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div className={styles.historySection} id="history-table">
                <div className={styles.historyHeader}>
                  <h3 className={styles.historyTitle}>Scan History</h3>
                  
                  {showFilter && (
                    <div className={styles.filterContainer}>
                      <span className="material-symbols-outlined" style={{fontSize: '16px', color: '#64748b'}}>search</span>
                      <input 
                        type="text" 
                        placeholder="Search species or pathogen..." 
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className={styles.filterInput}
                        autoFocus
                      />
                      <button onClick={() => {setShowFilter(false); setFilterText('');}} style={{background:'transparent', border:'none', color: '#64748b', cursor:'pointer'}}>
                        <span className="material-symbols-outlined" style={{fontSize: '16px'}}>close</span>
                      </button>
                    </div>
                  )}

                  <div className={styles.historyActions}>
                    <button onClick={() => setShowFilter(!showFilter)}><span className="material-symbols-outlined" style={{fontSize: '16px'}}>filter_list</span> Filter</button>
                    <button onClick={exportToCSV}><span className="material-symbols-outlined" style={{fontSize: '16px'}}>download</span> Export</button>
                  </div>
                </div>
                
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>TIMESTAMP</th>
                        <th>PLANT SPECIES</th>
                        <th>DETECTION</th>
                        <th>CONFIDENCE</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedScans.length > 0 ? displayedScans.map((scan, index) => {
                        const isHealthy = isScanHealthy(scan.disease_name);
                        const d = new Date(scan.created_at);
                        const dateStr = d.toISOString().split('T')[0].replace(/-/g, '.');
                        const timeStr = d.toISOString().split('T')[1].split('.')[0];

                        return (
                          <tr key={index}>
                            <td>
                              <div className={styles.timestamp}>
                                <span className={styles.date}>{dateStr}</span>
                                <span className={styles.time}>{timeStr} UTC</span>
                              </div>
                            </td>
                            <td>
                              <div className={styles.species}>
                                <span className={styles.name}>{scan.crop_name}</span>
                                <span className={styles.sub}>{scan.mode === 'gemini' ? 'Deep Scan Node' : 'Standard Node'}</span>
                              </div>
                            </td>
                            <td>
                              <div className={styles.detection}>
                                <div className={`${styles.dot} ${isHealthy ? styles.green : styles.red}`}></div>
                                <span>{isHealthy ? 'No Pathogen Detected' : scan.disease_name}</span>
                              </div>
                            </td>
                            <td>
                              <div className={styles.confidenceWrapper}>
                                <div className={`${styles.confInfo} ${isHealthy ? styles.green : styles.red}`}>
                                  <span>{isHealthy ? 'Health Score' : 'Match'}</span>
                                  <span>{scan.confidence}%</span>
                                </div>
                                <div className={styles.confBar}>
                                  <div className={`${styles.confFill} ${isHealthy ? styles.green : styles.red}`} style={{width: `${scan.confidence}%`}}></div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <button className={styles.viewReport} onClick={() => setSelectedReport(scan)}>
                                View Report <span className="material-symbols-outlined" style={{fontSize: '16px'}}>chevron_right</span>
                              </button>
                            </td>
                          </tr>
                        )
                      }) : (
                        <tr>
                          <td colSpan="5" style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
                            <span className="material-symbols-outlined" style={{fontSize: '32px', marginBottom: '1rem'}}>search_off</span>
                            <br/>
                            No scans found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Conditional Views */}
          {activeTab === 'support' && renderSimView('Support', 'help', 'BIOSCAN FIELD SUPPORT AGENT V2.4 READY. HOW CAN I ASSIST?')}
        </main>
      </div>

      {/* Modal */}
      {selectedReport && (
        <div className={styles.modalOverlay} onClick={() => setSelectedReport(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={() => setSelectedReport(null)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Scan Report</h3>
              <div className={styles.modalSubtitle}>ID: {selectedReport.id || Math.random().toString(36).substr(2, 9).toUpperCase()} • {new Date(selectedReport.created_at).toLocaleString()}</div>
            </div>
            
            <div className={styles.modalBody}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div className={styles.reportField}>
                  <span className={styles.reportLabel}>Plant Species</span>
                  <span className={styles.reportValue}>{selectedReport.crop_name}</span>
                </div>
                <div className={styles.reportField}>
                  <span className={styles.reportLabel}>Detection Result</span>
                  <span className={styles.reportValue} style={{color: !isScanHealthy(selectedReport.disease_name) ? '#ef4444' : '#00ff88'}}>
                    {selectedReport.disease_name}
                  </span>
                </div>
                <div className={styles.reportField}>
                  <span className={styles.reportLabel}>Confidence Score</span>
                  <span className={styles.reportValue}>{selectedReport.confidence}%</span>
                </div>
                <div className={styles.reportField}>
                  <span className={styles.reportLabel}>Analysis Engine</span>
                  <span className={styles.reportValue}>{selectedReport.mode === 'gemini' ? 'Deep Scan (Gemini)' : 'Standard Local Node'}</span>
                </div>
              </div>
              
              {!isScanHealthy(selectedReport.disease_name) && (
                <div className={styles.treatmentBox}>
                  <h4 className={styles.treatmentTitle}>
                    <span className="material-symbols-outlined">medical_services</span> Recommended Action
                  </h4>
                  <p style={{fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5}}>
                    Immediate isolation of affected plant recommended. Apply appropriate treatment protocol for {selectedReport.disease_name}. 
                    Consult field agronomy guide for chemical application rates.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
