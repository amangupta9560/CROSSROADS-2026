import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Compass, Sparkles } from 'lucide-react';
import {
  AnimatePresence,
  motion as Motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import '../Components/home/lostCivilization.css';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Events', path: '/events' },
  { name: 'Schedule', path: '/schedule' },
  { name: 'Contact', path: '/contact' },
];

const useMagnetic = (disabled) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 18, stiffness: 220 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouse = (e) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.22);
    y.set((e.clientY - centerY) * 0.22);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return { xSpring, ySpring, handleMouse, reset };
};

const AnimatedNavLink = ({ item, isActive, reducedMotion }) => {
  const { xSpring, ySpring, handleMouse, reset } = useMagnetic(reducedMotion);

  return (
    <li className="relative">
      <NavLink
        to={item.path}
        className="relative block group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C574]/80 rounded-lg"
      >
        <Motion.div
          style={reducedMotion ? undefined : { x: xSpring, y: ySpring }}
          onMouseMove={handleMouse}
          onMouseLeave={reset}
          className="relative px-3.5 py-2 lg:px-4 rounded-lg transition-colors duration-300"
        >
          {isActive && (
            <Motion.div
              layoutId="navActivePill"
              transition={{ type: 'spring', stiffness: 360, damping: 32 }}
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#C69B43]/22 via-[#E8C574]/16 to-[#B86B35]/20 border border-[#E8C574]/50 shadow-[inset_0_1px_0_rgba(255,240,194,0.22)]"
            />
          )}

          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(232, 197, 116, 0.16), transparent 72%)',
            }}
          />

          <span
            className={`relative z-10 lc-font-heading text-xs lg:text-[13px] font-bold uppercase tracking-[0.12em] transition-colors duration-300 ${
              isActive
                ? 'text-[#E8C574]'
                : 'text-[#E8DFC8]/80 group-hover:text-[#E8C574]'
            }`}
          >
            {item.name}
          </span>

          {isActive && (
            <Motion.span
              layoutId="navActiveBeam"
              transition={{ type: 'spring', stiffness: 360, damping: 32 }}
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-2/3 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#E8C574] to-transparent shadow-[0_0_10px_rgba(232,197,116,0.9)]"
            />
          )}
        </Motion.div>
      </NavLink>
    </li>
  );
};

const BrandEmblem = () => (
  <NavLink
    to="/"
    className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C574] rounded-lg pr-1"
  >
    <div className="relative w-10 h-10 rounded-lg p-[1.5px] bg-gradient-to-br from-[#F3D98C] via-[#C69B43] to-[#8C5A21] shadow-[0_0_18px_rgba(198,155,67,0.28)] group-hover:shadow-[0_0_26px_rgba(232,197,116,0.5)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
      <div className="w-full h-full bg-[#09120D] rounded-[7px] flex items-center justify-center relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(232,197,116,0.22),transparent_65%)]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-1.5 border border-[#C69B43]/35 rotate-45 group-hover:rotate-90 transition-transform duration-500"
        />
        <span className="relative lc-font-display font-black text-xs sm:text-sm tracking-tight lc-gold-text">
          CR
        </span>
      </div>
    </div>

    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="lc-font-display text-base sm:text-lg md:text-xl font-black tracking-wide text-[#E8DFC8] group-hover:text-[#E8C574] transition-colors duration-300">
          CROSSROADS
        </span>
        <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[#182B20]/90 border border-[#C69B43]/40 text-[10px] font-mono text-[#E8C574] tracking-wider">
          <Compass size={10} className="text-[#C69B43]" />
          <span>FEB 05–06</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="text-[10px] sm:text-xs font-mono font-bold text-[#E8C574]">
          2027
        </span>
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        <span className="text-[10px] font-mono text-[#E8DFC8]/65 uppercase tracking-wider hidden sm:inline-block">
          HIET Tech Fest
        </span>
      </div>
    </div>
  </NavLink>
);

export default function Navbar() {
  const [openPath, setOpenPath] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const scrollScaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 26,
    restDelta: 0.001,
  });

  const open = openPath === location.pathname;
  const setOpen = (val) => {
    const next = typeof val === 'function' ? val(open) : val;
    setOpenPath(next ? location.pathname : null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpenPath(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow || '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const isRegistrationPage = location.pathname === '/event-registration';

  return (
    <>
      <Motion.header
        initial={prefersReduced ? false : { y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto w-full px-3 sm:px-6 lg:px-8 pt-2.5"
      >
        <div
          className={`relative max-w-7xl mx-auto rounded-xl backdrop-blur-xl border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${
            scrolled
              ? 'bg-[#080D0B]/94 border-[#C69B43]/50 shadow-[inset_0_1px_0_rgba(232,197,116,0.18),0_20px_55px_rgba(4,7,5,0.85)]'
              : 'bg-[#0C1611]/82 border-[#C69B43]/30 shadow-[inset_0_1px_0_rgba(232,197,116,0.1),0_14px_40px_rgba(4,7,5,0.58)]'
          }`}
        >
          {/* Top Engraved Antique Gold Filigree Line */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E8C574]/65 to-transparent pointer-events-none"
          />

          {/* Subtle Temple Corner Accents */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-[#C69B43]/55"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-[#C69B43]/55"
          />

          <div className="relative flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px]">
            <BrandEmblem />

            {/* Desktop Navigation Links & Expedition Register CTA */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <ul className="flex items-center gap-1 lg:gap-1.5 bg-[#080D0B]/70 border border-[#C69B43]/22 rounded-xl p-1">
                {navItems.map((item) => (
                  <AnimatedNavLink
                    key={item.name}
                    item={item}
                    isActive={location.pathname === item.path}
                    reducedMotion={!!prefersReduced}
                  />
                ))}
              </ul>

              <NavLink
                to="/event-registration"
                className={`lc-gold-btn lc-font-heading group relative inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full font-extrabold text-xs uppercase tracking-[0.14em] transition-all duration-300 ${
                  isRegistrationPage
                    ? 'ring-2 ring-[#FFF3C4]/70 shadow-[0_0_26px_rgba(232,197,116,0.45)]'
                    : 'shadow-[0_8px_24px_rgba(198,155,67,0.28)]'
                }`}
              >
                <Sparkles size={13} className="shrink-0" />
                <span>Register</span>
                <span className="w-7 h-7 rounded-full bg-[#080D0B]/18 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105 transition-transform duration-300">
                  <ArrowUpRight size={14} />
                </span>
              </NavLink>
            </div>

            {/* Morphing Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={open}
              className="md:hidden relative w-11 h-11 rounded-lg bg-[#101D16]/90 hover:bg-[#182B20] border border-[#C69B43]/40 hover:border-[#E8C574] flex flex-col items-center justify-center gap-1.5 transition-colors duration-300 cursor-pointer"
            >
              <span
                className={`block w-5 h-0.5 bg-[#E8C574] rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? 'rotate-45 translate-y-[4px]' : ''
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-[#E8C574] rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? '-rotate-45 -translate-y-[4px]' : ''
                }`}
              />
            </button>
          </div>

          {/* Bottom Scroll Progress Golden Hairline */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C69B43]/15 pointer-events-none"
          >
            <Motion.div
              className="h-full origin-left bg-gradient-to-r from-[#B86B35] via-[#E8C574] to-[#C69B43]"
              style={{ scaleX: prefersReduced ? 1 : scrollScaleX }}
            />
          </div>
        </div>
      </Motion.header>

      {/* Mobile Temple Tablet Slide Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="pointer-events-auto fixed inset-0 z-[998] bg-[#040705]/85 backdrop-blur-md"
            />

            <Motion.aside
              aria-label="Mobile Navigation Drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="pointer-events-auto fixed top-0 right-0 z-[999] min-h-[100dvh] w-[82vw] max-w-sm bg-[#080D0B]/97 backdrop-blur-2xl p-6 flex flex-col justify-between border-l border-[#C69B43]/40 shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden"
            >
              {/* Subtle carved stone texture backdrop inside drawer */}
              <img
                src="/assets/lost-civilization/stone-texture.webp"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-12"
              />

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#C69B43]/25">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E8C574] to-[#9E6327] flex items-center justify-center lc-font-display font-black text-[#080D0B] text-xs shadow-lg">
                      CR
                    </div>
                    <div>
                      <h2 className="lc-font-display text-sm font-black text-[#E8DFC8] leading-none">
                        CROSSROADS 2027
                      </h2>
                      <span className="text-[10px] font-mono text-[#E8C574] tracking-wider">
                        HIET GHAZIABAD
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="w-10 h-10 rounded-lg bg-[#101D16] border border-[#C69B43]/40 text-[#E8C574] flex items-center justify-center cursor-pointer hover:bg-[#182B20] hover:border-[#E8C574] transition-colors"
                  >
                    <span className="relative w-4 h-4 flex items-center justify-center">
                      <span className="absolute w-4 h-0.5 bg-[#E8C574] rotate-45 rounded-full" />
                      <span className="absolute w-4 h-0.5 bg-[#E8C574] -rotate-45 rounded-full" />
                    </span>
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item, idx) => (
                    <Motion.div
                      key={item.name}
                      initial={prefersReduced ? false : { opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.04 + idx * 0.05,
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-4 py-3.5 rounded-lg lc-font-heading text-xs uppercase tracking-[0.16em] font-bold transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-[#C69B43]/22 to-[#B86B35]/15 text-[#E8C574] border border-[#E8C574]/50 shadow-[inset_0_1px_0_rgba(255,240,194,0.18)]'
                              : 'text-[#E8DFC8]/85 hover:text-[#E8C574] hover:bg-[#101D16]/80 border border-transparent'
                          }`
                        }
                      >
                        <span>{item.name}</span>
                        <ArrowUpRight size={15} className="text-[#C69B43]" />
                      </NavLink>
                    </Motion.div>
                  ))}
                </nav>
              </div>

              <div className="relative z-10 pt-6 border-t border-[#C69B43]/25 space-y-3">
                <NavLink
                  to="/event-registration"
                  onClick={() => setOpen(false)}
                  className="lc-gold-btn lc-font-heading flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-sm font-extrabold text-xs uppercase tracking-[0.16em] shadow-lg"
                >
                  <Sparkles size={15} />
                  <span>Register Now</span>
                </NavLink>
                <div className="text-center font-mono text-[11px] text-[#E8DFC8]/70 space-y-0.5">
                  <p className="text-[#E8C574] font-semibold">
                    Event: 05 &amp; 06 Feb 2027
                  </p>
                  <p>Reg: Jan 10 – Jan 31, 2027</p>
                </div>
              </div>
            </Motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
