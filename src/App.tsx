import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { 
  Mic, 
  MicOff, 
  Globe, 
  Trophy, 
  BookOpen, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  Star,
  Lock,
  CheckCircle2,
  AlertCircle,
  Download,
  Wifi,
  WifiOff,
  CloudOff,
  Info,
  Hand,
  Image as ImageIcon,
  Type as TypeIcon,
  Activity,
  RefreshCw,
  MoveHorizontal,
  Volume2,
  Bookmark,
  Sparkles,
  Loader2,
  Users,
  History,
  Plus,
  FileText,
  Trash2,
  Play,
  Heart,
  Eye,
  Zap,
  Type,
  Timer as TimerIcon,
  LayoutGrid,
  Languages,
  X,
  Maximize2,
  Crown
} from 'lucide-react';
import { SensoryTools } from './components/SensoryTools';
import { ArticulationMatchingGame } from './components/ArticulationMatchingGame';
import { SpecializedExerciseView } from './components/SpecializedExerciseView';
import { LessonBuilder } from './components/LessonBuilder';
import { LessonPlayer } from './components/LessonPlayer';
import { 
  Language, 
  ExerciseType, 
  Difficulty, 
  Exercise, 
  Theme, 
  UserProfile, 
  Achievement,
  ChildProfile,
  StruggleWord,
  VoiceRecording,
  InteractiveWord,
  SensoryProfile,
  FirstThenBoard,
  LessonPlan,
  LessonBlock,
  LessonBlockType
} from './types';
import { db, auth } from './firebase';
import { localDb, LocalProfile, LocalRecording } from './lib/db';
import { doc, setDoc, getDoc, updateDoc, collection, onSnapshot, query, where, addDoc, deleteDoc, getDocFromServer } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { analyzeSpeech, SpeechAnalysisResult } from './services/geminiService';
import { repository } from './lib/dataRepository';
import { generateStory, enrichStoryWithImages, enrichStoryWithAudio, generateWordAudio, translateStoryPage } from './services/storyService';
import { handleError, ErrorType, handleFirestoreError, OperationType } from './utils/errorHandler';
import { ACHIEVEMENTS } from './achievements';
import { EXERCISES } from './constants';
import { generateLocalFeedback, pseudoAnalyze } from './utils/localSpeechEngine';
import confetti from 'canvas-confetti';
import { speakText } from './utils/speechUtils';
import { SettingsView } from './components/SettingsView';
import { InstagramEmbed } from './components/InstagramEmbed';
import { LessonListView } from './components/LessonListView';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  ResponsiveContainer, 
  AreaChart, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area, 
  Bar 
} from 'recharts';

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

import { LAYOUT_CONFIG } from './layoutConfig';

export default function App() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<SpeechAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [cloudSync, setCloudSync] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isAutismAddonActive, setIsAutismAddonActive] = useState(false);
  const [isMentorMode, setIsMentorMode] = useState(false);
  const [view, setView] = useState<'practice' | 'stories' | 'progress' | 'pricing' | 'settings' | 'autism-tools' | 'matching-game' | 'focus-social' | 'lessons' | 'videos'>('practice');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [sensoryProfile, setSensoryProfile] = useState<SensoryProfile | null>(null);
  const [firstThenBoards, setFirstThenBoards] = useState<FirstThenBoard[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [theme, setTheme] = useState<Theme>(Theme.MODERN);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [spinValues, setSpinValues] = useState<number[]>([]);
  const [sliderValue, setSliderValue] = useState(0);
  const [currentStoryPage, setCurrentStoryPage] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeWord, setActiveWord] = useState<InteractiveWord | null>(null);
  const [bookmarks, setBookmarks] = useState<Record<string, number>>({});
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [localMentorAudio, setLocalMentorAudio] = useState<string | null>(null);
  const [localUserRecordings, setLocalUserRecordings] = useState<any[]>([]);
  const [localRecordingsTrigger, setLocalRecordingsTrigger] = useState(0);
  const practiceAreaRef = useRef<HTMLDivElement>(null);
  const [translatedStoryText, setTranslatedStoryText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState<{ url: string; title: string } | null>(null);
  const [comboCount, setComboCount] = useState(0);
  const [mouthAnimKey, setMouthAnimKey] = useState(0);
  const [tongueAnimKey, setTongueAnimKey] = useState(0);
  const [isGeneratingWordAudio, setIsGeneratingWordAudio] = useState(false);
  const [isGeneratingExerciseAudio, setIsGeneratingExerciseAudio] = useState(false);
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [showClearCacheModal, setShowClearCacheModal] = useState(false);
  const [storyTopic, setStoryTopic] = useState('');
  const [storyLanguage, setStoryLanguage] = useState<Language>(Language.ENGLISH);
  const [storyDifficulty, setStoryDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [savedStories, setSavedStories] = useState<Exercise[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<Exercise | null>(null);
  const [dailyGoalProgress, setDailyGoalProgress] = useState(0);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<LessonPlan | null>(null);
  const [editingLessonPlan, setEditingLessonPlan] = useState<LessonPlan | null>(null);
  const [isBuildingLesson, setIsBuildingLesson] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const [profiles, setProfiles] = useState<ChildProfile[]>([
    {
      id: 'default',
      name: 'Sofia',
      avatar: '👧',
      points: 0,
      streak: 0,
      sessions: 0,
      unlockedAchievements: [],
      struggleWords: [],
      voiceHistory: [],
      history: []
    }
  ]);
  const [activeProfileId, setActiveProfileId] = useState<string>('default');

  useEffect(() => {
    const savedPlans = localStorage.getItem('lessonPlans');
    if (savedPlans) {
      try {
        setLessonPlans(JSON.parse(savedPlans));
      } catch (e) {
        console.error('Failed to load lesson plans', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lessonPlans', JSON.stringify(lessonPlans));
  }, [lessonPlans]);

  const handleSaveLessonPlan = (plan: LessonPlan) => {
    setLessonPlans(prev => {
      const exists = prev.find(p => p.id === plan.id);
      if (exists) {
        return prev.map(p => p.id === plan.id ? plan : p);
      }
      return [...prev, plan];
    });
    setIsBuildingLesson(false);
    setEditingLessonPlan(null);
    toast.success('Lesson plan saved!');
  };

  const handleDeleteLessonPlan = (id: string) => {
    setLessonPlans(prev => prev.filter(p => p.id !== id));
    toast.success('Lesson plan deleted');
  };

  const handleStartLesson = (plan: LessonPlan) => {
    setSelectedLessonPlan(plan);
    playCue('swoosh');
  };

  // Firebase Auth and Profile Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            setUser(userData);
            setIsPremiumUser(userData.isPremium);
            setIsAutismAddonActive(userData.isAutismAddonActive);
            if (userData.activeProfileId) setActiveProfileId(userData.activeProfileId);
            if (userData.profiles) setProfiles(userData.profiles);
          } else {
            const newUser: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              isPremium: false,
              isAutismAddonActive: false,
              createdAt: new Date().toISOString(),
              profiles: [{
                id: 'default',
                name: firebaseUser.displayName?.split(' ')[0] || 'Sofia',
                avatar: '👧',
                points: 0,
                streak: 0,
                sessions: 0,
                unlockedAchievements: [],
                struggleWords: [],
                voiceHistory: [],
                history: [],
                sensoryProfile: {
                  id: 'default',
                  childProfileId: 'default',
                  calmingColors: false,
                  reducedMotion: false,
                  highContrast: false,
                  fontScale: 1.0,
                  showVisualTimer: true
                },
                firstThenBoards: []
              }],
              activeProfileId: 'default'
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
            setProfiles(newUser.profiles);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`, auth);
        }
      } else {
        setUser(null);
        setIsPremiumUser(false);
        setIsAutismAddonActive(false);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const enrichStoryAudio = async () => {
      if (!selectedExercise || selectedExercise.type !== ExerciseType.STORY || !selectedExercise.story) return;
      
      const hasMissingAudio = selectedExercise.story.some(page => 
        page.interactiveWords?.some(word => !word.audioUrl)
      );

      if (!hasMissingAudio) return;

      try {
        const enrichedStory = await enrichStoryWithAudio(selectedExercise.story);
        setSelectedExercise({ ...selectedExercise, story: enrichedStory });
        
        // If it's a saved story, update Firestore (optional, but good for persistence)
        if (user && !selectedExercise.id.startsWith('ai-')) {
          const storyRef = doc(db, 'users', user.uid, 'stories', selectedExercise.id);
          await updateDoc(storyRef, { story: enrichedStory });
        }
      } catch (error) {
        console.error("Failed to enrich story audio:", error);
      }
    };

    enrichStoryAudio();
  }, [selectedExercise?.id, user]);

  // Sync Autism Tools
  useEffect(() => {
    if (!user || !activeProfileId) return;

    const sensoryRef = doc(db, 'users', user.uid, 'childProfiles', activeProfileId, 'sensoryProfile', 'default');
    const boardsRef = collection(db, 'users', user.uid, 'childProfiles', activeProfileId, 'firstThenBoards');

    const unsubSensory = onSnapshot(sensoryRef, (doc) => {
      if (doc.exists()) setSensoryProfile(doc.data() as SensoryProfile);
      else setSensoryProfile(null);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, sensoryRef.path, auth);
    });

    const unsubBoards = onSnapshot(boardsRef, (snapshot) => {
      setFirstThenBoards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirstThenBoard)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, boardsRef.path, auth);
    });

    const storiesRef = collection(db, 'users', user.uid, 'stories');
    const unsubStories = onSnapshot(storiesRef, (snapshot) => {
      setSavedStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, storiesRef.path, auth);
    });

    return () => {
      unsubSensory();
      unsubBoards();
      unsubStories();
    };
  }, [user, activeProfileId]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    };
    testConnection();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Logged in successfully!');
    } catch (error) {
      handleError(error, ErrorType.AUTH);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error) {
      handleError(error, ErrorType.AUTH);
    }
  };

  const addFirstThenBoard = async (board: Omit<FirstThenBoard, 'id' | 'createdAt'>) => {
    if (!user || !activeProfileId) return;
    const boardsRef = collection(db, 'users', user.uid, 'childProfiles', activeProfileId, 'firstThenBoards');
    try {
      await addDoc(boardsRef, {
        ...board,
        childProfileId: activeProfileId,
        createdAt: new Date().toISOString()
      });
      toast.success('Board added!');
    } catch (error) {
      handleError(error, ErrorType.STORAGE);
    }
  };

  const deleteFirstThenBoard = async (id: string) => {
    if (!user || !activeProfileId) return;
    const boardRef = doc(db, 'users', user.uid, 'childProfiles', activeProfileId, 'firstThenBoards', id);
    try {
      await deleteDoc(boardRef);
      toast.success('Board removed');
    } catch (error) {
      handleError(error, ErrorType.STORAGE);
    }
  };

  const updateSensoryProfile = async (updates: Partial<SensoryProfile>) => {
    if (!user || !activeProfileId) return;
    const profileRef = doc(db, 'users', user.uid, 'childProfiles', activeProfileId, 'sensoryProfile', 'default');
    try {
      const newProfile = {
        ...(sensoryProfile || {
          id: 'default',
          childProfileId: activeProfileId,
          calmingColors: false,
          reducedMotion: false,
          highContrast: false,
          fontScale: 1.0,
          showVisualTimer: true
        }),
        ...updates
      };
      await setDoc(profileRef, newProfile);
      setSensoryProfile(newProfile);
      toast.success('Sensory settings updated');
    } catch (error) {
      handleError(error, ErrorType.STORAGE);
    }
  };

  // Load profiles from localStorage on mount
  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem('bilingual_brilliant_profiles');
      const savedActiveId = localStorage.getItem('bilingual_brilliant_active_id');
      
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles));
      }
      if (savedActiveId) {
        setActiveProfileId(savedActiveId);
      }
    } catch (error) {
      handleError(error, ErrorType.STORAGE);
    }
  }, []);

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('bilingual_brilliant_profiles', JSON.stringify(profiles));
      localStorage.setItem('bilingual_brilliant_active_id', activeProfileId);
    } catch (error) {
      handleError(error, ErrorType.STORAGE);
    }
  }, [profiles, activeProfileId]);
  const handleClearCache = () => {
    localStorage.clear();
    // Reset critical local states
    setProfiles([{
      id: 'default',
      name: 'Sofia',
      avatar: '👧',
      points: 0,
      streak: 0,
      sessions: 0,
      unlockedAchievements: [],
      struggleWords: [],
      voiceHistory: [],
      history: []
    }]);
    setActiveProfileId('default');
    setDailyGoalProgress(0);
    setDownloadedIds([]);
    setBookmarks({});
    
    setShowClearCacheModal(false);
    toast.success('Local cache cleared successfully!');
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  // User Stats State (Derived from active profile)
  const userStats = {
    points: activeProfile.points,
    streak: activeProfile.streak,
    sessions: activeProfile.sessions,
    unlockedAchievements: activeProfile.unlockedAchievements,
    history: activeProfile.history
  };

  const setUserStats = (newStats: any) => {
    setProfiles(prev => prev.map(p => 
      p.id === activeProfileId ? { ...p, ...newStats } : p
    ));
  };
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [showStruggleWordModal, setShowStruggleWordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newStruggleWord, setNewStruggleWord] = useState('');
  const [newProfileName, setNewProfileName] = useState('');
  const [isAddingStruggleWord, setIsAddingStruggleWord] = useState(false);

  const switchProfile = async (id: string) => {
    setActiveProfileId(id);
    setShowProfileSwitcher(false);
    playCue('pop');
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { activeProfileId: id });
    }
  };

  const addProfile = async () => {
    if (!newProfileName.trim()) return;
    const newProfile: ChildProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProfileName,
      avatar: '🧒',
      points: 0,
      streak: 0,
      sessions: 0,
      unlockedAchievements: [],
      struggleWords: [],
      voiceHistory: [],
      history: [],
      sensoryProfile: {
        id: Math.random().toString(36).substr(2, 9),
        childProfileId: '', // Will be set after creation
        calmingColors: false,
        reducedMotion: false,
        highContrast: false,
        fontScale: 1.0,
        showVisualTimer: true
      },
      firstThenBoards: []
    };
    
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    setActiveProfileId(newProfile.id);
    
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { 
        profiles: updatedProfiles,
        activeProfileId: newProfile.id
      });
    }
    
    setNewProfileName('');
    setShowProfileModal(false);
    playCue('chime');
    toast.success(`Profile for ${newProfileName} created!`);
  };

  useEffect(() => {
    setTranslatedStoryText(null);
  }, [currentStoryPage, selectedExercise?.id]);

  useEffect(() => {
    const initDailyChallenge = () => {
      const today = new Date().toDateString();
      const lastChallengeDate = localStorage.getItem('last_challenge_date');
      
      if (lastChallengeDate !== today) {
        const available = EXERCISES.filter(ex => !ex.isPremium || activeProfile.isPro);
        const random = available[Math.floor(Math.random() * available.length)];
        setDailyChallenge(random);
        localStorage.setItem('last_challenge_date', today);
        localStorage.setItem('daily_challenge_id', random.id);
        setDailyGoalProgress(0);
        localStorage.setItem('daily_goal_progress', '0');
      } else {
        const savedId = localStorage.getItem('daily_challenge_id');
        const saved = EXERCISES.find(ex => ex.id === savedId);
        setDailyChallenge(saved || EXERCISES[0]);
        const progress = parseInt(localStorage.getItem('daily_goal_progress') || '0');
        setDailyGoalProgress(progress);
      }
    };

    if (activeProfileId) {
      initDailyChallenge();
    }
  }, [activeProfileId, activeProfile.isPro]);

  const translateStory = async () => {
    if (!selectedExercise || selectedExercise.type !== ExerciseType.STORY || isTranslating) return;
    const page = selectedExercise.story?.[currentStoryPage];
    if (!page) return;

    setIsTranslating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate the following story text into Spanish. Keep it simple and child-friendly: "${page.text}"`,
      });
      setTranslatedStoryText(response.text || null);
      toast.success("Story translated to Spanish!");
    } catch (err) {
      handleError(err, ErrorType.AI_API);
    } finally {
      setIsTranslating(false);
    }
  };

  const addStruggleWord = async () => {
    if (!newStruggleWord.trim()) return;
    setIsAddingStruggleWord(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a simple definition and a short image prompt for the word "${newStruggleWord}" for a child's speech therapy app. Return as JSON: { "definition": "...", "imagePrompt": "..." }`,
        config: { responseMimeType: "application/json" }
      });
      
      const text = response.text;
      const data = JSON.parse(text);
      
      // Generate image
      const imageResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: data.imagePrompt
      });
      
      let imageUrl = '';
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      const newWord: StruggleWord = {
        id: Math.random().toString(36).substr(2, 9),
        word: newStruggleWord,
        definition: data.definition,
        imageUrl,
        addedAt: new Date().toISOString(),
        mastered: false
      };

      setProfiles(prev => prev.map(p => 
        p.id === activeProfileId ? { ...p, struggleWords: [newWord, ...p.struggleWords] } : p
      ));
      setNewStruggleWord('');
      setShowStruggleWordModal(false);
      playCue('chime');
      toast.success(`"${newStruggleWord}" added to practice list!`);
    } catch (error) {
      handleError(error, ErrorType.AI_API);
    } finally {
      setIsAddingStruggleWord(false);
    }
  };

  const saveVoiceRecording = (audioUrl: string, score: number, exercise: Exercise) => {
    const isMock = audioUrl.includes('example.com');
    
    const newRecording: VoiceRecording = {
      id: Math.random().toString(36).substr(2, 9),
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      timestamp: new Date().toISOString(),
      audioUrl: isMock ? '' : audioUrl,
      score
    };

    // Update Daily Goal
    if (exercise.id === dailyChallenge?.id) {
      const newProgress = Math.min(100, dailyGoalProgress + 34);
      setDailyGoalProgress(newProgress);
      localStorage.setItem('daily_goal_progress', newProgress.toString());
      if (newProgress >= 100 && dailyGoalProgress < 100) {
        toast.success("Daily Goal Achieved! +50 Points");
        setProfiles(prev => prev.map(p => 
          p.id === activeProfileId ? { ...p, points: (p.points || 0) + 50 } : p
        ));
        playCue('chime');
      }
    }

    setProfiles(prev => prev.map(p => 
      p.id === activeProfileId ? { 
        ...p, 
        voiceHistory: isMock ? p.voiceHistory : [newRecording, ...p.voiceHistory], 
        points: (p.points || 0) + Math.floor(score / 10) 
      } : p
    ));

    // Trigger refresh of local recordings if it was a real recording
    if (!isMock) {
      setLocalRecordingsTrigger(prev => prev + 1);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const profile = activeProfile;
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text(`Speech Progress Report: ${profile.name}`, 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Summary Stats
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Summary Statistics', 14, 45);
    
    (doc as any).autoTable({
      startY: 50,
      head: [['Metric', 'Value']],
      body: [
        ['Total Points', profile.points],
        ['Current Streak', `${profile.streak} days`],
        ['Total Sessions', profile.sessions],
        ['Mastered Words', profile.struggleWords.filter(w => w.mastered).length],
      ],
    });
    
    // History Table
    if (profile.history.length > 0) {
      doc.text('Recent Session History', 14, (doc as any).lastAutoTable.finalY + 15);
      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Date', 'Average Score', 'Sessions']],
        body: profile.history.map(h => [h.date, `${h.score}%`, h.sessions]),
      });
    }
    
    // Struggle Words
    if (profile.struggleWords.length > 0) {
      doc.text('Current Struggle Words', 14, (doc as any).lastAutoTable.finalY + 15);
      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Word', 'Added On', 'Status']],
        body: profile.struggleWords.map(w => [
          w.word, 
          new Date(w.addedAt).toLocaleDateString(), 
          w.mastered ? 'Mastered' : 'In Progress'
        ]),
      });
    }
    
    doc.save(`${profile.name}_Speech_Report.pdf`);
    playCue('chime');
  };

  useEffect(() => {
    setActiveWord(null);
    setTranslatedStoryText(null);
  }, [currentStoryPage, selectedExercise]);

  const playTargetAudio = (url: string) => {
    if (!url) return;
    setIsPlayingAudio(true);
    const audio = new Audio(url);
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => setIsPlayingAudio(false);
    audio.play().catch(err => {
      handleError(err, ErrorType.AUDIO);
      setIsPlayingAudio(false);
    });
  };

  const playOrGenerateExerciseAudio = async (text: string, field: string) => {
    if (!selectedExercise || isPlayingAudio || isGeneratingExerciseAudio) return;

    // If it's the main audioUrl, check for local mentor recording first
    if (field === 'audioUrl' && localMentorAudio) {
      playTargetAudio(localMentorAudio);
      return;
    }

    // Helper to get nested value
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const existingAudioUrl = getNestedValue(selectedExercise, field);
    if (existingAudioUrl && !existingAudioUrl.includes('soundhelix.com')) {
      playTargetAudio(existingAudioUrl);
      return;
    }

    setIsGeneratingExerciseAudio(true);
    try {
      const audioUrl = await generateWordAudio(text);
      if (audioUrl) {
        // Helper to set nested value
        const setNestedValue = (obj: any, path: string, value: any) => {
          const parts = path.split('.');
          const last = parts.pop()!;
          const target = parts.reduce((acc, part) => {
            if (!acc[part]) acc[part] = {};
            return acc[part];
          }, obj);
          target[last] = value;
          return { ...obj };
        };

        const updatedExercise = setNestedValue({ ...selectedExercise }, field, audioUrl);
        setSelectedExercise(updatedExercise);
        
        playTargetAudio(audioUrl);
      }
    } catch (error) {
      handleError(error, ErrorType.AI_API);
    } finally {
      setIsGeneratingExerciseAudio(false);
    }
  };

  const playCue = async (type: 'chime' | 'swoosh' | 'pop') => {
    // To use your own sounds, place them in /public/sounds/ and update these paths
    const urls = {
      chime: '/sounds/chime.mp3', 
      swoosh: '/sounds/swoosh.mp3',
      pop: '/sounds/pop.mp3'
    };
    // Fallback to external URLs if local files are missing (for demo purposes)
    const fallbacks = {
      chime: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
      swoosh: 'https://www.soundjay.com/button/sounds/button-20.mp3',
      pop: 'https://www.soundjay.com/button/sounds/button-37.mp3'
    };
    
    let audioUrl = fallbacks[type];
    
    try {
      const checkLocal = await fetch(urls[type], { method: 'HEAD' });
      if (checkLocal.ok) {
        audioUrl = urls[type];
      }
    } catch (e) {
      // Local file not found, use fallback
    }

    const audio = new Audio(audioUrl);
    audio.volume = 0.2;
    audio.play().catch(err => {
      console.log("Cue failed:", err);
      // We don't show a toast for UI cues to avoid spamming the user
    });
  };

  const getThemeStyles = () => {
    let baseStyles;
    switch (theme) {
      case Theme.KID:
        baseStyles = {
          bg: 'bg-[#FFF9E6]',
          card: 'bg-white rounded-[40px] border-4 border-[#FFD93D] shadow-[8px_8px_0px_0px_#FFD93D]',
          primary: 'text-[#FF6B6B]',
          accent: 'bg-[#4D96FF]',
          button: 'bg-[#FF6B6B] hover:bg-[#FF8787] rounded-full shadow-[4px_4px_0px_0px_#EE5253]',
          font: 'font-["Comic_Sans_MS",_cursive,_sans-serif]',
          icon: 'text-[#6BCB77]'
        };
        break;
      case Theme.TEENAGE:
        baseStyles = {
          bg: 'bg-[#0F172A]',
          card: 'bg-[#1E293B] rounded-none border-2 border-[#38BDF8] shadow-[4px_4px_0px_0px_#38BDF8]',
          primary: 'text-[#38BDF8]',
          accent: 'bg-[#F472B6]',
          button: 'bg-[#38BDF8] hover:bg-[#7DD3FC] rounded-none uppercase tracking-tighter',
          font: 'font-mono',
          icon: 'text-[#F472B6]'
        };
        break;
      case Theme.PLAYFUL:
        baseStyles = {
          bg: 'bg-[#FFEFD5]',
          card: 'bg-white rounded-[60px] border-8 border-[#FF69B4] shadow-[12px_12px_0px_0px_#FF69B4]',
          primary: 'text-[#FF1493]',
          accent: 'bg-[#00BFFF]',
          button: 'bg-[#FF69B4] hover:bg-[#FF1493] rounded-full shadow-[6px_6px_0px_0px_#C71585]',
          font: 'font-["Bubblegum_Sans",_cursive,_sans-serif]',
          icon: 'text-[#32CD32]'
        };
        break;
      case Theme.PROFESSIONAL:
        baseStyles = {
          bg: 'bg-[#F8FAFC]',
          card: 'bg-white rounded-lg border border-slate-200 shadow-sm',
          primary: 'text-slate-900',
          accent: 'bg-slate-800',
          button: 'bg-slate-900 hover:bg-slate-800 rounded-md',
          font: 'font-sans',
          icon: 'text-slate-600'
        };
        break;
      default: // MODERN
        baseStyles = {
          bg: 'bg-[#F8FAFC]',
          card: 'glass rounded-4xl master-shadow',
          primary: 'text-primary',
          accent: 'bg-accent',
          button: 'master-gradient hover:shadow-primary/30 rounded-2xl text-white font-black uppercase tracking-widest',
          font: 'font-sans',
          icon: 'text-primary'
        };
    }

    // Apply Sensory Profile Overrides
    if (sensoryProfile) {
      if (sensoryProfile.calmingColors) {
        baseStyles.bg = 'bg-[#F0F4F8]'; // Soft blue-gray
        baseStyles.primary = 'text-[#4A6FA5]';
        baseStyles.button = 'bg-[#4A6FA5] hover:bg-[#3D5A80] rounded-full';
      }
      if (sensoryProfile.highContrast) {
        baseStyles.bg = 'bg-white';
        baseStyles.card = 'bg-white rounded-none border-4 border-black shadow-none';
        baseStyles.primary = 'text-black font-black';
        baseStyles.button = 'bg-black hover:bg-slate-800 text-white rounded-none';
      }
      if (sensoryProfile.reducedMotion) {
        // We can't easily change the motion props here, but we can change the transition duration if we pass it
        baseStyles.reducedMotion = true;
      }
    }

    return baseStyles;
  };

  const styles = getThemeStyles();

  const renderStoryText = (text: string, interactiveWords?: any[]) => {
    const words = text.split(/(\s+)/);
    
    return words.map((word, i) => {
      if (word.trim() === '') return word;

      const cleanWord = word.replace(/[.,!?;:]/g, '');
      const interactive = interactiveWords?.find(w => w.word.toLowerCase() === cleanWord.toLowerCase());
      
      const animations = ['bounce', 'shake', 'pulse'] as const;
      const animation = interactive?.animation || animations[cleanWord.length % animations.length];

      const handleClick = () => {
        if (interactive) {
          setActiveWord(interactive);
          if (interactive.audioUrl) {
            playTargetAudio(interactive.audioUrl);
          } else {
            speakText(cleanWord, selectedExercise?.language);
          }
        } else {
          speakText(cleanWord, selectedExercise?.language);
        }
      };

      return (
        <motion.span
          key={i}
          onClick={handleClick}
          whileHover={{ 
            scale: 1.1, 
            color: interactive ? 'var(--color-accent)' : 'var(--color-primary)',
            cursor: 'pointer'
          }}
          whileTap={{ scale: 0.95 }}
          animate={interactive ? (
            animation === 'bounce' ? { y: [0, -8, 0] } : 
            animation === 'shake' ? { x: [-2, 2, -2] } : 
            animation === 'pulse' ? { scale: [1, 1.1, 1] } : {}
          ) : {}}
          transition={{ 
            duration: 0.6, 
            repeat: interactive ? Infinity : 0, 
            repeatType: "reverse" 
          }}
          className={`inline-block px-1 rounded-lg transition-colors ${
            interactive 
              ? 'font-black underline decoration-accent decoration-4 underline-offset-4 text-accent' 
              : 'hover:bg-slate-50'
          }`}
        >
          {word}
        </motion.span>
      );
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const handleStartPractice = async (exercise: Exercise) => {
    if (exercise.isPremium && !isPremiumUser) {
      setView('pricing');
      return;
    }
    if (isOfflineMode && !downloadedIds.includes(exercise.id)) {
      return; // Can't start non-downloaded exercise in offline mode
    }
    playCue('swoosh');
    
    // Scroll to practice area
    setTimeout(() => {
      practiceAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Enrich story with images and audio if they are missing
    let enrichedExercise = { ...exercise };
    if (exercise.type === ExerciseType.STORY && exercise.story) {
      const needsImages = exercise.story.some(p => !p.imageUrl);
      const needsAudio = exercise.story.some(p => p.interactiveWords?.some(w => !w.audioUrl));
      
      if (needsImages || needsAudio) {
        setIsGeneratingStory(true); // Use generating story state for loading
        try {
          let enrichedStory = [...exercise.story];
          if (needsImages) {
            enrichedStory = await enrichStoryWithImages(enrichedStory, exercise.title);
          }
          if (needsAudio) {
            enrichedStory = await enrichStoryWithAudio(enrichedStory);
          }
          
          enrichedExercise = { ...exercise, story: enrichedStory };
          if (!enrichedExercise.imageUrl) {
            enrichedExercise.imageUrl = enrichedStory[0]?.imageUrl;
          }
        } catch (error) {
          handleError(error, ErrorType.AI_API);
        } finally {
          setIsGeneratingStory(false);
        }
      }
    }

    setSelectedExercise(enrichedExercise);
    setFeedback(null);
    setShowGuide(false);
    setSliderValue(0);
    
    // Resume from bookmark if it exists
    if (exercise.type === ExerciseType.STORY && bookmarks[exercise.id] !== undefined) {
      setCurrentStoryPage(bookmarks[exercise.id]);
    } else {
      setCurrentStoryPage(0);
    }

    if (exercise.spinningSyllables) {
      setSpinValues(exercise.spinningSyllables.map(() => 0));
    } else {
      setSpinValues([]);
    }
    setView('practice');
  };

  const toggleBookmark = (exerciseId: string, pageIndex: number) => {
    setBookmarks(prev => {
      const next = { ...prev };
      if (next[exerciseId] === pageIndex) {
        delete next[exerciseId];
      } else {
        next[exerciseId] = pageIndex;
      }
      return next;
    });
    playCue('chime');
  };

  const handleSpinAll = () => {
    if (!selectedExercise?.spinningSyllables) return;
    
    selectedExercise.spinningSyllables.forEach((options, i) => {
      let count = 0;
      const max = 4 + Math.floor(Math.random() * 4);
      const interval = setInterval(() => {
        setSpinValues(prev => {
          const next = [...prev];
          next[i] = Math.floor(Math.random() * options.length);
          return next;
        });
        count++;
        if (count >= max) clearInterval(interval);
      }, 100);
    });
  };

  const handleSaveStory = async () => {
    if (!user || !selectedExercise || !selectedExercise.id.startsWith('ai-')) return;
    
    try {
      const storiesRef = collection(db, 'users', user.uid, 'stories');
      const { id, ...storyData } = selectedExercise;
      await addDoc(storiesRef, {
        ...storyData,
        createdAt: new Date().toISOString()
      });
      toast.success('Story saved to your library!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/stories`, auth);
    }
  };

  const handleGenerateStory = async () => {
    if (!isPremiumUser) {
      setView('pricing');
      return;
    }
    if (!storyTopic.trim()) return;
    
    setIsGeneratingStory(true);
    try {
      const result = await generateStory(storyTopic, storyLanguage, storyDifficulty);
      const newStory: Exercise = {
        id: `ai-${Date.now()}`,
        ...result,
        imageUrl: result.story[0]?.imageUrl, // Set top-level image to first page
        language: storyLanguage,
        difficulty: storyDifficulty,
        type: ExerciseType.STORY,
        category: 'Story Time',
        isPremium: true, // AI generation is a premium feature
      };
      
      setSelectedExercise(newStory);
      setShowGenerationModal(false);
      setStoryTopic('');
      playCue('chime');
    } catch (error) {
      handleError(error, ErrorType.AI_API);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const handleTranslateStory = async () => {
    if (!isPremiumUser) {
      setView('pricing');
      return;
    }
    if (!selectedExercise || selectedExercise.type !== ExerciseType.STORY || isTranslating) return;
    
    const currentText = selectedExercise.story![currentStoryPage].text;
    setIsTranslating(true);
    try {
      const translation = await translateStoryPage(currentText);
      if (translation) {
        setTranslatedStoryText(translation);
      }
    } catch (error) {
      handleError(error, ErrorType.AI_API);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpinSlot = (i: number) => {
    if (!selectedExercise?.spinningSyllables) return;
    const options = selectedExercise.spinningSyllables[i];
    let count = 0;
    const max = 4;
    const interval = setInterval(() => {
      setSpinValues(prev => {
        const next = [...prev];
        next[i] = Math.floor(Math.random() * options.length);
        return next;
      });
      count++;
      if (count >= max) clearInterval(interval);
    }, 100);
  };

  const handleDownload = (e: any, id: string) => {
    e.stopPropagation();
    if (!isPremiumUser) {
      setView('pricing');
      return;
    }
    setDownloadedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    let urlsToRevoke: string[] = [];
    const loadLocalUserRecordings = async () => {
      if (activeProfile) {
        const recordings = await localDb.recordings
          .where({ profileId: activeProfile.id, type: 'user' })
          .reverse()
          .sortBy('timestamp');
        
        const mapped = recordings.map(r => {
          const url = URL.createObjectURL(r.audioBlob);
          urlsToRevoke.push(url);
          return {
            id: `local-${r.id}`,
            exerciseId: r.exerciseId,
            exerciseTitle: r.exerciseTitle,
            audioUrl: url,
            timestamp: r.timestamp,
            score: r.score || 0,
            isLocal: true
          };
        });
        
        setLocalUserRecordings(mapped);
      }
    };
    loadLocalUserRecordings();

    return () => {
      urlsToRevoke.forEach(url => URL.revokeObjectURL(url));
    };
  }, [activeProfileId, isRecording, localRecordingsTrigger]); // Refresh when profile changes, recording stops, or manual trigger

  useEffect(() => {
    const loadLocalMentorAudio = async () => {
      if (selectedExercise && activeProfile) {
        const recording = await localDb.recordings
          .where({ exerciseId: selectedExercise.id, type: 'target', profileId: activeProfile.id })
          .first();
        if (recording) {
          setLocalMentorAudio(URL.createObjectURL(recording.audioBlob));
        } else {
          setLocalMentorAudio(null);
        }
      }
    };
    loadLocalMentorAudio();
  }, [selectedExercise, activeProfile]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Browser support check
  useEffect(() => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      toast.error("Unsupported Browser", {
        description: "Your browser doesn't support audio recording. Please try Chrome, Safari, or Firefox."
      });
    }
  }, []);

  // Handle recording interruptions (tab switch, mobile background)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRecording) {
        stopRecording();
        handleError(new Error('interrupted: Recording stopped because you switched tabs.'), ErrorType.AUDIO);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        throw new Error('Unsupported browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.onerror = (e: any) => {
        handleError(e.error || new Error('Recorder error'), ErrorType.AUDIO);
        stopRecording();
      };

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());

        if (chunks.length === 0) {
          setIsAnalyzing(false);
          setIsRecording(false);
          handleError(new Error('empty audio'), ErrorType.AUDIO);
          return;
        }

        const blob = new Blob(chunks, { type: 'audio/webm' });
        
        if (blob.size < 100) {
          setIsAnalyzing(false);
          setIsRecording(false);
          handleError(new Error('empty audio'), ErrorType.AUDIO);
          return;
        }

        const audioUrl = URL.createObjectURL(blob);
        
        if (isMentorMode) {
          if (selectedExercise && activeProfile) {
            // Save mentor target recording
            await localDb.recordings.add({
              exerciseId: selectedExercise.id,
              type: 'target',
              audioBlob: blob,
              timestamp: Date.now(),
              exerciseTitle: selectedExercise.title,
              profileId: activeProfile.id
            });
            setLocalMentorAudio(audioUrl);
            toast.success("Mentor recording saved!");
          }
          setIsRecording(false);
          return;
        }

        // Student recording logic
        setIsAnalyzing(true);
        
        (async () => {
          if (selectedExercise) {
            try {
              const targetText = selectedExercise.type === ExerciseType.STORY 
                ? selectedExercise.story![currentStoryPage].text 
                : selectedExercise.type === ExerciseType.PRONUNCIATION_DRILL && selectedExercise.targetSentence
                  ? selectedExercise.targetSentence
                  : selectedExercise.targetWord || "";

              let result: SpeechAnalysisResult;

              if (isOfflineMode || !activeProfile?.isPro) {
                const pseudo = pseudoAnalyze(selectedExercise, blob);
                result = {
                  score: pseudo.score,
                  accuracy: Math.max(0, pseudo.score - 5),
                  fluency: Math.max(0, pseudo.score - 2),
                  pronunciation: Math.max(0, pseudo.score - 8),
                  feedback: pseudo.feedback,
                  isPerfect: pseudo.score >= 95
                };
              } else {
                result = await analyzeSpeech(
                  blob,
                  targetText,
                  selectedExercise.language,
                  selectedExercise.difficulty,
                  selectedExercise.targetSentence,
                  selectedExercise.pronunciationGuide?.mouthPosition,
                  selectedExercise.pronunciationGuide?.tonguePlacement
                );
              }

              setFeedback(result);
              playCue('chime');

              if (result.score >= 90) {
                setComboCount(prev => prev + 1);
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ['#FFD700', '#FFA500', '#FF4500']
                });
              } else {
                setComboCount(0);
              }
              
              // Save to Repository (Local-First)
              if (activeProfile) {
                const recording: LocalRecording = {
                  exerciseId: selectedExercise.id,
                  type: 'user',
                  audioBlob: blob,
                  timestamp: Date.now(),
                  score: result.score,
                  exerciseTitle: selectedExercise.title,
                  profileId: activeProfile.id,
                  metrics: {
                    accuracy: result.accuracy,
                    fluency: result.fluency,
                    pronunciation: result.pronunciation,
                    feedback: result.feedback
                  }
                };
                
                await repository.saveRecording(recording, cloudSync && activeProfile.isPro);
                
                // Update Profile Stats locally
                const updatedProfile = {
                  ...activeProfile,
                  points: activeProfile.points + Math.floor(result.score / 10),
                  lastActive: Date.now()
                };
                await repository.saveProfile(updatedProfile);
                setProfiles(prev => prev.map(p => p.id === activeProfile.id ? updatedProfile : p));
              }
            } catch (error) {
              console.error("Speech analysis failed:", error);
              toast.error("Speech analysis failed. Please try again.");
            } finally {
              setIsAnalyzing(false);
              setIsRecording(false);
            }
          } else {
            setIsAnalyzing(false);
            setIsRecording(false);
          }
        })();
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      handleError(err, ErrorType.AUDIO);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      try {
        mediaRecorder.stop();
        if (mediaRecorder.stream) {
          mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        console.error("Error stopping recorder:", err);
      }
    }
  };


  return (
    <MotionConfig reducedMotion={sensoryProfile?.reducedMotion ? "always" : "never"}>
      <div 
        className={`min-h-screen flex flex-col transition-all duration-500 ${styles.bg} ${styles.font} ${
          sensoryProfile?.calmingColors ? 'calming-colors' : ''
        } ${sensoryProfile?.highContrast ? 'high-contrast' : ''}`}
        style={{ fontSize: sensoryProfile?.fontScale ? `${sensoryProfile.fontScale}rem` : undefined }}
      >
      <AnimatePresence>
        {activeAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
            onClick={() => setActiveAnimation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveAnimation(null)}
                className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
              
              <h3 className="text-2xl font-black mb-6 text-center">{activeAnimation.title}</h3>
              
              <div className="aspect-square rounded-3xl overflow-hidden border-4 border-slate-100 shadow-inner bg-slate-50 flex items-center justify-center">
                {activeAnimation.url.toLowerCase().endsWith('.mp4') || activeAnimation.url.toLowerCase().endsWith('.webm') ? (
                  <video 
                    src={activeAnimation.url} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img 
                    src={activeAnimation.url} 
                    alt={activeAnimation.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              
              <div className="mt-8 flex flex-col items-center gap-4">
                <p className="text-slate-500 text-sm font-medium text-center max-w-md">
                  Watch carefully how the mouth and tongue move to make this sound!
                </p>
                <button
                  onClick={() => setActiveAnimation(null)}
                  className={`px-12 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 ${styles.button}`}
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
            onClick={() => setActiveAnimation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveAnimation(null)}
                className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
              
              <h3 className="text-2xl font-black mb-6 text-center">{activeAnimation.title}</h3>
              
              <div className="aspect-square rounded-3xl overflow-hidden border-4 border-slate-100 shadow-inner bg-slate-50 flex items-center justify-center">
                {activeAnimation.url.toLowerCase().endsWith('.mp4') || activeAnimation.url.toLowerCase().endsWith('.webm') ? (
                  <video 
                    src={activeAnimation.url} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img 
                    src={activeAnimation.url} 
                    alt={activeAnimation.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              
              <div className="mt-8 flex flex-col items-center gap-4">
                <p className="text-slate-500 text-sm font-medium text-center max-w-md">
                  Watch carefully how the mouth and tongue move to make this sound!
                </p>
                <button
                  onClick={() => setActiveAnimation(null)}
                  className={`px-12 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 ${styles.button}`}
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="top-center" richColors />
      {/* Achievement Notification */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-50 bg-white border-2 border-primary p-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px]"
          >
            <div className="text-4xl">{newAchievement.icon}</div>
            <div>
              <p className="text-xs font-black text-primary uppercase tracking-widest">Achievement Unlocked!</p>
              <h4 className="font-bold text-lg">{newAchievement.title}</h4>
              <p className="text-sm text-slate-500">{newAchievement.description}</p>
            </div>
            <button 
              onClick={() => setNewAchievement(null)}
              className="ml-auto text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Word Modal */}
      <AnimatePresence>
        {activeWord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setActiveWord(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`max-w-sm w-full p-8 text-center relative ${styles.card}`}
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveWord(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
              <div className={`text-4xl mb-4 inline-block p-4 rounded-2xl bg-slate-50 ${styles.primary}`}>
                <BookOpen className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{activeWord.word}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{activeWord.definition}</p>
              
              <button
                disabled={isGeneratingWordAudio}
                onClick={async () => {
                  playCue('pop');
                  if (activeWord.audioUrl) {
                    playTargetAudio(activeWord.audioUrl);
                  } else {
                    setIsGeneratingWordAudio(true);
                    try {
                      const audioUrl = await generateWordAudio(activeWord.word);
                      if (audioUrl) {
                        // Update the active word in state
                        const updatedWord = { ...activeWord, audioUrl };
                        setActiveWord(updatedWord);
                        
                        // Also update it in the selected exercise so it's cached
                        if (selectedExercise?.story) {
                          const updatedStory = selectedExercise.story.map(page => ({
                            ...page,
                            interactiveWords: page.interactiveWords?.map(w => 
                              w.word === activeWord.word ? { ...w, audioUrl } : w
                            )
                          }));
                          setSelectedExercise({ ...selectedExercise, story: updatedStory });
                        }

                        playTargetAudio(audioUrl);
                      }
                    } catch (error) {
                      handleError(error, ErrorType.AI_API);
                    } finally {
                      setIsGeneratingWordAudio(false);
                    }
                  }
                }}
                className={`flex items-center justify-center gap-2 w-full py-3 mb-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold transition-all hover:bg-slate-100 ${styles.primary} ${isGeneratingWordAudio ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isGeneratingWordAudio ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
                {isGeneratingWordAudio ? 'Generating...' : 'Listen to Pronunciation'}
              </button>

              <button
                onClick={() => setActiveWord(null)}
                className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all ${styles.button}`}
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Story Generation Modal */}
      <AnimatePresence>
        {showGenerationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !isGeneratingStory && setShowGenerationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`max-w-md w-full p-8 relative ${styles.card}`}
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowGenerationModal(false)}
                disabled={isGeneratingStory}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 disabled:opacity-30"
              >
                ✕
              </button>
              
              <div className="text-center mb-8">
                <div className={`w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 ${styles.primary}`}>
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">AI Story Creator</h3>
                <p className="text-slate-500">What should our story be about?</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Topic or Theme</label>
                  <input 
                    type="text"
                    value={storyTopic}
                    onChange={(e) => setStoryTopic(e.target.value)}
                    placeholder="e.g., A space adventure with a robot"
                    disabled={isGeneratingStory}
                    className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Language</label>
                    <select 
                      value={storyLanguage}
                      onChange={(e) => setStoryLanguage(e.target.value as Language)}
                      disabled={isGeneratingStory}
                      className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-primary outline-none transition-all bg-white"
                    >
                      <option value={Language.ENGLISH}>English</option>
                      <option value={Language.SPANISH}>Spanish</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Difficulty</label>
                    <select 
                      value={storyDifficulty}
                      onChange={(e) => setStoryDifficulty(e.target.value as Difficulty)}
                      disabled={isGeneratingStory}
                      className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-primary outline-none transition-all bg-white"
                    >
                      <option value={Difficulty.EASY}>Easy</option>
                      <option value={Difficulty.MEDIUM}>Medium</option>
                      <option value={Difficulty.HARD}>Hard</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerateStory}
                  disabled={isGeneratingStory || !storyTopic.trim()}
                  className={`w-full py-4 text-white font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${styles.button} disabled:opacity-50`}
                >
                  {isGeneratingStory ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Story
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <AnimatePresence>
        {!isNavbarHidden && (
          <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="sticky top-0 z-50 glass px-6 py-4"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div 
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => {
                    playCue('swoosh');
                    setView('practice');
                    setSelectedExercise(null);
                  }}
                >
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform`}>
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-900">Bilingual & Brilliant</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Speech Assistance</p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => {
                      playCue('swoosh');
                      setView('practice');
                      setSelectedExercise(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'practice' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Practice
                  </button>
                  <button 
                    onClick={() => {
                      playCue('swoosh');
                      setView('lessons');
                      setSelectedLessonPlan(null);
                      setIsBuildingLesson(false);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'lessons' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Lessons
                  </button>
                  <button 
                    onClick={() => {
                      playCue('swoosh');
                      setView('stories');
                      setSelectedExercise(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'stories' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Stories
                  </button>
                  <button 
                    onClick={() => {
                      playCue('swoosh');
                      setView('matching-game');
                      setSelectedExercise(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'matching-game' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Games
                  </button>
                  <button 
                    onClick={() => {
                      playCue('swoosh');
                      setView('videos');
                      setSelectedExercise(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'videos' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Videos
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-slate-900">{activeProfile.name}</span>
                    <span className="text-[10px] font-bold text-primary">{activeProfile.points} pts</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg shadow-sm border border-slate-100">
                    {activeProfile.avatar}
                  </div>
                </div>

                <button 
                  onClick={() => setView('settings')}
                  className={`p-2.5 rounded-2xl transition-all ${view === 'settings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'}`}
                >
                  <Settings className="w-5 h-5" />
                </button>

                {!isPremiumUser && (
                  <button 
                    onClick={() => setView('pricing')}
                    className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-secondary to-secondary/80 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Crown className="w-4 h-4" />
                    Go Pro
                  </button>
                )}

                <button 
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className={`p-2.5 rounded-2xl transition-all ${isFocusMode ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'}`}
                  title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Floating Toggle for Navbar when hidden */}
      {isNavbarHidden && (
        <motion.button
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => setIsNavbarHidden(false)}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-2xl border border-slate-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-3 h-3 rotate-90" />
          Show Menu
        </motion.button>
      )}

      <main className={`flex-1 ${isFocusMode ? 'max-w-full' : LAYOUT_CONFIG.maxContainerWidth} mx-auto w-full ${LAYOUT_CONFIG.containerPadding}`}>
        <AnimatePresence mode="wait">
          {(view === 'practice' || view === 'stories') && (
            <motion.div 
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex flex-col lg:flex-row ${LAYOUT_CONFIG.sidebarGap} relative`}
            >
              {/* Left Column: Exercise List (Sidebar) */}
              <motion.div 
                animate={{ 
                  width: (isSidebarCollapsed || isFocusMode) ? 0 : LAYOUT_CONFIG.sidebarWidthDesktop,
                  opacity: (isSidebarCollapsed || isFocusMode) ? 0 : 1,
                  marginRight: (isSidebarCollapsed || isFocusMode) ? LAYOUT_CONFIG.sidebarCollapsedMargin : 0
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                className="lg:w-1/3 space-y-6 overflow-hidden flex-shrink-0"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black uppercase tracking-tight">
                    {view === 'stories' ? 'Stories' : (isOfflineMode ? 'Offline' : 'Practice')}
                  </h2>
                  {view === 'stories' && (
                    <button
                      onClick={() => setShowGenerationModal(true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${styles.button}`}
                    >
                      <Sparkles className="w-4 h-4" />
                      AI Generate
                    </button>
                  )}
                  <span className="text-sm text-slate-500 font-medium">
                    {isOfflineMode 
                      ? `${[...EXERCISES, ...savedStories].filter(ex => (view === 'stories' ? ex.type === ExerciseType.STORY : ex.type !== ExerciseType.STORY) && downloadedIds.includes(ex.id)).length} Offline` 
                      : `${[...EXERCISES, ...savedStories].filter(ex => (view === 'stories' ? ex.type === ExerciseType.STORY : ex.type !== ExerciseType.STORY)).length} Available`}
                  </span>
                </div>

                {isOfflineMode && downloadedIds.length === 0 && (
                  <div className="p-8 bg-amber-50 border border-amber-100 rounded-2xl text-center">
                    <CloudOff className="w-10 h-10 text-amber-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-amber-800 mb-1">No Offline Exercises</p>
                    <p className="text-xs text-amber-600">Switch to online mode to download your favorite exercises.</p>
                  </div>
                )}

                <div className="space-y-8">
                  {dailyChallenge && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-6 rounded-3xl border-2 border-primary/20 bg-primary/5 shadow-lg shadow-primary/5 relative overflow-hidden group`}
                    >
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary text-white rounded-xl">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Daily Challenge</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">{dailyGoalProgress}% Complete</span>
                            <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${dailyGoalProgress}%` }}
                                className="h-full bg-primary" 
                              />
                            </div>
                          </div>
                        </div>
                        <h3 className="text-xl font-black mb-1">{dailyChallenge.title}</h3>
                        <p className="text-sm text-slate-500 mb-4">{dailyChallenge.description}</p>
                        <button
                          onClick={() => handleStartPractice(dailyChallenge)}
                          className={`px-6 py-2 rounded-xl text-white text-sm font-black uppercase tracking-widest shadow-lg transition-all hover:scale-105 active:scale-95 ${styles.button}`}
                        >
                          Start Challenge
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {(Object.entries(
                    [...EXERCISES, ...savedStories]
                      .filter(ex => view === 'stories' ? ex.type === ExerciseType.STORY : ex.type !== ExerciseType.STORY)
                      .filter(ex => !isOfflineMode || downloadedIds.includes(ex.id))
                      .reduce((acc, ex) => {
                        if (!acc[ex.category]) acc[ex.category] = [];
                        acc[ex.category].push(ex);
                        return acc;
                      }, {} as Record<string, Exercise[]>)
                  ) as [string, Exercise[]][]).map(([category, items]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center gap-3 px-2">
                        <div className="h-px flex-1 bg-slate-100" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          {category}
                        </h4>
                        <div className="h-px flex-1 bg-slate-100" />
                      </div>
                      
                      <div className="space-y-3">
                        {items.map((ex) => (
                          <motion.div
                            key={ex.id}
                            whileHover={{ 
                              scale: 1.02, 
                              x: 4,
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStartPractice(ex)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                handleStartPractice(ex);
                              }
                            }}
                            className={`w-full text-left p-4 transition-all flex items-center gap-4 cursor-pointer ${styles.card} ${
                              selectedExercise?.id === ex.id 
                                ? `ring-2 ring-primary border-transparent bg-primary/5` 
                                : `hover:border-primary/50`
                            }`}
                          >
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                              <img 
                                src={ex.imageUrl} 
                                alt={ex.title} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {downloadedIds.includes(ex.id) && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                  <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold truncate">{ex.title}</h3>
                                {ex.isPremium && <Lock className="w-3 h-3 text-slate-400" />}
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-slate-500 truncate">{ex.description}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                                  ex.difficulty === Difficulty.EASY ? 'bg-green-100 text-green-700' :
                                  ex.difficulty === Difficulty.MEDIUM ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {ex.difficulty}
                                </span>
                                {bookmarks[ex.id] !== undefined && (
                                  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase bg-primary/10 text-primary">
                                    <Bookmark className="w-2.5 h-2.5" />
                                    Page {bookmarks[ex.id] + 1}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!isOfflineMode && (
                                <button
                                  onClick={(e) => handleDownload(e, ex.id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    downloadedIds.includes(ex.id)
                                      ? 'bg-primary/10 text-primary'
                                      : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'
                                  }`}
                                  title={downloadedIds.includes(ex.id) ? "Remove from offline" : "Download for offline"}
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              )}
                              <ChevronRight className={`w-5 h-5 ${selectedExercise?.id === ex.id ? styles.primary : 'text-slate-300'}`} />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Sidebar Toggle Tab */}
              {!isFocusMode && (
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className={`hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-24 bg-white border border-slate-100 shadow-xl rounded-r-2xl items-center justify-center transition-all duration-500 hover:bg-slate-50 group ${isSidebarCollapsed ? 'translate-x-0' : 'translate-x-[calc(33.333333%*1.0)]'}`}
                  style={{ 
                    left: isSidebarCollapsed ? 0 : `calc(${LAYOUT_CONFIG.sidebarWidthDesktop} - 1rem)`,
                    transition: 'left 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  {isSidebarCollapsed ? (
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                  ) : (
                    <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                  )}
                </button>
              )}

              {/* Right Column: Practice Area (Practice View) */}
              <motion.div 
                animate={{ 
                  width: (isSidebarCollapsed || isFocusMode) ? '100%' : LAYOUT_CONFIG.practiceAreaWidthDesktop,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                className="flex-1 scroll-mt-24" 
                ref={practiceAreaRef}
              >
                <AnimatePresence mode="wait">
                  {selectedExercise ? (
                      <motion.div
                        key={selectedExercise.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: theme === Theme.PLAYFUL ? [0, -10, 0] : 0 
                        }}
                        transition={{
                          y: theme === Theme.PLAYFUL ? {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          } : { duration: 0.3 }
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-8 lg:h-full min-h-[500px] flex flex-col ${styles.card}`}
                      >
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles.accent} text-white`}>
                              {selectedExercise.type} • {selectedExercise.language === Language.ENGLISH ? 'English' : 'Spanish'}
                            </span>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              selectedExercise.difficulty === Difficulty.EASY ? 'bg-green-100 text-green-700' :
                              selectedExercise.difficulty === Difficulty.MEDIUM ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {selectedExercise.difficulty}
                            </span>
                            {isOfflineMode && (
                              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                <WifiOff className="w-3 h-3" /> Offline
                              </span>
                            )}
                          </div>
                          <h2 className="text-3xl font-extrabold">{selectedExercise.title}</h2>
                        </div>
                        <div className="flex items-center gap-4">
                          {selectedExercise.type === ExerciseType.STORY && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={handleTranslateStory}
                                disabled={isTranslating}
                                className={`p-2 rounded-lg transition-all ${
                                  translatedStoryText 
                                    ? 'bg-blue-100 text-blue-600' 
                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                }`}
                                title="Translate to Spanish"
                              >
                                {isTranslating ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <Globe className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => toggleBookmark(selectedExercise.id, currentStoryPage)}
                                className={`p-2 rounded-lg transition-all ${
                                  bookmarks[selectedExercise.id] === currentStoryPage
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                }`}
                                title={bookmarks[selectedExercise.id] === currentStoryPage ? "Remove Bookmark" : "Bookmark this page"}
                              >
                                <Bookmark className="w-5 h-5" />
                              </button>
                              {selectedExercise.id.startsWith('ai-') && (
                                <button
                                  onClick={handleSaveStory}
                                  className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all"
                                  title="Save to Library"
                                >
                                  <Download className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          )}
                          <button 
                            onClick={() => setSelectedExercise(null)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 py-4">
                          {[
                            ExerciseType.FOLLOWING_DIRECTIONS,
                            ExerciseType.SOCIAL_SKILLS,
                            ExerciseType.IMPULSIVITY_PRACTICE,
                            ExerciseType.FOCUS_SESSION
                          ].includes(selectedExercise.type) ? (
                            <div className="w-full max-w-3xl">
                              <SpecializedExerciseView
                                exercise={selectedExercise}
                                styles={styles}
                                playCue={playCue}
                                onComplete={(score) => saveVoiceRecording("", score, selectedExercise)}
                                localMentorAudio={localMentorAudio}
                                playTargetAudio={playTargetAudio}
                              />
                            </div>
                          ) : selectedExercise.type === ExerciseType.STORY ? (
                          <div className="w-full space-y-8">
                            <div className="relative max-w-2xl mx-auto">
                              <AnimatePresence mode="wait">
                                <motion.div 
                                  key={currentStoryPage}
                                  drag="x"
                                  dragConstraints={{ left: 0, right: 0 }}
                                  onDragEnd={(_, { offset, velocity }) => {
                                    const swipeThreshold = 50;
                                    const velocityThreshold = 500;
                                    if (Math.abs(offset.x) > swipeThreshold && Math.abs(velocity.x) > velocityThreshold) {
                                      if (offset.x > 0) {
                                        // Swipe right -> Previous page
                                        if (currentStoryPage > 0) {
                                          setCurrentStoryPage(currentStoryPage - 1);
                                          playCue('swoosh');
                                        }
                                      } else {
                                        // Swipe left -> Next page
                                        if (currentStoryPage < selectedExercise.story!.length - 1) {
                                          setCurrentStoryPage(currentStoryPage + 1);
                                          playCue('swoosh');
                                        }
                                      }
                                    }
                                  }}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  className={`p-8 rounded-[40px] border-4 border-slate-100 shadow-xl bg-white cursor-grab active:cursor-grabbing touch-none`}
                                >
                                  <div className="aspect-video rounded-2xl overflow-hidden mb-6 border-2 border-slate-50">
                                    <img 
                                      src={selectedExercise.story![currentStoryPage].imageUrl} 
                                      alt="Story illustration" 
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="space-y-6">
                                    <div className="flex items-center justify-center gap-4">
                                      <div className={`text-2xl font-bold leading-relaxed ${styles.primary}`}>
                                        {renderStoryText(
                                          selectedExercise.story![currentStoryPage].text,
                                          selectedExercise.story![currentStoryPage].interactiveWords
                                        )}
                                      </div>
                                      {selectedExercise.story![currentStoryPage].audioUrl && (
                                        <button
                                          onClick={() => playTargetAudio(selectedExercise.story![currentStoryPage].audioUrl!)}
                                          disabled={isPlayingAudio}
                                          className={`p-3 rounded-full ${styles.card} border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50`}
                                        >
                                          <Volume2 className={`w-6 h-6 ${isPlayingAudio ? 'text-accent animate-pulse' : styles.primary}`} />
                                        </button>
                                      )}
                                      <button
                                        onClick={translateStory}
                                        disabled={isTranslating}
                                        className={`p-3 rounded-full ${styles.card} border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 px-4`}
                                        title="Translate to Spanish"
                                      >
                                        <Languages className={`w-5 h-5 ${isTranslating ? 'text-accent animate-spin' : styles.primary}`} />
                                        <span className="text-xs font-black uppercase tracking-widest">Translate</span>
                                      </button>
                                    </div>

                                    {translatedStoryText && (
                                      <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-lg text-slate-500 italic border-t border-slate-100 pt-4"
                                      >
                                        {translatedStoryText}
                                      </motion.div>
                                    )}
                                  </div>
                                </motion.div>
                              </AnimatePresence>

                              {/* Story Navigation */}
                              <div className="flex items-center justify-between mt-8">
                                <button
                                  onClick={() => setCurrentStoryPage(Math.max(0, currentStoryPage - 1))}
                                  disabled={currentStoryPage === 0}
                                  className={`p-4 rounded-full bg-white border-2 border-slate-100 shadow-md disabled:opacity-30 transition-all hover:scale-110`}
                                >
                                  <ChevronLeft className={`w-6 h-6 ${styles.primary}`} />
                                </button>
                                
                                <div className="flex gap-2">
                                  {selectedExercise.story!.map((_, idx) => (
                                    <div 
                                      key={idx}
                                      className={`w-3 h-3 rounded-full transition-all ${idx === currentStoryPage ? styles.accent : 'bg-slate-200'}`}
                                    />
                                  ))}
                                </div>

                                <button
                                  onClick={() => setCurrentStoryPage(Math.min(selectedExercise.story!.length - 1, currentStoryPage + 1))}
                                  disabled={currentStoryPage === selectedExercise.story!.length - 1}
                                  className={`p-4 rounded-full bg-white border-2 border-slate-100 shadow-md disabled:opacity-30 transition-all hover:scale-110`}
                                >
                                  <ChevronRight className={`w-6 h-6 ${styles.primary}`} />
                                </button>
                              </div>

                              {/* Story Progress Bar */}
                              <div className="mt-6 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${((currentStoryPage + 1) / selectedExercise.story!.length) * 100}%` }}
                                  className={`h-full ${styles.accent}`}
                                />
                              </div>

                              {currentStoryPage === selectedExercise.story!.length - 1 && (
                                <motion.button
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  onClick={() => {
                                    playCue('chime');
                                    setSelectedExercise(null);
                                  }}
                                  className={`mt-8 w-full py-4 text-white font-black uppercase tracking-widest shadow-lg transition-all ${styles.button}`}
                                >
                                  Finish Story! 🌟
                                </motion.button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="relative w-full max-w-2xl mx-auto group">
                              <div className="aspect-square sm:aspect-video w-full rounded-[40px] overflow-hidden border-8 border-white shadow-2xl relative bg-slate-50">
                                <img 
                                  src={selectedExercise.imageUrl} 
                                  alt="Target" 
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              
                              {feedback && (
                                <motion.div 
                                  initial={{ scale: 0, y: 20 }}
                                  animate={{ scale: 1, y: 0 }}
                                  className="absolute -top-6 -right-6 z-20"
                                >
                                  <div className="bg-accent text-white w-20 h-20 rounded-full flex flex-col items-center justify-center font-black shadow-2xl border-4 border-white">
                                    <span className="text-2xl leading-none">{feedback.score}</span>
                                    <span className="text-[10px] uppercase tracking-tighter">Score</span>
                                  </div>
                                  <div className="mt-2 flex flex-col gap-1 items-end">
                                    <div className="bg-blue-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase shadow-lg">
                                      Accuracy: {feedback.accuracy}%
                                    </div>
                                    <div className="bg-purple-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase shadow-lg">
                                      Fluency: {feedback.fluency}%
                                    </div>
                                    <div className="bg-green-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase shadow-lg">
                                      Pronunciation: {feedback.pronunciation}%
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>

                            <div className="space-y-2 mb-4">
                              <p className="text-slate-500 font-medium">Say this word:</p>
                              <div className="flex items-center justify-center gap-4">
                                <motion.h3 
                                  animate={theme === Theme.PLAYFUL ? {
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 2, -2, 0]
                                  } : {}}
                                  transition={theme === Theme.PLAYFUL ? {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  } : {}}
                                  className={`text-5xl font-black tracking-tight ${styles.primary}`}
                                >
                                  {selectedExercise.targetWord}
                                </motion.h3>
                                <button
                                  onClick={() => playOrGenerateExerciseAudio(selectedExercise.targetWord!, 'audioUrl')}
                                  disabled={isPlayingAudio || isGeneratingExerciseAudio}
                                  className={`p-3 rounded-full ${styles.card} border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50`}
                                  title="Listen to pronunciation"
                                >
                                  {isGeneratingExerciseAudio ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                                  ) : (
                                    <Volume2 className={`w-6 h-6 ${isPlayingAudio ? 'text-accent animate-pulse' : styles.primary}`} />
                                  )}
                                </button>
                              </div>
                              {selectedExercise.pronunciationGuide && (
                                <div className="flex items-center gap-2">
                                  <p className={`text-sm italic font-medium opacity-80`}>
                                    Quick Tip: {selectedExercise.pronunciationGuide.tip}
                                  </p>
                                  <button
                                    onClick={() => playOrGenerateExerciseAudio(selectedExercise.pronunciationGuide!.tip, 'pronunciationGuide.tipAudioUrl')}
                                    disabled={isPlayingAudio || isGeneratingExerciseAudio}
                                    className={`p-1 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50`}
                                    title="Listen to tip"
                                  >
                                    {isGeneratingExerciseAudio ? (
                                      <Loader2 className="w-3 h-3 animate-spin text-accent" />
                                    ) : (
                                      <Volume2 className={`w-3 h-3 ${isPlayingAudio ? 'text-accent' : 'text-slate-400'}`} />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>

                            {selectedExercise.targetSentence && (
                              <div className={`w-full max-w-md p-6 rounded-3xl ${theme === Theme.KID ? 'bg-blue-50 border-2 border-blue-100' : 'bg-slate-50 border border-slate-100'} shadow-inner`}>
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Practice Sentence</p>
                                    <p className={`text-2xl font-bold leading-relaxed ${styles.primary}`}>
                                      "{selectedExercise.targetSentence}"
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => playOrGenerateExerciseAudio(selectedExercise.targetSentence!, 'targetSentenceAudioUrl')}
                                    disabled={isPlayingAudio || isGeneratingExerciseAudio}
                                    className={`p-3 rounded-full bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50 mt-1`}
                                    title="Listen to sentence pronunciation"
                                  >
                                    {isGeneratingExerciseAudio ? (
                                      <Loader2 className="w-5 h-5 animate-spin text-accent" />
                                    ) : (
                                      <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'text-accent animate-pulse' : styles.primary}`} />
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}

                            {selectedExercise.pronunciationGuide && (
                              <div className="w-full max-w-md">
                                <button 
                                  onClick={() => setShowGuide(!showGuide)}
                                  className={`flex items-center gap-2 text-xs font-bold text-slate-400 hover:${styles.primary} transition-colors mb-2 uppercase tracking-widest`}
                                >
                                  <Info className="w-3.5 h-3.5" />
                                  {showGuide ? 'Hide Details' : 'View Full Guide'}
                                </button>
                                
                                <AnimatePresence>
                                  {showGuide && (
                                    <motion.div 
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className={`${theme === Theme.KID ? 'bg-blue-50' : 'bg-slate-50'} rounded-2xl p-4 text-left border border-slate-100 space-y-4`}>
                                        <div className="grid grid-cols-2 gap-4">
                                          {selectedExercise.pronunciationGuide.mouthAnimationUrl && (
                                            <div className="space-y-1">
                                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                                                Mouth View
                                                <span className="bg-red-500 text-white px-1 rounded-[2px] text-[8px] animate-pulse">ANIMATED</span>
                                              </p>
                                              <div 
                                                onClick={() => setActiveAnimation({ 
                                                  url: selectedExercise.pronunciationGuide!.mouthAnimationUrl!, 
                                                  title: "Mouth Position" 
                                                })}
                                                className={`aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group cursor-pointer ${theme === Theme.KID ? 'bg-blue-100' : 'bg-white'}`}
                                              >
                                                <motion.img 
                                                  key={`mouth-${showGuide}`}
                                                  initial={{ scale: 0.8, opacity: 0 }}
                                                  animate={{ scale: 1, opacity: 1 }}
                                                  transition={{ type: 'spring', duration: 0.8 }}
                                                  src={selectedExercise.pronunciationGuide.mouthAnimationUrl} 
                                                  alt="Mouth Position Animation" 
                                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                  referrerPolicy="no-referrer"
                                                />
                                                <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                                    <Maximize2 className="w-5 h-5 text-primary" />
                                                  </div>
                                                </div>
                                                <div className="absolute top-2 right-2">
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      playOrGenerateExerciseAudio(selectedExercise.pronunciationGuide!.mouthPosition, 'pronunciationGuide.mouthAudioUrl');
                                                    }}
                                                    className="p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                                                  >
                                                    <Volume2 className="w-3.5 h-3.5 text-primary" />
                                                  </button>
                                                </div>
                                                <div className="absolute bottom-2 right-2">
                                                  <motion.div 
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                          {selectedExercise.pronunciationGuide.tongueAnimationUrl && (
                                            <div className="space-y-1">
                                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                                                Tongue View
                                                <span className="bg-red-500 text-white px-1 rounded-[2px] text-[8px] animate-pulse">ANIMATED</span>
                                              </p>
                                              <div 
                                                onClick={() => setActiveAnimation({ 
                                                  url: selectedExercise.pronunciationGuide!.tongueAnimationUrl!, 
                                                  title: "Tongue Placement" 
                                                })}
                                                className={`aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group cursor-pointer ${theme === Theme.KID ? 'bg-blue-100' : 'bg-white'}`}
                                              >
                                                <motion.img 
                                                  key={`tongue-${showGuide}`}
                                                  initial={{ scale: 0.8, opacity: 0 }}
                                                  animate={{ scale: 1, opacity: 1 }}
                                                  transition={{ type: 'spring', duration: 0.8, delay: 0.1 }}
                                                  src={selectedExercise.pronunciationGuide.tongueAnimationUrl} 
                                                  alt="Tongue Placement Animation" 
                                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                  referrerPolicy="no-referrer"
                                                />
                                                <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                                    <Maximize2 className="w-5 h-5 text-primary" />
                                                  </div>
                                                </div>
                                                <div className="absolute top-2 right-2">
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      playOrGenerateExerciseAudio(selectedExercise.pronunciationGuide!.tonguePlacement, 'pronunciationGuide.tongueAudioUrl');
                                                    }}
                                                    className="p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                                                  >
                                                    <Volume2 className="w-3.5 h-3.5 text-primary" />
                                                  </button>
                                                </div>
                                                <div className="absolute bottom-2 right-2">
                                                  <motion.div 
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <div className="space-y-3 pt-2 border-t border-slate-200/50">
                                          <div>
                                            <div className="flex items-center justify-between mb-1">
                                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Mouth Position</p>
                                              <button
                                                onClick={() => playOrGenerateExerciseAudio(selectedExercise.pronunciationGuide!.mouthPosition, 'pronunciationGuide.mouthAudioUrl')}
                                                disabled={isPlayingAudio || isGeneratingExerciseAudio}
                                                className="p-1 rounded-full hover:bg-slate-200 transition-colors"
                                              >
                                                <Volume2 className="w-3 h-3 text-slate-400" />
                                              </button>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-snug">{selectedExercise.pronunciationGuide.mouthPosition}</p>
                                          </div>
                                          <div>
                                            <div className="flex items-center justify-between mb-1">
                                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tongue Placement</p>
                                              <button
                                                onClick={() => playOrGenerateExerciseAudio(selectedExercise.pronunciationGuide!.tonguePlacement, 'pronunciationGuide.tongueAudioUrl')}
                                                disabled={isPlayingAudio || isGeneratingExerciseAudio}
                                                className="p-1 rounded-full hover:bg-slate-200 transition-colors"
                                              >
                                                <Volume2 className="w-3 h-3 text-slate-400" />
                                              </button>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-snug">{selectedExercise.pronunciationGuide.tonguePlacement}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}

                            {/* Educational Cues Section */}
                            <div className="w-full max-w-md grid grid-cols-2 gap-3">
                              {selectedExercise.letterCue && (
                                <div className={`border border-slate-100 p-3 rounded-2xl shadow-sm flex flex-col items-center text-center ${styles.card}`}>
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${theme === Theme.KID ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                                    <TypeIcon className="w-5 h-5" />
                                  </div>
                                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Letter Cue</p>
                                  <p className={`text-xl font-black mb-1 ${theme === Theme.KID ? 'text-blue-600' : styles.primary}`}>{selectedExercise.letterCue.letter}</p>
                                  <p className="text-[10px] text-slate-500 leading-tight">{selectedExercise.letterCue.description}</p>
                                </div>
                              )}
                              
                              {selectedExercise.handCue && (
                                <div className={`border border-slate-100 p-3 rounded-2xl shadow-sm flex flex-col items-center text-center ${styles.card}`}>
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${theme === Theme.KID ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                                    <Hand className="w-5 h-5" />
                                  </div>
                                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Hand Cue</p>
                                  <p className="text-[10px] text-slate-600 font-medium leading-tight">{selectedExercise.handCue}</p>
                                </div>
                              )}

                              {selectedExercise.pictureCue && (
                                <div className={`border border-slate-100 p-4 rounded-3xl shadow-sm flex flex-col items-center text-center col-span-2 ${styles.card}`}>
                                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-3 bg-slate-50 border border-slate-100">
                                    <img 
                                      src={selectedExercise.pictureCue} 
                                      alt="Animated Illustration" 
                                      className="w-full h-full object-contain p-2"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center">
                                      <ImageIcon className="w-3.5 h-3.5 text-pink-500" />
                                    </div>
                                    <p className="text-xs font-black uppercase text-slate-400 tracking-wider">Visual Cue</p>
                                  </div>
                                </div>
                              )}

                              {selectedExercise.isolationActivity && (
                                <div className={`p-4 rounded-2xl col-span-2 flex items-start gap-3 ${theme === Theme.KID ? 'bg-blue-50 border border-blue-100' : styles.card}`}>
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${styles.button}`}>
                                    <Activity className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1">
                                    <p className={`text-[10px] font-black uppercase mb-1 ${styles.primary} opacity-60`}>Isolation Activity</p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-bold text-slate-800">{selectedExercise.isolationActivity}</p>
                                      <button 
                                        onClick={() => playOrGenerateExerciseAudio(selectedExercise.isolationActivity!, 'isolationAudioUrl')}
                                        disabled={isPlayingAudio || isGeneratingExerciseAudio}
                                        className={`p-1.5 rounded-lg transition-all ${theme === Theme.KID ? 'bg-white text-blue-500 hover:bg-blue-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                      >
                                        {isGeneratingExerciseAudio ? (
                                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                          <Volume2 className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Syllable Activities Section */}
                            {(selectedExercise.syllables || selectedExercise.spinningSyllables) && (
                              <div className="w-full max-w-md space-y-4">
                                {/* Syllable Slider */}
                                {selectedExercise.syllables && selectedExercise.syllables.length >= 2 && (
                                  <div className={`p-4 rounded-2xl shadow-sm ${styles.card}`}>
                                    <div className="flex items-center gap-2 mb-4">
                                      <MoveHorizontal className={`w-4 h-4 ${styles.icon}`} />
                                      <p className="text-[10px] font-black uppercase text-slate-400">Syllable Slider</p>
                                    </div>
                                    <div className={`relative h-12 flex items-center justify-between px-8 rounded-xl ${theme === Theme.KID ? 'bg-blue-50' : 'bg-slate-50'}`}>
                                      <div className="text-xl font-black text-slate-400">{selectedExercise.syllables[0]}</div>
                                      <div className="text-xl font-black text-slate-400">{selectedExercise.syllables[selectedExercise.syllables.length - 1]}</div>
                                      
                                      <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={sliderValue}
                                        onChange={(e) => setSliderValue(parseInt(e.target.value))}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                      />
                                      
                                      <motion.div 
                                        className={`absolute h-10 px-4 text-white rounded-lg flex items-center justify-center font-black shadow-lg ${styles.button}`}
                                        animate={{ 
                                          left: `${10 + (sliderValue * 0.6)}%`,
                                          scale: sliderValue > 45 && sliderValue < 55 ? 1.2 : 1
                                        }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                      >
                                        {sliderValue < 50 ? selectedExercise.syllables[0] : selectedExercise.syllables[selectedExercise.syllables.length - 1]}
                                      </motion.div>
                                    </div>
                                    <p className="text-[10px] text-center text-slate-400 mt-2">Slide the sounds together to make the word!</p>
                                  </div>
                                )}

                                {/* Syllable Spinning */}
                                {selectedExercise.spinningSyllables && (
                                  <div className={`p-4 rounded-2xl shadow-sm ${styles.card}`}>
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-2">
                                        <RefreshCw className={`w-4 h-4 ${styles.icon}`} />
                                        <p className="text-[10px] font-black uppercase text-slate-400">Syllable Spinner</p>
                                      </div>
                                      <button 
                                        onClick={handleSpinAll}
                                        className={`text-[10px] font-black uppercase hover:underline ${styles.primary}`}
                                      >
                                        Spin All
                                      </button>
                                    </div>
                                    
                                    <div className="flex gap-2 justify-center">
                                      {selectedExercise.spinningSyllables.slice(0, 3).map((options, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2">
                                          <div className={`w-20 h-20 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden relative ${theme === Theme.KID ? 'bg-blue-50' : 'bg-slate-50'}`}>
                                            <AnimatePresence mode="popLayout">
                                              <motion.div
                                                key={spinValues[i]}
                                                initial={{ y: 50, opacity: 0, scale: 0.5, filter: 'blur(4px)' }}
                                                animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                                exit={{ y: -50, opacity: 0, scale: 0.5, filter: 'blur(4px)', position: 'absolute' }}
                                                transition={{ 
                                                  type: 'spring', 
                                                  stiffness: 400, 
                                                  damping: 25,
                                                  mass: 0.8
                                                }}
                                                className={`text-xl font-black ${styles.primary}`}
                                              >
                                                {options[spinValues[i]]}
                                              </motion.div>
                                            </AnimatePresence>
                                          </div>
                                          <button 
                                            onClick={() => handleSpinSlot(i)}
                                            className={`p-1 rounded-full transition-colors ${theme === Theme.KID ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-slate-100 text-slate-400 hover:bg-primary hover:text-white'}`}
                                          >
                                            <RefreshCw className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                    <div className={`mt-4 p-2 rounded-xl text-center ${theme === Theme.KID ? 'bg-blue-50' : 'bg-primary/5'}`}>
                                      <p className={`text-sm font-black ${styles.primary}`}>
                                        {selectedExercise.spinningSyllables.slice(0, 3).map((options, i) => options[spinValues[i]]).join('')}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                        <div className="w-full max-w-md">
                          {feedback ? (
                                  <div className={`p-6 rounded-2xl border border-slate-100 text-left ${theme === Theme.KID ? 'bg-blue-50' : 'bg-slate-50'}`}>
                                    <div className="flex items-start gap-3">
                                      <CheckCircle2 className={`w-6 h-6 flex-shrink-0 mt-1 ${styles.icon}`} />
                                      <div>
                                        <p className="font-bold text-slate-800">Feedback</p>
                                        <p className="text-slate-600 leading-relaxed">{feedback.feedback}</p>
                                      </div>
                                    </div>

                                    {localMentorAudio && (
                                      <div className="mt-6 p-4 bg-white rounded-xl border border-slate-100">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Compare with Mentor</p>
                                        <div className="flex items-center gap-4">
                                          <div className="flex-1 flex flex-col items-center gap-1">
                                            <button 
                                              onClick={() => playTargetAudio(localMentorAudio)}
                                              className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                                            >
                                              <Volume2 className="w-5 h-5" />
                                            </button>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Mentor</span>
                                          </div>
                                          <div className="w-px h-8 bg-slate-100" />
                                          <div className="flex-1 flex flex-col items-center gap-1">
                                            <button 
                                              onClick={() => {
                                                if (localUserRecordings.length > 0) {
                                                  playTargetAudio(localUserRecordings[0].audioUrl);
                                                }
                                              }}
                                              className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                                            >
                                              <Mic className="w-5 h-5" />
                                            </button>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">You</span>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    <button 
                                      onClick={() => setFeedback(null)}
                                      className={`mt-4 w-full py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors ${styles.primary}`}
                                    >
                                      Try Again
                                    </button>
                                  </div>
                          ) : (
                          <div className="flex flex-col items-center gap-8 w-full">
                            {/* Mentor Mode Toggle */}
                            <div className="flex items-center gap-1 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
                              <button 
                                onClick={() => setIsMentorMode(false)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all tracking-widest ${!isMentorMode ? 'bg-white shadow-md text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                              >
                                STUDENT
                              </button>
                              <button 
                                onClick={() => setIsMentorMode(true)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all tracking-widest ${isMentorMode ? 'bg-white shadow-md text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                              >
                                MENTOR
                              </button>
                            </div>

                            {isMentorMode && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center space-y-3 bg-primary/5 p-4 rounded-3xl border border-primary/10 max-w-xs"
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                  <p className="text-xs font-black text-primary uppercase tracking-widest">Mentor Recording</p>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed">Record the target pronunciation for your student to follow.</p>
                                {localMentorAudio && (
                                  <div className="flex items-center justify-center gap-3 pt-2">
                                    <button 
                                      onClick={() => playTargetAudio(localMentorAudio)}
                                      className="flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-xl shadow-sm hover:shadow-md transition-all font-bold text-xs"
                                    >
                                      <Play className="w-3.5 h-3.5" />
                                      Listen
                                    </button>
                                    <button 
                                      onClick={async () => {
                                        if (selectedExercise && activeProfile) {
                                          await localDb.recordings
                                            .where({ exerciseId: selectedExercise.id, type: 'target', profileId: activeProfile.id })
                                            .delete();
                                          setLocalMentorAudio(null);
                                          toast.success("Mentor recording removed.");
                                        }
                                      }}
                                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                      title="Delete recording"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </motion.div>
                            )}

                            <div className="flex flex-col items-center gap-6 relative">
                              {comboCount > 1 && (
                                <motion.div 
                                  initial={{ scale: 0, rotate: -20, y: 20 }}
                                  animate={{ scale: 1, rotate: 0, y: 0 }}
                                  className="absolute -top-12 flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-xl border-2 border-white z-10"
                                >
                                  <Zap className="w-4 h-4 fill-white" />
                                  {comboCount} COMBO!
                                </motion.div>
                              )}

                              <div className="relative">
                                <motion.button
                                  onClick={toggleRecording}
                                  disabled={isAnalyzing}
                                  animate={theme === Theme.PLAYFUL && !isRecording ? {
                                    scale: [1, 1.05, 1],
                                  } : {}}
                                  transition={theme === Theme.PLAYFUL && !isRecording ? {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  } : {}}
                                  className={`group relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                                    isRecording 
                                      ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] scale-110' 
                                      : `${styles.button} shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95`
                                  } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  {isRecording ? (
                                    <div className="w-10 h-10 bg-white rounded-xl animate-pulse" />
                                  ) : (
                                    <Mic className="w-12 h-12 text-white" />
                                  )}
                                  
                                  {isRecording && (
                                    <motion.div 
                                      className="absolute inset-0 rounded-full border-4 border-red-400"
                                      animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                                      transition={{ repeat: Infinity, duration: 1.5 }}
                                    />
                                  )}
                                </motion.button>
                                
                                {isAnalyzing && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="w-16 h-16 animate-spin text-white/50" />
                                  </div>
                                )}
                              </div>

                              <div className="text-center space-y-2">
                                <p className={`text-lg font-black tracking-tight ${isRecording ? 'text-red-500 animate-pulse' : isAnalyzing ? 'text-primary animate-pulse' : 'text-slate-700'}`}>
                                  {isRecording ? 'Teacher is listening...' : isAnalyzing ? 'Analyzing speech...' : 'Tap to start practice'}
                                </p>
                                {!isRecording && !isAnalyzing && (
                                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Speak clearly into your mic</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                    <div className="h-full flex flex-col gap-8">
                      {/* Daily Progress & Welcome */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                            {view === 'stories' ? (
                              <BookOpen className={`w-8 h-8 ${styles.primary}`} />
                            ) : (
                              <Activity className={`w-8 h-8 ${styles.primary}`} />
                            )}
                          </div>
                          <h2 className="text-xl font-bold text-slate-800 mb-1">
                            {view === 'stories' ? `Ready for a story, ${activeProfile.name}?` : `Ready to practice, ${activeProfile.name}?`}
                          </h2>
                          <p className="text-sm text-slate-500 max-w-xs">
                            {view === 'stories' 
                              ? 'Select a story from the list on the left to begin your reading session.'
                              : 'Select an exercise from the list on the left to begin your speech session.'}
                          </p>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col items-center justify-center text-center">
                          <div className="relative w-24 h-24 mb-3">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-slate-100"
                              />
                              <motion.circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray="251.2"
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 251.2 - (251.2 * Math.min(activeProfile.points / 100, 1)) }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="text-accent"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-xl font-black text-slate-800">{activeProfile.points}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Points</span>
                            </div>
                          </div>
                          <h3 className="text-sm font-bold text-slate-700">Daily Goal</h3>
                          <p className="text-xs text-slate-400">100 points to go!</p>
                        </div>
                      </div>

                      {/* Struggle Words Section */}
                      <div className="text-left">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600`}>
                              <Bookmark className="w-5 h-5" />
                            </div>
                            <div>
                              <h2 className="text-xl font-black uppercase tracking-tight">Struggle Words</h2>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Words to practice more</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setShowStruggleWordModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                            Add Word
                          </button>
                        </div>

                        {activeProfile.struggleWords.length === 0 ? (
                          <div className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold">No struggle words added yet. Add words that need extra practice!</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {activeProfile.struggleWords.map(word => (
                              <motion.div
                                key={word.id}
                                whileHover={{ y: -5 }}
                                className={`p-6 ${styles.card} relative group`}
                              >
                                <div className="flex items-start gap-4">
                                  {word.imageUrl && (
                                    <img 
                                      src={word.imageUrl} 
                                      alt={word.word} 
                                      className="w-16 h-16 rounded-xl object-cover shadow-md"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <h3 className="text-lg font-black uppercase tracking-tight mb-1">{word.word}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2">{word.definition}</p>
                                  </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${word.mastered ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {word.mastered ? 'Mastered' : 'Practicing'}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => {
                                        setProfiles(prev => prev.map(p => 
                                          p.id === activeProfileId ? { 
                                            ...p, 
                                            struggleWords: p.struggleWords.filter(w => w.id !== word.id) 
                                          } : p
                                        ));
                                        playCue('pop');
                                      }}
                                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={async () => {
                                        playCue('pop');
                                        try {
                                          const audioUrl = await generateWordAudio(word.word);
                                          if (audioUrl) {
                                            playTargetAudio(audioUrl);
                                          } else {
                                            throw new Error('No audio URL');
                                          }
                                        } catch (e) {
                                          const audio = new Audio(`https://api.dictionaryapi.dev/media/pronunciations/en/${word.word}-us.mp3`);
                                          audio.play().catch(() => {
                                            speakText(word.word, activeProfile.language);
                                          });
                                        }
                                      }}
                                      className={`p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors`}
                                    >
                                      <Volume2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Voice Library Section */}
                      <div className="text-left">
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600`}>
                            <History className="w-5 h-5" />
                          </div>
                          <div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Voice Library</h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Listen to your improvement</p>
                          </div>
                        </div>

                        {(localUserRecordings.length === 0) ? (
                          <div className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold">No recordings saved yet. Complete exercises to build your library!</p>
                          </div>
                        ) : (
                          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {localUserRecordings.map(recording => (
                              <motion.div
                                key={recording.id}
                                whileHover={{ scale: 1.02 }}
                                className={`min-w-[280px] p-5 ${styles.card} flex items-center gap-4 relative`}
                              >
                                {recording.isLocal && (
                                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-[8px] font-black rounded-full uppercase">
                                    Local
                                  </div>
                                )}
                                <button 
                                  onClick={() => {
                                    playTargetAudio(recording.audioUrl);
                                    playCue('pop');
                                  }}
                                  className={`w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 transition-transform`}
                                >
                                  <Play className="w-5 h-5 fill-current" />
                                </button>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-black text-sm uppercase truncate">{recording.exerciseTitle}</h4>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    {new Date(recording.timestamp).toLocaleDateString()} • Score: {recording.score}%
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {view === 'autism-tools' && (
            <motion.div
              key="autism-tools"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto py-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black tracking-tight">Autism Support Tools</h2>
                <p className="text-slate-500">Visual aids and sensory-friendly tools for neurodivergent learners.</p>
              </div>

              <SensoryTools
                sensoryProfile={sensoryProfile || undefined}
                firstThenBoards={firstThenBoards}
                onAddBoard={addFirstThenBoard}
                onDeleteBoard={deleteFirstThenBoard}
                onUpdateSensoryProfile={updateSensoryProfile}
                styles={styles}
              />
            </motion.div>
          )}

          {view === 'matching-game' && (
            <motion.div
              key="matching-game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ArticulationMatchingGame
                exercises={EXERCISES}
                onClose={() => setView('practice')}
                styles={styles}
                playCue={playCue}
                sensoryProfile={sensoryProfile || undefined}
              />
            </motion.div>
          )}

          {view === 'focus-social' && (
            <motion.div
              key="focus-social"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Specialized Categories */}
              <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Focus & Social</h2>
                </div>

                <div className="space-y-8">
                  {(Object.entries(
                    EXERCISES
                      .filter(ex => [
                        ExerciseType.FOLLOWING_DIRECTIONS,
                        ExerciseType.SOCIAL_SKILLS,
                        ExerciseType.IMPULSIVITY_PRACTICE,
                        ExerciseType.FOCUS_SESSION
                      ].includes(ex.type))
                      .reduce((acc, ex) => {
                        if (!acc[ex.category]) acc[ex.category] = [];
                        acc[ex.category].push(ex);
                        return acc;
                      }, {} as Record<string, Exercise[]>)
                  ) as [string, Exercise[]][]).map(([category, items]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center gap-3 px-2">
                        <div className="h-px flex-1 bg-slate-100" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          {category}
                        </h4>
                        <div className="h-px flex-1 bg-slate-100" />
                      </div>
                      
                      <div className="space-y-3">
                        {items.map((ex) => (
                          <motion.div
                            key={ex.id}
                            whileHover={{ 
                              scale: 1.02, 
                              x: 4,
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStartPractice(ex)}
                            role="button"
                            tabIndex={0}
                            className={`p-4 rounded-2xl border-2 transition-all text-left group ${
                              selectedExercise?.id === ex.id 
                                ? 'border-primary bg-primary/5 shadow-md' 
                                : 'border-white bg-white hover:border-slate-100 shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                selectedExercise?.id === ex.id ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                              }`}>
                                {ex.type === ExerciseType.FOCUS_SESSION ? <TimerIcon className="w-5 h-5" /> :
                                 ex.type === ExerciseType.SOCIAL_SKILLS ? <Users className="w-5 h-5" /> :
                                 ex.type === ExerciseType.IMPULSIVITY_PRACTICE ? <Zap className="w-5 h-5" /> :
                                 <Hand className="w-5 h-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-bold text-sm truncate ${selectedExercise?.id === ex.id ? styles.primary : 'text-slate-700'}`}>
                                  {ex.title}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate">{ex.description}</p>
                              </div>
                              <ChevronRight className={`w-5 h-5 ${selectedExercise?.id === ex.id ? styles.primary : 'text-slate-300'}`} />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Practice Area (Offline View) */}
              <div className="lg:col-span-8 scroll-mt-24" ref={practiceAreaRef}>
                <AnimatePresence mode="wait">
                  {selectedExercise ? (
                    <motion.div
                      key={selectedExercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-8 lg:h-full min-h-[500px] flex flex-col ${styles.card}`}
                    >
                      <SpecializedExerciseView
                        exercise={selectedExercise}
                        styles={styles}
                        playCue={playCue}
                        onComplete={(score) => saveVoiceRecording("", score, selectedExercise)}
                        localMentorAudio={localMentorAudio}
                        playTargetAudio={playTargetAudio}
                      />
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-50/50 rounded-[40px] border-4 border-dashed border-slate-200">
                      <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6">
                        <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                      </div>
                      <h3 className="text-2xl font-black mb-2">Ready to Focus?</h3>
                      <p className="text-slate-500 max-w-xs">Select an activity from the list to start your session.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {view === 'lessons' && (
            <motion.div
              key="lessons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto py-8"
            >
              {selectedLessonPlan ? (
                <LessonPlayer
                  plan={selectedLessonPlan}
                  onComplete={(score) => {
                    // Update stats if needed
                    setSelectedLessonPlan(null);
                  }}
                  onExit={() => setSelectedLessonPlan(null)}
                  styles={styles}
                  playCue={playCue}
                  saveVoiceRecording={saveVoiceRecording}
                  localMentorAudio={localMentorAudio}
                  playTargetAudio={playTargetAudio}
                />
              ) : isBuildingLesson ? (
                <LessonBuilder
                  onSave={handleSaveLessonPlan}
                  onCancel={() => {
                    setIsBuildingLesson(false);
                    setEditingLessonPlan(null);
                  }}
                  initialPlan={editingLessonPlan || undefined}
                  styles={styles}
                />
              ) : (
                <LessonListView
                  plans={lessonPlans}
                  onStart={handleStartLesson}
                  onCreate={() => {
                    setEditingLessonPlan(null);
                    setIsBuildingLesson(true);
                  }}
                  onEdit={(plan) => {
                    setEditingLessonPlan(plan);
                    setIsBuildingLesson(true);
                  }}
                  onDelete={handleDeleteLessonPlan}
                  styles={styles}
                />
              )}
            </motion.div>
          )}

          {view === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <SettingsView
                isPro={activeProfile.isPro}
                privacyMode={privacyMode}
                cloudSync={cloudSync}
                isNavbarHidden={isNavbarHidden}
                isFocusMode={isFocusMode}
                theme={theme}
                sensoryProfile={sensoryProfile}
                onTogglePrivacy={setPrivacyMode}
                onToggleCloudSync={setCloudSync}
                onToggleNavbar={setIsNavbarHidden}
                onToggleFocus={setIsFocusMode}
                onSetTheme={setTheme}
                onUpdateSensoryProfile={updateSensoryProfile}
                onUpgrade={() => setShowProModal(true)}
                onClearCache={() => setShowClearCacheModal(true)}
                styles={getThemeStyles()}
              />
            </motion.div>
          )}

          {view === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto py-12"
            >
              <div className="mb-12 text-center">
                <h2 className="text-4xl font-black tracking-tight mb-2">Owner's Corner</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Expert tips & demonstrations from our founder</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`p-6 ${styles.card}`}>
                  <h3 className="text-xl font-black mb-4">Latest Insights</h3>
                  <InstagramEmbed url="https://www.instagram.com/reel/DWorCafDbOv/" />
                </div>
                
                <div className={`p-6 ${styles.card} flex flex-col justify-center items-center text-center`}>
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-400">More Videos Coming Soon</h3>
                  <p className="text-sm text-slate-400 max-w-[200px]">Stay tuned for more expert speech therapy content!</p>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'progress' && (
            <motion.div 
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8 pb-12"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tight">Your Progress</h2>
                  <p className="text-slate-500 text-sm">Track your speech journey and milestones</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={generateReport}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    Export PDF
                  </button>
                  <div className="px-4 py-2 bg-white border border-slate-200 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm">
                    <Activity className="w-4 h-4 text-primary" />
                    Last 7 Days
                  </div>
                  <div className="px-4 py-2 bg-primary text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
                    <Trophy className="w-4 h-4" />
                    {userStats.points} Points
                  </div>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Current Streak', value: `${userStats.streak} Days`, icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-50' },
                  { label: 'Total Sessions', value: userStats.sessions, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { label: 'Avg. Accuracy', value: '88%', icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  { label: 'Words Mastered', value: '156', icon: Star, color: 'text-purple-500', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-6 ${styles.card} relative overflow-hidden group`}
                  >
                    <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full opacity-50 group-hover:scale-110 transition-transform`} />
                    <stat.icon className={`w-8 h-8 ${stat.color} mb-4 relative z-10`} />
                    <p className="text-slate-500 font-medium text-xs uppercase tracking-widest mb-1 relative z-10">{stat.label}</p>
                    <p className="text-3xl font-black relative z-10">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={`p-8 ${styles.card}`}>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black">Accuracy Trend</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      Score %
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={userStats.history}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                          domain={[0, 100]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            fontWeight: 'bold'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#6366f1" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorScore)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={`p-8 ${styles.card}`}>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black">Daily Sessions</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <div className="w-3 h-3 rounded-full bg-secondary" />
                      Count
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userStats.history}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            fontWeight: 'bold'
                          }}
                        />
                        <Bar 
                          dataKey="sessions" 
                          fill="#f43f5e" 
                          radius={[6, 6, 0, 0]} 
                          barSize={32}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Best Recordings (Local Sound Library) */}
              <div className={`p-8 ${styles.card}`}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black">Local Sound Library</h3>
                    <p className="text-xs text-slate-500">Your best pronunciation for each word</p>
                  </div>
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <History className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {localUserRecordings.length > 0 ? (
                    // Group by exercise and take the best score
                    Object.values(
                      localUserRecordings.reduce((acc: any, rec: any) => {
                        if (!acc[rec.exerciseId] || rec.score > acc[rec.exerciseId].score) {
                          acc[rec.exerciseId] = rec;
                        }
                        return acc;
                      }, {})
                    ).map((rec: any) => (
                      <div key={rec.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                            rec.score >= 90 ? 'bg-emerald-100 text-emerald-600' : 
                            rec.score >= 70 ? 'bg-amber-100 text-amber-600' : 
                            'bg-slate-200 text-slate-500'
                          }`}>
                            {rec.score}%
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-sm truncate">{rec.exerciseTitle}</p>
                            <p className="text-[10px] text-slate-400">{new Date(rec.timestamp).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const audio = new Audio(rec.audioUrl);
                            audio.play().catch(err => {
                              console.error("Audio playback error:", err);
                              toast.error("Could not play recording. It might be corrupted.");
                            });
                          }}
                          className="p-2 bg-white rounded-full shadow-sm hover:shadow-md text-primary transition-all active:scale-90"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                      <Mic className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-400">No recordings yet. Start practicing!</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className={`p-8 lg:col-span-2 ${styles.card}`}>
                  <h3 className="text-xl font-black mb-6">Recent Milestones</h3>
                  <div className="space-y-4">
                    {[
                      { title: 'Perfect Score!', desc: 'Achieved 100% in "The Busy Bee" story.', date: 'Today', icon: '🎯', color: 'bg-emerald-50 text-emerald-600' },
                      { title: '3-Day Streak', desc: 'You practiced for 3 days in a row!', date: 'Yesterday', icon: '🔥', color: 'bg-orange-50 text-orange-600' },
                      { title: 'New Level', desc: 'Reached Level 5 in Vocabulary.', date: '2 days ago', icon: '⭐', color: 'bg-purple-50 text-purple-600' },
                    ].map((milestone, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-default">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${milestone.color}`}>
                            {milestone.icon}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{milestone.title}</p>
                            <p className="text-xs text-slate-500">{milestone.desc}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{milestone.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-8 ${styles.card}`}>
                  <h3 className="text-xl font-black mb-6">Achievements</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {ACHIEVEMENTS.slice(0, 4).map((achievement, i) => {
                      const isUnlocked = userStats.unlockedAchievements.includes(achievement.id);
                      return (
                        <div 
                          key={achievement.id} 
                          className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${
                            isUnlocked 
                              ? `bg-white border-primary/20 shadow-sm` 
                              : 'bg-slate-50 border-slate-100 opacity-50 grayscale'
                          }`}
                        >
                          <div className="text-2xl mb-2">{achievement.icon}</div>
                          <p className="text-[10px] font-black uppercase tracking-tighter leading-tight">{achievement.title}</p>
                        </div>
                      );
                    })}
                  </div>
                  <button 
                    onClick={() => setView('settings')} // Assuming achievements are also in settings or elsewhere
                    className="w-full mt-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                  >
                    View All Achievements
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'pricing' && (
            <motion.div 
              key="pricing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto py-12"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black mb-4">Unlock Your Full Potential</h2>
                <p className="text-slate-500 text-lg">Choose the plan that's right for your speech journey.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Free Plan */}
                <div className={`p-8 flex flex-col ${styles.card}`}>
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <p className="text-slate-500 mb-6">The basics for everyone.</p>
                  <div className="text-4xl font-black mb-8">$0<span className="text-lg font-medium text-slate-400">/mo</span></div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    {['10 Basic Exercises', 'Daily Progress Tracking', 'Basic Speech Feedback'].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600">
                        <CheckCircle2 className={`w-5 h-5 ${styles.icon}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => setView('practice')}
                    className="w-full py-4 rounded-2xl border-2 border-slate-200 font-bold hover:bg-slate-50 transition-all"
                  >
                    Current Plan
                  </button>
                </div>

                {/* Pro Plan */}
                <div className={`p-8 rounded-3xl shadow-xl shadow-primary/20 flex flex-col text-white relative overflow-hidden ${styles.button}`}>
                  <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Recommended
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <p className="text-white/70 mb-6">Advanced tools for faster results.</p>
                  <div className="text-4xl font-black mb-8">$19<span className="text-lg font-medium text-white/50">/mo</span></div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    {[
                      'Unlimited Exercises', 
                      'Bilingual Assistance Path', 
                      'AI Story Generation & Translation',
                      'Advanced AI Speech Analysis',
                      'Offline Practice Mode',
                      'Covers all AI processing costs'
                    ].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/90">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={async () => {
                      if (!user) {
                        handleLogin();
                        return;
                      }
                      const userDocRef = doc(db, 'users', user.uid);
                      await updateDoc(userDocRef, { isPremium: true });
                      setIsPremiumUser(true);
                      toast.success('Upgraded to Pro!');
                    }}
                    className="w-full py-4 bg-white text-primary rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-lg"
                  >
                    {isPremiumUser ? 'Active' : 'Upgrade Now'}
                  </button>
                </div>

                {/* Autism Support Add-on */}
                <div className={`p-8 rounded-3xl border-2 border-dashed border-primary/30 flex flex-col bg-white relative overflow-hidden`}>
                  <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Specialized
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-slate-800">Autism Support</h3>
                  <p className="text-slate-500 mb-6">Tools for neurodivergent learners.</p>
                  <div className="text-4xl font-black mb-8 text-slate-900">$9<span className="text-lg font-medium text-slate-400">/one-time</span></div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    {[
                      'Visual Timers', 
                      'First/Then Task Boards', 
                      'Sensory UI Customization',
                      'Calming Color Palettes',
                      'Reduced Motion Mode'
                    ].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600">
                        <Heart className={`w-5 h-5 text-primary`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={async () => {
                      if (!user) {
                        handleLogin();
                        return;
                      }
                      const userDocRef = doc(db, 'users', user.uid);
                      await updateDoc(userDocRef, { isAutismAddonActive: true });
                      setIsAutismAddonActive(true);
                      toast.success('Autism Support Add-on Activated!');
                    }}
                    className={`w-full py-4 text-white rounded-2xl font-bold transition-all shadow-lg ${isAutismAddonActive ? 'bg-slate-200 cursor-default' : styles.button}`}
                  >
                    {isAutismAddonActive ? 'Activated' : 'Get Add-on'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Stats Bar */}
      <footer className={`border-t p-4 ${theme === Theme.KID ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-200'} pb-24 md:pb-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-around">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-bold">{userStats.points} Points</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className={`w-5 h-5 ${styles.primary}`} />
            <span className="text-sm font-bold">{userStats.streak} Day Streak</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-bold">Next Session: Tomorrow</span>
          </div>
        </div>
      </footer>

      {/* Struggle Word Modal */}
      <AnimatePresence>
        {showStruggleWordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                      <Bookmark className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">Add Struggle Word</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Personalize your practice</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowStruggleWordModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <MicOff className="w-5 h-5 text-slate-400 rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">The Word</label>
                    <input 
                      type="text"
                      value={newStruggleWord}
                      onChange={(e) => setNewStruggleWord(e.target.value)}
                      placeholder="e.g. Squirrel"
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-primary focus:outline-none transition-all"
                    />
                  </div>

                  <button
                    onClick={addStruggleWord}
                    disabled={!newStruggleWord.trim() || isGeneratingStory}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-all ${!newStruggleWord.trim() || isGeneratingStory ? 'bg-slate-300' : styles.button}`}
                  >
                    {isGeneratingStory ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Add to List
                      </>
                    )}
                  </button>
                  
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    AI will automatically generate a definition and visual cue for your new word!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Management Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">Add Profile</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">For siblings or students</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowProfileModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <MicOff className="w-5 h-5 text-slate-400 rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Child's Name</label>
                    <input 
                      type="text"
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      placeholder="e.g. Mateo"
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-primary focus:outline-none transition-all"
                    />
                  </div>

                  <button
                    onClick={addProfile}
                    disabled={!newProfileName.trim()}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-all ${!newProfileName.trim() ? 'bg-slate-300' : styles.button}`}
                  >
                    <Plus className="w-5 h-5" />
                    Create Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showClearCacheModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearCacheModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative z-10"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={() => setShowClearCacheModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-2">Clear Local Cache?</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    This will permanently delete all local profiles, progress, and downloaded exercises from this device. This action cannot be undone.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleClearCache}
                    className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear Everything
                  </button>
                  <button
                    onClick={() => setShowClearCacheModal(false)}
                    className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ProUpgradeModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        onUpgrade={async () => {
          if (activeProfile) {
            const updated = { ...activeProfile, isPro: true };
            await repository.saveProfile(updated);
            setProfiles(prev => prev.map(p => p.id === activeProfile.id ? updated : p));
            setShowProModal(false);
            toast.success("Welcome to Pro! Real AI Analysis enabled.");
            playCue('chime');
          }
        }}
        styles={styles}
      />
    </div>
    </MotionConfig>
  );
}

