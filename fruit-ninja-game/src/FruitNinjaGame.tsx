import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Play, 
  Volume2, 
  VolumeX, 
  Swords, 
  Camera, 
  HelpCircle, 
  Sparkles,
  Maximize,
  Minimize
} from 'lucide-react';
import { GameEngine } from './engine/GameEngine';
import { handTracker } from './engine/HandTracker';
import { soundEngine } from './engine/SoundEngine';
import { HandTrackingHUD } from './components/HandTrackingHUD';
import { GameOverSummary } from './components/GameOverSummary';
import { BladeSelector } from './components/BladeSelector';
import type { BladeSkin, DojoTheme, GameMode, GameStats, HandTrackingState } from './engine/types';

interface FruitNinjaGameProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const FruitNinjaGame: React.FC<FruitNinjaGameProps> = ({ isModal = false }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameover' | 'pomegranate_rush'>('menu');
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const [trackingState, setTrackingState] = useState<HandTrackingState>(handTracker.state);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Initialize GameEngine
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current);
    engineRef.current = engine;

    engine.setCallbacks(
      (finalStats) => {
        setStats(finalStats);
        setGameState('gameover');
      },
      () => {
        setGameState(engine.state);
      }
    );

    engine.start();

    // Setup HandTracker callbacks
    handTracker.setCallbacks(
      (hands) => {
        if (engineRef.current) {
          engineRef.current.handleHandMovements(hands);
        }
      },
      (st) => {
        setTrackingState({ ...st });
      }
    );

    // Auto-request webcam on mount for seamless experience
    handTracker.start().catch(() => {});

    // Resize listener
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.stop();
      handTracker.stop();
      soundEngine.destroy();
    };
  }, []);

  // Handle pointer events for mouse/touch
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !engineRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    engineRef.current.handlePointerMove(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !engineRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    engineRef.current.handlePointerMove(x, y);
  };

  const handlePointerUp = () => {
    if (engineRef.current) {
      engineRef.current.handlePointerUp();
    }
  };

  const handleStartGame = (mode: GameMode) => {
    setSelectedMode(mode);
    if (engineRef.current) {
      engineRef.current.startGame(mode);
      setGameState('playing');
    }
  };

  const handleToggleCamera = useCallback(() => {
    if (trackingState.isActive) {
      handTracker.stop();
    } else {
      handTracker.start();
    }
  }, [trackingState.isActive]);

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    soundEngine.toggleMusic();
    setIsSoundMuted(muted);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleSelectBlade = (blade: BladeSkin) => {
    if (engineRef.current) {
      engineRef.current.setBladeSkin(blade);
    }
  };

  const handleSelectDojo = (dojo: DojoTheme) => {
    if (engineRef.current) {
      engineRef.current.setDojoTheme(dojo);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[580px] bg-slate-950 text-white select-none overflow-hidden flex flex-col items-center justify-center font-sans ${
        isModal ? 'rounded-2xl' : ''
      }`}
    >
      {/* Background AR Video layer if camera theme is selected */}
      {engineRef.current?.selectedTheme.wallTexture === 'camera' && trackingState.isActive && (
        <video
          ref={(v) => {
            const trackVideo = handTracker.getVideoElement();
            if (v && trackVideo && v.srcObject !== trackVideo.srcObject) {
              v.srcObject = trackVideo.srcObject;
              v.play().catch(() => {});
            }
          }}
          playsInline
          autoPlay
          muted
          className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-80 ${
            trackingState.isMirrored ? 'scale-x-[-1]' : ''
          }`}
        />
      )}

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
      />

      {/* Top Game Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Ninja Title / Mode Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-md shadow-lg">
            <span className="text-cyan-400 font-black tracking-wider text-sm flex items-center gap-1.5">
              <Swords className="w-4 h-4" /> FRUIT NINJA
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold text-slate-300 capitalize">{selectedMode}</span>
          </div>

          {/* Vision Hand Status Pill */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border ${
            trackingState.isActive && trackingState.handsCount > 0
              ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
              : trackingState.isActive
              ? 'bg-amber-950/70 border-amber-500/40 text-amber-300'
              : 'bg-slate-900/70 border-slate-700 text-slate-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              trackingState.isActive && trackingState.handsCount > 0
                ? 'bg-emerald-400 animate-ping'
                : trackingState.isActive
                ? 'bg-amber-400 animate-pulse'
                : 'bg-slate-500'
            }`} />
            <span>
              {trackingState.isActive
                ? trackingState.handsCount > 0
                  ? `Vision Active (${trackingState.handsCount} Hand)`
                  : 'Webcam Ready (Wave Hand)'
                : 'Webcam Off (Mouse Mode)'}
            </span>
          </div>
        </div>

        {/* Action Tool Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowHowToPlay(true)}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-cyan-400/50 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md shadow-lg transition"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-cyan-400/50 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md shadow-lg transition flex items-center gap-1.5 text-xs font-semibold"
            title="Blade Armory & Dojos"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Armory</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-cyan-400/50 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md shadow-lg transition"
            title={isSoundMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-cyan-400/50 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md shadow-lg transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Hand Tracking HUD PIP in corner */}
      <HandTrackingHUD
        trackingState={trackingState}
        onToggleCamera={handleToggleCamera}
        onSensitivityChange={(val) => handTracker.setSensitivity(val)}
        isARMode={engineRef.current?.selectedTheme.wallTexture === 'camera'}
      />

      {/* Main Menu Overlay */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/75 backdrop-blur-sm pointer-events-auto">
          {/* Logo & Subtitle */}
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-3 tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Motion Vision Hand Tracking AR
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-cyan-400 drop-shadow-2xl">
              FRUIT NINJA
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-md mx-auto">
              Slice flying fruits with your real hands in front of the webcam or using mouse slashes!
            </p>
          </div>

          {/* Game Modes Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
            {/* Classic Mode */}
            <div
              onClick={() => handleStartGame('classic')}
              className="group p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/60 shadow-lg hover:shadow-amber-500/20 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  🍉
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                  Classic Mode
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  3 Lives. Avoid deadly bombs. Cut fruits to earn score and extra lives!
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-amber-400">
                <span>Play Classic</span>
                <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Arcade Mode */}
            <div
              onClick={() => handleStartGame('arcade')}
              className="group p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/60 shadow-lg hover:shadow-cyan-500/20 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  ⏱️
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
                  Arcade Mode
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  60-second timer. Freeze Bananas, Fruit Frenzies & Pomegranate Blitz!
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-cyan-400">
                <span>Play Arcade</span>
                <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Zen Mode */}
            <div
              onClick={() => handleStartGame('zen')}
              className="group p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/60 shadow-lg hover:shadow-emerald-500/20 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  🍃
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                  Zen Mode
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  90 seconds of peaceful slicing. No bombs, no lives lost. Master high combos!
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>Play Zen</span>
                <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Quick Camera & Armory Row */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleCamera}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                trackingState.isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
              }`}
            >
              <Camera className="w-4 h-4" />
              {trackingState.isActive ? 'Camera Enabled ✓' : 'Enable Webcam Hand Tracking'}
            </button>

            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition"
            >
              <Swords className="w-4 h-4 text-cyan-400" />
              Equip Blades
            </button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameState === 'gameover' && stats && (
        <GameOverSummary
          stats={stats}
          mode={selectedMode}
          onPlayAgain={() => handleStartGame(selectedMode)}
          onChangeMode={() => setGameState('menu')}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onClose={() => setGameState('menu')}
        />
      )}

      {/* Customizer Modal (Blades & Dojos) */}
      {isCustomizerOpen && engineRef.current && (
        <BladeSelector
          currentBlade={engineRef.current.selectedSkin}
          currentDojo={engineRef.current.selectedTheme}
          onSelectBlade={handleSelectBlade}
          onSelectDojo={handleSelectDojo}
          onClose={() => setIsCustomizerOpen(false)}
        />
      )}

      {/* How to Play Guide Modal */}
      {showHowToPlay && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl text-left">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" /> How to Play Fruit Ninja
            </h3>
            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <span className="text-2xl">🖐️</span>
                <div>
                  <h4 className="font-bold text-white">Visual Hand Movement (Webcam)</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Position your hand in front of the camera. Point your index finger like a blade and slice swiftly through the air!
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <span className="text-2xl">⚔️</span>
                <div>
                  <h4 className="font-bold text-white">Dual Swords Mode</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Raise both hands simultaneously to control two independent glowing katana blades!
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <span className="text-2xl">🖱️</span>
                <div>
                  <h4 className="font-bold text-white">Mouse / Touchscreen</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Drag and swipe across the screen with your mouse or finger to slice anytime.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <span className="text-2xl">💣</span>
                <div>
                  <h4 className="font-bold text-white">Combos & Hazards</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Slice 3+ fruits in a single stroke for massive combo bonuses! Avoid iron bombs in Classic mode.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Got It, Let's Play!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
