import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Sparkles, Terminal } from "lucide-react";
import { motion as Motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Events", path: "/events" },
  { name: "Schedule", path: "/schedule" },
  { name: "Contact", path: "/contact" },
];

const useMagnetic = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 18, stiffness: 220 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouse = (e) => {
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

const AnimatedNavLink = ({ item, isActive }) => {
  const { xSpring, ySpring, handleMouse, reset } = useMagnetic();

  return (
    <li className="relative">
      <NavLink
        to={item.path}
        className="relative block group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 rounded-xl"
      >
        <Motion.div
          style={{ x: xSpring, y: ySpring }}
          onMouseMove={handleMouse}
          onMouseLeave={reset}
          className="relative px-3.5 py-2 lg:px-4 rounded-xl transition-colors duration-300"
        >
          {isActive && (
            <Motion.div
              layoutId="navActivePill"
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/15 via-sky-500/12 to-indigo-500/15 border border-cyan-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
            />
          )}

          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(34, 211, 238, 0.14), transparent 72%)",
            }}
          />

          <span
            className={`relative z-10 text-sm font-semibold tracking-wide transition-colors duration-300 ${
              isActive
                ? "text-cyan-300"
                : "text-slate-300 group-hover:text-white"
            }`}
          >
            {item.name}
          </span>

          {isActive && (
            <Motion.span
              layoutId="navActiveBeam"
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1/2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.9)]"
            />
          )}
        </Motion.div>
      </NavLink>
    </li>
  );
};

const BrandEmblem = () => {
  return (
    <NavLink to="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none">
      <div className="relative w-10 h-10 rounded-xl p-[1.5px] bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-500 shadow-[0_0_20px_rgba(34,211,238,0.22)] group-hover:shadow-[0_0_28px_rgba(34,211,238,0.45)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
        <div className="w-full h-full bg-[#050a18] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.22),transparent_65%)]" />
          <span className="relative font-mono font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-white to-sky-400 text-sm tracking-tight">
            CR
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-display text-base sm:text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors duration-300">
            CROSSROADS
          </span>
          <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-[10px] font-mono text-cyan-300 tracking-wider">
            <Terminal size={10} />
            <span>FEB 05–06</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-xs font-mono font-semibold text-cyan-400">
            2026
          </span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline-block">
            HIET Tech Fest
          </span>
        </div>
      </div>
    </NavLink>
  );
};

export default function Navbar() {
  const [openPath, setOpenPath] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const open = openPath === location.pathname;
  const setOpen = (val) => {
    const next = typeof val === "function" ? val(open) : val;
    setOpenPath(next ? location.pathname : null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpenPath(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <Motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto w-full px-3 sm:px-6 lg:px-8 pt-2.5"
      >
        <div
          className={`relative max-w-7xl mx-auto rounded-2xl backdrop-blur-2xl border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${
            scrolled
              ? "bg-[#050a18]/92 border-cyan-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_50px_rgba(2,6,23,0.75)]"
              : "bg-[#070d1e]/78 border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_35px_rgba(2,6,23,0.45)]"
          }`}
        >
          {/* Top Hairline Sweeping Telemetry Accent */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />
          <div
            className={`absolute top-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-sky-300 to-transparent pointer-events-none transition-opacity duration-500 ${
              scrolled ? "opacity-90 animate-beam-pan" : "opacity-40 animate-beam-pan"
            }`}
          />

          <div className="relative flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px]">
            <BrandEmblem />

            {/* Desktop Navigation Links & Nested Register CTA */}
            <div className="hidden md:flex items-center gap-3 lg:gap-5">
              <ul className="flex items-center gap-1 lg:gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-1">
                {navItems.map((item) => (
                  <AnimatedNavLink
                    key={item.name}
                    item={item}
                    isActive={location.pathname === item.path}
                  />
                ))}
              </ul>

              <NavLink
                to="/event-registration"
                className="group relative inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_8px_24px_rgba(34,211,238,0.22)] hover:shadow-[0_12px_30px_rgba(34,211,238,0.4)] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                <Sparkles size={13} className="text-slate-950 shrink-0" />
                <span>Register</span>
                <span className="w-7 h-7 rounded-full bg-slate-950/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105 transition-transform duration-300">
                  <ArrowUpRight size={14} className="text-slate-950" />
                </span>
              </NavLink>
            </div>

            {/* Morphing Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              className="md:hidden relative w-11 h-11 rounded-xl bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/35 flex flex-col items-center justify-center gap-1.5 transition-colors duration-300 cursor-pointer"
            >
              <span
                className={`block w-5 h-0.5 bg-cyan-300 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "rotate-45 translate-y-[4px]" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-cyan-300 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "-rotate-45 -translate-y-[4px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </Motion.header>

      {/* Mobile Glass Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="pointer-events-auto fixed inset-0 z-[998] bg-[#02050d]/80 backdrop-blur-md"
            />

            <Motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="pointer-events-auto fixed top-0 right-0 z-[999] min-h-[100dvh] w-[82vw] max-w-sm bg-[#060b18]/95 backdrop-blur-2xl p-6 flex flex-col justify-between border-l border-cyan-500/20 shadow-2xl"
            >
              <div>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center font-mono font-bold text-slate-950 text-xs">
                      CR
                    </div>
                    <div>
                      <h2 className="font-display text-base font-bold text-white leading-none">
                        CROSSROADS 2026
                      </h2>
                      <span className="text-[10px] font-mono text-cyan-400">
                        HIET GHAZIABAD
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 text-cyan-300 flex items-center justify-center cursor-pointer hover:bg-cyan-500/15 transition-colors"
                  >
                    <span className="relative w-4 h-4 flex items-center justify-center">
                      <span className="absolute w-4 h-0.5 bg-cyan-300 rotate-45 rounded-full" />
                      <span className="absolute w-4 h-0.5 bg-cyan-300 -rotate-45 rounded-full" />
                    </span>
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item, idx) => (
                    <Motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.05 + idx * 0.05,
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            isActive
                              ? "bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-300 border border-cyan-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                              : "text-slate-300 hover:text-white hover:bg-white/[0.04] border border-transparent"
                          }`
                        }
                      >
                        <span>{item.name}</span>
                        <ArrowUpRight size={15} className="text-slate-500" />
                      </NavLink>
                    </Motion.div>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-3">
                <NavLink
                  to="/event-registration"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 text-slate-950 font-bold text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/25"
                >
                  <Sparkles size={16} />
                  <span>Register Now</span>
                </NavLink>
                <div className="text-center font-mono text-[11px] text-slate-400 space-y-0.5">
                  <p className="text-cyan-300 font-semibold">Event: 05 &amp; 06 Feb 2027</p>
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
