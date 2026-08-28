import React from 'react';
import { 
  GraduationCap, 
  Cloud, 
  Code, 
  Brain, 
  Users, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  Award
} from 'lucide-react';
import { personalInfo, aboutCards } from '../data/portfolioData';

interface AboutProps {
  onOpenResume: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenResume }) => {
  const getCardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cloud':
        return <Cloud className="w-6 h-6 text-cyan-400" />;
      case 'Code':
        return <Code className="w-6 h-6 text-purple-400" />;
      case 'Brain':
        return <Brain className="w-6 h-6 text-amber-400" />;
      case 'Users':
        return <Users className="w-6 h-6 text-emerald-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <section id="about" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover My Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            About <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Me</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl">
            Passionate computer science engineer combining full-stack MERN development, algorithmic problem solving, and modern cloud practices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-cyan-400" />
                <span>My Developer Journey</span>
              </h3>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                {personalInfo.aboutDetailed.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Highlights Pill List */}
              <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Python & C Programming</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>HTML & CSS Web Design</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>DBMS & MySQL Relational Data</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Cybersecurity (Basics) & Git / GitHub</span>
                </div>
              </div>

              {/* Education Mini Card (From CV) */}
              <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{personalInfo.university}</h4>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold">
                      8.04 CGPA
                    </span>
                  </div>
                  <p className="text-xs text-cyan-300/90 font-medium mt-0.5">{personalInfo.degree}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Secondary: <strong>89.6%</strong> (SNS Sansthan) • Higher Secondary: <strong>70.4%</strong> (Sr DPS)
                  </p>
                </div>
              </div>

              {/* View Resume Button */}
              <div className="mt-5">
                <button
                  onClick={onOpenResume}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-cyan-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>View & Print Official CV (PDF)</span>
                </button>
              </div>
            </div>

            {/* Currently Learning / Goals Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-950/20 border border-purple-500/20 backdrop-blur-xl">
              <div className="flex items-center gap-2.5 mb-3">
                <Layers className="w-5 h-5 text-purple-400" />
                <h4 className="text-base font-bold text-white">Current Goals & Exploration</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Focused on strengthening core algorithmic problem solving in Python and C, advancing responsive web layouts with HTML & CSS, and exploring relational database design and cybersecurity practices.
              </p>
            </div>
          </div>

          {/* Right Interactive Information Cards Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {aboutCards.map((card, idx) => (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-900/95 border border-slate-800/90 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-cyan-500/40 transition-all duration-300">
                    {getCardIcon(card.icon)}
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-cyan-400/80 group-hover:text-cyan-300">
                  <span>Explore detail</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
