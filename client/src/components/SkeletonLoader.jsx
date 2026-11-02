import React from 'react';

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-3xl border border-[#e9ebf2] shadow-card animate-pulse space-y-4"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 bg-orange-100/60 rounded-lg w-1/3"></div>
            <div className="h-9 w-9 bg-orange-100/60 rounded-2xl"></div>
          </div>
          <div className="h-8 bg-slate-200/80 rounded-xl w-1/2"></div>
          <div className="h-3 bg-slate-200/60 rounded-lg w-3/4"></div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-3xl border border-[#e9ebf2] overflow-hidden shadow-card">
      <div className="p-5 border-b border-slate-100 flex gap-4">
        <div className="h-5 bg-orange-100/60 rounded-lg w-1/4 animate-pulse"></div>
      </div>
      <div className="divide-y divide-slate-100 p-5 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 animate-pulse">
            <div className="flex items-center gap-3 w-1/3">
              <div className="w-9 h-9 rounded-xl bg-orange-100/60"></div>
              <div className="h-4 bg-slate-200/80 rounded-lg w-full"></div>
            </div>
            <div className="h-4 bg-slate-200/60 rounded-lg w-20"></div>
            <div className="h-4 bg-slate-200/60 rounded-lg w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default { CardSkeleton, TableSkeleton };
