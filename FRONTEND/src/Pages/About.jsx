import { useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../Components/home/lostCivilization.css';
import SeoHead from '../Components/common/SeoHead.jsx';
import AboutScrollProgress from '../Components/about/AboutScrollProgress.jsx';
import StackingChapter from '../Components/about/StackingChapter.jsx';
import AboutHero from '../Components/about/AboutHero.jsx';
import ScrollJourney from '../Components/about/ScrollJourney.jsx';
import VisionMission from '../Components/about/VisionMission.jsx';
import StatsReveal from '../Components/about/StatsReveal.jsx';
import FeatureChambers from '../Components/about/FeatureChambers.jsx';
import ArenaShowcase from '../Components/about/ArenaShowcase.jsx';
import EligibilitySection from '../Components/about/EligibilitySection.jsx';
import WhyJoinSection from '../Components/about/WhyJoinSection.jsx';
import ExpeditionTimeline from '../Components/about/ExpeditionTimeline.jsx';
import AboutFinalGateway from '../Components/about/AboutFinalGateway.jsx';
import { ROUTE_PATHS, SITE_URL, buildBreadcrumbJsonLd } from '../config/siteConfig.js';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const jsonLd = useMemo(
    () => [
      buildBreadcrumbJsonLd([
        { name: 'Home', path: ROUTE_PATHS.home },
        { name: 'About', path: ROUTE_PATHS.about },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About CROSSROADS 2027 — THE LOST CIVILIZATION',
        url: `${SITE_URL}/about`,
        description:
          'Discover the origins, vision, eligibility criteria, prize milestones, and Team Tech Fusion organizing heritage behind CROSSROADS 2027 at HIET Ghaziabad.',
        mainEntity: { '@id': `${SITE_URL}/#festival` },
      },
    ],
    []
  );

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

  return (
    <main className="lc-root min-h-[100dvh] overflow-x-clip relative selection:bg-[#C69B43] selection:text-[#080D0B]">
      <SeoHead
        title="About CROSSROADS 2027 — Story, Vision & Rules | HIET Ghaziabad"
        description="Discover the story behind CROSSROADS 2027 at HIET Ghaziabad: eligibility guidelines, ₹1,00,000+ prize pool, 11 competition chambers, and Team Tech Fusion milestones."
        path={ROUTE_PATHS.about}
        jsonLd={jsonLd}
      />

      <AboutScrollProgress />

      {/* Chapter 01: Opening Hero (Stacks cleanly under ScrollJourney) */}
      <StackingChapter anchorId="about-beginning" zIndex={10} isFirst>
        <AboutHero />
      </StackingChapter>

      {/* Chapter 02: Pinned 3D Jungle Camera Journey (Slides over Hero) */}
      <span id="about-origin" aria-hidden="true" className="block h-0 w-0 pointer-events-none" />
      <ScrollJourney />

      {/* Chapter 03: Vision & Mission Pillars */}
      <StackingChapter anchorId="about-vision" zIndex={30}>
        <VisionMission />
      </StackingChapter>

      {/* Chapter 04: By The Numbers */}
      <StackingChapter anchorId="about-numbers" zIndex={40}>
        <StatsReveal />
      </StackingChapter>

      {/* Chapter 05: Pinned Horizontal Feature Chambers (Slides over Numbers) */}
      <span id="about-features" aria-hidden="true" className="block h-0 w-0 pointer-events-none" />
      <FeatureChambers />

      {/* Chapter 06: Arenas & Domains */}
      <StackingChapter anchorId="about-arenas" zIndex={60}>
        <ArenaShowcase />
      </StackingChapter>

      {/* Chapter 07: Eligibility Recruitment Board */}
      <StackingChapter anchorId="about-experience" zIndex={70}>
        <EligibilitySection />
      </StackingChapter>

      {/* Chapter 08: Why Join Artifacts */}
      <StackingChapter zIndex={80}>
        <WhyJoinSection />
      </StackingChapter>

      {/* Chapter 09: Expedition Map Timeline */}
      <StackingChapter anchorId="about-timeline" zIndex={90}>
        <ExpeditionTimeline />
      </StackingChapter>

      {/* Chapter 10: Final Temple Gateway */}
      <StackingChapter anchorId="about-gateway" zIndex={95} isLast>
        <AboutFinalGateway />
      </StackingChapter>
    </main>
  );
};

export default About;
