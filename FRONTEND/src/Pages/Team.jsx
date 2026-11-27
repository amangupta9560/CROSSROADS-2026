import { motion as Motion } from 'framer-motion';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Components/home/lostCivilization.css';
import SeoHead from '../Components/common/SeoHead.jsx';
import Breadcrumbs from '../Components/common/Breadcrumbs.jsx';
import FloatingParticles from '../Components/home/FloatingParticles.jsx';
import { CornerFiligree, TempleDivider } from '../Components/home/OrnamentDivider.jsx';
import { AncientSunDisc } from '../Components/about/JungleCanopyVectors.jsx';
import { institutionalPartners, teamMembers } from '../Components/home/homeData.js';
import { ROUTE_PATHS, SITE_URL, buildBreadcrumbJsonLd } from '../config/siteConfig.js';

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(i * 0.06, 0.35),
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const Team = () => {
  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: 'Home', path: ROUTE_PATHS.home },
      { name: 'Leadership & Team', path: ROUTE_PATHS.team },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'CROSSROADS 2027 Leadership & Organizing Team',
      url: `${SITE_URL}/team`,
      about: { '@id': `${SITE_URL}/#organization` },
    },
  ];

  return (
    <main className="lc-root relative py-28 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#080D0B] text-[#E8DFC8] min-h-screen overflow-hidden selection:bg-[#C69B43] selection:text-[#080D0B]">
      <SeoHead
        title="Leadership Council & Faculty Team | CROSSROADS 2027 — HIET Ghaziabad"
        description="Meet the HIET Ghaziabad executive leadership council, advisory board, and heads of department guiding CROSSROADS 2027 and Team Tech Fusion."
        path={ROUTE_PATHS.team}
        jsonLd={jsonLd}
      />

      {/* Atmospheric Lost Civilization Sanctuary Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/assets/lost-civilization/stone-texture.webp')",
          backgroundSize: '420px 420px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(198,155,67,0.14)_0%,rgba(16,29,22,0.72)_45%,rgba(8,13,11,0.98)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2 w-[36rem] h-[36rem] opacity-[0.07] text-[#C69B43]"
      >
        <AncientSunDisc className="w-full h-full lc-animate-spin-slow" />
      </div>
      <FloatingParticles density="sparse" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="mb-5 flex justify-center">
            <Breadcrumbs
              items={[
                { name: 'Home', path: ROUTE_PATHS.home },
                { name: 'Leadership & Team' },
              ]}
            />
          </div>

          <Motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/40 mb-5"
          >
            <Compass className="w-3.5 h-3.5 text-[#C69B43]" />
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#E8C574] font-semibold">
              HIET Council &amp; Patronage
            </span>
          </Motion.div>

          <Motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lc-font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-wide text-[#E8DFC8] mb-3"
          >
            COUNCIL &amp; <span className="lc-gold-text">LEADERSHIP TEAM</span>
          </Motion.h1>

          <TempleDivider className="my-4" />

          <Motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.65 }}
            className="text-sm sm:text-lg text-[#E8DFC8]/80 max-w-2xl mx-auto leading-relaxed px-2"
          >
            Visionary patrons, advisory board members, and academic department heads mentoring Team
            Tech Fusion across CROSSROADS 2027 at HIET Ghaziabad.
          </Motion.p>

          {/* Institutional, Academic & Technical Society Cards */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 mt-8">
            {institutionalPartners.map((partner) => (
              <a
                key={partner.title}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#101D16]/90 border border-[#C69B43]/30 hover:border-[#E8C574]/75 transition-all duration-300 shadow-lg hover:-translate-y-0.5"
              >
                <div className="bg-[#F6F1E4] p-1.5 rounded-md flex items-center justify-center shadow-sm">
                  <img
                    src={partner.logo}
                    alt={`${partner.alt} Official Emblem`}
                    className="h-8 sm:h-9 w-auto object-contain max-w-[110px]"
                  />
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#C69B43] font-bold block">
                    {partner.eyebrow}
                  </span>
                  <span className="lc-font-heading text-xs sm:text-sm font-bold text-[#E8DFC8] group-hover:text-[#F3DDA0] transition-colors block">
                    {partner.title}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {teamMembers.map((member, index) => (
            <Motion.article
              key={member.name}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="group relative rounded-lg overflow-hidden lc-stone-surface lc-carved-border hover:border-[#E8C574]/70 transition-all duration-400 shadow-[0_24px_60px_rgba(4,7,5,0.75)] flex flex-col"
            >
              <CornerFiligree className="top-2 left-2 z-20 opacity-65 group-hover:opacity-100 transition-opacity" />

              {member.featured && (
                <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-sm bg-gradient-to-r from-[#DFB961] to-[#C69B43] shadow-md">
                  <span className="text-[10px] font-extrabold text-[#080D0B] flex items-center gap-1 uppercase tracking-[0.14em]">
                    <Sparkles className="w-3 h-3" />
                    Leadership
                  </span>
                </div>
              )}

              <div className="relative h-64 sm:h-72 overflow-hidden bg-[#080D0B]">
                <img
                  src={member.image}
                  alt={`${member.name} — ${member.role}, ${member.dept}`}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1711] via-transparent to-transparent opacity-85" />
              </div>

              <div className="relative p-5 text-center border-t border-[#C69B43]/30 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="lc-font-heading text-lg font-bold text-[#E8DFC8] mb-2 group-hover:text-[#F3DDA0] transition-colors leading-snug">
                    {member.name}
                  </h2>
                  <div className="inline-block px-3 py-1 rounded-sm bg-[#182B20] border border-[#C69B43]/40 mb-2">
                    <span className="text-[#E8C574] font-semibold text-xs uppercase tracking-[0.1em]">
                      {member.role}
                    </span>
                  </div>
                </div>
                <p className="text-[#E8DFC8]/70 text-xs mt-1 leading-relaxed">{member.dept}</p>
              </div>
            </Motion.article>
          ))}
        </div>

        {/* Internal Cross-Links Band */}
        <div className="mt-16 text-center lc-stone-surface lc-carved-border rounded-xl p-7 sm:p-9 max-w-4xl mx-auto">
          <p className="text-[#E8DFC8]/85 text-sm sm:text-base mb-5">
            Explore the arenas curated under our council&apos;s mentorship or lock your squad pass
            for February 05–06, 2027.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to={ROUTE_PATHS.register}
              className="lc-gold-btn lc-font-heading px-6 py-3 rounded-sm font-extrabold text-xs uppercase tracking-[0.16em] inline-flex items-center gap-2"
            >
              <span>Register Your Squad</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to={ROUTE_PATHS.events}
              className="lc-stone-btn lc-font-heading px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-[0.16em] inline-flex items-center gap-2"
            >
              <span>Explore 11 Arenas</span>
              <ArrowRight size={14} className="text-[#C69B43]" />
            </Link>
            <Link
              to={ROUTE_PATHS.contact}
              className="lc-stone-btn lc-font-heading px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-[0.16em] inline-flex items-center gap-2"
            >
              <span>Contact Organizers</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Team;
