import type { BladePoint, BladeSkin, Particle, Point } from './types';

export const BLADE_SKINS: BladeSkin[] = [
  {
    id: 'cyber_blade',
    name: 'Cyber Katana',
    glowColor: 'rgba(6, 182, 212, 0.85)',
    coreColor: '#ffffff',
    particleColor: ['#06b6d4', '#38bdf8', '#67e8f9', '#ffffff'],
    slashWidth: 10,
    description: 'High-frequency neon plasma blade with electric spark trails.',
    icon: '⚡',
  },
  {
    id: 'fire_dragon',
    name: 'Dragon Flame',
    glowColor: 'rgba(239, 68, 68, 0.9)',
    coreColor: '#fef08a',
    particleColor: ['#ef4444', '#f97316', '#facc15', '#ffffff'],
    slashWidth: 12,
    description: 'Forged in dragonfire. Emits burning embers and heat distortion.',
    icon: '🔥',
  },
  {
    id: 'sakura_blossom',
    name: 'Sakura Blossom',
    glowColor: 'rgba(236, 72, 153, 0.85)',
    coreColor: '#fff1f2',
    particleColor: ['#ec4899', '#f472b6', '#fbcfe8', '#ffffff'],
    slashWidth: 9,
    description: 'Graceful katana with fluttering cherry blossom petals.',
    icon: '🌸',
  },
  {
    id: 'shadow_void',
    name: 'Shadow Void',
    glowColor: 'rgba(168, 85, 247, 0.9)',
    coreColor: '#e9d5ff',
    particleColor: ['#a855f7', '#c084fc', '#7e22ce', '#3b0764'],
    slashWidth: 11,
    description: 'Dark ninjutsu blade infused with void energy.',
    icon: '🌌',
  },
  {
    id: 'solar_gold',
    name: 'Solar Radiance',
    glowColor: 'rgba(234, 179, 8, 0.95)',
    coreColor: '#ffffff',
    particleColor: ['#eab308', '#facc15', '#fef08a', '#ffffff'],
    slashWidth: 12,
    description: 'Holy golden blade that shines with solar flare brilliance.',
    icon: '✨',
  },
  {
    id: 'rainbow_prism',
    name: 'Prism Rainbow',
    glowColor: 'rgba(56, 189, 248, 0.85)',
    coreColor: '#ffffff',
    particleColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#a855f7'],
    slashWidth: 10,
    description: 'Chroma-shifting spectrum blade with rainbow light trails.',
    icon: '🌈',
  },
];

export class Blade {
  public id: string;
  public skin: BladeSkin;
  public points: BladePoint[] = [];
  public particles: Particle[] = [];
  public maxAgeMs: number = 220; // Trail persistence in ms
  public isCutting: boolean = false;
  public lastPoint: Point | null = null;
  public currentSpeed: number = 0;

  constructor(id: string, skinId: string = 'cyber_blade') {
    this.id = id;
    this.skin = BLADE_SKINS.find((s) => s.id === skinId) || BLADE_SKINS[0];
  }

  public setSkin(skinId: string) {
    this.skin = BLADE_SKINS.find((s) => s.id === skinId) || BLADE_SKINS[0];
  }

  /**
   * Add a tracked point to the blade trajectory
   */
  public addPoint(x: number, y: number) {
    const now = performance.now();
    let speed = 0;

    if (this.points.length > 0) {
      const prev = this.points[this.points.length - 1];
      const dt = Math.max(1, now - prev.time);
      const dist = Math.hypot(x - prev.x, y - prev.y);
      speed = (dist / dt) * 1000; // px per second
    }

    this.currentSpeed = speed;
    this.isCutting = speed > 220; // Minimum velocity required for a slice cut
    this.lastPoint = { x, y };

    this.points.push({ x, y, time: now, speed });

    // Spawn sparks if moving fast
    if (this.isCutting) {
      this.spawnSparks(x, y, speed);
    }
  }

  /**
   * Spawn blade spark particles
   */
  private spawnSparks(x: number, y: number, speed: number) {
    const count = Math.min(Math.floor(speed / 400) + 1, 4);
    const isSakura = this.skin.id === 'sakura_blossom';

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = (Math.random() * 2 + 1) * (speed / 800);
      const color = this.skin.particleColor[Math.floor(Math.random() * this.skin.particleColor.length)];

      this.particles.push({
        x: x + (Math.random() * 8 - 4),
        y: y + (Math.random() * 8 - 4),
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity + (isSakura ? 0.3 : 0.8), // slight gravity
        color,
        radius: isSakura ? Math.random() * 3 + 2 : Math.random() * 2.5 + 1.2,
        alpha: 1.0,
        decay: isSakura ? 0.02 : 0.045 + Math.random() * 0.03,
        gravity: isSakura ? 0.05 : 0.15,
        shape: isSakura ? 'petal' : 'spark',
      });
    }
  }

  /**
   * Update particle lifecycle and prune old trail points
   */
  public update() {
    const now = performance.now();

    // Prune stale trail points
    this.points = this.points.filter((p) => now - p.time < this.maxAgeMs);

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Render the glowing katana trail and particles on canvas
   */
  public draw(ctx: CanvasRenderingContext2D) {
    // 1. Draw particles
    ctx.save();
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;

      if (p.shape === 'petal') {
        // Draw delicate sakura petal
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.radius * 1.5, p.radius * 0.8, p.alpha * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw spark / diamond
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // 2. Draw Katana Trail
    if (this.points.length < 2) return;

    ctx.save();
    const now = performance.now();

    // Rainbow prism dynamic hue shift
    let glow = this.skin.glowColor;
    if (this.skin.id === 'rainbow_prism') {
      const hue = (now * 0.2) % 360;
      glow = `hsla(${hue}, 100%, 65%, 0.85)`;
    }

    // Outer Neon Glow Pass
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 1; i < this.points.length; i++) {
      const p0 = this.points[i - 1];
      const p1 = this.points[i];
      const age1 = now - p1.time;
      const progress = 1 - age1 / this.maxAgeMs; // 1 = newest, 0 = oldest
      if (progress <= 0) continue;

      const width = this.skin.slashWidth * Math.pow(progress, 1.2);

      // Outer glow
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.strokeStyle = glow;
      ctx.lineWidth = width * 1.8;
      ctx.shadowBlur = 16;
      ctx.shadowColor = glow;
      ctx.globalAlpha = Math.pow(progress, 1.4);
      ctx.stroke();

      // Inner Core Razor White
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.strokeStyle = this.skin.coreColor;
      ctx.lineWidth = Math.max(2, width * 0.65);
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#ffffff';
      ctx.globalAlpha = Math.pow(progress, 0.8);
      ctx.stroke();
    }

    // Blade Tip Katana Shimmer Flare
    if (this.lastPoint && this.points.length > 0) {
      const latest = this.points[this.points.length - 1];
      const tipAge = now - latest.time;
      if (tipAge < 100) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = glow;
        ctx.beginPath();
        ctx.arc(latest.x, latest.y, this.skin.slashWidth * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  /**
   * Get active line segments for collision detection
   */
  public getActiveSegments(): { p1: Point; p2: Point; speed: number }[] {
    const segments: { p1: Point; p2: Point; speed: number }[] = [];
    const now = performance.now();

    for (let i = 1; i < this.points.length; i++) {
      const p1 = this.points[i - 1];
      const p2 = this.points[i];
      const age = now - p2.time;
      // Only segments within the last 100ms and sufficient velocity can slice
      if (age < 120 && p2.speed > 160) {
        segments.push({ p1: { x: p1.x, y: p1.y }, p2: { x: p2.x, y: p2.y }, speed: p2.speed });
      }
    }

    return segments;
  }

  public clear() {
    this.points = [];
    this.particles = [];
    this.lastPoint = null;
    this.currentSpeed = 0;
  }
}
