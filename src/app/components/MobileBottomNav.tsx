
import React from 'react';
import { Activity, Dumbbell, CreditCard, Info } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'programs',
      label: 'PROGRAMS',
      icon: <Activity className="w-5 h-5 stroke-[2.5]" />,
    },
    {
      id: 'trainers',
      label: 'TRAINERS',
      icon: <Dumbbell className="w-5 h-5 stroke-[2.5]" />,
    },
    {
      id: 'pricing',
      label: 'PRICING',
      icon: <CreditCard className="w-5 h-5 stroke-[2.5]" />,
    },
    {
      id: 'about',
      label: 'ABOUT',
      icon: <Info className="w-5 h-5 stroke-[2.5]" />,
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 right-0 w-full z-50 bg-[#000]/95 backdrop-blur-xl border-t border-white/10 pb-safe md:hidden shadow-[0_-10px_25px_rgba(0,0,0,0.8)]"
    >
      <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center w-16 py-1 transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'text-lime-400 opacity-100'
                  : 'text-zinc-500 hover:text-white opacity-60 hover:opacity-100'
              }`}
            >
              <div className="relative flex flex-col items-center">
                {item.icon}
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-lime-400 mt-1" />
                )}
              </div>
              <span className="text-[9px] uppercase font-black tracking-widest mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
