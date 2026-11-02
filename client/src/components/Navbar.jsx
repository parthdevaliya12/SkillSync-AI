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
  Target
} from 'lucide-react';

const Navbar = ({ onOpenSidebar, title = 'Dashboard' }) => {
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

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="p-2 text-slate-600 rounded-xl hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 font-medium">
            Welcome back, <span className="font-semibold text-brand-600">{user?.fullName?.split(' ')[0] || 'Engineer'}</span>
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Action Button */}
        <Link
          to="/job-analyzer"
          className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 rounded-xl hover:shadow-glow hover:scale-[1.02] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>Analyze Job</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="relative p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-600 rounded-full ring-2 ring-white"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-premium border border-slate-200/80 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900">Notifications</span>
                <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  3 unread
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors flex gap-3">
                    <div className="mt-0.5 w-7 h-7 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
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
            className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-800 max-w-[100px] truncate">
              {user?.fullName || 'Profile'}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-premium border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Pro Plan Active</span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Profile Settings</span>
                </Link>
                <Link
                  to="/assistant"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
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
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
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
