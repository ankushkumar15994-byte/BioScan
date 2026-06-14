import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import styles from './Auth.module.css';

const Auth = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState(localStorage.getItem('savedEmail') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const endpoint = mode === 'register' 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/register' 
        : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/login';
      const body = mode === 'register' ? { name, email, password } : { email, password };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('savedEmail', email);
      if (data.name) {
        localStorage.setItem('userName', data.name);
      }
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: tokenResponse.access_token })
        });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.detail || 'Google Authentication failed');
        }
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', data.access_token);
        if (data.email) {
          localStorage.setItem('savedEmail', data.email);
        } else if (email) {
          localStorage.setItem('savedEmail', email);
        }
        if (data.name) {
          localStorage.setItem('userName', data.name);
        }
        navigate('/home');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google Sign-In failed')
  });

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.brand}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
            <h1>Bioscan</h1>
          </div>
          <span className={styles.subtitle}>SECURE ACCESS REQUIRED</span>
        </div>

        {/* Toggle */}
        <div className={styles.toggleContainer}>
          <button 
            className={`${styles.toggleBtn} ${mode === 'login' ? styles.active : ''}`}
            onClick={() => setMode('login')}
            type="button"
          >
            LOGIN
          </button>
          <button 
            className={`${styles.toggleBtn} ${mode === 'register' ? styles.active : ''}`}
            onClick={() => setMode('register')}
            type="button"
          >
            REGISTER
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth}>
          {error && <div style={{ color: '#ff4d4d', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem', padding: '10px', backgroundColor: 'rgba(255, 77, 77, 0.1)', borderRadius: '4px', border: '1px solid rgba(255, 77, 77, 0.3)' }}>{error}</div>}
          
          {mode === 'register' && (
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">FULL NAME</label>
              <div className={styles.inputWrapper}>
                <span className={`material-symbols-outlined ${styles.inputIcon}`}>badge</span>
                <input 
                  id="name"
                  name="name"
                  type="text" 
                  className={styles.input} 
                  placeholder="Dr. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">EMAIL ADDRESS</label>
            <div className={styles.inputWrapper}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>person</span>
              <input 
                id="email"
                name="email"
                type="email" 
                className={styles.input} 
                placeholder="name@neural-link.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                autoComplete="username email"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              {mode === 'register' ? 'CREATE PASSWORD' : 'PASSWORD'}
            </label>
            <div className={styles.inputWrapper}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>key</span>
              <input 
                id="password"
                name="password"
                type="password" 
                className={styles.input} 
                placeholder={mode === 'register' ? "Create a password" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="confirmPassword">CONFIRM PASSWORD</label>
              <div className={styles.inputWrapper}>
                <span className={`material-symbols-outlined ${styles.inputIcon}`}>key</span>
                <input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password" 
                  className={styles.input} 
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          <button type="submit" className={styles.authorizeBtn} disabled={loading}>
            {loading ? 'Processing...' : 'Authorize'}
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>login</span>
          </button>
        </form>

        {/* Google OAuth */}
        <button type="button" className={styles.googleBtn} onClick={handleGoogleSignIn}>
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {mode === 'register' ? 'Register with Google' : 'Sign in with Google'}
        </button>

        {/* Footer Links */}
        <div className={styles.footerLinks}>
          <a href="#">Forgotten Credentials</a>
          <a href="#">Emergency Protocol</a>
        </div>

        {/* System Status Footer */}
        <div className={styles.systemStatus}>
          <div className={styles.statusRow}>
            <div className={styles.statusItem}>
              <span className={styles.statusDot}></span>
              Node Status: Active
            </div>
            <div className={styles.statusItem}>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>lock</span>
              Secure Link Established
            </div>
          </div>
          <div className={styles.copyright}>
            &copy; 2026 BIOSCAN NEURAL SYSTEMS
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
