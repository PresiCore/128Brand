
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import { AiDemo } from './components/AiDemo';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { AuthPage } from './components/AuthPage';
import { ViewState, UserProfile } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [user, setUser] = useState<any>(null);
  const [authInitialMode, setAuthInitialMode] = useState(false); // false = login, true = register

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  // Scroll Animation Observer
  useEffect(() => {
    if (currentView === ViewState.DASHBOARD) return; // Disable scroll animations logic on dashboard for better performance

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [currentView]);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(ViewState.HOME);
  };

  const handleNavigateToAuth = (isRegisterMode: boolean) => {
    setAuthInitialMode(isRegisterMode);
    setCurrentView(ViewState.LOGIN);
  };

  const renderContent = () => {
    if (currentView === ViewState.DASHBOARD && user) {
      return <Dashboard user={user} onLogout={handleLogout} />;
    }

    if (currentView === ViewState.AI_DEMO) {
      return <AiDemo />;
    }

    if (currentView === ViewState.LOGIN) {
        return <AuthPage onLoginSuccess={handleLoginSuccess} initialMode={authInitialMode} />;
    }

    // Landing Page Structure
    return (
      <>
        <div id="home">
          <Hero setView={setCurrentView} />
        </div>
        <div id="services">
          <Services />
        </div>
        <div id="contact">
          <Contact />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden">
      {/* Global Noise Overlay for Texture */}
      <div className="bg-noise"></div>
      
      {currentView !== ViewState.DASHBOARD && (
        <Navbar 
            currentView={currentView} 
            setView={setCurrentView} 
            isLoggedIn={!!user} 
            onNavigateToDashboard={() => setCurrentView(ViewState.DASHBOARD)} 
            onNavigateToAuth={handleNavigateToAuth}
        />
      )}
      
      <main className="relative">
        {renderContent()}
      </main>
      
      {currentView !== ViewState.DASHBOARD && currentView !== ViewState.LOGIN && <Footer />}
    </div>
  );
};

export default App;
