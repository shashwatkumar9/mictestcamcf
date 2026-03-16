'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import {
  getRecordings,
  deleteRecording,
  clearRecordings,
  formatDuration,
  formatTimestamp,
  type Recording,
} from '@/lib/storage';
import type { Dictionary } from '@/lib/getDictionary';

interface SavedRecordingsProps {
  dictionary: Dictionary;
  refreshKey: number;
}

export function SavedRecordings({ dictionary, refreshKey }: SavedRecordingsProps) {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    loadRecordings();
  }, [refreshKey]);

  const loadRecordings = async () => {
    const recs = await getRecordings('video');
    setRecordings(recs.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handlePlay = (recording: Recording) => {
    setPlayingId(playingId === recording.id ? null : recording.id);
  };

  const handleDownload = (recording: Recording) => {
    const url = URL.createObjectURL(recording.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recording-${recording.id}.webm`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    await deleteRecording(id);
    setRecordings((prev) => prev.filter((r) => r.id !== id));
    if (playingId === id) {
      setPlayingId(null);
    }
  };

  const handleClearAll = async () => {
    await clearRecordings('video');
    setRecordings([]);
    setPlayingId(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {dictionary.webcam.savedRecordings.title}
        </h2>
        {recordings.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            {dictionary.webcam.savedRecordings.clearAll}
          </Button>
        )}
      </div>

      {recordings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <p>{dictionary.webcam.savedRecordings.noRecordings}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recordings.map((recording) => (
            <div
              key={recording.id}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{recording.deviceName}</p>
                    <p className="text-sm text-gray-500">
                      {formatTimestamp(recording.timestamp)} &middot; {formatDuration(recording.duration)}
                      {recording.metadata?.resolution && ` \u00b7 ${recording.metadata.resolution}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handlePlay(recording)}>
                    {playingId === recording.id ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                    <span className="ml-1">{dictionary.webcam.savedRecordings.play}</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(recording)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="ml-1">{dictionary.webcam.savedRecordings.download}</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(recording.id)}>
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="ml-1">{dictionary.webcam.savedRecordings.delete}</span>
                  </Button>
                </div>
              </div>

              {playingId === recording.id && (
                <div className="bg-gray-900 aspect-video">
                  <video
                    src={URL.createObjectURL(recording.blob)}
                    controls
                    autoPlay
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
