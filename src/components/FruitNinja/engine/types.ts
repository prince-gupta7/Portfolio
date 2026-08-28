export type GameMode = 'classic' | 'arcade' | 'zen' | 'dojo';

export type FruitType = 
  | 'watermelon'
  | 'orange'
  | 'apple'
  | 'banana'
  | 'strawberry'
  | 'pineapple'
  | 'coconut'
  | 'dragonfruit' // Frenzy powerup
  | 'freeze_banana' // Matrix slow-motion powerup
  | 'starfruit' // Double score powerup
  | 'bomb' // Hazard
  | 'pomegranate'; // Multi-slice frenzy at round end

export interface Point {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
  vRot: number; // angular velocity in radians/frame
}

export interface BladePoint extends Point {
  time: number;
  speed: number;
}

export interface BladeSkin {
  id: string;
  name: string;
  glowColor: string;
  coreColor: string;
  particleColor: string[];
  slashWidth: number;
  description: string;
  icon: string;
}

export interface DojoTheme {
  id: string;
  name: string;
  bgGradient: string[];
  wallTexture: 'tatami' | 'cyber' | 'sunset' | 'camera';
  accentColor: string;
  description: string;
}

export interface FruitConfig {
  type: FruitType;
  radius: number;
  color: string;
  innerColor: string;
  rindColor?: string;
  seedColor?: string;
  points: number;
  isBomb?: boolean;
  isSpecial?: boolean;
  specialType?: 'frenzy' | 'freeze' | 'double' | 'pomegranate';
}

export interface SliceHalf {
  type: FruitType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  sliceAngle: number;
  radius: number;
  color: string;
  innerColor: string;
  rindColor?: string;
  seedColor?: string;
  side: 1 | -1; // Left or Right half
  alpha: number;
  isSpecial?: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  decay: number;
  gravity: number;
  shape?: 'circle' | 'spark' | 'petal' | 'seed' | 'droplet';
}

export interface JuiceSplatter {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  drops: { dx: number; dy: number; r: number }[];
  life: number;
  maxLife: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  scale: number;
  alpha: number;
  vy: number;
  subtext?: string;
}

export interface HandTrackingPoint {
  x: number;
  y: number;
  z?: number;
  confidence: number;
}

export interface HandPose {
  handIndex: number; // 0 = right, 1 = left
  handedness: 'Left' | 'Right';
  indexFingerTip: HandTrackingPoint;
  indexFingerPip: HandTrackingPoint;
  thumbTip: HandTrackingPoint;
  middleTip: HandTrackingPoint;
  wrist: HandTrackingPoint;
  palmCenter: HandTrackingPoint;
  isOpenHand: boolean;
  isPinching: boolean;
  landmarks: HandTrackingPoint[];
}

export interface HandTrackingState {
  isActive: boolean;
  isLoaded: boolean;
  isPermissionGranted: boolean;
  isCameraReady: boolean;
  engine: 'mediapipe' | 'optical-flow' | 'mouse';
  fps: number;
  handsCount: number;
  sensitivity: number; // 1.0 to 2.5
  isMirrored: boolean;
  showSkeleton: boolean;
  showPip: boolean;
  hands: HandPose[];
  errorMessage?: string;
}

export interface ComboTracker {
  count: number;
  lastSliceTime: number;
  comboTimer: number;
  fruitsInCombo: FruitType[];
}

export interface GameStats {
  score: number;
  highScore: number;
  maxCombo: number;
  fruitsSliced: number;
  bombsHit: number;
  criticalSlices: number;
  accuracy: number;
  slicedByType: Record<FruitType, number>;
  timePlayed: number; // in seconds
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
  selectedBlade: string;
  selectedDojo: string;
  handTrackingSensitivity: number;
  showWebcamPip: boolean;
  showSkeleton: boolean;
  isCameraMirrored: boolean;
  cameraBackgroundAlpha: number; // For AR pass-through mode
}
