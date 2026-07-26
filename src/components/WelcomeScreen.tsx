import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Sparkles, Volume2, Play, Star, Award, Compass } from 'lucide-react';
import { speakUrduText } from '../utils/speech';

interface WelcomeScreenProps {
  onStart: () => void;
  onParentClick: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onParentClick }) => {
  const handleVoiceIntro = () => {
    speakUrduText('سلام! میں ہوں تمہارا سیف گارڈ بڈی! آؤ مل کر بچوں کی حفاظت اور کھیل سیکھیں۔');
  };

  return (
    <div className="w-full min-h-screen bg-[#0C091F] text-white flex flex-col justify-between p-3 sm:p-8 relative overflow-y-auto font-sans">
      {/* Decorative Neon Glowing Orbs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-fuchsia-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center w-full max-w-4xl mx-auto z-10 gap-2 mb-4 sm:mb-0">
        <div className="flex items-center gap-2.5 bg-[#140F33]/90 backdrop-blur-xl px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl shadow-[0_0_20px_rgba(147,51,234,0.35)] border border-purple-500/50">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-cyan-400 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold shadow-md text-white shrink-0">👋</div>
          <div>
            <h1 className="text-sm sm:text-lg font-black text-fuchsia-400 leading-none uppercase tracking-tight drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]">Safeguard Buddy</h1>
            <span className="text-[10px] sm:text-[11px] font-bold text-purple-300 uppercase tracking-wider dir-rtl block">محفوظ ساتھی — سیف گارڈ بڈی</span>
          </div>
        </div>

        <button
          onClick={onParentClick}
          id="btn-parent-portal-welcome"
          className="bg-[#1C1448] hover:bg-[#281D63] text-purple-100 text-xs sm:text-sm font-bold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all flex items-center gap-1.5 sm:gap-2 border border-purple-400/50 active:scale-95 shrink-0"
        >
          <Award className="w-4 h-4 text-fuchsia-300" />
          <span>والدین کا پورٹل (Parents)</span>
        </button>
      </div>

      {/* Main Hero Card */}
      <div className="w-full max-w-2xl mx-auto my-auto z-10 text-center flex flex-col items-center py-4 sm:py-6">
        {/* Animated Mascot Character Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="relative mb-4 sm:mb-8"
        >
          <div className="w-36 h-36 sm:w-56 sm:h-56 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-cyan-400 rounded-full p-2 shadow-[0_0_50px_rgba(217,70,239,0.6)] flex items-center justify-center relative border-4 border-purple-300 ring-4 ring-purple-500/40">
            <div className="w-full h-full bg-[#171038] rounded-full flex flex-col items-center justify-center relative overflow-hidden border-2 border-purple-400/60">
              <span className="text-5xl sm:text-8xl select-none animate-bounce">🦚</span>
              <div className="absolute bottom-1.5 sm:bottom-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-[10px] sm:text-xs font-black px-3 sm:px-4 py-0.5 sm:py-1 rounded-full shadow-lg border border-purple-300">
                سیف گارڈ بڈی
              </div>
            </div>

            {/* Voice Intro Button */}
            <button
              onClick={handleVoiceIntro}
              id="btn-voice-intro"
              className="absolute top-0 right-0 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-white p-2.5 sm:p-3 rounded-full shadow-[0_0_20px_rgba(217,70,239,0.8)] border border-purple-300 transition-transform hover:scale-110 active:scale-95"
              title="آواز سنیں (Listen)"
            >
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </motion.div>

        {/* Text Greeting Card in Neon Frame */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#140F33]/90 backdrop-blur-xl p-4 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border-2 border-purple-500/50 shadow-[0_0_40px_rgba(147,51,234,0.4)] w-full max-w-lg text-center relative"
        >
          <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-purple-950/90 border border-purple-500/60 text-fuchsia-300 text-[11px] sm:text-xs font-black mb-3 uppercase tracking-wider shadow-[0_0_10px_rgba(217,70,239,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>آپ کا حفاظت کا پیارا دوست</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white mb-1 tracking-tight uppercase drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]">
            Safeguard Buddy
          </h1>
          <p className="text-xl sm:text-3xl font-extrabold text-fuchsia-400 mb-3 sm:mb-4 dir-rtl drop-shadow-[0_0_10px_rgba(232,121,249,0.5)]">
            "اسلام علیکم! میں ہوں تمہارا سیف گارڈ بڈی!"
          </p>

          <p className="text-xs sm:text-base text-purple-200/90 mb-5 sm:mb-6 leading-relaxed dir-rtl font-bold bg-[#1C1448]/60 p-3 sm:p-4 rounded-2xl border border-purple-500/30">
            پاکستانی بچوں کی جسمانی حفاظت، اجنبی کی پہچان اور بھروسہ مند بالغوں کی تعلیم کے لیے ایک محفوظ، پیارا اور دوستانہ ایپ۔
          </p>

          <button
            onClick={onStart}
            id="btn-welcome-start"
            className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-base sm:text-xl py-3.5 sm:py-4 px-4 sm:px-8 rounded-xl sm:rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.7)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2.5 sm:gap-3 border border-purple-300/80"
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-fuchsia-200 text-fuchsia-200 animate-pulse" />
            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">آؤ شروع کریں (Let's Get Started)</span>
          </button>
        </motion.div>
      </div>

      {/* Footer Trust Badges */}
      <div className="w-full max-w-2xl mx-auto z-10 text-center pt-2 sm:pt-4 pb-2">
        <p className="text-purple-300 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <span className="bg-[#1D1740] px-2.5 sm:px-3 py-1 rounded-full border border-purple-500/30 shadow-[0_0_10px_rgba(147,51,234,0.2)] text-purple-200">🔒 100% Child Safe & Private</span>
          <span className="bg-[#1D1740] px-2.5 sm:px-3 py-1 rounded-full border border-purple-500/30 shadow-[0_0_10px_rgba(147,51,234,0.2)] text-purple-200">🇵🇰 Designed for Pakistani Families</span>
          <span className="bg-[#1D1740] px-2.5 sm:px-3 py-1 rounded-full border border-purple-500/30 shadow-[0_0_10px_rgba(147,51,234,0.2)] text-purple-200">📞 Emergency Helplines Included</span>
        </p>
      </div>
    </div>
  );
};


