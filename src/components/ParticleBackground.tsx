import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { currentTheme, mode } = useTheme();
  const { primary, secondary, particleStyle, bgPrimary } = currentTheme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const isLight = mode === 'light';
    const isOled = mode === 'oled';

    // Parse primary RGB
    const primaryColors = currentTheme.particleColors && currentTheme.particleColors.length > 0
      ? currentTheme.particleColors
      : [primary, secondary, '#38bdf8', '#8a2be2'];

    // Mouse tracker
    const mouse = { x: -1000, y: -1000, radius: 140 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // ==========================================
    // 1. MESH PARTICLES SETUP
    // ==========================================
    const meshParticleCount = Math.min(Math.floor((width * height) / 16000), 80);
    const meshParticles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    if (particleStyle === 'mesh') {
      for (let i = 0; i < meshParticleCount; i++) {
        meshParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          size: Math.random() * 2.2 + 1,
          alpha: Math.random() * 0.45 + (isLight ? 0.35 : 0.2),
          color: primaryColors[Math.floor(Math.random() * primaryColors.length)]
        });
      }
    }

    // ==========================================
    // 2. MATRIX RAIN SETUP
    // ==========================================
    const matrixChars = '010101XYZCLOUDDEVAWSREACTPYTHON<>/{}=+*~#';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];
    if (particleStyle === 'matrix') {
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -height / fontSize);
      }
    }

    // ==========================================
    // 3. STARFIELD SETUP
    // ==========================================
    const starCount = Math.min(Math.floor((width * height) / 10000), 120);
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      brightness: number;
      blinkSpeed: number;
      color: string;
    }> = [];
    if (particleStyle === 'starfield') {
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.5,
          brightness: Math.random(),
          blinkSpeed: Math.random() * 0.02 + 0.005,
          color: primaryColors[Math.floor(Math.random() * primaryColors.length)]
        });
      }
    }

    // ==========================================
    // 4. FLOATING ORBS SETUP
    // ==========================================
    const orbCount = 14;
    const orbs: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
    }> = [];
    if (particleStyle === 'orbs') {
      for (let i = 0; i < orbCount; i++) {
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 60 + 30,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          color: primaryColors[i % primaryColors.length],
          alpha: isLight ? 0.08 : 0.07
        });
      }
    }

    // ==========================================
    // MAIN RENDER LOOP
    // ==========================================
    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric grid
      ctx.strokeStyle = isLight 
        ? 'rgba(0, 0, 0, 0.025)' 
        : isOled 
          ? 'rgba(255, 255, 255, 0.015)' 
          : 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 64;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // --- MESH STYLE ---
      if (particleStyle === 'mesh') {
        for (let i = 0; i < meshParticles.length; i++) {
          const p = meshParticles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Mouse interaction
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 2.2;
            p.y -= (dy / dist) * force * 2.2;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Connect nearby particles
          for (let j = i + 1; j < meshParticles.length; j++) {
            const p2 = meshParticles[j];
            const distBetween = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (distBetween < 120) {
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = (1 - distBetween / 120) * (isLight ? 0.16 : 0.14);
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // --- MATRIX STYLE ---
      else if (particleStyle === 'matrix') {
        ctx.font = `${fontSize}px monospace`;
        for (let i = 0; i < drops.length; i++) {
          const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Gradient color: head is white/bright, tail is theme primary
          ctx.fillStyle = primary;
          ctx.globalAlpha = 0.22;
          ctx.fillText(char, x, y);

          if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          if (frameCount % 2 === 0) {
            drops[i]++;
          }
        }
      }

      // --- STARFIELD STYLE ---
      else if (particleStyle === 'starfield') {
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          s.brightness += s.blinkSpeed;
          const currentAlpha = Math.abs(Math.sin(s.brightness)) * 0.7 + 0.2;

          ctx.fillStyle = s.color;
          ctx.globalAlpha = isLight ? currentAlpha * 0.5 : currentAlpha;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- FLOATING ORBS STYLE ---
      else if (particleStyle === 'orbs') {
        for (let i = 0; i < orbs.length; i++) {
          const orb = orbs[i];
          orb.x += orb.vx;
          orb.y += orb.vy;

          if (orb.x < -orb.radius) orb.x = width + orb.radius;
          if (orb.x > width + orb.radius) orb.x = -orb.radius;
          if (orb.y < -orb.radius) orb.y = height + orb.radius;
          if (orb.y > height + orb.radius) orb.y = -orb.radius;

          const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
          grad.addColorStop(0, orb.color);
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.globalAlpha = orb.alpha;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [primary, secondary, particleStyle, bgPrimary, mode, currentTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
