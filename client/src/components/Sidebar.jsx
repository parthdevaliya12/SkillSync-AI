import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  FileSearch,
  GitCompare,
  Compass,
  Bot,
  UserCheck,
  LogOut,
  Sparkles,
  ChevronRight,
  X,
  Target
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Skills', path: '/skills', icon: Layers },
  { name: 'Job Analyzer', path: '/job-analyzer', icon: FileSearch },
  { name: 'Skill Gap Analysis', path: '/skill-gap', icon: GitCompare },
  { name: 'Learning Roadmaps', path: '/roadmaps', icon: Compass },
  { name: 'AI Career Assistant', path: '/assistant', icon: Bot, badge: 'AI' },
  { name: 'Profile & Settings', path: '/profile', icon: UserCheck },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#07080e]/80 backdrop-blur-md lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-[#0c0e18] border-r border-[#1e2238] text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-[#1e2238] bg-[#0c0e18]/80">
          <NavLink to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 via-purple-600 to-cyan-500 shadow-glow p-0.5">
              <div className="w-full h-full bg-[#0c0e18] rounded-[10px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-brand-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                  SkillSync<span className="text-cyan-400">.AI</span>
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-slate-400 uppercase font-bold">
                Career Intelligence
              </p>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI System Status Badge */}
        <div className="px-5 py-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#151828] to-[#121422] border border-purple-800/40 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <div>
                <p className="text-xs font-bold text-slate-200">Gemini 1.5 Pro</p>
                <p className="text-[10px] text-cyan-300/80 font-mono">Neural Engine Active</p>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Core Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 via-purple-600 to-brand-700 text-white shadow-glow border border-purple-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-purple-950/30'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                        {item.badge}
                      </span>
                    )}

                    {isActive && !item.badge && (
                      <ChevronRight className="w-4 h-4 text-white/80" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Mini Profile & Logout */}
        <div className="p-4 border-t border-[#1e2238] bg-[#090b14]">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#131626] border border-[#20253e]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 text-white font-bold text-sm shrink-0 shadow-sm">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">
                  {user?.fullName || 'User Account'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.email || 'user@skillsync.ai'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
