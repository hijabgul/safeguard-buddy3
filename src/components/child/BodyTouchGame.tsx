import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TOUCH_SCENARIOS } from '../../data/safetyData';
import { TouchScenario } from '../../types';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Volume2, Award, RotateCcw } from 'lucide-react';
import { speakText } from '../../utils/speech';

interface BodyTouchGameProps {
  onEarnBadge: (badgeName: string) => void;
  language?: 'ur' | 'en';
}

export const BodyTouchGame: React.FC<BodyTouchGameProps> = ({ onEarnBadge, language = 'ur' }) => {
  const isEn = language === 'en';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [, setScore] = useState(0);

  const currentScenario: TouchScenario = TOUCH_SCENARIOS[currentIndex];

  const handleChoice = (choiceIsSafe: boolean) => {
    setSelectedChoice(choiceIsSafe);
    const isCorrect = choiceIsSafe === currentScenario.isSafe;

    const explanation = isEn ? currentScenario.explanationEnglish : currentScenario.explanationUrdu;

    if (isCorrect) {
      setScore((s) => s + 1);
      speakText(isEn ? `Great job! ${explanation}` : `شاباش! ${explanation}`, language);
    } else {
      speakText(isEn ? `Remember: ${explanation}` : `یاد رکھیں، ${explanation}`, language);
    }
  };

  const handleNext = () => {
    setSelectedChoice(null);
    if (currentIndex + 1 < TOUCH_SCENARIOS.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCompleted(true);
      onEarnBadge(isEn ? 'Safe Touch Champion 🛡️' : 'محفوظ چھونا کا چیمپئن 🛡️');
      speakText(
        isEn
          ? 'Awesome! You learned all safe touch scenarios. You are a brave champion!'
          : 'زبردست! آپ نے تمام محفوظ چھونے کے سوالات درست سیکھ لیے! آپ ایک بہادر چیمپئن ہو۔',
        language
      );
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedChoice(null);
    setCompleted(false);
    setScore(0);
  };

  const title = isEn ? currentScenario.titleEnglish : currentScenario.titleUrdu;
  const description = isEn ? currentScenario.descriptionEnglish : currentScenario.descriptionUrdu;
  const explanation = isEn ? currentScenario.explanationEnglish : currentScenario.explanationUrdu;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-teal-100 p-6 max-w-2xl mx-auto font-sans">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>{isEn ? 'Safe Touch vs Unsafe Touch' : 'محفوظ چھونا بمقابلہ غیر محفوظ چھونا'}</span>
            <ShieldCheck className="w-6 h-6 text-teal-600" />
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEn ? 'Practice identifying safe boundaries' : 'Safe Touch vs Unsafe Touch Practice'}
          </p>
        </div>

        <div className="bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1.5 rounded-full border border-teal-200">
          {isEn ? `Question ${currentIndex + 1} / ${TOUCH_SCENARIOS.length}` : `سوال ${currentIndex + 1} / ${TOUCH_SCENARIOS.length}`}
        </div>
      </div>

      {!completed ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Scenario Card */}
            <div className="bg-gradient-to-br from-slate-50 to-teal-50/50 border-2 border-teal-100 rounded-3xl p-6 text-center shadow-inner relative overflow-hidden">
              <div className="text-6xl sm:text-7xl mb-3 animate-bounce">
                {currentScenario.icon}
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                {title}
              </h3>

              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {description}
              </p>

              <button
                onClick={() => speakText(`${title}. ${description}`, language)}
                className="mt-4 inline-flex items-center gap-1.5 bg-white text-teal-700 hover:bg-teal-100 px-3 py-1.5 rounded-full text-xs font-bold border border-teal-200 shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isEn ? 'Listen Scenario' : 'سوال سنیں'}</span>
              </button>
            </div>

            {/* Answer Options */}
            {selectedChoice === null ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  id="btn-choice-safe"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-2xl font-extrabold text-base shadow-lg transition-transform active:scale-95 flex flex-col items-center gap-2 border-b-4 border-emerald-700"
                >
                  <ShieldCheck className="w-8 h-8" />
                  <span>{isEn ? 'Safe Touch ✅' : 'محفوظ چھونا ✅ (Safe Touch)'}</span>
                </button>

                <button
                  onClick={() => handleChoice(false)}
                  id="btn-choice-unsafe"
                  className="bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-2xl font-extrabold text-base shadow-lg transition-transform active:scale-95 flex flex-col items-center gap-2 border-b-4 border-rose-700"
                >
                  <ShieldAlert className="w-8 h-8" />
                  <span>{isEn ? 'Unsafe Touch 🛑' : 'غیر محفوظ چھونا 🛑 (Unsafe)'}</span>
                </button>
              </div>
            ) : (
              /* Explanation Box */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-6 rounded-3xl border-2 space-y-4 ${
                  selectedChoice === currentScenario.isSafe
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  {selectedChoice === currentScenario.isSafe ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-extrabold text-lg">
                      {selectedChoice === currentScenario.isSafe
                        ? (isEn ? 'Great job! Correct answer!' : 'شاباش! بالکل درست جواب!')
                        : (isEn ? "Let's learn together:" : 'آؤ مل کر سیکھتے ہیں:')}
                    </h4>
                    <p className="text-sm leading-relaxed font-medium mt-1">
                      {explanation}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  id="btn-touch-next"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-2xl shadow transition-transform active:scale-95"
                >
                  {isEn ? 'Next Question' : 'اگلا سوال (Next Question)'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        /* Completion Victory Card */
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 py-6"
        >
          <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-12 h-12 text-teal-600" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {isEn ? 'Congratulations! You earned a badge! 🛡️' : 'مبارک ہو! آپ نے بیج حاصل کر لیا! 🛡️'}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {isEn ? 'You completed all safe and unsafe touch scenarios.' : 'آپ نے محفوظ اور غیر محفوظ چھونے کی تمام مشقیں مکمل کر لیں۔'}
            </p>
          </div>

          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-teal-900 font-bold text-sm">
            {isEn
              ? 'Remember: Your body belongs to you. If anything ever feels wrong, tell your trusted adults immediately!'
              : 'شاباش! ہمیشہ یاد رکھیں: آپ کا جسم صرف آپ کا ہے، اور اگر کبھی برا لگے تو فوراً اپنے امی ابو کو بتائیں!'}
          </div>

          <button
            onClick={handleReset}
            id="btn-touch-replay"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-3 rounded-2xl shadow transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isEn ? 'Play Again' : 'دوبارہ کھیلیں (Play Again)'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
