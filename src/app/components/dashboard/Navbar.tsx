"use client";

import {
  Bell,
  ChevronDown,
  User,
} from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#131313]/95 backdrop-blur-md">
      
      <div className="flex h-20 items-center justify-between px-4 md:px-8">
        
        {/* Logo */}
        <div className="flex flex-col">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-lime-400">
            IronForge
          </span>

          <span className="text-sm font-black uppercase tracking-tight text-white">
            CRM
          </span>
        </div>


        {/* Right Side */}
        <div className="flex items-center gap-3 md:gap-6">

          {/* Notification */}
          <button
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:border-lime-400/40 hover:text-lime-400"
            aria-label="Notifications"
          >
            <Bell size={20} />

            {/* Notification Dot */}
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-lime-400" />
          </button>


          {/* User Profile */}
          <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-2 transition hover:border-lime-400/40">
            
            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-400 text-black">
              <User size={18} />
            </div>

            {/* User Name - Hidden on small mobile */}
            <span className="hidden text-sm font-bold text-white md:block">
              Admin
            </span>

            <ChevronDown
              size={16}
              className="hidden text-zinc-400 md:block"
            />
          </button>

        </div>

      </div>
    </nav>
  );
}