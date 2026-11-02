import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  Target,
  Compass
} from 'lucide-react';

const Navbar = ({ onOpenSidebar, title = 'Dashboard', shortTitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'Roadmap Milestone', desc: 'You completed week 1 tasks for Backend Developer.', time: '10m ago' },
    { id: 2, title: 'AI Recommendation', desc: 'PostgreSQL Advanced query modules ready for review.', time: '1h ago' },
    { id: 3, title: 'Job Match Updated', desc: 'Readiness score improved to 82% for Full Stack Role.', time: '2h ago' },
  ];

  const mobileDisplayTitle = shortTitle || (typeof title === 'string' ? title.split(' ')[0] : 'Dashboard');

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 sm:h-20 px-4 sm:px-8 bg-white/95 backdrop-blur-md border-b border-[#e9ebf2] transition-all">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1 mr-2">
        <button
          onClick={onOpenSidebar}
          className="p-2 sm:p-2.5 text-slate-700 rounded-xl hover:bg-orange-50/80 hover:text-brand-600 lg:hidden focus:outline-none transition-all border border-orange-100/80 bg-white shadow-xs shrink-0 flex items-center justify-center active:scale-95"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900 font-sans truncate leading-tight">
            <span className="sm:hidden">{mobileDisplayTitle}</span>
            <span className="hidden sm:inline">{title}</span>
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 font-medium mt-0.5 truncate">
            Welcome back, <span className="font-semibold text-brand-600">{user?.fullName?.split(' ')[0] || 'Developer'}</span> 👋
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick Action Button */}
        <Link
          to="/job-analyzer"
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 rounded-xl shadow-sm hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          <span>Analyze Job</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="relative p-2 sm:p-2.5 text-slate-500 hover:text-brand-600 hover:bg-orange-50/70 rounded-xl transition-all focus:outline-none border border-transparent hover:border-orange-100"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-brand-600 rounded-full ring-2 ring-white"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 sm:mt-3 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white rounded-2xl shadow-premium border border-orange-100/80 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900 font-sans">Notifications</span>
                <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200 font-mono">
                  3 unread
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-orange-50/40 transition-colors flex gap-3">
                    <div className="mt-0.5 w-7 h-7 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-body">{n.desc}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-mono">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 px-4 text-center border-t border-slate-100">
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 sm:pl-2 rounded-xl hover:bg-orange-50/60 transition-colors focus:outline-none border border-transparent hover:border-orange-100"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-orange-500 to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-slate-800 max-w-[110px] truncate">
              {user?.fullName || 'Profile'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 sm:mt-3 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-premium border border-orange-100/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate font-sans">{user?.fullName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-[10px] font-semibold font-mono">
                  <CheckCircle className="w-3 h-3 text-cyan-600" />
                  <span>Pro Plan Active</span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-brand-700 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Profile Settings</span>
                </Link>
                <Link
                  to="/assistant"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-brand-700 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <span>Ask Career AI</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
