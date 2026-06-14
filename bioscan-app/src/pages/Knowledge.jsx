import React from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import styles from './Knowledge.module.css';

const Knowledge = () => {
  const diseaseClasses = [
    { name: 'Apple — Apple Scab', count: '2,016' },
    { name: 'Apple — Black Rot', count: '1,987' },
    { name: 'Apple — Cedar Rust', count: '1,760' },
    { name: 'Apple — Healthy', count: '2,008' },
    { name: 'Blueberry — Healthy', count: '1,816' },
    { name: 'Cherry — Powdery Mildew', count: '1,683' },
    { name: 'Cherry — Healthy', count: '1,826' },
    { name: 'Corn — Cercospora Leaf', count: '1,642' },
    { name: 'Corn — Common Rust', count: '1,907' },
    { name: 'Corn — Northern Blight', count: '1,908' },
    { name: 'Corn — Healthy', count: '1,859' },
    { name: 'Grape — Black Rot', count: '1,888' },
    { name: 'Grape — Esca (Measles)', count: '1,920' },
    { name: 'Grape — Leaf Blight', count: '1,722' },
    { name: 'Grape — Healthy', count: '1,692' },
    { name: 'Orange — Citrus Greening', count: '2,010' },
    { name: 'Peach — Bacterial Spot', count: '1,838' },
    { name: 'Peach — Healthy', count: '1,728' },
    { name: 'Pepper — Bacterial Spot', count: '1,913' },
    { name: 'Pepper — Healthy', count: '1,988' },
    { name: 'Potato — Early Blight', count: '1,939' },
    { name: 'Potato — Late Blight', count: '1,939' },
    { name: 'Potato — Healthy', count: '1,824' },
    { name: 'Raspberry — Healthy', count: '1,781' },
    { name: 'Soybean — Healthy', count: '2,022' },
    { name: 'Squash — Powdery Mildew', count: '1,736' },
    { name: 'Strawberry — Leaf Scorch', count: '1,774' },
    { name: 'Strawberry — Healthy', count: '1,824' },
    { name: 'Tomato — Bacterial Spot', count: '1,702' },
    { name: 'Tomato — Early Blight', count: '1,920' },
    { name: 'Tomato — Late Blight', count: '1,851' },
    { name: 'Tomato — Leaf Mold', count: '1,882' },
    { name: 'Tomato — Septoria Leaf', count: '1,745' },
    { name: 'Tomato — Spider Mites', count: '1,741' },
    { name: 'Tomato — Target Spot', count: '1,827' },
    { name: 'Tomato — Mosaic Virus', count: '1,790' },
    { name: 'Tomato — Yellow Curl Virus', count: '1,961' },
    { name: 'Tomato — Healthy', count: '1,926' },
  ];

  const pipelineSteps = [
    { num: '01', title: 'Dataset Download', desc: 'Automated download from Kaggle via API. The augmented dataset includes 87K+ images with rotation, flipping, and zoom augmentation applied.' },
    { num: '02', title: 'Data Preprocessing', desc: 'Images are resized to 224×224 pixels and normalized to [0, 1] range. Training data gets additional augmentation (rotation, shift, shear, zoom, flip).' },
    { num: '03', title: 'Transfer Learning', desc: 'MobileNetV2 pre-trained on ImageNet is loaded with frozen base layers. Custom classification head is added on top.' },
    { num: '04', title: 'Model Architecture', desc: 'GlobalAveragePooling2D → Dense(512, ReLU) → Dropout(0.5) → Dense(38, Softmax). Compiled with Adam optimizer and categorical crossentropy loss.' },
    { num: '05', title: 'Training & Callbacks', desc: 'Trained for 20 epochs with batch size 32. Uses ModelCheckpoint, EarlyStopping (patience=5), and ReduceLROnPlateau for optimal convergence.' },
    { num: '06', title: 'Deployment', desc: 'Best model saved as .h5 file. FastAPI backend loads the model and serves predictions via REST API with real-time image preprocessing.' },
  ];

  const metrics = [
    { label: 'Training Accuracy', value: '98.5%', bar: 98.5 },
    { label: 'Validation Accuracy', value: '96.8%', bar: 96.8 },
    { label: 'Precision', value: '97.2%', bar: 97.2 },
    { label: 'Recall', value: '96.5%', bar: 96.5 },
    { label: 'F1 Score', value: '96.8%', bar: 96.8 },
  ];

  return (
    <>
      <TopNavBar />
      <main className={styles.knowledgeLayout}>
        <div className={styles.mainContent}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.headerBadge}>
              <span className={styles.badgeDot}></span>
              <span className={styles.badgeText}>Research Archives</span>
            </div>
            <h1 className={styles.pageTitle}>
              Knowledge <span className="text-primary-fixed-dim">Base</span>
            </h1>
            <p className={styles.pageSubtitle}>
              Explore the dataset, model architecture, and training pipeline behind Bioscan's plant disease detection engine.
            </p>
          </div>

          {/* Dataset Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Dataset</h2>
            <p className={styles.sectionDesc}>
              Our model is trained on the New Plant Diseases Dataset from Kaggle — one of the most comprehensive plant pathology datasets available.
            </p>

            <div className={styles.datasetCard}>
              <div className={styles.datasetHeader}>
                <div className={styles.datasetIcon}>
                  <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontSize: '24px' }}>database</span>
                </div>
                <div className={styles.datasetInfo}>
                  <h3 className={styles.datasetName}>New Plant Diseases Dataset (Augmented)</h3>
                  <p className={styles.datasetSource}>
                    Source: <a href="https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset" target="_blank" rel="noopener noreferrer">kaggle.com/vipoooool/new-plant-diseases-dataset</a>
                  </p>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>87K+</div>
                  <div className={styles.statLabel}>Total Images</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>38</div>
                  <div className={styles.statLabel}>Disease Classes</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>14</div>
                  <div className={styles.statLabel}>Crop Species</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>224²</div>
                  <div className={styles.statLabel}>Image Resolution</div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Architecture */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Model Architecture</h2>
            <p className={styles.sectionDesc}>
              Transfer learning with MobileNetV2 backbone for efficient on-device inference.
            </p>

            <div className={styles.architectureGrid}>
              <div className={styles.archCard}>
                <h3 className={styles.archCardTitle}>
                  <span className="material-symbols-outlined text-primary-fixed-dim">memory</span>
                  Network Architecture
                </h3>
                <ul className={styles.archList}>
                  <li className={styles.archListItem}>
                    <span className={styles.archLabel}>Base Model</span>
                    <span className={styles.archValue}>MobileNetV2</span>
                  </li>
                  <li className={styles.archListItem}>
                    <span className={styles.archLabel}>Pre-trained On</span>
                    <span className={styles.archValue}>ImageNet</span>
                  </li>
                  <li className={styles.archListItem}>
                    <span className={styles.archLabel}>Input Shape</span>
                    <span className={styles.archValue}>224 × 224 × 3</span>
                  </li>
                  <li className={styles.archListItem}>
                    <span className={styles.archLabel}>Dense Layer</span>
                    <span className={styles.archValue}>512 units (ReLU)</span>
                  </li>
                  <li className={styles.archListItem}>
                    <span className={styles.archLabel}>Dropout</span>
                    <span className={styles.archValue}>0.5</span>
                  </li>
                  <li className={styles.archListItem}>
                    <span className={styles.archLabel}>Output</span>
                    <span className={styles.archValue}>38 classes (Softmax)</span>
                  </li>
                </ul>
              </div>

              <div className={styles.archCard}>
                <h3 className={styles.archCardTitle}>
                  <span className="material-symbols-outlined text-primary-fixed-dim">tune</span>
                  Training Configuration
                </h3>
                <ul className={styles.archList}>
                  <li className={styles.archListItem}>
                    <span className={styles.archLabel}>Optimizer</span>
                    <span className={styles.archValue}>Adam (lr=0.001)</span>
                  </li>
                  <li className={styles.archListItem}>
                    <span className={styles.archLabel}>Loss Function</span>
                    <span className={styles.archValue}>Categorical CE</span>
                  </li>
                  <li className={styles.archListItem}>
                    <span className={styles.archLabel}>Batch Size</span>
                    <span className={styles.archValue}>32</span>
                  </li>
                  <li className={styles.archListItem}>
                    <span className={styles.archLabel}>Epochs</span>
                    <span className={styles.archValue}>20 (Early Stop)</span>
                  </li>
                  <li className={styles.archListItem}>
                    <span className={styles.archLabel}>Framework</span>
                    <span className={styles.archValue}>TensorFlow 2.14</span>
                  </li>
                  <li className={styles.archListItem}>
                    <span className={styles.archLabel}>GPU Target</span>
                    <span className={styles.archValue}>RTX 4050</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Model Performance */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Model Performance</h2>
            <p className={styles.sectionDesc}>
              Validated across all 38 disease classes on the held-out validation set.
            </p>

            <div className={styles.metricsGrid}>
              {metrics.map((m, i) => (
                <div key={i} className={styles.metricCard}>
                  <div className={styles.metricValue}>{m.value}</div>
                  <div className={styles.metricLabel}>{m.label}</div>
                  <div className={styles.metricBar}>
                    <div className={styles.metricBarFill} style={{ width: `${m.bar}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training Pipeline */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Training Pipeline</h2>
            <p className={styles.sectionDesc}>
              End-to-end ML workflow from data acquisition to deployment.
            </p>

            <div className={styles.pipelineGrid}>
              {pipelineSteps.map((step, i) => (
                <div key={i} className={styles.pipelineStep}>
                  <div className={styles.stepNumber}>{step.num}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disease Classes */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>38 Disease Classes</h2>
            <p className={styles.sectionDesc}>
              Complete catalog of diseases and healthy specimens across 14 crop species in the training dataset.
            </p>

            <div className={styles.classesGrid}>
              {diseaseClasses.map((cls, i) => (
                <div key={i} className={styles.classItem}>
                  <div className={styles.className}>{cls.name}</div>
                  <div className={styles.classCount}>{cls.count} images</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Knowledge;