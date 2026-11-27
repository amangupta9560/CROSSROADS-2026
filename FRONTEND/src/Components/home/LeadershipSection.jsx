import { useRef } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { institutionalPartners, teamMembers } from './homeData.js';
import { CornerFiligree, TempleDivider } from './OrnamentDivider.jsx';

function GuardianCard({ member, idx }) {
  const cardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const onMove = (e) => {
    if (prefersReducedMotion || !cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 7;
    const rx = (0.5 - py) * 7;
    cardRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
    cardRef.current.style.transform = `perspective(850px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
  };

  const onLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(850px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <Motion.article
      layout
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 10 }}
      transition={{ duration: 0.38, delay: Math.min(idx * 0.035, 0.2), ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <div
        ref={cardRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative h-full rounded-lg overflow-hidden bg-[#0D1711] lc-carved-border hover:border-[#C69B43]/75 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col will-change-transform"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
          style={{
            background:
              'radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(198, 155, 67, 0.18), transparent 65%)',
          }}
        />

        <CornerFiligree className="absolute top-2 left-2 z-20 opacity-60 group-hover:opacity-100 transition-opacity" />

        {member.featured && (
          <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-sm bg-gradient-to-r from-[#DFB961] to-[#C69B43] shadow-md">
            <span className="text-[10px] font-extrabold text-[#080D0B] flex items-center gap-1 uppercase tracking-[0.14em]">
              <Sparkles size={11} />
              Leadership
            </span>
          </div>
        )}

        <div className="relative h-64 sm:h-72 overflow-hidden bg-[#080D0B]">
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1711] via-[#0D1711]/25 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
        </div>

        <div className="relative -mt-6 bg-[#0D1711] border-t border-[#C69B43]/30 p-5 text-center flex-1 flex flex-col justify-between">
          <div>
            <h3 className="lc-font-heading text-base sm:text-lg font-bold text-[#E8DFC8] group-hover:text-[#F3DDA0] transition-colors leading-snug">
              {member.name}
            </h3>
            <div className="inline-block px-3 py-1 rounded-sm bg-[#182B20] border border-[#C69B43]/40 my-2.5">
              <span className="text-[#E8C574] font-semibold text-xs tracking-[0.1em] uppercase">
                {member.role}
              </span>
            </div>
          </div>
          <p className="text-[#E8DFC8]/70 text-xs mt-1">{member.dept}</p>
        </div>
      </div>
    </Motion.article>
  );
}

export default function LeadershipSection({ teamCategory, setTeamCategory }) {
  const categories = ['All', 'Executive Leadership', 'Department Heads'];

  const filteredMembers = teamMembers.filter(
    (m) => teamCategory === 'All' || m.category === teamCategory
  );

  return (
    <section
      id="guardians"
      className="relative z-10 py-18 sm:py-28 px-4 sm:px-6 lg:px-8 lc-stone-surface border-t border-[#C69B43]/20"
    >
      <div className="max-w-7xl mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-sm bg-[#080D0B]/90 border border-[#C69B43]/35 text-[#E8C574] text-[10px] sm:text-[11px] uppercase tracking-[0.26em] font-semibold mb-4">
            Council &amp; Patronage
          </span>
          <h2 className="lc-font-display text-3xl sm:text-5xl font-black tracking-wide text-[#E8DFC8]">
            THE <span className="lc-gold-text">GUARDIANS</span> OF CROSSROADS
          </h2>
          <TempleDivider className="my-4" />
          <p className="text-[#E8DFC8]/80 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Meet the visionaries and academic leaders guiding this expedition.
          </p>

          {/* Preserved Institutional, Academic & Technical Society Logos */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 mt-8">
            {institutionalPartners.map((partner) => (
              <a
                key={partner.title}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#080D0B]/88 border border-[#C69B43]/30 hover:border-[#E8C574]/75 transition-all duration-300 shadow-lg hover:-translate-y-0.5"
              >
                <div className="bg-[#F6F1E4] p-1.5 rounded-md flex items-center justify-center shadow-sm">
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    loading="lazy"
                    className="h-8 sm:h-9 w-auto object-contain max-w-[105px]"
                  />
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#C69B43] font-bold block">
                    {partner.eyebrow}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#E8DFC8] group-hover:text-[#F3DDA0] transition-colors block">
                    {partner.title}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Preserved Category Filter Pills with Sliding Gold Highlight */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
            {categories.map((cat) => {
              const active = teamCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTeamCategory(cat)}
                  className={`relative lc-font-heading px-4 sm:px-5 py-2.5 rounded-sm text-xs sm:text-sm font-bold tracking-[0.12em] uppercase transition-colors duration-300 cursor-pointer border ${
                    active
                      ? 'text-[#080D0B] border-transparent'
                      : 'bg-[#080D0B]/85 text-[#E8DFC8]/75 hover:text-[#E8DFC8] border-[#C69B43]/30 hover:border-[#C69B43]/60'
                  }`}
                >
                  {active && (
                    <Motion.span
                      layoutId="guardianFilterPill"
                      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      className="absolute inset-0 rounded-sm bg-gradient-to-r from-[#DFB961] via-[#C69B43] to-[#9E6327] shadow-lg"
                    />
                  )}
                  <span className="relative z-10">
                    {cat === 'All' ? 'All Leadership' : cat}
                  </span>
                </button>
              );
            })}
          </div>
        </Motion.div>

        <Motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member, idx) => (
              <GuardianCard key={member.name} member={member} idx={idx} />
            ))}
          </AnimatePresence>
        </Motion.div>
      </div>
    </section>
  );
}
