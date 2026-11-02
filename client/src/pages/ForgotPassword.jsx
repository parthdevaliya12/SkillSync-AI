import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Target, Mail, Lock, Key, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Request token, 2: Reset password
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.data.message || 'Reset token generated.');
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
        toast.success('Security token generated!');
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetToken || !newPassword) {
      setError('Please provide the reset token and new password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authService.resetPassword(resetToken, newPassword);
      toast.success('Password successfully reset! Please sign in.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired reset token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-mesh font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 p-0.5 shadow-glow flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Target className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            SkillSync<span className="text-brand-600">.AI</span>
          </span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Password Recovery
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Reset your credentials securely using your registered email.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-premium rounded-3xl border border-slate-200/80">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-3 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestToken} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Account Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="registered@skillsync.ai"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:shadow-glow transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Request Reset Token</span>}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-800">
                Token generated. In production, this is emailed. We've prefilled it below for seamless major project demonstration.
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Reset Token
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New secure password (min 6 chars)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:shadow-glow transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Password</span>}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Password Reset Completed</h3>
              <p className="text-xs text-slate-500">You can now sign in with your updated credentials.</p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-3 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 shadow-glow"
              >
                Go to Sign In
              </Link>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-slate-600 border-t border-slate-100 pt-4">
            Remember your credentials?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
