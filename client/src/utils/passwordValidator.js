/**
 * Password strength and validation utility for SkillSync AI
 * Enforces strong password rules:
 * 1. Minimum 8 characters
 * 2. At least one uppercase letter (A-Z)
 * 3. At least one lowercase letter (a-z)
 * 4. At least one numeric digit (0-9)
 * 5. At least one special symbol (!@#$%^&*...)
 */

export const PASSWORD_REQUIREMENTS = [
  { key: 'length', label: 'At least 8 characters long', regex: /.{8,}/ },
  { key: 'upper', label: 'One uppercase letter (A-Z)', regex: /[A-Z]/ },
  { key: 'lower', label: 'One lowercase letter (a-z)', regex: /[a-z]/ },
  { key: 'number', label: 'One number (0-9)', regex: /[0-9]/ },
  { key: 'special', label: 'One special symbol (!@#$%^&*)', regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/ },
];

export const checkPasswordStrength = (password = '') => {
  const pwd = String(password || '');

  const checks = {
    length: pwd.length >= 8,
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pwd),
  };

  const passedCount = Object.values(checks).filter(Boolean).length;

  let strength = 'empty';
  let label = 'No Password';
  let color = 'slate';
  let percentage = 0;
  let barColor = 'bg-slate-200';
  let textColor = 'text-slate-400';
  let badgeBg = 'bg-slate-100 text-slate-500 border-slate-200';

  if (pwd.length === 0) {
    strength = 'empty';
    label = 'Enter password';
    percentage = 0;
  } else if (passedCount <= 2 || pwd.length < 6) {
    strength = 'weak';
    label = 'Weak';
    color = 'rose';
    percentage = 25;
    barColor = 'bg-rose-500';
    textColor = 'text-rose-600';
    badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (passedCount === 3 || (passedCount === 4 && pwd.length < 8)) {
    strength = 'fair';
    label = 'Fair';
    color = 'amber';
    percentage = 50;
    barColor = 'bg-amber-500';
    textColor = 'text-amber-600';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (passedCount === 4 && checks.length) {
    strength = 'good';
    label = 'Good';
    color = 'cyan';
    percentage = 75;
    barColor = 'bg-cyan-500';
    textColor = 'text-cyan-600';
    badgeBg = 'bg-cyan-50 text-cyan-700 border-cyan-200';
  } else if (passedCount === 5) {
    strength = 'strong';
    label = 'Strong & Secure';
    color = 'emerald';
    percentage = 100;
    barColor = 'bg-emerald-500';
    textColor = 'text-emerald-600';
    badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }

  const isStrong = passedCount === 5;

  const missingRequirements = [];
  if (!checks.length) missingRequirements.push('at least 8 characters');
  if (!checks.upper) missingRequirements.push('one uppercase letter (A-Z)');
  if (!checks.lower) missingRequirements.push('one lowercase letter (a-z)');
  if (!checks.number) missingRequirements.push('one number (0-9)');
  if (!checks.special) missingRequirements.push('one special symbol (!@#$%^&*)');

  return {
    checks,
    passedCount,
    strength,
    label,
    color,
    percentage,
    barColor,
    textColor,
    badgeBg,
    isStrong,
    missingRequirements,
  };
};

