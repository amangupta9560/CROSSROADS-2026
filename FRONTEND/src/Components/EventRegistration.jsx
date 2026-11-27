import {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  AlertCircle,
  Binary,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  Globe,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  Rocket,
  ShieldCheck,
  Target,
  Trophy,
  User,
  Users,
  X,
} from 'lucide-react';
import './home/lostCivilization.css';
import StackingChapter from './about/StackingChapter.jsx';
import FloatingParticles from './home/FloatingParticles.jsx';
import { CornerFiligree, TempleDivider } from './home/OrnamentDivider.jsx';
import GhostTypeText from './about/GhostTypeText.jsx';
import {
  AncientSunDisc,
  JungleFoliageLeft,
  JungleFoliageRight,
} from './about/JungleCanopyVectors.jsx';
import {
  ALL_EVENTS,
  BRANCHES,
  COLLEGES,
  COURSES,
  LS_KEY,
  STEPS,
  YEARS,
} from './registration/registrationData.js';
import {
  StoneInputField,
  StoneSelectField,
  TempleProgressBar,
} from './registration/RegistrationFields.jsx';
import {
  RegistrationSuccessModal,
  RulesModal,
} from './registration/RegistrationModals.jsx';

const RegistrationVaultBackdrop = lazy(() =>
  import('./registration/RegistrationVaultBackdrop.jsx')
);

const REG_COMPLETIONS = [
  'Forge your official CROSSROADS 2027 squad pass.',
  'Instant Team ID & email confirmation upon submission.',
  'Free entry across 11 arenas at HIET Ghaziabad.',
];

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function checkWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

function resizeMembersList(
  targetSize,
  prevMembers = [],
  defaultCourse = '',
  defaultBranch = '',
  defaultYear = ''
) {
  const requiredAdditional = Math.max(0, targetSize - 1);
  const updated = [...prevMembers];
  while (updated.length < requiredAdditional) {
    updated.push({
      name: '',
      email: '',
      mobile: '',
      course: defaultCourse,
      branch: defaultBranch,
      year: defaultYear,
    });
  }
  return updated.slice(0, requiredAdditional);
}

const EventRegistration = () => {
  const [searchParams] = useSearchParams();
  const urlEvent = searchParams.get('event');
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [webGLOk, setWebGLOk] = useState(() => checkWebGL());
  const [isPhone, setIsPhone] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const heroRef = useRef(null);
  const chamberRef = useRef(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroBgScale = useTransform(heroScroll, [0, 1], [1.03, 1.18]);
  const heroDiscRotate = useTransform(heroScroll, [0, 1], [0, 52]);
  const heroContentY = useTransform(heroScroll, [0, 1], [0, 38]);

  const { scrollYProgress: chamberScroll } = useScroll({
    target: chamberRef,
    offset: ['start end', 'end start'],
  });
  const chamberTextureY = useTransform(chamberScroll, [0, 1], [-30, 30]);
  const chamberWatermarkX = useTransform(chamberScroll, [0, 1], ['-10%', '14%']);

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
    eventStatus: {},
  });

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
          event: urlEvent || parsed.event || '',
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
      members: [],
    };
  });

  const [registeredDetails, setRegisteredDetails] = useState(null);

  useEffect(() => {
    const onResize = () => setIsPhone(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (registeredDetails) return undefined;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(formData));
      } catch {
        // Ignore storage quota errors
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [formData, registeredDetails]);

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

  useEffect(() => {
    if (!urlEvent) return;
    const match = ALL_EVENTS.find((e) => e.value === urlEvent);
    if (!match) return;
    const targetSize = match.allowedSizes[0];
    setFormData((prev) => ({
      ...prev,
      event: match.value,
      teamSize: targetSize.toString(),
      members: resizeMembersList(
        targetSize,
        prev.members,
        prev.course,
        prev.branch,
        prev.year
      ),
    }));
  }, [urlEvent]);

  const activeEventObj = useMemo(
    () => ALL_EVENTS.find((e) => e.value === formData.event),
    [formData.event]
  );

  const syncMembersForSize = (targetSize) => {
    setFormData((prev) => ({
      ...prev,
      teamSize: targetSize.toString(),
      members: resizeMembersList(
        targetSize,
        prev.members,
        prev.course,
        prev.branch,
        prev.year
      ),
    }));
  };

  const handleEventSelect = (eventVal) => {
    const ev = ALL_EVENTS.find((e) => e.value === eventVal);
    if (!ev) return;

    if (siteSettings.eventStatus && siteSettings.eventStatus[eventVal] === false) {
      setError(`Registrations for ${ev.label} are currently closed.`);
      return;
    }

    let targetSize = parseInt(formData.teamSize, 10);
    if (!ev.allowedSizes.includes(targetSize)) {
      targetSize = ev.allowedSizes[0];
    }

    setFormData((prev) => ({
      ...prev,
      event: eventVal,
      teamSize: targetSize.toString(),
      members: resizeMembersList(
        targetSize,
        prev.members,
        prev.course,
        prev.branch,
        prev.year
      ),
    }));
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
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '')
          ? ''
          : 'Valid email required';
      case 'leaderMobile':
        return /^[6-9]\d{9}$/.test(value || '')
          ? ''
          : 'Valid 10-digit number required';
      case 'leaderWhatsapp':
        return /^[6-9]\d{9}$/.test(value || '')
          ? ''
          : 'Valid 10-digit WhatsApp number required';
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
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'leaderMobile' && sameAsCalling) {
        next.leaderWhatsapp = value;
      }
      return next;
    });
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSameAsCallingToggle = () => {
    setSameAsCalling((prev) => {
      const next = !prev;
      if (next) {
        setFormData((curr) => ({ ...curr, leaderWhatsapp: curr.leaderMobile }));
        setFieldErrors((curr) => ({
          ...curr,
          leaderWhatsapp: validate('leaderWhatsapp', formData.leaderMobile),
        }));
      }
      return next;
    });
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.members];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, members: updated }));
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const completionProgress = useMemo(() => {
    const reqFields = [
      'event',
      'teamName',
      'leaderName',
      'leaderEmail',
      'leaderMobile',
      'leaderWhatsapp',
      'college',
      'course',
      'branch',
      'year',
    ];
    const filled = reqFields.filter(
      (f) => formData[f] && !validate(f, formData[f])
    ).length;
    let basePct = (filled / reqFields.length) * 60;
    if (step >= 1) basePct += 20;
    if (step >= 2) basePct += 20;
    return Math.min(100, Math.floor(basePct));
  }, [formData, step, validate]);

  const nextStep = () => {
    setError(null);
    if (step === 0) {
      if (!siteSettings.registrationOpen) {
        return setError(
          siteSettings.closedMessage || 'Registrations are currently closed.'
        );
      }
      if (!formData.event) {
        return setError('Please select an event arena to continue.');
      }
      if (
        siteSettings.eventStatus &&
        siteSettings.eventStatus[formData.event] === false
      ) {
        return setError('Registrations for this selected event are closed.');
      }

      const step0Fields = [
        'event',
        'teamName',
        'leaderName',
        'leaderEmail',
        'leaderMobile',
        'leaderWhatsapp',
        'college',
        'course',
        'branch',
        'year',
      ];
      const newErrors = {};
      step0Fields.forEach((f) => {
        newErrors[f] = validate(f, formData[f]);
      });

      if (formData.college === 'OTHER' && !formData.customCollege?.trim()) {
        newErrors.customCollege = 'Please enter your custom college name';
      }

      setFieldErrors((prev) => ({ ...prev, ...newErrors }));
      setTouched((prev) => {
        const allTouched = { ...prev };
        step0Fields.forEach((f) => {
          allTouched[f] = true;
        });
        return allTouched;
      });

      if (Object.values(newErrors).some(Boolean)) {
        return setError('Please review and complete all required fields.');
      }
    }

    if (step === 1) {
      const teamSizeNum = parseInt(formData.teamSize, 10);
      if (teamSizeNum > 1) {
        for (let i = 0; i < formData.members.length; i += 1) {
          const m = formData.members[i];
          if (!m.name || !m.name.trim()) {
            return setError(
              `Please enter the full name for Teammate ${i + 2}.`
            );
          }
          if (
            !m.email ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim())
          ) {
            return setError(
              `Please provide a valid email address for Teammate ${i + 2}.`
            );
          }
        }

        const leaderEmail = formData.leaderEmail.trim().toLowerCase();
        const memberEmails = formData.members.map((m) =>
          m.email.trim().toLowerCase()
        );
        const allEmails = [leaderEmail, ...memberEmails];
        if (new Set(allEmails).size !== allEmails.length) {
          return setError(
            'All team emails must be unique. Duplicate email found within your team.'
          );
        }

        const leaderMobile = formData.leaderMobile.trim();
        const memberMobiles = formData.members
          .map((m) => m.mobile?.trim())
          .filter(Boolean);
        const allMobiles = [leaderMobile, ...memberMobiles];
        if (new Set(allMobiles).size !== allMobiles.length) {
          return setError('All mobile numbers within the team must be unique.');
        }
      }
    }

    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitForm = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!siteSettings.registrationOpen) {
        setLoading(false);
        return setError(
          siteSettings.closedMessage || 'Registrations are currently closed.'
        );
      }

      const teamSizeNum = parseInt(formData.teamSize, 10);
      const finalCollege =
        formData.college === 'OTHER'
          ? formData.customCollege?.trim() || 'Other'
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
        members: formData.members.map((m) => ({
          name: m.name.trim(),
          email: m.email.trim().toLowerCase(),
        })),
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
          teamSize: teamSizeNum,
        });
      }
    } catch (err) {
      console.error('Registration submission failed:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please check network connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const show3DVault = webGLOk && !isPhone && !prefersReduced;

  return (
    <main className="lc-root min-h-[100dvh] overflow-x-clip relative selection:bg-[#C69B43] selection:text-[#080D0B]">
      {/* Chapter 01: Sacred Vault Gateway Hero (distinct temple-gateway + arena-code-puzzle + 3D Chest backdrop) */}
      <StackingChapter anchorId="reg-hero" zIndex={10} isFirst>
        <section
          ref={heroRef}
          aria-label="Registration Vault Header"
          className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#080D0B]"
        >
          <Motion.div
            aria-hidden="true"
            style={!prefersReduced ? { scale: heroBgScale } : undefined}
            className="absolute inset-0 pointer-events-none will-change-transform"
          >
            <img
              src="/assets/lost-civilization/temple-gateway.webp"
              alt="CROSSROADS 2027 Registration Gateway"
              className="w-full h-full object-cover opacity-40"
              fetchPriority="high"
            />
            <img
              src="/assets/lost-civilization/arena-code-puzzle.webp"
              alt=""
              className="w-full h-full object-cover opacity-18 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(198,155,67,0.16)_0%,rgba(16,29,22,0.74)_52%,rgba(8,13,11,0.98)_100%)]" />
          </Motion.div>

          <Motion.div
            aria-hidden="true"
            style={!prefersReduced ? { rotate: heroDiscRotate } : undefined}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] sm:w-[42rem] opacity-[0.08] z-[1] text-[#C69B43] will-change-transform"
          >
            <AncientSunDisc className="w-full h-auto" />
          </Motion.div>

          {show3DVault && (
            <div className="absolute inset-0 z-[1] pointer-events-none">
              <WebGLErrorBoundary onError={() => setWebGLOk(false)}>
                <Suspense fallback={null}>
                  <RegistrationVaultBackdrop
                    reducedMotion={!!prefersReduced}
                    onWebGLError={() => setWebGLOk(false)}
                  />
                </Suspense>
              </WebGLErrorBoundary>
            </div>
          )}

          <div
            aria-hidden="true"
            className="hidden md:flex absolute inset-x-0 bottom-0 justify-between pointer-events-none opacity-65 z-[2]"
          >
            <JungleFoliageLeft className="w-40 lg:w-56 h-auto" />
            <JungleFoliageRight className="w-40 lg:w-56 h-auto" />
          </div>

          <FloatingParticles density="sparse" />

          <Motion.div
            style={!prefersReduced ? { y: heroContentY } : undefined}
            className="relative z-10 max-w-5xl mx-auto will-change-transform"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-3 bg-[#101D16]/90 px-4 py-1.5 rounded-sm border border-[#C69B43]/45 text-[#E8C574] shadow-lg">
                  <Rocket className="w-3.5 h-3.5 text-[#C69B43]" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] font-mono">
                    CROSSROADS 2027 • Official Registration
                  </span>
                </div>

                <h1 className="lc-font-display text-3xl sm:text-5xl lg:text-6xl font-black text-[#E8DFC8] tracking-wide">
                  EVENT <span className="lc-gold-text">REGISTRATION</span>
                </h1>

                <p className="text-[#E8DFC8]/70 text-xs sm:text-sm mt-2 font-semibold uppercase tracking-[0.18em]">
                  Inter-College Technical &amp; Cultural Fest • HIET Ghaziabad
                </p>

                <div className="min-h-[1.5rem] flex items-center justify-center md:justify-start gap-2 mt-2 text-xs text-[#E8C574]/90">
                  <Compass className="w-3.5 h-3.5 text-[#C69B43] shrink-0" />
                  <GhostTypeText
                    text="Vault Seal: "
                    completions={REG_COMPLETIONS}
                    as="span"
                    className="font-mono text-xs"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-emerald-950/75 border border-emerald-400/45 text-emerald-300 font-mono text-[10px] sm:text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    Reg: <strong className="text-[#E8DFC8]">Jan 10 – Jan 31, 2027</strong>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/40 text-[#E8C574] font-mono text-[10px] sm:text-[11px] font-bold">
                    Event: <strong className="text-[#E8DFC8]">05 &amp; 06 Feb 2027</strong>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-sm bg-[#182B20]/90 border border-[#C69B43]/45 text-[#E8C574] font-mono text-[10px] sm:text-[11px] font-bold">
                    <Trophy className="w-3.5 h-3.5 text-[#E8C574]" />
                    Total Prize Pool: <strong className="text-[#E8DFC8]">₹1,00,000+</strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsRulesOpen(true)}
                  className="lc-gold-btn lc-font-heading flex items-center gap-2 px-5 py-3 rounded-sm font-extrabold text-xs uppercase tracking-[0.16em] cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  <span>Guidelines</span>
                </button>

                <Link
                  to="/events"
                  className="lc-stone-btn lc-font-heading flex items-center gap-2 px-5 py-3 rounded-sm font-bold text-xs uppercase tracking-[0.16em] cursor-pointer"
                >
                  <ExternalLink size={15} className="text-[#C69B43]" />
                  <span>View 11 Arenas</span>
                </Link>
              </div>
            </div>
          </Motion.div>
        </section>
      </StackingChapter>

      {/* Chapter 02: Carved Stone Altar Multi-Step Registration Wizard (distinct moss-stone + parchment background) */}
      <StackingChapter anchorId="reg-chamber" zIndex={20} isLast>
        <section
          ref={chamberRef}
          aria-label="Registration Form Chamber"
          className="relative py-12 sm:py-20 px-3 sm:px-6 lg:px-8 bg-[#0C1611] overflow-hidden"
        >
          <Motion.div
            aria-hidden="true"
            style={!prefersReduced ? { y: chamberTextureY } : undefined}
            className="absolute -inset-8 pointer-events-none will-change-transform"
          >
            <img
              src="/assets/lost-civilization/moss-stone-texture.webp"
              alt=""
              loading="lazy"
              className="w-full h-full object-cover opacity-22"
            />
          </Motion.div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[#080D0B]/92 via-[#0D1812]/74 to-[#080D0B]/96 pointer-events-none"
          />

          <FloatingParticles density="sparse" />

          <div
            aria-hidden="true"
            className="pointer-events-none select-none overflow-hidden mb-8 relative z-[2]"
          >
            <Motion.div
              style={!prefersReduced ? { x: chamberWatermarkX } : undefined}
              className="lc-watermark-text text-[2rem] sm:text-[3.8rem] lg:text-[5rem] whitespace-nowrap leading-none text-center will-change-transform"
            >
              CLAIM YOUR EXPEDITION PASS • CROSSROADS 2027
            </Motion.div>
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            {!siteSettings.registrationOpen && (
              <div className="mb-6 p-4 rounded-lg bg-red-950/60 border border-red-400/50 text-red-200 text-sm flex items-center gap-3">
                <AlertCircle size={20} className="text-red-400 shrink-0" />
                <p className="font-semibold">
                  {siteSettings.closedMessage ||
                    'Online registrations for CROSSROADS 2027 are currently closed.'}
                </p>
              </div>
            )}

            <div className="relative lc-stone-surface lc-carved-border rounded-2xl shadow-[0_32px_90px_rgba(4,7,5,0.85)] overflow-hidden">
              <TempleProgressBar progress={completionProgress} />
              <CornerFiligree className="top-3 left-3 opacity-60" />
              <CornerFiligree className="top-3 right-3 rotate-90 opacity-60" />

              {/* Stepper Header (Desktop) */}
              <div className="hidden lg:flex items-center justify-between p-8 sm:p-10 border-b border-[#C69B43]/20 relative bg-[#080D0B]/40">
                <div className="absolute left-[15%] right-[15%] top-[54px] h-[1px] bg-[#C69B43]/20 z-0" />
                <Motion.div
                  className="absolute left-[15%] top-[54px] h-[2px] bg-gradient-to-r from-[#B86B35] via-[#E8C574] to-[#C69B43] z-0"
                  initial={{ width: '0%' }}
                  animate={{
                    width: step === 0 ? '0%' : step === 1 ? '35%' : '70%',
                  }}
                  transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                />

                {STEPS.map((label, i) => (
                  <div
                    key={label}
                    className="flex-1 flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-13 h-13 rounded-xl flex items-center justify-center font-black text-sm transition-all border ${
                        step > i
                          ? 'bg-gradient-to-br from-emerald-600 to-emerald-800 border-emerald-400 text-white shadow-[0_0_16px_rgba(16,185,129,0.35)]'
                          : step === i
                          ? 'bg-gradient-to-br from-[#E8C574] to-[#9E6327] border-[#FFF2B2] text-[#080D0B] shadow-[0_0_24px_rgba(232,197,116,0.45)]'
                          : 'bg-[#0B140F] border-[#C69B43]/25 text-[#E8DFC8]/40'
                      }`}
                    >
                      {step > i ? <Check size={22} /> : i + 1}
                    </div>
                    <span
                      className={`lc-font-heading text-[11px] mt-3 font-bold uppercase tracking-[0.16em] ${
                        step >= i ? 'text-[#E8C574]' : 'text-[#E8DFC8]/40'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stepper Header (Mobile) */}
              <div className="lg:hidden px-4 sm:px-6 py-5 border-b border-[#C69B43]/20 bg-[#080D0B]/40">
                <div className="flex justify-between items-center mb-3 gap-2">
                  {STEPS.map((label, i) => (
                    <div
                      key={label}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        step >= i
                          ? 'bg-gradient-to-r from-[#B86B35] to-[#E8C574]'
                          : 'bg-[#182B20]'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-center lc-font-heading text-[11px] text-[#E8C574] font-bold uppercase tracking-[0.2em]">
                  Step {step + 1} of {STEPS.length}: {STEPS[step]}
                </p>
              </div>

              {/* Form Body */}
              <div className="p-5 sm:p-8 md:p-11">
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <Motion.div
                      key="step0"
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-8"
                    >
                      <div className="space-y-3 text-left">
                        <label className="lc-font-heading text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[#E8C574] ml-1 flex items-center gap-2">
                          <Trophy size={16} />
                          <span>Select Competition Arena *</span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                          {ALL_EVENTS.map((ev) => {
                            const ArenaIcon = ev.icon;
                            const isSelected = formData.event === ev.value;
                            const isClosed =
                              siteSettings.eventStatus &&
                              siteSettings.eventStatus[ev.value] === false;

                            return (
                              <button
                                key={ev.value}
                                type="button"
                                disabled={isClosed}
                                onClick={() => !isClosed && handleEventSelect(ev.value)}
                                className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between ${
                                  isClosed
                                    ? 'opacity-40 cursor-not-allowed bg-[#0B130E] border-[#C69B43]/15'
                                    : isSelected
                                    ? 'bg-gradient-to-br from-[#243D2C] to-[#101D16] border-[#E8C574] shadow-[0_12px_30px_rgba(198,155,67,0.22)] scale-[1.01] cursor-pointer'
                                    : 'bg-[#080D0B]/70 border-[#C69B43]/25 hover:border-[#C69B43]/60 hover:bg-[#101D16]/90 cursor-pointer'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-2.5">
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#E8C574] font-bold px-2 py-0.5 rounded bg-[#182B20] border border-[#C69B43]/35">
                                      <ArenaIcon size={11} />
                                      <span>{ev.category}</span>
                                    </span>
                                    <span className="text-[10px] font-mono text-[#E8DFC8]/65 font-semibold">
                                      {ev.badge}
                                    </span>
                                  </div>
                                  <h4 className="lc-font-heading text-sm font-bold text-[#E8DFC8] leading-snug">
                                    {ev.label}
                                  </h4>
                                  <p className="text-[11px] text-[#E8DFC8]/65 mt-1 line-clamp-2">
                                    {ev.desc}
                                  </p>
                                </div>

                                <div className="mt-3 pt-2 border-t border-[#C69B43]/15 flex items-center justify-between">
                                  <span className="text-[10px] text-[#E8C574] font-semibold font-mono">
                                    {isSelected
                                      ? '✓ Selected'
                                      : isClosed
                                      ? 'Closed'
                                      : 'Click to Select'}
                                  </span>
                                  {isSelected && (
                                    <span className="w-2 h-2 rounded-full bg-[#E8C574] animate-pulse" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {touched.event && fieldErrors.event && (
                          <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider ml-2">
                            {fieldErrors.event}
                          </p>
                        )}
                      </div>

                      <TempleDivider />

                      <div className="space-y-6">
                        <h3 className="lc-font-heading text-sm sm:text-base font-bold text-[#E8DFC8] uppercase tracking-[0.16em] flex items-center gap-2">
                          <User size={18} className="text-[#C69B43]" />
                          <span>Team Leader &amp; Institution Credentials</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                          <StoneInputField
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

                          <StoneInputField
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

                          <StoneInputField
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

                          <StoneInputField
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
                            <StoneInputField
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
                            <label className="flex items-center gap-2 text-xs text-[#E8C574] cursor-pointer ml-1 select-none">
                              <input
                                type="checkbox"
                                checked={sameAsCalling}
                                onChange={handleSameAsCallingToggle}
                                className="rounded border-[#C69B43]/50 text-[#C69B43] focus:ring-[#E8C574] bg-[#080D0B] cursor-pointer"
                              />
                              <span>Same as Calling Number</span>
                            </label>
                          </div>

                          <StoneSelectField
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
                            {COLLEGES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </StoneSelectField>

                          {formData.college === 'OTHER' && (
                            <div className="md:col-span-2">
                              <StoneInputField
                                label="Specify Your College / Institute Name"
                                name="customCollege"
                                placeholder="Full name of your College / University"
                                value={formData.customCollege}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={fieldErrors.customCollege}
                                touched={touched.customCollege}
                                icon={Globe}
                              />
                            </div>
                          )}

                          <StoneSelectField
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
                            {COURSES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </StoneSelectField>

                          <StoneSelectField
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
                            {BRANCHES.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </StoneSelectField>

                          <StoneSelectField
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
                            {YEARS.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </StoneSelectField>
                        </div>
                      </div>
                    </Motion.div>
                  )}

                  {step === 1 && (
                    <Motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-8"
                    >
                      <div className="p-4 sm:p-5 rounded-xl bg-[#101D16]/90 border border-[#C69B43]/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-[#182B20] border border-[#C69B43]/40 rounded-lg text-[#E8C574] shrink-0">
                            <Users size={20} />
                          </div>
                          <div className="text-left">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C69B43] font-bold block">
                              Arena: {activeEventObj?.label || 'Selected Event'}
                            </span>
                            <h3 className="lc-font-heading text-base sm:text-lg font-bold text-[#E8DFC8]">
                              Configure Team Size
                            </h3>
                            <p className="text-xs text-[#E8DFC8]/70">
                              Allowed: {activeEventObj?.badge || '1-4 Members'} (Including
                              Team Leader)
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                          {activeEventObj?.allowedSizes.map((size) => {
                            const isCurrent = parseInt(formData.teamSize, 10) === size;
                            const labelText =
                              size === 1
                                ? 'Solo (1 Member)'
                                : `${size} Members Total`;

                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => handleTeamSizeChange(size)}
                                className={`px-3.5 py-2 rounded-sm lc-font-heading text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'lc-gold-btn shadow-lg'
                                    : 'lc-stone-btn text-[#E8DFC8]/80'
                                }`}
                              >
                                {labelText}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {parseInt(formData.teamSize, 10) === 1 && (
                        <div className="p-8 sm:p-12 rounded-xl bg-[#080D0B]/70 border border-[#C69B43]/25 text-center space-y-3">
                          <div className="w-14 h-14 mx-auto rounded-full bg-[#182B20] border border-[#C69B43]/45 flex items-center justify-center text-[#E8C574]">
                            <User size={28} />
                          </div>
                          <h4 className="lc-font-heading text-lg font-bold text-[#E8DFC8]">
                            Solo Participant Arena
                          </h4>
                          <p className="text-sm text-[#E8DFC8]/75 max-w-md mx-auto leading-relaxed">
                            You have selected a solo participation format. The Team Leader (
                            <strong className="text-[#E8C574]">
                              {formData.leaderName || 'You'}
                            </strong>
                            ) will compete individually. No additional team members are required.
                          </p>
                          <p className="text-xs text-[#C69B43] font-mono pt-2">
                            Click &quot;Continue&quot; below to review and confirm your registration.
                          </p>
                        </div>
                      )}

                      {parseInt(formData.teamSize, 10) > 1 && (
                        <div className="space-y-5 text-left">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h4 className="lc-font-heading text-xs sm:text-sm font-bold text-[#E8C574] uppercase tracking-[0.16em]">
                              Teammates Roster ({formData.members.length} Additional Members)
                            </h4>
                            <span className="text-xs text-[#E8DFC8]/65">
                              All members will be CC&apos;d on confirmation emails
                            </span>
                          </div>

                          <div className="space-y-4">
                            {formData.members.map((member, idx) => (
                              <div
                                key={idx}
                                className="p-5 sm:p-6 rounded-xl bg-[#080D0B]/75 border border-[#C69B43]/30 space-y-4"
                              >
                                <div className="flex items-center gap-2.5 text-[#E8C574] font-bold text-xs uppercase tracking-widest font-mono">
                                  <div className="w-6 h-6 rounded bg-[#182B20] border border-[#C69B43]/45 flex items-center justify-center text-[#E8C574]">
                                    {idx + 2}
                                  </div>
                                  <span>Teammate {idx + 2} Details</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <StoneInputField
                                    label="Teammate Full Name *"
                                    placeholder="E.g. Priyanshu Singh"
                                    value={member.name}
                                    onChange={(e) =>
                                      handleMemberChange(idx, 'name', e.target.value)
                                    }
                                    icon={User}
                                  />

                                  <StoneInputField
                                    label="Teammate Email Address *"
                                    type="email"
                                    placeholder="teammate@example.com"
                                    value={member.email}
                                    onChange={(e) =>
                                      handleMemberChange(idx, 'email', e.target.value)
                                    }
                                    icon={Mail}
                                  />

                                  <StoneInputField
                                    label="Teammate Phone (Optional)"
                                    type="tel"
                                    maxLength="10"
                                    placeholder="10-digit number"
                                    value={member.mobile || ''}
                                    onChange={(e) =>
                                      handleMemberChange(
                                        idx,
                                        'mobile',
                                        e.target.value.replace(/\D/g, '').slice(0, 10)
                                      )
                                    }
                                    icon={Phone}
                                  />

                                  <StoneSelectField
                                    label="Degree / Course"
                                    value={member.course || ''}
                                    onChange={(e) =>
                                      handleMemberChange(idx, 'course', e.target.value)
                                    }
                                    icon={GraduationCap}
                                  >
                                    <option value="">Select Degree / Course</option>
                                    {COURSES.map((c) => (
                                      <option key={c} value={c}>
                                        {c}
                                      </option>
                                    ))}
                                  </StoneSelectField>

                                  <StoneSelectField
                                    label="Branch / Department"
                                    value={member.branch || ''}
                                    onChange={(e) =>
                                      handleMemberChange(idx, 'branch', e.target.value)
                                    }
                                    icon={Binary}
                                  >
                                    <option value="">Select Branch</option>
                                    {BRANCHES.map((b) => (
                                      <option key={b} value={b}>
                                        {b}
                                      </option>
                                    ))}
                                  </StoneSelectField>

                                  <StoneSelectField
                                    label="Academic Year"
                                    value={member.year || ''}
                                    onChange={(e) =>
                                      handleMemberChange(idx, 'year', e.target.value)
                                    }
                                    icon={Target}
                                  >
                                    <option value="">Select Year</option>
                                    {YEARS.map((y) => (
                                      <option key={y} value={y}>
                                        {y}
                                      </option>
                                    ))}
                                  </StoneSelectField>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Motion.div>
                  )}

                  {step === 2 && (
                    <Motion.div
                      key="step2"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-8"
                    >
                      <div className="text-center">
                        <div className="inline-flex mb-4 p-3.5 bg-emerald-950/75 border border-emerald-400/45 rounded-xl text-emerald-300">
                          <Check className="w-7 h-7" />
                        </div>
                        <h2 className="lc-font-display text-2xl sm:text-3xl font-black text-[#E8DFC8] uppercase tracking-wider">
                          Review Your <span className="lc-gold-text">Registration</span>
                        </h2>
                        <p className="text-[#E8DFC8]/70 text-xs sm:text-sm font-medium mt-1">
                          Verify all information carefully before final submission
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div className="bg-[#080D0B]/75 border border-[#C69B43]/30 rounded-xl p-6 space-y-4">
                          <div className="flex items-center gap-3 pb-3 border-b border-[#C69B43]/20">
                            <div className="p-2 bg-[#182B20] border border-[#C69B43]/40 rounded-lg text-[#E8C574]">
                              <Trophy size={18} />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C69B43] font-bold block">
                                Arena Summary
                              </span>
                              <h4 className="lc-font-heading text-sm font-bold text-[#E8DFC8]">
                                {activeEventObj?.label || formData.event}
                              </h4>
                            </div>
                          </div>

                          <div className="space-y-3 text-xs sm:text-sm">
                            <div className="flex justify-between items-center py-1.5 border-b border-[#C69B43]/15">
                              <span className="text-[#E8DFC8]/65">Category:</span>
                              <span className="text-[#E8DFC8] font-bold">
                                {activeEventObj?.category || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-[#C69B43]/15">
                              <span className="text-[#E8DFC8]/65">Team Name:</span>
                              <span className="text-[#E8C574] font-bold">
                                {formData.teamName}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-[#C69B43]/15">
                              <span className="text-[#E8DFC8]/65">Team Size:</span>
                              <span className="text-[#E8DFC8] font-bold">
                                {formData.teamSize} Member(s)
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-[#C69B43]/15">
                              <span className="text-[#E8DFC8]/65">Leader Name:</span>
                              <span className="text-[#E8DFC8] font-semibold">
                                {formData.leaderName}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-[#C69B43]/15">
                              <span className="text-[#E8DFC8]/65">Leader Email:</span>
                              <span className="text-[#E8C574] font-mono text-xs truncate max-w-[200px]">
                                {formData.leaderEmail}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-[#C69B43]/15">
                              <span className="text-[#E8DFC8]/65">Leader Phone:</span>
                              <span className="text-[#E8DFC8] font-mono">
                                {formData.leaderMobile}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-1.5">
                              <span className="text-[#E8DFC8]/65">College:</span>
                              <span
                                className="text-[#E8DFC8] font-semibold truncate max-w-[200px]"
                                title={
                                  formData.college === 'OTHER'
                                    ? formData.customCollege
                                    : formData.college
                                }
                              >
                                {formData.college === 'OTHER'
                                  ? formData.customCollege
                                  : formData.college}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div className="bg-[#080D0B]/75 border border-[#C69B43]/30 rounded-xl p-6 space-y-3">
                            <div className="flex items-center gap-3 pb-3 border-b border-[#C69B43]/20">
                              <div className="p-2 bg-[#182B20] border border-[#C69B43]/40 rounded-lg text-[#E8C574]">
                                <Users size={18} />
                              </div>
                              <div>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C69B43] font-bold block">
                                  Teammates Roster
                                </span>
                                <h4 className="lc-font-heading text-sm font-bold text-[#E8DFC8]">
                                  {formData.members.length > 0
                                    ? `${formData.members.length} Member(s)`
                                    : 'Solo Competitor'}
                                </h4>
                              </div>
                            </div>

                            {formData.members.length === 0 ? (
                              <p className="text-xs text-[#E8DFC8]/70 py-3">
                                Solo Entry — No additional teammates.
                              </p>
                            ) : (
                              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {formData.members.map((m, i) => (
                                  <div
                                    key={i}
                                    className="p-2.5 rounded-lg bg-[#101D16]/85 border border-[#C69B43]/20 flex items-center justify-between text-xs"
                                  >
                                    <div className="min-w-0">
                                      <p className="font-bold text-[#E8DFC8] truncate">
                                        {m.name || `Member ${i + 2}`}
                                      </p>
                                      <p className="text-[11px] text-[#E8DFC8]/65 font-mono truncate">
                                        {m.email}
                                      </p>
                                    </div>
                                    <span className="text-[10px] text-[#E8C574] font-mono shrink-0 ml-2">
                                      Member #{i + 2}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="p-5 rounded-xl bg-emerald-950/45 border border-emerald-400/35 flex items-start gap-3.5">
                            <CheckCircle2
                              size={20}
                              className="text-emerald-300 shrink-0 mt-0.5"
                            />
                            <div className="text-left text-xs leading-relaxed text-[#E8DFC8]/85">
                              <strong className="text-[#E8C574] block mb-0.5">
                                Ready for CROSSROADS 2027
                              </strong>
                              By completing this registration, you confirm that all entered
                              credentials are correct. An official confirmation email with
                              your unique Team ID will be dispatched to{' '}
                              <span className="text-emerald-300 font-semibold">
                                {formData.leaderEmail}
                              </span>
                              .
                            </div>
                          </div>
                        </div>
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Wizard Controls */}
              <div className="p-5 sm:p-8 border-t border-[#C69B43]/20 bg-[#080D0B]/60 flex flex-col sm:flex-row justify-between items-center gap-4">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => prev - 1)}
                    className="lc-stone-btn lc-font-heading w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-sm font-bold text-xs uppercase tracking-[0.16em] cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="lc-gold-btn lc-font-heading w-full sm:w-auto flex items-center justify-center gap-2 px-9 py-3.5 rounded-sm font-extrabold text-xs uppercase tracking-[0.16em] cursor-pointer"
                  >
                    <span>Continue</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitForm}
                    disabled={loading || !siteSettings.registrationOpen}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3.5 rounded-sm bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-600 hover:to-green-600 border border-emerald-400/65 text-white lc-font-heading font-extrabold text-xs uppercase tracking-[0.16em] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Registering Team...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <Check size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </StackingChapter>

      {/* Bottom Error Toast */}
      <AnimatePresence>
        {error && (
          <Motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-[210] w-full max-w-md px-4"
          >
            <div className="bg-red-950/95 border border-red-400/55 p-4 rounded-xl flex items-center gap-3 shadow-2xl">
              <AlertCircle size={20} className="text-red-400 shrink-0" />
              <p className="text-white text-xs sm:text-sm font-semibold flex-1 text-left">
                {error}
              </p>
              <button
                type="button"
                onClick={() => setError(null)}
                aria-label="Dismiss error"
                className="p-1 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      <RegistrationSuccessModal
        registeredDetails={registeredDetails}
        copiedField={copiedField}
        onCopy={handleCopy}
        onNavigateEvents={() => navigate('/events')}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </main>
  );
};

export default EventRegistration;
