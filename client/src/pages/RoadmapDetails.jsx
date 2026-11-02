import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { roadmapService } from '../services/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  Sparkles,
  Award,
  Loader2,
  Trash2,
  ChevronDown,
  Layers,
  Check
} from 'lucide-react';

const RoadmapDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const res = await roadmapService.getRoadmapById(id);
      setRoadmap(res.data.roadmap);
    } catch (err) {
      console.error('Error fetching roadmap:', err);
      toast.error('Failed to load roadmap.');
      navigate('/roadmaps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [id]);

  const handleToggleTask = async (task) => {
    const newStatus = !task.is_completed;
    setUpdatingTaskId(task.id);

    try {
      const res = await roadmapService.updateTask(task.id, newStatus);
      
      // Update local state smoothly
      setRoadmap((prev) => {
        if (!prev) return prev;
        const updatedTasks = prev.tasks.map((t) =>
          t.id === task.id ? { ...t, is_completed: newStatus } : t
        );
        return {
          ...prev,
          progress: res.data.progress,
          status: res.data.status,
          tasks: updatedTasks,
        };
      });

      if (newStatus) {
        toast.success(`Completed: ${task.title}`);
      }
    } catch (err) {
      toast.error('Failed to update task.');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this roadmap?')) return;
    try {
      await roadmapService.deleteRoadmap(id);
      toast.success('Roadmap deleted.');
      navigate('/roadmaps');
    } catch {
      toast.error('Failed to delete roadmap.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!roadmap) return null;

  // Group tasks by week
  const tasksByWeek = {};
  roadmap.tasks?.forEach((task) => {
    if (!tasksByWeek[task.week_number]) {
      tasksByWeek[task.week_number] = [];
    }
    tasksByWeek[task.week_number].push(task);
  });

  const weekNumbers = Object.keys(tasksByWeek).sort((a, b) => parseInt(a) - parseInt(b));
  const progress = Math.round(parseFloat(roadmap.progress) || 0);

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/roadmaps"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roadmaps</span>
        </Link>

        <button
          onClick={handleDelete}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          title="Delete roadmap"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Curriculum Card */}
      <div className="p-8 sm:p-9 rounded-3xl bg-white border border-[#e8e9f2] shadow-premium space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full font-mono ${
              roadmap.status === 'completed'
                ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                : 'bg-purple-50 text-brand-700 border border-purple-200'
            }`}>
              {roadmap.status === 'completed' ? 'Mastery Completed 🎉' : 'Active Learning Path'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              {roadmap.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
              {roadmap.description || 'Step-by-step career acceleration curriculum synthesized by Gemini AI.'}
            </p>
          </div>

          <div className="flex items-center gap-6 p-4 rounded-2xl bg-purple-50/50 border border-purple-100/70 shrink-0">
            <div className="text-center">
              <div className="text-3xl font-black text-brand-600 font-mono">{progress}%</div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Completed</span>
            </div>
            <div className="w-px h-10 bg-purple-200/60"></div>
            <div className="text-center">
              <div className="text-3xl font-black text-cyan-600 font-mono">{roadmap.total_weeks}</div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Weeks</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {progress === 100 && (
          <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center gap-3 text-cyan-900 text-xs font-bold animate-in fade-in">
            <Award className="w-6 h-6 text-cyan-600 shrink-0" />
            <span>Congratulations! You have completed all learning tasks for this roadmap. Ready to apply or analyze another job!</span>
          </div>
        )}
      </div>

      {/* Weeks Curriculum Sections */}
      <div className="space-y-6">
        {weekNumbers.map((weekNum) => {
          const tasks = tasksByWeek[weekNum];
          const completedInWeek = tasks.filter((t) => t.is_completed).length;

          return (
            <div
              key={weekNum}
              className="bg-white rounded-3xl border border-[#e8e9f2] shadow-card overflow-hidden"
            >
              {/* Week Header */}
              <div className="p-6 bg-purple-50/40 border-b border-[#e8e9f2] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-700 text-white font-mono font-bold text-xs flex items-center justify-center shadow-sm">
                    W{weekNum}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 font-sans">Week {weekNum} Curriculum</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {completedInWeek} of {tasks.length} tasks finished
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-brand-600 bg-white px-3 py-1 rounded-full border border-purple-100 shadow-sm">
                  {Math.round((completedInWeek / tasks.length) * 100)}% Week Done
                </span>
              </div>

              {/* Tasks List */}
              <div className="divide-y divide-slate-100 p-6 space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`pt-4 first:pt-0 flex items-start gap-4 transition-opacity ${
                      task.is_completed ? 'opacity-70' : 'opacity-100'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleTask(task)}
                      disabled={updatingTaskId === task.id}
                      className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        task.is_completed
                          ? 'bg-cyan-500 text-white shadow-sm'
                          : 'border-2 border-slate-300 hover:border-brand-600 text-transparent'
                      }`}
                      aria-label="Toggle task status"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    {/* Task Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className={`text-sm font-bold font-sans ${
                          task.is_completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}>
                          {task.title}
                        </h4>

                        <div className="flex items-center gap-2">
                          {task.skill_name && (
                            <span className="text-[10px] font-bold text-brand-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 font-mono">
                              {task.skill_name}
                            </span>
                          )}
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                            {task.estimated_hours}h
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full font-mono ${
                            task.priority === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-600 leading-relaxed font-body">
                          {task.description}
                        </p>
                      )}

                      {/* Learning Resources */}
                      {task.resources && task.resources.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-2">
                          {task.resources.map((res, idx) => (
                            <a
                              key={idx}
                              href={res.url || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50/50 hover:bg-purple-100/70 border border-purple-200/60 text-[11px] font-semibold text-slate-700 hover:text-brand-700 transition-colors"
                            >
                              <BookOpen className="w-3 h-3 text-brand-500" />
                              <span>{res.title}</span>
                              {res.isFree && (
                                <span className="text-[9px] font-extrabold uppercase text-cyan-600 font-mono">FREE</span>
                              )}
                              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapDetails;
