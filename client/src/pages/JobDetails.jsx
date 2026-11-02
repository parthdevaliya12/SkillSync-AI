import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/api';
import toast from 'react-hot-toast';
import {
  Building,
  Calendar,
  Sparkles,
  ArrowRight,
  GitCompare,
  ArrowLeft,
  Briefcase,
  CheckCircle,
  Tag,
  Loader2,
  Trash2
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await jobService.getJobById(id);
        setJob(res.data.job);
      } catch (err) {
        toast.error('Failed to load job details.');
        navigate('/job-analyzer');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this job analysis?')) return;
    try {
      await jobService.deleteJob(id);
      toast.success('Job analysis deleted.');
      navigate('/job-analyzer');
    } catch {
      toast.error('Failed to delete job.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!job) return null;

  const aiData = job.ai_analysis || {};
  const requiredSkills = job.skills?.filter((s) => s.skill_type === 'required') || [];
  const preferredSkills = job.skills?.filter((s) => s.skill_type === 'preferred') || [];

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/job-analyzer"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Analyzer</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Delete this analysis"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            to={`/skill-gap/${job.id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:shadow-glow hover:scale-[1.02] transition-all"
          >
            <GitCompare className="w-4 h-4" />
            <span>Calculate Skill Gap</span>
          </Link>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-premium space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
              {aiData.jobLevel ? `${aiData.jobLevel} level` : 'Analyzed Position'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {job.job_title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Building className="w-4 h-4 text-slate-400" />
                {job.company_name || 'Employer Not Disclosed'}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {aiData.experienceRequired || 'Experience Not Stated'}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <Calendar className="w-4 h-4 text-slate-400" />
                {new Date(job.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-brand-600" />
            <div>
              <p className="text-xs font-bold text-brand-900">Gemini 1.5 Extraction</p>
              <p className="text-[11px] text-brand-700">{requiredSkills.length + preferredSkills.length} competencies isolated</p>
            </div>
          </div>
        </div>

        {aiData.summary && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-1">Role Summary:</span>
            {aiData.summary}
          </div>
        )}
      </div>

      {/* Skills Matrix Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Required Skills */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Required Technical Skills</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {requiredSkills.length} Required
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((s, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between gap-3"
              >
                <span>{s.skill_name}</span>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  s.importance === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                }`}>
                  {s.importance}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Preferred Skills */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              <span>Preferred / Bonus Skills</span>
            </h3>
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
              {preferredSkills.length} Preferred
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {preferredSkills.length > 0 ? (
              preferredSkills.map((s, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between gap-3"
                >
                  <span>{s.skill_name}</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800">
                    {s.importance}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4">No preferred skills explicitly differentiated.</p>
            )}
          </div>
        </div>
      </div>

      {/* Tools, Tech & Keywords */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Extracted Tools & Industry Keywords</h3>
        
        <div className="flex flex-wrap gap-2">
          {aiData.toolsAndTechnologies?.map((tool, i) => (
            <span key={i} className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold">
              🛠️ {tool}
            </span>
          ))}

          {aiData.importantKeywords?.map((kw, i) => (
            <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              # {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Raw Description Collapsible */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Original Job Description</h3>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 max-h-60 overflow-y-auto text-xs text-slate-600 font-mono leading-relaxed whitespace-pre-wrap">
          {job.job_description}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
