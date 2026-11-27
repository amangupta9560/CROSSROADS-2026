import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Calendar, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { featuredEvents } from './homeData.js';
import { CornerFiligree, TempleDivider } from './OrnamentDivider.jsx';

gsap.registerPlugin(ScrollTrigger);

function MobileArenaCard({ item, isActive }) {
  const Icon = item.icon;
  return (
    <article
      className={`snap-center shrink-0 w-[85vw] sm:w-[66vw] md:w-[46vw] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isActive ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-80'
      }`}
    >
      <div className="group relative h-full rounded-lg lc-stone-surface lc-carved-border overflow-hidden flex flex-col justify-between">
        <CornerFiligree className="absolute top-2 left-2 z-20 opacity-75" />
        <CornerFiligree className="absolute top-2 right-2 rotate-90 z-20 opacity-75" />

        <div className="relative h-48 sm:h-52 overflow-hidden bg-[#080D0B]">
          <img
            src={item.image}
            alt={`${item.title} — ${item.chamber}`}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101D16] via-[#101D16]/35 to-[#080D0B]/55" />
          <div className="absolute top-3.5 inset-x-4 flex items-center justify-between gap-2 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#080D0B]/88 border border-[#C69B43]/40 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#E8C574]">
              <Icon size={12} className="text-[#C69B43]" />
              {item.category}
            </span>
            <span className="px-2.5 py-1 rounded-sm bg-[#182B20]/90 border border-[#C69B43]/35 text-[11px] font-semibold text-[#E8DFC8]">
              {item.tag}
            </span>
          </div>
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#E8C574]/95 font-semibold">
              {item.chamber}
            </span>
            <span className="lc-font-heading text-xs font-bold text-[#C69B43] tracking-widest">
              #{item.glyph}
            </span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="lc-font-heading text-xl font-bold text-[#E8DFC8] tracking-wide">
              {item.title}
            </h3>
            <p className="mt-2.5 text-sm text-[#E8DFC8]/80 leading-relaxed">{item.desc}</p>
          </div>
          <div className="pt-4 mt-5 border-t border-[#C69B43]/20 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#E8DFC8]/75 font-medium">
              <Calendar size={13} className="text-[#C69B43]" />
              <span>Feb 05–06, 2027</span>
            </span>
            <Link
              to={item.link}
              className="lc-font-heading inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#E8C574] hover:text-[#FFF3CF] transition-colors"
            >
              <span>Register Arena</span>
              <ArrowRight size={14} className="text-[#C69B43]" />
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className={`h-[2px] w-full bg-gradient-to-r from-transparent via-[#C69B43] to-transparent transition-opacity duration-500 ${
            isActive ? 'opacity-90' : 'opacity-25'
          }`}
        />
      </div>
    </article>
  );
}

export default function FeaturedArenas() {
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrubProgress, setScrubProgress] = useState(0);

  const sectionRef = useRef(null);
  const portalCardRef = useRef(null);
  const watermarkRef = useRef(null);
  const previewFrameRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const mobileTrackRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Desktop Pinned Portal Unfold + Horizontal Chamber Scrubber
  useEffect(() => {
    if (prefersReducedMotion || !isDesktop || !sectionRef.current) return undefined;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      if (portalCardRef.current) {
        gsap.fromTo(
          portalCardRef.current,
          { scale: 0.9, rotateX: 8, y: 40, opacity: 0.78 },
          {
            scale: 1,
            rotateX: 0,
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 90%',
              end: 'top 10%',
              scrub: 0.6,
              refreshPriority: 3,
            },
          }
        );
      }

      const total = featuredEvents.length;
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=2400',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        refreshPriority: 3,
        onUpdate: (self) => {
          const p = self.progress;
          setScrubProgress(p);
          const idx = Math.min(total - 1, Math.floor(p * total));
          setActiveIdx((prev) => (prev !== idx ? idx : prev));
        },
      });
      scrollTriggerRef.current = st;

      if (watermarkRef.current) {
        gsap.fromTo(
          watermarkRef.current,
          { xPercent: 8 },
          {
            xPercent: -18,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=2400',
              scrub: true,
              refreshPriority: 3,
            },
          }
        );
      }
    });

    return () => {
      scrollTriggerRef.current = null;
      mm.revert();
    };
  }, [prefersReducedMotion, isDesktop]);

  // Mobile/Tablet touch horizontal scroll listener synced to active chip
  const handleMobileTrackScroll = () => {
    const track = mobileTrackRef.current;
    if (!track || !track.children.length) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let bestDist = Infinity;
    for (let i = 0; i < track.children.length; i += 1) {
      const child = track.children[i];
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        closest = i;
      }
    }
    setActiveIdx((prev) => (prev !== closest ? closest : prev));
  };

  const jumpToArena = (idx) => {
    const st = scrollTriggerRef.current;
    if (st && isDesktop && !prefersReducedMotion) {
      const total = featuredEvents.length;
      const fraction = total > 1 ? (idx + 0.15) / total : 0;
      const clampedFraction = Math.min(0.98, Math.max(0.01, fraction));
      const targetY = st.start + (st.end - st.start) * clampedFraction;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    } else {
      setActiveIdx(idx);
      const track = mobileTrackRef.current;
      const child = track?.children?.[idx];
      if (child && track) {
        const left = child.offsetLeft - (track.clientWidth - child.clientWidth) / 2;
        track.scrollTo({ left, behavior: 'smooth' });
      }
    }
  };

  const handlePreviewPointer = (e) => {
    if (prefersReducedMotion || !previewFrameRef.current) return;
    const rect = previewFrameRef.current.getBoundingClientRect();
    const rx = (0.5 - (e.clientY - rect.top) / rect.height) * 6;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    previewFrameRef.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const resetPreviewPointer = () => {
    if (!previewFrameRef.current) return;
    previewFrameRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  };

  const activeItem = featuredEvents[activeIdx] || featuredEvents[0];
  const ActiveIcon = activeItem.icon;

  // Mobile & Tablet Responsive Touch-Swipe Interactive Deck
  if (!isDesktop || prefersReducedMotion) {
    return (
      <section
        id="arenas"
        aria-label="Explore the Ancient Arenas"
        className="relative z-10 py-16 sm:py-24 lc-moss-surface border-t border-[#C69B43]/20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/35 text-[#E8C574] text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold mb-3">
              <Compass size={12} className="text-[#C69B43]" />
              <span>Ancient Temple Chambers</span>
            </span>
            <h2 className="lc-font-display text-3xl sm:text-5xl font-black tracking-wide text-[#E8DFC8]">
              EXPLORE THE <span className="lc-gold-text">ANCIENT ARENAS</span>
            </h2>
            <TempleDivider className="my-3.5" />
            <p className="text-[#E8DFC8]/80 text-sm sm:text-base max-w-xl mx-auto">
              Every chamber holds a new challenge. Every challenge creates a legend.
            </p>
          </Motion.div>

          {/* Touch Chamber Quick-Switch Strip */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto lc-no-scrollbar pb-4 mb-3">
            {featuredEvents.map((ev, idx) => {
              const selected = idx === activeIdx;
              return (
                <button
                  key={ev.title}
                  type="button"
                  onClick={() => jumpToArena(idx)}
                  className={`shrink-0 px-3 py-1.5 rounded-sm border text-[11px] font-bold tracking-[0.12em] uppercase transition-all cursor-pointer ${
                    selected
                      ? 'lc-gold-btn border-transparent'
                      : 'bg-[#080D0B]/85 border-[#C69B43]/30 text-[#E8DFC8]/75'
                  }`}
                >
                  {ev.glyph} · {ev.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Smooth Touch Snap-Swipe Chamber Track (contained within viewport width) */}
        <div
          ref={mobileTrackRef}
          onScroll={handleMobileTrackScroll}
          className="flex gap-4 px-6 sm:px-10 pb-6 overflow-x-auto snap-x snap-mandatory lc-no-scrollbar scroll-smooth"
        >
          {featuredEvents.map((item, idx) => (
            <MobileArenaCard key={item.title} item={item} isActive={idx === activeIdx} />
          ))}
        </div>

        {/* Mobile Active Progress Dots & View All CTA */}
        <div className="max-w-7xl mx-auto px-4 text-center mt-2">
          <div className="flex items-center justify-center gap-2 mb-7">
            {featuredEvents.map((ev, idx) => (
              <button
                key={ev.title}
                type="button"
                aria-label={`Select ${ev.title}`}
                onClick={() => jumpToArena(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIdx ? 'w-7 bg-[#E8C574]' : 'w-2 bg-[#C69B43]/35'
                }`}
              />
            ))}
          </div>

          <Link
            to="/events"
            className="lc-stone-btn lc-font-heading inline-flex items-center gap-3 px-6 py-3.5 rounded-sm text-xs sm:text-sm font-bold uppercase tracking-[0.16em] cursor-pointer"
          >
            <span>View All 11 Competitions &amp; Rulebooks</span>
            <ArrowRight size={15} className="text-[#C69B43]" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      id="arenas"
      ref={sectionRef}
      aria-label="Explore the Ancient Arenas"
      className="relative z-10 min-h-[100dvh] w-full flex flex-col justify-center py-20 px-6 lg:px-10 lc-moss-surface border-t border-[#C69B43]/25 overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Massive Scrubbed Background Watermark */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="lc-watermark-text absolute bottom-6 left-0 text-[10vw] whitespace-nowrap font-black uppercase leading-none"
      >
        EXPLORE THE ANCIENT ARENAS • CROSSROADS 2027
      </div>

      {/* Main 3D-Unfolding Chamber Frame */}
      <div
        ref={portalCardRef}
        className="relative z-10 w-full max-w-7xl mx-auto rounded-xl lc-stone-surface lc-carved-border p-6 lg:p-10 shadow-[0_32px_90px_-20px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        {/* Scroll-Synced Rotating Astrolabe Ring Ornament */}
        <svg
          aria-hidden="true"
          viewBox="0 0 240 240"
          fill="none"
          style={{ transform: `rotate(${Math.round(scrubProgress * 180)}deg)` }}
          className="pointer-events-none absolute -right-24 -top-24 w-72 h-72 text-[#C69B43]/[0.07] transition-transform duration-150 ease-out"
        >
          <circle cx="120" cy="120" r="108" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 6" />
          <circle cx="120" cy="120" r="82" stroke="currentColor" strokeWidth="1" />
          <polygon points="120,10 128,30 112,30" fill="currentColor" />
        </svg>

        <CornerFiligree className="absolute top-3 left-3 opacity-85" />
        <CornerFiligree className="absolute top-3 right-3 rotate-90 opacity-85" />
        <CornerFiligree className="absolute bottom-3 left-3 -rotate-90 opacity-85" />
        <CornerFiligree className="absolute bottom-3 right-3 rotate-180 opacity-85" />

        {/* Section Top Header Row */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#C69B43]/20">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] text-[#E8C574] font-semibold mb-1">
              <Compass size={12} className="text-[#C69B43]" />
              <span>CHAMBER ARCHIVE // ANCIENT ARENAS</span>
            </span>
            <h2 className="lc-font-display text-2xl lg:text-4xl font-black tracking-wide text-[#E8DFC8]">
              EXPLORE THE <span className="lc-gold-text">ANCIENT ARENAS</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <p className="hidden xl:block text-xs text-[#E8DFC8]/75 max-w-xs text-right leading-relaxed">
              Every chamber holds a new challenge. Every challenge creates a legend.
            </p>
            <Link
              to="/events"
              className="lc-stone-btn lc-font-heading inline-flex items-center gap-2 px-4 py-2.5 rounded-sm text-[11px] font-bold uppercase tracking-[0.16em] cursor-pointer"
            >
              <span>View All 11 Competitions &amp; Rulebooks</span>
              <ArrowRight size={14} className="text-[#C69B43]" />
            </Link>
          </div>
        </div>

        {/* Active Chamber Split Stage */}
        <div className="relative z-10 grid grid-cols-12 gap-8 items-center min-h-[370px]">
          {/* Left Chamber Briefing */}
          <div className="col-span-5 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <Motion.div
                key={activeItem.title}
                initial={{ opacity: 0, y: 18, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -14, filter: 'blur(3px)' }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="lc-font-heading text-sm font-black tracking-[0.22em] text-[#E8C574] tabular-nums">
                    {activeItem.glyph} / 0{featuredEvents.length}
                  </span>
                  <span className="h-[1px] w-10 bg-[#C69B43]/50" />
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#182B20] border border-[#C69B43]/40 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E8C574]">
                    <ActiveIcon size={12} className="text-[#C69B43]" />
                    {activeItem.category}
                  </span>
                </div>

                <p className="text-xs uppercase tracking-[0.22em] text-[#C69B43] font-semibold mb-2">
                  {activeItem.chamber}
                </p>

                <h3 className="lc-font-display text-3xl xl:text-4xl font-black text-[#E8DFC8] tracking-wide leading-tight mb-4">
                  {activeItem.title}
                </h3>

                <p className="text-sm xl:text-base text-[#E8DFC8]/85 leading-relaxed mb-6">
                  {activeItem.desc}
                </p>

                <div className="flex flex-wrap items-center gap-3 mb-7 text-xs">
                  <span className="px-3 py-1.5 rounded-sm bg-[#080D0B]/90 border border-[#C69B43]/35 text-[#E8C574] font-semibold">
                    {activeItem.tag}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#080D0B]/90 border border-[#C69B43]/25 text-[#E8DFC8]/80">
                    <Calendar size={13} className="text-[#C69B43]" />
                    Feb 05–06, 2027
                  </span>
                </div>

                <Link
                  to={activeItem.link}
                  className="lc-gold-btn lc-font-heading inline-flex items-center gap-2.5 px-6 py-3.5 rounded-sm font-extrabold text-xs uppercase tracking-[0.18em] cursor-pointer group"
                >
                  <span>Register Arena</span>
                  <ArrowRight
                    size={15}
                    className="text-[#080D0B] group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </Motion.div>
            </AnimatePresence>
          </div>

          {/* Right Bespoke Temple Chamber Viewport with 3D Pointer Tilt */}
          <div className="col-span-7">
            <div
              ref={previewFrameRef}
              onPointerMove={handlePreviewPointer}
              onPointerLeave={resetPreviewPointer}
              className="relative aspect-[16/9] rounded-lg overflow-hidden border border-[#C69B43]/45 bg-[#080D0B] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.95)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
            >
              <AnimatePresence mode="wait">
                <Motion.img
                  key={activeItem.image}
                  src={activeItem.image}
                  alt={`${activeItem.title} — ${activeItem.chamber}`}
                  initial={{ opacity: 0.15, scale: 1.07 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.15, scale: 0.98 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full object-cover object-center"
                />
              </AnimatePresence>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-tr from-[#080D0B]/70 via-transparent to-[#080D0B]/40 pointer-events-none"
              />
              <div className="absolute top-3.5 left-4 px-3 py-1 rounded-sm bg-[#080D0B]/88 border border-[#C69B43]/40 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#E8C574]">
                CHAMBER {activeItem.glyph} // {activeItem.category}
              </div>
              <div className="absolute bottom-3.5 right-4 px-3 py-1 rounded-sm bg-[#080D0B]/88 border border-[#C69B43]/40 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#E8DFC8]">
                {activeItem.tag}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Interactive 6-Arena Scrub Rail */}
        <div className="relative z-10 mt-7 pt-5 border-t border-[#C69B43]/20">
          <div className="h-[2px] w-full bg-[#182B20] mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#B86B35] via-[#E8C574] to-[#C69B43]"
              style={{ width: `${Math.max(8, Math.round(scrubProgress * 100))}%` }}
            />
          </div>
          <div className="grid grid-cols-6 gap-2.5">
            {featuredEvents.map((ev, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <button
                  key={ev.title}
                  type="button"
                  onClick={() => jumpToArena(idx)}
                  className={`text-left px-3 py-2.5 rounded-sm border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-[#182B20] border-[#E8C574]/85 text-[#F3DDA0] shadow-[0_0_22px_rgba(198,155,67,0.2)]'
                      : 'bg-[#080D0B]/75 border-[#C69B43]/20 text-[#E8DFC8]/60 hover:text-[#E8DFC8] hover:border-[#C69B43]/45'
                  }`}
                >
                  <span className="block text-[9px] tracking-[0.2em] text-[#C69B43] font-bold">
                    {ev.glyph}
                  </span>
                  <span className="lc-font-heading block text-[11px] font-bold truncate mt-0.5">
                    {ev.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
