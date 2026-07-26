import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Award, ArrowLeft, Search, Shield, CheckCircle2, Lock, Eye, Key, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakText } from '../../../../utils/speech';
import { playSound } from '../../../../utils/soundEffects';

interface SecretDetectiveGameProps {
  onEarnBadge: (badgeName: string) => void;
  language: 'ur' | 'en';
}

export const SecretDetectiveGame: React.FC<SecretDetectiveGameProps> = ({
  onEarnBadge,
  language,
}) => {
  const isEn = language === 'en';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [detectiveBadges, setDetectiveBadges] = useState(0);
  const [magnifyingGlasses, setMagnifyingGlasses] = useState<string[]>(['🔍 Classic Glass']);
  const [selectedAnswer, setSelectedAnswer] = useState<'safe' | 'unsafe' | null>(null);
  const [completed, setCompleted] = useState(false);

  const secretCards = [
    {
      id: 'sec1',
      icon: '🎂',
      titleEn: 'Surprise Birthday Party',
      titleUrdu: 'امی کا سرپرائز برتھ ڈے گفٹ',
      descEn: 'Planning a secret surprise birthday cake and gift for Mom with Dad.',
      descUrdu: 'ابو کے ساتھ مل کر امی کے لیے سرپرائز برتھ ڈے کیک کی تیاری۔',
      isSafe: true,
      explanationEn: 'Safe Secret! Fun surprises that make family happy and end with joy are SAFE secrets!',
      explanationUrdu: 'محفوظ راز! ایسے راز جو سب کے لیے خوشی لاتے ہیں، بالکل محفوظ راز ہوتے ہیں!',
    },
    {
      id: 'sec2',
      icon: '🤫',
      titleEn: 'Scary "Don\'t Tell Parents" Threat',
      titleUrdu: '"امی ابو کو مت بتانا" کی دھمکی',
      descEn: 'Someone tells you: "If you tell your parents, I will be mad and you will be in trouble!"',
      descUrdu: 'ایک شخص کہتا ہے: "اگر تم نے اپنے امی ابو کو بتایا تو میں غصہ کروں گا اور سزا دوں گا!"',
      isSafe: false,
      explanationEn: 'UNSAFE Secret! Anyone telling you to hide secrets from parents is unsafe. Always tell your parents!',
      explanationUrdu: 'غیر محفوظ راز! جو راز آپ کو خوفزدہ کرے اور امی ابو سے چھپانے کو کہے، فوراً امی ابو کو بتائیں!',
    },
    {
      id: 'sec3',
      icon: '🎁',
      titleEn: 'Grandma\'s Surprise Eid Gift',
      titleUrdu: 'دادی جان کا عید کا خفیہ تحفہ',
      descEn: 'Grandma hides a surprise toy in her closet until Eid morning to surprise you.',
      descUrdu: 'دادی جان عید کی صبح تک ایک پیارا سا کھلونا الماری میں چھپا کر رکھتی ہیں۔',
      isSafe: true,
      explanationEn: 'Safe Secret! Temporary surprise gifts that bring smiles are SAFE secrets!',
      explanationUrdu: 'محفوظ راز! عید یا خوشی کے عارضی سرپرائز تحفے محفوظ راز ہوتے ہیں!',
    },
    {
      id: 'sec4',
      icon: '🛑',
      titleEn: 'Private Touch Secret',
      titleUrdu: 'نجی حصے کے ساتھ چھیڑ چھاڑ کا راز',
      descEn: 'Someone touches your private swimsuit area and tells you: "Keep this our secret!"',
      descUrdu: 'ایک شخص آپ کے نجی سوئم سوٹ حصے کو چھوتا ہے اور کہتا ہے: "یہ راز رکھنا!"',
      isSafe: false,
      explanationEn: 'DANGER! UNSAFE SECRET! Never keep touches to private body parts a secret! Tell parents right away!',
      explanationUrdu: 'خطرہ! غیر محفوظ راز! جسمانی نجی حصوں سے جڑا کوئی راز کبھی نہ چھپائیں! فوراً امی ابو کو بتائیں!',
    },
    {
      id: 'sec5',
      icon: '🏺',
      titleEn: 'Accidental Broken Vase',
      titleUrdu: 'ٹوٹا ہوا گلدستہ چھپانا',
      descEn: 'A friend breaks a flower vase by mistake and asks you to hide the broken pieces without telling adults.',
      descUrdu: 'دوست سے غلطی سے گلدستہ ٹوٹ جاتا ہے اور وہ آپ کو کہتا ہے کہ امی ابو سے چھپا کر ٹکڑے پھینک دیں۔',
      isSafe: false,
      explanationEn: 'Unsafe to hide! Accidents happen, but hiding broken things can hurt someone. Always tell adults politely!',
      explanationUrdu: 'چھپانا غیر محفوظ ہے! غلطی ہو جائے تو بتانا ضروری ہے تاکہ کسی کو چوٹ نہ لگے!',
    },
    {
      id: 'sec6',
      icon: '🎨',
      titleEn: 'Secret Teacher\'s Day Card',
      titleUrdu: 'ٹیچر ڈے کا سرپرائز کارڈ',
      descEn: 'Drawing a secret thank-you card for your teacher to surprise her tomorrow.',
      descUrdu: 'اپنی ٹیچر کو سرپرائز دینے کے لیے ایک پیارا سا شکریہ کارڈ بنانا۔',
      isSafe: true,
      explanationEn: 'Safe Secret! Making loving cards for teachers or family is a super safe surprise!',
      explanationUrdu: 'محفوظ راز! محبت بھرے کارڈز بنانا ایک محفوظ اور خوبصورت سرپرائز ہے!',
    },
  ];

  const currentCard = secretCards[currentIndex];

  const handleSelectAnswer = (ans: 'safe' | 'unsafe') => {
    setSelectedAnswer(ans);
    const isCorrect = (ans === 'safe' && currentCard.isSafe) || (ans === 'unsafe' && !currentCard.isSafe);

    const msg = isEn ? currentCard.explanationEn : currentCard.explanationUrdu;
    speakText(msg, language);

    if (isCorrect) {
      playSound.playCelebration();
      setStars((s) => s + 2);
    } else {
      playSound.playCorrect();
    }
  };

  const handleNextCard = () => {
    setSelectedAnswer(null);
    if (currentIndex + 1 < secretCards.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCompleted(true);
      setDetectiveBadges((b) => b + 1);
      if (!magnifyingGlasses.includes('🔍 Golden Detective Lens')) {
        setMagnifyingGlasses((prev) => [...prev, '🔍 Golden Detective Lens']);
      }
      onEarnBadge(isEn ? 'Inspector Hoot Detective Badge 🕵️' : 'انسپکٹر ہوٹ ڈٹیکٹو بیج 🕵️');
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  return (
    <div className="bg-gradient-to-br from-fuchsia-50 via-purple-50 to-indigo-50 rounded-3xl p-5 sm:p-7 max-w-3xl mx-auto border-4 border-fuchsia-200 shadow-2xl font-sans space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-fuchsia-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl border-4 border-fuchsia-300 flex items-center justify-between gap-4">
        <div className="space-y-1 text-right flex-1">
          <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-black border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isEn ? 'Game 4 — Secret Detective' : 'گیم ۴ — راز کا جاسوس'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            🦉 {isEn ? 'Inspector Hoot\'s Secret Detective' : 'انسپکٹر ہوٹ: راز کا جاسوس'}
          </h2>
          <p className="text-fuchsia-100 font-bold text-xs leading-relaxed">
            {isEn
              ? 'Learn the difference between Safe Secrets and Unsafe Secrets with Detective Hoot!'
              : 'انسپکٹر ہوٹ کے ساتھ محفوظ اور غیر محفوظ رازوں کا فرق پہچانیں!'}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-full font-black text-xs shadow border border-amber-200 flex items-center gap-1">
            <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>{stars} Stars</span>
          </div>
        </div>
      </div>

      {/* Guide Owl Box */}
      <div className="bg-white rounded-3xl p-4 border-2 border-fuchsia-200 shadow-sm flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-fuchsia-100 text-3xl flex items-center justify-center shrink-0 border border-fuchsia-300 shadow">
          🦉
        </div>
        <div className="space-y-0.5 text-right flex-1">
          <h4 className="text-xs font-black text-purple-950">
            {isEn ? 'Detective Owl Says:' : 'جاسوس الّو کا پیغام:'}
          </h4>
          <p className="text-xs font-bold text-slate-700 leading-snug">
            {isEn
              ? '"Safe secrets make people happy and end with surprises! Unsafe secrets make you scared or tell you to hide from parents!"'
              : '"محفوظ راز خوشیاں لاتے ہیں! لیکن غیر محفوظ راز خوفزدہ کرتے ہیں اور امی ابو سے چھپانے کو کہتے ہیں!"'}
          </p>
        </div>
      </div>

      {/* Gameplay Card Sorting View */}
      {!completed && currentCard && (
        <div className="space-y-5">
          <div className="bg-white rounded-3xl p-6 border-2 border-fuchsia-200 shadow-lg space-y-4 text-center">
            <div className="flex items-center justify-between text-xs font-black text-fuchsia-900 border-b border-fuchsia-100 pb-2">
              <span>{isEn ? `Secret Card ${currentIndex + 1} of ${secretCards.length}` : `کارڈ ${currentIndex + 1} از ${secretCards.length}`}</span>
              <span className="bg-fuchsia-100 px-3 py-1 rounded-full">🔍 {isEn ? 'Inspect Secret' : 'راز کا معائنہ'}</span>
            </div>

            <div className="w-20 h-20 rounded-3xl bg-fuchsia-100 text-5xl mx-auto flex items-center justify-center shadow border-2 border-fuchsia-300 animate-pulse">
              {currentCard.icon}
            </div>

            <h3 className="text-lg font-black text-purple-950">
              {isEn ? currentCard.titleEn : currentCard.titleUrdu}
            </h3>

            <p className="text-xs sm:text-sm font-bold text-slate-700 bg-purple-50 p-4 rounded-2xl border border-purple-100 leading-relaxed">
              {isEn ? currentCard.descEn : currentCard.descUrdu}
            </p>

            <button
              onClick={() => speakText(isEn ? currentCard.descEn : currentCard.descUrdu, language)}
              className="inline-flex items-center gap-1.5 bg-fuchsia-100 text-fuchsia-950 font-bold text-xs px-3.5 py-1.5 rounded-full hover:bg-fuchsia-200"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isEn ? 'Listen Secret Card' : 'کارڈ سنیں'}</span>
            </button>

            {/* Choice Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectAnswer('safe')}
                className={`p-4 rounded-2xl border-4 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-all ${
                  selectedAnswer === 'safe'
                    ? currentCard.isSafe
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                      : 'bg-amber-100 border-amber-400 text-amber-950'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-300 hover:from-emerald-600 hover:to-teal-700'
                }`}
              >
                <span>🟢</span>
                <span>{isEn ? 'SAFE SECRET' : 'محفوظ راز 🟢'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectAnswer('unsafe')}
                className={`p-4 rounded-2xl border-4 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-all ${
                  selectedAnswer === 'unsafe'
                    ? !currentCard.isSafe
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                      : 'bg-amber-100 border-amber-400 text-amber-950'
                    : 'bg-gradient-to-r from-rose-500 to-red-600 text-white border-rose-300 hover:from-rose-600 hover:to-red-700'
                }`}
              >
                <span>🔴</span>
                <span>{isEn ? 'UNSAFE SECRET' : 'غیر محفوظ راز 🔴'}</span>
              </motion.button>
            </div>

            {selectedAnswer && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-purple-100 border-2 border-purple-300 p-4 rounded-2xl space-y-3"
              >
                <p className="text-xs font-black text-purple-950">
                  {isEn ? currentCard.explanationEn : currentCard.explanationUrdu}
                </p>
                <button
                  onClick={handleNextCard}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-black px-6 py-2.5 rounded-xl text-xs shadow active:scale-95 transition-transform"
                >
                  {isEn ? 'Next Secret Card ➡' : 'اگلا راز کا کارڈ ➡'}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {completed && (
        <div className="bg-white rounded-3xl p-6 border-4 border-amber-300 text-center space-y-4 shadow-2xl">
          <div className="text-6xl animate-bounce">🦉🕵️</div>
          <h3 className="text-2xl font-black text-purple-950">
            {isEn ? 'Master Secret Detective Badge Earned!' : 'ماسٹر راز کا جاسوس بیج حاصل ہو گیا!'}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
            {isEn
              ? 'You passed all of Inspector Hoot\'s secret tests and unlocked the Golden Detective Magnifying Glass!'
              : 'آپ نے انسپکٹر ہوٹ کے تمام راز کے ٹیسٹ پاس کر لیے اور گولڈن گلاس حاصل کر لیا!'}
          </p>
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex justify-around font-black text-xs">
            <span>⭐ {stars} Stars</span>
            <span>🕵️ Master Detective Badge</span>
            <span>🔍 Golden Lens</span>
          </div>
          <button
            onClick={() => {
              setCompleted(false);
              setCurrentIndex(0);
              setSelectedAnswer(null);
            }}
            className="bg-purple-700 hover:bg-purple-800 text-white font-black px-6 py-3 rounded-2xl shadow active:scale-95 transition-transform text-xs sm:text-sm"
          >
            {isEn ? 'Play Secret Detective Again' : 'دوبارہ سیکرٹ ڈٹیکٹو کھیلیں'}
          </button>
        </div>
      )}
    </div>
  );
};
