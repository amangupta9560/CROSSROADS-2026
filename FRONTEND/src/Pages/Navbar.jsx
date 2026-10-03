// import { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import { Menu, X, Sparkles } from "lucide-react";
// import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
// import hiet from '/hiet.png';
// import sunstone from '/sunstone.jpg';

// const navItems = [
//   { name: "Home", path: "/" },
//   { name: "About", path: "/about" },
//   { name: "Team", path: "/team" },
//   { name: "Events", path: "/events" },
//   { name: "Schedule", path: "/schedule" },
//   { name: "Contact", path: "/contact" },
// ];

// // Magnetic effect hook
// const useMagnetic = () => {
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const springConfig = { damping: 15, stiffness: 150 };
//   const xSpring = useSpring(x, springConfig);
//   const ySpring = useSpring(y, springConfig);

//   const handleMouse = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;
//     x.set((e.clientX - centerX) * 0.3);
//     y.set((e.clientY - centerY) * 0.3);
//   };

//   const reset = () => {
//     x.set(0);
//     y.set(0);
//   };

//   return { xSpring, ySpring, handleMouse, reset };
// };

// const FloatingParticles = () => (
//   <div className="absolute inset-0 overflow-hidden pointer-events-none">
//     {[...Array(6)].map((_, i) => (
//       <motion.div
//         key={i}
//         className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-orange-400 to-pink-500"
//         style={{ left: `${15 + i * 15}%`, top: "50%" }}
//         animate={{
//           y: [0, -15, 0],
//           opacity: [0.3, 0.8, 0.3],
//           scale: [1, 1.5, 1],
//         }}
//         transition={{
//           duration: 2 + i * 0.3,
//           repeat: Infinity,
//           delay: i * 0.2,
//           ease: "easeInOut",
//         }}
//       />
//     ))}
//   </div>
// );

// const AnimatedNavLink = ({ item, index }) => {
//   const { xSpring, ySpring, handleMouse, reset } = useMagnetic();

//   return (
//     <motion.li
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
//       className="relative"
//     >
//       <NavLink
//         to={item.path}
//         className={({ isActive }) => `relative block group ${isActive ? "active" : ""}`}
//       >
//         {({ isActive }) => (
//           <motion.div
//             style={{ x: xSpring, y: ySpring }}
//             onMouseMove={handleMouse}
//             onMouseLeave={reset}
//             className="relative px-4 py-2.5 lg:px-5"
//           >
//             <motion.div
//               className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//               style={{
//                 background: "radial-gradient(circle at center, hsla(24, 95%, 53%, 0.15), transparent 70%)",
//               }}
//             />

//             <motion.span
//               className={`relative z-10 text-sm font-bold tracking-wide transition-all duration-300 ${
//                 isActive
//                   ? "bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
//                   : "text-slate-300 group-hover:text-white"
//               }`}
//             >
//               {item.name}
//             </motion.span>

//             <motion.div
//               className="absolute -bottom-0.5 left-1/2 h-0.5 rounded-full"
//               initial={false}
//               animate={{
//                 width: isActive ? "60%" : "0%",
//                 x: "-50%",
//                 background: isActive
//                   ? "linear-gradient(90deg, #f97316, #ec4899, #8b5cf6)"
//                   : "transparent",
//               }}
//               transition={{ type: "spring", stiffness: 400, damping: 25 }}
//             />

//             {isActive && (
//               <motion.div
//                 className="absolute -top-1 -right-1"
//                 initial={{ scale: 0, rotate: -180 }}
//                 animate={{ scale: 1, rotate: 0 }}
//                 transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
//               >
//                 <Sparkles className="w-3 h-3 text-orange-400" />
//               </motion.div>
//             )}
//           </motion.div>
//         )}
//       </NavLink>
//     </motion.li>
//   );
// };

// const AnimatedEventName = () => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <NavLink
//       to="/"
//       className="flex items-center gap-2.5 sm:gap-3 group"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <motion.div className="relative hidden xs:block" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
//         <motion.div
//           className="absolute -inset-2 rounded-2xl blur-xl"
//           animate={{
//             background: isHovered
//               ? [
//                   "radial-gradient(circle, hsla(24, 95%, 53%, 0.6), transparent)",
//                   "radial-gradient(circle, hsla(330, 80%, 60%, 0.6), transparent)",
//                   "radial-gradient(circle, hsla(24, 95%, 53%, 0.6), transparent)",
//                 ]
//               : "radial-gradient(circle, hsla(24, 95%, 53%, 0.4), transparent)",
//             scale: isHovered ? [1, 1.2, 1] : 1,
//           }}
//           transition={{ duration: 2, repeat: Infinity }}
//         />
//         <motion.div
//           className="absolute -inset-3 rounded-full border border-orange-500/30"
//           animate={{ rotate: 360 }}
//           transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
//           style={{ borderStyle: "dashed", borderWidth: "1px" }}
//         />
//       </motion.div>

//       <div className="flex flex-col">
//         <motion.span
//           className="text-base sm:text-lg md:text-xl font-black tracking-tight bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent"
//           animate={isHovered ? { backgroundPosition: ["0%", "100%", "0%"] } : {}}
//           transition={{ duration: 1.5 }}
//           style={{ backgroundSize: "200%" }}
//         >
//           CROSSROADS
//         </motion.span>

//         <div className="flex items-center gap-1.5 sm:gap-2">
//           <motion.span
//             className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent"
//             animate={{ opacity: [0.7, 1, 0.7] }}
//             transition={{ duration: 2, repeat: Infinity }}
//           >
//             2026
//           </motion.span>
//           <motion.div
//             className="h-1 w-1 rounded-full bg-orange-500"
//             animate={{ scale: [1, 1.5, 1] }}
//             transition={{ duration: 1, repeat: Infinity }}
//           />
//         </div>
//       </div>
//     </NavLink>
//   );
// };

// const PartnerLogos = () => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       className="flex items-center gap-3 sm:gap-4 md:gap-6"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <a
//         href="https://hiet.org/"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <motion.div
//           className="p-1 sm:p-1.5 bg-white rounded-lg sm:rounded-xl shadow-md shadow-black/20 border border-gray-200/80"
//           whileHover={{ scale: 1.08, y: -2 }}
//           whileTap={{ scale: 0.96 }}
//           transition={{ type: "spring", stiffness: 400, damping: 17 }}
//         >
//           <motion.img
//             src={hiet}
//             alt="HIET Logo"
//             className="h-7 sm:h-8 md:h-9 max-h-9 w-auto max-w-[110px] sm:max-w-[130px] object-contain"
//             animate={isHovered ? { filter: "brightness(1.08)" } : { filter: "brightness(1)" }}
//             transition={{ duration: 0.3 }}
//           />
//         </motion.div>
//       </a>

//       <a
//         href="https://sunstone.in/"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <motion.div
//           className="p-1 sm:p-1.5 bg-white rounded-lg sm:rounded-xl shadow-md shadow-black/20 border border-gray-200/80"
//           whileHover={{ scale: 1.08, y: -2 }}
//           whileTap={{ scale: 0.96 }}
//           transition={{ type: "spring", stiffness: 400, damping: 17 }}
//         >
//           <motion.img
//             src={sunstone}
//             alt="Sunstone Logo"
//             className="h-7 sm:h-8 md:h-9 max-h-9 w-auto max-w-[110px] sm:max-w-[130px] object-contain"
//             animate={isHovered ? { filter: "brightness(1.08)" } : { filter: "brightness(1)" }}
//             transition={{ duration: 0.3 }}
//           />
//         </motion.div>
//       </a>
//     </div>
//   );
// };

// const RegisterButton = () => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <NavLink to="/event-registration" className="hidden md:block">
//       <motion.button
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         whileHover={{ scale: 1.04, y: -2 }}
//         whileTap={{ scale: 0.97 }}
//         className="relative px-5 py-2.5 md:px-6 md:py-3 rounded-xl overflow-hidden group bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 shadow-lg shadow-orange-500/30 text-sm md:text-base"
//       >
//         <motion.div
//           className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
//           animate={isHovered ? { x: ["-100%", "200%"] } : {}}
//           transition={{ duration: 0.8, ease: "easeInOut" }}
//         />

//         <span className="relative z-10 font-bold text-white flex items-center gap-1.5 md:gap-2">
//           <Sparkles className="w-4 h-4" />
//           Register Now
//         </span>
//       </motion.button>
//     </NavLink>
//   );
// };

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", handleMouseMove, { passive: true });
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   return (
//     <>
//       <div className="fixed top-0 left-0 right-0 h-1.5 z-[999] overflow-hidden">
//         <motion.div
//           className="absolute inset-0"
//           style={{
//             background: "linear-gradient(90deg, #f97316, #ec4899, #8b5cf6, #3b82f6, #f97316)",
//             backgroundSize: "200% 100%",
//           }}
//           animate={{ backgroundPosition: ["0% 0%", "-200% 0%"] }}
//           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
//         />
//       </div>

//       <motion.header
//         initial={{ y: -100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
//         className="fixed top-2 left-0 right-0 z-[100] px-3 xs:px-4 sm:px-6 lg:px-8"
//       >
//         <motion.div
//           className="max-w-7xl mx-auto rounded-2xl backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl"
//           animate={{
//             borderColor: scrolled ? "rgba(249,115,22,0.5)" : "rgba(249,115,22,0.25)",
//             boxShadow: scrolled
//               ? "0 25px 70px -20px rgba(249,115,22,0.35)"
//               : "0 15px 50px -20px rgba(249,115,22,0.2)",
//             background: scrolled ? "rgba(15,23,42,0.92)" : "rgba(15,23,42,0.82)",
//           }}
//           transition={{ duration: 0.5 }}
//         >
//           <motion.div
//             className="absolute inset-0 opacity-30 pointer-events-none"
//             style={{
//               background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, hsla(24, 95%, 53%, 0.15), transparent 40%)`,
//             }}
//           />

//           <FloatingParticles />

//           <div className="relative flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
//             <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
//               <AnimatedEventName />
//               <PartnerLogos />
//             </div>

//             <motion.ul className="hidden md:flex items-center gap-1 lg:gap-2">
//               {navItems.map((item, index) => (
//                 <AnimatedNavLink key={item.name} item={item} index={index} />
//               ))}
//             </motion.ul>

//             <div className="flex items-center gap-3 sm:gap-4">
//               <RegisterButton />

//               <motion.button
//                 whileHover={{ scale: 1.12 }}
//                 whileTap={{ scale: 0.92 }}
//                 onClick={() => setOpen(true)}
//                 className="md:hidden p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-orange-900/30 to-pink-900/20 backdrop-blur-sm border border-orange-500/20"
//               >
//                 <Menu size={24} className="text-orange-400" strokeWidth={2.8} />
//               </motion.button>
//             </div>
//           </div>
//         </motion.div>
//       </motion.header>

//       <AnimatePresence>
//         {open && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setOpen(false)}
//               className="fixed inset-0 z-[998] bg-black/70 backdrop-blur-sm"
//             />

//             <motion.div
//               initial={{ x: "100%", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: "100%", opacity: 0 }}
//               transition={{ type: "spring", damping: 28, stiffness: 220 }}
//               className="fixed top-0 right-0 z-[999] h-screen w-[80vw] max-w-xs sm:max-w-sm backdrop-blur-2xl overflow-y-auto"
//               style={{
//                 background: "linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(10,16,32,0.96) 100%)",
//               }}
//             >
//               <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-orange-500/40 to-transparent" />

//               <div className="relative flex items-center justify-between px-5 sm:px-6 py-6 sm:py-7 border-b border-white/8">
//                 <div className="flex items-center gap-3">
//                   <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 animate-pulse" />
//                   <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-orange-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
//                     Menu
//                   </h2>
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.15, rotate: 90 }}
//                   whileTap={{ scale: 0.88 }}
//                   onClick={() => setOpen(false)}
//                   className="p-2.5 sm:p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
//                 >
//                   <X size={24} className="text-orange-400" />
//                 </motion.button>
//               </div>

//               <motion.div
//                 className="px-4 sm:px-5 py-8 sm:py-10 space-y-2 sm:space-y-3"
//                 initial="closed"
//                 animate="open"
//                 exit="closed"
//                 variants={{
//                   open: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
//                   closed: { transition: { staggerChildren: 0.03 } },
//                 }}
//               >
//                 {navItems.map((item, index) => (
//                   <motion.div
//                     key={item.name}
//                     variants={{
//                       open: { x: 0, opacity: 1, scale: 1 },
//                       closed: { x: 30, opacity: 0, scale: 0.96 },
//                     }}
//                   >
//                     <NavLink
//                       to={item.path}
//                       onClick={() => setOpen(false)}
//                       className={({ isActive }) => `
//                         group relative flex items-center px-5 sm:px-6 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-medium
//                         transition-all duration-300
//                         ${isActive
//                           ? 'bg-gradient-to-r from-orange-600/20 to-pink-600/20 text-white border border-orange-500/30'
//                           : 'text-slate-300 hover:text-white hover:bg-white/5'
//                         }
//                       `}
//                     >
//                       <span className="flex-1">{item.name}</span>
//                       <span className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
//                         →
//                       </span>
//                     </NavLink>
//                   </motion.div>
//                 ))}
//               </motion.div>

//               <motion.div
//                 className="p-5 sm:p-6 border-t border-white/10 mt-auto"
//                 initial={{ y: 40, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 <NavLink to="/event-registration" onClick={() => setOpen(false)}>
//                   <motion.button
//                     whileHover={{ scale: 1.04 }}
//                     whileTap={{ scale: 0.96 }}
//                     className="w-full py-4 sm:py-5 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 text-white font-bold text-base sm:text-lg shadow-lg shadow-orange-500/30 relative overflow-hidden group"
//                   >
//                     <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
//                       <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
//                       Register Now
//                     </span>
//                     <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </motion.button>
//                 </NavLink>
//               </motion.div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import hiet from '/hiet.png';
import sunstone from '/sunstone.jpg';

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Team", path: "/team" },
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

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-orange-400 to-pink-500"
        style={{ left: `${15 + i * 15}%`, top: "50%" }}
        animate={{
          y: [0, -15, 0],
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 2 + i * 0.3,
          repeat: Infinity,
          delay: i * 0.2,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

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
            className="relative px-4 py-2.5 lg:px-5"
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
        </div>
      </div>
    </NavLink>
  );
};

const PartnerLogos = () => {
  return (
    <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
      <a href="https://hiet.org/" target="_blank" rel="noopener noreferrer">
        <div className="p-1 sm:p-1.5 bg-white rounded-lg sm:rounded-xl shadow-md border">
          <img
            src={hiet}
            alt="HIET Logo"
            className="h-7 sm:h-8 md:h-9 w-auto object-contain"
          />
        </div>
      </a>

      <a href="https://sunstone.in/" target="_blank" rel="noopener noreferrer">
        <div className="p-1 sm:p-1.5 bg-white rounded-lg sm:rounded-xl shadow-md border">
          <img
            src={sunstone}
            alt="Sunstone Logo"
            className="h-7 sm:h-8 md:h-9 w-auto object-contain"
          />
        </div>
      </a>
    </div>
  );
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
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
        <div className="max-w-7xl mx-auto rounded-2xl backdrop-blur-xl border border-white/10 bg-slate-900/90 shadow-2xl">
          <div className="relative flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
            <div className="flex items-center gap-6">
              <AnimatedEventName />
              <PartnerLogos />
            </div>

            <div className="hidden md:flex items-center gap-4">
              <ul className="flex items-center gap-2">
                {navItems.map((item, index) => (
                  <AnimatedNavLink key={item.name} item={item} index={index} />
                ))}
              </ul>

              <NavLink
                to="/event-registration"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles size={14} className="text-black" />
                <span>Register</span>
              </NavLink>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="md:hidden p-2 rounded-xl bg-orange-900/30 border border-orange-500/20"
            >
              <Menu size={24} className="text-orange-400" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[998] bg-black/70"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 z-[999] h-screen w-[80vw] max-w-sm bg-slate-900 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <button onClick={() => setOpen(false)}>
                    <X size={24} className="text-orange-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className="block text-slate-300 hover:text-white text-lg font-medium"
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <NavLink
                  to="/event-registration"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/30"
                >
                  <Sparkles size={16} className="text-black" />
                  <span>Register Now</span>
                </NavLink>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}