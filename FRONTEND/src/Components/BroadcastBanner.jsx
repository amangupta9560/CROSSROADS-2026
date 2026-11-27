import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { AlertTriangle, Bell, CheckCircle, ChevronRight, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const DISMISSED_TEXT_KEY = 'cr2027_dismissed_banner_text';
const BANNER_AUTO_HIDE_MS = 10000;

const BroadcastBanner = () => {
  const [banner, setBanner] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const res = await axios.get(`${backendUrl}/api/settings`, { timeout: 5000 });
        const incoming = res.data?.broadcastBanner;
        if (incoming?.enabled && incoming?.text) {
          const lastDismissed = sessionStorage.getItem(DISMISSED_TEXT_KEY);
          if (lastDismissed === incoming.text) {
            setDismissed(true);
            return;
          }
          setDismissed(false);
          setBanner(incoming);
        } else {
          setBanner(null);
        }
      } catch {
        // Silently ignore if backend temporarily unreachable
      }
    };

    fetchSettings();
    const poll = setInterval(fetchSettings, 30000);
    return () => clearInterval(poll);
  }, []);

  const dismissBanner = () => {
    setDismissed(true);
    if (banner?.text) {
      try {
        sessionStorage.setItem(DISMISSED_TEXT_KEY, banner.text);
      } catch {
        // ignore storage errors
      }
    }
  };

  // Auto-disappear notification banner cleanly after 10 seconds without browser refresh
  useEffect(() => {
    if (!banner || !banner.enabled || dismissed || paused) return undefined;
    timerRef.current = setTimeout(() => {
      setDismissed(true);
      try {
        sessionStorage.setItem(DISMISSED_TEXT_KEY, banner.text);
      } catch {
        // ignore storage errors
      }
    }, BANNER_AUTO_HIDE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [banner, dismissed, paused]);

  const levelStyles = {
    urgent: 'bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white border-red-400/50',
    warning: 'bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800 text-white border-amber-400/50',
    success: 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white border-emerald-400/50',
    info: 'bg-gradient-to-r from-[#182B20] via-[#101D16] to-[#182B20] text-[#E8DFC8] border-[#C69B43]/50',
  };

  const getIcon = () => {
    switch (banner?.level) {
      case 'urgent':
        return <AlertTriangle size={16} className="animate-pulse shrink-0" />;
      case 'warning':
        return <Bell size={16} className="shrink-0" />;
      case 'success':
        return <CheckCircle size={16} className="shrink-0" />;
      default:
        return <Info size={16} className="shrink-0 text-[#E8C574]" />;
    }
  };

  const isVisible = Boolean(banner && banner.enabled && !dismissed);

  return (
    <AnimatePresence>
      {isVisible && (
        <Motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          role="status"
          className={`relative z-[110] px-4 py-2.5 text-xs sm:text-sm font-medium border-b shadow-md flex items-center justify-between gap-3 ${
            levelStyles[banner.level] || levelStyles.info
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 flex-1 text-center">
            {getIcon()}
            <span className="leading-snug">{banner.text}</span>
            {banner.link && (
              <Link
                to={banner.link}
                onClick={dismissBanner}
                className="inline-flex items-center gap-1 font-bold underline hover:no-underline ml-1.5 opacity-95 hover:opacity-100 shrink-0"
              >
                <span>Learn more</span>
                <ChevronRight size={14} />
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={dismissBanner}
            className="p-1 rounded-full hover:bg-black/25 text-white/85 hover:text-white transition shrink-0 cursor-pointer"
            title="Dismiss announcement"
            aria-label="Dismiss banner"
          >
            <X size={16} />
          </button>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default BroadcastBanner;
