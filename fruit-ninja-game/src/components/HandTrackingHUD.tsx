import React, { useEffect, useRef, useState } from 'react';
import { 
  Camera, 
  CameraOff, 
  FlipHorizontal, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Activity, 
  HelpCircle,
  X
} from 'lucide-react';
import { handTracker } from '../engine/HandTracker';
import type { HandTrackingState } from '../engine/types';

interface HandTrackingHUDProps {
  trackingState: HandTrackingState;
  onToggleCamera: () => void;
  onSensitivityChange: (val: number) => void;
  isARMode?: boolean;
}

export const HandTrackingHUD: React.FC<HandTrackingHUDProps> = ({
  trackingState,
  onToggleCamera,
  onSensitivityChange,
  isARMode = false,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sync internal tracking video to canvas renderer
  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        const video = handTracker.getVideoElement();

        if (ctx && video && video.readyState >= 2) {
          const w = canvasRef.current.width;
          const h = canvasRef.current.height;

          ctx.save();
          ctx.clearRect(0, 0, w, h);

          // Mirror video if enabled
          if (trackingState.isMirrored) {
            ctx.translate(w, 0);
            ctx.scale(-1, 1);
          }

          // Draw video feed
          ctx.drawImage(video, 0, 0, w, h);
          ctx.restore();

          // Draw hand skeleton overlay
          handTracker.drawSkeleton(ctx, w, h);
        }
      }
      animId = requestAnimationFrame(renderLoop);
    };

    if (trackingState.isActive) {
      animId = requestAnimationFrame(renderLoop);
    }

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [trackingState.isActive, trackingState.isMirrored, trackingState.showSkeleton]);

  return (
    <div className="absolute bottom-4 left-4 z-40 flex flex-col gap-2 font-sans select-none">
      {/* Hand Gesture Tips Modal / Tooltip */}
      {showTips && (
        <div className="bg-slate-900/95 border border-cyan-500/40 backdrop-blur-md p-4 rounded-xl shadow-2xl max-w-sm text-xs text-slate-200 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between font-bold text-cyan-400 mb-2 border-b border-cyan-500/20 pb-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Vision Hand Tracking Guide
            </span>
            <button 
              onClick={() => setShowTips(false)} 
              className="text-slate-400 hover:text-white p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="space-y-1.5 leading-relaxed text-slate-300">
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">1.</span>
              <span>Position your hand in front of your camera in good lighting.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">2.</span>
              <span><strong>Slash with Index Finger:</strong> Extend your finger like a blade and slice through the air quickly!</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">3.</span>
              <span><strong>Dual Swords:</strong> Raise both hands to dual-wield two glowing katanas simultaneously!</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">4.</span>
              <span>Mouse & Touchpad are also always active if you need fallback!</span>
            </li>
          </ul>
        </div>
      )}

      {/* Main PIP Widget */}
      <div className={`transition-all duration-300 rounded-2xl overflow-hidden border ${
        trackingState.isActive 
          ? trackingState.handsCount > 0 
            ? 'border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.25)] bg-slate-950/85' 
            : 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)] bg-slate-950/85'
          : 'border-slate-800 bg-slate-950/70'
      } backdrop-blur-md`}>
        
        {/* PIP Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${
              trackingState.isActive 
                ? trackingState.handsCount > 0 
                  ? 'bg-cyan-400 animate-ping' 
                  : 'bg-amber-400 animate-pulse'
                : 'bg-slate-600'
            }`} />
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              {trackingState.isActive 
                ? trackingState.handsCount > 0 
                  ? `${trackingState.handsCount} Hand${trackingState.handsCount > 1 ? 's (Dual Blade!)' : ' Blade'}`
                  : 'Looking for hand...'
                : 'Camera Inactive'}
              {isARMode && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AR
                </span>
              )}
            </span>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowTips(!showTips)}
              className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition"
              title="Hand Tracking Tips"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1 rounded transition ${showSettings ? 'text-cyan-400 bg-cyan-500/20' : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'}`}
              title="Camera Settings"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Video Canvas Container (when not minimized) */}
        {!isMinimized && (
          <div className="relative w-56 h-40 bg-black/80 flex items-center justify-center overflow-hidden">
            {trackingState.isActive ? (
              <>
                <canvas
                  ref={canvasRef}
                  width={224}
                  height={160}
                  className="w-full h-full object-cover"
                />

                {/* Hand Detection Overlay Pill */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-[10px] text-slate-300">
                  <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>{trackingState.engine === 'mediapipe' ? 'AI Vision' : 'Optical Flow'} • {trackingState.fps} FPS</span>
                </div>

                {/* No hand detected hint */}
                {trackingState.handsCount === 0 && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-3 pointer-events-none">
                    <span className="text-2xl animate-bounce">👋</span>
                    <span className="text-[11px] text-amber-300 font-medium mt-1">Wave hand in camera</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <CameraOff className="w-8 h-8 text-slate-600 mb-2" />
                <span className="text-xs text-slate-400 mb-3">Camera is turned off</span>
                <button
                  onClick={onToggleCamera}
                  className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1.5 transition active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Enable Hand Tracking
                </button>
              </div>
            )}
          </div>
        )}

        {/* Settings Drawer */}
        {showSettings && (
          <div className="p-3 bg-slate-900/95 border-t border-slate-800 text-xs text-slate-300 space-y-2.5">
            <div className="flex items-center justify-between">
              <span>Sensitivity ({trackingState.sensitivity.toFixed(1)}x)</span>
              <input
                type="range"
                min="0.8"
                max="2.2"
                step="0.1"
                value={trackingState.sensitivity}
                onChange={(e) => onSensitivityChange(parseFloat(e.target.value))}
                className="w-24 accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <button
                onClick={() => handTracker.toggleMirror()}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition ${
                  trackingState.isMirrored ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <FlipHorizontal className="w-3 h-3" />
                Mirror View
              </button>

              <button
                onClick={() => handTracker.toggleSkeleton()}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition ${
                  trackingState.showSkeleton ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                Skeleton
              </button>
            </div>

            <div className="pt-1 border-t border-slate-800">
              <button
                onClick={onToggleCamera}
                className="w-full py-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
              >
                {trackingState.isActive ? 'Turn Off Camera' : 'Turn On Camera'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden reference video element for MediaPipe stream */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className="hidden"
      />
    </div>
  );
};
