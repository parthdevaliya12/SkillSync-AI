import React from 'react';
import { Compass, Github, Twitter, Linkedin, Heart, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#070912] text-slate-400 border-t border-[#1a2233] pt-16 pb-12 font-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-950/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-950/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1a2233]">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-orange-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-glow">
                <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                  <Compass className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
                </div>
              </div>
              <span className="font-extrabold text-xl text-white font-sans tracking-tight">
                SkillSync<span className="text-cyan-400">.AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              Empowering students, freshers, and engineers to identify skill gaps against real job requirements with AI intelligence and deterministic scoring.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-1">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 bg-[#121724] border border-[#1e2638] rounded-xl hover:text-white hover:border-orange-500/50 hover:bg-orange-950/40 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 bg-[#121724] border border-[#1e2638] rounded-xl hover:text-white hover:border-orange-500/50 hover:bg-orange-950/40 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2.5 bg-[#121724] border border-[#1e2638] rounded-xl hover:text-white hover:border-orange-500/50 hover:bg-orange-950/40 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-mono">Core Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/job-analyzer" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><Zap className="w-3 h-3 text-cyan-400" /> Job Analyzer</Link></li>
              <li><Link to="/skills" className="hover:text-cyan-400 transition-colors">Skill Portfolio</Link></li>
              <li><Link to="/skill-gap" className="hover:text-cyan-400 transition-colors">Gap Intelligence</Link></li>
              <li><Link to="/roadmaps" className="hover:text-cyan-400 transition-colors">AI Roadmaps</Link></li>
              <li><Link to="/assistant" className="hover:text-cyan-400 transition-colors">Career Assistant</Link></li>
            </ul>
          </div>

          {/* Architecture & Tech */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-mono">Tech Architecture</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-mono">
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>React 18 & Vite</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-400"></span>Node.js & Express</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>PostgreSQL (Neon)</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Google Gemini 1.5 Pro</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-400"></span>Tailwind & Recharts</li>
            </ul>
          </div>

          {/* Standards & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-mono">Verified Integrity</h4>
            <div className="p-4 rounded-2xl bg-[#121724] border border-[#1e2638] text-xs space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-white font-bold font-sans">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Deterministic Scoring</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-body">
                Readiness percentages are computed deterministically via relational PostgreSQL mathematical formulas, not random LLM estimates.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SkillSync AI. All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-medium">
            Engineered with <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> for ambitious software developers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
