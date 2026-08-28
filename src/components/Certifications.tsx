import React, { useState } from 'react';
import { 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  Cloud, 
  FileCode, 
  ShieldCheck, 
  Coffee, 
  Code2, 
  Layers
} from 'lucide-react';
import { certificationsData } from '../data/portfolioData';

export const Certifications: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const getCertIcon = (iconName: string) => {
    const iconClass = "w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors";
    switch (iconName) {
      case 'Cloud': return <Cloud className={iconClass} />;
      case 'FileCode': return <FileCode className={iconClass} />;
      case 'ShieldCheck': return <ShieldCheck className={iconClass} />;
      case 'Coffee': return <Coffee className={iconClass} />;
      case 'Code2': return <Code2 className={iconClass} />;
      case 'Layers': return <Layers className={iconClass} />;
      default: return <Award className={iconClass} />;
    }
  };

  const filteredCerts = filterCategory === 'all'
    ? certificationsData
    : certificationsData.filter(c => c.category === filterCategory);

  return (
    <section id="certifications" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Certifications & <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Accreditations</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl">
            Industry-recognized credentials across Cloud Computing, Cybersecurity, Python, and Full-Stack Engineering.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Certifications' },
            { id: 'cloud', label: 'Cloud & Infrastructure' },
            { id: 'programming', label: 'Programming & Python' },
            { id: 'security', label: 'Cybersecurity' },
            { id: 'web', label: 'Full Stack' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              className="group relative p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-900/95 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700/60 group-hover:border-cyan-500/30 group-hover:scale-105 transition-all">
                    {getCertIcon(cert.icon)}
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-slate-300">
                    {cert.issueDate}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {cert.name}
                </h3>

                <div className="flex items-center gap-2 mt-1.5 text-xs text-cyan-400/90 font-medium">
                  <span>{cert.issuer}</span>
                  {cert.credentialId && (
                    <>
                      <span className="text-slate-600">•</span>
                      <span className="font-mono text-slate-400 text-[11px]">{cert.credentialId}</span>
                    </>
                  )}
                </div>

                {/* Skills Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cert.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-slate-800/70 text-slate-300 text-[11px] font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Certificate Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 hover:border-cyan-500/40 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold transition-all duration-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
