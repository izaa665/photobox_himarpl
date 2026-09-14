import React, { useState } from 'react';

// Hardcoded layouts for various frames
const layouts = {
  custom3: {
    width: 1080, height: 1920, photoCount: 3,
    boxes: [
      { x: 0.10, y: 0.11, w: 0.80, h: 0.20 },
      { x: 0.10, y: 0.34, w: 0.80, h: 0.20 },
      { x: 0.10, y: 0.57, w: 0.80, h: 0.20 }
    ]
  },
  custom4: {
    width: 1080, height: 1920, photoCount: 4,
    boxes: [
      { x: 0.12, y: 0.05, w: 0.76, h: 0.20 },
      { x: 0.12, y: 0.28, w: 0.76, h: 0.20 },
      { x: 0.12, y: 0.51, w: 0.76, h: 0.20 },
      { x: 0.12, y: 0.74, w: 0.76, h: 0.20 }
    ]
  }
};

const frameDesigns = [
  { id: 'frame1', name: 'Frame 1', category: 'Semua', photoCount: 3, layout: layouts.custom3, image: '/assets/frames/strip 1.png', color: '#ffffff' },
  { id: 'frame2', name: 'Frame 2', category: 'Semua', photoCount: 4, layout: layouts.custom4, image: '/assets/frames/strip 2.png', color: '#ffffff' },
  { id: 'frame3', name: 'Frame 3', category: 'Semua', photoCount: 3, layout: layouts.custom3, image: '/assets/frames/strip 3.png', color: '#ffffff' },
  { id: 'frame4', name: 'Frame 4', category: 'Semua', photoCount: 3, layout: layouts.custom3, image: '/assets/frames/strip 4.png', color: '#ffffff' }
];

const categories = ['Semua'];

const FrameSelection = ({ onSelectFrame, onBack }) => {
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedId, setSelectedId] = useState(null);

  const filteredFrames = activeTab === 'Semua' 
    ? frameDesigns 
    : frameDesigns.filter(f => f.category === activeTab);

  const handleContinue = () => {
    if (selectedId) {
      const frame = frameDesigns.find(f => f.id === selectedId);
      onSelectFrame(frame);
    }
  };

  return (
    <div className="w-full h-full p-4 md:p-8 fade-in relative z-10 flex flex-col justify-center font-terminal text-white">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-4 right-4 md:right-8 font-arcade text-white hover:text-yellow-300 transition-colors text-xs md:text-sm z-20"
        style={{ textShadow: '2px 2px 0px #000' }}
      >
        [ ◄ KEMBALI ]
      </button>

      <div className="absolute top-12 md:top-20 left-0 w-full flex flex-col items-center text-center px-4 pointer-events-none z-10">
        <h2 className="text-2xl md:text-4xl font-arcade uppercase text-yellow-300 drop-shadow-[4px_4px_0_#000] mb-2 md:mb-4">
          PILIH FRAME TERFAVORITMU
        </h2>
        <p className="text-lg md:text-2xl font-terminal text-white drop-shadow-[2px_2px_0_#000]">
          Setiap frame memiliki jumlah foto yang berbeda.
        </p>
      </div>

      {/* Scrollable Frames Container */}
      <div className="w-full flex justify-center my-2 md:my-6">
        <div className="max-h-[58vh] overflow-y-auto px-6 custom-scrollbar w-full max-w-6xl">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] justify-items-center justify-center gap-x-8 gap-y-10 w-full pt-8 pb-12">
            {filteredFrames.map((design) => {
              const isSelected = selectedId === design.id;
              
              return (
                <div
                  key={design.id}
                  onClick={() => setSelectedId(design.id)}
                  className={`
                    w-full max-w-[240px] relative bg-gray-900 flex flex-col items-center p-4 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'border-4 border-yellow-400 shadow-[0_0_20px_#facc15] z-10' 
                    : 'border-2 border-gray-700 brightness-75 hover:brightness-100 hover:border-cyan-400'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white font-arcade text-[10px] md:text-xs px-2 py-1 border-2 border-white animate-bounce shadow-[2px_2px_0_#000] z-20">
                    SELECTED!
                  </div>
                )}
                
                <div className="w-full aspect-[9/16] bg-black border-2 border-gray-800 p-2 mb-3 relative overflow-hidden flex items-center justify-center">
                  {design.image ? (
                    <img src={design.image} alt={design.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full relative" style={{ background: design.color }}>
                      <div className="absolute inset-0 flex justify-center items-center opacity-10 text-4xl pointer-events-none">
                        {design.id === 'sakura' && '🌸'}
                        {design.id === 'birthday_party' && '🎂'}
                        {design.id === 'cute_bear' && '🧸'}
                        {design.id === 'green_nature' && '🌿'}
                      </div>
                      
                      {design.layout.boxes.map((box, i) => (
                        <div key={i} style={{
                          position: 'absolute',
                          left: `${box.x * 100}%`,
                          top: `${box.y * 100}%`,
                          width: `${box.w * 100}%`,
                          height: `${box.h * 100}%`,
                          background: '#fff',
                          border: '2px solid #000',
                          backgroundImage: 'url(https://picsum.photos/100/150?random=' + (i + 1) + ')',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.2)'
                        }}></div>
                      ))}
                    </div>
                  )}
                </div>
                
                <h3 className="font-arcade text-xs md:text-sm text-white text-center mb-1">{design.name}</h3>
                <p className="font-terminal text-cyan-400 text-sm">{design.photoCount} FOTO</p>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Bottom Proceed Button */}
      <div className="absolute bottom-6 left-0 w-full flex justify-center z-20">
        <button 
          onClick={handleContinue}
          disabled={!selectedId}
          className={`
            px-8 py-4 font-arcade text-lg md:text-2xl uppercase transition-all duration-200
            ${selectedId 
              ? 'bg-white text-black border-4 border-gray-200 shadow-[6px_6px_0_#000] hover:bg-gray-100 active:translate-x-1 active:translate-y-1 active:shadow-none' 
              : 'bg-gray-600 text-gray-400 border-4 border-gray-500 opacity-50 cursor-not-allowed'
            }
          `}
        >
          LANJUTKAN [ENTER]
        </button>
      </div>

    </div>
  );
};

export default FrameSelection;
