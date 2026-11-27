import { useEffect, useRef, useState } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { Compass, MapPin } from 'lucide-react';
import { expeditionStats } from './homeData.js';
import { CornerFiligree, TempleDivider } from './OrnamentDivider.jsx';

function AnimatedCounter({ target, prefix = '', suffix = '', formatComma = false, fallbackValue }) {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(() =>
    prefersReducedMotion ? fallbackValue : `${prefix}0${suffix}`
  );
  const ref = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const node = ref.current;
    if (!node) return undefined;

    let rafId = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        observer.disconnect();

        const duration = 1250;
        const start = performance.now();

        const step = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.max(0, Math.round(target * eased));
          const formatted = formatComma ? current.toLocaleString('en-US') : String(current);
          setDisplay(`${prefix}${formatted}${suffix}`);
          if (progress < 1) {
            rafId = window.requestAnimationFrame(step);
          } else {
            setDisplay(fallbackValue);
          }
        };

        rafId = window.requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(rafId);
    };
  }, [target, prefix, suffix, formatComma, fallbackValue, prefersReducedMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefersReducedMotion ? fallbackValue : display}
    </span>
  );
}

function StatMonolith({ stat, idx }) {
  const cardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const Icon = stat.icon;

  const handleMove = (e) => {
    if (prefersReducedMotion || !cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <Motion.div
      ref={cardRef}
      onPointerMove={handleMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-lg lc-stone-surface lc-carved-border p-4 sm:p-7 text-center overflow-hidden hover:border-[#C69B43]/65 hover:-translate-y-1 transition-all duration-300"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(198, 155, 67, 0.2), transparent 65%)',
        }}
      />

      <CornerFiligree className="absolute top-1.5 left-1.5 opacity-45 group-hover:opacity-95 transition-opacity" />
      <CornerFiligree className="absolute bottom-1.5 right-1.5 rotate-180 opacity-45 group-hover:opacity-95 transition-opacity" />

      <div className="relative w-12 h-12 rounded-md bg-[#080D0B]/88 border border-[#C69B43]/40 flex items-center justify-center mx-auto mb-3.5 text-[#C69B43] group-hover:scale-105 group-hover:border-[#E8C574] transition-all duration-300">
        <Icon size={22} />
      </div>

      <span className="relative block text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[#C69B43]/90 font-semibold mb-1.5">
        {stat.rune}
      </span>

      <div className="relative lc-font-heading lc-gold-text text-2xl sm:text-5xl font-black tracking-tight leading-none mb-2">
        <AnimatedCounter
          target={stat.numericTarget}
          prefix={stat.prefix || ''}
          suffix={stat.suffix || ''}
          formatComma={stat.formatComma}
          fallbackValue={stat.value}
        />
      </div>

      <p className="relative text-[11px] sm:text-sm text-[#E8DFC8]/85 font-medium">{stat.label}</p>
    </Motion.div>
  );
}

export default function StatsSection() {
  return (
    <section
      id="scale"
      aria-label="Expedition Statistics"
      className="relative z-10 py-18 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#080D0B] border-t border-[#C69B43]/20 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/lost-civilization/stone-texture.webp')",
          backgroundSize: '360px 360px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#080D0B] via-transparent to-[#080D0B] pointer-events-none"
      />

      <div className="relative max-w-6xl mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.26em] text-[#C69B43]/90 font-semibold mb-3">
            <MapPin size={12} className="text-[#C69B43] shrink-0" />
            <span>28.6692° N • 77.4538° E // HIET GHAZIABAD EXPEDITION</span>
          </p>

          <h2 className="lc-font-display text-3xl sm:text-5xl font-black tracking-wide text-[#E8DFC8]">
            THE SCALE OF THE <span className="lc-gold-text">EXPEDITION</span>
          </h2>
          <TempleDivider className="mt-4 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto text-left mb-10 sm:mb-12">
            <Motion.div
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-lg bg-[#101D16]/85 border border-[#C69B43]/28 p-5 sm:p-6 hover:border-[#C69B43]/55 transition-colors"
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#E8C574] font-bold mb-2">
                <Compass size={13} className="text-[#C69B43]" />
                <span>THE AWAKENED CIVILIZATION</span>
              </div>
              <p className="text-xs sm:text-sm text-[#E8DFC8]/80 leading-relaxed">
                A mysterious ancient civilization has awakened deep inside an unexplored jungle.
                Enter the forgotten chambers, conquer the technical and cultural trials, and claim
                your place in history.
              </p>
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-lg bg-[#101D16]/85 border border-[#C69B43]/28 p-5 sm:p-6 hover:border-[#C69B43]/55 transition-colors"
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#E8C574] font-bold mb-2">
                <Compass size={13} className="text-[#B86B35]" />
                <span>EXPEDITION PROTOCOL</span>
              </div>
              <p className="text-xs sm:text-sm text-[#E8DFC8]/80 leading-relaxed">
                One destination. Infinite possibilities. An adventure beyond imagination uniting
                coders, roboticists, builders, and performers across North India at HIET Ghaziabad.
              </p>
            </Motion.div>
          </div>
        </Motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {expeditionStats.map((stat, idx) => (
            <StatMonolith key={stat.label} stat={stat} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
