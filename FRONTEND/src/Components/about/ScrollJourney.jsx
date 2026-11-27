import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Compass, Quote } from 'lucide-react';
import FloatingParticles from '../home/FloatingParticles.jsx';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';
import { JungleFoliageLeft, JungleFoliageRight } from './JungleCanopyVectors.jsx';
import GhostTypeText from './GhostTypeText.jsx';

gsap.registerPlugin(ScrollTrigger);

const JungleScene = lazy(() => import('./JungleScene.jsx'));

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    if (this.state.failed) return null;
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

export default function ScrollJourney() {
  const prefersReducedMotion = useReducedMotion();
  const [webGLOk, setWebGLOk] = useState(() => checkWebGL());
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [phase, setPhase] = useState(0);

  const sectionRef = useRef(null);
  const mobileWrapRef = useRef(null);
  const progressRef = useRef(0);
  const bgImgRef = useRef(null);
  const leftLeafRef = useRef(null);
  const rightLeafRef = useRef(null);

  const { scrollYProgress: mobileProg } = useScroll({
    target: mobileWrapRef,
    offset: ['start end', 'end start'],
  });
  const mobileBgScale = useTransform(mobileProg, [0, 1], [1.02, 1.18]);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Desktop Pinned Scroll-Controlled 3D Camera Pathway
  useEffect(() => {
    if (prefersReducedMotion || !isDesktop || !sectionRef.current) return undefined;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=2000',
        pin: true,
        scrub: 0.65,
        anticipatePin: 1,
        refreshPriority: 4,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;

          if (bgImgRef.current) {
            bgImgRef.current.style.transform = `scale(${1.04 + p * 0.24})`;
            bgImgRef.current.style.opacity = String(0.32 + p * 0.3);
          }
          if (leftLeafRef.current) {
            leftLeafRef.current.style.transform = `translate3d(${-p * 110}px, ${p * 30}px, 0) scale(${1 + p * 0.2})`;
            leftLeafRef.current.style.opacity = String(Math.max(0.15, 0.9 - p * 0.75));
          }
          if (rightLeafRef.current) {
            rightLeafRef.current.style.transform = `translate3d(${p * 110}px, ${p * 30}px, 0) scale(${1 + p * 0.2})`;
            rightLeafRef.current.style.opacity = String(Math.max(0.15, 0.9 - p * 0.75));
          }

          const nextPhase = p < 0.34 ? 0 : p < 0.68 ? 1 : 2;
          setPhase((prev) => (prev !== nextPhase ? nextPhase : prev));
        },
      });
      return () => st.kill();
    });

    return () => mm.revert();
  }, [prefersReducedMotion, isDesktop]);

  const jumpPastJourney = () => {
    const el = document.getElementById('about-vision');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!isDesktop || prefersReducedMotion) {
    return (
      <section
        ref={mobileWrapRef}
        aria-label="What is CROSSROADS"
        style={{ zIndex: 20 }}
        className="relative py-16 sm:py-24 px-4 sm:px-6 lc-moss-surface rounded-t-[1.5rem] sm:rounded-t-[2.25rem] border-t border-[#C69B43]/40 shadow-[0_-28px_85px_rgba(0,0,0,0.92)] overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-xl lc-stone-surface lc-carved-border overflow-hidden p-5 sm:p-10"
          >
            <CornerFiligree className="absolute top-2.5 left-2.5 opacity-80" />
            <CornerFiligree className="absolute top-2.5 right-2.5 rotate-90 opacity-80" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
              <div className="lg:col-span-6">
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[#C69B43]/35 bg-[#080D0B]">
                  <Motion.img
                    style={!prefersReducedMotion ? { scale: mobileBgScale } : undefined}
                    src="/assets/lost-civilization/arena-treasure-hunt.webp"
                    alt="Ancient Stone Temple Pathway"
                    loading="lazy"
                    className="w-full h-full object-cover will-change-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080D0B]/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-sm bg-[#080D0B]/88 border border-[#C69B43]/40 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#E8C574]">
                    SANCTUM ORIGIN // HIET
                  </span>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="mb-2">
                  <GhostTypeText
                    text="ORIGIN // "
                    completions={[
                      '20+ YEARS OF HIET LEGACY',
                      '11 COMPETITIVE ARENAS',
                      'TEAM TECH FUSION • HIET',
                    ]}
                    className="text-[10px] uppercase tracking-[0.22em] text-[#C69B43] font-bold"
                    accentColor="#E8C574"
                  />
                </div>
                <h2 className="lc-font-display text-2xl sm:text-4xl font-black text-[#E8DFC8] mb-4">
                  What is <span className="lc-gold-text">CROSSROADS?</span>
                </h2>
                <p className="text-sm sm:text-base text-[#E8DFC8]/90 leading-relaxed mb-4">
                  CROSSROADS 2027 is the flagship annual inter-college technical and cultural
                  festival hosted by Hi-Tech Institute of Engineering &amp; Technology (HIET) in
                  collaboration with Team Tech Fusion. Over 20+ years of institutional legacy meet
                  11 high-energy competitive arenas.
                </p>
                <p className="text-sm sm:text-base text-[#E8DFC8]/80 leading-relaxed mb-4">
                  CROSSROADS is HIET&apos;s flagship festival built to ignite technical creativity,
                  encourage multidisciplinary collaboration, and celebrate student excellence across
                  engineering, design, and live performance.
                </p>
                <p className="text-xs sm:text-sm text-[#E8DFC8]/75 leading-relaxed mb-6">
                  Whether you write clean algorithms under a 20-minute timer, build an all-terrain
                  robot, present working hardware prototypes, or command the amphitheatre stage,
                  CROSSROADS gives every builder a real arena to perform.
                </p>

                <blockquote className="p-5 rounded-lg bg-[#080D0B]/88 border border-[#C69B43]/40">
                  <Quote size={18} className="text-[#C69B43] mb-2" />
                  <p className="lc-font-heading text-base font-semibold text-[#F3DDA0] leading-snug">
                    &ldquo;CROSSROADS isn&apos;t just about winning trophies—it&apos;s about
                    shipping ideas and discovering what your squad can build.&rdquo;
                  </p>
                  <footer className="mt-2.5 text-[11px] uppercase tracking-[0.2em] text-[#C69B43] font-bold">
                    Team Tech Fusion • HIET
                  </footer>
                </blockquote>
              </div>
            </div>
          </Motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Scroll-Controlled Expedition Journey & Origin"
      style={{ zIndex: 20 }}
      className="relative min-h-[100dvh] w-full overflow-hidden flex items-center bg-[#080D0B] rounded-t-[2.25rem] border-t border-[#C69B43]/45 shadow-[0_-32px_90px_rgba(0,0,0,0.95)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-[2px] z-30 bg-gradient-to-r from-transparent via-[#E8C574]/85 to-transparent"
      />

      {/* Distant Atmospheric Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          ref={bgImgRef}
          src="/assets/lost-civilization/arena-treasure-hunt.webp"
          alt="Ancient Lost Civilization Stone Temple Corridor"
          loading="lazy"
          className="w-full h-full object-cover object-center opacity-35 will-change-transform"
        />
      </div>

      {/* Real-Time Scrubbed 3D Camera Pathway Canvas */}
      {webGLOk && (
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <SceneErrorBoundary onError={() => setWebGLOk(false)}>
            <Suspense fallback={null}>
              <JungleScene
                progressRef={progressRef}
                reducedMotion={!!prefersReducedMotion}
                onWebGLError={() => setWebGLOk(false)}
              />
            </Suspense>
          </SceneErrorBoundary>
        </div>
      )}

      {/* Parting Foreground Jungle Foliage */}
      <div
        ref={leftLeafRef}
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-72 xl:w-96 z-[2] pointer-events-none will-change-transform"
      >
        <JungleFoliageLeft className="w-full h-auto" />
      </div>
      <div
        ref={rightLeafRef}
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-72 xl:w-96 z-[2] pointer-events-none will-change-transform"
      >
        <JungleFoliageRight className="w-full h-auto" />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(8,13,11,0.38)_0%,rgba(8,13,11,0.82)_72%,rgba(8,13,11,0.96)_100%)]"
      />
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <FloatingParticles density="normal" />
      </div>

      {/* Scroll-Driven Origin Storytelling HUD */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-12 gap-8 items-center">
          <div className="col-span-7">
            <div className="rounded-xl bg-[#080D0B]/78 backdrop-blur-md lc-carved-border p-8 lg:p-10 relative overflow-hidden">
              <CornerFiligree className="absolute top-2.5 left-2.5 opacity-80" />
              <CornerFiligree className="absolute top-2.5 right-2.5 rotate-90 opacity-80" />

              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#E8C574] font-semibold">
                  <Compass size={13} className="text-[#C69B43]" />
                  <span>THE ORIGIN // CHAPTER 0{phase + 1} OF 03</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C69B43]/85 font-bold">
                  {phase === 0 ? 'JUNGLE PATHWAY' : phase === 1 ? 'TEMPLE COURTYARD' : 'INNER SANCTUM'}
                </span>
              </div>

              <div className="mb-3">
                <GhostTypeText
                  text="EXPEDITION LOG // "
                  completions={[
                    '20+ YEARS OF HIET LEGACY',
                    '11 COMPETITIVE ARENAS',
                    'CODE, ROBOTICS & CULTURE',
                    'TEAM TECH FUSION • HIET',
                  ]}
                  className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E8DFC8]/85"
                  accentColor="#E8C574"
                />
              </div>

              <h2 className="lc-font-display text-3xl lg:text-5xl font-black text-[#E8DFC8] leading-tight mb-4">
                What is <span className="lc-gold-text">CROSSROADS?</span>
              </h2>
              <TempleDivider className="justify-start my-3" />

              <div className="space-y-4 text-sm lg:text-base text-[#E8DFC8]/90 leading-relaxed">
                <p className={`transition-opacity duration-500 ${phase >= 0 ? 'opacity-100' : 'opacity-45'}`}>
                  CROSSROADS 2027 is the flagship annual inter-college technical and cultural
                  festival hosted by Hi-Tech Institute of Engineering &amp; Technology (HIET) in
                  collaboration with Team Tech Fusion. Over 20+ years of institutional legacy meet
                  11 high-energy competitive arenas.
                </p>

                <p
                  className={`transition-all duration-500 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-1'
                    }`}
                >
                  CROSSROADS is HIET&apos;s flagship festival built to ignite technical creativity,
                  encourage multidisciplinary collaboration, and celebrate student excellence across
                  engineering, design, and live performance.
                </p>

                <p
                  className={`transition-all duration-500 text-[#E8DFC8]/80 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-35 translate-y-1'
                    }`}
                >
                  Whether you write clean algorithms under a 20-minute timer, build an all-terrain
                  robot, present working hardware prototypes, or command the amphitheatre stage,
                  CROSSROADS gives every builder a real arena to perform.
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-5 space-y-5">
            <div
              className={`rounded-xl lc-stone-surface lc-carved-border p-7 lg:p-8 relative transition-all duration-500 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-70 scale-[0.98]'
                }`}
            >
              <CornerFiligree className="absolute bottom-2 right-2 rotate-180 opacity-80" />
              <Quote size={24} className="text-[#C69B43] mb-3" />
              <p className="lc-font-heading text-lg lg:text-xl font-bold text-[#F3DDA0] leading-snug mb-4">
                &ldquo;CROSSROADS isn&apos;t just about winning trophies—it&apos;s about shipping
                ideas and discovering what your squad can build.&rdquo;
              </p>
              <div className="h-[1px] w-16 bg-[#C69B43]/50 mb-3" />
              <span className="text-xs uppercase tracking-[0.22em] text-[#C69B43] font-bold block">
                Team Tech Fusion • HIET
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-lg bg-[#080D0B]/85 border border-[#C69B43]/30">
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((step) => (
                  <span
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-300 ${phase >= step ? 'w-7 bg-[#E8C574]' : 'w-3 bg-[#C69B43]/30'
                      }`}
                  />
                ))}
                <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-[#E8DFC8]/75 font-semibold">
                  SCROLL TO WALK THE TEMPLE PATH
                </span>
              </div>

              <button
                type="button"
                onClick={jumpPastJourney}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E8C574] hover:text-white cursor-pointer"
              >
                <span>Skip</span>
                <ArrowDown size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
