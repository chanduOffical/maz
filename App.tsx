import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TrendAntenna from './components/TrendAntenna';
import FashionDnaEngine from './components/FashionDnaEngine';
import EmotionStyling from './components/EmotionStyling';
import ARTryOnMirror from './components/ARTryOnMirror';
import AvatarStudio from './components/AvatarStudio';
import PrivacyByDesign from './components/PrivacyByDesign';
import DigitalWardrobeBuilder from './components/DigitalWardrobeBuilder';

const App: React.FC = () => {
  const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(true);

  const handleCameraToggle = () => {
    setIsCameraEnabled(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-cream text-deep-purple font-sans flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-start p-4 md:p-8 space-y-16">
        {/* Start with self-discovery */}
        <FashionDnaEngine />
        {/* Explore what's new */}
        <TrendAntenna />
        {/* Manage your own closet */}
        <DigitalWardrobeBuilder />
        {/* Get inspiration */}
        <EmotionStyling />
        {/* Interactive camera features */}
        <ARTryOnMirror isCameraEnabled={isCameraEnabled} />
        <AvatarStudio />
        {/* Privacy controls contextualized after camera features */}
        <PrivacyByDesign isCameraEnabled={isCameraEnabled} onCameraToggle={handleCameraToggle} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
