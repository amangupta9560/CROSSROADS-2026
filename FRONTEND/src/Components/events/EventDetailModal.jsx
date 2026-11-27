import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ArrowUpRight, Calendar, FileText, MapPin, Trophy, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORY_BADGE_MAP } from './eventsData.js';
import { CornerFiligree } from '../home/OrnamentDivider.jsx';

export default function EventDetailModal({ selectedEvent, onClose, siteSettings }) {
  const isEventOpen =
    !!selectedEvent?.eventSlug &&
    siteSettings?.registrationOpen &&
    siteSettings?.eventStatus?.[selectedEvent.eventSlug] !== false;

  return (
    <AnimatePresence>
      {selectedEvent && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-[#040705]/88 backdrop-blur-xl" />

          <Motion.div
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative max-w-3xl w-full rounded-xl lc-stone-surface lc-carved-border shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <CornerFiligree className="absolute top-2.5 left-2.5 z-20 opacity-85" />
            <CornerFiligree className="absolute bottom-2.5 right-2.5 rotate-180 z-20 opacity-85" />

            <div className="relative p-5 sm:p-8 max-h-[90dvh] overflow-y-auto">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 p-2.5 rounded-full bg-[#080D0B]/90 hover:bg-[#B86B35]/30 text-[#E8DFC8] hover:text-white border border-[#C69B43]/40 transition-colors z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-52 sm:h-72 rounded-lg overflow-hidden mb-6 border border-[#C69B43]/35 bg-[#080D0B]">
                <img
                  src={selectedEvent.imageSrc}
                  alt={selectedEvent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080D0B] via-transparent to-transparent" />
                <div className="absolute bottom-3.5 left-3.5 flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] rounded-sm shadow-lg ${
                      CATEGORY_BADGE_MAP[selectedEvent.category] || 'bg-[#C69B43] text-[#080D0B]'
                    }`}
                  >
                    {selectedEvent.category}
                  </span>
                  <span className="px-3 py-1 text-[11px] font-semibold rounded-sm bg-[#080D0B]/90 text-[#E8C574] border border-[#C69B43]/40">
                    {selectedEvent.dayBadge}
                  </span>
                </div>
              </div>

              <h3 className="lc-font-display text-2xl sm:text-4xl font-black text-[#E8DFC8] mb-3">
                {selectedEvent.name}
              </h3>

              <p className="text-[#E8DFC8]/88 leading-relaxed mb-7 text-sm sm:text-lg">
                {selectedEvent.details.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-3.5 mb-8">
                <div className="flex items-start gap-3 p-4 bg-[#080D0B]/85 rounded-lg border border-[#C69B43]/28">
                  <Calendar className="w-5 h-5 text-[#C69B43] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-[#C69B43] uppercase tracking-[0.18em] mb-1">
                      Timing
                    </div>
                    <div className="text-xs sm:text-sm text-[#E8DFC8]/90">
                      {selectedEvent.details.timing}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[#080D0B]/85 rounded-lg border border-[#C69B43]/28">
                  <MapPin className="w-5 h-5 text-[#B86B35] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-[#C69B43] uppercase tracking-[0.18em] mb-1">
                      Location
                    </div>
                    <div className="text-xs sm:text-sm text-[#E8DFC8]/90">
                      {selectedEvent.details.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[#080D0B]/85 rounded-lg border border-[#C69B43]/28">
                  <Trophy className="w-5 h-5 text-[#E8C574] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-[#C69B43] uppercase tracking-[0.18em] mb-1">
                      Judging
                    </div>
                    <div className="text-xs sm:text-sm text-[#E8DFC8]/90">
                      {selectedEvent.details.judgingCriteria}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[#080D0B]/85 rounded-lg border border-[#C69B43]/28">
                  <Users className="w-5 h-5 text-[#C69B43] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-[#C69B43] uppercase tracking-[0.18em] mb-1">
                      Organizer
                    </div>
                    <div className="text-xs sm:text-sm text-[#E8DFC8]/90">
                      {selectedEvent.details.organizer}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="lc-stone-btn lc-font-heading sm:w-1/3 py-3.5 px-5 rounded-sm font-bold text-xs uppercase tracking-[0.15em] cursor-pointer"
                >
                  Close
                </button>

                {selectedEvent.rulesPdf && (
                  <a
                    href={selectedEvent.rulesPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm:w-1/3 py-3.5 px-5 bg-[#182B20] hover:bg-[#243D2C] text-[#E8C574] font-bold text-xs uppercase tracking-[0.14em] rounded-sm border border-[#C69B43]/45 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText size={16} />
                    <span>Rulebook PDF</span>
                  </a>
                )}

                {selectedEvent.eventSlug ? (
                  isEventOpen ? (
                    <Link
                      to={`/register?event=${selectedEvent.eventSlug}`}
                      className="lc-gold-btn lc-font-heading flex-1 group inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-sm font-extrabold text-xs uppercase tracking-[0.16em]"
                    >
                      <span>Register Now</span>
                      <ArrowUpRight
                        size={16}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex-1 py-3.5 px-6 bg-[#101D16] text-[#777568] font-bold text-xs uppercase tracking-[0.14em] rounded-sm border border-[#C69B43]/20 cursor-not-allowed"
                    >
                      Registrations Closed
                    </button>
                  )
                ) : (
                  <Link
                    to="/schedule"
                    className="lc-gold-btn lc-font-heading flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-sm font-extrabold text-xs uppercase tracking-[0.16em]"
                  >
                    <span>View Full Schedule</span>
                    <ArrowUpRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
