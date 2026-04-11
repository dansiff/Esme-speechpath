import { localDb, LocalProfile, LocalRecording, LocalStruggleWord, LocalSettings } from './db';
import { db as firestore } from '../firebase';
import { collection, doc, setDoc, getDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';

export class DataRepository {
  private static instance: DataRepository;
  
  private constructor() {}

  public static getInstance(): DataRepository {
    if (!DataRepository.instance) {
      DataRepository.instance = new DataRepository();
    }
    return DataRepository.instance;
  }

  // Profiles
  async saveProfile(profile: LocalProfile): Promise<void> {
    await localDb.profiles.put(profile);
    if (profile.cloudSyncEnabled && profile.isPro) {
      await setDoc(doc(firestore, 'profiles', profile.id), profile);
    }
  }

  async getProfile(id: string): Promise<LocalProfile | undefined> {
    let profile = await localDb.profiles.get(id);
    if (!profile) {
      const docRef = doc(firestore, 'profiles', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        profile = docSnap.data() as LocalProfile;
        await localDb.profiles.put(profile);
      }
    }
    return profile;
  }

  // Recordings
  async saveRecording(recording: LocalRecording, cloudSync: boolean): Promise<void> {
    await localDb.recordings.add(recording);
    if (cloudSync) {
      // For HIPAA, we might want to anonymize or only sync metadata
      const { audioBlob, ...metadata } = recording;
      await setDoc(doc(collection(firestore, 'recordings')), {
        ...metadata,
        // In a real HIPAA app, audio would be in a secure bucket, not Firestore
        hasAudio: true 
      });
    }
  }

  async getRecordings(profileId: string): Promise<LocalRecording[]> {
    return await localDb.recordings.where('profileId').equals(profileId).toArray();
  }

  // Settings
  async saveSettings(settings: LocalSettings): Promise<void> {
    await localDb.settings.put(settings);
  }

  async getSettings(): Promise<LocalSettings | undefined> {
    return await localDb.settings.get('global');
  }

  // Struggle Words
  async addStruggleWord(word: LocalStruggleWord, cloudSync: boolean): Promise<void> {
    await localDb.struggleWords.put(word);
    if (cloudSync) {
      await setDoc(doc(firestore, 'struggleWords', word.id), word);
    }
  }
}

export const repository = DataRepository.getInstance();
