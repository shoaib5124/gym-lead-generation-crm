import React from 'react';
import { Brain, Dumbbell, Target, Users } from 'lucide-react';
import { StandardFeature } from '../types';

const STANDARD_FEATURES: StandardFeature[] = [
  {
    id: 'expert-coaches',
    title: 'Expert Coaches',
    description:
      'Our trainers hold elite certifications and have years of practical experience producing real results.',
    iconName: 'psychology',
  },
  {
    id: 'modern-equipment',
    title: 'Modern Equipment',
    description:
      'Train with industry-leading brands. Calibrated plates, specialty bars, and top-tier cardio machines.',
    iconName: 'fitness_center',
  },
  {
    id: 'personalized-programs',
    title: 'Personalized Programs',
    description:
      'No cookie-cutter routines. We assess your mechanics and build a path specific to your physiology.',
    iconName: 'target',
  },
  {
    id: 'supportive-community',
    title: 'Supportive Community',
    description:
      'Surround yourself with driven individuals who push you to be better while celebrating your wins.',
    iconName: 'group',
  },
];

const renderIcon = (iconName: StandardFeature['iconName']) => {
  switch (iconName) {
    case 'psychology':
      return <Brain className="w-5 h-5 stroke-[2.5]" />;
    case 'fitness_center':
      return <Dumbbell className="w-5 h-5 stroke-[2.5]" />;
    case 'target':
      return <Target className="w-5 h-5 stroke-[2.5]" />;
    case 'group':
      return <Users className="w-5 h-5 stroke-[2.5]" />;
    default:
      return <Dumbbell className="w-5 h-5 stroke-[2.5]" />;
  }
};

export const IronForgeStandard: React.FC = () => {
  return (
    <section
      id="about"
      className="py-20 md:py-28 px-6 md:px-12 bg-[#0A0A0A] w-full border-y border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col gap-3 mb-14 md:mb-16 text-center">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-lime-400">
            WHY CHOOSE US
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            The IronForge Standard
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            We don&apos;t compromise on quality. Our facility is designed for those
            who take their training seriously.
          </p>
        </div>

        {/* 2-Column Grid of Bold Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {STANDARD_FEATURES.map((feature) => (
            <div
              key={feature.id}
              id={`standard-feature-${feature.id}`}
              className="flex gap-5 items-start bg-white/5 p-6 sm:p-8 border border-white/5 hover:border-lime-400/40 transition-colors"
            >
              {/* Lime Icon Container */}
              <div className="w-10 h-10 bg-lime-400 text-black flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                {renderIcon(feature.iconName)}
              </div>

              {/* Feature Content */}
              <div>
                <h3 className="font-black text-xl text-white mb-2 uppercase tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
