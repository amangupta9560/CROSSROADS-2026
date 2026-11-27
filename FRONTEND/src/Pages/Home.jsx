import { useEffect, useMemo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../Components/home/lostCivilization.css';
import SeoHead from '../Components/common/SeoHead.jsx';
import PreloaderCurtain from '../Components/home/PreloaderCurtain.jsx';
import ScrollHudRail from '../Components/home/ScrollHudRail.jsx';
import HeroSection from '../Components/home/HeroSection.jsx';
import FeaturedArenas from '../Components/home/FeaturedArenas.jsx';
import StatsSection from '../Components/home/StatsSection.jsx';
import PrizeShowcase from '../Components/home/PrizeShowcase.jsx';
import LeadershipSection from '../Components/home/LeadershipSection.jsx';
import FAQSection from '../Components/home/FAQSection.jsx';
import FinalGateway from '../Components/home/FinalGateway.jsx';
import { faqs } from '../Components/home/homeData.js';
import {
  ROUTE_PATHS,
  buildFestivalJsonLd,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
} from '../config/siteConfig.js';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  const [openFAQ, setOpenFAQ] = useState(null);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [teamCategory, setTeamCategory] = useState('All');

  const jsonLd = useMemo(
    () => [
      buildOrganizationJsonLd(),
      buildWebsiteJsonLd(),
      buildFestivalJsonLd(),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
    []
  );

  // Live countdown to February 5, 2027, 09:00 AM IST & backend registration status fetch
  useEffect(() => {
    const controller = new AbortController();

    const calculateTimeLeft = () => {
      const eventDate = new Date('2027-02-05T09:00:00+05:30').getTime();
      const now = Date.now();
      const difference = eventDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, expired: false });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    // Fetch site registration status
    fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/settings`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.registrationOpen !== undefined) {
          setRegistrationOpen(data.registrationOpen);
        }
      })
      .catch(() => {});

    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, []);

  // Re-sync ScrollTrigger pin offsets once web fonts / initial layout settle
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 350);
    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    }
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  // Re-sync downstream FinalGateway ScrollTrigger when team filter or FAQ changes page height
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 320);
    return () => window.clearTimeout(id);
  }, [teamCategory, openFAQ]);

  const toggleFAQ = (index) => {
    setOpenFAQ((prev) => (prev === index ? null : index));
  };

  return (
    <main className="lc-root min-h-screen overflow-x-clip relative selection:bg-[#C69B43] selection:text-[#080D0B]">
      <SeoHead
        title="CROSSROADS 2027 — THE LOST CIVILIZATION | HIET Ghaziabad Tech Fest"
        description="BEYOND THE KNOWN. INTO THE UNKNOWN. Join CROSSROADS 2027, the annual inter-college technical and cultural festival at HIET Ghaziabad on February 5–6, 2027. Free registrations open Jan 10 – Jan 31, 2027."
        path={ROUTE_PATHS.home}
        jsonLd={jsonLd}
      />
      <PreloaderCurtain />
      <ScrollHudRail />
      <HeroSection timeLeft={timeLeft} registrationOpen={registrationOpen} />
      <FeaturedArenas />
      <StatsSection />
      <PrizeShowcase />
      <LeadershipSection teamCategory={teamCategory} setTeamCategory={setTeamCategory} />
      <FAQSection openFAQ={openFAQ} toggleFAQ={toggleFAQ} />
      <FinalGateway registrationOpen={registrationOpen} />
    </main>
  );
};

export default Home;
