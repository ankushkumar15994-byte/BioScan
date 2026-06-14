import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DatasetBanner.module.css';

const DatasetBanner = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.bannerSection}>
      <div className={styles.bannerBg}></div>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Powered by World-Class Data</h2>
          <p className={styles.description}>
            Our MobileNetV2 neural network is trained on the Kaggle New Plant Diseases Dataset — one of the largest augmented plant pathology datasets available.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontSize: '28px' }}>database</span>
            </div>
            <div className={styles.cardValue}>87K+</div>
            <div className={styles.cardLabel}>Training Images</div>
            <div className={styles.cardDesc}>
              Augmented dataset with rotation, flipping, zoom, and shear transformations for robust field performance.
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontSize: '28px' }}>category</span>
            </div>
            <div className={styles.cardValue}>38</div>
            <div className={styles.cardLabel}>Disease Classes</div>
            <div className={styles.cardDesc}>
              Covering both healthy and diseased specimens across 14 crop species including tomato, potato, corn, and grape.
            </div>
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'var(--on-surface-variant)', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontSize: '16px' }}>psychiatry</span>
                <strong style={{ color: '#fff' }}>Deep Scan Enabled</strong>
              </div>
              <span style={{ lineHeight: '1.4', display: 'block' }}>
                Advanced Gemini AI integration provides secondary analysis for edge cases and unlisted diseases.
              </span>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontSize: '28px' }}>speed</span>
            </div>
            <div className={styles.cardValue}>96.8%</div>
            <div className={styles.cardLabel}>Validation Accuracy</div>
            <div className={styles.cardDesc}>
              Transfer learning from ImageNet with MobileNetV2 achieves near-expert classification accuracy.
            </div>
          </div>
        </div>

        <div className={styles.ctaRow}>
          <button
            className={`${styles.ctaBtn} ${styles.ctaBtnPrimary}`}
            onClick={() => navigate('/laboratory')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>biotech</span>
            Try the Scanner
          </button>
          <button
            className={`${styles.ctaBtn} ${styles.ctaBtnOutline}`}
            onClick={() => navigate('/knowledge')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>school</span>
            View Full Dataset Info
          </button>
        </div>
      </div>
    </section>
  );
};

export default DatasetBanner;
