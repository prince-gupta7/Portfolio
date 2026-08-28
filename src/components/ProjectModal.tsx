import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  Sparkles, 
  Cpu, 
  Lightbulb
} from 'lucide-react';
import { GithubIcon } from './Icons';
import type { ProjectItem } from '../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'overview' | 'features' | 'architecture' | 'challenges';

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div 
        className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar with Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-2 text-xs font-mono text-cyan-400">case-study.md</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 custom-scrollbar">
          
          {/* Top Hero Banner & Meta */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Case Study</span>
            </div>

            <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-extrabold text-white">
              {project.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-300">
              {project.tagline}
            </p>

            {/* Quick Action Links Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Project Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Technologies & Tools Applied</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950/30 border border-cyan-500/25 text-cyan-300 text-xs font-mono font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-slate-800 flex gap-2 sm:gap-4 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview & Solution
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'features'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Key Features
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Architecture & Workflow
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'challenges'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Challenges & Future Scope
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-6 pt-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono mb-2">
                    Project Overview
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {project.overview}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-500/20">
                    <h5 className="text-xs font-bold text-rose-400 font-mono uppercase mb-1.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>The Problem</span>
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {project.problem}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20">
                    <h5 className="text-xs font-bold text-cyan-400 font-mono uppercase mb-1.5 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>The Solution</span>
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono mb-3">
                  Core Implemented Features
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {project.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="space-y-4">
                {project.architectureNotes && (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30">
                    <h5 className="text-xs font-bold text-cyan-400 font-mono uppercase mb-1.5">
                      Architecture & Data Flow
                    </h5>
                    <p className="text-xs sm:text-sm font-mono text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                      {project.architectureNotes}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono mb-3">
                    Development Process & Engineering Milestones
                  </h4>
                  <div className="space-y-2.5">
                    {project.developmentProcess.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Technical Challenges Overcome</span>
                  </h4>
                  <div className="space-y-2">
                    {project.challenges.map((challenge, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-950/50 border border-amber-500/20 text-xs sm:text-sm text-slate-300">
                        • {challenge}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    <span>Future Roadmap & Improvements</span>
                  </h4>
                  <div className="space-y-2">
                    {project.futureImprovements.map((improvement, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-950/50 border border-purple-500/20 text-xs sm:text-sm text-slate-300">
                        • {improvement}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Prince Gupta Portfolio • Case Study
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
