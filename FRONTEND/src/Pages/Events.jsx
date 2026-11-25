import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  X,
  Sparkles,
  ChevronRight,
  FileText,
  Clock,
  ArrowUpRight,
  Terminal,
} from "lucide-react";
import TechBackground from "../Components/TechBackground.jsx";

// Event Images
import event1 from "../assets/coding.jpg";
import event2 from "../assets/project.jpg";
import event3 from "../assets/robo.jpg";
import event4 from "../assets/cultural.jpg";
import event5 from "../assets/rangoli.jpeg";
import event6 from "../assets/food.jpg";
import event9 from "../assets/poster.jpg";
import event10 from "../assets/rock.jpg";
import event11 from "../assets/dance.jpg";
import event12 from "../assets/tresure.jpeg";
import event13 from "../assets/film.jpeg";

// Winner Images
import w1 from "../assets/w1.jpg";
import w2 from "../assets/w2.jpg";
import w3 from "../assets/w3.jpg";
import w4 from "../assets/w4.jpg";
import w5 from "../assets/w5.jpg";
import w6 from "../assets/w6.jpg";
import w7 from "../assets/w7.jpg";
import w8 from "../assets/w8.jpg";
import w9 from "../assets/w9.jpg";
import w10 from "../assets/w10.jpg";
import w11 from "../assets/w11.jpg";
import w12 from "../assets/w12.jpg";
import w13 from "../assets/w13.jpg";
import w14 from "../assets/w14.jpg";

// Rules PDFs
import codeRules from "../assets/CODE.pdf";
import posterRules from "../assets/POSTER.pdf";
import roboRules from "../assets/ROBO.pdf";
import foodRules from "../assets/FOOD.pdf";
import rangoliRules from "../assets/RANGOLI.pdf";
import shortFilmRules from "../assets/SHORT.pdf";
import treasureRules from "../assets/TREASURE.pdf";

const smoothEase = [0.22, 1, 0.36, 1];

const events = [
  {
    id: 1,
    imageSrc: event1,
    name: "Code Puzzle",
    category: "Technical",
    eventSlug: "code-puzzle",
    dayBadge: "Feb 05, 2027",
    rulesPdf: codeRules,
    details: {
      description:
        "A fast-paced solo coding challenge where participants solve puzzles in 20 minutes using any supported language (Python, Java, C++, etc.).",
      timing: "Feb 05, 2027, 10:00 AM – 2:00 PM (submissions within slot)",
      location: "Block 1 Computer Lab",
      judgingCriteria: "Correctness, Efficiency, Code Quality (based on final score)",
      organizer: "HIET Ghaziabad",
    },
  },
  {
    id: 2,
    imageSrc: event2,
    name: "Project Exhibition / Project Evolution",
    category: "Technical",
    eventSlug: "project-exhibition",
    dayBadge: "Feb 05, 2027",
    details: {
      description:
        "Showcase innovative student projects, prototypes, and engineering solutions (1–4 members) to judges and visitors.",
      timing: "Feb 05, 2027, 10:00 AM – 2:00 PM",
      location: "Exhibition Ground",
      judgingCriteria: "Originality, Technical Execution, Impact, Presentation",
      organizer: "HIET Ghaziabad",
    },
  },
  {
    id: 3,
    imageSrc: event3,
    name: "Robo Race",
    category: "Technical",
    eventSlug: "robo-race",
    dayBadge: "Feb 05, 2027",
    rulesPdf: roboRules,
    details: {
      description:
        "Race custom robots (max 3 kg, 12V, wired/wireless) in squads of 1–4 through an obstacle track featuring ramps, seesaws, slippery paths, and marble pits.",
      timing: "Feb 05, 2027, 10:00 AM – 2:00 PM",
      location: "Block 3 Ground",
      judgingCriteria: "Speed, Obstacle Navigation, Design, Control",
      organizer: "HIET Ghaziabad",
    },
  },
  {
    id: 4,
    imageSrc: event11,
    name: "Dance Competition",
    category: "Cultural",
    eventSlug: "dance-competition",
    dayBadge: "Feb 05, 2027",
    details: {
      description:
        "High-energy solo (3–5 min) and group (5–8 min) dance performances across classical, Bollywood, hip-hop, and fusion styles.",
      timing: "Feb 05, 2027, 2:00 PM – 4:00 PM",
      location: "Amphitheatre",
      judgingCriteria:
        "Choreography (20), Synchronization (20), Expression & Emotion (20), Costume & Props (20), Overall Impact (20)",
      organizer: "HIET Ghaziabad",
    },
  },
  {
    id: 5,
    imageSrc: event5,
    name: "Rangoli Competition",
    category: "Cultural",
    eventSlug: "rangoli-competition",
    dayBadge: "Feb 05, 2027",
    rulesPdf: rangoliRules,
    details: {
      description:
        'Create a 5x5 ft rangoli in teams of 1–3, restricted to the "NATURE" theme. 1.5 hours to complete; no printed references allowed.',
      timing: "Feb 05, 2027, 10:00 AM onwards (1.5 hr duration)",
      location: "Amphitheatre",
      judgingCriteria:
        "Relevance to Theme, Creativity, Color Combination, Message through Rangoli, Overall Appearance & Appeal",
      organizer: "HIET Ghaziabad",
    },
  },
  {
    id: 6,
    imageSrc: event6,
    name: "Food Without Fire",
    category: "Cultural",
    eventSlug: "food-without-fire",
    dayBadge: "Feb 06, 2027",
    rulesPdf: foodRules,
    details: {
      description:
        "Prepare ready-to-eat dishes (sandwiches, salads, juices, shakes, fruits) in teams of 1–4 without any cooking, heating, or flame.",
      timing: "Feb 06, 2027, 10:00 AM – 2:00 PM",
      location: "Block 3 Corridor Area",
      judgingCriteria: "Ingredients (organic/handmade), Taste, Presentation, Hygiene",
      organizer: "HIET Ghaziabad",
    },
  },
  {
    id: 9,
    imageSrc: event9,
    name: "Technical Poster Competition",
    category: "Technical",
    eventSlug: "technical-poster",
    dayBadge: "Feb 05, 2027",
    rulesPdf: posterRules,
    details: {
      description:
        "Handmade original posters on chart paper (no printouts, 3D objects, or photos) by teams of 1–4. Mention topic/theme clearly at top.",
      timing: "Feb 05, 2027, 10:00 AM – 2:00 PM",
      location: "Block 3 304 / Stage",
      judgingCriteria:
        "Content Clarity, Design & Creativity, Relevance, Presentation (explain in English/Hindi)",
      organizer: "HIET Ghaziabad",
    },
  },
  {
    id: 10,
    imageSrc: event10,
    name: "Rock Band / Cultural Performances",
    category: "Cultural",
    eventSlug: "rock-band",
    dayBadge: "Feb 05, 2027",
    details: {
      description:
        "Live rock band performances and cultural acts (1–4 core registered performers) energizing the amphitheatre crowd.",
      timing: "Feb 05, 2027, 6:00 PM – 8:00 PM",
      location: "Amphitheatre",
      judgingCriteria: "Music Quality, Stage Presence, Originality, Coordination",
      organizer: "HIET Ghaziabad",
    },
  },
  {
    id: 11,
    imageSrc: event13,
    name: "Short Film Making",
    category: "Cultural",
    eventSlug: "short-film-maker",
    dayBadge: "Feb 06, 2027",
    rulesPdf: shortFilmRules,
    details: {
      description:
        "Teams of max 2 create & edit a 30–60 sec original short film shot entirely on campus within a ~1 hour time constraint.",
      timing: "Feb 06, 2027, 10:00 AM – 2:00 PM",
      location: "Block 1 Lab F",
      judgingCriteria:
        "Concept & Storytelling (10%), Creativity & Innovation (20%), Technical Execution (20%), Overall Impact (incl. YouTube Likes 30%), Relevance to Theme (10%), Judges (10%)",
      organizer: "HIET Ghaziabad",
    },
  },
  {
    id: 12,
    imageSrc: event12,
    name: "Treasure Hunt",
    category: "Adventure",
    eventSlug: "treasure-hunt",
    dayBadge: "Feb 06, 2027",
    rulesPdf: treasureRules,
    details: {
      description:
        "Squad adventure (5–8 members) solving cryptic clues across campus. No outside help, no interference, safety first.",
      timing: "Feb 06, 2027, 11:00 AM – 2:00 PM",
      location: "Entire Campus / Block 3 Ground",
      judgingCriteria: "Speed, Teamwork, Problem-Solving, Clue Completion",
      organizer: "HIET Ghaziabad",
    },
  },
  {
    id: 13,
    imageSrc: event4,
    name: "Crossroads Award & Closing",
    category: "Ceremony",
    eventSlug: null,
    dayBadge: "Feb 06, 2027",
    details: {
      description:
        "Grand closing ceremony recognizing overall fest champions, academic awards, and rolling trophy presentations.",
      timing: "Feb 06, 2027, 4:00 PM – 6:00 PM",
      location: "Amphitheatre",
      judgingCriteria: "Based on cumulative podium finishes across official arenas",
      organizer: "HIET Ghaziabad",
    },
  },
];

const winners = [
  { id: 1, imageSrc: w1, name: "Winner 1" },
  { id: 2, imageSrc: w2, name: "Winner 2" },
  { id: 3, imageSrc: w3, name: "Winner 3" },
  { id: 4, imageSrc: w4, name: "Winner 4" },
  { id: 5, imageSrc: w5, name: "Winner 5" },
  { id: 6, imageSrc: w6, name: "Winner 6" },
  { id: 7, imageSrc: w7, name: "Winner 7" },
  { id: 8, imageSrc: w8, name: "Winner 8" },
  { id: 9, imageSrc: w9, name: "Winner 9" },
  { id: 10, imageSrc: w10, name: "Winner 10" },
  { id: 11, imageSrc: w11, name: "Winner 11" },
  { id: 12, imageSrc: w12, name: "Winner 12" },
  { id: 13, imageSrc: w13, name: "Winner 13" },
  { id: 14, imageSrc: w14, name: "Winner 14" },
];

const CATEGORY_BADGE_MAP = {
  Technical: "bg-cyan-500/90 text-slate-950",
  Cultural: "bg-indigo-500/90 text-white",
  Adventure: "bg-emerald-500/90 text-slate-950",
  Ceremony: "bg-amber-400/95 text-slate-950",
};

const EventCard = ({ event, onClick, index }) => {
  const [loaded, setLoaded] = useState(false);
  const hasRules = !!event.rulesPdf;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.28), ease: smoothEase }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className="group relative p-[1px] rounded-[1.5rem] bg-gradient-to-br from-white/12 via-cyan-500/15 to-white/5 hover:from-cyan-400/50 hover:via-sky-500/30 hover:to-indigo-500/40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 cursor-pointer"
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(34, 211, 238, 0.16), transparent 65%)",
        }}
      />

      <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-[#080e1f]/92 overflow-hidden flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div>
          <div className="relative h-56 overflow-hidden bg-slate-950">
            {!loaded && <div className="absolute inset-0 bg-slate-800/80 animate-pulse" />}
            <img
              className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108 ${
                loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              src={event.imageSrc}
              alt={event.name}
              onLoad={() => setLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080e1f] via-[#080e1f]/30 to-transparent" />
            <div className="absolute top-3.5 right-3.5">
              <span
                className={`px-3 py-1 text-[11px] font-mono font-bold rounded-full tracking-wide shadow-md ${
                  CATEGORY_BADGE_MAP[event.category] || "bg-sky-500 text-white"
                }`}
              >
                {event.category}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 pb-4">
            <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300 leading-snug">
              {event.name}
            </h3>
            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
              {event.details.description}
            </p>
          </div>
        </div>

        <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>{event.dayBadge}</span>
          </div>

          <div className="flex items-center gap-3.5">
            {hasRules && (
              <a
                href={event.rulesPdf}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Rules</span>
              </a>
            )}

            <div className="flex items-center gap-1 text-sky-300 text-xs font-semibold group-hover:translate-x-0.5 transition-transform duration-300">
              <span>Details</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left" />
      </div>
    </Motion.div>
  );
};

const WinnerCard = ({ winner, index }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.25), ease: smoothEase }}
      className="group relative p-[1px] rounded-2xl bg-gradient-to-br from-white/10 to-cyan-500/15 hover:from-cyan-400/45 hover:to-indigo-400/35 transition-all duration-500 hover:-translate-y-1"
    >
      <div className="relative h-72 rounded-[calc(1rem-1px)] overflow-hidden bg-[#080e1f]">
        {!loaded && <div className="absolute inset-0 bg-slate-800/80 animate-pulse" />}
        <img
          className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108 ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          src={winner.imageSrc}
          alt={winner.name}
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040711]/80 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <div className="bg-gradient-to-br from-cyan-400 to-indigo-500 p-2.5 rounded-full shadow-lg">
            <Trophy className="w-4 h-4 text-slate-950" />
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState("All");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });
  const [siteSettings, setSiteSettings] = useState({ registrationOpen: true, eventStatus: {} });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data) setSiteSettings(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const targetDate = new Date("2027-02-05T09:00:00+05:30").getTime();
    const updateTimer = () => {
      const now = Date.now();
      const difference = targetDate - now;
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSelectedEvent(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedEvent]);

  const categories = ["All", "Technical", "Cultural", "Adventure", "Ceremony"];
  const filteredEvents = filter === "All" ? events : events.filter((e) => e.category === filter);

  return (
    <div className="relative min-h-[100dvh] bg-[#040711] text-slate-100 overflow-hidden pb-24 selection:bg-cyan-400 selection:text-slate-950">
      <TechBackground variant="events" />

      <div className="relative z-10 pt-28 sm:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* HERO HEADER */}
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 font-mono text-[11px] uppercase tracking-[0.18em] mb-5">
              <Terminal size={13} />
              <span>CROSSROADS 2026 • OFFICIAL ARENAS</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Compete Across{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                11 Arenas
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Two days of high-voltage technical duels, robotics races, prototypes, and cultural
              showdowns at HIET Ghaziabad.
            </p>

            {/* Key Date Telemetry Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-7">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 font-mono text-xs font-semibold">
                <Calendar size={13} className="text-cyan-400" />
                <span>Event: 05 Feb &amp; 06 Feb 2027</span>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/12 text-slate-200 font-mono text-xs font-semibold">
                <Sparkles size={13} className="text-emerald-400" />
                <span>Reg Starts: 10 Jan 2027</span>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-200 font-mono text-xs font-semibold">
                <Clock size={13} className="text-amber-400" />
                <span>Last Date: 31 Jan 2027</span>
              </span>
            </div>
          </Motion.div>

          {/* SYNCHRONIZED COUNTDOWN CONSOLE */}
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: smoothEase }}
            className="max-w-3xl mx-auto mb-14"
          >
            <div className="p-[1px] rounded-[2rem] bg-gradient-to-r from-cyan-400/35 via-sky-500/20 to-indigo-500/35 shadow-[0_20px_60px_rgba(2,6,23,0.75)]">
              <div className="rounded-[calc(2rem-1px)] bg-[#070c1c]/95 p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-semibold">
                      {timeLeft.expired ? "CROSSROADS Has Begun!" : "Countdown to Feb 05, 2027"}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    HIET • 09:00 AM IST
                  </span>
                </div>

                {!timeLeft.expired ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { value: timeLeft.days, label: "Days" },
                      { value: timeLeft.hours, label: "Hours" },
                      { value: timeLeft.minutes, label: "Minutes" },
                      { value: timeLeft.seconds, label: "Seconds" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center"
                      >
                        <div className="font-mono text-3xl sm:text-4xl font-bold text-cyan-300 tracking-tight">
                          {String(item.value).padStart(2, "0")}
                        </div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-1">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-2xl sm:text-4xl font-mono font-bold text-cyan-300">
                    FEST IS OFFICIALLY LIVE!
                  </div>
                )}
              </div>
            </div>
          </Motion.div>

          {/* CATEGORY FILTER BAR WITH SHARED SPRING PILL */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex flex-wrap justify-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10">
              {categories.map((cat) => {
                const isSelected = filter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilter(cat)}
                    className={`relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-300 cursor-pointer ${
                      isSelected ? "text-slate-950" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {isSelected && (
                      <Motion.span
                        layoutId="eventsCategoryPill"
                        transition={{ type: "spring", stiffness: 360, damping: 30 }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 shadow-md shadow-cyan-500/20"
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ARENAS GRID */}
          <Motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-28"
          >
            <AnimatePresence>
              {filteredEvents.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </Motion.div>

          {/* HALL OF FAME */}
          <section className="pt-12 border-t border-white/10">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: smoothEase }}
              className="text-center mb-12"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center text-cyan-300 mx-auto mb-5">
                <Trophy className="w-7 h-7" />
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
                Hall of{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  Fame
                </span>
              </h2>
              <p className="mt-3 text-base sm:text-lg text-slate-400">
                Proud Winners • Past Editions of CROSSROADS
              </p>
            </Motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {winners.map((winner, i) => (
                <WinnerCard key={winner.id} winner={winner} index={i} />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* EVENT DETAIL MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6"
            onClick={() => setSelectedEvent(null)}
          >
            <div className="absolute inset-0 bg-[#02050d]/85 backdrop-blur-xl" />

            <Motion.div
              initial={{ scale: 0.94, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative p-[1px] rounded-[2rem] bg-gradient-to-br from-cyan-400/40 via-white/15 to-indigo-500/35 max-w-3xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-[#070d1e]/98 rounded-[calc(2rem-1px)] p-6 sm:p-9 max-h-[90dvh] overflow-y-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  aria-label="Close modal"
                  className="absolute top-5 right-5 p-2.5 rounded-full bg-white/[0.06] hover:bg-rose-500/20 text-slate-300 hover:text-white border border-white/10 transition-colors z-10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden mb-7">
                  <img
                    src={selectedEvent.imageSrc}
                    alt={selectedEvent.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070d1e] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span
                      className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-full shadow-lg ${
                        CATEGORY_BADGE_MAP[selectedEvent.category] || "bg-sky-500 text-white"
                      }`}
                    >
                      {selectedEvent.category}
                    </span>
                    <span className="px-3.5 py-1.5 text-xs font-mono font-semibold rounded-full bg-[#070d1e]/85 text-cyan-300 border border-cyan-400/30">
                      {selectedEvent.dayBadge}
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-2xl sm:text-4xl font-bold text-white mb-3">
                  {selectedEvent.name}
                </h3>

                <p className="text-slate-300 leading-relaxed mb-7 text-base sm:text-lg">
                  {selectedEvent.details.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start gap-3.5 p-4 bg-white/[0.03] rounded-2xl border border-white/[0.08]">
                    <Calendar className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        Timing
                      </div>
                      <div className="text-sm text-slate-200">{selectedEvent.details.timing}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 bg-white/[0.03] rounded-2xl border border-white/[0.08]">
                    <MapPin className="w-5 h-5 text-sky-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        Location
                      </div>
                      <div className="text-sm text-slate-200">{selectedEvent.details.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 bg-white/[0.03] rounded-2xl border border-white/[0.08]">
                    <Trophy className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        Judging
                      </div>
                      <div className="text-sm text-slate-200">
                        {selectedEvent.details.judgingCriteria}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 bg-white/[0.03] rounded-2xl border border-white/[0.08]">
                    <Users className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        Organizer
                      </div>
                      <div className="text-sm text-slate-200">{selectedEvent.details.organizer}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3.5">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="sm:w-1/3 py-3.5 px-5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 font-semibold rounded-full transition-colors border border-white/10 cursor-pointer"
                  >
                    Close
                  </button>

                  {selectedEvent.rulesPdf && (
                    <a
                      href={selectedEvent.rulesPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm:w-1/3 py-3.5 px-5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold rounded-full border border-cyan-400/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText size={16} />
                      <span>Rulebook PDF</span>
                    </a>
                  )}

                  {selectedEvent.eventSlug ? (
                    siteSettings.registrationOpen ? (
                      <Link
                        to={`/event-registration?event=${selectedEvent.eventSlug}`}
                        className="flex-1 group inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
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
                        className="flex-1 py-3.5 px-6 bg-slate-800/80 text-slate-400 font-semibold rounded-full border border-slate-700 cursor-not-allowed"
                      >
                        Registrations Closed
                      </button>
                    )
                  ) : (
                    <Link
                      to="/schedule"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-bold text-sm"
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
    </div>
  );
};

export default Events;
