import React, { useEffect, useState } from 'react';

const Processing = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.floor(Math.random() * 15 + 5);
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="screen-container fade-in">
      <div className="processing-layout">
        <div style={{
          width: '200px', height: '200px', 
          background: 'var(--c-primary-light)', 
          borderRadius: '24px',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '6rem',
          animation: 'fadeIn 1s infinite alternate'
        }}>
          📸
        </div>
        
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <h2 style={{fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px'}}>
            Menggabungkan foto kamu...
          </h2>
          <p style={{color: 'var(--c-text-muted)', fontSize: '0.9rem'}}>
            Mohon tunggu sebentar ya!
          </p>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{width: `${Math.min(progress, 100)}%`}}></div>
        </div>
        <div style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--c-text-muted)'}}>
          {Math.min(progress, 100)}%
        </div>
      </div>
    </div>
  );
};

export default Processing;
