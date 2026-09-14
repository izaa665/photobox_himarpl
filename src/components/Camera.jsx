import React, { useState, useRef, useEffect, useCallback } from 'react';

const Camera = ({ selectedFrame, onCaptureComplete, onBack }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isShooting, setIsShooting] = useState(false);
  const [currentShot, setCurrentShot] = useState(1);
  const [countdown, setCountdown] = useState(null);
  const [flashOn, setFlashOn] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  
  const TOTAL_PHOTOS = selectedFrame?.photoCount || 4;

  useEffect(() => {
    let mounted = true;
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" }
        });
        if (!mounted) {
          mediaStream.getTracks().forEach(t => t.stop());
          return;
        }
        setStream(mediaStream);
        streamRef.current = mediaStream;
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };
    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureSingleFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Mirror image
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.9);
  }, []);

  const runShot = useCallback(() => {
    return new Promise(resolve => {
      setCountdown(3);
      let counter = 3;
      
      const interval = setInterval(() => {
        counter -= 1;
        if (counter > 0) {
          setCountdown(counter);
        } else {
          clearInterval(interval);
          setCountdown(null);
          
          if (flashOn) setIsFlashing(true);
          
          setTimeout(() => {
            if (flashOn) setIsFlashing(false);
            const pic = captureSingleFrame();
            resolve(pic);
          }, 150);
        }
      }, 1000);
    });
  }, [captureSingleFrame, flashOn]);

  const startSequence = async () => {
    if (isShooting) return;
    setIsShooting(true);
    setPhotos([]);

    let currentPhotos = [];

    for (let i = 0; i < TOTAL_PHOTOS; i++) {
      setCurrentShot(i + 1);
      const pic = await runShot();
      currentPhotos.push(pic);
      setPhotos([...currentPhotos]);

      if (i < TOTAL_PHOTOS - 1) {
        await new Promise(res => setTimeout(res, 1000));
      }
    }

    setIsShooting(false);
    onCaptureComplete(currentPhotos);
  };

  const stopCameraAndBack = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onBack();
  };

  return (
    <div className="screen-container fade-in">
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
        <div className="logo-btn" style={{fontSize: '1rem'}}>
          <div className="logo-icon" style={{width:'24px', height:'24px'}}>📸</div>
          Photobox
        </div>
        <button className="btn-outline" style={{border: 'none'}} onClick={stopCameraAndBack}>
          Keluar
        </button>
      </div>

      <div className="camera-layout">
        {/* Left Viewfinder */}
        <div className="camera-left">
          <div className="viewfinder">
            {isFlashing && <div style={{position:'absolute', top:0, left:0, right:0, bottom:0, background:'white', zIndex:100}}></div>}
            
            <video
              ref={(el) => {
                videoRef.current = el;
                if (el && stream && el.srcObject !== stream) {
                  el.srcObject = stream;
                }
              }}
              autoPlay playsInline muted
              className="video-feed"
              style={{ opacity: stream ? 1 : 0 }}
            />
            {/* Viewfinder Corners */}
            <div style={{position:'absolute', top:'20px', left:'20px', width:'30px', height:'30px', borderTop:'3px solid white', borderLeft:'3px solid white'}}></div>
            <div style={{position:'absolute', top:'20px', right:'20px', width:'30px', height:'30px', borderTop:'3px solid white', borderRight:'3px solid white'}}></div>
            <div style={{position:'absolute', bottom:'20px', left:'20px', width:'30px', height:'30px', borderBottom:'3px solid white', borderLeft:'3px solid white'}}></div>
            <div style={{position:'absolute', bottom:'20px', right:'20px', width:'30px', height:'30px', borderBottom:'3px solid white', borderRight:'3px solid white'}}></div>
          </div>
          
          <div className="progress-dots">
            {[...Array(TOTAL_PHOTOS)].map((_, i) => (
              <div key={i} className={`p-dot ${i < photos.length ? 'active' : ''} ${isShooting && currentShot === (i + 1) ? 'active' : ''}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Right Controls */}
        <div className="camera-right">
          <h3 style={{fontSize:'1.2rem', fontWeight:700, marginBottom:'10px'}}>
            Foto {isShooting ? currentShot : (photos.length === TOTAL_PHOTOS ? TOTAL_PHOTOS : 1)} dari {TOTAL_PHOTOS}
          </h3>
          <p style={{color:'var(--c-text-muted)', fontSize:'0.9rem', marginBottom:'5px', fontWeight:600}}>
            Persiapkan dirimu!
          </p>
          <p style={{color:'var(--c-text-muted)', fontSize:'0.8rem'}}>
            Tatap kamera dan senyum manismu 😊
          </p>

          <div className="big-countdown">
            {countdown !== null ? countdown : (isShooting ? '📸' : '')}
          </div>
          
          {!isShooting && (
             <button className="btn-primary" style={{marginTop:'30px'}} onClick={startSequence}>
               Mulai Foto
             </button>
          )}

          <div className="flash-toggle" onClick={() => setFlashOn(!flashOn)} style={{cursor: 'pointer'}}>
            <span>⚡ Flash</span>
            <div style={{
              width: '40px', height: '20px', borderRadius: '10px', 
              background: flashOn ? 'var(--c-primary)' : 'var(--c-border)',
              position: 'relative', transition: 'all 0.2s'
            }}>
              <div style={{
                width: '16px', height: '16px', borderRadius: '50%', background: 'white',
                position: 'absolute', top: '2px', left: flashOn ? '22px' : '2px', transition: 'all 0.2s'
              }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera;
