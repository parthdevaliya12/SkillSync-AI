import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No records found',
  description = 'Get started by creating your first record to begin tracking your career progress.',
  actionLabel,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-dashed border-purple-200/80 shadow-card">
      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-100 to-cyan-50 text-brand-600 flex items-center justify-center mb-4 shadow-sm border border-purple-200/50">
        <Icon className="w-8 h-8 text-brand-600" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full"></span>
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 mb-2 font-sans">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">{description}</p>
      
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-500 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>{actionLabel}</span>
        </Link>
      )}

      {actionLabel && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-500 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
