import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Recording {
  id: string;
  type: 'video' | 'audio';
  blob: Blob;
  timestamp: number;
  duration: number;
  deviceName: string;
  metadata?: {
    resolution?: string;
    sampleRate?: number;
    channels?: number;
  };
}

interface MicTestCamDB extends DBSchema {
  recordings: {
    key: string;
    value: Recording;
    indexes: { 'by-type': string; 'by-timestamp': number };
  };
}

let dbPromise: Promise<IDBPDatabase<MicTestCamDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<MicTestCamDB>('mictestcam-db', 1, {
      upgrade(db) {
        const store = db.createObjectStore('recordings', { keyPath: 'id' });
        store.createIndex('by-type', 'type');
        store.createIndex('by-timestamp', 'timestamp');
      },
    });
  }
  return dbPromise;
}

export async function saveRecording(recording: Recording): Promise<void> {
  const db = await getDB();
  await db.put('recordings', recording);
}

export async function getRecordings(type?: 'video' | 'audio'): Promise<Recording[]> {
  const db = await getDB();
  if (type) {
    return db.getAllFromIndex('recordings', 'by-type', type);
  }
  return db.getAll('recordings');
}

export async function getRecording(id: string): Promise<Recording | undefined> {
  const db = await getDB();
  return db.get('recordings', id);
}

export async function deleteRecording(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('recordings', id);
}

export async function clearRecordings(type?: 'video' | 'audio'): Promise<void> {
  const db = await getDB();
  if (type) {
    const recordings = await db.getAllFromIndex('recordings', 'by-type', type);
    const tx = db.transaction('recordings', 'readwrite');
    await Promise.all([
      ...recordings.map(r => tx.store.delete(r.id)),
      tx.done
    ]);
  } else {
    await db.clear('recordings');
  }
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

export function generateRecordingId(): string {
  return `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
