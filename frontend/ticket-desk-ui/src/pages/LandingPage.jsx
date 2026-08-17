import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Ticket, 
  ShieldCheck, 
  Headphones, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Activity, 
  LayoutDashboard, 
  ChevronRight, 
  Sun,
  Moon,
  Clock,
  FileText,
  Paperclip,
  Check,
  TrendingUp,
  Sliders,
  LifeBuoy
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-purple-600/10 blur-[140px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-600/10 blur-[160px] rounded-full pointer-events-none -z-10"></div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Ticket className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-200">
                TicketDesk
              </span>
              <span className="block text-[10px] text-indigo-400 font-semibold tracking-widest uppercase">IT Support & Incident Portal</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-indigo-400 transition-colors">Key Features</a>
            <a href="#workflow" className="hover:text-indigo-400 transition-colors">How It Works</a>
            <a href="#solutions" className="hover:text-indigo-400 transition-colors">Solutions</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all text-xs font-semibold flex items-center gap-2"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {user ? (
              <button
                onClick={() => {
                  if (user.role === 'ROLE_ADMIN') navigate('/admin');
                  else if (user.role === 'ROLE_IT_SUPPORT') navigate('/it-support');
                  else navigate('/dashboard');
                }}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 text-sm hover:scale-105"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-4 py-2 text-sm font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Intelligent Enterprise Incident & Ticket Management</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Faster IT Resolutions. <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400">Zero Friction.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            Empower your organization with automated ticket routing, real-time activity tracking, SLA compliance monitoring, and seamless communication between users and IT engineers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {user ? (
              <button
                onClick={() => {
                  if (user.role === 'ROLE_ADMIN') navigate('/admin');
                  else if (user.role === 'ROLE_IT_SUPPORT') navigate('/it-support');
                  else navigate('/dashboard');
                }}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/35 transition-all hover:scale-105 flex items-center gap-2 text-base"
              >
                <span>Access Dashboard</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/35 transition-all hover:scale-105 flex items-center gap-2 text-base"
                >
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-indigo-500/40 font-semibold px-7 py-3.5 rounded-2xl transition-all flex items-center gap-2 text-base"
                >
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span>Create Free Account</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Live Interactive Command Center Visual */}
        <div className="relative mx-auto max-w-5xl rounded-3xl p-2 bg-gradient-to-b from-indigo-500/30 via-slate-800/40 to-slate-900/80 shadow-2xl border border-slate-800">
          <div className="bg-slate-950/90 rounded-[22px] overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-5 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="text-xs font-semibold text-slate-300 pl-2">TicketDesk Service Operations Dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  All Support Channels Active
                </span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80">
                <p className="text-slate-400 text-xs font-medium">Resolved Today</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">142</p>
                <span className="text-emerald-400 text-[11px] font-medium">98.4% On-time resolution</span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80">
                <p className="text-slate-400 text-xs font-medium">First Response SLA</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1">14 mins</p>
                <span className="text-indigo-300 text-[11px] font-medium">Under 30m target</span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80">
                <p className="text-slate-400 text-xs font-medium">Active Engineers</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">18</p>
                <span className="text-amber-300 text-[11px] font-medium">Ready for dispatch</span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80">
                <p className="text-slate-400 text-xs font-medium">User Satisfaction</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-1">4.9 / 5</p>
                <span className="text-purple-300 text-[11px] font-medium">Based on 850+ reviews</span>
              </div>
            </div>

            {/* Active Tickets List Visual */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
                <span>Live Support Stream</span>
                <span>Priority & Status</span>
              </div>

              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Network Connectivity issue in Building B - Floor 3</p>
                    <p className="text-[11px] text-slate-400">Ticket #TKT-8941 • Category: Network & Hardware • 3m ago</p>
                  </div>
                </div>
                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs px-2.5 py-1 rounded-full font-medium">HIGH PRIORITY</span>
              </div>

              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Software License Renewal & Account Access</p>
                    <p className="text-[11px] text-slate-400">Ticket #TKT-8940 • Category: Software & Permissions • Resolved</p>
                  </div>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-medium">RESOLVED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Business Features Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Incident & Service Features
          </h2>
          <p className="text-slate-400 text-base">
            Everything your team needs to track, assign, resolve, and audit support requests effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Ticket Categorization</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Categorize issues by Hardware, Software, Network, or Access Permissions with custom priority levels for streamlined queue organization.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Real-Time Instant Alerts</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get notified immediately via interactive bell alerts when a ticket status changes, a comment is posted, or an engineer is assigned.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Paperclip className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">File & Screenshot Attachments</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload diagnostic logs, error screenshots, or documents directly into ticket threads with instant visual preview thumbnails.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Role Approval & Governance</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Administrator account registration approvals guarantee that only authorized internal personnel access support queue data.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">SLA & Response Tracking</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track response times, resolution benchmarks, and ticket lifecycle stages to ensure support SLAs are consistently met.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Audit Logs & Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Maintain an immutable operational log of all ticket state changes, technician comments, and historical resolution paths.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Step-by-Step */}
      <section id="workflow" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How TicketDesk Streamlines IT Support
          </h2>
          <p className="text-slate-400 text-base">
            Three intuitive steps connecting end-users to resolution engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 relative space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="text-xl font-bold text-white">Create & Describe</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              End-users log an issue in seconds, attach error screenshots, select urgency levels, and submit their ticket to the queue.
            </p>
          </div>

          <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 relative space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="text-xl font-bold text-white">Assign & Investigate</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              System admins route tickets to specialized IT support agents who inspect diagnostics, communicate in real time, and work on fixes.
            </p>
          </div>

          <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 relative space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="text-xl font-bold text-white">Resolve & Confirm</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Once fixed, tickets are marked RESOLVED with full diagnostic notes, notifying the user immediately for confirmation and feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Tailored Solutions by Role */}
      <section id="solutions" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tailored Experiences for Every Role
          </h2>
          <p className="text-slate-400 text-base">
            Dedicated workspace views tailored specifically to End Users, IT Support Technicians, and Administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full uppercase">End User Portal</span>
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="text-lg font-bold text-white">Self-Service Incident Reporting</h4>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Submit tickets with custom categories & priorities
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Attach diagnostic screenshots & logs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Track live resolution progress & add comments
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full uppercase">IT Support Desk</span>
              <Headphones className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="text-lg font-bold text-white">Technician Ticket Queue</h4>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Manage assigned tickets in a centralized view
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Update ticket status (IN_PROGRESS, RESOLVED)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Post technical notes & resolution details
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full uppercase">Admin Control</span>
              <ShieldCheck className="w-5 h-5 text-rose-400" />
            </div>
            <h4 className="text-lg font-bold text-white">System Governance</h4>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Approve or reject newly registered user accounts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Assign pending tickets to support engineers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Monitor team SLAs and operational activity logs
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-6 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">TicketDesk IT Support System</p>
              <p className="text-[11px] text-slate-500">Enterprise Ticket Tracker & Incident Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-xs">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register Account</Link>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
          </div>

          <p className="text-slate-500">© 2026 TicketDesk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
