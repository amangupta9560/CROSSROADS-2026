import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * GhostTypeText: Original Lost Civilization predictive-inscription text effect.
 * Types a fixed base string, pauses, streams a ghostly translucent completion tail,
 * sweeps a warm golden highlight to accept it, and cycles through completions.
 */
export default function GhostTypeText({
  text = '',
  completions = [],
  typeSpeed = 38,
  streamSpeed = 24,
  thinkDelay = 380,
  acceptDelay = 460,
  holdDelay = 1750,
  ghostOpacity = 0.38,
  accentColor = '#E8C574',
  as = 'p',
  className = '',
  loop = true,
}) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  const safeCompletions = useMemo(
    () => (Array.isArray(completions) && completions.length > 0 ? completions : ['']),
    [completions]
  );

  const [typedBaseCount, setTypedBaseCount] = useState(0);
  const [completionIdx, setCompletionIdx] = useState(0);
  const [ghostCount, setGhostCount] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | typingBase | thinking | streamingGhost | accepting | holding | deleting

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !inView) return undefined;

    const activeEnding = safeCompletions[completionIdx] || '';
    let timeoutId = 0;

    if (phase === 'idle') {
      timeoutId = window.setTimeout(() => setPhase('typingBase'), 80);
    } else if (phase === 'typingBase') {
      if (typedBaseCount < text.length) {
        timeoutId = window.setTimeout(() => {
          setTypedBaseCount((c) => c + 1);
        }, typeSpeed);
      } else {
        timeoutId = window.setTimeout(() => setPhase('thinking'), thinkDelay);
      }
    } else if (phase === 'thinking') {
      timeoutId = window.setTimeout(() => {
        setGhostCount(0);
        setPhase('streamingGhost');
      }, 140);
    } else if (phase === 'streamingGhost') {
      if (ghostCount < activeEnding.length) {
        timeoutId = window.setTimeout(() => {
          setGhostCount((c) => c + 1);
        }, streamSpeed);
      } else {
        timeoutId = window.setTimeout(() => setPhase('accepting'), acceptDelay);
      }
    } else if (phase === 'accepting') {
      timeoutId = window.setTimeout(() => setPhase('holding'), 320);
    } else if (phase === 'holding') {
      if (!loop && completionIdx >= safeCompletions.length - 1) {
        return undefined;
      }
      timeoutId = window.setTimeout(() => setPhase('deleting'), holdDelay);
    } else if (phase === 'deleting') {
      if (ghostCount > 0) {
        timeoutId = window.setTimeout(() => {
          setGhostCount((c) => Math.max(0, c - 2));
        }, 16);
      } else {
        timeoutId = window.setTimeout(() => {
          setCompletionIdx((i) => (i + 1) % safeCompletions.length);
          setPhase('thinking');
        }, 180);
      }
    }

    return () => window.clearTimeout(timeoutId);
  }, [
    prefersReducedMotion,
    inView,
    phase,
    typedBaseCount,
    ghostCount,
    completionIdx,
    text,
    safeCompletions,
    typeSpeed,
    streamSpeed,
    thinkDelay,
    acceptDelay,
    holdDelay,
    loop,
  ]);

  const Tag = as;
  const fullStatic = `${text}${safeCompletions[0] || ''}`;

  if (prefersReducedMotion) {
    return (
      <Tag ref={containerRef} className={className}>
        <span>{text}</span>
        <span style={{ color: accentColor }}>{safeCompletions[0] || ''}</span>
      </Tag>
    );
  }

  const visibleBase = text.slice(0, typedBaseCount);
  const currentEnding = safeCompletions[completionIdx] || '';
  const visibleGhost = currentEnding.slice(0, ghostCount);
  const accepted = phase === 'accepting' || phase === 'holding';

  return (
    <Tag ref={containerRef} className={`relative inline-block ${className}`}>
      <span className="sr-only">{fullStatic}</span>
      <span aria-hidden="true">
        <span>{visibleBase}</span>
        {visibleGhost && (
          <span
            className="transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] px-0.5 rounded-[2px]"
            style={{
              opacity: accepted ? 1 : ghostOpacity,
              color: accepted ? accentColor : 'currentColor',
              backgroundColor:
                phase === 'accepting' ? 'rgba(198, 155, 67, 0.22)' : 'transparent',
            }}
          >
            {visibleGhost}
          </span>
        )}
        <span
          className="inline-block w-[2px] h-[0.92em] align-[-0.12em] ml-1 animate-pulse"
          style={{ backgroundColor: accentColor }}
        />
      </span>
    </Tag>
  );
}
