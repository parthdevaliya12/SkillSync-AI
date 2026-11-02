import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { checkPasswordStrength } from '../utils/passwordValidator';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    const strength = checkPasswordStrength(formData.password);
    if (!strength.isStrong) {
      setError(`Please choose a strong password. Missing: ${strength.missingRequirements.join(', ')}.`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    setLoading(true);
    const res = await register(formData.fullName, formData.email, formData.password);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfe] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-mesh font-sans selection:bg-brand-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-500 p-0.5 shadow-glow flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0c0e18] rounded-[14px] flex items-center justify-center">
              <Compass className="w-6 h-6 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-sans">
            SkillSync<span className="text-brand-600">.AI</span>
          </span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Create your career account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 font-body">
          Start identifying your skill gaps and generating AI roadmaps in minutes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-premium rounded-3xl border border-[#e8e9f2]">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-3 text-rose-700 text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Alex Sharma"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e8e9f2] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-xs sm:text-sm font-medium transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex.developer@skillsync.ai"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e8e9f2] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-xs sm:text-sm font-medium transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Password *
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Min 8 chars, mixed case, symbols</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl border border-[#e8e9f2] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-xs sm:text-sm font-medium transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl border border-[#e8e9f2] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-xs sm:text-sm font-medium transition-all"
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

            {/* Real-time Password Strength Indicator & Checklist */}
            <PasswordStrengthIndicator
              password={formData.password}
              confirmPassword={formData.confirmPassword}
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Creating Your Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4 text-cyan-200" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600 font-body">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
