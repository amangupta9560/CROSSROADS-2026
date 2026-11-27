import { Component, Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Components/home/lostCivilization.css';
import SeoHead from '../Components/common/SeoHead.jsx';
import StackingChapter from '../Components/about/StackingChapter.jsx';
import FloatingParticles from '../Components/home/FloatingParticles.jsx';
import { TempleDivider } from '../Components/home/OrnamentDivider.jsx';
import { AncientSunDisc } from '../Components/about/JungleCanopyVectors.jsx';
import { SCHEDULE_DATA } from '../Components/schedule/scheduleData.js';
import ScheduleScrollProgress from '../Components/schedule/ScheduleScrollProgress.jsx';
import ScheduleHero from '../Components/schedule/ScheduleHero.jsx';
import ScheduleTimelineSection from '../Components/schedule/ScheduleTimelineSection.jsx';
import { ROUTE_PATHS, SITE_URL, buildBreadcrumbJsonLd } from '../config/siteConfig.js';

const ExplorerCharacter3D = lazy(() =>
  import('../Components/schedule/ExplorerCharacter3D.jsx')
);

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
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

export default function Schedule() {
  const [activeDay, setActiveDay] = useState('Day 1');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [webGLOk, setWebGLOk] = useState(() => checkWebGL());

  const prefersReduced = useReducedMotion();
  const timelineBoundsRef = useRef(null);
  const anchorRefs = useRef([]);
  const targetIndexRef = useRef(0);
  const hoveredIdxRef = useRef(null);
  const hoverScrollYRef = useRef(0);
  const cursorRef = useRef({ nx: 0, ny: 0 });
  const gatewayRef = useRef(null);

  const { scrollYProgress: gatewayScroll } = useScroll({
    target: gatewayRef,
    offset: ['start end', 'end start'],
  });
  const chestScale = useTransform(gatewayScroll, [0, 1], [1.14, 1.0]);
  const discRotate = useTransform(gatewayScroll, [0, 1], [-20, 26]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Countdown to Feb 05, 2027 09:00 AM IST
  useEffect(() => {
    const eventDate = new Date('2027-02-05T09:00:00+05:30').getTime();
    const update = () => {
      const distance = eventDate - Date.now();
      if (distance < 0) {
        setCountdown('Event Started!');
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);
      if (days > 0) setCountdown(`${days}d ${hrs}h ${mins}m`);
      else if (hrs > 0) setCountdown(`${hrs}h ${mins}m ${secs}s`);
      else setCountdown(`${mins}m ${secs}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentEvents = SCHEDULE_DATA[activeDay] || [];

  // Track closest timeline pedestal on scroll and yield smoothly when cursor hovers a card
  useEffect(() => {
    anchorRefs.current = anchorRefs.current.slice(0, currentEvents.length);
    hoveredIdxRef.current = null;
    targetIndexRef.current = 0;

    const findScrollFocusIndex = () => {
      const focusY = window.innerHeight * 0.44;
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < currentEvents.length; i += 1) {
        const el = anchorRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height * 0.5;
        const dist = Math.abs(centerY - focusY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }
      return bestIdx;
    };

    const onScroll = () => {
      if (
        hoveredIdxRef.current !== null &&
        Math.abs(window.scrollY - hoverScrollYRef.current) > 48
      ) {
        hoveredIdxRef.current = null;
      }
      if (hoveredIdxRef.current === null) {
        const nextIdx = findScrollFocusIndex();
        if (targetIndexRef.current !== nextIdx) {
          targetIndexRef.current = nextIdx;
          setActiveCardIdx(nextIdx);
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [activeDay, currentEvents.length]);

  const handleCardHover = (index) => {
    hoveredIdxRef.current = index;
    hoverScrollYRef.current = window.scrollY;
    targetIndexRef.current = index;
    setActiveCardIdx(index);
  };

  const handleCardLeave = () => {
    hoveredIdxRef.current = null;
  };

  const handleDayChange = (day) => {
    setActiveDay(day);
    setExpandedIndex(null);
    setActiveCardIdx(0);
    targetIndexRef.current = 0;
  };

  const showWebGLExplorer = webGLOk && !prefersReduced;

  const jsonLd = useMemo(
    () => [
      buildBreadcrumbJsonLd([
        { name: 'Home', path: ROUTE_PATHS.home },
        { name: 'Schedule', path: ROUTE_PATHS.schedule },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'CROSSROADS 2027 Two-Day Event Schedule',
        url: `${SITE_URL}/schedule`,
        itemListElement: [...(SCHEDULE_DATA['Day 1'] || []), ...(SCHEDULE_DATA['Day 2'] || [])].map(
          (slot, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: `${slot.title} (${slot.time} — ${slot.venue})`,
          })
        ),
      },
    ],
    []
  );

  return (
    <main className="lc-root min-h-[100dvh] overflow-x-clip relative selection:bg-[#C69B43] selection:text-[#080D0B]">
      <SeoHead
        title="Event Schedule (Feb 05–06, 2027) | CROSSROADS 2027 — HIET Ghaziabad"
        description="View the complete Day 1 (Feb 05) and Day 2 (Feb 06) event schedule, competition slots, and campus venues for CROSSROADS 2027 at HIET Ghaziabad."
        path={ROUTE_PATHS.schedule}
        jsonLd={jsonLd}
      />
      <ScheduleScrollProgress />

      {/* 3D Temple Explorer Character traversing card-to-card across scroll & cursor */}
      {showWebGLExplorer && (
        <WebGLErrorBoundary onError={() => setWebGLOk(false)}>
          <Suspense fallback={null}>
            <ExplorerCharacter3D
              timelineBoundsRef={timelineBoundsRef}
              anchorRefs={anchorRefs}
              targetIndexRef={targetIndexRef}
              cursorRef={cursorRef}
              reducedMotion={!!prefersReduced}
              onWebGLError={() => setWebGLOk(false)}
            />
          </Suspense>
        </WebGLErrorBoundary>
      )}

      {/* Chapter 01: Parchment Map & Expedition Horizon */}
      <StackingChapter anchorId="schedule-hero" zIndex={10} isFirst>
        <ScheduleHero
          countdown={countdown}
          scheduleData={SCHEDULE_DATA}
          activeDay={activeDay}
          setActiveDay={handleDayChange}
          onResetExpanded={() => setExpandedIndex(null)}
          totalEvents={currentEvents.length}
        />
      </StackingChapter>

      {/* Chapter 02: Stone Expedition Trail & 3D Explorer Stops */}
      <StackingChapter anchorId="schedule-timeline" zIndex={20}>
        <ScheduleTimelineSection
          activeDay={activeDay}
          currentEvents={currentEvents}
          expandedIndex={expandedIndex}
          setExpandedIndex={setExpandedIndex}
          timelineBoundsRef={timelineBoundsRef}
          anchorRefs={anchorRefs}
          activeCardIdx={activeCardIdx}
          onCardHover={handleCardHover}
          onCardLeave={handleCardLeave}
          use3DFallback={!showWebGLExplorer}
        />
      </StackingChapter>

      {/* Chapter 03: Treasure Vault Closing Gateway (distinct treasure-chest background) */}
      <StackingChapter anchorId="schedule-gateway" zIndex={30} isLast>
        <section
          ref={gatewayRef}
          aria-label="Schedule Treasure Vault"
          className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center overflow-hidden bg-[#080D0B]"
        >
          <Motion.div
            aria-hidden="true"
            style={!prefersReduced ? { scale: chestScale } : undefined}
            className="absolute inset-0 pointer-events-none will-change-transform"
          >
            <img
              src="/assets/lost-civilization/treasure-chest.webp"
              alt="Ancient Treasure Vault of CROSSROADS 2027"
              loading="lazy"
              className="w-full h-full object-cover opacity-48"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,13,11,0.34)_0%,rgba(8,13,11,0.86)_72%,rgba(8,13,11,0.98)_100%)]" />
          </Motion.div>

          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Motion.div
              style={!prefersReduced ? { rotate: discRotate } : undefined}
              className="w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] opacity-[0.14] text-[#C69B43] will-change-transform"
            >
              <AncientSunDisc className="w-full h-full" />
            </Motion.div>
          </div>

          <FloatingParticles density="sparse" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#101D16]/90 border border-[#C69B43]/45 mb-6 shadow-xl">
              <Trophy className="w-4 h-4 text-[#E8C574]" />
              <span className="lc-font-heading text-xs sm:text-sm font-bold tracking-[0.16em] uppercase lc-gold-text">
                May the Best Talent Win!
              </span>
              <Sparkles className="w-4 h-4 text-[#E8C574]" />
            </div>

            <h2 className="lc-font-display text-3xl sm:text-5xl font-black text-[#E8DFC8] tracking-wide mb-3">
              CLAIM YOUR <span className="lc-gold-text">DESTINY</span>
            </h2>

            <TempleDivider className="my-4" />

            <p className="text-sm sm:text-lg text-[#E8DFC8]/85 max-w-xl mx-auto mb-8">
              Two days of discovery await across HIET Ghaziabad. Lock your team slot before
              registrations close on January 31, 2027.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 max-w-md mx-auto">
              <Link
                to={ROUTE_PATHS.register}
                className="lc-gold-btn lc-font-heading flex-1 px-7 py-4 rounded-sm font-extrabold text-xs sm:text-sm uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 group"
              >
                <span>Register Your Squad</span>
                <ArrowUpRight
                  size={16}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </Link>

              <Link
                to="/events"
                className="lc-stone-btn lc-font-heading px-6 py-4 rounded-sm font-bold text-xs sm:text-sm uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2"
              >
                <span>All 11 Arenas</span>
                <ArrowRight size={15} className="text-[#C69B43]" />
              </Link>
            </div>
          </div>
        </section>
      </StackingChapter>
    </main>
  );
}
