import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChildProfile } from '../types';
import { GameProvider } from './child/GameProvider';
import { SalamChatModule } from './child/SalamChatModule';
import { GamesHubModule } from './child/GamesHubModule';
import { BodyTouchGame } from './child/BodyTouchGame';
import { StrangerGame } from './child/StrangerGame';
import { SayingNoGame } from './child/SayingNoGame';
import { TrustedAdultsTree } from './child/TrustedAdultsTree';
import { SecretsGame } from './child/SecretsGame';
import { LearnWordsModule } from './child/LearnWordsModule';
import { DailyReflectionModule } from './child/DailyReflectionModule';
import {
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Megaphone,
  Trees,
  Lock,
  BookOpen,
  Award,
  Lock as ParentLock,
  Sparkles,
  Volume2,
  VolumeX,
  Gamepad2,
  Globe,
  Sun,
} from 'lucide-react';
import { stopSpeech } from '../utils/speech';

interface ChildrenDashboardProps {
  profile: ChildProfile;
  onUpdateProfile: (updatedProfile: ChildProfile) => void;
  onSwitchToParent: () => void;
  onDistressAlert: (triggerWord: string, context: string) => void;
  onChangeAvatar: () => void;
  onChangeLanguage?: () => void;
}

export const ChildrenDashboard: React.FC<ChildrenDashboardProps> = ({
  profile,
  onUpdateProfile,
  onSwitchToParent,
  onDistressAlert,
  onChangeAvatar,
  onChangeLanguage,
}) => {
  const isEn = profile.language === 'en';
  const [activeTab, setActiveTab] = useState<
    'games' | 'chat' | 'touch' | 'stranger' | 'no' | 'tree' | 'secrets' | 'words' | 'reflection'
  >('games');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  const handleEarnBadge = (badgeName: string) => {
    if (!profile.earnedBadges.includes(badgeName)) {
      const updatedBadges = [...profile.earnedBadges, badgeName];
      onUpdateProfile({
        ...profile,
        earnedBadges: updatedBadges,
      });
    }
  };

  const handleSaveTrustedAdults = (adults: string[]) => {
    onUpdateProfile({
      ...profile,
      trustedAdults: adults,
    });
  };

  const toggleSound = () => {
    if (soundEnabled) {
      stopSpeech();
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
    }
  };

  const tabs = [
    {
      id: 'games',
      label: isEn ? 'Games 🎮' : 'حفاظتی کھیل 🎮',
      icon: Gamepad2,
      borderColor: 'border-purple-300',
      activeStyle: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_6px_0_#4C1D95] border-white scale-105',
      iconColor: 'text-white',
    },
    {
      id: 'chat',
      label: isEn ? 'Safeguard Buddy' : 'سیف گارڈ بڈی',
      icon: MessageSquare,
      borderColor: 'border-fuchsia-300',
      activeStyle: 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-[0_6px_0_#86198F] border-white',
      iconColor: 'text-white',
    },
    {
      id: 'touch',
      label: isEn ? 'Safe Touch' : 'محفوظ چھونا',
      icon: ShieldCheck,
      borderColor: 'border-cyan-300',
      activeStyle: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_6px_0_#1E40AF] border-white',
      iconColor: 'text-white',
    },
    {
      id: 'stranger',
      label: isEn ? 'Stranger Danger' : 'اجنبی سے ہوشیار',
      icon: UserCheck,
      borderColor: 'border-violet-300',
      activeStyle: 'bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-[0_6px_0_#3B0764] border-white',
      iconColor: 'text-white',
    },
    {
      id: 'no',
      label: isEn ? 'Saying NO' : 'نہیں کہنے کی طاقت',
      icon: Megaphone,
      borderColor: 'border-lime-300',
      activeStyle: 'bg-gradient-to-r from-lime-400 to-yellow-400 text-slate-950 shadow-[0_6px_0_#4D7C0F] border-white',
      iconColor: 'text-slate-950',
    },
    {
      id: 'tree',
      label: isEn ? 'Trusted Tree' : 'بھروسہ مند درخت',
      icon: Trees,
      borderColor: 'border-emerald-300',
      activeStyle: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_6px_0_#065F46] border-white',
      iconColor: 'text-white',
    },
    {
      id: 'secrets',
      label: isEn ? 'Secrets' : 'اچھے اور برے راز',
      icon: Lock,
      borderColor: 'border-pink-300',
      activeStyle: 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-[0_6px_0_#831843] border-white',
      iconColor: 'text-white',
    },
    {
      id: 'words',
      label: isEn ? 'Safety Words' : 'نئے الفاظ',
      icon: BookOpen,
      borderColor: 'border-sky-300',
      activeStyle: 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white shadow-[0_6px_0_#312E81] border-white',
      iconColor: 'text-white',
    },
    {
      id: 'reflection',
      label: isEn ? 'Daily Journal' : 'احساسات ڈائری',
      icon: Sun,
      borderColor: 'border-amber-300',
      activeStyle: 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-[0_6px_0_#9F1239] border-white',
      iconColor: 'text-white',
    },
  ];

  return (
    <GameProvider profile={profile} onUpdateProfile={onUpdateProfile}>
      <div className="min-h-screen bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#EDE9FE] text-[#2D3436] pb-12 font-sans">
      {/* Top Bar Header */}
      <header className="bg-white/95 backdrop-blur-md border-b-4 border-purple-300 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Left: Parent Portal Button, Language & Sound Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchToParent}
              id="btn-switch-parent-from-dash"
              className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white text-xs font-black px-4 py-2 rounded-full shadow-[0_4px_0_#4C1D95] active:translate-y-1 active:shadow-none transition-all flex items-center gap-1.5 border border-purple-300"
            >
              <ParentLock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isEn ? 'Parent Portal' : 'والدین کا ڈیش بورڈ'}
              </span>
              <span className="sm:hidden">{isEn ? 'Parent' : 'والدین'}</span>
            </button>

            {onChangeLanguage && (
              <button
                onClick={onChangeLanguage}
                id="btn-change-language-dash"
                className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-950 border-2 border-purple-300 transition-colors shadow-sm flex items-center gap-1 text-xs font-black px-3"
                title={isEn ? 'Switch Language' : 'زبان تبدیل کریں'}
              >
                <Globe className="w-3.5 h-3.5 text-purple-700" />
                <span>{isEn ? 'EN 🇬🇧' : 'اردو 🇵🇰'}</span>
              </button>
            )}

            <button
              onClick={toggleSound}
              id="btn-toggle-sound"
              className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-950 border-2 border-purple-300 transition-colors shadow-sm"
              title={soundEnabled ? (isEn ? 'Mute' : 'آواز بند کریں') : (isEn ? 'Unmute' : 'آواز آن کریں')}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-purple-700" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>

          {/* Right: Child Profile Avatar & Name */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button
                onClick={onChangeAvatar}
                id="btn-change-avatar"
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-purple-600 border-4 border-white flex items-center justify-center text-2xl shadow-md relative overflow-hidden transition-transform hover:scale-105 active:scale-95"
                title={isEn ? 'Change Avatar' : 'اوتار تبدیل کریں'}
              >
                <span>{profile.avatar.icon}</span>
              </button>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-black text-purple-950 text-sm sm:text-base">
                  {profile.nickname}
                </span>
                <span className="text-[10px] bg-fuchsia-100 text-fuchsia-800 font-black px-2.5 py-0.5 rounded-full border-2 border-fuchsia-300">
                  {isEn ? `Age ${profile.ageBracket}` : `عمر ${profile.ageBracket}`}
                </span>
              </div>
              <button
                onClick={() => setShowBadgesModal(true)}
                className="text-xs text-purple-700 hover:text-purple-900 font-black flex items-center gap-1 hover:underline mt-0.5"
              >
                <Award className="w-3.5 h-3.5 text-fuchsia-500" />
                <span>
                  {profile.earnedBadges.length}{' '}
                  {isEn ? 'Badges Earned' : 'بیجز حاصل ہوئے'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* Navigation Tabs Grid */}
        <div className="bg-white p-2.5 rounded-[2rem] shadow-[0_8px_0_#D8B4FE] border-4 border-purple-300 grid grid-cols-4 sm:grid-cols-8 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                id={`tab-child-${tab.id}`}
                className={`py-3 px-1 rounded-2xl text-xs font-black transition-all flex flex-col items-center gap-1.5 border-2 ${
                  isActive
                    ? tab.activeStyle
                    : 'bg-purple-50/70 text-purple-950 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? tab.iconColor : 'text-purple-700'}`} />
                <span className="text-[11px] sm:text-xs text-center line-clamp-1 font-black">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.99 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {activeTab === 'games' && (
              <GamesHubModule
                profile={profile}
                onAwardBadge={handleEarnBadge}
              />
            )}

            {activeTab === 'chat' && (
              <SalamChatModule
                profile={profile}
                onDistressAlert={onDistressAlert}
              />
            )}

            {activeTab === 'touch' && (
              <BodyTouchGame onEarnBadge={handleEarnBadge} language={profile.language} ageBracket={profile.ageBracket} />
            )}

            {activeTab === 'stranger' && (
              <StrangerGame onEarnBadge={handleEarnBadge} language={profile.language} ageBracket={profile.ageBracket} />
            )}

            {activeTab === 'no' && (
              <SayingNoGame onEarnBadge={handleEarnBadge} language={profile.language} ageBracket={profile.ageBracket} />
            )}

            {activeTab === 'tree' && (
              <TrustedAdultsTree
                selectedAdults={profile.trustedAdults}
                onSaveTrustedAdults={handleSaveTrustedAdults}
                onEarnBadge={handleEarnBadge}
                language={profile.language}
                ageBracket={profile.ageBracket}
              />
            )}

            {activeTab === 'secrets' && (
              <SecretsGame onEarnBadge={handleEarnBadge} language={profile.language} ageBracket={profile.ageBracket} />
            )}

            {activeTab === 'words' && (
              <LearnWordsModule onAwardBadge={handleEarnBadge} language={profile.language} ageBracket={profile.ageBracket} />
            )}

            {activeTab === 'reflection' && (
              <DailyReflectionModule
                profile={profile}
                onAwardBadge={handleEarnBadge}
                onDistressAlert={onDistressAlert}
                language={profile.language}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Badges Modal */}
      {showBadgesModal && (
        <div className="fixed inset-0 bg-purple-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2.5rem] p-6 max-w-md w-full shadow-[0_12px_0_#9333EA] border-4 border-purple-300 text-left"
          >
            <div className="flex justify-between items-center border-b-2 border-purple-100 pb-3 mb-4">
              <h3 className="text-xl font-black text-purple-950 flex items-center gap-2">
                <Award className="w-6 h-6 text-fuchsia-500" />
                <span>{isEn ? 'Earned Badges' : 'حاصل کردہ بیجز (Earned Badges)'}</span>
              </h3>
              <button
                onClick={() => setShowBadgesModal(false)}
                className="text-slate-400 hover:text-purple-950 font-black text-xl p-1"
              >
                ✕
              </button>
            </div>

            {profile.earnedBadges.length > 0 ? (
              <div className="space-y-2.5 my-4">
                {profile.earnedBadges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-purple-50 border-2 border-purple-200 text-purple-950 font-black rounded-2xl flex items-center gap-3 shadow-sm"
                  >
                    <Sparkles className="w-5 h-5 text-fuchsia-500 shrink-0" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-slate-500 py-6 text-center">
                {isEn
                  ? 'No badges earned yet! Play games and complete lessons to earn all safety badges.'
                  : 'ابھی تک کوئی بیج نہیں ملا! مختلف کھیل کھیل کر اور سیکھ کر تمام بیجز حاصل کریں۔'}
              </p>
            )}

            <button
              onClick={() => setShowBadgesModal(false)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black py-3.5 rounded-2xl text-sm border-2 border-white shadow-[0_4px_0_#4C1D95] active:translate-y-1 active:shadow-none"
            >
              {isEn ? 'Close' : 'بند کریں (Close)'}
            </button>
          </motion.div>
        </div>
      )}
      </div>
    </GameProvider>
  );
};
