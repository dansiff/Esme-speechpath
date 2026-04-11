import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, MessageSquare, Play, Award, ArrowLeft } from 'lucide-react';
import { LessonPlan, LessonBlock, LessonBlockType, Exercise } from '../types';
import { EXERCISES } from '../constants';
import { SpecializedExerciseView } from './SpecializedExerciseView';

interface LessonPlayerProps {
  plan: LessonPlan;
  onComplete: (score: number) => void;
  onExit: () => void;
  styles: any;
  playCue: (name: string) => void;
  saveVoiceRecording: (audioUrl: string, score: number, exercise: Exercise) => void;
  localMentorAudio: string | null;
  playTargetAudio: (text: string) => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ 
  plan, 
  onComplete, 
  onExit, 
  styles, 
  playCue,
  saveVoiceRecording,
  localMentorAudio,
  playTargetAudio
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [timer, setTimer] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

  const currentBlock = plan.blocks[currentIndex];
  const exercise = currentBlock?.exerciseId ? EXERCISES.find(e => e.id === currentBlock.exerciseId) : null;

  useEffect(() => {
    if (currentBlock?.type === LessonBlockType.SENSORY_BREAK) {
      setTimer(currentBlock.config?.duration || 60);
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, currentBlock]);

  const handleNext = (score?: number) => {
    if (score !== undefined) {
      setScores([...scores, score]);
    }

    if (currentIndex < plan.blocks.length - 1) {
      playCue('swoosh');
      setCurrentIndex(currentIndex + 1);
    } else {
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 100;
      setShowCompletion(true);
      onComplete(avgScore);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onExit();
    }
  };

  if (showCompletion) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center space-y-6"
      >
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          <Award className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Lesson Complete!</h2>
          <p className="text-slate-500 mt-2">Great job finishing "{plan.title}"</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onExit}
            className="px-8 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            Back to Lessons
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header / Progress */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 px-8">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
            <span>Step {currentIndex + 1} of {plan.blocks.length}</span>
            <span>{Math.round(((currentIndex + 1) / plan.blocks.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / plan.blocks.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            {currentBlock.type === LessonBlockType.EXERCISE && exercise ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <Play className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-bold text-slate-800">{exercise.title}</h3>
                    <p className="text-xs text-slate-500">{exercise.description}</p>
                  </div>
                </div>
                <SpecializedExerciseView
                  exercise={exercise}
                  styles={styles}
                  playCue={playCue}
                  onComplete={(score) => handleNext(score)}
                  localMentorAudio={localMentorAudio}
                  playTargetAudio={playTargetAudio}
                />
              </div>
            ) : currentBlock.type === LessonBlockType.SENSORY_BREAK ? (
              <div className="flex flex-col items-center justify-center h-full space-y-8 py-12">
                <div className="relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-100"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={553}
                      animate={{ strokeDashoffset: 553 - (553 * (timer / (currentBlock.config?.duration || 60))) }}
                      className="text-blue-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-slate-800">{timer}s</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">Remaining</span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800">Sensory Break</h3>
                  <p className="text-slate-500 mt-2">Take a deep breath and relax.</p>
                </div>
                <button 
                  onClick={() => handleNext()}
                  className="px-8 py-3 rounded-2xl bg-blue-500 text-white font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-transform"
                >
                  Skip Break
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-8 py-12 text-center max-w-lg mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{currentBlock.config?.title || 'Instruction'}</h3>
                  <p className="text-lg text-slate-600 mt-4 leading-relaxed">
                    {currentBlock.config?.text || 'Follow the instructions to continue.'}
                  </p>
                </div>
                <button 
                  onClick={() => handleNext()}
                  className="px-12 py-4 rounded-2xl bg-amber-500 text-white font-bold shadow-lg shadow-amber-200 hover:scale-105 transition-transform flex items-center gap-2"
                >
                  Got it!
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
