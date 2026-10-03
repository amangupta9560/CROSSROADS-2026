
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Trophy, Users, X, Sparkles, ChevronRight, FileText } from 'lucide-react';

// Event Images
import event1 from '../assets/coding.jpg';
import event2 from '../assets/project.jpg';
import event3 from '../assets/robo.jpg';
import event4 from '../assets/cultural.jpg';
import event5 from '../assets/rangoli.jpeg';
import event6 from '../assets/food.jpg';
import event9 from '../assets/poster.jpg';
import event10 from '../assets/rock.jpg';
import event11 from '../assets/dance.jpg';
import event12 from '../assets/tresure.jpeg';
import event13 from '../assets/film.jpeg';

// Winner Images
import w1 from '../assets/w1.jpg';
import w2 from '../assets/w2.jpg';
import w3 from '../assets/w3.jpg';
import w4 from '../assets/w4.jpg';
import w5 from '../assets/w5.jpg';
import w6 from '../assets/w6.jpg';
import w7 from '../assets/w7.jpg';
import w8 from '../assets/w8.jpg';
import w9 from '../assets/w9.jpg';
import w10 from '../assets/w10.jpg';
import w11 from '../assets/w11.jpg';
import w12 from '../assets/w12.jpg';
import w13 from '../assets/w13.jpg';
import w14 from '../assets/w14.jpg';

// Rules PDFs (only for selected events)
import codeRules from '../assets/CODE.pdf';
import posterRules from '../assets/POSTER.pdf';
import roboRules from '../assets/ROBO.pdf';
import foodRules from '../assets/FOOD.pdf';
import rangoliRules from '../assets/RANGOLI.pdf';
import shortFilmRules from '../assets/SHORT.pdf';
import treasureRules from '../assets/TREASURE.pdf';

// const events = [
//   {
//     id: 1,
//     imageSrc: event1,
//     name: 'Code Puzzle',
//     category: 'Technical',
//     rulesPdf: codeRules,
//     details: {
//       description: 'A coding quiz to challenge logical and programming skills.',
//       timing: 'Feb 27 2026, 9:00 AM - 12:00 PM',
//       location: 'Block 1 Lab F',
//       judgingCriteria: 'Innovation, Functionality, Design, Presentation',
//       organizer: 'HIET Ghaziabad',
//     },
//   },
//   {
//     id: 2,
//     imageSrc: event2,
//     name: 'Project Exhibition',
//     category: 'Technical',
//     details: {
//       description: 'Display and present innovative student projects across domains.',
//       timing: 'Feb 27, 2026, 10:00 AM – February 28, 2026, 4:00 PM',
//       location: 'Amphitheatre Hall',
//       judgingCriteria: 'Originality, Impact, Technical Execution',
//       organizer: 'HIET Ghaziabad',
//     },
//   },
//   {
//     id: 3,
//     imageSrc: event3,
//     name: 'Robo Race',
//     category: 'Technical',
//     rulesPdf: roboRules,
//     details: {
//       description: 'Compete with your robots in high-speed challenges.',
//       timing: 'Feb 27, 2026, 1:00 PM - 5:00 PM',
//       location: 'Hi Tech Ground',
//       judgingCriteria: 'Speed, Control, Design, Navigation',
//       organizer: 'HIET Ghaziabad',
//     },
//   },
//   {
//     id: 4,
//     imageSrc: event4,
//     name: 'Cultural Events',
//     category: 'Cultural',
//     details: {
//       description: 'Showcase of traditional and contemporary performances.',
//       timing: 'Feb 27, 2026, 9:00 AM – February 28, 2026, 6:00 PM',
//       location: 'Amphitheatre Stage',
//       judgingCriteria: 'Creativity, Presentation, Crowd Engagement',
//       organizer: 'HIET Ghaziabad',
//     },
//   },
//   {
//     id: 5,
//     imageSrc: event5,
//     name: 'Rangoli Competition',
//     category: 'Cultural',
//     rulesPdf: rangoliRules,
//     details: {
//       description: 'Create beautiful rangoli designs using vibrant colors.',
//       timing: 'Feb 27, 2026, 10:00 AM - 4:00 PM',
//       location: 'Block 2 Courtyard',
//       judgingCriteria: 'Creativity, Neatness, Color Usage, Theme Representation',
//       organizer: 'HIET Ghaziabad',
//     },
//   },
//   {
//     id: 6,
//     imageSrc: event6,
//     name: 'Food Without Fire',
//     category: 'Cultural',
//     rulesPdf: foodRules,
//     details: {
//       description: 'Prepare delicious dishes without using fire or heat.',
//       timing: 'Feb 27, 2026, 9:00 AM - 5:00 PM',
//       location: 'Block 3 Cafeteria',
//       judgingCriteria: 'Taste, Presentation, Innovation, Hygiene',
//       organizer: 'HIET Ghaziabad',
//     },
//   },
//   {
//     id: 9,
//     imageSrc: event9,
//     name: 'Technical Poster Presentation',
//     category: 'Technical',
//     rulesPdf: posterRules,
//     details: {
//       description: 'Present technical concepts and innovations through posters.',
//       timing: 'Feb 27, 2026, 9:00 AM - 1:00 PM',
//       location: 'Block 1 Corridor',
//       judgingCriteria: 'Content Clarity, Design, Innovation, Presentation',
//       organizer: 'HIET Ghaziabad',
//     },
//   },
//   {
//     id: 10,
//     imageSrc: event11,
//     name: 'Inter College Dance Competition',
//     category: 'Cultural',
//     details: {
//       description: 'Dance teams from various colleges compete with style and energy.',
//       timing: 'Feb 27-28, 2026, 2:00 PM - 6:00 PM',
//       location: 'Amphitheatre Stage',
//       judgingCriteria: 'Choreography, Synchronization, Expression, Costume',
//       organizer: 'HIET Ghaziabad',
//     },
//   },
//   {
//     id: 11,
//     imageSrc: event10,
//     name: 'Rock Band',
//     category: 'Cultural',
//     details: {
//       description: 'Bands compete by performing electrifying live music sets.',
//       timing: 'Feb 28, 2026, 6:30 PM - 9:30 PM',
//       location: 'Amphitheatre Stage',
//       judgingCriteria: 'Music Quality, Stage Presence, Originality, Coordination',
//       organizer: 'HIET Ghaziabad',
//     },
//   },
//   {
//     id: 12,
//     imageSrc: event13,
//     name: 'Reel Making',
//     category: 'Technical',
//     rulesPdf: shortFilmRules,
//     details: {
//       description: 'Create a short film showcasing storytelling, direction, and editing skills.',
//       timing: 'Feb 27, 2026, 10:00 AM - 4:00 PM',
//       location: 'Block 3 Corridor',
//       judgingCriteria: 'Storytelling, Creativity, Technical Execution, Impact',
//       organizer: 'HIET Ghaziabad',
//     },
//   },
//   {
//     id: 13,
//     imageSrc: event12,
//     name: 'Treasure Hunt',
//     category: 'Technical',
//     rulesPdf: treasureRules,
//     details: {
//       description: 'Solve clues and find hidden items in a campus-wide adventure.',
//       timing: 'Feb 27, 2026, 9:00 AM - 1:00 PM',
//       location: 'College Grounds',
//       judgingCriteria: 'Teamwork, Time Management, Problem-Solving',
//       organizer: 'HIET Ghaziabad',
//     },
//   },
// ];
const events = [
  {
    id: 1,
    imageSrc: event1,
    name: 'Code Puzzle',
    category: 'Technical',
    rulesPdf: codeRules,
    details: {
      description: 'A fast-paced coding challenge where participants solve puzzles in 20 minutes using any supported language (Python, Java, C++, etc.).',
      timing: 'Nov 28, 2026, 10:00 AM – 2:00 PM (submissions within slot)',
      location: 'Block 1 Computer Lab',
      judgingCriteria: 'Correctness, Efficiency, Code Quality (based on final score)',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 2,
    imageSrc: event2,
    name: 'Project Exhibition / Project Evolution',
    category: 'Technical',
    details: {
      description: 'Showcase innovative student projects, prototypes, and engineering solutions to judges and visitors.',
      timing: 'Nov 28, 2026, 10:00 AM – 2:00 PM',
      location: 'Exhibition Ground',
      judgingCriteria: 'Originality, Technical Execution, Impact, Presentation',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 3,
    imageSrc: event3,
    name: 'Robo Race',
    category: 'Technical',
    rulesPdf: roboRules,
    details: {
      description: 'Race custom robots (max 3 kg, 12V, wired/wireless) through an obstacle track featuring ramps, seesaws, slippery paths, marble pits, etc.',
      timing: 'Nov 28, 2026, 10:00 AM – 2:00 PM',
      location: 'Block 3 Ground',
      judgingCriteria: 'Speed, Obstacle Navigation, Design, Control',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 4,
    imageSrc: event4,
    name: 'Dance Competition',
    category: 'Cultural',
    details: {
      description: 'Solo (3–5 min) and Group (4–12 members, 5–8 min) performances in any style (classical, Bollywood, hip-hop, fusion, etc.). No offensive content.',
      timing: 'Nov 28, 2026, 2:00 PM – 4:00 PM',
      location: 'Amphitheatre',
      judgingCriteria: 'Choreography (20), Synchronization (20), Expression & Emotion (20), Costume & Props (20), Overall Impact (20)',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 5,
    imageSrc: event5,
    name: 'Rangoli Competition',
    category: 'Cultural',
    rulesPdf: rangoliRules,
    details: {
      description: 'Create a 5x5 ft rangoli in teams of 3, restricted to "NATURE" theme. 1.5 hours to complete; no printed references allowed.',
      timing: 'Nov 28, 2026, 10:00 AM onwards (1.5 hr duration)',
      location: 'Amphitheatre',
      judgingCriteria: 'Relevance to Theme, Creativity, Color Combination, Message through Rangoli, Overall Appearance & Appeal',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 6,
    imageSrc: event6,
    name: 'Food Without Fire',
    category: 'Cultural',
    rulesPdf: foodRules,
    details: {
      description: 'Prepare ready-to-eat dishes (sandwiches, salads, juices, shakes, fruits, etc.) without any cooking, heating, or flame. Focus on hygiene & no wastage.',
      timing: 'Nov 29, 2026, 10:00 AM – 2:00 PM',
      location: 'Block 3 Corridor Area',
      judgingCriteria: 'Ingredients (organic/handmade), Taste, Presentation, Hygiene',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 9,
    imageSrc: event9,
    name: 'Technical Poster Competition',
    category: 'Technical',
    rulesPdf: posterRules,
    details: {
      description: 'Handmade original posters on chart paper (no printouts, 3D objects, or photos). Mention topic/theme clearly at top.',
      timing: 'Nov 28, 2026, 10:00 AM – 2:00 PM',
      location: 'Block 3 304 / Stage',
      judgingCriteria: 'Content Clarity, Design & Creativity, Relevance, Presentation (explain in English/Hindi)',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 10,
    imageSrc: event11,
    name: 'Rock Band / Cultural Performances',
    category: 'Cultural',
    details: {
      description: 'Live rock band performances and other cultural acts to energize the crowd.',
      timing: 'Nov 28, 2026, 6:00 PM – 8:00 PM',
      location: 'Amphitheatre',
      judgingCriteria: 'Music Quality, Stage Presence, Originality, Coordination',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 11,
    imageSrc: event10,
    name: 'Short Film Making',
    category: 'Cultural',
    rulesPdf: shortFilmRules,
    details: {
      description: 'Teams of max 2 create & edit a 30–60 sec original short film shot entirely on campus within ~1 hour time constraint.',
      timing: 'Nov 29, 2026, 10:00 AM – 2:00 PM',
      location: 'Block 1 Lab F',
      judgingCriteria: 'Concept & Storytelling (10%), Creativity & Innovation (20%), Technical Execution (20%), Overall Impact (incl. YouTube Likes 30%), Relevance to Theme (10%), Judges (10%)',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 12,
    imageSrc: event12,
    name: 'Treasure Hunt',
    category: 'Adventure',
    rulesPdf: treasureRules,
    details: {
      description: 'Team adventure (2–5 members) solving clues across campus. No outside help, no interference, safety first.',
      timing: 'Nov 29, 2026, 11:00 AM – 2:00 PM',
      location: 'Entire Campus / Block 3 Ground',
      judgingCriteria: 'Speed, Teamwork, Problem-Solving, Clue Completion',
      organizer: 'HIET Ghaziabad',
    },
  },
  // Optional: Add these if you want to include awards/closing
  {
    id: 13,
    imageSrc: event13,
    name: 'Crossroads Award & Closing',
    category: 'Ceremony',
    details: {
      description: 'Recognition of overall fest winners, academic awards, and grand closing.',
      timing: 'Nov 29, 2026, 4:00 PM – 6:00 PM',
      location: 'Amphitheatre',
      judgingCriteria: 'N/A (based on performance across events)',
      organizer: 'HIET Ghaziabad',
    },
  },
];
const winners = [
  { id: 1, imageSrc: w1, name: 'Winner 1' },
  { id: 2, imageSrc: w2, name: 'Winner 2' },
  { id: 3, imageSrc: w3, name: 'Winner 3' },
  { id: 4, imageSrc: w4, name: 'Winner 4' },
  { id: 5, imageSrc: w5, name: 'Winner 5' },
  { id: 6, imageSrc: w6, name: 'Winner 6' },
  { id: 7, imageSrc: w7, name: 'Winner 7' },
  { id: 8, imageSrc: w8, name: 'Winner 8' },
  { id: 9, imageSrc: w9, name: 'Winner 9' },
  { id: 10, imageSrc: w10, name: 'Winner 10' },
  { id: 11, imageSrc: w11, name: 'Winner 11' },
  { id: 12, imageSrc: w12, name: 'Winner 12' },
  { id: 13, imageSrc: w13, name: 'Winner 13' },
  { id: 14, imageSrc: w14, name: 'Winner 14' },
];

const EventCard = ({ event, onClick, index }) => {
  const [loaded, setLoaded] = useState(false);
  const hasRules = !!event.rulesPdf;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/40 hover:border-blue-500/40 transition-all duration-500 cursor-pointer shadow-xl shadow-black/20"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-sky-600/10 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none" />
      
      <div className="relative h-64 overflow-hidden">
        {!loaded && <div className="absolute inset-0 bg-gray-800 animate-pulse" />}
        <motion.img
          className={`w-full h-full object-cover transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
          src={event.imageSrc}
          alt={event.name}
          onLoad={() => setLoaded(true)}
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.9 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute top-4 right-4">
          <span className={`px-4 py-1.5 text-xs font-bold rounded-full tracking-wide shadow-md ${
            event.category === 'Technical'
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
              : 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white'
          }`}>
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
          {event.name}
        </h3>
        <p className="text-sm text-gray-400 mb-5 line-clamp-2 leading-relaxed">
          {event.details.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Nov 2026</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-5">
            {hasRules && (
              <motion.a
                href={event.rulesPdf}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Rules</span>
              </motion.a>
            )}

            <motion.div
              className="flex items-center gap-1.5 text-blue-400 text-sm font-semibold"
              whileHover={{ x: 6 }}
            >
              <span>View Details</span>
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-sky-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
    </motion.div>
  );
};

const WinnerCard = ({ winner, index }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      whileHover={{ scale: 1.08, rotate: 1.5 }}
      className="group relative rounded-2xl overflow-hidden border border-gray-700/40 bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl shadow-black/25"
    >
      <div className="relative h-80 overflow-hidden">
        {!loaded && <div className="absolute inset-0 bg-gray-800 animate-pulse" />}
        <img
          className={`w-full h-full object-cover transition-all duration-700 ${loaded ? 'scale-100' : 'scale-110 opacity-0'}`}
          src={winner.imageSrc}
          alt={winner.name}
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent/30" />
        <div className="absolute top-4 right-4">
          <motion.div
            animate={{ rotate: [0, 12, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-br from-blue-400 via-blue-500 to-sky-600 p-3 rounded-full shadow-lg shadow-blue-600/40"
          >
            <Trophy className="w-6 h-6 text-white" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('All');
  const [timeLeft, setTimeLeft] = useState({});
  const [siteSettings, setSiteSettings] = useState({ registrationOpen: true, eventStatus: {} });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/settings`)
      .then(res => res.json())
      .then(data => { if (data) setSiteSettings(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const targetDate = new Date('2026-11-28T09:00:00+05:30').getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference <= 0) {
        setTimeLeft({ expired: true });
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, []);

  const filteredEvents = filter === 'All'
    ? events
    : events.filter(e => e.category === filter);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 overflow-hidden pb-20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#3b82f620_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#0ea5e920_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center mb-12"
          >
            <Sparkles className="w-16 h-16 text-blue-500 mx-auto mb-6 animate-pulse" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="text-blue-500">CROSS</span>
              <span className="bg-gradient-to-r from-sky-400 via-white to-blue-400 bg-clip-text text-transparent">
                ROADS
              </span>
            </h1>
            <p className="mt-5 text-xl md:text-2xl text-gray-400 font-light">
              Tech + Cultural Fest • November 28-29, 2026
            </p>
            <p className="mt-2 text-sm text-cyan-400 font-mono">
              ⚡ Online Registrations Close On November 20, 2026
            </p>
          </motion.div>

          <div className="mb-16">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent">
                {timeLeft.expired ? "CROSSROADS Has Begun!" : "Event Starts In"}
              </h2>
            </div>

            {!timeLeft.expired ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
                {[
                  { value: timeLeft.days ?? 0, label: "Days" },
                  { value: timeLeft.hours ?? 0, label: "Hours" },
                  { value: timeLeft.minutes ?? 0, label: "Minutes" },
                  { value: timeLeft.seconds ?? 0, label: "Seconds" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gray-900/70 backdrop-blur-md rounded-2xl p-5 md:p-7 border border-gray-700/50 shadow-xl shadow-black/30"
                  >
                    <div className="text-4xl md:text-5xl font-black text-blue-400 tracking-tight text-center">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-sm md:text-base text-gray-400 mt-2 font-medium uppercase tracking-wider text-center">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-center text-3xl md:text-5xl font-bold text-blue-500 tracking-wide"
              >
                LET'S GOOO
              </motion.div>
            )}
          </div>

          <div className="flex justify-center gap-4 md:gap-6 mb-16 flex-wrap">
            {['All', 'Technical', 'Cultural'].map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full font-medium text-base transition-all duration-300 shadow-lg ${
                  filter === cat
                    ? 'bg-gradient-to-r from-blue-600 to-sky-700 text-white shadow-blue-500/30'
                    : 'bg-gray-800/80 backdrop-blur-sm text-gray-300 hover:bg-gray-700/80 border border-gray-700'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mb-32">
            <AnimatePresence mode="wait">
              {filteredEvents.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-32"
          >
            <div className="text-center mb-16">
              <Trophy className="w-16 h-16 text-sky-500 mx-auto mb-6" />
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                Hall of Fame
              </h2>
              <p className="mt-4 text-xl text-gray-400">Proud Winners • Tech Fest 2024</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {winners.map((winner, i) => (
                <WinnerCard key={winner.id} winner={winner} index={i} />
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 md:p-12 max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-gray-700/60 shadow-2xl shadow-black/60"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-5 right-5 md:top-6 md:right-6 p-3 rounded-full bg-gray-800/80 hover:bg-red-600/80 text-gray-400 hover:text-white transition-all duration-300 z-10 backdrop-blur-sm border border-gray-700/50"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
                <img
                  src={selectedEvent.imageSrc}
                  alt={selectedEvent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span className={`px-4 py-2 text-sm font-bold rounded-full shadow-lg ${
                    selectedEvent.category === 'Technical'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500'
                      : 'bg-gradient-to-r from-sky-600 to-cyan-500'
                  } text-white`}>
                    {selectedEvent.category}
                  </span>
                </div>
              </div>

              <h3 className="text-3xl md:text-4xl font-extrabold mb-5 bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent">
                {selectedEvent.name}
              </h3>

              <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                {selectedEvent.details.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-5 mb-10">
                <div className="flex items-start gap-4 p-5 bg-gray-800/50 rounded-2xl border border-gray-700/60">
                  <Calendar className="w-6 h-6 text-blue-500 mt-1 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Timing</div>
                    <div className="text-gray-200">{selectedEvent.details.timing}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-800/50 rounded-2xl border border-gray-700/60">
                  <MapPin className="w-6 h-6 text-sky-500 mt-1 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Location</div>
                    <div className="text-gray-200">{selectedEvent.details.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-800/50 rounded-2xl border border-gray-700/60">
                  <Trophy className="w-6 h-6 text-blue-500 mt-1 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Judging</div>
                    <div className="text-gray-200">{selectedEvent.details.judgingCriteria}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-800/50 rounded-2xl border border-gray-700/60">
                  <Users className="w-6 h-6 text-sky-500 mt-1 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Organizer</div>
                    <div className="text-gray-200">{selectedEvent.details.organizer}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-2xl transition-all border border-gray-700 shadow-lg"
                >
                  Close
                </motion.button>

                {siteSettings.registrationOpen ? (
                  <Link
                    to={`/event-registration${selectedEvent ? `?event=${(() => {
                      const n = selectedEvent.name.toLowerCase();
                      if (n.includes('code puzzle')) return 'code-puzzle';
                      if (n.includes('project')) return 'project-exhibition';
                      if (n.includes('robo')) return 'robo-race';
                      if (n.includes('poster')) return 'technical-poster';
                      if (n.includes('rangoli')) return 'rangoli-competition';
                      if (n.includes('food')) return 'food-without-fire';
                      if (n.includes('dance')) return 'dance-competition';
                      if (n.includes('rock')) return 'rock-band';
                      if (n.includes('film')) return 'short-film-maker';
                      if (n.includes('treasure')) return 'treasure-hunt';
                      if (n.includes('cultural')) return 'cultural-events';
                      return '';
                    })()}` : ''}`}
                    className="flex-1"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-sky-700 hover:from-blue-700 hover:to-sky-800 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/30"
                    >
                      Register Now →
                    </motion.button>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="flex-1 py-4 bg-gray-800/80 text-gray-400 font-semibold rounded-2xl border border-gray-700/50 cursor-not-allowed"
                  >
                    Registrations Closed
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
