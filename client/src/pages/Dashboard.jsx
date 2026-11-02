import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/api';
import StatCard from '../components/StatCard';
import { CardSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import {
  Layers,
  FileSearch,
  Percent,
  Compass,
  CheckCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Calendar,
  AlertCircle,
  Zap,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';

const COLORS = ['#ea580c', '#14b8a6', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ec4899'];

const Dashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, progressRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getProgress(),
      ]);
      setStatsData(statsRes.data);
      setProgressData(progressRes.data);
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
      setError('Unable to load dashboard data from PostgreSQL server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-32 bg-orange-100/60 rounded-3xl animate-pulse"></div>
        <CardSkeleton count={5} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-white rounded-3xl border border-[#e9ebf2] animate-pulse"></div>
          <div className="h-80 bg-white rounded-3xl border border-[#e9ebf2] animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-rose-900 font-sans">{error}</h3>
        <button
          onClick={fetchDashboardData}
          className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { stats, skillDistribution, recentJobs, recentActivities } = statsData || {};
  const { weeklyProgress, jobReadiness, proficiencyBreakdown } = progressData || {};

  const hasAnyActivity = stats?.totalSkills > 0 || stats?.analyzedJobs > 0;

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner & Quick Action */}
      <div className="relative overflow-hidden p-7 sm:p-9 rounded-3xl bg-gradient-to-r from-[#210902] via-[#0b0f19] to-[#041a18] text-white shadow-premium border border-orange-950/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-cyan-300 text-xs font-semibold backdrop-blur-sm font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Real-Time PostgreSQL Career Analytics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              Skill & Readiness Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body">
              Track how your verified tech portfolio matches against live engineering roles and monitor your weekly study velocity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/skills"
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all backdrop-blur-sm"
            >
              Manage Skills
            </Link>
            <Link
              to="/job-analyzer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Analyze New Job</span>
            </Link>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 -top-10 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          title="Total Skills"
          value={stats?.totalSkills || 0}
          subtitle="In your verified portfolio"
          icon={Layers}
          color="brand"
        />
        <StatCard
          title="Analyzed Jobs"
          value={stats?.analyzedJobs || 0}
          subtitle="Processed via Gemini AI"
          icon={FileSearch}
          color="cyan"
        />
        <StatCard
          title="Average Match"
          value={`${stats?.averageMatch || 0}%`}
          subtitle="Deterministic score"
          icon={Percent}
          color="emerald"
        />
        <StatCard
          title="Active Roadmaps"
          value={stats?.activeRoadmaps || 0}
          subtitle="Weekly learning plans"
          icon={Compass}
          color="rose"
        />
        <StatCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          subtitle="Curriculum milestones"
          icon={CheckCircle}
          color="amber"
        />
      </div>

      {!hasAnyActivity && (
        <EmptyState
          icon={Sparkles}
          title="Welcome to SkillSync AI!"
          description="You haven't added any skills or analyzed a job yet. Start by setting up your technical skills or paste your target job description."
          actionLabel="Add Your Skills"
          actionLink="/skills"
        />
      )}

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Learning Velocity Chart */}
        <div className="bg-white p-7 rounded-3xl border border-[#e9ebf2] shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-sans">Weekly Learning Progress</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tasks completed & estimated study velocity</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-orange-50/60 px-3 py-1 rounded-xl border border-orange-100 font-mono">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>Velocity Trend</span>
            </div>
          </div>

          <div className="h-64 w-full">
            {weeklyProgress && weeklyProgress.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyProgress}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f6f9" />
                  <XAxis
                    dataKey="week"
                    tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e9ebf2', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}
                  />
                  <Area type="monotone" dataKey="tasks_completed" name="Tasks Completed" stroke="#ea580c" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                <Clock className="w-8 h-8 text-slate-300" />
                <p className="text-xs">Complete roadmap tasks to generate velocity analytics.</p>
              </div>
            )}
          </div>
        </div>

        {/* Skill Category Distribution */}
        <div className="bg-white p-7 rounded-3xl border border-[#e9ebf2] shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-sans">Skill Portfolio Breakdown</h3>
              <p className="text-xs text-slate-500 mt-0.5">Distribution across technical domains</p>
            </div>
            <span className="text-[11px] font-bold text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 font-mono">
              {stats?.totalSkills || 0} Verified Skills
            </span>
          </div>

          <div className="h-64 w-full">
            {skillDistribution && skillDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={4}
                  >
                    {skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e9ebf2' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                <Layers className="w-8 h-8 text-slate-300" />
                <p className="text-xs">Add skills to see your domain distribution.</p>
              </div>
            )}
          </div>

          {skillDistribution && skillDistribution.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 pt-4 border-t border-slate-100">
              {skillDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="font-semibold">{item.category}</span>
                  <span className="text-slate-400 font-mono">({item.count})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Target Roles & Recent Activities Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Job Readiness Comparison (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-7 rounded-3xl border border-[#e9ebf2] shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-sans">Recent Job Readiness Analyses</h3>
              <p className="text-xs text-slate-500 mt-0.5">Readiness percentage for targeted job postings</p>
            </div>
            <Link to="/job-analyzer" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              <span>Analyze More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentJobs && recentJobs.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentJobs.map((job) => (
                <div key={job.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-orange-50/30 px-3 rounded-2xl transition-colors">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 font-sans">{job.job_title}</h4>
                    <p className="text-xs text-slate-500">{job.company_name || 'Target Employer'}</p>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-brand-600 font-mono">
                        {job.readiness_score !== null ? `${job.readiness_score}%` : 'Pending'}
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Readiness</span>
                    </div>

                    <Link
                      to={`/skill-gap/${job.id}`}
                      className="px-4 py-2 rounded-xl font-bold text-xs bg-orange-50 text-brand-700 hover:bg-brand-600 hover:text-white transition-all shadow-sm"
                    >
                      View Gap
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8 font-body">
              No jobs analyzed yet. Use the Job Analyzer to evaluate your readiness.
            </p>
          )}
        </div>

        {/* Live Activity Stream (1 Col) */}
        <div className="bg-white p-7 rounded-3xl border border-[#e9ebf2] shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-extrabold text-slate-900 font-sans">Recent Activity</h3>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
          </div>

          {recentActivities && recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((act, index) => (
                <div key={index} className="flex items-start gap-3 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-500 mt-1.5 shrink-0 ring-4 ring-orange-50"></div>
                  <div>
                    <p className="font-semibold text-slate-800 font-body">
                      {act.type === 'skill_added' && `Added skill: ${act.title}`}
                      {act.type === 'job_analyzed' && `Analyzed job: ${act.title}`}
                      {act.type === 'task_completed' && `Finished task: ${act.title}`}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      {new Date(act.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8 font-body">No recent activity logged.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
