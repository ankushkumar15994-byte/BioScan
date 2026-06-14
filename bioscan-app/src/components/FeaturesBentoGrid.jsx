import React from 'react';
import styles from './FeaturesBentoGrid.module.css';

const FeaturesBentoGrid = () => {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Architected for Precision</h2>
          <p className={styles.description}>
            Our bio-digital synthesis approach combines vast agricultural datasets with cutting-edge neural networks to deliver actionable insights before visible symptoms appear.
          </p>
        </div>

        <div className={styles.bentoGrid}>
          {/* Feature 1: Neural Diagnostic Engine (Wide) */}
          <div className={`${styles.bentoCard} ${styles.colSpan8} glass-panel glow-effect`}>
            <div className={styles.decorativeBg}></div>
            <div className={styles.contentZ10}>
              <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontSize: '36px', marginBottom: '24px', display: 'block' }}>memory</span>
              <h3 className={styles.cardTitle}>Neural Diagnostic Engine</h3>
              <p className={styles.cardDesc}>
                Proprietary convolutional neural networks trained on over 87,000 annotated pathological specimens. Features MobileNetV2 architecture for 38 known diseases, plus an advanced Deep Scan AI engine for detecting unknown and edge-case pathogens.
              </p>
            </div>

            <div className={styles.neuralNetVisual}>
              <div className={styles.barContainer}>
                <div className={styles.bar1}></div>
                <div className={styles.bar2}></div>
                <div className={styles.bar3}></div>
              </div>
              <div className={styles.barContainer2}>
                <div className={styles.bar4}></div>
                <div className={styles.bar5}></div>
                <div className={styles.bar6}></div>
              </div>
            </div>
          </div>

          {/* Feature 2: Molecular Analysis (Narrow) */}
          <div className={`${styles.bentoCard} ${styles.colSpan4} glass-panel glow-effect`}>
            <div className={styles.decorativeBg}></div>
            <div className={styles.contentZ10}>
              <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontSize: '36px', marginBottom: '24px', display: 'block' }}>science</span>
              <h3 className={styles.cardTitle}>Molecular Analysis</h3>
              <p className={styles.cardDesc}>
                Cellular-level identification of 14+ crop species using advanced image processing.
              </p>
            </div>

            <div className={styles.moleculeVisual}>
              <div className={styles.moleculeNode}></div>
              <div className={styles.moleculeConnect}></div>
              <div className={styles.moleculeNodeLg}></div>
              <div className={styles.moleculeConnect}></div>
              <div className={styles.moleculeNode}></div>
            </div>
          </div>

          {/* Feature 3: Threat Map (Half) */}
          <div className={`${styles.bentoCard} ${styles.colSpan6} glass-panel glow-effect`}>
            <div className={styles.decorativeBg}></div>
            <div className={styles.contentZ10}>
              <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontSize: '36px', marginBottom: '24px', display: 'block' }}>map</span>
              <h3 className={styles.cardTitle}>Geo-Threat Mapping</h3>
              <p className={styles.cardDesc}>
                Real-time regional disease tracking powered by the New Plant Diseases Dataset with data augmentation for robust field performance.
              </p>
            </div>

            <div className={styles.gridVisual}>
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`${styles.gridCell} ${[2, 5, 9, 13].includes(i) ? styles.gridCellActive : ''}`}
                ></div>
              ))}
            </div>
          </div>

          {/* Feature 4: Treatment Protocol (Half) */}
          <div className={`${styles.bentoCard} ${styles.colSpan6} glass-panel glow-effect`}>
            <div className={styles.decorativeBg}></div>
            <div className={styles.contentZ10}>
              <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontSize: '36px', marginBottom: '24px', display: 'block' }}>healing</span>
              <h3 className={styles.cardTitle}>Treatment Protocols</h3>
              <p className={styles.cardDesc}>
                AI-generated treatment recommendations powered by transfer learning from ImageNet and fine-tuned with agricultural domain expertise across 38 disease classes.
              </p>
            </div>

            <div className={styles.neuralNetVisual}>
              <div className={styles.barContainer}>
                <div className={styles.bar4}></div>
                <div className={styles.bar1}></div>
                <div className={styles.bar6}></div>
              </div>
              <div className={styles.barContainer2}>
                <div className={styles.bar2}></div>
                <div className={styles.bar5}></div>
                <div className={styles.bar3}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesBentoGrid;