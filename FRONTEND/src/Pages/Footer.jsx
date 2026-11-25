import React from 'react';
import { Link } from 'react-router-dom';
import {
  Linkedin,
  Youtube,
  Instagram,
  Mail,
  ArrowUp,
  MapPin,
  Calendar,
  Award,
  Clock,
  Phone,
} from 'lucide-react';

const Footer = () => {
  const events = [
    'Code Puzzle',
    'Project Exhibition',
    'Robo Race',
    'Technical Poster',
    'Cultural Events',
    'Dance Competition',
    'Rock Band',
    'Rangoli Competition',
    'Food Without Fire',
    'Short Film Making',
    'Treasure Hunt',
  ];

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Events', path: '/events' },
    { label: 'Schedule', path: '/schedule' },
    { label: 'Register', path: '/event-registration' },
    { label: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/company/hiet-techfusion',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://www.youtube.com/@hietgroup',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/hiet.techfusion',
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:techfusion@hietgroup.org',
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-linear-to-b from-[#0f1729] via-[#1a2642] to-[#0a0f1c] text-gray-200 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-[#ff6b35]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#b466ff]/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(#ff6b35 1px, transparent 1px), linear-gradient(90deg, #ff6b35 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      ></div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Institutional Partners / Host & Co-powered Logos (Above Footer) */}
          <div className="border-b border-slate-800/80 pb-8 mb-8">
            <div className="text-center mb-5">
              <span className="text-[11px] uppercase tracking-widest font-mono text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 inline-block mb-1.5">
                Organized & Powered By
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Host Institution, Academic Partner & Technical Club
              </h3>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 max-w-5xl mx-auto">
              {/* HIET Logo Card */}
              <a
                href="https://hiet.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-800/90 transition-all duration-300 shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5"
              >
                <div className="bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
                  <img
                    src="/hiet.png"
                    alt="HI-TECH Institute of Engineering & Technology"
                    className="h-9 sm:h-11 w-auto object-contain max-w-[130px]"
                  />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold block">
                    Host Institution
                  </span>
                  <span className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors block">
                    HIET Ghaziabad
                  </span>
                  <span className="text-[11px] text-gray-400 block">
                    Engineering & Technology
                  </span>
                </div>
              </a>

              {/* Sunstone Logo Card */}
              <a
                href="https://sunstone.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-800/90 transition-all duration-300 shadow-lg hover:shadow-pink-500/10 hover:-translate-y-0.5"
              >
                <div className="bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
                  <img
                    src="/sunstone.jpg"
                    alt="Sunstone"
                    className="h-9 sm:h-11 w-auto object-contain max-w-[130px]"
                  />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 font-bold block">
                    Academic Partner
                  </span>
                  <span className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors block">
                    Sunstone
                  </span>
                  <span className="text-[11px] text-gray-400 block">
                    Higher Education & Careers
                  </span>
                </div>
              </a>

              {/* Tech Fusion Logo Card */}
              <a
                href="https://linkedin.com/company/hiet-techfusion"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/90 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5"
              >
                <div className="bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
                  <img
                    src="/techfusion.png"
                    alt="Team Tech Fusion"
                    className="h-9 sm:h-11 w-auto object-contain max-w-[130px]"
                  />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                    Technical Club
                  </span>
                  <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors block">
                    Team Tech Fusion
                  </span>
                  <span className="text-[11px] text-gray-400 block">
                    Technical Society & Fest Organizers
                  </span>
                </div>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6">
            {/* Column 1: Events */}
            <div className="space-y-3">
              <h3 className="text-base md:text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-[#b466ff] to-[#ff66c4] relative inline-block pb-1 mb-2">
                Events
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-linear-to-r from-[#b466ff] to-transparent rounded-full"></span>
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {events.map((event, index) => (
                  <Link
                    key={index}
                    to="/events"
                    className="group flex items-center gap-2 text-xs text-gray-300 hover:text-[#ff6b35] transition-all duration-300 py-1"
                  >
                    <span className="w-1 h-1 bg-linear-to-r from-[#ff6b35] to-[#ff66c4] rounded-full group-hover:scale-150 transition-all duration-300 shrink-0"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300 truncate">
                      {event}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links, Connect & Follow Us */}
            <div className="space-y-5">
              <div>
                <h3 className="text-base md:text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-[#ff6b35] to-[#ff8c42] relative inline-block pb-1 mb-3">
                  Quick Links
                  <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-linear-to-r from-[#ff6b35] to-transparent rounded-full"></span>
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {quickLinks.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="text-xs text-gray-300 hover:text-cyan-400 transition-colors py-1"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-300">
                <h3 className="text-base md:text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-[#ff66c4] to-[#ff6b35] relative inline-block pb-1 mb-2">
                  Connect &amp; Follow Us
                  <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-linear-to-r from-[#ff66c4] to-transparent rounded-full"></span>
                </h3>

                <div className="flex flex-col gap-1.5 pb-2">
                  <a
                    href="mailto:techfusion@hietgroup.org"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-cyan-300 transition-colors"
                  >
                    <Mail size={13} className="text-cyan-400 shrink-0" />
                    <span>techfusion@hietgroup.org</span>
                  </a>
                  <a
                    href="https://wa.me/918802323375"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-emerald-300 transition-colors"
                  >
                    <Phone size={13} className="text-emerald-400 shrink-0" />
                    <span>+91 8802323375 (WhatsApp)</span>
                  </a>
                </div>

                <div className="flex gap-2.5">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target={social.name === 'Email' ? undefined : '_blank'}
                      rel={social.name === 'Email' ? undefined : 'noopener noreferrer'}
                      aria-label={social.name}
                      className="group bg-[#1a2642]/40 backdrop-blur-sm p-2.5 rounded-lg border border-gray-800/50 hover:border-[#ff6b35]/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#ff6b35]/20"
                    >
                      <social.icon
                        size={18}
                        className="text-gray-300 group-hover:text-[#ff6b35] transition-colors duration-300"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Fest Info Card */}
            <div className="md:col-span-2 lg:col-span-1">
              <div className="relative bg-linear-to-br from-[#ff6b35]/15 via-[#b466ff]/10 to-[#ff66c4]/15 backdrop-blur-md p-4 rounded-xl border border-[#ff6b35]/30 hover:border-[#ff6b35]/60 transition-all duration-500 group hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#ff6b35]/20">
                <div className="absolute inset-0 bg-linear-to-r from-[#ff6b35]/0 via-[#ff6b35]/20 to-[#ff6b35]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer rounded-xl pointer-events-none"></div>

                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl font-black mb-2">
                    <span className="text-[#ff6b35]">CROSSROADS</span>
                    <span className="text-yellow-400">@</span>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-[#b466ff] to-[#ff66c4]">
                      2027
                    </span>
                  </h2>
                  <div className="h-0.5 w-16 bg-linear-to-r from-[#ff6b35] via-[#b466ff] to-[#ff66c4] rounded-full mb-3"></div>

                  <div className="space-y-2">
                    <div className="bg-[#0f1729]/50 p-2.5 rounded-lg border border-[#ff6b35]/20 hover:border-[#ff6b35]/40 transition-colors">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Award className="text-[#ff6b35] w-3.5 h-3.5" />
                        <p className="text-[10px] text-gray-400 font-semibold">EVENT</p>
                      </div>
                      <p className="text-xs font-bold text-transparent bg-clip-text bg-linear-to-r from-[#ff6b35] to-[#ff66c4]">
                        Crossroad Technical Fest
                      </p>
                    </div>

                    <div className="bg-[#0f1729]/50 p-2.5 rounded-lg border border-[#b466ff]/20 hover:border-[#b466ff]/40 transition-colors">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <MapPin className="text-[#b466ff] w-3.5 h-3.5" />
                        <p className="text-[10px] text-gray-400 font-semibold">CAMPUS</p>
                      </div>
                      <p className="text-xs font-bold text-transparent bg-clip-text bg-linear-to-r from-[#b466ff] to-[#ff66c4]">
                        HI-TECH Institute of Engineering and Technology
                      </p>
                    </div>

                    <div className="bg-[#0f1729]/50 p-2.5 rounded-lg border border-[#ff66c4]/20 hover:border-[#ff66c4]/40 transition-colors">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Calendar className="text-[#ff66c4] w-3.5 h-3.5" />
                        <p className="text-[10px] text-gray-400 font-semibold">EVENT DATE</p>
                      </div>
                      <p className="text-xs font-bold text-transparent bg-clip-text bg-linear-to-r from-[#ff66c4] to-[#ff6b35]">
                        05 Feb &amp; 06 Feb 2027
                      </p>
                    </div>

                    <div className="bg-[#0f1729]/50 p-2.5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Clock className="text-cyan-400 w-3.5 h-3.5" />
                        <p className="text-[10px] text-gray-400 font-semibold">REGISTRATION</p>
                      </div>
                      <p className="text-xs font-bold text-cyan-300">
                        10 Jan – 31 Jan 2027
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-[#ff6b35]/50 to-transparent mb-4"></div>

          <div className="space-y-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-lg md:text-xl font-black mb-2">
                <span className="text-[#ff6b35]">CROSSROADS</span>
                <span className="text-yellow-400">@</span>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#b466ff] to-[#ff66c4]">
                  2027
                </span>
              </h2>
              <div className="h-px w-full max-w-md mx-auto bg-linear-to-r from-transparent via-[#ff6b35] to-transparent mb-3"></div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                Crossroad is the technical fest of HI-TECH Institute of Engineering and Technology
                where creativity and innovation meet energy and excitement. With over 20+ years of
                excellence, this event promises inspiration and growth.
              </p>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-[#ff6b35]/30 to-transparent"></div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="space-y-0.5 text-xs text-gray-400">
                <p>© 2027 Crossroad Technical Fest. All rights reserved.</p>
                <p className="text-gray-500">
                  Created by{' '}
                  <a
                    href="https://linkedin.com/company/hiet-techfusion"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-transparent bg-clip-text bg-linear-to-r from-[#ff6b35] to-[#ff66c4] font-bold hover:underline"
                  >
                    Team Tech Fusion
                  </a>
                </p>
              </div>

              <button
                onClick={scrollToTop}
                className="group bg-linear-to-r from-[#00d4ff] to-[#0099cc] hover:from-[#00e5ff] hover:to-[#00bbee] p-2 rounded-full shadow-lg hover:shadow-[#00d4ff]/50 transition-all duration-300 hover:scale-110 hover:-translate-y-1 cursor-pointer"
                aria-label="Scroll to top"
              >
                <ArrowUp size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
