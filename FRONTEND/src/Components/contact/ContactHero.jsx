import { useRef, useState } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Compass, Mail, Sparkles } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';
import FloatingParticles from '../home/FloatingParticles.jsx';
import GhostTypeText from '../about/GhostTypeText.jsx';
import {
  AncientSunDisc,
  JungleFoliageLeft,
  JungleFoliageRight,
} from '../about/JungleCanopyVectors.jsx';

const HERO_COMPLETIONS = [
  'Establish direct link with Team Tech Fusion.',
  'Transmit quest inquiries via WhatsApp or scroll.',
  'Coordinates locked: HIET Ghaziabad Sanctuary.',
];

function DispatchCard({ href, external = false, icon, badge, title, subtitle, value, ctaLabel, accentGlow }) {
  const prefersReduced = useReducedMotion();
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  const CardIcon = icon;

  const handleMouseMove = (e) => {
    if (prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - y) * 9,
      ry: (x - 0.5) * 9,
      gx: x * 100,
      gy: y * 100,
      active: true,
    });
  };

  const resetTilt = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  };

  return (
    <Motion.a
      ref={cardRef}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transform: prefersReduced
          ? undefined
          : `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${tilt.active ? -4 : 0}px)`,
        transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), border-color 250ms ease',
      }}
      className="group relative lc-stone-surface lc-carved-border rounded-lg p-6 sm:p-7 text-left block overflow-hidden shadow-[0_24px_60px_rgba(4,7,5,0.68)] hover:border-[#E8C574]/65"
    >
      {/* Interactive pointer torch glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: tilt.active ? 0.9 : 0,
          background: `radial-gradient(circle 220px at ${tilt.gx}% ${tilt.gy}%, ${accentGlow}, transparent 75%)`,
        }}
      />

      <CornerFiligree className="top-2.5 left-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
      <CornerFiligree className="top-2.5 right-2.5 rotate-90 opacity-60 group-hover:opacity-100 transition-opacity" />
      <CornerFiligree className="bottom-2.5 left-2.5 -rotate-90 opacity-45" />
      <CornerFiligree className="bottom-2.5 right-2.5 rotate-180 opacity-45" />

      <div className="relative z-10 flex items-start justify-between gap-4 mb-5">
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-md bg-[#101D16]/95 border border-[#C69B43]/45 flex items-center justify-center text-[#E8C574] shadow-inner group-hover:scale-105 group-hover:border-[#E8C574] transition-all duration-300">
          <CardIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <span className="lc-font-heading text-[10px] tracking-[0.24em] uppercase px-2.5 py-1 rounded-sm bg-[#080D0B]/75 border border-[#C69B43]/30 text-[#C69B43]">
          {badge}
        </span>
      </div>

      <div className="relative z-10">
        <h2 className="lc-font-heading text-xl sm:text-2xl font-bold text-[#E8DFC8] tracking-wide mb-1.5">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-[#E8DFC8]/70 mb-4">{subtitle}</p>
        <p className="font-mono text-sm sm:text-base font-bold text-[#E8C574] tracking-wide mb-4 break-all">
          {value}
        </p>

        <div className="inline-flex items-center gap-2 lc-font-heading text-[11px] uppercase tracking-[0.2em] font-bold text-[#E8DFC8]/90 group-hover:text-[#E8C574] transition-colors">
          <span>{ctaLabel}</span>
          <ArrowRight className="w-4 h-4 text-[#C69B43] group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </Motion.a>
  );
}

/**
 * Contact page opening temple beacon hero with scroll parallax astrolabe, ghost-typing dispatches, and 3D tilt cards.
 */
export default function ContactHero() {
  const heroRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 68]);
  const foliageY = useTransform(scrollYProgress, [0, 1], [0, 52]);
  const discRotate = useTransform(scrollYProgress, [0, 1], [0, 42]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 34]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.28]);

  return (
    <section
      ref={heroRef}
      aria-label="Contact Sanctuary Beacon"
      className="relative min-h-[92dvh] pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#080D0B] flex items-center"
    >
      {/* Distant temple jungle vista with scroll zoom */}
      <Motion.div
        aria-hidden="true"
        style={!prefersReduced ? { scale: bgScale, y: bgY } : undefined}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <img
          src="/assets/lost-civilization/hero-temple.webp"
          alt="Lost Civilization Temple Sanctuary"
          className="w-full h-full object-cover opacity-32"
        />
        <img
          src="/assets/lost-civilization/parchment-map.webp"
          alt=""
          className="w-full h-full object-cover opacity-15 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(198,155,67,0.14)_0%,rgba(16,29,22,0.72)_48%,rgba(8,13,11,0.97)_100%)]" />
      </Motion.div>

      {/* Scroll-driven Astrolabe Beacon Disc & Signal Rings */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
      >
        <Motion.div
          style={!prefersReduced ? { rotate: discRotate } : undefined}
          className="w-[460px] h-[460px] sm:w-[660px] sm:h-[660px] opacity-[0.14] text-[#C69B43] will-change-transform"
        >
          <AncientSunDisc className="w-full h-full" />
        </Motion.div>

        {!prefersReduced && (
          <>
            <Motion.div
              animate={{ scale: [0.82, 1.35], opacity: [0.35, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-[#C69B43]/35"
            />
            <Motion.div
              animate={{ scale: [0.75, 1.55], opacity: [0.25, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeOut', delay: 2.1 }}
              className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-[#E8C574]/25"
            />
          </>
        )}
      </div>

      {/* Silhouette canopy wings */}
      <Motion.div
        aria-hidden="true"
        style={!prefersReduced ? { y: foliageY } : undefined}
        className="absolute inset-x-0 top-0 bottom-0 pointer-events-none opacity-60 hidden md:flex justify-between items-end will-change-transform"
      >
        <JungleFoliageLeft className="w-44 lg:w-64 h-auto -ml-6" />
        <JungleFoliageRight className="w-44 lg:w-64 h-auto -mr-6" />
      </Motion.div>

      <FloatingParticles density="normal" />

      <Motion.div
        style={!prefersReduced ? { y: contentY, opacity: contentOpacity } : undefined}
        className="relative z-10 max-w-5xl mx-auto w-full text-center will-change-transform"
      >
        <Motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/45 text-[#E8C574] text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase mb-5 shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C69B43]" />
          <span>CROSSROADS 2027 • 05 FEB & 06 FEB 2027</span>
        </Motion.div>

        <Motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.08 }}
          className="lc-font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-wide text-[#E8DFC8] mb-3"
        >
          Contact <span className="lc-gold-text">Us</span>
        </Motion.h1>

        <TempleDivider className="my-4" />

        <div className="min-h-[1.75rem] flex items-center justify-center mb-3 px-2">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#E8C574]/90">
            <Compass className="w-4 h-4 text-[#C69B43] shrink-0" />
            <GhostTypeText
              text="Expedition Signal: "
              completions={HERO_COMPLETIONS}
              as="span"
              className="font-mono text-xs sm:text-sm"
            />
          </span>
        </div>

        <Motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.16 }}
          className="text-sm sm:text-lg text-[#E8DFC8]/85 max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-12"
        >
          Join us for an unforgettable journey of innovation and technology. Registrations open
          January 10 – January 31, 2027.
        </Motion.p>

        {/* Quick-Access Direct Dispatch Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 max-w-4xl mx-auto">
          <DispatchCard
            href="https://wa.me/918802323375"
            external
            icon={FaWhatsapp}
            badge="INSTANT SIGNAL"
            title="WhatsApp"
            subtitle="Chat with us instantly"
            value="+91 8802323375"
            ctaLabel="Open WhatsApp"
            accentGlow="rgba(74, 222, 128, 0.14)"
          />
          <DispatchCard
            href="mailto:techfusion@hietgroup.org"
            icon={Mail}
            badge="ROYAL MISSIVE"
            title="Email"
            subtitle="Drop us a message"
            value="techfusion@hietgroup.org"
            ctaLabel="Send Email"
            accentGlow="rgba(232, 197, 116, 0.18)"
          />
        </div>
      </Motion.div>
    </section>
  );
}
