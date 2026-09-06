import { Blade, BLADE_SKINS } from './Blade';
import { Fruit } from './Fruit';
import { soundEngine } from './SoundEngine';
import type {
  BladeSkin,
  DojoTheme,
  FloatingText,
  FruitType,
  GameMode,
  GameSettings,
  GameStats,
  HandPose,
  JuiceSplatter,
  Particle,
  Point,
  SliceHalf,
} from './types';

export const DOJO_THEMES: DojoTheme[] = [
  {
    id: 'midnight_tatami',
    name: 'Midnight Tatami Dojo',
    bgGradient: ['#1e1b18', '#0f0d0b', '#070605'],
    wallTexture: 'tatami',
    accentColor: '#f59e0b',
    description: 'Traditional cedar wood dojo with ambient paper lanterns.',
  },
  {
    id: 'cyber_neo_tokyo',
    name: 'Cyberpunk Neo-Tokyo',
    bgGradient: ['#090d16', '#030712', '#000000'],
    wallTexture: 'cyber',
    accentColor: '#06b6d4',
    description: 'Futuristic glowing neon city grid with holographic ambiance.',
  },
  {
    id: 'sunset_bamboo',
    name: 'Sunset Bamboo Grove',
    bgGradient: ['#3f1d14', '#1f0d08', '#0a0402'],
    wallTexture: 'sunset',
    accentColor: '#f97316',
    description: 'Golden hour sunset with fluttering bamboo leaves.',
  },
  {
    id: 'camera_ar_dojo',
    name: 'AR Camera Pass-Through',
    bgGradient: ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)'],
    wallTexture: 'camera',
    accentColor: '#22c55e',
    description: 'Live webcam video background. Slice fruits in your own room!',
  },
];

export class GameEngine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public width: number = 1000;
  public height: number = 700;

  // Blades: Left hand, Right hand, and Mouse/Touch blade
  public rightBlade: Blade;
  public leftBlade: Blade;
  public mouseBlade: Blade;

  // Active game entities
  public fruits: Fruit[] = [];
  public sliceHalves: SliceHalf[] = [];
  public particles: Particle[] = [];
  public splatters: JuiceSplatter[] = [];
  public floatingTexts: FloatingText[] = [];

  // Game state
  public state: 'menu' | 'playing' | 'paused' | 'gameover' | 'pomegranate_rush' = 'menu';
  public mode: GameMode = 'classic';
  public score: number = 0;
  public lives: number = 3;
  public maxLives: number = 3;
  public misses: number = 0;
  public timeRemaining: number = 60; // For Arcade / Zen
  public isSlowMo: boolean = false;
  public slowMoTimer: number = 0;
  public isDoublePoints: boolean = false;
  public doublePointsTimer: number = 0;
  public isFrenzy: boolean = false;
  public frenzyTimer: number = 0;

  // Pomegranate bonus rush at end of Arcade
  public pomegranateFruit: Fruit | null = null;
  public pomegranateTimer: number = 0;

  // Wave spawner
  private nextWaveTime: number = 0;
  private waveCount: number = 0;
  private isBombActive: boolean = false;

  // Screen shake & hit stop
  public screenShake: number = 0;
  private hitStopFrames: number = 0;

  // Combo system
  private recentSlices: { time: number; type: FruitType; points: number }[] = [];
  private comboResetTimer: number = 0;
  public currentCombo: number = 0;
  public maxComboInSession: number = 0;

  // Dojo & Blade settings
  public selectedSkin: BladeSkin = BLADE_SKINS[0];
  public selectedTheme: DojoTheme = DOJO_THEMES[0];
  public settings: GameSettings = {
    soundEnabled: true,
    musicEnabled: true,
    soundVolume: 0.9,
    musicVolume: 0.4,
    selectedBlade: 'cyber_blade',
    selectedDojo: 'midnight_tatami',
    handTrackingSensitivity: 1.4,
    showWebcamPip: true,
    showSkeleton: true,
    isCameraMirrored: true,
    cameraBackgroundAlpha: 0.4,
  };

  public stats: GameStats = {
    score: 0,
    highScore: 0,
    maxCombo: 0,
    fruitsSliced: 0,
    bombsHit: 0,
    criticalSlices: 0,
    accuracy: 100,
    slicedByType: {
      watermelon: 0,
      orange: 0,
      apple: 0,
      banana: 0,
      strawberry: 0,
      pineapple: 0,
      coconut: 0,
      dragonfruit: 0,
      freeze_banana: 0,
      starfruit: 0,
      bomb: 0,
      pomegranate: 0,
    },
    timePlayed: 0,
  };

  private lastFrameTime: number = performance.now();
  private isRunning: boolean = false;
  private onGameOverCallback: ((stats: GameStats) => void) | null = null;
  private onStateChangeCallback: (() => void) | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) throw new Error('Cannot acquire 2D canvas context');
    this.ctx = context;

    this.rightBlade = new Blade('right_blade', this.settings.selectedBlade);
    this.leftBlade = new Blade('left_blade', this.settings.selectedBlade);
    this.mouseBlade = new Blade('mouse_blade', this.settings.selectedBlade);

    this.loadSavedStats();
    this.resize();
  }

  public setCallbacks(onGameOver: (stats: GameStats) => void, onStateChange?: () => void) {
    this.onGameOverCallback = onGameOver;
    this.onStateChangeCallback = onStateChange || null;
  }

  public resize() {
    const parent = this.canvas.parentElement;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    }
  }

  private loadSavedStats() {
    try {
      const savedHigh = localStorage.getItem(`fruitninja_high_${this.mode}`);
      if (savedHigh) {
        this.stats.highScore = parseInt(savedHigh, 10) || 0;
      }
      const savedBlade = localStorage.getItem('fruitninja_blade');
      if (savedBlade) {
        const found = BLADE_SKINS.find((b) => b.id === savedBlade);
        if (found) this.setBladeSkin(found);
      }
      const savedDojo = localStorage.getItem('fruitninja_dojo');
      if (savedDojo) {
        const found = DOJO_THEMES.find((d) => d.id === savedDojo);
        if (found) this.selectedTheme = found;
      }
    } catch {
      // LocalStorage fallback
    }
  }

  public setBladeSkin(skin: BladeSkin) {
    this.selectedSkin = skin;
    this.rightBlade.setSkin(skin.id);
    this.leftBlade.setSkin(skin.id);
    this.mouseBlade.setSkin(skin.id);
    this.settings.selectedBlade = skin.id;
    try {
      localStorage.setItem('fruitninja_blade', skin.id);
    } catch {}
  }

  public setDojoTheme(theme: DojoTheme) {
    this.selectedTheme = theme;
    this.settings.selectedDojo = theme.id;
    try {
      localStorage.setItem('fruitninja_dojo', theme.id);
    } catch {}
  }

  /**
   * Start a new game with the chosen mode
   */
  public startGame(mode: GameMode = 'classic') {
    this.mode = mode;
    this.score = 0;
    this.lives = 3;
    this.misses = 0;
    this.currentCombo = 0;
    this.maxComboInSession = 0;
    this.timeRemaining = mode === 'arcade' ? 60 : mode === 'zen' ? 90 : 0;
    this.isSlowMo = false;
    this.isDoublePoints = false;
    this.isFrenzy = false;
    this.pomegranateFruit = null;
    this.waveCount = 0;
    this.nextWaveTime = performance.now() + 800;

    this.fruits = [];
    this.sliceHalves = [];
    this.particles = [];
    this.floatingTexts = [];
    this.recentSlices = [];

    this.stats.score = 0;
    this.stats.maxCombo = 0;
    this.stats.fruitsSliced = 0;
    this.stats.bombsHit = 0;
    this.stats.criticalSlices = 0;
    this.stats.timePlayed = 0;
    this.loadSavedStats();

    this.state = 'playing';
    soundEngine.playMenuClick();
    soundEngine.startAmbientZenMusic();

    if (this.onStateChangeCallback) this.onStateChangeCallback();
  }

  /**
   * Handle hand movement points from HandTracker
   */
  public handleHandMovements(hands: HandPose[]) {
    for (const hand of hands) {
      const tip = hand.indexFingerTip;
      const canvasX = tip.x * this.width;
      const canvasY = tip.y * this.height;

      if (hand.handedness === 'Left') {
        this.leftBlade.addPoint(canvasX, canvasY);
      } else {
        this.rightBlade.addPoint(canvasX, canvasY);
      }
    }
  }

  /**
   * Handle mouse / touch blade movements
   */
  public handlePointerMove(x: number, y: number) {
    this.mouseBlade.addPoint(x, y);
  }

  public handlePointerUp() {
    this.mouseBlade.clear();
  }

  /**
   * Main game loop
   */
  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = performance.now();

    const loop = (timestamp: number) => {
      if (!this.isRunning) return;

      const dt = Math.min(100, timestamp - this.lastFrameTime) / 1000;
      this.lastFrameTime = timestamp;

      this.update(dt);
      this.render();

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  public stop() {
    this.isRunning = false;
    soundEngine.stopAmbientMusic();
    soundEngine.stopBombFuse();
  }

  /**
   * Update physics, collision, timers, spawner
   */
  private update(dt: number) {
    // Hit stop freeze effect
    if (this.hitStopFrames > 0) {
      this.hitStopFrames--;
      return;
    }

    const timeScale = this.isSlowMo ? 0.4 : 1.0;
    const now = performance.now();

    // Screen shake decay
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 30);
    }

    // Power-up timers
    if (this.isSlowMo) {
      this.slowMoTimer -= dt;
      if (this.slowMoTimer <= 0) this.isSlowMo = false;
    }
    if (this.isDoublePoints) {
      this.doublePointsTimer -= dt;
      if (this.doublePointsTimer <= 0) this.isDoublePoints = false;
    }
    if (this.isFrenzy) {
      this.frenzyTimer -= dt;
      if (this.frenzyTimer <= 0) this.isFrenzy = false;
    }

    // Arcade / Zen countdown timer
    if (this.state === 'playing' && (this.mode === 'arcade' || this.mode === 'zen')) {
      this.timeRemaining -= dt;
      this.stats.timePlayed += dt;

      // Trigger Pomegranate Rush in Arcade mode at 5s remaining
      if (this.mode === 'arcade' && this.timeRemaining <= 6 && this.timeRemaining > 0 && !this.pomegranateFruit) {
        this.startPomegranateRush();
      }

      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.gameOver();
      }
    } else if (this.state === 'playing' && this.mode === 'classic') {
      this.stats.timePlayed += dt;
    }

    // Update Blades
    this.rightBlade.update();
    this.leftBlade.update();
    this.mouseBlade.update();

    if (this.state === 'playing' || this.state === 'pomegranate_rush') {
      // Play blade whooshes on fast slashes
      const maxBladeSpeed = Math.max(
        this.rightBlade.currentSpeed,
        this.leftBlade.currentSpeed,
        this.mouseBlade.currentSpeed
      );
      if (maxBladeSpeed > 600 && Math.random() > 0.65) {
        soundEngine.playSlashWhoosh(maxBladeSpeed / 800);
      }

      // Check blade slicing collisions
      this.checkSliceCollisions();

      // Fruit Spawner
      if (this.state === 'playing') {
        this.updateSpawner(now);
      }
    }

    // Update Fruits
    let hasActiveBomb = false;
    for (let i = this.fruits.length - 1; i >= 0; i--) {
      const f = this.fruits[i];
      f.update(timeScale, this.height);

      if (f.config.isBomb && !f.isSliced && !f.isOffScreen) {
        hasActiveBomb = true;
      }

      // Missed fruit in Classic mode
      if (f.isOffScreen) {
        if (!f.isSliced && !f.config.isBomb && this.mode === 'classic' && this.state === 'playing') {
          this.handleMissedFruit(f);
        }
        this.fruits.splice(i, 1);
      } else if (f.isSliced && f.type !== 'pomegranate') {
        this.fruits.splice(i, 1);
      }
    }

    // Sound for bomb fuse
    if (hasActiveBomb && !this.isBombActive) {
      soundEngine.startBombFuse();
      this.isBombActive = true;
    } else if (!hasActiveBomb && this.isBombActive) {
      soundEngine.stopBombFuse();
      this.isBombActive = false;
    }

    // Update Sliced Halves
    for (let i = this.sliceHalves.length - 1; i >= 0; i--) {
      const h = this.sliceHalves[i];
      h.x += h.vx * timeScale;
      h.y += h.vy * timeScale;
      h.vy += 0.42 * timeScale;
      h.rotation += h.vRot * timeScale;
      h.alpha -= 0.008 * timeScale;

      if (h.alpha <= 0 || h.y > this.height + 100) {
        this.sliceHalves.splice(i, 1);
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * timeScale;
      p.y += p.vy * timeScale;
      p.vy += p.gravity * timeScale;
      p.alpha -= p.decay * timeScale;

      if (p.alpha <= 0 || p.y > this.height + 40) {
        this.particles.splice(i, 1);
      }
    }

    // Update Juice Splatters
    for (let i = this.splatters.length - 1; i >= 0; i--) {
      const s = this.splatters[i];
      s.life++;
      if (s.life > s.maxLife) {
        s.alpha -= 0.005;
        if (s.alpha <= 0) {
          this.splatters.splice(i, 1);
        }
      }
    }

    // Update Floating Score Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y += t.vy;
      t.scale = Math.min(1.3, t.scale + 0.03);
      t.alpha -= 0.02;
      if (t.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Combo tracker evaluation
    if (this.recentSlices.length > 0 && now - this.comboResetTimer > 280) {
      this.evaluateCombo();
      this.recentSlices = [];
    }
  }

  /**
   * Spawn fruit waves
   */
  private updateSpawner(now: number) {
    if (now < this.nextWaveTime) return;

    this.waveCount++;
    const isFrenzyActive = this.isFrenzy;
    const waveSize = isFrenzyActive
      ? Math.floor(Math.random() * 3) + 4
      : Math.min(Math.floor(Math.random() * 3) + 1 + Math.floor(this.score / 25), 5);

    for (let i = 0; i < waveSize; i++) {
      this.spawnFruit(i, waveSize);
    }

    // Delay until next wave
    const interval = isFrenzyActive
      ? 350 + Math.random() * 400
      : Math.max(1400, 3200 - Math.min(this.score * 15, 1600)) + Math.random() * 600;

    this.nextWaveTime = now + interval;
  }

  /**
   * Spawn an individual fruit or bomb
   */
  private spawnFruit(index: number, totalInWave: number) {
    const id = `fruit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const margin = this.width * 0.15;
    const spawnWidth = this.width - margin * 2;
    const step = spawnWidth / Math.max(1, totalInWave);
    const startX = margin + step * index + (Math.random() * 40 - 20);
    const startY = this.height + 30;

    // Upward launch velocity arc
    const targetApexY = this.height * (0.15 + Math.random() * 0.28);
    const gravity = 0.38;
    const vy = -Math.sqrt(2 * gravity * (startY - targetApexY));

    // Horizontal drift towards center
    const center = this.width / 2;
    const vx = (center - startX) * 0.008 + (Math.random() * 3 - 1.5);
    const vRot = (Math.random() - 0.5) * 0.08;

    // Determine type
    let type: FruitType = 'watermelon';
    const rand = Math.random();

    // Bomb chance
    if (this.mode === 'classic' && rand < 0.22 && this.score >= 5) {
      type = 'bomb';
    } else if (this.mode === 'arcade' && rand < 0.18 && this.score >= 10) {
      type = 'bomb';
    } else if (this.mode === 'arcade' && rand > 0.88) {
      // Power-up banana or dragonfruit
      const pRand = Math.random();
      type = pRand < 0.35 ? 'freeze_banana' : pRand < 0.7 ? 'dragonfruit' : 'starfruit';
    } else {
      // Standard colorful fruits
      const regularTypes: FruitType[] = [
        'watermelon',
        'orange',
        'apple',
        'banana',
        'strawberry',
        'pineapple',
        'coconut',
      ];
      type = regularTypes[Math.floor(Math.random() * regularTypes.length)];
    }

    const fruit = new Fruit(id, type, startX, startY, vx, vy, vRot);
    this.fruits.push(fruit);
  }

  /**
   * Collision check between all active blades and fruits
   */
  private checkSliceCollisions() {
    const blades = [this.rightBlade, this.leftBlade, this.mouseBlade];

    for (const blade of blades) {
      const segments = blade.getActiveSegments();
      if (segments.length === 0) continue;

      for (const segment of segments) {
        for (const fruit of this.fruits) {
          if (fruit.isSliced && fruit.type !== 'pomegranate') continue;

          // Check line-segment to circle distance
          const hit = this.lineIntersectsCircle(segment.p1, segment.p2, { x: fruit.x, y: fruit.y }, fruit.radius);

          if (hit) {
            const sliceAngle = Math.atan2(segment.p2.y - segment.p1.y, segment.p2.x - segment.p1.x);
            this.handleFruitCut(fruit, sliceAngle, segment.speed);
          }
        }
      }
    }
  }

  /**
   * Mathematics: Line Segment to Circle Intersection
   */
  private lineIntersectsCircle(p1: Point, p2: Point, c: Point, r: number): boolean {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lenSq = dx * dx + dy * dy;

    if (lenSq === 0) {
      return Math.hypot(p1.x - c.x, p1.y - c.y) <= r;
    }

    // Projection scalar t of circle center onto line segment
    const t = Math.max(0, Math.min(1, ((c.x - p1.x) * dx + (c.y - p1.y) * dy) / lenSq));
    const nearestX = p1.x + t * dx;
    const nearestY = p1.y + t * dy;

    return Math.hypot(nearestX - c.x, nearestY - c.y) <= r;
  }

  /**
   * Trigger fruit slice cut effects, score, and combos
   */
  private handleFruitCut(fruit: Fruit, sliceAngle: number, sliceSpeed: number) {
    if (fruit.config.isBomb) {
      this.handleBombExplosion(fruit);
      return;
    }

    if (fruit.type === 'pomegranate') {
      fruit.hitCount++;
      soundEngine.playFruitSlice('pomegranate', true);
      this.score += 2;
      this.stats.fruitsSliced++;
      this.addFloatingText('+2', fruit.x, fruit.y, '#f43f5e', 1.0);

      // Mini sparks
      const { particles } = fruit.slice(sliceAngle, sliceSpeed);
      this.particles.push(...particles.slice(0, 8));

      if (fruit.hitCount >= fruit.hitsRequired) {
        fruit.isSliced = true;
        this.score += 20;
        this.addFloatingText('POMEGRANATE BLITZ! +20', fruit.x, fruit.y, '#f43f5e', 1.4);
        soundEngine.playComboFanfare(6);
        this.screenShake = 12;
      }
      return;
    }

    // Standard Fruit Slice
    const { halves, particles, splatter } = fruit.slice(sliceAngle, sliceSpeed);
    this.sliceHalves.push(...halves);
    this.particles.push(...particles);
    if (splatter) this.splatters.push(splatter);

    // Points calculation (with double points multiplier)
    const isCritical = Math.random() < 0.08 && !fruit.config.isSpecial;
    let earnedPoints = (fruit.config.points + (isCritical ? 10 : 0)) * (this.isDoublePoints ? 2 : 1);

    this.score += earnedPoints;
    this.stats.fruitsSliced++;
    this.stats.slicedByType[fruit.type] = (this.stats.slicedByType[fruit.type] || 0) + 1;

    if (isCritical) {
      this.stats.criticalSlices++;
      this.addFloatingText('CRITICAL! +10', fruit.x, fruit.y - 20, '#facc15', 1.3);
    } else {
      this.addFloatingText(`+${earnedPoints}`, fruit.x, fruit.y, fruit.config.color, 1.0);
    }

    // Special powerup triggers
    if (fruit.config.isSpecial) {
      if (fruit.config.specialType === 'freeze') {
        this.isSlowMo = true;
        this.slowMoTimer = 5.0;
        soundEngine.playFreezeEffect();
        this.addFloatingText('FREEZE SLOW-MO!', fruit.x, fruit.y - 30, '#38bdf8', 1.4);
      } else if (fruit.config.specialType === 'frenzy') {
        this.isFrenzy = true;
        this.frenzyTimer = 5.5;
        soundEngine.playFrenzyGong();
        this.addFloatingText('FRUIT FRENZY!', fruit.x, fruit.y - 30, '#ec4899', 1.5);
      } else if (fruit.config.specialType === 'double') {
        this.isDoublePoints = true;
        this.doublePointsTimer = 6.0;
        soundEngine.playFreezeEffect();
        this.addFloatingText('2X DOUBLE SCORE!', fruit.x, fruit.y - 30, '#eab308', 1.4);
      }
    } else {
      soundEngine.playFruitSlice(fruit.type, isCritical);
    }

    // Combo recording
    const now = performance.now();
    this.recentSlices.push({ time: now, type: fruit.type, points: earnedPoints });
    this.comboResetTimer = now;

    // Classic extra life milestone (at 100, 200, 300 pts)
    if (this.mode === 'classic' && this.score > 0 && this.score % 100 === 0 && this.lives < this.maxLives) {
      this.lives++;
      this.addFloatingText('+1 EXTRA LIFE! ❤️', this.width / 2, this.height * 0.4, '#ef4444', 1.4);
    }
  }

  /**
   * Combo evaluation for multi-slice combos (3x, 4x, 5x, 6x+)
   */
  private evaluateCombo() {
    const count = this.recentSlices.length;
    if (count >= 3) {
      const bonus = count >= 6 ? 10 : count >= 5 ? 5 : count >= 4 ? 4 : 3;
      this.score += bonus * (this.isDoublePoints ? 2 : 1);
      this.currentCombo = count;

      if (count > this.maxComboInSession) {
        this.maxComboInSession = count;
        this.stats.maxCombo = Math.max(this.stats.maxCombo, count);
      }

      soundEngine.playComboFanfare(count);
      this.hitStopFrames = 2;
      this.screenShake = 6 + count;

      const comboText = count >= 6 ? `⚡ BLITZ COMBO x${count}! +${bonus}` : `✨ COMBO x${count}! +${bonus}`;
      const color = count >= 6 ? '#facc15' : count >= 5 ? '#38bdf8' : '#a855f7';
      this.addFloatingText(comboText, this.width / 2, this.height * 0.35, color, 1.4);
    }
  }

  /**
   * Handle slicing a dangerous bomb
   */
  private handleBombExplosion(bomb: Fruit) {
    bomb.isSliced = true;
    this.stats.bombsHit++;
    soundEngine.playBombExplosion();
    this.screenShake = 24;
    this.hitStopFrames = 4;

    // Massive spark explosion
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.particles.push({
        x: bomb.x,
        y: bomb.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.5 ? '#ef4444' : Math.random() > 0.5 ? '#f97316' : '#ffffff',
        radius: Math.random() * 5 + 2,
        alpha: 1.0,
        decay: 0.02,
        gravity: 0.2,
        shape: 'spark',
      });
    }

    if (this.mode === 'classic') {
      // Instant Game Over
      this.addFloatingText('BOMB DETONATED! GAME OVER', this.width / 2, this.height / 2, '#ef4444', 1.6);
      setTimeout(() => this.gameOver(), 600);
    } else {
      // Arcade penalty (-10 points and clear fruits)
      this.score = Math.max(0, this.score - 10);
      this.addFloatingText('BOMB HIT! -10 PTS', bomb.x, bomb.y, '#ef4444', 1.3);
      this.fruits = [];
    }
  }

  /**
   * Handle missed fruit in Classic mode
   */
  private handleMissedFruit(fruit: Fruit) {
    this.misses++;
    this.lives = Math.max(0, this.lives - 1);
    soundEngine.playFruitMiss();

    this.addFloatingText('❌ MISS', fruit.x, this.height - 40, '#ef4444', 1.2);

    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  /**
   * Start end-game Pomegranate Rush
   */
  private startPomegranateRush() {
    this.state = 'pomegranate_rush';
    this.fruits = [];
    soundEngine.playFrenzyGong();

    const pom = new Fruit(
      'pomegranate-boss',
      'pomegranate',
      this.width / 2,
      this.height * 0.45,
      0,
      -0.5,
      0.02
    );
    pom.gravity = 0; // floats in center
    this.pomegranateFruit = pom;
    this.fruits.push(pom);

    this.addFloatingText('⚔️ SLICE RAPIDLY! POMEGRANATE RUSH! ⚔️', this.width / 2, this.height * 0.2, '#f43f5e', 1.5);
  }

  private addFloatingText(text: string, x: number, y: number, color: string, scale: number) {
    this.floatingTexts.push({
      id: `text-${Date.now()}-${Math.random()}`,
      text,
      x,
      y,
      color,
      scale,
      alpha: 1.0,
      vy: -1.2,
    });
  }

  /**
   * Trigger Game Over and show stats summary
   */
  private gameOver() {
    this.state = 'gameover';
    soundEngine.stopAmbientMusic();
    soundEngine.stopBombFuse();

    this.stats.score = this.score;
    this.stats.maxCombo = this.maxComboInSession;

    // Save high score
    if (this.score > this.stats.highScore) {
      this.stats.highScore = this.score;
      try {
        localStorage.setItem(`fruitninja_high_${this.mode}`, this.score.toString());
      } catch {}
    }

    if (this.onGameOverCallback) {
      this.onGameOverCallback(this.stats);
    }
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback();
    }
  }

  /**
   * Main canvas render pass
   */
  public render() {
    const ctx = this.ctx;
    ctx.save();

    // Apply Screen Shake
    if (this.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShake;
      const shakeY = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(shakeX, shakeY);
    }

    // 1. Draw Dojo Background Wall
    this.drawDojoBackground(ctx);

    // 2. Draw Juice Splatters on Wall
    this.drawJuiceSplatters(ctx);

    // 3. Draw Sliced Fruit Halves
    for (const half of this.sliceHalves) {
      Fruit.drawHalf(ctx, half);
    }

    // 4. Draw Intact Fruits & Bombs
    for (const fruit of this.fruits) {
      fruit.draw(ctx);
    }

    // 5. Draw Particle Droplets & Sparks
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 6. Draw Katana Blades & Sparks (Left Hand, Right Hand, Mouse)
    this.leftBlade.draw(ctx);
    this.rightBlade.draw(ctx);
    this.mouseBlade.draw(ctx);

    // 7. Draw Power-up Freeze Overlay
    if (this.isSlowMo) {
      ctx.save();
      ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, this.width - 8, this.height - 8);
      ctx.restore();
    }

    // 8. Draw Floating Score Texts
    for (const t of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, t.alpha);
      ctx.fillStyle = t.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = t.color;
      ctx.font = `bold ${Math.round(22 * t.scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }

    // 9. Draw HUD (Scores, Lives, Timers)
    if (this.state === 'playing' || this.state === 'pomegranate_rush') {
      this.drawHUD(ctx);
    }

    ctx.restore();
  }

  /**
   * Draw atmospheric wooden/cyber dojo background
   */
  private drawDojoBackground(ctx: CanvasRenderingContext2D) {
    const theme = this.selectedTheme;

    if (theme.wallTexture === 'camera') {
      // In AR pass-through mode, clear with slight dark tint for fruit contrast
      ctx.fillStyle = `rgba(15, 23, 42, ${this.settings.cameraBackgroundAlpha})`;
      ctx.fillRect(0, 0, this.width, this.height);
      return;
    }

    // Linear gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, theme.bgGradient[0]);
    grad.addColorStop(0.6, theme.bgGradient[1] || theme.bgGradient[0]);
    grad.addColorStop(1, theme.bgGradient[2] || theme.bgGradient[0]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Wood tatami planks / Cyber grid texture
    ctx.save();
    if (theme.wallTexture === 'tatami' || theme.wallTexture === 'sunset') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const plankHeight = 70;
      for (let y = 0; y < this.height; y += plankHeight) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.width, y);
        ctx.stroke();
      }
    } else if (theme.wallTexture === 'cyber') {
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < this.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.height);
        ctx.stroke();
      }
      for (let y = 0; y < this.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.width, y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  /**
   * Render juice stains on dojo wall
   */
  private drawJuiceSplatters(ctx: CanvasRenderingContext2D) {
    ctx.save();
    for (const s of this.splatters) {
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.fillStyle = s.color;

      // Center splat
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Radiating droplets
      for (const d of s.drops) {
        ctx.beginPath();
        ctx.arc(s.x + d.dx, s.y + d.dy, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  /**
   * Draw HUD elements (Score, Lives, Timers, Combos)
   */
  private drawHUD(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // Top Left: Score Counter with Fruit icon
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.fillText(`🍉 ${this.score}`, 24, 20);

    // Best score indicator
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText(`BEST: ${Math.max(this.score, this.stats.highScore)}`, 28, 58);

    // Top Center: Arcade / Zen Mode Timer or Power-up alerts
    if (this.mode === 'arcade' || this.mode === 'zen') {
      const isUrgent = this.timeRemaining < 10;
      ctx.textAlign = 'center';
      ctx.fillStyle = isUrgent ? '#ef4444' : '#38bdf8';
      ctx.font = `bold ${isUrgent ? '36px' : '30px'} sans-serif`;
      ctx.shadowColor = isUrgent ? '#ef4444' : '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fillText(`⏱️ ${Math.ceil(this.timeRemaining)}s`, this.width / 2, 20);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px sans-serif';
      ctx.fillText(`${this.mode.toUpperCase()} MODE`, this.width / 2, 58);
    }

    // Top Right: Classic Mode Lives (X Marks)
    if (this.mode === 'classic') {
      ctx.textAlign = 'right';
      for (let i = 0; i < this.maxLives; i++) {
        const isLost = i < this.misses;
        ctx.font = 'bold 28px sans-serif';
        ctx.fillStyle = isLost ? '#ef4444' : '#475569';
        ctx.shadowColor = isLost ? '#ef4444' : 'transparent';
        ctx.shadowBlur = isLost ? 8 : 0;
        ctx.fillText(isLost ? '❌' : '⚪', this.width - 24 - i * 36, 24);
      }
    }

    ctx.restore();
  }
}
