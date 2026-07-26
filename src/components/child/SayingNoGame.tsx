import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, Volume2, Award, RotateCcw, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { speakText } from '../../utils/speech';
import { playSound } from '../../utils/soundEffects';
import { triggerConfetti } from '../../utils/confetti';
import { AgeBracket } from '../../types';

interface SayingNoGameProps {
  onEarnBadge: (badgeName: string) => void;
  language?: 'ur' | 'en';
  ageBracket?: AgeBracket;
}

interface Scenario {
  id: number;
  icon: string;
  titleUrdu: string;
  titleEnglish: string;
  storyUrdu: string;
  storyEnglish: string;
  shoutUrdu: string;
  shoutEnglish: string;
}

const NO_PRACTICE_SCENARIOS: Scenario[] = [
  {
    id: 1,
    icon: '🚗🍬',
    titleUrdu: 'مشق ۱: اجنبی کا بلاوا',
    titleEnglish: 'Practice 1: Stranger Danger',
    storyUrdu: 'اگر کوئی ناواقف شخص آپ کو ٹافی دے یا اپنی گاڑی میں بیٹھنے کا کہے...',
    storyEnglish: 'If a stranger offers you sweets or asks you to sit in their car...',
    shoutUrdu: 'نہیں! میں نہیں آؤں گا!',
    shoutEnglish: 'NO! I will not come!',
  },
  {
    id: 2,
    icon: '🛑✋',
    titleUrdu: 'مشق ۲: ناگوار چھونا اور راز',
    titleEnglish: 'Practice 2: Bad Touch & Secret',
    storyUrdu: 'اگر کوئی آپ کے نجی حصوں کو چھوئے یا بولے کہ کسی کو نہ بتانا...',
    storyEnglish: 'If someone touches your private area or tells you to keep a secret...',
    shoutUrdu: 'نہیں! یہ غلط ہے، میں امی کو بتاؤں گا!',
    shoutEnglish: 'NO! This is wrong, I will tell my Mom!',
  },
  {
    id: 3,
    icon: '🏃🔊',
    titleUrdu: 'مشق ۳: زبردستی یا ناگوار رویہ',
    titleEnglish: 'Practice 3: Uncomfortable Boundary',
    storyUrdu: 'اگر کوئی زبردستی آپ کو پکڑنا چاہے اور آپ کو برا محسوس ہو...',
    storyEnglish: 'If someone tries to grab or hold you forcefully and you feel unsafe...',
    shoutUrdu: 'نہیں! مجھ سے دور رہیں!',
    shoutEnglish: 'NO! Stay away from me!',
  },
];

export const SayingNoGame: React.FC<SayingNoGameProps> = ({ onEarnBadge, language = 'ur' }) => {
  const isEn = language === 'en';

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [completedScenarios, setCompletedScenarios] = useState<boolean[]>([false, false, false]);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [holdMessage, setHoldMessage] = useState<string | null>(null);
  const [isAllDone, setIsAllDone] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentScenario = NO_PRACTICE_SCENARIOS[activeIdx];

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle Press & Hold Start
  const handleStartHold = () => {
    if (completedScenarios[activeIdx] || isAllDone) return;

    setIsHolding(true);
    setHoldMessage(null);
    playSound.playClick();

    // Voice encouragement
    speakText(
      isEn
        ? `Keep pressing! Shout out loud: ${currentScenario.shoutEnglish}`
        : `دبائے رکھیں اور اونچی آواز میں کہیں: ${currentScenario.shoutUrdu}`,
      language
    );

    if (timerRef.current) clearInterval(timerRef.current);

    const startTime = Date.now();
    const duration = 2500; // 2.5 seconds to complete red line

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      if (pct >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsHolding(false);
        handleCompleteScenario();
      }
    }, 50);
  };

  // Handle Release before 100%
  const handleEndHold = () => {
    if (completedScenarios[activeIdx] || isAllDone) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (progress < 100 && isHolding) {
      setIsHolding(false);
      setProgress(0);
      const warnUrdu = 'سرخ لائن مکمل ہونے تک بٹن دبا کر رکھیں اور ساتھ اونچی آواز میں "نہیں!" بولیں!';
      const warnEn = 'Keep holding down the button until the red line completes, and shout NO!';
      setHoldMessage(isEn ? warnEn : warnUrdu);
      speakText(isEn ? warnEn : warnUrdu, language);
    }
  };

  // When Red Line fills 100%
  const handleCompleteScenario = () => {
    playSound.playCelebration();
    triggerConfetti();

    const updated = [...completedScenarios];
    updated[activeIdx] = true;
    setCompletedScenarios(updated);

    const allFinished = updated.every(Boolean);

    if (allFinished) {
      setIsAllDone(true);
      onEarnBadge(isEn ? 'Saying NO Champion 📢' : 'نہیں کہنے کا چیمپئن 📢');
      speakText(
        isEn
          ? 'Superb! You completed all the practice scenarios! Your voice is super powerful!'
          : 'بہت اعلیٰ! آپ نے "نہیں!" کہنے کی تمام مشقیں مکمل کر لیں۔ آپ کی آواز میں بہت طاقت ہے!',
        language
      );
    } else {
      speakText(
        isEn
          ? 'Great job! You completed this practice! Try the next one!'
          : 'زبردست! سرخ لائن مکمل ہو گئی! اب اگلی مشق کریں!',
        language
      );
    }
  };

  const handleNextScenario = () => {
    setHoldMessage(null);
    setProgress(0);
    setIsHolding(false);
    if (activeIdx + 1 < NO_PRACTICE_SCENARIOS.length) {
      setActiveIdx((i) => i + 1);
    }
  };

  const handleResetAll = () => {
    setActiveIdx(0);
    setCompletedScenarios([false, false, false]);
    setIsHolding(false);
    setProgress(0);
    setHoldMessage(null);
    setIsAllDone(false);
  };

  return (
    <div className="bg-gradient-to-b from-rose-50 via-red-50 to-amber-50 rounded-3xl p-5 sm:p-7 max-w-2xl mx-auto border-4 border-rose-300 shadow-xl font-sans space-y-6">
      {/* BANNER HEADER */}
      <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 rounded-3xl p-5 text-white text-center shadow-lg border-2 border-white/40 space-y-2">
        <span className="inline-block bg-white/20 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider border border-white/30">
          {isEn ? '📢 Power of Saying NO!' : '📢 "نہیں!" کہنے کی طاقت (Power of Saying NO!)'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black drop-shadow">
          {isEn ? 'Practice Saying NO!' : 'اونچی آواز میں "نہیں!" کہنے کی مشق'}
        </h1>
        <p className="text-xs sm:text-sm font-bold text-amber-100 max-w-md mx-auto leading-relaxed">
          {isEn
            ? 'Press & hold the red button down until the red line is complete while shouting NO out loud!'
            : 'جب تک سرخ (لال) لائن مکمل نہ ہو جائے، بٹن دبا کر رکھیں اور اونچی آواز میں "نہیں!" بولیں!'}
        </p>
      </div>

      {/* STEP INDICATORS */}
      <div className="grid grid-cols-3 gap-2">
        {NO_PRACTICE_SCENARIOS.map((s, idx) => {
          const isDone = completedScenarios[idx];
          const isCurrent = activeIdx === idx;
          return (
            <button
              key={s.id}
              onClick={() => {
                setActiveIdx(idx);
                setProgress(0);
                setHoldMessage(null);
              }}
              className={`p-3 rounded-2xl border-2 font-black text-xs sm:text-sm transition-all flex flex-col items-center gap-1 shadow-sm ${
                isCurrent
                  ? 'bg-rose-600 text-white border-yellow-300 scale-105 shadow-md ring-2 ring-rose-400'
                  : isDone
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                  : 'bg-white text-slate-700 border-rose-200 hover:bg-rose-50'
              }`}
            >
              <span className="text-xl">{s.icon}</span>
              <span>{isEn ? `Practice ${idx + 1}` : `مشق نمبر ${idx + 1}`}</span>
              {isDone && <span className="text-xs text-emerald-700">✓ {isEn ? 'Done' : 'مکمل'}</span>}
            </button>
          );
        })}
      </div>

      {!isAllDone ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl p-6 border-2 border-rose-300 shadow-md space-y-6 text-center"
          >
            {/* SCENARIO CARD */}
            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 space-y-2">
              <div className="text-5xl animate-bounce">{currentScenario.icon}</div>
              <h3 className="text-lg font-black text-rose-950">
                {isEn ? currentScenario.titleEnglish : currentScenario.titleUrdu}
              </h3>
              <p className="text-sm font-bold text-slate-800 leading-relaxed">
                {isEn ? currentScenario.storyEnglish : currentScenario.storyUrdu}
              </p>
              <button
                onClick={() =>
                  speakText(
                    isEn
                      ? `${currentScenario.storyEnglish} Practice shouting: ${currentScenario.shoutEnglish}`
                      : `${currentScenario.storyUrdu} اونچی آواز میں بولنے کی مشق کریں: ${currentScenario.shoutUrdu}`,
                    language
                  )
                }
                className="inline-flex items-center gap-1.5 bg-rose-200 hover:bg-rose-300 text-rose-950 font-black text-xs px-3 py-1.5 rounded-full transition"
              >
                <Volume2 className="w-4 h-4 text-rose-700" />
                <span>{isEn ? 'Listen Scenario' : 'منظرنامہ سنیں'}</span>
              </button>
            </div>

            {/* TARGET SHOUT TEXT BOX */}
            <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-3 text-slate-900 font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-inner">
              <Megaphone className="w-6 h-6 text-rose-600 animate-pulse shrink-0" />
              <span>
                {isEn ? `Shout: "${currentScenario.shoutEnglish}"` : `بولیں: "${currentScenario.shoutUrdu}"`}
              </span>
            </div>

            {/* RED LINE PROGRESS BAR */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black text-slate-700 px-1">
                <span>{isEn ? 'Red Line Practice Progress:' : 'سرخ (لال) لائن کا درجو:'}</span>
                <span className="text-rose-700 font-extrabold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-8 sm:h-10 bg-slate-200 rounded-full overflow-hidden border-4 border-rose-300 shadow-inner relative">
                <div
                  className="bg-gradient-to-r from-red-500 via-rose-600 to-red-700 h-full rounded-full transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-black text-slate-900 drop-shadow-sm pointer-events-none">
                  {completedScenarios[activeIdx]
                    ? isEn
                      ? '✓ Red Line Complete! 🏆'
                      : '✓ سرخ لائن مکمل ہو گئی! 🏆'
                    : isHolding
                    ? isEn
                      ? '📢 Keep Holding & Shout NO!'
                      : '📢 دبا کر رکھیں اور اونچی آواز میں نہیں کہیں!'
                    : isEn
                    ? 'Press & Hold Button Below'
                    : 'نیچے دیا گیا بٹن دبا کر رکھیں'}
                </div>
              </div>
            </div>

            {/* MAIN PRESS AND HOLD BUTTON */}
            {!completedScenarios[activeIdx] ? (
              <div className="py-2 flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onPointerDown={handleStartHold}
                  onPointerUp={handleEndHold}
                  onPointerLeave={handleEndHold}
                  onTouchStart={handleStartHold}
                  onTouchEnd={handleEndHold}
                  onMouseDown={handleStartHold}
                  onMouseUp={handleEndHold}
                  onMouseLeave={handleEndHold}
                  className={`w-52 h-52 sm:w-60 sm:h-60 rounded-full border-8 border-white ring-8 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-2xl transition-all select-none ${
                    isHolding
                      ? 'bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 text-white ring-red-500 scale-105 shadow-red-500/80 animate-pulse'
                      : 'bg-gradient-to-tr from-rose-500 via-red-500 to-amber-500 text-white ring-rose-300/80 hover:ring-rose-400'
                  }`}
                >
                  <Megaphone className={`w-14 h-14 text-yellow-200 ${isHolding ? 'animate-bounce' : ''}`} />
                  <span className="text-2xl sm:text-3xl font-black drop-shadow-md">
                    {isHolding
                      ? isEn
                        ? 'SHOUT "NO!"'
                        : 'کہیں: "نہیں!"'
                      : isEn
                      ? 'PRESS & HOLD'
                      : 'دبا کر رکھیں'}
                  </span>
                  <span className="text-xs font-bold bg-black/20 px-3 py-1 rounded-full border border-white/30">
                    {isEn ? 'Keep Pressed' : 'لال لائن مکمل ہونے تک'}
                  </span>
                </motion.button>

                {holdMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-xs font-black text-rose-800 bg-rose-100 border border-rose-300 p-2.5 rounded-xl max-w-sm"
                  >
                    {holdMessage}
                  </motion.p>
                )}
              </div>
            ) : (
              /* COMPLETED SCENARIO FEEDBACK */
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-400 space-y-3"
              >
                <div className="text-4xl">🎉📢✨</div>
                <h4 className="text-lg font-black text-emerald-950">
                  {isEn ? 'Practice Complete! Red Line Full!' : 'شاباش! سرخ لائن مکمل ہو گئی!'}
                </h4>
                <p className="text-xs sm:text-sm font-bold text-emerald-800">
                  {isEn
                    ? 'You shouted NO clearly and finished this practice scenario!'
                    : 'آپ نے اونچی آواز میں "نہیں!" کہنے کی یہ مشق کامیابی سے مکمل کر لی!'}
                </p>

                {activeIdx + 1 < NO_PRACTICE_SCENARIOS.length && (
                  <button
                    onClick={handleNextScenario}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-3 rounded-xl text-sm shadow-md transition-transform active:scale-95"
                  >
                    {isEn ? 'Next Practice Scenario ➡' : 'اگلی مشق کی طرف جائیں ➡'}
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        /* ALL SCENARIOS COMPLETE VICTORY SCREEN */
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-7 border-4 border-rose-400 shadow-xl text-center space-y-5"
        >
          <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-amber-200">
            <Award className="w-14 h-14" />
          </div>

          <div className="space-y-2">
            <span className="inline-block bg-rose-100 text-rose-900 text-xs font-black px-4 py-1 rounded-full uppercase">
              {isEn ? '🏆 Champion Unlocked' : '🏆 نہیں کہنے کا چیمپئن'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
              {isEn ? 'Saying NO Champion! 📢' : 'شاباش! نہیں کہنے کے چیمپئن! 📢'}
            </h2>
            <p className="text-sm font-bold text-slate-700 max-w-md mx-auto leading-relaxed">
              {isEn
                ? 'You now know how to keep pressing and shout NO loud and clear whenever anything feels unsafe. Your voice is your power!'
                : 'آپ نے کسی بھی ناگوار بات پر اونچی آواز میں نہیں کہنا سیکھ لیا ہے۔ ہمیشہ یاد رکھیں، آپ کی آواز آپ کی حفاظت کی سب سے بڑی طاقت ہے!'}
            </p>
          </div>

          <button
            onClick={handleResetAll}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-black px-7 py-3.5 rounded-2xl shadow-lg text-base transition-transform active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{isEn ? 'Practice Again' : 'دوبارہ مشق کریں'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
