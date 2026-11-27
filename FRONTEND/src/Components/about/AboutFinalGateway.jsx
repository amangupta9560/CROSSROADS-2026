import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import FloatingParticles from '../home/FloatingParticles.jsx';
import { TempleDivider } from '../home/OrnamentDivider.jsx';
import GhostTypeText from './GhostTypeText.jsx';

gsap.registerPlugin(ScrollTrigger);

const GATEWAY_WORDS = [
  { text: 'EVERY', gold: false },
  { text: 'LEGEND', gold: true },
  { text: 'BEGINS', gold: false },
  { text: 'WITH', gold: false },
  { text: 'A', gold: false },
  { text: 'STEP.', gold: true },
];

export default function AboutFinalGateway() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const beamRef = useRef(null);
  const wordsRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionRef.current) return undefined;

    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { scale: 1.18 },
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

      if (beamRef.current) {
        gsap.fromTo(
          beamRef.current,
          { opacity: 0.15, scaleX: 0.55 },
          {
            opacity: 0.85,
            scaleX: 1.12,
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

      if (wordsRef.current) {
        const words = wordsRef.current.querySelectorAll('.lc-about-finale-word');
        gsap.fromTo(
          words,
          { opacity: 0.22, y: 18 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.14,
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
      ref={sectionRef}
      aria-label="Final Temple Gateway"
      className="relative min-h-[85dvh] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center overflow-hidden bg-[#080D0B]"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          ref={bgRef}
          src="/assets/lost-civilization/temple-gateway.webp"
          alt="Giant Ancient Stone Temple Gateway Glowing Inside Jungle"
          loading="lazy"
          className="w-full h-full object-cover object-center will-change-transform"
        />
        <div
          ref={beamRef}
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[26rem] sm:w-[44rem] bg-[radial-gradient(ellipse_at_center,rgba(232,174,78,0.32)_0%,rgba(184,107,53,0.12)_50%,transparent_76%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,13,11,0.34)_0%,rgba(8,13,11,0.8)_68%,rgba(8,13,11,0.96)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#080D0B] via-transparent to-[#080D0B]"
        />
      </div>

      <FloatingParticles density="normal" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="w-14 h-14 rounded-md bg-[#101D16]/90 border border-[#C69B43]/45 flex items-center justify-center text-[#E8C574] mx-auto mb-6 shadow-lg">
          <Target size={26} />
        </div>

        <h2
          ref={wordsRef}
          className="lc-font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-wide leading-[1.08] drop-shadow-[0_12px_36px_rgba(0,0,0,0.92)] flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1"
        >
          {GATEWAY_WORDS.map((word, idx) => (
            <span
              key={`${word.text}-${idx}`}
              className={`lc-about-finale-word inline-block ${word.gold ? 'lc-gold-text' : 'text-[#E8DFC8]'
                }`}
            >
              {word.text}
            </span>
          ))}
        </h2>

        <TempleDivider className="my-5" />

        <div className="mb-4 min-h-[26px] flex items-center justify-center">
          <GhostTypeText
            text="THE GATEWAY OPENS FOR "
            completions={[
              'BOLD BUILDERS.',
              'CAMPUS INNOVATORS.',
              'FEARLESS SQUADS.',
              'CROSSROADS 2027.',
            ]}
            className="lc-font-heading text-xs sm:text-sm uppercase tracking-[0.2em] font-bold text-[#E8DFC8]"
            accentColor="#E8C574"
          />
        </div>

        <p className="text-base sm:text-xl text-[#E8DFC8]/92 max-w-2xl mx-auto leading-relaxed mb-4">
          Your expedition awaits. Become part of CROSSROADS 2027.
        </p>

        <p className="text-xs sm:text-sm text-[#E8DFC8]/75 max-w-2xl mx-auto leading-relaxed mb-9">
          Registrations open on <strong className="text-[#E8DFC8]">January 10, 2027</strong> and
          close on <strong className="text-[#E8C574]">January 31, 2027</strong>. Lock your squad
          before <strong className="text-[#E8C574]">05 &amp; 06 February 2027</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 max-w-lg mx-auto mb-14">
          <Link
            to="/event-registration"
            className="lc-gold-btn lc-font-heading flex-1 px-8 py-4 rounded-sm font-extrabold text-xs sm:text-sm tracking-[0.16em] uppercase inline-flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <span>REGISTER YOUR TEAM</span>
            <ArrowUpRight
              size={17}
              className="text-[#080D0B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Link>

          <Link
            to="/events"
            className="lc-stone-btn lc-font-heading px-7 py-4 rounded-sm font-bold text-xs sm:text-sm tracking-[0.16em] uppercase inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>EXPLORE THE ARENAS</span>
            <ArrowRight size={15} className="text-[#C69B43]" />
          </Link>
        </div>

        <div className="pt-7 border-t border-[#C69B43]/25 text-xs sm:text-sm text-[#E8DFC8]/75 space-y-1">
          <p className="lc-font-heading text-[#E8C574] font-bold tracking-wider">
            CROSSROADS 2027 | 05 Feb &amp; 06 Feb 2027
          </p>
          <p className="text-[#E8DFC8]/60">
            Registration Window: January 10 – January 31, 2027 • HIET Ghaziabad
          </p>
        </div>
      </div>
    </section>
  );
}
