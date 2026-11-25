import React from "react";
import { motion as Motion } from "framer-motion";
import {
  Code2,
  Lightbulb,
  Users,
  Zap,
  Trophy,
  Rocket,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  MapPin,
  Award,
  Target,
  Sparkles,
  Clock,
  Users2,
  TrendingUp,
  Cpu,
  Layers,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";
import TechBackground from "../Components/TechBackground.jsx";

const smoothEase = [0.22, 1, 0.36, 1];

const SpotlightBezelCard = ({ children, className = "", innerClassName = "" }) => {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`group relative p-[1px] rounded-[1.75rem] bg-gradient-to-br from-white/12 via-cyan-500/15 to-white/5 hover:from-cyan-400/45 hover:via-sky-500/25 hover:to-indigo-500/35 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(34, 211, 238, 0.14), transparent 65%)",
        }}
      />
      <div
        className={`relative h-full rounded-[calc(1.75rem-1px)] bg-[#080e1f]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

const About = () => {
  const stats = [
    { icon: Users2, label: "Innovators Expected", value: "1,500+", tag: "FOOTFALL" },
    { icon: Trophy, label: "Flagship Arenas", value: "11", tag: "EVENTS" },
    { icon: Award, label: "Total Prize Pool", value: "₹1L+", tag: "REWARDS" },
    { icon: TrendingUp, label: "Colleges Competing", value: "50+", tag: "CAMPUSES" },
  ];

  const uniqueFeatures = [
    {
      icon: Code2,
      title: "Engineering & Code First",
      desc: "From 20-minute algorithmic code sprints to hardware robotics tracks, built for builders and problem solvers.",
    },
    {
      icon: Users,
      title: "Cross-Campus Collaboration",
      desc: "Developers, roboticists, designers, performers, and strategists competing across unified arenas.",
    },
    {
      icon: Zap,
      title: "Applied Problem Solving",
      desc: "Challenges modeled around live prototyping, debugging under pressure, and rapid system execution.",
    },
    {
      icon: Trophy,
      title: "Verified Credentials",
      desc: "Winners earn cash awards, rolling trophies, and verifiable merit certificates across all 11 events.",
    },
    {
      icon: Rocket,
      title: "Prototype Launchpad",
      desc: "Present hardware and AI prototypes directly before academic mentors and technical judging panels.",
    },
    {
      icon: Lightbulb,
      title: "Peer & Mentor Network",
      desc: "Connect directly with faculty heads, Team Tech Fusion organizers, and top student talent from 50+ colleges.",
    },
  ];

  const eventTypes = [
    {
      category: "Technical & Engineering",
      badge: "04 ARENAS",
      events: [
        "Code Puzzle",
        "Project Exhibition / Evolution",
        "Robo Race",
        "Technical Poster Competition",
      ],
    },
    {
      category: "Cultural & Performing Arts",
      badge: "03 ARENAS",
      events: [
        "Dance Competition (Solo)",
        "Cultural Events (Group Dance)",
        "Rock Band & Live Music",
      ],
    },
    {
      category: "Creative & Culinary",
      badge: "03 ARENAS",
      events: [
        "Short Film Making",
        "Rangoli Competition",
        "Food Without Fire",
      ],
    },
    {
      category: "Campus Adventure & Honors",
      badge: "02 HIGHLIGHTS",
      events: [
        "Campus-Wide Treasure Hunt (5–8 Squad)",
        "Crossroads Grand Closing & Awards",
      ],
    },
  ];

  const whyJoin = [
    {
      icon: Trophy,
      title: "Portfolio & Recognition",
      desc: "Stand out with competitive wins, project showcases, and official HIET & Tech Fusion merit honors.",
    },
    {
      icon: Cpu,
      title: "Hands-On Mastery",
      desc: "Pressure-test your coding speed, circuit design, presentation craft, and stage confidence.",
    },
    {
      icon: Users,
      title: "High-Signal Network",
      desc: "Collaborate with ambitious engineering and creative teams across Delhi-NCR and North India.",
    },
    {
      icon: Layers,
      title: "Zero Entry Fee",
      desc: "100% free online registration for all college students with instant confirmation Team IDs.",
    },
    {
      icon: Rocket,
      title: "Two Days of Momentum",
      desc: "Two uninterrupted days of back-to-back technical duels, exhibitions, and live amphitheatre nights.",
    },
    {
      icon: Zap,
      title: "Push Past Limits",
      desc: "Step onto the stage, debug against the clock, and leave sharper than you arrived.",
    },
  ];

  const timelineMilestones = [
    {
      step: "01",
      label: "Registration Opens",
      date: "January 10, 2027",
      detail: "Online squad portal goes live",
      accent: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10",
    },
    {
      step: "02",
      label: "Last Date to Register",
      date: "January 31, 2027",
      detail: "Portal locks at 11:59 PM IST",
      accent: "text-amber-300 border-amber-500/30 bg-amber-500/10",
    },
    {
      step: "03",
      label: "Main Event Dates",
      date: "05 Feb & 06 Feb 2027",
      detail: "HIET Ghaziabad Campus (NH-9)",
      accent: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    },
  ];

  return (
    <div className="relative min-h-[100dvh] bg-[#040711] text-slate-100 overflow-hidden selection:bg-cyan-400 selection:text-slate-950">
      <TechBackground variant="about" />

      <div className="relative z-10 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* ASYMMETRIC ARCHITECTURAL HERO */}
          <section className="mb-20 md:mb-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <Motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: smoothEase }}
                className="lg:col-span-7 text-left"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 font-mono text-[11px] uppercase tracking-[0.18em] mb-6">
                  <Terminal size={13} />
                  <span>HIET Ghaziabad • Team Tech Fusion</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.04] text-white mb-6">
                  Where Engineering,{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                    Code &amp; Culture
                  </span>{" "}
                  Converge.
                </h1>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
                  CROSSROADS 2027 is the flagship annual inter-college technical and cultural
                  festival hosted by Hi-Tech Institute of Engineering &amp; Technology (HIET)
                  in collaboration with Team Tech Fusion. Over 20+ years of institutional legacy
                  meet 11 high-energy competitive arenas.
                </p>

                <div className="flex flex-wrap items-center gap-3.5 mb-8">
                  <Link
                    to="/event-registration"
                    className="group inline-flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_10px_30px_rgba(34,211,238,0.22)] hover:shadow-[0_14px_34px_rgba(34,211,238,0.38)] active:scale-[0.98] transition-all duration-300"
                  >
                    <span>Register Your Team</span>
                    <span className="w-8 h-8 rounded-full bg-slate-950/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                      <ArrowUpRight size={16} />
                    </span>
                  </Link>

                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/12 hover:border-cyan-400/35 text-slate-200 font-semibold text-sm transition-all duration-300"
                  >
                    <span>Explore 11 Arenas</span>
                    <ArrowRight size={15} className="text-cyan-400" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-slate-400">
                  {[
                    { icon: Calendar, text: "05 & 06 Feb 2027" },
                    { icon: MapPin, text: "HIET NH-9 Campus" },
                    { icon: Award, text: "₹1L+ Prize Pool" },
                    { icon: Sparkles, text: "100% Free Entry" },
                  ].map((chip, idx) => {
                    const Icon = chip.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07]"
                      >
                        <Icon size={14} className="text-cyan-400 shrink-0" />
                        <span className="truncate">{chip.text}</span>
                      </div>
                    );
                  })}
                </div>
              </Motion.div>

              {/* Right Telemetry Panel: Schedule Windows */}
              <Motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.12, ease: smoothEase }}
                className="lg:col-span-5"
              >
                <SpotlightBezelCard innerClassName="p-6 sm:p-8">
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 block">
                        Schedule Telemetry
                      </span>
                      <h2 className="font-display text-xl font-bold text-white mt-0.5">
                        Official 2027 Timeline
                      </h2>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      SCHEDULED
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {timelineMilestones.map((m) => (
                      <div
                        key={m.step}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-3.5 hover:border-cyan-400/30 transition-colors duration-300"
                      >
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border shrink-0 ${m.accent}`}
                        >
                          {m.step}
                        </span>
                        <div className="min-w-0">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                            {m.label}
                          </span>
                          <p className="font-display text-base sm:text-lg font-bold text-white">
                            {m.date}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{m.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-cyan-400" />
                      <span>28.6733° N, 77.4913° E</span>
                    </span>
                    <span className="text-cyan-300">HIET • GZB</span>
                  </div>
                </SpotlightBezelCard>
              </Motion.div>
            </div>
          </section>

          {/* WHAT IS CROSSROADS + VISION & MISSION */}
          <section className="mb-20 md:mb-28 space-y-8">
            <Motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, ease: smoothEase }}
            >
              <SpotlightBezelCard innerClassName="p-7 sm:p-10 lg:p-12">
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 block mb-2">
                      Mission Brief
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                      What is CROSSROADS?
                    </h2>
                    <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-4">
                      CROSSROADS is HIET&apos;s flagship festival built to ignite technical creativity,
                      encourage multidisciplinary collaboration, and celebrate student excellence
                      across engineering, design, and live performance.
                    </p>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                      Whether you write clean algorithms under a 20-minute timer, build an
                      all-terrain robot, present working hardware prototypes, or command the
                      amphitheatre stage, CROSSROADS gives every builder a real arena to perform.
                    </p>
                  </div>
                  <div className="lg:col-span-4">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-indigo-500/10 border border-cyan-400/20">
                      <p className="font-display text-lg font-semibold text-cyan-200 leading-snug">
                        &ldquo;CROSSROADS isn&apos;t just about winning trophies—it&apos;s about
                        shipping ideas and discovering what your squad can build.&rdquo;
                      </p>
                      <span className="block mt-3 text-[11px] font-mono uppercase tracking-widest text-slate-400">
                        Team Tech Fusion • HIET
                      </span>
                    </div>
                  </div>
                </div>
              </SpotlightBezelCard>
            </Motion.div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <Motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.65, ease: smoothEase }}
              >
                <SpotlightBezelCard innerClassName="p-7 sm:p-9">
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center text-cyan-300">
                      <Rocket size={22} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
                        North Star
                      </span>
                      <h3 className="font-display text-2xl font-bold text-white">Our Vision</h3>
                    </div>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed mb-3">
                    To cultivate a high-agency student ecosystem where engineering talent, creative
                    expression, and rapid prototyping thrive without barriers.
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We envision CROSSROADS as the launchpad that turns student prototypes into
                    real-world products and campus peers into lifelong collaborators.
                  </p>
                </SpotlightBezelCard>
              </Motion.div>

              <Motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.65, delay: 0.08, ease: smoothEase }}
              >
                <SpotlightBezelCard innerClassName="p-7 sm:p-9">
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-400/25 flex items-center justify-center text-indigo-300">
                      <Users size={22} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block">
                        Execution
                      </span>
                      <h3 className="font-display text-2xl font-bold text-white">Our Mission</h3>
                    </div>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed mb-3">
                    To deliver fair, hands-on competitive arenas backed by transparent judging,
                    verifiable credentials, and zero registration cost.
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We bring 50+ colleges together on one campus to sharpen technical craft,
                    teamwork, leadership, and creative confidence.
                  </p>
                </SpotlightBezelCard>
              </Motion.div>
            </div>
          </section>

          {/* BY THE NUMBERS */}
          <section className="mb-20 md:mb-28">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
            >
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 block mb-2">
                  Scale &amp; Telemetry
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  By The Numbers
                </h2>
              </div>
              <p className="text-slate-400 text-sm sm:text-base max-w-md">
                Measured across 11 competitive arenas hosted at HIET Ghaziabad on 05 &amp; 06 Feb 2027.
              </p>
            </Motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <Motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55, delay: idx * 0.06, ease: smoothEase }}
                  >
                    <SpotlightBezelCard innerClassName="p-6 sm:p-7">
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center text-cyan-300">
                          <Icon size={20} />
                        </div>
                        <span className="text-[10px] font-mono tracking-widest text-slate-500">
                          {stat.tag}
                        </span>
                      </div>
                      <div className="font-mono text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 mt-1.5 font-medium">
                        {stat.label}
                      </div>
                    </SpotlightBezelCard>
                  </Motion.div>
                );
              })}
            </div>
          </section>

          {/* WHAT MAKES CROSSROADS UNIQUE */}
          <section className="mb-20 md:mb-28">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-12"
            >
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 block mb-2">
                Core Architecture
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                What Makes CROSSROADS Different
              </h2>
            </Motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueFeatures.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.55, delay: idx * 0.05, ease: smoothEase }}
                    className="h-full"
                  >
                    <SpotlightBezelCard innerClassName="p-7 flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-indigo-500/15 border border-cyan-400/20 flex items-center justify-center mb-5 text-cyan-300 group-hover:scale-105 transition-transform duration-300">
                          <Icon size={22} />
                        </div>
                        <h3 className="font-display text-xl font-bold text-white mb-2.5 group-hover:text-cyan-200 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                      </div>
                    </SpotlightBezelCard>
                  </Motion.div>
                );
              })}
            </div>
          </section>

          {/* TYPES OF EVENTS */}
          <section className="mb-20 md:mb-28">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
            >
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 block mb-2">
                  Competition Matrix
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  Arenas &amp; Domains
                </h2>
              </div>
              <Link
                to="/events"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                <span>Open Full Arena Catalog</span>
                <ArrowRight size={15} />
              </Link>
            </Motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {eventTypes.map((eventType, idx) => (
                <Motion.div
                  key={eventType.category}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: idx * 0.06, ease: smoothEase }}
                >
                  <SpotlightBezelCard innerClassName="p-7 sm:p-8">
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                        {eventType.category}
                      </h3>
                      <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono text-cyan-300 shrink-0">
                        {eventType.badge}
                      </span>
                    </div>
                    <ul className="space-y-2.5">
                      {eventType.events.map((ev) => (
                        <li
                          key={ev}
                          className="flex items-center gap-3 text-slate-300 text-sm sm:text-base py-1.5 border-b border-white/[0.04] last:border-b-0"
                        >
                          <ArrowRight size={15} className="text-cyan-400 shrink-0" />
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </SpotlightBezelCard>
                </Motion.div>
              ))}
            </div>
          </section>

          {/* WHO CAN PARTICIPATE & WHY JOIN */}
          <section className="mb-20 md:mb-28 space-y-16">
            <Motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, ease: smoothEase }}
            >
              <SpotlightBezelCard innerClassName="p-7 sm:p-10 lg:p-12">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 block mb-2">
                  Open Eligibility
                </span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                  Who Can Participate?
                </h2>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mb-8">
                  CROSSROADS is open to all undergraduate and postgraduate students across India
                  with a valid college ID card—from first-year explorers to final-year engineers
                  and performers.
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {[
                    "First-year explorers",
                    "Final-year builders",
                    "Competitive programmers",
                    "Hardware & robotics teams",
                    "UI/UX & poster designers",
                    "Campus filmmakers",
                    "Dancers & live bands",
                    "Inter-college squads",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-slate-200 text-sm font-medium"
                    >
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </SpotlightBezelCard>
            </Motion.div>

            <div>
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: smoothEase }}
                className="mb-10"
              >
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 block mb-2">
                  Participant Value
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  Why Join CROSSROADS?
                </h2>
              </Motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {whyJoin.map((reason, idx) => {
                  const Icon = reason.icon;
                  return (
                    <Motion.div
                      key={reason.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.55, delay: idx * 0.05, ease: smoothEase }}
                      className="h-full"
                    >
                      <SpotlightBezelCard innerClassName="p-7">
                        <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-sky-300 mb-4">
                          <Icon size={20} />
                        </div>
                        <h3 className="font-display text-lg font-bold text-white mb-2">
                          {reason.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{reason.desc}</p>
                      </SpotlightBezelCard>
                    </Motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* FINAL CTA CARD */}
          <Motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="mb-10"
          >
            <SpotlightBezelCard innerClassName="p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.14),transparent_60%)] pointer-events-none" />
              <div className="relative z-10 max-w-3xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mx-auto mb-6">
                  <Target size={26} />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                  Ready to Step Into the Arena?
                </h2>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                  Registrations open on <strong className="text-white">January 10, 2027</strong> and
                  close on <strong className="text-amber-300">January 31, 2027</strong>. Lock your
                  squad before <strong className="text-cyan-300">05 &amp; 06 February 2027</strong>.
                </p>

                <Link
                  to="/event-registration"
                  className="group inline-flex items-center gap-3 pl-7 pr-2.5 py-3 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 text-slate-950 font-bold text-base shadow-[0_12px_36px_rgba(34,211,238,0.28)] hover:shadow-[0_16px_42px_rgba(34,211,238,0.45)] active:scale-[0.98] transition-all duration-300"
                >
                  <span>Get Involved Now</span>
                  <span className="w-9 h-9 rounded-full bg-slate-950/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                    <ArrowUpRight size={18} />
                  </span>
                </Link>
              </div>
            </SpotlightBezelCard>
          </Motion.section>

          <div className="text-center pt-8 border-t border-white/10 font-mono text-xs sm:text-sm text-slate-400 space-y-1">
            <p className="text-slate-200 font-semibold">
              CROSSROADS 2027 | 05 Feb &amp; 06 Feb 2027
            </p>
            <p className="text-slate-500">
              Registration Window: January 10 – January 31, 2027 • HIET Ghaziabad
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
