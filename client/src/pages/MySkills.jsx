import React, { useState, useEffect } from 'react';
import { skillService } from '../services/api';
import { CardSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Sparkles,
  CheckCircle,
  X,
  Loader2,
  Briefcase
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Programming Languages',
  'Frontend',
  'Backend',
  'Database',
  'DevOps & Cloud',
  'Data Science & AI',
  'Tools',
  'Concepts',
];

const MySkills = () => {
  const [skills, setSkills] = useState([]);
  const [masterSkills, setMasterSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentSkill, setCurrentSkill] = useState(null);
  const [formData, setFormData] = useState({
    skillId: '',
    skillName: '',
    category: 'Programming Languages',
    proficiency: 'intermediate',
    yearsExperience: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const [userRes, masterRes] = await Promise.all([
        skillService.getUserSkills(),
        skillService.getMasterSkills(),
      ]);
      setSkills(userRes.data.skills || []);
      setMasterSkills(masterRes.data.skills || []);
    } catch (err) {
      console.error('Failed to load skills:', err);
      toast.error('Failed to load your skills from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenAdd = () => {
    setModalMode('add');
    setCurrentSkill(null);
    setFormData({
      skillId: '',
      skillName: '',
      category: 'Programming Languages',
      proficiency: 'intermediate',
      yearsExperience: 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setModalMode('edit');
    setCurrentSkill(skill);
    setFormData({
      skillId: skill.skill_id,
      skillName: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      yearsExperience: skill.years_experience,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (modalMode === 'add') {
        const payload = formData.skillId
          ? { skillId: formData.skillId, proficiency: formData.proficiency, yearsExperience: parseFloat(formData.yearsExperience) }
          : { skillName: formData.skillName, category: formData.category, proficiency: formData.proficiency, yearsExperience: parseFloat(formData.yearsExperience) };

        await skillService.addUserSkill(payload);
        toast.success('Skill added to your portfolio!');
      } else {
        await skillService.updateUserSkill(currentSkill.id, {
          proficiency: formData.proficiency,
          yearsExperience: parseFloat(formData.yearsExperience),
        });
        toast.success('Skill updated successfully!');
      }

      setIsModalOpen(false);
      fetchSkills();
    } catch (err) {
      const msg = err.response?.data?.error || 'Action failed.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from your profile?`)) return;

    try {
      await skillService.deleteUserSkill(id);
      toast.success(`${name} removed.`);
      setSkills(skills.filter((s) => s.id !== id));
    } catch (err) {
      toast.error('Failed to delete skill.');
    }
  };

  const filteredSkills = skills.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getProficiencyBadge = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'intermediate':
        return 'bg-orange-50 text-brand-700 border-orange-200';
      case 'advanced':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">Technical Skill Portfolio</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Define your verified competencies to power deterministic job description gap matching.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#e9ebf2] shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills (e.g. React, PostgreSQL)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e9ebf2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-body"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-brand-600 to-orange-600 text-white shadow-glow'
                  : 'bg-orange-50/40 text-slate-600 hover:bg-orange-100/60 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white p-6 rounded-3xl border border-[#e9ebf2] shadow-card hover:shadow-card-hover hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {skill.category}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 font-sans mt-0.5">{skill.name}</h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border font-mono ${getProficiencyBadge(
                      skill.proficiency
                    )}`}
                  >
                    {skill.proficiency}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-body">
                  <Briefcase className="w-3.5 h-3.5 text-brand-500" />
                  <span>{skill.years_experience} years practical experience</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  Added {new Date(skill.created_at).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(skill)}
                    className="p-2 text-slate-400 hover:text-brand-600 hover:bg-orange-50 rounded-xl transition-colors"
                    title="Edit skill"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id, skill.name)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No skills match your criteria"
          description="Try selecting a different category or click Add New Skill to expand your profile."
          actionLabel="Add a Skill"
          onAction={handleOpenAdd}
        />
      )}

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060810]/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-7 shadow-premium border border-orange-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900 font-sans">
                {modalMode === 'add' ? 'Add Skill to Portfolio' : `Edit ${currentSkill?.name}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {modalMode === 'add' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                      Curated Master Skill (Optional)
                    </label>
                    <select
                      value={formData.skillId}
                      onChange={(e) => {
                        const s = masterSkills.find((item) => item.id === e.target.value);
                        setFormData({
                          ...formData,
                          skillId: e.target.value,
                          skillName: s ? s.name : '',
                          category: s ? s.category : formData.category,
                        });
                      }}
                      className="w-full p-3 rounded-xl border border-[#e9ebf2] text-xs font-medium focus:ring-2 focus:ring-brand-500 font-body"
                    >
                      <option value="">-- Or enter custom skill below --</option>
                      {masterSkills.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {!formData.skillId && (
                    <>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                          Custom Skill Name *
                        </label>
                        <input
                          type="text"
                          value={formData.skillName}
                          onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                          placeholder="e.g. Next.js, Redis, PyTorch"
                          className="w-full p-3 rounded-xl border border-[#e9ebf2] text-xs font-medium focus:ring-2 focus:ring-brand-500 font-body"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full p-3 rounded-xl border border-[#e9ebf2] text-xs font-medium font-body"
                        >
                          {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                  Proficiency Tier *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, proficiency: lvl })}
                      className={`py-2.5 rounded-xl text-xs font-bold uppercase border transition-all ${
                        formData.proficiency === lvl
                          ? 'bg-brand-600 text-white border-brand-600 shadow-glow'
                          : 'bg-orange-50/40 text-slate-600 border-orange-100 hover:bg-orange-100/70'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                  Years of Experience
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#e9ebf2] text-xs font-medium focus:ring-2 focus:ring-brand-500 font-mono"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-orange-600 hover:shadow-glow disabled:opacity-50 transition-all"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Skill</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySkills;
