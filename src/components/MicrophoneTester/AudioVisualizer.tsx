'use client';

import type { Dictionary } from '@/lib/getDictionary';

interface AudioVisualizerProps {
  dictionary: Dictionary;
  isActive: boolean;
  isRecording: boolean;
  recordingTime: number;
  audioLevel: number;
  frequencyData: Uint8Array;
  error: string | null;
  formatTime: (seconds: number) => string;
}

export function AudioVisualizer({
  dictionary,
  isActive,
  isRecording,
  recordingTime,
  audioLevel,
  frequencyData,
  error,
  formatTime,
}: AudioVisualizerProps) {
  const getLevelColor = (level: number) => {
    if (level < 50) return 'bg-green-500';
    if (level < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLevelGradient = (level: number) => {
    if (level < 50) return 'from-green-400 to-green-600';
    if (level < 80) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden p-8">
      {!isActive && !error && (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <p>{dictionary.microphone.permissionMessage}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-64">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {isActive && !error && (
        <div className="space-y-8">
          {/* Recording Indicator */}
          {isRecording && (
            <div className="flex items-center justify-center gap-2 text-red-500">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="font-medium">
                {dictionary.microphone.recording} {formatTime(recordingTime)}
              </span>
            </div>
          )}

          {/* Audio Level Meter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">
                {dictionary.microphone.levelMeter}
              </span>
              <span className="text-sm text-gray-500">{Math.round(audioLevel)}%</span>
            </div>
            <div className="h-8 bg-gray-800 rounded-full overflow-hidden relative">
              <div
                className={`h-full bg-gradient-to-r ${getLevelGradient(audioLevel)} transition-all duration-75 rounded-full`}
                style={{ width: `${audioLevel}%` }}
              />
              {/* Level markers */}
              <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none">
                <div className="w-px h-4 bg-gray-600" />
                <div className="w-px h-4 bg-gray-600" />
                <div className="w-px h-4 bg-gray-600" />
                <div className="w-px h-4 bg-gray-600" />
                <div className="w-px h-4 bg-yellow-600" />
                <div className="w-px h-4 bg-red-600" />
              </div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Frequency Spectrum */}
          <div>
            <div className="text-sm font-medium text-gray-400 mb-2">
              {dictionary.microphone.frequencySpectrum}
            </div>
            <div className="h-32 bg-gray-800 rounded-xl p-4 flex items-end justify-between gap-1">
              {Array.from(frequencyData).map((value, index) => {
                const height = Math.max(4, (value / 255) * 100);
                const hue = 240 - (index / 32) * 60; // Blue to purple gradient
                return (
                  <div
                    key={index}
                    className="flex-1 rounded-t transition-all duration-75"
                    style={{
                      height: `${height}%`,
                      background: `linear-gradient(to top, hsl(${hue}, 80%, 50%), hsl(${hue}, 80%, 70%))`,
                    }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Low</span>
              <span>Mid</span>
              <span>High</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
