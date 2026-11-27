import { Compass, Home as HomeIcon, Calendar, Layers, ShieldAlert, ArrowRight, Users, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import '../Components/home/lostCivilization.css';
import SeoHead from '../Components/common/SeoHead.jsx';
import Breadcrumbs from '../Components/common/Breadcrumbs.jsx';
import FloatingParticles from '../Components/home/FloatingParticles.jsx';
import { TempleDivider } from '../Components/home/OrnamentDivider.jsx';
import { AncientSunDisc } from '../Components/about/JungleCanopyVectors.jsx';
import { ROUTE_PATHS, buildBreadcrumbJsonLd } from '../config/siteConfig.js';

const QUICK_DESTINATIONS = [
  { label: 'Sanctuary Home', to: ROUTE_PATHS.home, icon: HomeIcon, desc: 'Festival overview & countdown' },
  { label: '11 Event Arenas', to: ROUTE_PATHS.events, icon: Layers, desc: 'Technical, robotics & cultural competitions' },
  { label: 'Event Schedule', to: ROUTE_PATHS.schedule, icon: Calendar, desc: 'Day 01 & Day 02 campus timetable' },
  { label: 'Squad Registration', to: ROUTE_PATHS.register, icon: Compass, desc: 'Register free before Jan 31, 2027' },
  { label: 'Leadership & Team', to: ROUTE_PATHS.team, icon: Users, desc: 'HIET council & department heads' },
  { label: 'Contact Support', to: ROUTE_PATHS.contact, icon: Mail, desc: 'Team Tech Fusion helpdesk' },
];

export default function NotFound() {
  const location = useLocation();

  return (
    <main className="lc-root min-h-[92dvh] bg-[#080D0B] text-[#E8DFC8] flex flex-col items-center justify-center px-4 sm:px-6 pt-32 pb-20 relative overflow-hidden selection:bg-[#C69B43] selection:text-[#080D0B]">
      <SeoHead
        title="404 — Page Not Found | CROSSROADS 2027"
        description="The requested CROSSROADS 2027 page could not be found. Explore the official HIET Ghaziabad Tech Fest events, schedule, leadership team, or squad registration."
        path={location.pathname}
        robots="noindex, nofollow"
        jsonLd={buildBreadcrumbJsonLd([
          { name: 'Home', path: ROUTE_PATHS.home },
          { name: '404 Not Found', path: location.pathname },
        ])}
      />

      {/* Atmospheric Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(198,155,67,0.14)_0%,rgba(16,29,22,0.72)_45%,rgba(8,13,11,0.98)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07] text-[#C69B43]"
      >
        <AncientSunDisc className="w-[34rem] h-[34rem] lc-animate-spin-slow" />
      </div>
      <FloatingParticles density="sparse" />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        <div className="mb-5 flex justify-center">
          <Breadcrumbs
            items={[
              { name: 'Home', path: ROUTE_PATHS.home },
              { name: '404 — Uncharted Route' },
            ]}
          />
        </div>

        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/45 text-[#E8C574] font-mono text-[11px] uppercase tracking-[0.24em] font-semibold mb-4">
          <ShieldAlert size={14} className="text-[#B86B35]" />
          <span>Error 404 • Uncharted Sanctuary Route</span>
        </span>

        <h1 className="lc-font-display text-4xl sm:text-6xl font-black tracking-wide text-[#E8DFC8] mb-3">
          CHAMBER <span className="lc-gold-text">NOT FOUND</span>
        </h1>

        <TempleDivider className="my-4" />

        <p className="text-sm sm:text-lg text-[#E8DFC8]/80 max-w-xl mx-auto mb-8 leading-relaxed">
          The expedition coordinate{' '}
          <code className="px-2 py-0.5 rounded bg-[#101D16] border border-[#C69B43]/30 text-[#E8C574] text-xs font-mono">
            {location.pathname}
          </code>{' '}
          does not exist or may have moved to a new temple chamber.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <Link
            to={ROUTE_PATHS.home}
            className="lc-gold-btn lc-font-heading px-7 py-3.5 rounded-sm font-extrabold text-xs sm:text-sm uppercase tracking-[0.16em] inline-flex items-center gap-2"
          >
            <HomeIcon size={15} />
            <span>Return to Home</span>
          </Link>
          <Link
            to={ROUTE_PATHS.events}
            className="lc-stone-btn lc-font-heading px-7 py-3.5 rounded-sm font-bold text-xs sm:text-sm uppercase tracking-[0.16em] inline-flex items-center gap-2"
          >
            <span>Browse 11 Arenas</span>
            <ArrowRight size={15} className="text-[#C69B43]" />
          </Link>
        </div>

        {/* Clean Internal Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-left">
          {QUICK_DESTINATIONS.map((dest) => {
            const Icon = dest.icon;
            return (
              <Link
                key={dest.to}
                to={dest.to}
                className="group p-4 rounded-lg lc-stone-surface lc-carved-border hover:border-[#E8C574]/70 transition-all duration-300 flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-md bg-[#182B20] border border-[#C69B43]/40 flex items-center justify-center text-[#E8C574] shrink-0 group-hover:scale-105 transition-transform">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <h2 className="lc-font-heading text-xs sm:text-sm font-bold text-[#E8DFC8] group-hover:text-[#E8C574] transition-colors">
                    {dest.label}
                  </h2>
                  <p className="text-[11px] text-[#E8DFC8]/65 mt-0.5 leading-snug">{dest.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
