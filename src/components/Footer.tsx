import React from 'react';
import { 
  Code, 
  Mail, 
  Phone, 
  Code2, 
  ArrowUp, 
  Sparkles, 
  Terminal,
  Swords
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { personalInfo, socialLinks } from '../data/portfolioData';

interface FooterProps {
  onOpenTerminal: () => void;
  onOpenResume: () => void;
  onOpenFruitNinja?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerminal, onOpenResume, onOpenFruitNinja }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const elem = document.getElementById(targetId);
    if (elem) {
      const navOffset = 80;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 z-10 overflow-hidden">
      
      {/* Background Subtle Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Bio */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Code className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                {personalInfo.name}
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {personalInfo.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {onOpenFruitNinja && (
                <button
                  onClick={onOpenFruitNinja}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 text-xs font-bold text-amber-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Swords className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fruit Ninja AR</span>
                </button>
              )}

              <button
                onClick={onOpenTerminal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>CLI Terminal</span>
              </button>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Resume View</span>
              </button>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-4">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-slate-400 hover:text-cyan-400 transition-colors py-1 cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Social Channels */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-4">
              Connect Directly
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-all hover:-translate-y-0.5"
                >
                  {social.name === 'Github' && <GithubIcon className="w-4 h-4" />}
                  {social.name === 'LinkedIn' && <LinkedinIcon className="w-4 h-4" />}
                  {social.name === 'Email' && <Mail className="w-4 h-4" />}
                  {social.name === 'Phone' && <Phone className="w-4 h-4" />}
                  {social.name === 'HackerRank' && <Code2 className="w-4 h-4" />}
                </a>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4 font-mono">
              Saharsa, Bihar • Lovely Professional University
            </p>
          </div>

        </div>

        {/* Bottom Copyright & Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} {personalInfo.name}. Designed & Built with passion.</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all cursor-pointer group"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
};
