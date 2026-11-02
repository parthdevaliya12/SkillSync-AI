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

  const getProficiencyColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'advanced':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Technical Skill Portfolio</h2>
          <p className="text-xs text-slate-500">
            Define your current competencies to power accurate job description comparisons.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:shadow-glow hover:scale-[1.02] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills (e.g. React, PostgreSQL)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-premium hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {skill.category}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900">{skill.name}</h3>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getProficiencyColor(
                      skill.proficiency
                    )}`}
                  >
                    {skill.proficiency}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{skill.years_experience} years practical experience</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  Added {new Date(skill.created_at).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(skill)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    title="Edit skill"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id, skill.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-premium border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {modalMode === 'add' ? 'Add Skill to Portfolio' : `Edit ${currentSkill?.name}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {modalMode === 'add' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Choose from Curated Skills (Optional)
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
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-brand-500"
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
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                          Custom Skill Name *
                        </label>
                        <input
                          type="text"
                          value={formData.skillName}
                          onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                          placeholder="e.g. Next.js, Redis, PyTorch"
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-brand-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
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
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Proficiency Level *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, proficiency: lvl })}
                      className={`py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                        formData.proficiency === lvl
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-700 shadow-glow disabled:opacity-50"
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
