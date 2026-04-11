export enum Language {
  ENGLISH = 'en',
  SPANISH = 'es',
}

export enum ExerciseType {
  ARTICULATION = 'articulation',
  VOCABULARY = 'vocabulary',
  PHRASING = 'phrasing',
  STORY = 'story',
  PRONUNCIATION_DRILL = 'pronunciation_drill',
  FOLLOWING_DIRECTIONS = 'following_directions',
  SOCIAL_SKILLS = 'social_skills',
  IMPULSIVITY_PRACTICE = 'impulsivity_practice',
  FOCUS_SESSION = 'focus_session',
  MINIMAL_PAIRS = 'minimal_pairs',
  SYLLABLE_PACING = 'syllable_pacing',
  VISUAL_PHONICS = 'visual_phonics',
  SEMANTIC_MAPPING = 'semantic_mapping',
  SENTENCE_EXPANSION = 'sentence_expansion',
  PRAGMATIC_ROLEPLAY = 'pragmatic_roleplay',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface InteractiveWord {
  word: string;
  definition: string;
  animation?: 'bounce' | 'shake' | 'pulse';
  audioUrl?: string;
}

export interface StoryPage {
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  interactiveWords?: InteractiveWord[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  language: Language;
  type: ExerciseType;
  difficulty: Difficulty;
  targetWord?: string;
  targetSentence?: string;
  imageUrl?: string;
  category: string;
  isPremium: boolean;
  isDownloaded?: boolean; // New property for offline support
  pronunciationGuide?: {
    mouthPosition: string;
    tonguePlacement: string;
    tip: string;
    mouthAnimationUrl?: string;
    tongueAnimationUrl?: string;
    mouthAudioUrl?: string;
    tongueAudioUrl?: string;
    tipAudioUrl?: string;
  };
  isolationActivity?: string;
  handCue?: string;
  pictureCue?: string; // URL to an animated illustration
  letterCue?: {
    letter: string;
    description: string;
  };
  syllables?: string[]; // For syllable sliders (e.g., ["ra", "bbit"])
  spinningSyllables?: string[][]; // For syllable spinning (e.g., [["ba", "be", "bi"], ["da", "de", "di"]])
  audioUrl?: string; // URL to the correct pronunciation audio
  targetSentenceAudioUrl?: string; // URL to the correct pronunciation of the target sentence
  isolationAudioUrl?: string; // URL to the correct pronunciation of the isolation activity
  story?: StoryPage[]; // For story activities
  minimalPairs?: { word1: string; word2: string; imageUrl1?: string; imageUrl2?: string; audioUrl1?: string; audioUrl2?: string }[];
  semanticData?: { category: string; items: { word: string; imageUrl?: string }[] };
  expansionData?: { base: string; steps: string[] };
  roleplayData?: { scenario: string; options: { text: string; feedback: string; isCorrect?: boolean }[] };
}

export enum Theme {
  KID = 'kid',
  MODERN = 'modern',
  TEENAGE = 'teenage',
  PLAYFUL = 'playful',
  PROFESSIONAL = 'professional',
}

export interface SensoryProfile {
  id: string;
  childProfileId: string;
  calmingColors: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  fontScale: number; // 1.0 is default
  showVisualTimer: boolean;
}

export interface FirstThenBoard {
  id: string;
  childProfileId: string;
  firstAction: string;
  firstImage?: string;
  thenAction: string;
  thenImage?: string;
  createdAt: string;
}

export interface VisualTimer {
  id: string;
  childProfileId: string;
  durationSeconds: number;
  label: string;
  color: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  isPremium: boolean;
  isAutismAddonActive: boolean;
  createdAt: string;
  theme?: Theme;
  profiles: ChildProfile[];
  activeProfileId?: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  avatar: string;
  points: number;
  streak: number;
  sessions: number;
  unlockedAchievements: string[];
  struggleWords: StruggleWord[];
  voiceHistory: VoiceRecording[];
  history: { date: string; score: number; sessions: number }[];
  sensoryProfile?: SensoryProfile;
  firstThenBoards?: FirstThenBoard[];
}

export interface StruggleWord {
  id: string;
  word: string;
  definition: string;
  imageUrl?: string;
  audioUrl?: string;
  addedAt: string;
  mastered: boolean;
}

export interface VoiceRecording {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  timestamp: string;
  audioUrl: string;
  score: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  requirement: {
    type: 'points' | 'streak' | 'sessions' | 'score';
    value: number;
  };
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

export enum LessonBlockType {
  EXERCISE = 'exercise',
  SENSORY_BREAK = 'sensory_break',
  MESSAGE = 'message',
}

export interface LessonBlock {
  id: string;
  type: LessonBlockType;
  exerciseId?: string; // If type is EXERCISE
  config?: {
    duration?: number; // for sensory break
    text?: string; // for message
    title?: string;
  };
}

export interface LessonPlan {
  id: string;
  title: string;
  description: string;
  createdBy: string; // childProfileId or therapistId
  blocks: LessonBlock[];
  difficulty: Difficulty;
  language: Language;
  createdAt: string;
  isPublic?: boolean;
  isApproved?: boolean;
}
