import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gapService, jobService, roadmapService } from '../services/api';
import toast from 'react-hot-toast';
import {
  GitCompare,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Compass,
  Building,
  RotateCcw,
  Loader2,
  Award
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const SkillGap = () => {
  const { jobId: routeJobId } = useParams();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(routeJobId || '');
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

  // Load available jobs for selection
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobService.getJobs();
        const loadedJobs = res.data.jobs || [];
        setJobs(loadedJobs);

        if (!selectedJobId && loadedJobs.length > 0) {
          setSelectedJobId(loadedJobs[0].id);
        }
      } catch (err) {
        console.error('Failed to load jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  // When selectedJobId changes or on load, run or fetch gap
  const runGapAnalysis = async (targetId) => {
    if (!targetId) return;
    setLoading(true);
    try {
      // Calculate/refresh gap on backend
      const res = await gapService.calculateGap(targetId);
      setGapData(res.data.skillGap);
    } catch (err) {
      console.error('Error calculating skill gap:', err);
      toast.error('Failed to calculate skill gap. Make sure you have added your skills first.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      runGapAnalysis(selectedJobId);
    }
  }, [selectedJobId]);

  const handleGenerateRoadmap = async () => {
    if (!gapData) return;
    setGeneratingRoadmap(true);
    try {
      const res = await roadmapService.generateRoadmap({
        skillGapId: gapData.id,
        jobAnalysisId: selectedJobId,
        totalWeeks: 4,
        hoursPerWeek: 10,
      });
      toast.success('AI Learning Roadmap created!');
      navigate(`/roadmaps/${res.data.roadmap.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate roadmap.');
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  const matched = gapData?.matched_skills ? (typeof gapData.matched_skills === 'string' ? JSON.parse(gapData.matched_skills) : gapData.matched_skills) : [];
  const weak = gapData?.weak_skills ? (typeof gapData.weak_skills === 'string' ? JSON.parse(gapData.weak_skills) : gapData.weak_skills) : [];
  const missing = gapData?.missing_skills ? (typeof gapData.missing_skills === 'string' ? JSON.parse(gapData.missing_skills) : gapData.missing_skills) : [];

  const chartData = [
    { name: 'Matched', value: matched.length, color: '#10b981' },
    { name: 'Weak', value: weak.length, color: '#f59e0b' },
    { name: 'Missing', value: missing.length, color: '#f43f5e' },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-8 font-sans">
      {/* Header and Job Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Skill Gap Intelligence & Readiness</h2>
          <p className="text-xs text-slate-500">
            Compare your profile skills against target job specs with deterministic scoring (70% required / 30% preferred).
          </p>
        </div>

        {jobs.length > 0 && (
          <div className="flex items-center gap-3">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 shadow-sm focus:ring-2 focus:ring-brand-500"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.job_title} ({j.company_name || 'Employer'})
                </option>
              ))}
            </select>

            <button
              onClick={() => runGapAnalysis(selectedJobId)}
              className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Recalculate Gap"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <GitCompare className="w-12 h-12 text-brand-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Job Postings Available</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Analyze your target job description first to calculate your match and readiness scores.
          </p>
          <Link
            to="/job-analyzer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-700 shadow-glow"
          >
            <span>Go to Job Analyzer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : loading ? (
        <div className="p-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Calculating deterministic skill match scores...</p>
        </div>
      ) : gapData ? (
        <>
          {/* Readiness Score Banner */}
          <div className="p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-premium relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/50 px-3 py-1 rounded-full">
                  PostgreSQL Deterministic Algorithm
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {gapData.job_title || gapData.jobTitle || 'Target Position'}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  <span>{gapData.company_name || gapData.companyName || 'Target Employer'}</span>
                </p>
              </div>

              {/* Score Badges */}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-black text-brand-400 font-mono">
                    {Math.round(gapData.match_percentage)}%
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Skill Match</span>
                </div>

                <div className="w-px h-12 bg-slate-800"></div>

                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-black text-cyan-400 font-mono">
                    {Math.round(gapData.readiness_score)}%
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Job Readiness</span>
                </div>

                <button
                  onClick={handleGenerateRoadmap}
                  disabled={generatingRoadmap}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:shadow-glow-cyan hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {generatingRoadmap ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Synthesizing Roadmap...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Generate AI Roadmap</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 3 Categories Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Matched Skills */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h4 className="text-sm font-bold text-slate-900">Matched Skills</h4>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {matched.length} Verified
                </span>
              </div>

              <div className="space-y-2.5">
                {matched.length > 0 ? (
                  matched.map((s, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-emerald-950">{s.name}</span>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        {s.userLevel}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">No skills matched yet.</p>
                )}
              </div>
            </div>

            {/* Weak Skills */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h4 className="text-sm font-bold text-slate-900">Weak Skills</h4>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  {weak.length} Needs Upgrade
                </span>
              </div>

              <div className="space-y-2.5">
                {weak.length > 0 ? (
                  weak.map((s, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-950">{s.name}</span>
                        <span className="text-[10px] uppercase font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                          Current: {s.userLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800">{s.recommendation}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">No weak skills identified.</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-500" />
                  <h4 className="text-sm font-bold text-slate-900">Missing Skills</h4>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  {missing.length} Missing
                </span>
              </div>

              <div className="space-y-2.5">
                {missing.length > 0 ? (
                  missing.map((s, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/60 flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-950">{s.name}</span>
                        <span className="text-[10px] uppercase font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
                          {s.importance} priority
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-800">{s.recommendation}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">Great job! No critical skills missing.</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SkillGap;
