import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Calendar, Clock, Compass, Sparkles } from 'lucide-react';
import FloatingParticles from '../home/FloatingParticles.jsx';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';
import { AncientSunDisc, JungleFoliageLeft, JungleFoliageRight } from '../about/JungleCanopyVectors.jsx';
import GhostTypeText from '../about/GhostTypeText.jsx';

const EventsRelicBackdrop = lazy(() => import('./EventsRelicBackdrop.jsx'));

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

function checkWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

export default function EventsHero({ timeLeft }) {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef(null);
  const [webGLOk, setWebGLOk] = useState(() => checkWebGL());
  const [isPhone, setIsPhone] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsPhone(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.24]);
  const foliageY = useTransform(scrollYProgress, [0, 1], [0, -85]);
  const discRotate = useTransform(scrollYProgress, [0, 1], [0, 75]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 58]);

  const countdownUnits = [
    { value: timeLeft.days, label: 'Days', glyph: 'I' },
    { value: timeLeft.hours, label: 'Hours', glyph: 'II' },
    { value: timeLeft.minutes, label: 'Minutes', glyph: 'III' },
    { value: timeLeft.seconds, label: 'Seconds', glyph: 'IV' },
  ];

  const show3D = webGLOk && !isPhone;

  return (
    <section
      ref={heroRef}
      aria-label="CROSSROADS 2027 Official Arenas Header"
      className="relative min-h-[94dvh] w-full overflow-hidden flex flex-col justify-center bg-[#080D0B] pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Parallax Lost Civilization Backdrop */}
      <Motion.div
        style={!prefersReducedMotion ? { scale: bgScale } : undefined}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <img
          src="/assets/lost-civilization/hero-temple.webp"
          alt="CROSSROADS 2027 Temple Arenas Backdrop"
          className="w-full h-full object-cover object-center opacity-50 will-change-transform select-none"
          fetchPriority="high"
        />
        <div
          aria-hidden="true"
          className="lc-animate-sunbeam absolute -top-24 right-[10%] w-48 sm:w-72 h-[140%] bg-gradient-to-b from-[#F3DDA0]/22 via-[#C69B43]/9 to-transparent blur-xl origin-top"
        />
      </Motion.div>

      {/* Scroll-Rotating Carved Sun Disc */}
      <Motion.div
        aria-hidden="true"
        style={!prefersReducedMotion ? { rotate: discRotate } : undefined}
        className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[30rem] sm:w-[44rem] opacity-[0.07] z-[1]"
      >
        <AncientSunDisc className="w-full h-auto" />
      </Motion.div>

      {/* Interactive 3D Floating Astrolabe Relics & Stone Pillars (Tablet + Desktop) */}
      {show3D && (
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <WebGLErrorBoundary onError={() => setWebGLOk(false)}>
            <Suspense fallback={null}>
              <EventsRelicBackdrop
                reducedMotion={!!prefersReducedMotion}
                onWebGLError={() => setWebGLOk(false)}
              />
            </Suspense>
          </WebGLErrorBoundary>
        </div>
      )}

      <Motion.div
        style={!prefersReducedMotion ? { y: foliageY } : undefined}
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-36 sm:w-56 lg:w-72 opacity-80 pointer-events-none z-[2]"
      >
        <JungleFoliageLeft className="w-full h-auto" />
      </Motion.div>
      <Motion.div
        style={!prefersReducedMotion ? { y: foliageY } : undefined}
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-36 sm:w-56 lg:w-72 opacity-80 pointer-events-none z-[2]"
      >
        <JungleFoliageRight className="w-full h-auto" />
      </Motion.div>

      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] pointer-events-none bg-[radial-gradient(ellipse_at_50%_38%,rgba(8,13,11,0.34)_0%,rgba(8,13,11,0.82)_68%,rgba(8,13,11,0.97)_100%)]"
      />
      <div className="absolute inset-0 z-[4] pointer-events-none">
        <FloatingParticles density={isPhone ? 'sparse' : 'normal'} />
      </div>

      <Motion.div
        style={!prefersReducedMotion ? { y: contentY } : undefined}
        className="relative z-10 max-w-5xl mx-auto w-full text-center"
      >
        <Motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/40 text-[#E8C574] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] mb-5 shadow-lg"
        >
          <Compass size={13} className="text-[#C69B43]" />
          <span>CROSSROADS 2027 • OFFICIAL ARENAS</span>
        </Motion.div>

        <Motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="lc-font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-wide text-[#E8DFC8] drop-shadow-[0_12px_36px_rgba(0,0,0,0.92)]"
        >
          COMPETE ACROSS <span className="lc-gold-text">11 ARENAS</span>
        </Motion.h1>

        <TempleDivider className="my-4" />

        <Motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm sm:text-lg text-[#E8DFC8]/90 max-w-2xl mx-auto leading-relaxed mb-3"
        >
          Two days of high-voltage technical duels, robotics races, prototypes, and cultural
          showdowns at HIET Ghaziabad.
        </Motion.p>

        <div className="mb-6 min-h-[26px] flex items-center justify-center">
          <GhostTypeText
            text="CHOOSE YOUR CHAMBER // "
            completions={[
              'CODE PUZZLE & ROBO RACE.',
              'PROJECT EXHIBITION.',
              'DANCE & ROCK BAND.',
              'CAMPUS TREASURE HUNT.',
            ]}
            className="lc-font-heading text-xs sm:text-sm uppercase tracking-[0.2em] font-bold text-[#E8DFC8]"
            accentColor="#E8C574"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/40 text-[#E8C574] text-xs font-semibold">
            <Calendar size={13} className="text-[#C69B43]" />
            <span>Event: 05 Feb &amp; 06 Feb 2027</span>
          </span>
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/30 text-[#E8DFC8] text-xs font-semibold">
            <Sparkles size={13} className="text-[#C69B43]" />
            <span>Reg Starts: 10 Jan 2027</span>
          </span>
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#182B20]/90 border border-[#B86B35]/55 text-[#F3DDA0] text-xs font-semibold">
            <Clock size={13} className="text-[#E8C574]" />
            <span>Last Date: 31 Jan 2027</span>
          </span>
        </div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative rounded-xl lc-stone-surface lc-carved-border p-5 sm:p-8 overflow-hidden">
            <AncientSunDisc className="lc-animate-spin-slow absolute -right-14 -bottom-14 w-44 h-44 opacity-[0.07]" />
            <CornerFiligree className="absolute top-2 left-2 opacity-80" />
            <CornerFiligree className="absolute top-2 right-2 rotate-90 opacity-80" />
            <CornerFiligree className="absolute bottom-2 left-2 -rotate-90 opacity-80" />
            <CornerFiligree className="absolute bottom-2 right-2 rotate-180 opacity-80" />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-[#C69B43]/20">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E8C574] animate-pulse" />
                  <span className="lc-font-heading text-xs uppercase tracking-[0.2em] text-[#E8C574] font-bold">
                    {timeLeft.expired ? 'CROSSROADS Has Begun!' : 'Countdown to Feb 05, 2027'}
                  </span>
                </div>
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#E8DFC8]/70 font-medium">
                  HIET • 09:00 AM IST
                </span>
              </div>

              {!timeLeft.expired ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {countdownUnits.map((item) => {
                    const formatted = String(item.value).padStart(2, '0');
                    return (
                      <div
                        key={item.label}
                        className="p-3.5 sm:p-5 rounded-lg bg-[#080D0B]/88 border border-[#C69B43]/30 text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.85)]"
                      >
                        <span className="block text-[9px] tracking-[0.26em] text-[#B8B2A1] uppercase mb-1">
                          {item.glyph}
                        </span>
                        <div className="h-9 sm:h-11 flex items-center justify-center overflow-hidden">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <Motion.span
                              key={formatted}
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -10, opacity: 0 }}
                              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                              className="lc-font-heading lc-gold-text text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums leading-none"
                            >
                              {formatted}
                            </Motion.span>
                          </AnimatePresence>
                        </div>
                        <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#E8DFC8]/75 mt-1.5 font-semibold">
                          {item.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-5 text-center lc-font-display lc-gold-text text-2xl sm:text-4xl font-black">
                  FEST IS OFFICIALLY LIVE!
                </div>
              )}
            </div>
          </div>
        </Motion.div>
      </Motion.div>
    </section>
  );
}
