'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/lib/getDictionary';

interface AdvancedAudioAnalyzerProps {
  analyser: AnalyserNode | null;
  isActive: boolean;
  dictionary: Dictionary;
}

interface AudioMetrics {
  snr: number;
  rms: number;
  peak: number;
  noiseFloor: number;
  dominantFrequency: number;
  problematicFrequencies: { freq: number; type: string }[];
}

export function AdvancedAudioAnalyzer({ analyser, isActive, dictionary }: AdvancedAudioAnalyzerProps) {
  const [metrics, setMetrics] = useState<AudioMetrics>({
    snr: 0,
    rms: 0,
    peak: 0,
    noiseFloor: -60,
    dominantFrequency: 0,
    problematicFrequencies: [],
  });
  const [mode, setMode] = useState<'spectrogram' | 'metrics'>('metrics');
  const spectrogramCanvasRef = useRef<HTMLCanvasElement>(null);
  const spectrogramDataRef = useRef<ImageData | null>(null);
  const noiseFloorRef = useRef<number[]>([]);

  useEffect(() => {
    if (!isActive || !analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    const freqArray = new Uint8Array(bufferLength);
    let animationId: number;

    const analyze = () => {
      analyser.getFloatTimeDomainData(dataArray);
      analyser.getByteFrequencyData(freqArray);

      // Calculate RMS (Root Mean Square) for volume
      let sum = 0;
      let peak = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const val = Math.abs(dataArray[i]);
        sum += val * val;
        if (val > peak) peak = val;
      }
      const rms = Math.sqrt(sum / dataArray.length);
      const rmsDb = 20 * Math.log10(rms + 0.0001);
      const peakDb = 20 * Math.log10(peak + 0.0001);

      // Estimate noise floor (track minimum levels)
      noiseFloorRef.current.push(rmsDb);
      if (noiseFloorRef.current.length > 100) {
        noiseFloorRef.current.shift();
      }
      const sortedNoise = [...noiseFloorRef.current].sort((a, b) => a - b);
      const noiseFloor = sortedNoise[Math.floor(sortedNoise.length * 0.1)] || -60;

      // Calculate SNR
      const snr = Math.max(0, rmsDb - noiseFloor);

      // Find dominant frequency
      let maxFreqIndex = 0;
      let maxFreqValue = 0;
      for (let i = 0; i < freqArray.length; i++) {
        if (freqArray[i] > maxFreqValue) {
          maxFreqValue = freqArray[i];
          maxFreqIndex = i;
        }
      }
      const sampleRate = analyser.context.sampleRate;
      const dominantFrequency = (maxFreqIndex * sampleRate) / (bufferLength * 2);

      // Detect problematic frequencies
      const problematicFrequencies: { freq: number; type: string }[] = [];

      // Check for 50Hz hum (Europe) or 60Hz hum (US)
      const hzPerBin = sampleRate / (bufferLength * 2);
      const bin50 = Math.round(50 / hzPerBin);
      const bin60 = Math.round(60 / hzPerBin);
      const bin100 = Math.round(100 / hzPerBin);
      const bin120 = Math.round(120 / hzPerBin);

      const avgLevel = freqArray.reduce((a, b) => a + b, 0) / freqArray.length;

      if (freqArray[bin50] > avgLevel * 1.5 && freqArray[bin50] > 100) {
        problematicFrequencies.push({ freq: 50, type: 'Electrical hum (50Hz)' });
      }
      if (freqArray[bin60] > avgLevel * 1.5 && freqArray[bin60] > 100) {
        problematicFrequencies.push({ freq: 60, type: 'Electrical hum (60Hz)' });
      }
      if (freqArray[bin100] > avgLevel * 1.5 && freqArray[bin100] > 100) {
        problematicFrequencies.push({ freq: 100, type: 'Harmonic hum (100Hz)' });
      }
      if (freqArray[bin120] > avgLevel * 1.5 && freqArray[bin120] > 100) {
        problematicFrequencies.push({ freq: 120, type: 'Harmonic hum (120Hz)' });
      }

      // Check for fan noise (typically 200-500Hz continuous)
      let fanNoiseSum = 0;
      const fanStartBin = Math.round(200 / hzPerBin);
      const fanEndBin = Math.round(500 / hzPerBin);
      for (let i = fanStartBin; i < fanEndBin; i++) {
        fanNoiseSum += freqArray[i];
      }
      const fanNoiseAvg = fanNoiseSum / (fanEndBin - fanStartBin);
      if (fanNoiseAvg > avgLevel * 1.3 && fanNoiseAvg > 80) {
        problematicFrequencies.push({ freq: 350, type: 'Fan/HVAC noise' });
      }

      setMetrics({
        snr: Math.round(snr * 10) / 10,
        rms: Math.round(rmsDb),
        peak: Math.round(peakDb),
        noiseFloor: Math.round(noiseFloor),
        dominantFrequency: Math.round(dominantFrequency),
        problematicFrequencies,
      });

      // Update spectrogram
      if (mode === 'spectrogram' && spectrogramCanvasRef.current) {
        const canvas = spectrogramCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Shift existing image left
          if (spectrogramDataRef.current) {
            ctx.putImageData(spectrogramDataRef.current, -1, 0);
          }

          // Draw new column
          const height = canvas.height;
          for (let i = 0; i < Math.min(freqArray.length, height); i++) {
            const value = freqArray[i];
            const hue = 240 - (value / 255) * 240; // Blue to red
            ctx.fillStyle = `hsl(${hue}, 100%, ${20 + (value / 255) * 40}%)`;
            ctx.fillRect(canvas.width - 1, height - i - 1, 1, 1);
          }

          spectrogramDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
      }

      animationId = requestAnimationFrame(analyze);
    };

    analyze();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, analyser, mode]);

  if (!isActive) return null;

  const getSnrQuality = (snr: number) => {
    if (snr >= 40) return { label: dictionary.microphone.advanced.excellent, color: 'text-green-400' };
    if (snr >= 25) return { label: dictionary.microphone.advanced.good, color: 'text-green-400' };
    if (snr >= 15) return { label: dictionary.microphone.advanced.fair, color: 'text-yellow-400' };
    return { label: dictionary.microphone.advanced.poor, color: 'text-red-400' };
  };

  const snrQuality = getSnrQuality(metrics.snr);

  return (
    <div className="bg-gray-900 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">{dictionary.microphone.advanced.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setMode('metrics')}
            className={`px-2 py-1 text-xs rounded ${mode === 'metrics' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            {dictionary.microphone.advanced.metrics}
          </button>
          <button
            onClick={() => setMode('spectrogram')}
            className={`px-2 py-1 text-xs rounded ${mode === 'spectrogram' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            {dictionary.microphone.advanced.spectrogram}
          </button>
        </div>
      </div>

      {mode === 'metrics' && (
        <div className="space-y-4">
          {/* SNR Meter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{dictionary.microphone.advanced.signalToNoiseRatio}</span>
              <span className={`text-sm font-medium ${snrQuality.color}`}>
                {metrics.snr} dB ({snrQuality.label})
              </span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-150 ${
                  metrics.snr >= 25 ? 'bg-green-500' : metrics.snr >= 15 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, (metrics.snr / 50) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{dictionary.microphone.advanced.poor}</span>
              <span>{dictionary.microphone.advanced.good}</span>
              <span>{dictionary.microphone.advanced.excellent}</span>
            </div>
          </div>

          {/* Level Meters */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{metrics.rms}</div>
              <div className="text-xs text-gray-400">{dictionary.microphone.advanced.rms}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{metrics.peak}</div>
              <div className="text-xs text-gray-400">{dictionary.microphone.advanced.peak}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{metrics.noiseFloor}</div>
              <div className="text-xs text-gray-400">{dictionary.microphone.advanced.noiseFloor}</div>
            </div>
          </div>

          {/* Dominant Frequency */}
          <div className="flex items-center justify-between py-2 border-t border-gray-800">
            <span className="text-sm text-gray-400">{dictionary.microphone.advanced.dominantFrequency}</span>
            <span className="text-sm text-white">{metrics.dominantFrequency} Hz</span>
          </div>

          {/* Problematic Frequencies */}
          {metrics.problematicFrequencies.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium text-red-400">{dictionary.microphone.advanced.detectedIssues}</span>
              </div>
              <ul className="space-y-1">
                {metrics.problematicFrequencies.map((issue, i) => (
                  <li key={i} className="text-xs text-red-300">
                    {issue.type} {dictionary.microphone.advanced.detectedAt} {issue.freq}Hz
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {mode === 'spectrogram' && (
        <div>
          <canvas
            ref={spectrogramCanvasRef}
            width={300}
            height={128}
            className="w-full h-32 rounded bg-gray-800"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{dictionary.microphone.advanced.time}</span>
            <span>{dictionary.microphone.advanced.frequencyLowHigh}</span>
          </div>
        </div>
      )}
    </div>
  );
}
