import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, Paperclip, MessageSquare, Send, CheckCircle2, Clock, Shield, Headphones, User, AlertCircle, Download, RotateCcw, UserCheck
} from 'lucide-react';

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [statusError, setStatusError] = useState('');

  const [itSupportList, setItSupportList] = useState([]);
  const [selectedTransferStaff, setSelectedTransferStaff] = useState('');
  const [transferring, setTransferring] = useState(false);

  useEffect(() => {
    fetchTicketDetail();
    if (user.role === 'ROLE_IT_SUPPORT' || user.role === 'ROLE_ADMIN') {
      fetchItSupportStaff();
    }
  }, [id, user.role]);

  const fetchTicketDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/v1/tickets/${id}`);
      setTicket(res.data);
    } catch (err) {
      console.error("Failed to load ticket details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItSupportStaff = async () => {
    try {
      const res = await api.get('/api/v1/admin/it-support');
      setItSupportList(res.data);
    } catch (err) {
      console.warn("Could not fetch IT support staff list:", err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatusError('');
    try {
      await api.patch(`/api/v1/tickets/${id}/status`, {
        status: newStatus,
        assignedToId: ticket?.assignedToId || (user.role === 'ROLE_IT_SUPPORT' ? user.id : null),
        assignedToName: ticket?.assignedToName || (user.role === 'ROLE_IT_SUPPORT' ? user.fullName : null)
      });
      fetchTicketDetail();
    } catch (err) {
      setStatusError(err.response?.data?.message || 'Invalid status transition.');
    }
  };

  const handleTransferTicket = async (staffId) => {
    if (!staffId) return;
    const staff = itSupportList.find(s => String(s.id) === String(staffId));
    if (!staff) return;
    setTransferring(true);
    setStatusError('');
    try {
      await api.patch(`/api/v1/tickets/${id}/assign?assignedToId=${staff.id}&assignedToName=${encodeURIComponent(staff.fullName)}`);
      setSelectedTransferStaff('');
      fetchTicketDetail();
    } catch (err) {
      setStatusError('Failed to transfer ticket to selected IT support staff.');
    } finally {
      setTransferring(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await api.post(`/api/v1/tickets/${id}/comments`, {
        content: commentText
      });
      setCommentText('');
      fetchTicketDetail();
    } catch (err) {
      alert("Failed to post comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDownloadAttachment = async (url, originalName) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="py-20 text-center text-slate-400">Loading ticket details...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Ticket Not Found</h2>
          <button onClick={() => navigate(-1)} className="mt-4 text-indigo-400 font-semibold hover:underline">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  const currentStatusIdx = statuses.indexOf(ticket.status);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets
        </button>

        {/* Ticket Header & Status Stepper */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                  Ticket #{ticket.id}
                </span>
                <span className="bg-slate-900 border border-slate-800 text-xs px-2.5 py-1 rounded-lg font-semibold text-slate-300">
                  {ticket.category}
                </span>
                <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs px-2.5 py-1 rounded-lg font-mono font-bold">
                  {ticket.priority}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">{ticket.title}</h1>
              <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                <span>Submitted by <span className="text-slate-200 font-semibold">{ticket.createdByName}</span> ({ticket.createdByEmail}) on {new Date(ticket.createdAt).toLocaleString()}</span>
                {ticket.assignedToName && (
                  <span className="text-indigo-400 font-medium bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20 inline-flex items-center gap-1 text-[11px]">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Assigned to: <strong className="text-white">{ticket.assignedToName}</strong>
                  </span>
                )}
              </p>
            </div>

            {/* Status Controls & Transfer Ticket */}
            {ticket.status === 'CLOSED' ? (
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-300">Ticket Closed</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                {/* Support & Admin Change Status Dropdown */}
                {(user.role === 'ROLE_IT_SUPPORT' || user.role === 'ROLE_ADMIN') && (
                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Change Status:</span>
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 font-bold focus:outline-none focus:border-indigo-500"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      {user.role === 'ROLE_ADMIN' && <option value="CLOSED">CLOSED</option>}
                    </select>
                  </div>
                )}

                {/* Support & Admin Transfer Ticket Dropdown */}
                {(user.role === 'ROLE_IT_SUPPORT' || user.role === 'ROLE_ADMIN') && itSupportList.length > 0 && (
                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-slate-400 uppercase">Transfer To:</span>
                    <select
                      value={selectedTransferStaff}
                      onChange={(e) => {
                        setSelectedTransferStaff(e.target.value);
                        if (e.target.value) handleTransferTicket(e.target.value);
                      }}
                      disabled={transferring}
                      className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="">Select IT Support...</option>
                      {itSupportList.map(staff => (
                        <option key={staff.id} value={staff.id}>
                          {staff.fullName} {ticket.assignedToId === staff.id ? '(Current)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* User Reopen Ticket Button (when RESOLVED or needing further resolution) */}
                {ticket.status === 'RESOLVED' && (user.role === 'ROLE_USER' || user.id === ticket.createdById) && (
                  <button
                    onClick={() => handleStatusChange('IN_PROGRESS')}
                    className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 text-xs px-4 py-2.5 rounded-2xl font-bold transition-all shadow-md cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>Reopen Ticket (Not Resolved)</span>
                  </button>
                )}

                {/* User & Admin Close Ticket Button */}
                {(user.role === 'ROLE_ADMIN' || user.role === 'ROLE_USER' || user.id === ticket.createdById) && (
                  <button
                    onClick={() => handleStatusChange('CLOSED')}
                    className="flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-300 text-xs px-4 py-2.5 rounded-2xl font-bold transition-all shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Close Ticket</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {statusError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs mb-6">
              {statusError}
            </div>
          )}

          {/* Workflow Progress Bar */}
          <div className="pt-4 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Ticket Workflow Status</p>
            <div className="grid grid-cols-4 gap-2">
              {statuses.map((st, idx) => {
                const isCompleted = idx <= currentStatusIdx;
                const isCurrent = idx === currentStatusIdx;
                return (
                  <div
                    key={st}
                    className={`p-3 rounded-xl text-center border transition-all ${
                      isCurrent
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold shadow-lg shadow-indigo-500/20'
                        : isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold'
                        : 'bg-slate-900/50 border-slate-800 text-slate-500'
                    }`}
                  >
                    <p className="text-[10px] uppercase font-mono tracking-wider mb-1">Step {idx + 1}</p>
                    <p className="text-xs">{st.replace('_', ' ')}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ticket Description & Attachment */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 mb-8">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Issue Description</h3>
          <p className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">{ticket.description}</p>

          {ticket.attachmentUrl && (
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Attached File (AWS S3)</h4>
              <button
                type="button"
                onClick={() => handleDownloadAttachment(ticket.attachmentUrl)}
                className="inline-flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:text-indigo-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Download Attachment ({ticket.attachmentUrl.split('/').pop()})</span>
              </button>
            </div>
          )}
        </div>

        {/* Threaded Discussion Comments */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            Discussion Thread ({ticket.comments?.length || 0})
          </h3>

          {/* Comment List */}
          <div className="space-y-4 mb-8">
            {(!ticket.comments || ticket.comments.length === 0) ? (
              <p className="text-slate-400 text-xs text-center py-6">No comments on this ticket yet. Add a note below.</p>
            ) : (
              ticket.comments.map((c) => (
                <div key={c.id} className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{c.authorName || 'User'}</span>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        {c.authorRole}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{c.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handlePostComment} className="flex gap-3">
            <input
              type="text"
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a response or update note..."
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={submittingComment}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0"
            >
              {submittingComment ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Post</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
