import { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';

const STATUS_BADGE = {
  pending: {
    label: 'Pending Contact',
    classes: 'bg-red-500/15 text-red-300 border-red-500/35',
  },
  contacted: {
    label: 'Contacted',
    classes: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
  },
  resolved: {
    label: 'Resolved',
    classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
  },
};

const ERROR_TYPE_META = {
  server_error: { label: 'Server Error', classes: 'bg-red-950/80 text-red-300 border-red-500/40' },
  network_timeout: { label: 'Network / Timeout', classes: 'bg-orange-950/80 text-orange-300 border-orange-500/40' },
  validation_conflict: { label: 'Duplicate / Rule Conflict', classes: 'bg-amber-950/80 text-amber-300 border-amber-500/40' },
  closed_gate: { label: 'Registration Closed', classes: 'bg-purple-950/80 text-purple-300 border-purple-500/40' },
  client_submit_error: { label: 'Client Submit Issue', classes: 'bg-rose-950/80 text-rose-300 border-rose-500/40' },
};

/**
 * Admin panel view for inspecting every server error, network interruption, or duplicate/rule
 * conflict encountered by participants during registration, complete with 1-click WhatsApp/Email recovery.
 */
export default function FailedRegistrationsPanel({
  logs,
  stats,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  search,
  setSearch,
  onRefresh,
  onUpdateIssue,
  onDeleteIssue,
  actionLoading,
  getEventDisplay,
}) {
  const [noteDrafts, setNoteDrafts] = useState({});

  const getNoteValue = (log) =>
    noteDrafts[log._id] !== undefined ? noteDrafts[log._id] : log.adminNote || '';

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-gray-400 uppercase font-semibold">Total Issues</div>
          <div className="text-2xl font-extrabold text-white mt-1">{stats.total || 0}</div>
        </div>
        <div className="bg-slate-900/80 border border-red-500/25 rounded-2xl p-4">
          <div className="text-xs text-red-400 uppercase font-semibold">Pending Contact</div>
          <div className="text-2xl font-extrabold text-red-300 mt-1">{stats.pending || 0}</div>
        </div>
        <div className="bg-slate-900/80 border border-amber-500/25 rounded-2xl p-4">
          <div className="text-xs text-amber-400 uppercase font-semibold">Contacted</div>
          <div className="text-2xl font-extrabold text-amber-300 mt-1">{stats.contacted || 0}</div>
        </div>
        <div className="bg-slate-900/80 border border-emerald-500/25 rounded-2xl p-4">
          <div className="text-xs text-emerald-400 uppercase font-semibold">Resolved</div>
          <div className="text-2xl font-extrabold text-emerald-300 mt-1">{stats.resolved || 0}</div>
        </div>
        <div className="bg-slate-900/80 border border-rose-500/25 rounded-2xl p-4 col-span-2 sm:col-span-1">
          <div className="text-xs text-rose-400 uppercase font-semibold">Server / Network</div>
          <div className="text-2xl font-extrabold text-rose-300 mt-1">{stats.serverErrors || 0}</div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, team, error..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white cursor-pointer"
          >
            <option value="all">All Follow-up Status</option>
            <option value="pending">Pending Contact</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white cursor-pointer"
          >
            <option value="all">All Error Categories</option>
            <option value="server_error">Server Errors (500+)</option>
            <option value="network_timeout">Network / Timeout</option>
            <option value="validation_conflict">Duplicate / 2-Event Conflicts</option>
            <option value="closed_gate">Closed Event / Gate</option>
            <option value="client_submit_error">Client Submit Error</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => onRefresh()}
          disabled={actionLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={15} />
          <span>Apply / Refresh</span>
        </button>
      </div>

      {/* Captured Issues List */}
      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-12 text-center">
            <CheckCircle2 size={36} className="mx-auto text-emerald-400 mb-3 opacity-80" />
            <h3 className="text-base font-bold text-white">No Failed Registration Issues Match Filter</h3>
            <p className="text-xs text-gray-400 mt-1">
              Any server error, network drop, duplicate conflict, or registration block is automatically saved here.
            </p>
          </div>
        ) : (
          logs.map((log) => {
            const stMeta = STATUS_BADGE[log.followUpStatus || 'pending'] || STATUS_BADGE.pending;
            const typeMeta =
              ERROR_TYPE_META[log.errorType || 'server_error'] || ERROR_TYPE_META.server_error;
            const waClean = (log.leader?.whatsapp || log.leader?.mobile || '').replace(/\D/g, '');
            const telClean = (log.leader?.mobile || '').replace(/\D/g, '');

            return (
              <div
                key={log._id}
                className="bg-slate-900/85 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4"
              >
                {/* Top Meta Row */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${stMeta.classes}`}>
                      {stMeta.label}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${typeMeta.classes}`}>
                      {typeMeta.label} {log.httpStatus ? `(${log.httpStatus})` : ''}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-800 text-gray-300 border border-slate-700">
                      {log.source || 'backend'}
                    </span>
                    {log.event && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-950/70 text-indigo-300 border border-indigo-700/50">
                        {getEventDisplay(log.event)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock size={13} />
                    <span>
                      {new Date(log.occurredAt || log.createdAt).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      IST
                    </span>
                  </div>
                </div>

                {/* Exact Error Banner */}
                <div className="p-3.5 rounded-xl bg-red-950/35 border border-red-500/35 flex items-start gap-2.5">
                  <AlertCircle size={17} className="text-red-400 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-red-100 leading-relaxed flex-1">
                    <strong className="text-red-300">Error Occurred: </strong>
                    {log.errorMessage}
                    {log.errorField && (
                      <span className="ml-2 font-mono text-[11px] px-2 py-0.5 rounded bg-red-900/50 border border-red-500/30 text-red-200">
                        Field: {log.errorField}
                      </span>
                    )}
                  </div>
                </div>

                {/* Filled Contact & Registration Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      Team &amp; Institution
                    </div>
                    <div>
                      <span className="text-gray-400">Team Name: </span>
                      <strong className="text-white">{log.teamName || 'Not entered'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400">Team Size: </span>
                      <strong className="text-gray-200">{log.teamSize || 1} Member(s)</strong>
                    </div>
                    <div>
                      <span className="text-gray-400">College: </span>
                      <span className="text-gray-200">
                        {log.college === 'OTHER' ? log.customCollege || 'Other' : log.college || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Course / Branch / Year: </span>
                      <span className="text-gray-300">
                        {[log.course, log.branch, log.year].filter(Boolean).join(' • ') || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Leader Contact Details
                    </div>
                    <div>
                      <span className="text-gray-400">Leader Name: </span>
                      <strong className="text-white">{log.leader?.name || 'Not entered'}</strong>
                    </div>
                    <div className="break-all">
                      <span className="text-gray-400">Email: </span>
                      <span className="text-cyan-300 font-mono">{log.leader?.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Calling Mobile: </span>
                      <span className="text-gray-200 font-mono">{log.leader?.mobile || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">WhatsApp: </span>
                      <span className="text-emerald-300 font-mono">
                        {log.leader?.whatsapp || log.leader?.mobile || 'N/A'}
                      </span>
                    </div>

                    {/* 1-Click Reach Out Actions */}
                    <div className="flex flex-wrap gap-2 pt-1.5">
                      {log.leader?.email && (
                        <a
                          href={`mailto:${log.leader.email}?subject=CROSSROADS%202027%20Registration%20Help`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/35 text-blue-300 hover:bg-blue-500/25 text-[11px] font-semibold"
                        >
                          <Mail size={12} /> Email
                        </a>
                      )}
                      {waClean && (
                        <a
                          href={`https://wa.me/91${waClean.slice(-10)}?text=${encodeURIComponent(
                            `Hi ${log.leader?.name || 'Participant'}, we noticed a problem during your CROSSROADS 2027 registration for "${log.teamName || getEventDisplay(log.event)}". How can Team Tech Fusion assist you?`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/25 text-[11px] font-semibold"
                        >
                          <MessageCircle size={12} /> WhatsApp
                        </a>
                      )}
                      {telClean && (
                        <a
                          href={`tel:+91${telClean.slice(-10)}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-gray-200 hover:bg-slate-700 text-[11px] font-semibold"
                        >
                          <Phone size={12} /> Call
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                      <Users size={13} /> Filled Members ({log.members?.length || 0})
                    </div>
                    {log.members && log.members.length > 0 ? (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {log.members.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
                          >
                            <div className="font-bold text-gray-200">
                              #{idx + 2} {m.name || 'Unnamed'}
                            </div>
                            <div className="text-cyan-300 font-mono truncate">{m.email || 'No email'}</div>
                            {m.mobile && <div className="text-gray-400 font-mono">{m.mobile}</div>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No additional members filled</p>
                    )}
                  </div>
                </div>

                {/* Coordinator Notes & Follow-up Action Strip */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={getNoteValue(log)}
                      onChange={(e) =>
                        setNoteDrafts((prev) => ({ ...prev, [log._id]: e.target.value }))
                      }
                      placeholder="Add follow-up coordinator note (e.g., Called leader, helped fix team email)..."
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() =>
                        onUpdateIssue(log._id, { adminNote: getNoteValue(log) })
                      }
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Save Note
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() =>
                        onUpdateIssue(log._id, {
                          followUpStatus: 'contacted',
                          adminNote: getNoteValue(log),
                        })
                      }
                      className="inline-flex items-center gap-1 px-3 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      <UserCheck size={13} /> Mark Contacted
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() =>
                        onUpdateIssue(log._id, {
                          followUpStatus: 'resolved',
                          adminNote: getNoteValue(log),
                        })
                      }
                      className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/35 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      <CheckCircle2 size={13} /> Mark Resolved
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => onDeleteIssue(log._id)}
                      className="p-2 bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-800/40 rounded-xl transition cursor-pointer"
                      title="Delete Issue Log"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
