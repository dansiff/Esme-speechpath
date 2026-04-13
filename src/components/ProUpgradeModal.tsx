import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  CheckCircle2, 
  X, 
  Zap, 
  Cloud, 
  ShieldCheck, 
  BarChart3,
  Sparkles
} from 'lucide-react';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  isUpgrading?: boolean;
  styles: any;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  isUpgrading,
  styles
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
          >
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                <Crown className="w-48 h-48" />
              </div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                  <Crown className="w-8 h-8 fill-white" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Bilingual & Brilliant Pro</h2>
                <p className="text-sm font-medium opacity-90 max-w-xs">
                  Unlock the full potential of AI-powered speech therapy for your child.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Features List */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: Zap, title: "Real AI Speech Scoring", desc: "Professional accuracy, fluency, and pronunciation metrics using Gemini Pro." },
                  { icon: Cloud, title: "Secure Cloud Sync", desc: "Access your child's progress and recordings on any device, anywhere." },
                  { icon: ShieldCheck, title: "HIPAA-Aware Privacy", desc: "Advanced data protection and secure cloud storage options." },
                  { icon: BarChart3, title: "Detailed SLP Analytics", desc: "Track progress over time with professional-grade speech analytics." },
                  { icon: Sparkles, title: "All Premium Exercises", desc: "Unlimited access to all stories, drills, and specialized autism tools." }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{feature.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing & Button */}
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Annual Plan</p>
                    <p className="text-xl font-black">$9.99<span className="text-sm font-medium text-slate-500">/month</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-green-600 bg-green-100 px-2 py-0.5 rounded-full inline-block mb-1">Save 40%</p>
                    <p className="text-xs text-slate-400 font-medium">Billed annually</p>
                  </div>
                </div>

                <button 
                  onClick={onUpgrade}
                  disabled={isUpgrading}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-amber-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUpgrading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Upgrade Now"
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 font-medium">
                  Cancel anytime. No data plan required for local features.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
