import React, { useEffect, useState } from 'react';

const Download = ({ finalPhoto, onRestart }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');

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

  const sendEmail = async () => {
    if (!email || !email.includes('@')) {
      setEmailStatus('Mohon masukkan email yang valid');
      return;
    }
    
    setIsSending(true);
    setEmailStatus('Mengirim...');
    
    try {
      const response = await fetch('http://localhost/photobox/send_email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          photos: [finalPhoto],
          layout: 'Photobooth',
          frame: 'Custom'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setEmailStatus('Email berhasil dikirim! ✅');
        setEmail('');
      } else {
        setEmailStatus('Gagal: ' + data.message);
      }
    } catch (error) {
      setEmailStatus('Gagal mengirim email. Periksa koneksi.');
    }
    
    setIsSending(false);
  };

  return (
    <div className="screen-container fade-in" style={{display: 'flex', alignItems: 'center'}}>
      <canvas id="confetti" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0}}></canvas>
      
      <div className="download-card-new" style={{zIndex: 10, padding: '40px', maxWidth: '100%'}}>
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

        {/* Email Input Section */}
        <div style={{width: '100%', marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <p style={{fontSize: '0.9rem', color: 'var(--c-text-muted)', textAlign: 'center', margin: 0}}>Atau kirim ke email:</p>
          <div style={{display: 'flex', gap: '10px'}}>
            <input 
              type="email" 
              placeholder="Masukkan email kamu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1, padding: '10px 15px', borderRadius: 'var(--radius-pill)', 
                border: '1px solid var(--c-border)', outline: 'none'
              }} 
            />
            <button 
              onClick={sendEmail}
              disabled={isSending}
              className="btn-primary" 
              style={{padding: '10px 20px', fontSize: '0.9rem', minWidth: '90px', justifyContent: 'center', opacity: isSending ? 0.7 : 1}}
            >
              {isSending ? '...' : 'Kirim'}
            </button>
          </div>
          {emailStatus && (
            <p style={{fontSize: '0.85rem', color: emailStatus.includes('berhasil') ? 'green' : 'red', textAlign: 'center', margin: 0}}>
              {emailStatus}
            </p>
          )}
        </div>

        <button 
          onClick={onRestart} 
          style={{
            background: 'none', border: 'none', color: 'var(--c-text-muted)', 
            textDecoration: 'underline', cursor: 'pointer', marginTop: '15px',
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
