import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'brand', trend }) => {
  const colorMap = {
    brand: {
      bg: 'bg-brand-50 text-brand-600 border-brand-200/60',
      iconBg: 'bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-glow',
    },
    cyan: {
      bg: 'bg-cyan-50 text-cyan-700 border-cyan-200/60',
      iconBg: 'bg-gradient-to-tr from-cyan-600 to-teal-500 text-white shadow-glow-cyan',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-green-500 text-white',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
      iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white',
    },
    violet: {
      bg: 'bg-violet-50 text-violet-700 border-violet-200/60',
      iconBg: 'bg-gradient-to-tr from-violet-600 to-purple-500 text-white',
    },
  };

  const scheme = colorMap[color] || colorMap.brand;

  return (
    <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-premium hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              {value}
            </h3>
            {trend && (
              <span className={`inline-flex items-center text-xs font-bold ${
                trend > 0 ? 'text-emerald-600' : 'text-slate-500'
              }`}>
                {trend > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : null}
                {trend > 0 ? `+${trend}%` : `${trend}%`}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 pt-1 font-medium">{subtitle}</p>
          )}
        </div>

        <div className={`p-3 rounded-2xl ${scheme.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
