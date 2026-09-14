import React, { useEffect, useRef, useState } from 'react';

const PreviewEdit = ({ selectedFrame, photos, onNext, onBack }) => {
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Stiker'); // Stiker, Teks, Filter, Sesuaikan
  const [stickers, setStickers] = useState([]);
  const [filter, setFilter] = useState('none');
  
  const width = selectedFrame?.layout?.width || 800;
  const height = selectedFrame?.layout?.height || 800;

  useEffect(() => {
    const drawCanvas = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = selectedFrame?.color || '#ffffff';
      ctx.fillRect(0, 0, width, height);

      const layoutBoxes = selectedFrame?.layout?.boxes || [];

      const drawPhotos = (callback) => {
        let loaded = 0;
        let total = 0;
        
        photos.forEach((photo, i) => {
          if (layoutBoxes[i]) total++;
        });

        if (total === 0 && callback) {
           callback();
           return;
        }

        photos.forEach((photo, i) => {
          if (!layoutBoxes[i]) return;
          const box = layoutBoxes[i];
          const bx = box.x * width;
          const by = box.y * height;
          const bw = box.w * width;
          const bh = box.h * height;

          const img = new Image();
          img.onload = () => {
            const imgAspect = img.width / img.height;
            const boxAspect = bw / bh;
            let sx, sy, sw, sh;
            
            if (imgAspect > boxAspect) {
                // Image is wider than box -> crop sides
                sh = img.height;
                sw = img.height * boxAspect;
                sx = (img.width - sw) / 2;
                sy = 0;
            } else {
                // Image is taller than box -> crop top/bottom
                sw = img.width;
                sh = img.width / boxAspect;
                sx = 0;
                sy = (img.height - sh) / 2;
            }
            
            ctx.drawImage(img, sx, sy, sw, sh, bx, by, bw, bh);
            loaded++;
            if (loaded === total && callback) callback();
          };
          img.src = photo;
        });
      };

      if (selectedFrame?.image) {
        const frameImg = new Image();
        frameImg.crossOrigin = "Anonymous";
        frameImg.onload = () => {
          const offCanvas = document.createElement('canvas');
          offCanvas.width = width;
          offCanvas.height = height;
          const offCtx = offCanvas.getContext('2d');

          if (selectedFrame.layout.photoCount === 6) {
             offCtx.drawImage(frameImg, 0, 0, width / 2, height);
             offCtx.drawImage(frameImg, width / 2, 0, width / 2, height);
          } else {
             offCtx.drawImage(frameImg, 0, 0, width, height);
          }

          // Green screen removal (Chroma key for bright green)
          const imgData = offCtx.getImageData(0, 0, width, height);
          const data = imgData.data;

          const pixelInsideBox = (px, py) => {
              for (const box of layoutBoxes) {
                  const bx = box.x * width;
                  const by = box.y * height;
                  const bw = box.w * width;
                  const bh = box.h * height;
                  if (px >= bx && px <= bx + bw && py >= by && py <= by + bh) {
                      return true;
                  }
              }
              return false;
          };

          for (let py = 0; py < height; py++) {
             for (let px = 0; px < width; px++) {
                 const i = (py * width + px) * 4;
                 const r = data[i];
                 const g = data[i + 1];
                 const b = data[i + 2];
                 
                 // Detect black only inside the photo boxes
                 if (r < 50 && g < 50 && b < 50 && pixelInsideBox(px, py)) {
                     data[i + 3] = 0; // Make transparent
                 }
             }
          }
          offCtx.putImageData(imgData, 0, 0);

          drawPhotos(() => {
             // Draw the frame ON TOP of the photos!
             ctx.drawImage(offCanvas, 0, 0);
          });
        };
        frameImg.src = selectedFrame.image;
      } else {
        drawPhotos();
      }
    };
    setTimeout(drawCanvas, 100);
  }, [selectedFrame, photos, width, height]);

  const addSticker = (emoji) => {
    setStickers([...stickers, { id: Date.now(), emoji, x: 50, y: 50 }]);
  };

  const handleNext = () => {
    const finalData = canvasRef.current.toDataURL('image/jpeg', 0.9);
    onNext(finalData);
  };

  return (
    <div className="screen-container fade-in">
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
        <div className="logo-btn" style={{fontSize: '1rem'}}>
          <div className="logo-icon" style={{width:'24px', height:'24px'}}>📸</div>Photobox
        </div>
        <button className="btn-outline" style={{border: 'none'}} onClick={onBack}>
          ⟲ Mulai Ulang
        </button>
      </div>

      <div className="edit-layout">
        <div className="edit-left">
          <div style={{position: 'relative', height: '100%'}}>
            <canvas 
              ref={canvasRef}
              width={width}
              height={height}
              style={{
                height: '100%',
                maxHeight: 'calc(100vh - 200px)',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-md)',
                filter: filter
              }}
            />
            {stickers.map(sticker => (
               <div key={sticker.id} style={{
                 position: 'absolute', cursor: 'move', userSelect: 'none',
                 fontSize: '2rem', left: `${sticker.x}%`, top: `${sticker.y}%`,
                 filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
               }}>
                 {sticker.emoji}
               </div>
            ))}
          </div>
        </div>

        <div className="edit-right">
          <div className="edit-tabs">
            {['Stiker', 'Teks', 'Filter', 'Sesuaikan'].map(tab => (
              <div 
                key={tab} 
                className={`e-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', 
                  background: activeTab === tab ? 'var(--c-primary-light)' : 'var(--c-bg)',
                  color: activeTab === tab ? 'var(--c-primary)' : 'var(--c-text-muted)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontSize: '1.2rem', marginBottom: '4px'
                }}>
                  {tab === 'Stiker' ? '✨' : tab === 'Teks' ? 'T' : tab === 'Filter' ? '🎨' : '⚙️'}
                </div>
                {tab}
              </div>
            ))}
          </div>

          <div style={{flex: 1, overflowY: 'auto', padding: '10px 0'}}>
            {activeTab === 'Stiker' && (
              <div>
                <h4 style={{marginBottom: '15px', fontSize: '0.9rem'}}>Pilih Stiker</h4>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px'}}>
                  {['✨','💖','🎀','🌸','🧸','🍒','⭐','🦋','🎈','🎁','🎂','👑'].map(emoji => (
                    <div 
                      key={emoji} 
                      onClick={() => addSticker(emoji)}
                      style={{
                        fontSize: '1.8rem', textAlign: 'center', cursor: 'pointer',
                        padding: '10px', background: 'var(--c-bg)', borderRadius: '12px',
                        transition: 'transform 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Teks' && (
              <div>
                <h4 style={{marginBottom: '15px', fontSize: '0.9rem'}}>Warna Teks</h4>
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                  {['#222222', '#ffffff', '#ff7696', '#fbbf24', '#c084fc', '#93c5fd', '#6ee7b7'].map(c => (
                    <div key={c} style={{width:'32px', height:'32px', borderRadius:'50%', background:c, border:'1px solid var(--c-border)', cursor:'pointer'}}></div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'Filter' && (
              <div>
                <h4 style={{marginBottom: '15px', fontSize: '0.9rem'}}>Pilih Filter</h4>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px'}}>
                  <button className={`btn-outline ${filter === 'none' ? 'active' : ''}`} style={{justifyContent:'center'}} onClick={() => setFilter('none')}>Normal</button>
                  <button className={`btn-outline ${filter === 'grayscale(100%)' ? 'active' : ''}`} style={{justifyContent:'center'}} onClick={() => setFilter('grayscale(100%)')}>B&W</button>
                  <button className={`btn-outline ${filter === 'sepia(80%)' ? 'active' : ''}`} style={{justifyContent:'center'}} onClick={() => setFilter('sepia(80%)')}>Vintage</button>
                  <button className={`btn-outline ${filter === 'contrast(120%) saturate(120%)' ? 'active' : ''}`} style={{justifyContent:'center'}} onClick={() => setFilter('contrast(120%) saturate(120%)')}>Vibrant</button>
                </div>
              </div>
            )}
          </div>

          <div className="action-buttons-row">
            <button className="btn-outline" style={{flex: 1, justifyContent: 'center', color: 'var(--c-primary)', borderColor: 'var(--c-primary)'}} onClick={onBack}>
              ⟲ Ambil Ulang
            </button>
            <button className="btn-primary" style={{flex: 1, justifyContent: 'center'}} onClick={handleNext}>
              📥 Simpan Foto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewEdit;
