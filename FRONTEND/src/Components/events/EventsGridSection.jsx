import { useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Calendar, ChevronRight, FileText } from 'lucide-react';
import { CATEGORY_BADGE_MAP } from './eventsData.js';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';
import FloatingParticles from '../home/FloatingParticles.jsx';

function EventChamberCard({ event, onClick, index }) {
  const [loaded, setLoaded] = useState(false);
  const cardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const hasRules = !!event.rulesPdf;

  const handlePointerMove = (e) => {
    if (prefersReducedMotion || !cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const rx = (0.5 - (e.clientY - rect.top) / rect.height) * 6;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    cardRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
    cardRef.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  };

  const handlePointerLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.035, 0.25), ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <article
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className="group relative h-full rounded-lg lc-stone-surface lc-carved-border overflow-hidden flex flex-col justify-between cursor-pointer transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C574]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
          style={{
            background:
              'radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), rgba(198, 155, 67, 0.24), transparent 65%)',
          }}
        />

        <CornerFiligree className="absolute top-2 left-2 z-20 opacity-65 group-hover:opacity-100 transition-opacity" />

        <div>
          <div className="relative h-52 sm:h-56 overflow-hidden bg-[#080D0B]">
            {!loaded && <div className="absolute inset-0 bg-[#182B20]/70 animate-pulse" />}
            <img
              className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108 ${
                loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
              src={event.imageSrc}
              alt={event.name}
              loading="lazy"
              onLoad={() => setLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101D16] via-[#101D16]/35 to-[#080D0B]/40" />

            <div className="absolute top-3.5 right-3.5 z-10">
              <span
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] rounded-sm shadow-md ${
                  CATEGORY_BADGE_MAP[event.category] || 'bg-[#C69B43] text-[#080D0B]'
                }`}
              >
                {event.category}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 pb-4">
            <h3 className="lc-font-heading text-lg sm:text-xl font-bold text-[#E8DFC8] mb-2 group-hover:text-[#F3DDA0] transition-colors duration-300 leading-snug">
              {event.name}
            </h3>
            <p className="text-sm text-[#E8DFC8]/75 line-clamp-2 leading-relaxed">
              {event.details.description}
            </p>
          </div>
        </div>

        <div className="px-5 sm:px-6 pb-5 pt-3.5 border-t border-[#C69B43]/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#E8DFC8]/75 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#C69B43]" />
            <span>{event.dayBadge}</span>
          </div>

          <div className="flex items-center gap-3.5">
            {hasRules && (
              <a
                href={event.rulesPdf}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#E8C574] hover:text-[#FFF0BF] transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#C69B43]" />
                <span>Rules</span>
              </a>
            )}

            <div className="lc-font-heading inline-flex items-center gap-0.5 text-[#E8C574] text-xs font-bold uppercase tracking-wider group-hover:translate-x-0.5 transition-transform duration-300">
              <span>Details</span>
              <ChevronRight className="w-4 h-4 text-[#C69B43]" />
            </div>
          </div>
        </div>

        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C69B43] to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
      </article>
    </Motion.div>
  );
}

export default function EventsGridSection({
  categories,
  filter,
  setFilter,
  filteredEvents,
  onSelectEvent,
}) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const watermarkX = useTransform(scrollYProgress, [0, 1], ['8%', '-22%']);
  const textureParallaxY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section
      ref={sectionRef}
      aria-label="Flagship Arenas Catalog"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0D1711] overflow-hidden"
    >
      {/* Parallax Moss & Stone Texture Plane */}
      <Motion.div
        aria-hidden="true"
        style={!prefersReducedMotion ? { y: textureParallaxY } : undefined}
        className="absolute -inset-12 pointer-events-none opacity-35 will-change-transform"
        >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "url('/assets/lost-civilization/moss-stone-texture.webp')",
            backgroundSize: '440px 440px',
            backgroundRepeat: 'repeat',
          }}
        />
      </Motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#080D0B]/92 via-[#0D1711]/78 to-[#080D0B]/94 pointer-events-none"
      />

      <FloatingParticles density="sparse" />

      {/* Scrubbed Background Watermark */}
      <Motion.div
        aria-hidden="true"
        style={!prefersReducedMotion ? { x: watermarkX } : undefined}
        className="lc-watermark-text absolute top-20 left-0 text-[10vw] whitespace-nowrap font-black uppercase leading-none will-change-transform"
      >
        11 ANCIENT CHAMBERS • CROSSROADS 2027
      </Motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-sm bg-[#080D0B]/90 border border-[#C69B43]/35 text-[#E8C574] text-[10px] sm:text-[11px] uppercase tracking-[0.26em] font-semibold mb-3">
            The 11 Temple Chambers
          </span>
          <h2 className="lc-font-display text-3xl sm:text-5xl font-black text-[#E8DFC8] tracking-wide">
            CHOOSE YOUR <span className="lc-gold-text">ARENA</span>
          </h2>
          <TempleDivider className="mt-4" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <div className="inline-flex flex-wrap justify-center gap-1.5 p-1.5 rounded-md bg-[#080D0B]/90 border border-[#C69B43]/30">
            {categories.map((cat) => {
              const isSelected = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`relative lc-font-heading px-4 sm:px-5 py-2.5 rounded-sm text-xs sm:text-sm font-bold uppercase tracking-[0.12em] transition-colors duration-300 cursor-pointer ${
                    isSelected ? 'text-[#080D0B]' : 'text-[#E8DFC8]/75 hover:text-[#E8DFC8]'
                  }`}
                >
                  {isSelected && (
                    <Motion.span
                      layoutId="eventsCategoryPill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-sm bg-gradient-to-r from-[#DFB961] via-[#C69B43] to-[#9E6327] shadow-md"
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>

          <span className="px-3 py-1.5 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/25 text-[11px] uppercase tracking-[0.18em] text-[#E8C574] font-semibold">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'Arena' : 'Arenas'}
          </span>
        </div>

        <Motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredEvents.map((event, i) => (
              <EventChamberCard
                key={event.id}
                event={event}
                index={i}
                onClick={() => onSelectEvent(event)}
              />
            ))}
          </AnimatePresence>
        </Motion.div>
      </div>
    </section>
  );
}
