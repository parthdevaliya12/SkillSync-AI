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
  AlertCircle
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

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];

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
        <div className="h-28 bg-slate-200/70 rounded-3xl animate-pulse"></div>
        <CardSkeleton count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-white rounded-3xl border border-slate-200/80 animate-pulse"></div>
          <div className="h-80 bg-white rounded-3xl border border-slate-200/80 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-rose-900">{error}</h3>
        <button
          onClick={fetchDashboardData}
          className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
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
    <div className="space-y-8">
      {/* Welcome Banner & Quick Action */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white shadow-premium">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time PostgreSQL Career Analytics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Skill & Readiness Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Track how your skill portfolio compares to real software engineering market postings and monitor your learning velocity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/skills"
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
            >
              Manage Skills
            </Link>
            <Link
              to="/job-analyzer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 hover:shadow-glow-cyan hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Analyze New Job</span>
            </Link>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
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
          color="violet"
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
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Learning Progress</h3>
              <p className="text-xs text-slate-500">Tasks completed & estimated study hours</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-brand-500" />
              <span>Historical Trend</span>
            </div>
          </div>

          <div className="h-64 w-full">
            {weeklyProgress && weeklyProgress.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyProgress}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="week"
                    tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  />
                  <Area type="monotone" dataKey="tasks_completed" name="Tasks Completed" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
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
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Skill Portfolio Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown across technical domains</p>
            </div>
            <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
              {stats?.totalSkills || 0} Total Skills
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
                    paddingAngle={3}
                  >
                    {skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
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
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Job Readiness Analyses</h3>
              <p className="text-xs text-slate-500">Readiness percentage for targeted job postings</p>
            </div>
            <Link to="/job-analyzer" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              Analyze More →
            </Link>
          </div>

          {recentJobs && recentJobs.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentJobs.map((job) => (
                <div key={job.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 px-2 rounded-xl transition-colors">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{job.job_title}</h4>
                    <p className="text-xs text-slate-500">{job.company_name || 'Target Employer'}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-brand-600 font-mono">
                        {job.readiness_score !== null ? `${job.readiness_score}%` : 'Pending'}
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Job Readiness</span>
                    </div>

                    <Link
                      to={`/skill-gap/${job.id}`}
                      className="px-3 py-1.5 rounded-lg font-bold text-xs bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
                    >
                      View Gap
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">
              No jobs analyzed yet. Use the Job Analyzer to evaluate your readiness.
            </p>
          )}
        </div>

        {/* Live Activity Stream (1 Col) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          {recentActivities && recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((act, index) => (
                <div key={index} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {act.type === 'skill_added' && `Added skill: ${act.title}`}
                      {act.type === 'job_analyzed' && `Analyzed job: ${act.title}`}
                      {act.type === 'task_completed' && `Finished task: ${act.title}`}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">No recent activity logged.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
