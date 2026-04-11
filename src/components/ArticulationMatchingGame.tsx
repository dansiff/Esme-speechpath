import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Trophy, ArrowLeft, Volume2, Image as ImageIcon, Type, Star, Heart, Zap, Sun, Moon, Cloud, Ghost, Cat, Dog, Bird, Apple, Banana, Cherry } from 'lucide-react';
import { Exercise, Language } from '../types';
import { speakText } from '../utils/speechUtils';

const getIconForWord = (word: string) => {
  const w = word.toLowerCase();
  if (w.includes('star')) return <Star className="w-8 h-8" />;
  if (w.includes('heart')) return <Heart className="w-8 h-8" />;
  if (w.includes('zap') || w.includes('bolt')) return <Zap className="w-8 h-8" />;
  if (w.includes('sun')) return <Sun className="w-8 h-8" />;
  if (w.includes('moon')) return <Moon className="w-8 h-8" />;
  if (w.includes('cloud')) return <Cloud className="w-8 h-8" />;
  if (w.includes('ghost')) return <Ghost className="w-8 h-8" />;
  if (w.includes('cat')) return <Cat className="w-8 h-8" />;
  if (w.includes('dog')) return <Dog className="w-8 h-8" />;
  if (w.includes('bird')) return <Bird className="w-8 h-8" />;
  if (w.includes('apple')) return <Apple className="w-8 h-8" />;
  if (w.includes('banana')) return <Banana className="w-8 h-8" />;
  if (w.includes('cherry')) return <Cherry className="w-8 h-8" />;
  return <Sparkles className="w-8 h-8" />;
};

interface Card {
  id: string;
  exerciseId: string;
  content: string;
  type: 'image' | 'text';
  isFlipped: boolean;
  isMatched: boolean;
}

interface ArticulationMatchingGameProps {
  exercises: Exercise[];
  onClose: () => void;
  styles: any;
  playCue: (type: 'chime' | 'swoosh' | 'pop') => void;
  sensoryProfile?: any;
}

export const ArticulationMatchingGame: React.FC<ArticulationMatchingGameProps> = ({
  exercises,
  onClose,
  styles,
  playCue,
  sensoryProfile
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [gameMode, setGameMode] = useState<'mixed' | 'words' | 'symbols'>('words');
  const [showPronounceChallenge, setShowPronounceChallenge] = useState<string | null>(null);
  const [challengeScore, setChallengeScore] = useState<number | null>(null);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [exercises, gameMode]);

  const initializeGame = () => {
    // Select a subset of exercises for the game (e.g., 6 exercises for 12 cards)
    const gameExercises = [...exercises]
      .filter(ex => ex.targetWord)
      .reduce((acc, current) => {
        const x = acc.find(item => item.targetWord === current.targetWord);
        if (!x) return acc.concat([current]);
        return acc;
      }, [] as Exercise[])
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    const gameCards: Card[] = [];
    gameExercises.forEach((ex) => {
      const word = ex.targetWord || ex.title;
      
      if (gameMode === 'mixed') {
        gameCards.push({
          id: `${ex.id}-image`,
          exerciseId: ex.id,
          content: ex.imageUrl || `https://picsum.photos/seed/${word.toLowerCase()}/200/200`,
          type: 'image',
          isFlipped: false,
          isMatched: false
        });
        gameCards.push({
          id: `${ex.id}-text`,
          exerciseId: ex.id,
          content: word,
          type: 'text',
          isFlipped: false,
          isMatched: false
        });
      } else if (gameMode === 'symbols') {
        gameCards.push({
          id: `${ex.id}-symbol-1`,
          exerciseId: ex.id,
          content: word,
          type: 'image', // Use image type to trigger icon rendering
          isFlipped: false,
          isMatched: false
        });
        gameCards.push({
          id: `${ex.id}-symbol-2`,
          exerciseId: ex.id,
          content: word,
          type: 'image',
          isFlipped: false,
          isMatched: false
        });
      } else {
        gameCards.push({
          id: `${ex.id}-text-1`,
          exerciseId: ex.id,
          content: word,
          type: 'text',
          isFlipped: false,
          isMatched: false
        });
        gameCards.push({
          id: `${ex.id}-text-2`,
          exerciseId: ex.id,
          content: word,
          type: 'text',
          isFlipped: false,
          isMatched: false
        });
      }
    });

    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsWon(false);
    setShowPronounceChallenge(null);
    setChallengeScore(null);
  };

  const handleCardClick = (index: number) => {
    if (
      flippedCards.length === 2 || 
      cards[index].isFlipped || 
      cards[index].isMatched ||
      isWon
    ) return;

    playCue('pop');
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    // Speak the word when flipped
    const exercise = exercises.find(ex => ex.id === cards[index].exerciseId);
    speakText(exercise?.targetWord || cards[index].content, exercise?.language);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIndex, secondIndex] = newFlipped;
      
      if (cards[firstIndex].exerciseId === cards[secondIndex].exerciseId) {
        // Match!
        setTimeout(() => {
          playCue('chime');
          const matchedCards = [...cards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches(m => m + 1);
          
          // Show Pronunciation Challenge
          const matchedEx = exercises.find(ex => ex.id === cards[firstIndex].exerciseId);
          if (matchedEx) {
            setShowPronounceChallenge(matchedEx.targetWord || matchedEx.title);
          }

          if (matches + 1 === cards.length / 2) {
            setTimeout(() => setIsWon(true), 1500);
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Practice
          </button>
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setGameMode('words')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                gameMode === 'words' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Type className="w-4 h-4" />
              Words Only
            </button>
            <button
              onClick={() => setGameMode('mixed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                gameMode === 'mixed' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Words & Pictures
            </button>
            <button
              onClick={() => setGameMode('symbols')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                gameMode === 'symbols' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Symbols
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Moves</p>
              <p className="text-xl font-black">{moves}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Matches</p>
              <p className="text-xl font-black text-primary">{matches}/{cards.length / 2}</p>
            </div>
            <button 
              onClick={initializeGame}
              className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <RefreshCw className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Game Grid */}
        <div className={`grid grid-cols-3 md:grid-cols-4 gap-4 ${sensoryProfile?.reducedMotion ? '' : 'animate-in fade-in zoom-in duration-500'}`}>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              onClick={() => handleCardClick(index)}
              className="relative aspect-square cursor-pointer"
              whileHover={sensoryProfile?.reducedMotion ? {} : { scale: 1.02 }}
              whileTap={sensoryProfile?.reducedMotion ? {} : { scale: 0.98 }}
              style={{ perspective: "1000px" }}
            >
              <motion.div
                className="w-full h-full relative"
                initial={false}
                animate={{ rotateY: (card.isFlipped || card.isMatched) ? 180 : 0 }}
                transition={sensoryProfile?.reducedMotion ? { duration: 0.1 } : { duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Back Side (Face Down) */}
                <div 
                  className={`absolute inset-0 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center ${styles.accent} bg-opacity-10`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-inner`}>
                    <Sparkles className={`w-6 h-6 ${styles.primary}`} />
                  </div>
                </div>

                {/* Front Side (Face Up) */}
                <div 
                  className={`absolute inset-0 rounded-2xl bg-white border-4 ${card.isMatched ? 'border-emerald-400 bg-emerald-50' : 'border-white'} shadow-xl overflow-hidden flex flex-col items-center justify-center p-2`}
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  {card.type === 'image' ? (
                    gameMode === 'symbols' ? (
                      <div className="text-primary">
                        {getIconForWord(card.content)}
                      </div>
                    ) : (
                      <div className="w-full h-full relative">
                        <img 
                          src={card.content} 
                          alt="Match" 
                          className="w-full h-full object-cover rounded-lg"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // If image fails, show icon
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="flex items-center justify-center w-full h-full text-primary">${card.content.length > 10 ? '✨' : card.content}</div>`;
                            }
                          }}
                        />
                      </div>
                    )
                  ) : (
                    <div className="text-center p-2">
                      <p className={`text-sm md:text-lg font-black uppercase tracking-tight break-words leading-tight ${sensoryProfile?.highContrast ? 'text-black' : 'text-slate-800'}`}>
                        {card.content}
                      </p>
                      <div className="mt-2 flex justify-center">
                        <div className="p-1.5 bg-slate-50 rounded-full">
                          <Volume2 className="w-3 h-3 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  )}
                  {card.isMatched && (
                    <div className="absolute top-2 right-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-emerald-500 rounded-full p-1"
                      >
                        <Trophy className="w-3 h-3 text-white" />
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Pronunciation Challenge Overlay */}
        <AnimatePresence>
          {showPronounceChallenge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            >
              <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full text-center shadow-2xl">
                <div className="mb-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Match Found!</p>
                  <h3 className="text-4xl font-black uppercase tracking-tight text-primary mb-4">{showPronounceChallenge}</h3>
                  <p className="text-slate-500 font-medium">Can you say the word out loud?</p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      speakText(showPronounceChallenge);
                      playCue('pop');
                    }}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    <Volume2 className="w-5 h-5" />
                    Listen Again
                  </button>
                  <button
                    onClick={() => {
                      playCue('chime');
                      setShowPronounceChallenge(null);
                    }}
                    className={`py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg ${styles.button}`}
                  >
                    I Said It!
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Win Modal */}
        <AnimatePresence>
          {isWon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-black mb-2">Amazing Job!</h2>
                <p className="text-slate-500 mb-8">You matched all the articulation cards in {moves} moves!</p>
                <div className="space-y-3">
                  <button
                    onClick={initializeGame}
                    className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg transition-all hover:scale-105 active:scale-95 ${styles.button}`}
                  >
                    Play Again
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-4 rounded-2xl bg-slate-100 text-slate-600 font-black uppercase tracking-widest transition-all hover:bg-slate-200"
                  >
                    Back to Practice
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
