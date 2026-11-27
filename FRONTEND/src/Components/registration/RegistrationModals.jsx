import { useEffect } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Check, CheckCircle2, ChevronRight, Copy, ShieldCheck, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { CornerFiligree, TempleDivider } from '../home/OrnamentDivider.jsx';

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

export function RegistrationSuccessModal({
  registeredDetails,
  copiedField,
  onCopy,
  onNavigateEvents,
}) {
  return (
    <AnimatePresence>
      {registeredDetails && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[220] bg-[#040705]/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        >
          <Motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Registration Confirmed"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 18, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative max-w-lg w-full lc-stone-surface lc-carved-border p-6 sm:p-8 rounded-2xl shadow-[0_32px_90px_rgba(0,0,0,0.92)] overflow-hidden text-center my-auto"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#B86B35] via-[#E8C574] to-[#C69B43]" />
            <CornerFiligree className="top-3 left-3 opacity-75" />
            <CornerFiligree className="top-3 right-3 rotate-90 opacity-75" />

            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-950/75 border-2 border-emerald-400/50 flex items-center justify-center mb-4 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.25)]">
              <CheckCircle2 size={30} />
            </div>

            <h2 className="lc-font-display text-xl sm:text-2xl font-black text-[#E8DFC8] mb-1 uppercase tracking-wide">
              Registration <span className="lc-gold-text">Confirmed!</span>
            </h2>
            <TempleDivider className="my-3" />
            <p className="text-xs sm:text-sm text-[#E8DFC8]/75 mb-5 max-w-sm mx-auto leading-relaxed">
              Your team is registered for CROSSROADS 2027. Save your official credentials below.
            </p>

            <div className="space-y-4 text-left mb-6">
              <div className="space-y-1.5">
                <label className="lc-font-heading text-[10px] font-black uppercase tracking-[0.18em] text-[#E8C574] block">
                  Official Team Registration ID
                </label>
                <div className="flex gap-2 items-center bg-[#080D0B]/90 border border-[#C69B43]/40 px-4 py-3 rounded-lg font-mono text-xs sm:text-sm text-[#E8C574]">
                  <span className="flex-1 select-all font-bold tracking-wide truncate">
                    {registeredDetails.teamId}
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopy(registeredDetails.teamId, 'teamId')}
                    className="px-2.5 py-1.5 rounded bg-[#182B20] border border-[#C69B43]/45 text-[#E8C574] hover:bg-[#C69B43] hover:text-[#080D0B] transition-all text-xs flex items-center gap-1 font-sans shrink-0 cursor-pointer"
                  >
                    {copiedField === 'teamId' ? (
                      <>
                        <Check size={14} />
                        <span className="text-[10px] font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span className="text-[10px] font-bold">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#080D0B]/70 border border-[#C69B43]/25 space-y-2.5 text-xs">
                <div className="flex justify-between gap-3">
                  <span className="text-[#E8DFC8]/65">Team Name:</span>
                  <span className="text-[#E8DFC8] font-bold">{registeredDetails.teamName}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[#E8DFC8]/65">Competition Arena:</span>
                  <span className="text-[#E8C574] font-bold">{registeredDetails.eventLabel}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[#E8DFC8]/65">Confirmation Sent To:</span>
                  <span className="text-emerald-300 font-mono truncate">
                    {registeredDetails.leaderEmail}
                  </span>
                </div>
              </div>
            </div>

            <a
              href="https://chat.whatsapp.com/HR09HaxGTWmBiOKdAvwsg4"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-sm bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-600 hover:to-green-600 border border-emerald-400/70 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all font-mono mb-3 cursor-pointer"
            >
              <FaWhatsapp size={18} />
              <span>Join Official WhatsApp Community</span>
            </a>

            <button
              type="button"
              onClick={onNavigateEvents}
              className="lc-stone-btn lc-font-heading w-full flex items-center justify-center gap-2 py-3 rounded-sm font-bold text-xs uppercase tracking-[0.16em] cursor-pointer"
            >
              <span>Back to Events</span>
              <ChevronRight size={16} />
            </button>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
