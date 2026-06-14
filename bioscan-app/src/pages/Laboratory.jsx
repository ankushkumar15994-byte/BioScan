import React, { useState, useRef, useCallback, useEffect } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import styles from './Laboratory.module.css';

const Laboratory = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isGeminiScanning, setIsGeminiScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('idle'); // idle, requesting, granted, error
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const playScanCompleteSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
      oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); 
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not supported', e);
    }
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    playScanCompleteSound();
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraStatus('requesting');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setIsCameraOpen(true);
      setCameraStatus('granted');
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      setCameraStatus('error');
      setError("Camera access denied. Please grant permission in your browser settings to use this feature.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraStatus('idle');
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
        handleFileSelect(file);
        stopCamera();
      }, 'image/jpeg');
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleScan = async () => {
    if (!imageFile) return;

    setIsScanning(true);
    setScanProgress(0);
    setResult(null);
    setError(null);

    // Animate progress while waiting for API
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch('http://localhost:8000/api/scan', {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setScanProgress(100);

      // Small delay for the progress bar to reach 100%
      await new Promise(resolve => setTimeout(resolve, 400));

      if (data.success) {
        setResult(data);
        showNotification("Local Scan Complete!");
      } else {
        throw new Error(data.detail || 'Analysis failed');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || 'Failed to connect to the analysis server. Make sure the backend is running.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleGeminiScan = async () => {
    if (!imageFile) return;

    setIsGeminiScanning(true);
    setScanProgress(0);
    setResult(null);
    setError(null);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 5;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch('http://localhost:8000/api/gemini-diagnosis', {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setScanProgress(100);

      await new Promise(resolve => setTimeout(resolve, 400));

      if (data.success) {
        setResult(data);
        showNotification("Deep Scan Complete!");
      } else {
        throw new Error(data.detail || 'Analysis failed');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || 'Failed to connect to Gemini API. Ensure API key is set.');
    } finally {
      setIsGeminiScanning(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageFile(null);
    setResult(null);
    setError(null);
    setScanProgress(0);
    setIsScanning(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExportReport = () => {
    if (!result) return;
    
    const { pathogen, confidence, confidenceLevel } = result.result;
    
    const reportText = `
Bioscan Plant Disease Report
============================
Date: ${new Date().toLocaleString()}

Analysis Mode: ${result.mode === 'real' ? 'Local Neural Network' : result.mode === 'gemini' ? 'Deep Scan' : 'Demo Mode'}

Disease Detected: ${pathogen.name}
Crop / Plant: ${pathogen.scientificName}
Confidence Score: ${confidence}% (${confidenceLevel})

Recommended Solution:
---------------------
${pathogen.treatment || 'No specific treatment plan provided.'}

* This report was generated automatically by the Bioscan Neural Analysis Engine.
`;

    const blob = new Blob([reportText.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bioscan_Report_${pathogen.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <TopNavBar />
      <main className={styles.laboratoryLayout}>
        <div className={styles.mainContent}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.headerBadge}>
              <span className={styles.badgeDot}></span>
              <span className={styles.badgeText}>Neural Analysis Engine</span>
            </div>
            <h1 className={styles.pageTitle}>
              Plant Disease <span className="text-primary-fixed-dim">Scanner</span>
            </h1>
            <p className={styles.pageSubtitle}>
              Upload a leaf image for instant AI-powered disease detection. Our MobileNetV2 model analyzes your plant against 38 disease classes across 14 crop species.
            </p>
          </div>

          {/* Scanner Container */}
          <div className={styles.scannerContainer}>
            {isCameraOpen ? (
              <div className={styles.cameraContainer}>
                <div className={styles.previewContainer}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className={styles.previewImage}
                  ></video>
                  <div className={styles.previewOverlay}>
                    <button className={styles.clearBtn} onClick={stopCamera} title="Close Camera">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                    </button>
                  </div>
                </div>
                <div className={styles.cameraActions}>
                  <button className={styles.scanBtn} onClick={capturePhoto}>
                    <span className="material-symbols-outlined">camera</span>
                    Take Picture
                  </button>
                </div>
              </div>
            ) : !selectedImage ? (
              /* Upload Zone */
              <div
                className={`${styles.uploadZone} ${isDragging ? styles.uploadZoneDragging : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <span className={`material-symbols-outlined ${styles.uploadIcon}`}>cloud_upload</span>
                <h3 className={styles.uploadTitle}>Upload Plant Image</h3>
                <p className={styles.uploadDesc}>
                  Drag and drop an image here, or click to browse.<br />
                  Supports PNG, JPG, JPEG up to 10MB.
                </p>
                {cameraStatus === 'requesting' && (
                  <div className={styles.uploadDesc} style={{ color: 'var(--primary-fixed-dim)', fontWeight: 'bold' }}>
                    <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>privacy_tip</span>
                    Please allow camera access when your browser prompts you...
                  </div>
                )}
                <div className={styles.uploadActions}>
                  <button
                    className={`${styles.uploadBtn} ${styles.uploadBtnPrimary}`}
                    onClick={(e) => { e.stopPropagation(); startCamera(); }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>photo_camera</span>
                    Open Camera
                  </button>
                  <button
                    className={`${styles.uploadBtn} ${styles.uploadBtnSecondary}`}
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>folder_open</span>
                    Browse Files
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className={styles.hiddenInput}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              /* Image Preview */
              <div className={styles.previewContainer}>
                <img
                  src={selectedImage}
                  alt="Selected plant"
                  className={styles.previewImage}
                />
                {(isScanning || isGeminiScanning) && (
                  <div className={styles.scanOverlay}>
                    <div className={styles.scanLine}></div>
                    <div className={`${styles.scanCorner} ${styles.scanCornerTL}`}></div>
                    <div className={`${styles.scanCorner} ${styles.scanCornerTR}`}></div>
                    <div className={`${styles.scanCorner} ${styles.scanCornerBL}`}></div>
                    <div className={`${styles.scanCorner} ${styles.scanCornerBR}`}></div>
                  </div>
                )}
                <div className={styles.previewOverlay}>
                  <button className={styles.clearBtn} onClick={handleReset} title="Remove image">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                  </button>
                </div>
              </div>
            )}

            {/* Scan Button */}
            {selectedImage && !result && !isScanning && !isGeminiScanning && (
              <div className={styles.scanActions}>
                <button className={styles.scanBtn} onClick={handleScan}>
                  <span className="material-symbols-outlined">biotech</span>
                  Analyze Plant Disease (Local Model)
                </button>
                <button className={`${styles.scanBtn} ${styles.uploadBtnSecondary}`} onClick={handleGeminiScan} style={{marginTop: '10px', backgroundColor: 'var(--primary-container)', color: 'var(--on-primary-container)'}}>
                  <span className="material-symbols-outlined">psychiatry</span>
                  Deep Scan
                </button>
              </div>
            )}

            {/* Scanning Progress */}
            {(isScanning || isGeminiScanning) && (
              <div className={styles.scanningContainer}>
                <div className={styles.scanningText}>
                  <div className={styles.scanningSpinner}></div>
                  {isGeminiScanning ? 'Deep Scan is analyzing...' : 'Analyzing with neural network...'}
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${Math.min(scanProgress, 100)}%` }}
                  ></div>
                </div>
                <span className={styles.progressLabel}>{Math.round(scanProgress)}% complete</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className={styles.errorMsg}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '8px' }}>error</span>
                {error}
              </div>
            )}

            {/* Results */}
            {result && (
              <div className={styles.resultContainer}>
                <div className={styles.resultHeader}>
                  <h2 className={styles.resultTitle}>Diagnosis Complete</h2>
                  <span className={`${styles.resultBadge} ${result.result.confidenceLevel === 'High' ? styles.badgeHigh : styles.badgeMedium}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span>
                    {result.result.confidenceLevel} Confidence
                  </span>
                </div>

                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <div className={styles.resultItemLabel}>Disease Detected</div>
                    <div className={styles.resultItemValue}>{result.result.pathogen.name}</div>
                  </div>
                  <div className={styles.resultItem}>
                    <div className={styles.resultItemLabel}>Crop / Plant</div>
                    <div className={styles.resultItemValue}>{result.result.pathogen.scientificName}</div>
                  </div>
                  <div className={styles.resultItem}>
                    <div className={styles.resultItemLabel}>Confidence Score</div>
                    <div className={`${styles.resultItemValue} ${styles.resultItemValueGreen}`}>
                      {result.result.confidence}%
                    </div>
                  </div>
                  <div className={styles.resultItem}>
                    <div className={styles.resultItemLabel}>Analysis Mode</div>
                    <div className={styles.resultItemValue}>
                      {result.mode === 'real' ? 'Local Neural Network' : result.mode === 'gemini' ? 'Deep Scan' : 'Demo Mode'}
                    </div>
                  </div>
                </div>

                <div className={styles.confidenceSection}>
                  <div className={styles.confidenceHeader}>
                    <span className={styles.confidenceLabel}>Model Confidence</span>
                    <span className={styles.confidenceValue}>{result.result.confidence}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${result.result.confidence}%` }}></div>
                  </div>
                </div>

                {result.result.pathogen.treatment && (
                  <div className={styles.treatmentSection}>
                    <div className={styles.treatmentHeader}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--primary-fixed-dim)' }}>medical_services</span>
                      <h3>Recommended Solution</h3>
                    </div>
                    <p className={styles.treatmentText}>{result.result.pathogen.treatment}</p>
                  </div>
                )}

                <div className={styles.resultActions}>
                  <button className={`${styles.resultBtn} ${styles.resultBtnPrimary}`} onClick={handleReset}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>restart_alt</span>
                    Scan Another
                  </button>
                  <button className={`${styles.resultBtn} ${styles.resultBtnOutline}`} onClick={handleExportReport}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                    Export Report
                  </button>
                </div>

                {result.mode === 'mock' && (
                  <p className={styles.modeTag}>
                    ⚠ Running in demo mode. Train the model with train_model.py for real inference.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '24px',
          backgroundColor: 'rgba(0, 227, 131, 0.95)',
          color: '#00210e',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 227, 131, 0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-label-md)',
          fontWeight: '600',
          animation: 'slideIn 0.3s ease forwards',
          transform: 'translateX(100%)',
        }}>
          <style>
            {`
              @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
              }
            `}
          </style>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>task_alt</span>
          {toastMessage}
        </div>
      )}

      <Footer />
    </>
  );
};

export default Laboratory;