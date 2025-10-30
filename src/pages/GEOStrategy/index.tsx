import React, { useState } from 'react';
import { Box } from '@mui/material';
import LandingPage from './components/LandingPage';
import PlatformDetail from './components/PlatformDetail';
import ComparisonPage from './components/ComparisonPage';

type PageType = 'landing' | 'platform' | 'comparison';

const GEOStrategy: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const handleSelectPlatform = (platformId: string) => {
    console.log('Selecting platform:', platformId);
    setSelectedPlatform(platformId);
    setCurrentPage('platform');
  };

  const handleViewComparison = () => {
    console.log('Switching to comparison page');
    setCurrentPage('comparison');
  };

  const handleBackToLanding = () => {
    console.log('Going back to landing');
    setCurrentPage('landing');
    setSelectedPlatform(null);
  };

  // Debug: Log current page state and scroll to top
  React.useEffect(() => {
    console.log('Current page:', currentPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage
            onSelectPlatform={handleSelectPlatform}
            onViewComparison={handleViewComparison}
          />
        );
      case 'platform':
        return selectedPlatform ? (
          <PlatformDetail
            platformId={selectedPlatform}
            onBack={handleBackToLanding}
          />
        ) : null;
      case 'comparison':
        return <ComparisonPage onBack={handleBackToLanding} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {renderCurrentPage()}
    </Box>
  );
};

export default GEOStrategy;