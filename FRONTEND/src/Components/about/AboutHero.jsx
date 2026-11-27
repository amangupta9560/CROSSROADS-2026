import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Award, Calendar, Compass, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import FloatingParticles from '../home/FloatingParticles.jsx';
import { TempleDivider } from '../home/OrnamentDivider.jsx';
import { AncientSunDisc, JungleFoliageLeft, JungleFoliageRight } from './JungleCanopyVectors.jsx';
import GhostTypeText from './GhostTypeText.jsx';

const HERO_WORDS = [
  { text: 'THE', gold: false },
  { text: 'STORY', gold: true },
  { text: 'BEHIND', gold: false },
  { text: 'THE', gold: false },
  { text: 'EXPEDITION', gold: true },
];

export default function AboutHero() {
  const prefersReducedMotion = useReducedMotion();
  const [introOpen, setIntroOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !window.sessionStorage.getItem('cr27_about_seal');
  });
  const [percent, setPercent] = useState(0);

  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const foliageLeftRef = useRef(null);
  const foliageRightRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.24]);
  const foliageScrollY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const discRotate = useTransform(scrollYProgress, [0, 1], [0, 65]);
  const scrollYShift = useTransform(scrollYProgress, [0, 1], [0, 75]);

  useEffect(() => {
    if (!introOpen || prefersReducedMotion) return undefined;
    let frame = 0;
    const start = performance.now();
    const duration = 680;

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setPercent(Math.round(p * 100));
      if (p < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        window.sessionStorage.setItem('cr27_about_seal', '1');
        setTimeout(() => setIntroOpen(false), 120);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [introOpen, prefersReducedMotion]);

  // Multi-layer pointer depth parallax on desktop
  useEffect(() => {
    if (prefersReducedMotion || window.innerWidth < 1024) return undefined;

    let rafId = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };

    const tick = () => {
      rafId = window.requestAnimationFrame(tick);
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${cx * -14}px, ${cy * -10}px, 0) scale(1.06)`;
      }
      if (foliageLeftRef.current) {
        foliageLeftRef.current.style.transform = `translate3d(${cx * 26}px, ${cy * 14}px, 0)`;
      }
      if (foliageRightRef.current) {
        foliageRightRef.current.style.transform = `translate3d(${cx * 30}px, ${cy * 14}px, 0)`;
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
    };
  }, [prefersReducedMotion]);

  const dismissIntro = () => {
    window.sessionStorage.setItem('cr27_about_seal', '1');
    setIntroOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {introOpen && (
          <Motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
            onClick={dismissIntro}
            className="fixed inset-0 z-[120] bg-[#080D0B] flex flex-col items-center justify-center px-6 text-center cursor-pointer select-none"
          >
            <AncientSunDisc className="lc-animate-spin-slow w-36 h-36 opacity-35 mb-4" />
            <p className="lc-font-heading text-[11px] uppercase tracking-[0.28em] text-[#C69B43] mb-2">
              HIET GHAZIABAD × TEAM TECH FUSION
            </p>
            <h2 className="lc-font-display text-2xl sm:text-4xl font-black lc-gold-text mb-6">
              EXPEDITION CHRONICLES
            </h2>
            <div className="w-64 max-w-full">
              <div className="flex justify-between text-[10px] tracking-[0.24em] text-[#E8C574] uppercase mb-2">
                <span>UNSEALING ARCHIVES</span>
                <span className="tabular-nums">{percent}%</span>
              </div>
              <div className="h-[2px] w-full bg-[#182B20]">
                <div
                  className="h-full bg-gradient-to-r from-[#B86B35] via-[#E8C574] to-[#C69B43]"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      <section
        ref={heroRef}
        aria-label="About CROSSROADS 2027 Opening Sequence"
        className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col justify-between bg-[#080D0B]"
      >
        {/* Layer 0: Distant Jungle Temple & Mist Landscape */}
        <Motion.div
          style={!prefersReducedMotion ? { scale: scrollScale } : undefined}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          <img
            ref={bgRef}
            src="/assets/lost-civilization/hero-temple.webp"
            alt="Ancient Temple Deep Inside Tropical Jungle"
            className="w-full h-full object-cover object-center will-change-transform select-none"
            fetchPriority="high"
          />
          <div
            aria-hidden="true"
            className="lc-animate-sunbeam absolute -top-24 left-[12%] w-48 sm:w-80 h-[140%] bg-gradient-to-b from-[#F3DDA0]/22 via-[#C69B43]/9 to-transparent blur-xl origin-top"
          />
        </Motion.div>

        {/* Scroll-Rotating Carved Sun Disc Backdrop */}
        <Motion.div
          aria-hidden="true"
          style={!prefersReducedMotion ? { rotate: discRotate } : undefined}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] sm:w-[44rem] opacity-[0.07] z-[1]"
        >
          <AncientSunDisc className="w-full h-auto" />
        </Motion.div>

        {/* Layer 1: Foreground Tropical Foliage Silhouettes (Multi-speed scroll + pointer parallax) */}
        <Motion.div
          style={!prefersReducedMotion ? { y: foliageScrollY } : undefined}
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-40 sm:w-64 lg:w-80 opacity-85 pointer-events-none z-[2]"
        >
          <div ref={foliageLeftRef} className="will-change-transform">
            <JungleFoliageLeft className="w-full h-auto" />
          </div>
        </Motion.div>
        <Motion.div
          style={!prefersReducedMotion ? { y: foliageScrollY } : undefined}
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-40 sm:w-64 lg:w-80 opacity-85 pointer-events-none z-[2]"
        >
          <div ref={foliageRightRef} className="will-change-transform">
            <JungleFoliageRight className="w-full h-auto" />
          </div>
        </Motion.div>

        {/* Layer 2: Cinematic Vignette & Contrast Scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[3] pointer-events-none bg-[radial-gradient(ellipse_at_50%_40%,rgba(8,13,11,0.36)_0%,rgba(8,13,11,0.78)_66%,rgba(8,13,11,0.96)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[3] pointer-events-none bg-gradient-to-b from-[#080D0B]/92 via-[#101D16]/25 to-[#080D0B]"
        />

        {/* Layer 3: Fireflies & Golden Dust */}
        <div className="absolute inset-0 z-[4] pointer-events-none">
          <FloatingParticles density="normal" />
        </div>

        {/* Layer 4: Opening Typography & GhostType Prophecy */}
        <Motion.div
          style={!prefersReducedMotion ? { y: scrollYShift } : undefined}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-10 flex-1 flex flex-col items-center justify-center text-center"
        >
          <Motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/40 text-[#E8C574] text-[10px] sm:text-xs font-semibold tracking-[0.24em] uppercase mb-5 shadow-lg"
          >
            <Compass size={13} className="text-[#C69B43]" />
            <span>HIET GHAZIABAD × TEAM TECH FUSION</span>
          </Motion.div>

          <h1 className="lc-font-display text-3xl sm:text-5xl md:text-6xl lg:text-[4.4rem] font-black tracking-[0.05em] leading-[1.08] drop-shadow-[0_12px_36px_rgba(0,0,0,0.92)] flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1 mb-4">
            {HERO_WORDS.map((word, idx) => (
              <Motion.span
                key={`${word.text}-${idx}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.08 + idx * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={word.gold ? 'lc-gold-text' : 'text-[#E8DFC8]'}
              >
                {word.text}
              </Motion.span>
            ))}
          </h1>

          <TempleDivider className="my-2.5" />

          <Motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-xl text-[#E8DFC8]/92 max-w-2xl mx-auto leading-relaxed mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
          >
            Every great discovery begins with a journey. Welcome to CROSSROADS 2027.
          </Motion.p>

          {/* GhostType Predictive Inscription */}
          <div className="mb-7 min-h-[28px] flex items-center justify-center">
            <GhostTypeText
              text="EXPLORE "
              completions={[
                'THE LOST CIVILIZATION.',
                '11 COMPETITIVE ARENAS.',
                'WHERE CODE MEETS CULTURE.',
                'HIET GHAZIABAD • FEB 05–06.',
              ]}
              className="lc-font-heading text-xs sm:text-sm uppercase tracking-[0.22em] font-bold text-[#E8DFC8]"
              accentColor="#E8C574"
              ghostOpacity={0.38}
            />
          </div>

          <Motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-3xl mx-auto mb-8 text-[11px] sm:text-xs"
          >
            {[
              { icon: Calendar, text: '05 & 06 Feb 2027' },
              { icon: MapPin, text: 'HIET NH-9 Campus' },
              { icon: Award, text: '₹1L+ Prize Pool' },
              { icon: Sparkles, text: '100% Free Entry' },
            ].map((chip) => {
              const Icon = chip.icon;
              return (
                <div
                  key={chip.text}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-sm bg-[#101D16]/85 border border-[#C69B43]/30 text-[#E8DFC8]"
                >
                  <Icon size={13} className="text-[#C69B43] shrink-0" />
                  <span className="truncate font-medium">{chip.text}</span>
                </div>
              );
            })}
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 w-full max-w-lg mx-auto"
          >
            <Link
              to="/event-registration"
              className="lc-gold-btn lc-font-heading flex-1 px-7 py-4 rounded-sm font-extrabold text-xs sm:text-sm tracking-[0.16em] uppercase inline-flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Register Your Team</span>
              <ArrowUpRight
                size={16}
                className="text-[#080D0B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </Link>

            <Link
              to="/events"
              className="lc-stone-btn lc-font-heading px-7 py-4 rounded-sm font-bold text-xs sm:text-sm tracking-[0.16em] uppercase inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore 11 Arenas</span>
              <ArrowRight size={15} className="text-[#C69B43]" />
            </Link>
          </Motion.div>
        </Motion.div>

        <div className="relative z-10 pb-10 sm:pb-6 flex flex-col items-center justify-center text-center">
          <span className="lc-font-heading text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[#E8C574]/90 font-semibold mb-2">
            SCROLL TO BEGIN THE EXPEDITION
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
      </section>
    </>
  );
}
