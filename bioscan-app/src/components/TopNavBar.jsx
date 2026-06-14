import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './TopNavBar.module.css';

const TopNavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Brand */}
        <div className={styles.brand}>
          <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
          <Link to="/" className={styles.brandText}>Bioscan</Link>
        </div>

        {/* Navigation Links */}
        <div className={styles.links}>
          <Link to="/" className={styles.link}>Diagnostic</Link>
          <Link to="/laboratory" className={styles.link}>Laboratory</Link>
          <Link to="/knowledge" className={styles.link}>Knowledge</Link>
          <Link to="/community" className={styles.link}>Community</Link>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {localStorage.getItem('isAuthenticated') === 'true' ? (
            <button className="btn-outline" onClick={() => navigate('/dashboard')} style={{ marginRight: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>account_circle</span>
              Dashboard
            </button>
          ) : (
            <button className="btn-outline" onClick={() => navigate('/auth')} style={{ marginRight: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>login</span>
              Sign In
            </button>
          )}
          <button className="btn-primary" onClick={() => navigate('/laboratory')}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>play_arrow</span>
            Start Scan
          </button>
          {/* Mobile Menu Toggle */}
          <button className={styles.mobileMenuBtn}>
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
