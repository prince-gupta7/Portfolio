export type ThemeMode = 'dark' | 'light' | 'oled';

export type ParticleStyle = 'mesh' | 'matrix' | 'starfield' | 'orbs' | 'none';

export type GlowIntensity = 'none' | 'subtle' | 'high' | 'neon';

export interface ThemePreset {
  id: string;
  name: string;
  category: 'cyber' | 'nature' | 'warm' | 'cosmic' | 'minimal' | 'light';
  description: string;
  primary: string; // Hex color e.g. '#00f2fe'
  primaryRgb: string; // RGB string e.g. '0, 242, 254'
  secondary: string; // Hex color e.g. '#4facfe'
  secondaryRgb: string; // RGB string e.g. '79, 172, 254'
  tertiary: string; // Hex color e.g. '#8a2be2'
  bgPrimary: string; // Hex color e.g. '#07090e'
  bgSurface: string; // Hex color e.g. '#0f1422'
  bgCard: string; // rgba string e.g. 'rgba(15, 23, 42, 0.7)'
  textPrimary: string;
  textSecondary: string;
  particleColors: string[];
  particleStyle: ParticleStyle;
  mode: ThemeMode;
  badge: string; // emoji icon e.g. '⚡'
  tagline: string;
}

export interface CustomThemeConfig {
  presetId: string | 'custom';
  name: string;
  primary: string;
  primaryRgb: string;
  secondary: string;
  secondaryRgb: string;
  tertiary: string;
  bgPrimary: string;
  bgSurface: string;
  bgCard: string;
  particleColors?: string[];
  mode: ThemeMode;
  particleStyle: ParticleStyle;
  glowIntensity: GlowIntensity;
  soundEnabled: boolean;
}
