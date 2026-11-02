import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Target, Menu, X, ArrowRight, Sparkles, Compass } from 'lucide-react';

const PublicNavbar = () => {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fcfcfd]/90 backdrop-blur-xl border-b border-orange-100/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-orange-500 to-cyan-500 p-0.5 shadow-glow flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-sans">
            SkillSync<span className="text-brand-600">.AI</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
          <a href="#preview" className="hover:text-brand-600 transition-colors">Gap Engine</a>
          <a href="#roadmaps" className="hover:text-brand-600 transition-colors">AI Roadmaps</a>
          <a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-orange-600 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4 text-cyan-200" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-bold text-slate-700 hover:text-brand-600 px-3.5 py-2 rounded-xl hover:bg-orange-50/50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
                <span>Get Started Free</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-700 hover:bg-orange-50 rounded-xl md:hidden transition-colors border border-orange-100/70 bg-white"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-orange-100 px-6 py-6 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3 font-semibold text-slate-700 text-sm">
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-brand-600">How It Works</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-brand-600">Features</a>
            <a href="#preview" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-brand-600">Gap Engine</a>
            <a href="#roadmaps" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-brand-600">AI Roadmaps</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-brand-600">FAQ</a>
          </div>
          <div className="pt-4 border-t border-orange-50 flex flex-col gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full text-center py-3 rounded-xl font-bold text-sm text-white bg-brand-600 shadow-glow"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-xl font-bold text-sm text-slate-700 border border-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-amber-500 shadow-glow"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
