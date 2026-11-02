import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Briefcase,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Save,
  ShieldCheck,
  CheckCircle,
  Loader2
} from 'lucide-react';

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    title: user?.title || '',
    bio: user?.bio || '',
    location: user?.location || '',
    githubUrl: user?.githubUrl || '',
    linkedinUrl: user?.linkedinUrl || '',
    portfolioUrl: user?.portfolioUrl || '',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(formData);
    setSaving(false);
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">Profile & Account Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal details, career targets, and online developer profiles.
        </p>
      </div>

      <div className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e8e9f2] shadow-premium space-y-8">
        {/* User Card Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-glow">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900 font-sans">{user?.fullName}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 font-mono">
              <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-3 py-0.5 rounded-full border border-cyan-200">
                Verified Account
              </span>
              <span className="text-[10px] text-slate-400">
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e8e9f2] text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                Email Address (Managed)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 text-xs sm:text-sm font-medium cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                Professional Title
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Aspiring Full Stack Developer, MCA Graduate"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e8e9f2] text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore, India"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e8e9f2] text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
              Career Bio & Ambition
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about your learning goals, target engineering roles, or dream companies..."
              className="w-full p-4 rounded-2xl border border-[#e8e9f2] text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none leading-relaxed transition-all font-body"
            />
          </div>

          {/* Links Section */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
              Developer Portfolios & Links
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 font-mono">
                  GitHub Profile
                </label>
                <div className="relative">
                  <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#e8e9f2] text-xs focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 font-mono">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#e8e9f2] text-xs focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 font-mono">
                  Portfolio Website
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    placeholder="https://mywebsite.dev"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#e8e9f2] text-xs focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <span>Saved in PostgreSQL with parameterized transactions</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Updating Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
