import React from 'react';
import { Dumbbell } from 'lucide-react';

interface NavbarProps {
  onTrialClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onTrialClick }) => {
  return (
    <header
      id="navbar"
      className="fixed top-0 left-0 right-0 w-full z-50 bg-[#131313]/85 backdrop-blur-xl border-b border-[#2a2a2a]/50 pt-safe transition-all"
    >
      <div className="max-w-7xl mx-auto h-20 px-6 md:px-12 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <a
          href="#"
          id="nav-logo"
          className="flex items-center gap-3 group focus:outline-none"
        >
          {/* Logo icon box with lime accent */}
          <div className="w-9 h-9 rounded-lg bg-[#1f1f1f] border border-[#444933]/60 flex items-center justify-center text-[#c3f400] group-hover:border-[#c3f400]/60 transition-colors shadow-sm">
            <Dumbbell className="w-5 h-5 -rotate-45" />
          </div>
          <span className="font-mono text-sm md:text-base font-bold tracking-[0.15em] text-white uppercase group-hover:text-[#c3f400] transition-colors">
            IRONFORGE
          </span>
        </a>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button
            id="nav-trial-btn"
            onClick={onTrialClick}
            className="bg-[#c3f400] hover:bg-[#abd600] active:scale-95 text-[#161e00] font-mono text-xs font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(195,244,0,0.3)] cursor-pointer"
          >
            TRIAL
          </button>

          {/* User Profile Avatar matching screenshot */}
          <div
            id="nav-avatar"
            className="relative w-8 h-8 rounded-full overflow-hidden border border-[#444933]/80 bg-[#1f1f1f] shrink-0"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo_FXf057Sr7e_AXYex_4tMycXNGPmpXFk7tj16v_yFMxNvEehSNfFAdSNCrgQrywOQ9NRLOWpvdL30kB9WeAiA7XF10QifUrlqm56UTz1-T6ngqys2-fQseOf01dBab9DoB4TXPYECT0OgvEZX0iOJzcJ52eTcErXzRzcAIzdgVDbtlNlsZtoW8L4G9CB3_5aaaCPkr9LjW2Pv2nLWJHRq-VHIQNopjteJDVJdsJYCvteAvtPfqOG"
              alt="Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
