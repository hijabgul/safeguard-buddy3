import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Award, ArrowLeft, Star, Shield, Coins, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakText } from '../../../../utils/speech';
import { playSound } from '../../../../utils/soundEffects';

interface SafeAdventureGameProps {
  onEarnBadge: (badgeName: string) => void;
  language: 'ur' | 'en';
}

export const SafeAdventureGame: React.FC<SafeAdventureGameProps> = ({
  onEarnBadge,
  language,
}) => {
  const isEn = language === 'en';

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [stars, setStars] = useState(0);
  const [coins, setCoins] = useState(0);
  const [completedLocations, setCompletedLocations] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const locations = [
    {
      id: 'home',
      nameEn: 'Home',
      nameUrdu: 'گھر',
      icon: '🏠',
      bgGradient: 'from-amber-400 to-orange-500',
      scenarios: [
        {
          id: 'h1',
          titleEn: 'Doorbell Rings',
          titleUrdu: 'دروازے کی گھنٹی بجی',
          promptEn: 'Someone you do not know knocks on the front door while your parents are busy in another room.',
          promptUrdu: 'جب امی ابو دوسرے کمرے میں مصروف ہیں، دروازے پر ایک نامعلوم شخص دستک دیتا ہے۔',
          icon: '🚪',
          options: [
            {
              id: 'opt1',
              textEn: 'Call your parents immediately and ask who it is through the closed door.',
              textUrdu: 'فوراً امی ابو کو بلائیں اور بند دروازے کے پیچھے سے پوچھیں۔',
              isSafest: true,
              explanationEn: 'Super safe! Always let adults handle the door, and never open it to strangers!',
              explanationUrdu: 'بہت خوب! ہمیشہ امی ابو کو بتائیں اور بند دروازے کے پیچھے رہیں!',
            },
            {
              id: 'opt2',
              textEn: 'Open the door right away to see who it is.',
              textUrdu: 'فوراً دروازہ کھول کر دیکھیں۔',
              isSafest: false,
              explanationEn: 'Opening the door to strangers is risky. A safer choice is calling your parents first!',
              explanationUrdu: 'اجنبی کے لیے دروازہ کھولنا خطرناک ہے۔ پہلے امی ابو کو بلانا زیادہ محفوظ ہے!',
            },
          ],
        },
      ],
    },
    {
      id: 'school',
      nameEn: 'School',
      nameUrdu: 'اسکول',
      icon: '🏫',
      bgGradient: 'from-blue-400 to-indigo-600',
      scenarios: [
        {
          id: 's1',
          titleEn: 'After-School Pickup',
          titleUrdu: 'چھٹی کے وقت گاڑی',
          promptEn: 'A stranger at the school gate says: "Your mom told me to take you home in my car!"',
          promptUrdu: 'اسکول گیٹ پر ایک اجنبی کہتا ہے: "تمہاری امی نے مجھے تمہیں گاڑی میں گھر لے جانے کو کہا ہے!"',
          icon: '🚘',
          options: [
            {
              id: 'opt1',
              textEn: 'Walk straight to your teacher or principal to verify with your parents first.',
              textUrdu: 'فوراً ٹیچر یا پرنسپل کے پاس جائیں اور امی ابو سے تصدیق کرائیں۔',
              isSafest: true,
              explanationEn: 'Brilliant choice! Teachers will call your parents to confirm if it is safe!',
              explanationUrdu: 'شاباش! ٹیچر آپ کے امی ابو کو فون کر کے سچائی معلوم کر لیں گے!',
            },
            {
              id: 'opt2',
              textEn: 'Get into the stranger\'s car immediately.',
              textUrdu: 'فوراً اجنبی کی گاڑی میں بیٹھ جائیں۔',
              isSafest: false,
              explanationEn: 'Never get into a stranger\'s car! Checking with your teacher first keeps you 100% safe.',
              explanationUrdu: 'کبھی بھی اجنبی کی گاڑی میں نہ بیٹھیں۔ پہلے ٹیچر سے پوچھنا سب سے زیادہ محفوظ ہے!',
            },
          ],
        },
      ],
    },
    {
      id: 'playground',
      nameEn: 'Playground',
      nameUrdu: 'کھیل کا میدان',
      icon: '🛝',
      bgGradient: 'from-emerald-400 to-teal-600',
      scenarios: [
        {
          id: 'p1',
          titleEn: 'The Free Candy Offer',
          titleUrdu: 'ٹافی کی لالچ',
          promptEn: 'Someone offers you delicious candy and asks you to walk to their van with them.',
          promptUrdu: 'ایک شخص آپ کو مزیدار ٹافی دکھا کر گاڑی کی طرف چلنے کو کہتا ہے۔',
          icon: '🍬',
          options: [
            {
              id: 'opt1',
              textEn: 'Say "NO!" firmly and run back to your friends and guardians!',
              textUrdu: 'زور سے "نہیں!" کہیں اور دوڑ کر اپنے امی ابو یا گارڈین کے پاس چلے جائیں!',
              isSafest: true,
              explanationEn: 'Awesome! You protected yourself by saying NO and running to safety!',
              explanationUrdu: 'شاباش! آپ نے نہیں بول کر اور دوڑ کر خود کو محفوظ رکھا!',
            },
            {
              id: 'opt2',
              textEn: 'Take the candy and walk with them.',
              textUrdu: 'ٹافی لے لیں اور ان کے ساتھ چلے جائیں۔',
              isSafest: false,
              explanationEn: 'Strangers using treats can be unsafe. Saying NO and running to family is the safest step!',
              explanationUrdu: 'چاکلیٹ کی لالچ میں جانا خطرناک ہے۔ نہیں کہہ کر امی ابو کے پاس دوڑنا سب سے بہترین ہے!',
            },
          ],
        },
      ],
    },
    {
      id: 'park',
      nameEn: 'Park',
      nameUrdu: 'پارک',
      icon: '🌳',
      bgGradient: 'from-lime-400 to-green-600',
      scenarios: [
        {
          id: 'pk1',
          titleEn: 'Separated in the Park',
          titleUrdu: 'پارک میں راستہ بھول جانا',
          promptEn: 'You chased a colorful butterfly and lost sight of your parents in the park.',
          promptUrdu: 'تتلی کے پیچھے بھاگتے ہوئے آپ پارک میں امی ابو کی نظروں سے دور ہو گئے۔',
          icon: '🦋',
          options: [
            {
              id: 'opt1',
              textEn: 'Stay right near a bright bench or look for a uniformed park guard or a mom with kids.',
              textUrdu: 'کسی روشن جگہ پر رہیں اور سیکیورٹی گارڈ یا بچوں والی امی سے مدد مانگیں۔',
              isSafest: true,
              explanationEn: 'So smart! Uniformed guards or parents with kids are the safest people to help you!',
              explanationUrdu: 'بہت عقلمند! گارڈ یا بچوں والی امی آپ کی امی ابو کو تلاش کرنے میں فوراً مدد کریں گی!',
            },
            {
              id: 'opt2',
              textEn: 'Run out to the busy main road alone to search.',
              textUrdu: 'اکیلے ہی مین سڑک کی طرف بھاگنا شروع کر دیں۔',
              isSafest: false,
              explanationEn: 'Running into busy traffic is dangerous. Staying in the park and asking a guard is much safer!',
              explanationUrdu: 'سڑک پر بھاگنا خطرناک ہے۔ پارک کے اندر گارڈ یا ہیلپر کو ڈھونڈنا زیادہ محفوظ ہے!',
            },
          ],
        },
      ],
    },
    {
      id: 'mall',
      nameEn: 'Shopping Mall',
      nameUrdu: 'شاپنگ مال',
      icon: '🛍️',
      bgGradient: 'from-fuchsia-400 to-purple-600',
      scenarios: [
        {
          id: 'm1',
          titleEn: 'Secret Outside Trip',
          titleUrdu: 'مال سے باہر جانے کا خفیہ چیلنج',
          promptEn: 'Someone asks you to step outside the mall with them and promises to keep it a "fun secret".',
          promptUrdu: 'ایک شخص آپ کو مال سے باہر چلنے کا کہتا ہے اور اسے "مزیدار راز" رکھنے کا کہتا ہے۔',
          icon: '🕵️',
          options: [
            {
              id: 'opt1',
              textEn: 'Never leave the mall with anyone without parents\' permission, and tell your parents immediately!',
              textUrdu: 'امی ابو کی اجازت کے بغیر مال سے باہر کبھی نہ جائیں اور امی ابو کو سچ بتائیں۔',
              isSafest: true,
              explanationEn: 'Heroic answer! Secrets that ask you to go somewhere are UNSAFE secrets!',
              explanationUrdu: 'شاندار! جو راز باہر لے جانے کا کہے وہ غیر محفوظ ہوتا ہے!',
            },
            {
              id: 'opt2',
              textEn: 'Keep the secret and go outside for a few minutes.',
              textUrdu: 'راز رکھیں اور چند منٹ کے لیے باہر چلے جائیں۔',
              isSafest: false,
              explanationEn: 'Going outside alone with strangers is dangerous. Always ask your parents first!',
              explanationUrdu: 'امی ابو کے بغیر باہر جانا خطرناک ہے۔ امی ابو کی اجازت کے بغیر کبھی نہ جائیں!',
            },
          ],
        },
      ],
    },
  ];

  const currentLocation = locations.find((l) => l.id === selectedLocationId);
  const currentScenario = currentLocation?.scenarios[currentScenarioIndex];

  const handleSelectOption = (opt: typeof currentScenario.options[0]) => {
    setSelectedOptionId(opt.id);
    const text = isEn ? opt.explanationEn : opt.explanationUrdu;
    speakText(text, language);

    if (opt.isSafest) {
      playSound.playCelebration();
      setStars((s) => s + 2);
      setCoins((c) => c + 10);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      playSound.playCorrect();
      setStars((s) => s + 1);
    }
  };

  const handleNextScenario = () => {
    setSelectedOptionId(null);
    if (!currentLocation) return;

    if (currentScenarioIndex + 1 < currentLocation.scenarios.length) {
      setCurrentScenarioIndex((i) => i + 1);
    } else {
      // Completed Location
      if (!completedLocations.includes(currentLocation.id)) {
        setCompletedLocations((prev) => [...prev, currentLocation.id]);
      }
      setSelectedLocationId(null);
      setCurrentScenarioIndex(0);

      if (completedLocations.length + 1 >= locations.length) {
        setShowCelebration(true);
        onEarnBadge(isEn ? 'Safe Adventure Champion 🛡️' : 'سیف ایڈونچر چیمپئن 🛡️');
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        } catch (e) {}
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-5 sm:p-7 max-w-3xl mx-auto border-4 border-purple-200 shadow-2xl font-sans space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 rounded-3xl p-6 text-white shadow-xl border-4 border-purple-200 flex items-center justify-between gap-4">
        <div className="space-y-1 text-right flex-1">
          <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-black border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isEn ? 'Game 1 — Safe Adventure' : 'گیم ۱ — سیف ایڈونچر'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isEn ? '🧭 Safe Adventure Explorer' : '🧭 سیف ایڈونچر ایکسپلورر'}
          </h2>
          <p className="text-purple-100 font-bold text-xs leading-relaxed">
            {isEn
              ? 'Explore 5 places, find the safest actions, and collect Safety Stars & Coins!'
              : '۵ مقامات پر جائیں، سب سے محفوظ راستہ چنیں، اور ستارے اور سکے حاصل کریں!'}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-full font-black text-xs shadow border border-amber-200 flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>{stars} Stars</span>
          </div>
          <div className="bg-yellow-300 text-slate-950 px-3.5 py-1.5 rounded-full font-black text-xs shadow border border-yellow-200 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-slate-950" />
            <span>{coins} Coins</span>
          </div>
        </div>
      </div>

      {/* Main Content View */}
      {!selectedLocationId ? (
        /* Location Selector Grid */
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-purple-950">
              {isEn ? 'Choose a Location to Explore:' : 'تلاش کے لیے مقام منتخب کریں:'}
            </h3>
            <p className="text-xs font-bold text-slate-600">
              {isEn
                ? 'Tap any place to start solving interactive safety scenarios!'
                : 'کھیل شروع کرنے کے لیے کسی بھی جگہ پر ٹیپ کریں!'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {locations.map((loc) => {
              const isDone = completedLocations.includes(loc.id);
              return (
                <motion.button
                  key={loc.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelectedLocationId(loc.id);
                    setCurrentScenarioIndex(0);
                    setSelectedOptionId(null);
                    playSound.playPop();
                  }}
                  className={`p-5 rounded-3xl bg-gradient-to-br ${loc.bgGradient} text-white shadow-xl border-4 border-white/40 flex flex-col items-center justify-between gap-3 relative overflow-hidden text-center min-h-[140px]`}
                >
                  {isDone && (
                    <span className="absolute top-3 left-3 bg-white text-emerald-700 p-1.5 rounded-full shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                  <span className="text-5xl drop-shadow">{loc.icon}</span>
                  <div className="space-y-0.5">
                    <h4 className="text-base font-black drop-shadow-sm">
                      {isEn ? loc.nameEn : loc.nameUrdu}
                    </h4>
                    <span className="text-[11px] font-bold text-white/90 bg-black/20 px-2.5 py-0.5 rounded-full border border-white/20">
                      {isDone
                        ? isEn ? 'Completed ⭐' : 'مکمل ⭐'
                        : isEn ? 'Explore Now ➡' : 'شروع کریں ➡'}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {completedLocations.length > 0 && (
            <div className="bg-emerald-100 border-2 border-emerald-400 p-4 rounded-2xl text-center space-y-1">
              <p className="text-xs font-black text-emerald-950">
                🎉 {isEn ? `Locations Completed: ${completedLocations.length} / ${locations.length}` : `مکمل شدہ مقامات: ${completedLocations.length} / ${locations.length}`}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Scenario Gameplay View */
        <div className="space-y-5">
          <button
            onClick={() => setSelectedLocationId(null)}
            className="inline-flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-black px-4 py-2 rounded-2xl text-xs shadow transition-transform active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Choose another location' : 'دیگر مقامات پر واپس جائیں'}</span>
          </button>

          {currentScenario && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScenario.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-lg space-y-5"
              >
                {/* Scenario Title & Prompt */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 mx-auto flex items-center justify-center text-3xl border-2 border-purple-300 shadow">
                    {currentScenario.icon}
                  </div>
                  <h3 className="text-lg font-black text-purple-950">
                    {isEn ? currentScenario.titleEn : currentScenario.titleUrdu}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed bg-purple-50 p-4 rounded-2xl border border-purple-100">
                    {isEn ? currentScenario.promptEn : currentScenario.promptUrdu}
                  </p>
                  <button
                    onClick={() => speakText(isEn ? currentScenario.promptEn : currentScenario.promptUrdu, language)}
                    className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-900 font-bold text-xs px-3 py-1 rounded-full hover:bg-purple-200"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Listen Scenario' : 'منظرنامہ سنیں'}</span>
                  </button>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {currentScenario.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    return (
                      <motion.button
                        key={opt.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full p-4 rounded-2xl border-4 text-right font-bold text-xs sm:text-sm transition-all shadow-sm ${
                          isSelected
                            ? opt.isSafest
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-md'
                              : 'bg-amber-50 border-amber-400 text-amber-950 shadow-md'
                            : 'bg-slate-50 border-purple-200 hover:border-purple-400 text-slate-900'
                        }`}
                      >
                        <p className="leading-snug">{isEn ? opt.textEn : opt.textUrdu}</p>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Feedback Box */}
                {selectedOptionId && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-3"
                  >
                    {(() => {
                      const opt = currentScenario.options.find((o) => o.id === selectedOptionId);
                      if (!opt) return null;
                      return (
                        <div
                          className={`p-4 rounded-2xl border-2 text-center font-black text-xs sm:text-sm space-y-2 ${
                            opt.isSafest
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                              : 'bg-amber-100 border-amber-400 text-amber-950'
                          }`}
                        >
                          <p>{isEn ? opt.explanationEn : opt.explanationUrdu}</p>
                          <button
                            onClick={handleNextScenario}
                            className="bg-purple-700 hover:bg-purple-800 text-white font-black px-6 py-2.5 rounded-xl text-xs shadow active:scale-95 transition-transform"
                          >
                            {isEn ? 'Continue Adventure ➡' : 'ایڈونچر جاری رکھیں ➡'}
                          </button>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}

      {/* Completion Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full text-center space-y-4 border-4 border-amber-300 shadow-2xl"
          >
            <div className="text-6xl animate-bounce">🏆</div>
            <h3 className="text-2xl font-black text-purple-950">
              {isEn ? 'Safe Adventure Champion!' : 'سیف ایڈونچر چیمپئن!'}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
              {isEn
                ? 'You explored all locations and learned how to stay 100% safe everywhere!'
                : 'آپ نے تمام ۵ مقامات کا تجربہ کیا اور ہر جگہ محفوظ رہنے کا طریقہ سیکھ لیا!'}
            </p>
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex justify-around font-black text-xs">
              <span>⭐ {stars} Stars</span>
              <span>🪙 {coins} Coins</span>
              <span>🛡️ Champion Badge</span>
            </div>
            <button
              onClick={() => setShowCelebration(false)}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-black py-3 rounded-2xl shadow transition-transform active:scale-95"
            >
              {isEn ? 'Awesome! Play More Games' : 'بہترین! مزید گیمز کھیلیں'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
