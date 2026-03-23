export enum Language {
  ENGLISH = 'en',
  SPANISH = 'es',
}

export enum ExerciseType {
  ARTICULATION = 'articulation',
  VOCABULARY = 'vocabulary',
  PHRASING = 'phrasing',
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  language: Language;
  type: ExerciseType;
  targetWord?: string;
  imageUrl?: string;
  isPremium: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  isPremium: boolean;
  createdAt: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  exerciseId: string;
  timestamp: string;
  score: number;
  feedback: string;
  audioUrl?: string;
}
