import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const ABOUT_CHAPTERS = [
  { id: 'about-beginning', code: '01', label: 'THE BEGINNING' },
  { id: 'about-origin', code: '02', label: 'THE ORIGIN' },
  { id: 'about-vision', code: '03', label: 'THE VISION' },
  { id: 'about-numbers', code: '04', label: 'THE SCALE' },
  { id: 'about-features', code: '05', label: 'THE EXPEDITION' },
  { id: 'about-arenas', code: '06', label: 'THE ARENAS' },
  { id: 'about-experience', code: '07', label: 'THE EXPERIENCE' },
  { id: 'about-timeline', code: '08', label: 'THE MAP' },
  { id: 'about-gateway', code: '09', label: 'THE JOURNEY AHEAD' },
];

export default function AboutScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = Math.min(1, Math.max(0, window.scrollY / docHeight));
      setProgress(pct);

      const mid = window.scrollY + window.innerHeight * 0.4;
      let current = 0;
      for (let i = 0; i < ABOUT_CHAPTERS.length; i += 1) {
        const el = document.getElementById(ABOUT_CHAPTERS[i].id);
        if (el && el.offsetTop <= mid) {
          current = i;
        }
      }
      setActiveIdx(current);
    };

    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.ctx.close();
        } catch {
          // ignore
        }
        audioRef.current = null;
      }
    };
  }, []);

  const toggleSound = () => {
    if (!soundEnabled) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const master = ctx.createGain();
        master.gain.value = 0.04;
        master.connect(ctx.destination);

        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = 55;
        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.value = 82.41;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 170;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(master);

        osc1.start();
        osc2.start();
        audioRef.current = { ctx, osc1, osc2 };
        setSoundEnabled(true);
      } catch {
        setSoundEnabled(false);
      }
    } else if (audioRef.current) {
      try {
        audioRef.current.ctx.close();
      } catch {
        // ignore
      }
      audioRef.current = null;
      setSoundEnabled(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const currentChapter = ABOUT_CHAPTERS[activeIdx] || ABOUT_CHAPTERS[0];

  return (
    <>
      {/* Mobile / Tablet Bottom Hairline Progress */}
      <div
        aria-hidden="true"
        className="fixed bottom-0 inset-x-0 h-[2px] bg-[#080D0B]/70 z-[98] pointer-events-none xl:hidden"
      >
        <div
          className="h-full bg-gradient-to-r from-[#B86B35] via-[#E8C574] to-[#C69B43] transition-[width] duration-100 ease-out"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      {/* Desktop Left-Edge Expedition Progress Map */}
      <aside
        aria-label="About Expedition Chapter Navigation"
        className="fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-[98] hidden xl:flex flex-col items-center gap-3 pointer-events-auto"
      >
        <div className="relative h-64 w-7 flex items-center justify-center">
          <div className="w-[1px] h-full bg-[#C69B43]/25 relative">
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#E8C574] to-[#B86B35]"
              style={{ height: `${Math.round(progress * 100)}%` }}
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 transition-[top] duration-100 ease-out"
            style={{ top: `${progress * 100}%` }}
          >
            <span className="w-[2px] h-3.5 bg-[#E8C574]" />
            <span className="w-2.5 h-[2px] bg-[#C69B43]" />
            <span className="w-[2px] h-3.5 bg-[#E8C574]" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-between items-center py-0.5">
            {ABOUT_CHAPTERS.map((chap, idx) => {
              const active = idx === activeIdx;
              return (
                <button
                  key={chap.id}
                  type="button"
                  onClick={() => scrollToSection(chap.id)}
                  title={`${chap.code} · ${chap.label}`}
                  aria-label={`Jump to ${chap.label}`}
                  className="group relative flex items-center justify-center w-5 h-5 cursor-pointer"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      active
                        ? 'bg-[#E8C574] scale-125 shadow-[0_0_8px_rgba(232,197,116,0.9)]'
                        : 'bg-[#C69B43]/35 group-hover:bg-[#E8C574]/80'
                    }`}
                  />
                  <span className="pointer-events-none absolute left-6 whitespace-nowrap px-2 py-0.5 rounded-sm bg-[#080D0B]/95 border border-[#C69B43]/40 text-[10px] font-semibold tracking-[0.18em] text-[#E8C574] opacity-0 group-hover:opacity-100 transition-opacity">
                    {chap.code} · {chap.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <span className="lc-font-heading text-[9px] tracking-[0.22em] text-[#C69B43]/85 uppercase [writing-mode:vertical-rl] rotate-180 select-none">
          {currentChapter.code} · {currentChapter.label}
        </span>
      </aside>

      {/* Bottom Floating Chapter Pill + Optional Ambient Audio Control */}
      <div className="fixed bottom-3.5 left-3.5 sm:left-5 xl:left-auto right-3.5 sm:right-5 z-[98] flex items-center justify-between xl:justify-end gap-2 pointer-events-none">
        <button
          type="button"
          onClick={() => {
            const next = ABOUT_CHAPTERS[(activeIdx + 1) % ABOUT_CHAPTERS.length];
            scrollToSection(next.id);
          }}
          className="xl:hidden pointer-events-auto inline-flex items-center gap-2 px-3 py-2 rounded-sm bg-[#080D0B]/90 backdrop-blur-md border border-[#C69B43]/40 text-[#E8C574] text-[10px] font-semibold tracking-[0.15em] uppercase shadow-lg cursor-pointer"
          aria-label="Advance to next expedition chapter"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8C574] animate-pulse" />
          <span>
            {currentChapter.code} / 0{ABOUT_CHAPTERS.length} · {currentChapter.label}
          </span>
        </button>

        <button
          type="button"
          onClick={toggleSound}
          aria-label={soundEnabled ? 'Mute ambient expedition audio' : 'Enable ambient expedition audio'}
          className="pointer-events-auto inline-flex items-center gap-2 px-3 py-2 rounded-sm bg-[#080D0B]/90 backdrop-blur-md border border-[#C69B43]/40 hover:border-[#E8C574] text-[#E8C574] text-[10px] font-semibold tracking-[0.18em] uppercase shadow-lg transition-colors cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 size={13} className="text-[#E8C574]" />
          ) : (
            <VolumeX size={13} className="text-[#C69B43]/75" />
          )}
          <span className="hidden sm:inline">{soundEnabled ? 'AMBIENT ON' : 'SOUND'}</span>
        </button>
      </div>
    </>
  );
}
