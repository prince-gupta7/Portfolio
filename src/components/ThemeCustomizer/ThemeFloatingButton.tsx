import React, { useState } from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeFloatingButton: React.FC = () => {
  const { openCustomizer, currentTheme, isCustomizerOpen } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  if (isCustomizerOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      {/* Floating Tooltip Pill on Hover */}
      <div 
        className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold shadow-xl border backdrop-blur-xl transition-all duration-300 pointer-events-none hidden sm:flex items-center gap-1.5 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'
        }`}
        style={{
          backgroundColor: currentTheme.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)',
          borderColor: `rgba(${currentTheme.primaryRgb}, 0.4)`,
          color: currentTheme.mode === 'light' ? '#0f172a' : '#ffffff',
          boxShadow: `0 0 20px rgba(${currentTheme.primaryRgb}, 0.25)`,
        }}
      >
        <Sparkles className="w-3.5 h-3.5 animate-spin-slow" style={{ color: currentTheme.primary }} />
        <span>Customize Theme ({currentTheme.name})</span>
      </div>

      {/* Main Floating Trigger Button */}
      <button
        onClick={openCustomizer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group p-3.5 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
        style={{
          backgroundColor: currentTheme.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 14, 26, 0.9)',
          border: `1.5px solid rgba(${currentTheme.primaryRgb}, 0.5)`,
          boxShadow: `0 0 30px rgba(${currentTheme.primaryRgb}, 0.35)`,
        }}
        aria-label="Open Theme Customizer"
        title="Customize Portfolio Theme"
      >
        {/* Animated Outer Glow Ring */}
        <span 
          className="absolute -inset-1 rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
          }}
        />

        {/* Inner Icon */}
        <div className="relative z-10 flex items-center justify-center">
          <Palette 
            className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-12"
            style={{ color: currentTheme.primary }}
          />
        </div>

        {/* Small Active Preset Indicator Dot */}
        <span 
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 flex items-center justify-center"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        </span>
      </button>
    </div>
  );
};
