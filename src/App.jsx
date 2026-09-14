import { useState } from 'react';
import Home from './components/Home';
import FrameSelection from './components/FrameSelection';
import Camera from './components/Camera';
import Processing from './components/Processing';
import PreviewEdit from './components/PreviewEdit';
import Download from './components/Download';
import TetrisBackground from './components/TetrisBackground';

function App() {
  const [currentStep, setCurrentStep] = useState('home'); // 'home', 'frame', 'camera', 'processing', 'edit', 'download'
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [finalPhoto, setFinalPhoto] = useState(null);

  const startFlow = async () => {
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {}
    setCurrentStep('frame');
  };

  const handleFrameSelection = (frame) => {
    setSelectedFrame(frame);
    setCurrentStep('camera');
  };

  const handleCameraComplete = (photos) => {
    setCapturedPhotos(photos);
    setCurrentStep('processing');
    setTimeout(() => setCurrentStep('edit'), 2500);
  };

  const handleEditComplete = (finalPhotoData) => {
    setFinalPhoto(finalPhotoData);
    setCurrentStep('download');
  };

  const restartFlow = () => {
    setCurrentStep('home');
    setSelectedFrame(null);
    setCapturedPhotos([]);
    setFinalPhoto(null);
  };

  const handleBack = () => {
    if (currentStep === 'frame') setCurrentStep('home');
    if (currentStep === 'camera') setCurrentStep('frame');
    if (currentStep === 'edit') setCurrentStep('camera');
    if (currentStep === 'download') setCurrentStep('edit');
  };

  // Map steps to bottom nav index
  const stepIndex = {
    'frame': 1,
    'camera': 2,
    'processing': 2, // Keeps 'Ambil Foto' active during processing
    'edit': 3,
    'download': 4
  };
  
  const currentNav = stepIndex[currentStep] || 0;

  return (
    <div className="app-container relative overflow-hidden bg-arcade-grid">
      <TetrisBackground />
      <div className="crt-overlay"></div>
      
      {/* HIMA Logo Top Left */}
      <img 
        src="/images/logo_hima.jpg" 
        alt="Logo Hima" 
        className="absolute top-6 left-6 w-16 h-16 rounded-full object-cover z-[100] border-2 border-white shadow-lg"
      />
      
      {/* Dynamic Content */}
      <div className="main-content z-10 relative">
        {currentStep === 'home' && <Home onStart={startFlow} />}
        {currentStep === 'frame' && <FrameSelection onSelectFrame={handleFrameSelection} onBack={handleBack} />}
        {currentStep === 'camera' && <Camera selectedFrame={selectedFrame} onCaptureComplete={handleCameraComplete} onBack={handleBack} />}
        {currentStep === 'processing' && <Processing />}
        {currentStep === 'edit' && <PreviewEdit selectedFrame={selectedFrame} photos={capturedPhotos} onNext={handleEditComplete} onBack={handleBack} />}
        {currentStep === 'download' && <Download finalPhoto={finalPhoto} onRestart={restartFlow} />}
      </div>

      {/* Arcade HUD Bottom Nav (Hidden on Home) */}
      {currentStep !== 'home' && (
        <div className="bg-black/90 border-t-4 border-white p-4 flex justify-between items-center font-arcade text-xs md:text-sm z-50 relative">
          <div className="text-yellow-400">
            STAGE {currentNav}/4
          </div>
          
          <div className="hidden md:flex gap-2 lg:gap-4 text-gray-500">
            <span className={currentNav >= 1 ? 'text-white' : ''}>1. FRAME</span>
            <span>►</span>
            <span className={currentNav >= 2 ? 'text-white' : ''}>2. CAMERA</span>
            <span>►</span>
            <span className={currentNav >= 3 ? 'text-white' : ''}>3. PREVIEW</span>
            <span>►</span>
            <span className={currentNav >= 4 ? 'text-white' : ''}>4. DOWNLOAD</span>
          </div>
          
          <div className="text-green-400 animate-pulse">
            CREDIT: 99
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
