import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.heroSection}>
      <div className={styles.overlayGradient}></div>
      <div className={styles.contentGrid}>

        {/* Hero Content */}
        <div className={styles.textContent}>
          <div className={styles.statusBadge}>
            <span className={`${styles.statusDot} pulse-border`}></span>
            <span className={styles.statusText}>System Core Online</span>
          </div>

          <h1 className={styles.title}>
            AI-Driven <br/>
            <span className="text-primary-fixed-dim">Phytopathology</span><br/>
            Platform.
          </h1>

          <p className={styles.description}>
            Deploy advanced machine learning and computer vision algorithms to detect, analyze, and mitigate crop diseases instantly. Precision agriculture powered by neural diagnostics.
          </p>

          <div className={styles.actionButtons}>
            <button
              className={`${styles.scanBtn} btn-primary`}
              onClick={() => navigate('/laboratory')}
            >
              <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                <circle cx="12" cy="13" r="3"></circle>
              </svg>
              Scan Now
            </button>

            <div className={styles.secondaryActions}>
              <button
                className={`${styles.uploadBtn} glass-panel`}
                onClick={() => navigate('/laboratory')}
              >
                <span className="material-symbols-outlined">upload</span>
                Upload Image
              </button>

              <button
                className={`${styles.docBtn} glass-panel`}
                onClick={() => navigate('/knowledge')}
              >
                <span className="material-symbols-outlined">description</span>
                View Docs
              </button>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className={styles.statsPanel}>
          <div className={`${styles.statsCard} glass-panel glow-effect`}>
            <div className={styles.statsHeader}>
              <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
              <span className={styles.statsTitle}>System Diagnostics</span>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>87K+</span>
                <span className={styles.statLabel}>Training Images</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>38</span>
                <span className={styles.statLabel}>Disease Classes</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>95%+</span>
                <span className={styles.statLabel}>Accuracy</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>14</span>
                <span className={styles.statLabel}>Crop Species</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className={styles.statLabel}>Model Confidence</span>
                <span className={styles.statLabel} style={{ color: 'var(--primary-fixed-dim)' }}>96.2%</span>
              </div>
              <div className={styles.confidenceBar}>
                <div className={styles.confidenceFill} style={{ width: '96.2%' }}></div>
              </div>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontSize: '18px' }}>psychiatry</span>
                <span className={styles.statLabel} style={{ color: '#fff', fontWeight: 'bold' }}>Deep Scan AI</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)', margin: 0, lineHeight: '1.4' }}>
                Active and ready for complex or unknown pathogen analysis.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;