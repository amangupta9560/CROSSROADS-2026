import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Users,
  User,
  Mail,
  Phone,
  GraduationCap,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Layers,
  Code2,
  Cpu,
  Palette,
  Film,
  Music,
  Utensils,
  Flame,
  Gamepad2,
  Send,
  Loader2,
  HelpCircle,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  QrCode
} from 'lucide-react';

const EventRegistration = () => {
  const [searchParams] = useSearchParams();
  const urlEvent = searchParams.get('event');

  const [siteSettings, setSiteSettings] = useState({
    registrationOpen: true,
    closedMessage: '',
    eventStatus: {}
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderMobile: '',
    leaderWhatsapp: '',
    college: '',
    customCollege: '',
    branch: '',
    year: '',
    event: urlEvent || '',
    teamSize: '1',
    members: [],
  });

  const [sameAsCalling, setSameAsCalling] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(false);

  // Success State
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  const colleges = [
    "ABES Engineering College, Ghaziabad",
    "ABESIT Group of Institutions, Ghaziabad",
    "Accurate Institute of Technology & Management, Greater Noida",
    "Ajay Kumar Garg Engineering College (AKGEC), Ghaziabad",
    "Amity University, Noida",
    "Babu Banarsi Das Institute of Technology (BBDIT), Ghaziabad",
    "Bhagwati Institute of Technology, Ghaziabad",
    "Bharti College, University of Delhi (DU)",
    "Galgotias University, Greater Noida",
    "Galgotias College of Engineering & Technology, Greater Noida",
    "GL Bajaj Institute of Technology & Management, Greater Noida",
    "GNIOT Group of Institutions, Greater Noida",
    "H.R. Group of Institutions, Ghaziabad",
    "HI-TECH Institute of Engineering & Technology, Ghaziabad",
    "HIMT Group of Institutions, Greater Noida",
    "Ideal Institute of Technology, Ghaziabad",
    "Inderprastha Engineering College (IPEC), Ghaziabad",
    "Institute of Information Technology & Management (IITM), Delhi",
    "Institute of Management Studies (IMS), Ghaziabad",
    "IMS Engineering College, Ghaziabad",
    "INMANTEC Institutions, Ghaziabad",
    "ITS Engineering College, Greater Noida",
    "ITS Engineering College, Mohan Nagar",
    "Jaypee Institute of Information Technology (JIIT), Noida",
    "JIMS Rohini (Jagan Institute of Management Studies), Delhi",
    "JSS Academy of Technical Education (JSSATE), Noida",
    "JSM Institute of Technology, Ghaziabad",
    "KIET Group of Institutions, Ghaziabad",
    "Lajpat Rai College, Delhi",
    "MMH College, Ghaziabad",
    "Noida Institute of Engineering & Technology (NIET), Greater Noida",
    "PGDAV College, University of Delhi (DU)",
    "R.D. Engineering College (RDEC), Ghaziabad",
    "RKGIT (Raj Kumar Goel Institute of Technology), Ghaziabad",
    "Shaheed Rajguru College of Applied Sciences for Women, University of Delhi",
    "Shambhu Dayal College (SD PG College), Ghaziabad",
    "Sharda University, Greater Noida",
    "Sanskar Group of Institutions, Ghaziabad",
    "Sunder Deep Engineering College, Ghaziabad",
    "OTHER"
  ].sort();

  const branches = [
    'Computer Science & Engineering (CSE)',
    'CSE (Artificial Intelligence & ML)',
    'Information Technology (IT)',
    'Electronics & Communication (ECE)',
    'Mechanical Engineering (ME)',
    'Electrical Engineering (EE)',
    'Civil Engineering (CE)',
    'Applied Sciences / B.Sc / BCA',
    'MCA / Management / Other'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const allEvents = [
    {
      value: 'code-puzzle',
      label: 'Code Puzzle',
      icon: Code2,
      category: 'Technical',
      desc: 'Speed syntax & algorithmic debugging battle in 20 minutes.',
      allowedSizes: [1],
      badge: 'Solo Only (1)',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      value: 'project-exhibition',
      label: 'Project Exhibition',
      icon: Cpu,
      category: 'Technical',
      desc: 'Hardware prototypes, AI agents & engineering innovations.',
      allowedSizes: [1, 2, 3, 4],
      badge: '1 - 4 Members',
      color: 'from-cyan-500 to-teal-400'
    },
    {
      value: 'robo-race',
      label: 'Robo Race',
      icon: Flame,
      category: 'Technical',
      desc: 'High-speed bots maneuvering ramps, pits, and obstacle tracks.',
      allowedSizes: [1, 2, 3, 4],
      badge: '1 - 4 Members',
      color: 'from-amber-500 to-orange-400'
    },
    {
      value: 'technical-poster',
      label: 'Technical Poster Presentation',
      icon: Layers,
      category: 'Technical',
      desc: 'Original hand-crafted posters highlighting emerging tech themes.',
      allowedSizes: [1, 2, 3, 4],
      badge: '1 - 4 Members',
      color: 'from-indigo-500 to-blue-400'
    },
    {
      value: 'cultural-events',
      label: 'Cultural Events (Group Dance)',
      icon: Sparkles,
      category: 'Cultural',
      desc: 'Electrifying group dance routines, folk and fusion choreography.',
      allowedSizes: [1, 2, 3, 4],
      badge: '1 - 4 Members',
      color: 'from-purple-500 to-pink-500'
    },
    {
      value: 'dance-competition',
      label: 'Dance Competition (Solo)',
      icon: Sparkles,
      category: 'Cultural',
      desc: 'Solo spotlight: classical, contemporary, hip-hop, and freestyle.',
      allowedSizes: [1],
      badge: 'Solo Only (1)',
      color: 'from-pink-500 to-rose-400'
    },
    {
      value: 'rock-band',
      label: 'Rock Band',
      icon: Music,
      category: 'Cultural',
      desc: 'Live college band face-off featuring heavy riffs & stage energy.',
      allowedSizes: [1, 2, 3, 4],
      badge: '1 - 4 Members',
      color: 'from-red-500 to-rose-500'
    },
    {
      value: 'short-film-maker',
      label: 'Short Film Maker',
      icon: Film,
      category: 'Cultural',
      desc: '30-60 second cinematic storytelling created on campus.',
      allowedSizes: [1, 2],
      badge: '1 - 2 Members',
      color: 'from-fuchsia-500 to-purple-400'
    },
    {
      value: 'rangoli-competition',
      label: 'Rangoli Competition',
      icon: Palette,
      category: 'Cultural',
      desc: 'Nature-themed traditional and modern floor art on 5x5 ft canvas.',
      allowedSizes: [1, 2, 3],
      badge: '1 - 3 Members',
      color: 'from-yellow-400 to-amber-500'
    },
    {
      value: 'food-without-fire',
      label: 'Food Without Fire',
      icon: Utensils,
      category: 'Cultural',
      desc: 'Masterchef style flameless culinary creations with gourmet presentation.',
      allowedSizes: [1, 2, 3, 4],
      badge: '1 - 4 Members',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      value: 'treasure-hunt',
      label: 'Treasure Hunt',
      icon: Gamepad2,
      category: 'Fun & Adventure',
      desc: 'High-octane multi-station cryptic clues across the entire campus.',
      allowedSizes: [5, 6, 7, 8],
      badge: '5 - 8 Squad Only',
      color: 'from-violet-500 to-indigo-500'
    },
  ];

  // Fetch site control settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const res = await axios.get(`${backendUrl}/api/settings`);
        setSiteSettings(res.data);
      } catch (err) {
        console.warn('Could not fetch settings, using defaults', err);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Pre-select event from URL if present
  useEffect(() => {
    if (urlEvent) {
      const match = allEvents.find(e => e.value === urlEvent);
      if (match) {
        setFormData(prev => ({ ...prev, event: match.value }));
        const defaultSize = match.allowedSizes[0].toString();
        setFormData(prev => ({ ...prev, teamSize: defaultSize }));
        updateTeamMembersCount(defaultSize);
      }
    }
  }, [urlEvent]);

  // Adjust team size rules whenever event changes
  const handleEventSelect = (eventVal) => {
    const ev = allEvents.find(e => e.value === eventVal);
    if (!ev) return;

    // Check if event is closed
    if (siteSettings.eventStatus && siteSettings.eventStatus[eventVal] === false) {
      toast.warn(`Registrations for ${ev.label} are currently closed.`);
      return;
    }

    let newSize = formData.teamSize;
    if (!ev.allowedSizes.includes(parseInt(newSize, 10))) {
      newSize = ev.allowedSizes[0].toString();
    }

    setFormData(prev => ({
      ...prev,
      event: eventVal,
      teamSize: newSize
    }));

    updateTeamMembersCount(newSize);
  };

  const updateTeamMembersCount = (sizeStr) => {
    const size = parseInt(sizeStr, 10);
    const requiredAdditional = Math.max(0, size - 1);

    setFormData(prev => {
      let updated = [...(prev.members || [])];
      while (updated.length < requiredAdditional) {
        updated.push({ name: '', email: '' });
      }
      if (updated.length > requiredAdditional) {
        updated = updated.slice(0, requiredAdditional);
      }
      return {
        ...prev,
        teamSize: sizeStr,
        members: updated
      };
    });
  };

  const handleTeamSizeChange = (sizeStr) => {
    updateTeamMembersCount(sizeStr);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'leaderMobile' && sameAsCalling) {
        next.leaderWhatsapp = value;
      }
      return next;
    });
  };

  const handleSameAsCallingToggle = () => {
    setSameAsCalling(prev => {
      const next = !prev;
      if (next) {
        setFormData(curr => ({ ...curr, leaderWhatsapp: curr.leaderMobile }));
      }
      return next;
    });
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  const activeEventObj = useMemo(() => {
    return allEvents.find(e => e.value === formData.event);
  }, [formData.event]);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'All') return allEvents;
    return allEvents.filter(e => e.category === selectedCategory);
  }, [selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!siteSettings.registrationOpen) {
      return toast.error(siteSettings.closedMessage || 'Registrations are currently closed.');
    }

    if (!formData.event) {
      return toast.error('Please select an event to participate in.');
    }

    if (siteSettings.eventStatus && siteSettings.eventStatus[formData.event] === false) {
      return toast.error('Registrations for this selected event are closed.');
    }

    let finalCollege = formData.college;
    if (formData.college === 'OTHER') {
      if (!formData.customCollege?.trim()) {
        return toast.error('Please enter your custom College / University name.');
      }
      finalCollege = formData.customCollege.trim();
    }

    if (!formData.teamName.trim()) return toast.error('Team Name is required.');
    if (!formData.leaderName.trim()) return toast.error('Team Leader Name is required.');
    if (!formData.leaderEmail.includes('@')) return toast.error('Valid Leader Email is required.');
    if (!/^\d{10}$/.test(formData.leaderMobile)) return toast.error('Mobile Number must be 10 digits.');
    if (!/^\d{10}$/.test(formData.leaderWhatsapp)) return toast.error('WhatsApp Number must be 10 digits.');
    if (!finalCollege) return toast.error('Please choose or enter your college.');
    if (!formData.branch) return toast.error('Please select your branch.');
    if (!formData.year) return toast.error('Please select your academic year.');

    const teamSizeNum = parseInt(formData.teamSize, 10);
    const evObj = allEvents.find(e => e.value === formData.event);

    if (evObj && !evObj.allowedSizes.includes(teamSizeNum)) {
      return toast.error(`Team size for ${evObj.label} must be ${evObj.allowedSizes.join(', ')}.`);
    }

    // Validate additional members
    if (teamSizeNum > 1) {
      if (formData.members.length !== teamSizeNum - 1) {
        return toast.error(`Please provide details for all ${teamSizeNum - 1} team members.`);
      }

      for (let i = 0; i < formData.members.length; i++) {
        const m = formData.members[i];
        if (!m.name?.trim()) {
          return toast.error(`Member #${i + 2} name is required.`);
        }
        if (!m.email?.includes('@')) {
          return toast.error(`Member #${i + 2} must have a valid email.`);
        }
      }
    }

    setSubmitting(true);

    try {
      const payload = {
        teamName: formData.teamName.trim(),
        leaderName: formData.leaderName.trim(),
        leaderEmail: formData.leaderEmail.trim().toLowerCase(),
        leaderMobile: formData.leaderMobile.trim(),
        leaderWhatsapp: formData.leaderWhatsapp.trim(),
        college: finalCollege,
        branch: formData.branch,
        year: formData.year,
        event: formData.event,
        teamSize: teamSizeNum,
        members: formData.members.map(m => ({
          name: m.name.trim(),
          email: m.email.trim().toLowerCase()
        }))
      };

      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/api/event-register`, payload);

      setRegistrationSuccess({
        teamId: res.data.teamId,
        teamName: payload.teamName,
        eventLabel: evObj ? evObj.label : payload.event,
        leaderName: payload.leaderName,
        leaderEmail: payload.leaderEmail,
        college: payload.college,
        teamSize: payload.teamSize,
        membersCount: payload.members.length
      });

      toast.success(`🎉 Team Registered! Team ID: ${res.data.teamId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Registration failed. Please check details & retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyTeamId = () => {
    if (registrationSuccess?.teamId) {
      navigator.clipboard.writeText(registrationSuccess.teamId);
      setCopiedId(true);
      toast.info('Team ID copied to clipboard!');
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleResetForNewRegistration = () => {
    setRegistrationSuccess(null);
    setFormData({
      teamName: '',
      leaderName: '',
      leaderEmail: '',
      leaderMobile: '',
      leaderWhatsapp: '',
      college: '',
      customCollege: '',
      branch: '',
      year: '',
      event: '',
      teamSize: '1',
      members: [],
    });
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#070913] text-white pt-28">
        <Loader2 className="animate-spin text-cyan-400 mb-4" size={48} />
        <p className="text-gray-400 font-mono tracking-wider text-sm animate-pulse">CONNECTING TO CROSSROADS CORE...</p>
      </div>
    );
  }

  // If website registrations are closed globally
  if (!siteSettings.registrationOpen) {
    return (
      <div className="min-h-screen bg-[#070913] py-24 px-4 pt-36 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-red-950/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-xl w-full bg-slate-900/90 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-400 shadow-lg shadow-red-500/10">
            <AlertCircle className="w-10 h-10" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-xs uppercase tracking-widest mb-3">
            Portal Paused
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Registrations Currently Closed
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
            {siteSettings.closedMessage || 'Online registrations for CROSSROADS 2026 are currently paused. Please check back later or reach out to the campus desk.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg transition"
            >
              Explore Events
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-slate-800 text-gray-200 hover:text-white font-semibold rounded-xl border border-slate-700 hover:bg-slate-700 transition"
            >
              Contact Coordinators
            </Link>
          </div>
        </div>
        <ToastContainer position="top-center" theme="dark" autoClose={5000} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060813] text-gray-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-32">
      {/* Ambient Cyber Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[42rem] h-[22rem] bg-cyan-600/15 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-72 right-[-5%] w-[32rem] h-[22rem] bg-purple-600/12 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* REGISTRATION SUCCESS VIEW */}
        {registrationSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Holographic Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500" />

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-400/40 rounded-3xl flex items-center justify-center mx-auto mb-4 text-cyan-400 shadow-xl shadow-cyan-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="inline-block px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-widest font-semibold mb-2">
                Official Registration Confirmed
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Team Pass Minted!
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                A confirmation email with official fest pass has been sent to the leader & CC'd to team members.
              </p>
            </div>

            {/* Pass Ticket Card */}
            <div className="p-6 bg-[#0c1222] border border-cyan-500/30 rounded-2xl relative overflow-hidden mb-8 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 block">Assigned Team ID</span>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400 tracking-wider mt-0.5">
                    {registrationSuccess.teamId}
                  </div>
                </div>
                <button
                  onClick={copyTeamId}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-semibold transition shrink-0"
                >
                  {copiedId ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedId ? 'Copied!' : 'Copy Team ID'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-5 text-sm">
                <div>
                  <span className="text-xs text-gray-500 block">Event Arena</span>
                  <span className="font-semibold text-white">{registrationSuccess.eventLabel}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Team Name</span>
                  <span className="font-semibold text-white">{registrationSuccess.teamName}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Team Leader</span>
                  <span className="font-semibold text-white">{registrationSuccess.leaderName}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Squad Headcount</span>
                  <span className="font-semibold text-cyan-300">
                    {registrationSuccess.teamSize} Member{registrationSuccess.teamSize > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-800/80">
                  <span className="text-xs text-gray-500 block">Institution</span>
                  <span className="text-gray-300 text-xs sm:text-sm font-medium">{registrationSuccess.college}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a
                href="https://chat.whatsapp.com/KTyS5UeLX1q3wVX7omGqcg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
              >
                <MessageCircle size={18} />
                <span>Join Official WhatsApp Community</span>
                <ExternalLink size={14} />
              </a>

              <div className="flex gap-3">
                <button
                  onClick={handleResetForNewRegistration}
                  className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-gray-200 font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition text-sm"
                >
                  <RefreshCw size={15} />
                  <span>Register Another Team</span>
                </button>
                <Link
                  to="/events"
                  className="flex-1 py-3.5 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 font-semibold rounded-xl border border-cyan-500/30 flex items-center justify-center gap-2 transition text-sm"
                >
                  <Trophy size={15} />
                  <span>Explore Other Events</span>
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (

          /* REGISTRATION FORM VIEW */
          <div>
            {/* Header Title */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-mono tracking-wide mb-4 shadow-lg shadow-cyan-950/50">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                <span>LIVE REGISTRATIONS • CROSSROADS 2026</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                Claim Your <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Arena</span>
              </h1>
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mt-3">
                Join 1,000+ top engineering and creative innovators from across colleges. Fill in your squad credentials below.
              </p>

              {/* Event Date & Deadline Badge Ribbon */}
              <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-cyan-300">
                  <span className="text-base">🗓️</span>
                  <span>Event Date: <strong>November 28–29, 2026</strong></span>
                </div>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-300">
                  <span className="text-base">⏳</span>
                  <span>Registration Deadline: <strong>November 20, 2026</strong></span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT / MAIN FORM (8 cols) */}
              <div className="lg:col-span-8 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-10">

                  {/* STEP 1: EVENT ARENA SELECTOR */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                          1
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            Select Event Arena <span className="text-cyan-400 text-sm">*</span>
                          </h2>
                          <p className="text-xs text-gray-400">Choose the competition you want to participate in</p>
                        </div>
                      </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {['All', 'Technical', 'Cultural', 'Fun & Adventure'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            selectedCategory === cat
                              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                              : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Interactive Event Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                      {filteredEvents.map(ev => {
                        const isSelected = formData.event === ev.value;
                        const isClosed = siteSettings.eventStatus && siteSettings.eventStatus[ev.value] === false;
                        const Icon = ev.icon;

                        return (
                          <div
                            key={ev.value}
                            onClick={() => !isClosed && handleEventSelect(ev.value)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative text-left ${
                              isClosed
                                ? 'opacity-40 bg-slate-950/40 border-slate-800 cursor-not-allowed'
                                : isSelected
                                ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-950/50'
                                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${ev.color} text-black shrink-0`}>
                                <Icon size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                                    {ev.label}
                                  </h3>
                                  {isSelected && (
                                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0 ml-1" />
                                  )}
                                </div>
                                <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{ev.desc}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-gray-300 font-mono">
                                    {ev.badge}
                                  </span>
                                  {isClosed && (
                                    <span className="text-[10px] text-red-400 font-bold uppercase">Closed</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 2: TEAM IDENTITY & HEADCOUNT */}
                  <div className="pt-8 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          Team Identity & Headcount <span className="text-cyan-400 text-sm">*</span>
                        </h2>
                        <p className="text-xs text-gray-400">Give your squad a moniker and declare your roster size</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                          Team / Solo Moniker *
                        </label>
                        <input
                          type="text"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Cyber Ninjas / Quantum Coders"
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-gray-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                          Team Size (including leader) *
                        </label>
                        {activeEventObj ? (
                          <div className="flex flex-wrap gap-2">
                            {activeEventObj.allowedSizes.map(size => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => handleTeamSizeChange(size.toString())}
                                className={`px-4 py-3 rounded-xl font-semibold text-xs transition flex items-center gap-1.5 ${
                                  formData.teamSize === size.toString()
                                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                                    : 'bg-slate-950 border border-slate-800 text-gray-300 hover:border-slate-700'
                                }`}
                              >
                                <Users size={14} />
                                <span>{size} {size === 1 ? 'Solo' : 'Members'}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 italic py-3 bg-slate-950/60 rounded-xl px-4 border border-slate-800">
                            Select an event first to unlock available team sizes
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* STEP 3: LEADER (COMMANDER) CONTACT */}
                  <div className="pt-8 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          Team Leader Credentials <span className="text-cyan-400 text-sm">*</span>
                        </h2>
                        <p className="text-xs text-gray-400">Primary point of contact for confirmation emails and slot briefings</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                          <input
                            type="text"
                            name="leaderName"
                            value={formData.leaderName}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Aman Gupta"
                            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-gray-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                          Official Email Address *
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                          <input
                            type="email"
                            name="leaderEmail"
                            value={formData.leaderEmail}
                            onChange={handleChange}
                            required
                            placeholder="leader@gmail.com"
                            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-gray-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                          Calling Mobile Number *
                        </label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                          <input
                            type="tel"
                            name="leaderMobile"
                            maxLength="10"
                            value={formData.leaderMobile}
                            onChange={handleChange}
                            required
                            placeholder="10-digit number"
                            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-gray-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-mono uppercase tracking-wider text-gray-400">
                            WhatsApp Number *
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-cyan-400 hover:text-cyan-300">
                            <input
                              type="checkbox"
                              checked={sameAsCalling}
                              onChange={handleSameAsCallingToggle}
                              className="w-3 h-3 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                            />
                            <span>Same as calling</span>
                          </label>
                        </div>
                        <div className="relative">
                          <MessageCircle size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                          <input
                            type="tel"
                            name="leaderWhatsapp"
                            maxLength="10"
                            value={formData.leaderWhatsapp}
                            onChange={handleChange}
                            required
                            disabled={sameAsCalling}
                            placeholder="WhatsApp number"
                            className={`w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-gray-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm ${
                              sameAsCalling ? 'opacity-60 bg-slate-900 cursor-not-allowed' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP 4: ACADEMIC DETAILS */}
                  <div className="pt-8 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                        4
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          Academic Profile <span className="text-cyan-400 text-sm">*</span>
                        </h2>
                        <p className="text-xs text-gray-400">Tell us about your home institution and current semester</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                          College / University *
                        </label>
                        <select
                          name="college"
                          value={formData.college}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm cursor-pointer"
                        >
                          <option value="">-- Choose your College / University --</option>
                          {colleges.map((col, idx) => (
                            <option key={idx} value={col}>{col}</option>
                          ))}
                        </select>
                      </div>

                      {formData.college === 'OTHER' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl"
                        >
                          <label className="block text-xs font-mono uppercase tracking-wider text-cyan-300 mb-2">
                            Enter Custom College Name *
                          </label>
                          <input
                            type="text"
                            name="customCollege"
                            value={formData.customCollege}
                            onChange={handleChange}
                            required
                            placeholder="Specify full name of your university / institute"
                            className="w-full px-4 py-2.5 bg-slate-950 border border-cyan-500/40 rounded-lg text-white placeholder-gray-600 focus:border-cyan-400 text-sm"
                          />
                        </motion.div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                            Branch / Department *
                          </label>
                          <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-cyan-400 text-sm cursor-pointer"
                          >
                            <option value="">Select Branch</option>
                            {branches.map(b => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                            Year of Study *
                          </label>
                          <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-cyan-400 text-sm cursor-pointer"
                          >
                            <option value="">Select Year</option>
                            {years.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP 5: ADDITIONAL SQUAD MEMBERS (IF TEAM SIZE > 1) */}
                  {parseInt(formData.teamSize, 10) > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-8 border-t border-slate-800"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm">
                          5
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            Squad Roster ({formData.members.length} Additional Partner{formData.members.length > 1 ? 's' : ''})
                          </h2>
                          <p className="text-xs text-gray-400">
                            Each member will automatically receive the official confirmation email in CC.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {formData.members.map((member, idx) => (
                          <div
                            key={idx}
                            className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl relative"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Users size={13} /> Squad Member #{idx + 2}
                              </span>
                              <span className="text-[11px] text-gray-500">Co-Participant</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1">
                                  Full Name *
                                </label>
                                <input
                                  type="text"
                                  value={member.name}
                                  onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                  required
                                  placeholder={`Member #${idx + 2} Name`}
                                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-600 focus:border-purple-400 text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1">
                                  Email Address *
                                </label>
                                <input
                                  type="email"
                                  value={member.email}
                                  onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                                  required
                                  placeholder={`member${idx + 2}@gmail.com`}
                                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-600 focus:border-purple-400 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 sm:py-5 bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-base sm:text-lg rounded-2xl shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin text-black" size={22} />
                          <span>Forging Team Pass & Dispatching Emails...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} className="text-black" />
                          <span>Confirm & Submit Registration</span>
                          <ArrowRight size={20} className="text-black" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-gray-500 text-xs mt-3">
                      🔒 Official registration pass with assigned Team ID will be dispatched to leader email with all members in CC.
                    </p>
                  </div>

                </form>
              </div>

              {/* RIGHT / LIVE PASS PREVIEW & PERKS (4 cols) */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
                
                {/* LIVE ENTRY PASS PREVIEW */}
                <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 rounded-3xl border border-cyan-500/30 p-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-[11px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
                        PASS PREVIEW
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">CR-2026</span>
                  </div>

                  {/* Team Pass Details */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-gray-500 block">Squad Moniker</span>
                      <div className="text-lg font-black text-white truncate">
                        {formData.teamName.trim() || 'YOUR SQUAD NAME'}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono text-gray-500 block">Selected Event</span>
                      <div className="text-sm font-bold text-cyan-300 truncate">
                        {activeEventObj ? activeEventObj.label : 'Select Event Arena'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-gray-500 block">Commander</span>
                        <span className="text-xs font-semibold text-gray-200 truncate block">
                          {formData.leaderName.trim() || 'Leader Name'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono text-gray-500 block">Roster</span>
                        <span className="text-xs font-semibold text-cyan-400">
                          {formData.teamSize} Member{formData.teamSize > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80">
                      <span className="text-[10px] uppercase font-mono text-gray-500 block">Institution</span>
                      <span className="text-xs text-gray-400 line-clamp-1">
                        {formData.college === 'OTHER'
                          ? (formData.customCollege || 'Other College')
                          : (formData.college || 'Select College')}
                      </span>
                    </div>

                    {/* Decorative Barcode / Hologram */}
                    <div className="pt-4 border-t border-dashed border-slate-800 flex items-center justify-between">
                      <div className="h-6 flex items-center gap-1 opacity-40">
                        {[4, 2, 6, 3, 5, 2, 7, 3, 4, 2, 6, 3, 5, 2, 6, 2].map((w, i) => (
                          <div key={i} className="bg-gray-400 h-full" style={{ width: `${w}px` }} />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-gray-600">HIET FEST 2026</span>
                    </div>
                  </div>
                </div>

                {/* FEST PERKS CARD */}
                <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck size={16} className="text-cyan-400" />
                    <span>Participant Benefits</span>
                  </h3>
                  <ul className="text-xs text-gray-400 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                      <span>Official Certificate of Participation with verifiable credentials.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                      <span>Access to technical keynotes, workshops, and high-energy cultural night.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                      <span>Round Robin high-priority instant registration confirmation dispatch.</span>
                    </li>
                  </ul>

                  <div className="pt-3 border-t border-slate-800/80">
                    <a
                      href="https://chat.whatsapp.com/KTyS5UeLX1q3wVX7omGqcg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-semibold"
                    >
                      <MessageCircle size={14} />
                      <span>Join Crossroads WhatsApp Group</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      <ToastContainer position="top-center" theme="dark" autoClose={5000} />
    </div>
  );
};

export default EventRegistration;