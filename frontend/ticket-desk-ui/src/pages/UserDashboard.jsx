import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { 
  Plus, Ticket, Filter, Search, Paperclip, MessageSquare, Clock, AlertCircle, CheckCircle2, ChevronRight, Upload, Download, Trash2, UploadCloud, FileText, X
} from 'lucide-react';

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Create Ticket Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('SOFTWARE');
  const [priority, setPriority] = useState('MEDIUM');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [createError, setCreateError] = useState('');

  const [userNotifications, setUserNotifications] = useState([]);

  useEffect(() => {
    fetchTickets();
    fetchUserNotifications();
  }, [statusFilter, priorityFilter, categoryFilter]);

  const fetchUserNotifications = async () => {
    try {
      const res = await api.get('/api/v1/notifications');
      setUserNotifications(res.data.slice(0, 3)); // show top 3 latest
    } catch (e) {}
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (categoryFilter) params.category = categoryFilter;

      const res = await api.get('/api/v1/tickets', { params });
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAttachment = async (e, url, originalName) => {
    if (e) e.preventDefault();
    if (!url) return;

    let filename = originalName || 'ticket-attachment';

    try {
      if (url.startsWith('data:')) {
        const mimeMatch = url.match(/^data:([^;]+);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

        if (!filename.includes('.')) {
          let ext = 'bin';
          if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
          else if (mime.includes('png')) ext = 'png';
          else if (mime.includes('gif')) ext = 'gif';
          else if (mime.includes('webp')) ext = 'webp';
          else if (mime.includes('pdf')) ext = 'pdf';
          else if (mime.includes('word') || mime.includes('docx')) ext = 'docx';
          else if (mime.includes('excel') || mime.includes('xlsx')) ext = 'xlsx';
          else if (mime.includes('zip')) ext = 'zip';
          else if (mime.includes('text')) ext = 'txt';
          filename = `${filename}.${ext}`;
        }

        const base64Data = url.split(',')[1];
        const bstr = atob(base64Data);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        return;
      }

      if (filename.includes('?')) filename = filename.split('?')[0];
      const response = await fetch(url);
      if (!response.ok) throw new Error("Fetch failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename.split('/').pop() || 'attachment';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("Unable to download attachment.");
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setCreateError('');
    setUploading(true);

    try {
      let attachmentUrl = null;

      if (selectedFile) {
        try {
          const fileKey = `${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const arrayBuffer = await selectedFile.arrayBuffer();
          await api.put(`/api/v1/tickets/simulated-upload/${fileKey}`, arrayBuffer, {
            headers: { 'Content-Type': selectedFile.type || 'application/octet-stream' }
          });
          attachmentUrl = `http://localhost:8080/api/v1/tickets/attachments/${fileKey}`;
        } catch (uploadErr) {
          // Data URL fallback if binary endpoint is unreachable
          attachmentUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(selectedFile);
          });
        }
      }

      await api.post('/api/v1/tickets', {
        title,
        description,
        category,
        priority,
        attachmentUrl
      });

      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      fetchTickets();
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setUploading(false);
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

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'URGENT':
        return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs px-2.5 py-0.5 rounded font-mono font-bold">URGENT</span>;
      case 'HIGH':
        return <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs px-2.5 py-0.5 rounded font-mono font-semibold">HIGH</span>;
      case 'MEDIUM':
        return <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs px-2.5 py-0.5 rounded font-mono">MEDIUM</span>;
      default:
        return <span className="bg-slate-500/10 text-slate-400 border border-slate-500/30 text-xs px-2.5 py-0.5 rounded font-mono">LOW</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">My IT Support Tickets</h1>
            <p className="text-slate-400 text-sm mt-1">Submit support requests, attach files, and track resolutions in real-time</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Ticket</span>
          </button>
        </div>

        {/* Live Notification & Activity Banner */}
        {(() => {
          const userActivity = userNotifications.filter(n => n.category !== 'SYSTEM_EVENT');
          if (userActivity.length === 0) return null;

          const getBadgeText = (type) => {
            switch (type) {
              case 'TICKET_ASSIGNED': return 'ASSIGNED';
              case 'TICKET_STATUS_UPDATED': return 'STATUS UPDATE';
              case 'COMMENT_ADDED': return 'NEW RESPONSE';
              case 'TICKET_CREATED': return 'CREATED';
              default: return type || 'EVENT';
            }
          };

          return (
            <div className="glass-card p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 mb-8">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>My Ticket Activity & Alerts</span>
                </div>
                <span className="text-[10px] text-indigo-400/80 font-mono">Live Sync</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {userActivity.map(n => (
                  <div key={n.id} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
                    <span className="self-start bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold mb-1.5">
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
        <div className="glass-card p-4 rounded-2xl border border-slate-800 mb-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span>Filter Tickets:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
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
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            <option value="HARDWARE">Hardware</option>
            <option value="SOFTWARE">Software</option>
            <option value="NETWORK">Network</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Tickets Grid */}
        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading your tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-slate-400 border border-slate-800">
            <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-lg font-semibold text-slate-300">No tickets found</p>
            <p className="text-sm mt-1">You haven't submitted any IT support tickets matching the filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono text-slate-400">#{ticket.id}</span>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-lg group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {ticket.title}
                  </h3>

                  <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-300">
                      {ticket.category}
                    </span>
                    {ticket.attachmentUrl && (
                      <button
                        type="button"
                        onClick={(e) => handleDownloadAttachment(e, ticket.attachmentUrl)}
                        className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer z-10"
                        title="Download Attachment"
                      >
                        <Download className="w-3.5 h-3.5" /> Attachment
                      </button>
                    )}
                    <span className="flex items-center gap-1 text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5" /> {ticket.comments?.length || 0}
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-lg p-6 rounded-3xl border border-slate-800 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Submit New IT Support Ticket
            </h2>

            {createError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs mb-4">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cannot connect to company VPN or Printer offline"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="HARDWARE">Hardware</option>
                    <option value="SOFTWARE">Software</option>
                    <option value="NETWORK">Network</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Detailed Description</label>
                <textarea
                  required
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue, step-by-step reproduction, error messages..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Attach File (Supports PNG, JPG, PDF, DOCX, XLSX, TXT, ZIP)</label>
                
                {!selectedFile ? (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-2xl p-6 bg-slate-900/60 cursor-pointer transition-all hover:bg-indigo-950/20 group">
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-200">Click or Drag to Add Attachment</p>
                    <p className="text-[11px] text-slate-500 mt-1">Accepts all file extensions up to 50MB</p>
                  </label>
                ) : (
                  <div className="p-3.5 bg-slate-900 border border-indigo-500/40 rounded-2xl flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                        <p className="text-[11px] font-mono text-slate-400">
                          {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Attachment'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-indigo-400 hover:text-indigo-300 px-2.5 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 cursor-pointer transition-all">
                        Change File
                        <input
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-all flex items-center gap-1 text-xs"
                        title="Remove Attachment"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <span>Submit Ticket</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
