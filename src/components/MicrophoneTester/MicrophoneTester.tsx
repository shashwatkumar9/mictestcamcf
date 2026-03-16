'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { AudioVisualizer } from './AudioVisualizer';
import { SavedRecordings } from './SavedRecordings';
import { AdvancedAudioAnalyzer } from './AdvancedAudioAnalyzer';
import { AudioProcessingControls } from './AudioProcessingControls';
import { MicrophoneComparison } from './MicrophoneComparison';
import {
  getMediaDevices,
  getAudioConstraints,
  sampleRates,
  channelOptions,
  type MediaDevice,
} from '@/lib/mediaDevices';
import {
  saveRecording,
  generateRecordingId,
  type Recording,
} from '@/lib/storage';
import type { Dictionary } from '@/lib/getDictionary';

interface MicrophoneTesterProps {
  dictionary: Dictionary;
}

export function MicrophoneTester({ dictionary }: MicrophoneTesterProps) {
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [devices, setDevices] = useState<MediaDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [selectedSampleRate, setSelectedSampleRate] = useState<number>(48000);
  const [selectedChannels, setSelectedChannels] = useState<number>(1);
  const [audioLevel, setAudioLevel] = useState(0);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(32));
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inputGain, setInputGain] = useState(100);
  const [noiseSuppressionEnabled, setNoiseSuppressionEnabled] = useState(true);
  const [echoCancellationEnabled, setEchoCancellationEnabled] = useState(true);
  const [autoGainEnabled, setAutoGainEnabled] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [secondMicDevice, setSecondMicDevice] = useState<string>('');

  const streamRef = useRef<MediaStream | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const stopStream = useCallback(() => {
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
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    analyserRef.current = null;
    gainNodeRef.current = null;
    setIsActive(false);
    setIsRecording(false);
    setRecordingTime(0);
    setAudioLevel(0);
    setFrequencyData(new Uint8Array(32));
  }, []);

  // Update gain node when inputGain changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = inputGain / 100;
    }
  }, [inputGain]);

  const updateAudioData = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // Calculate audio level (RMS)
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / dataArray.length);
    const level = Math.min(100, (rms / 128) * 100);
    setAudioLevel(level);

    // Get 32-band frequency data
    const bands = 32;
    const bandSize = Math.floor(dataArray.length / bands);
    const freqData = new Uint8Array(bands);
    for (let i = 0; i < bands; i++) {
      let sum = 0;
      for (let j = 0; j < bandSize; j++) {
        sum += dataArray[i * bandSize + j];
      }
      freqData[i] = Math.floor(sum / bandSize);
    }
    setFrequencyData(freqData);

    animationRef.current = requestAnimationFrame(updateAudioData);
  }, []);

  const startTesting = useCallback(async () => {
    try {
      setError(null);
      const constraints = getAudioConstraints({
        deviceId: selectedDevice || undefined,
        sampleRate: selectedSampleRate,
        channelCount: selectedChannels,
        noiseSuppression: noiseSuppressionEnabled,
        echoCancellation: echoCancellationEnabled,
        autoGainControl: autoGainEnabled,
      });

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Refresh device list to get proper labels
      const updatedDevices = await getMediaDevices('audioinput');
      setDevices(updatedDevices);
      if (!selectedDevice && updatedDevices.length > 0) {
        setSelectedDevice(updatedDevices[0].deviceId);
      }

      // Set up Web Audio API for visualization
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);

      // Add gain node for input gain control
      const gainNode = audioContext.createGain();
      gainNode.gain.value = inputGain / 100;
      gainNodeRef.current = gainNode;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      source.connect(gainNode);
      gainNode.connect(analyser);
      analyserRef.current = analyser;

      // Start audio visualization
      updateAudioData();

      setIsActive(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please ensure you have granted permission.');
    }
  }, [selectedDevice, selectedSampleRate, selectedChannels, noiseSuppressionEnabled, echoCancellationEnabled, autoGainEnabled, inputGain, updateAudioData]);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    try {
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const duration = (Date.now() - startTimeRef.current) / 1000;

        const recording: Recording = {
          id: generateRecordingId(),
          type: 'audio',
          blob,
          timestamp: Date.now(),
          duration,
          deviceName: devices.find((d) => d.deviceId === selectedDevice)?.label || 'Microphone',
          metadata: {
            sampleRate: selectedSampleRate,
            channels: selectedChannels,
          },
        };

        await saveRecording(recording);
        setRefreshKey((prev) => prev + 1);
        chunksRef.current = [];
      };

      mediaRecorder.start(1000);
      startTimeRef.current = Date.now();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  }, [devices, selectedDevice, selectedSampleRate, selectedChannels]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
    setRecordingTime(0);
  }, []);

  const stopMicrophone = useCallback(() => {
    stopStream();
  }, [stopStream]);

  useEffect(() => {
    getMediaDevices('audioinput').then(setDevices);
    return () => {
      stopStream();
    };
  }, [stopStream]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <Select
            label={dictionary.microphone.deviceLabel}
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            options={devices.map((d) => ({ value: d.deviceId, label: d.label }))}
            disabled={isActive}
          />
          <Select
            label={dictionary.microphone.sampleRateLabel}
            value={selectedSampleRate}
            onChange={(e) => setSelectedSampleRate(Number(e.target.value))}
            options={sampleRates}
            disabled={isActive}
          />
          <Select
            label={dictionary.microphone.channelLabel}
            value={selectedChannels}
            onChange={(e) => setSelectedChannels(Number(e.target.value))}
            options={channelOptions}
            disabled={isActive}
          />
        </div>

        {/* Advanced Pre-Settings */}
        {!isActive && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 mt-6">
            {/* Input Gain Preset */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.microphone.inputGain}
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => setInputGain(50)}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${inputGain === 50 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {dictionary.microphone.low}
                </button>
                <button
                  onClick={() => setInputGain(100)}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${inputGain === 100 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {dictionary.microphone.normal}
                </button>
                <button
                  onClick={() => setInputGain(150)}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${inputGain === 150 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {dictionary.microphone.boost}
                </button>
              </div>
            </div>

            {/* Noise Suppression Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.microphone.noiseSuppression}
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noiseSuppressionEnabled}
                  onChange={(e) => setNoiseSuppressionEnabled(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">{dictionary.microphone.enableNoiseReduction}</span>
              </label>
            </div>

            {/* Echo Cancellation Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.microphone.echoCancellation}
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={echoCancellationEnabled}
                  onChange={(e) => setEchoCancellationEnabled(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">{dictionary.microphone.reduceEchoFeedback}</span>
              </label>
            </div>

            {/* Auto Gain Control Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.microphone.autoGainControl}
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoGainEnabled}
                  onChange={(e) => setAutoGainEnabled(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">{dictionary.microphone.autoAdjustVolume}</span>
              </label>
            </div>

            {/* Microphone Comparison Toggle - Always visible */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.microphone.microphoneComparison}
              </label>
              <label className={`flex items-center gap-2 mb-3 ${devices.length > 1 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                <input
                  type="checkbox"
                  checked={isComparing}
                  onChange={(e) => setIsComparing(e.target.checked)}
                  disabled={devices.length <= 1}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className={`text-sm ${devices.length > 1 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {dictionary.microphone.compareSideBySide} {devices.length <= 1 && dictionary.microphone.requires2Mics}
                </span>
              </label>

              {/* Second Microphone Selector - appears when comparison is enabled */}
              {isComparing && devices.length > 1 && (
                <div className="mt-3">
                  <Select
                    label={dictionary.microphone.secondMicrophone}
                    value={secondMicDevice}
                    onChange={(e) => setSecondMicDevice(e.target.value)}
                    options={devices.filter(d => d.deviceId !== selectedDevice).map((d) => ({ value: d.deviceId, label: d.label }))}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-6">
          {!isActive ? (
            <Button onClick={startTesting} size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              {dictionary.microphone.testMicrophone}
            </Button>
          ) : (
            <>
              <Button onClick={stopMicrophone} variant="danger" size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {dictionary.microphone.stopMicrophone}
              </Button>

              {!isRecording ? (
                <Button onClick={startRecording} variant="primary" size="lg">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="6" />
                  </svg>
                  {dictionary.microphone.record}
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="secondary" size="lg">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                  {dictionary.microphone.stopRecording}
                </Button>
              )}
            </>
          )}
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="ghost"
            size="lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            {showAdvanced ? dictionary.microphone.hideAdvanced : dictionary.microphone.showAdvanced}
          </Button>
        </div>

        {/* Fine-Tune Controls - Input Gain */}
        {isActive && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">{dictionary.microphone.fineTuneWhileTesting}</h3>

            {/* Input Gain Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.microphone.inputGain}: {inputGain}%
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="5"
                  value={inputGain}
                  onChange={(e) => setInputGain(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => setInputGain(50)}
                    className={`px-3 py-1 text-xs font-medium rounded ${inputGain === 50 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {dictionary.microphone.low}
                  </button>
                  <button
                    onClick={() => setInputGain(100)}
                    className={`px-3 py-1 text-xs font-medium rounded ${inputGain === 100 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {dictionary.microphone.normal}
                  </button>
                  <button
                    onClick={() => setInputGain(150)}
                    className={`px-3 py-1 text-xs font-medium rounded ${inputGain === 150 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {dictionary.microphone.boost}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audio Visualizer */}
      <AudioVisualizer
        dictionary={dictionary}
        isActive={isActive}
        isRecording={isRecording}
        recordingTime={recordingTime}
        audioLevel={audioLevel}
        frequencyData={frequencyData}
        error={error}
        formatTime={formatTime}
      />

      {/* Advanced Controls Section */}
      {showAdvanced && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Advanced Audio Analysis */}
          <AdvancedAudioAnalyzer
            analyser={analyserRef.current}
            isActive={isActive}
            dictionary={dictionary}
          />

          {/* Audio Processing Controls */}
          <AudioProcessingControls
            stream={streamRef.current}
            isActive={isActive}
            dictionary={dictionary}
          />

          {/* A/B Microphone Comparison */}
          <div className="lg:col-span-2">
            <MicrophoneComparison isActive={!isActive} dictionary={dictionary} />
          </div>
        </div>
      )}

      {/* Saved Recordings */}
      <SavedRecordings dictionary={dictionary} refreshKey={refreshKey} />
    </div>
  );
}
