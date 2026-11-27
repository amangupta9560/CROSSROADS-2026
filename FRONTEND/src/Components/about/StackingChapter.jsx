import { useEffect, useRef, useState } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/**
 * StackingChapter: Renders each About section as an overlapping ancient stone chapter.
 * Uses height-aware `sticky` positioning (`Math.min(0, viewportHeight - sectionHeight)`)
 * so sections taller than 100dvh remain 100% scrollable before locking cleanly as the
 * next chapter slides up over them with subtle depth scale-back and shadow dimming.
 */
export default function StackingChapter({
  anchorId,
  zIndex = 10,
  isFirst = false,
  isLast = false,
  children,
}) {
  const prefersReducedMotion = useReducedMotion();
  const stickyRef = useRef(null);
  const coverSentinelRef = useRef(null);
  const [stickyTop, setStickyTop] = useState(0);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el || prefersReducedMotion) return undefined;

    const recalc = () => {
      const vh = window.innerHeight || 800;
      const h = el.offsetHeight || vh;
      const nextTop = Math.min(0, vh - h);
      setStickyTop((prev) => (Math.abs(prev - nextTop) > 2 ? nextTop : prev));
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    window.addEventListener('resize', recalc, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recalc);
    };
  }, [prefersReducedMotion]);

  const { scrollYProgress } = useScroll({
    target: coverSentinelRef,
    offset: ['start end', 'start start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const dimOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.5]);

  return (
    <>
      {anchorId && (
        <span id={anchorId} aria-hidden="true" className="block h-0 w-0 pointer-events-none" />
      )}

      <div
        ref={stickyRef}
        style={{
          zIndex,
          top: prefersReducedMotion || isLast ? undefined : `${stickyTop}px`,
        }}
        className={`${prefersReducedMotion || isLast ? 'relative' : 'sticky'
          } w-full will-change-transform ${!isFirst
            ? 'rounded-t-[1.5rem] sm:rounded-t-[2.25rem] border-t border-[#C69B43]/40 shadow-[0_-28px_85px_rgba(0,0,0,0.92)] overflow-hidden'
            : ''
          }`}
      >
        {/* Subtle overlapping golden keystone edge on rising chapters */}
        {!isFirst && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 inset-x-0 h-[2px] z-30 bg-gradient-to-r from-transparent via-[#E8C574]/80 to-transparent"
          />
        )}

        <Motion.div
          style={
            prefersReducedMotion || isLast
              ? undefined
              : { scale, transformOrigin: 'center bottom' }
          }
          className="relative w-full will-change-transform"
        >
          {children}

          {/* Depth shadow veil as the next chapter slides over this one */}
          {!prefersReducedMotion && !isLast && (
            <Motion.div
              aria-hidden="true"
              style={{ opacity: dimOpacity }}
              className="pointer-events-none absolute inset-0 z-30 bg-[#040705]"
            />
          )}
        </Motion.div>
      </div>

      {/* Zero-height non-sticky sentinel marks exact moment the next chapter rises over */}
      {!isLast && (
        <div
          ref={coverSentinelRef}
          aria-hidden="true"
          className="h-px w-full pointer-events-none"
        />
      )}
    </>
  );
}
