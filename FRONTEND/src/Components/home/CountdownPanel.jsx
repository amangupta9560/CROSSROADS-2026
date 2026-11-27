import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Clock, ShieldCheck } from 'lucide-react';
import { CornerFiligree } from './OrnamentDivider.jsx';

export default function CountdownPanel({ timeLeft }) {
  const units = [
    { value: timeLeft.days, label: 'DAYS', glyph: 'I' },
    { value: timeLeft.hours, label: 'HOURS', glyph: 'II' },
    { value: timeLeft.minutes, label: 'MINUTES', glyph: 'III' },
    { value: timeLeft.seconds, label: 'SECONDS', glyph: 'IV' },
  ];

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div
        aria-hidden="true"
        className="absolute -inset-3 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(198,155,67,0.2),transparent_70%)] blur-xl pointer-events-none"
      />

      <div className="relative lc-stone-surface lc-carved-border rounded-xl p-4 sm:p-7 overflow-hidden">
        {/* Subtle Slowly Rotating Astrolabe Ring Watermark */}
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          fill="none"
          className="lc-animate-spin-slow pointer-events-none absolute -right-14 -bottom-14 w-48 h-48 text-[#C69B43]/[0.07]"
        >
          <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 6" />
          <circle cx="100" cy="100" r="66" stroke="currentColor" strokeWidth="1" />
          <polygon points="100,12 108,30 92,30" fill="currentColor" />
        </svg>

        <CornerFiligree className="absolute top-2 left-2 opacity-80" />
        <CornerFiligree className="absolute top-2 right-2 rotate-90 opacity-80" />
        <CornerFiligree className="absolute bottom-2 left-2 -rotate-90 opacity-80" />
        <CornerFiligree className="absolute bottom-2 right-2 rotate-180 opacity-80" />

        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C69B43] to-transparent opacity-85" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3.5 mb-4 sm:mb-5 border-b border-[#C69B43]/20">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <Clock className="w-4 h-4 text-[#C69B43] shrink-0" />
              <span className="lc-font-heading text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#E8C574] font-bold">
                {timeLeft.expired ? 'CROSSROADS HAS BEGUN!' : 'THE AWAKENING COUNTDOWN'}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-[#E8DFC8]/70 font-medium text-center sm:text-right">
              HIET CAMPUS • FEB 05–06, 2027
            </span>
          </div>

          {!timeLeft.expired ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-4 sm:mb-5">
              {units.map((unit) => {
                const formatted = String(unit.value).padStart(2, '0');
                return (
                  <div
                    key={unit.label}
                    className="relative group rounded-lg bg-[#080D0B]/88 border border-[#C69B43]/28 hover:border-[#C69B43]/65 px-3 py-3 sm:py-4 text-center transition-colors duration-300 shadow-[inset_0_2px_12px_rgba(0,0,0,0.9)]"
                  >
                    <span className="block text-[9px] tracking-[0.28em] text-[#B8B2A1] uppercase mb-1">
                      {unit.glyph}
                    </span>
                    <div className="h-9 sm:h-12 flex items-center justify-center overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <Motion.span
                          key={formatted}
                          initial={{ y: 12, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -12, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="lc-font-heading lc-gold-text text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight tabular-nums leading-none"
                        >
                          {formatted}
                        </Motion.span>
                      </AnimatePresence>
                    </div>
                    <span className="block mt-1.5 text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-[#E8DFC8]/80 font-semibold">
                      {unit.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-5 text-center">
              <p className="lc-font-display lc-gold-text text-2xl sm:text-3xl font-bold tracking-wider">
                THE LOST CIVILIZATION IS LIVE!
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-[#C69B43]/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#E8DFC8]/80">
            <span className="flex items-center gap-2 font-medium text-[#E8C574]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C69B43] shrink-0" />
              <span>
                Reg Starts: <strong className="text-[#E8DFC8]">Jan 10, 2027</strong> • Last Date:{' '}
                <strong className="text-[#E8DFC8]">Jan 31, 2027</strong>
              </span>
            </span>
            <span className="text-[11px] uppercase tracking-[0.16em] text-[#E8DFC8]/70">
              100% Free Entry • Limited Slots
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
