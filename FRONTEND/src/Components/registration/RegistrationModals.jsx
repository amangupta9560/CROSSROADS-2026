import { useEffect } from 'react';
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
} from 'framer-motion';
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';
import WhatsAppIcon from '../common/WhatsAppIcon.jsx';

export const WHATSAPP_COMMUNITY_URL =
  'https://chat.whatsapp.com/DaK4uonBMwd4k7s8Pv7RNu';

/**
 * Animated Temple Explorer SVG mascot that leaps out from the registration button
 * cradling the expedition scroll when a team registration succeeds.
 */
function ExplorerMascotSVG({ reducedMotion }) {
  return (
    <div className="relative flex flex-col items-center select-none pointer-events-none">
      {/* Golden aura ring */}
      <Motion.div
        aria-hidden="true"
        animate={
          reducedMotion
            ? undefined
            : { scale: [0.95, 1.12, 0.95], opacity: [0.45, 0.85, 0.45] }
        }
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -inset-3 rounded-full bg-radial from-[#E8C574]/35 via-[#C69B43]/10 to-transparent blur-md"
      />

      <svg
        viewBox="0 0 140 150"
        className="relative w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_14px_24px_rgba(0,0,0,0.75)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="expHatGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C5230" />
            <stop offset="100%" stopColor="#3B2312" />
          </linearGradient>
          <linearGradient id="expGoldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF0B8" />
            <stop offset="50%" stopColor="#E8C574" />
            <stop offset="100%" stopColor="#9E6327" />
          </linearGradient>
          <linearGradient id="expCapeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8753B" />
            <stop offset="100%" stopColor="#6D3411" />
          </linearGradient>
        </defs>

        {/* Billowing Temple Amber Cape */}
        <Motion.path
          d="M42 74 Q22 104 34 134 L106 134 Q118 104 98 74 Z"
          fill="url(#expCapeGrad)"
          animate={
            reducedMotion
              ? undefined
              : {
                  d: [
                    'M42 74 Q22 104 34 134 L106 134 Q118 104 98 74 Z',
                    'M42 74 Q16 106 28 136 L112 136 Q124 106 98 74 Z',
                    'M42 74 Q22 104 34 134 L106 134 Q118 104 98 74 Z',
                  ],
                }
          }
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Astrolabe Base Ring */}
        <ellipse
          cx="70"
          cy="138"
          rx="36"
          ry="7"
          fill="#101D16"
          stroke="url(#expGoldGrad)"
          strokeWidth="2.5"
        />

        {/* Tunic & Gold Buckle */}
        <path
          d="M46 72 L94 72 L100 118 L40 118 Z"
          fill="#182B20"
          stroke="#C69B43"
          strokeWidth="1.5"
        />
        <rect x="42" y="96" width="56" height="8" rx="3" fill="url(#expGoldGrad)" />
        <circle cx="70" cy="85" r="7" fill="url(#expGoldGrad)" />

        {/* Left Raised Hand Holding Glowing Ancient Scroll */}
        <Motion.g
          animate={reducedMotion ? undefined : { rotate: [-6, 6, -6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '44px', originY: '76px' }}
        >
          <line
            x1="44"
            y1="78"
            x2="24"
            y2="54"
            stroke="#7C5633"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <rect
            x="10"
            y="38"
            width="24"
            height="14"
            rx="4"
            fill="#E8DFC8"
            stroke="url(#expGoldGrad)"
            strokeWidth="2.5"
          />
          <circle cx="22" cy="45" r="3" fill="#B86B35" />
        </Motion.g>

        {/* Right Raised Hand Holding Torch */}
        <Motion.g
          animate={reducedMotion ? undefined : { rotate: [5, -7, 5] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '96px', originY: '76px' }}
        >
          <line
            x1="96"
            y1="78"
            x2="116"
            y2="52"
            stroke="#7C5633"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <line
            x1="116"
            y1="54"
            x2="122"
            y2="34"
            stroke="#4A2C17"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <polygon points="122,16 116,32 128,32" fill="#FFB833" />
          <polygon points="122,20 119,30 125,30" fill="#FFF7CC" />
        </Motion.g>

        {/* Head + Glowing Visor + Fedora Hat */}
        <circle cx="70" cy="54" r="18" fill="#18261E" stroke="#C69B43" strokeWidth="1.5" />
        <rect x="57" y="49" width="26" height="8" rx="4" fill="url(#expGoldGrad)" />
        <path d="M36 42 Q70 49 104 42 Q70 35 36 42 Z" fill="url(#expHatGrad)" stroke="#C69B43" strokeWidth="1.5" />
        <path d="M51 40 L56 22 Q70 18 84 22 L89 40 Z" fill="url(#expHatGrad)" />
        <rect x="52" y="34" width="36" height="5" rx="2" fill="url(#expGoldGrad)" />
      </svg>
    </div>
  );
}

export function RulesModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow || 'unset';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  const guidelines = [
    {
      num: '01',
      title: 'Eligibility & Identity',
      items: [
        'Open to all enrolled undergraduate and postgraduate students from recognized colleges and universities.',
        'Every participant must carry their official college photo ID card on event days.',
        'Cross-college teams are permitted for team events.',
      ],
    },
    {
      num: '02',
      title: 'Team Size & Coordination',
      items: [
        'Respect the team size requirements specified for each event (Solo, 1-4, or 5-8 squad).',
        'All team members must report together at the HIET campus verification desk.',
        'The designated Team Leader will receive all official email alerts and schedule updates.',
      ],
    },
    {
      num: '03',
      title: 'Awards & Recognition',
      items: [
        'Total fest prize pool exceeding ₹1,00,000 across competitive categories.',
        'Winners receive trophies, certificates of merit, cash prizes, and sponsor hampers.',
        'All attending registered participants receive official Certificates of Participation.',
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div
            onClick={onClose}
            className="absolute inset-0 bg-[#040705]/88 backdrop-blur-md"
          />
          <Motion.div
            role="dialog"
            aria-modal="true"
            aria-label="CROSSROADS 2027 Guidelines"
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative lc-stone-surface lc-carved-border rounded-xl shadow-[0_32px_90px_rgba(0,0,0,0.92)] w-full max-w-3xl max-h-[90dvh] flex flex-col overflow-hidden my-auto z-10"
          >
            <CornerFiligree className="top-2.5 left-2.5 opacity-70" />
            <CornerFiligree className="bottom-2.5 right-2.5 rotate-180 opacity-70" />

            <div className="sticky top-0 bg-[#0D1611]/95 backdrop-blur-md border-b border-[#C69B43]/30 px-5 py-4 sm:px-8 sm:py-5 flex justify-between items-center z-10 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-[#182B20] border border-[#C69B43]/45 rounded-lg text-[#E8C574]">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-left">
                  <h3 className="lc-font-display text-base sm:text-xl font-black text-[#E8DFC8] uppercase tracking-wider">
                    CROSSROADS 2027 Guidelines
                  </h3>
                  <span className="lc-font-heading text-[10px] text-[#C69B43] tracking-[0.22em] block mt-0.5">
                    FESTIVAL PROTOCOLS
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close guidelines modal"
                className="p-2 rounded-lg bg-[#101D16] border border-[#C69B43]/30 text-[#E8DFC8]/75 hover:text-[#E8C574] hover:border-[#E8C574] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-6 sm:px-8 sm:py-8 flex-1 overflow-y-auto space-y-6 text-left">
              {guidelines.map((section) => (
                <div key={section.num} className="relative pl-5">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E8C574] to-[#B86B35] rounded-full" />
                  <h4 className="lc-font-heading text-[#E8C574] font-bold mb-2.5 flex items-center gap-2.5 uppercase text-xs sm:text-sm tracking-[0.14em]">
                    <span className="bg-[#C69B43]/20 border border-[#C69B43]/40 px-2 py-0.5 rounded text-[#E8C574] font-mono text-[11px]">
                      {section.num}
                    </span>
                    <span>{section.title}</span>
                  </h4>
                  <ul className="space-y-2 text-[#E8DFC8]/80 text-xs sm:text-sm">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <span className="w-1.5 h-1.5 rotate-45 bg-[#C69B43] mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

const SPARK_OFFSETS = [
  { x: -120, y: -90 },
  { x: -65, y: -135 },
  { x: 0, y: -150 },
  { x: 68, y: -135 },
  { x: 122, y: -90 },
  { x: -135, y: 12 },
  { x: 135, y: 12 },
  { x: -85, y: 80 },
  { x: 85, y: 80 },
];

export function RegistrationSuccessModal({
  registeredDetails,
  launchOrigin,
  copiedField,
  onCopy,
  onNavigateEvents,
}) {
  const prefersReduced = useReducedMotion();

  // Compute safe pixel delta from button center to viewport center
  const originDelta = (() => {
    if (prefersReduced || !launchOrigin || typeof window === 'undefined') {
      return { x: 0, y: 120 };
    }
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = Math.max(-cx + 60, Math.min(cx - 60, launchOrigin.x - cx));
    const dy = Math.max(-cy + 80, Math.min(cy - 60, launchOrigin.y - cy));
    return { x: dx, y: dy };
  })();

  return (
    <AnimatePresence>
      {registeredDetails && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[220] bg-[#040705]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        >
          <div className="relative w-full max-w-lg my-auto flex flex-col items-center">
            {/* Character leaping OUT of Submit Button & landing proudly atop Confirmation Card */}
            <Motion.div
              initial={
                prefersReduced
                  ? { opacity: 1, y: 0, scale: 1 }
                  : {
                      x: originDelta.x,
                      y: originDelta.y + 40,
                      scale: 0.12,
                      rotate: -18,
                      opacity: 0,
                    }
              }
              animate={{
                x: 0,
                y: 12,
                scale: 1,
                rotate: 0,
                opacity: 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 220,
                damping: 18,
                mass: 0.9,
              }}
              className="relative z-20 -mb-6 sm:-mb-7 flex flex-col items-center pointer-events-none"
            >
              {/* Burst particles emerging with character */}
              {!prefersReduced && (
                <div className="relative" aria-hidden="true">
                  {SPARK_OFFSETS.map((sp, i) => (
                    <Motion.span
                      key={i}
                      initial={{ x: 0, y: 35, scale: 0, opacity: 1 }}
                      animate={{
                        x: sp.x,
                        y: sp.y + 25,
                        scale: [0, 1.35, 0],
                        opacity: [1, 1, 0],
                      }}
                      transition={{
                        duration: 0.95,
                        delay: 0.14 + i * 0.03,
                        ease: 'easeOut',
                      }}
                      className="absolute left-1/2 top-1/2 w-2.5 h-2.5 rotate-45 bg-[#E8C574] shadow-[0_0_12px_#E8C574]"
                    />
                  ))}
                </div>
              )}

              <ExplorerMascotSVG reducedMotion={!!prefersReduced} />

              <Motion.div
                initial={prefersReduced ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.28, type: 'spring', stiffness: 280 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#C69B43] to-[#B86B35] text-[#080D0B] font-mono text-[10px] font-black uppercase tracking-[0.16em] shadow-[0_8px_20px_rgba(0,0,0,0.65)] border border-[#FFF2B2]/70"
              >
                <Sparkles size={11} />
                <span>Pass Unlocked!</span>
              </Motion.div>
            </Motion.div>

            {/* Popup Card emerging after Character lands */}
            <Motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Registration Successfully Completed"
              initial={
                prefersReduced
                  ? { opacity: 1, scale: 1 }
                  : {
                      x: originDelta.x * 0.35,
                      y: originDelta.y * 0.35,
                      scale: 0.55,
                      opacity: 0,
                    }
              }
              animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, y: 18, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 22,
                delay: prefersReduced ? 0 : 0.16,
              }}
              className="relative z-10 w-full max-h-[82dvh] overflow-y-auto lc-stone-surface lc-carved-border px-5 pb-5 pt-9 sm:px-7 sm:pb-7 sm:pt-10 rounded-2xl shadow-[0_32px_90px_rgba(0,0,0,0.94)] text-center"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#B86B35] via-[#E8C574] to-[#C69B43]" />
              <CornerFiligree className="top-3 left-3 opacity-75" />
              <CornerFiligree className="top-3 right-3 rotate-90 opacity-75" />

              <div className="mx-auto w-11 h-11 rounded-full bg-emerald-950/80 border-2 border-emerald-400/55 flex items-center justify-center mb-3 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.28)]">
                <CheckCircle2 size={24} />
              </div>

              <h2 className="lc-font-display text-lg sm:text-2xl font-black text-[#E8DFC8] mb-1 uppercase tracking-wide">
                Registration{' '}
                <span className="lc-gold-text">Successfully Completed!</span>
              </h2>
              <TempleDivider className="my-2.5" />
              <p className="text-xs sm:text-sm text-[#E8DFC8]/80 mb-4 max-w-sm mx-auto leading-relaxed">
                Your registration has been successfully completed for CROSSROADS 2027. A
                confirmation email has been dispatched to your team leader with all members in CC.
              </p>

              <div className="space-y-3 text-left mb-5">
                <div className="space-y-1">
                  <label className="lc-font-heading text-[10px] font-black uppercase tracking-[0.18em] text-[#E8C574] block">
                    Official Team Registration ID
                  </label>
                  <div className="flex gap-2 items-center bg-[#080D0B]/92 border border-[#C69B43]/45 px-3.5 py-2.5 rounded-lg font-mono text-xs sm:text-sm text-[#E8C574]">
                    <span className="flex-1 select-all font-bold tracking-wide truncate">
                      {registeredDetails.teamId}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy(registeredDetails.teamId, 'teamId')}
                      className="px-2.5 py-1 rounded bg-[#182B20] border border-[#C69B43]/45 text-[#E8C574] hover:bg-[#C69B43] hover:text-[#080D0B] transition-all text-xs flex items-center gap-1 font-sans shrink-0 cursor-pointer"
                    >
                      {copiedField === 'teamId' ? (
                        <>
                          <Check size={13} />
                          <span className="text-[10px] font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span className="text-[10px] font-bold">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#080D0B]/75 border border-[#C69B43]/25 space-y-2 text-xs">
                  <div className="flex justify-between gap-3">
                    <span className="text-[#E8DFC8]/65">Team Name:</span>
                    <span className="text-[#E8DFC8] font-bold truncate">
                      {registeredDetails.teamName}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[#E8DFC8]/65">Competition Arena:</span>
                    <span className="text-[#E8C574] font-bold truncate">
                      {registeredDetails.eventLabel}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[#E8DFC8]/65">Team Size (Inc. Leader):</span>
                    <span className="text-[#E8DFC8] font-bold">
                      {registeredDetails.teamSize} Member(s)
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[#E8DFC8]/65">Confirmation To:</span>
                    <span className="text-emerald-300 font-mono truncate">
                      {registeredDetails.leaderEmail}
                    </span>
                  </div>
                </div>
              </div>

              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-sm bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-600 hover:to-green-600 border border-emerald-400/70 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all font-mono mb-2.5 cursor-pointer"
              >
                <WhatsAppIcon className="w-[17px] h-[17px]" />
                <span>Join Official WhatsApp Community</span>
              </a>

              <button
                type="button"
                onClick={onNavigateEvents}
                className="lc-stone-btn lc-font-heading w-full flex items-center justify-center gap-2 py-2.5 rounded-sm font-bold text-xs uppercase tracking-[0.16em] cursor-pointer"
              >
                <span>Back to Events</span>
                <ChevronRight size={15} />
              </button>
            </Motion.div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
