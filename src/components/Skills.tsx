import React, { useState, useMemo } from 'react';
import { 
  Cloud, 
  Server, 
  Terminal, 
  FileCode, 
  Code2, 
  Code, 
  Coffee, 
  Database, 
  Layout, 
  Palette, 
  Atom, 
  Sparkles, 
  Boxes, 
  Binary, 
  DatabaseZap, 
  Cpu, 
  HardDrive, 
  Network, 
  GitBranch, 
  Laptop, 
  Send, 
  UsersRound, 
  Workflow, 
  Lightbulb, 
  Zap,
  Search,
  Filter,
  ShieldCheck,
  Clock,
  FileTerminal
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { skillsData } from '../data/portfolioData';

const categories = [
  { id: 'all', name: 'All Skills' },
  { id: 'programming', name: 'Languages (Python, C)' },
  { id: 'web', name: 'Web (HTML, CSS)' },
  { id: 'core-cs', name: 'DBMS & SQL' },
  { id: 'cloud', name: 'Cybersecurity' },
  { id: 'tools', name: 'Tools (Git, GitHub)' },
  { id: 'soft-skills', name: 'Soft Skills' }
];

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getSkillIcon = (iconName: string) => {
    const iconClass = "w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors";
    switch (iconName) {
      case 'Cloud': return <Cloud className={iconClass} />;
      case 'Server': return <Server className={iconClass} />;
      case 'Terminal': return <Terminal className={iconClass} />;
      case 'FileCode': return <FileCode className={iconClass} />;
      case 'Code2': return <Code2 className={iconClass} />;
      case 'Code': return <Code className={iconClass} />;
      case 'Coffee': return <Coffee className={iconClass} />;
      case 'Database': return <Database className={iconClass} />;
      case 'Layout': return <Layout className={iconClass} />;
      case 'Palette': return <Palette className={iconClass} />;
      case 'Atom': return <Atom className={iconClass} />;
      case 'Sparkles': return <Sparkles className={iconClass} />;
      case 'Boxes': return <Boxes className={iconClass} />;
      case 'Binary': return <Binary className={iconClass} />;
      case 'DatabaseZap': return <DatabaseZap className={iconClass} />;
      case 'Cpu': return <Cpu className={iconClass} />;
      case 'HardDrive': return <HardDrive className={iconClass} />;
      case 'Network': return <Network className={iconClass} />;
      case 'GitBranch': return <GitBranch className={iconClass} />;
      case 'Github': return <GithubIcon className={iconClass} />;
      case 'Laptop': return <Laptop className={iconClass} />;
      case 'Send': return <Send className={iconClass} />;
      case 'UsersRound': return <UsersRound className={iconClass} />;
      case 'Workflow': return <Workflow className={iconClass} />;
      case 'Lightbulb': return <Lightbulb className={iconClass} />;
      case 'Zap': return <Zap className={iconClass} />;
      case 'ShieldCheck': return <ShieldCheck className={iconClass} />;
      case 'Clock': return <Clock className={iconClass} />;
      case 'FileTerminal': return <FileTerminal className={iconClass} />;
      default: return <Sparkles className={iconClass} />;
    }
  };

  const getLevelBadgeColor = (level?: string) => {
    switch (level) {
      case 'Advanced':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Proficient':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Intermediate':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Familiar':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  const filteredSkills = useMemo(() => {
    return skillsData.filter((skill) => {
      const matchesCategory = activeCategory === 'all' || skill.category === activeCategory;
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (skill.description && skill.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="skills" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical Proficiencies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Skills & <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Proficiencies</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl">
            A focused breakdown of Python & C programming, HTML, CSS, Database Management Systems (DBMS), Cybersecurity basics, Git, GitHub, and soft skills.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredSkills.map((skill, index) => (
            <div
              key={index}
              className="group relative p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/95 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:border-cyan-500/30 group-hover:scale-105 transition-all">
                    {getSkillIcon(skill.icon)}
                  </div>
                  {skill.level && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${getLevelBadgeColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {skill.name}
                </h3>

                {skill.description && (
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                    {skill.description}
                  </p>
                )}
              </div>

              {skill.highlight && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] font-mono text-cyan-400/90">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Key Core Skill</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-16 p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <Filter className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No skills matching "{searchQuery}".</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="mt-3 text-xs text-cyan-400 hover:underline font-mono cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
