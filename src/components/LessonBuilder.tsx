import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { Plus, Trash2, GripVertical, Save, X, Play, Info, Clock, MessageSquare, ChevronDown, ChevronUp, Copy, Settings2 } from 'lucide-react';
import { LessonPlan, LessonBlock, LessonBlockType, Exercise, Difficulty, Language } from '../types';
import { EXERCISES } from '../constants';

interface LessonBuilderProps {
  onSave: (plan: LessonPlan) => void;
  onCancel: () => void;
  initialPlan?: LessonPlan;
  styles: any;
}

export const LessonBuilder: React.FC<LessonBuilderProps> = ({ onSave, onCancel, initialPlan, styles }) => {
  const [title, setTitle] = useState(initialPlan?.title || '');
  const [description, setDescription] = useState(initialPlan?.description || '');
  const [blocks, setBlocks] = useState<LessonBlock[]>(initialPlan?.blocks || []);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialPlan?.difficulty || Difficulty.EASY);
  const [language, setLanguage] = useState<Language>(initialPlan?.language || Language.ENGLISH);
  const [showExercisePicker, setShowExercisePicker] = useState<{ type: 'add' | 'change', blockId?: string } | null>(null);
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);

  const addBlock = (type: LessonBlockType, exerciseId?: string) => {
    const newBlock: LessonBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      exerciseId,
      config: type === LessonBlockType.SENSORY_BREAK ? { duration: 60 } : 
              type === LessonBlockType.MESSAGE ? { text: '', title: 'Instruction' } : undefined
    };
    setBlocks([...blocks, newBlock]);
    setShowExercisePicker(null);
    setExpandedBlockId(newBlock.id);
  };

  const duplicateBlock = (block: LessonBlock) => {
    const newBlock: LessonBlock = {
      ...block,
      id: Math.random().toString(36).substr(2, 9),
    };
    const index = blocks.findIndex(b => b.id === block.id);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setExpandedBlockId(newBlock.id);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (expandedBlockId === id) setExpandedBlockId(null);
  };

  const updateBlockConfig = (id: string, config: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, config: { ...b.config, ...config } } : b));
  };

  const changeExercise = (blockId: string, exerciseId: string) => {
    setBlocks(blocks.map(b => b.id === blockId ? { ...b, exerciseId } : b));
    setShowExercisePicker(null);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const plan: LessonPlan = {
      id: initialPlan?.id || Math.random().toString(36).substr(2, 9),
      title,
      description,
      blocks,
      difficulty,
      language,
      createdBy: 'local',
      createdAt: initialPlan?.createdAt || new Date().toISOString(),
    };
    onSave(plan);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${styles.text}`}>Lesson Builder</h2>
        <div className="flex gap-2">
          <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
          <button 
            onClick={handleSave}
            disabled={!title.trim() || blocks.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-medium shadow-lg shadow-primary/20 disabled:opacity-50`}
          >
            <Save className="w-4 h-4" />
            Save Lesson
          </button>
        </div>
      </div>

      <div className={`p-6 rounded-2xl ${styles.card} space-y-4`}>
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-1">Lesson Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Morning Articulation Routine"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-1">Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this lesson for?"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-20"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-500 mb-1">Difficulty</label>
            <select 
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
            >
              <option value={Difficulty.EASY}>Easy</option>
              <option value={Difficulty.MEDIUM}>Medium</option>
              <option value={Difficulty.HARD}>Hard</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-500 mb-1">Language</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
            >
              <option value={Language.ENGLISH}>English</option>
              <option value={Language.SPANISH}>Spanish</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          Lesson Steps ({blocks.length})
        </h3>
        
        <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className="space-y-3">
          {blocks.map((block, index) => {
            const exercise = block.exerciseId ? EXERCISES.find(e => e.id === block.exerciseId) : null;
            const isExpanded = expandedBlockId === block.id;
            
            return (
              <Reorder.Item 
                key={block.id} 
                value={block}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col gap-0 rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden`}
              >
                <div className={`flex items-center gap-4 p-4 cursor-grab active:cursor-grabbing ${isExpanded ? 'bg-slate-50/50' : ''}`}>
                  <div className="text-slate-300">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {block.type === LessonBlockType.EXERCISE ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Play className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate">{exercise?.title || 'Unknown Exercise'}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{exercise?.type}</p>
                        </div>
                      </div>
                    ) : block.type === LessonBlockType.SENSORY_BREAK ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">Sensory Break</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{block.config?.duration || 60} seconds</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate">{block.config?.title || 'Instruction'}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Message</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                      className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-100'}`}
                      title="Configure Block"
                    >
                      <Settings2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => duplicateBlock(block)}
                      className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                      title="Duplicate Block"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => removeBlock(block.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove Block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 overflow-hidden"
                    >
                      <div className="p-6 bg-slate-50/30 space-y-4">
                        {block.type === LessonBlockType.EXERCISE ? (
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-500">
                              Target: <span className="font-bold text-slate-700">{exercise?.targetWord || 'N/A'}</span>
                            </div>
                            <button 
                              onClick={() => setShowExercisePicker({ type: 'change', blockId: block.id })}
                              className="text-xs font-bold text-primary hover:underline"
                            >
                              Change Exercise
                            </button>
                          </div>
                        ) : block.type === LessonBlockType.SENSORY_BREAK ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-bold text-slate-600">Break Duration</label>
                              <span className="text-sm font-black text-primary">{block.config?.duration || 60}s</span>
                            </div>
                            <input 
                              type="range" 
                              min="10" 
                              max="300" 
                              step="10"
                              value={block.config?.duration || 60}
                              onChange={(e) => updateBlockConfig(block.id, { duration: parseInt(e.target.value) })}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                              <span>10s</span>
                              <span>5m</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Instruction Title</label>
                              <input 
                                type="text"
                                placeholder="e.g., Get Ready!"
                                value={block.config?.title}
                                onChange={(e) => updateBlockConfig(block.id, { title: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Instruction Text</label>
                              <textarea 
                                placeholder="What should the student do?"
                                value={block.config?.text}
                                onChange={(e) => updateBlockConfig(block.id, { text: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm h-24"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>

        <div className="flex gap-2">
          <button 
            onClick={() => setShowExercisePicker({ type: 'add' })}
            className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-primary hover:text-primary transition-all group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Add Exercise
          </button>
          <button 
            onClick={() => addBlock(LessonBlockType.SENSORY_BREAK)}
            className="px-4 py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-500 transition-all"
            title="Add Sensory Break"
          >
            <Clock className="w-5 h-5" />
          </button>
          <button 
            onClick={() => addBlock(LessonBlockType.MESSAGE)}
            className="px-4 py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-amber-400 hover:text-amber-500 transition-all"
            title="Add Instruction"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Exercise Picker Modal */}
      <AnimatePresence>
        {showExercisePicker && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-3xl ${styles.card} flex flex-col`}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">
                  {showExercisePicker.type === 'add' ? 'Add an Exercise' : 'Change Exercise'}
                </h3>
                <button onClick={() => setShowExercisePicker(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {EXERCISES.map(ex => (
                  <button 
                    key={ex.id}
                    onClick={() => {
                      if (showExercisePicker.type === 'add') {
                        addBlock(LessonBlockType.EXERCISE, ex.id);
                      } else if (showExercisePicker.blockId) {
                        changeExercise(showExercisePicker.blockId, ex.id);
                      }
                    }}
                    className="w-full flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                      <img src={ex.imageUrl} alt={ex.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 group-hover:text-primary transition-colors">{ex.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{ex.description}</p>
                    </div>
                    <div className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                      {ex.type}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
