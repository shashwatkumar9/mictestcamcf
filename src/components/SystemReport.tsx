'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { getMediaDevices, type MediaDevice } from '@/lib/mediaDevices';

interface SystemInfo {
  browser: {
    name: string;
    version: string;
    userAgent: string;
  };
  os: {
    name: string;
    version: string;
  };
  screen: {
    width: number;
    height: number;
    pixelRatio: number;
  };
  webrtc: {
    supported: boolean;
    getUserMedia: boolean;
    mediaRecorder: boolean;
    audioContext: boolean;
  };
  videoDevices: MediaDevice[];
  audioDevices: MediaDevice[];
  videoCapabilities: Record<string, unknown>[];
  audioCapabilities: Record<string, unknown>[];
}

export function SystemReport() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const gatherSystemInfo = async () => {
    setIsLoading(true);

    try {
      // Parse browser info from user agent
      const ua = navigator.userAgent;
      let browserName = 'Unknown';
      let browserVersion = 'Unknown';

      if (ua.includes('Firefox/')) {
        browserName = 'Firefox';
        browserVersion = ua.split('Firefox/')[1].split(' ')[0];
      } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
        browserName = 'Chrome';
        browserVersion = ua.split('Chrome/')[1].split(' ')[0];
      } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
        browserName = 'Safari';
        browserVersion = ua.split('Version/')[1]?.split(' ')[0] || 'Unknown';
      } else if (ua.includes('Edg/')) {
        browserName = 'Edge';
        browserVersion = ua.split('Edg/')[1].split(' ')[0];
      }

      // Parse OS info
      let osName = 'Unknown';
      let osVersion = 'Unknown';

      if (ua.includes('Windows NT')) {
        osName = 'Windows';
        const ntVersion = ua.split('Windows NT ')[1]?.split(';')[0] || '';
        const versionMap: Record<string, string> = {
          '10.0': '10/11',
          '6.3': '8.1',
          '6.2': '8',
          '6.1': '7',
        };
        osVersion = versionMap[ntVersion] || ntVersion;
      } else if (ua.includes('Mac OS X')) {
        osName = 'macOS';
        osVersion = ua.split('Mac OS X ')[1]?.split(')')[0]?.replace(/_/g, '.') || 'Unknown';
      } else if (ua.includes('Linux')) {
        osName = 'Linux';
      } else if (ua.includes('Android')) {
        osName = 'Android';
        osVersion = ua.split('Android ')[1]?.split(';')[0] || 'Unknown';
      } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
        osName = 'iOS';
        osVersion = ua.split('OS ')[1]?.split(' ')[0]?.replace(/_/g, '.') || 'Unknown';
      }

      // Get devices
      const videoDevices = await getMediaDevices('videoinput');
      const audioDevices = await getMediaDevices('audioinput');

      // Get capabilities for each device
      const videoCapabilities: Record<string, unknown>[] = [];
      const audioCapabilities: Record<string, unknown>[] = [];

      for (const device of videoDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: device.deviceId } },
          });
          const track = stream.getVideoTracks()[0];
          const caps = track.getCapabilities();
          videoCapabilities.push({
            deviceId: device.deviceId,
            label: device.label,
            capabilities: caps,
          });
          stream.getTracks().forEach((t) => t.stop());
        } catch {
          videoCapabilities.push({
            deviceId: device.deviceId,
            label: device.label,
            capabilities: 'Unable to access',
          });
        }
      }

      for (const device of audioDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: { exact: device.deviceId } },
          });
          const track = stream.getAudioTracks()[0];
          const caps = track.getCapabilities();
          audioCapabilities.push({
            deviceId: device.deviceId,
            label: device.label,
            capabilities: caps,
          });
          stream.getTracks().forEach((t) => t.stop());
        } catch {
          audioCapabilities.push({
            deviceId: device.deviceId,
            label: device.label,
            capabilities: 'Unable to access',
          });
        }
      }

      const info: SystemInfo = {
        browser: {
          name: browserName,
          version: browserVersion,
          userAgent: ua,
        },
        os: {
          name: osName,
          version: osVersion,
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height,
          pixelRatio: window.devicePixelRatio,
        },
        webrtc: {
          supported: !!window.RTCPeerConnection,
          getUserMedia: !!navigator.mediaDevices?.getUserMedia,
          mediaRecorder: !!window.MediaRecorder,
          audioContext: !!(window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext),
        },
        videoDevices,
        audioDevices,
        videoCapabilities,
        audioCapabilities,
      };

      setSystemInfo(info);
    } catch (error) {
      console.error('Failed to gather system info:', error);
    }

    setIsLoading(false);
  };

  const downloadReport = () => {
    if (!systemInfo) return;

    const report = {
      generatedAt: new Date().toISOString(),
      ...systemInfo,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mictestcam-report-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (isExpanded && !systemInfo) {
      gatherSystemInfo();
    }
  }, [isExpanded, systemInfo]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">System Report</h3>
            <p className="text-sm text-gray-500">Generate a detailed report of your setup</p>
          </div>
        </div>
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
        <div className="px-6 pb-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : systemInfo ? (
            <>
              {/* Browser & OS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Browser</h4>
                  <p className="text-lg font-semibold text-gray-900">
                    {systemInfo.browser.name} {systemInfo.browser.version}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Operating System</h4>
                  <p className="text-lg font-semibold text-gray-900">
                    {systemInfo.os.name} {systemInfo.os.version}
                  </p>
                </div>
              </div>

              {/* WebRTC Support */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3">WebRTC Capabilities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(systemInfo.webrtc).map(([key, supported]) => (
                    <div key={key} className="flex items-center gap-2">
                      {supported ? (
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Devices */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Video Devices ({systemInfo.videoDevices.length})
                  </h4>
                  <div className="space-y-2">
                    {systemInfo.videoDevices.map((device, i) => (
                      <div key={device.deviceId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{device.label}</p>
                          <p className="text-xs text-gray-500">{device.deviceId.slice(0, 20)}...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Audio Devices ({systemInfo.audioDevices.length})
                  </h4>
                  <div className="space-y-2">
                    {systemInfo.audioDevices.map((device, i) => (
                      <div key={device.deviceId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{device.label}</p>
                          <p className="text-xs text-gray-500">{device.deviceId.slice(0, 20)}...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex gap-3">
                <Button onClick={downloadReport} className="flex-1">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Full Report (JSON)
                </Button>
                <Button onClick={gatherSystemInfo} variant="secondary">
                  Refresh
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Failed to gather system information
            </div>
          )}
        </div>
      )}
    </div>
  );
}
