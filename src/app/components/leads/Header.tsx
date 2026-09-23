import React from "react";

interface LeadsHeaderProps {
  totalLeads: number;
  onRefresh: () => void;
}

const LeadsHeader: React.FC<LeadsHeaderProps> = ({
  totalLeads,
  onRefresh,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-5 md:mb-8 md:flex-row md:items-end md:justify-between">
      
      {/* Left Section */}
      <div className="min-w-0">
        {/* Title + Count */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
            All Leads
          </h1>

          {/* Total Lead Count */}
          <span className="rounded-full border border-lime-400/20 bg-lime-400/10 px-2.5 py-1 text-xs font-bold text-lime-400 sm:px-3 sm:text-sm">
            {totalLeads}
          </span>
        </div>

        {/* Description */}
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          Manage, track and follow up with your gym prospects
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex w-full gap-3 sm:w-auto">
        
        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-lime-400/50 hover:text-lime-400 active:scale-[0.98] sm:flex-none sm:px-4"
        >
          <span className="text-base">↻</span>
          Refresh
        </button>

        {/* Add Lead */}
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-lime-400 px-3 py-2.5 text-sm font-bold text-black transition-all duration-200 hover:bg-lime-300 active:scale-[0.98] sm:flex-none sm:px-4"
        >
          <span className="text-lg leading-none">+</span>
          Add Lead
        </button>
      </div>
    </div>
  );
};

export default LeadsHeader;