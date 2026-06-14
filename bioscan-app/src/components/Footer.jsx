import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand & Copyright */}
        <div className={styles.brandSection}>
          <div className={styles.brand}>
            <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
            <span className={styles.brandText}>Bioscan</span>
          </div>
          <p className={styles.copyright}>
            © 2024 Bioscan Bio-Digital Systems. All rights reserved. Precision Agronomy Division.
          </p>
        </div>

        {/* Links */}
        <div className={styles.linksSection}>
          <Link to="/privacy" className={styles.link}>Privacy Protocol</Link>
          <Link to="/terms" className={styles.link}>Terms of Service</Link>
          <Link to="/api-docs" className={styles.link}>API Documentation</Link>
          <a href="#" className={styles.statusLink}>
            Node Status
            <span className={styles.statusIndicator}></span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
