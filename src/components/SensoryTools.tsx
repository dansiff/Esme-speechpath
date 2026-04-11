import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, LayoutGrid, ArrowRight, Play, Pause, RotateCcw, Plus, Trash2, CheckCircle2, Settings2, Palette, ZapOff, Contrast, Type } from 'lucide-react';
import { FirstThenBoard, SensoryProfile } from '../types';

interface SensoryToolsProps {
  sensoryProfile?: SensoryProfile;
  firstThenBoards: FirstThenBoard[];
  onAddBoard: (board: Omit<FirstThenBoard, 'id' | 'createdAt'>) => void;
  onDeleteBoard: (id: string) => void;
  onUpdateSensoryProfile: (profile: Partial<SensoryProfile>) => void;
  styles: any;
}

export const SensoryTools: React.FC<SensoryToolsProps> = ({
  sensoryProfile,
  firstThenBoards,
  onAddBoard,
  onDeleteBoard,
  onUpdateSensoryProfile,
  styles
}) => {
  const [activeTab, setActiveTab] = useState<'timer' | 'boards' | 'settings'>('timer');
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerDuration, setTimerDuration] = useState(60); // Default 1 min
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // First/Then Form
  const [showAddBoard, setShowAddBoard] = useState(false);
  const [newFirst, setNewFirst] = useState('');
  const [newThen, setNewThen] = useState('');

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  const startTimer = () => {
    if (timeLeft === 0) setTimeLeft(timerDuration);
    setIsTimerRunning(true);
  };

  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(timerDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / timerDuration) * 100;

  return (
    <div className={`p-6 ${styles.card} max-w-4xl mx-auto mt-8`}>
      <div className="flex gap-4 mb-8 border-b border-slate-100 pb-4">
        <button
          onClick={() => setActiveTab('timer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            activeTab === 'timer' ? styles.button + ' text-white' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Timer size={18} />
          Visual Timer
        </button>
        <button
          onClick={() => setActiveTab('boards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            activeTab === 'boards' ? styles.button + ' text-white' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <LayoutGrid size={18} />
          First/Then Boards
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            activeTab === 'settings' ? styles.button + ' text-white' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Settings2 size={18} />
          Sensory Settings
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'timer' ? (
          <motion.div
            key="timer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-64 h-64 mb-8">
              {/* Visual Progress Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-100"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="754"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: 754 - (754 * progress) / 100 }}
                  className={styles.primary}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black tracking-tighter">{formatTime(timeLeft || timerDuration)}</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest mt-2">Remaining</span>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              {[1, 2, 5, 10].map(mins => (
                <button
                  key={mins}
                  onClick={() => {
                    setTimerDuration(mins * 60);
                    setTimeLeft(mins * 60);
                    setIsTimerRunning(false);
                  }}
                  className={`px-4 py-2 rounded-xl border-2 transition-all ${
                    timerDuration === mins * 60 ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            <div className="flex gap-6">
              <button
                onClick={resetTimer}
                className="p-4 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <RotateCcw size={24} />
              </button>
              <button
                onClick={isTimerRunning ? pauseTimer : startTimer}
                className={`p-6 rounded-full text-white shadow-lg transition-all transform hover:scale-110 ${
                  isTimerRunning ? 'bg-amber-500' : 'bg-green-500'
                }`}
              >
                {isTimerRunning ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </button>
            </div>
          </motion.div>
        ) : activeTab === 'boards' ? (
          <motion.div
            key="boards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {firstThenBoards.map(board => (
                <div key={board.id} className="relative group">
                  <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                    <div className="flex-1 text-center">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">First</p>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 aspect-square flex items-center justify-center text-xl font-bold">
                        {board.firstAction}
                      </div>
                    </div>
                    <ArrowRight className="text-slate-300" size={32} />
                    <div className="flex-1 text-center">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Then</p>
                      <div className="bg-primary/10 p-4 rounded-2xl shadow-sm border border-primary/20 aspect-square flex items-center justify-center text-xl font-bold text-primary">
                        {board.thenAction}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteBoard(board.id)}
                    className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-md text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {showAddBoard ? (
                <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-300">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="First: (e.g., Practice)"
                      value={newFirst}
                      onChange={e => setNewFirst(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Then: (e.g., Play Game)"
                      value={newThen}
                      onChange={e => setNewThen(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onAddBoard({ firstAction: newFirst, thenAction: newThen });
                          setNewFirst('');
                          setNewThen('');
                          setShowAddBoard(false);
                        }}
                        className={`flex-1 py-3 text-white font-bold rounded-xl ${styles.button}`}
                      >
                        Add Board
                      </button>
                      <button
                        onClick={() => setShowAddBoard(false)}
                        className="px-4 py-3 bg-slate-200 text-slate-600 font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddBoard(true)}
                  className="flex flex-col items-center justify-center gap-2 bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-300 text-slate-400 hover:bg-slate-100 hover:border-primary hover:text-primary transition-all"
                >
                  <Plus size={32} />
                  <span className="font-bold">New First/Then Board</span>
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Calming Colors */}
                <button
                  onClick={() => onUpdateSensoryProfile({ calmingColors: !sensoryProfile?.calmingColors })}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-3 ${
                    sensoryProfile?.calmingColors 
                      ? 'border-primary bg-primary/5 shadow-inner' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${sensoryProfile?.calmingColors ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Palette size={24} />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-tight text-sm">Calming Colors</p>
                    <p className="text-xs text-slate-500 mt-1">Softer, pastel color palette</p>
                  </div>
                </button>

                {/* Reduced Motion */}
                <button
                  onClick={() => onUpdateSensoryProfile({ reducedMotion: !sensoryProfile?.reducedMotion })}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-3 ${
                    sensoryProfile?.reducedMotion 
                      ? 'border-primary bg-primary/5 shadow-inner' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${sensoryProfile?.reducedMotion ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <ZapOff size={24} />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-tight text-sm">Reduced Motion</p>
                    <p className="text-xs text-slate-500 mt-1">Minimize animations and movement</p>
                  </div>
                </button>

                {/* High Contrast */}
                <button
                  onClick={() => onUpdateSensoryProfile({ highContrast: !sensoryProfile?.highContrast })}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-3 ${
                    sensoryProfile?.highContrast 
                      ? 'border-primary bg-primary/5 shadow-inner' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${sensoryProfile?.highContrast ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Contrast size={24} />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-tight text-sm">High Contrast</p>
                    <p className="text-xs text-slate-500 mt-1">Sharper text and defined borders</p>
                  </div>
                </button>

                {/* Visual Timer Toggle */}
                <button
                  onClick={() => onUpdateSensoryProfile({ showVisualTimer: !sensoryProfile?.showVisualTimer })}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-3 ${
                    sensoryProfile?.showVisualTimer 
                      ? 'border-primary bg-primary/5 shadow-inner' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${sensoryProfile?.showVisualTimer ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Timer size={24} />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-tight text-sm">Visual Timer</p>
                    <p className="text-xs text-slate-500 mt-1">Show timer during activities</p>
                  </div>
                </button>
              </div>

              {/* Font Scale Slider */}
              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl text-slate-400">
                      <Type size={20} />
                    </div>
                    <div>
                      <p className="font-black uppercase tracking-tight text-sm">Text Size</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Adjust for readability</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-primary">{Math.round((sensoryProfile?.fontScale || 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.1"
                  value={sensoryProfile?.fontScale || 1}
                  onChange={(e) => onUpdateSensoryProfile({ fontScale: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Small</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Default</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Large</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {sensoryProfile?.showVisualTimer && activeTab !== 'timer' && timeLeft > 0 && (
        <div className="fixed bottom-24 right-8 bg-white p-4 rounded-2xl shadow-2xl border-2 border-primary flex items-center gap-4 z-40">
          <div className="w-12 h-12 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * progress) / 100}
                className={styles.primary}
              />
            </svg>
          </div>
          <span className="font-black text-xl">{formatTime(timeLeft)}</span>
        </div>
      )}
    </div>
  );
};
