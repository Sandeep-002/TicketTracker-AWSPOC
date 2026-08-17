import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Headphones, Filter, Clock, CheckCircle2, AlertCircle, ArrowUpRight, MessageSquare, UserCheck, Shield } from 'lucide-react';

const ITSupportDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assignedOnly, setAssignedOnly] = useState(false);

  const [supportNotifications, setSupportNotifications] = useState([]);

  useEffect(() => {
    fetchTickets();
    fetchNotifications();
  }, [statusFilter, priorityFilter]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/v1/notifications');
      setSupportNotifications(res.data.slice(0, 3));
    } catch (e) {}
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const res = await api.get('/api/v1/tickets', { params });
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to load IT support tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      await api.patch(`/api/v1/tickets/${ticketId}/status`, {
        status: newStatus,
        assignedToId: user.id,
        assignedToName: user.fullName
      });
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid status transition.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-1 rounded-full font-semibold">OPEN</span>;
      case 'IN_PROGRESS':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-semibold">IN PROGRESS</span>;
      case 'RESOLVED':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-semibold">RESOLVED</span>;
      case 'CLOSED':
        return <span className="bg-slate-500/10 text-slate-400 border border-slate-500/30 text-xs px-2.5 py-1 rounded-full font-semibold">CLOSED</span>;
      default:
        return null;
    }
  };

  const displayedTickets = assignedOnly 
    ? tickets.filter(t => String(t.assignedToId) === String(user?.id))
    : tickets;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Headphones className="w-8 h-8 text-amber-400" />
              IT Support Workspace
            </h1>
            <p className="text-slate-400 text-sm mt-1">Review tickets assigned by Admin, update resolution progress, and respond to users</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
            <button
              onClick={() => setAssignedOnly(false)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !assignedOnly ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Queue ({tickets.length})
            </button>
            <button
              onClick={() => setAssignedOnly(true)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                assignedOnly ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              Assigned to Me ({tickets.filter(t => String(t.assignedToId) === String(user?.id)).length})
            </button>
          </div>
        </div>

        {/* Live Support Activity & Notifications Banner */}
        {(() => {
          const queueAlerts = supportNotifications.filter(n => n.category !== 'SYSTEM_EVENT');
          if (queueAlerts.length === 0) return null;

          const getBadgeText = (type) => {
            switch (type) {
              case 'TICKET_ASSIGNED': return 'ASSIGNED TO YOU';
              case 'TICKET_STATUS_UPDATED': return 'STATUS UPDATE';
              case 'COMMENT_ADDED': return 'USER RESPONSE';
              case 'TICKET_CREATED': return 'NEW QUEUE TICKET';
              default: return type || 'EVENT';
            }
          };

          return (
            <div className="glass-card p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 mb-8">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Support Queue Real-Time Alerts & Activity</span>
                </div>
                <span className="text-[10px] text-amber-400/80 font-mono">Live Sync</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {queueAlerts.map(n => (
                  <div key={n.id} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs flex flex-col justify-between hover:border-amber-500/30 transition-colors">
                    <span className="self-start bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold mb-1.5">
                      {getBadgeText(n.eventType)}
                    </span>
                    <p className="text-slate-200 text-xs leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Filters */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 mb-8 flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Filter Queue:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2"
          >
            <option value="">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Ticket List Table */}
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading support queue...</div>
          ) : displayedTickets.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-500/40 mx-auto mb-2" />
              <p className="font-semibold text-slate-300">No support tickets found.</p>
              {assignedOnly && <p className="text-xs text-slate-500 mt-1">No tickets have been assigned to you yet by the Admin.</p>}
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">ID & Title</th>
                  <th className="p-4">Requested By</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Assigned Staff</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update Workflow Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {displayedTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/40">
                    <td className="p-4">
                      <Link to={`/tickets/${t.id}`} className="font-bold text-white hover:text-indigo-400 flex items-center gap-2">
                        #{t.id} {t.title}
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                      </Link>
                      <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">{t.description}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-200">{t.createdByName || 'User'}</p>
                      <p className="text-xs text-slate-400">{t.createdByEmail}</p>
                    </td>
                    <td className="p-4"><span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-xs">{t.category}</span></td>
                    <td className="p-4">
                      {String(t.assignedToId) === String(user?.id) ? (
                        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit">
                          <UserCheck className="w-3 h-3 text-amber-400" /> Assigned to You
                        </span>
                      ) : t.assignedToName ? (
                        <span className="text-xs text-slate-400">{t.assignedToName}</span>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">{getStatusBadge(t.status)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.status === 'OPEN' && (
                          <button
                            onClick={() => handleStatusUpdate(t.id, 'IN_PROGRESS')}
                            className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-amber-600/20 transition-all"
                          >
                            Start (In Progress)
                          </button>
                        )}
                        {(t.status === 'OPEN' || t.status === 'IN_PROGRESS') && (
                          <button
                            onClick={() => handleStatusUpdate(t.id, 'RESOLVED')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
                          >
                            Resolve Ticket
                          </button>
                        )}
                        {t.status === 'RESOLVED' && (
                          <button
                            onClick={() => handleStatusUpdate(t.id, 'CLOSED')}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          >
                            Close Ticket
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ITSupportDashboard;
