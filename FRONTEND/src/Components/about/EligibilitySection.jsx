import { useRef } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { participantCategories } from './aboutData.js';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';
import { AncientSunDisc } from './JungleCanopyVectors.jsx';

export default function EligibilitySection() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const mapParallaxY = useTransform(scrollYProgress, [0, 1], [-28, 28]);

  return (
    <section
      ref={sectionRef}
      aria-label="Who Can Participate"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0C1510] overflow-hidden"
    >
      {/* Parallax Ancient Parchment Map Backdrop */}
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
        className="absolute inset-0 bg-gradient-to-b from-[#080D0B]/85 via-[#0C1510]/65 to-[#080D0B]/90 pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-xl bg-[#0C1510]/90 lc-carved-border p-7 sm:p-10 lg:p-12 overflow-hidden"
        >
          <AncientSunDisc className="lc-animate-spin-slow absolute -right-20 -top-20 w-64 h-64 opacity-[0.07]" />
          <CornerFiligree className="absolute top-3 left-3 opacity-85" />
          <CornerFiligree className="absolute top-3 right-3 rotate-90 opacity-85" />
          <CornerFiligree className="absolute bottom-3 left-3 -rotate-90 opacity-85" />
          <CornerFiligree className="absolute bottom-3 right-3 rotate-180 opacity-85" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#182B20] border border-[#C69B43]/40 text-[#E8C574] text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold mb-4">
              <ShieldCheck size={13} className="text-[#C69B43]" />
              <span>Open Eligibility // Expedition Recruitment</span>
            </span>

            <h2 className="lc-font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#E8DFC8] mb-4">
              WHO CAN <span className="lc-gold-text">PARTICIPATE?</span>
            </h2>

            <TempleDivider className="justify-start my-3" />

            <p className="text-[#E8DFC8]/90 text-base sm:text-lg leading-relaxed max-w-3xl mb-8">
              CROSSROADS is open to all undergraduate and postgraduate students across India with a
              valid college ID card—from first-year explorers to final-year engineers and
              performers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {participantCategories.map((item, idx) => (
                <Motion.div
                  key={item}
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-md bg-[#080D0B]/88 border border-[#C69B43]/30 hover:border-[#E8C574]/70 hover:-translate-y-0.5 text-[#E8DFC8] text-sm font-medium transition-all duration-300"
                >
                  <span className="w-2 h-2 rotate-45 bg-[#C69B43] shrink-0" />
                  <span>{item}</span>
                </Motion.div>
              ))}
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
}
