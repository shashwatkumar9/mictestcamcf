'use client';

import { useState, useRef, useEffect } from 'react';
import type { Dictionary } from '@/lib/getDictionary';

interface AudioProcessingControlsProps {
  stream: MediaStream | null;
  isActive: boolean;
  dictionary: Dictionary;
}

export function AudioProcessingControls({ stream, isActive, dictionary }: AudioProcessingControlsProps) {
  const [noiseSuppression, setNoiseSuppression] = useState(false);
  const [echoCancellation, setEchoCancellation] = useState(false);
  const [autoGainControl, setAutoGainControl] = useState(false);
  const [directMonitoring, setDirectMonitoring] = useState(false);
  const [monitorVolume, setMonitorVolume] = useState(0.5);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if (!stream || !isActive) return;

    const track = stream.getAudioTracks()[0];
    if (!track) return;

    // Apply audio constraints
    const applyConstraints = async () => {
      try {
        await track.applyConstraints({
          noiseSuppression,
          echoCancellation,
          autoGainControl,
        });
      } catch (err) {
        console.error('Failed to apply audio constraints:', err);
      }
    };

    applyConstraints();
  }, [stream, isActive, noiseSuppression, echoCancellation, autoGainControl]);

  useEffect(() => {
    if (!stream || !isActive) {
      // Cleanup when inactive
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      return;
    }

    if (directMonitoring) {
      // Create audio context for monitoring
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = source;

      const gainNode = audioContext.createGain();
      gainNode.gain.value = monitorVolume;
      gainNodeRef.current = gainNode;

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
    } else {
      // Disconnect monitoring
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stream, isActive, directMonitoring]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = monitorVolume;
    }
  }, [monitorVolume]);

  if (!isActive) return null;

  return (
    <div className="bg-gray-900 rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-medium text-white">{dictionary.microphone.processing.title}</h3>

      <div className="space-y-3">
        {/* Noise Suppression */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-white">{dictionary.microphone.processing.noiseSuppression}</span>
            <p className="text-xs text-gray-500">{dictionary.microphone.processing.reduceBackgroundNoise}</p>
          </div>
          <button
            onClick={() => setNoiseSuppression(!noiseSuppression)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              noiseSuppression ? 'bg-indigo-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                noiseSuppression ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Echo Cancellation */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-white">{dictionary.microphone.processing.echoCancellation}</span>
            <p className="text-xs text-gray-500">{dictionary.microphone.processing.removeAudioFeedback}</p>
          </div>
          <button
            onClick={() => setEchoCancellation(!echoCancellation)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              echoCancellation ? 'bg-indigo-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                echoCancellation ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Auto Gain Control */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-white">{dictionary.microphone.processing.autoGainControl}</span>
            <p className="text-xs text-gray-500">{dictionary.microphone.processing.normalizeVolumeLevels}</p>
          </div>
          <button
            onClick={() => setAutoGainControl(!autoGainControl)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoGainControl ? 'bg-indigo-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoGainControl ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="border-t border-gray-800 pt-3">
          {/* Direct Monitoring */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-sm text-white">{dictionary.microphone.processing.directMonitoring}</span>
              <p className="text-xs text-gray-500">{dictionary.microphone.processing.listenToYourMic}</p>
            </div>
            <button
              onClick={() => setDirectMonitoring(!directMonitoring)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                directMonitoring ? 'bg-indigo-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  directMonitoring ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {directMonitoring && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">{dictionary.microphone.processing.monitorVolume}</span>
                <span className="text-white">{Math.round(monitorVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={monitorVolume}
                onChange={(e) => setMonitorVolume(Number(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <p className="text-xs text-yellow-500">
                {dictionary.microphone.processing.useHeadphones}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
