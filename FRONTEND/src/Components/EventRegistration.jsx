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
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  Binary,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  RotateCcw,
  Save,
  ShieldCheck,
  Target,
  Trophy,
  User,
  Users,
  X,
} from 'lucide-react';
import './home/lostCivilization.css';
import SeoHead from './common/SeoHead.jsx';
import Breadcrumbs from './common/Breadcrumbs.jsx';
import FloatingParticles from './home/FloatingParticles.jsx';
import { CornerFiligree } from './home/OrnamentDivider.jsx';
import {
  ROUTE_PATHS,
  SITE_URL,
  buildBreadcrumbJsonLd,
} from '../config/siteConfig.js';
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

const SETTINGS_CACHE_KEY = 'cr2027_settings_cache';
const PENDING_ISSUE_KEY = 'cr2027_pending_issue';

const DEFAULT_FORM_STATE = {
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
  event: '',
  teamSize: '1',
  members: [],
};

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

function loadSavedDraft(urlEvent) {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Support both new envelope { formData, step, sameAsCalling, savedAt } & legacy direct object
      const savedForm = parsed.formData || parsed;
      const initialEvent = urlEvent || savedForm.event || '';
      const matchedEv = ALL_EVENTS.find((e) => e.value === initialEvent);
      let initSize = parseInt(savedForm.teamSize || '1', 10);
      if (matchedEv && !matchedEv.allowedSizes.includes(initSize)) {
        initSize = matchedEv.allowedSizes[0];
      }
      const restoredForm = {
        ...DEFAULT_FORM_STATE,
        ...savedForm,
        event: initialEvent,
        teamSize: initSize.toString(),
        members: resizeMembersList(
          initSize,
          savedForm.members || [],
          savedForm.course || '',
          savedForm.branch || '',
          savedForm.year || ''
        ),
      };
      return {
        formData: restoredForm,
        step: typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 2 ? parsed.step : 0,
        sameAsCalling: Boolean(parsed.sameAsCalling),
        savedAt: parsed.savedAt || null,
      };
    }
  } catch {
    // Ignore corrupted storage
  }

  const matchedUrl = urlEvent ? ALL_EVENTS.find((e) => e.value === urlEvent) : null;
  const defaultSize = matchedUrl ? matchedUrl.allowedSizes[0] : 1;
  return {
    formData: {
      ...DEFAULT_FORM_STATE,
      event: matchedUrl ? matchedUrl.value : '',
      teamSize: defaultSize.toString(),
      members: resizeMembersList(defaultSize),
    },
    step: 0,
    sameAsCalling: false,
    savedAt: null,
  };
}

const EventRegistration = () => {
  const [searchParams] = useSearchParams();
  const urlEvent = searchParams.get('event');
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const submitBtnRef = useRef(null);
  const submittingRef = useRef(false);
  const [launchOrigin, setLaunchOrigin] = useState(null);

  const [webGLOk, setWebGLOk] = useState(() => checkWebGL());
  const [isPhone, setIsPhone] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const initialDraft = useMemo(() => loadSavedDraft(urlEvent), [urlEvent]);

  const [formData, setFormData] = useState(initialDraft.formData);
  const [step, setStep] = useState(initialDraft.step);
  const [sameAsCalling, setSameAsCalling] = useState(initialDraft.sameAsCalling);
  const [lastSavedAt, setLastSavedAt] = useState(initialDraft.savedAt);

  const [checkingStep, setCheckingStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const cached = sessionStorage.getItem(SETTINGS_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore storage errors
    }
    return {
      registrationOpen: true,
      closedMessage: '',
      eventStatus: {},
    };
  });

  const [registeredDetails, setRegisteredDetails] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const onResize = () => setIsPhone(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Auto-clear error alert banner cleanly after 5.5s so alerts never stick until browser refresh
  useEffect(() => {
    if (!error) return undefined;
    const t = setTimeout(() => setError(null), 5500);
    return () => clearTimeout(t);
  }, [error]);

  // Continuous visible autosave (fast 250ms debounce + beforeunload safety flush)
  const persistDraftNow = useCallback(
    (nextForm, nextStep, nextSame) => {
      if (registeredDetails) return;
      try {
        const nowIso = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        localStorage.setItem(
          LS_KEY,
          JSON.stringify({
            formData: nextForm,
            step: nextStep,
            sameAsCalling: nextSame,
            savedAt: nowIso,
          })
        );
        setLastSavedAt(nowIso);
      } catch {
        // Ignore storage quota errors
      }
    },
    [registeredDetails]
  );

  useEffect(() => {
    if (registeredDetails) return undefined;
    const timer = setTimeout(() => {
      persistDraftNow(formData, step, sameAsCalling);
    }, 250);
    return () => clearTimeout(timer);
  }, [formData, step, sameAsCalling, registeredDetails, persistDraftNow]);

  useEffect(() => {
    if (registeredDetails) return undefined;
    const onUnload = () => {
      persistDraftNow(formData, step, sameAsCalling);
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [formData, step, sameAsCalling, registeredDetails, persistDraftNow]);

  const handleResetDraft = () => {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }
    setFormData(DEFAULT_FORM_STATE);
    setStep(0);
    setSameAsCalling(false);
    setTouched({});
    setFieldErrors({});
    setError(null);
    setLastSavedAt(null);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const res = await axios.get(`${backendUrl}/api/settings`, { timeout: 5000 });
        if (res.data) {
          setSiteSettings(res.data);
          try {
            sessionStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(res.data));
          } catch {
            // ignore
          }
        }
      } catch {
        // Fallback to cached or default settings if API is temporarily unreachable
      }
    };
    fetchSettings();

    // Flush any queued client issue from an earlier network drop
    try {
      const pending = localStorage.getItem(PENDING_ISSUE_KEY);
      if (pending) {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        axios
          .post(`${backendUrl}/api/log-registration-issue`, JSON.parse(pending), { timeout: 5000 })
          .then(() => localStorage.removeItem(PENDING_ISSUE_KEY))
          .catch(() => {});
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const activeEventObj = useMemo(
    () => ALL_EVENTS.find((e) => e.value === formData.event),
    [formData.event]
  );

  const handleEventDropdownChange = (e) => {
    const eventVal = e.target.value;
    setTouched((prev) => ({ ...prev, event: true }));

    if (!eventVal) {
      setFormData((prev) => ({
        ...prev,
        event: '',
        teamSize: '1',
        members: [],
      }));
      setFieldErrors((prev) => ({
        ...prev,
        event: 'Please select an event arena',
      }));
      return;
    }

    const ev = ALL_EVENTS.find((item) => item.value === eventVal);
    if (!ev) return;

    if (siteSettings.eventStatus && siteSettings.eventStatus[eventVal] === false) {
      setError(`Registrations for ${ev.label} are currently closed.`);
      return;
    }

    const targetSize = ev.allowedSizes[0];
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
    setFieldErrors((prev) => ({ ...prev, event: '' }));
    setError(null);
  };

  const handleTeamSizeSelectChange = (sizeNum) => {
    setFormData((prev) => ({
      ...prev,
      teamSize: sizeNum.toString(),
      members: resizeMembersList(
        sizeNum,
        prev.members,
        prev.course,
        prev.branch,
        prev.year
      ),
    }));
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
    const errKey = `members.${index}.${field}`;
    setFieldErrors((prev) => {
      if (!prev[errKey]) return prev;
      const copy = { ...prev };
      delete copy[errKey];
      return copy;
    });
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Focus & jump to exact conflicting field so user can edit immediately
  const focusConflictField = useCallback((field, targetStep, msg) => {
    if (typeof targetStep === 'number') {
      setStep(targetStep);
    }
    if (field) {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setFieldErrors((prev) => ({ ...prev, [field]: msg }));
      setTimeout(() => {
        const el = document.querySelector(`[name="${field}"]`);
        if (el && typeof el.focus === 'function') {
          el.focus({ preventScroll: false });
        }
      }, 120);
    }
    setError(msg);
  }, []);

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

  const nextStep = async () => {
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

      // Live DB availability check for Team Name + Leader Email + Leader Mobile + 2-Event Cap
      try {
        setCheckingStep(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const res = await axios.post(
          `${backendUrl}/api/check-availability`,
          {
            teamName: formData.teamName.trim(),
            leaderEmail: formData.leaderEmail.trim().toLowerCase(),
            leaderMobile: formData.leaderMobile.trim(),
            leaderWhatsapp: formData.leaderWhatsapp.trim(),
            event: formData.event,
            members: [],
          },
          { timeout: 5000 }
        );
        if (res.data && res.data.available === false) {
          return focusConflictField(
            res.data.field,
            res.data.step ?? 0,
            res.data.message
          );
        }
      } catch {
        // Non-fatal if pre-check offline; enforced again atomically on final submit
      } finally {
        setCheckingStep(false);
      }
    }

    if (step === 1) {
      const teamSizeNum = parseInt(formData.teamSize, 10);
      if (teamSizeNum > 1) {
        const memberErrors = {};
        const memberTouched = {};

        for (let i = 0; i < formData.members.length; i += 1) {
          const m = formData.members[i];
          if (!m.name || !m.name.trim()) {
            memberErrors[`members.${i}.name`] = 'Name required';
            memberTouched[`members.${i}.name`] = true;
          }
          if (!m.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim())) {
            memberErrors[`members.${i}.email`] = 'Valid email required';
            memberTouched[`members.${i}.email`] = true;
          }
          if (!m.mobile || !/^[6-9]\d{9}$/.test(String(m.mobile).trim())) {
            memberErrors[`members.${i}.mobile`] = 'Valid 10-digit mobile required';
            memberTouched[`members.${i}.mobile`] = true;
          }
        }

        if (Object.keys(memberErrors).length > 0) {
          setFieldErrors((prev) => ({ ...prev, ...memberErrors }));
          setTouched((prev) => ({ ...prev, ...memberTouched }));
          return setError('Please enter valid Name, Email & Mobile for all team members.');
        }

        const leaderEmail = formData.leaderEmail.trim().toLowerCase();
        const seenEmails = new Set([leaderEmail]);
        const seenMobiles = new Set([formData.leaderMobile.trim()]);

        for (let i = 0; i < formData.members.length; i += 1) {
          const mEmail = formData.members[i].email.trim().toLowerCase();
          const mMobile = String(formData.members[i].mobile || '').trim();
          if (seenEmails.has(mEmail)) {
            return focusConflictField(
              `members.${i}.email`,
              1,
              `Duplicate email "${mEmail}" in squad. Every member must use a unique email.`
            );
          }
          seenEmails.add(mEmail);

          if (seenMobiles.has(mMobile)) {
            return focusConflictField(
              `members.${i}.mobile`,
              1,
              `Duplicate mobile "${mMobile}" in squad. Every member must use a unique mobile.`
            );
          }
          seenMobiles.add(mMobile);
        }

        // Live DB availability check for all Members against duplicates & 2-event max rule
        try {
          setCheckingStep(true);
          const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
          const res = await axios.post(
            `${backendUrl}/api/check-availability`,
            {
              teamName: formData.teamName.trim(),
              leaderEmail: formData.leaderEmail.trim().toLowerCase(),
              leaderMobile: formData.leaderMobile.trim(),
              leaderWhatsapp: formData.leaderWhatsapp.trim(),
              event: formData.event,
              members: formData.members.map((m) => ({
                name: m.name.trim(),
                email: m.email.trim().toLowerCase(),
                mobile: String(m.mobile || '').trim(),
              })),
            },
            { timeout: 5000 }
          );
          if (res.data && res.data.available === false) {
            return focusConflictField(
              res.data.field,
              res.data.step ?? 1,
              res.data.message
            );
          }
        } catch {
          // Enforced atomically on final submit
        } finally {
          setCheckingStep(false);
        }
      }
    }

    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitForm = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    setError(null);

    if (submitBtnRef.current) {
      const rect = submitBtnRef.current.getBoundingClientRect();
      setLaunchOrigin({
        x: rect.left + rect.width * 0.5,
        y: rect.top + rect.height * 0.5,
      });
    }

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
          mobile: String(m.mobile || '').trim(),
        })),
      };

      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/api/event-register`, payload, {
        timeout: 20000,
      });

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
      const errData = err.response?.data;
      const msg =
        errData?.message ||
        err.message ||
        'Registration failed. Please check network connection.';

      // If network/gateway failed BEFORE reaching eventRegisterController, log fallback issue to DB
      const status = err.response?.status;
      if (!status || status >= 502) {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const teamSizeNum = parseInt(formData.teamSize, 10) || 1;
        const finalCollege =
          formData.college === 'OTHER'
            ? formData.customCollege?.trim() || 'Other'
            : formData.college;
        const issuePayload = {
          teamName: formData.teamName.trim(),
          leaderName: formData.leaderName.trim(),
          leaderEmail: formData.leaderEmail.trim().toLowerCase(),
          leaderMobile: formData.leaderMobile.trim(),
          leaderWhatsapp: formData.leaderWhatsapp.trim(),
          college: finalCollege,
          customCollege: formData.customCollege.trim(),
          course: formData.course,
          branch: formData.branch,
          year: formData.year,
          event: formData.event,
          teamSize: teamSizeNum,
          members: formData.members.map((m) => ({
            name: m.name.trim(),
            email: m.email.trim().toLowerCase(),
            mobile: String(m.mobile || '').trim(),
          })),
          errorType: !status ? 'network_timeout' : 'server_error',
          httpStatus: status || 0,
          errorMessage: msg,
        };
        axios
          .post(`${backendUrl}/api/log-registration-issue`, issuePayload, { timeout: 5000 })
          .catch(() => {
            try {
              localStorage.setItem(PENDING_ISSUE_KEY, JSON.stringify(issuePayload));
            } catch {
              // ignore quota error
            }
          });
      }

      // Bring user directly back to exact conflicting step & highlight field for editing!
      if (errData?.field || typeof errData?.step === 'number') {
        focusConflictField(errData.field, errData.step, msg);
      } else {
        setError(msg);
      }
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (checkingStep || loading) return;
    if (step < STEPS.length - 1) {
      nextStep();
    } else {
      submitForm();
    }
  };

  const show3DVault = webGLOk && !isPhone && !prefersReduced;
  const isTeamSizeLocked =
    !activeEventObj || activeEventObj.allowedSizes.length <= 1;

  return (
    <main className="lc-root min-h-[100dvh] pt-[84px] sm:pt-[92px] pb-8 px-3 sm:px-6 lg:px-8 relative overflow-hidden bg-[#080D0B] flex flex-col justify-center selection:bg-[#C69B43] selection:text-[#080D0B]">
      <SeoHead
        title="Register Your Squad (Free Entry) | CROSSROADS 2027 — HIET Ghaziabad"
        description="Complete free online registration for CROSSROADS 2027 at HIET Ghaziabad (Jan 10 – Jan 31, 2027). Autosave enabled, duplicate protection, and instant team email pass."
        path={ROUTE_PATHS.register}
        jsonLd={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: ROUTE_PATHS.home },
            { name: 'Events', path: ROUTE_PATHS.events },
            { name: 'Register', path: ROUTE_PATHS.register },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'CROSSROADS 2027 Event Registration',
            url: `${SITE_URL}/register`,
          },
        ]}
      />
      {/* Distinct Lost Civilization Temple Gateway & Moss Stone Background */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0">
        <img
          src="/assets/lost-civilization/temple-gateway.webp"
          alt="Ancient Lost Civilization stone temple gateway entrance"
          className="w-full h-full object-cover opacity-26"
        />
        <img
          src="/assets/lost-civilization/moss-stone-texture.webp"
          alt="Moss-covered stone temple wall texture"
          className="w-full h-full object-cover opacity-16 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(198,155,67,0.14)_0%,rgba(12,22,17,0.82)_55%,rgba(8,13,11,0.97)_100%)]" />
      </div>

      {show3DVault && (
        <div className="fixed inset-0 z-[1] pointer-events-none opacity-65">
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

      <div className="fixed inset-0 z-[2] pointer-events-none">
        <FloatingParticles density="sparse" />
      </div>

      {/* Compact Viewport-First Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="mb-2.5 flex justify-center md:justify-start">
          <Breadcrumbs
            items={[
              { name: 'Home', path: ROUTE_PATHS.home },
              { name: 'Events', path: ROUTE_PATHS.events },
              { name: 'Squad Registration' },
            ]}
          />
        </div>
        {/* Compact Header Strip + Live Autosave Indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 mb-3.5 sm:mb-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <h1 className="lc-font-display text-xl sm:text-3xl font-black text-[#E8DFC8] tracking-wide">
              EVENT <span className="lc-gold-text">REGISTRATION</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-emerald-950/75 border border-emerald-400/45 text-emerald-300 font-mono text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Jan 10–31 • Feb 05–06 • Max 2 Events / Person
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
            {lastSavedAt && (
              <span
                title="Form progress is saved automatically on this browser"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#101D16]/90 border border-[#C69B43]/30 text-[10px] font-mono text-[#E8C574]"
              >
                <Save size={11} className="text-emerald-400" />
                <span>Autosaved {lastSavedAt}</span>
                <button
                  type="button"
                  onClick={handleResetDraft}
                  title="Clear saved draft"
                  className="ml-1 text-[#E8DFC8]/65 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <RotateCcw size={11} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={() => setIsRulesOpen(true)}
              className="lc-gold-btn lc-font-heading inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm font-extrabold text-[11px] uppercase tracking-[0.14em] cursor-pointer"
            >
              <ShieldCheck size={14} />
              <span>Guidelines</span>
            </button>
            <Link
              to="/events"
              className="lc-stone-btn lc-font-heading inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm font-bold text-[11px] uppercase tracking-[0.14em]"
            >
              <ExternalLink size={13} className="text-[#C69B43]" />
              <span>11 Arenas</span>
            </Link>
          </div>
        </div>

        {!siteSettings.registrationOpen && (
          <div className="mb-3 p-3 rounded-lg bg-red-950/70 border border-red-400/50 text-red-200 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <p className="font-semibold">
              {siteSettings.closedMessage ||
                'Online registrations for CROSSROADS 2027 are currently closed.'}
            </p>
          </div>
        )}

        {/* Unified Carved Stone Registration Altar Card */}
        <div className="relative lc-stone-surface lc-carved-border rounded-xl sm:rounded-2xl shadow-[0_26px_75px_rgba(4,7,5,0.88)] overflow-hidden">
          <TempleProgressBar progress={completionProgress} />
          <CornerFiligree className="top-2 left-2 opacity-55" />
          <CornerFiligree className="top-2 right-2 rotate-90 opacity-55" />

          {/* Ultra-Compact Stepper Strip */}
          <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-[#C69B43]/25 bg-[#080D0B]/55 flex items-center justify-between gap-2 overflow-x-auto lc-no-scrollbar">
            <div className="flex items-center gap-2 sm:gap-5 mx-auto">
              {STEPS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (i < step) setStep(i);
                  }}
                  disabled={i > step}
                  className={`flex items-center gap-2 shrink-0 ${
                    i < step ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
                  }`}
                >
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center font-black text-xs border transition-all ${
                      step > i
                        ? 'bg-emerald-700 border-emerald-400 text-white'
                        : step === i
                        ? 'bg-gradient-to-br from-[#E8C574] to-[#9E6327] border-[#FFF2B2] text-[#080D0B]'
                        : 'bg-[#0D1611] border-[#C69B43]/25 text-[#E8DFC8]/45'
                    }`}
                  >
                    {step > i ? <Check size={14} /> : i + 1}
                  </div>
                  <span
                    className={`lc-font-heading text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] ${
                      step >= i ? 'text-[#E8C574]' : 'text-[#E8DFC8]/45'
                    }`}
                  >
                    {label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span className="hidden sm:inline-block w-6 h-[1px] bg-[#C69B43]/30 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step Body + Keyboard Submit Flow */}
          <form onSubmit={handleFormSubmit} noValidate>
            <div className="p-4 sm:p-6 lg:px-7 lg:py-5">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <Motion.div
                    key="step0"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 18 }}
                    transition={{ duration: 0.28 }}
                    className="space-y-3.5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
                      <StoneSelectField
                        label="Competition Arena *"
                        name="event"
                        value={formData.event}
                        onChange={handleEventDropdownChange}
                        onBlur={handleBlur}
                        error={fieldErrors.event}
                        touched={touched.event}
                        icon={Trophy}
                        className="sm:col-span-2"
                        labelRight={
                          activeEventObj && (
                            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/75 border border-emerald-400/35 px-2 py-0.5 rounded shrink-0">
                              {activeEventObj.badge}
                            </span>
                          )
                        }
                      >
                        <option value="">Select Competition Arena</option>
                        {ALL_EVENTS.map((ev) => {
                          const isClosed =
                            siteSettings.eventStatus &&
                            siteSettings.eventStatus[ev.value] === false;
                          return (
                            <option
                              key={ev.value}
                              value={ev.value}
                              disabled={isClosed}
                            >
                              {ev.label} — {ev.badge}
                              {isClosed ? ' [Closed]' : ''}
                            </option>
                          );
                        })}
                      </StoneSelectField>

                      <StoneSelectField
                        label="Team Size (Event Rule) *"
                        name="teamSize"
                        value={formData.teamSize}
                        disabled={isTeamSizeLocked}
                        onChange={(e) =>
                          handleTeamSizeSelectChange(parseInt(e.target.value, 10))
                        }
                        icon={Users}
                        labelRight={
                          activeEventObj && (
                            <span className="text-[10px] font-mono text-[#E8DFC8]/70 shrink-0">
                              {isTeamSizeLocked ? 'Auto-Locked' : 'Rule Applied'}
                            </span>
                          )
                        }
                      >
                        {activeEventObj ? (
                          activeEventObj.allowedSizes.map((sz) => (
                            <option key={sz} value={sz.toString()}>
                              {sz === 1
                                ? 'Solo (1 Member)'
                                : `${sz} Members (Incl. Leader)`}
                            </option>
                          ))
                        ) : (
                          <option value="1">Choose event first</option>
                        )}
                      </StoneSelectField>

                      <StoneInputField
                        label="Team Name *"
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
                        label="Leader Full Name *"
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
                        label="Leader Email *"
                        name="leaderEmail"
                        type="email"
                        placeholder="captain@college.edu"
                        value={formData.leaderEmail}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={fieldErrors.leaderEmail}
                        touched={touched.leaderEmail}
                        icon={Mail}
                      />

                      <StoneInputField
                        label="Calling Phone *"
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

                      <StoneInputField
                        label="WhatsApp *"
                        name="leaderWhatsapp"
                        type="tel"
                        maxLength="10"
                        placeholder="10-digit WhatsApp"
                        value={formData.leaderWhatsapp}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={fieldErrors.leaderWhatsapp}
                        touched={touched.leaderWhatsapp}
                        icon={Phone}
                        labelRight={
                          <label className="inline-flex items-center gap-1 text-[10px] text-[#E8C574] cursor-pointer select-none shrink-0">
                            <input
                              type="checkbox"
                              checked={sameAsCalling}
                              onChange={handleSameAsCallingToggle}
                              className="w-3 h-3 rounded border-[#C69B43]/60 text-[#C69B43] bg-[#080D0B] cursor-pointer"
                            />
                            <span>Same</span>
                          </label>
                        }
                      />

                      <StoneSelectField
                        label="College / University *"
                        name="college"
                        value={formData.college}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={fieldErrors.college}
                        touched={touched.college}
                        icon={Globe}
                      >
                        <option value="">Select College</option>
                        {COLLEGES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </StoneSelectField>

                      <StoneSelectField
                        label="Degree / Course *"
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={fieldErrors.course}
                        touched={touched.course}
                        icon={GraduationCap}
                      >
                        <option value="">Select Course</option>
                        {COURSES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </StoneSelectField>

                      <StoneSelectField
                        label="Branch / Dept *"
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={fieldErrors.branch}
                        touched={touched.branch}
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
                        label="Academic Year *"
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

                      {formData.college === 'OTHER' && (
                        <StoneInputField
                          label="Specify College / Institute Name *"
                          name="customCollege"
                          placeholder="Full name of your College / University"
                          value={formData.customCollege}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          error={fieldErrors.customCollege}
                          touched={touched.customCollege}
                          icon={Globe}
                          className="sm:col-span-2 lg:col-span-4"
                        />
                      )}
                    </div>

                    {activeEventObj && (
                      <div className="px-3.5 py-2 rounded-lg bg-[#080D0B]/70 border border-[#C69B43]/25 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#E8DFC8]/80">
                        <span>
                          <strong className="text-[#E8C574]">
                            {activeEventObj.label}:
                          </strong>{' '}
                          {activeEventObj.desc}
                        </span>
                        <span className="font-mono text-[#E8C574]">
                          Rule: {activeEventObj.badge} • Max 2 Events/Member
                        </span>
                      </div>
                    )}
                  </Motion.div>
                )}

                {step === 1 && (
                  <Motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 18 }}
                    transition={{ duration: 0.28 }}
                    className="space-y-4"
                  >
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#101D16]/90 border border-[#C69B43]/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#182B20] border border-[#C69B43]/40 rounded-lg text-[#E8C574] shrink-0">
                          <Users size={18} />
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C69B43] font-bold block">
                            Arena: {activeEventObj?.label || 'Selected Event'} (
                            {activeEventObj?.badge || 'Rule Applied'})
                          </span>
                          <h3 className="lc-font-heading text-sm sm:text-base font-bold text-[#E8DFC8]">
                            Team Roster (Unique Email &amp; Mobile • Max 2 Events Each)
                          </h3>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {activeEventObj?.allowedSizes.map((size) => {
                          const isCurrent = parseInt(formData.teamSize, 10) === size;
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleTeamSizeSelectChange(size)}
                              className={`px-3 py-1.5 rounded-sm lc-font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-wider cursor-pointer ${
                                isCurrent
                                  ? 'lc-gold-btn'
                                  : 'lc-stone-btn text-[#E8DFC8]/80'
                              }`}
                            >
                              {size === 1 ? 'Solo (1)' : `${size} Members`}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {parseInt(formData.teamSize, 10) === 1 ? (
                      <div className="p-6 sm:p-8 rounded-xl bg-[#080D0B]/70 border border-[#C69B43]/25 text-center space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-[#182B20] border border-[#C69B43]/45 flex items-center justify-center text-[#E8C574]">
                          <User size={24} />
                        </div>
                        <h4 className="lc-font-heading text-base font-bold text-[#E8DFC8]">
                          Solo Participant Format
                        </h4>
                        <p className="text-xs sm:text-sm text-[#E8DFC8]/75 max-w-md mx-auto">
                          Team Leader (
                          <strong className="text-[#E8C574]">
                            {formData.leaderName || 'You'}
                          </strong>
                          ) competes individually. Click &quot;Continue&quot; to
                          review and complete your registration.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[46dvh] overflow-y-auto pr-1">
                        {formData.members.map((member, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 sm:p-4 rounded-xl bg-[#080D0B]/75 border border-[#C69B43]/30 space-y-3"
                          >
                            <div className="flex items-center gap-2 text-[#E8C574] font-bold text-xs uppercase tracking-widest font-mono">
                              <span className="w-5 h-5 rounded bg-[#182B20] border border-[#C69B43]/45 flex items-center justify-center text-[11px]">
                                {idx + 2}
                              </span>
                              <span>Teammate {idx + 2} (Kept in Email CC)</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <StoneInputField
                                label="Full Name *"
                                name={`members.${idx}.name`}
                                placeholder="E.g. Priyanshu Singh"
                                value={member.name}
                                onChange={(e) =>
                                  handleMemberChange(idx, 'name', e.target.value)
                                }
                                error={fieldErrors[`members.${idx}.name`]}
                                touched={touched[`members.${idx}.name`]}
                                icon={User}
                              />
                              <StoneInputField
                                label="Email Address *"
                                name={`members.${idx}.email`}
                                type="email"
                                placeholder="teammate@college.edu"
                                value={member.email}
                                onChange={(e) =>
                                  handleMemberChange(idx, 'email', e.target.value)
                                }
                                error={fieldErrors[`members.${idx}.email`]}
                                touched={touched[`members.${idx}.email`]}
                                icon={Mail}
                              />
                              <StoneInputField
                                label="Mobile Number *"
                                name={`members.${idx}.mobile`}
                                type="tel"
                                maxLength="10"
                                placeholder="10-digit mobile"
                                value={member.mobile || ''}
                                onChange={(e) =>
                                  handleMemberChange(
                                    idx,
                                    'mobile',
                                    e.target.value.replace(/\D/g, '').slice(0, 10)
                                  )
                                }
                                error={fieldErrors[`members.${idx}.mobile`]}
                                touched={touched[`members.${idx}.mobile`]}
                                icon={Phone}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Motion.div>
                )}

                {step === 2 && (
                  <Motion.div
                    key="step2"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.28 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div className="bg-[#080D0B]/75 border border-[#C69B43]/30 rounded-xl p-4 sm:p-5 space-y-2.5 text-xs sm:text-sm">
                        <div className="flex items-center justify-between gap-2.5 pb-2 border-b border-[#C69B43]/20">
                          <div className="flex items-center gap-2">
                            <Trophy size={16} className="text-[#E8C574]" />
                            <span className="lc-font-heading font-bold text-[#E8C574] uppercase tracking-wider">
                              {activeEventObj?.label || formData.event}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStep(0)}
                            className="text-[11px] font-mono text-[#E8C574] underline hover:text-white cursor-pointer"
                          >
                            Edit Info
                          </button>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#C69B43]/15">
                          <span className="text-[#E8DFC8]/65">Team Name:</span>
                          <span className="text-[#E8C574] font-bold">
                            {formData.teamName}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#C69B43]/15">
                          <span className="text-[#E8DFC8]/65">
                            Team Size (Inc. Leader):
                          </span>
                          <span className="text-[#E8DFC8] font-bold">
                            {formData.teamSize} Member(s)
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#C69B43]/15">
                          <span className="text-[#E8DFC8]/65">Leader:</span>
                          <span className="text-[#E8DFC8] font-semibold">
                            {formData.leaderName} ({formData.leaderEmail})
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-[#E8DFC8]/65">College:</span>
                          <span className="text-[#E8DFC8] font-semibold truncate max-w-[200px]">
                            {formData.college === 'OTHER'
                              ? formData.customCollege
                              : formData.college}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-[#080D0B]/75 border border-[#C69B43]/30 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-[#E8C574] lc-font-heading uppercase tracking-wider">
                            <span className="inline-flex items-center gap-2">
                              <Users size={15} />
                              <span>
                                Teammates Roster ({formData.members.length})
                              </span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="text-[11px] font-mono text-[#E8C574] underline hover:text-white cursor-pointer normal-case tracking-normal"
                            >
                              Edit Team
                            </button>
                          </div>
                          {formData.members.length === 0 ? (
                            <p className="text-xs text-[#E8DFC8]/70">
                              Solo Entry — Confirmation sent to Team Leader.
                            </p>
                          ) : (
                            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                              {formData.members.map((m, i) => (
                                <div
                                  key={i}
                                  className="p-2 rounded bg-[#101D16]/85 border border-[#C69B43]/20 flex justify-between gap-2 text-xs"
                                >
                                  <span className="font-bold text-[#E8DFC8] truncate">
                                    {m.name}
                                  </span>
                                  <span className="text-[#E8C574] font-mono truncate">
                                    {m.email} • {m.mobile}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-400/35 flex items-start gap-2.5 text-xs text-[#E8DFC8]/85">
                          <CheckCircle2
                            size={18}
                            className="text-emerald-300 shrink-0 mt-0.5"
                          />
                          <span>
                            Single official pass email goes <strong>TO</strong>{' '}
                            <span className="text-emerald-300">
                              {formData.leaderEmail}
                            </span>{' '}
                            with all teammates kept in <strong>CC</strong>.
                          </span>
                        </div>
                      </div>
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Compact Footer Controls */}
            <div className="px-4 sm:px-7 py-3.5 border-t border-[#C69B43]/25 bg-[#080D0B]/65 flex flex-col sm:flex-row justify-between items-center gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => prev - 1)}
                  className="lc-stone-btn lc-font-heading w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm font-bold text-xs uppercase tracking-[0.16em] cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>
              ) : (
                <span className="text-[11px] font-mono text-[#E8DFC8]/60 hidden sm:inline">
                  Free Entry • Instant HIET/CR/2027 Pass &amp; Auto-Saved Draft
                </span>
              )}

              {step < STEPS.length - 1 ? (
                <button
                  type="submit"
                  disabled={checkingStep}
                  className="lc-gold-btn lc-font-heading w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 sm:py-3 rounded-sm font-extrabold text-xs uppercase tracking-[0.16em] cursor-pointer disabled:opacity-60"
                >
                  {checkingStep ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              ) : (
                <button
                  ref={submitBtnRef}
                  type="submit"
                  disabled={loading || !siteSettings.registrationOpen}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-9 py-2.5 sm:py-3 rounded-sm bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-600 hover:to-green-600 border border-emerald-400/70 text-white lc-font-heading font-extrabold text-xs uppercase tracking-[0.16em] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
          </form>
        </div>
      </div>

      {/* Auto-dismissing Bottom Error Toast */}
      <AnimatePresence>
        {error && (
          <Motion.div
            initial={{ opacity: 0, y: 36, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 36, scale: 0.94 }}
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
        launchOrigin={launchOrigin}
        copiedField={copiedField}
        onCopy={handleCopy}
        onNavigateEvents={() => navigate('/events')}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </main>
  );
};

export default EventRegistration;
