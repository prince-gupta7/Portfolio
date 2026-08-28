import React, { useEffect } from 'react';
import { X, Swords, Sparkles } from 'lucide-react';
import { FruitNinjaGame } from './FruitNinjaGame';

interface FruitNinjaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FruitNinjaModal: React.FC<FruitNinjaModalProps> = ({ isOpen, onClose }) => {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in duration-300">
      {/* Modal Card Shell */}
      <div className="relative w-full h-full max-w-6xl max-h-[92vh] bg-slate-950 border border-cyan-500/40 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900/90 border-b border-slate-800/80 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm sm:text-base tracking-wide">
                  FRUIT NINJA
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Visual Motion AR
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Play through webcam hand tracking gestures or mouse slicing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 border border-slate-700 text-slate-400 transition flex items-center gap-1.5 text-xs font-semibold"
              title="Close Fruit Ninja (ESC)"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        {/* Game Body */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          <FruitNinjaGame onClose={onClose} isModal={true} />
        </div>
      </div>
    </div>
  );
};
