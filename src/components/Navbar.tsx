import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Terminal, 
  FileText, 
  Sun, 
  Moon, 
  Code, 
  Sparkles, 
  Swords,
  Palette
} from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenTerminal: () => void;
  onOpenResume: () => void;
  onOpenFruitNinja?: () => void;
}

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTerminal,
  onOpenResume,
  onOpenFruitNinja,
}) => {
  const { currentTheme, mode, toggleMode, openCustomizer } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 30);

      // Calculate scroll progress percentage
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollProgress((winScroll / height) * 100);
      }

      // Determine active section
      const sections = navLinks.map(link => link.href.substring(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl) {
          const rect = sectionEl.getBoundingClientRect();
          if (rect.top <= 140) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.substring(1);
    const elem = document.getElementById(targetId);
    if (elem) {
      const navOffset = 80;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Top Scroll Progress Indicator with Dynamic Theme Gradient */}
      <div 
        className="fixed top-0 left-0 h-[3.5px] z-[60] transition-all duration-100 ease-out"
        style={{ 
          width: `${scrollProgress}%`,
          background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary}, ${currentTheme.tertiary || currentTheme.primary})`,
          boxShadow: `0 0 10px rgba(${currentTheme.primaryRgb}, 0.5)`,
        }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'glass-nav py-3 shadow-lg shadow-black/20' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo / Brand Name */}
          <a 
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-2.5 group cursor-pointer"
            aria-label={`${personalInfo.name} Portfolio Home`}
          >
            <div 
              className="relative w-10 h-10 rounded-xl p-[1.5px] transition-transform duration-300 group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              }}
            >
              <div 
                className="w-full h-full rounded-[10px] flex items-center justify-center"
                style={{
                  backgroundColor: mode === 'light' ? '#ffffff' : '#07090e',
                }}
              >
                <Code 
                  className="w-5 h-5 transition-colors" 
                  style={{ color: currentTheme.primary }} 
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span 
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: currentTheme.primary }}
                />
                <span 
                  className="relative inline-flex rounded-full h-3 w-3 border border-slate-900"
                  style={{ backgroundColor: currentTheme.primary }}
                />
              </span>
            </div>
            <div className="flex flex-col">
              <span 
                className="font-extrabold text-base sm:text-lg tracking-tight transition-all"
                style={{
                  background: mode === 'light' 
                    ? `linear-gradient(135deg, #0f172a 0%, ${currentTheme.primary} 100%)`
                    : `linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, ${currentTheme.primary} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {personalInfo.name}
              </span>
              <span 
                className="text-[10px] font-mono tracking-widest uppercase -mt-0.5"
                style={{ color: currentTheme.primary }}
              >
                Full-Stack & Cloud
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav 
            className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-inner"
            style={{
              backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.65)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-3 py-1.5 text-xs xl:text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.15)`,
                          borderColor: `rgba(${currentTheme.primaryRgb}, 0.35)`,
                          borderWidth: '1px',
                          color: currentTheme.primary,
                        }
                      : {}
                  }
                >
                  {link.name}
                  {isActive && (
                    <span 
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow-sm"
                      style={{ 
                        backgroundColor: currentTheme.primary,
                        boxShadow: `0 0 6px ${currentTheme.primary}`,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action CTAs: Customizer, Fruit Ninja, Terminal, Resume, Theme & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Theme Customizer Trigger Pill */}
            <button
              onClick={openCustomizer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
              style={{
                backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.12)`,
                borderColor: `rgba(${currentTheme.primaryRgb}, 0.35)`,
                color: currentTheme.primary,
              }}
              title="Open Live Theme Customizer"
              aria-label="Customize Theme"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Theme</span>
              <span 
                className="w-2 h-2 rounded-full hidden sm:inline-block" 
                style={{ backgroundColor: currentTheme.primary }} 
              />
            </button>

            {/* Fruit Ninja Game Button */}
            {onOpenFruitNinja && (
              <button
                onClick={onOpenFruitNinja}
                className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:via-rose-500/30 hover:to-cyan-500/30 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-md shadow-amber-500/10 group"
                title="Play Fruit Ninja (Webcam Hand Tracking AR)"
                aria-label="Play Fruit Ninja Game"
              >
                <Swords className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                <span className="hidden sm:inline">Fruit Ninja</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            )}

            {/* Terminal Toggle Button */}
            <button
              onClick={onOpenTerminal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white text-xs font-mono transition-all duration-200 hover:shadow-lg"
              style={{
                borderColor: `rgba(${currentTheme.primaryRgb}, 0.25)`,
              }}
              title="Open Interactive Developer CLI Terminal"
              aria-label="Open Interactive CLI Terminal"
            >
              <Terminal className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
              <span className="font-semibold">&gt;_ CLI</span>
            </button>

            {/* Resume Button */}
            <button
              onClick={onOpenResume}
              className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                boxShadow: `0 4px 15px rgba(${currentTheme.primaryRgb}, 0.25)`,
              }}
              aria-label="View and Download Resume"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleMode}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 transition-colors cursor-pointer"
              title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} mode`}
              aria-label="Toggle Theme Mode"
            >
              {mode === 'light' ? (
                <Moon className="w-4 h-4" style={{ color: currentTheme.primary }} />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div 
          className={`lg:hidden fixed inset-x-4 top-20 rounded-2xl border backdrop-blur-2xl p-6 shadow-2xl transition-all duration-300 transform ${
            mobileMenuOpen 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
          style={{
            backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.96)' : 'rgba(10, 14, 24, 0.96)',
            borderColor: `rgba(${currentTheme.primaryRgb}, 0.25)`,
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Navigation Menu</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCustomizer();
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold py-1 px-2.5 rounded-lg border"
                  style={{
                    backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.15)`,
                    borderColor: `rgba(${currentTheme.primaryRgb}, 0.35)`,
                    color: currentTheme.primary,
                  }}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Theme</span>
                </button>

                {onOpenFruitNinja && (
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenFruitNinja();
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white py-1 px-2.5 rounded-lg bg-amber-500/20 border border-amber-500/30"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>Ninja</span>
                  </button>
                )}
                <button 
                  onClick={onOpenTerminal}
                  className="flex items-center gap-1.5 text-xs font-mono py-1 px-2.5 rounded-lg bg-slate-900 border"
                  style={{
                    borderColor: `rgba(${currentTheme.primaryRgb}, 0.3)`,
                    color: currentTheme.primary,
                  }}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>CLI</span>
                </button>
              </div>
            </div>
            
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.15)`,
                          color: currentTheme.primary,
                          border: `1px solid rgba(${currentTheme.primaryRgb}, 0.3)`,
                        }
                      : {}
                  }
                >
                  <span>{link.name}</span>
                  {isActive && <Sparkles className="w-4 h-4" style={{ color: currentTheme.primary }} />}
                </a>
              );
            })}

            <div className="pt-4 mt-2 border-t border-slate-800 flex gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                }}
              >
                <FileText className="w-4 h-4" />
                <span>View Resume</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
