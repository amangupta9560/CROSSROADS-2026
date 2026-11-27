import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { uniqueFeatures } from './aboutData.js';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';
import { AncientSunDisc } from './JungleCanopyVectors.jsx';

gsap.registerPlugin(ScrollTrigger);

function RelicCard({ feature, idx, isMobileCard = false }) {
  const cardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const Icon = feature.icon;

  const onMove = (e) => {
    if (prefersReducedMotion || !cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const rx = (0.5 - (e.clientY - rect.top) / rect.height) * 7;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 7;
    cardRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
    cardRef.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  };

  const onLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <article
      className={
        isMobileCard
          ? 'snap-center shrink-0 w-[84vw] sm:w-[60vw] md:w-[46vw]'
          : `shrink-0 w-[340px] xl:w-[390px] ${idx % 2 === 1 ? 'lg:translate-y-4' : ''}`
      }
    >
      <div
        ref={cardRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative h-full min-h-[290px] rounded-xl lc-stone-surface lc-carved-border p-7 sm:p-8 flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), rgba(198, 155, 67, 0.22), transparent 65%)',
          }}
        />

        <CornerFiligree className="absolute top-2.5 left-2.5 opacity-65 group-hover:opacity-100 transition-opacity" />
        <CornerFiligree className="absolute bottom-2.5 right-2.5 rotate-180 opacity-65 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="w-12 h-12 rounded-md bg-[#080D0B]/90 border border-[#C69B43]/45 flex items-center justify-center text-[#E8C574] group-hover:scale-105 transition-transform">
              <Icon size={22} />
            </div>
            <span className="lc-font-heading text-[10px] tracking-[0.24em] text-[#C69B43] font-bold uppercase">
              {feature.rune}
            </span>
          </div>

          <h3 className="lc-font-display text-xl sm:text-2xl font-black text-[#E8DFC8] group-hover:text-[#F3DDA0] transition-colors mb-3 leading-snug">
            {feature.title}
          </h3>
          <p className="text-sm text-[#E8DFC8]/80 leading-relaxed">{feature.desc}</p>
        </div>

        <div
          aria-hidden="true"
          className="relative z-10 mt-6 pt-4 border-t border-[#C69B43]/20 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-[#C69B43]/80 font-semibold"
        >
          <span>CROSSROADS 2027</span>
          <span>RELIC ARTIFACT</span>
        </div>
      </div>
    </article>
  );
}

export default function FeatureChambers() {
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [progress, setProgress] = useState(0);

  const sectionRef = useRef(null);
  const trackWrapperRef = useRef(null);
  const trackRef = useRef(null);
  const mobileTrackRef = useRef(null);
  const stRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Desktop Pinned Horizontal Scroll Track
  useEffect(() => {
    if (prefersReducedMotion || !isDesktop || !sectionRef.current || !trackRef.current || !trackWrapperRef.current) {
      return undefined;
    }

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const getDistance = () => {
        const scrollW = trackRef.current?.scrollWidth || 0;
        const containerW = trackWrapperRef.current?.clientWidth || window.innerWidth;
        return Math.max(0, scrollW - containerW + 64);
      };

      const tween = gsap.to(trackRef.current, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${Math.max(1000, getDistance() + 300)}`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 3,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      stRef.current = tween.scrollTrigger;
      return () => {
        stRef.current = null;
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [prefersReducedMotion, isDesktop]);

  const stepScroll = (direction) => {
    const st = stRef.current;
    if (st && isDesktop && !prefersReducedMotion) {
      const target = st.start + (st.end - st.start) * Math.min(1, Math.max(0, progress + direction * 0.25));
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (mobileTrackRef.current) {
      mobileTrackRef.current.scrollBy({ left: direction * 300, behavior: 'smooth' });
    }
  };

  if (!isDesktop || prefersReducedMotion) {
    return (
      <section
        aria-label="What Makes CROSSROADS Different"
        style={{ zIndex: 50 }}
        className="relative py-18 sm:py-24 bg-[#080D0B] rounded-t-[1.5rem] sm:rounded-t-[2.25rem] border-t border-[#C69B43]/40 shadow-[0_-28px_85px_rgba(0,0,0,0.92)] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
          <Motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/35 text-[#E8C574] text-[10px] uppercase tracking-[0.24em] font-semibold mb-3">
              <Compass size={12} className="text-[#C69B43]" />
              <span>Core Architecture</span>
            </span>
            <h2 className="lc-font-display text-3xl sm:text-4xl font-black text-[#E8DFC8] tracking-wide">
              WHAT MAKES <span className="lc-gold-text">CROSSROADS</span> DIFFERENT
            </h2>
            <TempleDivider className="mt-3.5" />
          </Motion.div>
        </div>

        <div
          ref={mobileTrackRef}
          className="flex gap-4 px-5 sm:px-8 pb-4 overflow-x-auto snap-x snap-mandatory lc-no-scrollbar"
        >
          {uniqueFeatures.map((f, idx) => (
            <RelicCard key={f.title} feature={f} idx={idx} isMobileCard />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="What Makes CROSSROADS Different"
      style={{ zIndex: 50 }}
      className="relative min-h-[100dvh] w-full flex flex-col justify-center py-20 bg-[#080D0B] rounded-t-[2.25rem] border-t border-[#C69B43]/45 shadow-[0_-32px_90px_rgba(0,0,0,0.95)] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-[2px] z-30 bg-gradient-to-r from-transparent via-[#E8C574]/85 to-transparent"
      />

      <div
        aria-hidden="true"
        style={{ transform: `translate3d(${Math.round(progress * -180)}px, 0, 0)` }}
        className="lc-watermark-text absolute top-14 left-12 text-[8vw] whitespace-nowrap font-black uppercase leading-none will-change-transform"
      >
        ANCIENT RELICS • CORE PILLARS
      </div>

      {/* Scroll-Synced Rotating Sun Disc */}
      <div
        aria-hidden="true"
        style={{ transform: `rotate(${Math.round(progress * 120)}deg)` }}
        className="pointer-events-none absolute -right-24 bottom-8 w-80 h-80 opacity-[0.07] transition-transform duration-100 ease-out"
      >
        <AncientSunDisc className="w-full h-full" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 mb-8 flex items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/35 text-[#E8C574] text-[11px] uppercase tracking-[0.26em] font-semibold mb-3">
            <Compass size={12} className="text-[#C69B43]" />
            <span>Core Architecture // Scroll Horizontally</span>
          </span>
          <h2 className="lc-font-display text-3xl lg:text-5xl font-black text-[#E8DFC8] tracking-wide">
            WHAT MAKES <span className="lc-gold-text">CROSSROADS</span> DIFFERENT
          </h2>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => stepScroll(-1)}
            aria-label="Scroll features left"
            className="w-10 h-10 rounded-sm bg-[#101D16] border border-[#C69B43]/40 hover:border-[#E8C574] text-[#E8C574] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => stepScroll(1)}
            aria-label="Scroll features right"
            className="w-10 h-10 rounded-sm bg-[#101D16] border border-[#C69B43]/40 hover:border-[#E8C574] text-[#E8C574] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={trackWrapperRef} className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 overflow-hidden">
        <div ref={trackRef} className="flex gap-6 py-6 will-change-transform">
          {uniqueFeatures.map((feature, idx) => (
            <RelicCard key={feature.title} feature={feature} idx={idx} />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 mt-6">
        <div className="h-[2px] w-full bg-[#182B20] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B86B35] via-[#E8C574] to-[#C69B43]"
            style={{ width: `${Math.max(12, Math.round(progress * 100))}%` }}
          />
        </div>
      </div>
    </section>
  );
}
