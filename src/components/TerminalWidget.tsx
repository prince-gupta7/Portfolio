import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Terminal as TerminalIcon, 
  CornerDownLeft, 
  Maximize2, 
  Minimize2, 
  Trash2,
  Palette
} from 'lucide-react';
import { personalInfo, projectsData, experienceData, certificationsData, terminalHelpCommands } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';
import { themePresets } from '../data/themes';

interface TerminalWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeToggle?: () => void;
  onOpenResume: () => void;
  onOpenFruitNinja?: () => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export const TerminalWidget: React.FC<TerminalWidgetProps> = ({
  isOpen,
  onClose,
  onOpenResume,
  onOpenFruitNinja,
}) => {
  const { 
    currentTheme, 
    setPreset, 
    setMode, 
    toggleMode, 
    randomizeTheme, 
    resetToDefault, 
    openCustomizer 
  } = useTheme();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'system.init()',
      timestamp: new Date().toLocaleTimeString(),
      output: (
        <div className="space-y-1 text-slate-300">
          <p className="text-cyan-400 font-bold">Welcome to Prince Gupta's Interactive Developer Terminal (v2.5.0)</p>
          <p className="text-slate-400 text-xs">
            Type <span className="text-cyan-300 font-mono bg-cyan-950/60 px-1 py-0.5 rounded">help</span> or <span className="text-cyan-300 font-mono bg-cyan-950/60 px-1 py-0.5 rounded">theme</span> to explore portfolio features, custom color palettes, and AR mini-games.
          </p>
        </div>
      )
    }
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Add to history
    setHistory((prev) => [...prev, rawCmd.trim()]);
    setHistoryIndex(-1);

    const timestamp = new Date().toLocaleTimeString();
    let outputNode: React.ReactNode = null;

    if (cmd === 'help') {
      outputNode = (
        <div className="space-y-1.5 text-xs font-mono">
          <p className="text-cyan-400 font-bold mb-2">Available Shell Commands:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {terminalHelpCommands.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-cyan-300 font-bold">{c.cmd}</span>
                <span className="text-slate-400">→ {c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (cmd === 'whoami') {
      outputNode = (
        <div className="space-y-1.5 text-xs text-slate-200">
          <p><span className="text-cyan-400 font-bold">Name:</span> {personalInfo.name}</p>
          <p><span className="text-cyan-400 font-bold">Role:</span> Python & C Programmer • Web (HTML/CSS) • B.Tech CSE (8.04 CGPA)</p>
          <p><span className="text-cyan-400 font-bold">Education:</span> {personalInfo.university}</p>
          <p><span className="text-cyan-400 font-bold">Location:</span> {personalInfo.location}</p>
          <p><span className="text-cyan-400 font-bold">Status:</span> {personalInfo.status}</p>
        </div>
      );
    } else if (cmd === 'about') {
      outputNode = (
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          {personalInfo.aboutDetailed.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      );
    } else if (cmd === 'skills') {
      outputNode = (
        <div className="space-y-3 text-xs">
          <div>
            <p className="text-cyan-400 font-bold uppercase mb-1">💻 Programming Languages:</p>
            <p className="text-slate-300">Python, C</p>
          </div>
          <div>
            <p className="text-blue-400 font-bold uppercase mb-1">🌐 Web Development:</p>
            <p className="text-slate-300">HTML, CSS</p>
          </div>
          <div>
            <p className="text-purple-400 font-bold uppercase mb-1">🗄️ Database & Core CS:</p>
            <p className="text-slate-300">DBMS (Database Management Systems), MySQL</p>
          </div>
          <div>
            <p className="text-emerald-400 font-bold uppercase mb-1">🛡️ Cybersecurity & Tools:</p>
            <p className="text-slate-300">Cybersecurity (Basics), Git, GitHub</p>
          </div>
          <div>
            <p className="text-amber-400 font-bold uppercase mb-1">🤝 Soft Skills:</p>
            <p className="text-slate-300">Problem solving, Team collaboration, Time management, Adaptability</p>
          </div>
        </div>
      );
    } else if (cmd === 'projects') {
      outputNode = (
        <div className="space-y-3 text-xs">
          {projectsData.map((p, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <p className="font-bold text-cyan-300">{p.title}</p>
              <p className="text-slate-400 mt-0.5">{p.tagline}</p>
              <div className="mt-1 flex gap-2 font-mono text-[11px]">
                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">GitHub</a>
                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Live Demo</a>}
              </div>
            </div>
          ))}
        </div>
      );
    } else if (cmd === 'experience') {
      outputNode = (
        <div className="space-y-3 text-xs">
          {experienceData.map((exp, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex justify-between items-center text-cyan-300 font-bold">
                <span>{exp.role}</span>
                <span className="text-[10px] text-slate-400">{exp.period}</span>
              </div>
              <p className="text-slate-300 font-medium">{exp.institution}</p>
              <p className="text-slate-400 mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
      );
    } else if (cmd === 'certs') {
      outputNode = (
        <div className="space-y-2 text-xs">
          {certificationsData.map((c, i) => (
            <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <span className="font-bold text-slate-200">{c.name}</span>
                <span className="block text-[11px] text-slate-400">{c.issuer} • {c.issueDate}</span>
              </div>
              <a href={c.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline">Verify</a>
            </div>
          ))}
        </div>
      );
    } else if (cmd === 'contact') {
      outputNode = (
        <div className="space-y-1.5 text-xs text-slate-300">
          <p><span className="text-cyan-400 font-bold">Email:</span> <a href={`mailto:${personalInfo.email}`} className="text-cyan-300 hover:underline">{personalInfo.email}</a></p>
          <p><span className="text-cyan-400 font-bold">Phone:</span> {personalInfo.phone}</p>
          <p><span className="text-cyan-400 font-bold">GitHub:</span> <a href="https://github.com/prince-gupta7" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/prince-gupta7</a></p>
          <p><span className="text-cyan-400 font-bold">LinkedIn:</span> <a href="https://www.linkedin.com/in/prince-gupta-b115582b8/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">linkedin.com/in/prince-gupta-b115582b8/</a></p>
        </div>
      );
    } else if (cmd.includes('resume')) {
      onOpenResume();
      outputNode = (
        <p className="text-xs text-emerald-400 font-mono">Opening full resume modal preview...</p>
      );
    } else if (cmd === 'ninja' || cmd === 'fruitninja' || cmd === 'game') {
      outputNode = (
        <p className="text-xs text-amber-400 font-mono">
          Launching Fruit Ninja Game (Webcam Motion Hand Tracking AR mode)... ⚔️🍉
        </p>
      );
      if (onOpenFruitNinja) {
        setTimeout(() => {
          onClose();
          onOpenFruitNinja();
        }, 500);
      }
    } else if (cmd === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    } 
    // ==========================================
    // THEME COMMANDS
    // ==========================================
    else if (cmd === 'theme' || cmd === 'theme list' || cmd === 'themes') {
      outputNode = (
        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-cyan-300 font-bold">🎨 Curated Theme Palettes:</span>
            <span className="text-slate-400 text-[11px]">Current: <strong className="text-white">{currentTheme.name}</strong> ({currentTheme.mode})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {themePresets.map((p) => (
              <div 
                key={p.id} 
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-cyan-400/50"
                onClick={() => {
                  setPreset(p.id);
                  executeCommand(`theme ${p.id.split('-')[0]}`);
                }}
              >
                <div className="flex items-center gap-2">
                  <span>{p.badge}</span>
                  <div>
                    <span className="font-bold text-white">{p.name}</span>
                    <span className="text-[10px] text-slate-400 block font-sans">{p.tagline}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.primary }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.secondary }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 space-y-0.5">
            <p>💡 <span className="text-cyan-300">theme &lt;name&gt;</span> (e.g. <span className="text-white">theme emerald</span>, <span className="text-white">theme sunset</span>, <span className="text-white">theme oled</span>)</p>
            <p>💡 <span className="text-cyan-300">theme custom</span> → Open Live Theme Customizer studio</p>
            <p>💡 <span className="text-cyan-300">theme random</span> → Generate random aesthetic</p>
            <p>💡 <span className="text-cyan-300">theme reset</span> → Reset to default Cyber Neon</p>
          </div>
        </div>
      );
    } else if (cmd.startsWith('theme ')) {
      const arg = cmd.replace('theme ', '').trim();
      
      if (arg === 'custom' || arg === 'customizer' || arg === 'customize' || arg === 'palette') {
        openCustomizer();
        outputNode = (
          <p className="text-xs text-cyan-300 font-mono">
            🎨 Opening Theme Customizer Drawer with live color pickers and particle controls...
          </p>
        );
      } else if (arg === 'random' || arg === 'dice') {
        randomizeTheme();
        outputNode = (
          <p className="text-xs text-amber-300 font-mono">
            🎲 Generated a new randomized theme palette!
          </p>
        );
      } else if (arg === 'reset' || arg === 'default') {
        resetToDefault();
        outputNode = (
          <p className="text-xs text-cyan-300 font-mono">
            🔄 Restored default Cyber Neon theme.
          </p>
        );
      } else if (arg === 'light' || arg === 'day') {
        setMode('light');
        outputNode = (
          <p className="text-xs text-cyan-300 font-mono">☀️ Switched to Aurora Light mode.</p>
        );
      } else if (arg === 'dark' || arg === 'night') {
        setMode('dark');
        outputNode = (
          <p className="text-xs text-cyan-300 font-mono">🌙 Switched to Dark mode.</p>
        );
      } else if (arg === 'toggle') {
        toggleMode();
        outputNode = (
          <p className="text-xs text-cyan-300 font-mono">Toggled color scheme mode.</p>
        );
      } else if (arg === 'oled' || arg === 'black') {
        setPreset('oled-black');
        outputNode = (
          <p className="text-xs text-slate-200 font-mono">🖤 Switched to OLED Stealth Pure Black mode.</p>
        );
      } else {
        // Match preset by keyword
        const matched = themePresets.find((p) => 
          p.id.toLowerCase().includes(arg) || 
          p.name.toLowerCase().includes(arg) ||
          (arg === 'red' && p.id === 'crimson-overdrive') ||
          (arg === 'green' && p.id === 'emerald-matrix') ||
          (arg === 'purple' && p.id === 'galactic-amethyst') ||
          (arg === 'blue' && p.id === 'ocean-sapphire') ||
          (arg === 'orange' && p.id === 'sunset-blaze') ||
          (arg === 'pink' && p.id === 'sakura-blossom')
        );

        if (matched) {
          setPreset(matched.id);
          outputNode = (
            <div className="text-xs font-mono space-y-1">
              <p className="text-emerald-400 font-bold">
                ✓ Activated theme: {matched.badge} {matched.name}
              </p>
              <p className="text-slate-400 text-[11px]">{matched.description}</p>
            </div>
          );
        } else {
          outputNode = (
            <p className="text-xs text-rose-400 font-mono">
              Unknown theme preset "{arg}". Type <span className="text-cyan-300 font-bold">theme list</span> to view all presets or <span className="text-cyan-300 font-bold">theme custom</span> to design your own.
            </p>
          );
        }
      }
    } else if (cmd.startsWith('sudo')) {
      outputNode = (
        <p className="text-xs text-amber-400 font-mono font-bold">
          [sudo] password for recruiter: Nice try! You are already authorized with high-level access. Hire Prince Gupta! 🚀
        </p>
      );
    } else if (cmd === 'date') {
      outputNode = (
        <p className="text-xs text-slate-300 font-mono">{new Date().toString()}</p>
      );
    } else {
      outputNode = (
        <p className="text-xs text-rose-400 font-mono">
          Command not found: "{rawCmd}". Type <span className="text-cyan-300 font-bold">help</span>, <span className="text-cyan-300 font-bold">theme</span> or <span className="text-amber-300 font-bold">ninja</span> for available commands.
        </p>
      );
    }

    setLogs((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: rawCmd,
        output: outputNode,
        timestamp
      }
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const quickPrompts = ['help', 'theme', 'ninja', 'whoami', 'skills', 'projects', 'experience', 'certs', 'contact'];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className={`relative w-full ${
          isMaximized ? 'max-w-6xl h-[90vh]' : 'max-w-3xl h-[650px]'
        } rounded-3xl bg-slate-950 border shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}
        style={{
          borderColor: `rgba(${currentTheme.primaryRgb}, 0.35)`,
          boxShadow: `0 0 40px rgba(${currentTheme.primaryRgb}, 0.2)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 border-b border-slate-800 select-none">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 transition-opacity cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" onClick={() => setLogs([])} title="Clear logs" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" onClick={() => setIsMaximized(!isMaximized)} />
            </div>
            <div className="flex items-center gap-2 ml-2 text-xs font-mono">
              <TerminalIcon className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
              <span style={{ color: currentTheme.primary }}>prince@portfolio-cli: ~</span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">({currentTheme.name})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openCustomizer()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Open Theme Customizer"
            >
              <Palette className="w-4 h-4" style={{ color: currentTheme.primary }} />
            </button>
            <button
              onClick={() => setLogs([])}
              className="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Clear terminal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title={isMaximized ? "Restore window" : "Maximize window"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Logs View */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 font-mono text-xs custom-scrollbar">
          {logs.map((log) => (
            <div key={log.id} className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="font-bold" style={{ color: currentTheme.primary }}>&gt;</span>
                <span className="text-white font-semibold">{log.command}</span>
                <span className="text-[10px] text-slate-400 ml-auto">{log.timestamp}</span>
              </div>
              <div className="pl-4 py-1 text-slate-300 border-l-2 border-slate-800">
                {log.output}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-mono text-slate-400 shrink-0">Quick prompts:</span>
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => executeCommand(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono transition-colors shrink-0 border border-slate-700 cursor-pointer"
              style={{
                color: p === 'theme' ? currentTheme.primary : undefined,
                borderColor: p === 'theme' ? `rgba(${currentTheme.primaryRgb}, 0.4)` : undefined,
              }}
            >
              {p === 'theme' ? '🎨 theme' : p === 'ninja' ? '⚔️ ninja' : p}
            </button>
          ))}
        </div>

        {/* Command Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
          <span 
            className="font-mono font-bold text-sm select-none"
            style={{ color: currentTheme.primary }}
          >
            &gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (e.g. 'help', 'theme emerald', 'ninja', 'projects')..."
            className="flex-1 bg-transparent text-sm font-mono placeholder-slate-600 focus:outline-none"
            style={{ color: currentTheme.primary }}
          />
          <button
            onClick={() => executeCommand(inputVal)}
            className="p-2 rounded-xl border transition-colors cursor-pointer"
            style={{
              backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.15)`,
              borderColor: `rgba(${currentTheme.primaryRgb}, 0.4)`,
              color: currentTheme.primary,
            }}
            title="Execute command"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
