import React, { useState } from 'react';

const Home = ({ onStart }) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleStartClick = async () => {
    setIsRequesting(true);
    try {
      // Request camera permission before proceeding
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the stream immediately, we just wanted permission
      stream.getTracks().forEach(track => track.stop());
      onStart();
    } catch (err) {
      alert("Please allow camera access to insert coin! 👾");
      setIsRequesting(false);
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center p-8 select-none font-terminal text-white overflow-hidden bg-transparent">
      
      {/* Floating Pixel Stars Background Animation - pure CSS illusion using the grid class, plus some floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white animate-ping opacity-50"></div>
        <div className="absolute top-3/4 left-2/3 w-3 h-3 bg-neonPink animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-neonCyan animate-ping opacity-75" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="z-10 flex flex-col items-center text-center w-full">
        
        {/* Title positioned near the top */}
        <div className="absolute top-[12%] left-0 w-full flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-terminal text-white mb-4 tracking-widest animate-pulse" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.8)' }}>
            SELAMAT DATANG
          </h2>
          <span className="text-2xl md:text-3xl text-white font-terminal mb-4" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.8)' }}>DI</span>
          <h1 
            className="text-4xl md:text-6xl font-arcade text-white tracking-wider leading-tight mt-2"
            style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.8)' }}
          >
            PHOTOBOX<br/>HIMARPL
          </h1>
        </div>

        {/* Button - stays exactly at bottom-30% */}
        <div className="absolute bottom-[30%] left-0 w-full flex justify-center">
          <button 
            onClick={handleStartClick}
            disabled={isRequesting}
            className={`
              relative px-20 md:px-32 py-5 bg-[#0d001a] border-4 border-white rounded-2xl text-2xl md:text-3xl font-arcade text-white uppercase tracking-widest
              hover:bg-white hover:text-black transition-all duration-200
              ${isRequesting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isRequesting ? 'LOADING...' : 'START'}
          </button>
        </div>

        {/* Bouncing Text - independently positioned below the button */}
        <div className="absolute bottom-[20%] left-0 w-full flex justify-center pointer-events-none">
          <div className="text-gray-300 text-xl md:text-2xl font-terminal animate-bounce" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.8)' }}>
            PRESS START BUTTON
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
