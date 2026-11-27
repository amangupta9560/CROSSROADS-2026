import { useEffect, useRef } from 'react';

/**
 * Lightweight 2D Canvas firefly & golden dust particle overlay.
 * Automatically disables motion when prefers-reduced-motion is active
 * and throttles particle count on mobile viewports.
 */
export default function FloatingParticles({ density = 'normal', className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let animationId = 0;
    let width = 0;
    let height = 0;

    const isMobile = window.innerWidth < 768;
    const baseCount = density === 'dense' ? 42 : density === 'sparse' ? 16 : 26;
    const count = isMobile ? Math.max(10, Math.floor(baseCount * 0.45)) : baseCount;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.1 + Math.random() * 2.1,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -0.15 - Math.random() * 0.35,
      alpha: 0.25 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
      amber: Math.random() > 0.3,
    }));

    let visible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const draw = (time) => {
      animationId = window.requestAnimationFrame(draw);
      if (!visible || width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx + Math.sin(time * 0.0008 + p.phase) * 0.14;
        p.y += p.vy;

        if (p.y < -12) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -12) p.x = width + 10;
        if (p.x > width + 12) p.x = -10;

        const twinkle = 0.55 + 0.45 * Math.sin(time * 0.002 + p.phase);
        const finalAlpha = p.alpha * twinkle;

        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.4);
        if (p.amber) {
          grad.addColorStop(0, `rgba(243, 212, 130, ${finalAlpha})`);
          grad.addColorStop(0.4, `rgba(198, 155, 67, ${finalAlpha * 0.55})`);
          grad.addColorStop(1, 'rgba(198, 155, 67, 0)');
        } else {
          grad.addColorStop(0, `rgba(216, 128, 62, ${finalAlpha})`);
          grad.addColorStop(0.45, `rgba(184, 107, 53, ${finalAlpha * 0.45})`);
          grad.addColorStop(1, 'rgba(184, 107, 53, 0)');
        }
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.r * 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animationId = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
}
