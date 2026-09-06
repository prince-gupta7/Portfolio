import React, { useState } from 'react';
import { X, Swords, Sparkles, Shield, Check, Eye } from 'lucide-react';
import { BLADE_SKINS } from '../engine/Blade';
import { DOJO_THEMES } from '../engine/GameEngine';
import { soundEngine } from '../engine/SoundEngine';
import type { BladeSkin, DojoTheme } from '../engine/types';

interface BladeSelectorProps {
  currentBlade: BladeSkin;
  currentDojo: DojoTheme;
  onSelectBlade: (skin: BladeSkin) => void;
  onSelectDojo: (dojo: DojoTheme) => void;
  onClose: () => void;
}

export const BladeSelector: React.FC<BladeSelectorProps> = ({
  currentBlade,
  currentDojo,
  onSelectBlade,
  onSelectDojo,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'blades' | 'dojos'>('blades');

  const handleBladeClick = (blade: BladeSkin) => {
    onSelectBlade(blade);
    soundEngine.playSlashWhoosh(1.2);
  };

  const handleDojoClick = (dojo: DojoTheme) => {
    onSelectDojo(dojo);
    soundEngine.playMenuClick();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white tracking-wide">Ninja Armory & Dojos</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 my-4 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('blades')}
            className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition ${
              activeTab === 'blades'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Katana Blades ({BLADE_SKINS.length})
          </button>

          <button
            onClick={() => setActiveTab('dojos')}
            className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition ${
              activeTab === 'dojos'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            Dojo Arenas ({DOJO_THEMES.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
          {activeTab === 'blades' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BLADE_SKINS.map((blade) => {
                const isSelected = blade.id === currentBlade.id;
                return (
                  <div
                    key={blade.id}
                    onClick={() => handleBladeClick(blade)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{blade.icon}</span>
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-1.5">
                            {blade.name}
                            {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {blade.description}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Blade Color Swatch Bar */}
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60">
                      <div className="flex items-center gap-1.5">
                        {blade.particleColor.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-cyan-400/80 font-mono">
                        {isSelected ? 'EQUIPPED' : 'CLICK TO EQUIP'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DOJO_THEMES.map((dojo) => {
                const isSelected = dojo.id === currentDojo.id;
                const isCamera = dojo.wallTexture === 'camera';
                return (
                  <div
                    key={dojo.id}
                    onClick={() => handleDojoClick(dojo)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    {isCamera && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" /> AR MODE
                      </div>
                    )}

                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        {dojo.name}
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {dojo.description}
                      </div>
                    </div>

                    {/* Gradient preview stripe */}
                    <div
                      className="h-3 w-full rounded-full mt-3 border border-slate-700/80"
                      style={{
                        background: `linear-gradient(to right, ${dojo.bgGradient[0]}, ${dojo.bgGradient[1] || dojo.bgGradient[0]})`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
