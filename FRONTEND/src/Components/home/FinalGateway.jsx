import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import FloatingParticles from './FloatingParticles.jsx';
import { TempleDivider } from './OrnamentDivider.jsx';

gsap.registerPlugin(ScrollTrigger);

const FINALE_WORDS = [
  { text: 'YOUR', gold: false },
  { text: 'LEGEND', gold: true },
  { text: 'STARTS', gold: false },
  { text: 'HERE.', gold: true },
];

export default function FinalGateway({ registrationOpen }) {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const portalBeamRef = useRef(null);
  const wordsContainerRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionRef.current) return undefined;

    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { scale: 1.16 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 0.7,
              refreshPriority: 0,
            },
          }
        );
      }

      if (portalBeamRef.current) {
        gsap.fromTo(
          portalBeamRef.current,
          { opacity: 0.15, scaleX: 0.6 },
          {
            opacity: 0.75,
            scaleX: 1.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'center center',
              scrub: 0.6,
              refreshPriority: 0,
            },
          }
        );
      }

      if (wordsContainerRef.current) {
        const wordEls = wordsContainerRef.current.querySelectorAll('.lc-finale-word');
        gsap.fromTo(
          wordEls,
          { opacity: 0.22, y: 18 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.18,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'center center',
              scrub: 0.6,
              refreshPriority: 0,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gateway"
      ref={sectionRef}
      aria-label="Final Registration Gateway"
      className="relative z-10 min-h-[78dvh] sm:min-h-[84dvh] py-20 sm:py-32 px-4 sm:px-6 lg:px-8 flex items-center justify-center text-center overflow-hidden bg-[#080D0B] border-t border-[#C69B43]/25"
    >
      {/* Massive Stone Temple Doorway Environment */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          ref={bgRef}
          src="/assets/lost-civilization/temple-gateway.webp"
          alt="Ancient Temple Gateway Opening with Golden Light"
          loading="lazy"
          className="w-full h-full object-cover object-center will-change-transform"
        />
        <div
          ref={portalBeamRef}
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[28rem] sm:w-[44rem] bg-[radial-gradient(ellipse_at_center,rgba(232,174,78,0.28)_0%,rgba(184,107,53,0.1)_48%,transparent_75%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,13,11,0.3)_0%,rgba(8,13,11,0.78)_68%,rgba(8,13,11,0.96)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#080D0B] via-transparent to-[#080D0B]"
        />
      </div>

      <FloatingParticles density="normal" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/40 text-[#E8C574] text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold mb-6">
          <Compass size={13} className="text-[#C69B43]" />
          <span>The End Is Not The End // The Final Threshold</span>
        </span>

        {/* Kinetic Scroll-Lit Display Words (Desktop + Mobile) */}
        <h2
          ref={wordsContainerRef}
          className="lc-font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-wide leading-[1.08] drop-shadow-[0_12px_36px_rgba(0,0,0,0.92)] flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1"
        >
          {FINALE_WORDS.map((word) => (
            <span
              key={word.text}
              className={`lc-finale-word inline-block ${
                word.gold ? 'lc-gold-text' : 'text-[#E8DFC8]'
              }`}
            >
              {word.text}
            </span>
          ))}
        </h2>

        <TempleDivider className="my-6" />

        <p className="text-sm sm:text-xl text-[#E8DFC8]/90 max-w-2xl mx-auto leading-relaxed mb-9 sm:mb-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
          The civilization is waiting. The challenges are ready. Will you answer the call?
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 max-w-lg mx-auto">
          {registrationOpen ? (
            <Link
              to="/event-registration"
              className="lc-gold-btn lc-font-heading flex-1 px-8 py-4 rounded-sm font-extrabold text-xs sm:text-sm uppercase tracking-[0.18em] inline-flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <Sparkles size={16} className="text-[#080D0B]" />
              <span>REGISTER YOUR SQUAD</span>
              <ArrowRight
                size={16}
                className="text-[#080D0B] group-hover:translate-x-1 transition-transform duration-200"
              />
            </Link>
          ) : (
            <Link
              to="/events"
              className="lc-stone-btn lc-font-heading flex-1 px-8 py-4 rounded-sm font-bold text-xs sm:text-sm uppercase tracking-[0.15em] inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Registrations Paused • View Events</span>
            </Link>
          )}

          <Link
            to="/events"
            className="lc-stone-btn lc-font-heading px-7 py-4 rounded-sm font-bold text-xs sm:text-sm uppercase tracking-[0.18em] inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore Events</span>
            <ArrowRight size={15} className="text-[#C69B43]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
