import React from 'react';
import { Star } from 'lucide-react';
import { StatItem } from '../types';

const STATS_DATA: StatItem[] = [
  {
    value: '2K+',
    label: 'MEMBERS',
  },
  {
    value: '15',
    label: 'TRAINERS',
  },
  {
    value: '50+',
    label: 'CLASSES',
  },
  {
    value: '4.9',
    label: 'RATING',
    hasStar: true,
  },
];

export const Stats: React.FC = () => {
  return (
    <section
      id="stats"
      className="py-12 sm:py-16 px-6 md:px-12 bg-[#0A0A0A] border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS_DATA.map((stat, index) => (
          <div
            key={index}
            id={`stat-item-${index}`}
            className="border-l-2 border-lime-400 pl-4 sm:pl-6 flex flex-col justify-center"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter text-white">
                {stat.value}
              </span>
              {stat.hasStar && (
                <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-lime-400 text-lime-400 shrink-0" />
              )}
            </div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-500 font-bold mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
