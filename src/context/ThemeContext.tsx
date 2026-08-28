import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ThemePreset, CustomThemeConfig, ThemeMode, ParticleStyle, GlowIntensity } from '../types/theme';
import { themePresets, hexToRgb, generateSecondaryHex, playThemeSound, glowIntensityLevels } from '../data/themes';

interface ThemeContextType {
  currentTheme: CustomThemeConfig;
  activePreset: ThemePreset | undefined;
  mode: ThemeMode;
  isCustomizerOpen: boolean;
  openCustomizer: () => void;
  closeCustomizer: () => void;
  toggleCustomizer: () => void;
  setPreset: (presetId: string) => void;
  setPrimaryColor: (hex: string) => void;
  setSecondaryColor: (hex: string) => void;
  setBackground: (bgHex: string, mode?: ThemeMode) => void;
  setParticleStyle: (style: ParticleStyle) => void;
  setGlowIntensity: (intensity: GlowIntensity) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  toggleSound: () => void;
  randomizeTheme: () => void;
  resetToDefault: () => void;
}

const STORAGE_KEY = 'portfolio_custom_theme_v2';

const defaultPreset = themePresets[0]; // Cyber Neon

const initialThemeConfig: CustomThemeConfig = {
  presetId: defaultPreset.id,
  name: defaultPreset.name,
  primary: defaultPreset.primary,
  primaryRgb: defaultPreset.primaryRgb,
  secondary: defaultPreset.secondary,
  secondaryRgb: defaultPreset.secondaryRgb,
  tertiary: defaultPreset.tertiary,
  bgPrimary: defaultPreset.bgPrimary,
  bgSurface: defaultPreset.bgSurface,
  bgCard: defaultPreset.bgCard,
  particleColors: defaultPreset.particleColors,
  mode: defaultPreset.mode,
  particleStyle: defaultPreset.particleStyle,
  glowIntensity: 'high',
  soundEnabled: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<CustomThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<CustomThemeConfig>;
        // Validate with default keys
        return {
          ...initialThemeConfig,
          ...parsed,
          primaryRgb: parsed.primary ? hexToRgb(parsed.primary) : defaultPreset.primaryRgb,
          secondaryRgb: parsed.secondary ? hexToRgb(parsed.secondary) : defaultPreset.secondaryRgb,
        };
      }
    } catch {
      // ignore
    }
    return initialThemeConfig;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Derive active preset
  const activePreset = useMemo(() => {
    return themePresets.find((p) => p.id === currentTheme.presetId);
  }, [currentTheme.presetId]);

  // Apply CSS custom variables and HTML classes to DOM
  const applyThemeToDom = useCallback((theme: CustomThemeConfig) => {
    const root = document.documentElement;
    const body = document.body;

    const multiplierObj = glowIntensityLevels.find((g) => g.id === theme.glowIntensity);
    const multiplier = multiplierObj ? multiplierObj.multiplier : 1.0;

    // Apply CSS Variables
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-primary-rgb', theme.primaryRgb);
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.style.setProperty('--theme-secondary-rgb', theme.secondaryRgb);
    root.style.setProperty('--theme-accent-3', theme.tertiary);
    root.style.setProperty('--theme-bg', theme.bgPrimary);
    root.style.setProperty('--theme-surface', theme.bgSurface);
    root.style.setProperty('--theme-card', theme.bgCard);
    root.style.setProperty('--theme-glow-multiplier', multiplier.toString());

    // Legacy variables compatibility
    root.style.setProperty('--accent-cyan', theme.primary);
    root.style.setProperty('--accent-blue', theme.secondary);
    root.style.setProperty('--accent-purple', theme.tertiary);
    root.style.setProperty('--bg-primary', theme.bgPrimary);
    root.style.setProperty('--bg-surface', theme.bgSurface);

    // Compute glow color with multiplier
    const glowAlpha = Math.min(1, 0.4 * multiplier);
    root.style.setProperty('--theme-glow', `rgba(${theme.primaryRgb}, ${glowAlpha})`);
    root.style.setProperty('--theme-border-accent', `rgba(${theme.primaryRgb}, ${0.35 * Math.max(0.5, multiplier)})`);

    // Manage DOM classList for Tailwind dark mode
    root.classList.remove('dark', 'light', 'oled');
    body.classList.remove('dark', 'light', 'oled');

    if (theme.mode === 'light') {
      root.classList.add('light');
      body.classList.add('light');
      root.style.colorScheme = 'light';
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--border-subtle', 'rgba(0, 0, 0, 0.08)');
    } else if (theme.mode === 'oled') {
      root.classList.add('dark', 'oled');
      body.classList.add('dark', 'oled');
      root.style.colorScheme = 'dark';
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.12)');
    } else {
      root.classList.add('dark');
      body.classList.add('dark');
      root.style.colorScheme = 'dark';
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.08)');
    }

    body.style.backgroundColor = theme.bgPrimary;
  }, []);

  // Update DOM and save to localStorage whenever currentTheme changes
  useEffect(() => {
    applyThemeToDom(currentTheme);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentTheme));
    } catch {
      // ignore
    }
  }, [currentTheme, applyThemeToDom]);

  const openCustomizer = useCallback(() => {
    setIsCustomizerOpen(true);
    if (currentTheme.soundEnabled) playThemeSound('open');
  }, [currentTheme.soundEnabled]);

  const closeCustomizer = useCallback(() => {
    setIsCustomizerOpen(false);
  }, []);

  const toggleCustomizer = useCallback(() => {
    setIsCustomizerOpen((prev) => {
      if (!prev && currentTheme.soundEnabled) playThemeSound('open');
      return !prev;
    });
  }, [currentTheme.soundEnabled]);

  const setPreset = useCallback((presetId: string) => {
    const preset = themePresets.find((p) => p.id === presetId);
    if (!preset) return;

    setCurrentTheme((prev) => ({
      ...prev,
      presetId: preset.id,
      name: preset.name,
      primary: preset.primary,
      primaryRgb: preset.primaryRgb,
      secondary: preset.secondary,
      secondaryRgb: preset.secondaryRgb,
      tertiary: preset.tertiary,
      bgPrimary: preset.bgPrimary,
      bgSurface: preset.bgSurface,
      bgCard: preset.bgCard,
      particleColors: preset.particleColors,
      mode: preset.mode,
      particleStyle: preset.particleStyle,
    }));

    if (currentTheme.soundEnabled) playThemeSound('switch');
  }, [currentTheme.soundEnabled]);

  const setPrimaryColor = useCallback((hex: string) => {
    const rgb = hexToRgb(hex);
    setCurrentTheme((prev) => {
      const autoSec = prev.presetId !== 'custom' ? generateSecondaryHex(hex) : prev.secondary;
      return {
        ...prev,
        presetId: 'custom',
        name: 'Custom Palette',
        primary: hex,
        primaryRgb: rgb,
        secondary: autoSec,
        secondaryRgb: hexToRgb(autoSec),
      };
    });
    if (currentTheme.soundEnabled) playThemeSound('select');
  }, [currentTheme.soundEnabled]);

  const setSecondaryColor = useCallback((hex: string) => {
    const rgb = hexToRgb(hex);
    setCurrentTheme((prev) => ({
      ...prev,
      presetId: 'custom',
      name: 'Custom Palette',
      secondary: hex,
      secondaryRgb: rgb,
    }));
    if (currentTheme.soundEnabled) playThemeSound('select');
  }, [currentTheme.soundEnabled]);

  const setBackground = useCallback((bgHex: string, mode?: ThemeMode) => {
    setCurrentTheme((prev) => {
      let resolvedMode: ThemeMode = mode || prev.mode;
      if (!mode) {
        if (bgHex === '#000000') resolvedMode = 'oled';
        else if (bgHex.startsWith('#f') || bgHex.startsWith('#fff')) resolvedMode = 'light';
        else resolvedMode = 'dark';
      }

      const isLight = resolvedMode === 'light';
      const isOled = resolvedMode === 'oled';

      return {
        ...prev,
        presetId: 'custom',
        name: 'Custom Palette',
        bgPrimary: bgHex,
        bgSurface: isLight ? '#ffffff' : isOled ? '#0b0b0d' : '#0f1422',
        bgCard: isLight ? 'rgba(255, 255, 255, 0.88)' : isOled ? 'rgba(12, 12, 16, 0.85)' : 'rgba(15, 20, 36, 0.72)',
        mode: resolvedMode,
      };
    });
    if (currentTheme.soundEnabled) playThemeSound('select');
  }, [currentTheme.soundEnabled]);

  const setParticleStyle = useCallback((style: ParticleStyle) => {
    setCurrentTheme((prev) => ({
      ...prev,
      particleStyle: style,
    }));
    if (currentTheme.soundEnabled) playThemeSound('select');
  }, [currentTheme.soundEnabled]);

  const setGlowIntensity = useCallback((intensity: GlowIntensity) => {
    setCurrentTheme((prev) => ({
      ...prev,
      glowIntensity: intensity,
    }));
    if (currentTheme.soundEnabled) playThemeSound('select');
  }, [currentTheme.soundEnabled]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setCurrentTheme((prev) => {
      if (newMode === 'light') {
        const lightPreset = themePresets.find((p) => p.mode === 'light') || themePresets[7];
        return {
          ...prev,
          mode: 'light',
          presetId: prev.mode === 'light' ? prev.presetId : lightPreset.id,
          name: prev.mode === 'light' ? prev.name : lightPreset.name,
          bgPrimary: lightPreset.bgPrimary,
          bgSurface: lightPreset.bgSurface,
          bgCard: lightPreset.bgCard,
          primary: prev.mode === 'light' ? prev.primary : lightPreset.primary,
          primaryRgb: prev.mode === 'light' ? prev.primaryRgb : lightPreset.primaryRgb,
          secondary: prev.mode === 'light' ? prev.secondary : lightPreset.secondary,
          secondaryRgb: prev.mode === 'light' ? prev.secondaryRgb : lightPreset.secondaryRgb,
        };
      } else if (newMode === 'oled') {
        const oledPreset = themePresets.find((p) => p.id === 'oled-black') || themePresets[6];
        return {
          ...prev,
          mode: 'oled',
          presetId: oledPreset.id,
          name: oledPreset.name,
          bgPrimary: oledPreset.bgPrimary,
          bgSurface: oledPreset.bgSurface,
          bgCard: oledPreset.bgCard,
          primary: oledPreset.primary,
          primaryRgb: oledPreset.primaryRgb,
          secondary: oledPreset.secondary,
          secondaryRgb: oledPreset.secondaryRgb,
        };
      } else {
        const darkPreset = defaultPreset;
        return {
          ...prev,
          mode: 'dark',
          presetId: darkPreset.id,
          name: darkPreset.name,
          bgPrimary: darkPreset.bgPrimary,
          bgSurface: darkPreset.bgSurface,
          bgCard: darkPreset.bgCard,
          primary: darkPreset.primary,
          primaryRgb: darkPreset.primaryRgb,
          secondary: darkPreset.secondary,
          secondaryRgb: darkPreset.secondaryRgb,
        };
      }
    });
    if (currentTheme.soundEnabled) playThemeSound('switch');
  }, [currentTheme.soundEnabled]);

  const toggleMode = useCallback(() => {
    setMode(currentTheme.mode === 'light' ? 'dark' : 'light');
  }, [currentTheme.mode, setMode]);

  const toggleSound = useCallback(() => {
    setCurrentTheme((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  }, []);

  const randomizeTheme = useCallback(() => {
    // Pick a random preset
    const otherPresets = themePresets.filter((p) => p.id !== currentTheme.presetId);
    const randomPreset = otherPresets[Math.floor(Math.random() * otherPresets.length)];
    
    setCurrentTheme((prev) => ({
      ...prev,
      presetId: randomPreset.id,
      name: randomPreset.name,
      primary: randomPreset.primary,
      primaryRgb: randomPreset.primaryRgb,
      secondary: randomPreset.secondary,
      secondaryRgb: randomPreset.secondaryRgb,
      tertiary: randomPreset.tertiary,
      bgPrimary: randomPreset.bgPrimary,
      bgSurface: randomPreset.bgSurface,
      bgCard: randomPreset.bgCard,
      particleColors: randomPreset.particleColors,
      mode: randomPreset.mode,
      particleStyle: randomPreset.particleStyle,
    }));

    if (currentTheme.soundEnabled) playThemeSound('random');
  }, [currentTheme.presetId, currentTheme.soundEnabled]);

  const resetToDefault = useCallback(() => {
    setCurrentTheme(initialThemeConfig);
    if (currentTheme.soundEnabled) playThemeSound('switch');
  }, [currentTheme.soundEnabled]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        activePreset,
        mode: currentTheme.mode,
        isCustomizerOpen,
        openCustomizer,
        closeCustomizer,
        toggleCustomizer,
        setPreset,
        setPrimaryColor,
        setSecondaryColor,
        setBackground,
        setParticleStyle,
        setGlowIntensity,
        setMode,
        toggleMode,
        toggleSound,
        randomizeTheme,
        resetToDefault,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
