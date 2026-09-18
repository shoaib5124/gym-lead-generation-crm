"use client"
import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Phone,
  CircleCheck,
} from "lucide-react";

import Sidebar from "@/app/components/dashboard/Sidebar";
import MobileBottomNav from "@/app/components/dashboard/MobileBottomNav";
import StatCard from "@/app/components/dashboard/StatCard";
import RecentLeads from "@/app/components/dashboard/RecentLeads";
import Navbar from "@/app/components/dashboard/Navbar";

export default function DashboardPage() {
  interface Lead {
  _id: string;
  name: string;
  email: string;
  purpose: string;
  status: string;
  createdAt: string;
}

  const [recentLeads, setrecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
  total: 0,
  new: 0,
  contacted: 0,
  converted: 0
});

  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch("/api/freeTrial?limit=5");

        if (!response.ok) {
          throw new Error("Failed to fetch leads");
        }

        const data = await response.json();

        setrecentLeads(data.leads);
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

  return (
  <div className="min-h-screen bg-[#0A0A0A] flex">

    {/* Sidebar */}
    <Sidebar />
    {/* Mobile menu */}
    <MobileBottomNav/>

    {/* Main Area */}
    <main className="flex-1 min-w-0">

      {/* Navbar */}
      <Navbar />

      {/* Dashboard Content */}
      <div className="p-6 md:p-10">

        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-lime-400">
            IronForge CRM
          </span>

          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mt-3">
            Dashboard Overview
          </h1>

          <p className="text-zinc-400 mt-3 max-w-xl">
            Track your gym leads, manage follow-ups, and monitor
            your conversion performance.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">

          <StatCard
            title="Total Leads"
            value={stats.total}
            description="All captured leads"
            icon={Users}
          />

          <StatCard
            title="New Leads"
            value={stats.new}
            description="Waiting for contact"
            icon={UserPlus}
          />

          <StatCard
            title="Contacted"
            value={stats.contacted}
            description="Already contacted"
            icon={Phone}
          />

          <StatCard
            title="Converted"
            value={stats.converted}
            description="Joined the gym"
            icon={CircleCheck}
          />

        </div>

        {/* Recent Leads */}
        <RecentLeads
          leads={recentLeads}
          loading={loading}
        />

      </div>
    </main>

  </div>
);
}