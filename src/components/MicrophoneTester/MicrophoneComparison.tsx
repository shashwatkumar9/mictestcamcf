'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { getMediaDevices, type MediaDevice } from '@/lib/mediaDevices';
import type { Dictionary } from '@/lib/getDictionary';

interface MicrophoneComparisonProps {
  isActive: boolean;
  dictionary: Dictionary;
}

interface MicMetrics {
  rms: number;
  peak: number;
  noiseFloor: number;
}

export function MicrophoneComparison({ isActive, dictionary }: MicrophoneComparisonProps) {
  const [devices, setDevices] = useState<MediaDevice[]>([]);
  const [micA, setMicA] = useState<string>('');
  const [micB, setMicB] = useState<string>('');
  const [comparing, setComparing] = useState(false);
  const [activeMic, setActiveMic] = useState<'A' | 'B'>('A');
  const [metricsA, setMetricsA] = useState<MicMetrics>({ rms: -60, peak: -60, noiseFloor: -60 });
  const [metricsB, setMetricsB] = useState<MicMetrics>({ rms: -60, peak: -60, noiseFloor: -60 });

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const noiseFloorRef = useRef<number[]>([]);

  useEffect(() => {
    getMediaDevices('audioinput').then(setDevices);
  }, []);

  const stopComparison = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setComparing(false);
    noiseFloorRef.current = [];
  }, []);

  const startMic = useCallback(async (deviceId: string) => {
    // Stop existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      await audioContextRef.current.close();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } },
      });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      noiseFloorRef.current = [];

      const analyze = () => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);
        analyserRef.current.getFloatTimeDomainData(dataArray);

        // Calculate metrics
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

        // Track noise floor
        noiseFloorRef.current.push(rmsDb);
        if (noiseFloorRef.current.length > 50) {
          noiseFloorRef.current.shift();
        }
        const sortedNoise = [...noiseFloorRef.current].sort((a, b) => a - b);
        const noiseFloor = sortedNoise[Math.floor(sortedNoise.length * 0.1)] || -60;

        const metrics = {
          rms: Math.round(rmsDb),
          peak: Math.round(peakDb),
          noiseFloor: Math.round(noiseFloor),
        };

        if (activeMic === 'A') {
          setMetricsA(metrics);
        } else {
          setMetricsB(metrics);
        }

        animationRef.current = requestAnimationFrame(analyze);
      };

      analyze();
    } catch (err) {
      console.error('Failed to start microphone:', err);
    }
  }, [activeMic]);

  const handleStartComparison = async () => {
    if (!micA || !micB) return;
    setComparing(true);
    setActiveMic('A');
    await startMic(micA);
  };

  const handleSwitchMic = async () => {
    const newActiveMic = activeMic === 'A' ? 'B' : 'A';
    setActiveMic(newActiveMic);
    noiseFloorRef.current = [];
    await startMic(newActiveMic === 'A' ? micA : micB);
  };

  useEffect(() => {
    return () => {
      stopComparison();
    };
  }, [stopComparison]);

  if (!isActive) return null;

  const getMicLabel = (deviceId: string) => {
    return devices.find((d) => d.deviceId === deviceId)?.label || 'Unknown';
  };

  const renderMetricBar = (label: string, valueA: number, valueB: number, min: number, max: number) => {
    const rangeA = ((valueA - min) / (max - min)) * 100;
    const rangeB = ((valueB - min) / (max - min)) * 100;

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{label}</span>
          <span>A: {valueA}dB / B: {valueB}dB</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-150"
                style={{ width: `${Math.max(0, Math.min(100, rangeA))}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-150"
                style={{ width: `${Math.max(0, Math.min(100, rangeB))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-medium text-white">{dictionary.microphone.comparison.title}</h3>

      {!comparing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label={dictionary.microphone.comparison.microphoneA}
              value={micA}
              onChange={(e) => setMicA(e.target.value)}
              options={[
                { value: '', label: dictionary.microphone.comparison.selectMicrophone },
                ...devices.map((d) => ({ value: d.deviceId, label: d.label })),
              ]}
            />
            <Select
              label={dictionary.microphone.comparison.microphoneB}
              value={micB}
              onChange={(e) => setMicB(e.target.value)}
              options={[
                { value: '', label: dictionary.microphone.comparison.selectMicrophone },
                ...devices.map((d) => ({ value: d.deviceId, label: d.label })),
              ]}
            />
          </div>

          <Button
            onClick={handleStartComparison}
            disabled={!micA || !micB || micA === micB}
            className="w-full"
          >
            {dictionary.microphone.comparison.startComparison}
          </Button>

          {micA === micB && micA && (
            <p className="text-xs text-yellow-500 text-center">
              {dictionary.microphone.comparison.selectTwoDifferent}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Mic Indicator */}
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${activeMic === 'A' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
              <div>
                <p className="text-sm text-white">
                  {activeMic === 'A' ? dictionary.microphone.comparison.micA : dictionary.microphone.comparison.micB} {dictionary.microphone.comparison.active}
                </p>
                <p className="text-xs text-gray-400">
                  {getMicLabel(activeMic === 'A' ? micA : micB)}
                </p>
              </div>
            </div>
            <Button onClick={handleSwitchMic} variant="secondary" size="sm">
              {dictionary.microphone.comparison.switchTo} {activeMic === 'A' ? 'B' : 'A'}
            </Button>
          </div>

          {/* Comparison Metrics */}
          <div className="space-y-3">
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-indigo-500" />
                <span className="text-gray-400">{dictionary.microphone.comparison.micA}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span className="text-gray-400">{dictionary.microphone.comparison.micB}</span>
              </div>
            </div>

            {renderMetricBar(dictionary.microphone.comparison.rmsLevel, metricsA.rms, metricsB.rms, -60, 0)}
            {renderMetricBar(dictionary.microphone.comparison.peakLevel, metricsA.peak, metricsB.peak, -60, 0)}
            {renderMetricBar(dictionary.microphone.advanced.noiseFloor, metricsA.noiseFloor, metricsB.noiseFloor, -80, -20)}

            {/* SNR Comparison */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400">
                  {Math.max(0, metricsA.rms - metricsA.noiseFloor)}
                </div>
                <div className="text-xs text-gray-400">{dictionary.microphone.comparison.snr} - {dictionary.microphone.comparison.micA}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {Math.max(0, metricsB.rms - metricsB.noiseFloor)}
                </div>
                <div className="text-xs text-gray-400">{dictionary.microphone.comparison.snr} - {dictionary.microphone.comparison.micB}</div>
              </div>
            </div>
          </div>

          <Button onClick={stopComparison} variant="secondary" className="w-full">
            {dictionary.microphone.comparison.stopComparison}
          </Button>
        </div>
      )}
    </div>
  );
}
