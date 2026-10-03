import React from 'react';
import { Phone, Linkedin, Youtube, Instagram, Mail, ArrowUp, MapPin, Calendar, Award } from 'lucide-react';

const Footer = () => {
  const studentCoordinators = [
    { name: 'Sachchidanand Yadav', phone: '+91 9450885320' },
    { name: 'Aman Gupta', phone: '+91 9560472926' },
    { name: 'Sahil Verma', phone: '+91 9999663998' },
    { name: 'Aman Singh Bisht ', phone: '+91 8178782584' },
    { name: 'Arman Parwani', phone: '+91 8510898787' },
    {name: 'Swapnil kumar', phone: '+91 6201644233' }
  ];

  const events = [
    "Code Puzzle",
  "Project Exhibition",
  "Robo Race",
  "Technical Poster",
  "Cultural Events",
  "Rangoli Competition",
  "Food Without Fire",
  "Nukkad Natak",
  "Singing",
  "Dance Competition",
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/company/hi-tech-institute-of-engineering-of-technology/' },
    { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@hietgroup' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/hitech_college_/' },
    { name: 'Email', icon: Mail, url: 'mailto:hietcrossroads@gmail.com' }
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

      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(#ff6b35 1px, transparent 1px), linear-gradient(90deg, #ff6b35 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Institutional Partners / Host & Co-powered Logos (Above Footer) */}
          <div className="border-b border-slate-800/80 pb-8 mb-8">
            <div className="text-center mb-5">
              <span className="text-[11px] uppercase tracking-widest font-mono text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 inline-block mb-1.5">
                Organized & Powered By
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Host Institution & Academic Partner
              </h3>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 max-w-3xl mx-auto">
              {/* HIET Logo Card */}
              <a
                href="https://hiet.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-850 transition-all duration-300 shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5"
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
                className="group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-850 transition-all duration-300 shadow-lg hover:shadow-pink-500/10 hover:-translate-y-0.5"
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-6">
            
            <div className="space-y-3">
              <h3 className="text-base md:text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-[#ff6b35] to-[#ff8c42] relative inline-block pb-1">
                Student Coordinators
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-linear-to-r from-[#ff6b35] to-transparent rounded-full"></span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {studentCoordinators.map((coordinator, index) => (
                  <div 
                    key={index}
                    className="group bg-[#1a2642]/40 backdrop-blur-sm p-2.5 rounded-lg border border-gray-800/50 hover:border-[#ff6b35]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#ff6b35]/10"
                  >
                    <p className="font-semibold text-xs text-gray-100 mb-0.5 group-hover:text-[#ff6b35] transition-colors">
                      {coordinator.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 group-hover:text-[#ff66c4] transition-colors">
                      <Phone size={10} />
                      <a href={`tel:${coordinator.phone}`} className="hover:underline">
                        {coordinator.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-base md:text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-[#b466ff] to-[#ff66c4] relative inline-block pb-1 mb-3">
                  Events
                  <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-linear-to-r from-[#b466ff] to-transparent rounded-full"></span>
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
                  {events.map((event, index) => (
                    <div 
                      key={index}
                      className="group flex items-center gap-2 text-xs text-gray-300 hover:text-[#ff6b35] transition-all duration-300 cursor-pointer py-1"
                    >
                      <span className="w-1 h-1 bg-linear-to-r from-[#ff6b35] to-[#ff66c4] rounded-full group-hover:scale-150 transition-all duration-300"></span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{event}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-[#ff66c4] to-[#ff6b35] relative inline-block pb-1 mb-3">
                  Follow Us
                  <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-linear-to-r from-[#ff66c4] to-transparent rounded-full"></span>
                </h3>
                <div className="flex gap-2.5">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
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

            <div className="md:col-span-2 lg:col-span-1">
              <div className="relative bg-linear-to-br from-[#ff6b35]/15 via-[#b466ff]/10 to-[#ff66c4]/15 backdrop-blur-md p-4 rounded-xl border border-[#ff6b35]/30 hover:border-[#ff6b35]/60 transition-all duration-500 group hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#ff6b35]/20">
                <div className="absolute inset-0 bg-linear-to-r from-[#ff6b35]/0 via-[#ff6b35]/20 to-[#ff6b35]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer rounded-xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl font-black mb-2">
                    <span className="text-[#ff6b35]">CROSSROADS</span>
                    <span className="text-yellow-400">@</span>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-[#b466ff] to-[#ff66c4]">2026</span>
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
                        <p className="text-[10px] text-gray-400 font-semibold">DATE</p>
                      </div>
                      <p className="text-xs font-bold text-transparent bg-clip-text bg-linear-to-r from-[#ff66c4] to-[#ff6b35]">
                        November 28-29, 2026
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
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#b466ff] to-[#ff66c4]">2026</span>
              </h2>
              <div className="h-px w-full max-w-md mx-auto bg-linear-to-r from-transparent via-[#ff6b35] to-transparent mb-3"></div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                Crossroad is the technical fest of HI-TECH Institute of Engineering and Technology where creativity and innovation meet energy and excitement. With over 20+ years of excellence, this event promises inspiration and growth.
              </p>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-[#ff6b35]/30 to-transparent"></div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="space-y-0.5 text-xs text-gray-400">
                <p>© 2026 Crossroad Technical Fest. All rights reserved.</p>
                <p className="text-gray-500">
                  Created by{' '}
                  <a 
                    href="#" 
                    className="text-transparent bg-clip-text bg-linear-to-r from-[#ff6b35] to-[#ff66c4] font-bold hover:underline"
                  >
                    Code Veda
                  </a>
                </p>
              </div>

              <button
                onClick={scrollToTop}
                className="group bg-linear-to-r from-[#00d4ff] to-[#0099cc] hover:from-[#00e5ff] hover:to-[#00bbee] p-2 rounded-full shadow-lg hover:shadow-[#00d4ff]/50 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
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
