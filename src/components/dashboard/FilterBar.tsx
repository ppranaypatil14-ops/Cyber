import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export const FilterBar: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#05130e]/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-4 shadow-2xl">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search incidents, assets, severity..."
          className="w-full bg-[#030d09] border border-emerald-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
        />
      </div>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-[#030d09] border border-emerald-500/20 rounded-xl text-xs text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all font-medium">
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Filters
      </button>
    </div>
  );
};
