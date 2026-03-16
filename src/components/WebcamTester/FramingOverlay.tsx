'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/lib/getDictionary';

interface FramingOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  dictionary: Dictionary;
}

interface FaceDetection {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function FramingOverlay({ videoRef, isActive, dictionary }: FramingOverlayProps) {
  const [showGrid, setShowGrid] = useState(false);
  const [showFaceGuide, setShowFaceGuide] = useState(false);
  const [faceDetection, setFaceDetection] = useState<FaceDetection | null>(null);
  const [framingTip, setFramingTip] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive || !showFaceGuide || !videoRef.current) {
      setFaceDetection(null);
      setFramingTip('');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Simple face detection using skin color heuristics
    // (Production would use TensorFlow.js or MediaPipe)
    const detectFace = () => {
      if (video.videoWidth === 0) return;

      canvas.width = 160;
      canvas.height = 120;
      ctx.drawImage(video, 0, 0, 160, 120);

      const imageData = ctx.getImageData(0, 0, 160, 120);
      const data = imageData.data;

      // Find skin-colored regions (simplified detection)
      let minX = 160, minY = 120, maxX = 0, maxY = 0;
      let skinPixels = 0;

      for (let y = 0; y < 120; y++) {
        for (let x = 0; x < 160; x++) {
          const idx = (y * 160 + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Skin color detection (simplified)
          const isSkin = r > 95 && g > 40 && b > 20 &&
            r > g && r > b &&
            Math.abs(r - g) > 15 &&
            r - g > 15 && r - b > 15;

          if (isSkin) {
            skinPixels++;
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }

      // Check if we found a reasonable face region
      if (skinPixels > 500 && maxX - minX > 20 && maxY - minY > 20) {
        const face = {
          x: (minX / 160) * 100,
          y: (minY / 120) * 100,
          width: ((maxX - minX) / 160) * 100,
          height: ((maxY - minY) / 120) * 100,
        };
        setFaceDetection(face);

        // Generate framing tip
        const centerX = face.x + face.width / 2;
        const centerY = face.y + face.height / 2;

        let tip = '';
        if (centerX < 35) tip = dictionary.webcam.framing.moveRight;
        else if (centerX > 65) tip = dictionary.webcam.framing.moveLeft;
        else if (centerY < 25) tip = dictionary.webcam.framing.moveDown;
        else if (centerY > 45) tip = dictionary.webcam.framing.moveUp;
        else if (face.width < 15) tip = dictionary.webcam.framing.moveCloser;
        else if (face.width > 40) tip = dictionary.webcam.framing.moveBack;
        else tip = dictionary.webcam.framing.greatFraming;

        setFramingTip(tip);
      } else {
        setFaceDetection(null);
        setFramingTip(dictionary.webcam.framing.noFaceDetected);
      }
    };

    detectionIntervalRef.current = setInterval(detectFace, 200);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isActive, showFaceGuide, videoRef, dictionary]);

  if (!isActive) return null;

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />

      {/* Rule of Thirds Grid */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Vertical lines */}
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
          {/* Horizontal lines */}
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
          {/* Intersection points */}
          <div className="absolute left-1/3 top-1/3 w-2 h-2 -ml-1 -mt-1 rounded-full bg-white/50" />
          <div className="absolute left-2/3 top-1/3 w-2 h-2 -ml-1 -mt-1 rounded-full bg-white/50" />
          <div className="absolute left-1/3 top-2/3 w-2 h-2 -ml-1 -mt-1 rounded-full bg-white/50" />
          <div className="absolute left-2/3 top-2/3 w-2 h-2 -ml-1 -mt-1 rounded-full bg-white/50" />
        </div>
      )}

      {/* Face Detection Guide */}
      {showFaceGuide && faceDetection && (
        <div
          className="absolute border-2 border-green-400 rounded-lg pointer-events-none transition-all duration-200"
          style={{
            left: `${faceDetection.x}%`,
            top: `${faceDetection.y}%`,
            width: `${faceDetection.width}%`,
            height: `${faceDetection.height}%`,
          }}
        />
      )}

      {/* Ideal face position guide */}
      {showFaceGuide && (
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 w-1/4 h-1/3 border-2 border-dashed border-white/20 rounded-full pointer-events-none" />
      )}

      {/* Framing Tip */}
      {showFaceGuide && framingTip && (
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium ${
          framingTip === dictionary.webcam.framing.greatFraming ? 'bg-green-500/80 text-white' : 'bg-yellow-500/80 text-black'
        }`}>
          {framingTip}
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            showGrid ? 'bg-indigo-600 text-white' : 'bg-black/50 text-white hover:bg-black/70'
          }`}
        >
          {dictionary.webcam.framing.grid}
        </button>
        <button
          onClick={() => setShowFaceGuide(!showFaceGuide)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            showFaceGuide ? 'bg-indigo-600 text-white' : 'bg-black/50 text-white hover:bg-black/70'
          }`}
        >
          {dictionary.webcam.framing.faceGuide}
        </button>
      </div>
    </>
  );
}
