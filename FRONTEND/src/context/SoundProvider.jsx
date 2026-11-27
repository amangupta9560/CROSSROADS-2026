import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { Volume2, VolumeX, Waves } from 'lucide-react';
import { horrorAudio } from '../utils/horrorAudioEngine.js';
import { SoundContext } from './soundStore.js';

const LS_AUDIO_KEY = 'cr2027_horror_audio';
const LS_VOL_KEY = 'cr2027_horror_vol';

/**
 * Global Horror Audio controller & site-wide interactive SFX delegator
 * covering navigation portals, button clicks, hovers, and scroll-depth creaks.
 */
export default function SoundProvider({ children }) {
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  const [enabled, setEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_AUDIO_KEY);
      return saved === null ? true : saved === 'on';
    } catch {
      return true;
    }
  });

  const [volume, setVolumeState] = useState(() => {
    try {
      const saved = parseFloat(localStorage.getItem(LS_VOL_KEY));
      return Number.isFinite(saved) && saved >= 0 && saved <= 1 ? saved : 0.68;
    } catch {
      return 0.68;
    }
  });

  const [unlocked, setUnlocked] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const prevPathRef = useRef(location.pathname);
  const lastHoveredElRef = useRef(null);
  const scrollMilestonesRef = useRef(new Set());

  // Sync engine configuration
  useEffect(() => {
    horrorAudio.setVolume(volume);
    try {
      localStorage.setItem(LS_VOL_KEY, String(volume));
    } catch {
      // ignore storage errors
    }
  }, [volume]);

  useEffect(() => {
    horrorAudio.setEnabled(enabled);
    try {
      localStorage.setItem(LS_AUDIO_KEY, enabled ? 'on' : 'off');
    } catch {
      // ignore storage errors
    }
  }, [enabled]);

  // First browser gesture unlocks Web Audio API seamlessly
  useEffect(() => {
    const attemptUnlock = async () => {
      if (!enabled) return;
      const ok = await horrorAudio.unlockAndStart();
      if (ok) {
        setUnlocked(true);
      }
    };

    const onGesture = () => {
      attemptUnlock();
    };

    window.addEventListener('pointerdown', onGesture, { passive: true });
    window.addEventListener('touchstart', onGesture, { passive: true });
    window.addEventListener('keydown', onGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('touchstart', onGesture);
      window.removeEventListener('keydown', onGesture);
    };
  }, [enabled]);

  // Site-wide delegated hover & stone-click SFX across all buttons, cards, links, tabs
  useEffect(() => {
    if (!enabled) return undefined;

    const interactiveSelector =
      'a, button, [role="button"], select, summary, input[type="checkbox"], input[type="radio"]';

    const onPointerOver = (e) => {
      const target = e.target?.closest?.(interactiveSelector);
      if (!target || target === lastHoveredElRef.current) return;
      lastHoveredElRef.current = target;
      horrorAudio.playHover();
    };

    const onPointerOut = (e) => {
      const leaving = e.target?.closest?.(interactiveSelector);
      if (leaving && leaving === lastHoveredElRef.current) {
        if (!leaving.contains(e.relatedTarget)) {
          lastHoveredElRef.current = null;
        }
      }
    };

    const onClick = async (e) => {
      const target = e.target?.closest?.(interactiveSelector);
      if (!target) return;
      if (horrorAudio.getState() !== 'running') {
        const ok = await horrorAudio.unlockAndStart();
        if (ok) setUnlocked(true);
      }
      horrorAudio.playClick();
    };

    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
    document.addEventListener('click', onClick, { capture: true, passive: true });

    return () => {
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      document.removeEventListener('click', onClick, { capture: true });
    };
  }, [enabled]);

  // Eerie portal transition sweep whenever route changes + reset scroll depth milestones
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      scrollMilestonesRef.current.clear();
      if (enabled && horrorAudio.getState() === 'running') {
        horrorAudio.playRouteTransition();
      }
    }
  }, [location.pathname, enabled]);

  // Subtle haunted temple creak as visitors descend deeper into any page
  useEffect(() => {
    if (!enabled) return undefined;
    const onScroll = () => {
      if (horrorAudio.getState() !== 'running') return;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 200) return;
      const ratio = window.scrollY / docHeight;
      const milestones = [0.22, 0.5, 0.78];
      for (const m of milestones) {
        if (ratio >= m && !scrollMilestonesRef.current.has(m)) {
          scrollMilestonesRef.current.add(m);
          horrorAudio.playDepthCreak();
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enabled]);

  const toggleSound = useCallback(async () => {
    if (!enabled) {
      setEnabled(true);
      horrorAudio.setEnabled(true);
      const ok = await horrorAudio.unlockAndStart();
      if (ok) {
        setUnlocked(true);
        horrorAudio.triggerEerieTempleChime();
      }
      return;
    }

    if (!unlocked) {
      const ok = await horrorAudio.unlockAndStart();
      if (ok) {
        setUnlocked(true);
        horrorAudio.triggerEerieTempleChime();
      }
      return;
    }

    setEnabled(false);
  }, [enabled, unlocked]);

  const setVolume = useCallback((val) => {
    setVolumeState(val);
  }, []);

  const triggerChime = useCallback(async () => {
    const ok = await horrorAudio.unlockAndStart();
    if (ok) {
      setUnlocked(true);
      if (!enabled) setEnabled(true);
      horrorAudio.triggerEerieTempleChime();
    }
  }, [enabled]);

  const contextValue = useMemo(
    () => ({
      enabled,
      unlocked,
      volume,
      toggleSound,
      setVolume,
      triggerChime,
    }),
    [enabled, unlocked, volume, toggleSound, setVolume, triggerChime]
  );

  const isPlayingLive = enabled && unlocked;

  return (
    <SoundContext.Provider value={contextValue}>
      {children}

      {/* Floating Lost Civilization Horror Audio HUD */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99] flex flex-col items-end gap-2 pointer-events-auto">
        <AnimatePresence>
          {drawerOpen && (
            <Motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.94 }}
              transition={{ duration: 0.22 }}
              className="w-56 p-3.5 rounded-xl bg-[#09120D]/95 border border-[#C69B43]/45 shadow-[0_18px_45px_rgba(0,0,0,0.85)] backdrop-blur-xl text-left space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#E8C574] font-bold">
                  Temple Ambience
                </span>
                <button
                  type="button"
                  onClick={triggerChime}
                  className="px-2 py-0.5 rounded bg-[#182B20] border border-[#C69B43]/40 text-[10px] font-mono text-[#E8C574] hover:border-[#E8C574] cursor-pointer transition-colors"
                >
                  Chime
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-[#E8DFC8]/70">
                  <span>Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={volume}
                  aria-label="Horror sound volume"
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-[#C69B43] cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={toggleSound}
                className="w-full py-1.5 px-3 rounded border border-[#C69B43]/35 bg-[#101D16] hover:border-[#E8C574] text-[#E8DFC8] text-[11px] font-mono uppercase tracking-wider cursor-pointer transition-colors"
              >
                {enabled ? (unlocked ? 'Mute Sound' : 'Awaken Sound') : 'Enable Sound'}
              </button>
            </Motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#09120D]/92 border border-[#C69B43]/45 shadow-[0_12px_32px_rgba(0,0,0,0.82)] backdrop-blur-xl">
          <button
            type="button"
            onClick={toggleSound}
            aria-label={
              enabled
                ? unlocked
                  ? 'Mute horror ambience'
                  : 'Tap to awaken horror ambience'
                : 'Enable horror ambience'
            }
            className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-full hover:bg-[#182B20]/85 transition-colors cursor-pointer"
          >
            {isPlayingLive ? (
              <Volume2 size={15} className="text-[#E8C574] shrink-0" />
            ) : enabled ? (
              <Volume2 size={15} className="text-[#E8C574]/85 animate-pulse shrink-0" />
            ) : (
              <VolumeX size={15} className="text-[#E8DFC8]/50 shrink-0" />
            )}

            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E8DFC8]">
              {!enabled ? 'Muted' : unlocked ? 'Horror Audio' : 'Awaken Audio'}
            </span>

            {isPlayingLive && !prefersReduced && (
              <span aria-hidden="true" className="flex items-end gap-[2px] h-3">
                <span className="w-[2px] h-2 bg-[#E8C574] animate-pulse" />
                <span
                  className="w-[2px] h-3 bg-[#B86B35] animate-pulse"
                  style={{ animationDelay: '0.18s' }}
                />
                <span
                  className="w-[2px] h-1.5 bg-[#E8C574] animate-pulse"
                  style={{ animationDelay: '0.35s' }}
                />
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setDrawerOpen((prev) => !prev)}
            aria-label="Audio settings"
            aria-expanded={drawerOpen}
            className={`w-7 h-7 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
              drawerOpen
                ? 'bg-[#C69B43]/25 border-[#E8C574] text-[#E8C574]'
                : 'bg-[#101D16] border-[#C69B43]/30 text-[#E8DFC8]/75 hover:text-[#E8C574]'
            }`}
          >
            <Waves size={13} />
          </button>
        </div>
      </div>
    </SoundContext.Provider>
  );
}
