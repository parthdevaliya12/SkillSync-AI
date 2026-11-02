import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Target, Mail, Lock, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const res = await login(formData.email, formData.password);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Failed to authenticate');
    }
  };

  const fillDemoAccount = () => {
    setFormData({
      email: 'alex.developer@skillsync.ai',
      password: 'password123',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-mesh font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-500 p-0.5 shadow-glow flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Target className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            SkillSync<span className="text-brand-600">.AI</span>
          </span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Sign in to analyze jobs, track skills, and advance your roadmap.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-premium rounded-3xl border border-slate-200/80">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-3 text-rose-700 text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="engineer@domain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-xs sm:text-sm font-medium transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-xs sm:text-sm font-medium transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-cyan-300" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={fillDemoAccount}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Auto-fill Demo Credentials</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
