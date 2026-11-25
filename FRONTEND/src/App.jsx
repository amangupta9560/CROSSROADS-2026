import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navbar from './Pages/Navbar.jsx';
import Footer from './Pages/Footer.jsx';
import BroadcastBanner from './Components/BroadcastBanner.jsx';

// Pages with navbar + footer
import Home from './Pages/Home.jsx';
import About from './Pages/About.jsx';
import Contact from './Pages/Contact.jsx';
import Events from './Pages/Events.jsx';
import Schedule from './Pages/Schedule.jsx';
import Team from './Pages/Team.jsx';
import EventRegistration from './Components/EventRegistration.jsx';

// Special pages
import AdminLogin from './Components/AdminLogin.jsx';
import AdminDashboard from './Components/AdminDashboard.jsx';
import Attendance from './Pages/Attendence.jsx';

const NotFound = () => (
  <div className="min-h-[80dvh] bg-[#040711] text-white flex flex-col items-center justify-center px-4 pt-28 pb-16 text-center">
    <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-widest mb-4">
      Error 404 • Route Not Found
    </span>
    <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">Page Not Found</h1>
    <p className="text-slate-400 max-w-md mb-8 text-sm sm:text-base">
      The page you are looking for does not exist or may have been moved.
    </p>
    <Link
      to="/"
      className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-sm hover:opacity-95 transition"
    >
      Return to Home
    </Link>
  </div>
);

// Reusable layout with coordinated top Broadcast Banner + Navbar stack and Footer
const MainLayout = ({ children }) => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
        <div className="pointer-events-auto">
          <BroadcastBanner />
        </div>
        <Navbar />
      </div>
      {children}
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/events" element={<MainLayout><Events /></MainLayout>} />
          <Route path="/schedule" element={<MainLayout><Schedule /></MainLayout>} />
          <Route path="/team" element={<MainLayout><Team /></MainLayout>} />
          <Route path="/event-registration" element={<MainLayout><EventRegistration /></MainLayout>} />
          <Route path="/attendence" element={<Attendance />} />

          {/* Admin Pages */}
          <Route path="/admin/login" element={<MainLayout><AdminLogin /></MainLayout>} />
          <Route path="/admin/dashboard" element={<MainLayout><AdminDashboard /></MainLayout>} />

          {/* Fallback */}
          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
      </Router>
    </MotionConfig>
  );
};

export default App;