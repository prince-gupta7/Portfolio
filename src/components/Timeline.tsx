import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { experienceData } from '../data/portfolioData';

export const Timeline: React.FC = () => {
  return (
    <section id="experience" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Experience & <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Education</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl">
            Academic milestones at Lovely Professional University, Sr Delhi Public School, and SNS Sansthan alongside software development journey.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Vertical Connecting Glow Line */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-600 -translate-x-1/2 hidden sm:block opacity-40" />

          <div className="space-y-12">
            {experienceData.map((item, index) => {
              const isEven = index % 2 === 0;
              const isEducation = item.type === 'education';

              return (
                <div 
                  key={item.id}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } gap-6 md:gap-12`}
                >
                  {/* Timeline Center Node Badge */}
                  <div className="hidden sm:flex absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-950 border-2 border-cyan-400 items-center justify-center shadow-lg shadow-cyan-500/30 z-20">
                    {isEducation ? (
                      <GraduationCap className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <Briefcase className="w-5 h-5 text-blue-400" />
                    )}
                  </div>

                  {/* Empty Spacer Column for Desktop */}
                  <div className="hidden md:block w-1/2" />

                  {/* Main Card Content Column */}
                  <div className="w-full md:w-1/2">
                    <div className="group relative p-6 sm:p-7 rounded-2xl bg-slate-900/60 hover:bg-slate-900/95 border border-slate-800/90 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10">
                      
                      {/* Card Top Metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
                          {item.badge}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{item.period}</span>
                        </div>
                      </div>

                      {/* Institution & Role Heading */}
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.role}
                      </h3>
                      <h4 className="text-sm font-semibold text-cyan-400/90 flex items-center gap-1.5 mt-0.5">
                        <span>{item.institution}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-xs text-slate-400 font-normal flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.location}
                        </span>
                      </h4>

                      {/* Description */}
                      <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Responsibilities List */}
                      <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-3">
                        {item.responsibilities.map((resp, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </div>
                        ))}
                      </div>

                      {/* Applied Technologies */}
                      {item.technologies && (
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                          {item.technologies.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700 text-[11px] font-mono text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Highlights Badge */}
                      {item.highlights && item.highlights.length > 0 && (
                        <div className="mt-3 p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center gap-2 text-xs text-purple-300">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>{item.highlights[0]}</span>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
