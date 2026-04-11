import React from 'react';
import { motion } from 'motion/react';
import { Plus, Play, Trash2, Edit2, BookOpen, Clock, Star, ChevronRight } from 'lucide-react';
import { LessonPlan } from '../types';

interface LessonListViewProps {
  plans: LessonPlan[];
  onStart: (plan: LessonPlan) => void;
  onCreate: () => void;
  onEdit: (plan: LessonPlan) => void;
  onDelete: (id: string) => void;
  styles: any;
}

export const LessonListView: React.FC<LessonListViewProps> = ({ 
  plans, 
  onStart, 
  onCreate, 
  onEdit, 
  onDelete, 
  styles 
}) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Lesson Plans</h2>
          <p className="text-slate-500 text-sm">Create and follow structured learning paths</p>
        </div>
        <button 
          onClick={onCreate}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
          Create New Lesson
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-200 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6">
            <BookOpen className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">No Lessons Yet</h3>
          <p className="text-slate-500 max-w-xs mb-8">Build your first custom lesson plan to start a structured practice session.</p>
          <button 
            onClick={onCreate}
            className="px-8 py-3 rounded-2xl bg-white border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -5 }}
              className={`p-6 ${styles.card} flex flex-col h-full group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => onEdit(plan)}
                    className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(plan.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-primary transition-colors">
                  {plan.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                  {plan.description || 'No description provided.'}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {plan.blocks.length} Steps
                  </span>
                  <span className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {plan.difficulty}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => onStart(plan)}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Lesson
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
