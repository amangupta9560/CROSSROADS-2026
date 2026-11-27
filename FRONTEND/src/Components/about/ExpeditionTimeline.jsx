import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Clock, Compass, MapPin } from 'lucide-react';
import { timelineMilestones } from './aboutData.js';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function ExpeditionTimeline() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const mobileLineRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const mapParallaxY = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return undefined;

    const ctx = gsap.context(() => {
      if (pathRef.current) {
        const len = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            end: 'center center',
            scrub: 0.65,
            refreshPriority: 2,
          },
        });
      }

      if (mobileLineRef.current) {
        gsap.fromTo(
          mobileLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              end: 'bottom 65%',
              scrub: 0.6,
              refreshPriority: 2,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="The Expedition Timeline"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0E1611] overflow-hidden"
    >
      {/* Parallax Ancient Map Backdrop */}
      <Motion.div
        aria-hidden="true"
        style={!prefersReducedMotion ? { y: mapParallaxY } : undefined}
        className="absolute -inset-8 pointer-events-none opacity-40 will-change-transform"
      >
        <img
          src="/assets/lost-civilization/parchment-map.webp"
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </Motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#080D0B]/85 via-[#0E1611]/70 to-[#080D0B]/92 pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#080D0B]/90 border border-[#C69B43]/35 text-[#E8C574] text-[10px] sm:text-[11px] uppercase tracking-[0.26em] font-semibold mb-4">
            <Compass size={13} className="text-[#C69B43]" />
            <span>Schedule Telemetry // Official 2027 Timeline</span>
          </span>
          <h2 className="lc-font-display text-3xl sm:text-5xl font-black text-[#E8DFC8] tracking-wide">
            THE EXPEDITION <span className="lc-gold-text">TIMELINE</span>
          </h2>
          <TempleDivider className="my-4" />
          <p className="inline-flex items-center gap-2 text-xs text-[#E8DFC8]/75 tracking-[0.16em] uppercase">
            <Clock size={13} className="text-[#C69B43]" />
            <span>28.6733° N, 77.4913° E • HIET • GZB</span>
          </p>
        </Motion.div>

        <div className="hidden lg:block relative mb-4">
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 120"
            fill="none"
            className="w-full h-24 overflow-visible"
            preserveAspectRatio="none"
          >
            <path
              d="M 110 60 C 260 15, 360 105, 500 60 C 640 15, 740 105, 890 60"
              stroke="rgba(198,155,67,0.22)"
              strokeWidth="2.5"
              strokeDasharray="8 8"
            />
            <path
              ref={pathRef}
              d="M 110 60 C 260 15, 360 105, 500 60 C 640 15, 740 105, 890 60"
              stroke="#E8C574"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="relative">
          <div className="lg:hidden absolute left-5 top-4 bottom-4 w-[2px] bg-[#C69B43]/20 pointer-events-none">
            <div ref={mobileLineRef} className="w-full h-full bg-gradient-to-b from-[#E8C574] to-[#B86B35]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {timelineMilestones.map((m, idx) => (
              <Motion.div
                key={m.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-12 lg:pl-0"
              >
                <span
                  aria-hidden="true"
                  className="lg:hidden absolute left-[13px] top-7 w-4 h-4 rounded-full bg-[#080D0B] border-2 border-[#E8C574] shadow-[0_0_10px_rgba(232,197,116,0.7)]"
                />

                <div className="relative rounded-xl lc-stone-surface lc-carved-border p-6 sm:p-8 hover:border-[#C69B43]/70 transition-colors h-full">
                  <CornerFiligree className="absolute top-2 left-2 opacity-65" />
                  <CornerFiligree className="absolute bottom-2 right-2 rotate-180 opacity-65" />

                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="lc-font-heading px-3 py-1 rounded-sm bg-[#080D0B]/90 border border-[#C69B43]/50 text-xs font-bold text-[#E8C574] tracking-widest">
                      {m.step}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#C69B43] font-bold">
                      MILESTONE
                    </span>
                  </div>

                  <span className="block text-xs uppercase tracking-[0.2em] text-[#E8DFC8]/75 font-semibold mb-1.5">
                    {m.label}
                  </span>
                  <h3 className="lc-font-display lc-gold-text text-xl sm:text-2xl font-black mb-2">
                    {m.date}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#E8DFC8]/80 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#C69B43] shrink-0" />
                    <span>{m.detail}</span>
                  </p>
                </div>
              </Motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
