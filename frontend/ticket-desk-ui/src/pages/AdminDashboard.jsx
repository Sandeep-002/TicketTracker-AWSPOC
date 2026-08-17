import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { 
  Users, UserCheck, UserX, UserPlus, BarChart3, Bell, Check, X, Shield, Headphones, 
  Ticket, AlertCircle, RefreshCw, Layers, Eye, EyeOff, Edit3, Trash2, User
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('approvals'); // approvals, end-users, it-support, tickets, analytics, notifications
  
  // Data States
  const [pendingUsers, setPendingUsers] = useState([]);
  const [endUsersList, setEndUsersList] = useState([]);
  const [itSupportList, setItSupportList] = useState([]);
  const [ticketsList, setTicketsList] = useState([]);
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Create IT Support Form State
  const [itFullName, setItFullName] = useState('');
  const [itEmail, setItEmail] = useState('');
  const [itPassword, setItPassword] = useState('');
  const [showItPassword, setShowItPassword] = useState(false);
  const [formMsg, setFormMsg] = useState('');
  const [formError, setFormError] = useState('');

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('ROLE_USER');
  const [editStatus, setEditStatus] = useState('APPROVED');
  const [editLoading, setEditLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'approvals') {
        const res = await api.get('/api/v1/admin/users/pending');
        setPendingUsers(res.data);
      } else if (activeTab === 'end-users') {
        const res = await api.get('/api/v1/admin/users');
        // Filter strictly for regular End Users (ROLE_USER)
        setEndUsersList(res.data.filter(u => u.role === 'ROLE_USER'));
      } else if (activeTab === 'it-support') {
        const res = await api.get('/api/v1/admin/it-support');
        setItSupportList(res.data);
      } else if (activeTab === 'tickets') {
        const [ticketsRes, supportRes] = await Promise.all([
          api.get('/api/v1/tickets'),
          api.get('/api/v1/admin/it-support')
        ]);
        setTicketsList(ticketsRes.data);
        setItSupportList(supportRes.data);
      } else if (activeTab === 'analytics') {
        const res = await api.get('/api/v1/dashboard/stats');
        setStats(res.data);
      } else if (activeTab === 'notifications') {
        const res = await api.get('/api/v1/notifications');
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    setActionLoading(true);
    try {
      await api.put(`/api/v1/admin/users/${userId}/approve`);
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
    } catch (err) {
      alert("Failed to approve user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (userId) => {
    setActionLoading(true);
    try {
      await api.put(`/api/v1/admin/users/${userId}/reject`);
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
    } catch (err) {
      alert("Failed to reject user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateItSupport = async (e) => {
    e.preventDefault();
    setFormMsg('');
    setFormError('');

    try {
      const res = await api.post('/api/v1/admin/it-support', {
        fullName: itFullName,
        email: itEmail,
        password: itPassword
      });
      setFormMsg(`IT Support account created successfully for ${res.data.email}`);
      setItFullName('');
      setItEmail('');
      setItPassword('');
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create IT Support account');
    }
  };

  // Open Edit User Modal
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditFullName(user.fullName);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditStatus(user.status);
  };

  // Submit User Update
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditLoading(true);

    try {
      const res = await api.put(`/api/v1/admin/users/${editingUser.id}`, {
        fullName: editFullName,
        email: editEmail,
        role: editRole,
        status: editStatus
      });
      setEndUsersList(endUsersList.map(u => u.id === editingUser.id ? res.data : u));
      setItSupportList(itSupportList.map(u => u.id === editingUser.id ? res.data : u));
      setEditingUser(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user details.");
    } finally {
      setEditLoading(false);
    }
  };

  // Delete User or IT Support Account
  const handleDeleteUser = async (userId, userEmail, userRole) => {
    const roleName = userRole === 'ROLE_IT_SUPPORT' ? 'IT Support Staff' : 'User';
    if (!window.confirm(`Are you sure you want to delete ${roleName} (${userEmail})?`)) return;
    setActionLoading(true);

    try {
      await api.delete(`/api/v1/admin/users/${userId}`);
      setEndUsersList(endUsersList.filter(u => u.id !== userId));
      setItSupportList(itSupportList.filter(u => u.id !== userId));
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
    } catch (err) {
      alert("Failed to delete account.");
    } finally {
      setActionLoading(false);
    }
  };

  // Assign Ticket to IT Support Personnel
  const handleAssignTicket = async (ticketId, supportStaff) => {
    if (!supportStaff) return;
    setActionLoading(true);

    try {
      const res = await api.patch(`/api/v1/tickets/${ticketId}/assign?assignedToId=${supportStaff.id}&assignedToName=${encodeURIComponent(supportStaff.fullName)}`);
      setTicketsList(ticketsList.map(t => t.id === ticketId ? res.data : t));
    } catch (err) {
      alert("Failed to assign ticket.");
    } finally {
      setActionLoading(false);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8 text-rose-500" />
              Admin Control Center
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage End Users, IT Support Team, Ticket Assignments, and Kafka Audit Logs</p>
          </div>

          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'approvals' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Pending Registration Approvals</span>
            {pendingUsers.length > 0 && (
              <span className="bg-rose-500 text-white text-[11px] px-2 py-0.5 rounded-full font-extrabold ml-1">
                {pendingUsers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('end-users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'end-users' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-indigo-400" />
            <span>End Users List</span>
          </button>

          <button
            onClick={() => setActiveTab('it-support')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'it-support' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Headphones className="w-4 h-4 text-amber-400" />
            <span>IT Support Staff List</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'tickets' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Ticket className="w-4 h-4 text-emerald-400" />
            <span>Assign Tickets to IT Support</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'analytics' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'notifications' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Audit Logs</span>
          </button>
        </div>

        {/* Tab 1: Pending Registration Approvals */}
        {activeTab === 'approvals' && (
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              Pending User Registration Requests
            </h2>

            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading pending requests...</div>
            ) : pendingUsers.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Check className="w-12 h-12 text-emerald-500/50 mx-auto mb-2" />
                <p className="font-semibold text-slate-300">All caught up!</p>
                <p className="text-xs text-slate-500 mt-1">No pending user registration approvals.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">User ID</th>
                      <th className="py-3.5 px-4 font-semibold">Full Name</th>
                      <th className="py-3.5 px-4 font-semibold">Email</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {pendingUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-4 font-mono text-xs text-slate-500">#{u.id}</td>
                        <td className="py-4 px-4 font-semibold text-white">{u.fullName}</td>
                        <td className="py-4 px-4 text-slate-400">{u.email}</td>
                        <td className="py-4 px-4">
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-semibold">
                            PENDING APPROVAL
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(u.id)}
                              disabled={actionLoading}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(u.id)}
                              disabled={actionLoading}
                              className="bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: SEPARATE END USERS LIST */}
        {activeTab === 'end-users' && (
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                Registered End Users List
              </h2>
              <span className="text-xs text-slate-400 font-mono">Total End Users: {endUsersList.length}</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading end user accounts...</div>
            ) : endUsersList.length === 0 ? (
              <div className="py-12 text-center text-slate-500">No registered end users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">User ID</th>
                      <th className="py-3.5 px-4 font-semibold">Full Name</th>
                      <th className="py-3.5 px-4 font-semibold">Email</th>
                      <th className="py-3.5 px-4 font-semibold">Account Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {endUsersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-4 font-mono text-xs text-slate-500">#{u.id}</td>
                        <td className="py-4 px-4 font-semibold text-white">{u.fullName}</td>
                        <td className="py-4 px-4 text-slate-400">{u.email}</td>
                        <td className="py-4 px-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            u.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                            u.status === 'PENDING_APPROVAL' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 
                            'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(u)}
                              className="bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit Details
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email, u.role)}
                              disabled={actionLoading}
                              className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete User
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: SEPARATE IT SUPPORT STAFF LIST */}
        {activeTab === 'it-support' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create IT Support Form */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 h-fit">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                Create IT Support Staff
              </h2>

              {formMsg && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs mb-4">{formMsg}</div>}
              {formError && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs mb-4">{formError}</div>}

              <form onSubmit={handleCreateItSupport} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={itFullName}
                    onChange={(e) => setItFullName(e.target.value)}
                    placeholder="Alex IT Support"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={itEmail}
                    onChange={(e) => setItEmail(e.target.value)}
                    placeholder="alex.support@ticketdesk.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showItPassword ? 'text' : 'password'}
                      required
                      value={itPassword}
                      onChange={(e) => setItPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3.5 pr-11 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowItPassword(!showItPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-200 transition-colors"
                      title={showItPassword ? "Hide password" : "Show password"}
                    >
                      {showItPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20"
                >
                  Provision IT Support Staff
                </button>
              </form>
            </div>

            {/* Dedicated List IT Support Staff */}
            <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-amber-400" />
                  Active IT Support Staff List
                </h2>
                <span className="text-xs text-slate-400 font-mono">Total Staff: {itSupportList.length}</span>
              </div>

              {itSupportList.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">No IT Support staff accounts created yet.</p>
              ) : (
                <div className="space-y-3">
                  {itSupportList.map((staff) => (
                    <div key={staff.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                          <Headphones className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{staff.fullName}</p>
                          <p className="text-xs text-slate-400">{staff.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(staff)}
                          className="bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(staff.id, staff.email, staff.role)}
                          className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Support
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: All Tickets & IT Support Assignment */}
        {activeTab === 'tickets' && (
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-indigo-400" />
                  Admin Ticket Assignment & Control
                </h2>
                <p className="text-xs text-slate-400 mt-1">Assign tickets to IT Support staff members to manage their queue</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">Total Tickets: {ticketsList.length}</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading system tickets...</div>
            ) : ticketsList.length === 0 ? (
              <div className="py-12 text-center text-slate-500">No tickets found in the system.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Ticket ID</th>
                      <th className="py-3.5 px-4 font-semibold">Title</th>
                      <th className="py-3.5 px-4 font-semibold">Category</th>
                      <th className="py-3.5 px-4 font-semibold">Priority</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold">Current IT Support</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Assign to IT Support</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {ticketsList.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-4 font-mono text-xs text-indigo-400">#{t.id}</td>
                        <td className="py-4 px-4 font-semibold text-white">{t.title}</td>
                        <td className="py-4 px-4 text-xs font-mono text-slate-400">{t.category}</td>
                        <td className="py-4 px-4">
                          <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                            t.priority === 'URGENT' || t.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(t.status)}</td>
                        <td className="py-4 px-4 text-xs font-semibold text-slate-300">
                          {t.assignedToName ? (
                            <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
                              <Headphones className="w-3 h-3 text-amber-400" /> {t.assignedToName}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={t.assignedToId || ""}
                              onChange={(e) => {
                                const selectedStaff = itSupportList.find(s => String(s.id) === e.target.value);
                                if (selectedStaff) {
                                  handleAssignTicket(t.id, selectedStaff);
                                }
                              }}
                              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-indigo-500 font-medium"
                            >
                              <option value="" disabled>Select IT Support Staff...</option>
                              {itSupportList.map(s => (
                                <option key={s.id} value={s.id}>{s.fullName} ({s.email})</option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Analytics */}
        {activeTab === 'analytics' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-800">
              <p className="text-xs uppercase font-semibold text-slate-400">Total System Tickets</p>
              <h3 className="text-4xl font-extrabold text-white mt-2">{stats.totalTickets || 0}</h3>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-slate-800">
              <p className="text-xs uppercase font-semibold text-amber-400">Open & In-Progress</p>
              <h3 className="text-4xl font-extrabold text-amber-400 mt-2">
                {((stats.statusCounts?.OPEN || stats.ticketsByStatus?.OPEN || 0) + 
                  (stats.statusCounts?.IN_PROGRESS || stats.ticketsByStatus?.IN_PROGRESS || 0))}
              </h3>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-slate-800">
              <p className="text-xs uppercase font-semibold text-emerald-400">Resolved & Closed</p>
              <h3 className="text-4xl font-extrabold text-emerald-400 mt-2">
                {((stats.statusCounts?.RESOLVED || stats.ticketsByStatus?.RESOLVED || 0) + 
                  (stats.statusCounts?.CLOSED || stats.ticketsByStatus?.CLOSED || 0))}
              </h3>
            </div>
          </div>
        )}

        {/* Tab 6: Notifications / Kafka Event Logs */}
        {activeTab === 'notifications' && (
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-400" />
              Kafka Real-Time Audit Event Logs
            </h2>

            {notifications.length === 0 ? (
              <p className="text-slate-500 py-8 text-center text-sm">No audit logs published yet.</p>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {notifications.map((n) => {
                  const logTime = n.timestamp || n.createdAt;
                  const formattedTime = logTime ? new Date(logTime).toLocaleTimeString() : new Date().toLocaleTimeString();
                  return (
                    <div key={n.id} className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-indigo-400 font-bold">[{n.eventType}]</span>{' '}
                        <span className="text-slate-200">{n.message}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-[11px]">{formattedTime}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 rounded-2xl border border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-400" />
              Update Account Details (#{editingUser.id})
            </h2>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="ROLE_USER">User (ROLE_USER)</option>
                  <option value="ROLE_IT_SUPPORT">IT Support (ROLE_IT_SUPPORT)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING_APPROVAL">Pending Approval</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
