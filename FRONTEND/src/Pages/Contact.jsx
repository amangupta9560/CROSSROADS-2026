import { useEffect, useRef, useState } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Components/home/lostCivilization.css';
import StackingChapter from '../Components/about/StackingChapter.jsx';
import FloatingParticles from '../Components/home/FloatingParticles.jsx';
import { TempleDivider } from '../Components/home/OrnamentDivider.jsx';
import { AncientSunDisc } from '../Components/about/JungleCanopyVectors.jsx';
import ContactScrollProgress from '../Components/contact/ContactScrollProgress.jsx';
import ContactHero from '../Components/contact/ContactHero.jsx';
import ContactFormSection from '../Components/contact/ContactFormSection.jsx';

export default function Contact() {
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeoutRef = useRef(null);
  const gatewayRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress: gatewayScroll } = useScroll({
    target: gatewayRef,
    offset: ['start end', 'end start'],
  });
  const portalScale = useTransform(gatewayScroll, [0, 1], [1.14, 1.0]);
  const portalDiscRotate = useTransform(gatewayScroll, [0, 1], [-18, 28]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    setFormSuccess(false);

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://forminit.com/f/azygdkgb', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setFormSuccess(true);
        form.reset();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setFormSuccess(false), 5000);
      } else {
        setFormError('Something went wrong submitting your message. Please try again.');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setFormError(''), 5000);
      }
    } catch {
      setFormError('Network error while submitting form. Please try again.');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setFormError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="lc-root min-h-[100dvh] overflow-x-clip relative selection:bg-[#C69B43] selection:text-[#080D0B]">
      <ContactScrollProgress />

      {/* Chapter 01: Dispatch Beacon Hero & Direct Channels */}
      <StackingChapter anchorId="contact-dispatch" zIndex={10} isFirst>
        <ContactHero />
      </StackingChapter>

      {/* Chapter 02: Expedition Message Tablet & HIET Campus Locator */}
      <StackingChapter anchorId="contact-transmit" zIndex={20}>
        <ContactFormSection
          formSuccess={formSuccess}
          formError={formError}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </StackingChapter>

      {/* Chapter 03: Final Expedition Gateway */}
      <StackingChapter anchorId="contact-portal" zIndex={30} isLast>
        <section
          ref={gatewayRef}
          aria-label="Expedition Registration Portal"
          className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center overflow-hidden bg-[#080D0B]"
        >
          <Motion.div
            aria-hidden="true"
            style={!prefersReduced ? { scale: portalScale } : undefined}
            className="absolute inset-0 pointer-events-none will-change-transform"
          >
            <img
              src="/assets/lost-civilization/temple-gateway.webp"
              alt="Ancient Temple Gateway"
              loading="lazy"
              className="w-full h-full object-cover opacity-52"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,13,11,0.34)_0%,rgba(8,13,11,0.86)_72%,rgba(8,13,11,0.98)_100%)]" />
          </Motion.div>

          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Motion.div
              style={!prefersReduced ? { rotate: portalDiscRotate } : undefined}
              className="w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] opacity-[0.13] text-[#C69B43] will-change-transform"
            >
              <AncientSunDisc className="w-full h-full" />
            </Motion.div>
          </div>

          <FloatingParticles density="sparse" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/40 text-[#E8C574] text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold mb-4">
              <Compass size={13} className="text-[#C69B43]" />
              <span>HIET GHAZIABAD • TEAM TECH FUSION</span>
            </span>

            <h2 className="lc-font-display text-3xl sm:text-5xl font-black text-[#E8DFC8] tracking-wide mb-3">
              STEP INSIDE <span className="lc-gold-text">CROSSROADS</span>
            </h2>

            <TempleDivider className="my-4" />

            <p className="text-sm sm:text-lg text-[#E8DFC8]/85 max-w-xl mx-auto mb-8">
              Have your dispatch sealed? Explore all 11 temple competitions or register your squad
              before the gates close on January 31, 2027.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 max-w-md mx-auto">
              <Link
                to="/event-registration"
                className="lc-gold-btn lc-font-heading flex-1 px-7 py-4 rounded-sm font-extrabold text-xs sm:text-sm uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 group"
              >
                <span>Register Your Squad</span>
                <ArrowUpRight
                  size={16}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </Link>

              <Link
                to="/events"
                className="lc-stone-btn lc-font-heading px-6 py-4 rounded-sm font-bold text-xs sm:text-sm uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2"
              >
                <span>Explore Events</span>
                <ArrowRight size={15} className="text-[#C69B43]" />
              </Link>
            </div>
          </div>
        </section>
      </StackingChapter>
    </main>
  );
}
