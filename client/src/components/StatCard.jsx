import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'brand', trend }) => {
  const colorMap = {
    brand: {
      bg: 'bg-purple-50 text-brand-600 border-purple-200/60',
      iconBg: 'bg-gradient-to-tr from-brand-600 via-purple-600 to-purple-700 text-white shadow-glow',
      borderGlow: 'hover:border-purple-300',
    },
    cyan: {
      bg: 'bg-cyan-50 text-cyan-700 border-cyan-200/60',
      iconBg: 'bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white shadow-glow-cyan',
      borderGlow: 'hover:border-cyan-300',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-glow-cyan',
      borderGlow: 'hover:border-emerald-300',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
      iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-glow-amber',
      borderGlow: 'hover:border-amber-300',
    },
    violet: {
      bg: 'bg-violet-50 text-violet-700 border-violet-200/60',
      iconBg: 'bg-gradient-to-tr from-purple-600 to-brand-700 text-white shadow-glow',
      borderGlow: 'hover:border-purple-300',
    },
  };

  const scheme = colorMap[color] || colorMap.brand;

  return (
    <div className={`relative overflow-hidden bg-white p-6 rounded-3xl border border-[#e8e9f2] shadow-card hover:shadow-card-hover ${scheme.borderGlow} hover:-translate-y-1 transition-all duration-300 group`}>
      {/* Top subtle highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
            {title}
          </p>
          <div className="flex items-baseline gap-2 pt-1">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              {value}
            </h3>
            {trend && (
              <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-slate-100 text-slate-600'
                }`}>
                {trend > 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : null}
                {trend > 0 ? `+${trend}%` : `${trend}%`}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 pt-1 font-medium leading-relaxed">{subtitle}</p>
          )}
        </div>

        <div className={`p-3.5 rounded-2xl ${scheme.iconBg} transition-transform duration-300 group-hover:scale-105 shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
