'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Dictionary } from '@/lib/getDictionary';

interface BackgroundBlurProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  onProcessedStream?: (canvas: HTMLCanvasElement) => void;
  dictionary: Dictionary;
}

export function BackgroundBlur({ videoRef, isActive, onProcessedStream, dictionary }: BackgroundBlurProps) {
  const [enabled, setEnabled] = useState(false);
  const [blurStrength, setBlurStrength] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const processFrame = useCallback(() => {
    if (!enabled || !videoRef.current || !canvasRef.current || !outputCanvasRef.current) {
      animationRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const outputCanvas = outputCanvasRef.current;

    if (video.videoWidth === 0) {
      animationRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const outputCtx = outputCanvas.getContext('2d');

    if (!ctx || !outputCtx) {
      animationRef.current = requestAnimationFrame(processFrame);
      return;
    }

    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    outputCanvas.width = video.videoWidth;
    outputCanvas.height = video.videoHeight;

    // Draw original frame
    ctx.drawImage(video, 0, 0);

    // Get image data for segmentation
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple skin-color based segmentation (lightweight alternative to ML)
    // Create mask
    const mask = new Uint8ClampedArray(canvas.width * canvas.height);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Detect skin tones and similar colors (simplified person detection)
      const isSkin = r > 95 && g > 40 && b > 20 &&
        r > g && r > b &&
        Math.abs(r - g) > 15;

      // Also detect clothing-like colors near skin regions
      const isClothing = (r > 50 || g > 50 || b > 50) &&
        Math.abs(r - g) < 50 && Math.abs(g - b) < 50;

      mask[i / 4] = isSkin ? 255 : (isClothing ? 128 : 0);
    }

    // Dilate mask to expand person region
    const dilatedMask = new Uint8ClampedArray(mask.length);
    const width = canvas.width;
    const height = canvas.height;
    const dilateRadius = 15;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let maxVal = 0;
        for (let dy = -dilateRadius; dy <= dilateRadius; dy++) {
          for (let dx = -dilateRadius; dx <= dilateRadius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const idx = ny * width + nx;
              if (mask[idx] > maxVal) maxVal = mask[idx];
            }
          }
        }
        dilatedMask[y * width + x] = maxVal;
      }
    }

    // Draw blurred background
    outputCtx.filter = `blur(${blurStrength}px)`;
    outputCtx.drawImage(video, 0, 0);
    outputCtx.filter = 'none';

    // Draw original on top using mask
    const blurredData = outputCtx.getImageData(0, 0, canvas.width, canvas.height);
    const blurredPixels = blurredData.data;

    for (let i = 0; i < data.length; i += 4) {
      const maskValue = dilatedMask[i / 4] / 255;
      // Blend based on mask
      blurredPixels[i] = data[i] * maskValue + blurredPixels[i] * (1 - maskValue);
      blurredPixels[i + 1] = data[i + 1] * maskValue + blurredPixels[i + 1] * (1 - maskValue);
      blurredPixels[i + 2] = data[i + 2] * maskValue + blurredPixels[i + 2] * (1 - maskValue);
    }

    outputCtx.putImageData(blurredData, 0, 0);

    if (onProcessedStream) {
      onProcessedStream(outputCanvas);
    }

    animationRef.current = requestAnimationFrame(processFrame);
  }, [enabled, blurStrength, videoRef, onProcessedStream]);

  useEffect(() => {
    if (!isActive) return;

    animationRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, processFrame]);

  if (!isActive) return null;

  return (
    <div className="bg-gray-900 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">{dictionary.webcam.backgroundBlur.title}</h3>
        <button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              setEnabled(!enabled);
              setIsLoading(false);
            }, 100);
          }}
          disabled={isLoading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-indigo-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">{dictionary.webcam.backgroundBlur.blurStrength}</span>
            <span className="text-white">{blurStrength}px</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            value={blurStrength}
            onChange={(e) => setBlurStrength(Number(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Hidden canvases for processing */}
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={outputCanvasRef} className="hidden" />

      {enabled && (
        <p className="text-xs text-gray-500">
          {dictionary.webcam.backgroundBlur.skinToneNote}
        </p>
      )}
    </div>
  );
}
