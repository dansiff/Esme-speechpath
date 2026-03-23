import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Globe, 
  Trophy, 
  BookOpen, 
  Settings, 
  ChevronRight, 
  Star,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { EXERCISES } from './constants';
import { Exercise, Language, ExerciseType } from './types';
import { analyzeSpeech } from './services/geminiService';

export default function App() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; feedback: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false); // Mock for now
  const [view, setView] = useState<'practice' | 'progress' | 'pricing'>('practice');

  const handleStartPractice = (exercise: Exercise) => {
    if (exercise.isPremium && !isPremiumUser) {
      setView('pricing');
      return;
    }
    setSelectedExercise(exercise);
    setFeedback(null);
    setView('practice');
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // In a real app, we'd use MediaRecorder API here
    console.log("Recording started...");
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    
    // Simulating speech-to-text and analysis
    setTimeout(async () => {
      if (selectedExercise) {
        const result = await analyzeSpeech(
          selectedExercise.targetWord || "",
          "Mock transcription of " + selectedExercise.targetWord,
          selectedExercise.language
        );
        setFeedback(result);
      }
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
            B&B
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">
            Bilingual & Brilliant
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 mr-4">
            <button 
              onClick={() => setView('practice')}
              className={`text-sm font-bold transition-colors ${view === 'practice' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Practice
            </button>
            <button 
              onClick={() => setView('progress')}
              className={`text-sm font-bold transition-colors ${view === 'progress' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Progress
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Globe className="w-5 h-5 text-slate-600" />
            </button>
            {!isPremiumUser && (
              <button 
                onClick={() => setView('pricing')}
                className="bg-secondary text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:bg-secondary/90 transition-all"
              >
                Go Pro
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <AnimatePresence mode="wait">
          {view === 'practice' && (
            <motion.div 
              key="practice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Exercise List */}
              <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Exercises</h2>
                  <span className="text-sm text-slate-500 font-medium">
                    {EXERCISES.length} Available
                  </span>
                </div>

                <div className="space-y-3">
                  {EXERCISES.map((ex) => (
                    <motion.button
                      key={ex.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStartPractice(ex)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                        selectedExercise?.id === ex.id 
                          ? 'bg-primary/5 border-primary shadow-sm' 
                          : 'bg-white border-slate-200 hover:border-primary/50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img 
                          src={ex.imageUrl} 
                          alt={ex.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold truncate">{ex.title}</h3>
                          {ex.isPremium && <Lock className="w-3 h-3 text-slate-400" />}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{ex.description}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${selectedExercise?.id === ex.id ? 'text-primary' : 'text-slate-300'}`} />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Right Column: Practice Area */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  {selectedExercise ? (
                    <motion.div
                      key={selectedExercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm h-full flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            {selectedExercise.type} • {selectedExercise.language === Language.ENGLISH ? 'English' : 'Spanish'}
                          </span>
                          <h2 className="text-3xl font-extrabold">{selectedExercise.title}</h2>
                        </div>
                        <button 
                          onClick={() => setSelectedExercise(null)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          Close
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="relative">
                          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-slate-100 shadow-xl">
                            <img 
                              src={selectedExercise.imageUrl} 
                              alt="Target" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          {feedback && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 bg-accent text-white w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-lg border-4 border-white"
                            >
                              {feedback.score}
                            </motion.div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <p className="text-slate-500 font-medium">Say this word:</p>
                          <h3 className="text-5xl font-black text-primary tracking-tight">
                            {selectedExercise.targetWord}
                          </h3>
                        </div>

                        <div className="w-full max-w-md">
                          {feedback ? (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left"
                            >
                              <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                <div>
                                  <p className="font-bold text-slate-800">Feedback</p>
                                  <p className="text-slate-600 leading-relaxed">{feedback.feedback}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => setFeedback(null)}
                                className="mt-4 w-full py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
                              >
                                Try Again
                              </button>
                            </motion.div>
                          ) : (
                            <div className="flex flex-col items-center gap-6">
                              <button
                                onClick={toggleRecording}
                                disabled={isAnalyzing}
                                className={`group relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                                  isRecording 
                                    ? 'bg-red-500 shadow-lg shadow-red-200 scale-110' 
                                    : 'bg-primary shadow-lg shadow-primary/20 hover:scale-105'
                                } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {isRecording ? (
                                  <MicOff className="w-10 h-10 text-white" />
                                ) : (
                                  <Mic className="w-10 h-10 text-white" />
                                )}
                                
                                {isRecording && (
                                  <motion.div
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 rounded-full bg-red-500 -z-10"
                                  />
                                )}
                              </button>
                              
                              <p className="text-slate-400 font-medium animate-pulse">
                                {isRecording ? 'Listening...' : isAnalyzing ? 'Analyzing your speech...' : 'Tap to start speaking'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                        <BookOpen className="w-10 h-10 text-slate-300" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready to practice?</h2>
                      <p className="text-slate-500 max-w-xs">
                        Select an exercise from the list on the left to begin your speech session.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {view === 'progress' && (
            <motion.div 
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-extrabold">Your Progress</h2>
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold">Last 7 Days</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Sessions', value: '24', icon: BookOpen, color: 'text-primary' },
                  { label: 'Avg. Score', value: '88%', icon: Trophy, color: 'text-yellow-500' },
                  { label: 'Words Mastered', value: '156', icon: Star, color: 'text-accent' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
                    <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
                    <p className="text-3xl font-black">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-primary shadow-sm">
                          {85 + i * 3}
                        </div>
                        <div>
                          <p className="font-bold">Articulation Practice: "R" Sound</p>
                          <p className="text-xs text-slate-500">March {20 - i}, 2026</p>
                        </div>
                      </div>
                      <button className="text-primary font-bold text-sm">View Details</button>
                    </div>
                  ))}
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
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <p className="text-slate-500 mb-6">The basics for everyone.</p>
                  <div className="text-4xl font-black mb-8">$0<span className="text-lg font-medium text-slate-400">/mo</span></div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    {['10 Basic Exercises', 'Daily Progress Tracking', 'Standard AI Feedback'].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
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
                <div className="bg-primary p-8 rounded-3xl shadow-xl shadow-primary/20 flex flex-col text-white relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Recommended
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <p className="text-white/70 mb-6">Advanced tools for faster results.</p>
                  <div className="text-4xl font-black mb-8">$19<span className="text-lg font-medium text-white/50">/mo</span></div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    {[
                      'Unlimited Exercises', 
                      'Bilingual Mastery Path', 
                      'Detailed Therapist Reports',
                      'Advanced AI Speech Analysis',
                      'Offline Practice Mode'
                    ].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/90">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => {
                      setIsPremiumUser(true);
                      setView('practice');
                    }}
                    className="w-full py-4 bg-white text-primary rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-lg"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Stats Bar */}
      <footer className="bg-white border-t border-slate-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-around">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-bold">128 Points</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold">3 Day Streak</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-bold">Next Session: Tomorrow</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

