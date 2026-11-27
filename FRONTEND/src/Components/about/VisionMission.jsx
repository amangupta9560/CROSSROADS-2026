import { useRef } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Rocket, Users } from 'lucide-react';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';
import { AncientSunDisc } from './JungleCanopyVectors.jsx';
import GhostTypeText from './GhostTypeText.jsx';

function MonumentalPillarCard({
  icon,
  eyebrow,
  title,
  primaryText,
  secondaryText,
  delay = 0,
  parallaxY,
}) {
  const PillarIcon = icon;
  const cardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const onMove = (e) => {
    if (prefersReducedMotion || !cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <Motion.div
      style={!prefersReducedMotion ? { y: parallaxY } : undefined}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="h-full will-change-transform"
    >
      <div
        ref={cardRef}
        onPointerMove={onMove}
        className="group relative h-full rounded-xl lc-stone-surface lc-carved-border p-7 sm:p-10 overflow-hidden hover:border-[#C69B43]/70 transition-colors duration-300"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), rgba(198, 155, 67, 0.22), transparent 65%)',
          }}
        />

        <AncientSunDisc className="lc-animate-spin-slow absolute -right-14 -bottom-14 w-52 h-52 opacity-[0.07] group-hover:opacity-[0.15] transition-opacity" />

        <CornerFiligree className="absolute top-2.5 left-2.5 opacity-80" />
        <CornerFiligree className="absolute top-2.5 right-2.5 rotate-90 opacity-80" />
        <CornerFiligree className="absolute bottom-2.5 left-2.5 -rotate-90 opacity-80" />
        <CornerFiligree className="absolute bottom-2.5 right-2.5 rotate-180 opacity-80" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-13 h-13 rounded-md bg-[#080D0B]/90 border border-[#C69B43]/45 flex items-center justify-center text-[#E8C574] group-hover:scale-105 transition-transform duration-300">
              <PillarIcon size={24} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.26em] text-[#C69B43] font-bold block">
                {eyebrow}
              </span>
              <h3 className="lc-font-display text-2xl sm:text-3xl font-black text-[#E8DFC8]">
                {title}
              </h3>
            </div>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-[#C69B43]/45 to-transparent mb-5" />

          <p className="text-[#E8DFC8]/92 text-base sm:text-lg leading-relaxed mb-4 font-medium">
            {primaryText}
          </p>
          <p className="text-[#E8DFC8]/75 text-sm sm:text-base leading-relaxed">
            {secondaryText}
          </p>
        </div>
      </div>
    </Motion.div>
  );
}

export default function VisionMission() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const leftPillarY = useTransform(scrollYProgress, [0, 1], [24, -18]);
  const rightPillarY = useTransform(scrollYProgress, [0, 1], [44, -28]);

  return (
    <section
      ref={sectionRef}
      aria-label="Our Vision and Mission"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#080D0B] via-[#0E1912] to-[#080D0B] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/35 text-[#E8C574] text-[10px] sm:text-[11px] uppercase tracking-[0.26em] font-semibold mb-4">
            Twin Temple Pillars
          </span>
          <h2 className="lc-font-display text-3xl sm:text-5xl font-black tracking-wide text-[#E8DFC8]">
            OUR <span className="lc-gold-text">VISION</span> &amp;{' '}
            <span className="lc-gold-text">MISSION</span>
          </h2>
          <TempleDivider className="my-3.5" />
          <GhostTypeText
            text="FOUNDATION // "
            completions={[
              'BUILD WITHOUT BARRIERS.',
              'FAIR & TRANSPARENT ARENAS.',
              'ZERO REGISTRATION COST.',
              '50+ COLLEGES UNITED.',
            ]}
            className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E8DFC8]/80"
            accentColor="#E8C574"
          />
        </Motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <MonumentalPillarCard
            icon={Rocket}
            eyebrow="North Star"
            title="Our Vision"
            primaryText="To cultivate a high-agency student ecosystem where engineering talent, creative expression, and rapid prototyping thrive without barriers."
            secondaryText="We envision CROSSROADS as the launchpad that turns student prototypes into real-world products and campus peers into lifelong collaborators."
            parallaxY={leftPillarY}
          />

          <MonumentalPillarCard
            icon={Users}
            eyebrow="Execution"
            title="Our Mission"
            primaryText="To deliver fair, hands-on competitive arenas backed by transparent judging, verifiable credentials, and zero registration cost."
            secondaryText="We bring 50+ colleges together on one campus to sharpen technical craft, teamwork, leadership, and creative confidence."
            delay={0.08}
            parallaxY={rightPillarY}
          />
        </div>
      </div>
    </section>
  );
}
