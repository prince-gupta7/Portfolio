import React, { useState, useEffect } from 'react';
import { 
  X, 
  Palette, 
  Sparkles, 
  RotateCcw, 
  Dices, 
  Copy, 
  Check, 
  Sliders, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Zap
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { themePresets, colorSwatches, bgOptions, particleStyles, glowIntensityLevels, playThemeSound } from '../../data/themes';

interface ThemeCustomizerDrawerProps {
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const ThemeCustomizerDrawer: React.FC<ThemeCustomizerDrawerProps> = ({ onShowToast }) => {
  const {
    currentTheme,
    mode,
    isCustomizerOpen,
    closeCustomizer,
    setPreset,
    setPrimaryColor,
    setSecondaryColor,
    setBackground,
    setParticleStyle,
    setGlowIntensity,
    setMode,
    toggleSound,
    randomizeTheme,
    resetToDefault,
  } = useTheme();

  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'effects'>('presets');
  const [copied, setCopied] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCustomizerOpen) {
        closeCustomizer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCustomizerOpen, closeCustomizer]);

  // Lock body scroll on small screens when open
  useEffect(() => {
    if (isCustomizerOpen) {
      document.body.style.overflow = window.innerWidth < 768 ? 'hidden' : 'unset';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCustomizerOpen]);

  if (!isCustomizerOpen) return null;

  const handleCopyConfig = () => {
    const configToExport = {
      name: currentTheme.name,
      mode: currentTheme.mode,
      primaryColor: currentTheme.primary,
      secondaryColor: currentTheme.secondary,
      backgroundColor: currentTheme.bgPrimary,
      particleStyle: currentTheme.particleStyle,
      glowIntensity: currentTheme.glowIntensity,
    };
    navigator.clipboard.writeText(JSON.stringify(configToExport, null, 2));
    setCopied(true);
    if (currentTheme.soundEnabled) playThemeSound('select');
    if (onShowToast) {
      onShowToast('success', 'Theme Config Copied!', 'JSON settings copied to clipboard.');
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRandomize = () => {
    randomizeTheme();
    if (onShowToast) {
      onShowToast('info', 'Random Theme Applied 🎲', 'Generated a fresh aesthetic style.');
    }
  };

  const handleReset = () => {
    resetToDefault();
    if (onShowToast) {
      onShowToast('info', 'Theme Reset', 'Restored default Cyber Neon theme.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeCustomizer}
      role="dialog"
      aria-modal="true"
      aria-label="Theme Customizer"
    >
      {/* Slide-in Drawer Container */}
      <div 
        className="relative w-full max-w-md sm:max-w-lg h-full bg-slate-950/95 border-l border-slate-800 shadow-2xl backdrop-blur-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        style={{
          backgroundColor: currentTheme.mode === 'light' ? '#ffffff' : currentTheme.mode === 'oled' ? '#060608' : '#0a0d16',
          color: currentTheme.mode === 'light' ? '#0f172a' : '#f8fafc',
          borderLeftColor: currentTheme.mode === 'light' ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Ambient Glow Bar */}
        <div 
          className="h-1.5 w-full transition-all duration-500"
          style={{
            background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary}, ${currentTheme.tertiary || currentTheme.primary})`
          }}
        />

        {/* Header Section */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, rgba(${currentTheme.primaryRgb}, 0.2), rgba(${currentTheme.secondaryRgb}, 0.1))`,
                border: `1px solid rgba(${currentTheme.primaryRgb}, 0.4)`,
                color: currentTheme.primary,
              }}
            >
              <Palette className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Theme Customizer
                </h3>
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.15)`,
                    color: currentTheme.primary,
                    border: `1px solid rgba(${currentTheme.primaryRgb}, 0.3)`,
                  }}
                >
                  {currentTheme.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Real-time styling & dynamic atmosphere
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors"
              title={currentTheme.soundEnabled ? 'Disable UI Sounds' : 'Enable UI Sounds'}
              aria-label="Toggle Sound"
            >
              {currentTheme.soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={closeCustomizer}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors"
              aria-label="Close customizer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Interactive Preview Card */}
        <div className="px-5 sm:px-6 pt-4 pb-2 shrink-0">
          <div 
            className="p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 shadow-md relative overflow-hidden"
            style={{
              backgroundColor: currentTheme.mode === 'light' ? '#f1f5f9' : 'rgba(15, 20, 32, 0.85)',
              borderColor: `rgba(${currentTheme.primaryRgb}, 0.35)`,
              boxShadow: `0 0 25px rgba(${currentTheme.primaryRgb}, 0.12)`,
            }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-slate-400 ml-1">Live Preview</span>
              </div>
              <span 
                className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.15)`,
                  color: currentTheme.primary,
                }}
              >
                {currentTheme.mode}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button 
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                }}
              >
                Button Accent
              </button>

              <div 
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5"
                style={{
                  backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.12)`,
                  border: `1px solid rgba(${currentTheme.primaryRgb}, 0.3)`,
                  color: currentTheme.primary,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: currentTheme.primary }} />
                <span>{currentTheme.particleStyle.toUpperCase()}</span>
              </div>

              <span 
                className="text-xs font-extrabold tracking-tight"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Prince Gupta
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selector Buttons */}
        <div className="px-5 sm:px-6 pt-3 shrink-0">
          <div className="grid grid-cols-3 p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium">
            <button
              onClick={() => {
                setActiveTab('presets');
                if (currentTheme.soundEnabled) playThemeSound('select');
              }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'presets'
                  ? 'bg-gradient-to-r text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={
                activeTab === 'presets'
                  ? {
                      background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                    }
                  : {}
              }
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Presets</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('colors');
                if (currentTheme.soundEnabled) playThemeSound('select');
              }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'colors'
                  ? 'bg-gradient-to-r text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={
                activeTab === 'colors'
                  ? {
                      background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                    }
                  : {}
              }
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Colors</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('effects');
                if (currentTheme.soundEnabled) playThemeSound('select');
              }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'effects'
                  ? 'bg-gradient-to-r text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={
                activeTab === 'effects'
                  ? {
                      background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                    }
                  : {}
              }
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Effects</span>
            </button>
          </div>
        </div>

        {/* Scrollable Tab Content Body */}
        <div className="px-5 sm:px-6 py-4 overflow-y-auto flex-1 space-y-5 custom-scroll">
          
          {/* ==================================================== */}
          {/* TAB 1: CURATED PRESETS */}
          {/* ==================================================== */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Select A Curated Palette ({themePresets.length})
                </span>
                <button
                  onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:underline"
                >
                  {mode === 'light' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                  <span>{mode === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {themePresets.map((preset) => {
                  const isSelected = currentTheme.presetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setPreset(preset.id)}
                      className={`relative p-3.5 rounded-2xl text-left border transition-all duration-200 group flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'ring-2 shadow-lg'
                          : 'hover:scale-[1.02] bg-slate-900/50 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                      }`}
                      style={{
                        backgroundColor: isSelected 
                          ? currentTheme.mode === 'light' ? '#ffffff' : 'rgba(18, 24, 38, 0.95)' 
                          : undefined,
                        borderColor: isSelected ? preset.primary : undefined,
                        boxShadow: isSelected ? `0 0 20px rgba(${preset.primaryRgb}, 0.25)` : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{preset.badge}</span>
                          <span className="text-xs sm:text-sm font-bold tracking-tight text-white">
                            {preset.name}
                          </span>
                        </div>
                        {isSelected ? (
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                            style={{ backgroundColor: preset.primary }}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono uppercase text-slate-500 group-hover:text-slate-400">
                            {preset.mode}
                          </span>
                        )}
                      </div>

                      {/* Color Preview Swatch Bar */}
                      <div className="flex items-center gap-1.5 my-1.5">
                        <div 
                          className="h-3 flex-1 rounded-full shadow-inner"
                          style={{
                            background: `linear-gradient(90deg, ${preset.primary}, ${preset.secondary})`
                          }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: preset.bgPrimary, border: '1px solid rgba(255,255,255,0.2)' }}
                          title={`Background: ${preset.bgPrimary}`}
                        />
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-mono">
                        {preset.tagline}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: COLOR STUDIO */}
          {/* ==================================================== */}
          {activeTab === 'colors' && (
            <div className="space-y-5">
              {/* Primary Color Section */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    1. Primary Accent Color
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-300">{currentTheme.primary}</span>
                    <input 
                      type="color"
                      value={currentTheme.primary}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-6 h-6 rounded-md border-0 cursor-pointer bg-transparent"
                      title="Choose custom primary color"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {colorSwatches.map((swatch) => {
                    const isSelected = currentTheme.primary.toLowerCase() === swatch.hex.toLowerCase();
                    return (
                      <button
                        key={swatch.name}
                        onClick={() => setPrimaryColor(swatch.hex)}
                        className="group relative flex flex-col items-center gap-1 p-1 rounded-xl transition-all hover:scale-110"
                        title={swatch.name}
                      >
                        <div 
                          className="w-8 h-8 rounded-xl shadow-md flex items-center justify-center transition-all"
                          style={{
                            backgroundColor: swatch.hex,
                            border: isSelected ? '2px solid white' : '1px solid rgba(255,255,255,0.15)',
                            boxShadow: isSelected ? `0 0 14px ${swatch.hex}` : undefined,
                          }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Color Section */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    2. Secondary Gradient Accent
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-300">{currentTheme.secondary}</span>
                    <input 
                      type="color"
                      value={currentTheme.secondary}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-6 h-6 rounded-md border-0 cursor-pointer bg-transparent"
                      title="Choose custom secondary color"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {colorSwatches.map((swatch) => {
                    const isSelected = currentTheme.secondary.toLowerCase() === swatch.hex.toLowerCase();
                    return (
                      <button
                        key={swatch.name}
                        onClick={() => setSecondaryColor(swatch.hex)}
                        className="group relative flex flex-col items-center gap-1 p-1 rounded-xl transition-all hover:scale-110"
                        title={swatch.name}
                      >
                        <div 
                          className="w-8 h-8 rounded-xl shadow-md flex items-center justify-center transition-all"
                          style={{
                            backgroundColor: swatch.hex,
                            border: isSelected ? '2px solid white' : '1px solid rgba(255,255,255,0.15)',
                            boxShadow: isSelected ? `0 0 14px ${swatch.hex}` : undefined,
                          }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Background Theme / Tone */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    3. Background Canvas Shade
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {currentTheme.mode.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bgOptions.map((bg) => {
                    const isSelected = currentTheme.bgPrimary.toLowerCase() === bg.hex.toLowerCase();
                    return (
                      <button
                        key={bg.id}
                        onClick={() => setBackground(bg.hex, bg.mode)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/20 shadow-md'
                            : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                        }`}
                        style={{
                          borderColor: isSelected ? currentTheme.primary : undefined,
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-5 h-5 rounded-lg border border-white/20 shrink-0"
                            style={{ backgroundColor: bg.hex }}
                          />
                          <span className="text-xs font-medium text-slate-200">{bg.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: VISUAL FX & ATMOSPHERE */}
          {/* ==================================================== */}
          {activeTab === 'effects' && (
            <div className="space-y-5">
              
              {/* Particle Animation Engine */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Particle Animation Engine
                  </span>
                  <span className="text-xs font-mono text-cyan-400">
                    {currentTheme.particleStyle.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2">
                  {particleStyles.map((item) => {
                    const isSelected = currentTheme.particleStyle === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setParticleStyle(item.id)}
                        className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                          isSelected
                            ? 'bg-slate-900 border-cyan-400 shadow-md'
                            : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                        }`}
                        style={{
                          borderColor: isSelected ? currentTheme.primary : undefined,
                          boxShadow: isSelected ? `0 0 15px rgba(${currentTheme.primaryRgb}, 0.2)` : undefined,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              <span>{item.label}</span>
                              {isSelected && (
                                <span 
                                  className="px-1.5 py-0.2 rounded text-[9px] font-mono"
                                  style={{
                                    backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.2)`,
                                    color: currentTheme.primary,
                                  }}
                                >
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                          </div>
                        </div>

                        {isSelected && (
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0"
                            style={{ backgroundColor: currentTheme.primary }}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Glow Intensity Slider / Grid */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Neon Glow Intensity</span>
                  </span>
                  <span className="text-xs font-mono text-amber-300 font-bold">
                    {currentTheme.glowIntensity.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {glowIntensityLevels.map((lvl) => {
                    const isSelected = currentTheme.glowIntensity === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => setGlowIntensity(lvl.id)}
                        className={`py-2 px-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                          isSelected
                            ? 'text-white shadow-md'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                        style={
                          isSelected
                            ? {
                                backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.2)`,
                                borderColor: currentTheme.primary,
                                color: currentTheme.primary,
                                boxShadow: `0 0 15px rgba(${currentTheme.primaryRgb}, 0.3)`,
                              }
                            : {}
                        }
                      >
                        {lvl.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Action Toolbar */}
        <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-slate-950/90 shrink-0 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleRandomize}
              className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              title="Generate a random palette combination"
            >
              <Dices className="w-3.5 h-3.5 text-amber-400" />
              <span>Random 🎲</span>
            </button>

            <button
              onClick={handleCopyConfig}
              className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              title="Copy JSON theme settings to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied!' : 'Export'}</span>
            </button>

            <button
              onClick={handleReset}
              className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              title="Reset theme back to Cyber Neon"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <button
            onClick={closeCustomizer}
            className="w-full py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              boxShadow: `0 4px 20px rgba(${currentTheme.primaryRgb}, 0.3)`,
            }}
          >
            <Check className="w-4 h-4" />
            <span>Apply & Done</span>
          </button>
        </div>

      </div>
    </div>
  );
};
