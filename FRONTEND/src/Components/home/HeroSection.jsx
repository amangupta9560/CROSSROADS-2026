import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Calendar,
  Compass,
  Cpu,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CountdownPanel from './CountdownPanel.jsx';
import FloatingParticles from './FloatingParticles.jsx';
import { TempleDivider } from './OrnamentDivider.jsx';

gsap.registerPlugin(ScrollTrigger);

const TempleScene = lazy(() => import('./TempleScene.jsx'));

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function HeroSection({ timeLeft, registrationOpen }) {
  const prefersReducedMotion = useReducedMotion();
  const [webGLOk, setWebGLOk] = useState(() => detectWebGL());
  const [viewportMode, setViewportMode] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    if (window.innerWidth < 768) return 'mobile';
    if (window.innerWidth < 1024) return 'tablet';
    return 'desktop';
  });

  const isDesktop = viewportMode === 'desktop';
  const isPhone = viewportMode === 'mobile';

  const pinSectionRef = useRef(null);
  const bgImageRef = useRef(null);
  const commandLayerRef = useRef(null);
  const prologueLayerRef = useRef(null);
  const watermarkRef = useRef(null);

  // Mobile/Tablet smooth GPU scroll-linked background depth (no pin trap on touch devices)
  const { scrollYProgress: mobileScroll } = useScroll({
    target: pinSectionRef,
    offset: ['start start', 'end start'],
  });
  const mobileImgScale = useTransform(mobileScroll, [0, 1], [1.05, 1.18]);
  const mobileContentY = useTransform(mobileScroll, [0, 1], [0, 42]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setViewportMode('mobile');
      else if (window.innerWidth < 1024) setViewportMode('tablet');
      else setViewportMode('desktop');
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop mouse-driven depth parallax
  useEffect(() => {
    if (prefersReducedMotion || !isDesktop) return undefined;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const onMove = (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * -16;
      targetY = (e.clientY / window.innerHeight - 0.5) * -10;
    };

    const tick = () => {
      rafId = window.requestAnimationFrame(tick);
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;

      if (bgImageRef.current) {
        bgImageRef.current.style.setProperty('--px', `${curX}px`);
        bgImageRef.current.style.setProperty('--py', `${curY}px`);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
    };
  }, [prefersReducedMotion, isDesktop]);

  // Desktop Pinned Two-Beat Scroll Choreography (Hero Command -> Lost Civilization Invocation)
  useEffect(() => {
    if (prefersReducedMotion || !isDesktop || !pinSectionRef.current) return undefined;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSectionRef.current,
          start: 'top top',
          end: '+=135%',
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
          refreshPriority: 4,
        },
      });

      if (bgImageRef.current) {
        tl.to(bgImageRef.current, { scale: 1.24, ease: 'none' }, 0);
      }

      if (commandLayerRef.current) {
        tl.to(
          commandLayerRef.current,
          { opacity: 0, y: -42, scale: 0.96, filter: 'blur(6px)', ease: 'power1.in' },
          0.12
        );
      }

      if (prologueLayerRef.current) {
        tl.fromTo(
          prologueLayerRef.current,
          { opacity: 0, y: 48, scale: 0.95, filter: 'blur(6px)' },
          { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', ease: 'power2.out' },
          0.32
        );
      }

      if (watermarkRef.current) {
        tl.fromTo(watermarkRef.current, { xPercent: 12 }, { xPercent: -14, ease: 'none' }, 0.25);
      }
    });

    return () => mm.revert();
  }, [prefersReducedMotion, isDesktop]);

  const skipToArenas = () => {
    const el = document.getElementById('arenas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Show WebGL 3D scene on tablet and desktop (phones stay 60fps with GPU particles + volumetric CSS beams)
  const show3D = webGLOk && !isPhone;

  return (
    <section
      id="hero"
      ref={pinSectionRef}
      aria-label="CROSSROADS 2027 Lost Civilization Hero"
      className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col justify-between bg-[#080D0B]"
    >
      {/* LAYER 0: Lost Civilization Jungle Temple Environment */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDesktop || prefersReducedMotion ? (
          <img
            ref={bgImageRef}
            src="/assets/lost-civilization/hero-temple.webp"
            alt="Ancient Lost Civilization Jungle Temple Entrance"
            style={{
              transform: 'translate3d(var(--px, 0px), var(--py, 0px), 0) scale(1.06)',
            }}
            className="w-full h-full object-cover object-center will-change-transform select-none"
            fetchPriority="high"
          />
        ) : (
          <Motion.img
            src="/assets/lost-civilization/hero-temple.webp"
            alt="Ancient Lost Civilization Jungle Temple Entrance"
            style={{ scale: mobileImgScale }}
            className="w-full h-full object-cover object-center will-change-transform select-none"
            fetchPriority="high"
          />
        )}

        {/* Warm Volumetric Sunbeams (works smoothly on both Mobile and Desktop) */}
        <div
          aria-hidden="true"
          className="lc-animate-sunbeam absolute -top-24 right-[8%] w-44 sm:w-72 h-[140%] bg-gradient-to-b from-[#F3DDA0]/20 via-[#C69B43]/8 to-transparent blur-xl origin-top"
        />

        {/* Pulsing Golden Sanctum Portal Light */}
        <div
          aria-hidden="true"
          className="lc-animate-glow absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[26rem] sm:w-[38rem] h-[22rem] sm:h-[28rem] rounded-full bg-[radial-gradient(circle,rgba(232,174,78,0.28)_0%,rgba(184,107,53,0.12)_45%,transparent_72%)] blur-2xl"
        />
      </div>

      {/* LAYER 1: Interactive React Three Fiber 3D Temple Pillars, Ruins & Floating Astrolabe */}
      {show3D && (
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <WebGLErrorBoundary onError={() => setWebGLOk(false)}>
            <Suspense fallback={null}>
              <TempleScene
                reducedMotion={!!prefersReducedMotion}
                isMobile={!isDesktop}
                onWebGLError={() => setWebGLOk(false)}
              />
            </Suspense>
          </WebGLErrorBoundary>
        </div>
      )}

      {/* LAYER 2: Atmospheric Mist & Cinematic Readability Scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] pointer-events-none bg-[radial-gradient(ellipse_at_50%_42%,rgba(8,13,11,0.34)_0%,rgba(8,13,11,0.72)_64%,rgba(8,13,11,0.96)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-b from-[#080D0B]/90 via-[#101D16]/25 to-[#080D0B]"
      />

      {/* LAYER 3: GPU Floating Fireflies & Ember Motes */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <FloatingParticles density={isPhone ? 'sparse' : 'normal'} />
      </div>

      {/* BEAT 1: IMMEDIATE HERO COMMAND SCREEN */}
      <Motion.div
        ref={commandLayerRef}
        style={!isDesktop && !prefersReducedMotion ? { y: mobileContentY } : undefined}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-8 flex-1 flex flex-col items-center justify-center text-center"
      >
        <Motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-sm bg-[#101D16]/85 border border-[#C69B43]/35 text-[#E8C574] text-[10px] sm:text-xs font-semibold tracking-[0.26em] uppercase mb-4 shadow-lg"
        >
          <Compass className="w-3.5 h-3.5 text-[#C69B43]" />
          <span>HIET GHAZIABAD PRESENTS</span>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-5 sm:mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/40 text-[#E8DFC8] text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase">
            <Calendar className="w-3.5 h-3.5 text-[#C69B43]" />
            <span>05–06 FEBRUARY 2027</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/40 text-[#E8DFC8] text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase">
            <MapPin className="w-3.5 h-3.5 text-[#B86B35]" />
            <span>HIET GHAZIABAD</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#182B20]/90 border border-[#C69B43]/55 text-[#F3DDA0] text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#E8C574] animate-pulse" />
            <span>REGISTRATIONS: JAN 10 – JAN 31, 2027</span>
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto mb-5"
        >
          <h1 className="lc-font-display text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-black tracking-[0.06em] leading-[1.03] drop-shadow-[0_12px_36px_rgba(0,0,0,0.92)]">
            <span className="lc-gold-text block sm:inline">CROSSROADS</span>{' '}
            <span className="text-[#E8DFC8]">2027</span>
          </h1>

          <p className="lc-font-heading mt-3 text-xs sm:text-lg md:text-xl tracking-[0.22em] sm:tracking-[0.26em] uppercase text-[#E8C574] font-bold drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            THE LOST CIVILIZATION AWAITS.
          </p>

          <TempleDivider className="my-3.5" />

          <p className="lc-font-heading text-[11px] sm:text-sm tracking-[0.2em] uppercase text-[#C69B43] font-semibold mb-2">
            BEYOND THE KNOWN. INTO THE UNKNOWN.
          </p>

          <p className="text-sm sm:text-base lg:text-lg text-[#E8DFC8]/90 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
            Where innovation meets adventure. Explore India&apos;s most exciting inter-college
            technical and cultural festival.
          </p>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto mb-7 text-[11px] sm:text-xs"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#101D16]/80 border border-[#C69B43]/25 text-[#E8DFC8]/90">
            <Trophy size={13} className="text-[#C69B43]" />
            <span>₹1,00,000+ Prize Pool</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#101D16]/80 border border-[#C69B43]/25 text-[#E8DFC8]/90">
            <Cpu size={13} className="text-[#E8C574]" />
            <span>11 Flagship Competitions</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#101D16]/80 border border-[#C69B43]/25 text-[#E8DFC8]/90">
            <ShieldCheck size={13} className="text-[#C69B43]" />
            <span>Verifiable Certificates</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#101D16]/80 border border-[#C69B43]/25 text-[#E8DFC8]/90">
            <Users size={13} className="text-[#B86B35]" />
            <span>50+ Colleges Competing</span>
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 w-full max-w-xl mx-auto mb-8"
        >
          {registrationOpen ? (
            <Link
              to="/register"
              className="lc-gold-btn lc-font-heading flex-1 px-7 py-4 rounded-sm font-extrabold text-xs sm:text-sm tracking-[0.18em] uppercase inline-flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <Sparkles size={16} className="text-[#080D0B] shrink-0" />
              <span>ENTER THE LOST WORLD</span>
              <ArrowRight
                size={16}
                className="text-[#080D0B] shrink-0 group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          ) : (
            <Link
              to="/events"
              className="lc-stone-btn lc-font-heading flex-1 px-7 py-4 rounded-sm font-bold text-xs sm:text-sm tracking-[0.15em] uppercase inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Registrations Paused • View Events</span>
            </Link>
          )}

          <Link
            to="/events"
            className="lc-stone-btn lc-font-heading px-7 py-4 rounded-sm font-bold text-xs sm:text-sm tracking-[0.18em] uppercase inline-flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Trophy size={16} className="text-[#C69B43] shrink-0" />
            <span>EXPLORE THE ARENAS</span>
          </Link>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <CountdownPanel timeLeft={timeLeft} />
        </Motion.div>
      </Motion.div>

      {/* BEAT 2 (Desktop Pinned Scrub Reveal): Temple Invocation & Watermark Curtain */}
      {isDesktop && !prefersReducedMotion && (
        <div
          ref={prologueLayerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center opacity-0"
        >
          <div
            ref={watermarkRef}
            className="lc-watermark-text text-[12vw] leading-none whitespace-nowrap font-black uppercase mb-2"
          >
            LOST CIVILIZATION
          </div>

          <div className="max-w-3xl -mt-12 relative">
            <span className="inline-block px-4 py-1.5 rounded-sm bg-[#080D0B]/90 border border-[#C69B43]/45 text-[#E8C574] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
              — ANCIENT INVOCATION // SEC-01
            </span>
            <h2 className="lc-font-display text-5xl lg:text-6xl font-black text-[#E8DFC8] leading-tight drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)]">
              BEYOND THE KNOWN. <span className="lc-gold-text">INTO THE UNKNOWN.</span>
            </h2>
            <p className="mt-4 text-lg text-[#E8DFC8]/90 max-w-xl mx-auto">
              One destination. Infinite possibilities. An adventure beyond imagination.
            </p>
          </div>
        </div>
      )}

      {/* Bottom Scroll Indicator + Quick Skip Pill */}
      <div className="relative z-20 pb-12 sm:pb-6 pt-1 px-4 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="lc-font-heading text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[#E8C574]/90 font-semibold mb-2">
            SCROLL TO BEGIN YOUR JOURNEY
          </span>
          <div
            aria-hidden="true"
            className="w-5 h-8 rounded-full border border-[#C69B43]/55 flex items-start justify-center p-1"
          >
            <Motion.span
              animate={prefersReducedMotion ? undefined : { y: [0, 11, 0], opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 rounded-full bg-[#E8C574]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={skipToArenas}
          className="hidden lg:inline-flex items-center gap-1.5 absolute right-6 bottom-5 px-3.5 py-2 rounded-sm bg-[#080D0B]/85 border border-[#C69B43]/40 hover:border-[#E8C574] text-[#E8C574] text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer"
        >
          <span>SKIP PROLOGUE</span>
          <ArrowDown size={12} className="text-[#C69B43]" />
        </button>
      </div>
    </section>
  );
}
