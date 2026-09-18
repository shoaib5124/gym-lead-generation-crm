import React from "react";
import Link from "next/link";

interface Lead {
  _id: string;
  name: string;
  email: string;
  purpose: string;
  status: string;
  createdAt: string;
}

interface LeadsTableProps {
  leads: Lead[];
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "new":
      return "border-blue-400/20 bg-blue-400/10 text-blue-400";

    case "contacted":
      return "border-yellow-400/20 bg-yellow-400/10 text-yellow-400";

    case "interested":
      return "border-purple-400/20 bg-purple-400/10 text-purple-400";

    case "trial-booked":
      return "border-orange-400/20 bg-orange-400/10 text-orange-400";

    case "joined":
      return "border-lime-400/20 bg-lime-400/10 text-lime-400";

    default:
      return "border-zinc-700 bg-zinc-800 text-zinc-400";
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "trial-booked":
      return "Trial Booked";

    case "new":
      return "New";

    case "contacted":
      return "Contacted";

    case "interested":
      return "Interested";

    case "joined":
      return "Joined";

    default:
      return status;
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const LeadsTable: React.FC<LeadsTableProps> = ({ leads }) => {
  // Empty state
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/10 text-2xl">
          👤
        </div>

        <h3 className="text-lg font-bold text-white">
          No leads found
        </h3>

        <p className="mt-2 text-sm text-zinc-500">
          New gym prospects will appear here when they submit the form.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Lead
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Email
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Purpose
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Date
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.03]"
                >
                  {/* Lead */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-400/10 text-sm font-bold text-lime-400">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>

                      <span className="font-semibold text-white">
                        {lead.name}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-4 text-sm text-zinc-400">
                    {lead.email}
                  </td>

                  {/* Purpose */}
                  <td className="max-w-[220px] px-5 py-4">
                    <span className="block truncate text-sm text-zinc-300">
                      {lead.purpose}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                        lead.status
                      )}`}
                    >
                      {formatStatus(lead.status)}
0                    </span>
                  </td>
  
                  {/* Date */}
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-500">
                    {formatDate(lead.createdAt)}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/dashboard/Leads/${lead._id}`}
                      className="inline-flex items-center rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:border-lime-400/50 hover:text-lime-400"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="space-y-3 md:hidden">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.05]"
          >
            {/* Top */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400/10 text-sm font-bold text-lime-400">
                  {lead.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-white">
                    {lead.name}
                  </h3>

                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {lead.email}
                  </p>
                </div>
              </div>

              {/* Status */}
              <span
                className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${getStatusStyle(
                  lead.status
                )}`}
              >
                {formatStatus(lead.status)}
              </span>
            </div>

            {/* Details */}
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/5 pt-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                  Purpose
                </p>

                <p className="mt-1 truncate text-sm text-zinc-300">
                  {lead.purpose}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                  Date
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  {formatDate(lead.createdAt)}
                </p>
              </div>
            </div>

            {/* View Button */}
            <Link
              href={`/dashboard/Leads/${lead._id}`}
              className="mt-4 flex w-full items-center justify-center rounded-lg border border-zinc-700 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-lime-400/50 hover:text-lime-400"
            >
              View Lead
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default LeadsTable;