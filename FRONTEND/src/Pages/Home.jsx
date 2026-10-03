

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Calendar, Sparkles, Ghost, Users, Briefcase, Activity, Star, Trophy, ChevronDown, Award, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [openFAQ, setOpenFAQ] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [registrationOpen, setRegistrationOpen] = useState(true);

  const titleRef = useRef(null);
  const dateRef = useRef(null);
  const timerBoxRef = useRef(null);
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

  const heroY = useTransform(smoothScrollY, [0, 1], [0, 300]);
  const heroOpacity = useTransform(smoothScrollY, [0, 0.3], [1, 0]);
  const starsY = useTransform(smoothScrollY, [0, 1], [0, -200]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date('2026-02-26T08:00:00').getTime();
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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

  const stats = [
    {
      icon: Users,
      value: '100+',
      label: 'Participants',
      gradient: 'from-blue-600 to-blue-500',
      bgGradient: 'from-blue-600/20 to-blue-500/10'
    },
    {
      icon: Briefcase,
      value: '10+',
      label: 'Colleges',
      gradient: 'from-sky-600 to-cyan-500',
      bgGradient: 'from-sky-600/20 to-cyan-500/10'
    },
    {
      icon: Activity,
      value: '2+',
      label: 'Workshops',
      gradient: 'from-blue-600 to-blue-500',
      bgGradient: 'from-blue-600/20 to-blue-500/10'
    },
    {
      icon: Star,
      value: '10+',
      label: 'Mentors',
      gradient: 'from-sky-600 to-cyan-500',
      bgGradient: 'from-sky-600/20 to-cyan-500/10'
    }
  ];

  

  const faqs = [
    {
      question: 'What is CROSSROADS 2026?',
      answer: 'CROSSROADS 2026 is our college\'s annual technical and cultural fest featuring a blend of innovation, creativity, and talent. It includes exciting technical events like Project Exhibition, Robo Race, and Poster Presentation, along with cultural competitions such as Dance, Singing, Short Film, and many more.'
    },
    {
      question: 'Who can participate in the fest?',
      answer: 'Students from all colleges across India can participate in CROSSROADS 2026. Whether you are passionate about coding, robotics, arts, or performing, there\'s an event for everyone!'
    },
    {
      question: 'Is there any registration fee?',
      answer: 'No, the registration for CROSSROADS 2026 is completely free of cost. Just sign up online through our official website to secure your spot in the fest.'
    },
    {
      question: 'Can I participate in multiple events?',
      answer: 'Yes, participants are allowed to register for multiple events as long as the event timings do not overlap. Make sure to check the event schedule before registering for multiple competitions.'
    },
    {
      question: 'How can I register for the events?',
      answer: 'You can register online through the official CROSSROADS 2026 website. Visit the event page, select your desired event, and fill out the registration form. Confirmation details will be shared via email.'
    },
    {
      question: 'When and where will CROSSROADS 2026 be held?',
      answer: 'CROSSROADS 2026 will take place on February 27-28, 2026, at our college campus. Detailed venue information and event schedules will be shared closer to the date.'
    },
    {
      question: 'Are there any prizes for winners?',
      answer: 'Yes! Attractive prizes, certificates, and trophies will be awarded to winners and outstanding participants across all technical and cultural events.'
    },
    {
      question: 'Do participants need to bring anything?',
      answer: 'Participants should bring their college ID cards, laptops or project materials (if applicable), and any specific items required for their event. All general arrangements such as WiFi, workspace will be provided.'
    },
    {
      question: 'Will food and accommodation be provided?',
      answer: 'Food and refreshments will be available at the venue. Limited accommodation facilities may be provided for outstation participants — please contact the organizing team in advance for arrangements.'
    },
    {
      question: 'How can I stay updated about the fest?',
      answer: 'All updates, schedules, and announcements will be shared on the official website and social media handles of CROSSROADS 2026. Make sure to follow us for the latest news!'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-800/15 via-transparent to-transparent"></div>

      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{ y: starsY }}
      >
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      <motion.div 
        className="relative z-10 container mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center pt-24 sm:pt-20 md:pt-24"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <motion.div
          ref={dateRef}
          className="mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg shadow-blue-600/50"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-semibold text-sm sm:text-base md:text-lg">February 27-28, 2026</span>
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.div>

        <div ref={titleRef} className="text-center mb-8 md:mb-12 px-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight whitespace-nowrap">
            {['C', 'R', 'O', 'S', 'S', 'R', 'O', 'A', 'D', 'S'].map((letter, index) => (
              <motion.span
                key={index}
                className="inline-block text-blue-500"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.3 + index * 0.05,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.2, 
                  color: '#60a5fa',
                  transition: { duration: 0.2 }
                }}
              >
                {letter}
              </motion.span>
            ))}
            {['2', '0', '2', '6'].map((number, index) => (
              <motion.span
                key={`num-${index}`}
                className="inline-block text-white ml-2 sm:ml-3 md:ml-4 first:ml-2 sm:first:ml-3 md:first:ml-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.8 + index * 0.05,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.2, 
                  color: '#93c5fd',
                  transition: { duration: 0.2 }
                }}
              >
                {number}
              </motion.span>
            ))}
          </h1>
        </div>

        <motion.div
          ref={timerBoxRef}
          className="relative w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(14, 165, 233, 0.15) 100%)',
            borderRadius: '24px',
            padding: '2px',
          }}
        >
          <div
            className="bg-slate-800/80 backdrop-blur-xl rounded-[22px] p-4 sm:p-6 md:p-8 lg:p-12"
            style={{
              boxShadow: '0 0 60px rgba(59, 130, 246, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 text-center mb-6 md:mb-8">
             Wow! All seats are taken and registration is now closed. Get ready for something amazing!
            </h2>

            {/* <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Minutes' },
                { value: timeLeft.seconds, label: 'Seconds' }
              ].map((item) => (
                <motion.div
                  key={item.label}
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div
                    className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
                      border: '2px solid rgba(59, 130, 246, 0.3)',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10">
                      <motion.div
                        key={item.value}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-1 sm:mb-2 text-center"
                      >
                        {String(item.value).padStart(2, '0')}
                      </motion.div>
                      <div className="text-xs sm:text-sm md:text-base text-blue-400 font-medium text-center">
                        {item.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div> */}
          </div>
        </motion.div>

        <motion.div 
          className="mt-8 md:mt-12 flex justify-center w-full max-w-md mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <motion.button
            className="w-full px-8 py-4 rounded-xl font-semibold text-base sm:text-lg relative overflow-hidden group cursor-pointer"
            style={{
              background: registrationOpen
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 1) 0%, rgba(14, 165, 233, 1) 100%)'
                : 'linear-gradient(135deg, rgba(75, 85, 99, 1) 0%, rgba(55, 65, 81, 1) 100%)',
              border: '2px solid rgba(59, 130, 246, 0.5)',
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {registrationOpen ? (
              <Link to="/event-registration" className="relative z-10 block text-white font-bold">
                Register For Events →
              </Link>
            ) : (
              <Link to="/events" className="relative z-10 block text-gray-200 font-bold">
                Registrations Closed • Explore Events
              </Link>
            )}
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </motion.div>
      </motion.div>

      <section className="relative z-10 py-16 sm:py-20 md:py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.span 
              className="inline-block px-6 py-2 rounded-full text-sm sm:text-base font-semibold mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              About The Event
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4">
              <span className="text-white">The State Level </span>
              <span className="text-blue-500">Innovation Competition</span>
              <span className="text-white"> of the Year</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group"
            >
              <div
                className="h-full p-6 sm:p-8 md:p-10 rounded-2xl backdrop-blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%)',
                  border: '2px solid rgba(59, 130, 246, 0.2)',
                  boxShadow: '0 0 40px rgba(59, 130, 246, 0.1)',
                }}
              >
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 mb-6">
                  What is CROSSROADS?
                </h3>
                <div className="space-y-4 text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                  <p>
                    CROSSROADS 2026 is our college's annual technical and cultural fest that celebrates innovation, creativity, and talent. It brings together students from diverse fields to showcase their skills through exciting events, competitions, and performances.
                  </p>
                  <p>
                    From project exhibitions and robotics challenges to dance, music, and art — the fest offers a vibrant platform for young minds to connect, collaborate, and create unforgettable memories.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative group"
            >
              <div
                className="h-full p-6 sm:p-8 md:p-10 rounded-2xl backdrop-blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
                  border: '2px solid rgba(14, 165, 233, 0.2)',
                  boxShadow: '0 0 40px rgba(14, 165, 233, 0.1)',
                }}
              >
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-400 mb-6">
                  Why Participate?
                </h3>
                <div className="space-y-4">
                  {[
                    { text: 'Showcase your talent in technical and cultural events' },
                    { text: 'Gain hands-on experience and learn from experts' },
                    { text: 'Win exciting prizes, certificates, and recognition' },
                    { text: 'Network with students, innovators, and industry mentors' },
                    { text: 'Be part of an unforgettable two-day college fest experience' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3 group/item"
                    >
                      <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                        }}
                      >
                        <Ghost className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
                      </div>
                      <p className="text-gray-300 text-sm sm:text-base md:text-lg flex-1 pt-1">
                        {item.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 sm:py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-5xl mx-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
              borderRadius: '24px',
              padding: '2px',
            }}
          >
            <div
              className="bg-slate-800/80 backdrop-blur-xl rounded-[22px] p-6 sm:p-8 md:p-12 lg:p-16"
              style={{
                boxShadow: '0 0 60px rgba(59, 130, 246, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="flex flex-col items-center text-center group"
                    whileHover={{ scale: 1.05, y: -10 }}
                  >
                    <motion.div
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center mb-4 sm:mb-6 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${stat.bgGradient})`,
                        border: '2px solid rgba(59, 130, 246, 0.3)',
                        boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
                      }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${stat.gradient.includes('blue-6') ? 'text-blue-400' : 'text-sky-400'}`} />
                    </motion.div>

                    <motion.div
                      className="text-2xl sm:text-5xl md:text-4xl font-black mb-2 sm:mb-3 text-white"
                    >
                      {stat.value}
                    </motion.div>

                    <div className="text-base sm:text-lg md:text-xl text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 py-12 sm:py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.span 
              className="inline-block px-6 py-3 rounded-full text-sm sm:text-base font-semibold mb-6 bg-linear-to-r from-blue-600 to-blue-500"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Win Big
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4">
              <span className="text-white">Exciting </span>
              <span className="text-blue-500">Prizes</span>
              <span className="text-white"> Await</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto mt-4">
              Compete for an incredible treasure of rewards, recognition, and career opportunities!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative mb-12 md:mb-16"
          >
            <div
              className="relative max-w-3xl mx-auto p-8 sm:p-10 md:p-12 lg:p-16 rounded-3xl backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(14, 165, 233, 0.15) 100%)',
                border: '3px solid rgba(59, 130, 246, 0.5)',
                boxShadow: '0 0 80px rgba(59, 130, 246, 0.4), inset 0 0 40px rgba(59, 130, 246, 0.1)',
              }}
            >
              <div className="text-center">
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full mb-6"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 1) 0%, rgba(37, 99, 235, 1) 100%)',
                    boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)',
                  }}
                  initial={{ rotate: 0, scale: 0 }}
                  whileInView={{ rotate: 360, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                >
                  <Trophy className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
                </motion.div>

                <motion.h3 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Total Prize Pool
                </motion.h3>

                <motion.div 
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  ₹1,00,000+
                </motion.div>

                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8">
                  {[
                    { icon: Award, label: 'Certificates', color: 'blue' },
                    { icon: Trophy, label: 'Trophies', color: 'sky' },
                    { icon: Gift, label: 'Goodies', color: 'blue' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg"
                      style={{
                        background: item.color === 'blue' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                        border: item.color === 'blue' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(14, 165, 233, 0.3)',
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <item.icon className={`w-5 h-5 ${item.color === 'blue' ? 'text-blue-400' : 'text-sky-400'}`} />
                      <span className="text-gray-300 font-medium">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 py-12 sm:py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.span 
              className="inline-block px-6 py-2 rounded-full text-sm sm:text-base font-semibold mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              FAQ
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4">
              <span className="text-white">Frequently Asked </span>
              <span className="text-blue-500">Questions</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative w-full"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
              borderRadius: '24px',
              padding: '2px',
            }}
          >
            <div
              className="bg-slate-800/80 backdrop-blur-xl rounded-[22px] p-4 sm:p-6 md:p-8"
              style={{
                boxShadow: '0 0 60px rgba(59, 130, 246, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full text-left p-4 sm:p-6 rounded-xl transition-all duration-300"
                      style={{
                        background: openFAQ === index
                          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)'
                          : 'rgba(255, 255, 255, 0.02)',
                        border: `2px solid ${openFAQ === index ? 'rgba(59, 130, 246, 0.3)' : 'rgba(14, 165, 233, 0.2)'}`,
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: openFAQ === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="shrink-0"
                        >
                          <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 ${openFAQ === index ? 'text-blue-500' : 'text-gray-400'}`} />
                        </motion.div>
                      </div>
                      <motion.div
                        initial={false}
                        animate={{
                          height: openFAQ === index ? 'auto' : 0,
                          opacity: openFAQ === index ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

