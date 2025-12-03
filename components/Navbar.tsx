
import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, LayoutDashboard, UserPlus } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isLoggedIn?: boolean;
  onNavigateToDashboard?: () => void;
  onNavigateToAuth: (isRegister: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, isLoggedIn, onNavigateToDashboard, onNavigateToAuth }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: ViewState, id?: string) => {
    setView(view);
    setIsMobileOpen(false);
    
    if (view === ViewState.HOME && id) {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#030014]/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer group" onClick={() => handleNavClick(ViewState.HOME, 'home')}>
            <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-brand-accent rounded-lg blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-full h-full bg-black border border-white/10 rounded-lg flex items-center justify-center">
                    <span className="text-white font-black text-lg">128</span>
                </div>
            </div>
            <span className="ml-3 text-xl font-bold tracking-wider text-white">BRAND</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleNavClick(ViewState.HOME, 'home')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Inicio</button>
            <button onClick={() => handleNavClick(ViewState.HOME, 'services')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Soluciones</button>
            
            <div className="h-6 w-px bg-white/10"></div>

            {isLoggedIn ? (
                 <button
                 onClick={onNavigateToDashboard}
                 className="group relative inline-flex items-center justify-center px-6 py-2 font-bold text-white transition-all duration-200 bg-white/5 border border-white/10 font-pj rounded-full hover:bg-white/10"
               >
                 <LayoutDashboard className="w-4 h-4 mr-2" />
                 Ir al Dashboard
               </button>
            ) : (
                <div className="flex items-center gap-4">
                     <button onClick={() => onNavigateToAuth(false)} className="text-sm font-bold text-white hover:text-brand-accent transition-colors">
                        Login Cliente
                    </button>
                    
                    <button
                        onClick={() => onNavigateToAuth(true)}
                        className="relative inline-flex items-center justify-center px-6 py-2 font-bold text-black transition-all duration-200 bg-white border border-white font-pj rounded-full hover:bg-gray-200"
                    >
                        Registrarse
                        <span className="absolute -top-3 -right-2 px-2 py-0.5 bg-brand-neon text-black text-[9px] font-black uppercase tracking-wide rounded-full transform rotate-6 border border-black shadow-lg animate-pulse">
                            7 Días Gratis
                        </span>
                    </button>

                    <button
                        onClick={() => handleNavClick(ViewState.AI_DEMO)}
                        className="group relative inline-flex items-center justify-center px-5 py-2 font-bold text-white transition-all duration-200 bg-brand-accent font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent hover:bg-brand-accent/90"
                    >
                        <Zap className="w-4 h-4 mr-2 fill-current" />
                        Brandy AI
                    </button>
                </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileOpen && (
        <div className="md:hidden bg-[#0f0c29] border-b border-white/10 absolute w-full shadow-2xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <button onClick={() => handleNavClick(ViewState.HOME, 'home')} className="block w-full text-left py-3 text-gray-300 border-b border-white/5">Inicio</button>
            <button onClick={() => handleNavClick(ViewState.HOME, 'services')} className="block w-full text-left py-3 text-gray-300 border-b border-white/5">Soluciones</button>
            <button onClick={() => { onNavigateToAuth(false); setIsMobileOpen(false); }} className="block w-full text-left py-3 text-white font-bold border-b border-white/5">Login Cliente</button>
            
            <button 
                onClick={() => { onNavigateToAuth(true); setIsMobileOpen(false); }}
                className="mt-4 w-full flex items-center justify-center px-4 py-3 bg-white text-black rounded-lg font-bold relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-4 h-4 bg-brand-neon rounded-bl-lg"></div>
                <UserPlus className="w-4 h-4 mr-2" /> Registrarse (Prueba Gratis)
            </button>

            <button 
                onClick={() => handleNavClick(ViewState.AI_DEMO)}
                className="mt-2 w-full flex items-center justify-center px-4 py-3 bg-brand-accent text-white rounded-lg font-bold"
            >
                <Zap className="w-4 h-4 mr-2" /> Hablar con Brandy
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
