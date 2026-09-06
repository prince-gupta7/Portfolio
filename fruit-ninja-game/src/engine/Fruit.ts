import type { FruitConfig, FruitType, JuiceSplatter, Particle, SliceHalf, Velocity } from './types';

export const FRUIT_CONFIGS: Record<FruitType, FruitConfig> = {
  watermelon: {
    type: 'watermelon',
    radius: 46,
    color: '#15803d', // Rind dark green
    innerColor: '#ef4444', // Juicy red
    rindColor: '#86efac', // Pale green layer
    seedColor: '#1e293b',
    points: 1,
  },
  orange: {
    type: 'orange',
    radius: 38,
    color: '#f97316', // Orange peel
    innerColor: '#fb923c', // Juicy orange
    rindColor: '#ffedd5', // White pith
    seedColor: '#fef08a',
    points: 1,
  },
  apple: {
    type: 'apple',
    radius: 36,
    color: '#dc2626', // Glossy red
    innerColor: '#fef08a', // Creamy apple flesh
    rindColor: '#fee2e2',
    seedColor: '#451a03',
    points: 1,
  },
  banana: {
    type: 'banana',
    radius: 34,
    color: '#eab308', // Yellow peel
    innerColor: '#fef9c3', // Banana pulp
    rindColor: '#ca8a04',
    seedColor: '#854d0e',
    points: 1,
  },
  strawberry: {
    type: 'strawberry',
    radius: 30,
    color: '#e11d48', // Ruby red
    innerColor: '#fb7185',
    rindColor: '#22c55e', // Green leaf crown
    seedColor: '#fef08a',
    points: 2,
  },
  pineapple: {
    type: 'pineapple',
    radius: 44,
    color: '#ca8a04', // Golden brown rind
    innerColor: '#fde047', // Yellow core
    rindColor: '#15803d', // Spiky leaves
    seedColor: '#854d0e',
    points: 2,
  },
  coconut: {
    type: 'coconut',
    radius: 40,
    color: '#573315', // Brown husk
    innerColor: '#ffffff', // White coconut meat
    rindColor: '#3a210d',
    seedColor: '#38bdf8', // Coconut water shine
    points: 2,
  },
  dragonfruit: {
    type: 'dragonfruit',
    radius: 42,
    color: '#ec4899', // Bright magenta
    innerColor: '#f8fafc', // White with black seeds
    rindColor: '#22c55e', // Green tipped spikes
    seedColor: '#0f172a',
    points: 3,
    isSpecial: true,
    specialType: 'frenzy',
  },
  freeze_banana: {
    type: 'freeze_banana',
    radius: 36,
    color: '#06b6d4', // Icy cyan
    innerColor: '#cffafe', // Frost white-blue
    rindColor: '#e0f2fe',
    seedColor: '#38bdf8',
    points: 3,
    isSpecial: true,
    specialType: 'freeze',
  },
  starfruit: {
    type: 'starfruit',
    radius: 38,
    color: '#eab308', // Radiant gold
    innerColor: '#fef08a',
    rindColor: '#84cc16',
    seedColor: '#ffffff',
    points: 3,
    isSpecial: true,
    specialType: 'double',
  },
  bomb: {
    type: 'bomb',
    radius: 36,
    color: '#0f172a', // Spiked dark iron
    innerColor: '#ef4444',
    rindColor: '#475569',
    points: 0,
    isBomb: true,
  },
  pomegranate: {
    type: 'pomegranate',
    radius: 46,
    color: '#9f1239', // Deep crimson
    innerColor: '#f43f5e', // Ruby jewel arils
    rindColor: '#fda4af',
    seedColor: '#ffe4e6',
    points: 1,
    isSpecial: true,
    specialType: 'pomegranate',
  },
};

export class Fruit {
  public id: string;
  public type: FruitType;
  public config: FruitConfig;
  public x: number;
  public y: number;
  public radius: number;
  public velocity: Velocity;
  public rotation: number = 0;
  public isSliced: boolean = false;
  public isOffScreen: boolean = false;
  public gravity: number = 0.38;
  public fuseSparkTimer: number = 0;
  public hitsRequired: number = 1;
  public hitCount: number = 0;

  constructor(
    id: string,
    type: FruitType,
    startX: number,
    startY: number,
    vx: number,
    vy: number,
    vRot: number
  ) {
    this.id = id;
    this.type = type;
    this.config = FRUIT_CONFIGS[type];
    this.x = startX;
    this.y = startY;
    this.radius = this.config.radius;
    this.velocity = { vx, vy, vRot };
    this.rotation = Math.random() * Math.PI * 2;

    if (type === 'pomegranate') {
      this.hitsRequired = 18; // Multi-hit frenzy
    }
  }

  /**
   * Physics update step
   */
  public update(timeScale: number = 1.0, screenHeight: number = 800) {
    if (this.isSliced && this.type !== 'pomegranate') return;

    this.x += this.velocity.vx * timeScale;
    this.y += this.velocity.vy * timeScale;
    this.velocity.vy += this.gravity * timeScale;
    this.rotation += this.velocity.vRot * timeScale;

    if (this.config.isBomb) {
      this.fuseSparkTimer += 0.2 * timeScale;
    }

    // Check if fallen below screen
    if (this.velocity.vy > 0 && this.y - this.radius > screenHeight + 50) {
      this.isOffScreen = true;
    }
  }

  /**
   * Split fruit into two halves and generate splatter particles
   */
  public slice(
    sliceAngle: number,
    sliceSpeed: number
  ): { halves: SliceHalf[]; particles: Particle[]; splatter: JuiceSplatter | null } {
    this.isSliced = true;

    // Slicing normal vector (perpendicular to cut)
    const normalX = Math.cos(sliceAngle + Math.PI / 2);
    const normalY = Math.sin(sliceAngle + Math.PI / 2);
    const pushForce = Math.min(Math.max(sliceSpeed / 120, 4.5), 10);

    const half1: SliceHalf = {
      type: this.type,
      x: this.x,
      y: this.y,
      vx: this.velocity.vx + normalX * pushForce,
      vy: this.velocity.vy + normalY * pushForce - 1.5,
      rotation: this.rotation,
      vRot: this.velocity.vRot - 0.08,
      sliceAngle,
      radius: this.radius,
      color: this.config.color,
      innerColor: this.config.innerColor,
      rindColor: this.config.rindColor,
      seedColor: this.config.seedColor,
      side: 1,
      alpha: 1.0,
      isSpecial: this.config.isSpecial,
    };

    const half2: SliceHalf = {
      type: this.type,
      x: this.x,
      y: this.y,
      vx: this.velocity.vx - normalX * pushForce,
      vy: this.velocity.vy - normalY * pushForce - 1.5,
      rotation: this.rotation,
      vRot: this.velocity.vRot + 0.08,
      sliceAngle,
      radius: this.radius,
      color: this.config.color,
      innerColor: this.config.innerColor,
      rindColor: this.config.rindColor,
      seedColor: this.config.seedColor,
      side: -1,
      alpha: 1.0,
      isSpecial: this.config.isSpecial,
    };

    // Particle splash explosion
    const particles: Particle[] = [];
    const particleCount = this.config.isSpecial ? 35 : 22;

    for (let i = 0; i < particleCount; i++) {
      const angle = sliceAngle + (Math.random() - 0.5) * Math.PI * 1.5;
      const speed = Math.random() * 8 + 3;
      const color =
        Math.random() > 0.4
          ? this.config.innerColor
          : Math.random() > 0.5
          ? this.config.color
          : this.config.seedColor || '#ffffff';

      particles.push({
        x: this.x + (Math.random() * 12 - 6),
        y: this.y + (Math.random() * 12 - 6),
        vx: Math.cos(angle) * speed + this.velocity.vx * 0.4,
        vy: Math.sin(angle) * speed + this.velocity.vy * 0.4 - 2,
        color,
        radius: Math.random() * 4 + 2,
        alpha: 1.0,
        decay: 0.02 + Math.random() * 0.025,
        gravity: 0.28,
        shape: Math.random() > 0.3 ? 'droplet' : 'seed',
      });
    }

    // Background juice splatter stain
    let splatter: JuiceSplatter | null = null;
    if (!this.config.isBomb) {
      const dropCount = Math.floor(Math.random() * 8) + 6;
      const drops = [];
      for (let d = 0; d < dropCount; d++) {
        drops.push({
          dx: (Math.random() - 0.5) * 80,
          dy: (Math.random() - 0.5) * 80 + Math.random() * 20, // drip down
          r: Math.random() * 14 + 4,
        });
      }

      splatter = {
        x: this.x,
        y: this.y,
        radius: this.radius * 1.4,
        color: this.config.innerColor,
        alpha: 0.45,
        drops,
        life: 0,
        maxLife: 420, // persists ~7 seconds
      };
    }

    return { halves: [half1, half2], particles, splatter };
  }

  /**
   * Render intact fruit / bomb onto canvas
   */
  public draw(ctx: CanvasRenderingContext2D) {
    if (this.isSliced && this.type !== 'pomegranate') return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.config.isBomb) {
      this.drawBomb(ctx);
    } else {
      this.drawFruitBody(ctx);
    }

    ctx.restore();
  }

  /**
   * Draw Bomb with spiked body, warning glow, and sizzling fuse sparks
   */
  private drawBomb(ctx: CanvasRenderingContext2D) {
    const r = this.radius;

    // Glowing red pulse shadow
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 18 + Math.sin(this.fuseSparkTimer * 4) * 8;

    // Spiked outer iron body
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Spikes
    ctx.fillStyle = '#334155';
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const sx = Math.cos(angle) * (r + 7);
      const sy = Math.sin(angle) * (r + 7);
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Metallic highlight sheen
    const grad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, 2, -r * 0.2, -r * 0.2, r * 0.9);
    grad.addColorStop(0, '#94a3b8');
    grad.addColorStop(0.4, '#334155');
    grad.addColorStop(1, '#090d16');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r - 3, 0, Math.PI * 2);
    ctx.fill();

    // Danger skull / cross mark in center
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☠', 0, 1);

    // Bomb Fuse Top Cap
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-6, -r - 6, 12, 7);

    // Wavy burning fuse rope
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -r - 6);
    ctx.quadraticCurveTo(8, -r - 16, 2, -r - 24);
    ctx.stroke();

    // Sizzling orange-yellow spark ember at fuse tip
    const tipX = 2;
    const tipY = -r - 24;
    const sparkRadius = 6 + Math.sin(this.fuseSparkTimer * 8) * 3;

    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(tipX, tipY, sparkRadius, 0, Math.PI * 2);
    ctx.fill();

    // Emitted tiny spark rays
    for (let s = 0; s < 4; s++) {
      const sAngle = (this.fuseSparkTimer * 5 + (s * Math.PI) / 2) % (Math.PI * 2);
      const dist = 8 + Math.random() * 6;
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(tipX + Math.cos(sAngle) * dist, tipY + Math.sin(sAngle) * dist, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * Draw individual fruit graphic with 3D sheen, textures, and details
   */
  private drawFruitBody(ctx: CanvasRenderingContext2D) {
    const r = this.radius;

    // Special aura if powerup
    if (this.config.isSpecial) {
      ctx.shadowBlur = 24;
      ctx.shadowColor =
        this.config.specialType === 'freeze'
          ? '#38bdf8'
          : this.config.specialType === 'frenzy'
          ? '#f43f5e'
          : '#eab308';
    } else {
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
    }

    switch (this.type) {
      case 'watermelon': {
        // Outer dark green rind
        ctx.fillStyle = this.config.color;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Dark green wavy stripes
        ctx.strokeStyle = '#052e16';
        ctx.lineWidth = 4.5;
        for (let a = 0; a < 6; a++) {
          const angle = (a * Math.PI) / 3;
          ctx.beginPath();
          ctx.arc(0, 0, r - 2, angle - 0.25, angle + 0.25);
          ctx.stroke();
        }

        // Gloss highlight
        this.drawGlossHighlight(ctx, r);
        break;
      }

      case 'orange': {
        // Orange peel
        const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 4, 0, 0, r);
        grad.addColorStop(0, '#fdba74');
        grad.addColorStop(0.7, '#f97316');
        grad.addColorStop(1, '#c2410c');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Little green stem leaf
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.ellipse(0, -r + 2, 4, 2.5, 0.4, 0, Math.PI * 2);
        ctx.fill();

        this.drawGlossHighlight(ctx, r);
        break;
      }

      case 'apple': {
        // Apple shape
        const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, 4, 0, 0, r);
        grad.addColorStop(0, '#f87171');
        grad.addColorStop(0.6, '#dc2626');
        grad.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = grad;
        
        ctx.beginPath();
        ctx.moveTo(0, -r + 6);
        ctx.bezierCurveTo(r, -r + 4, r + 4, r - 6, 0, r);
        ctx.bezierCurveTo(-r - 4, r - 6, -r, -r + 4, 0, -r + 6);
        ctx.fill();

        // Brown stem & leaf
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -r + 6);
        ctx.quadraticCurveTo(4, -r - 6, 8, -r - 10);
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.ellipse(8, -r - 8, 6, 3, 0.3, 0, Math.PI * 2);
        ctx.fill();

        this.drawGlossHighlight(ctx, r);
        break;
      }

      case 'banana':
      case 'freeze_banana': {
        const isFreeze = this.type === 'freeze_banana';
        ctx.fillStyle = isFreeze ? '#06b6d4' : '#eab308';

        // Curved banana body
        ctx.beginPath();
        ctx.moveTo(-r * 0.9, -r * 0.4);
        ctx.quadraticCurveTo(0, r * 0.8, r * 0.9, -r * 0.2);
        ctx.quadraticCurveTo(0, r * 0.3, -r * 0.9, -r * 0.4);
        ctx.fill();

        // Tips
        ctx.fillStyle = isFreeze ? '#e0f2fe' : '#713f12';
        ctx.beginPath();
        ctx.arc(-r * 0.9, -r * 0.4, 3, 0, Math.PI * 2);
        ctx.arc(r * 0.9, -r * 0.2, 3, 0, Math.PI * 2);
        ctx.fill();

        if (isFreeze) {
          // Snowflake crystals overlay
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('❄', 0, 0);
        }
        break;
      }

      case 'strawberry': {
        // Strawberry heart/cone shape
        const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 2, 0, 0, r);
        grad.addColorStop(0, '#f43f5e');
        grad.addColorStop(0.7, '#e11d48');
        grad.addColorStop(1, '#881337');
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(0, r);
        ctx.bezierCurveTo(r * 1.1, 0, r * 0.8, -r * 0.8, 0, -r * 0.7);
        ctx.bezierCurveTo(-r * 0.8, -r * 0.7, -r * 1.1, 0, 0, r);
        ctx.fill();

        // Yellow seed dots
        ctx.fillStyle = '#fef08a';
        for (let y = -r * 0.4; y < r * 0.7; y += 9) {
          for (let x = -r * 0.5; x < r * 0.5; x += 10) {
            if (Math.hypot(x, y) < r * 0.7) {
              ctx.beginPath();
              ctx.arc(x + (Math.sin(y) * 2), y, 1.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Green leaves on top
        ctx.fillStyle = '#22c55e';
        for (let l = 0; l < 5; l++) {
          const lAngle = -Math.PI / 2 + ((l - 2) * Math.PI) / 6;
          ctx.beginPath();
          ctx.ellipse(Math.cos(lAngle) * 8, -r * 0.7 + Math.sin(lAngle) * 6, 7, 3, lAngle, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'pineapple': {
        // Pineapple body
        const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 4, 0, 0, r);
        grad.addColorStop(0, '#eab308');
        grad.addColorStop(0.8, '#a16207');
        grad.addColorStop(1, '#713f12');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 4, r * 0.85, r * 1.05, 0, 0, Math.PI * 2);
        ctx.fill();

        // Crosshatch diamond rind lines
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 1.5;
        for (let d = -r; d < r; d += 12) {
          ctx.beginPath();
          ctx.moveTo(d, -r * 0.8);
          ctx.lineTo(d + r * 0.6, r * 0.8);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(d + r * 0.6, -r * 0.8);
          ctx.lineTo(d, r * 0.8);
          ctx.stroke();
        }

        // Spiky crown leaves on top
        ctx.fillStyle = '#16a34a';
        for (let leaf = -3; leaf <= 3; leaf++) {
          ctx.beginPath();
          ctx.moveTo(leaf * 4, -r * 0.8);
          ctx.lineTo(leaf * 8, -r * 1.35);
          ctx.lineTo(leaf * 4 + 3, -r * 0.8);
          ctx.fill();
        }
        break;
      }

      case 'coconut': {
        // Brown fibrous shell
        const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 4, 0, 0, r);
        grad.addColorStop(0, '#78350f');
        grad.addColorStop(0.7, '#451a03');
        grad.addColorStop(1, '#270f03');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Three coconut eye indents
        ctx.fillStyle = '#1c0a00';
        ctx.beginPath();
        ctx.arc(-8, -8, 3.5, 0, Math.PI * 2);
        ctx.arc(8, -8, 3.5, 0, Math.PI * 2);
        ctx.arc(0, 4, 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'dragonfruit': {
        // Bright magenta with green flame tipped scales
        const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 4, 0, 0, r);
        grad.addColorStop(0, '#f472b6');
        grad.addColorStop(0.7, '#db2777');
        grad.addColorStop(1, '#831843');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.85, r * 1.05, 0, 0, Math.PI * 2);
        ctx.fill();

        // Green-tipped spikes
        for (let s = 0; s < 8; s++) {
          const sAngle = (s * Math.PI) / 4;
          const sx = Math.cos(sAngle) * (r * 0.85);
          const sy = Math.sin(sAngle) * (r * 1.05);

          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + Math.cos(sAngle) * 12, sy + Math.sin(sAngle) * 12);
          ctx.lineTo(sx - Math.sin(sAngle) * 6, sy + Math.cos(sAngle) * 6);
          ctx.fill();
        }

        // Dragon icon in center
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡', 0, 0);
        break;
      }

      case 'starfruit': {
        // Five pointed star fruit
        ctx.fillStyle = '#facc15';
        this.drawStarPath(ctx, 0, 0, 5, r * 1.1, r * 0.55);
        ctx.fill();

        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2.5;
        this.drawStarPath(ctx, 0, 0, 5, r * 0.9, r * 0.45);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('2X', 0, 0);
        break;
      }

      case 'pomegranate': {
        // Deep ruby jewel
        const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 4, 0, 0, r);
        grad.addColorStop(0, '#f43f5e');
        grad.addColorStop(0.7, '#be123c');
        grad.addColorStop(1, '#4c0519');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Crown top
        ctx.fillStyle = '#881337';
        for (let c = -2; c <= 2; c++) {
          ctx.beginPath();
          ctx.moveTo(c * 6, -r);
          ctx.lineTo(c * 9, -r - 8);
          ctx.lineTo(c * 6 + 4, -r);
          ctx.fill();
        }

        // Hit counter remaining
        const remaining = this.hitsRequired - this.hitCount;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${remaining}`, 0, 0);
        break;
      }
    }
  }

  private drawStarPath(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerR: number,
    innerR: number
  ) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerR;
      y = cy + Math.sin(rot) * outerR;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerR;
      y = cy + Math.sin(rot) * innerR;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
  }

  private drawGlossHighlight(ctx: CanvasRenderingContext2D, r: number) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.35, -r * 0.35, r * 0.28, r * 0.16, -0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Helper to draw a sliced half spinning in mid-air
   */
  public static drawHalf(ctx: CanvasRenderingContext2D, half: SliceHalf) {
    ctx.save();
    ctx.translate(half.x, half.y);
    ctx.rotate(half.rotation);
    ctx.globalAlpha = Math.max(0, half.alpha);

    const r = half.radius;

    // Semi-circle half path oriented along slice angle
    ctx.rotate(half.sliceAngle);

    ctx.beginPath();
    if (half.side === 1) {
      // Right / Top half
      ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
      ctx.closePath();
    } else {
      // Left / Bottom half
      ctx.arc(0, 0, r, Math.PI / 2, (3 * Math.PI) / 2, false);
      ctx.closePath();
    }

    // Outer rind skin
    ctx.fillStyle = half.color;
    ctx.fill();

    // Inner exposed juicy fruit cross-section
    ctx.beginPath();
    if (half.side === 1) {
      ctx.arc(0, 0, r - 4, -Math.PI / 2, Math.PI / 2, false);
    } else {
      ctx.arc(0, 0, r - 4, Math.PI / 2, (3 * Math.PI) / 2, false);
    }
    ctx.closePath();
    ctx.fillStyle = half.innerColor;
    ctx.fill();

    // Seeds / Core details on exposed slice face
    if (half.seedColor) {
      ctx.fillStyle = half.seedColor;
      const seedCount = half.type === 'watermelon' ? 4 : 2;
      for (let s = 0; s < seedCount; s++) {
        const offset = (s - seedCount / 2 + 0.5) * 12;
        const seedX = half.side === 1 ? r * 0.35 : -r * 0.35;
        ctx.beginPath();
        ctx.ellipse(seedX, offset, 2.5, 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Slice cut glow edge
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(0, r);
    ctx.stroke();

    ctx.restore();
  }
}
