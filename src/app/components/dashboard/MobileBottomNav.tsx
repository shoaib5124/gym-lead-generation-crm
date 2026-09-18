"use client";

import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Settings,
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

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/10 bg-[#0A0A0A]/95 backdrop-blur-md">
      
      <div className="grid grid-cols-4 h-16">
        
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === 0;

          return (
            <button
              key={item.name}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? "text-lime-400"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />

              <span className="text-[9px] font-bold uppercase tracking-wide">
                {item.name}
              </span>

              {/* Active indicator */}
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-8 bg-lime-400" />
              )}
            </button>
          );
        })}
        
      </div>
    </nav>
  );
}