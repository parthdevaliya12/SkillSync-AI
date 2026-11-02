import React from 'react';
import { Target, Github, Twitter, Linkedin, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-glow">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Target className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-white font-sans">
                SkillSync<span className="text-cyan-400">.AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering students, freshers, and tech professionals to bridge skill gaps and land their dream jobs with intelligent AI career planning.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-900 rounded-lg hover:text-white hover:bg-slate-800 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-900 rounded-lg hover:text-white hover:bg-slate-800 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-900 rounded-lg hover:text-white hover:bg-slate-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/job-analyzer" className="hover:text-cyan-400 transition-colors">Job Analyzer</Link></li>
              <li><Link to="/skills" className="hover:text-cyan-400 transition-colors">Skill Portfolio</Link></li>
              <li><Link to="/skill-gap" className="hover:text-cyan-400 transition-colors">Gap Intelligence</Link></li>
              <li><Link to="/roadmaps" className="hover:text-cyan-400 transition-colors">AI Roadmaps</Link></li>
              <li><Link to="/assistant" className="hover:text-cyan-400 transition-colors">Career Chatbot</Link></li>
            </ul>
          </div>

          {/* Architecture & Tech */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Built With</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>React & Vite (JavaScript)</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>Node.js & Express</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>PostgreSQL (Neon Cloud)</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Google Gemini 1.5 Pro</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>Tailwind CSS & Recharts</li>
            </ul>
          </div>

          {/* Standards & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Enterprise Grade</h4>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Deterministic Scoring</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Skill gap percentages calculated via validated relational business logic, never hallucinated by LLMs.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SkillSync AI. All rights reserved. Production Ready MCA Major Project.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for ambitious developers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
