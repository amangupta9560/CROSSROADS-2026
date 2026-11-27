// AdminDashboard.jsx - Comprehensive CROSSROADS 2027 Management Suite with Persistent Round Robin SMTP
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import SeoHead from './common/SeoHead.jsx';
import FailedRegistrationsPanel from './admin/FailedRegistrationsPanel.jsx';
import { SITE_URL } from '../config/siteConfig.js';
import {
  Users, User, Mail, Phone, Trophy, Download, Upload, LogOut, Search, Home,
  Calendar, ChevronRight, Check, X, AlertTriangle, Info, Bell, Filter,
  RefreshCw, Eye, Trash2, Copy, ExternalLink, Shield, Sliders,
  FileSpreadsheet, SendHorizontal, Building, Briefcase, Sparkles,
  CheckCircle2, MessageCircle, ArrowUpRight, FileText, CheckCircle,
  MailCheck, Repeat, GraduationCap, BarChart3, Monitor, Smartphone, Plus,
  Activity, Clock, RotateCcw, TrendingUp, ShieldCheck, AlertCircle
} from 'lucide-react';

const STATUS_BADGE_MAP = {
  pending: { label: 'Pending', classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  verified: { label: 'Verified', classes: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  'checked-in': { label: 'Checked In', classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  rejected: { label: 'Rejected', classes: 'bg-red-500/15 text-red-300 border-red-500/30' }
};

const getStatusMeta = (st) => STATUS_BADGE_MAP[st || 'pending'] || STATUS_BADGE_MAP.pending;

const EVENT_DISPLAY_NAMES = {
  'code-puzzle': 'Code Puzzle',
  'project-exhibition': 'Project Exhibition / Evolution',
  'robo-race': 'Robo Race',
  'technical-poster': 'Technical Poster Presentation',
  'cultural-events': 'Cultural Events (Group Dance)',
  'rangoli-competition': 'Rangoli Competition',
  'food-without-fire': 'Food Without Fire',
  'dance-competition': 'Dance Competition (Solo)',
  'rock-band': 'Rock Band',
  'short-film-maker': 'Short Film / Reel Making',
  'treasure-hunt': 'Treasure Hunt'
};

const getEventDisplay = (ev) => {
  if (!ev) return 'Event';
  return EVENT_DISPLAY_NAMES[ev] || ev.toUpperCase().replace(/-/g, ' ');
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Active Tab: 'overview' | 'teams' | 'excel' | 'broadcast' | 'conditionalEmail' | 'authority' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Loading & Global States
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    total: 0,
    totalTeams: 0,
    today: 0,
    todayParticipants: 0,
    totalParticipants: 0,
    totalStudents: 0,
    totalColleges: 0,
    technicalCount: 0,
    culturalCount: 0,
    statusBreakdown: { pending: 0, verified: 0, checkedIn: 0, rejected: 0, exported: 0 },
    eventWise: [],
    collegeWise: [],
    allColleges: [],
    dailyTrend: []
  });
  const [teams, setTeams] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [broadcasts, setBroadcasts] = useState([]);
  const [smtpPool, setSmtpPool] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [emailLogStats, setEmailLogStats] = useState({ total: 0, queued: 0, sending: 0, sent: 0, failed: 0 });
  const [emailLogFilterStatus, setEmailLogFilterStatus] = useState('all');
  const [emailLogFilterCategory, setEmailLogFilterCategory] = useState('all');
  const [emailLogSearch, setEmailLogSearch] = useState('');
  const [failedLogs, setFailedLogs] = useState([]);
  const [failedStats, setFailedStats] = useState({ total: 0, pending: 0, contacted: 0, resolved: 0, serverErrors: 0, conflicts: 0 });
  const [failedFilterStatus, setFailedFilterStatus] = useState('all');
  const [failedFilterType, setFailedFilterType] = useState('all');
  const [failedSearch, setFailedSearch] = useState('');

  // Search & Advanced Filter States for Teams Tab
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterTrack, setFilterTrack] = useState('all');
  const [filterCollege, setFilterCollege] = useState('all');
  const [filterSpecificCollege, setFilterSpecificCollege] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterTeamType, setFilterTeamType] = useState('all');
  const [filterRegStatus, setFilterRegStatus] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilterAnalytics, setShowFilterAnalytics] = useState(true);

  // Selected Team for Details Modal
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Excel Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTargetEvent, setUploadTargetEvent] = useState('');
  const [uploadDefaultCollege, setUploadDefaultCollege] = useState('HIET Ghaziabad');
  const [uploadResult, setUploadResult] = useState(null);

  // Excel Export State (Advanced Filters)
  const [exportFilterEvent, setExportFilterEvent] = useState('all');
  const [exportFilterTrack, setExportFilterTrack] = useState('all');
  const [exportFilterCollege, setExportFilterCollege] = useState('all');
  const [exportFilterSpecificCollege, setExportFilterSpecificCollege] = useState('all');
  const [exportFilterBranch, setExportFilterBranch] = useState('all');
  const [exportFilterYear, setExportFilterYear] = useState('all');
  const [exportFilterTeamType, setExportFilterTeamType] = useState('all');
  const [exportFilterStatus, setExportFilterStatus] = useState('all');
  const [exportMarkStatus, setExportMarkStatus] = useState(false);

  // Centralized Broadcast State
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    target: 'all',
    targetCollege: 'all',
    channel: 'both',
    urgency: 'normal',
    showOnWebsite: true
  });

  // Conditional Email State
  const [conditionalFilter, setConditionalFilter] = useState({
    event: 'all',
    track: 'all',
    collegeType: 'all',
    branch: 'all',
    year: 'all',
    teamType: 'all',
    status: 'all'
  });
  const [emailForm, setEmailForm] = useState({
    subject: '',
    headline: 'CROSSROADS 2027 - Important Update',
    message: '',
    ctaText: '',
    ctaLink: '',
    urgency: 'normal'
  });
  const [previewMatchedCount, setPreviewMatchedCount] = useState(null);

  // Dynamic Registration Report Sharing Studio State
  const [reportForm, setReportForm] = useState({
    toEmails: [],
    ccEmails: [],
    bccEmails: [],
    reportType: 'executive_summary',
    track: 'all',
    event: 'all',
    collegeType: 'all',
    specificCollege: 'all',
    branch: 'all',
    year: 'all',
    teamType: 'all',
    dateFrom: '',
    dateTo: '',
    subject: '',
    salutation: '',
    remarks: 'Please find the live registration status, event-wise metrics, college participation summary, and formatted Excel workbook for CROSSROADS 2027.',
    attachExcel: true,
    includeRosterTable: true,
    preferredSmtpUser: 'auto',
    replyTo: 'techfusion@hietgroup.org'
  });
  const [newToEmailInput, setNewToEmailInput] = useState('');
  const [newCcEmailInput, setNewCcEmailInput] = useState('');
  const [newBccEmailInput, setNewBccEmailInput] = useState('');
  const [reportPreview, setReportPreview] = useState({
    open: false,
    loading: false,
    html: '',
    subject: '',
    attachmentFilename: '',
    viewport: 'desktop'
  });

  // Helper: Axios with session-scoped Admin Token
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    return { headers: { 'x-auth-token': token } };
  };

  // Initial Data Fetch
  const fetchAllData = useCallback(async () => {
    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    if (!sessionStorage.getItem('adminToken') && localStorage.getItem('adminToken')) {
      sessionStorage.setItem('adminToken', token);
      localStorage.removeItem('adminToken');
    }

    try {
      setLoading(true);
      const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').trim().replace(/\/+$/, '');

      const [analyticsRes, teamsRes, settingsRes, broadcastsRes, smtpRes, emailLogsRes, failedRegsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/stats`, getAuthHeaders()).catch((err) => {
          if (err.response?.status === 404) {
            return axios.get(`${backendUrl}/api/admin/analytics`, getAuthHeaders());
          }
          throw err;
        }),
        axios.get(`${backendUrl}/api/admin/teams`, getAuthHeaders()),
        axios.get(`${backendUrl}/api/admin/settings`, getAuthHeaders()),
        axios.get(`${backendUrl}/api/admin/broadcasts`, getAuthHeaders()),
        axios.get(`${backendUrl}/api/admin/smtp-status`, getAuthHeaders()).catch(() => ({ data: { pool: [] } })),
        axios.get(`${backendUrl}/api/admin/email-logs`, getAuthHeaders()).catch(() => ({ data: { logs: [], stats: { total: 0, queued: 0, sending: 0, sent: 0, failed: 0 } } })),
        axios.get(`${backendUrl}/api/admin/failed-registrations`, getAuthHeaders()).catch(() => ({ data: { logs: [], stats: { total: 0, pending: 0, contacted: 0, resolved: 0, serverErrors: 0, conflicts: 0 } } }))
      ]);

      setAnalytics(analyticsRes.data);
      setTeams(teamsRes.data.teams || []);
      setSiteSettings(settingsRes.data);
      setBroadcasts(broadcastsRes.data || []);
      if (smtpRes.data?.pool?.length > 0) setSmtpPool(smtpRes.data.pool);
      if (emailLogsRes.data) {
        setEmailLogs(emailLogsRes.data.logs || []);
        setEmailLogStats(emailLogsRes.data.stats || { total: 0, queued: 0, sending: 0, sent: 0, failed: 0 });
      }
      if (failedRegsRes.data) {
        setFailedLogs(failedRegsRes.data.logs || []);
        setFailedStats(failedRegsRes.data.stats || { total: 0, pending: 0, contacted: 0, resolved: 0, serverErrors: 0, conflicts: 0 });
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        sessionStorage.removeItem('adminToken');
        localStorage.removeItem('adminToken');
        toast.error('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        toast.error(err.response?.data?.msg || 'Error loading dashboard data');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchEmailLogs = useCallback(async (override = {}) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const params = new URLSearchParams({
        status: override.status ?? emailLogFilterStatus,
        category: override.category ?? emailLogFilterCategory,
        search: override.search ?? emailLogSearch,
        limit: 120
      });
      const res = await axios.get(`${backendUrl}/api/admin/email-logs?${params.toString()}`, getAuthHeaders());
      setEmailLogs(res.data.logs || []);
      if (res.data.stats) setEmailLogStats(res.data.stats);
    } catch {
      toast.error('Failed to refresh email delivery logs');
    }
  }, [emailLogFilterStatus, emailLogFilterCategory, emailLogSearch]);

  const fetchFailedRegistrations = useCallback(async (override = {}) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const params = new URLSearchParams({
        status: override.status ?? failedFilterStatus,
        errorType: override.errorType ?? failedFilterType,
        search: override.search ?? failedSearch,
        limit: 120
      });
      const res = await axios.get(`${backendUrl}/api/admin/failed-registrations?${params.toString()}`, getAuthHeaders());
      setFailedLogs(res.data.logs || []);
      if (res.data.stats) setFailedStats(res.data.stats);
    } catch {
      toast.error('Failed to load failed registration logs');
    }
  }, [failedFilterStatus, failedFilterType, failedSearch]);

  const handleUpdateFailedIssue = async (id, payload) => {
    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.patch(`${backendUrl}/api/admin/failed-registrations/${id}`, payload, getAuthHeaders());
      toast.success(res.data.msg || 'Issue updated');
      await fetchFailedRegistrations();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to update issue');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteFailedIssue = async (id) => {
    if (!window.confirm('Delete this failed registration record permanently?')) return;
    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      await axios.delete(`${backendUrl}/api/admin/failed-registrations/${id}`, getAuthHeaders());
      toast.success('Issue log deleted');
      await fetchFailedRegistrations();
    } catch {
      toast.error('Failed to delete issue log');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Logout Handler
  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  // Unique Dynamic Filter Options from Live Registrations
  const uniqueFilterOptions = useMemo(() => {
    const collegeSet = new Set();
    const branchSet = new Set();
    const yearSet = new Set();

    teams.forEach((t) => {
      if (t.college && t.college.trim()) collegeSet.add(t.college.trim());
      if (t.branch && t.branch.trim()) branchSet.add(t.branch.trim());
      if (t.year && t.year.trim()) yearSet.add(t.year.trim());
    });

    return {
      colleges: Array.from(collegeSet).sort((a, b) => a.localeCompare(b)),
      branches: Array.from(branchSet).sort((a, b) => a.localeCompare(b)),
      years: Array.from(yearSet).sort((a, b) => a.localeCompare(b))
    };
  }, [teams]);

  // Filtered Registrations Memo
  const filteredTeams = useMemo(() => {
    let result = [...teams];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(reg => (
        reg.teamId?.toLowerCase().includes(term) ||
        reg.teamName?.toLowerCase().includes(term) ||
        reg.leader?.name?.toLowerCase().includes(term) ||
        reg.leader?.email?.toLowerCase().includes(term) ||
        reg.leader?.mobile?.includes(term) ||
        reg.college?.toLowerCase().includes(term) ||
        reg.event?.toLowerCase().includes(term)
      ));
    }

    if (filterEvent !== 'all') {
      result = result.filter(reg => reg.event === filterEvent);
    }

    if (filterTrack !== 'all') {
      const technicalEvents = ['code-puzzle', 'project-exhibition', 'robo-race', 'technical-poster'];
      if (filterTrack === 'technical') {
        result = result.filter(reg => technicalEvents.includes(reg.event));
      } else if (filterTrack === 'cultural') {
        result = result.filter(reg => !technicalEvents.includes(reg.event));
      }
    }

    if (filterCollege !== 'all') {
      if (filterCollege === 'hiet') {
        result = result.filter(reg => /hi-?tech|hiet/i.test(reg.college));
      } else if (filterCollege === 'outside') {
        result = result.filter(reg => !/hi-?tech|hiet/i.test(reg.college));
      }
    }

    if (filterSpecificCollege !== 'all') {
      const targetCol = filterSpecificCollege.trim().toLowerCase();
      result = result.filter(reg => (reg.college || '').trim().toLowerCase() === targetCol);
    }

    if (filterBranch !== 'all') {
      result = result.filter(reg => reg.branch === filterBranch);
    }

    if (filterYear !== 'all') {
      result = result.filter(reg => reg.year === filterYear);
    }

    if (filterTeamType !== 'all') {
      if (filterTeamType === 'solo') {
        result = result.filter(reg => (Number(reg.teamSize) || 1) === 1);
      } else if (filterTeamType === 'group') {
        result = result.filter(reg => (Number(reg.teamSize) || 1) > 1);
      }
    }

    if (filterRegStatus !== 'all') {
      result = result.filter(reg => (reg.status || 'pending') === filterRegStatus);
    }

    if (filterStatus !== 'all') {
      if (filterStatus === 'exported') {
        result = result.filter(reg => reg.exported === true);
      } else if (filterStatus === 'unexported') {
        result = result.filter(reg => !reg.exported);
      }
    }

    if (dateFrom) {
      const fromD = new Date(dateFrom);
      result = result.filter(reg => new Date(reg.appliedAt) >= fromD);
    }

    if (dateTo) {
      const toD = new Date(dateTo);
      toD.setHours(23, 59, 59, 999);
      result = result.filter(reg => new Date(reg.appliedAt) <= toD);
    }

    return result;
  }, [
    teams,
    searchTerm,
    filterEvent,
    filterTrack,
    filterCollege,
    filterSpecificCollege,
    filterBranch,
    filterYear,
    filterTeamType,
    filterRegStatus,
    filterStatus,
    dateFrom,
    dateTo
  ]);

  // Update Registration Verification / Check-in Status
  const handleUpdateTeamStatus = async (teamId, nextStatus, e) => {
    if (e) e.stopPropagation();
    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.patch(
        `${backendUrl}/api/admin/teams/${teamId}/status`,
        { status: nextStatus },
        getAuthHeaders()
      );
      setTeams(prev => prev.map(t => (t._id === teamId ? { ...t, status: nextStatus } : t)));
      setSelectedTeam(prev => (prev && prev._id === teamId ? { ...prev, status: nextStatus } : prev));
      toast.success(res.data.msg || `Status changed to ${nextStatus}`);
      // Refresh $facet overview stats without blocking UI
      axios.get(`${backendUrl}/api/admin/stats`, getAuthHeaders())
        .then((r) => setAnalytics(r.data))
        .catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to update registration status');
    } finally {
      setActionLoading(false);
    }
  };

  // Resend Failed/Queued Email Log Entry via Round Robin
  const handleResendEmailLog = async (logId) => {
    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/api/admin/email-logs/${logId}/resend`, {}, getAuthHeaders());
      toast.success(res.data.msg);
      await fetchEmailLogs();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Resend failed');
      await fetchEmailLogs();
    } finally {
      setActionLoading(false);
    }
  };

  // Manually Process Queued Email Batch
  const handleProcessEmailQueue = async () => {
    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/api/admin/email-logs/process-queue`, { batchSize: 20 }, getAuthHeaders());
      toast.success(res.data.msg);
      await fetchEmailLogs();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to process email queue');
    } finally {
      setActionLoading(false);
    }
  };

  // 1-Click Official Stakeholder Dossier to HOD & Director
  const handleSendQuickHodDossier = async () => {
    const hodEmail = siteSettings?.authorityContacts?.hodCseEmail || 'ag902065@gmail.com';
    const directorEmail = siteSettings?.authorityContacts?.directorEmail || 'ag0567688@gmail.com';
    if (!window.confirm(`Send Official CROSSROADS 2027 Dossier (Summary + Master Excel Sheet) immediately?\n\n• TO (HOD): ${hodEmail}\n• CC (Director & Coordinator): ${directorEmail}, techfusion@hietgroup.org`)) {
      return;
    }

    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.post(
        `${backendUrl}/api/admin/send-stakeholder-report`,
        {
          dossierToHod: true,
          reportType: 'authority_digest',
          attachExcel: true,
          includeRosterTable: false,
          remarks: reportForm.remarks
        },
        getAuthHeaders()
      );
      toast.success(res.data.msg);
      fetchEmailLogs();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to dispatch Official Dossier');
    } finally {
      setActionLoading(false);
    }
  };

  // Exact Extracted Advanced Breakdown Metrics over Filtered Teams
  const filteredMetrics = useMemo(() => {
    const technicalEvents = ['code-puzzle', 'project-exhibition', 'robo-race', 'technical-poster'];
    const collegeMap = new Map();
    const eventMap = new Map();
    let totalStudents = 0;
    let technicalTeams = 0;
    let culturalTeams = 0;

    filteredTeams.forEach((team) => {
      const size = Number(team.teamSize) || (1 + (Array.isArray(team.members) ? team.members.length : 0));
      totalStudents += size;

      const isTech = technicalEvents.includes(team.event);
      if (isTech) technicalTeams += 1;
      else culturalTeams += 1;

      const collegeKey = (team.college || 'Unspecified').trim();
      if (!collegeMap.has(collegeKey)) {
        collegeMap.set(collegeKey, {
          college: collegeKey,
          teamsCount: 0,
          studentsCount: 0,
          eventsSet: new Set()
        });
      }
      const cEntry = collegeMap.get(collegeKey);
      cEntry.teamsCount += 1;
      cEntry.studentsCount += size;
      cEntry.eventsSet.add(getEventDisplay(team.event));

      const evKey = team.event || 'other';
      if (!eventMap.has(evKey)) {
        eventMap.set(evKey, {
          event: evKey,
          eventName: getEventDisplay(evKey),
          track: isTech ? 'Technical' : 'Cultural',
          teamsCount: 0,
          studentsCount: 0,
          soloCount: 0,
          groupCount: 0,
          collegesSet: new Set()
        });
      }
      const eEntry = eventMap.get(evKey);
      eEntry.teamsCount += 1;
      eEntry.studentsCount += size;
      if (size === 1) eEntry.soloCount += 1;
      else eEntry.groupCount += 1;
      if (team.college && team.college.trim()) eEntry.collegesSet.add(team.college.trim());
    });

    const collegeBreakdown = Array.from(collegeMap.values())
      .map(c => ({ ...c, eventsCount: c.eventsSet.size, eventsList: Array.from(c.eventsSet) }))
      .sort((a, b) => b.studentsCount - a.studentsCount || b.teamsCount - a.teamsCount);

    const eventBreakdown = Array.from(eventMap.values())
      .map(e => ({ ...e, collegesCount: e.collegesSet.size }))
      .sort((a, b) => b.studentsCount - a.studentsCount || b.teamsCount - a.teamsCount);

    return {
      totalTeams: filteredTeams.length,
      totalStudents,
      totalColleges: collegeBreakdown.length,
      technicalTeams,
      culturalTeams,
      collegeBreakdown,
      eventBreakdown
    };
  }, [filteredTeams]);

  // Resend Confirmation Email (TO: Leader, CC: Members) via Round Robin
  const handleResendConfirmation = async (teamId, e) => {
    if (e) e.stopPropagation();
    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/api/admin/teams/${teamId}/resend-confirmation`, {}, getAuthHeaders());
      toast.success(res.data.msg);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to send confirmation email');
    } finally {
      setActionLoading(false);
    }
  };

  // Bulk Confirmation Email Dispatch (TO: Leader, CC: Members) for all filtered teams
  const handleSendBulkConfirmations = async () => {
    const count = filteredTeams.length;
    if (count === 0) {
      return toast.error('No teams match the current filters');
    }

    if (!window.confirm(`Confirm sending official registration confirmation emails to all ${count} filtered teams?\n\n• TO: Team Leader\n• CC: All Team Members\n• Dispatched via Round Robin SMTP (3 accounts)`)) {
      return;
    }

    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const teamIds = filteredTeams.map(t => t._id);
      const res = await axios.post(`${backendUrl}/api/admin/teams/bulk-confirmations`, { teamIds }, getAuthHeaders());
      toast.success(res.data.msg);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to send bulk confirmations');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Team
  const handleDeleteTeam = async (teamId, teamName, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete registration for "${teamName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      await axios.delete(`${backendUrl}/api/admin/teams/${teamId}`, getAuthHeaders());
      toast.success('Registration removed successfully');
      setTeams(prev => prev.filter(t => t._id !== teamId));
      if (selectedTeam && selectedTeam._id === teamId) {
        setSelectedTeam(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to delete team');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter-wise Excel Export (Formatted multi-sheet workbook with rowSpan & colSpan)
  const handleExportExcel = async (customParams = {}) => {
    try {
      const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

      const evParam = customParams.event ?? exportFilterEvent;
      const trParam = customParams.track ?? exportFilterTrack;
      const colParam = customParams.college ?? exportFilterCollege;
      const specColParam = customParams.specificCollege ?? exportFilterSpecificCollege;
      const branchParam = customParams.branch ?? exportFilterBranch;
      const yearParam = customParams.year ?? exportFilterYear;
      const teamTypeParam = customParams.teamType ?? exportFilterTeamType;
      const regStatusParam = customParams.regStatus ?? 'all';
      const statusParam = customParams.status ?? exportFilterStatus;

      const params = new URLSearchParams({
        event: evParam,
        track: trParam,
        college: colParam,
        specificCollege: specColParam,
        branch: branchParam,
        year: yearParam,
        teamType: teamTypeParam,
        regStatus: regStatusParam,
        status: statusParam,
        markExported: customParams.markExported !== undefined ? customParams.markExported : exportMarkStatus,
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`${backendUrl}/api/admin/export?${params.toString()}`, {
        method: 'GET',
        headers: { 'x-auth-token': token },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CROSSROADS_2027_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Formatted CROSSROADS 2027 Excel workbook downloaded');
      fetchAllData();
    } catch (err) {
      toast.error(err.message || 'Failed to export Excel file');
    }
  };

  // Filter-wise Excel Upload
  const handleExcelUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      return toast.error('Please select an Excel (.xlsx or .xls) file to upload');
    }

    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const formData = new FormData();
      formData.append('file', uploadFile);
      if (uploadTargetEvent) formData.append('targetEvent', uploadTargetEvent);
      if (uploadDefaultCollege) formData.append('defaultCollege', uploadDefaultCollege);

      const res = await axios.post(`${backendUrl}/api/admin/upload-excel`, formData, {
        headers: {
          'x-auth-token': sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken'),
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadResult(res.data);
      toast.success(res.data.msg);
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Excel upload failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Send Centralized Broadcast
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) {
      return toast.error('Broadcast title and message are required');
    }

    if (!window.confirm(`Are you sure you want to broadcast this announcement via ${broadcastForm.channel.toUpperCase()} (Round Robin SMTP)?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/api/admin/broadcast`, broadcastForm, getAuthHeaders());
      toast.success(res.data.msg);
      setBroadcastForm({
        title: '',
        message: '',
        target: 'all',
        targetCollege: 'all',
        channel: 'both',
        urgency: 'normal',
        showOnWebsite: true
      });
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Broadcast failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Broadcast
  const handleDeleteBroadcast = async (broadcastId) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      await axios.delete(`${backendUrl}/api/admin/broadcasts/${broadcastId}`, getAuthHeaders());
      toast.success('Broadcast removed');
      setBroadcasts(prev => prev.filter(b => b._id !== broadcastId));
    } catch {
      toast.error('Failed to remove broadcast');
    }
  };

  // Preview Matched Recipients for Conditional Email
  const handlePreviewConditionRecipients = async () => {
    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/api/admin/send-conditional-email`, {
        filter: conditionalFilter,
        previewOnly: true
      }, getAuthHeaders());

      setPreviewMatchedCount(res.data.totalRecipients);
      toast.success(`Found ${res.data.totalRecipients} matching recipient email(s) across ${res.data.totalMatchedTeams} team(s)`);
    } catch {
      toast.error('Failed to calculate recipients');
    } finally {
      setActionLoading(false);
    }
  };

  // Dispatch Conditional Email
  const handleSendConditionalEmail = async (e) => {
    e.preventDefault();
    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      return toast.error('Subject and message are required');
    }

    if (!window.confirm('Confirm sending this conditional email across Round Robin SMTP accounts?')) {
      return;
    }

    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/api/admin/send-conditional-email`, {
        filter: conditionalFilter,
        ...emailForm,
        previewOnly: false
      }, getAuthHeaders());

      toast.success(res.data.msg);
      setEmailForm({
        subject: '',
        headline: 'CROSSROADS 2027 - Important Update',
        message: '',
        ctaText: '',
        ctaLink: '',
        urgency: 'normal'
      });
      fetchEmailLogs();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to dispatch emails');
      fetchEmailLogs();
    } finally {
      setActionLoading(false);
    }
  };

  // Apply Pre-written Email Template
  const applyEmailTemplate = (templateType) => {
    switch (templateType) {
      case 'schedule':
        setEmailForm({
          subject: 'CROSSROADS 2027 – Reporting Schedule & Slot Timings',
          headline: 'Official Event Schedule & Arrival Guidelines',
          message: `Dear Participants,\n\nPlease note the reporting time and schedule for your registered event at CROSSROADS 2027 (05 Feb & 06 Feb 2027).\n\n• Reporting Time: 09:00 AM sharp at the central registration desk\n• Document Required: College ID Card / Aadhaar Card & Team ID\n• In case of queries, reach out to techfusion@hietgroup.org or +91 8802323375.\n\nBest regards,\nTeam Tech Fusion • CROSSROADS 2027`,
          ctaText: 'View Schedule',
          ctaLink: `${SITE_URL}/schedule`,
          urgency: 'normal'
        });
        break;
      case 'rules':
        setEmailForm({
          subject: 'CROSSROADS 2027 – Important Rules & Guidelines Update',
          headline: 'Competition Guidelines & Judging Criteria',
          message: `Dear Team Leader & Members,\n\nPlease ensure your entire team reviews the official rulebook and guidelines before the competition.\n\n1. All team members must report together for physical verification.\n2. Disqualification criteria: Any plagiarism or violation of event time limits.\n3. The decisions of the judging panel will be final and binding.\n\nFollow @hiet.techfusion on Instagram and check the portal for real-time announcements.`,
          ctaText: 'View Event Rules',
          ctaLink: `${SITE_URL}/events`,
          urgency: 'important'
        });
        break;
      case 'venue':
        setEmailForm({
          subject: 'CROSSROADS 2027 – Campus Venue & Parking Directions',
          headline: 'Campus Navigation & Venue Directions',
          message: `Dear Participants,\n\nWe look forward to welcoming you to Hi-Tech Institute of Engineering & Technology, Ghaziabad for CROSSROADS 2027!\n\n• Campus Address: 766, 26th KM Milestone, NH-24, Delhi-Hapur Bypass, Ghaziabad\n• Helpdesk: Ground Floor, Block 1 Main Lobby\n• Free parking is available for registered participant vehicles near the College Ground.\n\nSafe travels!`,
          ctaText: 'Open Google Maps',
          ctaLink: 'https://maps.google.com/?q=Hi-Tech+Institute+of+Engineering+and+Technology+Ghaziabad',
          urgency: 'normal'
        });
        break;
      default:
        break;
    }
  };

  // Parse comma/semicolon/newline/space separated valid email addresses
  const parseEmailsText = (rawText) => {
    if (!rawText) return [];
    const tokens = String(rawText).split(/[,;\n\s]+/);
    const seen = new Set();
    const valid = [];
    for (const token of tokens) {
      const email = token.trim();
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !seen.has(email.toLowerCase())) {
        seen.add(email.toLowerCase());
        valid.push(email);
      }
    }
    return valid;
  };

  // Add one or more emails into To / CC / BCC list
  const addEmailsToReportField = (field, rawText, clearSetter) => {
    const parsed = parseEmailsText(rawText);
    if (parsed.length === 0) {
      toast.error('Please enter valid email address(es)');
      return;
    }
    setReportForm((prev) => {
      const existingLower = new Set(prev[field].map(e => e.toLowerCase()));
      const additions = parsed.filter(e => !existingLower.has(e.toLowerCase()));
      return {
        ...prev,
        [field]: [...prev[field], ...additions]
      };
    });
    if (clearSetter) clearSetter('');
  };

  const removeEmailFromReportField = (field, emailToRemove) => {
    setReportForm((prev) => ({
      ...prev,
      [field]: prev[field].filter(e => e !== emailToRemove)
    }));
  };

  // Merge any unsaved typed input in To / CC / BCC before preview or send
  const resolveReportPayload = () => {
    const mergeUnique = (existing, extraRaw) => {
      const seen = new Set();
      const merged = [];
      [...existing, ...parseEmailsText(extraRaw)].forEach((email) => {
        const lower = email.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          merged.push(email);
        }
      });
      return merged;
    };

    return {
      ...reportForm,
      toEmails: mergeUnique(reportForm.toEmails, newToEmailInput),
      ccEmails: mergeUnique(reportForm.ccEmails, newCcEmailInput),
      bccEmails: mergeUnique(reportForm.bccEmails, newBccEmailInput)
    };
  };

  // Filtered Teams Preview for Report Sharing Studio
  const reportFilteredSummary = useMemo(() => {
    const technicalEvents = ['code-puzzle', 'project-exhibition', 'robo-race', 'technical-poster'];
    let subset = [...teams];

    if (reportForm.event !== 'all') {
      subset = subset.filter(t => t.event === reportForm.event);
    } else if (reportForm.track !== 'all') {
      if (reportForm.track === 'technical') subset = subset.filter(t => technicalEvents.includes(t.event));
      else if (reportForm.track === 'cultural') subset = subset.filter(t => !technicalEvents.includes(t.event));
      else if (reportForm.track === 'robotics') subset = subset.filter(t => t.event === 'robo-race');
    }

    if (reportForm.specificCollege !== 'all') {
      const target = reportForm.specificCollege.trim().toLowerCase();
      subset = subset.filter(t => (t.college || '').trim().toLowerCase() === target);
    } else if (reportForm.collegeType === 'hiet') {
      subset = subset.filter(t => /hi-?tech|hiet/i.test(t.college));
    } else if (reportForm.collegeType === 'outside') {
      subset = subset.filter(t => !/hi-?tech|hiet/i.test(t.college));
    }

    if (reportForm.branch !== 'all') subset = subset.filter(t => t.branch === reportForm.branch);
    if (reportForm.year !== 'all') subset = subset.filter(t => t.year === reportForm.year);
    if (reportForm.teamType === 'solo') subset = subset.filter(t => (Number(t.teamSize) || 1) === 1);
    else if (reportForm.teamType === 'group') subset = subset.filter(t => (Number(t.teamSize) || 1) > 1);

    if (reportForm.dateFrom) {
      const fromD = new Date(reportForm.dateFrom);
      subset = subset.filter(t => new Date(t.appliedAt) >= fromD);
    }
    if (reportForm.dateTo) {
      const toD = new Date(reportForm.dateTo);
      toD.setHours(23, 59, 59, 999);
      subset = subset.filter(t => new Date(t.appliedAt) <= toD);
    }

    const studentsCount = subset.reduce((acc, t) => acc + (Number(t.teamSize) || (1 + (t.members?.length || 0))), 0);
    const collegesCount = new Set(subset.map(t => (t.college || 'Unspecified').trim())).size;
    const eventsCount = new Set(subset.map(t => t.event)).size;
    return { teamsCount: subset.length, studentsCount, collegesCount, eventsCount };
  }, [teams, reportForm]);

  const syncTeamsFiltersToReport = () => {
    setReportForm((prev) => ({
      ...prev,
      event: filterEvent,
      track: filterTrack,
      collegeType: filterCollege,
      specificCollege: filterSpecificCollege,
      branch: filterBranch,
      year: filterYear,
      teamType: filterTeamType,
      dateFrom,
      dateTo
    }));
    toast.success('Synced active Teams & Data filters into Report Studio');
  };

  // Preview Exact Responsive Email HTML Before Dispatch
  const handlePreviewReportHtml = async () => {
    try {
      setReportPreview(prev => ({ ...prev, open: true, loading: true }));
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const payload = {
        ...resolveReportPayload(),
        previewHtmlOnly: true
      };
      const res = await axios.post(`${backendUrl}/api/admin/send-registration-report`, payload, getAuthHeaders());
      setReportPreview((prev) => ({
        ...prev,
        open: true,
        loading: false,
        html: res.data.html || '',
        subject: res.data.subject || '',
        attachmentFilename: res.data.attachmentFilename || ''
      }));
    } catch (err) {
      setReportPreview(prev => ({ ...prev, open: false, loading: false }));
      toast.error(err.response?.data?.msg || 'Failed to render live email preview');
    }
  };

  // Dispatch Dynamic Registration Report Email (Custom To, CC, Report Type, Responsive Table & Excel)
  const handleSendRegistrationReport = async (e) => {
    e.preventDefault();
    const payload = resolveReportPayload();
    if (payload.toEmails.length === 0) {
      return toast.error('Please enter at least one valid Recipient (TO) email address');
    }

    const summaryConfirm = `Dispatch CROSSROADS 2027 Report (${payload.reportType.replace(/_/g, ' ')})?\n\n• TO: ${payload.toEmails.join(', ')}\n• CC: ${payload.ccEmails.length ? payload.ccEmails.join(', ') : 'None'}\n• Scope: ${reportForm.event !== 'all' ? getEventDisplay(reportForm.event) : 'All Events (Event-Wise Table)'}\n• Excel Attachment: ${payload.attachExcel ? 'Yes (.xlsx with RowSpan & ColSpan)' : 'No'}`;
    if (!window.confirm(summaryConfirm)) {
      return;
    }

    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/api/admin/send-registration-report`, {
        ...payload,
        previewHtmlOnly: false
      }, getAuthHeaders());
      setReportForm((prev) => ({
        ...prev,
        toEmails: payload.toEmails,
        ccEmails: payload.ccEmails,
        bccEmails: payload.bccEmails
      }));
      setNewToEmailInput('');
      setNewCcEmailInput('');
      setNewBccEmailInput('');
      toast.success(res.data.msg);
      fetchEmailLogs();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to dispatch registration report email');
      fetchEmailLogs();
    } finally {
      setActionLoading(false);
    }
  };

  // Save Website Controls & Settings
  const handleSaveSettings = async () => {
    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.put(`${backendUrl}/api/admin/settings`, siteSettings, getAuthHeaders());
      toast.success(res.data.msg);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to save website settings');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Single Event Status in Settings
  const handleToggleEventStatus = (eventKey) => {
    setSiteSettings(prev => {
      const current = prev.eventStatus?.[eventKey] !== false;
      return {
        ...prev,
        eventStatus: {
          ...prev.eventStatus,
          [eventKey]: !current
        }
      };
    });
  };

  // Copy helper
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium tracking-wide">Loading CROSSROADS Admin Suite...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Trophy size={18} /> },
    { id: 'teams', label: 'Teams & Data', icon: <Users size={18} />, badge: teams.length },
    {
      id: 'failedIssues',
      label: 'Failed / Issues',
      icon: <AlertTriangle size={18} />,
      badge: failedStats.pending > 0 ? `${failedStats.pending} new` : failedStats.total
    },
    { id: 'excel', label: 'Excel Studio', icon: <FileSpreadsheet size={18} /> },
    {
      id: 'emailLogs',
      label: 'Email Queue & Logs',
      icon: <Activity size={18} />,
      badge: emailLogStats.failed > 0 ? `${emailLogStats.failed} err` : emailLogStats.queued > 0 ? emailLogStats.queued : emailLogStats.total
    },
    { id: 'broadcast', label: 'Broadcast', icon: <Bell size={18} /> },
    { id: 'conditionalEmail', label: 'Conditional Email', icon: <Mail size={18} /> },
    { id: 'authority', label: 'Stakeholder Dossier', icon: <SendHorizontal size={18} /> },
    { id: 'settings', label: 'Site Controls', icon: <Sliders size={18} /> },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 text-gray-100 pt-6 sm:pt-8 pb-20 px-3 sm:px-6 lg:px-8">
      <SeoHead
        title="Admin Control Portal | CROSSROADS 2027"
        description="Restricted admin management dashboard for CROSSROADS 2027 registrations and email dispatches."
        path="/admin/dashboard"
        robots="noindex, nofollow"
      />

      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 mb-8 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold tracking-wider uppercase">
                Admin Control Room
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                siteSettings?.registrationOpen
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${siteSettings?.registrationOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                {siteSettings?.registrationOpen ? 'Registrations LIVE' : 'Registrations PAUSED'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                <Repeat size={13} className="text-purple-400 animate-spin" />
                <span>Round Robin SMTP ({smtpPool.length} {smtpPool.length === 1 ? 'Account' : 'Accounts'} Active)</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-orange-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mt-2">
              CROSSROADS 2027 Admin Portal
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/35 hover:border-amber-400 rounded-xl font-semibold text-xs sm:text-sm transition shadow-sm"
              title="Go to Public Home Page"
            >
              <Home size={15} />
              <span>Home Page</span>
            </Link>

            <button
              onClick={handleSendQuickHodDossier}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold text-xs sm:text-sm transition shadow-lg cursor-pointer disabled:opacity-50"
              title="1-Click Send Official Executive Dossier + Master Excel to HOD (TO) & Director (CC)"
            >
              <SendHorizontal size={15} />
              <span>Send Official Dossier to HOD</span>
            </button>

            <button
              onClick={() => handleExportExcel({ markExported: false })}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-200 border border-slate-700 hover:border-indigo-500/50 rounded-xl font-medium text-sm transition shadow-sm cursor-pointer"
              title="Download Formatted Multi-Sheet CROSSROADS 2027 Workbook"
            >
              <Download size={16} className="text-indigo-400" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={fetchAllData}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white border border-slate-700 rounded-xl transition shadow-sm cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={17} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/40 rounded-xl font-medium text-sm transition shadow-sm cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-slate-800/60">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'emailLogs') fetchEmailLogs();
                if (tab.id === 'failedIssues') fetchFailedRegistrations();
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-gray-400 hover:text-gray-200 border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-indigo-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & $facet ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Primary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-900/80 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Total Registrations</span>
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                    <Users size={22} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-extrabold text-white">{analytics.totalTeams ?? analytics.total}</span>
                  <span className="text-xs font-semibold text-indigo-300">Teams</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  <strong className="text-emerald-400">{analytics.totalStudents ?? analytics.totalParticipants}</strong> total participating students
                </p>
              </div>

              <div
                onClick={() => setActiveTab('teams')}
                className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group cursor-pointer transition"
                title="Click to open College-Wise Breakdown in Teams & Data"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Total Colleges</span>
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <GraduationCap size={22} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {analytics.totalColleges ?? analytics.allColleges?.length ?? 0}
                </div>
                <p className="text-xs text-gray-400 mt-2">Distinct institutions • Click to inspect breakdown</p>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Today's Registrations (IST)</span>
                  <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400">
                    <Calendar size={22} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-extrabold text-white">{analytics.today}</span>
                  <span className="text-xs font-semibold text-cyan-300">Teams</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  <strong className="text-cyan-300">{analytics.todayParticipants || 0}</strong> students logged today (IST)
                </p>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Track Distribution</span>
                  <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
                    <Building size={22} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-blue-400">{analytics.technicalCount}</span>
                  <span className="text-xs text-gray-400">Tech /</span>
                  <span className="text-2xl font-bold text-pink-400">{analytics.culturalCount}</span>
                  <span className="text-xs text-gray-400">Cultural</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Across 11 distinct festival arenas</p>
              </div>
            </div>

            {/* Verification Pipeline + 7-Day Registration Trend ($facet Single Query) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Desk Verification & Email Queue Summary */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                    <ShieldCheck className="text-emerald-400" size={19} />
                    <span>Verification &amp; Email Health</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl">
                      <span className="text-amber-300 font-semibold block">Pending Desk</span>
                      <span className="text-xl font-extrabold text-white">{analytics.statusBreakdown?.pending ?? 0}</span>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/25 rounded-xl">
                      <span className="text-blue-300 font-semibold block">Verified</span>
                      <span className="text-xl font-extrabold text-white">{analytics.statusBreakdown?.verified ?? 0}</span>
                    </div>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl">
                      <span className="text-emerald-300 font-semibold block">Checked In</span>
                      <span className="text-xl font-extrabold text-white">{analytics.statusBreakdown?.checkedIn ?? 0}</span>
                    </div>
                    <div
                      onClick={() => setActiveTab('emailLogs')}
                      className="p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 rounded-xl cursor-pointer transition"
                      title="Open Email Queue & Logs"
                    >
                      <span className="text-purple-300 font-semibold block">Emails Sent / Err</span>
                      <span className="text-lg font-extrabold text-white">
                        {emailLogStats.sent} <span className="text-xs text-red-400">/ {emailLogStats.failed}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-gray-400 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span>Powered by MongoDB <code>$facet</code></span>
                  <button
                    onClick={() => setActiveTab('teams')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    Manage Status &rarr;
                  </button>
                </div>
              </div>

              {/* 7-Day Registration Trend Bar Chart */}
              <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="text-cyan-400" size={19} />
                    <span>Last 7 Days Registration Trend (IST)</span>
                  </h3>
                  <span className="text-xs text-gray-400">Teams &amp; Student Headcount</span>
                </div>

                {analytics.dailyTrend && analytics.dailyTrend.length > 0 ? (
                  <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40 pt-4">
                    {(() => {
                      const maxVal = Math.max(1, ...analytics.dailyTrend.map(d => d.teams));
                      return analytics.dailyTrend.map((day) => {
                        const heightPct = Math.max(8, Math.round((day.teams / maxVal) * 100));
                        return (
                          <div key={day.date} className="flex flex-col items-center h-full justify-end group">
                            <div className="text-[11px] font-bold text-cyan-300 mb-1">
                              {day.teams}
                              <span className="hidden sm:inline text-[10px] text-gray-400 font-normal"> ({day.students}S)</span>
                            </div>
                            <div className="w-full max-w-[44px] bg-slate-800/80 rounded-t-xl h-28 flex items-end overflow-hidden border border-slate-700/60">
                              <div
                                className="w-full bg-gradient-to-t from-indigo-600 via-blue-500 to-cyan-400 rounded-t-lg transition-all duration-500"
                                style={{ height: `${heightPct}%` }}
                                title={`${day.label}: ${day.teams} teams (${day.students} students)`}
                              />
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium mt-1.5 whitespace-nowrap">{day.label}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 py-10 text-center">No recent 7-day trend data available yet.</p>
                )}
              </div>
            </div>

            {/* Persistent Round Robin SMTP Status Card */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/15 rounded-xl text-purple-400">
                    <Repeat size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Persistent Round Robin SMTP Cluster</h3>
                    <p className="text-xs text-gray-400">
                      MongoDB-persisted round-robin counter rotates across all {smtpPool.length} configured Nodemailer credentials (Vercel Serverless safe)
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold w-fit">
                  {smtpPool.length > 0 ? `${smtpPool.length} Credentials Active` : 'No SMTP Configured'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {smtpPool.map((account, index) => (
                  <div key={account.user || index} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-purple-400">{account.name || `Pool #${index + 1}`}</span>
                      <p className="text-sm font-semibold text-gray-200 mt-0.5 truncate">{account.user}</p>
                      <span className="text-[11px] text-gray-500">SMTP Round-Robin Relay</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-2" title="Ready"></span>
                  </div>
                ))}
                {smtpPool.length === 0 && (
                  <div className="col-span-full text-xs text-amber-300 bg-amber-950/30 border border-amber-500/30 rounded-xl p-3">
                    No SMTP accounts reported by backend. Check Vercel environment variables (`SMTP_1_USER` / `SMTP_1_PASS`, etc.).
                  </div>
                )}
              </div>
            </div>

            {/* Event Distribution & College Rankings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Event Wise Bars */}
              <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Trophy className="text-indigo-400" size={20} />
                    <span>Event-Wise Teams &amp; Students</span>
                  </h3>
                  <span className="text-xs text-gray-400">Sorted by volume</span>
                </div>

                <div className="space-y-4">
                  {analytics.eventWise.map((ev) => {
                    const percent = analytics.total > 0 ? Math.round((ev.count / analytics.total) * 100) : 0;
                    return (
                      <div key={ev._id} className="space-y-1.5">
                        <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
                          <span className="font-medium text-gray-200">{getEventDisplay(ev._id)}</span>
                          <span className="text-xs text-indigo-300 font-bold">
                            {ev.count} teams • {ev.studentsCount ?? ev.participants ?? ev.count} students • {ev.collegesCount ?? '-'} colleges ({percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                  {analytics.eventWise.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-6">No event data registered yet.</p>
                  )}
                </div>
              </div>

              {/* Top Colleges */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Building className="text-emerald-400" size={20} />
                    <span>Top Colleges</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('teams')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                  >
                    View All ({analytics.totalColleges ?? analytics.allColleges?.length ?? 0}) &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {analytics.collegeWise.map((col, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setFilterSpecificCollege(col._id);
                        setActiveTab('teams');
                      }}
                      className="flex items-center justify-between p-3 bg-slate-800/40 hover:bg-slate-800/80 rounded-xl border border-slate-800 cursor-pointer transition"
                      title={`Filter Teams & Data by ${col._id}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="w-6 h-6 rounded-full bg-slate-700 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-300 font-medium truncate">{col._id}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold shrink-0 ml-2">
                        {col.count}T / {col.studentsCount ?? col.count}S
                      </span>
                    </div>
                  ))}
                  {analytics.collegeWise.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-6">No college data available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEAMS & ADVANCED FILTER DATA */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            {/* Advanced Filter Matrix */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* Search */}
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={17} />
                  <input
                    type="text"
                    placeholder="Search by ID, team, leader, email, mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Event Filter */}
                <div>
                  <select
                    value={filterEvent}
                    onChange={(e) => setFilterEvent(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Events</option>
                    {Object.entries(EVENT_DISPLAY_NAMES).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>

                {/* Track Filter */}
                <div>
                  <select
                    value={filterTrack}
                    onChange={(e) => setFilterTrack(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Tracks</option>
                    <option value="technical">Technical Track</option>
                    <option value="cultural">Cultural Track</option>
                  </select>
                </div>

                {/* College Type Filter */}
                <div>
                  <select
                    value={filterCollege}
                    onChange={(e) => setFilterCollege(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">College Type: All</option>
                    <option value="hiet">HIET Only</option>
                    <option value="outside">Outside Colleges</option>
                  </select>
                </div>

                {/* Export Status Filter */}
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">Export: All</option>
                    <option value="unexported">Unexported Only</option>
                    <option value="exported">Exported Only</option>
                  </select>
                </div>
              </div>

              {/* Second Filter Row: Exact College, Branch, Year, Team Type, Registration Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                <div>
                  <select
                    value={filterSpecificCollege}
                    onChange={(e) => setFilterSpecificCollege(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">Specific College: All ({uniqueFilterOptions.colleges.length})</option>
                    {uniqueFilterOptions.colleges.map((colName) => (
                      <option key={colName} value={colName}>{colName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={filterBranch}
                    onChange={(e) => setFilterBranch(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">Branch: All</option>
                    {uniqueFilterOptions.branches.map((br) => (
                      <option key={br} value={br}>{br}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">Academic Year: All</option>
                    {uniqueFilterOptions.years.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={filterTeamType}
                    onChange={(e) => setFilterTeamType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">Format: Solo &amp; Squad</option>
                    <option value="solo">Solo Only (1 Student)</option>
                    <option value="group">Team / Squad Only (2+ Students)</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filterRegStatus}
                    onChange={(e) => setFilterRegStatus(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="all">Desk Status: All</option>
                    <option value="pending">Pending Desk</option>
                    <option value="verified">Verified</option>
                    <option value="checked-in">Checked In</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Date Filters & Clear */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span>From:</span>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span>To:</span>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  {(searchTerm || filterEvent !== 'all' || filterTrack !== 'all' || filterCollege !== 'all' || filterSpecificCollege !== 'all' || filterBranch !== 'all' || filterYear !== 'all' || filterTeamType !== 'all' || filterRegStatus !== 'all' || filterStatus !== 'all' || dateFrom || dateTo) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterEvent('all');
                        setFilterTrack('all');
                        setFilterCollege('all');
                        setFilterSpecificCollege('all');
                        setFilterBranch('all');
                        setFilterYear('all');
                        setFilterTeamType('all');
                        setFilterRegStatus('all');
                        setFilterStatus('all');
                        setDateFrom('');
                        setDateTo('');
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 text-gray-400">
                  <button
                    type="button"
                    onClick={() => setShowFilterAnalytics(prev => !prev)}
                    className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                  >
                    <BarChart3 size={14} />
                    <span>{showFilterAnalytics ? 'Hide Extracted Insights' : 'Show Extracted Insights'}</span>
                  </button>
                  <span>
                    Showing <strong className="text-white">{filteredTeams.length}</strong> of {teams.length} teams
                  </span>
                </div>
              </div>
            </div>

            {/* Extracted Filter Intelligence Matrix (Colleges, College-wise Students, Event-wise Teams/Students) */}
            {showFilterAnalytics && (
              <div className="space-y-4">
                {/* Summary Strip */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/25">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Extracted Colleges</div>
                    <div className="text-2xl font-extrabold text-white mt-1">{filteredMetrics.totalColleges}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">Unique colleges matching filter</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/25">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Matching Teams</div>
                    <div className="text-2xl font-extrabold text-white mt-1">{filteredMetrics.totalTeams}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">Registrations in current slice</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/25">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Total Students</div>
                    <div className="text-2xl font-extrabold text-white mt-1">{filteredMetrics.totalStudents}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">Exact participant headcount</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/25">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Track Balance</div>
                    <div className="text-xl font-extrabold text-white mt-1">
                      <span className="text-blue-400">{filteredMetrics.technicalTeams}</span>
                      <span className="text-xs font-normal text-gray-400 mx-1.5">Tech /</span>
                      <span className="text-pink-400">{filteredMetrics.culturalTeams}</span>
                      <span className="text-xs font-normal text-gray-400 ml-1">Cultural</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">Across {filteredMetrics.eventBreakdown.length} events</div>
                  </div>
                </div>

                {/* Dual Extracted Tables: College-Wise & Event-Wise */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* College-Wise Students & Teams */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <GraduationCap size={16} className="text-emerald-400" />
                        <span>College-Wise Student &amp; Team Extraction ({filteredMetrics.collegeBreakdown.length})</span>
                      </h4>
                      {filterSpecificCollege !== 'all' && (
                        <button
                          onClick={() => setFilterSpecificCollege('all')}
                          className="text-xs text-emerald-400 hover:underline cursor-pointer"
                        >
                          Show All Colleges
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto border border-slate-800 rounded-xl">
                      <table className="w-full text-left text-xs text-gray-300">
                        <thead className="bg-slate-800/90 text-[11px] uppercase text-gray-400 sticky top-0">
                          <tr>
                            <th className="px-3 py-2.5">College Name</th>
                            <th className="px-3 py-2.5 text-center">Teams</th>
                            <th className="px-3 py-2.5 text-center">Students</th>
                            <th className="px-3 py-2.5 text-center">Events</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {filteredMetrics.collegeBreakdown.map((col) => (
                            <tr
                              key={col.college}
                              onClick={() => setFilterSpecificCollege(prev => (prev === col.college ? 'all' : col.college))}
                              className={`cursor-pointer transition ${
                                filterSpecificCollege === col.college
                                  ? 'bg-emerald-950/50 text-emerald-200'
                                  : 'hover:bg-slate-800/60'
                              }`}
                              title="Click to filter by this college"
                            >
                              <td className="px-3 py-2 font-medium max-w-[200px] truncate">{col.college}</td>
                              <td className="px-3 py-2 text-center font-bold text-indigo-300">{col.teamsCount}</td>
                              <td className="px-3 py-2 text-center font-bold text-emerald-400">{col.studentsCount}</td>
                              <td className="px-3 py-2 text-center text-gray-400">{col.eventsCount}</td>
                            </tr>
                          ))}
                          {filteredMetrics.collegeBreakdown.length === 0 && (
                            <tr>
                              <td colSpan="4" className="px-3 py-6 text-center text-gray-500">No colleges match active filters.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Event-Wise Teams & Students */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Trophy size={16} className="text-indigo-400" />
                        <span>Event-Wise Teams &amp; Students ({filteredMetrics.eventBreakdown.length})</span>
                      </h4>
                      {filterEvent !== 'all' && (
                        <button
                          onClick={() => setFilterEvent('all')}
                          className="text-xs text-indigo-400 hover:underline cursor-pointer"
                        >
                          Show All Events
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto border border-slate-800 rounded-xl">
                      <table className="w-full text-left text-xs text-gray-300">
                        <thead className="bg-slate-800/90 text-[11px] uppercase text-gray-400 sticky top-0">
                          <tr>
                            <th className="px-3 py-2.5">Event</th>
                            <th className="px-3 py-2.5 text-center">Teams</th>
                            <th className="px-3 py-2.5 text-center">Students</th>
                            <th className="px-3 py-2.5 text-center">Solo / Squad</th>
                            <th className="px-3 py-2.5 text-center">Colleges</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {filteredMetrics.eventBreakdown.map((ev) => (
                            <tr
                              key={ev.event}
                              onClick={() => setFilterEvent(prev => (prev === ev.event ? 'all' : ev.event))}
                              className={`cursor-pointer transition ${
                                filterEvent === ev.event
                                  ? 'bg-indigo-950/50 text-indigo-200'
                                  : 'hover:bg-slate-800/60'
                              }`}
                              title="Click to filter by this event"
                            >
                              <td className="px-3 py-2 font-medium max-w-[180px] truncate">{ev.eventName}</td>
                              <td className="px-3 py-2 text-center font-bold text-indigo-300">{ev.teamsCount}</td>
                              <td className="px-3 py-2 text-center font-bold text-emerald-400">{ev.studentsCount}</td>
                              <td className="px-3 py-2 text-center text-gray-400">{ev.soloCount} / {ev.groupCount}</td>
                              <td className="px-3 py-2 text-center text-cyan-300">{ev.collegesCount}</td>
                            </tr>
                          ))}
                          {filteredMetrics.eventBreakdown.length === 0 && (
                            <tr>
                              <td colSpan="5" className="px-3 py-6 text-center text-gray-500">No events match active filters.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action Toolbar for Candidates (Bulk Confirmation & Exact Filtered Excel Export) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900 border border-emerald-500/30 rounded-2xl">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MailCheck size={18} className="text-emerald-400" />
                  <span>Candidate Confirmation Dispatcher &amp; Export</span>
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Send registration confirmation emails via Round Robin SMTP (Leader in <strong>TO</strong>, Members in <strong>CC</strong>) or export this exact filtered slice.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSendBulkConfirmations}
                  disabled={actionLoading || filteredTeams.length === 0}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <SendHorizontal size={14} />
                  <span>Send Confirmation ({filteredTeams.length})</span>
                </button>

                <button
                  onClick={() => handleExportExcel({
                    event: filterEvent,
                    track: filterTrack,
                    college: filterCollege,
                    specificCollege: filterSpecificCollege,
                    branch: filterBranch,
                    year: filterYear,
                    teamType: filterTeamType,
                    regStatus: filterRegStatus,
                    status: filterStatus,
                    markExported: false
                  })}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-200 border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
                >
                  <Download size={14} className="text-indigo-400" />
                  <span>Export Filtered Excel</span>
                </button>
              </div>
            </div>

            {/* Teams Table */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-slate-800/90 text-xs uppercase text-gray-400 border-b border-slate-700">
                    <tr>
                      <th className="px-5 py-4">Team ID</th>
                      <th className="px-5 py-4">Team &amp; Event</th>
                      <th className="px-5 py-4">Leader (TO)</th>
                      <th className="px-5 py-4">Members (CC)</th>
                      <th className="px-5 py-4">College</th>
                      <th className="px-5 py-4 text-center">Status</th>
                      <th className="px-5 py-4 text-center">Size</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredTeams.map((team) => {
                      const statusMeta = getStatusMeta(team.status);
                      return (
                        <tr
                          key={team._id}
                          onClick={() => setSelectedTeam(team)}
                          className="hover:bg-slate-800/50 transition cursor-pointer group"
                        >
                          <td className="px-5 py-4">
                            <span className="font-mono text-xs font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-1 rounded-md">
                              {team.teamId}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-white group-hover:text-indigo-300 transition">{team.teamName}</div>
                            <div className="text-xs text-amber-400/90 mt-0.5">{getEventDisplay(team.event)}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-gray-200 font-medium">{team.leader?.name}</div>
                            <div className="text-xs text-emerald-400 truncate max-w-[190px]">{team.leader?.email}</div>
                            <div className="text-xs text-gray-500">{team.leader?.mobile}</div>
                          </td>
                          <td className="px-5 py-4">
                            {team.members && team.members.length > 0 ? (
                              <div>
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  {team.members.length} member(s) in CC
                                </span>
                                <div className="text-xs text-gray-400 truncate max-w-[190px] mt-1">
                                  {team.members.map(m => m.name).join(', ')}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500 italic">Solo (No CC)</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="truncate max-w-[190px] text-gray-300">{team.college}</div>
                            <div className="text-xs text-gray-500">{team.branch} • {team.year}</div>
                          </td>
                          <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={team.status || 'pending'}
                              onChange={(e) => handleUpdateTeamStatus(team._id, e.target.value, e)}
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold border bg-slate-900 cursor-pointer focus:outline-none ${statusMeta.classes}`}
                              title="Update verification / check-in status"
                            >
                              <option value="pending">Pending</option>
                              <option value="verified">Verified</option>
                              <option value="checked-in">Checked In</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-gray-300">
                              {team.teamSize}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedTeam(team)}
                                className="p-1.5 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 rounded-lg transition"
                                title="View Full Team Details"
                              >
                                <Eye size={17} />
                              </button>
                              <button
                                onClick={(e) => handleResendConfirmation(team._id, e)}
                                className="p-1.5 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 rounded-lg transition"
                                title="Send Confirmation Email (TO: Leader, CC: Members)"
                              >
                                <Mail size={17} />
                              </button>
                              <button
                                onClick={(e) => handleDeleteTeam(team._id, team.teamName, e)}
                                className="p-1.5 hover:bg-slate-700 text-red-400 hover:text-red-300 rounded-lg transition"
                                title="Delete Registration"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredTeams.length === 0 && (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                          No matching teams found. Try adjusting your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXCEL STUDIO (FILTER-WISE UPLOADS & EXPORTS) */}
        {activeTab === 'excel' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Filter-Wise Excel Upload */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <Upload size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Filter-Wise Excel Upload (Import)</h3>
                  <p className="text-xs text-gray-400">Import offline or helpdesk registrations from an Excel sheet</p>
                </div>
              </div>

              <form onSubmit={handleExcelUpload} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                    Target Event Assignment (Optional Filter)
                  </label>
                  <select
                    value={uploadTargetEvent}
                    onChange={(e) => setUploadTargetEvent(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">-- Auto-detect event from sheet column --</option>
                    {Object.entries(EVENT_DISPLAY_NAMES).map(([key, name]) => (
                      <option key={key} value={key}>Assign all to: {name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1.5">
                    If selected, all rows in this sheet will be registered for this specific event.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                    Default College (If blank in sheet)
                  </label>
                  <input
                    type="text"
                    value={uploadDefaultCollege}
                    onChange={(e) => setUploadDefaultCollege(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g., HIET Ghaziabad"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                    Upload Spreadsheet File (.xlsx / .xls) *
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-8 text-center cursor-pointer bg-slate-800/30 hover:bg-slate-800/60 transition group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={(e) => setUploadFile(e.target.files[0] || null)}
                      className="hidden"
                    />
                    <FileSpreadsheet size={36} className="mx-auto text-emerald-400 mb-3 group-hover:scale-110 transition" />
                    {uploadFile ? (
                      <div>
                        <p className="text-emerald-400 font-bold text-sm">{uploadFile.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{(uploadFile.size / 1024).toFixed(1)} KB • Click to change</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-gray-200">Click or drag & drop Excel spreadsheet</p>
                        <p className="text-xs text-gray-500 mt-1">Supports standard columns: Name, Email, Phone, College, Event, Members</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading || !uploadFile}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Upload size={18} />
                  <span>{actionLoading ? 'Processing Spreadsheet...' : 'Upload & Import Teams'}</span>
                </button>
              </form>

              {uploadResult && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 size={18} />
                    <span>Import Completed</span>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>• Successfully Imported: <strong>{uploadResult.importedCount}</strong> new teams</p>
                    <p>• Updated Existing: <strong>{uploadResult.skippedCount}</strong> teams</p>
                    <p>• Total Processed Rows: <strong>{uploadResult.totalRows}</strong></p>
                  </div>
                </div>
              )}
            </div>

            {/* Filter-Wise Excel Export */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Download size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Filter-Wise Formatted Excel Export</h3>
                  <p className="text-xs text-gray-400">Multi-sheet workbook with vertical team rowSpan &amp; summary colSpan</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Filter by Event</label>
                    <select
                      value={exportFilterEvent}
                      onChange={(e) => setExportFilterEvent(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="all">All Events (Summary + Overall + Per-Event Tabs)</option>
                      {Object.entries(EVENT_DISPLAY_NAMES).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Filter by Track / Domain</label>
                    <select
                      value={exportFilterTrack}
                      onChange={(e) => setExportFilterTrack(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="all">All Tracks</option>
                      <option value="technical">Technical Track</option>
                      <option value="cultural">Cultural Track</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">College Category</label>
                    <select
                      value={exportFilterCollege}
                      onChange={(e) => setExportFilterCollege(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="all">All Participating Colleges</option>
                      <option value="hiet">HIET Ghaziabad Teams Only</option>
                      <option value="outside">Outside College Teams Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Specific College</label>
                    <select
                      value={exportFilterSpecificCollege}
                      onChange={(e) => setExportFilterSpecificCollege(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="all">All Institutions ({uniqueFilterOptions.colleges.length})</option>
                      {uniqueFilterOptions.colleges.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Branch</label>
                    <select
                      value={exportFilterBranch}
                      onChange={(e) => setExportFilterBranch(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="all">All Branches</option>
                      {uniqueFilterOptions.branches.map((br) => (
                        <option key={br} value={br}>{br}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Academic Year</label>
                    <select
                      value={exportFilterYear}
                      onChange={(e) => setExportFilterYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="all">All Years</option>
                      {uniqueFilterOptions.years.map((yr) => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Participation Format</label>
                    <select
                      value={exportFilterTeamType}
                      onChange={(e) => setExportFilterTeamType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="all">Solo + Squad Teams</option>
                      <option value="solo">Solo Only</option>
                      <option value="group">Team / Squad Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Export Status</label>
                    <select
                      value={exportFilterStatus}
                      onChange={(e) => setExportFilterStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="all">All Records</option>
                      <option value="unexported">Unexported Only</option>
                      <option value="exported">Already Exported Only</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/25 rounded-xl text-[11px] text-indigo-200 leading-relaxed space-y-1">
                  <div className="font-bold text-indigo-300 uppercase tracking-wider">Formatted Workbook Structure (.xlsx)</div>
                  <p>• <strong>Executive Summary Tab:</strong> Overall KPI cards (colSpan), Event-Wise &amp; College-Wise count tables.</p>
                  <p>• <strong>Overall &amp; Per-Event Tabs:</strong> Grouped super-headers (colSpan) + vertically merged team cells (rowSpan) spanning all participants per team.</p>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-slate-800/50 rounded-xl border border-slate-700">
                  <input
                    type="checkbox"
                    id="markExportedCheck"
                    checked={exportMarkStatus}
                    onChange={(e) => setExportMarkStatus(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700 cursor-pointer"
                  />
                  <label htmlFor="markExportedCheck" className="text-xs text-gray-300 cursor-pointer">
                    Mark exported records as &quot;Exported: True&quot; in database
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => handleExportExcel()}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download size={18} />
                  <span>Download Formatted CROSSROADS 2027 Workbook</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3B: RESILIENT EMAIL QUEUE & DELIVERY AUDIT LOGS */}
        {activeTab === 'emailLogs' && (
          <div className="space-y-6">
            {/* Queue Status KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Logged</div>
                <div className="text-2xl font-extrabold text-white mt-1">{emailLogStats.total}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/25">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Sent Successfully</div>
                <div className="text-2xl font-extrabold text-emerald-300 mt-1">{emailLogStats.sent}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/25">
                <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Queued / Pending</div>
                <div className="text-2xl font-extrabold text-cyan-300 mt-1">{emailLogStats.queued + emailLogStats.sending}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-red-500/25">
                <div className="text-[11px] font-bold uppercase tracking-wider text-red-400">Failed / Bounced</div>
                <div className="text-2xl font-extrabold text-red-300 mt-1">{emailLogStats.failed}</div>
              </div>
            </div>

            {/* Filter & Queue Drain Controls */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search recipient email, subject, Team ID, error (Enter)..."
                      value={emailLogSearch}
                      onChange={(e) => setEmailLogSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          fetchEmailLogs({ search: e.target.value });
                        }
                      }}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <select
                    value={emailLogFilterStatus}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmailLogFilterStatus(val);
                      fetchEmailLogs({ status: val });
                    }}
                    className="px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Delivery Statuses</option>
                    <option value="sent">Sent</option>
                    <option value="queued">Queued</option>
                    <option value="failed">Failed (Needs Retry)</option>
                  </select>
                  <select
                    value={emailLogFilterCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmailLogFilterCategory(val);
                      fetchEmailLogs({ category: val });
                    }}
                    className="px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    <option value="registration_confirmation">Registration Confirmation</option>
                    <option value="stakeholder_report">Stakeholder Dossier</option>
                    <option value="registration_report">Registration Report</option>
                    <option value="broadcast">Broadcast</option>
                    <option value="conditional_email">Conditional Email</option>
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => fetchEmailLogs()}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw size={14} />
                    <span>Refresh Logs</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleProcessEmailQueue}
                    disabled={actionLoading}
                    className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Clock size={14} />
                    <span>Process Pending Queue Now ({emailLogStats.queued})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Email Logs Table */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-slate-800/90 text-[11px] uppercase text-gray-400 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3.5">Timestamp (IST)</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Recipient (TO / CC)</th>
                      <th className="px-4 py-3.5">Subject &amp; Attachment</th>
                      <th className="px-4 py-3.5">SMTP Pool</th>
                      <th className="px-4 py-3.5 text-center">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {emailLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3.5 whitespace-nowrap text-gray-400">
                          {new Date(log.createdAt || log.queuedAt).toLocaleString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-semibold uppercase text-[10px]">
                            {String(log.category || '').replace(/_/g, ' ')}
                          </span>
                          {log.teamId && <div className="text-[10px] text-gray-400 font-mono mt-1">{log.teamId}</div>}
                        </td>
                        <td className="px-4 py-3.5 max-w-[230px]">
                          <div className="text-white font-medium truncate">TO: {(log.to || []).join(', ') || '—'}</div>
                          {log.cc && log.cc.length > 0 && (
                            <div className="text-[11px] text-purple-300 truncate mt-0.5">CC: {log.cc.join(', ')}</div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 max-w-[250px]">
                          <div className="text-gray-200 font-semibold truncate">{log.subject}</div>
                          {log.hasAttachment && (
                            <div className="text-[10px] text-emerald-400 mt-0.5">
                              📎 {log.attachmentFilename || 'Excel Attachment'}
                            </div>
                          )}
                          {log.lastError && (
                            <div className="text-[11px] text-red-400 mt-1 flex items-start gap-1">
                              <AlertCircle size={12} className="shrink-0 mt-0.5" />
                              <span className="break-words">{log.lastError}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="text-cyan-300 font-mono text-[11px]">{log.sentVia || log.preferredSmtpUser || 'Auto Round Robin'}</div>
                          <div className="text-[10px] text-gray-500">Attempts: {log.attempts || 0}</div>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                            log.status === 'sent'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : log.status === 'failed'
                                ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                                : log.status === 'sending'
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                  : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setReportPreview({
                                  open: true,
                                  loading: false,
                                  html: log.html || '<p>No HTML captured</p>',
                                  subject: log.subject,
                                  attachmentFilename: log.hasAttachment ? log.attachmentFilename : '',
                                  viewport: 'desktop'
                                })
                              }
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg cursor-pointer"
                              title="Inspect Email HTML"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleResendEmailLog(log._id)}
                              disabled={actionLoading}
                              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1 text-[11px] cursor-pointer disabled:opacity-50"
                              title="Single-Click Re-Queue & Resend via Round Robin"
                            >
                              <RotateCcw size={12} />
                              <span>Resend</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {emailLogs.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          No email delivery logs found for this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CENTRALIZED BROADCAST SYSTEM */}
        {activeTab === 'broadcast' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Centralized Fest Broadcast</h3>
                  <p className="text-xs text-gray-400">Queued via EmailLog + dispatched safely via Round Robin SMTP &amp;/or website banner</p>
                </div>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Broadcast Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., ⚡ Coding Round 1 Venue Changed to Block 1 Lab F"
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Event / Track Target</label>
                    <select
                      value={broadcastForm.target}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, target: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="all">All Registrations</option>
                      <option value="technical">Technical Track Only</option>
                      <option value="cultural">Cultural Track Only</option>
                      {Object.entries(EVENT_DISPLAY_NAMES).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Target College</label>
                    <select
                      value={broadcastForm.targetCollege}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, targetCollege: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="all">All Colleges</option>
                      {uniqueFilterOptions.colleges.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Channel</label>
                    <select
                      value={broadcastForm.channel}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, channel: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="both">Both (Email + Website Banner)</option>
                      <option value="email">Email Only</option>
                      <option value="website_banner">Website Top Banner Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Urgency Level</label>
                    <select
                      value={broadcastForm.urgency}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, urgency: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="normal">Normal</option>
                      <option value="important">Important (Orange)</option>
                      <option value="urgent">Urgent (Red Alert)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Announcement Message *</label>
                  <textarea
                    required
                    rows="5"
                    placeholder="Write the full announcement details here..."
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-slate-800/50 rounded-xl border border-slate-700">
                  <input
                    type="checkbox"
                    id="showWebsiteCheck"
                    checked={broadcastForm.showOnWebsite}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, showOnWebsite: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded bg-slate-900 border-slate-700 cursor-pointer"
                  />
                  <label htmlFor="showWebsiteCheck" className="text-xs text-gray-300 cursor-pointer">
                    Show as real-time notice banner at the top of the website
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Bell size={18} />
                  <span>{actionLoading ? 'Publishing Broadcast...' : 'Publish Fest Broadcast'}</span>
                </button>
              </form>
            </div>

            {/* Broadcast History */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="text-purple-400" size={18} />
                <span>Broadcast History</span>
              </h3>

              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {broadcasts.map((b) => (
                  <div key={b._id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-800 space-y-2 relative group">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-gray-200 leading-snug">{b.title}</h4>
                      <button
                        onClick={() => handleDeleteBroadcast(b._id)}
                        className="p-1 hover:bg-slate-700 text-gray-500 hover:text-red-400 rounded transition shrink-0 cursor-pointer"
                        title="Delete Broadcast"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{b.message}</p>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-slate-800">
                      <span>Target: <strong className="text-gray-400">{getEventDisplay(b.target)}</strong></span>
                      <span>{new Date(b.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                ))}
                {broadcasts.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-8">No broadcasts recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONDITIONAL EMAIL SENDER */}
        {activeTab === 'conditionalEmail' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Condition Filters */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                  <Filter size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Target Conditions</h3>
                  <p className="text-xs text-gray-400">Filter recipient segment</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Event Condition</label>
                  <select
                    value={conditionalFilter.event}
                    onChange={(e) => setConditionalFilter({ ...conditionalFilter, event: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Events</option>
                    {Object.entries(EVENT_DISPLAY_NAMES).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Track / Domain</label>
                  <select
                    value={conditionalFilter.track}
                    onChange={(e) => setConditionalFilter({ ...conditionalFilter, track: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Tracks</option>
                    <option value="technical">Technical Track Only</option>
                    <option value="cultural">Cultural Track Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">College Condition</label>
                  <select
                    value={conditionalFilter.collegeType}
                    onChange={(e) => setConditionalFilter({ ...conditionalFilter, collegeType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Colleges</option>
                    <option value="hiet">HIET Ghaziabad Students Only</option>
                    <option value="outside">Outside College Students Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Team Type Condition</label>
                  <select
                    value={conditionalFilter.teamType}
                    onChange={(e) => setConditionalFilter({ ...conditionalFilter, teamType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="solo">Solo Participants Only (Team Size: 1)</option>
                    <option value="group">Group Teams Only (Team Size &gt; 1)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Export Status Condition</label>
                  <select
                    value={conditionalFilter.status}
                    onChange={(e) => setConditionalFilter({ ...conditionalFilter, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All</option>
                    <option value="unexported">Unexported Only</option>
                    <option value="exported">Exported Only</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handlePreviewConditionRecipients}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Search size={14} />
                  <span>Calculate Matching Recipients</span>
                </button>

                {previewMatchedCount !== null && (
                  <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-center">
                    <span className="text-xs text-gray-400">Audience Size (Leaders + CC Members):</span>
                    <div className="text-xl font-extrabold text-indigo-300">{previewMatchedCount} Participants</div>
                  </div>
                )}
              </div>
            </div>

            {/* Email Composer */}
            <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Targeted Email Composer</h3>
                    <p className="text-xs text-gray-400">Dispatches via Round Robin SMTP ({smtpPool.length || 'Active'} Credentials)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Templates:</span>
                  <button
                    type="button"
                    onClick={() => applyEmailTemplate('schedule')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-gray-300 transition cursor-pointer"
                  >
                    Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => applyEmailTemplate('rules')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-gray-300 transition cursor-pointer"
                  >
                    Rulebook
                  </button>
                  <button
                    type="button"
                    onClick={() => applyEmailTemplate('venue')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-gray-300 transition cursor-pointer"
                  >
                    Venue
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendConditionalEmail} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Email Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., CROSSROADS 2027 – Reporting Time & Venue Information"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Banner Headline</label>
                    <input
                      type="text"
                      placeholder="e.g., Important Fest Communication"
                      value={emailForm.headline}
                      onChange={(e) => setEmailForm({ ...emailForm, headline: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Notice Urgency</label>
                    <select
                      value={emailForm.urgency}
                      onChange={(e) => setEmailForm({ ...emailForm, urgency: e.target.value })}
                      className="w-full px-3 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="normal">Normal (Blue Header)</option>
                      <option value="important">Important (Amber Header)</option>
                      <option value="urgent">Urgent Notice (Red Header)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Email Body Content *</label>
                  <textarea
                    required
                    rows="6"
                    placeholder="Dear Team Leader,\n\nWe would like to inform you that..."
                    value={emailForm.message}
                    onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Optional Button Text</label>
                    <input
                      type="text"
                      placeholder="e.g., Join Official WhatsApp"
                      value={emailForm.ctaText}
                      onChange={(e) => setEmailForm({ ...emailForm, ctaText: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Optional Button Link</label>
                    <input
                      type="url"
                      placeholder="https://chat.whatsapp.com/DaK4uonBMwd4k7s8Pv7RNu"
                      value={emailForm.ctaLink}
                      onChange={(e) => setEmailForm({ ...emailForm, ctaLink: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Mail size={18} />
                  <span>{actionLoading ? 'Dispatching Emails...' : 'Send Conditional Emails (Round Robin)'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 6: STAKEHOLDER DOSSIER & REGISTRATION REPORT SHARING STUDIO */}
        {activeTab === 'authority' && (
          <div className="space-y-6">
            {/* 1-Click Stakeholder Dossier Banner */}
            <div className="bg-gradient-to-r from-amber-950/50 via-indigo-950/50 to-slate-900 border border-amber-500/35 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  <Sparkles size={12} /> 1-Click Administrative Briefing
                </div>
                <h3 className="text-lg font-bold text-white">Send Official Dossier to HOD &amp; Director</h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  Aggregates latest registrations &amp; college counts via MongoDB <code>$facet</code>, attaches formatted Master Excel (.xlsx), and sends TO HOD with Director &amp; Coordinator in CC.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSendQuickHodDossier}
                disabled={actionLoading}
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
              >
                <SendHorizontal size={16} />
                <span>Send Official Dossier to HOD</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                    <SendHorizontal size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Share Registration Details via Email</h3>
                    <p className="text-xs text-gray-400">
                      Send responsive HTML registration reports with tabular event/college breakdown &amp; formatted Excel workbook to any recipient(s)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={syncTeamsFiltersToReport}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-cyan-300 flex items-center gap-1.5 w-fit cursor-pointer"
                >
                  <Filter size={13} />
                  <span>Sync Teams Filters</span>
                </button>
              </div>

              <form onSubmit={handleSendRegistrationReport} className="space-y-5">
                {/* Report Type & Sending Credential */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                      Email Report Type *
                    </label>
                    <select
                      value={reportForm.reportType}
                      onChange={(e) => setReportForm({ ...reportForm, reportType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="executive_summary">Executive Summary (KPIs + Event-Wise + College Tables)</option>
                      <option value="event_roster">Event Roster Report (Includes Complete Registered Teams Table)</option>
                      <option value="college_digest">College-Wise Participation Digest (Colleges &amp; Student Counts)</option>
                      <option value="today_snapshot">Today&apos;s Registration Snapshot (IST Calendar Day)</option>
                      <option value="authority_digest">Official Authority Report (Director / Management Format)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                      Sender Account (SMTP Pool)
                    </label>
                    <select
                      value={reportForm.preferredSmtpUser}
                      onChange={(e) => setReportForm({ ...reportForm, preferredSmtpUser: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="auto">Auto Round Robin ({smtpPool.length} Pooled Accounts)</option>
                      {smtpPool.map((acc, idx) => (
                        <option key={acc.user || idx} value={acc.user}>
                          {acc.name || `SMTP ${idx + 1}`}: {acc.user}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Data Scope Filters */}
                <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Data Scope &amp; Event Selection</span>
                    <span className="text-[11px] font-normal text-gray-400">
                      {reportForm.event === 'all' ? 'All Events selected: Email shows Event-Wise table' : `${getEventDisplay(reportForm.event)} selected`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Event</label>
                      <select
                        value={reportForm.event}
                        onChange={(e) => setReportForm({ ...reportForm, event: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="all">All Events (Event-Wise Summary + Sheet)</option>
                        {Object.entries(EVENT_DISPLAY_NAMES).map(([key, name]) => (
                          <option key={key} value={key}>{name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Track</label>
                      <select
                        value={reportForm.track}
                        onChange={(e) => setReportForm({ ...reportForm, track: e.target.value })}
                        disabled={reportForm.event !== 'all'}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50 cursor-pointer"
                      >
                        <option value="all">All Tracks</option>
                        <option value="technical">Technical Track</option>
                        <option value="robotics">Robotics Track</option>
                        <option value="cultural">Cultural Track</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">College Category</label>
                      <select
                        value={reportForm.collegeType}
                        onChange={(e) => setReportForm({ ...reportForm, collegeType: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="all">All Colleges</option>
                        <option value="hiet">HIET Ghaziabad Only</option>
                        <option value="outside">Outside Colleges Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Specific College</label>
                      <select
                        value={reportForm.specificCollege}
                        onChange={(e) => setReportForm({ ...reportForm, specificCollege: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="all">All Participating Colleges</option>
                        {uniqueFilterOptions.colleges.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Branch</label>
                      <select
                        value={reportForm.branch}
                        onChange={(e) => setReportForm({ ...reportForm, branch: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="all">All Branches</option>
                        {uniqueFilterOptions.branches.map((br) => (
                          <option key={br} value={br}>{br}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Team Format</label>
                      <select
                        value={reportForm.teamType}
                        onChange={(e) => setReportForm({ ...reportForm, teamType: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="all">Solo + Teams</option>
                        <option value="solo">Solo Only</option>
                        <option value="group">Group Teams Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Primary Recipient (TO) Multi-Email Input */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <label className="block text-xs font-semibold text-gray-300 uppercase">
                      Recipient Email(s) — TO *
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      {siteSettings?.authorityContacts?.directorEmail && (
                        <button
                          type="button"
                          onClick={() => addEmailsToReportField('toEmails', siteSettings.authorityContacts.directorEmail)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 cursor-pointer"
                        >
                          <Plus size={11} /> Director
                        </button>
                      )}
                      {siteSettings?.authorityContacts?.deanEmail && (
                        <button
                          type="button"
                          onClick={() => addEmailsToReportField('toEmails', siteSettings.authorityContacts.deanEmail)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 cursor-pointer"
                        >
                          <Plus size={11} /> Dean
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => addEmailsToReportField('toEmails', 'techfusion@hietgroup.org')}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 cursor-pointer"
                      >
                        <Plus size={11} /> Team Tech Fusion
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 space-y-2.5">
                    {reportForm.toEmails.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {reportForm.toEmails.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/70 text-emerald-300 border border-emerald-700/50"
                          >
                            <span>{email}</span>
                            <button
                              type="button"
                              onClick={() => removeEmailFromReportField('toEmails', email)}
                              className="hover:text-red-400 rounded-full cursor-pointer"
                            >
                              <X size={13} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newToEmailInput}
                        onChange={(e) => setNewToEmailInput(e.target.value)}
                        placeholder="Type any TO email (or comma-separated list) and click Add..."
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addEmailsToReportField('toEmails', newToEmailInput, setNewToEmailInput);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => addEmailsToReportField('toEmails', newToEmailInput, setNewToEmailInput)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        Add TO
                      </button>
                    </div>
                  </div>
                </div>

                {/* Carbon Copy (CC) Multi-Email Input */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <label className="block text-xs font-semibold text-gray-300 uppercase">
                      Carbon Copy (CC) Emails
                    </label>
                    {siteSettings?.authorityContacts?.hodCseEmail && (
                      <button
                        type="button"
                        onClick={() => addEmailsToReportField('ccEmails', siteSettings.authorityContacts.hodCseEmail)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-[11px] cursor-pointer"
                      >
                        <Plus size={11} /> HOD CSE
                      </button>
                    )}
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 space-y-2.5">
                    {reportForm.ccEmails.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {reportForm.ccEmails.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-950 text-indigo-300 border border-indigo-700/50"
                          >
                            <span>{email}</span>
                            <button
                              type="button"
                              onClick={() => removeEmailFromReportField('ccEmails', email)}
                              className="hover:text-red-400 rounded-full cursor-pointer"
                            >
                              <X size={13} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCcEmailInput}
                        onChange={(e) => setNewCcEmailInput(e.target.value)}
                        placeholder="Add CC email(s)..."
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addEmailsToReportField('ccEmails', newCcEmailInput, setNewCcEmailInput);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => addEmailsToReportField('ccEmails', newCcEmailInput, setNewCcEmailInput)}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        Add CC
                      </button>
                    </div>
                  </div>
                </div>

                {/* Optional BCC & Reply-To */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                      Optional BCC Emails
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newBccEmailInput}
                        onChange={(e) => setNewBccEmailInput(e.target.value)}
                        placeholder="Comma-separated BCC emails..."
                        className="flex-1 px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addEmailsToReportField('bccEmails', newBccEmailInput, setNewBccEmailInput);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => addEmailsToReportField('bccEmails', newBccEmailInput, setNewBccEmailInput)}
                        className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-200 border border-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    {reportForm.bccEmails.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {reportForm.bccEmails.map((em) => (
                          <span key={em} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-gray-300 border border-slate-700">
                            {em}
                            <button type="button" onClick={() => removeEmailFromReportField('bccEmails', em)} className="hover:text-red-400 cursor-pointer">
                              <X size={11} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                      Reply-To Email
                    </label>
                    <input
                      type="email"
                      value={reportForm.replyTo}
                      onChange={(e) => setReportForm({ ...reportForm, replyTo: e.target.value })}
                      placeholder="techfusion@hietgroup.org"
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Custom Subject & Salutation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                      Custom Subject (Optional)
                    </label>
                    <input
                      type="text"
                      value={reportForm.subject}
                      onChange={(e) => setReportForm({ ...reportForm, subject: e.target.value })}
                      placeholder="Auto-generated if left blank"
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                      Salutation / Greeting (Optional)
                    </label>
                    <input
                      type="text"
                      value={reportForm.salutation}
                      onChange={(e) => setReportForm({ ...reportForm, salutation: e.target.value })}
                      placeholder="e.g., Respected Sir / Dear Coordinator,"
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                    Executive Summary Note / Remarks
                  </label>
                  <textarea
                    rows="3"
                    value={reportForm.remarks}
                    onChange={(e) => setReportForm({ ...reportForm, remarks: e.target.value })}
                    placeholder="Enter highlights or message to include at top of email..."
                    className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3.5 bg-slate-800/50 rounded-xl border border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reportForm.attachExcel}
                      onChange={(e) => setReportForm({ ...reportForm, attachExcel: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700 cursor-pointer"
                    />
                    <span className="text-xs text-gray-300">
                      <strong>Attach Formatted Excel (.xlsx)</strong> matching this selection
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 bg-slate-800/50 rounded-xl border border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reportForm.includeRosterTable}
                      onChange={(e) => setReportForm({ ...reportForm, includeRosterTable: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700 cursor-pointer"
                    />
                    <span className="text-xs text-gray-300">
                      <strong>Embed Live Tabular Data</strong> inside the HTML email
                    </span>
                  </label>
                </div>

                {/* Preview & Send Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handlePreviewReportHtml}
                    disabled={actionLoading}
                    className="py-3.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer"
                  >
                    <Eye size={17} />
                    <span>Preview Responsive Email</span>
                  </button>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="sm:col-span-2 py-3.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <SendHorizontal size={18} />
                    <span>{actionLoading ? 'Dispatching Report...' : 'Send Registration Report Email'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Live Report Snapshot & Template Highlights */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 h-fit">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="text-indigo-400" size={18} />
                <span>Report Dispatch Summary</span>
              </h3>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4 text-xs text-gray-300">
                <div className="text-center pb-3 border-b border-slate-800">
                  <div className="font-extrabold text-sm text-indigo-400">CROSSROADS 2027 • HIET</div>
                  <div className="text-gray-400 font-medium uppercase mt-0.5">{reportForm.reportType.replace(/_/g, ' ')}</div>
                  <div className="text-[11px] text-cyan-400 mt-1">
                    Scope: {reportForm.specificCollege !== 'all' ? reportForm.specificCollege : reportForm.event !== 'all' ? getEventDisplay(reportForm.event) : 'All Events (Event-Wise Table)'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-gray-400">Teams</div>
                    <div className="text-base font-bold text-white mt-0.5">{reportFilteredSummary.teamsCount}</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-gray-400">Students</div>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">{reportFilteredSummary.studentsCount}</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-gray-400">Colleges</div>
                    <div className="text-base font-bold text-cyan-400 mt-0.5">{reportFilteredSummary.collegesCount}</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-gray-400">
                  <div className="font-bold text-gray-200 text-xs">Email Routing &amp; Payload:</div>
                  <div>• <strong>TO:</strong> {resolveReportPayload().toEmails.join(', ') || 'Enter email(s)'}</div>
                  <div>• <strong>CC:</strong> {resolveReportPayload().ccEmails.join(', ') || 'None'}</div>
                  <div>• <strong>Sender SMTP:</strong> {reportForm.preferredSmtpUser === 'auto' ? `Round Robin (${smtpPool.length} pools)` : reportForm.preferredSmtpUser}</div>
                  <div>• <strong>Excel Attachment:</strong> {reportForm.attachExcel ? `CROSSROADS_2027_Report.xlsx (${reportForm.event === 'all' ? 'Summary + All Event Sheets' : getEventDisplay(reportForm.event)})` : 'Disabled'}</div>
                </div>

                <div className="p-3 bg-indigo-950/40 border border-indigo-700/40 rounded-lg text-indigo-200 text-[11px] leading-relaxed space-y-1">
                  <div className="font-bold text-indigo-300">Edge-to-Edge Responsive Identity</div>
                  <p>• Zero outer margin/padding (`margin:0; padding:0`) for desktop &amp; mobile clients.</p>
                  <p>• Includes Event-Wise &amp; College tables, portal URL (`crossroads-hiet.netlify.app`), Instagram (`@hiet.techfusion`), LinkedIn, &amp; Team Tech Fusion email.</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* TAB 7: WEBSITE CONTROLS & SETTINGS */}
        {activeTab === 'settings' && siteSettings && (
          <div className="space-y-8">
            {/* Global Registration Switch */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sliders className="text-indigo-400" size={22} />
                    <span>Master Registration Switch</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Control online registrations across the entire CROSSROADS 2027 website
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-sm font-bold ${siteSettings.registrationOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                    {siteSettings.registrationOpen ? 'REGISTRATIONS OPEN' : 'REGISTRATIONS CLOSED'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSiteSettings({ ...siteSettings, registrationOpen: !siteSettings.registrationOpen })}
                    className={`w-16 h-8 rounded-full p-1 transition duration-300 ease-in-out cursor-pointer ${
                      siteSettings.registrationOpen ? 'bg-emerald-500' : 'bg-red-600'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition duration-300 transform ${
                        siteSettings.registrationOpen ? 'translate-x-8' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>
              </div>

              <div className="pt-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                    Message Displayed When Registrations Are Closed
                  </label>
                  <input
                    type="text"
                    value={siteSettings.closedMessage || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, closedMessage: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Online registrations run Jan 10 – Jan 31, 2027. Main fest: Feb 05–06, 2027."
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/70">
                  <div>
                    <div className="text-sm font-bold text-white">Website Top Announcement Banner</div>
                    <div className="text-xs text-gray-400">Toggle visibility of the pinned announcement banner at the top of the site</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSiteSettings({
                      ...siteSettings,
                      broadcastBanner: {
                        ...siteSettings.broadcastBanner,
                        enabled: !siteSettings.broadcastBanner?.enabled
                      }
                    })}
                    className={`w-14 h-7 rounded-full p-1 transition duration-300 cursor-pointer shrink-0 ${
                      siteSettings.broadcastBanner?.enabled ? 'bg-indigo-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition duration-300 transform ${
                        siteSettings.broadcastBanner?.enabled ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Individual Event Switches */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Trophy className="text-amber-400" size={22} />
                  <span>Event-Level Registration Controls</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Turn registration ON or OFF for each individual competition
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(EVENT_DISPLAY_NAMES).map(([eventKey, eventName]) => {
                  const isOpen = siteSettings.eventStatus?.[eventKey] !== false;
                  return (
                    <div
                      key={eventKey}
                      className={`p-4 rounded-xl border transition flex items-center justify-between gap-3 ${
                        isOpen
                          ? 'bg-slate-800/50 border-slate-700'
                          : 'bg-red-950/20 border-red-800/40'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="font-semibold text-sm text-white truncate">{eventName}</div>
                        <div className={`text-[11px] font-bold mt-0.5 ${isOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isOpen ? 'Open for registration' : 'Registration closed'}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleEventStatus(eventKey)}
                        className={`w-12 h-6 rounded-full p-0.5 transition duration-200 cursor-pointer shrink-0 ${
                          isOpen ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition duration-200 transform ${
                            isOpen ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Authority Directory Settings */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building className="text-blue-400" size={22} />
                  <span>Authority Email Directory</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Configure default recipient addresses for Director and HOD reports
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Director Email</label>
                  <input
                    type="email"
                    value={siteSettings.authorityContacts?.directorEmail || 'ag0567688@gmail.com'}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      authorityContacts: { ...siteSettings.authorityContacts, directorEmail: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">HOD - CSE Email</label>
                  <input
                    type="email"
                    value={siteSettings.authorityContacts?.hodCseEmail || 'ag902065@gmail.com'}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      authorityContacts: { ...siteSettings.authorityContacts, hodCseEmail: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">HOD - MCA Email</label>
                  <input
                    type="email"
                    value={siteSettings.authorityContacts?.hodMcaEmail || 'ag902065@gmail.com'}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      authorityContacts: { ...siteSettings.authorityContacts, hodMcaEmail: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">HOD - EE Email</label>
                  <input
                    type="email"
                    value={siteSettings.authorityContacts?.hodEeEmail || 'ag902065@gmail.com'}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      authorityContacts: { ...siteSettings.authorityContacts, hodEeEmail: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Cultural Head Email</label>
                  <input
                    type="email"
                    value={siteSettings.authorityContacts?.culturalHeadEmail || 'ag902065@gmail.com'}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      authorityContacts: { ...siteSettings.authorityContacts, culturalHeadEmail: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Secretary Email</label>
                  <input
                    type="email"
                    value={siteSettings.authorityContacts?.secretaryEmail || 'ag902065@gmail.com'}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      authorityContacts: { ...siteSettings.authorityContacts, secretaryEmail: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={actionLoading}
                  className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle size={18} />
                  <span>{actionLoading ? 'Saving Settings...' : 'Save Website Controls'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAILED / INTERRUPTED REGISTRATIONS RECOVERY TAB */}
        {activeTab === 'failedIssues' && (
          <FailedRegistrationsPanel
            logs={failedLogs}
            stats={failedStats}
            filterStatus={failedFilterStatus}
            setFilterStatus={setFailedFilterStatus}
            filterType={failedFilterType}
            setFilterType={setFailedFilterType}
            search={failedSearch}
            setSearch={setFailedSearch}
            onRefresh={fetchFailedRegistrations}
            onUpdateIssue={handleUpdateFailedIssue}
            onDeleteIssue={handleDeleteFailedIssue}
            actionLoading={actionLoading}
            getEventDisplay={getEventDisplay}
          />
        )}

        {/* TEAM DETAILS MODAL (VIEW TEAM DATA & SEND CONFIRMATION) */}
        <AnimatePresence>
          {selectedTeam && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <Motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative space-y-6"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950 border border-indigo-700 px-2.5 py-0.5 rounded">
                        {selectedTeam.teamId}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">
                        {getEventDisplay(selectedTeam.event)}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{selectedTeam.teamName}</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Registered on: {new Date(selectedTeam.appliedAt).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedTeam(null)}
                    className="p-2 hover:bg-slate-800 rounded-full text-gray-400 hover:text-white transition cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Instant Send Confirmation Email Card */}
                <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      <MailCheck size={16} />
                      <span>Registration Confirmation Dispatch</span>
                    </div>
                    <div className="text-xs text-gray-300 mt-1.5 space-y-0.5">
                      <div><strong>TO (Leader):</strong> <span className="text-emerald-300">{selectedTeam.leader?.email}</span></div>
                      <div>
                        <strong>CC (Members):</strong>{' '}
                        {selectedTeam.members && selectedTeam.members.length > 0 ? (
                          <span className="text-purple-300 font-medium">
                            {selectedTeam.members.map(m => m.email).join(', ')} ({selectedTeam.members.length} members)
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">None (Solo participant)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleResendConfirmation(selectedTeam._id)}
                    disabled={actionLoading}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 whitespace-nowrap cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <SendHorizontal size={14} />
                    <span>Send Confirmation Now</span>
                  </button>
                </div>

                {/* Leader Details Card */}
                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={15} /> Team Leader Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs block">Full Name</span>
                      <span className="font-semibold text-white">{selectedTeam.leader?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Email Address (Primary TO)</span>
                      <div className="flex items-center gap-2">
                        <a href={`mailto:${selectedTeam.leader?.email}`} className="text-indigo-400 hover:underline truncate">
                          {selectedTeam.leader?.email}
                        </a>
                        <button
                          onClick={() => copyToClipboard(selectedTeam.leader?.email, 'Email')}
                          className="text-gray-500 hover:text-gray-300 cursor-pointer"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Calling Contact</span>
                      <a href={`tel:${selectedTeam.leader?.mobile}`} className="font-medium text-gray-200 hover:underline">
                        {selectedTeam.leader?.mobile}
                      </a>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">WhatsApp</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-200">{selectedTeam.leader?.whatsapp || selectedTeam.leader?.mobile}</span>
                        {selectedTeam.leader?.whatsapp && (
                          <a
                            href={`https://wa.me/91${selectedTeam.leader.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition"
                          >
                            <MessageCircle size={12} />
                            <span>Chat</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* College & Academic Details */}
                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building size={15} /> Academic Affiliation
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="sm:col-span-3">
                      <span className="text-gray-400 text-xs block">College / University</span>
                      <span className="font-semibold text-white">{selectedTeam.college}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Branch</span>
                      <span className="font-medium text-gray-200">{selectedTeam.branch}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Year</span>
                      <span className="font-medium text-gray-200">{selectedTeam.year}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Team Size</span>
                      <span className="font-medium text-gray-200">{selectedTeam.teamSize} member(s)</span>
                    </div>
                  </div>
                </div>

                {/* Desk Verification Status Controls */}
                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck size={15} /> Registration &amp; Desk Check-In Status
                    </h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusMeta(selectedTeam.status).classes}`}>
                      {getStatusMeta(selectedTeam.status).label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'pending', label: 'Pending' },
                      { id: 'verified', label: 'Verified' },
                      { id: 'checked-in', label: 'Checked In' },
                      { id: 'rejected', label: 'Rejected' }
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleUpdateTeamStatus(selectedTeam._id, st.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer disabled:opacity-50 ${
                          (selectedTeam.status || 'pending') === st.id
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow'
                            : 'bg-slate-900 hover:bg-slate-800 text-gray-300 border-slate-700'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Members List (Will be kept in CC) */}
                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users size={15} /> Team Members ({selectedTeam.members?.length || 0}) — Kept in CC on Confirmations
                  </h4>
                  {selectedTeam.members && selectedTeam.members.length > 0 ? (
                    <div className="divide-y divide-slate-800">
                      {selectedTeam.members.map((m, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-200">
                            {idx + 2}. {m.name}
                          </span>
                          <span className="text-xs text-purple-300 font-mono bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">{m.email}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 py-2">Solo Participant (No additional members)</p>
                  )}
                </div>

                {/* Modal Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleDeleteTeam(selectedTeam._id, selectedTeam.teamName)}
                    className="px-4 py-2 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/40 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Delete Registration
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedTeam(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Motion.div>
            </div>
          )}

          {/* LIVE RESPONSIVE EMAIL HTML PREVIEW MODAL */}
          {reportPreview.open && (
            <div
              onClick={() => setReportPreview(prev => ({ ...prev, open: false }))}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            >
              <Motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-800 bg-slate-950/60">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Live Responsive Email Preview</div>
                    <div className="text-sm font-semibold text-white truncate max-w-xl mt-0.5">
                      {reportPreview.subject || 'CROSSROADS 2027 Registration Report'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setReportPreview(prev => ({ ...prev, viewport: 'desktop' }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                          reportPreview.viewport === 'desktop' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Monitor size={14} /> Desktop
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportPreview(prev => ({ ...prev, viewport: 'mobile' }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                          reportPreview.viewport === 'mobile' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Smartphone size={14} /> Mobile (375px)
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setReportPreview(prev => ({ ...prev, open: false }))}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl transition cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto bg-slate-950 p-4 flex justify-center">
                  {reportPreview.loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-gray-400">Generating dynamic HTML &amp; tabular preview...</span>
                    </div>
                  ) : (
                    <iframe
                      title="Email HTML Preview"
                      srcDoc={reportPreview.html}
                      sandbox=""
                      referrerPolicy="no-referrer"
                      className={`bg-white rounded-xl border border-slate-700 shadow-2xl transition-all duration-300 ${
                        reportPreview.viewport === 'mobile' ? 'w-[375px] h-[72vh]' : 'w-full h-[72vh]'
                      }`}
                    />
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-slate-800 bg-slate-950/60 text-xs text-gray-400">
                  <span>
                    Zero outer margin/padding (`0px`) &bull; Attachment:{' '}
                    <strong className="text-gray-200">
                      {reportForm.attachExcel ? (reportPreview.attachmentFilename || 'CROSSROADS_2027_Report.xlsx') : 'None'}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setReportPreview(prev => ({ ...prev, open: false }))}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </Motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default AdminDashboard;