import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import {
  Sparkles,
  ArrowRight,
  Target,
  Layers,
  FileSearch,
  GitCompare,
  Compass,
  Bot,
  CheckCircle2,
  ChevronDown,
  BarChart3,
  Award,
  Zap,
  ShieldCheck,
  Check,
  Star,
  Cpu
} from 'lucide-react';

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'How does SkillSync AI calculate job readiness scores?',
      a: 'Unlike generic tools that let AI generate arbitrary numbers, SkillSync AI extracts required and preferred skills from the job description and evaluates your verified profile using a deterministic weighted algorithm on our PostgreSQL backend (70% required skills weight, 30% preferred skills weight, with depth deductions for novice-level requirements).'
    },
    {
      q: 'Can I upload job descriptions directly as PDF files?',
      a: 'Yes! You can paste raw job descriptions or upload PDF job postings directly. Our backend parses the document using native buffer analysis and feeds the sanitized text to Gemini 1.5 Pro to extract key competencies.'
    },
    {
      q: 'How are personalized AI learning roadmaps created?',
      a: 'Once your skill gap is identified, Gemini AI generates a custom, multi-week roadmap focusing directly on missing and weak skills. Every week is broken down into structured daily tasks with estimated study hours, priority levels, and curated learning resources.'
    },
    {
      q: 'Is my data secure?',
      a: 'All data is stored in an enterprise PostgreSQL instance with relational integrity and cascading foreign keys. Authentication uses industry-standard bcrypt hashing with salt factor 12 and secure JSON Web Tokens.'
    },
    {
      q: 'Can the AI Career Assistant reference my real profile?',
      a: 'Yes. The AI Career Assistant fetches your stored skills, recent job analyses, gap readiness scores, and active roadmap progress directly from PostgreSQL into its prompt context to provide hyper-personalized career mentorship.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfe] text-slate-900 font-sans selection:bg-purple-600 selection:text-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-gradient-mesh border-b border-[#e8e9f2]">
        {/* Ambient background orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-purple-500/15 via-brand-500/10 to-cyan-400/15 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50/90 border border-purple-200/80 text-brand-700 text-xs font-bold mb-8 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-brand-600 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Next-Generation Career Intelligence & Skill Gap Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.08] max-w-4xl mx-auto font-sans">
            Discover Your Skills.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-500">
              Build Your Career.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-body">
            SkillSync AI analyzes software job descriptions with Google Gemini, calculates deterministic readiness scores against your profile, and crafts custom step-by-step learning roadmaps.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-500 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 text-cyan-200" />
            </Link>

            <a
              href="#preview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-slate-700 bg-white border border-[#d8daeb] hover:bg-purple-50/50 hover:border-purple-200 transition-all shadow-sm"
            >
              <span>Explore Live Preview</span>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-bold text-slate-600 font-mono">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-purple-100">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>PostgreSQL Relational DB</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-cyan-100">
              <Cpu className="w-4 h-4 text-cyan-600" />
              <span>Gemini 1.5 Pro AI Engine</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Deterministic Scoring</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white border-b border-[#e8e9f2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-brand-700 text-xs font-extrabold mb-3">
              SYSTEMATIC ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              From Job Posting to Career Readiness
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 font-body">
              Four streamlined steps to systematically eliminate your tech stack blind spots.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Build Skill Portfolio',
                desc: 'Add your languages, frameworks, databases, and tools with verified proficiency tiers.',
                icon: Layers,
                gradient: 'from-brand-600 to-purple-600',
              },
              {
                step: '02',
                title: 'Analyze Job Posting',
                desc: 'Paste or upload a PDF job description. Gemini AI parses required and preferred tech stacks.',
                icon: FileSearch,
                gradient: 'from-purple-600 to-cyan-500',
              },
              {
                step: '03',
                title: 'Review Gap Intelligence',
                desc: 'Inspect matched, weak, and missing competencies with deterministic readiness percentages.',
                icon: GitCompare,
                gradient: 'from-cyan-500 to-emerald-600',
              },
              {
                step: '04',
                title: 'Execute AI Roadmap',
                desc: 'Follow a multi-week structured curriculum with curated articles, videos, and daily tasks.',
                icon: Compass,
                gradient: 'from-brand-600 to-cyan-500',
              }
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="relative p-7 rounded-3xl bg-[#fbfbfe] border border-[#e8e9f2] hover:border-purple-300 hover:shadow-card-hover transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-3xl font-black text-slate-300 group-hover:text-brand-600 transition-colors">
                      {s.step}
                    </span>
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${s.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-body">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#fbfbfe] border-b border-[#e8e9f2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-extrabold mb-3 border border-cyan-200">
              CORE CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Engineered for Modern Tech Job Seekers
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 font-body">
              Everything you need to evaluate market fit, prepare for interviews, and level up quickly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Job Description Parsing',
                desc: 'Drop in any software engineer or data role posting. AI isolates required tools, nice-to-haves, and experience thresholds without noise.',
                icon: Zap,
                tag: 'Multi-Modal PDF'
              },
              {
                title: 'Verified Skill Gap Analytics',
                desc: 'Instant side-by-side matrices classifying skills into Matched, Missing, and Weak. Calculated server-side with zero hallucination.',
                icon: BarChart3,
                tag: 'Deterministic Math'
              },
              {
                title: 'Dynamic Multi-Week Roadmaps',
                desc: 'Tailor-made schedules based on your weekly study budget. Includes task-level checklists, documentation links, and progress trackers.',
                icon: Compass,
                tag: 'Weekly Milestones'
              },
              {
                title: 'Context-Aware Career Chatbot',
                desc: 'Ask about interview prep, tech comparisons, or project ideas. The assistant already knows your skills and target role history.',
                icon: Bot,
                tag: 'Full Profile Context'
              },
              {
                title: 'PostgreSQL Relational Storage',
                desc: '10 normalized relational tables in Neon DB with strict constraints, cascading deletes, JSONB indexing, and query tracking.',
                icon: ShieldCheck,
                tag: 'ACID Relational DB'
              },
              {
                title: 'Executive Analytics Dashboard',
                desc: 'Visualize weekly study velocity, proficiency distribution charts, and historical readiness trends across all analyzed targets.',
                icon: Award,
                tag: 'Recharts Visuals'
              }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-8 rounded-3xl bg-white border border-[#e8e9f2] shadow-card hover:shadow-card-hover hover:border-purple-200 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-brand-600 border border-purple-100 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">{f.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-body">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skill Gap Analysis Preview */}
      <section id="preview" className="py-24 bg-white border-b border-[#e8e9f2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-4">
                <GitCompare className="w-3.5 h-3.5 text-cyan-600" />
                <span>Deterministic Scoring Engine</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
                No Guesswork. Just Mathematical Skill Matching.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-body">
                SkillSync AI contrasts your verified technical skills against the job's extracted requirements. Required competencies are weighted at 70%, preferred at 30%, and proficiency gaps are highlighted so you can target interview weaknesses before applying.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Matched Skills: Strong proficiency alignment verified</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Weak Skills: Novice tier requiring depth upgrade</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Missing Skills: Critical prerequisites not yet on your profile</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-purple-700 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Test Your Skill Match</span>
                  <ArrowRight className="w-4 h-4 text-cyan-200" />
                </Link>
              </div>
            </div>

            {/* Interactive Card Mockup */}
            <div className="p-7 rounded-3xl bg-[#0c0e18] border border-[#20253e] shadow-premium text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between pb-5 border-b border-[#20253e] relative z-10">
                <div>
                  <h4 className="font-extrabold text-base text-white font-sans">Senior Backend Engineer</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Fintech Payments • Analyzed with Gemini 1.5</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-cyan-400 font-mono">82%</div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Readiness Score</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3.5 my-6 relative z-10">
                <div className="p-3.5 rounded-2xl bg-[#131626] border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">Matched</span>
                  <p className="text-xl font-extrabold text-white mt-1">6 Skills</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">Node, SQL, Express</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#131626] border border-amber-500/30">
                  <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">Weak</span>
                  <p className="text-xl font-extrabold text-white mt-1">2 Skills</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">Redis, Docker</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#131626] border border-rose-500/30">
                  <span className="text-[10px] uppercase font-bold text-rose-400 font-mono">Missing</span>
                  <p className="text-xl font-extrabold text-white mt-1">3 Skills</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">Kafka, Go, K8s</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between text-xs relative z-10">
                <span className="text-purple-300 font-semibold">Recommended AI Action:</span>
                <span className="text-cyan-300 font-bold flex items-center gap-1">Generate 4-Week Custom Roadmap <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Roadmap Preview */}
      <section id="roadmaps" className="py-24 bg-[#fbfbfe] border-b border-[#e8e9f2]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-brand-700 text-xs font-extrabold mb-3">
              GUIDED CURRICULUM
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Turn Missing Skills Into Completed Milestones
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 font-body">
              Every roadmap is partitioned into weekly objectives and executable daily tasks with estimated durations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {[
              {
                week: 'Week 1',
                theme: 'Advanced SQL & PostgreSQL',
                tasks: ['Indexing & EXPLAIN ANALYZE', 'Transactions & ACID guarantees', 'Connection pooling in Node.js'],
                hours: '8 hrs'
              },
              {
                week: 'Week 2',
                theme: 'Caching & Redis Queues',
                tasks: ['In-memory caching patterns', 'BullMQ background jobs', 'Distributed locks & rate limiting'],
                hours: '10 hrs'
              },
              {
                week: 'Week 3',
                theme: 'Microservices & Kafka',
                tasks: ['Event-driven architecture', 'Message brokers & consumers', 'Idempotency patterns'],
                hours: '12 hrs'
              },
              {
                week: 'Week 4',
                theme: 'Containerization & Docker',
                tasks: ['Multi-stage Dockerfiles', 'Docker Compose orchestrations', 'Production health monitoring'],
                hours: '9 hrs'
              }
            ].map((w, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-[#e8e9f2] shadow-card hover:shadow-card-hover hover:border-purple-200 transition-all duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <span className="text-xs font-bold text-brand-600 font-mono">{w.week}</span>
                  <span className="text-[11px] font-semibold text-slate-600 bg-purple-50 px-2.5 py-0.5 rounded-full font-mono">{w.hours}</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-3 font-sans">{w.theme}</h4>
                <ul className="space-y-2.5">
                  {w.tasks.map((t, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2 font-body">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0"></span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white border-b border-[#e8e9f2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-extrabold mb-3 border border-cyan-200">
              PROVEN RESULTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              From Students to Tech Offer Letters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Parth Sharma',
                role: 'MCA Graduate & Backend Developer',
                quote: 'SkillSync AI identified that my PostgreSQL queries were only beginner level for the role I wanted. Following the 4-week roadmap helped me ace my technical interview at an enterprise fintech firm.'
              },
              {
                name: 'Aanya Verma',
                role: 'Junior Full Stack Engineer',
                quote: 'Pasting the JD and immediately seeing where I stood was eye-opening. The AI chatbot answered my specific architectural questions with full awareness of my existing React skills.'
              },
              {
                name: 'Rohan Deshmukh',
                role: 'Career Switcher to Cloud & DevOps',
                quote: 'The mathematical readiness score pushed me to focus on Docker and Kubernetes instead of relearning topics I already knew. The structured tasks saved me weeks of aimless YouTube searching.'
              }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#fbfbfe] border border-[#e8e9f2] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6 font-body">
                    "{t.quote}"
                  </p>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 font-sans">{t.name}</h4>
                  <p className="text-xs text-brand-600 font-bold mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-[#fbfbfe] border-b border-[#e8e9f2]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-brand-700 text-xs font-extrabold mb-3">
              FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#e8e9f2] overflow-hidden shadow-card hover:border-purple-200 transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-slate-900 hover:text-brand-600 transition-colors font-sans"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-brand-600' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 font-body">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-[#180a33] via-[#0f121e] to-[#062c22] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 font-sans">
            Ready to Bridge Your Tech Skill Gap?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-body">
            Create your account in seconds, analyze your target job description, and start your tailored career roadmap today.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-slate-950 bg-gradient-to-r from-cyan-300 to-emerald-300 hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>Launch Your Free Account</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
