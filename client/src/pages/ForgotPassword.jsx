import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Compass, Mail, Lock, Key, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-[#fbfbfe] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-mesh font-sans selection:bg-purple-600 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-purple-600 to-cyan-500 p-0.5 shadow-glow flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0c0e18] rounded-[14px] flex items-center justify-center">
              <Compass className="w-6 h-6 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-sans">
            SkillSync<span className="text-brand-600">.AI</span>
          </span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Password Recovery
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 font-body">
          {step === 1 && 'Enter your email to receive a secure recovery token.'}
          {step === 2 && 'Enter the security token and your new password.'}
          {step === 3 && 'Your account security credentials have been updated.'}
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

          {step === 1 && (
            <form onSubmit={handleRequestToken} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineer@domain.com"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e8e9f2] focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-500 hover:shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Generating Security Token...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Reset Token</span>
                    <ArrowRight className="w-4 h-4 text-cyan-200" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {message && (
                <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-brand-800 text-xs font-semibold mb-2">
                  {message}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                  Security Reset Token
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Enter security token"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e8e9f2] font-mono text-xs focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                  New Password (Min 6 characters)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e8e9f2] text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-500 hover:shadow-glow transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Credentials...</span>
                    </>
                  ) : (
                    <span>Set New Password</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4 py-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 font-sans">Password Successfully Updated</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-body">
                Your credentials have been securely hashed with bcrypt in PostgreSQL. You can now log into your account.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-purple-700 shadow-glow"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4 text-cyan-200" />
              </Link>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-600 font-body">
            Remember your credentials?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
