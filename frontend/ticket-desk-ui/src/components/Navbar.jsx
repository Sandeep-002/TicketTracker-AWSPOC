import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { Ticket, LogOut, User, Shield, Headphones, Sun, Moon, Bell, Check, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 8000); // Auto refresh every 8s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/v1/notifications');
      setNotifications(res.data);
      const readState = JSON.parse(localStorage.getItem(`read_notifications_${user?.id}`) || '[]');
      const unread = res.data.filter(n => !readState.includes(n.id)).length;
      setUnreadCount(unread);
    } catch (err) {
      // Ignore notification fetch errors silently
    }
  };

  const handleMarkAllRead = () => {
    const allIds = notifications.map(n => n.id);
    localStorage.setItem(`read_notifications_${user?.id}`, JSON.stringify(allIds));
    setUnreadCount(0);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><Shield className="w-3 h-3"/> Admin</span>;
      case 'ROLE_IT_SUPPORT':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><Headphones className="w-3 h-3"/> IT Support</span>;
      default:
        return <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><User className="w-3 h-3"/> End User</span>;
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-800/80 px-6 py-3.5 mb-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              TicketDesk
            </span>
            <span className="block text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">IT Support System</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 hover:border-indigo-500/40 transition-all flex items-center gap-2 text-xs font-semibold"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline text-slate-300">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline text-slate-700">Dark Mode</span>
              </>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3 relative">
              {/* Notification Bell Dropdown Button */}
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) handleMarkAllRead();
                }}
                className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-indigo-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 glass-card p-4 rounded-2xl border border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in duration-150">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-400" />
                      <span className="font-bold text-xs text-white uppercase tracking-wider">Notifications & Activity</span>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {(() => {
                    const displayList = notifications.filter(n => user.role === 'ROLE_ADMIN' || n.category !== 'SYSTEM_EVENT');
                    if (displayList.length === 0) {
                      return <p className="text-slate-500 text-xs py-6 text-center">No new notifications.</p>;
                    }
                    return (
                      <div className="max-h-80 overflow-y-auto space-y-2 text-xs pr-1">
                        {displayList.map((n) => {
                          const logTime = n.timestamp || n.createdAt;
                          const formattedTime = logTime ? new Date(logTime).toLocaleTimeString() : '';
                          const getBadgeText = (type) => {
                            switch (type) {
                              case 'TICKET_ASSIGNED': return 'ASSIGNED';
                              case 'TICKET_STATUS_UPDATED': return 'UPDATE';
                              case 'COMMENT_ADDED': return 'RESPONSE';
                              case 'TICKET_CREATED': return 'NEW TICKET';
                              default: return type || 'EVENT';
                            }
                          };
                          return (
                            <div
                              key={n.id}
                              onClick={() => {
                                if (n.ticketId) navigate(`/tickets/${n.ticketId}`);
                                setShowNotifications(false);
                              }}
                              className="p-3 bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-xl cursor-pointer transition-colors"
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold tracking-wide">
                                  {getBadgeText(n.eventType)}
                                </span>
                                <span className="text-slate-500 font-mono text-[10px]">{formattedTime}</span>
                              </div>
                              <p className="text-slate-200 text-xs leading-snug font-sans">{n.message}</p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 px-3.5 py-1.5 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-semibold text-slate-200 leading-tight">{user.fullName}</p>
                  <p className="text-[11px] text-slate-400 leading-tight">{user.email}</p>
                </div>
                {getRoleBadge(user.role)}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
