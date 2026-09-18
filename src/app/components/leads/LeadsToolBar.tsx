import React from "react";

const LeadsToolbar: React.FC = () => {
  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search leads by name or email..."
            className="
              w-full rounded-lg
              border border-zinc-800
              bg-[#0A0A0A]
              py-2.5 pl-10 pr-4
              text-sm text-white
              placeholder:text-zinc-600
              outline-none
              transition-all duration-200
              focus:border-lime-400/50
              focus:ring-1 focus:ring-lime-400/20
            "
          />
        </div>

        {/* Filters */}
        <div className="grid w-full grid-cols-2 gap-3 md:w-auto md:flex">
          
          {/* Status Filter */}
          <select
            className="
              w-full cursor-pointer rounded-lg
              border border-zinc-800
              bg-[#0A0A0A]
              px-3 py-2.5
              text-sm font-medium text-zinc-300
              outline-none
              transition-all duration-200
              hover:border-zinc-700
              focus:border-lime-400/50
              focus:ring-1 focus:ring-lime-400/20
              md:w-40
            "
            defaultValue="all"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="trial-booked">Trial Booked</option>
            <option value="joined">Joined</option>
          </select>

          {/* Sort */}
          <select
            className="
              w-full cursor-pointer rounded-lg
              border border-zinc-800
              bg-[#0A0A0A]
              px-3 py-2.5
              text-sm font-medium text-zinc-300
              outline-none
              transition-all duration-200
              hover:border-zinc-700
              focus:border-lime-400/50
              focus:ring-1 focus:ring-lime-400/20
              md:w-40
            "
            defaultValue="newest"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
          </select>

        </div>
      </div>
    </div>
  );
};

export default LeadsToolbar;