import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import SoundProvider from './context/SoundProvider.jsx';
import Navbar from './Pages/Navbar.jsx';
import Footer from './Pages/Footer.jsx';
import BroadcastBanner from './Components/BroadcastBanner.jsx';

// Route-level code splitting for faster initial load and smaller bundles
const Home = lazy(() => import('./Pages/Home.jsx'));
const About = lazy(() => import('./Pages/About.jsx'));
const Contact = lazy(() => import('./Pages/Contact.jsx'));
const Events = lazy(() => import('./Pages/Events.jsx'));
const Schedule = lazy(() => import('./Pages/Schedule.jsx'));
const Team = lazy(() => import('./Pages/Team.jsx'));
const EventRegistration = lazy(() => import('./Components/EventRegistration.jsx'));
const AdminLogin = lazy(() => import('./Components/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./Components/AdminDashboard.jsx'));
const Attendance = lazy(() => import('./Pages/Attendence.jsx'));
const NotFound = lazy(() => import('./Pages/NotFound.jsx'));

const RouteLoader = () => (
  <div
    role="status"
    aria-label="Loading page"
    className="min-h-[85dvh] bg-[#080D0B] text-[#E8C574] flex flex-col items-center justify-center px-4 pt-28"
  >
    <div className="w-10 h-10 rounded-full border-2 border-[#C69B43]/25 border-t-[#E8C574] animate-spin mb-3" />
    <span className="lc-font-heading text-xs uppercase tracking-[0.24em] text-[#E8C574]/85">
      Entering Chamber...
    </span>
  </div>
);

const LegacyRegisterRedirect = () => {
  const location = useLocation();
  return <Navigate to={`/register${location.search || ''}`} replace />;
};

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
        <SoundProvider>
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/about" element={<MainLayout><About /></MainLayout>} />
              <Route path="/events" element={<MainLayout><Events /></MainLayout>} />
              <Route path="/events/:eventSlug" element={<MainLayout><Events /></MainLayout>} />
              <Route path="/schedule" element={<MainLayout><Schedule /></MainLayout>} />
              <Route path="/team" element={<MainLayout><Team /></MainLayout>} />
              <Route path="/register" element={<MainLayout><EventRegistration /></MainLayout>} />
              <Route path="/event-registration" element={<LegacyRegisterRedirect />} />
              <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/attendence" element={<Navigate to="/attendance" replace />} />

              {/* Admin Pages — Dedicated workspace without public Navbar or Footer */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Custom Lost Civilization 404 Page */}
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </Routes>
          </Suspense>
        </SoundProvider>
      </Router>
    </MotionConfig>
  );
};

export default App;
