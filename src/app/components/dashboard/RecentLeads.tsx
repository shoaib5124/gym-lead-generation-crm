import { Lead } from "@/app/types";
import { useState } from "react";
import Link from "next/link";

interface RecentLeads {
  leads: Lead[];
  loading: boolean;
}

export default function RecentLeads({
  leads,
  loading,
}: RecentLeads) {
  function getStatusStyle(status: string) {
    switch (status) {
      case "new":
        return "bg-lime-400/10 text-lime-400 border border-lime-400/20";

      case "contacted":
        return "bg-white/10 text-white border border-white/10";

      case "interested":
        return "bg-white/10 text-zinc-300 border border-white/10";

      case "trial-booked":
        return "bg-white/10 text-zinc-300 border border-white/10";

      case "joined":
        return "bg-lime-400 text-black border border-lime-400";

      default:
        return "bg-white/5 text-zinc-400";
    }
  }

  return (
    <div className="w-full bg-white/5 border border-white/10 p-4 sm:p-5 md:p-6 lg:p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6 md:mb-8">
        <div className="min-w-0">
          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-lime-400">
            Latest Activity
          </span>

          <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase text-white mt-1 sm:mt-2">
            Recent Leads
          </h2>
        </div>
          <Link
              href="/dashboard/Leads"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-lime-400 hover:bg-lime-400 hover:text-black"
            >
              View All Leads
              <span>→</span>
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-xs sm:text-sm text-zinc-500">
          Loading leads...
        </p>
      )}

      {/* No leads */}
      {!loading && leads.length === 0 && (
        <p className="text-xs sm:text-sm text-zinc-500">
          No leads found.
        </p>
      )}

      {/* Leads table */}
      {!loading && leads.length > 0 && (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[500px] text-left">

            <thead>
              <tr className="border-b border-white/10">

                <th className="pb-3 sm:pb-4 text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-zinc-500">
                  Lead
                </th>

                <th className="pb-3 sm:pb-4 text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-zinc-500">
                  Goal
                </th>

                <th className="pb-3 sm:pb-4 text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-zinc-500">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>
              {leads.slice(0, 5).map((lead) => (

                <tr
                  key={lead._id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >

                  <td className="py-3 sm:py-4 md:py-5 pr-4">

                    <div className="text-sm sm:text-base font-bold text-white truncate max-w-[180px] sm:max-w-[250px] md:max-w-none">
                      {lead.name}
                    </div>

                    <div className="text-[10px] sm:text-xs text-zinc-500 mt-1 truncate max-w-[180px] sm:max-w-[250px] md:max-w-none">
                      {lead.email}
                    </div>

                  </td>

                  <td className="py-3 sm:py-4 md:py-5 pr-4 text-xs sm:text-sm text-zinc-400">
                    {lead.purpose}
                  </td>

                  <td className="py-3 sm:py-4 md:py-5">

                    <span
                      className={`inline-flex px-2 sm:px-3 py-1 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${getStatusStyle(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>

                  </td>

                </tr>

              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}
