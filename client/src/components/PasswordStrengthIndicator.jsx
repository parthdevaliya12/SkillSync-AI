import React from 'react';
import { checkPasswordStrength, PASSWORD_REQUIREMENTS } from '../utils/passwordValidator';
import { Check, X, Shield, ShieldCheck, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

const PasswordStrengthIndicator = ({
  password = '',
  confirmPassword,
  showRequirements = true,
  className = '',
}) => {
  const result = checkPasswordStrength(password);
  const { checks, passedCount, label, badgeBg, barColor, isStrong } = result;

  // Has user started typing?
  const hasTyped = password.length > 0;
  const hasTypedConfirm = confirmPassword !== undefined && confirmPassword.length > 0;
  const passwordsMatch = hasTyped && hasTypedConfirm && password === confirmPassword;
  const passwordsMismatch = hasTypedConfirm && password !== confirmPassword;

  return (
    <div className={`space-y-3 font-sans ${className}`}>
      {/* Strength Bar Meter & Status Header */}
      {hasTyped && (
        <div className="space-y-2 pt-1 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
              {isStrong ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : passedCount >= 3 ? (
                <Shield className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              )}
              Password Strength:
            </span>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-all duration-300 font-mono ${badgeBg}`}
            >
              {label} ({passedCount}/5)
            </span>
          </div>

          {/* 4 Segmented Progress Bars */}
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((step) => {
              // Level calculation:
              // step 1 = weak (passedCount >= 1)
              // step 2 = fair (passedCount >= 3)
              // step 3 = good (passedCount >= 4)
              // step 4 = strong (passedCount === 5)
              let active = false;
              if (step === 1) active = passedCount >= 1;
              if (step === 2) active = passedCount >= 3;
              if (step === 3) active = passedCount >= 4;
              if (step === 4) active = passedCount === 5;

              return (
                <div
                  key={step}
                  className="h-1.5 rounded-full bg-slate-100 overflow-hidden"
                >
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      active ? barColor : 'bg-transparent'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Checklist Requirements */}
      {showRequirements && (
        <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2 text-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
            Password Must Contain:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {PASSWORD_REQUIREMENTS.map((req) => {
              const satisfied = checks[req.key];
              return (
                <div
                  key={req.key}
                  className={`flex items-center gap-2 text-[11px] font-medium transition-colors ${
                    satisfied ? 'text-emerald-700 font-semibold' : 'text-slate-500'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      satisfied
                        ? 'bg-emerald-100 text-emerald-600 shadow-xs'
                        : 'bg-slate-200/80 text-slate-400'
                    }`}
                  >
                    {satisfied ? (
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    )}
                  </span>
                  <span>{req.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Password Confirmation Status */}
      {confirmPassword !== undefined && hasTypedConfirm && (
        <div
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border animate-in fade-in transition-all ${
            passwordsMatch
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
              : 'bg-rose-50 text-rose-700 border-rose-200/80'
          }`}
        >
          {passwordsMatch ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Passwords match perfectly</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Passwords do not match yet</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;

