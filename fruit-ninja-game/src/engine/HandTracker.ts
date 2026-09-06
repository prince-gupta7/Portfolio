import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import type { HandPose, HandTrackingPoint, HandTrackingState } from './types';

export class HandTracker {
  private video: HTMLVideoElement | null = null;
  private handLandmarker: HandLandmarker | null = null;
  private isInitializing: boolean = false;
  private animationFrameId: number | null = null;
  private lastVideoTime: number = -1;
  private fpsCounter: number = 0;
  private lastFpsUpdate: number = performance.now();
  private smoothedLandmarks: Map<number, HandTrackingPoint[]> = new Map();

  // Optical flow / motion fallback
  private prevFrameData: ImageData | null = null;
  private motionCanvas: HTMLCanvasElement | null = null;
  private motionCtx: CanvasRenderingContext2D | null = null;

  public state: HandTrackingState = {
    isActive: false,
    isLoaded: false,
    isPermissionGranted: false,
    isCameraReady: false,
    engine: 'mediapipe',
    fps: 0,
    handsCount: 0,
    sensitivity: 1.4,
    isMirrored: true,
    showSkeleton: true,
    showPip: true,
    hands: [],
  };

  private onHandsDetectedCallback: ((hands: HandPose[]) => void) | null = null;
  private onStateChangeCallback: ((state: HandTrackingState) => void) | null = null;

  constructor() {
    this.motionCanvas = document.createElement('canvas');
    this.motionCanvas.width = 80;
    this.motionCanvas.height = 60;
    this.motionCtx = this.motionCanvas.getContext('2d', { willReadFrequently: true });
  }

  public setCallbacks(
    onHandsDetected: (hands: HandPose[]) => void,
    onStateChange?: (state: HandTrackingState) => void
  ) {
    this.onHandsDetectedCallback = onHandsDetected;
    this.onStateChangeCallback = onStateChange || null;
  }

  private updateState(partial: Partial<HandTrackingState>) {
    this.state = { ...this.state, ...partial };
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.state);
    }
  }

  /**
   * Start camera and initialize hand tracking models
   */
  public async start(videoElement?: HTMLVideoElement): Promise<boolean> {
    if (this.isInitializing || this.state.isActive) return true;
    this.isInitializing = true;

    try {
      // 1. Get or create video element
      if (videoElement) {
        this.video = videoElement;
      } else if (!this.video) {
        this.video = document.createElement('video');
        this.video.setAttribute('playsinline', 'true');
        this.video.setAttribute('autoplay', 'true');
        this.video.muted = true;
      }

      // 2. Request webcam stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
          frameRate: { ideal: 60, min: 30 },
        },
        audio: false,
      });

      this.video.srcObject = stream;
      await new Promise<void>((resolve) => {
        if (!this.video) return resolve();
        this.video.onloadedmetadata = () => {
          this.video?.play().then(() => resolve()).catch(() => resolve());
        };
      });

      this.updateState({
        isActive: true,
        isPermissionGranted: true,
        isCameraReady: true,
      });

      // 3. Initialize MediaPipe asynchronously
      this.initMediaPipe().catch((err) => {
        console.warn('MediaPipe init failed, switching to optical flow fallback:', err);
        this.updateState({
          engine: 'optical-flow',
          isLoaded: true,
          errorMessage: 'Using high-speed motion tracker fallback.',
        });
      });

      // 4. Start tracking loop
      this.startTrackingLoop();
      this.isInitializing = false;
      return true;
    } catch (err: unknown) {
      this.isInitializing = false;
      const errorMsg = err instanceof Error ? err.message : 'Webcam permission denied';
      console.warn('Camera initialization error:', err);
      this.updateState({
        isActive: false,
        isPermissionGranted: false,
        isCameraReady: false,
        errorMessage: errorMsg.includes('Permission') ? 'Camera permission was denied. You can still play with mouse/touch!' : 'Camera not available.',
      });
      return false;
    }
  }

  /**
   * Load MediaPipe HandLandmarker with WASM
   */
  private async initMediaPipe() {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
      );

      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
        minHandDetectionConfidence: 0.45,
        minHandPresenceConfidence: 0.45,
        minTrackingConfidence: 0.45,
      });

      this.updateState({
        isLoaded: true,
        engine: 'mediapipe',
      });
    } catch (e) {
      // Try CPU delegate fallback
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
        );
        this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.4,
          minHandPresenceConfidence: 0.4,
          minTrackingConfidence: 0.4,
        });
        this.updateState({ isLoaded: true, engine: 'mediapipe' });
      } catch (err) {
        throw err;
      }
    }
  }

  /**
   * Main tracking detection loop
   */
  private startTrackingLoop() {
    const loop = () => {
      if (!this.state.isActive) return;

      if (this.video && this.video.readyState >= 2) {
        // Calculate FPS
        this.fpsCounter++;
        const now = performance.now();
        if (now - this.lastFpsUpdate >= 1000) {
          this.updateState({ fps: this.fpsCounter });
          this.fpsCounter = 0;
          this.lastFpsUpdate = now;
        }

        if (this.handLandmarker && this.state.engine === 'mediapipe') {
          this.processMediaPipeFrame();
        } else {
          this.processOpticalFlowFrame();
        }
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  /**
   * Process frame with MediaPipe AI
   */
  private processMediaPipeFrame() {
    if (!this.handLandmarker || !this.video) return;

    const currentTimeMs = performance.now();
    if (this.video.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = this.video.currentTime;

      try {
        const results = this.handLandmarker.detectForVideo(this.video, currentTimeMs);
        const hands: HandPose[] = [];

        if (results.landmarks && results.landmarks.length > 0) {
          for (let i = 0; i < results.landmarks.length; i++) {
            const rawLandmarks = results.landmarks[i];
            const handedness = (results.handednesses[i]?.[0]?.categoryName as 'Left' | 'Right') || (i === 0 ? 'Right' : 'Left');
            
            // Apply smoothing and mirroring
            const smoothed = this.smoothLandmarks(i, rawLandmarks);
            
            const wrist = smoothed[0];
            const thumbTip = smoothed[4];
            const indexTip = smoothed[8];
            const indexPip = smoothed[6];
            const middleTip = smoothed[12];
            const palmCenter = {
              x: (smoothed[0].x + smoothed[5].x + smoothed[9].x + smoothed[13].x + smoothed[17].x) / 5,
              y: (smoothed[0].y + smoothed[5].y + smoothed[9].y + smoothed[13].y + smoothed[17].y) / 5,
              confidence: 0.9,
            };

            // Detect pinch / open hand
            const thumbIndexDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
            const isPinching = thumbIndexDist < 0.08;
            const isOpenHand = !isPinching;

            hands.push({
              handIndex: i,
              handedness,
              indexFingerTip: indexTip,
              indexFingerPip: indexPip,
              thumbTip,
              middleTip,
              wrist,
              palmCenter,
              isOpenHand,
              isPinching,
              landmarks: smoothed,
            });
          }
        }

        this.updateState({ handsCount: hands.length, hands });
        if (this.onHandsDetectedCallback) {
          this.onHandsDetectedCallback(hands);
        }
      } catch {
        // Fallback to optical flow on error
        this.processOpticalFlowFrame();
      }
    }
  }

  /**
   * Exponential moving average smoothing for landmarks to remove webcam jitter
   */
  private smoothLandmarks(handIndex: number, raw: { x: number; y: number; z: number }[]): HandTrackingPoint[] {
    const alpha = 0.65; // Smoothing factor (higher = more responsive, lower = smoother)
    const prev = this.smoothedLandmarks.get(handIndex);
    const result: HandTrackingPoint[] = [];

    for (let j = 0; j < raw.length; j++) {
      // Mirror X if enabled
      let targetX = raw[j].x;
      if (this.state.isMirrored) {
        targetX = 1 - targetX;
      }

      // Apply sensitivity expansion around screen center
      const centerX = 0.5;
      const centerY = 0.5;
      const sens = this.state.sensitivity;
      targetX = centerX + (targetX - centerX) * sens;
      let targetY = centerY + (raw[j].y - centerY) * sens;

      // Clamp
      targetX = Math.max(0.01, Math.min(0.99, targetX));
      targetY = Math.max(0.01, Math.min(0.99, targetY));

      if (prev && prev[j]) {
        const smoothedX = prev[j].x * (1 - alpha) + targetX * alpha;
        const smoothedY = prev[j].y * (1 - alpha) + targetY * alpha;
        result.push({
          x: smoothedX,
          y: smoothedY,
          z: raw[j].z,
          confidence: 0.95,
        });
      } else {
        result.push({
          x: targetX,
          y: targetY,
          z: raw[j].z,
          confidence: 0.95,
        });
      }
    }

    this.smoothedLandmarks.set(handIndex, result);
    return result;
  }

  /**
   * Optical flow fallback: fast frame differencing & skin-color centroid
   */
  private processOpticalFlowFrame() {
    if (!this.video || !this.motionCtx || !this.motionCanvas) return;

    const w = this.motionCanvas.width;
    const h = this.motionCanvas.height;
    
    this.motionCtx.drawImage(this.video, 0, 0, w, h);
    const currentFrame = this.motionCtx.getImageData(0, 0, w, h);
    const curr = currentFrame.data;

    if (this.prevFrameData) {
      const prev = this.prevFrameData.data;
      let totalMotion = 0;
      let weightedX = 0;
      let weightedY = 0;

      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          const idx = (y * w + x) * 4;
          const rDiff = Math.abs(curr[idx] - prev[idx]);
          const gDiff = Math.abs(curr[idx + 1] - prev[idx + 1]);
          const bDiff = Math.abs(curr[idx + 2] - prev[idx + 2]);
          const diff = (rDiff + gDiff + bDiff) / 3;

          // Motion threshold
          if (diff > 25) {
            totalMotion += diff;
            weightedX += x * diff;
            weightedY += y * diff;
          }
        }
      }

      if (totalMotion > 800) {
        let normX = weightedX / totalMotion / w;
        if (this.state.isMirrored) {
          normX = 1 - normX;
        }
        let normY = weightedY / totalMotion / h;

        // Apply sensitivity
        normX = 0.5 + (normX - 0.5) * this.state.sensitivity;
        normY = 0.5 + (normY - 0.5) * this.state.sensitivity;
        normX = Math.max(0.01, Math.min(0.99, normX));
        normY = Math.max(0.01, Math.min(0.99, normY));

        const dummyPoint: HandTrackingPoint = { x: normX, y: normY, confidence: 0.8 };
        const dummyHand: HandPose = {
          handIndex: 0,
          handedness: 'Right',
          indexFingerTip: dummyPoint,
          indexFingerPip: dummyPoint,
          thumbTip: dummyPoint,
          middleTip: dummyPoint,
          wrist: dummyPoint,
          palmCenter: dummyPoint,
          isOpenHand: true,
          isPinching: false,
          landmarks: Array(21).fill(dummyPoint),
        };

        this.updateState({ handsCount: 1, hands: [dummyHand] });
        if (this.onHandsDetectedCallback) {
          this.onHandsDetectedCallback([dummyHand]);
        }
      } else {
        this.updateState({ handsCount: 0, hands: [] });
      }
    }

    this.prevFrameData = currentFrame;
  }

  /**
   * Draw hand skeleton on preview canvas
   */
  public drawSkeleton(ctx: CanvasRenderingContext2D, width: number, height: number) {
    if (!this.state.showSkeleton || this.state.hands.length === 0) return;

    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17], // Palm
    ];

    ctx.save();
    for (const hand of this.state.hands) {
      const isRight = hand.handedness === 'Right';
      const glowColor = isRight ? 'rgba(6, 182, 212, 0.9)' : 'rgba(236, 72, 153, 0.9)';
      const bladeColor = isRight ? '#22d3ee' : '#f472b6';

      // Draw bones
      ctx.lineWidth = 3;
      ctx.strokeStyle = glowColor;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 8;
      ctx.shadowColor = glowColor;

      for (const [start, end] of connections) {
        if (hand.landmarks[start] && hand.landmarks[end]) {
          const p1 = hand.landmarks[start];
          const p2 = hand.landmarks[end];
          ctx.beginPath();
          ctx.moveTo(p1.x * width, p1.y * height);
          ctx.lineTo(p2.x * width, p2.y * height);
          ctx.stroke();
        }
      }

      // Draw joints
      for (let j = 0; j < hand.landmarks.length; j++) {
        const pt = hand.landmarks[j];
        const isTip = j === 8 || j === 4 || j === 12 || j === 16 || j === 20;
        ctx.fillStyle = isTip ? '#ffffff' : glowColor;
        ctx.beginPath();
        ctx.arc(pt.x * width, pt.y * height, isTip ? 5 : 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Katana tip aura on index fingertip
      const tip = hand.indexFingerTip;
      ctx.fillStyle = bladeColor;
      ctx.shadowBlur = 15;
      ctx.shadowColor = bladeColor;
      ctx.beginPath();
      ctx.arc(tip.x * width, tip.y * height, 9, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  public setSensitivity(val: number) {
    this.updateState({ sensitivity: Math.max(0.8, Math.min(2.5, val)) });
  }

  public toggleMirror() {
    this.updateState({ isMirrored: !this.state.isMirrored });
  }

  public toggleSkeleton() {
    this.updateState({ showSkeleton: !this.state.showSkeleton });
  }

  public togglePip() {
    this.updateState({ showPip: !this.state.showPip });
  }

  public getVideoElement(): HTMLVideoElement | null {
    return this.video;
  }

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.video && this.video.srcObject) {
      const stream = this.video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      this.video.srcObject = null;
    }

    if (this.handLandmarker) {
      this.handLandmarker.close();
      this.handLandmarker = null;
    }

    this.smoothedLandmarks.clear();
    this.updateState({
      isActive: false,
      isCameraReady: false,
      handsCount: 0,
      hands: [],
    });
  }
}

export const handTracker = new HandTracker();
