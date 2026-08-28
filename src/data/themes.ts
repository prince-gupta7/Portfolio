import type { ThemePreset, ThemeMode, ParticleStyle, GlowIntensity } from '../types/theme';

export const themePresets: ThemePreset[] = [
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    category: 'cyber',
    description: 'Electric Cyan & Neon Blue inspired by futuristic cloud architectures and modern cyberpunk.',
    primary: '#00f2fe',
    primaryRgb: '0, 242, 254',
    secondary: '#4facfe',
    secondaryRgb: '79, 172, 254',
    tertiary: '#8a2be2',
    bgPrimary: '#07090e',
    bgSurface: '#0f1422',
    bgCard: 'rgba(15, 20, 36, 0.72)',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    particleColors: ['#00f2fe', '#4facfe', '#8a2be2', '#38bdf8'],
    particleStyle: 'mesh',
    mode: 'dark',
    badge: '⚡',
    tagline: 'Signature Neon Glow'
  },
  {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    category: 'nature',
    description: 'Vivid Neon Emerald & Mint green with terminal cyber aesthetic.',
    primary: '#10b981',
    primaryRgb: '16, 185, 129',
    secondary: '#34d399',
    secondaryRgb: '52, 211, 153',
    tertiary: '#059669',
    bgPrimary: '#040e08',
    bgSurface: '#071a10',
    bgCard: 'rgba(7, 26, 16, 0.75)',
    textPrimary: '#f0fdf4',
    textSecondary: '#86efac',
    particleColors: ['#10b981', '#34d399', '#6ee7b7', '#059669'],
    particleStyle: 'matrix',
    mode: 'dark',
    badge: '🌲',
    tagline: 'Cyber Terminal Green'
  },
  {
    id: 'sunset-blaze',
    name: 'Sunset Blaze',
    category: 'warm',
    description: 'Radiant Amber, Solar Orange & Crimson Rose evoking a golden horizon.',
    primary: '#f59e0b',
    primaryRgb: '245, 158, 11',
    secondary: '#f43f5e',
    secondaryRgb: '244, 63, 94',
    tertiary: '#ea580c',
    bgPrimary: '#0e070a',
    bgSurface: '#1a0d14',
    bgCard: 'rgba(26, 13, 20, 0.75)',
    textPrimary: '#fff7ed',
    textSecondary: '#fdba74',
    particleColors: ['#f59e0b', '#f97316', '#f43f5e', '#fbbf24'],
    particleStyle: 'starfield',
    mode: 'dark',
    badge: '🌅',
    tagline: 'Solar Amber & Rose'
  },
  {
    id: 'galactic-amethyst',
    name: 'Galactic Nebula',
    category: 'cosmic',
    description: 'Electric Violet, Vivid Amethyst & Hot Magenta inspired by cosmic deep space.',
    primary: '#c084fc',
    primaryRgb: '192, 132, 252',
    secondary: '#ec4899',
    secondaryRgb: '236, 72, 153',
    tertiary: '#7c3aed',
    bgPrimary: '#080514',
    bgSurface: '#120d26',
    bgCard: 'rgba(18, 13, 38, 0.75)',
    textPrimary: '#faf5ff',
    textSecondary: '#d8b4fe',
    particleColors: ['#c084fc', '#a855f7', '#ec4899', '#e879f9'],
    particleStyle: 'mesh',
    mode: 'dark',
    badge: '🔮',
    tagline: 'Cosmic Violet & Pink'
  },
  {
    id: 'ocean-sapphire',
    name: 'Ocean Sapphire',
    category: 'nature',
    description: 'Deep Abyssal Blue with luminous Ice Sky and Royal Cobalt glow.',
    primary: '#38bdf8',
    primaryRgb: '56, 189, 248',
    secondary: '#3b82f6',
    secondaryRgb: '59, 130, 246',
    tertiary: '#1d4ed8',
    bgPrimary: '#030a18',
    bgSurface: '#07152d',
    bgCard: 'rgba(7, 21, 45, 0.75)',
    textPrimary: '#f0f9ff',
    textSecondary: '#93c5fd',
    particleColors: ['#38bdf8', '#3b82f6', '#60a5fa', '#0284c7'],
    particleStyle: 'orbs',
    mode: 'dark',
    badge: '🌊',
    tagline: 'Deep Sea Cobalt'
  },
  {
    id: 'crimson-overdrive',
    name: 'Crimson Overdrive',
    category: 'warm',
    description: 'High-octane Laser Crimson and Coral Fire for an intense, energetic developer vibe.',
    primary: '#ff3b5c',
    primaryRgb: '255, 59, 92',
    secondary: '#ff764c',
    secondaryRgb: '255, 118, 76',
    tertiary: '#dc2626',
    bgPrimary: '#0e0508',
    bgSurface: '#1c0a10',
    bgCard: 'rgba(28, 10, 16, 0.75)',
    textPrimary: '#fff1f2',
    textSecondary: '#fda4af',
    particleColors: ['#ff3b5c', '#ff764c', '#f43f5e', '#fda4af'],
    particleStyle: 'mesh',
    mode: 'dark',
    badge: '🔴',
    tagline: 'Laser Crimson Fire'
  },
  {
    id: 'oled-black',
    name: 'OLED Stealth',
    category: 'minimal',
    description: 'Pure #000000 true black canvas with metallic Platinum Silver accents and crisp contrast.',
    primary: '#e2e8f0',
    primaryRgb: '226, 232, 240',
    secondary: '#94a3b8',
    secondaryRgb: '148, 163, 184',
    tertiary: '#64748b',
    bgPrimary: '#000000',
    bgSurface: '#0c0c0e',
    bgCard: 'rgba(14, 14, 18, 0.85)',
    textPrimary: '#ffffff',
    textSecondary: '#cbd5e1',
    particleColors: ['#ffffff', '#e2e8f0', '#94a3b8', '#64748b'],
    particleStyle: 'starfield',
    mode: 'oled',
    badge: '🖤',
    tagline: 'Pure Pitch Black'
  },
  {
    id: 'aurora-light',
    name: 'Aurora Light',
    category: 'light',
    description: 'Ultra-crisp modern light theme with Azure Blue and Indigo for high-clarity reading.',
    primary: '#0284c7',
    primaryRgb: '2, 132, 199',
    secondary: '#6366f1',
    secondaryRgb: '99, 102, 241',
    tertiary: '#7c3aed',
    bgPrimary: '#f8fafc',
    bgSurface: '#ffffff',
    bgCard: 'rgba(255, 255, 255, 0.90)',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    particleColors: ['#0284c7', '#6366f1', '#8b5cf6', '#0ea5e9'],
    particleStyle: 'mesh',
    mode: 'light',
    badge: '☀️',
    tagline: 'Clean Daylight Frost'
  },
  {
    id: 'sakura-blossom',
    name: 'Sakura Light',
    category: 'light',
    description: 'Soft Rose Quartz & Cherry Blossom light aesthetic with smooth subtle warmth.',
    primary: '#db2777',
    primaryRgb: '219, 39, 119',
    secondary: '#e11d48',
    secondaryRgb: '225, 29, 72',
    tertiary: '#f472b6',
    bgPrimary: '#fff5f7',
    bgSurface: '#ffffff',
    bgCard: 'rgba(255, 255, 255, 0.92)',
    textPrimary: '#1c1917',
    textSecondary: '#78716c',
    particleColors: ['#db2777', '#f472b6', '#fb7185', '#fda4af'],
    particleStyle: 'orbs',
    mode: 'light',
    badge: '🌸',
    tagline: 'Soft Rose & Blossom'
  }
];

export const colorSwatches = [
  { name: 'Electric Cyan', hex: '#00f2fe', category: 'cyan' },
  { name: 'Sky Azure', hex: '#38bdf8', category: 'blue' },
  { name: 'Royal Cobalt', hex: '#3b82f6', category: 'blue' },
  { name: 'Vivid Violet', hex: '#a855f7', category: 'purple' },
  { name: 'Neon Magenta', hex: '#ec4899', category: 'pink' },
  { name: 'Cyber Emerald', hex: '#10b981', category: 'green' },
  { name: 'Mint Lime', hex: '#84cc16', category: 'green' },
  { name: 'Solar Amber', hex: '#f59e0b', category: 'yellow' },
  { name: 'Fire Orange', hex: '#f97316', category: 'orange' },
  { name: 'Laser Crimson', hex: '#ff3b5c', category: 'red' },
  { name: 'Ruby Red', hex: '#e11d48', category: 'red' },
  { name: 'Platinum Silver', hex: '#e2e8f0', category: 'neutral' },
  { name: 'Gold Flare', hex: '#eab308', category: 'yellow' },
  { name: 'Teal Quantum', hex: '#14b8a6', category: 'green' },
];

export const bgOptions = [
  { id: 'void-dark', name: 'Void Deep Navy', hex: '#07090e', mode: 'dark' as ThemeMode },
  { id: 'oled-black', name: 'OLED Pure Black', hex: '#000000', mode: 'oled' as ThemeMode },
  { id: 'forest-dark', name: 'Obsidian Emerald', hex: '#040e08', mode: 'dark' as ThemeMode },
  { id: 'cosmic-dark', name: 'Midnight Cosmic', hex: '#080514', mode: 'dark' as ThemeMode },
  { id: 'ocean-dark', name: 'Midnight Ocean', hex: '#030a18', mode: 'dark' as ThemeMode },
  { id: 'crimson-dark', name: 'Obsidian Ember', hex: '#0e0508', mode: 'dark' as ThemeMode },
  { id: 'clean-slate', name: 'Clean Dark Slate', hex: '#0f172a', mode: 'dark' as ThemeMode },
  { id: 'light-frost', name: 'Light Crisp Day', hex: '#f8fafc', mode: 'light' as ThemeMode },
  { id: 'light-sakura', name: 'Sakura Warm Light', hex: '#fff5f7', mode: 'light' as ThemeMode },
];

export const particleStyles: { id: ParticleStyle; label: string; icon: string; desc: string }[] = [
  { id: 'mesh', label: 'Interactive Mesh', icon: '🕸️', desc: 'Connecting nodes responding to cursor motion' },
  { id: 'matrix', label: 'Matrix Digital Rain', icon: '💻', desc: 'Flowing digital cyber stream' },
  { id: 'starfield', label: 'Cosmic Starfield', icon: '✨', desc: 'Twinkling depth stars floating gently' },
  { id: 'orbs', label: 'Ambient Glowing Orbs', icon: '🫧', desc: 'Peaceful floating radiant light circles' },
  { id: 'none', label: 'Minimal / Clean', icon: '🚫', desc: 'Clean background with subtle grid lines only' },
];

export const glowIntensityLevels: { id: GlowIntensity; label: string; multiplier: number }[] = [
  { id: 'none', label: 'Off', multiplier: 0 },
  { id: 'subtle', label: 'Subtle', multiplier: 0.5 },
  { id: 'high', label: 'Vibrant', multiplier: 1.0 },
  { id: 'neon', label: 'Ultra Neon', multiplier: 1.6 },
];

/**
 * Converts a hex string (#ffffff or #fff) to "r, g, b" string
 */
export function hexToRgb(hex: string): string {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  if (cleanHex.length !== 6) {
    return '0, 242, 254'; // Fallback to cyan
  }
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `${isNaN(r) ? 0 : r}, ${isNaN(g) ? 242 : g}, ${isNaN(b) ? 254 : b}`;
}

/**
 * Generates a secondary accent from a primary hex
 */
export function generateSecondaryHex(hex: string): string {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
  if (clean.length !== 6) return '#4facfe';

  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);

  // Shift hue / brightness slightly
  const newR = Math.min(255, Math.max(0, Math.round(r * 0.7 + b * 0.3)));
  const newG = Math.min(255, Math.max(0, Math.round(g * 0.8 + 40)));
  const newB = Math.min(255, Math.max(0, Math.round(b * 0.9 + 50)));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * Lightweight web audio synthesizer for futuristic UI feedback sound
 */
export function playThemeSound(type: 'switch' | 'select' | 'open' | 'random' = 'switch') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'switch') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'random') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1040, now + 0.22);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'open') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(560, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // AudioContext blocked or not supported
  }
}
