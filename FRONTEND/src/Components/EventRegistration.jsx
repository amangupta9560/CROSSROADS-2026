import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion as Motion, AnimatePresence } from 'framer-motion';
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
  Rocket,
  Loader2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  Info,
  Globe,
  Binary,
  Target
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const STEPS = ['Contact & Event Info', 'Team Members', 'Review & Submit'];

const COLLEGES = [
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

const COURSES = [
  "B.Tech",
  "MCA",
  "BCA",
  "M.Tech",
  "BBA",
  "MBA",
  "B.Pharma",
  "M.Pharma",
  "B.Arch",
  "M.Arch",
  "B.Sc",
  "M.Sc",
  "BA",
  "MA",
  "Other"
];

const BRANCHES = [
  "Computer Science & Engineering (CSE)",
  "CSE (Artificial Intelligence & ML)",
  "CSE (Data Science)",
  "Information Technology (IT)",
  "Electronics & Communication (ECE)",
  "Electrical Engineering (EE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
  "Applied Sciences / BCA / MCA",
  "Other"
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const ALL_EVENTS = [
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
    desc: 'Flameless culinary creations with gourmet presentation.',
    allowedSizes: [1, 2, 3, 4],
    badge: '1 - 4 Members',
    color: 'from-emerald-400 to-teal-500'
  },
  {
    value: 'treasure-hunt',
    label: 'Treasure Hunt',
    icon: Gamepad2,
    category: 'Fun & Adventure',
    desc: 'High-octane multi-station cryptic clues across the campus.',
    allowedSizes: [5, 6, 7, 8],
    badge: '5 - 8 Squad Only',
    color: 'from-violet-500 to-indigo-500'
  },
];

const LS_KEY = 'cr2027_reg_draft';

const ProgressBar = React.memo(({ progress }) => (
  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-white/5 via-white/10 to-white/5 overflow-hidden z-20">
    <Motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ type: "spring", stiffness: 100, damping: 30 }}
      className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.8)]"
    />
  </div>
));
ProgressBar.displayName = 'ProgressBar';

const InputField = ({ label, icon: Icon, error, touched, ...props }) => (
  <Motion.div
    className="space-y-2 text-left"
    whileHover={{ scale: 1.01 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <label className="text-xs sm:text-sm font-bold text-white/60 ml-2 flex items-center gap-2 group-focus-within:text-blue-300 transition-colors">
      {Icon && <Icon size={16} className="text-blue-400 group-focus-within:text-cyan-400 group-focus-within:animate-pulse" />}
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm pointer-events-none" />
      <input
        {...props}
        className={`relative w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl border transition-all outline-none font-semibold text-sm bg-[#0d0d12]/60 backdrop-blur-xl ${
          touched && error
            ? 'border-red-500/50 bg-red-500/5 text-red-100 focus:border-red-500/80 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]'
            : 'border-white/10 focus:border-blue-500/80 focus:bg-white/[0.08] focus:shadow-[0_0_20px_rgba(59,130,246,0.25)] text-white group-hover:border-white/20'
        }`}
      />
    </div>
    {touched && error && (
      <Motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[10px] text-red-400 font-bold uppercase tracking-wider ml-2"
      >
        {error}
      </Motion.p>
    )}
  </Motion.div>
);

const SelectField = ({ label, children, error, touched, icon: Icon, ...props }) => (
  <Motion.div
    className="space-y-2 text-left"
    whileHover={{ scale: 1.01 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <label className="text-xs sm:text-sm font-bold text-white/60 ml-2 flex items-center gap-2 group-focus-within:text-blue-300 transition-colors">
      {Icon && <Icon size={16} className="text-blue-400 group-focus-within:text-cyan-400" />}
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm pointer-events-none" />
      <select
        {...props}
        className={`relative w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl border transition-all outline-none font-semibold text-sm appearance-none cursor-pointer [&_option]:bg-[#0d0a1a] ${
          touched && error
            ? 'border-red-500/50 bg-[#0d0a1a] text-red-100 focus:border-red-500/80'
            : 'border-white/10 bg-[#0d0a1a] focus:border-blue-500/80 focus:bg-[#0d0a1a] focus:shadow-[0_0_20px_rgba(59,130,246,0.25)] text-white group-hover:border-white/20'
        }`}
        style={{
          backgroundColor: '#0d0a1a',
          colorScheme: 'dark',
        }}
      >
        {children}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 group-focus-within:text-blue-400 transition-colors">
        <ChevronRight size={18} />
      </div>
    </div>
    {touched && error && (
      <Motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[10px] text-red-400 font-bold uppercase tracking-wider ml-2"
      >
        {error}
      </Motion.p>
    )}
  </Motion.div>
);

const RulesModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow || 'unset';
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          <Motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-gradient-to-br from-[#1a1a1f] to-[#0f0f12] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90dvh] flex flex-col overflow-hidden my-auto z-10"
          >
            <div className="sticky top-0 bg-gradient-to-r from-[#1a1a1f] to-[#0f0f12]/80 backdrop-blur-xl border-b border-white/5 px-5 py-4 sm:px-8 sm:py-6 flex justify-between items-center z-10 shrink-0">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500/30 to-indigo-500/20 rounded-xl">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-black text-white uppercase tracking-wider font-mono">CROSSROADS 2027 Guidelines</h3>
                  <span className="text-[10px] text-blue-400 font-mono tracking-widest block mt-0.5">FESTIVAL PROTOCOLS</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-6 sm:px-8 sm:py-8 flex-1 overflow-y-auto space-y-6 text-left">
              {[
                {
                  num: '01',
                  title: 'Eligibility & Identity',
                  color: 'blue',
                  items: [
                    'Open to all enrolled undergraduate and postgraduate students from recognized colleges and universities.',
                    'Every participant must carry their official college photo ID card on event days.',
                    'Cross-college teams are permitted for team events.'
                  ]
                },
                {
                  num: '02',
                  title: 'Team Size & Coordination',
                  color: 'indigo',
                  items: [
                    'Respect the team size requirements specified for each event (Solo, 1-4, or 5-8 squad).',
                    'All team members must report together at the HIET campus verification desk.',
                    'The designated Team Leader will receive all official email alerts and schedule updates.'
                  ]
                },
                {
                  num: '03',
                  title: 'Awards & Recognition',
                  color: 'emerald',
                  items: [
                    'Total fest prize pool exceeding ₹1,00,000 across competitive categories.',
                    'Winners receive trophies, certificates of merit, cash prizes, and sponsor hampers.',
                    'All attending registered participants receive official Certificates of Participation.'
                  ]
                }
              ].map((section, idx) => (
                <div key={idx} className="relative pl-5">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/40 rounded-full" />
                  <h4 className="text-blue-400 font-black mb-2 flex items-center gap-2 uppercase text-xs tracking-wider">
                    <span className="bg-blue-500/20 px-2 py-0.5 rounded text-blue-300">{section.num}</span>
                    {section.title}
                  </h4>
                  <ul className="space-y-2 text-white/70 text-xs sm:text-sm">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

const EventRegistration = () => {
  const [searchParams] = useSearchParams();
  const urlEvent = searchParams.get('event');
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [sameAsCalling, setSameAsCalling] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const [siteSettings, setSiteSettings] = useState({
    registrationOpen: true,
    closedMessage: '',
    eventStatus: {}
  });

  // Form State
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          teamName: '',
          leaderName: '',
          leaderEmail: '',
          leaderMobile: '',
          leaderWhatsapp: '',
          college: '',
          customCollege: '',
          course: '',
          branch: '',
          year: '',
          teamSize: '1',
          members: [],
          ...parsed,
          event: urlEvent || parsed.event || ''
        };
      }
    } catch {
      // Ignore invalid localStorage draft
    }
    return {
      teamName: '',
      leaderName: '',
      leaderEmail: '',
      leaderMobile: '',
      leaderWhatsapp: '',
      college: '',
      customCollege: '',
      course: '',
      branch: '',
      year: '',
      event: urlEvent || '',
      teamSize: '1',
      members: []
    };
  });

  const [registeredDetails, setRegisteredDetails] = useState(null);

  // Auto-save draft
  useEffect(() => {
    if (registeredDetails) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(formData));
      } catch {
        // Ignore storage quota errors
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [formData, registeredDetails]);

  // Fetch site control settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const res = await axios.get(`${backendUrl}/api/settings`);
        if (res.data) setSiteSettings(res.data);
      } catch (err) {
        console.warn('Could not fetch settings, using defaults', err);
      }
    };
    fetchSettings();
  }, []);

  // Pre-select event from URL if present
  useEffect(() => {
    if (urlEvent) {
      const match = ALL_EVENTS.find(e => e.value === urlEvent);
      if (match) {
        setFormData(prev => ({
          ...prev,
          event: match.value,
          teamSize: match.allowedSizes[0].toString()
        }));
        syncMembersForSize(match.allowedSizes[0]);
      }
    }
  }, [urlEvent]);

  const activeEventObj = useMemo(() => {
    return ALL_EVENTS.find(e => e.value === formData.event);
  }, [formData.event]);

  // Sync member objects when size changes
  const syncMembersForSize = (targetSize) => {
    const requiredAdditional = Math.max(0, targetSize - 1);
    setFormData(prev => {
      let updated = [...(prev.members || [])];
      while (updated.length < requiredAdditional) {
        updated.push({
          name: '',
          email: '',
          mobile: '',
          course: prev.course || '',
          branch: prev.branch || '',
          year: prev.year || ''
        });
      }
      if (updated.length > requiredAdditional) {
        updated = updated.slice(0, requiredAdditional);
      }
      return {
        ...prev,
        teamSize: targetSize.toString(),
        members: updated
      };
    });
  };

  const handleEventSelect = (eventVal) => {
    const ev = ALL_EVENTS.find(e => e.value === eventVal);
    if (!ev) return;

    if (siteSettings.eventStatus && siteSettings.eventStatus[eventVal] === false) {
      setError(`Registrations for ${ev.label} are currently closed.`);
      return;
    }

    let targetSize = parseInt(formData.teamSize, 10);
    if (!ev.allowedSizes.includes(targetSize)) {
      targetSize = ev.allowedSizes[0];
    }

    setFormData(prev => ({
      ...prev,
      event: eventVal,
      teamSize: targetSize.toString()
    }));
    syncMembersForSize(targetSize);
    setError(null);
  };

  const handleTeamSizeChange = (sizeNum) => {
    syncMembersForSize(sizeNum);
  };

  const validate = useCallback((name, value) => {
    switch (name) {
      case 'event':
        return value ? '' : 'Please select an event arena';
      case 'teamName':
        return value && value.trim().length >= 3 ? '' : 'Min 3 characters';
      case 'leaderName':
        return value && value.trim() ? '' : 'Leader name is required';
      case 'leaderEmail':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '') ? '' : 'Valid email required';
      case 'leaderMobile':
        return /^[6-9]\d{9}$/.test(value || '') ? '' : 'Valid 10-digit number required';
      case 'leaderWhatsapp':
        return /^[6-9]\d{9}$/.test(value || '') ? '' : 'Valid 10-digit WhatsApp number required';
      case 'college':
        return value ? '' : 'Please select college';
      case 'course':
        return value ? '' : 'Please select course';
      case 'branch':
        return value ? '' : 'Please select branch';
      case 'year':
        return value ? '' : 'Please select year';
      default:
        return '';
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'leaderMobile' && sameAsCalling) {
        next.leaderWhatsapp = value;
      }
      return next;
    });
    setTouched(prev => ({ ...prev, [name]: true }));
    setFieldErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFieldErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSameAsCallingToggle = () => {
    setSameAsCalling(prev => {
      const next = !prev;
      if (next) {
        setFormData(curr => ({ ...curr, leaderWhatsapp: curr.leaderMobile }));
        setFieldErrors(curr => ({ ...curr, leaderWhatsapp: validate('leaderWhatsapp', formData.leaderMobile) }));
      }
      return next;
    });
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.members];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, members: updated }));
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Completion calculation for Progress Bar
  const completionProgress = useMemo(() => {
    const reqFields = ['event', 'teamName', 'leaderName', 'leaderEmail', 'leaderMobile', 'leaderWhatsapp', 'college', 'course', 'branch', 'year'];
    const filled = reqFields.filter(f => formData[f] && !validate(f, formData[f])).length;
    let basePct = (filled / reqFields.length) * 60;
    if (step >= 1) basePct += 20;
    if (step >= 2) basePct += 20;
    return Math.min(100, Math.floor(basePct));
  }, [formData, step, validate]);

  // Step 1 Validation & Proceed
  const nextStep = () => {
    setError(null);
    if (step === 0) {
      if (!siteSettings.registrationOpen) {
        return setError(siteSettings.closedMessage || 'Registrations are currently closed.');
      }
      if (!formData.event) {
        return setError('Please select an event arena to continue.');
      }
      if (siteSettings.eventStatus && siteSettings.eventStatus[formData.event] === false) {
        return setError('Registrations for this selected event are closed.');
      }

      const step0Fields = ['event', 'teamName', 'leaderName', 'leaderEmail', 'leaderMobile', 'leaderWhatsapp', 'college', 'course', 'branch', 'year'];
      const newErrors = {};
      step0Fields.forEach(f => {
        newErrors[f] = validate(f, formData[f]);
      });

      if (formData.college === 'OTHER' && !formData.customCollege?.trim()) {
        newErrors.customCollege = 'Please enter your custom college name';
      }

      setFieldErrors(prev => ({ ...prev, ...newErrors }));
      setTouched(prev => {
        const allTouched = { ...prev };
        step0Fields.forEach(f => { allTouched[f] = true; });
        return allTouched;
      });

      if (Object.values(newErrors).some(Boolean)) {
        return setError('Please review and complete all required fields.');
      }
    }

    if (step === 1) {
      const teamSizeNum = parseInt(formData.teamSize, 10);
      if (teamSizeNum > 1) {
        for (let i = 0; i < formData.members.length; i++) {
          const m = formData.members[i];
          if (!m.name || !m.name.trim()) {
            return setError(`Please enter the full name for Teammate ${i + 2}.`);
          }
          if (!m.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim())) {
            return setError(`Please provide a valid email address for Teammate ${i + 2}.`);
          }
        }

        // Intra-team uniqueness check
        const leaderEmail = formData.leaderEmail.trim().toLowerCase();
        const memberEmails = formData.members.map(m => m.email.trim().toLowerCase());
        const allEmails = [leaderEmail, ...memberEmails];
        if (new Set(allEmails).size !== allEmails.length) {
          return setError('All team emails must be unique. Duplicate email found within your team.');
        }

        const leaderMobile = formData.leaderMobile.trim();
        const memberMobiles = formData.members.map(m => m.mobile?.trim()).filter(Boolean);
        const allMobiles = [leaderMobile, ...memberMobiles];
        if (new Set(allMobiles).size !== allMobiles.length) {
          return setError('All mobile numbers within the team must be unique.');
        }
      }
    }

    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Final Form
  const submitForm = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!siteSettings.registrationOpen) {
        setLoading(false);
        return setError(siteSettings.closedMessage || 'Registrations are currently closed.');
      }

      const teamSizeNum = parseInt(formData.teamSize, 10);
      const finalCollege = formData.college === 'OTHER'
        ? (formData.customCollege?.trim() || 'Other')
        : formData.college;

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

      if (res.status === 201 || res.data?.teamId) {
        localStorage.removeItem(LS_KEY);
        setRegisteredDetails({
          teamId: res.data.teamId,
          teamName: formData.teamName,
          leaderName: formData.leaderName,
          leaderEmail: formData.leaderEmail,
          eventLabel: activeEventObj?.label || formData.event,
          teamSize: teamSizeNum
        });
      }
    } catch (err) {
      console.error('Registration submission failed:', err);
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please check network connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070b18] text-white pt-24 sm:pt-28 pb-20 px-3 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[450px] h-[450px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Top Header Section */}
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4 md:gap-6"
        >
          <div className="text-center md:text-left">
            <Motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="inline-flex items-center gap-2 mb-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 px-4 py-2 rounded-full border border-blue-500/30"
            >
              <Rocket className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] sm:text-xs font-bold text-blue-300 uppercase tracking-widest font-mono">
                CROSSROADS 2027 • Official Registration
              </span>
            </Motion.div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
              EVENT <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">REGISTRATION</span>
            </h1>
            <p className="text-white/50 text-[10px] sm:text-xs mt-2 font-semibold uppercase tracking-widest">
              Inter-College Technical & Cultural Fest • HIET Ghaziabad
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] sm:text-[11px] font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                Reg: <strong className="text-white">Jan 10 – Jan 31, 2027</strong>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] sm:text-[11px] font-bold">
                Event: <strong className="text-white">05 &amp; 06 Feb 2027</strong>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[10px] sm:text-[11px] font-bold">
                🏆 Total Prize Pool: <strong className="text-white">₹1,00,000+</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsRulesOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-300 hover:text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              <ShieldCheck size={16} className="text-blue-400" />
              <span>Guidelines</span>
            </button>

            <Link
              to="/events"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              <ExternalLink size={16} className="text-gray-400" />
              <span>View 11 Arenas</span>
            </Link>
          </div>
        </Motion.div>

        {/* Closed Banner Warning if Admin closed registrations */}
        {!siteSettings.registrationOpen && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm flex items-center gap-3">
            <AlertCircle size={20} className="text-red-400 shrink-0" />
            <p className="font-semibold">
              {siteSettings.closedMessage || 'Online registrations for CROSSROADS 2027 are currently closed.'}
            </p>
          </div>
        )}

        {/* Main Card Container */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative backdrop-blur-3xl bg-gradient-to-br from-[#12162a]/90 via-[#0d1020]/80 to-[#12162a]/90 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden mb-8 hover:border-blue-500/30 transition-colors"
        >
          <ProgressBar progress={completionProgress} />

          {/* Stepper Header (Desktop) */}
          <div className="hidden lg:flex items-center justify-between p-8 sm:p-10 border-b border-white/5 relative">
            <div className="absolute left-[15%] right-[15%] top-[50px] h-[1px] bg-white/10 z-0" />
            <Motion.div
              className="absolute left-[15%] top-[50px] h-[1px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 z-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              initial={{ width: "0%" }}
              animate={{ width: step === 0 ? "0%" : step === 1 ? "50%" : "100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
            />

            {STEPS.map((s, i) => (
              <Motion.div
                key={i}
                className="flex-1 flex flex-col items-center relative z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Motion.div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm transition-all border ${
                    step > i
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : step === i
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                      : 'bg-[#0d0d12] border-white/10 text-white/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {step > i ? <Check size={24} /> : i + 1}
                </Motion.div>
                <span className={`text-[11px] mt-3 font-black uppercase tracking-[0.15em] transition-colors duration-300 ${step >= i ? 'text-blue-400' : 'text-white/20'}`}>
                  {s}
                </span>
              </Motion.div>
            ))}
          </div>

          {/* Stepper Header (Mobile) */}
          <div className="lg:hidden px-4 sm:px-6 py-6 border-b border-white/5">
            <div className="flex justify-between items-center mb-3">
              {STEPS.map((_, i) => (
                <Motion.div
                  key={i}
                  className={`h-1.5 flex-1 mx-1 rounded-full transition-all ${
                    step >= i ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-white/10'
                  }`}
                  animate={{ scale: step === i ? 1.05 : 1 }}
                />
              ))}
            </div>
            <p className="text-center text-xs text-blue-400 font-bold uppercase tracking-widest font-mono">
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
            </p>
          </div>

          {/* Form Content Area */}
          <div className="p-6 sm:p-8 md:p-12">
            <AnimatePresence mode="wait">
              {/* STEP 0: CONTACT & EVENT INFO */}
              {step === 0 && (
                <Motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="space-y-8"
                >
                  {/* Event Arena Selection */}
                  <div className="space-y-3 text-left">
                    <label className="text-xs sm:text-sm font-bold text-white/80 ml-1 flex items-center gap-2">
                      <Trophy size={16} className="text-amber-400" />
                      Select Competition Arena *
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {ALL_EVENTS.map(ev => {
                        const isSelected = formData.event === ev.value;
                        const isClosed = siteSettings.eventStatus && siteSettings.eventStatus[ev.value] === false;

                        return (
                          <div
                            key={ev.value}
                            onClick={() => !isClosed && handleEventSelect(ev.value)}
                            className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                              isClosed
                                ? 'opacity-40 cursor-not-allowed bg-slate-900/40 border-slate-800'
                                : isSelected
                                ? 'bg-gradient-to-br from-blue-950/70 to-indigo-950/60 border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]'
                                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800/40">
                                  {ev.category}
                                </span>
                                <span className="text-[10px] font-mono text-gray-400 font-semibold">
                                  {ev.badge}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-white leading-tight">
                                {ev.label}
                              </h4>
                              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                                {ev.desc}
                              </p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-800/70 flex items-center justify-between">
                              <span className="text-[10px] text-blue-300 font-semibold font-mono">
                                {isSelected ? '✓ Selected' : isClosed ? 'Closed' : 'Click to Select'}
                              </span>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {touched.event && fieldErrors.event && (
                      <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider ml-2">
                        {fieldErrors.event}
                      </p>
                    )}
                  </div>

                  {/* Leader and Team Credentials */}
                  <div className="pt-6 border-t border-white/5 space-y-6">
                    <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <User size={18} className="text-blue-400" />
                      Team Leader & Institution Credentials
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      <InputField
                        label="Team Name"
                        name="teamName"
                        placeholder="E.g. Cyber Guardians"
                        value={formData.teamName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={fieldErrors.teamName}
                        touched={touched.teamName}
                        icon={Users}
                      />

                      <InputField
                        label="Team Leader Full Name"
                        name="leaderName"
                        placeholder="E.g. Aman Gupta"
                        value={formData.leaderName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={fieldErrors.leaderName}
                        touched={touched.leaderName}
                        icon={User}
                      />

                      <InputField
                        label="Leader Email Address"
                        name="leaderEmail"
                        type="email"
                        placeholder="leader@example.com"
                        value={formData.leaderEmail}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={fieldErrors.leaderEmail}
                        touched={touched.leaderEmail}
                        icon={Mail}
                      />

                      <InputField
                        label="Leader Calling Phone Number"
                        name="leaderMobile"
                        type="tel"
                        maxLength="10"
                        placeholder="10-digit calling number"
                        value={formData.leaderMobile}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={fieldErrors.leaderMobile}
                        touched={touched.leaderMobile}
                        icon={Phone}
                      />

                      <div className="space-y-2">
                        <InputField
                          label="Leader WhatsApp Number"
                          name="leaderWhatsapp"
                          type="tel"
                          maxLength="10"
                          placeholder="10-digit WhatsApp number"
                          value={formData.leaderWhatsapp}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          error={fieldErrors.leaderWhatsapp}
                          touched={touched.leaderWhatsapp}
                          icon={Phone}
                        />
                        <label className="flex items-center gap-2 text-xs text-blue-300 cursor-pointer ml-2 select-none">
                          <input
                            type="checkbox"
                            checked={sameAsCalling}
                            onChange={handleSameAsCallingToggle}
                            className="rounded border-slate-700 text-blue-500 focus:ring-blue-500 bg-slate-900 cursor-pointer"
                          />
                          <span>Same as Calling Number</span>
                        </label>
                      </div>

                      <SelectField
                        label="College / University"
                        name="college"
                        value={formData.college}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={fieldErrors.college}
                        touched={touched.college}
                        icon={Globe}
                      >
                        <option value="">Select College / University</option>
                        {COLLEGES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </SelectField>

                      {formData.college === 'OTHER' && (
                        <div className="md:col-span-2">
                          <InputField
                            label="Specify Your College / Institute Name"
                            name="customCollege"
                            placeholder="Full name of your College / University"
                            value={formData.customCollege}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            icon={Globe}
                          />
                        </div>
                      )}

                      <SelectField
                        label="Degree / Course"
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={fieldErrors.course}
                        touched={touched.course}
                        icon={GraduationCap}
                      >
                        <option value="">Select Degree / Course</option>
                        {COURSES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </SelectField>

                      <SelectField
                        label="Branch / Department"
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={fieldErrors.branch}
                        touched={touched.branch}
                        icon={Binary}
                      >
                        <option value="">Select Branch / Department</option>
                        {BRANCHES.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </SelectField>

                      <SelectField
                        label="Academic Year"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={fieldErrors.year}
                        touched={touched.year}
                        icon={Target}
                      >
                        <option value="">Select Year</option>
                        {YEARS.map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </SelectField>
                    </div>
                  </div>
                </Motion.div>
              )}

              {/* STEP 1: TEAM MEMBERS (Step 2 in user terms, project details removed as requested) */}
              {step === 1 && (
                <Motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="space-y-8"
                >
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/50 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 shrink-0">
                        <Users size={20} />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold block">
                          Arena: {activeEventObj?.label || 'Selected Event'}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          Configure Team Size
                        </h3>
                        <p className="text-xs text-gray-400">
                          Allowed: {activeEventObj?.badge || '1-4 Members'} (Including Team Leader)
                        </p>
                      </div>
                    </div>

                    {/* Team Size Buttons */}
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      {activeEventObj?.allowedSizes.map(size => {
                        const isCurrent = parseInt(formData.teamSize, 10) === size;
                        let labelText = size === 1 ? 'Solo (1 Member)' : `${size} Members Total`;

                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleTeamSizeChange(size)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/50 scale-105'
                                : 'bg-slate-900/80 text-gray-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            {labelText}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Solo Notice */}
                  {parseInt(formData.teamSize, 10) === 1 && (
                    <Motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 sm:p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3"
                    >
                      <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <User size={28} />
                      </div>
                      <h4 className="text-lg font-bold text-white">Solo Participant Arena</h4>
                      <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                        You have selected a solo participation format. The Team Leader (<strong className="text-blue-300">{formData.leaderName || 'You'}</strong>) will compete individually. No additional team members are required.
                      </p>
                      <p className="text-xs text-blue-400 font-mono pt-2">
                        Click "Continue" below to review and confirm your registration.
                      </p>
                    </Motion.div>
                  )}

                  {/* Teammate Cards */}
                  {parseInt(formData.teamSize, 10) > 1 && (
                    <div className="space-y-6 text-left">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider font-mono">
                          Teammates Roster ({formData.members.length} Additional Members)
                        </h4>
                        <span className="text-xs text-gray-500">All members will be CC'd on confirmation emails</span>
                      </div>

                      <div className="space-y-4">
                        {formData.members.map((member, idx) => (
                          <Motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/80 border border-slate-800 hover:border-blue-500/40 transition-all space-y-4"
                          >
                            <div className="flex items-center gap-2.5 text-blue-400 font-bold text-xs uppercase tracking-widest font-mono">
                              <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300">
                                {idx + 2}
                              </div>
                              <span>Teammate {idx + 2} Details</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              <InputField
                                label="Teammate Full Name *"
                                placeholder="E.g. Priyanshu Singh"
                                value={member.name}
                                onChange={e => handleMemberChange(idx, 'name', e.target.value)}
                                icon={User}
                              />

                              <InputField
                                label="Teammate Email Address *"
                                type="email"
                                placeholder="teammate@example.com"
                                value={member.email}
                                onChange={e => handleMemberChange(idx, 'email', e.target.value)}
                                icon={Mail}
                              />

                              <InputField
                                label="Teammate Phone (Optional)"
                                type="tel"
                                maxLength="10"
                                placeholder="10-digit number"
                                value={member.mobile || ''}
                                onChange={e => handleMemberChange(idx, 'mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                icon={Phone}
                              />

                              <SelectField
                                label="Degree / Course"
                                value={member.course || ''}
                                onChange={e => handleMemberChange(idx, 'course', e.target.value)}
                                icon={GraduationCap}
                              >
                                <option value="">Select Degree / Course</option>
                                {COURSES.map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </SelectField>

                              <SelectField
                                label="Branch / Department"
                                value={member.branch || ''}
                                onChange={e => handleMemberChange(idx, 'branch', e.target.value)}
                                icon={Binary}
                              >
                                <option value="">Select Branch</option>
                                {BRANCHES.map(b => (
                                  <option key={b} value={b}>{b}</option>
                                ))}
                              </SelectField>

                              <SelectField
                                label="Academic Year"
                                value={member.year || ''}
                                onChange={e => handleMemberChange(idx, 'year', e.target.value)}
                                icon={Target}
                              >
                                <option value="">Select Year</option>
                                {YEARS.map(y => (
                                  <option key={y} value={y}>{y}</option>
                                ))}
                              </SelectField>
                            </div>
                          </Motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </Motion.div>
              )}

              {/* STEP 2: REVIEW & SUBMIT */}
              {step === 2 && (
                <Motion.div
                  key="step2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <Motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="inline-block mb-4 p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl"
                    >
                      <Check className="w-8 h-8 text-emerald-400" />
                    </Motion.div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
                      Review Your Registration
                    </h2>
                    <p className="text-white/50 text-xs sm:text-sm font-medium mt-1">
                      Verify all information carefully before final submission
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
                    {/* Event & Leader Summary */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                          <Trophy size={18} />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold block">
                            Arena Summary
                          </span>
                          <h4 className="text-sm font-bold text-white">
                            {activeEventObj?.label || formData.event}
                          </h4>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs sm:text-sm">
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-gray-400">Category:</span>
                          <span className="text-white font-bold">{activeEventObj?.category || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-gray-400">Team Name:</span>
                          <span className="text-cyan-300 font-bold">{formData.teamName}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-gray-400">Team Size:</span>
                          <span className="text-white font-bold">{formData.teamSize} Member(s)</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-gray-400">Leader Name:</span>
                          <span className="text-white font-semibold">{formData.leaderName}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-gray-400">Leader Email:</span>
                          <span className="text-indigo-300 font-mono text-xs">{formData.leaderEmail}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-gray-400">Leader Phone:</span>
                          <span className="text-white font-mono">{formData.leaderMobile}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                          <span className="text-gray-400">College:</span>
                          <span className="text-white font-semibold truncate max-w-[200px]" title={formData.college === 'OTHER' ? formData.customCollege : formData.college}>
                            {formData.college === 'OTHER' ? formData.customCollege : formData.college}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Team Roster & Confirmation */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-3">
                        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                            <Users size={18} />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold block">
                              Teammates Roster
                            </span>
                            <h4 className="text-sm font-bold text-white">
                              {formData.members.length > 0 ? `${formData.members.length} Member(s)` : 'Solo Competitor'}
                            </h4>
                          </div>
                        </div>

                        {formData.members.length === 0 ? (
                          <p className="text-xs text-gray-400 py-3">
                            Solo Entry — No additional teammates.
                          </p>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {formData.members.map((m, i) => (
                              <div key={i} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                                <div>
                                  <p className="font-bold text-white">{m.name || `Member ${i + 2}`}</p>
                                  <p className="text-[11px] text-gray-400 font-mono">{m.email}</p>
                                </div>
                                <span className="text-[10px] text-blue-400 font-mono">Member #{i + 2}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Final Confirmation Note */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-start gap-3.5">
                        <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                        <div className="text-left text-xs leading-relaxed text-gray-300">
                          <strong className="text-white block mb-0.5">Ready for CROSSROADS 2027</strong>
                          By completing this registration, you confirm that all entered credentials are correct. An official confirmation email with your unique Team ID will be dispatched to <span className="text-emerald-300 font-semibold">{formData.leaderEmail}</span>.
                        </div>
                      </div>
                    </div>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stepper Footer Controls */}
          <div className="p-6 sm:p-8 border-t border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all cursor-pointer"
              >
                <ChevronLeft size={18} /> Back
              </button>
            ) : <div />}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 cursor-pointer"
              >
                Continue <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={submitForm}
                disabled={loading || !siteSettings.registrationOpen}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-12 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Registering Team...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <Check size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </Motion.div>
      </div>

      {/* Floating Bottom Error Toast (CodeArambh style) */}
      <AnimatePresence>
        {error && (
          <Motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-4"
          >
            <div className="bg-gradient-to-r from-red-950/95 to-red-900/90 backdrop-blur-2xl border border-red-500/50 p-4 sm:p-5 rounded-2xl flex items-center gap-3.5 shadow-2xl shadow-red-500/20">
              <AlertCircle size={20} className="text-red-400 shrink-0" />
              <p className="text-white text-xs sm:text-sm font-semibold flex-1 text-left">
                {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal (CodeArambh style) */}
      <AnimatePresence>
        {registeredDetails && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-[#05020c]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
          >
            <Motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-lg w-full bg-gradient-to-br from-[#12162a]/95 via-[#0b0e1e]/95 to-[#12162a]/95 border border-blue-500/40 p-6 sm:p-8 rounded-3xl shadow-[0_0_60px_rgba(59,130,246,0.3)] overflow-hidden text-center my-auto"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 shadow-[0_0_12px_#3b82f6]" />

              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={30} />
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-mono text-white mb-1 uppercase tracking-wide">
                Registration Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed">
                Your team is registered for CROSSROADS 2027. Save your official credentials below.
              </p>

              {/* Unique Team ID Display */}
              <div className="space-y-4 text-left mb-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-blue-400/80 block font-mono">
                    Official Team Registration ID
                  </label>
                  <div className="flex gap-2 items-center bg-black/50 border border-blue-500/30 px-4 py-3 rounded-xl font-mono text-xs sm:text-sm text-cyan-300">
                    <span className="flex-1 select-all font-bold tracking-wide truncate">
                      {registeredDetails.teamId}
                    </span>
                    <button
                      onClick={() => handleCopy(registeredDetails.teamId, 'teamId')}
                      className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500 hover:text-white transition-all text-xs flex items-center gap-1 font-sans shrink-0 cursor-pointer"
                    >
                      {copiedField === 'teamId' ? (
                        <>
                          <Check size={14} />
                          <span className="text-[10px] font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span className="text-[10px] font-bold">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Team Name:</span>
                    <span className="text-white font-bold">{registeredDetails.teamName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Competition Arena:</span>
                    <span className="text-cyan-300 font-bold">{registeredDetails.eventLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Confirmation Sent To:</span>
                    <span className="text-indigo-300 font-mono">{registeredDetails.leaderEmail}</span>
                  </div>
                </div>
              </div>

              {/* Official WhatsApp Group */}
              <a
                href="https://chat.whatsapp.com/HR09HaxGTWmBiOKdAvwsg4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 border border-emerald-400 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all font-mono mb-3 cursor-pointer"
              >
                <FaWhatsapp size={18} />
                <span>Join Official WhatsApp Community</span>
              </a>

              <button
                onClick={() => navigate('/events')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer font-mono"
              >
                <span>Back to Events</span>
                <ChevronRight size={16} />
              </button>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
};

export default EventRegistration;
