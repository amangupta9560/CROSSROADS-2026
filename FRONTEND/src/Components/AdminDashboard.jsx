// AdminDashboard.jsx - Comprehensive CROSSROADS 2026 Management Suite with Round Robin SMTP
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Users, User, Mail, Phone, Trophy, Download, Upload, LogOut, Search,
  Calendar, ChevronRight, Check, X, AlertTriangle, Info, Bell, Filter,
  RefreshCw, Eye, Trash2, Copy, ExternalLink, Shield, Sliders,
  FileSpreadsheet, SendHorizontal, Building, Briefcase, Sparkles,
  CheckCircle2, MessageCircle, ArrowUpRight, FileText, CheckCircle,
  MailCheck, Repeat
} from 'lucide-react';

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
    today: 0,
    totalParticipants: 0,
    technicalCount: 0,
    culturalCount: 0,
    eventWise: [],
    collegeWise: []
  });
  const [teams, setTeams] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [broadcasts, setBroadcasts] = useState([]);
  const [smtpPool, setSmtpPool] = useState([
    { id: 1, name: 'SMTP 1 (hackathonhiet)', user: 'hackathonhiet@gmail.com' },
    { id: 2, name: 'SMTP 2 (techfusion9560)', user: 'techfusion9560@gmail.com' },
    { id: 3, name: 'SMTP 3 (crossroads20255)', user: 'crossroads20255@gmail.com' }
  ]);

  // Search & Filter States for Teams Tab
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterTrack, setFilterTrack] = useState('all');
  const [filterCollege, setFilterCollege] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Selected Team for Details Modal
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Excel Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTargetEvent, setUploadTargetEvent] = useState('');
  const [uploadDefaultCollege, setUploadDefaultCollege] = useState('HIET Ghaziabad');
  const [uploadResult, setUploadResult] = useState(null);

  // Excel Export State
  const [exportFilterEvent, setExportFilterEvent] = useState('all');
  const [exportFilterTrack, setExportFilterTrack] = useState('all');
  const [exportFilterCollege, setExportFilterCollege] = useState('all');
  const [exportFilterStatus, setExportFilterStatus] = useState('all');
  const [exportMarkStatus, setExportMarkStatus] = useState(false);

  // Centralized Broadcast State
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    target: 'all',
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
    headline: 'CROSSROADS 2026 - Important Update',
    message: '',
    ctaText: '',
    ctaLink: '',
    urgency: 'normal'
  });
  const [previewMatchedCount, setPreviewMatchedCount] = useState(null);

  // Higher Authority Report State - Director: ag0567688@gmail.com, HOD: ag902065@gmail.com
  const [authorityReport, setAuthorityReport] = useState({
    track: 'all',
    directorEmail: 'ag0567688@gmail.com',
    ccEmails: ['ag902065@gmail.com'],
    remarks: 'Respected Sir, please find the real-time registration status for CROSSROADS 2026. All tracks are progressing as per schedule.',
    attachExcel: true
  });
  const [newCcEmailInput, setNewCcEmailInput] = useState('');

  // Helper: Axios with Token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { 'x-auth-token': token } };
  };

  // Initial Data Fetch
  const fetchAllData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

      const [analyticsRes, teamsRes, settingsRes, broadcastsRes, smtpRes] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/analytics`, getAuthHeaders()),
        axios.get(`${backendUrl}/api/admin/teams`, getAuthHeaders()),
        axios.get(`${backendUrl}/api/admin/settings`, getAuthHeaders()),
        axios.get(`${backendUrl}/api/admin/broadcasts`, getAuthHeaders()),
        axios.get(`${backendUrl}/api/admin/smtp-status`, getAuthHeaders()).catch(() => ({ data: { pool: smtpPool } }))
      ]);

      setAnalytics(analyticsRes.data);
      setTeams(teamsRes.data.teams || []);
      setSiteSettings(settingsRes.data);
      setBroadcasts(broadcastsRes.data || []);
      if (smtpRes.data?.pool) setSmtpPool(smtpRes.data.pool);

      // Pre-fill authority director email and HODs
      if (settingsRes.data?.authorityContacts?.directorEmail) {
        setAuthorityReport(prev => ({
          ...prev,
          directorEmail: settingsRes.data.authorityContacts.directorEmail || 'ag0567688@gmail.com',
          ccEmails: [settingsRes.data.authorityContacts.hodCseEmail || 'ag902065@gmail.com']
        }));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        toast.error('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        toast.error(err.response?.data?.msg || 'Error loading dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [navigate]);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

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
  }, [teams, searchTerm, filterEvent, filterTrack, filterCollege, filterStatus, dateFrom, dateTo]);

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

  // Filter-wise Excel Export
  const handleExportExcel = async (customParams = {}) => {
    try {
      const token = localStorage.getItem('adminToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

      const params = new URLSearchParams({
        event: customParams.event || exportFilterEvent,
        track: customParams.track || exportFilterTrack,
        college: customParams.college || exportFilterCollege,
        status: customParams.status || exportFilterStatus,
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
      link.setAttribute('download', `crossroads-registrations-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Excel workbook downloaded successfully');
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
          'x-auth-token': localStorage.getItem('adminToken'),
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
    } catch (err) {
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
    } catch (err) {
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
        headline: 'CROSSROADS 2026 - Important Update',
        message: '',
        ctaText: '',
        ctaLink: '',
        urgency: 'normal'
      });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to dispatch emails');
    } finally {
      setActionLoading(false);
    }
  };

  // Apply Pre-written Email Template
  const applyEmailTemplate = (templateType) => {
    switch (templateType) {
      case 'schedule':
        setEmailForm({
          subject: 'CROSSROADS 2026 – Reporting Schedule & Slot Timings',
          headline: 'Official Event Schedule & Arrival Guidelines',
          message: `Dear Participants,\n\nPlease note the reporting time and schedule for your registered event at CROSSROADS 2026.\n\n• Reporting Time: 09:00 AM sharp at the central registration desk\n• Document Required: College ID Card / Aadhaar Card & Team ID\n• In case of queries, reach out to your respective event student coordinators upon arrival.\n\nBest regards,\nCROSSROADS 2026 Team`,
          ctaText: 'View Schedule',
          ctaLink: 'https://hiet-crossroads.online/schedule',
          urgency: 'normal'
        });
        break;
      case 'rules':
        setEmailForm({
          subject: 'CROSSROADS 2026 – Important Rules & Guidelines Update',
          headline: 'Competition Guidelines & Judging Criteria',
          message: `Dear Team Leader & Members,\n\nPlease ensure your entire team reviews the official rulebook and guidelines before the competition.\n\n1. All team members must report together for physical verification.\n2. Disqualification criteria: Any plagiarism or violation of event time limits.\n3. The decisions of the judging panel will be final and binding.\n\nMake sure to join our WhatsApp group for real-time announcements.`,
          ctaText: 'View Event Rules',
          ctaLink: 'https://hiet-crossroads.online/events',
          urgency: 'important'
        });
        break;
      case 'venue':
        setEmailForm({
          subject: 'CROSSROADS 2026 – Campus Venue & Parking Directions',
          headline: 'Campus Navigation & Venue Directions',
          message: `Dear Participants,\n\nWe look forward to welcoming you to Hi-Tech Institute of Engineering & Technology, Ghaziabad for CROSSROADS 2026!\n\n• Campus Address: 766, 26th KM Milestone, NH-24, Delhi-Hapur Bypass, Ghaziabad\n• Helpdesk: Ground Floor, Block 1 Main Lobby\n• Free parking is available for registered participant vehicles near the College Ground.\n\nSafe travels!`,
          ctaText: 'Open Google Maps',
          ctaLink: 'https://maps.google.com/?q=Hi-Tech+Institute+of+Engineering+and+Technology+Ghaziabad',
          urgency: 'normal'
        });
        break;
      default:
        break;
    }
  };

  // Update Authority Report CC list (HOD email: ag902065@gmail.com)
  const handleTrackChangeForAuthority = (selectedTrack) => {
    const defaultHod = siteSettings?.authorityContacts?.hodCseEmail || 'ag902065@gmail.com';
    setAuthorityReport(prev => ({
      ...prev,
      track: selectedTrack,
      ccEmails: [defaultHod]
    }));
  };

  // Add CC email chip
  const handleAddCcEmail = () => {
    if (newCcEmailInput.trim() && newCcEmailInput.includes('@')) {
      if (!authorityReport.ccEmails.includes(newCcEmailInput.trim())) {
        setAuthorityReport(prev => ({
          ...prev,
          ccEmails: [...prev.ccEmails, newCcEmailInput.trim()]
        }));
      }
      setNewCcEmailInput('');
    } else {
      toast.error('Please enter a valid email address');
    }
  };

  // Remove CC email chip
  const handleRemoveCcEmail = (emailToRemove) => {
    setAuthorityReport(prev => ({
      ...prev,
      ccEmails: prev.ccEmails.filter(e => e !== emailToRemove)
    }));
  };

  // Send Authority Report to Director & HODs
  const handleSendAuthorityReport = async (e) => {
    e.preventDefault();
    if (!authorityReport.directorEmail || !authorityReport.directorEmail.includes('@')) {
      return toast.error('A valid Director Email address is required');
    }

    if (!window.confirm(`Confirm sending the official status report to Director (${authorityReport.directorEmail}) with HOD(s) in CC (${authorityReport.ccEmails.join(', ')}) via Round Robin SMTP?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/api/admin/send-authority-report`, authorityReport, getAuthHeaders());
      toast.success(res.data.msg);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to dispatch report to Director & HODs');
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
    { id: 'excel', label: 'Excel Studio', icon: <FileSpreadsheet size={18} /> },
    { id: 'broadcast', label: 'Broadcast', icon: <Bell size={18} /> },
    { id: 'conditionalEmail', label: 'Conditional Email', icon: <Mail size={18} /> },
    { id: 'authority', label: 'Authority Reports', icon: <SendHorizontal size={18} /> },
    { id: 'settings', label: 'Site Controls', icon: <Sliders size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 text-gray-100 pt-24 pb-20 px-3 sm:px-6 lg:px-8">
      <Toaster position="top-center" reverseOrder={false} />

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
                <span>Round Robin SMTP (3 Pools Active)</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-orange-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mt-2">
              CROSSROADS 2026 Admin Portal
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleExportExcel({ markExported: false })}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-200 border border-slate-700 hover:border-indigo-500/50 rounded-xl font-medium text-sm transition shadow-sm cursor-pointer"
              title="Quick Export All Registrations to Excel"
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
              onClick={() => setActiveTab(tab.id)}
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

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-900/80 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Total Teams</span>
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                    <Users size={22} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white">{analytics.total}</div>
                <p className="text-xs text-gray-400 mt-2">Active confirmed team entries</p>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Total Participants</span>
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <Sparkles size={22} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white">{analytics.totalParticipants}</div>
                <p className="text-xs text-gray-400 mt-2">Total registered student footfall</p>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Today's Registrations</span>
                  <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400">
                    <Calendar size={22} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white">{analytics.today}</div>
                <p className="text-xs text-gray-400 mt-2">New signups logged today</p>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
                <div className="flex items-center justify-between mb-4">
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
                <p className="text-xs text-gray-400 mt-2">Across 11 distinct festival events</p>
              </div>
            </div>

            {/* Round Robin SMTP Status Card */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/15 rounded-xl text-purple-400">
                    <Repeat size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Active Round Robin SMTP Cluster</h3>
                    <p className="text-xs text-gray-400">Outbound emails cycle automatically across 3 high-capacity SMTP accounts</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold w-fit">
                  Load Balancing: Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {smtpPool.map((account, index) => (
                  <div key={index} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-purple-400">Pool #{index + 1}</span>
                      <p className="text-sm font-semibold text-gray-200 mt-0.5">{account.user}</p>
                      <span className="text-[11px] text-gray-500">Google SMTP Relay</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Ready"></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Distribution & College Rankings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Event Wise Bars */}
              <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Trophy className="text-indigo-400" size={20} />
                    <span>Event-Wise Registrations</span>
                  </h3>
                  <span className="text-xs text-gray-400">Sorted by popularity</span>
                </div>

                <div className="space-y-4">
                  {analytics.eventWise.map((ev) => {
                    const percent = analytics.total > 0 ? Math.round((ev.count / analytics.total) * 100) : 0;
                    return (
                      <div key={ev._id} className="space-y-1.5">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-200">{getEventDisplay(ev._id)}</span>
                          <span className="text-xs text-indigo-300 font-bold">
                            {ev.count} teams ({ev.participants || ev.count} students • {percent}%)
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
                  <span className="text-xs text-gray-400">Leaderboard</span>
                </div>

                <div className="space-y-3">
                  {analytics.collegeWise.map((col, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="w-6 h-6 rounded-full bg-slate-700 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-300 font-medium truncate">{col._id}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold shrink-0 ml-2">
                        {col.count} teams
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

        {/* TAB 2: TEAMS & VIEW TEAM DATA */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            {/* Filter Bar */}
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

                {/* College Filter */}
                <div>
                  <select
                    value={filterCollege}
                    onChange={(e) => setFilterCollege(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Colleges</option>
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

              {/* Date Filters & Clear */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-3">
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
                  {(searchTerm || filterEvent !== 'all' || filterTrack !== 'all' || filterCollege !== 'all' || filterStatus !== 'all' || dateFrom || dateTo) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterEvent('all');
                        setFilterTrack('all');
                        setFilterCollege('all');
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

                <div className="text-gray-400">
                  Showing <strong className="text-white">{filteredTeams.length}</strong> of {teams.length} teams
                </div>
              </div>
            </div>

            {/* Quick Action Toolbar for Candidates (Bulk Confirmation Button) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900 border border-emerald-500/30 rounded-2xl">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MailCheck size={18} className="text-emerald-400" />
                  <span>Candidate Confirmation Dispatcher</span>
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Send registration confirmation emails anytime. Leader is placed in <strong>TO</strong> and all team members are kept in <strong>CC</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSendBulkConfirmations}
                  disabled={actionLoading || filteredTeams.length === 0}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <SendHorizontal size={14} />
                  <span>Send Confirmation to All Filtered Teams ({filteredTeams.length})</span>
                </button>

                <button
                  onClick={() => handleExportExcel()}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-200 border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
                >
                  <Download size={14} className="text-indigo-400" />
                  <span>Export Filtered</span>
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
                      <th className="px-5 py-4">Team & Event</th>
                      <th className="px-5 py-4">Leader (TO)</th>
                      <th className="px-5 py-4">Members (CC)</th>
                      <th className="px-5 py-4">College</th>
                      <th className="px-5 py-4 text-center">Size</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredTeams.map((team) => (
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
                          <div className="truncate max-w-[200px] text-gray-300">{team.college}</div>
                          <div className="text-xs text-gray-500">{team.branch} • {team.year}</div>
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
                    ))}
                    {filteredTeams.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
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
                  <h3 className="text-xl font-bold text-white">Filter-Wise Excel Export</h3>
                  <p className="text-xs text-gray-400">Download formatted multi-tab Excel sheets by event, track or college</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Filter by Event</label>
                  <select
                    value={exportFilterEvent}
                    onChange={(e) => setExportFilterEvent(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Events (Includes separate tab for each)</option>
                    {Object.entries(EVENT_DISPLAY_NAMES).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Filter by Track / Domain</label>
                  <select
                    value={exportFilterTrack}
                    onChange={(e) => setExportFilterTrack(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Tracks</option>
                    <option value="technical">Technical Track (Coding, Exhibition, Robo, Poster)</option>
                    <option value="cultural">Cultural Track (Dance, Rangoli, Food, Band, Short Film)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Filter by College</label>
                  <select
                    value={exportFilterCollege}
                    onChange={(e) => setExportFilterCollege(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Participating Colleges</option>
                    <option value="hiet">HIET Ghaziabad Teams Only</option>
                    <option value="outside">Outside College Teams Only</option>
                  </select>
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
                    Mark exported records as "Exported: True" in database
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => handleExportExcel()}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download size={18} />
                  <span>Download Filtered Excel Workbook</span>
                </button>
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
                  <p className="text-xs text-gray-400">Send announcements to participant emails (via Round Robin) and/or pin to website top banner</p>
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Audience Target</label>
                    <select
                      value={broadcastForm.target}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, target: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="all">All Registrations</option>
                      {Object.entries(EVENT_DISPLAY_NAMES).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
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
                    <span className="text-xs text-gray-400">Audience Size:</span>
                    <div className="text-xl font-extrabold text-indigo-300">{previewMatchedCount} Team Leaders</div>
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
                    <p className="text-xs text-gray-400">Dispatches via Round Robin SMTP (3 Google Accounts)</p>
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
                    placeholder="e.g., CROSSROADS 2026 – Reporting Time & Venue Information"
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
                      placeholder="https://chat.whatsapp.com/..."
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

        {/* TAB 6: HIGHER AUTHORITY REPORTS (DIRECTOR + HODs IN CC) */}
        {activeTab === 'authority' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <SendHorizontal size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Send Report to Higher Authority</h3>
                  <p className="text-xs text-gray-400">
                    Dispatch live registration digests to the Director with respective HODs in CC
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendAuthorityReport} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                    Select Track / Domain / Event *
                  </label>
                  <select
                    value={authorityReport.track}
                    onChange={(e) => handleTrackChangeForAuthority(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Events (Institute Comprehensive Report) — CC: HOD (ag902065@gmail.com)</option>
                    <option value="technical">Technical Track (CSE & MCA) — CC: HOD (ag902065@gmail.com)</option>
                    <option value="robotics">Robotics Track (EE) — CC: HOD (ag902065@gmail.com)</option>
                    <option value="cultural">Cultural Track — CC: HOD / Cultural Head (ag902065@gmail.com)</option>
                    <optgroup label="Specific Event Reports">
                      {Object.entries(EVENT_DISPLAY_NAMES).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                    Primary Recipient (To: Director) *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400" size={16} />
                    <input
                      type="email"
                      required
                      value={authorityReport.directorEmail}
                      onChange={(e) => setAuthorityReport({ ...authorityReport, directorEmail: e.target.value })}
                      placeholder="ag0567688@gmail.com"
                      className="w-full pl-9 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* CC HODs Section */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                    Carbon Copy (CC: Head of Departments & Committee Heads)
                  </label>
                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {authorityReport.ccEmails.map((email, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-950 text-indigo-300 border border-indigo-700/50"
                        >
                          <span>{email}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCcEmail(email)}
                            className="hover:text-red-400 rounded-full cursor-pointer"
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
                      <input
                        type="email"
                        value={newCcEmailInput}
                        onChange={(e) => setNewCcEmailInput(e.target.value)}
                        placeholder="Add another email to CC..."
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCcEmail();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCcEmail}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        Add CC
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                    Coordinator Remarks / Executive Highlights
                  </label>
                  <textarea
                    rows="3"
                    value={authorityReport.remarks}
                    onChange={(e) => setAuthorityReport({ ...authorityReport, remarks: e.target.value })}
                    placeholder="Enter any notes or observations for the Director & HODs..."
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-slate-800/50 rounded-xl border border-slate-700">
                  <input
                    type="checkbox"
                    id="attachExcelCheck"
                    checked={authorityReport.attachExcel}
                    onChange={(e) => setAuthorityReport({ ...authorityReport, attachExcel: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700 cursor-pointer"
                  />
                  <label htmlFor="attachExcelCheck" className="text-xs text-gray-300 cursor-pointer">
                    <strong>Attach Live Filtered Excel Spreadsheet (.xlsx)</strong> containing all team & participant details
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <SendHorizontal size={20} />
                  <span>{actionLoading ? 'Dispatching Official Report...' : 'Send Official Report to Director & HODs'}</span>
                </button>
              </form>
            </div>

            {/* Live Report Preview */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="text-indigo-400" size={18} />
                <span>Executive Digest Preview</span>
              </h3>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4 text-xs text-gray-300">
                <div className="text-center pb-3 border-b border-slate-800">
                  <div className="font-extrabold text-sm text-indigo-400">HIET GHAZIABAD</div>
                  <div className="text-gray-400 font-medium">CROSSROADS 2026 REGISTRATION REPORT</div>
                  <div className="text-[11px] text-gray-500 mt-1">Track: {getEventDisplay(authorityReport.track)}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-gray-400">Total Teams</div>
                    <div className="text-base font-bold text-white mt-0.5">{analytics.total}</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-gray-400">Total Students</div>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">{analytics.totalParticipants}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-gray-200">Email Routing:</div>
                  <div className="text-gray-400">
                    • <strong>To (Director):</strong> {authorityReport.directorEmail || 'ag0567688@gmail.com'}<br />
                    • <strong>Cc (HOD):</strong> {authorityReport.ccEmails.join(', ')}<br />
                    • <strong>Attachment:</strong> {authorityReport.attachExcel ? 'CROSSROADS_2026_Report.xlsx' : 'None'}
                  </div>
                </div>

                <div className="p-3 bg-indigo-950/40 border border-indigo-700/40 rounded-lg text-indigo-300 text-[11px] leading-relaxed">
                  💡 Dispatched via Round Robin SMTP cluster with HTML tables and live statistics.
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
                    Control online registrations across the entire CROSSROADS 2026 website
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

              <div className="pt-6">
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                  Message Displayed When Registrations Are Closed
                </label>
                <input
                  type="text"
                  value={siteSettings.closedMessage || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, closedMessage: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Online registrations for CROSSROADS 2026 are currently paused."
                />
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

        {/* TEAM DETAILS MODAL (VIEW TEAM DATA & SEND CONFIRMATION) */}
        <AnimatePresence>
          {selectedTeam && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
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
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;