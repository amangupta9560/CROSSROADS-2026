import { useRef } from 'react';
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  Award,
  ChevronDown,
  Clock,
  Compass,
  MapPin,
  Sparkles,
  Star,
} from 'lucide-react';
import { CATEGORY_THEME } from './scheduleData.js';
import { CornerFiligree } from '../home/OrnamentDivider.jsx';
import FloatingParticles from '../home/FloatingParticles.jsx';

/**
 * Interactive Lost Civilization zig-zag stone expedition trail for Day 1 / Day 2 events.
 * Registers each card's stepping-stone pedestal ref so the 3D Explorer traverses smoothly
 * from card to card under both cursor hover and scroll focus.
 */
export default function ScheduleTimelineSection({
  activeDay,
  currentEvents,
  expandedIndex,
  setExpandedIndex,
  timelineBoundsRef,
  anchorRefs,
  activeCardIdx,
  onCardHover,
  onCardLeave,
  use3DFallback,
}) {
  const prefersReduced = useReducedMotion();
  const sectionBgRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionBgRef,
    offset: ['start end', 'end start'],
  });

  const textureY = useTransform(scrollYProgress, [0, 1], [-36, 36]);
  const watermarkX = useTransform(scrollYProgress, [0, 1], ['8%', '-16%']);

  const { scrollYProgress: spineProgress } = useScroll({
    target: timelineBoundsRef,
    offset: ['start 72%', 'end 38%'],
  });

  return (
    <section
      ref={sectionBgRef}
      aria-label="Expedition Schedule Timeline"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0C1611] overflow-hidden"
    >
      {/* Stone Relic Wall Parallax Layer */}
      <Motion.div
        aria-hidden="true"
        style={!prefersReduced ? { y: textureY } : undefined}
        className="absolute -inset-8 pointer-events-none will-change-transform"
      >
        <img
          src="/assets/lost-civilization/stone-texture.webp"
          alt=""
          loading="lazy"
          className="w-full h-full object-cover opacity-24"
        />
      </Motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#080D0B]/92 via-[#0C1712]/72 to-[#080D0B]/95 pointer-events-none"
      />

      <FloatingParticles density="sparse" />

      {/* Scrubbed Horizontal Monumental Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden mb-8 relative z-[2]"
      >
        <Motion.div
          style={!prefersReduced ? { x: watermarkX } : undefined}
          className="lc-watermark-text text-[2.2rem] sm:text-[4.2rem] lg:text-[5.8rem] whitespace-nowrap leading-none text-center will-change-transform"
        >
          CHRONICLE OF TWO DAYS • {activeDay.toUpperCase()} TRAIL
        </Motion.div>
      </div>

      {/* Interactive Guide Pill */}
      <div className="relative z-10 max-w-6xl mx-auto mb-10 sm:mb-14 text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#101D16]/90 border border-[#C69B43]/35 text-[11px] sm:text-xs font-mono text-[#E8DFC8]/85 shadow-lg">
          <Compass className="w-3.5 h-3.5 text-[#E8C574] shrink-0 animate-spin" style={{ animationDuration: '9s' }} />
          <span>
            Scroll down or move cursor onto any stone tablet to guide the{' '}
            <strong className="text-[#E8C574]">3D Temple Explorer</strong>
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#C69B43]/15 border border-[#C69B43]/40 text-[#E8C574] font-bold">
            Stop #{activeCardIdx + 1}
          </span>
        </div>
      </div>

      {/* Zig-Zag Timeline Stage */}
      <div ref={timelineBoundsRef} className="relative z-10 max-w-6xl mx-auto">
        {/* Vertical Spine Track: Left on <lg, Center on lg+ */}
        <div
          aria-hidden="true"
          className="absolute left-6 sm:left-8 lg:left-1/2 lg:-translate-x-1/2 top-2 bottom-2 w-[2px] bg-[#C69B43]/15 pointer-events-none"
        >
          <Motion.div
            className="w-full h-full origin-top bg-gradient-to-b from-[#E8C574] via-[#C69B43] to-[#B86B35]"
            style={{ scaleY: prefersReduced ? 1 : spineProgress }}
          />
        </div>

        <AnimatePresence mode="wait">
          <Motion.div
            key={activeDay}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="space-y-7 sm:space-y-10"
          >
            {currentEvents.map((event, index) => {
              const EventIcon = event.icon;
              const styleTheme = CATEGORY_THEME[event.category] || CATEGORY_THEME.general;
              const isExpanded = expandedIndex === index;
              const isActiveStop = activeCardIdx === index;
              const isLeftDesktop = index % 2 === 0;

              return (
                <Motion.div
                  key={`${activeDay}-${event.title}-${index}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.14 }}
                  transition={{
                    duration: 0.55,
                    delay: Math.min(index * 0.04, 0.2),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onMouseEnter={() => onCardHover(index)}
                  onMouseLeave={onCardLeave}
                  className={`relative pl-16 sm:pl-20 lg:pl-0 lg:w-[calc(50%-2.5rem)] ${
                    isLeftDesktop ? 'lg:mr-auto' : 'lg:ml-auto'
                  }`}
                >
                  {/* Stepping Stone Pedestal / Anchor Target for the 3D Explorer */}
                  <div
                    ref={(el) => {
                      if (anchorRefs.current) anchorRefs.current[index] = el;
                    }}
                    className={`absolute top-5 left-0 sm:left-2 lg:top-7 ${
                      isLeftDesktop ? 'lg:left-auto lg:-right-[4.25rem]' : 'lg:-left-[4.25rem]'
                    } z-20 flex items-center justify-center`}
                  >
                    <div
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl lc-stone-surface border transition-all duration-300 flex items-center justify-center ${
                        isActiveStop
                          ? `border-[#E8C574] scale-110 ${styleTheme.ringGlow}`
                          : 'border-[#C69B43]/40'
                      }`}
                    >
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${styleTheme.gem} p-0.5 flex items-center justify-center`}>
                        <div className="w-full h-full rounded-[6px] bg-[#0B140F] flex items-center justify-center">
                          <EventIcon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${styleTheme.accentText}`} />
                        </div>
                      </div>

                      {isActiveStop && (
                        <span
                          aria-hidden="true"
                          className="absolute -inset-1.5 rounded-xl border border-[#E8C574]/55 animate-ping pointer-events-none"
                          style={{ animationDuration: '2.2s' }}
                        />
                      )}

                      {/* Graceful 2D Explorer Crest Fallback if WebGL unavailable or reduced motion */}
                      {use3DFallback && isActiveStop && (
                        <Motion.div
                          layoutId="fallback-explorer"
                          aria-hidden="true"
                          className="absolute -top-3.5 -right-2.5 w-6 h-6 rounded-full bg-gradient-to-br from-[#FFE49A] to-[#B86B35] border border-[#080D0B] shadow-[0_0_14px_rgba(232,197,116,0.9)] flex items-center justify-center text-[#080D0B]"
                        >
                          <Compass className="w-3.5 h-3.5" />
                        </Motion.div>
                      )}
                    </div>
                  </div>

                  {/* Connector bridge line on lg+ */}
                  <div
                    aria-hidden="true"
                    className={`hidden lg:block absolute top-14 w-10 h-[1px] bg-gradient-to-r from-[#C69B43]/55 to-[#C69B43]/15 ${
                      isLeftDesktop ? '-right-10' : '-left-10 rotate-180'
                    }`}
                  />

                  {/* Carved Event Tablet Card */}
                  <div
                    className={`group relative rounded-xl lc-stone-surface lc-carved-border transition-all duration-300 overflow-hidden ${
                      isActiveStop || isExpanded
                        ? 'border-[#E8C574]/75 shadow-[0_24px_65px_rgba(4,7,5,0.85)]'
                        : 'hover:border-[#E8C574]/50 shadow-[0_18px_50px_rgba(4,7,5,0.68)]'
                    }`}
                  >
                    <CornerFiligree className="top-2 left-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <CornerFiligree className="bottom-2 right-2 rotate-180 opacity-45 group-hover:opacity-90 transition-opacity" />

                    <div className="p-5 sm:p-6 lg:p-7">
                      <div className="flex flex-wrap items-start justify-between gap-2.5 mb-3">
                        <div className="space-y-1">
                          <div className={`flex items-center gap-2 lc-font-heading text-base sm:text-lg lg:text-xl font-black ${styleTheme.accentText}`}>
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#E8DFC8]/70">
                            <MapPin className="w-3.5 h-3.5 text-[#C69B43] shrink-0" />
                            <span>{event.venue}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-sm bg-[#080D0B]/75 border border-[#C69B43]/25 text-[10px] font-mono text-[#E8DFC8]/80">
                            {event.duration}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-sm border text-[10px] lc-font-heading font-bold uppercase tracking-[0.16em] ${styleTheme.badge}`}
                          >
                            {event.category}
                          </span>
                        </div>
                      </div>

                      <h3 className="lc-font-heading text-xl sm:text-2xl font-bold text-[#E8DFC8] group-hover:text-[#E8C574] transition-colors mb-2">
                        {event.title}
                      </h3>

                      <p className="text-xs sm:text-sm lg:text-base text-[#E8DFC8]/75 leading-relaxed mb-4">
                        {event.description}
                      </p>

                      <button
                        type="button"
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                        className="lc-stone-btn lc-font-heading inline-flex items-center gap-2 px-4 py-2 rounded-sm text-[11px] font-bold uppercase tracking-[0.16em] text-[#E8C574] hover:border-[#E8C574] cursor-pointer"
                      >
                        <span>{isExpanded ? 'Show Less' : 'View Details'}</span>
                        <Motion.span
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="inline-flex"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Motion.span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <Motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="border-t border-[#C69B43]/25 bg-[#080D0B]/75 overflow-hidden"
                        >
                          <div className="p-5 sm:p-6 grid sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-[#101D16]/85 border border-[#C69B43]/25">
                              <h4 className="lc-font-heading text-xs sm:text-sm font-bold text-[#E8C574] uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 shrink-0" />
                                <span>Event Highlights</span>
                              </h4>
                              <p className="text-xs sm:text-sm text-[#E8DFC8]/80 leading-relaxed mb-3">
                                {event.description} Join us for an unforgettable experience with
                                exciting challenges and amazing prizes!
                              </p>
                              <div className="flex items-center gap-2.5 text-xs">
                                <div className="p-1.5 rounded bg-[#182B20] border border-[#C69B43]/30 text-[#E8C574]">
                                  <MapPin className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <span className="block text-[10px] uppercase tracking-wider text-[#E8DFC8]/55">
                                    Venue
                                  </span>
                                  <span className="font-semibold text-[#E8DFC8]">
                                    {event.venue}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2.5">
                              <h4 className="lc-font-heading text-xs sm:text-sm font-bold text-[#E8C574] uppercase tracking-wider flex items-center gap-2">
                                <Award className="w-4 h-4 shrink-0" />
                                <span>Quick Info</span>
                              </h4>
                              <div className="flex justify-between items-center text-xs p-2.5 rounded bg-[#101D16]/80 border border-[#C69B43]/20">
                                <span className="text-[#E8DFC8]/65">Duration</span>
                                <span className={`font-bold ${styleTheme.accentText}`}>
                                  {event.duration}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs p-2.5 rounded bg-[#101D16]/80 border border-[#C69B43]/20">
                                <span className="text-[#E8DFC8]/65">Category</span>
                                <span className={`capitalize font-bold ${styleTheme.accentText}`}>
                                  {event.category}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs p-2.5 rounded bg-[#101D16]/80 border border-[#C69B43]/20">
                                <span className="text-[#E8DFC8]/65">Day</span>
                                <span className="font-bold text-[#E8DFC8]">{activeDay}</span>
                              </div>
                              <div className="flex items-center justify-center gap-2 text-xs p-2.5 rounded bg-gradient-to-r from-[#C69B43]/25 to-[#B86B35]/25 border border-[#E8C574]/40 text-[#E8C574] font-bold uppercase tracking-wider">
                                <Star className="w-3.5 h-3.5 fill-[#E8C574]" />
                                <span>Featured Event</span>
                              </div>
                            </div>
                          </div>
                        </Motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Motion.div>
              );
            })}
          </Motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
