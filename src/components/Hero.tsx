import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  Code2, 
  Terminal, 
  Download, 
  MapPin, 
  Sparkles, 
  ExternalLink, 
  ChevronDown, 
  Swords,
  Palette
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { personalInfo, socialLinks } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface HeroProps {
  onOpenTerminal: () => void;
  onOpenResume: () => void;
  onOpenFruitNinja?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal, onOpenResume, onOpenFruitNinja }) => {
  const { currentTheme, openCustomizer } = useTheme();
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(120);

  // Typewriter effect
  useEffect(() => {
    const titles = personalInfo.titles;
    const fullText = titles[currentTitleIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(90);

        if (currentText === fullText) {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(45);

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentTitleIndex, typingSpeed]);

  const scrollToSection = (id: string) => {
    const elem = document.getElementById(id);
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

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Github':
        return <GithubIcon className="w-4 h-4" />;
      case 'Linkedin':
        return <LinkedinIcon className="w-4 h-4" />;
      case 'Mail':
        return <Mail className="w-4 h-4" />;
      case 'Phone':
        return <Phone className="w-4 h-4" />;
      case 'Code2':
        return <Code2 className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background Glowing Ambient Orbs matching active theme */}
      <div 
        className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl pointer-events-none animate-pulse-glow transition-all duration-700" 
        style={{
          backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.12)`,
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl pointer-events-none animate-pulse-glow transition-all duration-700" 
        style={{
          backgroundColor: `rgba(${currentTheme.secondaryRgb}, 0.10)`,
          animationDelay: '1.5s'
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Status Pill Badge & Theme Customizer Launcher */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div 
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-sm animate-float-slow transition-all duration-300"
                style={{
                  backgroundColor: currentTheme.mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.8)',
                  borderColor: `rgba(${currentTheme.primaryRgb}, 0.35)`,
                  borderWidth: '1px',
                  boxShadow: `0 0 15px rgba(${currentTheme.primaryRgb}, 0.15)`,
                }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span 
                  className="text-xs font-mono font-medium transition-colors"
                  style={{ color: currentTheme.primary }}
                >
                  {personalInfo.status}
                </span>
              </div>

              {/* Theme Customizer Quick Trigger Button */}
              <button
                onClick={openCustomizer}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 shadow-sm cursor-pointer"
                style={{
                  backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.12)`,
                  borderColor: `rgba(${currentTheme.primaryRgb}, 0.35)`,
                  borderWidth: '1px',
                  color: currentTheme.primary,
                }}
                title="Customize Theme & Colors"
              >
                <Palette className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Theme: {currentTheme.name}</span>
              </button>

              {onOpenFruitNinja && (
                <button
                  onClick={onOpenFruitNinja}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:via-rose-500/30 hover:to-cyan-500/30 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold transition-all duration-200 hover:scale-105 shadow-sm shadow-amber-500/15 cursor-pointer group"
                >
                  <Swords className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>🎮 Play Fruit Ninja</span>
                </button>
              )}
            </div>

            {/* Name Heading with Dynamic Theme Gradient */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight">
              Hi, I'm{' '}
              <span 
                className="transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {personalInfo.name}
              </span>
            </h1>

            {/* Dynamic Typewriter Title */}
            <div className="h-12 sm:h-14 mt-3 flex items-center">
              <span className="text-xl sm:text-2xl md:text-3xl font-mono font-bold flex items-center">
                <span className="mr-2" style={{ color: currentTheme.primary }}>&gt;</span>
                <span 
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {currentText}
                </span>
                <span 
                  className="w-2.5 h-6 sm:h-7 ml-1 animate-pulse inline-block"
                  style={{ backgroundColor: currentTheme.primary }}
                />
              </span>
            </div>

            {/* Short Bio */}
            <p className="mt-4 text-base sm:text-lg text-slate-300/90 max-w-2xl leading-relaxed font-normal">
              {personalInfo.bioShort}
            </p>

            {/* Location & University Tagline */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs sm:text-sm text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: currentTheme.primary }} />
                <span>Saharsa, Bihar • India</span>
              </div>
              <span className="hidden sm:inline text-slate-600">•</span>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 shrink-0" style={{ color: currentTheme.secondary }} />
                <span>Lovely Professional University</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mt-8 w-full sm:w-auto">
              <button
                onClick={() => scrollToSection('projects')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold text-sm sm:text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                  boxShadow: `0 4px 20px rgba(${currentTheme.primaryRgb}, 0.35)`,
                }}
                aria-label="Scroll down to projects section"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-200 hover:text-white font-semibold text-sm sm:text-base transition-all duration-200 hover:shadow-lg cursor-pointer"
                style={{
                  borderColor: `rgba(${currentTheme.primaryRgb}, 0.25)`,
                }}
                aria-label="Scroll down to contact section"
              >
                <Mail className="w-4 h-4" style={{ color: currentTheme.primary }} />
                <span>Contact Me</span>
              </button>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/40 text-slate-300 hover:text-white text-sm font-medium transition-all duration-200 cursor-pointer"
                title="View formatted printable resume"
                aria-label="Open formatted resume viewer"
              >
                <Download className="w-4 h-4" style={{ color: currentTheme.secondary }} />
                <span className="hidden sm:inline">Resume</span>
              </button>

              <button
                onClick={onOpenTerminal}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-sm font-mono transition-all duration-200 cursor-pointer"
                style={{
                  borderColor: `rgba(${currentTheme.primaryRgb}, 0.3)`,
                }}
                title="Launch Interactive Terminal"
                aria-label="Open Interactive Developer CLI"
              >
                <Terminal className="w-4 h-4" style={{ color: currentTheme.primary }} />
                <span className="font-semibold">&gt;_</span>
              </button>
            </div>

            {/* Clickable Social Pills */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 w-full flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono uppercase text-slate-400 mr-1">
                Connect:
              </span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {getSocialIcon(social.icon)}
                  <span>{social.name}</span>
                </a>
              ))}
            </div>

          </div>

          {/* Right Visual / Avatar Card Column */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              
              {/* Outer Glowing Neon Halo */}
              <div 
                className="absolute -inset-1 rounded-3xl blur-xl opacity-40 animate-pulse-glow transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary}, ${currentTheme.tertiary || currentTheme.primary})`,
                }}
              />

              {/* Main Profile Card Container */}
              <div 
                className="relative rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl shadow-2xl transition-all duration-300"
                style={{
                  backgroundColor: currentTheme.mode === 'light' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(10, 14, 26, 0.92)',
                  borderColor: `rgba(${currentTheme.primaryRgb}, 0.25)`,
                  boxShadow: `0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(${currentTheme.primaryRgb}, 0.15)`,
                }}
              >
                
                {/* Top Terminal-style Window Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span 
                    className="text-xs font-mono font-semibold"
                    style={{ color: currentTheme.primary }}
                  >
                    prince@developer:~$
                  </span>
                </div>

                {/* Avatar Image with Status Badge & Dynamic Gradient Ring */}
                <div 
                  className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-2xl p-1 mb-6 shadow-2xl transition-all duration-500 group"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary}, ${currentTheme.tertiary || currentTheme.primary})`,
                    boxShadow: `0 0 25px rgba(${currentTheme.primaryRgb}, 0.35)`,
                  }}
                >
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900 relative shadow-inner">
                    <img 
                      src={personalInfo.avatarUrl || '/profile.jpg'} 
                      alt="Prince Kumar - Full-Stack Web Developer & B.Tech CSE" 
                      className="w-full h-full object-cover object-top filter saturate-105 group-hover:scale-105 transition-transform duration-500"
                      loading="eager"
                      onError={(e) => {
                        // Fallback to /profile.jpg
                        (e.target as HTMLImageElement).src = '/profile.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Corner Cloud & Full-Stack Badge */}
                  <div 
                    className="absolute -bottom-3 -right-3 px-3 py-1 rounded-lg backdrop-blur-md text-[11px] font-mono font-bold shadow-xl flex items-center gap-1.5 border"
                    style={{
                      backgroundColor: currentTheme.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 14, 26, 0.95)',
                      borderColor: `rgba(${currentTheme.primaryRgb}, 0.4)`,
                      color: currentTheme.primary,
                    }}
                  >
                    <span 
                      className="w-2 h-2 rounded-full animate-ping" 
                      style={{ backgroundColor: currentTheme.primary }} 
                    />
                    <span>Python, C & Web</span>
                  </div>
                </div>

                {/* Quick Profile Meta */}
                <div className="text-center">
                  <h3 className="text-xl font-bold tracking-wide">
                    {personalInfo.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    B.Tech CSE @ Lovely Professional University (8.04 CGPA)
                  </p>
                </div>

                {/* Micro Metric Highlights Grid */}
                <div className="grid grid-cols-2 gap-2.5 mt-5 pt-5 border-t border-slate-800/80">
                  <div 
                    className="p-2.5 rounded-xl border text-center transition-colors"
                    style={{
                      backgroundColor: currentTheme.mode === 'light' ? '#f8fafc' : 'rgba(15, 20, 34, 0.6)',
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <span 
                      className="text-base font-bold font-mono"
                      style={{ color: currentTheme.primary }}
                    >
                      8.04 CGPA
                    </span>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                      B.Tech CSE @ LPU
                    </span>
                  </div>
                  <div 
                    className="p-2.5 rounded-xl border text-center transition-colors"
                    style={{
                      backgroundColor: currentTheme.mode === 'light' ? '#f8fafc' : 'rgba(15, 20, 34, 0.6)',
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <span 
                      className="text-base font-bold font-mono"
                      style={{ color: currentTheme.secondary }}
                    >
                      100+ Solved
                    </span>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                      DSA & Problem Solving
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Bottom Scroll Indicator */}
        <div className="mt-16 flex justify-center">
          <button 
            onClick={() => scrollToSection('about')}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors group cursor-pointer"
            aria-label="Scroll down to about section"
          >
            <span 
              className="text-xs font-mono uppercase tracking-widest transition-colors"
              style={{ color: currentTheme.primary }}
            >
              Scroll to Explore
            </span>
            <ChevronDown 
              className="w-4 h-4 animate-bounce"
              style={{ color: currentTheme.primary }} 
            />
          </button>
        </div>

      </div>
    </section>
  );
};
