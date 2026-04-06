import React, { useEffect, useRef } from 'react';

type ParticleBackgroundProps = {
  isDark: boolean;
  styleName: string;
};

interface ParticleFlyweight {
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void;
}

class IconParticleFlyweight implements ParticleFlyweight {
  constructor(
    private readonly symbol: string,
    private readonly color: string,
    private readonly font: string = 'monospace',
  ) {}

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.font = `${size}px ${this.font}`;
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.6;
    ctx.fillText(this.symbol, x, y);
    ctx.globalAlpha = 1.0;
  }
}

class ParticleFactory {
  private flyweights: Map<string, ParticleFlyweight> = new Map();

  getFlyweight(key: string, symbol: string, color: string, font: string = 'monospace'): ParticleFlyweight {
    const uniqueKey = `${key}-${color}-${font}`;
    if (!this.flyweights.has(uniqueKey)) {
      this.flyweights.set(uniqueKey, new IconParticleFlyweight(symbol, color, font));
    }
    return this.flyweights.get(uniqueKey)!;
  }
}

class ParticleContext {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  flyweight: ParticleFlyweight;

  constructor(w: number, h: number, factory: ParticleFactory, styleName: string, isDark: boolean) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 20 + 10;

    let colors = ['#61dafb', '#facc15', '#3178c6', '#10b981', '#a8a29e'];
    let symbols = ['⚛', '</>', 'TS', '⎔', '☁'];
    let font = 'monospace';

    if (styleName === 'Minimal') {
      colors = isDark ? ['#ffffff', '#aaaaaa', '#888888'] : ['#000000', '#333333', '#555555'];
      symbols = ['●', '■', '▲', '○', '□'];
      font = 'sans-serif';
    } else if (styleName === 'Future') {
      colors = ['#00f3ff', '#bc13fe', '#00ff9d', '#ff0055', '#eab308'];
      symbols = ['⚡', '⌬', '⏣', '◈', '⟁'];
    } else if (styleName === 'Academic') {
      colors = isDark ? ['#d4af37', '#c0c0c0', '#cd7f32'] : ['#8b1e3f', '#3c3c3c', '#555555'];
      symbols = ['¶', '§', '†', '‡', '∞'];
      font = 'serif';
    }

    const type = Math.floor(Math.random() * symbols.length);
    const color = colors[type % colors.length];
    const symbol = symbols[type];
    this.flyweight = factory.getFlyweight(`${styleName}-${type}`, symbol, color, font);
  }

  update(w: number, h: number) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.flyweight.draw(ctx, this.x, this.y, this.size);
  }
}

export function ParticleBackground({ isDark, styleName }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const factory = new ParticleFactory();
    const particles: ParticleContext[] = [];
    const particleCount = 100;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < particleCount; i++) {
      particles.push(new ParticleContext(canvas.width, canvas.height, factory, styleName, isDark));
    }

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, styleName]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-30" />;
}
