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
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Profile & Account Settings</h2>
        <p className="text-xs text-slate-500">
          Manage your personal details, career targets, and online developer profiles.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-premium space-y-8">
        {/* User Card Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 text-white font-extrabold text-2xl flex items-center justify-center shadow-glow">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg font-bold text-slate-900">{user?.fullName}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Verified Account
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                Email Address (Managed)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs sm:text-sm font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                Professional Title
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Aspiring Full Stack Developer, MCA Student"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore, India"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
              Career Bio & Ambition
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about your learning goals, target roles, or dream companies..."
              className="w-full p-4 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Links Section */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Developer Portfolios & Links
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  GitHub Profile
                </label>
                <div className="relative">
                  <Github className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Portfolio Website
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    placeholder="https://mywebsite.dev"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Saved in PostgreSQL with parameterized transactions</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:shadow-glow hover:scale-[1.02] transition-all disabled:opacity-50"
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
