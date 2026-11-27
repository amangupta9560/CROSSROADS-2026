import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { winnersList } from './eventsData.js';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';
import FloatingParticles from '../home/FloatingParticles.jsx';

function WinnerRelicCard({ winner, index, onSelect }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Motion.button
      type="button"
      onClick={() => onSelect(winner)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.035, 0.25), ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-lg lc-stone-surface lc-carved-border p-1.5 hover:border-[#E8C574]/75 transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C574]"
      aria-label={`View ${winner.name} full photo`}
    >
      <div className="relative h-64 sm:h-72 rounded-md overflow-hidden bg-[#080D0B]">
        {!loaded && <div className="absolute inset-0 bg-[#182B20]/70 animate-pulse" />}
        <img
          className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          src={winner.imageSrc}
          alt={winner.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080D0B]/85 via-transparent to-transparent" />
        <CornerFiligree className="absolute top-1.5 left-1.5 opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 right-3">
          <div className="bg-gradient-to-br from-[#DFB961] to-[#9E6327] p-2 rounded-full shadow-lg">
            <Trophy className="w-4 h-4 text-[#080D0B]" />
          </div>
        </div>
      </div>
    </Motion.button>
  );
}

export default function HallOfFameSection() {
  const prefersReducedMotion = useReducedMotion();
  const [activeWinner, setActiveWinner] = useState(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const mapParallaxY = useTransform(scrollYProgress, [0, 1], [-28, 28]);
  const watermarkX = useTransform(scrollYProgress, [0, 1], ['-12%', '16%']);
  const evenColumnY = useTransform(scrollYProgress, [0, 1], [-14, 14]);
  const oddColumnY = useTransform(scrollYProgress, [0, 1], [14, -14]);

  useEffect(() => {
    if (!activeWinner) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveWinner(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeWinner]);

  return (
    <section
      ref={sectionRef}
      aria-label="Hall of Fame"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0C1510] overflow-hidden"
    >
      <Motion.div
        aria-hidden="true"
        style={!prefersReducedMotion ? { y: mapParallaxY } : undefined}
        className="absolute -inset-8 pointer-events-none opacity-35 will-change-transform"
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
        className="absolute inset-0 bg-gradient-to-b from-[#080D0B]/90 via-[#0C1510]/65 to-[#080D0B]/92 pointer-events-none"
      />
      <FloatingParticles density="sparse" />

      {/* Scrubbed Horizontal Monumental Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden py-1 mb-2 relative z-[2]"
      >
        <Motion.div
          style={!prefersReducedMotion ? { x: watermarkX } : undefined}
          className="lc-watermark-text text-[2.4rem] sm:text-[4.5rem] lg:text-[6rem] whitespace-nowrap leading-none text-center will-change-transform"
        >
          CHAMPIONS OF THE LOST ERA • HALL OF FAME
        </Motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <div className="w-14 h-14 rounded-md bg-[#101D16]/90 border border-[#C69B43]/45 flex items-center justify-center text-[#E8C574] mx-auto mb-5 shadow-lg">
            <Trophy className="w-7 h-7" />
          </div>
          <h2 className="lc-font-display text-3xl sm:text-5xl font-black text-[#E8DFC8] tracking-wide">
            HALL OF <span className="lc-gold-text">FAME</span>
          </h2>
          <TempleDivider className="my-4" />
          <p className="text-sm sm:text-lg text-[#E8DFC8]/80">
            Proud Winners • Past Editions of CROSSROADS
          </p>
        </Motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {winnersList.map((winner, i) => (
            <Motion.div
              key={winner.id}
              style={
                !prefersReducedMotion
                  ? { y: i % 2 === 0 ? evenColumnY : oddColumnY }
                  : undefined
              }
              className="will-change-transform"
            >
              <WinnerRelicCard
                winner={winner}
                index={i}
                onSelect={setActiveWinner}
              />
            </Motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Past Winner Photos */}
      <AnimatePresence>
        {activeWinner && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setActiveWinner(null)}
            className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-[#040705]/90 backdrop-blur-md"
          >
            <Motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full rounded-xl lc-stone-surface lc-carved-border p-3 sm:p-4"
            >
              <button
                type="button"
                onClick={() => setActiveWinner(null)}
                aria-label="Close winner preview"
                className="absolute top-5 right-5 z-20 p-2 rounded-full bg-[#080D0B]/90 border border-[#C69B43]/50 text-[#E8C574] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={activeWinner.imageSrc}
                alt={activeWinner.name}
                className="w-full max-h-[80dvh] object-contain rounded-lg bg-[#080D0B]"
              />
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
