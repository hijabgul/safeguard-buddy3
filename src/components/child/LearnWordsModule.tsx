import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SAFETY_WORDS, TODDLER_SAFETY_WORDS, JUNIOR_SAFETY_WORDS } from '../../data/safetyData';
import { SafetyWord, AgeBracket } from '../../types';
import { speakText, stopSpeech } from '../../utils/speech';
import { Volume2, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { playSound } from '../../utils/soundEffects';

interface LearnWordsModuleProps {
  onAwardBadge?: (badgeName: string) => void;
  language?: 'ur' | 'en';
  ageBracket?: AgeBracket;
}

export const LearnWordsModule: React.FC<LearnWordsModuleProps> = ({
  onAwardBadge,
  language = 'ur',
  ageBracket = '8-10',
}) => {
  const isEn = language === 'en';

  // Toddler State
  const [toddlerListened, setToddlerListened] = useState<string[]>([]);
  
  // Junior State
  const [juniorListened, setJuniorListened] = useState<string[]>([]);

  // Explorer State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [exploredWords, setExploredWords] = useState<string[]>([]);

  /* ============================================================
     TODDLER VIEW (2-5) - Animal Sound Board & Picture Vocab
     ============================================================ */
  if (ageBracket === '2-5') {
    const handleSpeakToddler = (item: any) => {
      playSound.playPopSound();
      if (!toddlerListened.includes(item.id)) {
        const next = [...toddlerListened, item.id];
        setToddlerListened(next);
        if (next.length >= TODDLER_SAFETY_WORDS.length && onAwardBadge) {
          onAwardBadge(isEn ? 'Little Word Star 🗣️' : 'ننھا لفظوں کا ستارہ 🗣️');
        }
      }
      const text = isEn ? `${item.wordEnglish}! ${item.meaningEnglish}` : `${item.wordUrdu}! ${item.meaningUrdu}`;
      speakText(text, language);
    };

    return (
      <div className="bg-gradient-to-b from-yellow-50 to-amber-50 rounded-3xl p-6 max-w-2xl mx-auto border-4 border-amber-200 shadow-xl font-sans">
        <div className="text-center mb-6">
          <span className="inline-block bg-amber-200 text-amber-900 text-xs font-black px-4 py-1 rounded-full uppercase mb-2">
            {isEn ? 'Toddler Picture Words (2-5 Years)' : 'بچوں کے بنیادی حفاظتی الفاظ (۲ تا ۵ سال)'}
          </span>
          <h2 className="text-2xl font-black text-amber-950 flex items-center justify-center gap-2">
            <span>🗣️</span>
            <span>{isEn ? 'Tap to Hear Magic Safety Words!' : 'بٹن کو دبائیں اور جادوئی الفاظ سنیں!'}</span>
          </h2>
          <p className="text-xs font-bold text-amber-800 mt-1">
            {isEn ? 'Tap any card to listen and learn!' : 'کسی بھی تصویر پر کلک کریں اور لفظ سنیں!'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {TODDLER_SAFETY_WORDS.map((item) => {
            const isPlayed = toddlerListened.includes(item.id);
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSpeakToddler(item)}
                className={`p-5 rounded-3xl border-4 text-center shadow-lg transition-all flex flex-col items-center justify-center gap-3 ${
                  isPlayed
                    ? 'bg-amber-100 border-amber-400 text-amber-950'
                    : 'bg-white border-amber-200 hover:border-amber-300 text-slate-900'
                }`}
              >
                <div className="text-6xl animate-bounce">{item.icon}</div>
                <div>
                  <span className="text-lg font-black block leading-tight">
                    {isEn ? item.wordEnglish : item.wordUrdu}
                  </span>
                  <span className="text-xs font-bold text-amber-800 mt-1 block">
                    {isEn ? item.meaningEnglish : item.meaningUrdu}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-3 py-1 rounded-full text-xs font-black border border-amber-200">
                  <Volume2 className="w-4 h-4 text-amber-700" />
                  <span>{isEn ? 'Listen' : 'سنیں'}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {toddlerListened.length >= TODDLER_SAFETY_WORDS.length && (
          <div className="mt-6 text-center bg-white p-4 rounded-2xl border-2 border-amber-300">
            <div className="text-4xl mb-1">🎉🗣️</div>
            <p className="text-sm font-black text-amber-900">
              {isEn ? 'You learned all toddler safety words!' : 'آپ نے تمام ابتدائی حفاظتی الفاظ سیکھ لیے!'}
            </p>
          </div>
        )}
      </div>
    );
  }

  /* ============================================================
     JUNIOR VIEW (5-8) - Junior Vocabulary Cards & Scenarios
     ============================================================ */
  if (ageBracket === '5-8') {
    const handleSpeakJunior = (item: any) => {
      playSound.playPopSound();
      if (!juniorListened.includes(item.id)) {
        const next = [...juniorListened, item.id];
        setJuniorListened(next);
        if (next.length >= JUNIOR_SAFETY_WORDS.length && onAwardBadge) {
          onAwardBadge(isEn ? 'Junior Vocab Expert 📖' : 'جونئیر الفاظ کا ماہر 📖');
        }
      }
      const text = isEn
        ? `${item.wordEnglish}. ${item.questionEnglish}`
        : `${item.wordUrdu}۔ ${item.questionUrdu}`;
      speakText(text, language);
    };

    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 max-w-2xl mx-auto border-2 border-amber-200 shadow-xl font-sans">
        <div className="flex items-center justify-between border-b border-amber-200 pb-3 mb-5">
          <div>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              {isEn ? 'Junior Safety Vocab (5-8 Years)' : 'جونئیر حفاظتی الفاظ (۵ تا ۸ سال)'}
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-600" />
              <span>{isEn ? 'Essential Safety Words' : 'اہم حفاظتی الفاظ اور جملے'}</span>
            </h2>
          </div>
          <div className="text-xs font-black text-amber-900 bg-white px-3 py-1.5 rounded-full border border-amber-200">
            {juniorListened.length} / {JUNIOR_SAFETY_WORDS.length} {isEn ? 'Learned' : 'سیکھے'}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {JUNIOR_SAFETY_WORDS.map((item) => {
            const isLearned = juniorListened.includes(item.id);
            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border-2 bg-white flex flex-col justify-between space-y-3 transition-all ${
                  isLearned ? 'border-amber-400 shadow-md' : 'border-amber-200 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{item.icon}</span>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {isEn ? item.wordEnglish : item.wordUrdu}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100 space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      "{isEn ? item.questionEnglish : item.questionUrdu}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleSpeakJunior(item)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-2.5 rounded-2xl shadow flex items-center justify-center gap-2 text-xs transition-transform active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isEn ? 'Listen Explanation Voice' : 'تفصیل اور مثال سنیں'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ============================================================
     EXPLORER VIEW (8-10+) - Original Untouched Code
     ============================================================ */
  const handleSpeak = (word: SafetyWord) => {
    if (activeSpeakingId === word.id) {
      stopSpeech();
      setActiveSpeakingId(null);
      return;
    }

    stopSpeech();
    setActiveSpeakingId(word.id);

    // Track explored words for badge
    if (!exploredWords.includes(word.id)) {
      const updated = [...exploredWords, word.id];
      setExploredWords(updated);
      if (updated.length >= 3 && onAwardBadge) {
        onAwardBadge(isEn ? 'Vocabulary Champion 📖' : 'الفاظ کے ماہر (Vocabulary Champion)');
      }
    }

    const textToSay = isEn
      ? `${word.wordEnglish}. It means: ${word.meaningEnglish}`
      : `${word.wordUrdu}۔ اس کا مطلب ہے: ${word.meaningUrdu}`;

    speakText(textToSay, language, () => {
      setActiveSpeakingId(null);
    });
  };

  const filteredWords =
    selectedCategory === 'all'
      ? SAFETY_WORDS
      : SAFETY_WORDS.filter((w) => w.category === selectedCategory);

  return (
    <div className="space-y-6 font-sans">
      {/* Module Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border-4 border-[#FFD93D] shadow-[0_10px_0_#FFEAA7] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#FFD93D]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-16 h-16 bg-[#FFD93D] rounded-2xl border-4 border-[#FF8E3C] flex items-center justify-center text-3xl shadow-sm shrink-0">
              📖
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEAA7] border border-[#FFD93D] text-[#D35400] text-xs font-black mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEn ? 'Safety Vocabulary' : 'حفاظتی لغت (Safety Vocabulary)'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2D3436]">
                {isEn ? 'Learn Safety Words & Meanings' : 'نئے الفاظ اور ان کے معنی (Learn New Words)'}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#636E72] mt-1">
                {isEn
                  ? 'Click any word to listen to its pronunciation and explanation!'
                  : 'کسی بھی لفظ یا آواز کے بٹن پر کلک کریں اور پیاری آواز میں اس کا مطلب سنیں۔'}
              </p>
            </div>
          </div>

          <div className="bg-[#FFFBEB] px-4 py-3 rounded-2xl border-2 border-[#FFD93D] text-center shrink-0">
            <span className="text-xs font-black text-[#636E72] block">
              {isEn ? 'Words Learned:' : 'سیکھے گئے الفاظ:'}
            </span>
            <span className="text-xl font-black text-[#FF8E3C]">
              {exploredWords.length} / {SAFETY_WORDS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black border-2 transition-all shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-[#FF8E3C] text-white border-white shadow-[0_4px_0_#B33900]'
              : 'bg-white text-[#2D3436] border-[#FFEAA7] hover:bg-[#FFFBEB]'
          }`}
        >
          {isEn ? 'All Words' : 'تمام الفاظ (All Words)'}
        </button>
        <button
          onClick={() => setSelectedCategory('touch')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black border-2 transition-all shrink-0 ${
            selectedCategory === 'touch'
              ? 'bg-[#55EFC4] text-[#2D3436] border-[#00B894] shadow-[0_4px_0_#00B894]'
              : 'bg-white text-[#2D3436] border-[#FFEAA7] hover:bg-[#FFFBEB]'
          }`}
        >
          {isEn ? 'Touch Types' : 'چھونے کی اقسام (Touch)'}
        </button>
        <button
          onClick={() => setSelectedCategory('boundaries')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black border-2 transition-all shrink-0 ${
            selectedCategory === 'boundaries'
              ? 'bg-[#74B9FF] text-white border-[#0984E3] shadow-[0_4px_0_#0984E3]'
              : 'bg-white text-[#2D3436] border-[#FFEAA7] hover:bg-[#FFFBEB]'
          }`}
        >
          {isEn ? 'Boundaries' : 'حدود اور اجنبی (Boundaries)'}
        </button>
        <button
          onClick={() => setSelectedCategory('trusted')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black border-2 transition-all shrink-0 ${
            selectedCategory === 'trusted'
              ? 'bg-[#FFD93D] text-[#2D3436] border-[#FF8E3C] shadow-[0_4px_0_#D35400]'
              : 'bg-white text-[#2D3436] border-[#FFEAA7] hover:bg-[#FFFBEB]'
          }`}
        >
          {isEn ? 'Trusted Adults' : 'بھروسہ مند بڑے (Trusted Adults)'}
        </button>
      </div>

      {/* Words Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredWords.map((item) => {
          const isSpeaking = activeSpeakingId === item.id;
          const isExplored = exploredWords.includes(item.id);

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className={`p-5 rounded-3xl bg-white border-4 ${
                isSpeaking
                  ? 'border-[#FF8E3C] ring-4 ring-[#FFD93D]/50 shadow-[0_10px_0_#FF8E3C]'
                  : 'border-[#FFD93D] shadow-[0_6px_0_#FFEAA7]'
              } transition-all relative flex flex-col justify-between`}
            >
              {isExplored && (
                <div className="absolute top-3 right-3 bg-[#55EFC4] text-[#2D3436] text-[10px] font-black px-2.5 py-1 rounded-full border border-[#00B894] flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{isEn ? 'Learned' : 'سیکھ لیا'}</span>
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-[#FFFBEB] border-2 border-[#FFD93D] rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#2D3436] leading-tight">
                      {isEn ? item.wordEnglish : item.wordUrdu}
                    </h3>
                    <p className="text-xs font-bold text-[#FF8E3C]">
                      {isEn ? item.wordRoman : `${item.wordRoman} • ${item.wordEnglish}`}
                    </p>
                  </div>
                </div>

                {/* Meaning Box */}
                <div className="bg-[#FFFBEB] p-4 rounded-2xl border-2 border-[#FFEAA7] mb-4">
                  <p className="text-xs sm:text-sm font-bold text-[#2D3436] leading-relaxed">
                    "{isEn ? item.meaningEnglish : item.meaningUrdu}"
                  </p>
                </div>
              </div>

              {/* Action Audio Button */}
              <button
                onClick={() => handleSpeak(item)}
                className={`w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm border-2 flex items-center justify-center gap-2 transition-all ${
                  isSpeaking
                    ? 'bg-[#FF4757] text-white border-white animate-pulse shadow-md'
                    : 'bg-[#FF8E3C] hover:bg-[#e07b2b] text-white border-white shadow-[0_4px_0_#B33900] active:translate-y-1 active:shadow-none'
                }`}
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
                <span>
                  {isSpeaking
                    ? isEn ? 'Speaking...' : 'آواز جاری ہے...'
                    : isEn ? 'Listen Voice' : 'پیاری آواز میں سنیں (Listen)'}
                </span>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
