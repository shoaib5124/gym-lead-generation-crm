import React from 'react'
import type { Lead, LeadStatusType } from "@/app/types";
import { toast } from "sonner";

type LeadStatus = LeadStatusType;

  const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "border-lime-400/20 bg-lime-400/10 text-lime-300",
  contacted: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  interested: "border-purple-400/20 bg-purple-400/10 text-purple-300",
  Notresponed: "border-blue-400/20 bg-lime-400 text-purple-300",
  "trial-booked":
    "border-orange-400/20 bg-orange-400/10 text-orange-300",
  joined: "border-lime-400 bg-lime-400 text-black",
};
const STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "contacted",
  "interested",
  "trial-booked",
  "joined",
];
const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  Notresponed: "Not-Responed",
  "trial-booked": "Trial Booked",
  joined: "Joined",
};


interface LeadStatusProps {
  setLead: React.Dispatch<React.SetStateAction<Lead | null>>;
  lead: Lead | null;
  statusLoading: boolean;
  setstatusLoading: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  updateLeadStatus: (
    id: string,
    status: LeadStatus
  ) => Promise<Lead | undefined>;
}


export const LeadStatus = (
{
  setLead,
  lead,
  statusLoading,
  setstatusLoading,
  id,
  updateLeadStatus,
}: LeadStatusProps
) =>{
    if (!lead) {
    return null;
  }
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

              <div className="flex items-center justify-between gap-3">

                <h3 className="text-base font-bold text-white">
                  Lead Status
                </h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[lead.status]}`}
                >
                  {STATUS_LABELS[lead.status]}
                </span>

              </div>

              <div className="mt-5 space-y-2">

                <label
                  htmlFor="lead-status"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  Update Status
                </label>

                <div className="relative">

                  {statusLoading ? (
                    <div className="flex h-10 w-full items-center justify-center rounded-lg border border-zinc-700">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-lime-400" />
                    </div>
                  ) : (
                    <select
                      id="lead-status"
                      value={lead?.status}
                      onChange={async (event) => {
                        try {
                          setstatusLoading(true);

                          const newStatus =
                            event.target.value as LeadStatus;

                          const updatedLead =
                            await updateLeadStatus(
                              id,
                              newStatus
                            );

                          if (updatedLead) {
                            setLead(updatedLead);

                            toast.success(
                              "Lead status updated successfully"
                            );
                          }
                        } finally {
                          setstatusLoading(false);
                        }
                      }}
                      className="min-h-12 w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 text-sm text-zinc-200 outline-none focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/20"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  )}

                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">

                {STATUS_OPTIONS.map((status) => (
                  <span
                    key={status}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                      status === lead.status
                        ? STATUS_STYLES[status]
                        : "border-white/10 bg-white/[0.03] text-zinc-500"
                    }`}
                  >
                    {STATUS_LABELS[status]}
                  </span>
                ))}

              </div>

            </section> 
)}
