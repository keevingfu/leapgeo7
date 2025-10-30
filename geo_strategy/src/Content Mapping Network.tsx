import React, { useState } from 'react';
import { PlatformKey } from './types';
import LandingPage from './components/LandingPage';
import PlatformDetail from './components/PlatformDetail';
import ComparisonPage from './components/ComparisonPage';

type PageType = 'landing' | 'platform-detail' | 'comparison';

const ContentMappingNetwork: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [currentPlatform, setCurrentPlatform] = useState<PlatformKey | null>(null);

  const handlePlatformSelect = (platform: PlatformKey) => {
    setCurrentPlatform(platform);
    setCurrentPage('platform-detail');
  };

  const handleCompareClick = () => {
    setCurrentPage('comparison');
  };

  const handleBackFromDetail = () => {
    setCurrentPage('landing');
    setCurrentPlatform(null);
  };

  const handleBackFromComparison = () => {
    if (currentPlatform) {
      setCurrentPage('platform-detail');
    } else {
      setCurrentPage('landing');
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50">
      {currentPage === 'landing' && (
        <LandingPage
          onPlatformSelect={handlePlatformSelect}
          onCompareClick={handleCompareClick}
        />
      )}

      {currentPage === 'platform-detail' && currentPlatform && (
        <PlatformDetail
          platform={currentPlatform}
          onBack={handleBackFromDetail}
          onCompareClick={handleCompareClick}
        />
      )}

      {currentPage === 'comparison' && (
        <ComparisonPage
          currentPlatform={currentPlatform}
          onBack={handleBackFromComparison}
        />
      )}
    </div>
  );
};

export default ContentMappingNetwork;