import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { AVATARS } from '../data/avatars';
import { AvatarOption } from '../types';
import { ArrowLeft, ArrowRight, Check, Volume2, Sparkles } from 'lucide-react';
import { speakText, stopSpeech } from '../utils/speech';
import { PlayableVoiceResult } from '../services/elevenlabsVoiceService';

interface AvatarSelectionScreenProps {
  nickname: string;
  onSelectAvatar: (avatar: AvatarOption) => void;
  onBack: () => void;
  language?: 'ur' | 'en';
}

export const AvatarSelectionScreen: React.FC<AvatarSelectionScreenProps> = ({
  nickname,
  onSelectAvatar,
  onBack,
  language = 'ur',
}) => {
  const isEn = language === 'en';
  const [selected, setSelected] = useState<AvatarOption>(AVATARS[0]);
  const activeAudioRef = useRef<PlayableVoiceResult | null>(null);

  const stopAllSpeech = () => {
    stopSpeech();
    if (activeAudioRef.current) {
      try {
        activeAudioRef.current.stop();
      } catch (err) {
        console.warn('Error stopping ElevenLabs audio:', err);
      }
      activeAudioRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
  }, []);

  const speakAvatarIntro = (avatar: AvatarOption) => {
    stopAllSpeech();

    if (language === 'ur' || !isEn) {
      const textToSpeak = `سلام! میں ${avatar.nameUrdu} ہوں۔ ${avatar.descriptionUrdu}`;
      speakText(textToSpeak, 'ur');
    } else {
      const textToSpeak = `Hello! I am ${avatar.nameEnglish}!`;
      speakText(textToSpeak, 'en');
    }
  };

  const handleAvatarClick = (avatar: AvatarOption) => {
    setSelected(avatar);
    speakAvatarIntro(avatar);
  };

  const handleConfirm = () => {
    stopAllSpeech();
    onSelectAvatar(selected);
  };

  return (
    <div className="w-full min-h-screen bg-[#0C091F] text-white flex flex-col justify-center items-center p-3 sm:p-6 relative font-sans overflow-y-auto">
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl bg-[#140F33]/90 backdrop-blur-xl rounded-3xl sm:rounded-[2.5rem] shadow-[0_0_40px_rgba(147,51,234,0.35)] p-4 sm:p-8 border-2 border-purple-500/40 relative z-10 my-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          id="btn-avatar-back"
          className="absolute top-3.5 left-3.5 text-purple-200 bg-[#221B4C] hover:bg-[#2D2363] p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-purple-500/40 transition-all active:scale-95 shadow-md z-20"
          title={isEn ? 'Go Back' : 'پیچھے جائیں'}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 pt-6 sm:pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 text-[11px] sm:text-xs font-black mb-2 uppercase tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>{isEn ? 'Avatar Selection' : 'پاسپورٹ اور اوتار (Choose Avatar)'}</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
            {isEn ? 'Choose Your Favorite Avatar!' : 'اپنا پسندیدہ اوتار منتخب کریں!'}
          </h2>
          <p className="text-[11px] sm:text-xs font-bold text-purple-200/80 mt-0.5 sm:mt-1">
            {isEn
              ? `Dear ${nickname}, which friend will play with you?`
              : `پیارے ${nickname}، کون سا دوست آپ کے ساتھ کھیلے گا؟`}
          </p>
        </div>

        {/* Avatars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 mb-4 sm:mb-6">
          {AVATARS.map((avatar) => {
            const isSelected = selected.id === avatar.id;
            return (
              <motion.div
                key={avatar.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleAvatarClick(avatar)}
                id={`avatar-card-${avatar.id}`}
                className={`relative p-3 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${
                  isSelected
                    ? 'border-fuchsia-400 bg-gradient-to-b from-[#2D1B69] to-[#1A0F3D] shadow-[0_0_20px_rgba(217,70,239,0.5)]'
                    : 'border-purple-900/60 bg-[#1D1740]/80 hover:bg-[#251D52] hover:border-purple-500/50 text-slate-200'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-fuchsia-500 text-white rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(217,70,239,0.8)] border border-white">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                )}

                <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl border-2 border-purple-300 flex items-center justify-center text-3xl sm:text-5xl mb-1.5 sm:mb-2 shadow-[0_0_15px_rgba(168,85,247,0.5)] bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-indigo-600 text-white">
                  <span>{avatar.icon}</span>
                </div>

                <h3 className="font-black text-white text-xs sm:text-base mb-0.5">
                  {isEn ? avatar.nameEnglish : avatar.nameUrdu}
                </h3>
                <p className="text-[10px] sm:text-[11px] font-bold text-purple-300/80 line-clamp-1">
                  {isEn ? avatar.nameEnglish : avatar.descriptionUrdu}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Avatar Banner */}
        <div className="bg-[#1D1740] border border-purple-500/50 p-3 sm:p-4 rounded-2xl mb-4 sm:mb-6 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-2xl sm:text-3xl">{selected.icon}</span>
            <div className="text-left">
              <p className="text-[10px] sm:text-xs text-fuchsia-400 font-black uppercase">
                {isEn ? 'Selected Avatar:' : 'منتخب شدہ اوتار:'}
              </p>
              <p className="font-black text-white text-sm sm:text-base">
                {isEn ? selected.nameEnglish : selected.nameUrdu}
              </p>
            </div>
          </div>

          <button
            onClick={() => speakAvatarIntro(selected)}
            className="p-2 sm:p-2.5 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white rounded-xl border border-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.5)] transition-transform active:scale-95"
            title={isEn ? 'Listen Voice' : 'آواز سنیں'}
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          id="btn-avatar-confirm"
          className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base py-3.5 sm:py-4 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.6)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 border border-purple-300"
        >
          <span>{isEn ? 'Open Dashboard' : 'ڈیش بورڈ میں داخل ہوں (Open Dashboard)'}</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};
