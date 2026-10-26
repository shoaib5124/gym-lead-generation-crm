import React from 'react'
import {Lead} from "@/app/types"




const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

interface ContactInformationProp{
    copied: boolean;
    lead: Lead | null;
    handleCopyEmail: () => void;
}
export const ContactInformation = (
    {
     copied,   
     lead,
     handleCopyEmail   
    }:ContactInformationProp
) => {
      if (!lead) return null;
  return (

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

              <div className="flex items-center justify-between gap-3">

                <h3 className="text-base font-bold text-white">
                  Contact Information
                </h3>

                <span className="text-xs text-zinc-600">
                  Profile
                </span>

              </div>

              <div className="mt-5 space-y-4">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Full Name
                  </p>

                  <p className="mt-1 text-sm text-zinc-200">
                    {lead.name}
                  </p>
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Email
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">

                    <p className="break-all text-sm text-zinc-200">
                      {lead.email}
                    </p>

                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="text-xs font-semibold cursor-pointer text-lime-400 hover:text-lime-300"
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>

                  </div>
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Phone
                  </p>

                  <a
                    href={`tel:${lead.phone}`}
                    className="mt-1 inline-block text-sm text-zinc-200 hover:text-lime-300"
                  >
                    {lead.phone}
                  </a>

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Created
                    </p>

                    <p className="mt-1 text-sm text-zinc-200">
                      {formatDate(lead.createdAt)}
                    </p>

                  </div>

                </div>

              </div>

            </section>
  );
}


