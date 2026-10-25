import React from 'react'
import {Lead} from "@/app/types"
interface LeadPurposeProps{
    lead: Lead
}
export const LeadPurpose = (
{lead}: LeadPurposeProps
)=> {
   
  return (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

            <h3 className="text-base font-bold text-white">
            Lead Purpose / Fitness Goal
            </h3>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
            {lead.purpose}
           
            </p>

        </section>
  )
}
