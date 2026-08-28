import React from 'react';
import { 
  Trophy, 
  Code2, 
  Users, 
  Star 
} from 'lucide-react';
import { achievementsData } from '../data/portfolioData';

export const Achievements: React.FC = () => {
  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className="w-6 h-6 text-amber-400" />;
      case 'Code2':
        return <Code2 className="w-6 h-6 text-cyan-400" />;
      case 'Users':
        return <Users className="w-6 h-6 text-purple-400" />;
      default:
        return <Star className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <section id="achievements" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Honors & Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Key <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Achievements</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl">
            Recognition earned through competitive hackathons, continuous problem solving, and technical leadership.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {achievementsData.map((item) => (
            <div
              key={item.id}
              className="group relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 hover:bg-slate-900/95 border border-slate-800/90 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between"
            >
              <div>
                {/* Header with Icon and Metric Badge */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/60 group-hover:scale-110 transition-transform">
                    {getAchievementIcon(item.badgeIcon)}
                  </div>

                  {item.metric && (
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-cyan-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                      {item.metric}
                    </span>
                  )}
                </div>

                {/* Category & Title */}
                <span className="text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider">
                  {item.category} • {item.issuer}
                </span>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mt-1">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Tags Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
                {item.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
