"use client";
import Link from "next/link";
import { use,useEffect, useState } from "react";

interface Lead {
  _id: string;
  name: string;
  email: string;
  purpose: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadDetailsPageProps {
  
    params: Promise<{id: string}>;
  
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

export default function LeadDetailsPage({
  params,
}: LeadDetailsPageProps) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {id} = use(params);
  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/freeTrial/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch lead");
        }

        const data = await response.json();

        setLead(data.lead);
      } catch (error) {
        console.error(error);
        setError("Unable to load this lead.");
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-40 animate-pulse rounded bg-zinc-800" />
          <div className="mt-6 h-64 animate-pulse rounded-xl bg-zinc-900" />
        </div>
      </div>
    );
  }

  // Error
  if (error || !lead) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/dashboard/Leads"
            className="text-sm text-zinc-500 hover:text-lime-400"
          >
            ← Back to Leads
          </Link>

          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 p-8 text-center">
            <h2 className="text-lg font-bold text-white">
              Lead not found
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              This lead may have been deleted or the ID is invalid.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <Link
          href="/dashboard/Leads"
          className="text-sm text-zinc-500 transition-colors hover:text-lime-400"
        >
          ← Back to All Leads
        </Link>

        {/* Header */}
        <div className="mt-5 mb-6">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Lead Details
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            View and manage this gym prospect
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">

          {/* Lead Header */}
          <div className="border-b border-white/10 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                {/* Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lime-400/10 text-lg font-bold text-lime-400">
                  {lead.name.charAt(0).toUpperCase()}
                </div>

                {/* Name */}
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold text-white">
                    {lead.name}
                  </h2>

                  <p className="truncate text-sm text-zinc-500">
                    {lead.email}
                  </p>
                </div>

              </div>

              {/* Status */}
              <span
                className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                  lead.status
                )}`}
              >
                {formatStatus(lead.status)}
              </span>

            </div>
          </div>

          {/* Lead Information */}
          <div className="p-5 sm:p-6">

            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-zinc-400">
              Lead Information
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Email */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Email
                </p>

                <p className="mt-1 break-all text-sm text-zinc-300">
                  {lead.email}
                </p>
              </div>

              {/* Purpose */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Purpose
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  {lead.purpose}
                </p>
              </div>

              {/* Created */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Created
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  {new Date(lead.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>

              {/* Updated */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Last Updated
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  {new Date(lead.updatedAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>

            </div>

          </div>

          {/* Status Management */}
          <div className="border-t border-white/10 p-5 sm:p-6">

            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-zinc-400">
              Manage Status
            </h3>

            <select
              defaultValue={lead.status}
              className="w-full rounded-lg border border-zinc-800 bg-[#0A0A0A] px-3 py-2.5 text-sm text-zinc-300 outline-none transition-colors focus:border-lime-400/50 sm:w-64"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="interested">Interested</option>
              <option value="trial-booked">
                Trial Booked
              </option>
              <option value="joined">Joined</option>
            </select>

          </div>

          {/* Contact */}
          <div className="border-t border-white/10 p-5 sm:p-6">

            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-zinc-400">
              Contact
            </h3>

            <a
              href={`mailto:${lead.email}`}
              className="inline-flex items-center justify-center rounded-lg bg-lime-400 px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-lime-300"
            >
              Email Lead
            </a>

          </div>

        </div>
      </div>
    </div>
  );
}