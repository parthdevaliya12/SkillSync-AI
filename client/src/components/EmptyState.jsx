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
    <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-2xl border border-dashed border-slate-300">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 shadow-sm">
        <Icon className="w-8 h-8 text-brand-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
      
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:shadow-glow hover:scale-[1.02] transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>{actionLabel}</span>
        </Link>
      )}

      {actionLabel && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:shadow-glow hover:scale-[1.02] transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
