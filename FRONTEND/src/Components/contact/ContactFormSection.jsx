import { useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Compass,
  Loader2,
  MapPin,
  ScrollText,
  Send,
} from 'lucide-react';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';
import FloatingParticles from '../home/FloatingParticles.jsx';
import { AncientSunDisc } from '../about/JungleCanopyVectors.jsx';

const BRANCH_OPTIONS = [
  { value: '', label: 'Select Branch' },
  { value: 'CSE', label: 'CSE' },
  { value: 'IT', label: 'IT' },
  { value: 'ECE', label: 'ECE' },
  { value: 'EE', label: 'EE' },
  { value: 'ME', label: 'ME' },
  { value: 'BCA', label: 'BCA' },
  { value: 'BBA', label: 'BBA' },
  { value: 'MBA', label: 'MBA' },
  { value: 'MCA', label: 'MCA' },
];

const INPUT_CLASS =
  'w-full px-4 py-3.5 rounded-md bg-[#080D0B]/85 border border-[#C69B43]/30 text-[#E8DFC8] placeholder-[#777568] text-sm sm:text-base transition-all duration-300 focus:outline-none focus:border-[#E8C574] focus:ring-1 focus:ring-[#E8C574]/50 focus:bg-[#0D1611]';

const LABEL_CLASS =
  'block lc-font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8C574]/90 mb-2';

/**
 * Expedition message dispatch tablet and HIET Ghaziabad campus sanctuary locator with scroll parallax layers.
 */
export default function ContactFormSection({
  formSuccess,
  formError,
  isSubmitting,
  onSubmit,
}) {
  const sectionRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const [focusedField, setFocusedField] = useState('');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const textureY = useTransform(scrollYProgress, [0, 1], [-32, 32]);
  const watermarkX = useTransform(scrollYProgress, [0, 1], ['-10%', '14%']);
  const compassRotate = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const mapCardY = useTransform(scrollYProgress, [0, 1], [16, -16]);

  return (
    <section
      ref={sectionRef}
      aria-label="Send Message and Visit HIET"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0C1611] overflow-hidden"
    >
      {/* Stone & Moss Parallax Texture Planes */}
      <Motion.div
        aria-hidden="true"
        style={!prefersReduced ? { y: textureY } : undefined}
        className="absolute -inset-8 pointer-events-none will-change-transform"
      >
        <img
          src="/assets/lost-civilization/moss-stone-texture.webp"
          alt="Moss-covered carved temple stone wall background"
          loading="lazy"
          className="w-full h-full object-cover opacity-22"
        />
      </Motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#080D0B]/92 via-[#0D1812]/72 to-[#080D0B]/94 pointer-events-none"
      />

      {/* Scroll-Rotating Background Astrolabe */}
      <div
        aria-hidden="true"
        className="hidden md:flex absolute -right-28 top-1/4 w-[460px] h-[460px] opacity-[0.07] text-[#C69B43] pointer-events-none"
      >
        <Motion.div
          style={!prefersReduced ? { rotate: compassRotate } : undefined}
          className="w-full h-full will-change-transform"
        >
          <AncientSunDisc className="w-full h-full" />
        </Motion.div>
      </div>

      <FloatingParticles density="sparse" />

      {/* Scrubbed Horizontal Sanctuary Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden mb-10 relative z-[2]"
      >
        <Motion.div
          style={!prefersReduced ? { x: watermarkX } : undefined}
          className="lc-watermark-text text-[2.2rem] sm:text-[4.2rem] lg:text-[5.8rem] whitespace-nowrap leading-none text-center will-change-transform"
        >
          TRANSMIT SCROLL • HIET GHAZIABAD SANCTUARY
        </Motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-start">
        {/* Left: Dispatch Scroll Form */}
        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 relative lc-stone-surface lc-carved-border rounded-xl p-6 sm:p-9 lg:p-10 shadow-[0_30px_80px_rgba(4,7,5,0.75)]"
        >
          <CornerFiligree className="top-3 left-3 opacity-65" />
          <CornerFiligree className="top-3 right-3 rotate-90 opacity-65" />
          <CornerFiligree className="bottom-3 left-3 -rotate-90 opacity-50" />
          <CornerFiligree className="bottom-3 right-3 rotate-180 opacity-50" />

          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[#C69B43] lc-font-heading text-[10px] tracking-[0.25em] uppercase font-bold mb-2">
                <ScrollText className="w-3.5 h-3.5" />
                <span>Carved Dispatch Tablet</span>
              </div>
              <h2 className="lc-font-display text-2xl sm:text-4xl font-black text-[#E8DFC8] tracking-wide">
                Send us a <span className="lc-gold-text">Message</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#E8DFC8]/75 mt-2">
                Fill out the form below and Team Tech Fusion will get back to you soon.
              </p>
            </div>
            {focusedField && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#101D16] border border-[#E8C574]/40 text-[#E8C574] font-mono text-[10px] uppercase tracking-widest shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8C574] animate-pulse" />
                {focusedField}
              </span>
            )}
          </div>

          <TempleDivider className="my-5" />

          <AnimatePresence mode="wait">
            {formSuccess && (
              <Motion.div
                key="contact-success"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                role="status"
                className="mb-6 p-4 rounded-md bg-emerald-950/60 border border-emerald-400/45 text-emerald-200 flex items-center gap-3 text-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Message sent successfully! We will get back to you soon.</span>
              </Motion.div>
            )}

            {formError && (
              <Motion.div
                key="contact-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                role="alert"
                className="mb-6 p-4 rounded-md bg-red-950/60 border border-red-400/45 text-red-200 flex items-center gap-3 text-sm"
              >
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{formError}</span>
              </Motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label htmlFor="contact-name" className={LABEL_CLASS}>
                  Full Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  placeholder="Aarav Sharma"
                  onFocus={() => setFocusedField('FULL NAME')}
                  onBlur={() => setFocusedField('')}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor="contact-email" className={LABEL_CLASS}>
                  Email *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  placeholder="aarav.sharma@college.edu"
                  onFocus={() => setFocusedField('EMAIL')}
                  onBlur={() => setFocusedField('')}
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label htmlFor="contact-mobile" className={LABEL_CLASS}>
                  WhatsApp / Mobile *
                </label>
                <input
                  id="contact-mobile"
                  type="tel"
                  name="mobile"
                  pattern="[6-9][0-9]{9}"
                  required
                  placeholder="9876543210"
                  onFocus={() => setFocusedField('MOBILE')}
                  onBlur={() => setFocusedField('')}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor="contact-branch" className={LABEL_CLASS}>
                  Branch *
                </label>
                <select
                  id="contact-branch"
                  name="branch"
                  required
                  onFocus={() => setFocusedField('BRANCH')}
                  onBlur={() => setFocusedField('')}
                  className={`${INPUT_CLASS} cursor-pointer`}
                >
                  {BRANCH_OPTIONS.map((opt) => (
                    <option
                      key={opt.value || 'empty'}
                      value={opt.value}
                      className="bg-[#0B140F] text-[#E8DFC8]"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className={LABEL_CLASS}>
                Message *
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows="4"
                placeholder="Tell us about your query or event interest..."
                onFocus={() => setFocusedField('MESSAGE')}
                onBlur={() => setFocusedField('')}
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            <Motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting && !prefersReduced ? { scale: 1.012 } : undefined}
              whileTap={!isSubmitting && !prefersReduced ? { scale: 0.988 } : undefined}
              className="lc-gold-btn lc-font-heading w-full py-4 rounded-sm font-extrabold text-xs sm:text-sm uppercase tracking-[0.18em] flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-[0_14px_32px_rgba(198,155,67,0.22)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SUBMITTING...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>SUBMIT CONTACT FORM</span>
                </>
              )}
            </Motion.button>
          </form>
        </Motion.div>

        {/* Right: Visit Us Tablet + Interactive Relic Map */}
        <Motion.div
          style={!prefersReduced ? { y: mapCardY } : undefined}
          className="lg:col-span-5 flex flex-col gap-6 will-change-transform"
        >
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative lc-moss-surface lc-carved-border rounded-xl p-6 sm:p-7 shadow-[0_24px_60px_rgba(4,7,5,0.68)]"
          >
            <CornerFiligree className="top-2.5 right-2.5 rotate-90 opacity-60" />

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-md bg-[#101D16]/95 border border-[#C69B43]/45 flex items-center justify-center text-[#E8C574] shrink-0 shadow-inner">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="lc-font-heading text-[10px] tracking-[0.24em] uppercase text-[#C69B43] font-bold">
                  SANCTUARY COORDINATES
                </span>
                <h3 className="lc-font-heading text-xl sm:text-2xl font-bold text-[#E8DFC8] mt-1">
                  Visit Us
                </h3>
                <p className="text-sm sm:text-base text-[#E8C574] font-semibold mt-1">
                  HIET Ghaziabad Campus
                </p>
                <p className="text-xs sm:text-sm text-[#E8DFC8]/80 mt-2 leading-relaxed">
                  Plot No. 766, 26th KM Milestone, NH-9
                  <br />
                  Ghaziabad, Uttar Pradesh – 201015
                </p>
              </div>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="relative lc-stone-surface lc-carved-border rounded-xl p-2.5 sm:p-3.5 shadow-[0_28px_72px_rgba(4,7,5,0.75)]"
          >
            <div className="flex items-center justify-between px-2 pb-2.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#C69B43]/85">
              <span className="inline-flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>EXPEDITION ATLAS</span>
              </span>
              <span className="text-[#E8DFC8]/60">28.6733° N, 77.4913° E</span>
            </div>

            <div className="relative h-72 sm:h-80 rounded-lg overflow-hidden border border-[#C69B43]/35 bg-[#080D0B]">
              <iframe
                title="HIET Ghaziabad Campus Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.545251972305!2d77.49128877566565!3d28.673331882226368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf2c4cac27f99%3A0xd9961659aee6d5b2!2sHi-Tech%20Institute%20of%20Engineering%20%26%20Technology!5e0!3m2!1sen!2sin!4v1739723721387!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'sepia(18%) contrast(1.04) brightness(0.92)',
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
}
