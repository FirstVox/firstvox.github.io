import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import TeamPortal from './components/EmployeePortal';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'portal'>('landing');

  const navigateToPortal = () => setView('portal');
  const navigateToLanding = () => setView('landing');

  if (view === 'landing') {
    return <LandingPage onNavigateToPortal={navigateToPortal} />;
  }

  return <TeamPortal onNavigateHome={navigateToLanding} />;
};

export default App;