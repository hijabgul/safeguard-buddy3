import React from 'react';
import { motion } from 'motion/react';
import { Volume2, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { speakText, stopSpeech } from '../utils/speech';

interface LanguageSelectionScreenProps {
  selectedLanguage: 'ur' | 'en';
  onSelectLanguage: (lang: 'ur' | 'en') => void;
  onContinue: () => void;
  onBack: () => void;
}

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onContinue,
  onBack,
}) => {
  const handleVoicePreview = (lang: 'ur' | 'en') => {
    stopSpeech();
    if (lang === 'en') {
      speakText('Hello! I am your AI friend Safeguard Buddy! I speak English and teach body safety.', 'en');
    } else {
      speakText('سلام! میں ہوں آپ کا سیف گارڈ بڈی! میں اردو میں بات کرتا ہوں اور جسمانی حفاظت سکھاتا ہوں۔', 'ur');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0C091F] text-white flex flex-col justify-between p-3 sm:p-8 relative overflow-y-auto font-sans">
      {/* Decorative Glowing Orbs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-2xl mx-auto z-10 gap-2 mb-4 sm:mb-0">
        <button
          onClick={onBack}
          id="btn-lang-back"
          className="bg-[#221B4C] hover:bg-[#2D2363] text-purple-200 p-2.5 sm:p-3 rounded-2xl border border-purple-500/40 shadow-md transition-all active:scale-95 flex items-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm shrink-0"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-400" />
          <span>{selectedLanguage === 'en' ? 'Back' : 'پیچھے'}</span>
        </button>

        <div className="bg-[#140F33]/90 backdrop-blur-xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-purple-500/40 shadow-md flex items-center gap-1.5 sm:gap-2">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-400" />
          <span className="text-xs sm:text-sm font-black text-purple-200">
            {selectedLanguage === 'en' ? 'Language Selection' : 'زبان کا انتخاب'}
          </span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-xl mx-auto my-auto z-10 text-center py-2 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#140F33]/90 backdrop-blur-xl p-4 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border-2 border-purple-500/40 shadow-[0_0_40px_rgba(147,51,234,0.35)] relative"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white rounded-2xl border border-purple-300 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-[0_0_20px_rgba(168,85,247,0.5)] text-2xl sm:text-3xl font-black">
            🌐
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-white mb-1.5 sm:mb-2 tracking-tight drop-shadow">
            {selectedLanguage === 'en' ? 'Choose Your Language' : 'اپنی پسندیدہ زبان منتخب کریں'}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-purple-300/80 mb-5 sm:mb-6">
            {selectedLanguage === 'en'
              ? 'Select English or Urdu. The AI friend will speak and explain lessons in your chosen language!'
              : 'اردو یا انگلش منتخب کریں۔ اے آئی دوست آپ کی منتخب کردہ زبان میں بات کرے گا!'}
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            {/* Urdu Option */}
            <div
              onClick={() => {
                onSelectLanguage('ur');
                handleVoicePreview('ur');
              }}
              id="opt-lang-ur"
              className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedLanguage === 'ur'
                  ? 'bg-gradient-to-b from-[#2D1B69] to-[#1A0F3D] border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.5)] scale-102'
                  : 'bg-[#1D1740]/80 border-purple-900/60 hover:bg-[#251D52] hover:border-purple-500/50 shadow-sm'
              }`}
            >
              {selectedLanguage === 'ur' && (
                <div className="absolute -top-2.5 -right-2.5 bg-fuchsia-500 text-white p-1 sm:p-1.5 rounded-full border border-purple-200 shadow-[0_0_10px_rgba(217,70,239,0.8)]">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}

              <div className="text-right space-y-1">
                <div className="text-3xl sm:text-4xl mb-1">🇵🇰</div>
                <h2 className="text-lg sm:text-xl font-black text-fuchsia-300">اردو (Urdu)</h2>
                <p className="text-xs font-bold text-purple-200/80 leading-relaxed">
                  سارے اسباق، گیمز اور اے آئی آواز مکمل اردو میں ہو گی۔
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVoicePreview('ur');
                }}
                className="mt-3 sm:mt-4 bg-[#221B4C] hover:bg-fuchsia-600 hover:text-white text-purple-200 py-2 px-3 rounded-xl border border-purple-500/40 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fuchsia-400" />
                <span>آواز سنیں (Listen)</span>
              </button>
            </div>

            {/* English Option */}
            <div
              onClick={() => {
                onSelectLanguage('en');
                handleVoicePreview('en');
              }}
              id="opt-lang-en"
              className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedLanguage === 'en'
                  ? 'bg-gradient-to-b from-[#1E295E] to-[#111838] border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-102'
                  : 'bg-[#1D1740]/80 border-purple-900/60 hover:bg-[#251D52] hover:border-purple-500/50 shadow-sm'
              }`}
            >
              {selectedLanguage === 'en' && (
                <div className="absolute -top-2.5 -right-2.5 bg-indigo-500 text-white p-1 sm:p-1.5 rounded-full border border-purple-200 shadow-[0_0_10px_rgba(99,102,241,0.8)]">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}

              <div className="text-left space-y-1">
                <div className="text-3xl sm:text-4xl mb-1">🇬🇧</div>
                <h2 className="text-lg sm:text-xl font-black text-indigo-300">English</h2>
                <p className="text-xs font-bold text-purple-200/80 leading-relaxed">
                  All lessons, games, and AI speaking voice will be in English.
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVoicePreview('en');
                }}
                className="mt-3 sm:mt-4 bg-[#221B4C] hover:bg-indigo-600 hover:text-white text-purple-200 py-2 px-3 rounded-xl border border-purple-500/40 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                <span>Listen Voice</span>
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            id="btn-lang-continue"
            className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-base sm:text-lg py-3.5 sm:py-4 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.6)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2.5 sm:gap-3 border border-purple-300"
          >
            <span>{selectedLanguage === 'en' ? 'Continue' : 'آگے بڑھیں'}</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </motion.div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] sm:text-xs font-bold text-purple-300/80 z-10 pt-2">
        <span>Safeguard Buddy • Bilingual Learning Support (English & Urdu)</span>
      </div>
    </div>
  );
};
