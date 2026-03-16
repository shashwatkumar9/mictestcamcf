'use client';

import { useEffect, useState, useRef } from 'react';
import type { Dictionary } from '@/lib/getDictionary';

interface VideoMetricsOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isActive: boolean;
  dictionary: Dictionary;
}

interface Metrics {
  fps: number;
  actualResolution: string;
  bitrate: number;
  frameDropped: number;
  brightness: number;
}

export function VideoMetricsOverlay({ videoRef, stream, isActive, dictionary }: VideoMetricsOverlayProps) {
  const [metrics, setMetrics] = useState<Metrics>({
    fps: 0,
    actualResolution: '0x0',
    bitrate: 0,
    frameDropped: 0,
    brightness: 0,
  });
  const [showOverlay, setShowOverlay] = useState(true);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || !videoRef.current || !stream) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });

    let animationId: number;
    let lastFrameCount = 0;

    const track = stream.getVideoTracks()[0];
    const settings = track?.getSettings();

    const updateMetrics = () => {
      frameCountRef.current++;
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;

      // Update FPS every second
      if (elapsed >= 1000) {
        const fps = Math.round((frameCountRef.current - lastFrameCount) / (elapsed / 1000));
        lastFrameCount = frameCountRef.current;
        lastTimeRef.current = now;

        // Get actual resolution
        const actualResolution = `${video.videoWidth}x${video.videoHeight}`;

        // Estimate bitrate (rough calculation based on resolution and fps)
        const pixels = video.videoWidth * video.videoHeight;
        const estimatedBitrate = Math.round((pixels * fps * 0.1) / 1000000 * 10) / 10; // Mbps estimate

        // Calculate brightness from canvas
        let brightness = 0;
        if (canvas && ctx && video.videoWidth > 0) {
          canvas.width = 100; // Sample at low res for performance
          canvas.height = 75;
          ctx.drawImage(video, 0, 0, 100, 75);
          const imageData = ctx.getImageData(0, 0, 100, 75);
          const data = imageData.data;
          let sum = 0;
          for (let i = 0; i < data.length; i += 4) {
            // Luminance formula
            sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          }
          brightness = Math.round(sum / (data.length / 4));
        }

        setMetrics({
          fps,
          actualResolution,
          bitrate: estimatedBitrate,
          frameDropped: (video as HTMLVideoElement & { webkitDroppedFrameCount?: number }).webkitDroppedFrameCount || 0,
          brightness,
        });
      }

      animationId = requestAnimationFrame(updateMetrics);
    };

    updateMetrics();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, stream, videoRef]);

  if (!isActive || !showOverlay) return null;

  const getBrightnessLabel = (brightness: number) => {
    if (brightness < 60) return { text: dictionary.webcam.metrics.tooDark, color: 'text-red-400' };
    if (brightness < 100) return { text: dictionary.webcam.metrics.lowLight, color: 'text-yellow-400' };
    if (brightness > 200) return { text: dictionary.webcam.metrics.overexposed, color: 'text-red-400' };
    if (brightness > 170) return { text: 'Bright', color: 'text-yellow-400' };
    return { text: dictionary.webcam.metrics.good, color: 'text-green-400' };
  };

  const brightnessInfo = getBrightnessLabel(metrics.brightness);

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-xs font-mono space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-400">{dictionary.webcam.metrics.fps}</span>
          <span className={metrics.fps >= 24 ? 'text-green-400' : metrics.fps >= 15 ? 'text-yellow-400' : 'text-red-400'}>
            {metrics.fps}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-400">{dictionary.webcam.metrics.resolution}</span>
          <span className="text-white">{metrics.actualResolution}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-400">{dictionary.webcam.metrics.bitrate}</span>
          <span className="text-white">{metrics.bitrate} Mbps</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-400">{dictionary.webcam.metrics.lighting}</span>
          <span className={brightnessInfo.color}>{brightnessInfo.text}</span>
        </div>
        {metrics.frameDropped > 0 && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400">{dictionary.webcam.metrics.dropped}</span>
            <span className="text-red-400">{metrics.frameDropped}</span>
          </div>
        )}
      </div>
      <button
        onClick={() => setShowOverlay(false)}
        className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity"
        title={dictionary.webcam.metrics.hideMetrics}
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </>
  );
}
