import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SECRETS_ITEMS, TODDLER_SECRETS, JUNIOR_SECRETS } from '../../data/safetyData';
import { SecretItem, AgeBracket } from '../../types';
import { Lock, CheckCircle2, AlertTriangle, Volume2, Award, RotateCcw, Star, ShieldCheck } from 'lucide-react';
import { speakText } from '../../utils/speech';
import { playSound } from '../../utils/soundEffects';

interface SecretsGameProps {
  onEarnBadge: (badgeName: string) => void;
  language?: 'ur' | 'en';
  ageBracket?: AgeBracket;
}

export const SecretsGame: React.FC<SecretsGameProps> = ({ onEarnBadge, language = 'ur', ageBracket = '8-10' }) => {
  const isEn = language === 'en';

  // Toddler State
  const [toddlerIdx, setToddlerIdx] = useState(0);
  const [toddlerSel, setToddlerSel] = useState<any | null>(null);
  const [toddlerDone, setToddlerDone] = useState(false);

  // Junior State
  const [juniorIdx, setJuniorIdx] = useState(0);
  const [juniorStep, setJuniorStep] = useState(1);
  const [juniorSel, setJuniorSel] = useState<any | null>(null);
  const [juniorDone, setJuniorDone] = useState(false);

  // Explorer State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  /* ============================================================
     TODDLER VIEW (2-5) - Animal Character Story Single-Tap
     ============================================================ */
  if (ageBracket === '2-5') {
    const scenario = TODDLER_SECRETS[toddlerIdx];

    const handleSelectToddler = (opt: any) => {
      setToddlerSel(opt);
      const text = isEn ? opt.feedbackEnglish : opt.feedbackUrdu;
      speakText(text, language);
      if (opt.isSafe) playSound.playCelebration();
    };

    const handleNextToddler = () => {
      setToddlerSel(null);
      if (toddlerIdx + 1 < TODDLER_SECRETS.length) {
        setToddlerIdx((i) => i + 1);
      } else {
        setToddlerDone(true);
        onEarnBadge(isEn ? 'Little Truth Hero 🤐' : 'ننھا سچائی ہیرو 🤐');
        speakText(
          isEn
            ? 'Yay! You learned that bad secrets must always be shared with Mama and Papa!'
            : 'واہ! آپ نے سیکھ لیا کہ برا راز ہمیشہ امی ابو کو بتاتے ہیں!',
          language
        );
      }
    };

    return (
      <div className="bg-gradient-to-b from-amber-50 to-purple-50 rounded-3xl p-6 max-w-xl mx-auto border-4 border-purple-200 shadow-xl font-sans">
        <div className="text-center mb-4">
          <span className="inline-block bg-purple-200 text-purple-900 text-xs font-black px-4 py-1 rounded-full uppercase mb-2">
            {isEn ? 'Toddler Secret Story (2-5 Years)' : 'بچوں کا رازوں کا سبق (۲ تا ۵ سال)'}
          </span>
          <h2 className="text-2xl font-black text-purple-950 flex items-center justify-center gap-2">
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
              <div className="bg-white rounded-3xl p-5 border-2 border-purple-300 shadow-md text-center space-y-3">
                <div className="text-6xl animate-bounce">{scenario.characterIcon}</div>
                <p className="text-base font-bold text-slate-800 leading-relaxed">
                  {isEn ? scenario.storyEnglish : scenario.storyUrdu}
                </p>
                <button
                  onClick={() => speakText(isEn ? scenario.storyEnglish : scenario.storyUrdu, language)}
                  className="inline-flex items-center gap-2 bg-purple-100 text-purple-900 font-black px-4 py-2 rounded-full text-xs"
                >
                  <Volume2 className="w-4 h-4 text-purple-700" />
                  <span>{isEn ? 'Listen Story' : 'کہانی سنیں'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {scenario.options.map((opt) => {
                  const isSelected = toddlerSel?.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectToddler(opt)}
                      className={`w-full p-4 rounded-2xl border-4 text-left flex items-center gap-4 transition-transform active:scale-95 ${
                        isSelected
                          ? opt.isSafe
                            ? 'bg-purple-100 border-purple-500 text-purple-950 shadow-lg scale-105'
                            : 'bg-slate-100 border-slate-300 text-slate-800'
                          : 'bg-white border-purple-200 hover:border-purple-400 text-slate-900'
                      }`}
                    >
                      <span className="text-4xl shrink-0">{opt.icon}</span>
                      <div className="flex-1">
                        <span className="text-base font-black block leading-snug">
                          {isEn ? opt.textEnglish : opt.textUrdu}
                        </span>
                        {isSelected && (
                          <span className="text-xs font-black text-purple-800 mt-1 block">
                            {isEn ? opt.feedbackEnglish : opt.feedbackUrdu}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {toddlerSel && (
                <button
                  onClick={handleNextToddler}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl shadow-lg text-lg transition-transform active:scale-95"
                >
                  {isEn ? 'Next Story ➡' : 'اگلی کہانی ➡'}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-8 space-y-4 bg-white rounded-3xl p-6 border-2 border-purple-300">
            <div className="text-6xl animate-bounce">🤐🌟🎉</div>
            <h3 className="text-2xl font-black text-purple-950">
              {isEn ? 'Super Little Truth Hero! 🤐' : 'شاباش! ننھا سچائی ہیرو! 🤐'}
            </h3>
            <p className="text-sm font-bold text-slate-700">
              {isEn ? 'You know that bad secrets must never be kept!' : 'آپ نے سیکھ لیا کہ برا راز کبھی نہیں چھپاتے!'}
            </p>
            <button
              onClick={() => {
                setToddlerIdx(0);
                setToddlerSel(null);
                setToddlerDone(false);
              }}
              className="bg-purple-600 text-white font-black px-6 py-3 rounded-2xl shadow hover:bg-purple-700"
            >
              {isEn ? 'Play Again 🔁' : 'دوبارہ کھیلے (Play Again)'}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ============================================================
     JUNIOR VIEW (5-8) - Junior Secrets Detective (2-Step)
     ============================================================ */
  if (ageBracket === '5-8') {
    const scenario = JUNIOR_SECRETS[juniorIdx];
    const arcStep = scenario.storyArc.find((s) => s.step === juniorStep) || scenario.storyArc[0];

    const handleSelectJunior = (opt: any) => {
      setJuniorSel(opt);
      const text = isEn ? opt.feedbackEnglish : opt.feedbackUrdu;
      speakText(text, language);
      if (opt.isCorrect) playSound.playCelebration();
    };

    const handleNextJunior = () => {
      setJuniorSel(null);
      if (juniorStep < scenario.storyArc.length) {
        setJuniorStep((s) => s + 1);
      } else {
        if (juniorIdx + 1 < JUNIOR_SECRETS.length) {
          setJuniorIdx((i) => i + 1);
          setJuniorStep(1);
        } else {
          setJuniorDone(true);
          onEarnBadge(isEn ? 'Junior Secret Detective 🤐' : 'جونئیر سیکرٹ ڈٹیکٹو 🤐');
          speakText(
            isEn
              ? 'Awesome detective work! You can spot good surprises vs bad secrets!'
              : 'زبردست! آپ سرپرائز اور برے راز کا فرق سمجھ گئے!',
            language
          );
        }
      }
    };

    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-6 max-w-2xl mx-auto border-2 border-purple-200 shadow-xl font-sans">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3 mb-4">
          <div>
            <span className="text-xs font-extrabold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              {isEn ? 'Junior Secret Detective (5-8 Years)' : 'جونئیر سیکرٹ ڈٹیکٹو (۵ تا ۸ سال)'}
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <Lock className="w-6 h-6 text-purple-600" />
              <span>{isEn ? scenario.titleEnglish : scenario.titleUrdu}</span>
            </h2>
          </div>
          <div className="text-xs font-black text-purple-900 bg-white px-3 py-1.5 rounded-full border border-purple-200">
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
              <div className="bg-white rounded-3xl p-5 border border-purple-200 shadow-sm text-center">
                <div className="text-4xl mb-2">🎁🔒</div>
                <p className="text-base font-bold text-slate-900 leading-relaxed">
                  {isEn ? arcStep.promptEnglish : arcStep.promptUrdu}
                </p>
                <button
                  onClick={() => speakText(isEn ? arcStep.promptEnglish : arcStep.promptUrdu, language)}
                  className="mt-3 inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 font-bold text-xs px-3 py-1.5 rounded-full"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isEn ? 'Listen Scenario' : 'منظرنامہ سنیں'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {arcStep.options.map((opt) => {
                  const isSelected = juniorSel?.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectJunior(opt)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-purple-50 border-purple-400 text-purple-950 shadow'
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                          : 'bg-white border-slate-200 hover:border-purple-300 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm sm:text-base leading-snug">
                          {isEn ? opt.textEnglish : opt.textUrdu}
                        </p>
                        {isSelected && (
                          <span>
                            {opt.isCorrect ? (
                              <CheckCircle2 className="w-6 h-6 text-purple-600 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-6 h-6 text-slate-400 shrink-0" />
                            )}
                          </span>
                        )}
                      </div>

                      {isSelected && (
                        <p
                          className={`mt-2 text-xs font-bold p-2 rounded-xl ${
                            opt.isCorrect ? 'bg-purple-100 text-purple-950' : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {isEn ? opt.feedbackEnglish : opt.feedbackUrdu}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {juniorSel && (
                <button
                  onClick={handleNextJunior}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-3.5 rounded-2xl shadow transition-transform active:scale-95"
                >
                  {isEn ? 'Continue Story ➡' : 'اگلا مرحلہ (Continue) ➡'}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-8 space-y-4 bg-white rounded-3xl p-6 border-2 border-purple-300">
            <div className="w-20 h-20 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              {isEn ? 'Junior Secret Detective Badge Unlocked! 🤐' : 'مبارک ہو! جونئیر سیکرٹ ڈٹیکٹو بیج حاصل ہوا! 🤐'}
            </h3>
            <p className="text-sm font-bold text-slate-600">
              {isEn ? 'You learned to tell trusted adults about bad secrets right away!' : 'آپ نے برے راز فوراً اپنے بھروسہ مند بالغ کو بتانا سیکھ لیا!'}
            </p>
            <button
              onClick={() => {
                setJuniorIdx(0);
                setJuniorStep(1);
                setJuniorSel(null);
                setJuniorDone(false);
              }}
              className="bg-purple-600 text-white font-black px-6 py-3 rounded-2xl shadow hover:bg-purple-700"
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
  const item: SecretItem = SECRETS_ITEMS[currentIndex];

  const handleChoice = (isGood: boolean) => {
    setSelectedChoice(isGood);
    const isCorrect = isGood === item.isGoodSecret;
    const explanation = isEn ? (item.explanationEnglish || item.explanationUrdu) : item.explanationUrdu;

    if (isCorrect) {
      // Play Celebration Fanfare
      playSound.playCelebration();
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);

      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);

      // Celebratory voice speech
      speakText(
        isEn
          ? `[excited] Fantastic choice! ${explanation}`
          : `[excited] واہ! زبردست فیصلہ! ${explanation}`,
        language
      );
    } else {
      // Play Polite Alarm Warning Tone
      playSound.playPoliteAlarm();
      setStreak(0);

      // Polite Alarm Voice
      speakText(
        isEn
          ? `[gentle] Polite Alert! Remember: ${explanation}`
          : `[gentle] خبردار رہیں پیارے دوست! یاد رکھیں: ${explanation}`,
        language
      );
    }
  };

  const handleNext = () => {
    setSelectedChoice(null);
    if (currentIndex + 1 < SECRETS_ITEMS.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCompleted(true);
      playSound.playWinFanfare();
      onEarnBadge(isEn ? 'Keeper of Secrets 🤐' : 'رازوں کا محافظ 🤐');
      speakText(
        isEn
          ? 'Great job! You learned the difference between good surprises and bad secrets! Never keep a bad secret.'
          : 'شاباش! آپ نے اچھے اور برے رازوں کا فرق سمجھ لیا! برا راز کبھی نہیں چھپانا۔',
        language
      );
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedChoice(null);
    setCompleted(false);
    setScore(0);
    setStreak(0);
  };

  const title = isEn ? item.titleEnglish : item.titleUrdu;
  const description = isEn ? item.descriptionEnglish : item.descriptionUrdu;
  const isCorrectChoice = selectedChoice === item.isGoodSecret;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-teal-100 p-6 max-w-2xl mx-auto font-sans relative overflow-hidden">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>{isEn ? 'Good Secrets vs Bad Secrets' : 'اچھے اور برے راز (Secrets & Surprises)'}</span>
            <Lock className="w-6 h-6 text-purple-600" />
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEn
              ? 'Learn when a secret is safe or when it MUST be shared with a trusted adult'
              : 'Learn when a secret is safe or when it MUST be shared with a trusted adult'}
          </p>
        </div>

        <div className="bg-purple-50 text-purple-800 text-xs font-bold px-3 py-1.5 rounded-full border border-purple-200">
          {isEn ? `Item ${currentIndex + 1} / ${SECRETS_ITEMS.length}` : `آئٹم ${currentIndex + 1} / ${SECRETS_ITEMS.length}`}
        </div>
      </div>

      {!completed ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Scenario Card */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-100 rounded-3xl p-6 text-center shadow-inner">
              <div className="text-5xl mb-3">🤐🤫</div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {description}
              </p>

              <button
                onClick={() => speakText(`${title}. ${description}`, language)}
                className="mt-4 inline-flex items-center gap-1.5 bg-white text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded-full text-xs font-bold border border-purple-200 shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isEn ? 'Listen Story' : 'کہانی سنیں'}</span>
              </button>
            </div>

            {/* Decision Buttons */}
            {selectedChoice === null ? (
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoice(true)}
                  id="btn-secret-good"
                  className="bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 p-5 rounded-2xl font-extrabold text-center shadow-sm flex flex-col items-center gap-2 cursor-pointer"
                >
                  <span className="text-3xl">🎁</span>
                  <span>{isEn ? 'Good Surprise / Safe' : 'اچھا راز / سرپرائز 🎁'}</span>
                  <span className="text-[11px] font-medium text-emerald-800">
                    {isEn ? '(Makes everyone happy!)' : '(ہر ایک کو خوش کرتا ہے)'}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoice(false)}
                  id="btn-secret-bad"
                  className="bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-950 p-5 rounded-2xl font-extrabold text-center shadow-sm flex flex-col items-center gap-2 cursor-pointer"
                >
                  <span className="text-3xl">⚠️</span>
                  <span>{isEn ? 'Bad Secret / Unsafe' : 'برا راز / غیر محفوظ ⚠️'}</span>
                  <span className="text-[11px] font-medium text-rose-800">
                    {isEn ? '(Makes you scared or uneasy)' : '(آپ کو ڈرا یا الجھا دیتا ہے)'}
                  </span>
                </motion.button>
              </div>
            ) : (
              /* Feedback Box */
              <div
                className={`p-5 rounded-2xl border-2 text-center space-y-3 ${
                  isCorrectChoice
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-center gap-2 font-extrabold text-lg">
                  {isCorrectChoice ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      <span>{isEn ? 'Correct Answer!' : 'بالکل درست جواب!'}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-6 h-6 text-rose-600" />
                      <span>{isEn ? 'Not Quite Right' : 'تھوڑا سا غلط!'}</span>
                    </>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                  {isEn ? item.explanationEnglish || item.explanationUrdu : item.explanationUrdu}
                </p>

                <button
                  onClick={handleNext}
                  id="btn-secret-next"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3.5 rounded-2xl shadow transition-transform active:scale-95 mt-2"
                >
                  {isEn ? 'Next Secret' : 'اگلا راز (Next Secret)'}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        /* Victory Screen */
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 py-6"
        >
          <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-12 h-12" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {isEn ? 'Awesome! Keeper of Secrets Badge Unlocked! 🤐' : 'مبارک ہو! "رازوں کا محافظ" بیج حاصل ہوا! 🤐'}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {isEn
                ? 'You know that good secrets are happy surprises, but bad secrets must always be shared!'
                : 'آپ نے سیکھ لیا کہ اچھے راز خوشی لاتے ہیں اور برے راز چھپائے نہیں جاتے!'}
            </p>
          </div>

          <button
            onClick={handleReset}
            id="btn-secrets-replay"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-6 py-3 rounded-2xl shadow transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isEn ? 'Practice Again' : 'دوبارہ مشق کریں'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

