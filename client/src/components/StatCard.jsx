import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'brand', trend }) => {
  const colorMap = {
    brand: {
      bg: 'bg-orange-50 text-brand-600 border-orange-200/60',
      iconBg: 'bg-gradient-to-tr from-brand-600 via-orange-500 to-amber-500 text-white shadow-glow',
      borderGlow: 'hover:border-orange-300',
    },
    cyan: {
      bg: 'bg-cyan-50 text-cyan-800 border-cyan-200/60',
      iconBg: 'bg-gradient-to-tr from-cyan-600 to-teal-500 text-white shadow-glow-cyan',
      borderGlow: 'hover:border-cyan-300',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-glow-cyan',
      borderGlow: 'hover:border-emerald-300',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200/60',
      iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-glow-amber',
      borderGlow: 'hover:border-amber-300',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200/60',
      iconBg: 'bg-gradient-to-tr from-rose-600 to-orange-500 text-white shadow-glow',
      borderGlow: 'hover:border-rose-300',
    },
    violet: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200/60',
      iconBg: 'bg-gradient-to-tr from-rose-600 to-orange-500 text-white shadow-glow',
      borderGlow: 'hover:border-rose-300',
    },
  };

  const scheme = colorMap[color] || colorMap.brand;

  return (
    <div className={`relative overflow-hidden bg-white p-6 rounded-3xl border border-[#e9ebf2] shadow-card hover:shadow-card-hover ${scheme.borderGlow} hover:-translate-y-1 transition-all duration-300 group`}>
      {/* Top subtle highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            {title}
          </p>
          <div className="flex items-baseline gap-2 pt-1">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              {value}
            </h3>
            {trend && (
              <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full font-mono ${
                trend > 0 ? 'bg-cyan-50 text-cyan-800 border border-cyan-200' : 'bg-slate-100 text-slate-600'
              }`}>
                {trend > 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : null}
                {trend > 0 ? `+${trend}%` : `${trend}%`}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 pt-1 font-medium leading-relaxed font-body">{subtitle}</p>
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
