import React, { useEffect } from 'react';

const Download = ({ finalPhoto, onRestart }) => {
  useEffect(() => {
    const canvas = document.getElementById('confetti');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff7696', '#ffdce3', '#93c5fd', '#fdfaf6', '#e8e8e8'];

    for (let i = 0; i < 80; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 8 + 4,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 2 + 1.5,
        angle: Math.random() * 360,
        spin: Math.random() * 0.1 - 0.05
      });
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.speed;
        p.angle += p.spin;
        if (p.y > canvas.height) p.y = -20;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="screen-container fade-in" style={{display: 'flex', alignItems: 'center'}}>
      <canvas id="confetti" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0}}></canvas>
      
      <div className="download-card-new" style={{zIndex: 10}}>
        <div style={{fontSize: '3rem', animation: 'fadeIn 1s infinite alternate'}}>🎉</div>
        
        <div style={{textAlign: 'center'}}>
          <h2 className="screen-title" style={{marginBottom: '5px'}}>Yey! Foto kamu siap! ✨</h2>
          <p style={{color: 'var(--c-text-muted)', fontSize: '0.9rem'}}>Scan QR Code untuk download fotomu</p>
        </div>
        
        <div className="qr-box">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://example.com/photostrip123" alt="QR Code" style={{width:'100%', height:'100%'}} />
        </div>

        <div style={{display: 'flex', gap: '15px', width: '100%', marginTop: '10px'}}>
          <button className="btn-primary" style={{flex: 1, justifyContent: 'center'}} onClick={() => {
            const link = document.createElement('a');
            link.href = finalPhoto;
            link.download = 'photostrip.jpg';
            link.click();
          }}>
            📥 Download
          </button>
          <button className="btn-outline" style={{flex: 1, justifyContent: 'center', color: 'var(--c-primary)', borderColor: 'var(--c-primary)'}} onClick={() => alert("Mencetak ke printer...")}>
            🖨️ Cetak
          </button>
        </div>

        <button 
          onClick={onRestart} 
          style={{
            background: 'none', border: 'none', color: 'var(--c-text-muted)', 
            textDecoration: 'underline', cursor: 'pointer', marginTop: '10px',
            fontSize: '0.85rem'
          }}
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default Download;
