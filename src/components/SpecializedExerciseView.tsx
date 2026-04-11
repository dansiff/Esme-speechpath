import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer as TimerIcon, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  RotateCcw, 
  Volume2,
  Sparkles,
  Zap,
  Hand
} from 'lucide-react';
import { Exercise, ExerciseType } from '../types';

interface SpecializedExerciseViewProps {
  exercise: Exercise;
  styles: any;
  playCue: (type: 'chime' | 'swoosh' | 'pop') => void;
  onComplete: (score: number) => void;
  localMentorAudio?: string | null;
  playTargetAudio?: (url: string) => void;
}

export const SpecializedExerciseView: React.FC<SpecializedExerciseViewProps> = ({
  exercise,
  styles,
  playCue,
  onComplete,
  localMentorAudio,
  playTargetAudio
}) => {
  const [step, setStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [canAct, setCanAct] = useState(false);
  const [turn, setTurn] = useState<'me' | 'you'>('me');
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(-1);
  const [expansionStep, setExpansionStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Focus Session Timer
  useEffect(() => {
    let interval: any;
    if (isActive && exercise.type === ExerciseType.FOCUS_SESSION) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 10) {
            setIsActive(false);
            setFeedback("Great focus!");
            playCue('chime');
            onComplete(100);
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, exercise.type]);

  // Impulsivity Practice Logic
  useEffect(() => {
    if (exercise.type === ExerciseType.IMPULSIVITY_PRACTICE && isActive) {
      setIsWaiting(true);
      setCanAct(false);
      const waitTime = Math.random() * 3000 + 2000; // 2-5 seconds
      const timeout = setTimeout(() => {
        setIsWaiting(false);
        setCanAct(true);
        playCue('pop');
      }, waitTime);
      return () => clearTimeout(timeout);
    }
  }, [isActive, exercise.type]);

  const handleAction = () => {
    if (exercise.type === ExerciseType.IMPULSIVITY_PRACTICE) {
      if (isWaiting) {
        setFeedback("Oops! Wait for the green light.");
        playCue('pop');
        setIsActive(false);
      } else if (canAct) {
        setFeedback("Perfect timing!");
        playCue('chime');
        onComplete(100);
        setIsActive(false);
      }
    } else if (exercise.type === ExerciseType.SOCIAL_SKILLS) {
      if (exercise.title.toLowerCase().includes('turn-taking')) {
        if (turn === 'me') {
          setTurn('you');
          setFeedback("Your turn now!");
          playCue('pop');
        } else {
          setTurn('me');
          setFeedback("My turn! Great waiting.");
          playCue('chime');
          onComplete(100);
          setIsActive(false);
        }
      } else {
        // Teacher Says logic
        setFeedback("Well done!");
        playCue('chime');
        onComplete(100);
      }
    } else if (exercise.type === ExerciseType.FOLLOWING_DIRECTIONS) {
      setFeedback("Step complete!");
      playCue('pop');
      // In a real app, we'd track multiple steps
      onComplete(100);
    } else if (exercise.type === ExerciseType.SYLLABLE_PACING) {
      if (currentSyllableIndex < (exercise.syllables?.length || 0) - 1) {
        setCurrentSyllableIndex(prev => prev + 1);
        playCue('pop');
      } else {
        setFeedback("Perfect pacing!");
        playCue('chime');
        onComplete(100);
        setIsActive(false);
      }
    } else if (exercise.type === ExerciseType.SENTENCE_EXPANSION) {
      if (expansionStep < (exercise.expansionData?.steps.length || 0) - 1) {
        setExpansionStep(prev => prev + 1);
        playCue('pop');
      } else {
        setFeedback("Amazing building!");
        playCue('chime');
        onComplete(100);
        setIsActive(false);
      }
    }
  };

  const handleMinimalPairClick = (index: number) => {
    if (!isActive) return;
    playCue('pop');
    setFeedback(index === 0 ? "That's the first one!" : "That's the second one!");
    if (exercise.minimalPairs?.[selectedPairIndex]) {
      const pair = exercise.minimalPairs[selectedPairIndex];
      const audio = index === 0 ? pair.audioUrl1 : pair.audioUrl2;
      if (audio && playTargetAudio) playTargetAudio(audio);
    }
    // Simple completion for demo
    setTimeout(() => {
      onComplete(100);
      setIsActive(false);
    }, 2000);
  };

  const handleRoleplayOption = (index: number) => {
    if (!isActive) return;
    setSelectedOption(index);
    const option = exercise.roleplayData?.options[index];
    if (option) {
      setFeedback(option.feedback);
      if (option.isCorrect) {
        playCue('chime');
        setTimeout(() => {
          onComplete(100);
          setIsActive(false);
        }, 3000);
      } else {
        playCue('pop');
      }
    }
  };

  const startExercise = () => {
    setIsActive(true);
    setTimer(0);
    setFeedback(null);
    setStep(0);
    setSelectedPairIndex(0);
    setCurrentSyllableIndex(-1);
    setExpansionStep(0);
    setSelectedOption(null);
    playCue('swoosh');
  };

  return (
    <div className="space-y-10 p-2 sm:p-6 w-full max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <h3 className="text-3xl font-black tracking-tight text-slate-900">{exercise.title}</h3>
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">{exercise.description}</p>
      </div>

      <div className="relative group">
        <div className={`aspect-video w-full rounded-[40px] overflow-hidden relative shadow-2xl bg-slate-50 border-8 border-white transition-all duration-500 group-hover:shadow-primary/20`}>
          {exercise.imageUrl && (
            <img 
              src={exercise.imageUrl} 
              alt={exercise.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          )}

          {/* Overlay for specific types */}
          <AnimatePresence>
            {exercise.type === ExerciseType.FOCUS_SESSION && isActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center"
              >
                <div className="bg-white/95 backdrop-blur px-10 py-5 rounded-3xl shadow-2xl flex flex-col items-center gap-2 border border-white">
                  <div className="flex items-center gap-3">
                    <TimerIcon className="w-8 h-8 text-primary animate-pulse" />
                    <span className="text-4xl font-black tabular-nums text-slate-900">{10 - timer}s</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Focus Time</p>
                </div>
              </motion.div>
            )}

            {exercise.type === ExerciseType.IMPULSIVITY_PRACTICE && isActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ 
                      scale: isWaiting ? [1, 1.05, 1] : [1, 1.2, 1],
                      boxShadow: isWaiting 
                        ? "0 0 40px rgba(239, 68, 68, 0.4)" 
                        : "0 0 60px rgba(16, 185, 129, 0.6)"
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`w-40 h-40 rounded-full border-8 border-white shadow-2xl transition-colors duration-500 ${isWaiting ? 'bg-red-500' : 'bg-emerald-500'}`} 
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-white font-black uppercase tracking-widest text-sm">
                      {isWaiting ? 'Wait...' : 'GO!'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {exercise.type === ExerciseType.SOCIAL_SKILLS && exercise.title.toLowerCase().includes('turn-taking') && isActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
              >
                <div className="flex gap-12">
                  <motion.div 
                    animate={{ 
                      scale: turn === 'me' ? 1.25 : 0.85, 
                      y: turn === 'me' ? -10 : 0,
                      opacity: turn === 'me' ? 1 : 0.4 
                    }}
                    className={`w-32 h-32 rounded-[32px] border-4 border-white flex flex-col items-center justify-center gap-3 shadow-2xl transition-all duration-500 ${turn === 'me' ? 'bg-primary text-white' : 'bg-white text-slate-400'}`}
                  >
                    <span className="text-5xl">👤</span>
                    <span className="font-black text-xs uppercase tracking-widest">Me</span>
                  </motion.div>
                  <motion.div 
                    animate={{ 
                      scale: turn === 'you' ? 1.25 : 0.85, 
                      y: turn === 'you' ? -10 : 0,
                      opacity: turn === 'you' ? 1 : 0.4 
                    }}
                    className={`w-32 h-32 rounded-[32px] border-4 border-white flex flex-col items-center justify-center gap-3 shadow-2xl transition-all duration-500 ${turn === 'you' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400'}`}
                  >
                    <span className="text-5xl">🤝</span>
                    <span className="font-black text-xs uppercase tracking-widest">You</span>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {exercise.type === ExerciseType.MINIMAL_PAIRS && isActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center p-8"
              >
                <div className="grid grid-cols-2 gap-8 w-full h-full max-h-[300px]">
                  {exercise.minimalPairs?.[selectedPairIndex] && (
                    <>
                      <button 
                        onClick={() => handleMinimalPairClick(0)}
                        className="flex flex-col items-center justify-center gap-4 p-6 rounded-[32px] bg-white border-4 border-slate-100 hover:border-primary hover:shadow-xl transition-all group"
                      >
                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-50">
                          <img src={exercise.minimalPairs[selectedPairIndex].imageUrl1} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-2xl font-black text-slate-800 group-hover:text-primary transition-colors">{exercise.minimalPairs[selectedPairIndex].word1}</span>
                      </button>
                      <button 
                        onClick={() => handleMinimalPairClick(1)}
                        className="flex flex-col items-center justify-center gap-4 p-6 rounded-[32px] bg-white border-4 border-slate-100 hover:border-primary hover:shadow-xl transition-all group"
                      >
                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-50">
                          <img src={exercise.minimalPairs[selectedPairIndex].imageUrl2} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-2xl font-black text-slate-800 group-hover:text-primary transition-colors">{exercise.minimalPairs[selectedPairIndex].word2}</span>
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {exercise.type === ExerciseType.SYLLABLE_PACING && isActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-primary/5 backdrop-blur-[1px] flex items-center justify-center"
              >
                <div className="flex gap-4">
                  {exercise.syllables?.map((syl, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: currentSyllableIndex === i ? 1.3 : 1,
                        backgroundColor: currentSyllableIndex === i ? '#3b82f6' : '#fff',
                        color: currentSyllableIndex === i ? '#fff' : '#334155',
                        boxShadow: currentSyllableIndex === i ? '0 10px 25px -5px rgba(59, 130, 246, 0.4)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black border-2 border-slate-100"
                    >
                      {syl}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {exercise.type === ExerciseType.SENTENCE_EXPANSION && isActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-emerald-50/50 backdrop-blur-[1px] flex items-center justify-center p-8"
              >
                <div className="space-y-4 w-full max-w-md">
                  {exercise.expansionData?.steps.map((text, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ 
                        x: expansionStep >= i ? 0 : -20, 
                        opacity: expansionStep >= i ? 1 : 0.3,
                        scale: expansionStep === i ? 1.05 : 1
                      }}
                      className={`p-4 rounded-2xl border-2 font-bold text-lg transition-all ${
                        expansionStep === i ? 'bg-white border-emerald-500 text-emerald-700 shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                    >
                      {text}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {exercise.type === ExerciseType.PRAGMATIC_ROLEPLAY && isActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center p-6"
              >
                <div className="bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-lg border-4 border-white space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Scenario</p>
                    <p className="text-xl font-bold text-slate-800 leading-relaxed">{exercise.roleplayData?.scenario}</p>
                  </div>
                  <div className="space-y-3">
                    {exercise.roleplayData?.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleRoleplayOption(i)}
                        className={`w-full text-left p-4 rounded-2xl border-2 font-medium transition-all ${
                          selectedOption === i 
                            ? (opt.isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-red-50 border-red-500 text-red-700')
                            : 'bg-slate-50 border-slate-100 hover:border-primary/30 hover:bg-white'
                        }`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {feedback && (
            <motion.div 
              initial={{ y: 40, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-8 py-4 rounded-3xl shadow-2xl border-2 border-primary flex items-center gap-4 z-30"
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <span className="font-black text-slate-800 text-lg">{feedback}</span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-8">
        {exercise.type === ExerciseType.SOCIAL_SKILLS && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 p-8 rounded-[32px] border-2 border-amber-100 text-center max-w-lg shadow-sm"
          >
            <p className="text-2xl font-black text-amber-800 mb-3 italic tracking-tight">"{exercise.targetWord}"</p>
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <Volume2 className="w-4 h-4" />
              <p className="text-sm font-bold uppercase tracking-wider">Listen and follow along!</p>
            </div>
          </motion.div>
        )}

        {exercise.type === ExerciseType.FOLLOWING_DIRECTIONS && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 p-8 rounded-[32px] border-2 border-blue-100 text-center max-w-lg shadow-sm w-full"
          >
            <p className="text-xl font-black text-blue-900 mb-6 tracking-tight">{exercise.targetWord}</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3].map((s) => (
                <motion.div 
                  key={s} 
                  animate={{ 
                    scale: step >= s ? 1.2 : 1,
                    backgroundColor: step >= s ? '#3b82f6' : '#bfdbfe'
                  }}
                  className={`w-4 h-4 rounded-full shadow-sm`} 
                />
              ))}
            </div>
          </motion.div>
        )}

        {exercise.type === ExerciseType.VISUAL_PHONICS && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary/5 p-8 rounded-[40px] border-4 border-white shadow-xl text-center max-w-lg w-full"
          >
            <div className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
              <Hand className="w-10 h-10" />
            </div>
            <p className="text-3xl font-black text-slate-800 mb-4 tracking-tight">{exercise.targetWord}</p>
            <div className="p-4 rounded-2xl bg-white/50 border border-primary/10">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Hand Cue</p>
              <p className="text-slate-600 font-medium leading-relaxed">{exercise.handCue}</p>
            </div>
          </motion.div>
        )}

        {exercise.type === ExerciseType.SEMANTIC_MAPPING && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-50 p-8 rounded-[40px] border-4 border-white shadow-xl w-full max-w-2xl"
          >
            <div className="text-center mb-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Category</p>
              <h4 className="text-2xl font-black text-slate-800">{exercise.semanticData?.category}</h4>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {exercise.semanticData?.items.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-white shadow-sm border border-slate-100"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50">
                    <img src={item.imageUrl} alt={item.word} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="font-bold text-slate-700">{item.word}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!isActive ? (
          <div className="flex flex-col items-center gap-5 w-full">
            <button
              onClick={startExercise}
              className={`group px-16 py-5 rounded-3xl text-white font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 text-lg ${styles.button}`}
            >
              <Play className="w-7 h-7 fill-white group-hover:scale-110 transition-transform" />
              Start Session
            </button>
            
            {localMentorAudio && playTargetAudio && (
              <button 
                onClick={() => playTargetAudio(localMentorAudio)}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
                Listen to Mentor
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleAction}
            className={`px-16 py-5 rounded-3xl text-white font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 text-lg ${
              exercise.type === ExerciseType.IMPULSIVITY_PRACTICE && isWaiting 
                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                : styles.button
            }`}
          >
            <Zap className="w-7 h-7 fill-white" />
            {exercise.type === ExerciseType.SYLLABLE_PACING ? 'Next Syllable' : 
             exercise.type === ExerciseType.SENTENCE_EXPANSION ? 'Next Step' : 
             "I'm Ready!"}
          </button>
        )}

        <button 
          onClick={startExercise}
          className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2 text-sm font-black uppercase tracking-widest"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Activity
        </button>
      </div>
    </div>
  );
};
