import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Users, User, Mail, Phone, GraduationCap, Trophy, Send, Loader2, AlertCircle, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const EventRegistration = () => {
  const [siteSettings, setSiteSettings] = useState({
    registrationOpen: true,
    closedMessage: '',
    eventStatus: {}
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

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
    event: '',
    teamSize: '1',
    members: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

  const branches = ['CSE', 'CSE (AI & ML)', 'ECE', 'IT', 'ME', 'EE', 'OTHER'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const allEvents = [
    { value: 'code-puzzle', label: 'Code Puzzle', icon: '💻', category: 'Technical' },
    { value: 'project-exhibition', label: 'Project Exhibition', icon: '🔬', category: 'Technical' },
    { value: 'robo-race', label: 'Robo Race', icon: '🤖', category: 'Technical' },
    { value: 'technical-poster', label: 'Technical Poster Presentation', icon: '📊', category: 'Technical' },
    { value: 'cultural-events', label: 'Cultural Events (Group Dance)', icon: '🎭', category: 'Cultural' },
    { value: 'rangoli-competition', label: 'Rangoli Competition', icon: '🎨', category: 'Cultural' },
    { value: 'food-without-fire', label: 'Food Without Fire', icon: '🍳', category: 'Cultural' },
    { value: 'dance-competition', label: 'Dance Competition (Solo Dance)', icon: '💃', category: 'Cultural' },
    { value: 'rock-band', label: 'Rock Band', icon: '🎸', category: 'Cultural' },
    { value: 'short-film-maker', label: 'Short Film Maker', icon: '🎬', category: 'Cultural' },
    { value: 'treasure-hunt', label: 'Treasure Hunt', icon: '🗺️', category: 'Fun' },
  ];

  // Fetch site control settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const res = await axios.get(`${backendUrl}/api/settings`);
        setSiteSettings(res.data);
      } catch (err) {
        // Fallback default
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSettings();
    setTimeout(() => setIsVisible(true), 150);
  }, []);

  // Reset team size when event changes
  useEffect(() => {
    if (!formData.event) return;

    let validSizes = [1, 2, 3, 4];
    if (formData.event === 'code-puzzle') validSizes = [1];
    if (formData.event === 'treasure-hunt') validSizes = [5, 6, 7, 8];

    if (!validSizes.includes(parseInt(formData.teamSize, 10))) {
      const newSize = validSizes[0].toString();
      setFormData(prev => ({ ...prev, teamSize: newSize }));
      updateTeamSize(newSize);
    }
  }, [formData.event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  const updateTeamSize = (sizeStr) => {
    const size = parseInt(sizeStr, 10);
    const requiredAdditional = Math.max(0, size - 1);

    let newMembers = [...formData.members];
    while (newMembers.length < requiredAdditional) {
      newMembers.push({ name: '', email: '' });
    }
    if (newMembers.length > requiredAdditional) {
      newMembers = newMembers.slice(0, requiredAdditional);
    }

    setFormData(prev => ({
      ...prev,
      teamSize: sizeStr,
      members: newMembers,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!siteSettings.registrationOpen) {
      return toast.error(siteSettings.closedMessage || 'Registrations are currently closed.');
    }

    // Check specific event status
    if (siteSettings.eventStatus && siteSettings.eventStatus[formData.event] === false) {
      return toast.error('Registrations for this selected event are closed.');
    }

    let finalCollege = formData.college;
    if (formData.college === 'OTHER') {
      if (!formData.customCollege?.trim()) {
        return toast.error("Please enter your college/institution name");
      }
      finalCollege = formData.customCollege.trim();
    }

    if (!formData.teamName.trim()) return toast.error("Team name is required");
    if (!formData.leaderName.trim()) return toast.error("Leader name is required");
    if (!formData.leaderEmail.includes('@')) return toast.error("Valid leader email required");
    if (!/^\d{10}$/.test(formData.leaderMobile)) return toast.error("Leader mobile must be 10 digits");

    const teamSizeNum = parseInt(formData.teamSize, 10);

    let minAllowed = 1;
    let maxAllowed = 4;
    if (formData.event === 'code-puzzle') {
      minAllowed = 1;
      maxAllowed = 1;
    } else if (formData.event === 'treasure-hunt') {
      minAllowed = 5;
      maxAllowed = 8;
    }

    if (teamSizeNum < minAllowed || teamSizeNum > maxAllowed) {
      return toast.error(
        `Team size for this event must be between ${minAllowed} and ${maxAllowed} (including leader)`
      );
    }

    if (teamSizeNum > 1 && formData.members.length !== teamSizeNum - 1) {
      return toast.error(`Please fill details for all ${teamSizeNum - 1} team member(s)`);
    }

    // Verify member details
    for (let i = 0; i < formData.members.length; i++) {
      const m = formData.members[i];
      if (!m.name.trim() || !m.email.includes('@')) {
        return toast.error(`Please provide valid name and email for Member ${i + 1}`);
      }
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        college: finalCollege,
      };

      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/api/event-register`, payload);

      toast.success(`🎉 Successfully registered! Team ID: ${res.data.teamId}`);

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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const teamSizeNum = parseInt(formData.teamSize, 10);
  const showMembersSection = teamSizeNum > 1;
  const showCustomCollege = formData.college === 'OTHER';

  let availableTeamSizes = [1, 2, 3, 4];
  if (formData.event === 'code-puzzle') availableTeamSizes = [1];
  if (formData.event === 'treasure-hunt') availableTeamSizes = [5, 6, 7, 8];

  if (settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-28">
        <Loader2 className="animate-spin text-teal-400" size={42} />
      </div>
    );
  }

  // If website registrations are turned off globally
  if (!siteSettings.registrationOpen) {
    return (
      <div className="min-h-screen bg-black py-20 px-4 pt-32 flex items-center justify-center">
        <div className="max-w-xl w-full bg-slate-900/80 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4">Registrations Closed</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            {siteSettings.closedMessage || 'Online registrations for CROSSROADS 2026 are currently paused.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-500 hover:to-sky-500 transition"
            >
              Explore Events
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-slate-800 text-gray-200 hover:text-white font-semibold rounded-xl border border-slate-700 hover:bg-slate-700 transition"
            >
              Contact Helpdesk
            </Link>
          </div>
        </div>
        <ToastContainer position="top-center" theme="dark" autoClose={6000} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-28">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-black to-teal-950/20 opacity-60"></div>

      <div className={`max-w-5xl mx-auto relative z-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950/60 border border-teal-500/30 text-teal-400 text-sm font-semibold mb-4">
            <Sparkles size={16} /> Official Registration Portal
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            <span className="text-teal-400">Team & Solo</span> Registration
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Secure your spot in CROSSROADS 2026 — Inter-College Technical & Cultural Fest!
          </p>
        </div>

        <div className="bg-slate-950/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 border border-teal-900/50 hover:border-teal-800/70 transition-all">
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Team & Event Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-teal-900/40 rounded-xl border border-teal-800/60">
                  <Users className="text-teal-400" size={28} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white">Event & Team Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-teal-300 mb-2 font-medium">Team Name *</label>
                  <input
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-900 border border-slate-700 hover:border-teal-700 rounded-xl text-white placeholder-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-600/30 transition"
                    placeholder="e.g., Code Warriors / Pixel Pioneers"
                  />
                </div>

                <div>
                  <label className="block text-teal-300 mb-2 font-medium">Select Event *</label>
                  <select
                    name="event"
                    value={formData.event}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-900 border border-slate-700 hover:border-teal-700 rounded-xl text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-600/30 cursor-pointer"
                  >
                    <option value="">-- Choose an Event --</option>
                    {allEvents.map(ev => {
                      const isClosed = siteSettings.eventStatus && siteSettings.eventStatus[ev.value] === false;
                      return (
                        <option key={ev.value} value={ev.value} disabled={isClosed}>
                          {ev.icon} {ev.label} ({ev.category}) {isClosed ? '— CLOSED' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-teal-300 mb-2 font-medium">Team Size (including leader) *</label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => updateTeamSize(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-slate-900 border border-slate-700 hover:border-teal-700 rounded-xl text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-600/30 cursor-pointer"
                  >
                    {availableTeamSizes.map(size => (
                      <option key={size} value={size}>
                        {size} member{size > 1 ? 's' : ''} {size === 1 ? '(Solo)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Leader Details */}
            <div className="space-y-6 pt-8 border-t border-teal-900/40">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-orange-900/30 rounded-xl border border-orange-800/50">
                  <User className="text-orange-400" size={28} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white">Team Leader Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-orange-300 mb-2 font-medium">Full Name *</label>
                  <input
                    name="leaderName"
                    value={formData.leaderName}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-900 border border-slate-700 hover:border-orange-700 rounded-xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-600/30"
                    placeholder="e.g. Aman Gupta"
                  />
                </div>

                <div>
                  <label className="block text-orange-300 mb-2 font-medium">Email Address *</label>
                  <input
                    type="email"
                    name="leaderEmail"
                    value={formData.leaderEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-900 border border-slate-700 hover:border-orange-700 rounded-xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-600/30"
                    placeholder="leader@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-orange-300 mb-2 font-medium">Calling Mobile Number *</label>
                  <input
                    type="tel"
                    name="leaderMobile"
                    value={formData.leaderMobile}
                    onChange={handleChange}
                    required
                    maxLength="10"
                    className="w-full px-5 py-4 bg-slate-900 border border-slate-700 hover:border-orange-700 rounded-xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-600/30"
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div>
                  <label className="block text-orange-300 mb-2 font-medium">WhatsApp Number *</label>
                  <input
                    type="tel"
                    name="leaderWhatsapp"
                    value={formData.leaderWhatsapp}
                    onChange={handleChange}
                    required
                    maxLength="10"
                    className="w-full px-5 py-4 bg-slate-900 border border-slate-700 hover:border-orange-700 rounded-xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-600/30"
                    placeholder="WhatsApp contact number"
                  />
                </div>
              </div>
            </div>

            {/* Academic Details */}
            <div className="space-y-6 pt-8 border-t border-teal-900/40">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-900/30 rounded-xl border border-purple-800/50">
                  <GraduationCap className="text-purple-400" size={28} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white">Academic Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-purple-300 mb-2 font-medium">College / Institution *</label>
                  <select
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-900 border border-slate-700 hover:border-purple-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-600/30 cursor-pointer"
                  >
                    <option value="">Select your College / University</option>
                    {colleges.map((col, idx) => (
                      <option key={idx} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {showCustomCollege && (
                  <div className="md:col-span-3">
                    <label className="block text-purple-300 mb-2 font-medium">Enter Your College Name *</label>
                    <input
                      name="customCollege"
                      value={formData.customCollege}
                      onChange={handleChange}
                      required
                      placeholder="Specify your institution name"
                      className="w-full px-5 py-4 bg-slate-900 border border-purple-700/60 rounded-xl text-white placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-purple-300 mb-2 font-medium">Branch / Course *</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-900 border border-slate-700 hover:border-purple-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-600/30 cursor-pointer"
                  >
                    <option value="">Select Branch</option>
                    {branches.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-purple-300 mb-2 font-medium">Academic Year *</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-900 border border-slate-700 hover:border-purple-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-600/30 cursor-pointer"
                  >
                    <option value="">Select Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Team Members Section */}
            {showMembersSection && (
              <div className="space-y-6 pt-8 border-t border-teal-900/40">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-sky-900/30 rounded-xl border border-sky-800/50">
                    <Users className="text-sky-400" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white">Additional Team Members</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      Enter details for {teamSizeNum - 1} team partner(s)
                    </p>
                  </div>
                </div>

                {formData.members.map((member, idx) => (
                  <div key={idx} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sky-300 mb-2 text-sm font-medium">Member #{idx + 2} Full Name *</label>
                      <input
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        required
                        className="w-full px-5 py-3.5 bg-slate-950 border border-slate-700 hover:border-sky-700 rounded-xl text-white placeholder-gray-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-600/30"
                        placeholder={`Member ${idx + 2} Name`}
                      />
                    </div>

                    <div>
                      <label className="block text-sky-300 mb-2 text-sm font-medium">Member #{idx + 2} Email *</label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                        required
                        className="w-full px-5 py-3.5 bg-slate-950 border border-slate-700 hover:border-sky-700 rounded-xl text-white placeholder-gray-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-600/30"
                        placeholder="member@example.com"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-5 sm:py-6 bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white text-xl font-bold rounded-2xl transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={26} />
                  <span>Registering Team...</span>
                </>
              ) : (
                <>
                  <Send size={24} />
                  <span>Confirm & Submit Registration</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 mt-8 text-sm">
          * A confirmation email with official Team ID will be dispatched to the leader's email upon submission.
        </p>
      </div>

      <ToastContainer position="top-center" theme="dark" autoClose={6000} />
    </div>
  );
};

export default EventRegistration;