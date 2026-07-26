import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChildProfile } from '../../../types';
import { speakText, stopSpeech } from '../../../utils/speech';
import { playSound } from '../../../utils/soundEffects';
import { triggerConfetti } from '../../../utils/confetti';
import {
  Shield,
  Star,
  ArrowLeft,
  RotateCcw,
  Zap,
  Heart,
  ChevronRight
} from 'lucide-react';

interface DoodleDefenderProps {
  profile: ChildProfile;
  onEarnBadge: (badgeName: string) => void;
  onBackToHub: () => void;
}

interface FloatingSpaceObject {
  id: number;
  x: number;
  y: number;
  type: 'candy_trap' | 'shield_item' | 'secret_bubble' | 'stranger_ufo' | 'star_gem';
  emoji: string;
  labelUrdu: string;
  labelEng: string;
  speed: number;
}

export const DoodleDefender: React.FC<DoodleDefenderProps> = ({
  profile,
  onEarnBadge,
  onBackToHub
}) => {
  const isEn = profile.language === 'en';
  const lang = profile.language || 'ur';

  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [doodleX, setDoodleX] = useState(50);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [objects, setObjects] = useState<FloatingSpaceObject[]>([]);
  const [destroyedCount, setDestroyedCount] = useState(0);
  const [isLevelCleared, setIsLevelCleared] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  const levelInfo = {
    1: {
      titleUrdu: 'مشن 1: کینڈی کے جال سے بچاؤ (Candy Nebulae)',
      titleEng: 'Mission 1: Candy Trap Nebulae',
      descUrdu: 'اجنبی کی دی ہوئی لالچی کینڈی کو لیزر ⚡ سے تباہ کریں اور شیلڈ 🛡️ جمع کریں!',
      descEng: 'Blast stranger candy traps with laser ⚡ and collect shields 🛡️!',
      targetCount: 5,
      bg: 'from-slate-950 via-purple-950 to-indigo-950',
      badgeUrdu: 'کینڈی محافظ 🍬',
      badgeEng: 'Candy Defender 🍬'
    },
    2: {
      titleUrdu: 'مشن 2: ڈراؤنے رازوں سے بچاؤ (Secret Trap Orbit)',
      titleEng: 'Mission 2: Secret Trap Orbit',
      descUrdu: 'ڈراؤنے راز کے غباروں کو دیکھ کر "امی ابو کو بتاؤ" 🗣️ بٹن دبا کر پاپ کریں!',
      descEng: 'Pop bad secret bubbles by tapping "Tell Parents" 🗣️!',
      targetCount: 6,
      bg: 'from-slate-950 via-blue-950 to-cyan-950',
      badgeUrdu: 'رازوں کا محافظ 🤫',
      badgeEng: 'Secret Defender 🤫'
    },
    3: {
      titleUrdu: 'مشن 3: اجنبی کی خلائی گاڑی سے بچاؤ (Stranger UFO Zone)',
      titleEng: 'Mission 3: Stranger UFO Zone',
      descUrdu: 'ناواقف اجنبی کی گاڑیاں آ رہی ہیں! "نہیں!" بولیں اور سپر شیلڈ آن کریں!',
      descEng: 'Stranger UFOs approaching! Say "NO!" and activate Super Shield!',
      targetCount: 8,
      bg: 'from-slate-950 via-rose-950 to-indigo-950',
      badgeUrdu: 'خلائی محافظ 🚀',
      badgeEng: 'Space Defender 🚀'
    }
  }[level];

  // Voice narration when level changes
  useEffect(() => {
    const titleText = isEn ? levelInfo.titleEng : levelInfo.titleUrdu;
    const descText = isEn ? levelInfo.descEng : levelInfo.descUrdu;
    const lvlSpeech = isEn ? `Level ${level}: ${titleText}. ${descText}` : `[warm] ${titleText}۔ ${descText}`;
    speakText(lvlSpeech, lang);
    return () => stopSpeech();
  }, [level, isEn, lang]);

  // Main game loop spawning space objects
  useEffect(() => {
    if (isLevelCleared || isGameOver || isGameWon) return;

    const interval = setInterval(() => {
      setObjects((prev) => {
        const updated = prev
          .map((obj) => ({ ...obj, y: obj.y + obj.speed }))
          .filter((obj) => obj.y < 90);

        if (updated.length < 5 && Math.random() > 0.3) {
          const id = Date.now() + Math.random();
          const newX = Math.floor(Math.random() * 75) + 12;

          let type: FloatingSpaceObject['type'] = 'candy_trap';
          let emoji = '🍬';
          let labelUrdu = 'اجنبی کینڈی';
          let labelEng = 'Stranger Candy';

          if (level === 1) {
            if (Math.random() > 0.4) {
              type = 'candy_trap';
              emoji = Math.random() > 0.5 ? '🍬' : '🍫';
              labelUrdu = 'اجنبی کینڈی';
              labelEng = 'Stranger Candy';
            } else {
              type = 'shield_item';
              emoji = '🛡️';
              labelUrdu = 'حفاظتی شیلڈ';
              labelEng = 'Safety Shield';
            }
          } else if (level === 2) {
            if (Math.random() > 0.4) {
              type = 'secret_bubble';
              emoji = '🤫';
              labelUrdu = 'خفیہ راز';
              labelEng = 'Scary Secret';
            } else {
              type = 'star_gem';
              emoji = '💎';
              labelUrdu = 'سچائی کا ہیرا';
              labelEng = 'Truth Gem';
            }
          } else {
            if (Math.random() > 0.35) {
              type = 'stranger_ufo';
              emoji = '🛸';
              labelUrdu = 'اجنبی گاڑی';
              labelEng = 'Stranger UFO';
            } else {
              type = 'shield_item';
              emoji = '🛡️';
              labelUrdu = 'سپر شیلڈ';
              labelEng = 'Super Shield';
            }
          }

          updated.push({
            id,
            x: newX,
            y: 5,
            type,
            emoji,
            labelUrdu,
            labelEng,
            speed: Math.random() * 1.5 + 1.2
          });
        }

        return updated;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [level, isLevelCleared, isGameOver, isGameWon]);

  // Collision detection check with Doodle
  useEffect(() => {
    if (isLevelCleared || isGameOver || isGameWon) return;

    objects.forEach((obj) => {
      if (obj.y >= 65 && obj.y <= 82 && Math.abs(obj.x - doodleX) < 14) {
        if (obj.type === 'candy_trap' || obj.type === 'stranger_ufo' || obj.type === 'secret_bubble') {
          if (isShieldActive) {
            playSound.playShieldPowerup();
            popObject(obj.id, true);
          } else {
            playSound.playGentleBump();
            setHealth((h) => {
              const next = h - 1;
              if (next <= 0) {
                setIsGameOver(true);
                speakText(
                  isEn
                    ? 'Doodle took damage! Try again!'
                    : '[gentle] اوہو! ڈوڈل کو نقصان پہنچا۔ دوبارہ کوشش کریں!',
                  lang
                );
              }
              return Math.max(0, next);
            });
            popObject(obj.id, false);
          }
        } else if (obj.type === 'shield_item') {
          playSound.playShieldPowerup();
          activateShield();
          setScore((s) => s + 20);
          popObject(obj.id, true);
        } else if (obj.type === 'star_gem') {
          playSound.playStarCollect();
          setScore((s) => s + 15);
          popObject(obj.id, true);
        }
      }
    });
  }, [objects, doodleX, isShieldActive, isLevelCleared, isGameOver, isGameWon, isEn, lang]);

  const popObject = (id: number, isGoodAction: boolean) => {
    setObjects((prev) => prev.filter((o) => o.id !== id));
    if (isGoodAction) {
      setDestroyedCount((c) => {
        const next = c + 1;
        if (next >= levelInfo.targetCount) {
          handleLevelComplete();
        }
        return next;
      });
    }
  };

  const handleLevelComplete = () => {
    playSound.playWinFanfare();
    triggerConfetti();
    setIsLevelCleared(true);

    const titleText = isEn ? levelInfo.titleEng : levelInfo.titleUrdu;

    if (level < 3) {
      speakText(
        isEn
          ? `Bravo! You completed ${titleText}!`
          : `[excited] شاباش! تم نے ${titleText} کامیابی سے مکمل کر لیا!`,
        lang
      );
    } else {
      setIsGameWon(true);
      const badgeName = isEn ? 'Space Defender Doodle 🚀' : 'خلائی محافظ ڈوڈل 🚀';
      onEarnBadge(badgeName);
      speakText(
        isEn
          ? 'Awesome! You completed all 3 space missions! You are a true Space Guardian!'
          : '[excited] زبردست! تم نے تمام 3 خلائی مشن مکمل کر لیے! تم اصلی خلائی محافظ ہو!',
        lang
      );
    }
  };

  const handleNextLevel = () => {
    if (level < 3) {
      setLevel((prev) => (prev + 1) as any);
      setDestroyedCount(0);
      setIsLevelCleared(false);
      setObjects([]);
    }
  };

  const activateShield = () => {
    playSound.playShieldPowerup();
    setIsShieldActive(true);
    setTimeout(() => setIsShieldActive(false), 4000);
  };

  const handleLaserBlast = () => {
    playSound.playCombo();
    const closestBad = objects.find(
      (o) => o.type === 'candy_trap' || o.type === 'stranger_ufo' || o.type === 'secret_bubble'
    );
    if (closestBad) {
      popObject(closestBad.id, true);
      setScore((s) => s + 10);
    }
  };

  const handleTellAdultBurst = () => {
    playSound.playWinFanfare();
    setObjects((prev) => {
      const remaining = prev.filter(
        (o) => o.type !== 'candy_trap' && o.type !== 'stranger_ufo' && o.type !== 'secret_bubble'
      );
      const poppedBadCount = prev.length - remaining.length;
      if (poppedBadCount > 0) {
        setDestroyedCount((c) => {
          const next = c + poppedBadCount;
          if (next >= levelInfo.targetCount) {
            handleLevelComplete();
          }
          return next;
        });
        setScore((s) => s + poppedBadCount * 15);
      }
      return remaining;
    });
  };

  const restartGame = () => {
    setLevel(1);
    setScore(0);
    setHealth(3);
    setDoodleX(50);
    setDestroyedCount(0);
    setIsLevelCleared(false);
    setIsGameOver(false);
    setIsGameWon(false);
    setObjects([]);
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-white font-sans pb-16 ${isEn ? 'dir-ltr' : 'dir-rtl'}`}>
      {/* Top Bar Navigation */}
      <div className="bg-slate-900 border-b-4 border-cyan-400 p-4 sticky top-0 z-20 flex items-center justify-between shadow-lg">
        <button
          onClick={onBackToHub}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black px-4 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-transform active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{isEn ? 'Games Hub' : 'گیمز ہب'}</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Hearts */}
          <div className="flex items-center gap-1 bg-rose-500/20 border-2 border-rose-400 px-3 py-1 rounded-full">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-4 h-4 ${h <= health ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
              />
            ))}
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 bg-amber-400/20 border-2 border-amber-400 px-3 py-1 rounded-full text-amber-300 font-black text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{score} {isEn ? 'Pts' : 'پوائنٹس'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-[2.5rem] bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-900 border-4 border-cyan-400 shadow-xl flex justify-between items-center">
          <div className="space-y-1 text-left md:text-left">
            <span className="bg-cyan-300 text-slate-950 font-black text-xs px-3 py-1 rounded-full inline-block">
              {isEn ? `Level ${level} / 3` : `لیول ${level} / 3`}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isEn ? levelInfo.titleEng : levelInfo.titleUrdu}
            </h1>
            <p className="text-cyan-100 font-bold text-xs sm:text-sm">
              {isEn ? levelInfo.descEng : levelInfo.descUrdu}
            </p>
          </div>
          <div className="text-4xl animate-bounce">🚀</div>
        </div>

        {/* Space Action Canvas Stage */}
        <div className={`bg-gradient-to-b ${levelInfo.bg} rounded-[2.5rem] p-6 border-4 border-cyan-400/80 relative overflow-hidden min-h-[380px] shadow-2xl flex flex-col justify-between`}>
          {/* Floating Stars Background */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Progress Indicator */}
          <div className="relative z-10 flex justify-between items-center bg-slate-900/80 border-2 border-cyan-400/60 p-3 rounded-2xl backdrop-blur-md">
            <div className="text-xs font-black text-cyan-300">
              {isEn ? `Target: ${destroyedCount} / ${levelInfo.targetCount}` : `ٹارگٹ: ${destroyedCount} / ${levelInfo.targetCount}`}
            </div>

            <div className="w-36 bg-slate-800 h-3 rounded-full overflow-hidden border border-cyan-400/50">
              <div
                className="bg-cyan-400 h-full transition-all duration-300"
                style={{ width: `${(destroyedCount / levelInfo.targetCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Floating Items Area */}
          <div className="relative z-10 my-4 h-[220px] overflow-hidden">
            <AnimatePresence>
              {objects.map((obj) => (
                <motion.button
                  key={obj.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={() => popObject(obj.id, obj.type === 'shield_item' || obj.type === 'star_gem')}
                  style={{
                    left: `${obj.x}%`,
                    top: `${obj.y}%`
                  }}
                  className="absolute -translate-x-1/2 p-2 bg-slate-900/90 border-2 border-cyan-300 hover:border-amber-400 rounded-2xl shadow-xl flex flex-col items-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
                >
                  <span className="text-2xl sm:text-3xl animate-pulse">{obj.emoji}</span>
                  <span className="text-[10px] font-black text-cyan-200 bg-slate-950 px-1.5 py-0.5 rounded-full border border-cyan-500/40">
                    {isEn ? obj.labelEng : obj.labelUrdu}
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>

            {/* Doodle Player */}
            <div
              style={{ left: `${doodleX}%` }}
              className="absolute bottom-2 -translate-x-1/2 transition-all duration-150 flex flex-col items-center"
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-400 text-slate-950 border-4 border-white flex items-center justify-center text-3xl sm:text-4xl shadow-2xl relative ${
                  isShieldActive ? 'ring-8 ring-emerald-400 bg-emerald-300 animate-pulse' : ''
                }`}
              >
                <span>🐱</span>
                {isShieldActive && (
                  <div className="absolute -top-3 -right-2 bg-emerald-500 p-1.5 rounded-full text-white border-2 border-white">
                    <Shield className="w-5 h-5 fill-white" />
                  </div>
                )}
              </div>
              <span className="text-xs font-black text-white bg-cyan-600/90 border border-cyan-300 px-2 py-0.5 rounded-full mt-1">
                {isEn ? 'Doodle' : 'ڈوڈل'}
              </span>
            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/90 p-3 rounded-2xl border-2 border-cyan-400/60 backdrop-blur-md">
            {/* Move Left */}
            <button
              onClick={() => setDoodleX((prev) => Math.max(15, prev - 15))}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 rounded-xl border-2 border-white shadow-md active:translate-y-0.5 flex items-center justify-center gap-1 text-sm"
            >
              ◀ {isEn ? 'Move Left' : 'بائیں چلو'}
            </button>

            {/* Move Right */}
            <button
              onClick={() => setDoodleX((prev) => Math.min(85, prev + 15))}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 rounded-xl border-2 border-white shadow-md active:translate-y-0.5 flex items-center justify-center gap-1 text-sm"
            >
              {isEn ? 'Move Right' : 'دائیں چلو'} ▶
            </button>

            {/* Laser Fire */}
            <button
              onClick={handleLaserBlast}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 rounded-xl border-2 border-white shadow-md active:translate-y-0.5 flex items-center justify-center gap-1 text-sm"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{isEn ? 'Laser Fire ⚡' : 'لیزر فائر ⚡'}</span>
            </button>

            {/* Tell Adult / Shield Action */}
            <button
              onClick={handleTellAdultBurst}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl border-2 border-white shadow-md active:translate-y-0.5 flex items-center justify-center gap-1 text-sm col-span-2 sm:col-span-1"
            >
              <Shield className="w-4 h-4 fill-slate-950" />
              <span>{isEn ? 'Tell Parents 🗣️' : 'امی ابو کو بتاؤ 🗣️'}</span>
            </button>
          </div>
        </div>

        {/* Level Complete Modal */}
        {isLevelCleared && !isGameWon && (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border-4 border-amber-400 text-center space-y-6 max-w-md mx-auto shadow-2xl">
            <div className="text-6xl animate-bounce">🎉</div>
            <h2 className="text-2xl font-black text-amber-300">
              {isEn ? 'Mission Complete!' : 'مشن مکمل ہو گیا!'}
            </h2>
            <p className="text-sm font-bold text-slate-300 leading-relaxed">
              {isEn
                ? `Bravo! Doodle cleared ${levelInfo.titleEng}!`
                : `شاباش! ڈوڈل نے کامیابی سے ${levelInfo.titleUrdu} کلیئر کر لیا!`}
            </p>

            <button
              onClick={handleNextLevel}
              className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-lg px-8 py-4 rounded-3xl border-4 border-white shadow-md w-full flex items-center justify-center gap-2"
            >
              <span>{isEn ? 'Start Next Mission' : 'اگلا مشن شروع کریں'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Game Won Modal */}
        {isGameWon && (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border-4 border-amber-400 text-center space-y-6 max-w-md mx-auto shadow-2xl">
            <div className="text-6xl animate-bounce">🏆</div>
            <h2 className="text-3xl font-black text-amber-300">
              {isEn ? 'Space Defender Champion!' : 'الٹیمیٹ خلائی ہیرو!'}
            </h2>
            <p className="text-sm font-bold text-slate-200 leading-relaxed">
              {isEn
                ? 'You saved Doodle from all candy traps and stranger UFOs! You are a true Space Guardian!'
                : 'تم نے ڈوڈل کو تمام کینڈی ٹریپس اور اجنبی گاڑیوں سے بچا لیا! تم سچے خلائی محافظ ہو!'}
            </p>

            <button
              onClick={restartGame}
              className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-lg px-8 py-4 rounded-3xl border-4 border-white shadow-md w-full flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{isEn ? 'Play Again' : 'دوبارہ کھیلیں'}</span>
            </button>
          </div>
        )}

        {/* Game Over Modal */}
        {isGameOver && (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border-4 border-rose-500 text-center space-y-6 max-w-md mx-auto shadow-2xl">
            <div className="text-6xl animate-pulse">💔</div>
            <h2 className="text-2xl font-black text-rose-400">
              {isEn ? 'Mission Failed!' : 'کوئی بات نہیں!'}
            </h2>
            <p className="text-sm font-bold text-slate-300 leading-relaxed">
              {isEn
                ? 'Doodle took damage, but we can try again!'
                : 'ڈوڈل کو نقصان پہنچا، لیکن ہم دوبارہ کوشش کر سکتے ہیں!'}
            </p>

            <button
              onClick={restartGame}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-lg px-8 py-4 rounded-3xl border-4 border-white shadow-md w-full flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{isEn ? 'Try Again' : 'دوبارہ کوشش کریں'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
