import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ChevronDown, ScrollText } from 'lucide-react';
import { faqs } from './homeData.js';
import { CornerFiligree, TempleDivider } from './OrnamentDivider.jsx';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export default function FAQSection({ openFAQ, toggleFAQ }) {
  return (
    <section
      id="faq"
      className="relative z-10 py-18 sm:py-28 px-4 sm:px-6 lg:px-8 lc-parchment-surface border-t border-[#C69B43]/25"
    >
      <div className="max-w-4xl mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#080D0B]/90 border border-[#C69B43]/35 text-[#E8C574] text-[10px] sm:text-[11px] uppercase tracking-[0.26em] font-semibold mb-4">
            <ScrollText size={13} className="text-[#C69B43]" />
            <span>Expedition Codex</span>
          </span>
          <h2 className="lc-font-display text-3xl sm:text-5xl font-black tracking-wide text-[#E8DFC8]">
            THE ANCIENT <span className="lc-gold-text">SCROLLS</span> — FAQ
          </h2>
          <TempleDivider className="my-4" />
          <p className="text-[#E8DFC8]/80 text-sm sm:text-lg max-w-xl mx-auto">
            Everything you need to know about participating in CROSSROADS 2027.
          </p>
        </Motion.div>

        <div className="space-y-3.5 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFAQ === idx;
            return (
              <Motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.45, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className={`relative rounded-lg border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#101D16]/95 border-[#C69B43]/65 shadow-[0_18px_40px_-15px_rgba(0,0,0,0.85)]'
                    : 'bg-[#080D0B]/88 border-[#C69B43]/25 hover:border-[#C69B43]/50'
                }`}
              >
                {/* Left Vertical Golden Scroll Accent */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#E8C574] to-[#B86B35] transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <CornerFiligree
                  className={`absolute top-1.5 left-1.5 transition-opacity ${
                    isOpen ? 'opacity-85' : 'opacity-35'
                  }`}
                />

                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-3 sm:gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 pl-2">
                    <span
                      className={`lc-font-heading shrink-0 w-8 h-8 rounded-sm border flex items-center justify-center text-xs font-bold transition-colors ${
                        isOpen
                          ? 'bg-[#C69B43] border-[#E8C574] text-[#080D0B]'
                          : 'bg-[#182B20] border-[#C69B43]/40 text-[#E8C574]'
                      }`}
                    >
                      {ROMAN_NUMERALS[idx] || idx + 1}
                    </span>
                    <span className="lc-font-heading text-sm sm:text-lg font-bold text-[#E8DFC8] tracking-wide">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-[#C69B43] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#E8C574]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <Motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <Motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.05 }}
                        className="px-5 sm:px-8 pb-5 sm:pb-6 pt-3 border-t border-[#C69B43]/20 text-sm sm:text-base text-[#E8DFC8]/88 leading-relaxed"
                      >
                        {faq.answer}
                      </Motion.div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </Motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
