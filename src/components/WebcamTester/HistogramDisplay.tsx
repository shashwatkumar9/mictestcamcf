'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/lib/getDictionary';

interface HistogramDisplayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  dictionary: Dictionary;
}

export function HistogramDisplay({ videoRef, isActive, dictionary }: HistogramDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const histogramCanvasRef = useRef<HTMLCanvasElement>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'histogram' | 'waveform' | 'falseColor'>('histogram');

  useEffect(() => {
    if (!isActive || !videoRef.current) return;

    const video = videoRef.current;
    const sampleCanvas = canvasRef.current;
    const histCanvas = histogramCanvasRef.current;
    const waveCanvas = waveformCanvasRef.current;

    if (!sampleCanvas || !histCanvas || !waveCanvas) return;

    const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
    const histCtx = histCanvas.getContext('2d');
    const waveCtx = waveCanvas.getContext('2d');

    if (!sampleCtx || !histCtx || !waveCtx) return;

    let animationId: number;

    const analyze = () => {
      if (video.videoWidth === 0) {
        animationId = requestAnimationFrame(analyze);
        return;
      }

      // Sample video at lower resolution for performance
      const sampleWidth = 160;
      const sampleHeight = 90;
      sampleCanvas.width = sampleWidth;
      sampleCanvas.height = sampleHeight;
      sampleCtx.drawImage(video, 0, 0, sampleWidth, sampleHeight);

      const imageData = sampleCtx.getImageData(0, 0, sampleWidth, sampleHeight);
      const data = imageData.data;

      if (mode === 'histogram') {
        // Calculate histogram
        const histR = new Array(256).fill(0);
        const histG = new Array(256).fill(0);
        const histB = new Array(256).fill(0);
        const histL = new Array(256).fill(0);

        for (let i = 0; i < data.length; i += 4) {
          histR[data[i]]++;
          histG[data[i + 1]]++;
          histB[data[i + 2]]++;
          const luma = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
          histL[luma]++;
        }

        // Find max for normalization
        const maxVal = Math.max(...histL) || 1;

        // Draw histogram
        histCanvas.width = 256;
        histCanvas.height = 100;
        histCtx.fillStyle = '#1a1a2e';
        histCtx.fillRect(0, 0, 256, 100);

        // Draw luminance histogram
        histCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 256; i++) {
          const height = (histL[i] / maxVal) * 90;
          histCtx.fillRect(i, 100 - height, 1, height);
        }

        // Draw RGB overlays
        histCtx.globalAlpha = 0.3;
        histCtx.fillStyle = '#ff0000';
        for (let i = 0; i < 256; i++) {
          const height = (histR[i] / maxVal) * 90;
          histCtx.fillRect(i, 100 - height, 1, height);
        }
        histCtx.fillStyle = '#00ff00';
        for (let i = 0; i < 256; i++) {
          const height = (histG[i] / maxVal) * 90;
          histCtx.fillRect(i, 100 - height, 1, height);
        }
        histCtx.fillStyle = '#0000ff';
        for (let i = 0; i < 256; i++) {
          const height = (histB[i] / maxVal) * 90;
          histCtx.fillRect(i, 100 - height, 1, height);
        }
        histCtx.globalAlpha = 1;

      } else if (mode === 'waveform') {
        // Draw waveform monitor
        waveCanvas.width = sampleWidth;
        waveCanvas.height = 100;
        waveCtx.fillStyle = '#1a1a2e';
        waveCtx.fillRect(0, 0, sampleWidth, 100);

        // Sample each column
        for (let x = 0; x < sampleWidth; x++) {
          for (let y = 0; y < sampleHeight; y++) {
            const idx = (y * sampleWidth + x) * 4;
            const luma = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
            const plotY = 100 - Math.round((luma / 255) * 100);
            waveCtx.fillStyle = `rgba(0, 255, 0, 0.1)`;
            waveCtx.fillRect(x, plotY, 1, 1);
          }
        }

        // Draw reference lines
        waveCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        waveCtx.beginPath();
        waveCtx.moveTo(0, 10); // 90% white
        waveCtx.lineTo(sampleWidth, 10);
        waveCtx.moveTo(0, 90); // 10% black
        waveCtx.lineTo(sampleWidth, 90);
        waveCtx.stroke();
      }

      animationId = requestAnimationFrame(analyze);
    };

    analyze();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, videoRef, mode]);

  if (!isActive) return null;

  return (
    <div className="bg-gray-900 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">{dictionary.webcam.histogram.videoAnalysis}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setMode('histogram')}
            className={`px-2 py-1 text-xs rounded ${mode === 'histogram' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            {dictionary.webcam.histogram.histogram}
          </button>
          <button
            onClick={() => setMode('waveform')}
            className={`px-2 py-1 text-xs rounded ${mode === 'waveform' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            {dictionary.webcam.histogram.waveform}
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {mode === 'histogram' && (
        <div>
          <canvas ref={histogramCanvasRef} className="w-full h-24 rounded" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{dictionary.webcam.histogram.shadows}</span>
            <span>{dictionary.webcam.histogram.midtones}</span>
            <span>{dictionary.webcam.histogram.highlights}</span>
          </div>
        </div>
      )}

      {mode === 'waveform' && (
        <div>
          <canvas ref={waveformCanvasRef} className="w-full h-24 rounded" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>100%</span>
            <span>Brightness</span>
            <span>0%</span>
          </div>
        </div>
      )}
    </div>
  );
}
