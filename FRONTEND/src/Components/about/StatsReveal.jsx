import { useEffect, useRef, useState } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { aboutStats } from './aboutData.js';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';
import GhostTypeText from './GhostTypeText.jsx';

function StatCounter({ target, prefix = '', suffix = '', formatComma = false, fallback }) {
  const prefersReducedMotion = useReducedMotion();
  const [val, setVal] = useState(() => (prefersReducedMotion ? fallback : `${prefix}0${suffix}`));
  const ref = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    let rafId = 0;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || doneRef.current) return;
        doneRef.current = true;
        obs.disconnect();

        const start = performance.now();
        const duration = 1200;
        const step = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const current = Math.round(target * eased);
          const text = formatComma ? current.toLocaleString('en-US') : String(current);
          setVal(`${prefix}${text}${suffix}`);
          if (p < 1) rafId = window.requestAnimationFrame(step);
          else setVal(fallback);
        };
        rafId = window.requestAnimationFrame(step);
      },
      { threshold: 0.25 }
    );

    obs.observe(node);
    return () => {
      obs.disconnect();
      window.cancelAnimationFrame(rafId);
    };
  }, [target, prefix, suffix, formatComma, fallback, prefersReducedMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefersReducedMotion ? fallback : val}
    </span>
  );
}

export default function StatsReveal() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const evenY = useTransform(scrollYProgress, [0, 1], [18, -12]);
  const oddY = useTransform(scrollYProgress, [0, 1], [38, -22]);

  return (
    <section
      ref={sectionRef}
      aria-label="By The Numbers"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 lc-moss-surface overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="inline-block px-3.5 py-1 rounded-sm bg-[#080D0B]/90 border border-[#C69B43]/35 text-[#E8C574] text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold mb-3">
              Scale &amp; Telemetry
            </span>
            <h2 className="lc-font-display text-3xl sm:text-5xl font-black text-[#E8DFC8] tracking-wide mb-2">
              BY THE <span className="lc-gold-text">NUMBERS</span>
            </h2>
            <GhostTypeText
              text="EXPEDITION METRICS // "
              completions={[
                '1,500+ INNOVATORS EXPECTED',
                '11 FLAGSHIP ARENAS',
                '₹1L+ TOTAL PRIZE POOL',
                '50+ COLLEGES COMPETING',
              ]}
              className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#E8DFC8]/80"
              accentColor="#E8C574"
            />
          </div>

          <p className="text-[#E8DFC8]/80 text-sm sm:text-base max-w-md leading-relaxed">
            Measured across 11 competitive arenas hosted at HIET Ghaziabad on 05 &amp; 06 Feb 2027.
          </p>
        </Motion.div>

        <TempleDivider className="mb-10" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {aboutStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Motion.div
                key={stat.label}
                style={!prefersReducedMotion ? { y: idx % 2 === 0 ? evenY : oddY } : undefined}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-lg lc-stone-surface lc-carved-border p-5 sm:p-7 overflow-hidden hover:border-[#C69B43]/70 hover:-translate-y-1 transition-all duration-300 will-change-transform"
              >
                <CornerFiligree className="absolute top-1.5 left-1.5 opacity-55 group-hover:opacity-95 transition-opacity" />
                <CornerFiligree className="absolute bottom-1.5 right-1.5 rotate-180 opacity-55 group-hover:opacity-95 transition-opacity" />

                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="w-11 h-11 rounded-md bg-[#080D0B]/90 border border-[#C69B43]/40 flex items-center justify-center text-[#E8C574] group-hover:scale-105 transition-transform">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] tracking-[0.22em] font-bold text-[#C69B43] uppercase">
                    {stat.tag}
                  </span>
                </div>

                <div className="lc-font-display lc-gold-text text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none mb-2">
                  <StatCounter
                    target={stat.numericTarget}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    formatComma={stat.formatComma}
                    fallback={stat.value}
                  />
                </div>

                <p className="text-xs sm:text-sm text-[#E8DFC8]/85 font-medium">{stat.label}</p>
              </Motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
