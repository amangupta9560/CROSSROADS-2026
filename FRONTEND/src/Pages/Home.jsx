import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Calendar,
  Sparkles,
  Users,
  Briefcase,
  Star,
  Trophy,
  ChevronDown,
  Award,
  Gift,
  ArrowRight,
  Clock,
  MapPin,
  ShieldCheck,
  Code2,
  Cpu,
  Flame,
  Music,
  Gamepad2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false
  });

  const [openFAQ, setOpenFAQ] = useState(null);
  const [registrationOpen, setRegistrationOpen] = useState(true);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothScrollY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroY = useTransform(smoothScrollY, [0, 1], [0, 220]);
  const heroOpacity = useTransform(smoothScrollY, [0, 0.35], [1, 0]);

  // Live countdown to November 28, 2026, 09:00 AM IST
  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date('2026-11-28T09:00:00+05:30').getTime();
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, expired: false });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    // Fetch site registration status
    fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && data.registrationOpen !== undefined) {
          setRegistrationOpen(data.registrationOpen);
        }
      })
      .catch(() => {});

    return () => clearInterval(timer);
  }, []);

  const featuredEvents = [
    {
      title: 'Code Puzzle',
      category: 'Technical',
      icon: Code2,
      desc: 'Speed syntax and algorithmic debugging battle in 20 minutes.',
      tag: 'Solo Only',
      link: '/event-registration?event=code-puzzle',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      title: 'Robo Race',
      category: 'Robotics',
      icon: Flame,
      desc: 'High-speed bots navigating obstacle ramps, seesaws, and pit traps.',
      tag: '1 - 4 Members',
      link: '/event-registration?event=robo-race',
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Project Exhibition',
      category: 'Technical',
      icon: Cpu,
      desc: 'Showcase working prototypes, AI systems, and hardware innovations.',
      tag: '1 - 4 Members',
      link: '/event-registration?event=project-exhibition',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      title: 'Dance Competition',
      category: 'Cultural',
      icon: Sparkles,
      desc: 'Electrifying solo and group performances judged on synchronization & expression.',
      tag: 'Solo / Squad',
      link: '/event-registration?event=dance-competition',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Rock Band',
      category: 'Cultural',
      icon: Music,
      desc: 'High-voltage live college band face-off under amphitheatre lights.',
      tag: '1 - 4 Members',
      link: '/event-registration?event=rock-band',
      color: 'from-red-500 to-rose-500'
    },
    {
      title: 'Treasure Hunt',
      category: 'Adventure',
      icon: Gamepad2,
      desc: 'Campus-wide cryptic clues and checkpoint missions against the clock.',
      tag: '5 - 8 Squad',
      link: '/event-registration?event=treasure-hunt',
      color: 'from-indigo-500 to-violet-500'
    }
  ];

  const stats = [
    {
      icon: Users,
      value: '1,500+',
      label: 'Innovators Expected',
      color: 'text-cyan-400',
      bgGradient: 'from-cyan-500/20 to-blue-500/10'
    },
    {
      icon: Briefcase,
      value: '50+',
      label: 'Colleges & Universities',
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/20 to-indigo-500/10'
    },
    {
      icon: Trophy,
      value: '11',
      label: 'Flagship Arenas',
      color: 'text-amber-400',
      bgGradient: 'from-amber-500/20 to-orange-500/10'
    },
    {
      icon: Star,
      value: '₹1L+',
      label: 'Total Prize Pool',
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-500/20 to-teal-500/10'
    }
  ];

  const faqs = [
    {
      question: 'What is CROSSROADS 2026?',
      answer: 'CROSSROADS 2026 is the annual inter-college technical and cultural festival hosted by Hi-Tech Institute of Engineering & Technology (HIET), Ghaziabad. It brings together over 1,500 students from engineering, management, and arts institutions across North India to compete in 11 flagship arenas.'
    },
    {
      question: 'When and where will CROSSROADS 2026 take place?',
      answer: 'CROSSROADS 2026 will be held on November 28–29, 2026, at the sprawling HIET Ghaziabad campus (NH-9). Day 1 kicks off at 8:50 AM with registrations and inauguration, followed by competitions and cultural nights across both days.'
    },
    {
      question: 'What is the last date to register?',
      answer: 'Online registrations officially close on November 20, 2026 at 11:59 PM. To ensure your team pass is generated and logistical arrangements are finalized, all participants must register online before the deadline.'
    },
    {
      question: 'Is there any registration fee?',
      answer: 'No! Registration for CROSSROADS 2026 is completely free of cost for all student participants. Simply choose your event, submit your squad details, and your official Team Pass will be emailed instantly.'
    },
    {
      question: 'Can I participate in multiple events?',
      answer: 'Yes! Participants are welcome to register for multiple competitions as long as their schedule slots do not clash. Please review the official schedule before signing up for overlapping tracks.'
    },
    {
      question: 'Will participants receive certificates and prizes?',
      answer: 'Yes! All registered participants who attend receive an official Certificate of Participation. Winners in each event receive cash prizes, commemorative trophies, merit certificates, and exclusive sponsor gifts from our ₹1,00,000+ prize pool.'
    },
    {
      question: 'What documents should we bring to the fest?',
      answer: 'Every participant must carry their valid College Identity Card and a copy of the official confirmation email containing their Team ID (CR26-XXXX). Laptops, robot kits, or project setups should be brought by the respective teams.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#060813] text-gray-100 overflow-hidden relative selection:bg-cyan-500 selection:text-black">
      {/* Background Cyber Grid & Ambient Radial Lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[50rem] h-[25rem] bg-cyan-600/12 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-96 right-[-10%] w-[35rem] h-[25rem] bg-indigo-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[60rem] left-[-10%] w-[35rem] h-[25rem] bg-purple-600/10 blur-[160px] rounded-full pointer-events-none" />

      {/* HERO SECTION */}
      <motion.div
        className="relative z-10 container mx-auto px-4 pt-32 sm:pt-36 lg:pt-40 pb-16 lg:pb-24 flex flex-col items-center justify-center text-center"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Registration Live Status & Fest Dates Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-950/50 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>REGISTRATIONS LIVE • CLOSES NOV 20, 2026</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-gray-300 text-xs sm:text-sm font-medium shadow-md backdrop-blur-md"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>November 28–29, 2026</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-gray-300 text-xs sm:text-sm font-medium shadow-md backdrop-blur-md hidden md:inline-flex"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>HIET Ghaziabad (NH-9)</span>
          </motion.div>
        </div>

        {/* Main Event Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 px-2"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none">
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-2xl">
              CROSSROADS
            </span>
            <span className="text-white ml-3 sm:ml-5 drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
              2026
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-xl lg:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
            North India's Premier Inter-College Technical & Cultural Fest
          </p>
        </motion.div>

        {/* Value Chips Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto mb-10 text-xs sm:text-sm"
        >
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-300 font-medium">
            <Trophy size={14} className="text-amber-400" />
            <span>₹1,00,000+ Prize Pool</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-300 font-medium">
            <Cpu size={14} className="text-cyan-400" />
            <span>11 Flagship Competitions</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-300 font-medium">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Verifiable Certificates</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-300 font-medium">
            <Users size={14} className="text-purple-400" />
            <span>50+ Colleges Competing</span>
          </div>
        </motion.div>

        {/* LIVE COUNTDOWN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-3xl mx-auto mb-10"
        >
          <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
            {/* Holographic Top Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
                  {timeLeft.expired ? 'CROSSROADS HAS BEGUN!' : 'COUNTDOWN TO GLORY'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-gray-500">HIET CAMPUS • NOV 28-29</span>
            </div>

            {!timeLeft.expired ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-5">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Minutes' },
                  { value: timeLeft.seconds, label: 'Seconds' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-5 rounded-2xl bg-[#090e1c] border border-cyan-500/20 text-center shadow-inner group hover:border-cyan-400 transition"
                  >
                    <div className="text-3xl sm:text-5xl font-black font-mono text-cyan-400 tracking-tight group-hover:scale-105 transition-transform">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-gray-400 mt-1.5 font-medium">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-2xl sm:text-4xl font-extrabold text-cyan-400 font-mono tracking-wider">
                FEST IS OFFICIALLY LIVE!
              </div>
            )}

            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <span>⚠️</span>
                <span>Online Registration Deadline: <strong>November 20, 2026</strong></span>
              </span>
              <span className="font-mono text-gray-500">100% Free Entry • Limited Slots</span>
            </div>
          </div>
        </motion.div>

        {/* PRIMARY CALLS TO ACTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto"
        >
          {registrationOpen ? (
            <Link
              to="/event-registration"
              className="w-full sm:w-auto flex-1 py-4 px-8 bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black font-extrabold text-base rounded-2xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Sparkles size={18} className="text-black" />
              <span>Register Your Squad</span>
              <ArrowRight size={18} className="text-black group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link
              to="/events"
              className="w-full sm:w-auto flex-1 py-4 px-8 bg-slate-800 text-gray-300 hover:text-white font-bold text-base rounded-2xl border border-slate-700 transition"
            >
              Registrations Paused • View Events
            </Link>
          )}

          <Link
            to="/events"
            className="w-full sm:w-auto py-4 px-7 bg-slate-900/90 hover:bg-slate-800 text-gray-200 hover:text-white font-bold text-base rounded-2xl border border-slate-700/80 hover:border-cyan-500/50 shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trophy size={18} className="text-cyan-400" />
            <span>Explore 11 Arenas</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* FEATURED ARENAS SHOWCASE SECTION */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-widest font-semibold mb-3">
              Competitions & Tracks
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Featured <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Event Arenas</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mt-3">
              From high-octane coding and battle bots to electrifying rock performances. Choose your domain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/30 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.color} text-black font-bold shadow-md`}>
                        <Icon size={22} />
                      </div>
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                        {item.tag}
                      </span>
                    </div>
                    <span className="text-xs uppercase font-mono tracking-wider text-gray-500 block mb-1">
                      {item.category} Track
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-mono">Date: Nov 28–29</span>
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition group-hover:translate-x-1 duration-200"
                    >
                      <span>Register Arena</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-sm font-bold text-white transition hover:scale-105"
            >
              <span>View All 11 Competitions & Rulebooks</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* METRICS & NUMBERS SECTION */}
      <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center relative overflow-hidden group hover:border-slate-700 transition"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={22} className={s.color} />
                  </div>
                  <div className="text-3xl sm:text-5xl font-black font-mono text-white mb-1.5">
                    {s.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 font-medium">
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRIZE POOL SPOTLIGHT */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800 bg-gradient-to-b from-slate-950/60 to-black">
        <div className="max-w-4xl mx-auto bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center mx-auto mb-6 text-amber-400 shadow-xl shadow-amber-500/10">
            <Trophy size={40} />
          </div>
          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs uppercase tracking-widest font-semibold mb-3">
            Grand Competition Rewards
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            ₹1,00,000+ Prize Pool
          </h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Compete across technical and cultural arenas for cash rewards, prestigious rolling trophies, verifiable merit certificates, and exclusive corporate goodies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-8 text-sm">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center gap-2">
              <Award className="text-cyan-400" size={18} />
              <span className="font-semibold text-gray-200">Official Certificates</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center gap-2">
              <Trophy className="text-amber-400" size={18} />
              <span className="font-semibold text-gray-200">Gold & Silver Trophies</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center gap-2">
              <Gift className="text-emerald-400" size={18} />
              <span className="font-semibold text-gray-200">Goodies & Badges</span>
            </div>
          </div>

          <Link
            to="/event-registration"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-black font-extrabold text-base shadow-lg shadow-amber-500/20 hover:scale-105 transition"
          >
            <Sparkles size={18} className="text-black" />
            <span>Enter the Competition</span>
          </Link>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-widest font-semibold mb-3">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Frequently Asked <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mt-3">
              Everything you need to know about participating in CROSSROADS 2026.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition"
                >
                  <span className="text-base sm:text-lg font-bold text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-cyan-400 shrink-0 transition-transform duration-300 ${
                      openFAQ === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openFAQ === idx && (
                  <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-gray-300 leading-relaxed border-t border-slate-800/60 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
