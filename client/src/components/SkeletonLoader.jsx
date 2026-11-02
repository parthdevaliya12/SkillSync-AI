import React from 'react';

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm animate-pulse space-y-4"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-8 w-8 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="h-8 bg-slate-200 rounded w-1/2"></div>
          <div className="h-3 bg-slate-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 flex gap-4">
        <div className="h-5 bg-slate-200 rounded w-1/4 animate-pulse"></div>
      </div>
      <div className="divide-y divide-slate-100 p-4 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 animate-pulse">
            <div className="flex items-center gap-3 w-1/3">
              <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
            </div>
            <div className="h-4 bg-slate-200 rounded w-20"></div>
            <div className="h-4 bg-slate-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default { CardSkeleton, TableSkeleton };
