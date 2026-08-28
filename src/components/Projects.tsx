import React, { useState, useMemo } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Eye, 
  Sparkles, 
  ArrowUpRight
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { projectsData } from '../data/portfolioData';
import type { ProjectItem } from '../types';
import { ProjectModal } from './ProjectModal';

const categories = [
  { id: 'all', name: 'All Projects' },
  { id: 'cloud', name: 'Cloud & AWS' },
  { id: 'web', name: 'Web Apps' },
  { id: 'python', name: 'Python & Data' }
];

export const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projectsData;
    return projectsData.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const handleOpenDetails = (project: ProjectItem) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Featured Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Projects & <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Showcase</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl">
            Real-world systems, cloud infrastructure architectures, and responsive web applications built with modern software practices.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-3xl bg-slate-900/60 hover:bg-slate-900/95 border border-slate-800/90 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col overflow-hidden"
            >
              {/* Project Image Banner */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center filter saturate-90 group-hover:scale-105 group-hover:saturate-100 transition-all duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

                {/* Featured / Category Badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-semibold uppercase backdrop-blur-md">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[11px] font-mono font-semibold backdrop-blur-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                {/* Hover Quick Overlay Action */}
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleOpenDetails(project)}
                    className="p-3 rounded-full bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 hover:scale-110 transition-all shadow-lg shadow-cyan-500/30 cursor-pointer"
                    title="View Complete Project Details"
                    aria-label={`View details for ${project.title}`}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-slate-800 text-white hover:bg-slate-700 hover:scale-110 transition-all shadow-lg border border-slate-700"
                    title="Open GitHub Repository"
                    aria-label={`GitHub repository for ${project.title}`}
                  >
                    <GithubIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Project Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                    {project.tagline}
                  </p>
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.technologies.slice(0, 4).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-800/80 text-slate-400 text-[10px] font-mono">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                </div>

                {/* Action Buttons Footer */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenDetails(project)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer py-1"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                      title="GitHub Code"
                      aria-label="GitHub Code"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 transition-colors"
                        title="Live Demo"
                        aria-label="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};
