import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Award, Zap, Crosshair, Flame, Play, Swords, X } from 'lucide-react';
import type { GameMode, GameStats } from '../engine/types';

interface GameOverSummaryProps {
  stats: GameStats;
  mode: GameMode;
  onPlayAgain: () => void;
  onChangeMode: () => void;
  onOpenCustomizer: () => void;
  onClose: () => void;
}

export const GameOverSummary: React.FC<GameOverSummaryProps> = ({
  stats,
  mode,
  onPlayAgain,
  onChangeMode,
  onOpenCustomizer,
  onClose,
}) => {
  const isNewRecord = stats.score > 0 && stats.score >= stats.highScore;

  // Trigger celebratory confetti on high scores
  useEffect(() => {
    if (isNewRecord && stats.score > 20) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#f59e0b', '#ec4899', '#22c55e', '#ffffff'],
        });
      } catch {}
    }
  }, [isNewRecord, stats.score]);

  // Determine Ninja Rank based on score & combo
  const getNinjaRank = () => {
    const s = stats.score;
    if (s >= 200) return { title: 'GRAND DOJO LEGEND', icon: '👑', color: 'from-amber-400 to-yellow-600' };
    if (s >= 120) return { title: 'DRAGON NINJA SENSEI', icon: '🐉', color: 'from-rose-500 to-red-600' };
    if (s >= 65) return { title: 'KATANA MASTER', icon: '⚔️', color: 'from-cyan-400 to-blue-600' };
    if (s >= 30) return { title: 'SHADOW BLADE', icon: '🗡️', color: 'from-purple-400 to-indigo-600' };
    return { title: 'WHITE BELT APPRENTICE', icon: '🥋', color: 'from-slate-400 to-slate-600' };
  };

  const rank = getNinjaRank();

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-center overflow-hidden">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Return to Menu"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Glow ambient background aura */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Title & Rank Badge */}
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            {mode.toUpperCase()} MODE SUMMARY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            GAME OVER
          </h2>
          <div className="inline-flex items-center gap-2 mt-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700">
            <span className="text-xl">{rank.icon}</span>
            <span className={`text-sm font-bold bg-gradient-to-r ${rank.color} bg-clip-text text-transparent`}>
              {rank.title}
            </span>
          </div>
        </div>

        {/* Big Score Display */}
        <div className="my-6 p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 relative">
          {isNewRecord && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[11px] px-3 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
              <Award className="w-3 h-3" /> NEW HIGH SCORE!
            </div>
          )}
          <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-300">
            {stats.score}
          </div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
            FINAL SCORE (BEST: {Math.max(stats.score, stats.highScore)})
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-left">
          <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" /> Sliced
            </div>
            <div className="text-lg font-bold text-white mt-0.5">{stats.fruitsSliced}</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Max Combo
            </div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{stats.maxCombo}x</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Flame className="w-3.5 h-3.5 text-rose-400" /> Criticals
            </div>
            <div className="text-lg font-bold text-rose-400 mt-0.5">{stats.criticalSlices}</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Award className="w-3.5 h-3.5 text-purple-400" /> Bombs Hit
            </div>
            <div className="text-lg font-bold text-slate-300 mt-0.5">{stats.bombsHit}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full sm:flex-1 py-3.5 px-5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition active:scale-95 group"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Play Again
          </button>

          <button
            onClick={onOpenCustomizer}
            className="w-full sm:w-auto py-3.5 px-4 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-2 transition active:scale-95"
            title="Blades & Dojos"
          >
            <Swords className="w-4 h-4 text-cyan-400" />
            Blades
          </button>

          <button
            onClick={onChangeMode}
            className="w-full sm:w-auto py-3.5 px-4 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Play className="w-4 h-4 text-amber-400" />
            Modes
          </button>
        </div>
      </div>
    </div>
  );
};
