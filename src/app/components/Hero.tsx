import React from 'react';

interface HeroProps {
  onTrialClick: () => void;
  onProgramsClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onTrialClick, onProgramsClick }) => {
  return (
    <section 
      id="hero"
      className="relative w-full h-[100vh] min-h-[620px] md:min-h-[720px] flex flex-col justify-end pb-16 px-6 md:px-12 overflow-hidden border-b border-white/10"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo_FXf057Sr7e_AXYex_4tMycXNGPmpXFk7tj16v_yFMxNvEehSNfFAdSNCrgQrywOQ9NRLOWpvdL30kB9WeAiA7XF10QifUrlqm56UTz1-T6ngqys2-fQseOf01dBab9DoB4TXPYECT0OgvEZX0iOJzcJ52eTcErXzRzcAIzdgVDbtlNlsZtoW8L4G9CB3_5aaaCPkr9LjW2Pv2nLWJHRq-VHIQNopjteJDVJdsJYCvteAvtPfqOG"
          alt="Athlete in modern gym"
          className="w-full h-full object-cover  object-[center_20%] brightness-[1.25] contrast-[1.1]"
          referrerPolicy="no-referrer"
        />
        {/* Deep dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-[#050505]/30" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_30%,_rgba(163,230,53,0.15)_0%,_transparent_50%)]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
        <h1
          id="hero-heading"
          className="text-[48px] sm:text-[68px] md:text-[84px] leading-[0.9] font-black uppercase tracking-tighter text-white"
        >
          Build Your <br />
          <span className="text-lime-400 inline-block">
            Strongest
          </span>{' '}
          <br />
          Self.
        </h1>

        <p
          id="hero-description"
          className="text-zinc-400 max-w-lg text-base sm:text-lg leading-relaxed font-normal"
        >
          Elite training, expert coaches and a community built to help you become
          stronger every day.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2 max-w-md sm:max-w-none">
          <button
            id="hero-start-trial-btn"
            onClick={onTrialClick}
            className="bg-white text-black px-8 py-4 font-black uppercase text-xs sm:text-sm tracking-widest hover:bg-lime-400 active:scale-98 transition-colors text-center cursor-pointer w-full sm:w-auto"
          >
            Start Free Trial
          </button>
          <button
            id="hero-view-programs-btn"
            onClick={onProgramsClick}
            className="border border-white/20 text-white px-8 py-4 font-black uppercase text-xs sm:text-sm tracking-widest hover:bg-white/10 active:scale-98 transition-colors text-center cursor-pointer w-full sm:w-auto"
          >
            View Programs
          </button>
        </div>
      </div>
    </section>
  );
};
