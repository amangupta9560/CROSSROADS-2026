import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, AlertTriangle, CheckCircle, Info, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BroadcastBanner = () => {
  const [banner, setBanner] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const res = await axios.get(`${backendUrl}/api/settings`);
        if (res.data?.broadcastBanner?.enabled) {
          setBanner(res.data.broadcastBanner);
        }
      } catch (err) {
        // Silently fail if server unavailable
      }
    };

    fetchSettings();
  }, []);

  if (!banner || !banner.enabled || dismissed) return null;

  const levelStyles = {
    urgent: 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-red-500/40',
    warning: 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white border-amber-500/40',
    success: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white border-emerald-500/40',
    info: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white border-blue-500/40'
  };

  const getIcon = () => {
    switch (banner.level) {
      case 'urgent': return <AlertTriangle size={17} className="animate-pulse shrink-0" />;
      case 'warning': return <Bell size={17} className="shrink-0" />;
      case 'success': return <CheckCircle size={17} className="shrink-0" />;
      default: return <Info size={17} className="shrink-0" />;
    }
  };

  return (
    <div className={`relative z-[110] px-4 py-2.5 text-xs sm:text-sm font-medium border-b shadow-md flex items-center justify-between gap-3 ${levelStyles[banner.level] || levelStyles.info}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 flex-1 text-center">
        {getIcon()}
        <span className="leading-snug">{banner.text}</span>
        {banner.link && (
          <Link
            to={banner.link}
            className="inline-flex items-center gap-1 font-bold underline hover:no-underline ml-1.5 opacity-90 hover:opacity-100"
          >
            <span>Learn more</span>
            <ChevronRight size={14} />
          </Link>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-full hover:bg-black/20 text-white/80 hover:text-white transition shrink-0"
        title="Dismiss announcement"
        aria-label="Dismiss banner"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default BroadcastBanner;
