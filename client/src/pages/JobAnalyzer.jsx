import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/api';
import { CardSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import {
  FileSearch,
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  Trash2,
  ExternalLink,
  Loader2,
  Building,
  CheckCircle2,
  AlertCircle,
  FileCheck
} from 'lucide-react';

const JobAnalyzer = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // Form inputs
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedPdf, setSelectedPdf] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getJobs();
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Failed to load job analyses:', err);
      toast.error('Failed to load past job analyses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF document.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('PDF exceeds 5MB size limit.');
        return;
      }
      setSelectedPdf(file);
      toast.success(`Attached ${file.name}`);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim() && !selectedPdf) {
      toast.error('Please paste a job description or attach a PDF file.');
      return;
    }

    setAnalyzing(true);
    const formData = new FormData();
    if (jobTitle) formData.append('jobTitle', jobTitle);
    if (companyName) formData.append('companyName', companyName);
    if (jobDescription) formData.append('jobDescription', jobDescription);
    if (selectedPdf) formData.append('pdf', selectedPdf);

    try {
      const res = await jobService.analyzeJob(formData);
      toast.success('Job analyzed by Gemini AI!');
      
      // Reset form
      setJobTitle('');
      setCompanyName('');
      setJobDescription('');
      setSelectedPdf(null);

      // Navigate straight to skill gap analysis
      const newJobId = res.data.job.id;
      navigate(`/skill-gap/${newJobId}`);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to analyze job description.';
      toast.error(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete analysis for ${title}?`)) return;

    try {
      await jobService.deleteJob(id);
      toast.success('Job analysis removed.');
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (err) {
      toast.error('Failed to delete job.');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">AI Job Description Analyzer</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload a PDF job posting or paste the requirements. Gemini 1.5 Pro extracts technical prerequisites into structured PostgreSQL data.
        </p>
      </div>

      {/* Main Analysis Form Card */}
      <div className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e9ebf2] shadow-premium">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                Job Title (Optional)
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Full Stack Engineer, Cloud Architect"
                className="w-full px-4 py-3 rounded-2xl border border-[#e9ebf2] text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all font-body"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                Company Name (Optional)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google, Microsoft, Stripe"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e9ebf2] text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all font-body"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
              Job Description Content *
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job specification here, including responsibilities, required technical skills, qualifications, and preferred tools..."
              className="w-full p-4 rounded-2xl border border-[#e9ebf2] text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none leading-relaxed transition-all font-body"
            />
          </div>

          {/* PDF File Dropzone / Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
              Or Upload Job Description PDF (Max 5MB)
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-dashed border-orange-300 bg-orange-50/40 hover:bg-orange-100/50 text-xs font-bold text-brand-700 transition-colors">
                <UploadCloud className="w-4 h-4 text-brand-600" />
                <span>{selectedPdf ? selectedPdf.name : 'Select PDF Document'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {selectedPdf && (
                <button
                  type="button"
                  onClick={() => setSelectedPdf(null)}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove attached file
                </button>
              )}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-slate-500 flex items-center gap-2 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Parsed with Google Gemini 1.5 Pro</span>
            </span>

            <button
              type="submit"
              disabled={analyzing}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Gemini AI is parsing requirements...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Analyze & Match Skills</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Previously Analyzed Jobs List */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900 font-sans">Saved Job Analyses</h3>

        {loading ? (
          <CardSkeleton count={3} />
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => {
              const aiData = job.ai_analysis || {};
              const requiredCount = aiData.requiredSkills?.length || 0;
              const preferredCount = aiData.preferredSkills?.length || 0;

              return (
                <div
                  key={job.id}
                  className="bg-white p-6 rounded-3xl border border-[#e9ebf2] shadow-card hover:shadow-card-hover hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full font-mono">
                        {job.source_type === 'pdf' ? 'PDF Upload' : 'Text Input'}
                      </span>
                      <button
                        onClick={() => handleDelete(job.id, job.job_title)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                        title="Delete analysis"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-lg font-extrabold text-slate-900 font-sans leading-snug">{job.job_title}</h4>
                    <p className="text-xs text-slate-500 mb-3 font-body">{job.company_name || 'Target Employer'}</p>

                    {aiData.summary && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 font-body">
                        {aiData.summary}
                      </p>
                    )}

                    <div className="flex items-center gap-2.5 text-xs text-slate-600 mb-4 font-mono">
                      <span className="font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-lg">
                        {requiredCount} Required
                      </span>
                      {preferredCount > 0 && (
                        <span className="font-bold text-brand-800 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-lg">
                          {preferredCount} Preferred
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
                    >
                      View Details
                    </Link>

                    <Link
                      to={`/skill-gap/${job.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-600 to-orange-600 text-white hover:shadow-glow transition-all"
                    >
                      <span>Check Gap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={FileSearch}
            title="No job descriptions analyzed yet"
            description="Paste a job description or attach a PDF above to begin extracting technical requirements."
          />
        )}
      </div>
    </div>
  );
};

export default JobAnalyzer;
