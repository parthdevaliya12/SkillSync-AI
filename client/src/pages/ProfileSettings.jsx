import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
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
  Loader2,
  Lock,
  Key,
  Eye,
  EyeOff,
  ShieldAlert
} from 'lucide-react';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { checkPasswordStrength } from '../utils/passwordValidator';

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

  // Security & Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(formData);
    setSaving(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please enter your current and new password.');
      return;
    }

    const strength = checkPasswordStrength(passwordData.newPassword);
    if (!strength.isStrong) {
      toast.error(`Please provide a strong password: ${strength.missingRequirements.join(', ')}.`);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Account password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setChangingPassword(false);
    }
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

      {/* Account Security & Password Card */}
      <div className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e8e9f2] shadow-premium space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-500 text-white flex items-center justify-center shadow-glow shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-sans">Account Security & Password</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-body">
              Update your account password with enterprise-grade strong password requirements.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
              Current Password *
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="w-full pl-11 pr-11 py-3 rounded-2xl border border-[#e8e9f2] text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  New Password *
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Min 8 chars, mixed case, symbols</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter strong new password"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl border border-[#e8e9f2] text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Re-enter new password"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl border border-[#e8e9f2] text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Strength Indicator & Verification */}
          <PasswordStrengthIndicator
            password={passwordData.newPassword}
            confirmPassword={passwordData.confirmPassword}
          />

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <span>Hashed with 12 bcrypt salt rounds before persistence</span>
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {changingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Update Password</span>
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
