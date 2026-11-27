import { useRef } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { whyJoin } from './aboutData.js';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';

function ArtifactWallCard({ reason, idx, parallaxY }) {
  const cardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const Icon = reason.icon;

  const onMove = (e) => {
    if (prefersReducedMotion || !cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const rx = (0.5 - (e.clientY - rect.top) / rect.height) * 6;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    cardRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
    cardRef.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  };

  const onLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <Motion.article
      style={!prefersReducedMotion ? { y: parallaxY } : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="h-full will-change-transform"
    >
      <div
        ref={cardRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative h-full rounded-lg lc-stone-surface lc-carved-border p-6 sm:p-7 overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(198, 155, 67, 0.22), transparent 65%)',
          }}
        />
        <CornerFiligree className="absolute top-2 left-2 opacity-50 group-hover:opacity-95 transition-opacity" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div className="w-11 h-11 rounded-md bg-[#080D0B]/90 border border-[#C69B43]/40 flex items-center justify-center text-[#E8C574] group-hover:scale-105 transition-transform">
              <Icon size={20} />
            </div>
            <span className="lc-font-heading text-xs font-bold text-[#C69B43]/80 tracking-widest">
              #{reason.glyph}
            </span>
          </div>

          <h3 className="lc-font-heading text-lg sm:text-xl font-bold text-[#E8DFC8] group-hover:text-[#F3DDA0] transition-colors mb-2.5">
            {reason.title}
          </h3>
          <p className="text-sm text-[#E8DFC8]/78 leading-relaxed">{reason.desc}</p>
        </div>
      </div>
    </Motion.article>
  );
}

export default function WhyJoinSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const col0Y = useTransform(scrollYProgress, [0, 1], [14, -10]);
  const col1Y = useTransform(scrollYProgress, [0, 1], [30, -18]);
  const col2Y = useTransform(scrollYProgress, [0, 1], [46, -26]);

  const colOffsets = [col0Y, col1Y, col2Y];

  return (
    <section
      ref={sectionRef}
      aria-label="Why Join CROSSROADS"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#080D0B] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/35 text-[#E8C574] text-[10px] sm:text-[11px] uppercase tracking-[0.26em] font-semibold mb-3">
            Participant Value
          </span>
          <h2 className="lc-font-display text-3xl sm:text-5xl font-black text-[#E8DFC8] tracking-wide">
            WHY JOIN <span className="lc-gold-text">CROSSROADS?</span>
          </h2>
          <TempleDivider className="mt-4" />
        </Motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
          {whyJoin.map((reason, idx) => (
            <ArtifactWallCard
              key={reason.title}
              reason={reason}
              idx={idx}
              parallaxY={colOffsets[idx % 3]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
