"use client";
import { toast } from "sonner";
import {Lead} from "@/app/types";

type LeadStatus =
  | "new"
  | "contacted"
  | "Notresponed"
  | "interested"
  | "trial-booked"
  | "joined";

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
const getInitials = (name: string) =>
     name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

interface LeadHeaderProps {
  setLead: React.Dispatch<React.SetStateAction<Lead | null>>
  
  lead: Lead | null;
  statusLoading: boolean;
  setstatusLoading: React.Dispatch<React.SetStateAction<boolean>>
  copied: boolean;
  id: string;
  handleCopyEmail: () => void;
  updateLeadStatus: (
    id: string,
    status: LeadStatus
  ) => Promise<Lead | undefined>;
}

export default function LeadHeader({
  setLead,
  lead,
  statusLoading,
  setstatusLoading,
  copied,
  id,
  handleCopyEmail,
  updateLeadStatus,
}: LeadHeaderProps) {
 if (!lead) return null;
  return (
     <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

            <div className="flex min-w-0 items-center gap-4">

              <div
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-lime-400/10 text-lg font-bold text-lime-400 ring-1 ring-lime-400/20"
              >
                {getInitials(lead.name)}
              </div>

              <div className="min-w-0">

                <h2 className="truncate text-xl font-bold text-white sm:text-2xl">
                  {lead.name}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
                  <span>
                    ID: #{lead._id.slice(0, 8)}
                  </span>

                  <span aria-hidden="true">·</span>

                  <span>
                    Created {formatDate(lead.createdAt)}
                  </span>
                </div>

              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              <div className="relative w-32">

                {statusLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-lime-400" />
                  </div>
                ) : (
                  <select
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
                    aria-label="Change lead status"
                    className="min-h-11 rounded-xl border border-white/10 bg-[#111111] px-3 text-sm font-semibold text-zinc-200 outline-none transition focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/20"
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

              <div className="flex flex-wrap gap-2">

                <a
                  href={`tel:${lead.phone}`}
                  aria-label="Call lead"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-300"
                >
                  ☎ Call
                </a>

                <a
                  href={`mailto:${lead.email}`}
                  aria-label="Email lead"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-300"
                >
                  ✉ Email
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-300"
                >
                  {copied ? "Copied" : "Copy"}
                </button>

              </div>
            </div>
          </div>
        </section>

  );
}