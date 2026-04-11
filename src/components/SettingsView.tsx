import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Cloud, 
  Lock, 
  Eye, 
  EyeOff, 
  Database, 
  Smartphone,
  ChevronRight,
  Crown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SettingsViewProps {
  isPro: boolean;
  privacyMode: boolean;
  cloudSync: boolean;
  isNavbarHidden: boolean;
  isFocusMode: boolean;
  theme: string;
  sensoryProfile: any;
  onTogglePrivacy: (val: boolean) => void;
  onToggleCloudSync: (val: boolean) => void;
  onToggleNavbar: (val: boolean) => void;
  onToggleFocus: (val: boolean) => void;
  onSetTheme: (theme: any) => void;
  onUpdateSensoryProfile: (profile: any) => void;
  onUpgrade: () => void;
  onClearCache: () => void;
  styles: any;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isPro,
  privacyMode,
  cloudSync,
  isNavbarHidden,
  isFocusMode,
  theme,
  sensoryProfile,
  onTogglePrivacy,
  onToggleCloudSync,
  onToggleNavbar,
  onToggleFocus,
  onSetTheme,
  onUpdateSensoryProfile,
  onUpgrade,
  onClearCache,
  styles
}) => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tight">Settings</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Privacy, Sync & Account</p>
      </div>

      <div className="space-y-6">
        {/* UI Customization Section */}
        <section className={`${styles.card} p-6`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black uppercase text-sm">Interface</h3>
              <p className="text-xs text-slate-400">Customize your workspace</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Eye className={`w-5 h-5 ${isNavbarHidden ? 'text-slate-400' : 'text-primary'}`} />
                <div>
                  <p className="font-bold text-sm">Show Navigation Bar</p>
                  <p className="text-[10px] text-slate-500">Toggle the top menu visibility</p>
                </div>
              </div>
              <button 
                onClick={() => onToggleNavbar(!isNavbarHidden)}
                className={`w-12 h-6 rounded-full transition-colors relative ${!isNavbarHidden ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${!isNavbarHidden ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Smartphone className={`w-5 h-5 ${isFocusMode ? 'text-primary' : 'text-slate-400'}`} />
                <div>
                  <p className="font-bold text-sm">Focus Mode (Full Screen)</p>
                  <p className="text-[10px] text-slate-500">Maximize practice area and hide distractions</p>
                </div>
              </div>
              <button 
                onClick={() => onToggleFocus(!isFocusMode)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isFocusMode ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isFocusMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Visual Theme Section */}
        <section className={`${styles.card} p-6`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black uppercase text-sm">Visual Theme</h3>
              <p className="text-xs text-slate-400">Choose your preferred look</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'MODERN', name: 'Assistance', icon: '🛡️', desc: 'High-Grade Professional' },
              { id: 'KID', name: 'Kid Friendly', icon: '🎨', desc: 'Fun & Colorful' },
              { id: 'TEENAGE', name: 'Teenage', icon: '⚡', desc: 'Bold & Edgy' },
              { id: 'PLAYFUL', name: 'Playful', icon: '🍭', desc: 'Bright & Bouncy' },
              { id: 'PROFESSIONAL', name: 'Adult', icon: '👔', desc: 'Minimalist' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => onSetTheme(t.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  theme === t.id 
                    ? `border-primary bg-primary/5 shadow-md` 
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xl">{t.icon}</span>
                  <span className="font-black text-sm uppercase">{t.name}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Sensory Profile Section */}
        <section className={`${styles.card} p-6`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black uppercase text-sm">Sensory Profile</h3>
              <p className="text-xs text-slate-400">Neurodivergent-friendly settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'calmingColors', name: 'Calming Colors', icon: '🎨', desc: 'Soft, muted color palette' },
              { id: 'reducedMotion', name: 'Reduced Motion', icon: '✨', desc: 'Fewer animations' },
              { id: 'highContrast', name: 'High Contrast', icon: '👁️', desc: 'Better visibility' },
              { id: 'showVisualTimer', name: 'Floating Timer', icon: '⏲️', desc: 'Persistent visual timer' }
            ].map((pref) => (
              <button
                key={pref.id}
                onClick={() => onUpdateSensoryProfile({ [pref.id]: !(sensoryProfile?.[pref.id]) })}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                  sensoryProfile?.[pref.id]
                    ? `border-primary bg-primary/5 shadow-md` 
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  sensoryProfile?.[pref.id] ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <span className="text-lg">{pref.icon}</span>
                </div>
                <div>
                  <p className={`font-bold text-sm ${sensoryProfile?.[pref.id] ? 'text-primary' : 'text-slate-700'}`}>{pref.name}</p>
                  <p className="text-[10px] text-slate-400 leading-tight uppercase font-bold tracking-widest">{pref.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Privacy Section */}
        <section className={`${styles.card} p-6`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black uppercase text-sm">Privacy & HIPAA</h3>
              <p className="text-xs text-slate-400">Manage how your data is stored</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                {privacyMode ? <EyeOff className="w-5 h-5 text-green-500" /> : <Eye className="w-5 h-5 text-slate-400" />}
                <div>
                  <p className="font-bold text-sm">Local-Only Mode</p>
                  <p className="text-[10px] text-slate-500">Data never leaves this device (HIPAA compliant)</p>
                </div>
              </div>
              <button 
                onClick={() => onTogglePrivacy(!privacyMode)}
                className={`w-12 h-6 rounded-full transition-colors relative ${privacyMode ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${privacyMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Cloud className={`w-5 h-5 ${cloudSync ? 'text-blue-500' : 'text-slate-400'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">Cloud Sync</p>
                    {!isPro && <span className="text-[8px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-md font-black">PRO</span>}
                  </div>
                  <p className="text-[10px] text-slate-500">Sync progress across devices securely</p>
                </div>
              </div>
              <button 
                onClick={() => isPro ? onToggleCloudSync(!cloudSync) : onUpgrade()}
                className={`w-12 h-6 rounded-full transition-colors relative ${cloudSync && isPro ? 'bg-blue-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${cloudSync && isPro ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Storage Section */}
        <section className={`${styles.card} p-6`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black uppercase text-sm">Local Storage</h3>
              <p className="text-xs text-slate-400">Device-specific data management</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-slate-400" />
                <span className="font-bold text-sm">Export Local Data</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
            <button 
              onClick={onClearCache}
              className="w-full flex items-center justify-between p-4 hover:bg-red-50 rounded-2xl transition-colors text-red-500 group"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                <span className="font-bold text-sm">Clear Local Cache</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-30" />
            </button>
          </div>
        </section>

        {/* Pro Upgrade Banner */}
        {!isPro && (
          <motion.div 
            whileHover={{ scale: 1.01 }}
            onClick={onUpgrade}
            className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-[2.5rem] text-white shadow-xl shadow-amber-200 cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Crown className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 h-6 fill-white" />
                <h3 className="text-xl font-black uppercase">Upgrade to Pro</h3>
              </div>
              <p className="text-sm font-medium opacity-90 mb-4 max-w-md">
                Unlock Real AI Speech Scoring, Cloud Sync, and Advanced SLP Analytics for your child's journey.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-xs font-black uppercase bg-white/20 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Real AI Analysis
                </div>
                <div className="flex items-center gap-1 text-xs font-black uppercase bg-white/20 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Unlimited Sync
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
