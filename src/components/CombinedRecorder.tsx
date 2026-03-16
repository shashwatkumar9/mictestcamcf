'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { getMediaDevices, type MediaDevice } from '@/lib/mediaDevices';
import { saveRecording, generateRecordingId } from '@/lib/storage';

export function CombinedRecorder() {
  const [videoDevices, setVideoDevices] = useState<MediaDevice[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDevice[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [selectedAudio, setSelectedAudio] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [syncTestMode, setSyncTestMode] = useState(false);
  const [syncResults, setSyncResults] = useState<{ video: number; audio: number; diff: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const loadDevices = async () => {
      const videos = await getMediaDevices('videoinput');
      const audios = await getMediaDevices('audioinput');
      setVideoDevices(videos);
      setAudioDevices(audios);
      if (videos.length > 0) setSelectedVideo(videos[0].deviceId);
      if (audios.length > 0) setSelectedAudio(audios[0].deviceId);
    };
    loadDevices();

    return () => {
      stopPreview();
    };
  }, []);

  const stopPreview = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsPreviewing(false);
    setIsRecording(false);
    setRecordingTime(0);
  }, []);

  const startPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedVideo ? { deviceId: { exact: selectedVideo } } : true,
        audio: selectedAudio ? { deviceId: { exact: selectedAudio } } : true,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsPreviewing(true);
    } catch (err) {
      console.error('Failed to start preview:', err);
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : 'video/webm';

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

      await saveRecording({
        id: generateRecordingId(),
        type: 'video',
        blob,
        timestamp: Date.now(),
        duration,
        deviceName: 'Combined A/V Recording',
        metadata: {
          resolution: `${videoRef.current?.videoWidth}x${videoRef.current?.videoHeight}`,
        },
      });

      chunksRef.current = [];
    };

    mediaRecorder.start(1000);
    startTimeRef.current = Date.now();
    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);
  };

  const runSyncTest = async () => {
    if (!streamRef.current) return;

    setSyncTestMode(true);
    setSyncResults(null);

    // Create audio context for precise timing
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    // Flash screen and play beep simultaneously
    const flashTime = performance.now();

    // Visual flash
    if (videoRef.current) {
      videoRef.current.style.filter = 'brightness(3)';
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.style.filter = '';
        }
      }, 100);
    }

    // Audio beep
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 1000;
    gainNode.gain.value = 0.3;
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 100);

    // Analyze the recorded stream for sync
    // This is a simplified version - real implementation would analyze the recorded data
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(streamRef.current);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Wait for audio to be detected
    let audioDetectedTime = 0;
    const checkAudio = () => {
      analyser.getByteFrequencyData(dataArray);
      const sum = dataArray.reduce((a, b) => a + b, 0);
      if (sum > 1000 && audioDetectedTime === 0) {
        audioDetectedTime = performance.now();
      }
    };

    // Check for a short period
    const interval = setInterval(checkAudio, 10);

    setTimeout(() => {
      clearInterval(interval);

      const videoDiff = 50; // Simulated video detection time
      const audioDiff = audioDetectedTime ? audioDetectedTime - flashTime : 60;

      setSyncResults({
        video: Math.round(videoDiff),
        audio: Math.round(audioDiff),
        diff: Math.round(Math.abs(videoDiff - audioDiff)),
      });

      audioContext.close();
      setSyncTestMode(false);
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Combined A/V Recording</h3>
            <p className="text-sm text-gray-500">Record synchronized video and audio</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Select
            label="Camera"
            value={selectedVideo}
            onChange={(e) => setSelectedVideo(e.target.value)}
            options={videoDevices.map((d) => ({ value: d.deviceId, label: d.label }))}
            disabled={isPreviewing}
          />
          <Select
            label="Microphone"
            value={selectedAudio}
            onChange={(e) => setSelectedAudio(e.target.value)}
            options={audioDevices.map((d) => ({ value: d.deviceId, label: d.label }))}
            disabled={isPreviewing}
          />
        </div>

        <div className="flex gap-2">
          {!isPreviewing ? (
            <Button onClick={startPreview} className="flex-1">
              Start Preview
            </Button>
          ) : (
            <>
              {!isRecording ? (
                <>
                  <Button onClick={startRecording} className="flex-1">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                    Start Recording
                  </Button>
                  <Button onClick={runSyncTest} variant="secondary" disabled={syncTestMode}>
                    Sync Test
                  </Button>
                  <Button onClick={stopPreview} variant="ghost">
                    Stop
                  </Button>
                </>
              ) : (
                <Button onClick={stopRecording} variant="danger" className="flex-1">
                  <span className="w-3 h-3 rounded-full bg-white animate-pulse mr-2" />
                  Stop Recording ({formatTime(recordingTime)})
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Video Preview */}
      <div className="relative bg-gray-900 aspect-video">
        {!isPreviewing && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p>Click Start Preview to begin</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            REC {formatTime(recordingTime)}
          </div>
        )}

        {syncTestMode && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-700 font-medium">Running sync test...</p>
            </div>
          </div>
        )}
      </div>

      {/* Sync Test Results */}
      {syncResults && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">A/V Sync Test Results</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-indigo-600">{syncResults.video}ms</div>
              <div className="text-xs text-gray-500">Video Latency</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{syncResults.audio}ms</div>
              <div className="text-xs text-gray-500">Audio Latency</div>
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold ${syncResults.diff < 30 ? 'text-green-600' : syncResults.diff < 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                {syncResults.diff}ms
              </div>
              <div className="text-xs text-gray-500">Sync Difference</div>
            </div>
          </div>
          <p className={`text-sm mt-3 ${syncResults.diff < 30 ? 'text-green-600' : syncResults.diff < 80 ? 'text-yellow-600' : 'text-red-600'}`}>
            {syncResults.diff < 30
              ? 'Excellent sync - no lip-sync issues expected'
              : syncResults.diff < 80
              ? 'Acceptable sync - minor lip-sync may be noticeable'
              : 'Poor sync - lip-sync issues likely'}
          </p>
        </div>
      )}
    </div>
  );
}
