"use client";
import { useEffect, useState } from "react";
import LeadsHeader from "@/app/components/leads/Header";        
import LeadsToolBar from "@/app/components/leads/LeadsToolBar";        
import LeadsTable from "@/app/components/leads/LeadsTable";        

interface Lead {
  _id: string;
  name: string;
  email: string;
  purpose: string;
  status: string;
  createdAt: string;
}


export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLeads() {
    try {
      setLoading(true);

      const response = await fetch("/api/freeTrial");

      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data = await response.json();

      setLeads(data.leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-8 md:px-10">
      <LeadsHeader
        totalLeads={leads.length}
        onRefresh={fetchLeads}
      />
      <LeadsToolBar/>
      <LeadsTable leads={leads}/>

      {/* Your other components will come here */}
    </main>
  );
}