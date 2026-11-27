import { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function PreloaderCurtain() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !window.sessionStorage.getItem('cr27_seal_opened');
  });
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!visible || prefersReducedMotion) return undefined;

    let frame = 0;
    const start = performance.now();
    const duration = 750;

    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setPercent(Math.round(p * 100));
      if (p < 1) {
        frame = window.requestAnimationFrame(step);
      } else {
        window.sessionStorage.setItem('cr27_seal_opened', '1');
        setTimeout(() => setVisible(false), 140);
      }
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [visible, prefersReducedMotion]);

  const dismiss = () => {
    window.sessionStorage.setItem('cr27_seal_opened', '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <Motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
          onClick={dismiss}
          className="fixed inset-0 z-[120] bg-[#080D0B] flex flex-col items-center justify-center px-6 text-center cursor-pointer select-none"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,155,67,0.16),transparent_60%)] pointer-events-none"
          />

          <div className="relative z-10 max-w-xl w-full">
            <p className="lc-font-heading text-[11px] uppercase tracking-[0.32em] text-[#C69B43] mb-3">
              HIET GHAZIABAD • 05–06 FEB 2027
            </p>
            <h2 className="lc-font-display text-4xl sm:text-6xl font-black tracking-[0.08em] lc-gold-text mb-2">
              CROSSROADS 2027
            </h2>
            <p className="lc-font-heading text-xs sm:text-sm uppercase tracking-[0.26em] text-[#E8DFC8]/75 mb-8">
              BEYOND THE KNOWN. INTO THE UNKNOWN.
            </p>

            <div className="max-w-sm mx-auto">
              <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.26em] uppercase text-[#E8C574] mb-2">
                <span>AWAKENING TEMPLE SEAL</span>
                <span className="tabular-nums">{percent}%</span>
              </div>
              <div className="h-[2px] w-full bg-[#182B20] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B86B35] via-[#E8C574] to-[#C69B43] transition-[width] duration-75"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-4 text-[10px] tracking-[0.24em] uppercase text-[#E8DFC8]/45">
                [ CLICK ANYWHERE TO ENTER IMMEDIATELY ]
              </p>
            </div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
