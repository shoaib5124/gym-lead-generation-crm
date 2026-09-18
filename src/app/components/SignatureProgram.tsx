import React from 'react';
import { Program } from '../types';

const PROGRAMS_DATA: Program[] = [
  {
    id: 'strength-training',
    title: 'STRENGTH TRAINING',
    description:
      'Build raw power and muscle mass with our periodized barbell and free weight programs.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPa4H_I6DgEwx9AopgGQgLpY13ZLIb4qLGnhidWsNvJRQSet-5fIgkwdoBI9yvPLYEgl-EA6teGdaaN1CHfsR61dZmOn6FQuad9XiCdiBxxhjtYly5g07v4NiOqKGFRB3tSlZcsguOvZr9omceRJuCH7d_q2mEA8Rq57k6G4AQOOGfFvEtI1bw-coLSSo_g1BiCYUw_2LG1BgyAwSXzWr6OxyIp5EXD9GLPMaqt5Wst6_wkF58-g5K',
    altText:
      'Intense strength training session in a dark, moody gym with heavy barbells.',
  },
  {
    id: 'weight-loss',
    title: 'WEIGHT LOSS',
    description:
      'High-intensity metabolic conditioning designed to torch calories and build lean muscle.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCNxu9-vD-5hljQpQGwXcdLi4iwsl91mTgaNzBFPT29S_3HHctYqyeXgRKNnLJuoj4E1o8MZr8p_BwjXvJyIE6Qj4SOTcswnQKX1OjLG_XF1j_AwkTda3o5-5ecQUnIQIoS01su2M8O1clyAGFDmqg1zp7hjH_sa-4U18sVpeoLhScyuzE6ASEYTbaS8j5HxBm7rMYEEuv4Gr5cg--NZ5Rxcfle0wWzrCo-59xKkKVpru2JvbDMmoyf',
    altText:
      'High intensity interval training class with dynamic lighting and workout equipment.',
  },
  {
    id: 'personal-training',
    title: 'PERSONAL TRAINING',
    description:
      '1-on-1 coaching tailored specifically to your body, goals, and lifestyle.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDeOjRgrse-wIzEHS6ttxQ9ZgyIdy-mDCrmBiEfqC7HUi9QsB0-7kdMHzcvZc2var-_O9EvwiVLjUOJneaeC7K2BG2DFlqajNcyWmlJNGlJwG7rdlPsi2vT1AQ-GoTNnwI9hSLwErVfHaWeuwiSonl06qEHY04PR3yTYl5tK-r-_xfroaWGHWp2o9fUU1uzfR220p0kktcZnm8yrsDuE7X3tZMjnvT--QT4h54gCFNeSjVUmv8RzgsG',
    altText: 'Personal trainer coaching client on proper form.',
  },
  {
    id: 'functional-fitness',
    title: 'FUNCTIONAL FITNESS',
    description:
      'Prepare your body for real-world demands with agility, mobility, and core strength work.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAciEUOnfkk_-hwToAd9ne3dXPUUveZ-OwNwOcDdOb__3nXh9HENKzoJhXIp8y157wW15ZVkzjzMHu1Is-mLw6eOFr_52_ZNswAjaqm3Zhyeu6-EcOxOeg06aJfkeCC0OW0mzR4OHctOkKMQqaor5ynEe5aw4MK78qsjMU5zABgMx_T15ZJvdEDhdQwpwlFqbkjgqAvLjQ-FagPW5J-ZkZdAmBnHrBCkiGQ0g9cd1bAAIw3Ahtfn0GN',
    altText:
      'Athlete doing functional movements and agility jumps in gym.',
  },
];

export const SignaturePrograms: React.FC = () => {
  return (
    <section
      id="programs"
      className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto w-full"
    >
      {/* Section Header */}
      <div className="flex flex-col gap-3 mb-10 md:mb-14">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-lime-400">
          OUR EXPERTISE
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
          Signature Programs
        </h2>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {PROGRAMS_DATA.map((program) => (
          <div
            key={program.id}
            id={`program-card-${program.id}`}
            className="group relative overflow-hidden bg-white/5 border border-white/10 hover:border-lime-400/60 aspect-[4/3] isolate transition-all duration-300 shadow-xl cursor-pointer"
          >  
            {/* Program Image with Dark Backdrop */}
            <img
              src={program.imageUrl}
              alt={program.altText}
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500 ease-out"
              referrerPolicy="no-referrer"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/70 via-transparent to-transparent" />

            {/* Content Container */}
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full z-10">
              {/* High-Contrast Bold Badge */}
              <div className="mb-3">
                <span className="px-4 py-1.5 bg-white text-black text-[10px] sm:text-xs font-black uppercase italic tracking-wider inline-block group-hover:bg-lime-400 transition-colors shadow-sm">
                  {program.title}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed line-clamp-2">
                {program.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
