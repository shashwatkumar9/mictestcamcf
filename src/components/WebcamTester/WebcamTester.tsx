'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { SavedRecordings } from './SavedRecordings';
import { VideoMetricsOverlay } from './VideoMetricsOverlay';
import { HistogramDisplay } from './HistogramDisplay';
import { FramingOverlay } from './FramingOverlay';
import { AdvancedCameraControls } from './AdvancedCameraControls';
import { BackgroundBlur } from './BackgroundBlur';
import { FaceDetection } from './FaceDetection';
import {
  getMediaDevices,
  getVideoConstraints,
  videoResolutions,
  type MediaDevice,
} from '@/lib/mediaDevices';
import {
  saveRecording,
  generateRecordingId,
  type Recording,
} from '@/lib/storage';
import type { Dictionary } from '@/lib/getDictionary';

interface WebcamTesterProps {
  dictionary: Dictionary;
}

const filterKeys = ['normal', 'grayscale', 'sepia', 'invert', 'blur', 'brightness', 'contrast', 'hueRotate', 'saturate'] as const;

const filterCss: Record<string, string> = {
  none: 'none',
  grayscale: 'grayscale(100%)',
  sepia: 'sepia(100%)',
  invert: 'invert(100%)',
  blur: 'blur(3px)',
  brightness: 'brightness(150%)',
  contrast: 'contrast(150%)',
  hueRotate: 'hue-rotate(90deg)',
  saturate: 'saturate(200%)',
};

export function WebcamTester({ dictionary }: WebcamTesterProps) {
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [devices, setDevices] = useState<MediaDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [selectedQuality, setSelectedQuality] = useState<string>('720p');
  const [selectedFilter, setSelectedFilter] = useState<string>('none');
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [brightnessLevel, setBrightnessLevel] = useState(100);
  const [contrastLevel, setContrastLevel] = useState(100);
  const [motionLevel, setMotionLevel] = useState(0);
  const [isComparingCameras, setIsComparingCameras] = useState(false);
  const [secondCameraDevice, setSecondCameraDevice] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motionCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const stream2Ref = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const motionDetectionRef = useRef<NodeJS.Timeout | null>(null);
  const previousFrameRef = useRef<ImageData | null>(null);

  // Motion Detection
  const detectMotion = useCallback(() => {
    if (!videoRef.current || !motionCanvasRef.current || !isActive) return;

    const video = videoRef.current;
    const canvas = motionCanvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx || video.videoWidth === 0) return;

    canvas.width = 320;
    canvas.height = 240;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (previousFrameRef.current) {
      let diffCount = 0;
      const threshold = 30;

      for (let i = 0; i < currentFrame.data.length; i += 4) {
        const diff = Math.abs(currentFrame.data[i] - previousFrameRef.current.data[i]) +
                     Math.abs(currentFrame.data[i + 1] - previousFrameRef.current.data[i + 1]) +
                     Math.abs(currentFrame.data[i + 2] - previousFrameRef.current.data[i + 2]);

        if (diff > threshold) {
          diffCount++;
        }
      }

      const motionPercentage = Math.min(100, (diffCount / (canvas.width * canvas.height)) * 100 * 5);
      setMotionLevel(Math.round(motionPercentage));
    }

    previousFrameRef.current = currentFrame;
  }, [isActive]);

  useEffect(() => {
    if (isActive && showAdvanced) {
      motionDetectionRef.current = setInterval(detectMotion, 200);
    } else {
      if (motionDetectionRef.current) {
        clearInterval(motionDetectionRef.current);
        motionDetectionRef.current = null;
      }
      setMotionLevel(0);
      previousFrameRef.current = null;
    }

    return () => {
      if (motionDetectionRef.current) {
        clearInterval(motionDetectionRef.current);
      }
    };
  }, [isActive, showAdvanced, detectMotion]);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (stream2Ref.current) {
      stream2Ref.current.getTracks().forEach((track) => track.stop());
      stream2Ref.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (videoRef2.current) {
      videoRef2.current.srcObject = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (motionDetectionRef.current) {
      clearInterval(motionDetectionRef.current);
      motionDetectionRef.current = null;
    }
    setIsActive(false);
    setIsRecording(false);
    setRecordingTime(0);
    setMotionLevel(0);
    previousFrameRef.current = null;
  }, []);

  const startStream = useCallback(async () => {
    try {
      setError(null);
      const resolution = videoResolutions[selectedQuality];
      const constraints = getVideoConstraints({
        deviceId: selectedDevice || undefined,
        width: resolution.width,
        height: resolution.height,
      });

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Refresh device list to get proper labels
      const updatedDevices = await getMediaDevices('videoinput');
      setDevices(updatedDevices);
      if (!selectedDevice && updatedDevices.length > 0) {
        setSelectedDevice(updatedDevices[0].deviceId);
      }

      setIsActive(true);

      // Start second camera if comparing
      if (isComparingCameras && secondCameraDevice && videoRef2.current) {
        try {
          const constraints2 = getVideoConstraints({
            deviceId: secondCameraDevice,
            width: resolution.width,
            height: resolution.height,
          });

          const stream2 = await navigator.mediaDevices.getUserMedia(constraints2);
          stream2Ref.current = stream2;
          videoRef2.current.srcObject = stream2;
        } catch (err) {
          console.error('Error accessing second webcam:', err);
        }
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Could not access webcam. Please ensure you have granted permission.');
    }
  }, [selectedDevice, selectedQuality, devices, isComparingCameras, secondCameraDevice]);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
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

        const recording: Recording = {
          id: generateRecordingId(),
          type: 'video',
          blob,
          timestamp: Date.now(),
          duration,
          deviceName: devices.find((d) => d.deviceId === selectedDevice)?.label || 'Camera',
          metadata: {
            resolution: selectedQuality,
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
  }, [devices, selectedDevice, selectedQuality]);

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

  const takeSnapshot = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Apply filter to canvas
        const currentCss = filterCss[selectedFilter] || 'none';
        ctx.filter = currentCss;
        ctx.drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `snapshot-${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(link.href);
          }
        }, 'image/png');
      }
    }
  }, [selectedFilter]);

  useEffect(() => {
    getMediaDevices('videoinput').then(setDevices);
    return () => {
      stopStream();
    };
  }, [stopStream]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentFilterCss = filterCss[selectedFilter] || 'none';
  const filters = filterKeys.map((key) => ({
    value: key === 'normal' ? 'none' : key,
    label: dictionary.webcam.filters[key],
  }));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="space-y-4 mb-6">
          {/* Primary Settings Row */}
          <div className="flex flex-wrap gap-4">
            <Select
              label={dictionary.webcam.deviceLabel}
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              options={devices.map((d) => ({ value: d.deviceId, label: d.label }))}
              disabled={isActive}
            />
            <Select
              label={dictionary.webcam.qualityLabel}
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              options={Object.keys(videoResolutions).map((q) => ({ value: q, label: q }))}
              disabled={isActive}
            />
            <Select
              label={dictionary.webcam.filterLabel}
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              options={filters.map((f) => ({ value: f.value, label: f.label }))}
            />
          </div>

          {/* Advanced Pre-Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {/* Mirror Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.webcam.mirrorMode}
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMirrored}
                  onChange={(e) => setIsMirrored(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">{dictionary.webcam.flipHorizontally}</span>
              </label>
            </div>

            {/* Zoom Preset */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.webcam.digitalZoom}
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => setZoomLevel(1)}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${zoomLevel === 1 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  1x
                </button>
                <button
                  onClick={() => setZoomLevel(1.5)}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${zoomLevel === 1.5 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  1.5x
                </button>
                <button
                  onClick={() => setZoomLevel(2)}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${zoomLevel === 2 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  2x
                </button>
                <button
                  onClick={() => setZoomLevel(3)}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${zoomLevel === 3 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  3x
                </button>
              </div>
            </div>

            {/* Brightness Preset */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.webcam.brightness}
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => setBrightnessLevel(75)}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${brightnessLevel === 75 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {dictionary.webcam.dark}
                </button>
                <button
                  onClick={() => setBrightnessLevel(100)}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${brightnessLevel === 100 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {dictionary.webcam.normal}
                </button>
                <button
                  onClick={() => setBrightnessLevel(125)}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${brightnessLevel === 125 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {dictionary.webcam.bright}
                </button>
              </div>
            </div>

            {/* Contrast Preset */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.webcam.contrast}
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => setContrastLevel(75)}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${contrastLevel === 75 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {dictionary.webcam.low}
                </button>
                <button
                  onClick={() => setContrastLevel(100)}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${contrastLevel === 100 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {dictionary.webcam.normal}
                </button>
                <button
                  onClick={() => setContrastLevel(125)}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${contrastLevel === 125 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {dictionary.webcam.high}
                </button>
              </div>
            </div>

            {/* Compare Cameras Toggle - Always visible */}
            {!isActive && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dictionary.webcam.cameraComparison}
</label>
                <label className={`flex items-center gap-2 mb-3 ${devices.length > 1 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                  <input
                    type="checkbox"
                    checked={isComparingCameras}
                    onChange={(e) => setIsComparingCameras(e.target.checked)}
                    disabled={devices.length <= 1}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className={`text-sm ${devices.length > 1 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    {dictionary.webcam.compareSideBySide} {devices.length <= 1 && dictionary.webcam.requires2Cameras}
                  </span>
                </label>

                {/* Second Camera Selector - appears when comparison is enabled */}
                {isComparingCameras && devices.length > 1 && (
                  <div className="mt-3">
                    <Select
                      label={dictionary.webcam.secondCamera}
                      value={secondCameraDevice}
                      onChange={(e) => setSecondCameraDevice(e.target.value)}
                      options={devices.filter(d => d.deviceId !== selectedDevice).map((d) => ({ value: d.deviceId, label: d.label }))}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {!isActive ? (
            <Button onClick={startStream} size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {dictionary.webcam.testCamera}
            </Button>
          ) : (
            <>
              <Button onClick={stopStream} variant="danger" size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {dictionary.webcam.stopCamera}
              </Button>

              {!isRecording ? (
                <Button onClick={startRecording} variant="primary" size="lg">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="6" />
                  </svg>
                  {dictionary.webcam.record}
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="secondary" size="lg">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                  {dictionary.webcam.stopRecording}
                </Button>
              )}

              <Button onClick={takeSnapshot} variant="secondary" size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {dictionary.webcam.snapshotButton}
              </Button>
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
            {showAdvanced ? dictionary.webcam.hideAdvanced : dictionary.webcam.showAdvanced}
          </Button>
        </div>

        {/* Fine-Tune Controls - Zoom, Brightness, Contrast */}
        {isActive && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">{dictionary.webcam.fineTuneWhileRecording}</h3>

            {/* Zoom Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.webcam.digitalZoom}: {zoomLevel}x
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => setZoomLevel(1)}
                    className={`px-3 py-1 text-xs font-medium rounded ${zoomLevel === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    1x
                  </button>
                  <button
                    onClick={() => setZoomLevel(2)}
                    className={`px-3 py-1 text-xs font-medium rounded ${zoomLevel === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    2x
                  </button>
                  <button
                    onClick={() => setZoomLevel(3)}
                    className={`px-3 py-1 text-xs font-medium rounded ${zoomLevel === 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    3x
                  </button>
                </div>
              </div>
            </div>

            {/* Brightness Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.webcam.brightness}: {brightnessLevel}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={brightnessLevel}
                onChange={(e) => setBrightnessLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Contrast Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.webcam.contrast}: {contrastLevel}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={contrastLevel}
                onChange={(e) => setContrastLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Video Preview */}
      <div className={`relative bg-gray-900 rounded-2xl overflow-hidden ${isComparingCameras && isActive ? 'grid grid-cols-2 gap-1' : ''} ${!isComparingCameras ? 'aspect-video' : ''}`}>
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p>{dictionary.webcam.permissionMessage}</p>
            </div>
          </div>
        )}

        {/* Primary Camera */}
        <div className={`relative ${isComparingCameras && isActive ? 'aspect-video' : 'w-full h-full'}`}>
          {isComparingCameras && isActive && (
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium z-10">
              {dictionary.webcam.camera1}
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{
              filter: currentFilterCss !== 'none'
                ? `${currentFilterCss} brightness(${brightnessLevel}%) contrast(${contrastLevel}%)`
                : `brightness(${brightnessLevel}%) contrast(${contrastLevel}%)`,
              transform: `scaleX(${isMirrored ? -1 : 1}) scale(${zoomLevel})`,
              transformOrigin: 'center center',
            }}
          />

          {/* Video Metrics Overlay - Only for primary camera */}
          {!isComparingCameras && (
            <>
              <VideoMetricsOverlay
                videoRef={videoRef}
                stream={streamRef.current}
                isActive={isActive}
                dictionary={dictionary}
              />

              {/* Framing Overlay (Grid & Face Guide) */}
              <FramingOverlay videoRef={videoRef} isActive={isActive} dictionary={dictionary} />

              {/* Face Detection */}
              {showAdvanced && <FaceDetection videoRef={videoRef} isActive={isActive} dictionary={dictionary} />}
            </>
          )}
        </div>

        {/* Second Camera */}
        {isComparingCameras && isActive && secondCameraDevice && (
          <div className="relative aspect-video">
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium z-10">
              {dictionary.webcam.camera2}
            </div>
            <video
              ref={videoRef2}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{
                filter: currentFilterCss && currentFilterCss !== 'none'
                  ? `${currentFilterCss} brightness(${brightnessLevel}%) contrast(${contrastLevel}%)`
                  : `brightness(${brightnessLevel}%) contrast(${contrastLevel}%)`,
                transform: `scaleX(${isMirrored ? -1 : 1}) scale(${zoomLevel})`,
                transformOrigin: 'center center',
              }}
            />
          </div>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            {dictionary.webcam.recording} {formatTime(recordingTime)}
          </div>
        )}

        {/* Motion Detection Indicator */}
        {isActive && showAdvanced && motionLevel > 0 && (
          <div className="absolute top-4 right-4 bg-green-500/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>{dictionary.webcam.motion}: {motionLevel}%</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={motionCanvasRef} className="hidden" />
      </div>

      {/* Advanced Controls Section */}
      {showAdvanced && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Analysis */}
          <HistogramDisplay videoRef={videoRef} isActive={isActive} dictionary={dictionary} />

          {/* Advanced Camera Controls */}
          <AdvancedCameraControls stream={streamRef.current} isActive={isActive} dictionary={dictionary} />

          {/* Background Blur */}
          <BackgroundBlur videoRef={videoRef} isActive={isActive} dictionary={dictionary} />
        </div>
      )}

      {/* Saved Recordings */}
      <SavedRecordings dictionary={dictionary} refreshKey={refreshKey} />
    </div>
  );
}
