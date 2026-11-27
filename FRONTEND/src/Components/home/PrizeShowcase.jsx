import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { Award, Box, Gift, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import FloatingParticles from './FloatingParticles.jsx';
import { CornerFiligree, TempleDivider } from './OrnamentDivider.jsx';

gsap.registerPlugin(ScrollTrigger);

const RelicCanvas = lazy(() => import('./TreasureRelicCanvas.jsx'));

class RelicErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

const VAULT_PHASES = [
  {
    code: '01',
    name: 'GRAND PRIZE POOL',
    leftPlaque: {
      eyebrow: 'TOTAL BOUNTY',
      value: '₹1,00,000+',
      title: 'Grand Prize Pool',
      detail: 'Cash rewards distributed across all 11 technical, robotics, and cultural arenas.',
    },
    rightPlaque: {
      eyebrow: 'VICTOR HONORS',
      value: 'GOLD & SILVER',
      title: 'Gold & Silver Trophies',
      detail: 'Prestigious commemorative rolling trophies awarded to top-finishing squads.',
    },
  },
  {
    code: '02',
    name: 'OFFICIAL HONORS',
    leftPlaque: {
      eyebrow: 'VERIFIED CREDENTIAL',
      value: 'MERIT & PASS',
      title: 'Official Certificates',
      detail: 'Verifiable certificates for all attending participants and winning teams.',
    },
    rightPlaque: {
      eyebrow: 'CHAMPION REWARDS',
      value: '11 ARENAS',
      title: 'Multi-Track Glory',
      detail: 'Compete across coding, robotics, exhibitions, stage arts, and adventure hunts.',
    },
  },
  {
    code: '03',
    name: 'EXPEDITION RELICS',
    leftPlaque: {
      eyebrow: 'SPONSOR GIFTS',
      value: 'EXCLUSIVE',
      title: 'Goodies & Badges',
      detail: 'Limited-edition festival badges, sponsor kits, and expedition memorabilia.',
    },
    rightPlaque: {
      eyebrow: 'FREE ENTRY',
      value: '100% FREE',
      title: 'Claim Your Share',
      detail: 'Zero registration fee. Lock your squad before January 31, 2027.',
    },
  },
];

export default function PrizeShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const [inspect3D, setInspect3D] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [phaseIdx, setPhaseIdx] = useState(0);

  const sectionRef = useRef(null);
  const tabletRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Desktop 3D Fold-In & Pinned Floating Bounty Vault (01 -> 03)
  useEffect(() => {
    if (prefersReducedMotion || !isDesktop || !sectionRef.current) return undefined;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      if (tabletRef.current) {
        gsap.fromTo(
          tabletRef.current,
          { rotateX: 10, scale: 0.92, y: 36 },
          {
            rotateX: 0,
            scale: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 88%',
              end: 'top 12%',
              scrub: 0.6,
              refreshPriority: 1,
            },
          }
        );
      }

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=1500',
        pin: true,
        scrub: 0.55,
        anticipatePin: 1,
        refreshPriority: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const idx = Math.min(VAULT_PHASES.length - 1, Math.floor(p * VAULT_PHASES.length));
          setPhaseIdx((prev) => (prev !== idx ? idx : prev));

          if (leftCardRef.current && rightCardRef.current) {
            const wave = Math.sin(p * Math.PI * 2);
            leftCardRef.current.style.transform = `perspective(900px) rotateY(10deg) translate3d(0, ${wave * -8}px, 0)`;
            rightCardRef.current.style.transform = `perspective(900px) rotateY(-10deg) translate3d(0, ${wave * 8}px, 0)`;
          }
        },
      });

      scrollTriggerRef.current = st;
    });

    return () => {
      scrollTriggerRef.current = null;
      mm.revert();
    };
  }, [prefersReducedMotion, isDesktop]);

  const jumpToPhase = (idx) => {
    const st = scrollTriggerRef.current;
    if (st && isDesktop && !prefersReducedMotion) {
      const fraction = (idx + 0.18) / VAULT_PHASES.length;
      const targetY = st.start + (st.end - st.start) * Math.min(0.96, Math.max(0.02, fraction));
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    } else {
      setPhaseIdx(idx);
    }
  };

  const rewards = [
    { icon: Award, label: 'Official Certificates' },
    { icon: Trophy, label: 'Gold & Silver Trophies' },
    { icon: Gift, label: 'Goodies & Badges' },
  ];

  const staticChestView = (
    <div className="relative w-full h-full">
      <img
        src="/assets/lost-civilization/treasure-chest.webp"
        alt="Ancient Golden Treasure Chest — CROSSROADS 2027 Grand Prize Pool"
        loading="lazy"
        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#080D0B] via-transparent to-[#080D0B]/40 pointer-events-none"
      />
    </div>
  );

  const activePhase = VAULT_PHASES[phaseIdx] || VAULT_PHASES[0];

  // Mobile / Tablet Responsive Vault with Smooth Interactive Phase Switcher
  if (!isDesktop || prefersReducedMotion) {
    return (
      <section
        id="vault"
        aria-label="Grand Prize Pool Showcase"
        className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#080D0B] via-[#0E1812] to-[#080D0B] border-t border-[#C69B43]/20 overflow-hidden"
      >
        <FloatingParticles density="sparse" />
        <div className="relative max-w-4xl mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-xl lc-stone-surface lc-carved-border overflow-hidden p-5 sm:p-8"
          >
            <CornerFiligree className="absolute top-2.5 left-2.5 opacity-80" />
            <CornerFiligree className="absolute top-2.5 right-2.5 rotate-90 opacity-80" />

            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#182B20]/90 border border-[#C69B43]/40 text-[#E8C574] text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold mb-3">
                <Trophy size={13} className="text-[#C69B43]" />
                <span>Sacred Vault Rewards</span>
              </span>
              <h2 className="lc-font-display text-3xl sm:text-4xl font-black tracking-wide text-[#E8DFC8]">
                CLAIM THE <span className="lc-gold-text">TREASURE</span>
              </h2>
              <p className="lc-font-heading mt-2 text-xl font-extrabold tracking-[0.12em] text-[#E8C574]">
                ₹1,00,000+ PRIZE POOL
              </p>
              <TempleDivider className="my-3.5" />
            </div>

            <div className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-[#C69B43]/35 bg-[#080D0B] mb-5">
              {inspect3D ? (
                <RelicErrorBoundary fallback={staticChestView}>
                  <Suspense fallback={staticChestView}>
                    <RelicCanvas />
                  </Suspense>
                </RelicErrorBoundary>
              ) : (
                staticChestView
              )}
              <button
                type="button"
                onClick={() => setInspect3D((prev) => !prev)}
                className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#080D0B]/90 border border-[#C69B43]/50 text-[#E8C574] text-[10px] font-semibold uppercase tracking-[0.14em] cursor-pointer"
              >
                <Box size={13} className="text-[#C69B43]" />
                <span>{inspect3D ? 'View Vault Render' : 'Inspect 3D Vault'}</span>
              </button>
            </div>

            {/* Interactive Mobile Bounty Phase Tabs */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto lc-no-scrollbar pb-3 mb-3">
              {VAULT_PHASES.map((phase, idx) => (
                <button
                  key={phase.code}
                  type="button"
                  onClick={() => setPhaseIdx(idx)}
                  className={`shrink-0 px-3 py-1.5 rounded-sm border text-[10px] font-bold tracking-[0.14em] uppercase transition-all cursor-pointer ${
                    idx === phaseIdx
                      ? 'lc-gold-btn border-transparent'
                      : 'bg-[#080D0B]/85 border-[#C69B43]/30 text-[#E8DFC8]/75'
                  }`}
                >
                  {phase.code} · {phase.name}
                </button>
              ))}
            </div>

            {/* Smooth Animated Mobile Bounty Plaques */}
            <AnimatePresence mode="wait">
              <Motion.div
                key={activePhase.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5"
              >
                {[activePhase.leftPlaque, activePhase.rightPlaque].map((plaque) => (
                  <div
                    key={plaque.title}
                    className="rounded-lg bg-[#080D0B]/90 border border-[#C69B43]/40 p-4 text-left"
                  >
                    <span className="block text-[9px] tracking-[0.22em] uppercase text-[#C69B43] font-bold mb-1">
                      {plaque.eyebrow}
                    </span>
                    <div className="lc-font-display lc-gold-text text-xl font-black mb-1">
                      {plaque.value}
                    </div>
                    <h3 className="lc-font-heading text-xs font-bold text-[#E8DFC8] mb-1">
                      {plaque.title}
                    </h3>
                    <p className="text-xs text-[#E8DFC8]/75 leading-relaxed">{plaque.detail}</p>
                  </div>
                ))}
              </Motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
              {rewards.map((reward) => {
                const Icon = reward.icon;
                return (
                  <div
                    key={reward.label}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-md bg-[#080D0B]/85 border border-[#C69B43]/28 text-[#E8DFC8] text-xs font-semibold"
                  >
                    <Icon size={15} className="text-[#C69B43]" />
                    <span>{reward.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <Link
                to="/register"
                className="lc-gold-btn lc-font-heading w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-sm font-extrabold text-xs sm:text-sm uppercase tracking-[0.18em] cursor-pointer"
              >
                <Sparkles size={16} className="text-[#080D0B]" />
                <span>ENTER THE COMPETITION</span>
              </Link>
            </div>
          </Motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="vault"
      ref={sectionRef}
      aria-label="Grand Prize Pool Showcase"
      className="relative z-10 min-h-[100dvh] w-full flex flex-col justify-center py-20 px-6 lg:px-10 bg-gradient-to-b from-[#080D0B] via-[#0E1812] to-[#080D0B] border-t border-[#C69B43]/25 overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <FloatingParticles density="sparse" />

      <div
        aria-hidden="true"
        className="lc-watermark-text absolute top-14 left-1/2 -translate-x-1/2 text-[9vw] whitespace-nowrap font-black uppercase leading-none"
      >
        CLAIM THE TREASURE
      </div>

      <div
        ref={tabletRef}
        className="relative z-10 max-w-7xl w-full mx-auto rounded-xl lc-stone-surface lc-carved-border overflow-hidden p-7 lg:p-10 shadow-[0_35px_90px_-20px_rgba(0,0,0,0.95)]"
      >
        <CornerFiligree className="absolute top-3 left-3 opacity-85" />
        <CornerFiligree className="absolute top-3 right-3 rotate-90 opacity-85" />
        <CornerFiligree className="absolute bottom-3 left-3 -rotate-90 opacity-85" />
        <CornerFiligree className="absolute bottom-3 right-3 rotate-180 opacity-85" />

        <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-[#C69B43]/20">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] text-[#E8C574] font-semibold mb-1">
              <Trophy size={12} className="text-[#C69B43]" />
              <span>RADAR // {activePhase.code} OF 03 • {activePhase.name}</span>
            </span>
            <h2 className="lc-font-display text-3xl lg:text-4xl font-black tracking-wide text-[#E8DFC8]">
              CLAIM THE <span className="lc-gold-text">TREASURE</span> —{' '}
              <span className="text-[#E8C574]">₹1,00,000+ PRIZE POOL</span>
            </h2>
          </div>

          <Link
            to="/register"
            className="lc-gold-btn lc-font-heading inline-flex items-center gap-2 px-6 py-3 rounded-sm font-extrabold text-xs uppercase tracking-[0.18em] cursor-pointer shrink-0"
          >
            <Sparkles size={15} className="text-[#080D0B]" />
            <span>ENTER THE COMPETITION</span>
          </Link>
        </div>

        {/* 3-Column 3D Depth Stage with Smooth AnimatePresence Plaque Morphing */}
        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-3">
            <div
              ref={leftCardRef}
              style={{ transform: 'perspective(900px) rotateY(10deg)' }}
              className="rounded-lg bg-[#080D0B]/92 border border-[#C69B43]/45 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-transform duration-300 min-h-[210px] flex flex-col justify-center"
            >
              <AnimatePresence mode="wait">
                <Motion.div
                  key={activePhase.leftPlaque.title}
                  initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="block text-[10px] tracking-[0.24em] uppercase text-[#C69B43] font-bold mb-2">
                    {activePhase.leftPlaque.eyebrow}
                  </span>
                  <div className="lc-font-display lc-gold-text text-2xl xl:text-3xl font-black mb-2">
                    {activePhase.leftPlaque.value}
                  </div>
                  <h3 className="lc-font-heading text-sm font-bold text-[#E8DFC8] mb-2">
                    {activePhase.leftPlaque.title}
                  </h3>
                  <p className="text-xs text-[#E8DFC8]/75 leading-relaxed">
                    {activePhase.leftPlaque.detail}
                  </p>
                </Motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="col-span-6">
            <div className="group relative aspect-[16/10] rounded-lg overflow-hidden border border-[#C69B43]/45 bg-[#080D0B] shadow-[0_24px_70px_-10px_rgba(198,155,67,0.22)]">
              {inspect3D ? (
                <RelicErrorBoundary fallback={staticChestView}>
                  <Suspense fallback={staticChestView}>
                    <RelicCanvas />
                  </Suspense>
                </RelicErrorBoundary>
              ) : (
                staticChestView
              )}

              <button
                type="button"
                onClick={() => setInspect3D((prev) => !prev)}
                className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#080D0B]/90 border border-[#C69B43]/50 hover:border-[#E8C574] text-[#E8C574] text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors cursor-pointer"
              >
                <Box size={13} className="text-[#C69B43]" />
                <span>{inspect3D ? 'View Vault Render' : 'Inspect 3D Vault'}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mt-4">
              {rewards.map((reward) => {
                const Icon = reward.icon;
                return (
                  <div
                    key={reward.label}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-sm bg-[#080D0B]/88 border border-[#C69B43]/30 text-[#E8DFC8] text-xs font-semibold"
                  >
                    <Icon size={14} className="text-[#C69B43] shrink-0" />
                    <span className="truncate">{reward.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-span-3">
            <div
              ref={rightCardRef}
              style={{ transform: 'perspective(900px) rotateY(-10deg)' }}
              className="rounded-lg bg-[#080D0B]/92 border border-[#C69B43]/45 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-transform duration-300 min-h-[210px] flex flex-col justify-center"
            >
              <AnimatePresence mode="wait">
                <Motion.div
                  key={activePhase.rightPlaque.title}
                  initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="block text-[10px] tracking-[0.24em] uppercase text-[#C69B43] font-bold mb-2">
                    {activePhase.rightPlaque.eyebrow}
                  </span>
                  <div className="lc-font-display lc-gold-text text-2xl xl:text-3xl font-black mb-2">
                    {activePhase.rightPlaque.value}
                  </div>
                  <h3 className="lc-font-heading text-sm font-bold text-[#E8DFC8] mb-2">
                    {activePhase.rightPlaque.title}
                  </h3>
                  <p className="text-xs text-[#E8DFC8]/75 leading-relaxed">
                    {activePhase.rightPlaque.detail}
                  </p>
                </Motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#C69B43]/20 flex items-center justify-center gap-4">
          {VAULT_PHASES.map((phase, idx) => {
            const active = idx === phaseIdx;
            return (
              <button
                key={phase.code}
                type="button"
                onClick={() => jumpToPhase(idx)}
                className={`px-4 py-2 rounded-sm border text-[11px] font-bold tracking-[0.18em] uppercase transition-all cursor-pointer ${
                  active
                    ? 'bg-[#182B20] border-[#E8C574] text-[#F3DDA0] shadow-[0_0_20px_rgba(198,155,67,0.18)]'
                    : 'bg-[#080D0B]/80 border-[#C69B43]/25 text-[#E8DFC8]/65 hover:text-[#E8DFC8]'
                }`}
              >
                {phase.code} · {phase.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
