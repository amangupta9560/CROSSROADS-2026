import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Events", path: "/events" },
  { name: "Schedule", path: "/schedule" },
  { name: "Contact", path: "/contact" },
];

// Magnetic effect hook
const useMagnetic = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return { xSpring, ySpring, handleMouse, reset };
};

const AnimatedNavLink = ({ item, index }) => {
  const { xSpring, ySpring, handleMouse, reset } = useMagnetic();

  return (
    <motion.li
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
      className="relative"
    >
      <NavLink
        to={item.path}
        className={({ isActive }) => `relative block group ${isActive ? "active" : ""}`}
      >
        {({ isActive }) => (
          <motion.div
            style={{ x: xSpring, y: ySpring }}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            className="relative px-3.5 py-2 lg:px-4"
          >
            <motion.div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "radial-gradient(circle at center, hsla(24, 95%, 53%, 0.15), transparent 70%)",
              }}
            />

            <motion.span
              className={`relative z-10 text-sm font-bold tracking-wide transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                  : "text-slate-300 group-hover:text-white"
              }`}
            >
              {item.name}
            </motion.span>

            <motion.div
              className="absolute -bottom-0.5 left-1/2 h-0.5 rounded-full"
              initial={false}
              animate={{
                width: isActive ? "60%" : "0%",
                x: "-50%",
                background: isActive
                  ? "linear-gradient(90deg, #f97316, #ec4899, #8b5cf6)"
                  : "transparent",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />

            {isActive && (
              <motion.div
                className="absolute -top-1 -right-1"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                <Sparkles className="w-3 h-3 text-orange-400" />
              </motion.div>
            )}
          </motion.div>
        )}
      </NavLink>
    </motion.li>
  );
};

const AnimatedEventName = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      to="/"
      className="flex items-center gap-2.5 sm:gap-3 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 p-[1.5px] shadow-lg shadow-orange-500/25 flex items-center justify-center group-hover:scale-105 transition-transform">
        <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center">
          <span className="font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400 text-sm sm:text-base">
            CR
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <motion.span
          className="text-base sm:text-lg md:text-xl font-black tracking-tight bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent"
          animate={isHovered ? { backgroundPosition: ["0%", "100%", "0%"] } : {}}
          transition={{ duration: 1.5 }}
          style={{ backgroundSize: "200%" }}
        >
          CROSSROADS
        </motion.span>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.span
            className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            2026
          </motion.span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider hidden sm:inline-block">Fest</span>
        </div>
      </div>
    </NavLink>
  );
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-2 left-0 right-0 z-[100] px-3 sm:px-6 lg:px-8"
      >
        <div
          className={`max-w-7xl mx-auto rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
            scrolled
              ? "bg-slate-950/95 border-orange-500/30 shadow-orange-950/20"
              : "bg-slate-900/85 border-white/10"
          }`}
        >
          <div className="relative flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
            {/* Event Branding */}
            <div className="flex items-center">
              <AnimatedEventName />
            </div>

            {/* Desktop Navigation Links & Register CTA */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <ul className="flex items-center gap-1 lg:gap-2">
                {navItems.map((item, index) => (
                  <AnimatedNavLink key={item.name} item={item} index={index} />
                ))}
              </ul>

              <NavLink
                to="/event-registration"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles size={14} className="text-black" />
                <span>Register</span>
              </NavLink>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden p-2 rounded-xl bg-orange-900/30 border border-orange-500/20 cursor-pointer"
            >
              <Menu size={24} className="text-orange-400" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[998] bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 z-[999] h-screen w-[80vw] max-w-sm bg-slate-950 p-6 flex flex-col justify-between border-l border-slate-800"
            >
              <div>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center font-bold text-white text-xs">
                      CR
                    </div>
                    <h2 className="text-lg font-black text-white">CROSSROADS 2026</h2>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="p-2 rounded-lg bg-slate-900 text-orange-400 border border-slate-800 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => `
                        flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition
                        ${isActive
                          ? "bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-400 border border-orange-500/30"
                          : "text-slate-300 hover:text-white hover:bg-slate-900"
                        }
                      `}
                    >
                      <span>{item.name}</span>
                      <span className="text-gray-500 text-sm">→</span>
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-3">
                <NavLink
                  to="/event-registration"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/30"
                >
                  <Sparkles size={16} className="text-black" />
                  <span>Register Now</span>
                </NavLink>
                <p className="text-center text-[11px] font-mono text-gray-500">
                  HIET Campus • Nov 28–29, 2026
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}