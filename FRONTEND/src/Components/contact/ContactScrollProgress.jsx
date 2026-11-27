import { useEffect, useState } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

const CHAPTERS = [
  { id: 'contact-dispatch', label: '01 DISPATCH' },
  { id: 'contact-transmit', label: '02 TRANSMIT' },
  { id: 'contact-portal', label: '03 GATEWAY' },
];

/**
 * Scroll-synced expedition waypoint rail for Contact page (desktop) and slim golden progress bar (mobile).
 */
export default function ContactScrollProgress() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 24,
    restDelta: 0.001,
  });

  const [activeId, setActiveId] = useState('contact-dispatch');

  useEffect(() => {
    const updateActive = () => {
      const midY = window.scrollY + window.innerHeight * 0.38;
      let current = CHAPTERS[0].id;
      for (const ch of CHAPTERS) {
        const el = document.getElementById(ch.id);
        if (el && el.offsetTop <= midY) {
          current = ch.id;
        }
      }
      setActiveId(current);
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, []);

  const handleJump = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Desktop Left-Edge Expedition Rail */}
      <nav
        aria-label="Contact expedition progress"
        className="hidden lg:flex fixed left-4 xl:left-6 top-1/2 -translate-y-1/2 z-[98] flex-col items-start gap-4 pointer-events-auto"
      >
        <div className="relative flex flex-col gap-3.5 pl-4 py-2 border-l border-[#C69B43]/25">
          {/* Active molten-gold fill track */}
          <Motion.div
            aria-hidden="true"
            className="absolute left-[-1px] top-0 w-[2px] h-full origin-top bg-gradient-to-b from-[#E8C574] via-[#C69B43] to-[#B86B35]"
            style={{ scaleY: prefersReduced ? 1 : smoothProgress }}
          />

          {CHAPTERS.map((chapter) => {
            const isActive = activeId === chapter.id;
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => handleJump(chapter.id)}
                className={`group flex items-center gap-2.5 text-left transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E8C574] rounded px-1 ${
                  isActive ? 'opacity-100 translate-x-0.5' : 'opacity-55 hover:opacity-90'
                }`}
              >
                <span
                  className={`w-2 h-2 rotate-45 transition-all duration-300 border ${
                    isActive
                      ? 'bg-[#E8C574] border-[#FFF3C4] scale-125 shadow-[0_0_10px_rgba(232,197,116,0.8)]'
                      : 'bg-[#101D16] border-[#C69B43]/55 group-hover:border-[#E8C574]'
                  }`}
                />
                <span
                  className={`lc-font-heading text-[10px] tracking-[0.22em] font-bold transition-colors ${
                    isActive ? 'text-[#E8C574]' : 'text-[#E8DFC8]/75 group-hover:text-[#E8DFC8]'
                  }`}
                >
                  {chapter.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Golden Progress Bar */}
      <div
        aria-hidden="true"
        className="lg:hidden fixed bottom-0 left-0 right-0 h-[2px] bg-[#080D0B]/70 z-[98] pointer-events-none"
      >
        <Motion.div
          className="h-full origin-left bg-gradient-to-r from-[#B86B35] via-[#E8C574] to-[#C69B43]"
          style={{ scaleX: prefersReduced ? 1 : smoothProgress }}
        />
      </div>
    </>
  );
}
