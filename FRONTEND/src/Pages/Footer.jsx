import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
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
  Compass,
} from 'lucide-react';
import '../Components/home/lostCivilization.css';
import { CornerFiligree, TempleDivider } from '../Components/home/OrnamentDivider.jsx';

const Footer = () => {
  const events = [
    { label: 'Code Puzzle', slug: 'code-puzzle' },
    { label: 'Project Exhibition', slug: 'project-exhibition' },
    { label: 'Robo Race', slug: 'robo-race' },
    { label: 'Technical Poster', slug: 'technical-poster' },
    { label: 'Dance Competition', slug: 'dance-competition' },
    { label: 'Rock Band', slug: 'rock-band' },
    { label: 'Rangoli Competition', slug: 'rangoli-competition' },
    { label: 'Food Without Fire', slug: 'food-without-fire' },
    { label: 'Short Film Making', slug: 'short-film-making' },
    { label: 'Treasure Hunt', slug: 'treasure-hunt' },
    { label: 'Closing Ceremony', slug: 'closing-ceremony' },
  ];

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Events', path: '/events' },
    { label: 'Schedule', path: '/schedule' },
    { label: 'Team', path: '/team' },
    { label: 'Register', path: '/register' },
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

  const partners = [
    {
      href: 'https://hiet.org/',
      logo: '/hiet.png',
      alt: 'HI-TECH Institute of Engineering & Technology',
      eyebrow: 'Host Institution',
      title: 'HIET Ghaziabad',
      subtitle: 'Engineering & Technology',
    },
    {
      href: 'https://sunstone.in/',
      logo: '/sunstone.jpg',
      alt: 'Sunstone',
      eyebrow: 'Academic Partner',
      title: 'Sunstone',
      subtitle: 'Higher Education & Careers',
    },
    {
      href: 'https://linkedin.com/company/hiet-techfusion',
      logo: '/techfusion.png',
      alt: 'Team Tech Fusion',
      eyebrow: 'Technical Club',
      title: 'Team Tech Fusion',
      subtitle: 'Technical Society & Fest Organizers',
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#080D0B] text-[#E8DFC8] overflow-hidden border-t border-[#C69B43]/30">
      {/* Subtle Weathered Temple Stone Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/lost-civilization/stone-texture.webp')",
          backgroundSize: '380px 380px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#0C1510]/90 via-[#080D0B]/88 to-[#060908] pointer-events-none"
      />

      {/* Warm Overhead Torchlight Glow */}
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[42rem] h-[18rem] bg-[radial-gradient(ellipse_at_top,rgba(198,155,67,0.16),transparent_70%)] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#C69B43]/80 to-transparent pointer-events-none"
      />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 pb-16 sm:pb-14 xl:pb-10">
        <div className="max-w-7xl mx-auto">
          {/* Institutional Partners / Host & Co-powered Logos */}
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-[#C69B43]/20 pb-9 mb-9"
          >
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#E8C574] font-semibold px-3.5 py-1 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/35 mb-2.5">
                <Compass size={12} className="text-[#C69B43]" />
                <span>Organized &amp; Powered By</span>
              </span>
              <h3 className="lc-font-heading text-base sm:text-xl font-bold text-[#E8DFC8] tracking-wide">
                Host Institution, Academic Partner &amp; Technical Club
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {partners.map((partner) => (
                <a
                  key={partner.title}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-3.5 px-4 sm:px-5 py-3.5 rounded-lg bg-[#101D16]/88 border border-[#C69B43]/28 hover:border-[#E8C574]/75 transition-all duration-300 shadow-[0_14px_34px_-14px_rgba(0,0,0,0.85)] hover:-translate-y-0.5"
                >
                  <div className="bg-[#F6F1E4] p-1.5 sm:p-2 rounded-md flex items-center justify-center shadow-sm shrink-0">
                    <img
                      src={partner.logo}
                      alt={partner.alt}
                      loading="lazy"
                      className="h-9 sm:h-10 w-auto object-contain max-w-[115px]"
                    />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-[#C69B43] font-bold block">
                      {partner.eyebrow}
                    </span>
                    <span className="lc-font-heading text-sm font-bold text-[#E8DFC8] group-hover:text-[#F3DDA0] transition-colors block truncate">
                      {partner.title}
                    </span>
                    <span className="text-[11px] text-[#E8DFC8]/65 block truncate">
                      {partner.subtitle}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </Motion.div>

          {/* Main 3-Column Ancient Expedition Footer Grid */}
          <Motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-8"
          >
            {/* Column 1: Events */}
            <div className="space-y-3.5">
              <h3 className="lc-font-heading text-base md:text-lg font-bold lc-gold-text relative inline-block pb-1.5 tracking-wider uppercase">
                Events
                <span className="absolute bottom-0 left-0 w-14 h-[1.5px] bg-gradient-to-r from-[#C69B43] to-transparent" />
              </h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {events.map((event) => (
                  <Link
                    key={event.slug}
                    to={`/events/${event.slug}`}
                    className="group flex items-center gap-2 text-xs text-[#E8DFC8]/80 hover:text-[#F3DDA0] transition-colors duration-200 py-1"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#C69B43]/70 group-hover:bg-[#E8C574] group-hover:scale-125 transition-all duration-200 shrink-0" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200 truncate">
                      {event.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links, Connect & Follow Us */}
            <div className="space-y-6">
              <div>
                <h3 className="lc-font-heading text-base md:text-lg font-bold lc-gold-text relative inline-block pb-1.5 mb-3 tracking-wider uppercase">
                  Quick Links
                  <span className="absolute bottom-0 left-0 w-14 h-[1.5px] bg-gradient-to-r from-[#C69B43] to-transparent" />
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {quickLinks.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="text-xs font-medium text-[#E8DFC8]/80 hover:text-[#E8C574] transition-colors py-1"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#E8DFC8]/80">
                <h3 className="lc-font-heading text-base md:text-lg font-bold lc-gold-text relative inline-block pb-1.5 mb-1 tracking-wider uppercase">
                  Connect &amp; Follow Us
                  <span className="absolute bottom-0 left-0 w-14 h-[1.5px] bg-gradient-to-r from-[#C69B43] to-transparent" />
                </h3>

                <div className="flex flex-col gap-2 pb-2">
                  <a
                    href="mailto:techfusion@hietgroup.org"
                    className="inline-flex items-center gap-2 text-[#E8DFC8]/85 hover:text-[#F3DDA0] transition-colors w-fit"
                  >
                    <Mail size={14} className="text-[#C69B43] shrink-0" />
                    <span>techfusion@hietgroup.org</span>
                  </a>
                  <a
                    href="https://wa.me/918802323375"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#E8DFC8]/85 hover:text-[#F3DDA0] transition-colors w-fit"
                  >
                    <Phone size={14} className="text-[#C69B43] shrink-0" />
                    <span>+91 8802323375 (WhatsApp)</span>
                  </a>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {socialLinks.map((social) => {
                    const SocialIcon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target={social.name === 'Email' ? undefined : '_blank'}
                        rel={social.name === 'Email' ? undefined : 'noopener noreferrer'}
                        aria-label={social.name}
                        className="group bg-[#101D16]/90 p-2.5 rounded-sm border border-[#C69B43]/30 hover:border-[#E8C574] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(198,155,67,0.4)] cursor-pointer"
                      >
                        <SocialIcon
                          size={17}
                          className="text-[#E8DFC8]/80 group-hover:text-[#E8C574] transition-colors duration-300"
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Column 3: Fest Info Tablet */}
            <div className="md:col-span-2 lg:col-span-1">
              <div className="relative lc-stone-surface lc-carved-border p-5 rounded-lg overflow-hidden group">
                <CornerFiligree className="absolute top-1.5 left-1.5 opacity-70" />
                <CornerFiligree className="absolute bottom-1.5 right-1.5 rotate-180 opacity-70" />

                <div className="relative z-10">
                  <h2 className="lc-font-display text-xl md:text-2xl font-black tracking-wide mb-2">
                    <span className="lc-gold-text">CROSSROADS</span>
                    <span className="text-[#B86B35] mx-0.5">@</span>
                    <span className="text-[#E8DFC8]">2027</span>
                  </h2>
                  <div className="h-[1.5px] w-20 bg-gradient-to-r from-[#C69B43] to-transparent mb-4" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                    <div className="bg-[#080D0B]/85 p-2.5 rounded-sm border border-[#C69B43]/25 hover:border-[#C69B43]/55 transition-colors">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Award className="text-[#C69B43] w-3.5 h-3.5 shrink-0" />
                        <p className="text-[10px] tracking-[0.16em] text-[#C69B43] font-bold uppercase">
                          EVENT
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-[#E8DFC8]">
                        Crossroad Technical Fest
                      </p>
                    </div>

                    <div className="bg-[#080D0B]/85 p-2.5 rounded-sm border border-[#C69B43]/25 hover:border-[#C69B43]/55 transition-colors">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <MapPin className="text-[#B86B35] w-3.5 h-3.5 shrink-0" />
                        <p className="text-[10px] tracking-[0.16em] text-[#C69B43] font-bold uppercase">
                          CAMPUS
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-[#E8DFC8]">
                        HI-TECH Institute of Engineering and Technology
                      </p>
                    </div>

                    <div className="bg-[#080D0B]/85 p-2.5 rounded-sm border border-[#C69B43]/25 hover:border-[#C69B43]/55 transition-colors">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Calendar className="text-[#C69B43] w-3.5 h-3.5 shrink-0" />
                        <p className="text-[10px] tracking-[0.16em] text-[#C69B43] font-bold uppercase">
                          EVENT DATE
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-[#E8C574]">
                        05 Feb &amp; 06 Feb 2027
                      </p>
                    </div>

                    <div className="bg-[#080D0B]/85 p-2.5 rounded-sm border border-[#C69B43]/25 hover:border-[#C69B43]/55 transition-colors">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Clock className="text-[#C69B43] w-3.5 h-3.5 shrink-0" />
                        <p className="text-[10px] tracking-[0.16em] text-[#C69B43] font-bold uppercase">
                          REGISTRATION
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-[#E8C574]">
                        10 Jan – 31 Jan 2027
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Motion.div>

          <TempleDivider className="my-6" />

          {/* Bottom Colophon & Return-to-Summit Medallion */}
          <div className="space-y-5">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="lc-font-display text-lg md:text-xl font-black tracking-wide mb-2">
                <span className="lc-gold-text">CROSSROADS</span>
                <span className="text-[#B86B35] mx-0.5">@</span>
                <span className="text-[#E8DFC8]">2027</span>
              </h2>
              <p className="text-[#E8DFC8]/75 text-xs md:text-sm leading-relaxed">
                Crossroad is the technical fest of HI-TECH Institute of Engineering and Technology
                where creativity and innovation meet energy and excitement. With over 20+ years of
                excellence, this event promises inspiration and growth.
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-[#C69B43]/30 to-transparent" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="space-y-1 text-xs text-[#E8DFC8]/65">
                <p>© 2027 Crossroad Technical Fest. All rights reserved.</p>
                <p className="text-[#E8DFC8]/55">
                  Created by{' '}
                  <a
                    href="https://linkedin.com/company/hiet-techfusion"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E8C574] font-semibold hover:text-[#FFF0BF] hover:underline transition-colors"
                  >
                    Team Tech Fusion
                  </a>
                </p>
              </div>

              <button
                type="button"
                onClick={scrollToTop}
                className="lc-gold-btn lc-font-heading inline-flex items-center gap-2 px-4 py-2 rounded-sm text-[11px] font-extrabold uppercase tracking-[0.16em] cursor-pointer"
                aria-label="Scroll to top"
              >
                <span>Top</span>
                <ArrowUp size={14} className="text-[#080D0B]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
