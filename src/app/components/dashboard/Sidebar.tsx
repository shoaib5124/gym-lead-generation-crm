"use client";

import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Settings,
  Dumbbell,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Leads",
    icon: Users,
  },
  {
    name: "Follow-ups",
    icon: CalendarClock,
  },
  {
    name: "Settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 min-h-screen shrink-0 bg-[#0A0A0A] border-r border-white/10 p-6 flex-col">
      
      {/* Logo */}
      <div className="flex items-center gap-3 pb-10">
        <div className="w-10 h-10 bg-lime-400 text-black flex items-center justify-center shrink-0">
          <Dumbbell className="w-5 h-5" />
        </div>

        <div>
          <h1 className="font-black text-white uppercase tracking-tight">
            IronForge
          </h1>

          <p className="text-[9px] text-zinc-500 uppercase tracking-widest">
            Lead System
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}