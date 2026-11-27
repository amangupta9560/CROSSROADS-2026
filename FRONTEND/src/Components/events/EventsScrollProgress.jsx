import { useEffect, useState } from 'react';

const EVENT_CHAPTERS = [
  { id: 'events-hero', code: '01', label: 'ARENAS' },
  { id: 'events-arenas', code: '02', label: 'CHAMBERS' },
  { id: 'events-hall', code: '03', label: 'LEGENDS' },
  { id: 'events-gateway', code: '04', label: 'REGISTER' },
];

export default function EventsScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const update = () => {
      rafId = 0;
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = Math.min(1, Math.max(0, window.scrollY / docHeight));
      setProgress(pct);

      const mid = window.scrollY + window.innerHeight * 0.42;
      let current = 0;
      for (let i = 0; i < EVENT_CHAPTERS.length; i += 1) {
        const el = document.getElementById(EVENT_CHAPTERS[i].id);
        if (el && el.offsetTop <= mid) current = i;
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

  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed bottom-0 inset-x-0 h-[2px] bg-[#080D0B]/70 z-[98] pointer-events-none xl:hidden"
      >
        <div
          className="h-full bg-gradient-to-r from-[#B86B35] via-[#E8C574] to-[#C69B43] transition-[width] duration-100 ease-out"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <aside
        aria-label="Events Section Navigator"
        className="fixed left-4 top-1/2 -translate-y-1/2 z-[98] hidden xl:flex flex-col items-center gap-3 pointer-events-auto"
      >
        <div className="relative h-44 w-7 flex items-center justify-center">
          <div className="w-[1px] h-full bg-[#C69B43]/25 relative">
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#E8C574] to-[#B86B35]"
              style={{ height: `${Math.round(progress * 100)}%` }}
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 transition-[top] duration-100"
            style={{ top: `${progress * 100}%` }}
          >
            <span className="w-[2px] h-3.5 bg-[#E8C574]" />
            <span className="w-2.5 h-[2px] bg-[#C69B43]" />
            <span className="w-[2px] h-3.5 bg-[#E8C574]" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-between items-center py-0.5">
            {EVENT_CHAPTERS.map((chap, idx) => (
              <button
                key={chap.id}
                type="button"
                onClick={() => jump(chap.id)}
                title={`${chap.code} · ${chap.label}`}
                aria-label={`Jump to ${chap.label}`}
                className="group relative flex items-center justify-center w-5 h-5 cursor-pointer"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIdx
                      ? 'bg-[#E8C574] scale-125 shadow-[0_0_8px_rgba(232,197,116,0.9)]'
                      : 'bg-[#C69B43]/35 group-hover:bg-[#E8C574]/80'
                  }`}
                />
                <span className="pointer-events-none absolute left-6 whitespace-nowrap px-2 py-0.5 rounded-sm bg-[#080D0B]/95 border border-[#C69B43]/40 text-[10px] font-semibold tracking-[0.18em] text-[#E8C574] opacity-0 group-hover:opacity-100 transition-opacity">
                  {chap.code} · {chap.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
