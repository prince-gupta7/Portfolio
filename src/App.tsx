import { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ParticleBackground } from './components/ParticleBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickStats } from './components/QuickStats';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Timeline } from './components/Timeline';
import { Certifications } from './components/Certifications';
import { Achievements } from './components/Achievements';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { TerminalWidget } from './components/TerminalWidget';
import { ResumeModal } from './components/ResumeModal';
import { FruitNinjaModal } from './components/FruitNinja/FruitNinjaModal';
import { ThemeCustomizerDrawer } from './components/ThemeCustomizer/ThemeCustomizerDrawer';
import { ThemeFloatingButton } from './components/ThemeCustomizer/ThemeFloatingButton';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';

function PortfolioContent() {
  const { currentTheme } = useTheme();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isFruitNinjaOpen, setIsFruitNinjaOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}`;
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div 
      className={`min-h-screen relative transition-colors duration-500 selection:bg-cyan-500/30 selection:text-cyan-300 ${
        currentTheme.mode === 'light' 
          ? 'light bg-[#f8fafc] text-slate-900' 
          : currentTheme.mode === 'oled'
            ? 'dark oled bg-[#000000] text-white'
            : 'dark bg-[#07090e] text-slate-100'
      }`}
      style={{
        backgroundColor: currentTheme.bgPrimary,
      }}
    >
      
      {/* Background Interactive Particle Canvas */}
      <ParticleBackground />

      {/* Main Sticky Navbar */}
      <Navbar
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenFruitNinja={() => setIsFruitNinjaOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero 
          onOpenTerminal={() => setIsTerminalOpen(true)}
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenFruitNinja={() => setIsFruitNinjaOpen(true)}
        />
        <QuickStats />
        <About onOpenResume={() => setIsResumeOpen(true)} />
        <Skills />
        <Projects />
        <Timeline />
        <Certifications />
        <Achievements />
        <Contact onShowToast={addToast} />
      </main>

      {/* Footer */}
      <Footer 
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenFruitNinja={() => setIsFruitNinjaOpen(true)}
      />

      {/* Interactive Terminal Widget */}
      <TerminalWidget
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenFruitNinja={() => setIsFruitNinjaOpen(true)}
      />

      {/* Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Fruit Ninja AR Motion Mini-Game Modal */}
      <FruitNinjaModal
        isOpen={isFruitNinjaOpen}
        onClose={() => setIsFruitNinjaOpen(false)}
      />

      {/* Full Live Theme Customizer Slide-over Drawer */}
      <ThemeCustomizerDrawer onShowToast={addToast} />

      {/* Floating Theme Customizer Launcher Button */}
      <ThemeFloatingButton />

      {/* Toast Notification Container */}
      <Toast 
        toasts={toasts}
        onDismiss={dismissToast}
      />

    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <PortfolioContent />
    </ThemeProvider>
  );
}

export default App;
