import React from 'react';
import { GraduationCap, Briefcase, Award, Flame } from 'lucide-react';
import { quickStats } from '../data/portfolioData';

export const QuickStats: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-cyan-400" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 text-blue-400" />;
      case 'Award':
        return <Award className="w-6 h-6 text-purple-400" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-amber-400" />;
      default:
        return <Award className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <section className="relative z-10 -mt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {quickStats.map((stat, idx) => (
            <div
              key={idx}
              className="relative group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:border-cyan-500/30 group-hover:scale-110 transition-all duration-300">
                  {getIcon(stat.icon)}
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[130px] sm:max-w-[170px]">
                    {stat.subtext}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
