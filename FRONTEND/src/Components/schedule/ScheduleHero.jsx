import { useRef } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Calendar, Clock, Compass, Sparkles, Zap } from 'lucide-react';
import FloatingParticles from '../home/FloatingParticles.jsx';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';
import Breadcrumbs from '../common/Breadcrumbs.jsx';
import GhostTypeText from '../about/GhostTypeText.jsx';
import {
  AncientSunDisc,
  JungleFoliageLeft,
  JungleFoliageRight,
} from '../about/JungleCanopyVectors.jsx';

const SCHEDULE_COMPLETIONS = [
  'Day 01 (Feb 05): Inauguration, Robotics, Code Puzzle, Rock Band.',
  'Day 02 (Feb 06): Treasure Hunt, Short Film, Food Without Fire, Awards.',
  'Hover cards or scroll down to guide the 3D Temple Explorer.',
];

/**
 * Lost Civilization Parchment Map & Expedition Horizon hero section for the Schedule page.
 */
export default function ScheduleHero({
  countdown,
  scheduleData,
  activeDay,
  setActiveDay,
  onResetExpanded,
  totalEvents,
}) {
  const heroRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.03, 1.18]);
  const mapY = useTransform(scrollYProgress, [0, 1], [0, 62]);
  const foliageY = useTransform(scrollYProgress, [0, 1], [0, -68]);
  const discRotate = useTransform(scrollYProgress, [0, 1], [0, 58]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 42]);

  return (
    <section
      ref={heroRef}
      aria-label="CROSSROADS 2027 Event Schedule"
      className="relative min-h-[90dvh] pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#080D0B] flex flex-col justify-center"
    >
      {/* Distinct Schedule Background: Ancient Parchment Expedition Map over Treasure Arena */}
      <Motion.div
        aria-hidden="true"
        style={!prefersReduced ? { scale: bgScale, y: mapY } : undefined}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <img
          src="/assets/lost-civilization/arena-treasure-hunt.webp"
          alt="CROSSROADS 2027 Ancient Trail Horizon"
          className="w-full h-full object-cover opacity-34"
        />
        <img
          src="/assets/lost-civilization/parchment-map.webp"
          alt="Ancient Lost Civilization parchment trail map overlay"
          className="w-full h-full object-cover opacity-28 mix-blend-screen"
        />
        <div
          aria-hidden="true"
          className="lc-animate-sunbeam absolute -top-24 left-[12%] w-48 sm:w-72 h-[140%] bg-gradient-to-b from-[#F3DDA0]/20 via-[#C69B43]/8 to-transparent blur-xl origin-top"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(198,155,67,0.16)_0%,rgba(16,29,22,0.74)_52%,rgba(8,13,11,0.98)_100%)]" />
      </Motion.div>

      {/* Scroll-Rotating Carved Astrolabe */}
      <Motion.div
        aria-hidden="true"
        style={!prefersReduced ? { rotate: discRotate } : undefined}
        className="pointer-events-none absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-[30rem] sm:w-[44rem] opacity-[0.09] z-[1] text-[#C69B43] will-change-transform"
      >
        <AncientSunDisc className="w-full h-auto" />
      </Motion.div>

      <Motion.div
        aria-hidden="true"
        style={!prefersReduced ? { y: foliageY } : undefined}
        className="absolute bottom-0 left-0 w-36 sm:w-56 lg:w-72 opacity-75 pointer-events-none z-[2] will-change-transform"
      >
        <JungleFoliageLeft className="w-full h-auto" />
      </Motion.div>
      <Motion.div
        aria-hidden="true"
        style={!prefersReduced ? { y: foliageY } : undefined}
        className="absolute bottom-0 right-0 w-36 sm:w-56 lg:w-72 opacity-75 pointer-events-none z-[2] will-change-transform"
      >
        <JungleFoliageRight className="w-full h-auto" />
      </Motion.div>

      <FloatingParticles density="normal" />

      <Motion.div
        style={!prefersReduced ? { y: contentY } : undefined}
        className="relative z-10 max-w-5xl mx-auto text-center will-change-transform"
      >
        <div className="mb-4 flex justify-center">
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: 'Schedule' },
            ]}
          />
        </div>
        <Motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/45 text-[#E8C574] text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase mb-5 shadow-lg"
        >
          <Calendar className="w-3.5 h-3.5 text-[#C69B43]" />
          <span>05 Feb &amp; 06 Feb 2027</span>
          <Sparkles className="w-3.5 h-3.5 text-[#C69B43]" />
        </Motion.div>

        <Motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.08 }}
          className="lc-font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-wide text-[#E8DFC8] mb-3"
        >
          EVENT <span className="lc-gold-text">SCHEDULE</span>
        </Motion.h1>

        <TempleDivider className="my-4" />

        <div className="min-h-[1.75rem] flex items-center justify-center mb-3 px-2">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#E8C574]/90">
            <Compass className="w-4 h-4 text-[#C69B43] shrink-0" />
            <GhostTypeText
              text="Expedition Log: "
              completions={SCHEDULE_COMPLETIONS}
              as="span"
              className="font-mono text-xs sm:text-sm"
            />
          </span>
        </div>

        <Motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.14 }}
          className="text-sm sm:text-lg text-[#E8DFC8]/85 max-w-2xl mx-auto leading-relaxed mb-7"
        >
          Two Days of Innovation, Creativity &amp; Entertainment @ HIET
        </Motion.p>

        {/* Carved Sandstone Countdown Monolith */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="relative inline-flex items-center gap-3.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg lc-stone-surface lc-carved-border shadow-[0_18px_45px_rgba(4,7,5,0.72)] mb-4"
        >
          <CornerFiligree className="top-1.5 left-1.5 opacity-60" />
          <CornerFiligree className="bottom-1.5 right-1.5 rotate-180 opacity-60" />
          <div className="w-10 h-10 rounded-md bg-[#101D16] border border-[#C69B43]/45 flex items-center justify-center text-[#E8C574]">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="block lc-font-heading text-[10px] tracking-[0.24em] uppercase text-[#E8DFC8]/65">
              Starts In
            </span>
            <span className="lc-font-heading text-xl sm:text-2xl font-black lc-gold-text tracking-wide">
              {countdown || 'Loading...'}
            </span>
          </div>
        </Motion.div>

        <p className="text-xs sm:text-sm text-[#E8C574] font-mono mb-8">
          Registrations: January 10 – January 31, 2027
        </p>

        {/* Carved Stone Day Selector Tabs */}
        <div className="flex justify-center gap-3 sm:gap-4 flex-wrap mb-6">
          {Object.keys(scheduleData).map((day) => {
            const isSelected = activeDay === day;
            return (
              <Motion.button
                key={day}
                type="button"
                whileHover={!prefersReduced ? { scale: 1.03, y: -2 } : undefined}
                whileTap={!prefersReduced ? { scale: 0.97 } : undefined}
                onClick={() => {
                  setActiveDay(day);
                  onResetExpanded();
                }}
                className={`relative px-6 sm:px-9 py-3.5 sm:py-4 rounded-sm lc-font-heading font-extrabold text-xs sm:text-sm uppercase tracking-[0.16em] transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'lc-gold-btn shadow-[0_14px_34px_rgba(198,155,67,0.3)]'
                    : 'lc-stone-btn text-[#E8DFC8]/85 hover:text-[#E8C574]'
                }`}
              >
                <Zap className="w-4 h-4 shrink-0" />
                <span>
                  {day} • {day === 'Day 1' ? 'Feb 05' : 'Feb 06'}
                </span>
                <span className="font-mono text-[11px] opacity-80">
                  ({scheduleData[day].length})
                </span>
              </Motion.button>
            );
          })}
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#101D16]/85 border border-[#C69B43]/30 text-xs sm:text-sm text-[#E8DFC8]/85">
          <span className="w-2 h-2 rounded-full bg-[#E8C574] animate-pulse" />
          <span>
            <strong className="text-[#E8C574]">{totalEvents}</strong> chambers scheduled for{' '}
            <strong className="text-[#E8DFC8]">{activeDay}</strong>
          </span>
        </div>
      </Motion.div>
    </section>
  );
}
