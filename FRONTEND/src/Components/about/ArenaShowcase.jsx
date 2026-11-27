import { useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import { eventTypes } from './aboutData.js';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';
import { Link } from 'react-router-dom';

export default function ArenaShowcase() {
  const [activeChamber, setActiveChamber] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const chamberParallaxY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const current = eventTypes[activeChamber] || eventTypes[0];

  return (
    <section
      ref={sectionRef}
      aria-label="Arenas and Domains"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 lc-moss-surface overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#080D0B]/90 border border-[#C69B43]/35 text-[#E8C574] text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold mb-3">
              <Compass size={12} className="text-[#C69B43]" />
              <span>Competition Matrix</span>
            </span>
            <h2 className="lc-font-display text-3xl sm:text-5xl font-black text-[#E8DFC8] tracking-wide">
              ARENAS &amp; <span className="lc-gold-text">DOMAINS</span>
            </h2>
          </div>

          <Link
            to="/events"
            className="lc-stone-btn lc-font-heading inline-flex items-center gap-2 px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-[0.16em] cursor-pointer w-fit"
          >
            <span>Open Full Arena Catalog</span>
            <ArrowRight size={15} className="text-[#C69B43]" />
          </Link>
        </Motion.div>

        <TempleDivider className="mb-10" />

        {/* Featured Interactive Chamber Spotlight with Parallax Depth */}
        <Motion.div
          style={!prefersReducedMotion ? { y: chamberParallaxY } : undefined}
          className="rounded-xl lc-stone-surface lc-carved-border p-5 sm:p-8 mb-8 relative overflow-hidden will-change-transform"
        >
          <CornerFiligree className="absolute top-2.5 left-2.5 opacity-80" />
          <CornerFiligree className="absolute top-2.5 right-2.5 rotate-90 opacity-80" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-[#C69B43]/40 bg-[#080D0B]">
                <AnimatePresence mode="wait">
                  <Motion.img
                    key={current.image}
                    src={current.image}
                    alt={`${current.category} Temple Chamber`}
                    initial={{ opacity: 0.2, scale: 1.07 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.2, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#080D0B]/80 via-transparent to-[#080D0B]/30" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-sm bg-[#080D0B]/90 border border-[#C69B43]/40 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E8C574]">
                    {current.chamber}
                  </span>
                  <span className="px-2.5 py-1 rounded-sm bg-[#182B20]/90 border border-[#C69B43]/40 text-[10px] font-bold text-[#E8DFC8]">
                    {current.badge}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="flex flex-wrap gap-2 mb-5">
                {eventTypes.map((et, idx) => {
                  const active = idx === activeChamber;
                  return (
                    <button
                      key={et.category}
                      type="button"
                      onClick={() => setActiveChamber(idx)}
                      className={`px-3 py-1.5 rounded-sm border text-[11px] font-bold uppercase tracking-[0.12em] transition-all cursor-pointer ${active
                        ? 'lc-gold-btn border-transparent'
                        : 'bg-[#080D0B]/85 border-[#C69B43]/30 text-[#E8DFC8]/75 hover:text-[#E8DFC8]'
                        }`}
                    >
                      0{idx + 1} · {et.category.split('&')[0].trim()}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <Motion.div
                  key={current.category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="lc-font-display text-2xl sm:text-3xl font-black text-[#E8DFC8] mb-4">
                    {current.category}
                  </h3>
                  <ul className="space-y-2.5 mb-5">
                    {current.events.map((ev) => (
                      <li
                        key={ev}
                        className="flex items-center gap-3 text-sm sm:text-base text-[#E8DFC8]/90 py-1.5 border-b border-[#C69B43]/15 last:border-b-0"
                      >
                        <ArrowRight size={15} className="text-[#C69B43] shrink-0" />
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/events"
                    className="lc-font-heading inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E8C574] hover:text-[#FFF3CF]"
                  >
                    <span>Explore Arena Rules &amp; Details</span>
                    <ArrowRight size={14} className="text-[#C69B43]" />
                  </Link>
                </Motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Motion.div>

        {/* All 4 Domain Chambers Visible Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eventTypes.map((eventType, idx) => {
            const isSelected = idx === activeChamber;
            return (
              <Motion.div
                key={eventType.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setActiveChamber(idx)}
                className={`group rounded-lg lc-stone-surface p-6 sm:p-8 border transition-all duration-300 cursor-pointer relative overflow-hidden ${isSelected
                  ? 'border-[#E8C574]/75 shadow-[0_18px_45px_-14px_rgba(198,155,67,0.28)]'
                  : 'border-[#C69B43]/28 hover:border-[#C69B43]/60'
                  }`}
              >
                <CornerFiligree className="absolute top-2 right-2 rotate-90 opacity-50 group-hover:opacity-95 transition-opacity" />

                <div className="flex items-center justify-between gap-3 mb-5">
                  <h3 className="lc-font-heading text-xl sm:text-2xl font-bold text-[#E8DFC8] group-hover:text-[#F3DDA0] transition-colors">
                    {eventType.category}
                  </h3>
                  <span className="px-2.5 py-1 rounded-sm bg-[#080D0B]/90 border border-[#C69B43]/40 text-[10px] font-bold tracking-[0.14em] text-[#E8C574] shrink-0">
                    {eventType.badge}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {eventType.events.map((ev) => (
                    <li
                      key={ev}
                      className="flex items-center gap-3 text-[#E8DFC8]/85 text-sm sm:text-base py-1.5 border-b border-[#C69B43]/15 last:border-b-0"
                    >
                      <ArrowRight size={14} className="text-[#C69B43] shrink-0" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </Motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
