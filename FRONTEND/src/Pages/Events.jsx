import { useEffect, useMemo, useRef, useState } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Compass } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../Components/home/lostCivilization.css';
import SeoHead from '../Components/common/SeoHead.jsx';
import StackingChapter from '../Components/about/StackingChapter.jsx';
import FloatingParticles from '../Components/home/FloatingParticles.jsx';
import { TempleDivider } from '../Components/home/OrnamentDivider.jsx';
import { AncientSunDisc } from '../Components/about/JungleCanopyVectors.jsx';
import { eventsList } from '../Components/events/eventsData.js';
import EventsHero from '../Components/events/EventsHero.jsx';
import EventsGridSection from '../Components/events/EventsGridSection.jsx';
import HallOfFameSection from '../Components/events/HallOfFameSection.jsx';
import EventDetailModal from '../Components/events/EventDetailModal.jsx';
import EventsScrollProgress from '../Components/events/EventsScrollProgress.jsx';
import NotFound from './NotFound.jsx';
import {
  INSTITUTE_INFO,
  OG_IMAGE_URL,
  ROUTE_PATHS,
  SITE_URL,
  buildBreadcrumbJsonLd,
  normalizeEventUrlSlug,
} from '../config/siteConfig.js';

const Events = () => {
  const { eventSlug } = useParams();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('All');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });
  const [siteSettings, setSiteSettings] = useState({
    registrationOpen: true,
    eventStatus: {},
  });

  const normalizedSlug = eventSlug ? normalizeEventUrlSlug(eventSlug) : '';
  const selectedEvent = useMemo(() => {
    if (!normalizedSlug) return null;
    return (
      eventsList.find(
        (ev) => ev.urlSlug === normalizedSlug || ev.eventSlug === normalizedSlug
      ) || null
    );
  }, [normalizedSlug]);

  const isInvalidSlug = Boolean(eventSlug && !selectedEvent);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/settings`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) setSiteSettings(data);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const targetDate = new Date('2027-02-05T09:00:00+05:30').getTime();
    const updateTimer = () => {
      const now = Date.now();
      const difference = targetDate - now;
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (!selectedEvent) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') navigate(ROUTE_PATHS.events);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedEvent, navigate]);

  const prefersReducedMotion = useReducedMotion();
  const gatewayRef = useRef(null);
  const { scrollYProgress: gatewayScroll } = useScroll({
    target: gatewayRef,
    offset: ['start end', 'end start'],
  });
  const gatewayScale = useTransform(gatewayScroll, [0, 1], [1.14, 1.0]);
  const discRotate = useTransform(gatewayScroll, [0, 1], [-22, 26]);
  const leftGateX = useTransform(gatewayScroll, [0, 0.7], ['0%', '-18%']);
  const rightGateX = useTransform(gatewayScroll, [0, 0.7], ['0%', '18%']);

  const jsonLd = useMemo(() => {
    if (selectedEvent) {
      return [
        buildBreadcrumbJsonLd([
          { name: 'Home', path: ROUTE_PATHS.home },
          { name: 'Events', path: ROUTE_PATHS.events },
          { name: selectedEvent.name, path: `/events/${selectedEvent.urlSlug}` },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: `${selectedEvent.name} — CROSSROADS 2027`,
          description: selectedEvent.details.description,
          startDate: selectedEvent.startDateIso || '2027-02-05T10:00:00+05:30',
          endDate: selectedEvent.endDateIso || '2027-02-05T14:00:00+05:30',
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          isAccessibleForFree: true,
          image: [OG_IMAGE_URL],
          url: `${SITE_URL}/events/${selectedEvent.urlSlug}`,
          location: {
            '@type': 'Place',
            name: `${selectedEvent.details.location}, ${INSTITUTE_INFO.name}`,
            address: {
              '@type': 'PostalAddress',
              streetAddress: INSTITUTE_INFO.streetAddress,
              addressLocality: INSTITUTE_INFO.city,
              addressRegion: INSTITUTE_INFO.region,
              postalCode: INSTITUTE_INFO.postalCode,
              addressCountry: INSTITUTE_INFO.country,
            },
          },
          organizer: { '@id': `${SITE_URL}/#organization` },
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: selectedEvent.eventSlug
              ? `${SITE_URL}/register?event=${selectedEvent.eventSlug}`
              : `${SITE_URL}/schedule`,
          },
        },
      ];
    }

    return [
      buildBreadcrumbJsonLd([
        { name: 'Home', path: ROUTE_PATHS.home },
        { name: 'Events', path: ROUTE_PATHS.events },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'CROSSROADS 2027 Official Competition Arenas',
        numberOfItems: eventsList.length,
        itemListElement: eventsList.map((ev, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: ev.name,
          url: `${SITE_URL}/events/${ev.urlSlug}`,
        })),
      },
    ];
  }, [selectedEvent]);

  if (isInvalidSlug) {
    return <NotFound />;
  }

  const categories = ['All', 'Technical', 'Cultural', 'Adventure', 'Ceremony'];
  const filteredEvents =
    filter === 'All' ? eventsList : eventsList.filter((e) => e.category === filter);

  const handleSelectEvent = (ev) => {
    navigate(`/events/${ev.urlSlug}`);
  };

  const handleCloseModal = () => {
    navigate(ROUTE_PATHS.events);
  };

  return (
    <main className="lc-root min-h-[100dvh] overflow-x-clip relative selection:bg-[#C69B43] selection:text-[#080D0B]">
      <SeoHead
        title={
          selectedEvent
            ? `${selectedEvent.name} (${selectedEvent.dayBadge}) | CROSSROADS 2027 — HIET Ghaziabad`
            : 'Events & 11 Competition Arenas | CROSSROADS 2027 — HIET Ghaziabad'
        }
        description={
          selectedEvent
            ? `${selectedEvent.details.description} Venue: ${selectedEvent.details.location}. Free registration for students at HIET Ghaziabad.`
            : 'Explore all 11 technical, robotics, coding, cultural, culinary, and adventure arenas at CROSSROADS 2027 on Feb 05–06, 2027 at HIET Ghaziabad.'
        }
        path={selectedEvent ? `/events/${selectedEvent.urlSlug}` : ROUTE_PATHS.events}
        jsonLd={jsonLd}
      />

      <EventsScrollProgress />

      {/* Stacked Chapter 01: Events Hero & Countdown */}
      <StackingChapter anchorId="events-hero" zIndex={10} isFirst>
        <EventsHero timeLeft={timeLeft} selectedEvent={selectedEvent} />
      </StackingChapter>

      {/* Stacked Chapter 02: 11 Flagship Arenas & Filter Grid */}
      <StackingChapter anchorId="events-arenas" zIndex={20}>
        <EventsGridSection
          categories={categories}
          filter={filter}
          setFilter={setFilter}
          filteredEvents={filteredEvents}
          onSelectEvent={handleSelectEvent}
        />
      </StackingChapter>

      {/* Stacked Chapter 03: Hall of Fame */}
      <StackingChapter anchorId="events-hall" zIndex={30}>
        <HallOfFameSection />
      </StackingChapter>

      {/* Stacked Chapter 04: Final Registration Gateway */}
      <StackingChapter anchorId="events-gateway" zIndex={40} isLast>
        <section
          ref={gatewayRef}
          aria-label="Events Registration Gateway"
          className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center overflow-hidden bg-[#080D0B]"
        >
          <Motion.div
            aria-hidden="true"
            style={!prefersReducedMotion ? { scale: gatewayScale } : undefined}
            className="absolute inset-0 pointer-events-none will-change-transform"
          >
            <img
              src="/assets/lost-civilization/temple-gateway.webp"
              alt="Ancient Temple Gateway"
              loading="lazy"
              className="w-full h-full object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,13,11,0.32)_0%,rgba(8,13,11,0.84)_70%,rgba(8,13,11,0.98)_100%)]" />
          </Motion.div>

          {/* Scroll-parting stone shadow curtains */}
          {!prefersReducedMotion && (
            <>
              <Motion.div
                aria-hidden="true"
                style={{ x: leftGateX }}
                className="hidden md:block absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#080D0B]/95 to-transparent pointer-events-none z-[1] will-change-transform"
              />
              <Motion.div
                aria-hidden="true"
                style={{ x: rightGateX }}
                className="hidden md:block absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#080D0B]/95 to-transparent pointer-events-none z-[1] will-change-transform"
              />
            </>
          )}

          {/* Rotating Astrolabe Halo behind CTA */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]"
          >
            <Motion.div
              style={!prefersReducedMotion ? { rotate: discRotate } : undefined}
              className="w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] opacity-[0.14] text-[#C69B43] will-change-transform"
            >
              <AncientSunDisc className="w-full h-full" />
            </Motion.div>
          </div>
          <FloatingParticles density="sparse" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/40 text-[#E8C574] text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold mb-4">
              <Compass size={13} className="text-[#C69B43]" />
              <span>Registrations Open • Jan 10 – Jan 31, 2027</span>
            </span>

            <h2 className="lc-font-display text-3xl sm:text-5xl font-black text-[#E8DFC8] tracking-wide mb-3">
              READY TO ENTER THE <span className="lc-gold-text">ARENA?</span>
            </h2>

            <TempleDivider className="my-4" />

            <p className="text-sm sm:text-lg text-[#E8DFC8]/85 max-w-xl mx-auto mb-8">
              Select your competition chamber, download the official rulebook, and claim your squad
              pass free of cost.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 max-w-md mx-auto">
              {siteSettings.registrationOpen ? (
                <Link
                  to={ROUTE_PATHS.register}
                  className="lc-gold-btn lc-font-heading flex-1 px-7 py-4 rounded-sm font-extrabold text-xs sm:text-sm uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 group"
                >
                  <span>Register Your Squad</span>
                  <ArrowUpRight
                    size={16}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex-1 px-7 py-4 rounded-sm bg-[#101D16] border border-[#C69B43]/25 text-[#777568] font-bold text-xs uppercase tracking-[0.14em] cursor-not-allowed"
                >
                  Registrations Paused
                </button>
              )}

              <Link
                to={ROUTE_PATHS.schedule}
                className="lc-stone-btn lc-font-heading px-6 py-4 rounded-sm font-bold text-xs sm:text-sm uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2"
              >
                <span>View Schedule</span>
                <ArrowRight size={15} className="text-[#C69B43]" />
              </Link>
            </div>
          </div>
        </section>
      </StackingChapter>

      {/* Event Detail Modal synced with clean /events/:eventSlug URL */}
      <EventDetailModal
        selectedEvent={selectedEvent}
        onClose={handleCloseModal}
        siteSettings={siteSettings}
      />
    </main>
  );
};

export default Events;
