'use client';

import { useEffect, useState } from 'react';
import type { Dictionary } from '@/lib/getDictionary';

interface AdvancedCameraControlsProps {
  stream: MediaStream | null;
  isActive: boolean;
  dictionary: Dictionary;
}

interface CameraCapabilities {
  brightness?: { min: number; max: number; step: number };
  contrast?: { min: number; max: number; step: number };
  saturation?: { min: number; max: number; step: number };
  sharpness?: { min: number; max: number; step: number };
  exposureMode?: string[];
  exposureTime?: { min: number; max: number; step: number };
  focusMode?: string[];
  focusDistance?: { min: number; max: number; step: number };
  whiteBalanceMode?: string[];
  colorTemperature?: { min: number; max: number; step: number };
  zoom?: { min: number; max: number; step: number };
  pan?: { min: number; max: number; step: number };
  tilt?: { min: number; max: number; step: number };
}

interface CameraSettings {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  sharpness?: number;
  exposureMode?: string;
  exposureTime?: number;
  focusMode?: string;
  focusDistance?: number;
  whiteBalanceMode?: string;
  colorTemperature?: number;
  zoom?: number;
  pan?: number;
  tilt?: number;
}

export function AdvancedCameraControls({ stream, isActive, dictionary }: AdvancedCameraControlsProps) {
  const [capabilities, setCapabilities] = useState<CameraCapabilities>({});
  const [settings, setSettings] = useState<CameraSettings>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasAdvancedControls, setHasAdvancedControls] = useState(false);

  useEffect(() => {
    if (!stream || !isActive) return;

    const track = stream.getVideoTracks()[0];
    if (!track) return;

    try {
      // Get capabilities
      const caps = track.getCapabilities() as MediaTrackCapabilities & CameraCapabilities;
      const currentSettings = track.getSettings() as MediaTrackSettings & CameraSettings;

      const availableCaps: CameraCapabilities = {};

      // Check for each capability
      if (caps.brightness) availableCaps.brightness = caps.brightness as { min: number; max: number; step: number };
      if (caps.contrast) availableCaps.contrast = caps.contrast as { min: number; max: number; step: number };
      if (caps.saturation) availableCaps.saturation = caps.saturation as { min: number; max: number; step: number };
      if (caps.sharpness) availableCaps.sharpness = caps.sharpness as { min: number; max: number; step: number };
      if (caps.exposureMode) availableCaps.exposureMode = caps.exposureMode as string[];
      if (caps.exposureTime) availableCaps.exposureTime = caps.exposureTime as { min: number; max: number; step: number };
      if (caps.focusMode) availableCaps.focusMode = caps.focusMode as string[];
      if (caps.focusDistance) availableCaps.focusDistance = caps.focusDistance as { min: number; max: number; step: number };
      if (caps.whiteBalanceMode) availableCaps.whiteBalanceMode = caps.whiteBalanceMode as string[];
      if (caps.colorTemperature) availableCaps.colorTemperature = caps.colorTemperature as { min: number; max: number; step: number };
      if (caps.zoom) availableCaps.zoom = caps.zoom as { min: number; max: number; step: number };
      if (caps.pan) availableCaps.pan = caps.pan as { min: number; max: number; step: number };
      if (caps.tilt) availableCaps.tilt = caps.tilt as { min: number; max: number; step: number };

      setCapabilities(availableCaps);
      setSettings(currentSettings);
      setHasAdvancedControls(Object.keys(availableCaps).length > 0);
    } catch (err) {
      console.log('Advanced camera controls not supported:', err);
      setHasAdvancedControls(false);
    }
  }, [stream, isActive]);

  const applyConstraint = async (key: string, value: number | string) => {
    if (!stream) return;

    const track = stream.getVideoTracks()[0];
    if (!track) return;

    try {
      await track.applyConstraints({
        advanced: [{ [key]: value }],
      } as MediaTrackConstraints);

      setSettings((prev) => ({ ...prev, [key]: value }));
    } catch (err) {
      console.error(`Failed to apply ${key}:`, err);
    }
  };

  if (!isActive || !hasAdvancedControls) return null;

  const renderSlider = (
    label: string,
    key: keyof CameraCapabilities & keyof CameraSettings,
    unit: string = ''
  ) => {
    const cap = capabilities[key] as { min: number; max: number; step: number } | undefined;
    if (!cap) return null;

    const value = settings[key] as number | undefined;
    if (value === undefined) return null;

    return (
      <div key={key} className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">{label}</span>
          <span className="text-white">{Math.round(value)}{unit}</span>
        </div>
        <input
          type="range"
          min={cap.min}
          max={cap.max}
          step={cap.step}
          value={value}
          onChange={(e) => applyConstraint(key, Number(e.target.value))}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>
    );
  };

  const renderModeSelect = (
    label: string,
    key: keyof CameraCapabilities & keyof CameraSettings
  ) => {
    const modes = capabilities[key] as string[] | undefined;
    if (!modes || modes.length === 0) return null;

    const value = settings[key] as string | undefined;

    return (
      <div key={key} className="space-y-1">
        <label className="text-xs text-gray-400">{label}</label>
        <select
          value={value || ''}
          onChange={(e) => applyConstraint(key, e.target.value)}
          className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
        >
          {modes.map((mode) => (
            <option key={mode} value={mode}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
      >
        <span className="text-sm font-medium text-white">{dictionary.webcam.advanced.title}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          {/* Exposure Controls */}
          {(capabilities.exposureMode || capabilities.exposureTime) && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-indigo-400 uppercase tracking-wide">{dictionary.webcam.advanced.exposure}</h4>
              {renderModeSelect(dictionary.webcam.advanced.mode, 'exposureMode')}
              {renderSlider(dictionary.webcam.advanced.exposureTime, 'exposureTime', 'ms')}
            </div>
          )}

          {/* Focus Controls */}
          {(capabilities.focusMode || capabilities.focusDistance) && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-indigo-400 uppercase tracking-wide">{dictionary.webcam.advanced.focus}</h4>
              {renderModeSelect(dictionary.webcam.advanced.mode, 'focusMode')}
              {renderSlider(dictionary.webcam.advanced.distance, 'focusDistance')}
            </div>
          )}

          {/* White Balance */}
          {(capabilities.whiteBalanceMode || capabilities.colorTemperature) && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-indigo-400 uppercase tracking-wide">{dictionary.webcam.advanced.whiteBalance}</h4>
              {renderModeSelect(dictionary.webcam.advanced.mode, 'whiteBalanceMode')}
              {renderSlider(dictionary.webcam.advanced.temperature, 'colorTemperature', 'K')}
            </div>
          )}

          {/* Image Adjustments */}
          {(capabilities.brightness || capabilities.contrast || capabilities.saturation) && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-indigo-400 uppercase tracking-wide">{dictionary.webcam.advanced.image}</h4>
              {renderSlider(dictionary.webcam.brightness, 'brightness')}
              {renderSlider(dictionary.webcam.contrast, 'contrast')}
              {renderSlider(dictionary.webcam.advanced.saturation, 'saturation')}
              {renderSlider(dictionary.webcam.advanced.sharpness, 'sharpness')}
            </div>
          )}

          {/* PTZ Controls */}
          {(capabilities.zoom || capabilities.pan || capabilities.tilt) && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-indigo-400 uppercase tracking-wide">{dictionary.webcam.advanced.ptz}</h4>
              {renderSlider(dictionary.webcam.advanced.zoom, 'zoom', 'x')}
              {renderSlider(dictionary.webcam.advanced.pan, 'pan', '°')}
              {renderSlider(dictionary.webcam.advanced.tilt, 'tilt', '°')}
            </div>
          )}

          {Object.keys(capabilities).length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              {dictionary.webcam.advanced.noAdvancedControls}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
