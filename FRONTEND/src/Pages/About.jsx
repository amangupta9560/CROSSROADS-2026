
import React from "react";
import { motion } from "framer-motion";
import { Code2, Lightbulb, Users, Zap, Trophy, Rocket, ArrowRight, Calendar, MapPin, Award, Target, Sparkles, Clock, Users2, TrendingUp } from "lucide-react";
import { FaRocket, FaUsers, FaLightbulb } from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true, margin: "-100px" }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const stats = [
    { icon: Users2, label: "Expected Participants", value: "500+", color: "blue" },
    { icon: Trophy, label: "Competitions & Events", value: "25+", color: "sky" },
    { icon: Award, label: "Prize Pool Worth", value: "₹1L+", color: "blue" },
    { icon: TrendingUp, label: "Industry Mentors", value: "15+", color: "sky" }
  ];

  const uniqueFeatures = [
    {
      icon: Code2,
      title: "Pure Technical Focus",
      desc: "From coding marathons to AI workshops, pure innovation at every turn"
    },
    {
      icon: Users,
      title: "All-Inclusive Participation",
      desc: "Tech enthusiasts, designers, leaders, and creators all belong here"
    },
    {
      icon: Zap,
      title: "Real-World Relevance",
      desc: "Challenges mirror industry problems, not classroom textbooks"
    },
    {
      icon: Trophy,
      title: "Recognition at Scale",
      desc: "Winners get visibility, portfolio wins, and industry connections"
    },
    {
      icon: Rocket,
      title: "Innovation Platform",
      desc: "Showcase your ideas, projects, and potential to the world"
    },
    {
      icon: Lightbulb,
      title: "Networking Goldmine",
      desc: "Connect with mentors, peers, seniors, and future collaborators"
    }
  ];

  const eventTypes = [
    {
      category: "Technical Competitions",
      events: ["Code Puzzle", "Project Exhibition", "Robo Race", "Technical Poster"]
    },
    {
      category: "Workshops & Learning",
      events: ["Industry Expert Sessions", "Hands-on Technical Workshops", "Skill Development Bootcamps"]
    },
    {
      category: "Cultural & Creative",
      events: ["Singing", "Dance", "Rock Band", "Short Film Making", "Ad Mad Show"]
    },
    {
      category: "Fun & Engagement",
      events: ["Treasure Hunt", "Networking Games", "Rangoli Competition", "Food Without Fire"]
    }
  ];

  const whyJoin = [
    {
      icon: Trophy,
      title: "Career Boost",
      desc: "Industry recognition, portfolio projects, and potential internship/job opportunities"
    },
    {
      icon: Code2,
      title: "Skill Enhancement",
      desc: "Learn cutting-edge technologies, leadership, teamwork, and problem-solving"
    },
    {
      icon: Users,
      title: "Build Your Network",
      desc: "Connect with like-minded innovators, mentors, and industry professionals"
    },
    {
      icon: Lightbulb,
      title: "Showcase Your Talent",
      desc: "Present your ideas and projects on a platform that values creativity"
    },
    {
      icon: Rocket,
      title: "Create Memories",
      desc: "Be part of an unforgettable experience that defines your college journey"
    },
    {
      icon: Zap,
      title: "Break Your Limits",
      desc: "Challenge yourself, compete fairly, and discover what you're truly capable of"
    }
  ];

  const highlights = [
    { icon: Calendar, text: "2 Days of Non-Stop Innovation" },
    { icon: MapPin, text: "Campus-Wide Interactive Zones" },
    { icon: Award, text: "Certificates for All Participants" },
    { icon: Sparkles, text: "Exclusive Networking Sessions" }
  ];

  return (
    <div className="relative bg-gradient-to-br from-black via-gray-900 to-blue-950 min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.08),transparent_50%)]"></div>

      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 pt-24 pb-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <motion.section {...fadeInUp} className="mb-20 md:mb-28">
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-5 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-semibold mb-6 backdrop-blur-sm">
                  Welcome to Innovation
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-white to-sky-400 bg-clip-text text-transparent mb-6 tracking-tight"
              >
                CROSSROADS 2026
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light mb-6"
              >
                Where Innovation Meets Opportunity
              </motion.p>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="h-1.5 w-32 bg-gradient-to-r from-blue-400 via-white to-sky-400 rounded-full mx-auto"
              ></motion.div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
            >
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 md:p-6 text-center hover:border-blue-500/50 transition-all duration-300"
                  >
                    <Icon className="text-blue-400 mx-auto mb-3" size={28} />
                    <p className="text-gray-300 text-sm font-medium">{highlight.text}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 md:p-10 lg:p-14 shadow-2xl"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">What is CROSSROADS?</h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-5">
                CROSSROADS 2026 is an annual college-wide technical and innovation festival designed to ignite creativity, foster collaboration, and celebrate excellence across every domain of expertise. More than just a fest, it's a launchpad for ideas that matter.
              </p>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                We bring together students, innovators, creators, and leaders—regardless of their background or experience level. Here, code meets creativity, competitions drive excellence, and every participant leaves with new skills, lasting connections, and unforgettable memories.
              </p>
              <div className="mt-8 p-6 md:p-8 bg-gradient-to-r from-blue-500/10 to-sky-500/10 border border-blue-500/20 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                <p className="text-blue-300 font-semibold text-lg md:text-xl text-center relative z-10">
                  "CROSSROADS isn't just about winning—it's about becoming unstoppable."
                </p>
              </div>
            </motion.div>
          </motion.section>

          <motion.section
            className="mb-20 md:mb-28"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div {...fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">By The Numbers</h2>
              <p className="text-gray-400 text-lg">Experience the scale of innovation</p>
              <div className="h-1.5 w-24 bg-gradient-to-r from-blue-400 to-sky-500 rounded-full mx-auto mt-5"></div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const colorClasses = {
                  blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
                  sky: "from-sky-500/20 to-sky-600/20 border-sky-500/30",
                };
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`bg-gradient-to-br ${colorClasses[stat.color]} backdrop-blur-xl border rounded-3xl p-6 md:p-8 text-center hover:scale-105 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="text-white mx-auto mb-4" size={40} />
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>

          <motion.section
            className="mb-20 md:mb-28"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 md:p-10 lg:p-12 shadow-xl hover:shadow-blue-500/10 transition-shadow duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
                    <FaRocket className="text-blue-400" size={28} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Our Vision</h2>
                </div>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-5">
                  To create a vibrant ecosystem where technical talent, creativity, and innovation thrive without boundaries.
                </p>
                <p className="text-gray-400 text-base leading-relaxed">
                  We envision CROSSROADS as the catalyst that transforms ambitious ideas into impactful projects, and energetic students into industry-ready innovators who shape the future of technology.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 md:p-10 lg:p-12 shadow-xl hover:shadow-sky-500/10 transition-shadow duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-500/20 to-sky-600/20 rounded-2xl flex items-center justify-center">
                    <FaUsers className="text-sky-400" size={28} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Our Mission</h2>
                </div>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-5">
                  To empower students with real-world experience, industry exposure, and collaborative platforms.
                </p>
                <p className="text-gray-400 text-base leading-relaxed">
                  We're committed to fostering leadership, building technical excellence, enabling peer-to-peer learning, and creating opportunities that matter for every participant's growth.
                </p>
              </motion.div>
            </div>
          </motion.section>

          <motion.section className="mb-20 md:mb-28">
            <motion.div {...fadeInUp} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">What Makes CROSSROADS Unique</h2>
              <p className="text-gray-400 text-lg">Standing out from the crowd</p>
              <div className="h-1.5 w-24 bg-gradient-to-r from-blue-400 to-sky-500 rounded-full mx-auto mt-5"></div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {uniqueFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-7 md:p-8 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="mb-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-sky-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Icon className="text-blue-400 group-hover:text-sky-400 transition-colors" size={28} />
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>

          <motion.section className="mb-20 md:mb-28">
            <motion.div {...fadeInUp} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">Types of Events</h2>
              <p className="text-gray-400 text-lg">Something exciting for everyone</p>
              <div className="h-1.5 w-24 bg-gradient-to-r from-blue-400 to-sky-500 rounded-full mx-auto mt-5"></div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-2 gap-6 md:gap-8"
            >
              {eventTypes.map((eventType, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-7 md:p-9 hover:border-sky-500/50 transition-all duration-300 shadow-lg"
                >
                  <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent mb-6">{eventType.category}</h3>
                  <ul className="space-y-3">
                    {eventType.events.map((event, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-300 group">
                        <ArrowRight className="text-blue-400 mt-1 shrink-0 group-hover:translate-x-1 transition-transform" size={18} />
                        <span className="group-hover:text-white transition-colors">{event}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section className="mb-20 md:mb-28">
            <motion.div {...fadeInUp} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">Who Can Participate?</h2>
              <p className="text-gray-400 text-lg">Everyone is welcome at CROSSROADS</p>
              <div className="h-1.5 w-24 bg-gradient-to-r from-blue-400 to-sky-500 rounded-full mx-auto mt-5"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 md:p-12 lg:p-14 shadow-2xl"
            >
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10">
                CROSSROADS welcomes everyone—no matter your technical background or experience level. Whether you're a coding wizard, a design enthusiast, a leader, or someone trying something new, there's a place for you here.
              </p>

              <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                {[
                  "First-year students exploring their interests",
                  "Final-year students building their portfolios",
                  "Tech enthusiasts and competitive coders",
                  "UI/UX designers and creative minds",
                  "Aspiring entrepreneurs and innovators",
                  "Leaders and team organizers",
                  "Artists and cultural performers",
                  "Everyone with curiosity and passion"
                ].map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 text-gray-300 bg-gray-800/30 rounded-xl p-4 hover:bg-gray-800/50 transition-all"
                  >
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-sky-500 rounded-full shrink-0"></div>
                    <span className="text-sm md:text-base">{category}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.section>

          <motion.section className="mb-20 md:mb-28">
            <motion.div {...fadeInUp} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">Why Join CROSSROADS?</h2>
              <p className="text-gray-400 text-lg">Transform your college experience</p>
              <div className="h-1.5 w-24 bg-gradient-to-r from-blue-400 to-sky-500 rounded-full mx-auto mt-5"></div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {whyJoin.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-7 md:p-8 hover:shadow-2xl hover:shadow-sky-500/20 hover:-translate-y-2 hover:border-sky-500/50 transition-all duration-300"
                  >
                    <div className="mb-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-sky-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Icon className="text-sky-400 group-hover:text-blue-400 transition-colors" size={28} />
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">{reason.title}</h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">{reason.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-12"
          >
            <div className="relative bg-gradient-to-r from-blue-500/10 via-white/5 to-sky-500/10 border border-blue-500/30 rounded-3xl p-10 md:p-14 lg:p-20 text-center overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <Target className="text-blue-400 mx-auto mb-6" size={48} />
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Ready to Cross the Line?
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                  CROSSROADS 2026 is calling. It's time to step up, challenge yourself, and discover what you're truly capable of. Whether you're here to compete, create, connect, or inspire—your journey starts now.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to='/event-registration' className="px-10 md:px-12 py-4 md:py-5 bg-gradient-to-r from-blue-500 to-sky-500 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 text-base md:text-lg group inline-block">
                    Get Involved
                    <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-10 border-t border-gray-800/50"
          >
            <p className="text-gray-500 text-sm md:text-base mb-2">
              CROSSROADS 2026 | 28-29 November 2026
            </p>
            <p className="text-gray-600 text-xs md:text-sm">
              Where Innovation Meets Opportunity
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default About;
