import Dexie, { type Table } from 'dexie';

export interface LocalRecording {
  id?: number;
  exerciseId: string;
  type: 'target' | 'user'; 
  audioBlob: Blob;
  timestamp: number;
  score?: number;
  exerciseTitle: string;
  profileId: string;
  metrics?: {
    accuracy: number;
    fluency: number;
    pronunciation: number;
    feedback: string;
  };
}

export interface LocalProfile {
  id: string;
  name: string;
  avatar: string;
  language: 'en' | 'es';
  points: number;
  streak: number;
  lastActive: number;
  isPro: boolean;
  cloudSyncEnabled: boolean;
}

export interface LocalStruggleWord {
  id: string;
  profileId: string;
  word: string;
  definition: string;
  imageUrl?: string;
  mastered: boolean;
  timestamp: number;
}

export interface LocalSettings {
  id: string; // 'global'
  privacyMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  calmingColors: boolean;
  fontScale: number;
}

export class AppDatabase extends Dexie {
  recordings!: Table<LocalRecording>;
  profiles!: Table<LocalProfile>;
  struggleWords!: Table<LocalStruggleWord>;
  settings!: Table<LocalSettings>;

  constructor() {
    super('SpeechAppDB_v2');
    this.version(1).stores({
      recordings: '++id, exerciseId, type, profileId, timestamp',
      profiles: 'id, name, isPro',
      struggleWords: 'id, profileId, word, mastered',
      settings: 'id'
    });
  }
}

export const localDb = new AppDatabase();
