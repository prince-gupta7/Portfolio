import React, { useEffect } from 'react';
import { 
  X, 
  Printer, 
  Mail, 
  Phone, 
  GraduationCap, 
  Award, 
  FolderGit2, 
  Sparkles,
  Code,
  CheckCircle2
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { personalInfo } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme } = useTheme();

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

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-resume-title"
    >
      <div 
        className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col transition-all duration-300"
        style={{
          borderColor: `rgba(${currentTheme.primaryRgb}, 0.35)`,
          boxShadow: `0 0 40px rgba(${currentTheme.primaryRgb}, 0.2)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 no-print">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-2 text-xs font-mono text-cyan-400">Prince_Kumar_CV.pdf</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              }}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close resume preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Paper Body */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-7 bg-slate-950 text-slate-100 flex-1 custom-scrollbar">
          
          {/* Header Section */}
          <div className="border-b border-slate-800 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 id="modal-resume-title" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
                  {personalInfo.name}
                </h1>
                <p 
                  className="text-sm font-semibold font-mono mt-1"
                  style={{ color: currentTheme.primary }}
                >
                  Full-Stack Web Developer & B.Tech CSE Undergrad
                </p>
              </div>

              {/* Contact Info (Matching CV exactly) */}
              <div className="flex flex-col sm:items-end gap-1.5 text-xs text-slate-300 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">LinkedIn:</span>
                  <a 
                    href="https://www.linkedin.com/in/prince-gupta-b115582b8/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline flex items-center gap-1"
                    style={{ color: currentTheme.primary }}
                  >
                    <LinkedinIcon className="w-3 h-3" />
                    <span>linkedin.com/in/prince-gupta-b115582b8</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Email:</span>
                  <a 
                    href="mailto:princegupta67427@gmail.com" 
                    className="hover:underline flex items-center gap-1"
                    style={{ color: currentTheme.primary }}
                  >
                    <Mail className="w-3 h-3" />
                    <span>princegupta67427@gmail.com</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">GitHub:</span>
                  <a 
                    href="https://github.com/prince-gupta7" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline flex items-center gap-1"
                    style={{ color: currentTheme.primary }}
                  >
                    <GithubIcon className="w-3 h-3" />
                    <span>github.com/prince-gupta7</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Mobile:</span>
                  <a href="tel:+917739647003" className="hover:underline flex items-center gap-1 text-slate-200">
                    <Phone className="w-3 h-3" />
                    <span>+91-7739647003</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section: SKILLS (Directly from CV) */}
          <div>
            <h2 
              className="text-xs font-mono uppercase tracking-wider font-bold mb-3 pb-1 border-b flex items-center gap-2"
              style={{
                color: currentTheme.primary,
                borderColor: `rgba(${currentTheme.primaryRgb}, 0.25)`,
              }}
            >
              <Code className="w-4 h-4" />
              <span>SKILLS</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2.5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-4 items-baseline">
                <span className="md:col-span-3 font-bold text-white font-mono">• Languages:</span>
                <span className="md:col-span-9 text-slate-300">Python, C</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-4 items-baseline">
                <span className="md:col-span-3 font-bold text-white font-mono">• Web Technologies:</span>
                <span className="md:col-span-9 text-slate-300">HTML, CSS</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-4 items-baseline">
                <span className="md:col-span-3 font-bold text-white font-mono">• Databases & DBMS:</span>
                <span className="md:col-span-9 text-slate-300">DBMS, MySQL</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-4 items-baseline">
                <span className="md:col-span-3 font-bold text-white font-mono">• Security & Tools:</span>
                <span className="md:col-span-9 text-slate-300">Cybersecurity (Basics), Git, GitHub</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-4 items-baseline">
                <span className="md:col-span-3 font-bold text-white font-mono">• Soft Skills:</span>
                <span className="md:col-span-9 text-slate-300">Problem solving, Team collaboration, Time management, Adaptability</span>
              </div>
            </div>
          </div>

          {/* Section: PROJECTS (Directly from CV) */}
          <div>
            <h2 
              className="text-xs font-mono uppercase tracking-wider font-bold mb-3 pb-1 border-b flex items-center gap-2"
              style={{
                color: currentTheme.primary,
                borderColor: `rgba(${currentTheme.primaryRgb}, 0.25)`,
              }}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>PROJECTS</span>
            </h2>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-800/60 pb-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Aura Plan — Personal Productivity & Study Management Web App
                </h3>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  July 2026 - Aug 2026
                </span>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc list-outside pl-4">
                <li>
                  Developed an all-in-one productivity web application integrating task management, Pomodoro focus sessions, journaling, study music, and productivity tracking into a unified platform.
                </li>
                <li>
                  Designed an interactive dashboard that enables users to organize daily tasks, track focused study time, maintain journals, and visualize productivity trends.
                </li>
                <li>
                  Implemented a responsive and customizable UI with theme switching and intuitive navigation to provide a distraction-free study experience.
                </li>
                <li className="font-mono text-xs" style={{ color: currentTheme.primary }}>
                  <strong>Tech Stack:</strong> HTML, CSS, JavaScript, DBMS, Git, GitHub
                </li>
                <li>
                  Applied modular frontend architecture and reusable components to maintain a <strong>scalable and maintainable codebase</strong>.
                </li>
                <li>
                  Designed the platform around a student-focused workflow, reducing the need to switch between separate applications for <strong>planning, focused study, reflection, and progress tracking</strong>.
                </li>
              </ul>
            </div>
          </div>

          {/* Section: CERTIFICATES & TRAINING (Directly from CV) */}
          <div>
            <h2 
              className="text-xs font-mono uppercase tracking-wider font-bold mb-3 pb-1 border-b flex items-center gap-2"
              style={{
                color: currentTheme.primary,
                borderColor: `rgba(${currentTheme.primaryRgb}, 0.25)`,
              }}
            >
              <Award className="w-4 h-4" />
              <span>CERTIFICATES & TRAINING</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2.5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-800/50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                  <span className="text-white font-medium">Joined Cybersecurity Workshop | <strong className="text-cyan-300">Infosys</strong></span>
                </div>
                <span className="text-xs font-mono text-slate-400">Feb, 2026</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-800/50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                  <span className="text-white font-medium">Basic of Python | <strong className="text-cyan-300">Infosys</strong></span>
                </div>
                <span className="text-xs font-mono text-slate-400">Mar, 2026</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                  <span className="text-white font-medium">Getting Started with DevOps on AWS | <strong className="text-cyan-300">AWS</strong></span>
                </div>
                <span className="text-xs font-mono text-slate-400">May 2025</span>
              </div>
            </div>
          </div>

          {/* Section: ACHIEVEMENTS (Directly from CV) */}
          <div>
            <h2 
              className="text-xs font-mono uppercase tracking-wider font-bold mb-3 pb-1 border-b flex items-center gap-2"
              style={{
                color: currentTheme.primary,
                borderColor: `rgba(${currentTheme.primaryRgb}, 0.25)`,
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>ACHIEVEMENTS</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <span className="font-bold" style={{ color: currentTheme.primary }}>•</span>
                <span>Solved more than <strong>100+ programming problems</strong> on online coding platforms during regular practice and learning.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold" style={{ color: currentTheme.primary }}>•</span>
                <span>Academic Distinction: <strong>89.6%</strong> in 10th Secondary Board & <strong>8.04 CGPA</strong> in B.Tech Computer Science and Engineering.</span>
              </div>
            </div>
          </div>

          {/* Section: EDUCATION (Directly from CV) */}
          <div>
            <h2 
              className="text-xs font-mono uppercase tracking-wider font-bold mb-3 pb-1 border-b flex items-center gap-2"
              style={{
                color: currentTheme.primary,
                borderColor: `rgba(${currentTheme.primaryRgb}, 0.25)`,
              }}
            >
              <GraduationCap className="w-4 h-4" />
              <span>EDUCATION</span>
            </h2>

            <div className="space-y-3">
              {/* Lovely Professional University */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-white">Lovely Professional University</h3>
                  <span className="text-xs font-mono text-slate-400">Phagwara, Punjab</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-1 text-xs">
                  <p className="text-slate-300 italic">
                    Bachelor of Technology - Computer Science and Engineering; <strong className="text-cyan-300 font-bold font-mono">CGPA: 8.04</strong>
                  </p>
                  <span className="font-mono text-slate-400">Aug 2026 - Present</span>
                </div>
              </div>

              {/* Sr Delhi Public School */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-white">Sr Delhi Public School</h3>
                  <span className="text-xs font-mono text-slate-400">Saharsa, Bihar</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-1 text-xs">
                  <p className="text-slate-300 italic">
                    Higher Secondary Education; <strong className="text-cyan-300 font-bold font-mono">Percentage: 70.4%</strong>
                  </p>
                  <span className="font-mono text-slate-400">May 2022 - Mar 2023</span>
                </div>
              </div>

              {/* SNS Sansthan khadipur */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-white">SNS Sansthan khadipur, Saharsa</h3>
                  <span className="text-xs font-mono text-slate-400">Saharsa, Bihar</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-1 text-xs">
                  <p className="text-slate-300 italic">
                    Secondary Education; <strong className="text-cyan-300 font-bold font-mono">Percentage: 89.6%</strong>
                  </p>
                  <span className="font-mono text-slate-400">Jun 2021 - Mar 2022</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between no-print">
          <span className="text-xs font-mono text-slate-400">
            {personalInfo.name} • Official Curriculum Vitae
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
};
