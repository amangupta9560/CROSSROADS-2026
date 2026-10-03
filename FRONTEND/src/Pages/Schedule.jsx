import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, Trophy, Code, Cpu, Zap, Palette, Music, Flame, Theater, Film,
  Megaphone, Map, Sparkles, MapPin, Star, Award, Users, Lightbulb, Camera, Mic,
  ChevronDown, UserCheck, Apple, UtensilsCrossed, Guitar, Utensils, PenTool, Coffee
} from "lucide-react";

const schedule = {
  "Day 1": [
    {
      time: "8:50 AM onwards",
      title: "Registration Desk",
      description: "Participant check-in and registration near the library.",
      category: "general",
      icon: UserCheck,
      duration: "Ongoing",
      venue: "Near Library"
    },
    {
      time: "9:00 AM onwards",
      title: "Announcements & Hi-Tea",
      description: "Morning announcements followed by hi-tea refreshment.",
      category: "general",
      icon: Coffee,
      duration: "Ongoing",
      venue: "Near Library / Designated Area"
    },
    {
      time: "10:00 AM onwards",
      title: "Inauguration",
      description: "Official opening of Crossroads 2026 with dignitaries and lamp lighting.",
      category: "ceremony",
      icon: Trophy,
      duration: "1–2 hrs",
      venue: "Amphitheatre"
    },
    {
      time: "10:00 AM onwards",
      title: "Technical Poster Competition",
      description: "Create and present original handmade technical posters on chart paper (no printouts/3D objects).",
      category: "technical",
      icon: PenTool,
      duration: "10 AM – 2 PM",
      venue: "Block 3 304 / Stage"
    },
    {
      time: "10:00 AM – 2:00 PM",
      title: "Project Evolution / Exhibition",
      description: "Showcase student projects and innovations in the exhibition ground.",
      category: "technical",
      icon: Lightbulb,
      duration: "4 hrs",
      venue: "Exhibition Ground"
    },
    {
      time: "10:00 AM – 2:00 PM",
      title: "Robo Race",
      description: "Compete with wired/wireless robots (max 3 kg, 12V) on obstacle track with ramps, seesaws, etc.",
      category: "robotics",
      icon: Cpu,
      duration: "4 hrs",
      venue: "Block 3 Ground"
    },
    {
      time: "10:00 AM – 2:00 PM",
      title: "Code Puzzle",
      description: "20-minute coding challenge in any supported language (Python, Java, C++, etc.).",
      category: "technical",
      icon: Code,
      duration: "Flexible within slot",
      venue: "Block 1 Computer Lab"
    },
    {
      time: "1:00 PM – 2:00 PM",
      title: "Lunch",
      description: "Lunch break at college mess / designated area.",
      category: "general",
      icon: Utensils,
      duration: "1 hr",
      venue: "OLD Auditorium / College Mess"
    },
    {
      time: "2:00 PM – 4:00 PM",
      title: "Dance Competition",
      description: "Solo (3–5 min) & Group (5–8 min) performances across styles; judged on choreography, sync, expression.",
      category: "cultural",
      icon: Music,
      duration: "2 hrs",
      venue: "Amphitheatre"
    },
    {
      time: "4:00 PM – 5:00 PM",
      title: "Academic Award",
      description: "Recognition for academic excellence.",
      category: "ceremony",
      icon: Award,
      duration: "1 hr",
      venue: "Amphitheatre"
    },
    {
      time: "6:00 PM – 8:00 PM",
      title: "Rock Band / Cultural Event",
      description: "Rock band performances and other cultural acts.",
      category: "entertainment",
      icon: Guitar,
      duration: "2 hrs",
      venue: "Amphitheatre"
    },
    {
      time: "8:00 PM onwards",
      title: "Dinner",
      description: "Evening dinner and informal gathering.",
      category: "general",
      icon: UtensilsCrossed,
      duration: "Ongoing",
      venue: "Dining Area"
    }
  ],
  "Day 2": [
    {
      time: "9:00 AM onwards",
      title: "Registration Desk & Announcements",
      description: "Day 2 check-in and morning updates.",
      category: "general",
      icon: UserCheck,
      duration: "Ongoing",
      venue: "Behind English Lab"
    },
    {
      time: "10:00 AM – 2:00 PM",
      title: "Food Without Fire",
      description: "No-cook culinary challenge: sandwiches, salads, juices, etc. Judged on taste, presentation, hygiene.",
      category: "cultural",
      icon: Apple,
      duration: "4 hrs",
      venue: "Block 3 Corridor Area"
    },
    {
      time: "10:00 AM – 2:00 PM",
      title: "Short Film Making",
      description: "Create & edit 30–60 sec original film shot entirely on campus within 1 hour; judged on concept, creativity, impact.",
      category: "cultural",
      icon: Film,
      duration: "4 hrs (creation + submission)",
      venue: "Block 1 Lab F"
    },
    {
      time: "11:00 AM – 2:00 PM",
      title: "Treasure Hunt",
      description: "Team-based clue-solving adventure across campus; no outside help, respect rules & environment.",
      category: "adventure",
      icon: Map,
      duration: "3 hrs",
      venue: "Entire Campus / Block 3 Ground"
    },
    {
      time: "2:00 PM – 4:00 PM",
      title: "Cultural Event",
      description: "Additional cultural performances and activities.",
      category: "cultural",
      icon: Users,
      duration: "2 hrs",
      venue: "Amphitheatre"
    },
    {
      time: "4:00 PM – 6:00 PM",
      title: "Crossroads Award",
      description: "Main award ceremony recognizing overall fest winners and achievements.",
      category: "ceremony",
      icon: Trophy,
      duration: "2 hrs",
      venue: "Amphitheatre"
    }
  ]
};

const categoryColors = {
  ceremony: {
    gradient: "from-amber-400 via-orange-500 to-red-500",
    glow: "shadow-orange-500/50",
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    dot: "bg-orange-500",
    hover: "hover:shadow-orange-500/30"
  },
  technical: {
    gradient: "from-emerald-400 via-green-500 to-teal-600",
    glow: "shadow-green-500/50",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dot: "bg-emerald-500",
    hover: "hover:shadow-emerald-500/30"
  },
  robotics: {
    gradient: "from-red-400 via-rose-500 to-pink-600",
    glow: "shadow-rose-500/50",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    dot: "bg-rose-500",
    hover: "hover:shadow-rose-500/30"
  },
  cultural: {
    gradient: "from-yellow-400 via-amber-500 to-orange-500",
    glow: "shadow-amber-500/50",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-500",
    hover: "hover:shadow-amber-500/30"
  },
  entertainment: {
    gradient: "from-fuchsia-400 via-pink-500 to-rose-500",
    glow: "shadow-fuchsia-500/50",
    text: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/30",
    dot: "bg-fuchsia-500",
    hover: "hover:shadow-fuchsia-500/30"
  },
  adventure: {
    gradient: "from-lime-400 via-green-500 to-emerald-600",
    glow: "shadow-lime-500/50",
    text: "text-lime-400",
    bg: "bg-lime-500/10",
    border: "border-lime-500/30",
    dot: "bg-lime-500",
    hover: "hover:shadow-lime-500/30"
  },
  general: {
    gradient: "from-gray-400 via-gray-500 to-gray-600",
    glow: "shadow-gray-500/50",
    text: "text-gray-400",
    bg: "bg-gray-500/10",
    border: "border-gray-500/30",
    dot: "bg-gray-500",
    hover: "hover:shadow-gray-500/30"
  }
  // You can add more categories here if needed in future
};

export default function Schedule() {
  const [activeDay, setActiveDay] = useState("Day 1");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    // Note: Event is 28-29 Nov 2026 → countdown to 28th Nov morning
    const eventDate = new Date('2026-11-28T09:00:00+05:30').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        setCountdown("Event Started!");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setCountdown(`${days}d ${hrs}h ${mins}m`);
      } else if (hrs > 0) {
        setCountdown(`${hrs}h ${mins}m ${secs}s`);
      } else {
        setCountdown(`${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentEvents = schedule[activeDay] || [];
  const totalEvents = currentEvents.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmY2YjFhIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] opacity-30" />

      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="fixed top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="fixed bottom-0 left-1/2 w-full h-full bg-[radial-gradient(ellipse_at_bottom,var(--tw-gradient-stops))] from-rose-900/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 py-8 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-8 pt-28 sm:pt-36 lg:pt-34">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-xl rounded-full border border-orange-500/30 mb-4 sm:mb-6 lg:mb-8 shadow-lg shadow-orange-500/10"
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
              <span className="text-xs sm:text-sm text-zinc-200 font-semibold tracking-wide">November 28-29, 2026</span>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-5xl lg:text-7xl font-black mb-3 sm:mb-4 lg:mb-6 tracking-tight px-4"
            >
              <span className="inline-block bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
                EVENT
              </span>
              <span className="inline-block ml-2 sm:ml-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600 bg-clip-text text-transparent drop-shadow-lg">
                SCHEDULE
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-lg lg:text-xl text-zinc-400 mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto leading-relaxed px-4"
            >
              Two Days of Innovation, Creativity & Entertainment @ HIET
            </motion.p>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-orange-500/50 shadow-xl shadow-orange-500/20"
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-400 shrink-0" />
              <div className="flex flex-col items-start">
                <span className="text-[9px] sm:text-[10px] lg:text-xs text-zinc-400 uppercase tracking-wider font-medium">Starts In</span>
                <span className="text-base sm:text-lg lg:text-2xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent tracking-tight">
                  {countdown}
                </span>
              </div>
            </motion.div>

            <p className="mt-4 text-xs sm:text-sm text-cyan-400 font-mono">
              ⚡ Online Registration Closes On November 20, 2026
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex justify-center gap-2 sm:gap-3 lg:gap-4 px-3 mb-8 sm:mb-12 lg:mb-16 flex-wrap"
          >
            {Object.keys(schedule).map((day) => (
              <motion.button
                key={day}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveDay(day);
                  setExpandedIndex(null);
                }}
                className={`relative px-6 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base lg:text-lg transition-all duration-500 overflow-hidden group ${
                  activeDay === day
                    ? "text-white shadow-2xl"
                    : "bg-zinc-800/30 text-zinc-400 hover:text-white border border-zinc-700/50 hover:border-zinc-600/50 backdrop-blur-sm"
                }`}
              >
                {activeDay === day && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  {day}
                  <span className="ml-1 text-[10px] sm:text-xs opacity-75">({schedule[day].length})</span>
                </span>
                {activeDay === day && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-50 blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8 lg:mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-zinc-900/50 backdrop-blur-xl rounded-full border border-zinc-700/50">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <span className="text-xs sm:text-sm text-zinc-300">
                <span className="font-black text-cyan-400">{totalEvents}</span> exciting events on{" "}
                <span className="font-bold text-orange-400">{activeDay}</span>
              </span>
            </div>
          </motion.div>

          <div className="relative max-w-6xl mx-auto px-3 sm:px-4">
            <div className="absolute left-2 sm:left-6 lg:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500/30 to-transparent hidden sm:block" />

            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <AnimatePresence mode="wait">
                {currentEvents.map((event, index) => {
                  const IconComponent = event.icon;

                  // Fallback if category not found in categoryColors
                  const colors = categoryColors[event.category] || {
                    gradient: "from-gray-400 via-gray-500 to-gray-600",
                    glow: "shadow-gray-500/50",
                    text: "text-gray-300",
                    bg: "bg-gray-500/10",
                    border: "border-gray-500/30",
                    dot: "bg-gray-500",
                    hover: "hover:shadow-gray-500/30"
                  };

                  const isExpanded = expandedIndex === index;

                  return (
                    <motion.div
                      key={`${activeDay}-${index}`}
                      initial={{ opacity: 0, x: -50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 50, scale: 0.9 }}
                      transition={{ duration: 0.5, delay: index * 0.08, type: "spring" }}
                      className="relative flex items-start gap-3 sm:gap-6 lg:gap-8 group"
                    >
                      <div className="relative shrink-0 z-10">
                        <motion.div whileHover={{ scale: 1.15, rotate: 10 }} className="relative">
                          <div className={`w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colors.gradient} p-0.5 shadow-2xl ${colors.glow}`}>
                            <div className="w-full h-full bg-zinc-950 rounded-xl sm:rounded-2xl flex items-center justify-center">
                              <IconComponent className={`w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${colors.text}`} />
                            </div>
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colors.gradient} opacity-30 blur-lg`}
                          />
                        </motion.div>

                        <div className={`absolute -left-2.25 sm:-left-4.25 lg:-left-5.25 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 ${colors.dot} rounded-full shadow-lg ${colors.glow} hidden sm:block`}>
                          <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                            className={`absolute inset-0 ${colors.dot} rounded-full`}
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <motion.div
                          whileHover={{ scale: 1.01, y: -2 }}
                          className={`bg-gradient-to-br from-zinc-900/90 via-zinc-900/50 to-zinc-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
                            isExpanded
                              ? `${colors.border} shadow-2xl ${colors.glow}`
                              : `border-zinc-800/50 hover:border-zinc-700/80 ${colors.hover}`
                          }`}
                        >
                          <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <div className={`flex items-center gap-1.5 sm:gap-2 text-lg sm:text-xl lg:text-2xl font-black ${colors.text}`}>
                                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 shrink-0" />
                                      <span className="whitespace-nowrap">{event.time}</span>
                                    </div>
                                    <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${colors.bg} ${colors.text} border ${colors.border} whitespace-nowrap`}>
                                      {event.duration}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-500 ml-0 sm:ml-7 lg:ml-8">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                                    <span className="truncate">{event.venue}</span>
                                  </div>
                                </div>
                                <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider ${colors.bg} ${colors.text} border-2 ${colors.border} whitespace-nowrap backdrop-blur-sm shadow-lg self-start`}>
                                  {event.category}
                                </div>
                              </div>
                            </div>

                            <h3 className={`text-lg sm:text-2xl lg:text-3xl font-black text-white mb-2 sm:mb-3 lg:mb-4 leading-tight hover:bg-gradient-to-r hover:${colors.gradient} hover:bg-clip-text hover:text-transparent transition-all duration-300`}>
                              {event.title}
                            </h3>

                            <p className="text-xs sm:text-sm lg:text-base text-zinc-400 leading-relaxed mb-3 sm:mb-4 lg:mb-6 line-clamp-2">
                              {event.description}
                            </p>

                            <motion.button
                              whileHover={{ x: 5 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setExpandedIndex(isExpanded ? null : index)}
                              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl ${colors.bg} ${colors.text} hover:text-white text-xs sm:text-sm font-bold transition-all duration-300 border ${colors.border} hover:shadow-lg ${colors.glow}`}
                            >
                              <span>{isExpanded ? "Show Less" : "View Details"}</span>
                              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                              </motion.div>
                            </motion.button>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className={`border-t-2 ${colors.border} bg-gradient-to-br from-zinc-950/50 to-zinc-900/50 backdrop-blur-sm overflow-hidden`}
                              >
                                <div className="p-4 sm:p-6 lg:p-8">
                                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                                    <motion.div
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.2 }}
                                      className={`p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} backdrop-blur-sm`}
                                    >
                                      <h4 className="font-black text-sm sm:text-base lg:text-lg text-white mb-2 sm:mb-3 flex items-center gap-2">
                                        <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text} shrink-0`} />
                                        <span>Event Highlights</span>
                                      </h4>
                                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-3 sm:mb-4">
                                        {event.description} Join us for an unforgettable experience with exciting challenges and amazing prizes!
                                      </p>
                                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                                        <div className={`p-1.5 sm:p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                                          <MapPin className={`w-3 h-3 sm:w-4 sm:h-4 ${colors.text}`} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="text-zinc-500 text-[10px] sm:text-xs">Venue</div>
                                          <div className="text-white font-semibold text-xs sm:text-sm truncate">{event.venue}</div>
                                        </div>
                                      </div>
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                                      <h4 className="font-black text-sm sm:text-base lg:text-lg text-white mb-3 sm:mb-4 flex items-center gap-2">
                                        <Award className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text} shrink-0`} />
                                        <span>Quick Info</span>
                                      </h4>
                                      <div className="space-y-2 sm:space-y-3">
                                        <motion.div
                                          whileHover={{ scale: 1.02, x: 5 }}
                                          className={`flex justify-between items-center text-xs sm:text-sm p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl bg-zinc-900/50 border ${colors.border} hover:shadow-lg ${colors.glow} transition-all duration-300`}
                                        >
                                          <span className="text-zinc-400 font-medium">Duration</span>
                                          <span className={`font-black ${colors.text}`}>{event.duration}</span>
                                        </motion.div>
                                        <motion.div
                                          whileHover={{ scale: 1.02, x: 5 }}
                                          className={`flex justify-between items-center text-xs sm:text-sm p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl bg-zinc-900/50 border ${colors.border} hover:shadow-lg ${colors.glow} transition-all duration-300`}
                                        >
                                          <span className="text-zinc-400 font-medium">Category</span>
                                          <span className={`capitalize font-black ${colors.text}`}>{event.category}</span>
                                        </motion.div>
                                        <motion.div
                                          whileHover={{ scale: 1.02, x: 5 }}
                                          className={`flex justify-between items-center text-xs sm:text-sm p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl bg-zinc-900/50 border ${colors.border} hover:shadow-lg ${colors.glow} transition-all duration-300`}
                                        >
                                          <span className="text-zinc-400 font-medium">Day</span>
                                          <span className="text-white font-black">{activeDay}</span>
                                        </motion.div>
                                        <motion.div
                                          whileHover={{ scale: 1.05 }}
                                          className={`flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm p-2.5 sm:p-3 lg:p-4 bg-gradient-to-r ${colors.gradient} rounded-lg sm:rounded-xl shadow-xl ${colors.glow}`}
                                        >
                                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-white shrink-0" />
                                          <span className="text-white font-black uppercase tracking-wide">Featured Event</span>
                                        </motion.div>
                                      </div>
                                    </motion.div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none rounded-2xl sm:rounded-3xl`}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16 border-t border-zinc-800/50"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-zinc-700/50 shadow-xl"
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-400 shrink-0" />
              <span className="font-black text-xs sm:text-sm lg:text-base bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent">
                May the Best Talent Win!
              </span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-cyan-400 shrink-0" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}