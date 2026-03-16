export interface MediaDevice {
  deviceId: string;
  kind: 'videoinput' | 'audioinput';
  label: string;
  groupId: string;
}

export async function getMediaDevices(kind: 'videoinput' | 'audioinput'): Promise<MediaDevice[]> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const filtered = devices
      .filter(device => device.kind === kind)
      .map(device => ({
        deviceId: device.deviceId,
        kind: device.kind as 'videoinput' | 'audioinput',
        label: device.label || `${kind === 'videoinput' ? 'Camera' : 'Microphone'} ${device.deviceId.slice(0, 4)}`,
        groupId: device.groupId
      }));

    // Remove duplicate "default" devices
    // If we have both "Default - Device Name" and "Device Name", keep only the non-default one
    const uniqueDevices: MediaDevice[] = [];
    const seenLabels = new Set<string>();

    for (const device of filtered) {
      const isDefault = device.label.toLowerCase().startsWith('default');
      const cleanLabel = device.label.replace(/^default\s*-\s*/i, '').trim();

      // If this is a default device, check if we already have the non-default version
      if (isDefault && seenLabels.has(cleanLabel)) {
        continue; // Skip this default device
      }

      // If this is a non-default device, remove any previously added default version
      if (!isDefault && seenLabels.has(device.label)) {
        const defaultIndex = uniqueDevices.findIndex(d =>
          d.label.toLowerCase().startsWith('default') &&
          d.label.replace(/^default\s*-\s*/i, '').trim() === device.label
        );
        if (defaultIndex !== -1) {
          uniqueDevices.splice(defaultIndex, 1);
        }
      }

      uniqueDevices.push(device);
      seenLabels.add(isDefault ? cleanLabel : device.label);
    }

    return uniqueDevices;
  } catch (error) {
    console.error('Error enumerating devices:', error);
    return [];
  }
}

export interface VideoConstraints {
  deviceId?: string;
  width?: number;
  height?: number;
}

export interface AudioConstraints {
  deviceId?: string;
  sampleRate?: number;
  channelCount?: number;
  noiseSuppression?: boolean;
  echoCancellation?: boolean;
  autoGainControl?: boolean;
}

export function getVideoConstraints(options: VideoConstraints): MediaStreamConstraints {
  const constraints: MediaStreamConstraints = {
    video: {
      ...(options.deviceId && { deviceId: { exact: options.deviceId } }),
      ...(options.width && { width: { ideal: options.width } }),
      ...(options.height && { height: { ideal: options.height } })
    },
    audio: false
  };
  return constraints;
}

export function getAudioConstraints(options: AudioConstraints): MediaStreamConstraints {
  const constraints: MediaStreamConstraints = {
    video: false,
    audio: {
      ...(options.deviceId && { deviceId: { exact: options.deviceId } }),
      ...(options.sampleRate && { sampleRate: options.sampleRate }),
      ...(options.channelCount && { channelCount: options.channelCount }),
      ...(options.noiseSuppression !== undefined && { noiseSuppression: options.noiseSuppression }),
      ...(options.echoCancellation !== undefined && { echoCancellation: options.echoCancellation }),
      ...(options.autoGainControl !== undefined && { autoGainControl: options.autoGainControl })
    }
  };
  return constraints;
}

export const videoResolutions: Record<string, { width: number; height: number }> = {
  '8K': { width: 7680, height: 4320 },
  '4K': { width: 3840, height: 2160 },
  '1440p': { width: 2560, height: 1440 },
  '1080p': { width: 1920, height: 1080 },
  '720p': { width: 1280, height: 720 },
  '480p': { width: 854, height: 480 },
  '360p': { width: 640, height: 360 },
  '240p': { width: 426, height: 240 }
};

export const sampleRates = [
  { value: 48000, label: '48000 Hz' },
  { value: 44100, label: '44100 Hz' }
];

export const channelOptions = [
  { value: 2, label: 'Stereo' },
  { value: 1, label: 'Mono' }
];
