import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  STRANGER_SCENARIOS,
  TODDLER_STRANGER_SCENARIOS,
  JUNIOR_STRANGER_SCENARIOS
} from '../../data/safetyData';
import { StrangerScenario, AgeBracket } from '../../types';
import { UserCheck, CheckCircle2, AlertTriangle, Volume2, Award, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';
import { speakText } from '../../utils/speech';

interface StrangerGameProps {
  onEarnBadge: (badgeName: string) => void;
  language?: 'ur' | 'en';
  ageBracket?: AgeBracket;
}

export const StrangerGame: React.FC<StrangerGameProps> = ({ onEarnBadge, language = 'ur', ageBracket = '8-10' }) => {
  const isEn = language === 'en';

  // State for Toddler (2-5)
  const [toddlerIndex, setToddlerIndex] = useState(0);
  const [toddlerSelectedOpt, setToddlerSelectedOpt] = useState<any | null>(null);
  const [toddlerDone, setToddlerDone] = useState(false);

  // State for Junior (5-8)
  const [juniorIndex, setJuniorIndex] = useState(0);
  const [juniorStep, setJuniorStep] = useState(1);
  const [juniorSelectedOpt, setJuniorSelectedOpt] = useState<any | null>(null);
  const [juniorDone, setJuniorDone] = useState(false);

  // State for Explorer (8-10)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  /* ============================================================
     TODDLER VIEW (2-5) - Single Tap, Animal Story, <30s
     ============================================================ */
  if (ageBracket === '2-5') {
    const scenario = TODDLER_STRANGER_SCENARIOS[toddlerIndex];

    const handleSelectToddlerOpt = (opt: any) => {
      setToddlerSelectedOpt(opt);
      const text = isEn ? opt.feedbackEnglish : opt.feedbackUrdu;
      speakText(text, language);
    };

    const handleNextToddler = () => {
      setToddlerSelectedOpt(null);
      if (toddlerIndex + 1 < TODDLER_STRANGER_SCENARIOS.length) {
        setToddlerIndex((i) => i + 1);
      } else {
        setToddlerDone(true);
        onEarnBadge(isEn ? 'Little Safety Star 🌟' : 'ننھا حفاظتی ستارہ 🌟');
        speakText(
          isEn
            ? 'Yay! You kept all the animal friends safe from strangers!'
            : 'واہ! آپ نے تمام جانور دوستوں کو اجنبی سے محفوظ رکھا!',
          language
        );
      }
    };

    return (
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl p-6 max-w-xl mx-auto border-4 border-amber-200 shadow-xl font-sans">
        <div className="text-center mb-4">
          <span className="inline-block bg-amber-200 text-amber-900 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider mb-2">
            {isEn ? 'Toddler Safety Story (2-5 Years)' : 'بچوں کی حفاظتی کہانی (۲ تا ۵ سال)'}
          </span>
          <h2 className="text-2xl font-black text-amber-950 flex items-center justify-center gap-2">
            <span>{scenario.characterIcon}</span>
            <span>{isEn ? scenario.titleEnglish : scenario.titleUrdu}</span>
          </h2>
        </div>

        {!toddlerDone ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={scenario.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="space-y-5"
            >
              {/* Animal Character Story Card */}
              <div className="bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-md text-center space-y-3">
                <div className="text-6xl animate-bounce">{scenario.characterIcon}</div>
                <h3 className="font-extrabold text-amber-900 text-lg">
                  {isEn ? scenario.characterNameEnglish : scenario.characterNameUrdu}
                </h3>
                <p className="text-base text-slate-800 font-bold leading-relaxed">
                  {isEn ? scenario.storyEnglish : scenario.storyUrdu}
                </p>
                <button
                  onClick={() =>
                    speakText(
                      isEn ? `${scenario.characterNameEnglish}. ${scenario.storyEnglish}` : `${scenario.characterNameUrdu}. ${scenario.storyUrdu}`,
                      language
                    )
                  }
                  className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-black px-4 py-2 rounded-full text-xs"
                >
                  <Volume2 className="w-4 h-4 text-amber-700" />
                  <span>{isEn ? 'Listen Story' : 'کہانی سنیں'}</span>
                </button>
              </div>

              {/* Picture / Icon Options (Single Tap) */}
              <div className="grid grid-cols-1 gap-3">
                {scenario.options.map((opt) => {
                  const isSelected = toddlerSelectedOpt?.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectToddlerOpt(opt)}
                      className={`p-4 rounded-2xl border-4 text-left transition-transform active:scale-95 flex items-center gap-4 ${
                        isSelected
                          ? opt.isSafe
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 scale-105 shadow-lg'
                            : 'bg-rose-100 border-rose-400 text-rose-950'
                          : 'bg-white border-amber-200 hover:border-amber-400 text-slate-900 shadow-sm'
                      }`}
                    >
                      <span className="text-4xl shrink-0">{opt.icon}</span>
                      <div className="flex-1">
                        <span className="text-base font-black leading-snug block">
                          {isEn ? opt.textEnglish : opt.textUrdu}
                        </span>
                        {isSelected && (
                          <span
                            className={`text-xs font-black mt-1 block ${
                              opt.isSafe ? 'text-emerald-800' : 'text-rose-800'
                            }`}
                          >
                            {isEn ? opt.feedbackEnglish : opt.feedbackUrdu}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {toddlerSelectedOpt && (
                <button
                  onClick={handleNextToddler}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-2xl shadow-lg text-lg transition-transform active:scale-95"
                >
                  {isEn ? 'Next Story ➡' : 'اگلی کہانی ➡'}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-8 space-y-4 bg-white rounded-3xl p-6 border-2 border-amber-300">
            <div className="text-6xl">🌟🐥🎉</div>
            <h3 className="text-2xl font-black text-amber-950">
              {isEn ? 'Super Little Safety Star! 🌟' : 'شاباش! ننھا حفاظتی ستارہ! 🌟'}
            </h3>
            <p className="text-sm font-bold text-slate-700">
              {isEn ? 'You know how to stay safe with Mama & Papa!' : 'آپ جانتے ہو کہ امی اور ابو کے پاس رہ کر کیسے محفوظ رہنا ہے!'}
            </p>
            <button
              onClick={() => {
                setToddlerIndex(0);
                setToddlerSelectedOpt(null);
                setToddlerDone(false);
              }}
              className="bg-amber-500 text-white font-black px-6 py-3 rounded-2xl shadow hover:bg-amber-600"
            >
              {isEn ? 'Play Again 🔁' : 'دوبارہ کھیلے (Play Again)'}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ============================================================
     JUNIOR VIEW (5-8) - 2-Step Narrative Arc & "Saying NO"
     ============================================================ */
  if (ageBracket === '5-8') {
    const scenario = JUNIOR_STRANGER_SCENARIOS[juniorIndex];
    const currentArcStep = scenario.storyArc.find((s) => s.step === juniorStep) || scenario.storyArc[0];

    const handleSelectJuniorOpt = (opt: any) => {
      setJuniorSelectedOpt(opt);
      const feedback = isEn ? opt.feedbackEnglish : opt.feedbackUrdu;
      speakText(feedback, language);
    };

    const handleNextJuniorStep = () => {
      setJuniorSelectedOpt(null);
      if (juniorStep < scenario.storyArc.length) {
        setJuniorStep((s) => s + 1);
      } else {
        if (juniorIndex + 1 < JUNIOR_STRANGER_SCENARIOS.length) {
          setJuniorIndex((i) => i + 1);
          setJuniorStep(1);
        } else {
          setJuniorDone(true);
          onEarnBadge(isEn ? 'Junior Stranger Safeguard 🛡️' : 'جونئیر سیفگارڈ ہیرو 🛡️');
          speakText(
            isEn
              ? 'Excellent job! You mastered how to respond and say NO to strangers!'
              : 'بہت خوب! آپ اجنبی کو نہیں بولنا اور محفوظ رہنا سیکھ گئے!',
            language
          );
        }
      }
    };

    return (
      <div className="bg-gradient-to-br from-indigo-50 to-sky-50 rounded-3xl p-6 max-w-2xl mx-auto border-2 border-indigo-200 shadow-xl font-sans">
        <div className="flex items-center justify-between border-b border-indigo-100 pb-3 mb-4">
          <div>
            <span className="text-xs font-extrabold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
              {isEn ? 'Junior Role-Play (5-8 Years)' : 'جونئیر حفاظتی رول پلے (۵ تا ۸ سال)'}
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <span>{isEn ? scenario.titleEnglish : scenario.titleUrdu}</span>
            </h2>
          </div>
          <div className="text-xs font-black text-indigo-900 bg-white px-3 py-1.5 rounded-full border border-indigo-200">
            {isEn ? `Step ${juniorStep} / ${scenario.storyArc.length}` : `مرحلہ ${juniorStep} / ${scenario.storyArc.length}`}
          </div>
        </div>

        {!juniorDone ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${scenario.id}-${juniorStep}`}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-5"
            >
              {/* Situation Prompt */}
              <div className="bg-white rounded-3xl p-5 border border-indigo-200 shadow-sm text-center">
                <div className="text-4xl mb-2">🚗🚶‍♂️</div>
                <p className="text-base font-bold text-slate-900 leading-relaxed">
                  {isEn ? currentArcStep.promptEnglish : currentArcStep.promptUrdu}
                </p>
                <button
                  onClick={() =>
                    speakText(isEn ? currentArcStep.promptEnglish : currentArcStep.promptUrdu, language)
                  }
                  className="mt-3 inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 font-bold text-xs px-3 py-1.5 rounded-full"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isEn ? 'Listen Story' : 'کہانی سنیں'}</span>
                </button>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentArcStep.options.map((opt) => {
                  const isSelected = juniorSelectedOpt?.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectJuniorOpt(opt)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow'
                            : 'bg-rose-50 border-rose-300 text-rose-950'
                          : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm sm:text-base leading-snug">
                          {isEn ? opt.textEnglish : opt.textUrdu}
                        </p>
                        {isSelected && (
                          <span>
                            {opt.isCorrect ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                            )}
                          </span>
                        )}
                      </div>

                      {isSelected && (
                        <p
                          className={`mt-2 text-xs font-bold p-2 rounded-xl ${
                            opt.isCorrect ? 'bg-emerald-100 text-emerald-950' : 'bg-rose-100 text-rose-950'
                          }`}
                        >
                          {isEn ? opt.feedbackEnglish : opt.feedbackUrdu}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {juniorSelectedOpt && (
                <button
                  onClick={handleNextJuniorStep}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-2xl shadow transition-transform active:scale-95"
                >
                  {isEn ? 'Continue Story ➡' : 'اگلا مرحلہ (Continue) ➡'}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-8 space-y-4 bg-white rounded-3xl p-6 border-2 border-indigo-300">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              {isEn ? 'Junior Safeguard Hero Badge Unlocked! 🛡️' : 'مبارک ہو! جونئیر سیفگارڈ ہیرو بیج انلاک ہو گیا! 🛡️'}
            </h3>
            <p className="text-sm font-bold text-slate-600">
              {isEn ? 'You learned how to refuse stranger tricks and alert adults!' : 'آپ نے اجنبیوں کی چالوں سے بچنا اور بڑوں کو بتانا سیکھ لیا!'}
            </p>
            <button
              onClick={() => {
                setJuniorIndex(0);
                setJuniorStep(1);
                setJuniorSelectedOpt(null);
                setJuniorDone(false);
              }}
              className="bg-indigo-600 text-white font-black px-6 py-3 rounded-2xl shadow hover:bg-indigo-700"
            >
              {isEn ? 'Practice Again' : 'دوبارہ مشق کریں'}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ============================================================
     EXPLORER VIEW (8-10+) - Original Untouched Code
     ============================================================ */
  const scenario: StrangerScenario = STRANGER_SCENARIOS[currentIndex];

  const handleSelectOption = (opt: any) => {
    setSelectedOptionId(opt.id);
    const feedbackText = isEn ? (opt.feedbackEnglish || opt.textEnglish) : opt.feedbackUrdu;
    speakText(feedbackText, language);
  };

  const handleNext = () => {
    setSelectedOptionId(null);
    if (currentIndex + 1 < STRANGER_SCENARIOS.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCompleted(true);
      onEarnBadge(isEn ? 'Stranger Danger Champion 🚶‍♂️' : 'اجنبی سے ہوشیار 🚶‍♂️');
      speakText(
        isEn
          ? 'Great job! You learned all the important rules about staying safe around strangers!'
          : 'شاباش! آپ اجنبی سے ہوشیار رہنے کے تمام اصول اچھی طرح سیکھ گئے ہو!',
        language
      );
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setCompleted(false);
  };

  const title = isEn ? scenario.titleEnglish : scenario.titleUrdu;
  const situation = isEn ? scenario.situationEnglish : scenario.situationUrdu;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-teal-100 p-6 max-w-2xl mx-auto font-sans">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>{isEn ? 'Stranger Danger Awareness' : 'اجنبی سے ہوشیاری (Stranger Awareness)'}</span>
            <UserCheck className="w-6 h-6 text-sky-600" />
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEn ? 'Learn how to handle unexpected situations safely' : 'Role-play scenarios on how to stay safe around strangers'}
          </p>
        </div>

        <div className="bg-sky-50 text-sky-800 text-xs font-bold px-3 py-1.5 rounded-full border border-sky-200">
          {isEn ? `Scenario ${currentIndex + 1} / ${STRANGER_SCENARIOS.length}` : `منظرنامہ ${currentIndex + 1} / ${STRANGER_SCENARIOS.length}`}
        </div>
      </div>

      {!completed ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Situation Card */}
            <div className="bg-gradient-to-br from-sky-50 to-indigo-50 border-2 border-sky-100 rounded-3xl p-6 text-center shadow-inner">
              <div className="text-5xl mb-3">🚶‍♂️🍫</div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {situation}
              </p>

              <button
                onClick={() => speakText(`${title}. ${situation}`, language)}
                className="mt-4 inline-flex items-center gap-1.5 bg-white text-sky-700 hover:bg-sky-100 px-3 py-1.5 rounded-full text-xs font-bold border border-sky-200 shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isEn ? 'Listen Story' : 'کہانی سنیں'}</span>
              </button>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                {isEn ? 'What should you do?' : 'آپ اس حالت میں کیا کریں گے؟'}
              </label>

              {scenario.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const optText = isEn ? opt.textEnglish : opt.textUrdu;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    id={`opt-stranger-${opt.id}`}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow'
                          : 'bg-rose-50 border-rose-300 text-rose-950'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm sm:text-base leading-snug">
                        {optText}
                      </p>
                      {isSelected && (
                        <div>
                          {opt.isCorrect ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                          )}
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <p
                        className={`mt-2 text-xs font-semibold p-2.5 rounded-xl ${
                          opt.isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {opt.feedbackUrdu}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedOptionId !== null && (
              <button
                onClick={handleNext}
                id="btn-stranger-next"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold py-3.5 rounded-2xl shadow transition-transform active:scale-95"
              >
                {isEn ? 'Next Scenario' : 'اگلا منظرنامہ (Next Scenario)'}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        /* Victory Card */
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 py-6"
        >
          <div className="w-24 h-24 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-12 h-12" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {isEn ? 'Awesome! Stranger Danger Champion Badge Unlocked! 🚶‍♂️' : 'مبارک ہو! "اجنبی سے ہوشیار" بیج آپ کا ہوا! 🚶‍♂️'}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {isEn
                ? 'You learned never to go anywhere or take items from strangers.'
                : 'آپ نے سیکھ لیا کہ اجنبی جتنا بھی میٹھا بولے، ان سے ناچیز چیزیں نہیں لینی اور نہ ساتھ جانا ہے۔'}
            </p>
          </div>

          <button
            onClick={handleReset}
            id="btn-stranger-replay"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-6 py-3 rounded-2xl shadow transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isEn ? 'Practice Again' : 'دوبارہ مشق کریں (Practice Again)'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

