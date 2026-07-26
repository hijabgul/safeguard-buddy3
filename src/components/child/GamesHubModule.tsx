import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChildProfile } from '../../types';
import { SafeguardQuest } from './games/SafeguardQuest';
import { BodyDefender } from './games/BodyDefender';
import { SafeguardRun } from './games/SafeguardRun';
import { MemoryKingdom } from './games/MemoryKingdom';
import { DoodleDefender } from './games/DoodleDefender';
import { SayingNoGame } from './SayingNoGame';
import { SafeAdventureGame } from './games/junior/SafeAdventureGame';
import { BodySafetyHeroGame } from './games/junior/BodySafetyHeroGame';
import { FindSafeAdultGame } from './games/junior/FindSafeAdultGame';
import { SecretDetectiveGame } from './games/junior/SecretDetectiveGame';
import { Play, Sparkles, Volume2, Award, CheckCircle2, ArrowLeft } from 'lucide-react';
import { speakText } from '../../utils/speech';
import { playSound } from '../../utils/soundEffects';

interface GamesHubModuleProps {
  profile: ChildProfile;
  onAwardBadge: (badgeName: string) => void;
}

export const GamesHubModule: React.FC<GamesHubModuleProps> = ({
  profile,
  onAwardBadge,
}) => {
  const isEn = profile.language === 'en';
  const ageBracket = profile.ageBracket || '8-10';

  // Toddler Arcade State (2-5 Years)
  const [toddlerTab, setToddlerTab] = useState<'hub' | 'balloons' | 'body_parts' | 'animals' | 'saying_no'>('hub');
  const [toddlerScore, setToddlerScore] = useState(0);

  // Game 1: Safety Balloon Pop State
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([]);
  const [balloonFeedback, setBalloonFeedback] = useState<{ color: string; textUrdu: string; textEn: string } | null>(null);

  // Game 2: Body Parts & Color Balloons State (7 parts)
  const [bodyPartIndex, setBodyPartIndex] = useState(0);
  const [bodyPartFeedback, setBodyPartFeedback] = useState<{ isCorrect: boolean; textUrdu: string; textEn: string } | null>(null);

  // Game 3: Safe Friends vs Strangers State
  const [animalIndex, setAnimalIndex] = useState(0);
  const [animalFeedback, setAnimalFeedback] = useState<{ isCorrect: boolean; textUrdu: string; textEn: string } | null>(null);

  // Junior Game State
  const [juniorActiveGame, setJuniorActiveGame] = useState<
    'hub' | 'safe_adventure' | 'body_hero' | 'find_adult' | 'secret_detective'
  >('hub');
  const [juniorGameStep, setJuniorGameStep] = useState(0);
  const [juniorArcadeStep, setJuniorArcadeStep] = useState(1);
  const [juniorSel, setJuniorSel] = useState<any | null>(null);

  // Explorer State
  const [activeGameId, setActiveGameId] = useState<
    'hub' | 'quest' | 'body_defender' | 'safeguard_run' | 'memory_kingdom' | 'doodle_defender'
  >('hub');

  /* ============================================================
     TODDLER GAMES ARCADE (2-5 Years) - 3 Interactive Safety Games
     ============================================================ */
  if (ageBracket === '2-5') {
    // Game 1 Data: Balloons
    const balloonsList = [
      { id: 1, color: 'green', labelUrdu: 'اچھا چھونا', labelEn: 'Good Touch', emoji: '🎈', speakUrdu: 'اچھا چھونا!', speakEn: 'Good Touch!' },
      { id: 2, color: 'red', labelUrdu: 'برا چھونا', labelEn: 'Bad Touch', emoji: '🎈', speakUrdu: 'برا چھونا!', speakEn: 'Bad Touch!' },
      { id: 3, color: 'yellow', labelUrdu: 'نہ اچھا، نہ برا', labelEn: 'Not Good Not Bad', emoji: '🎈', speakUrdu: 'نہ بہت اچھا، نہ بہت برا!', speakEn: 'Not very good, not very bad!' },
      { id: 4, color: 'green', labelUrdu: 'اچھا چھونا', labelEn: 'Good Touch', emoji: '🎈', speakUrdu: 'اچھا چھونا!', speakEn: 'Good Touch!' },
      { id: 5, color: 'yellow', labelUrdu: 'نہ اچھا، نہ برا', labelEn: 'Not Good Not Bad', emoji: '🎈', speakUrdu: 'نہ بہت اچھا، نہ بہت برا!', speakEn: 'Not very good, not very bad!' },
      { id: 6, color: 'red', labelUrdu: 'برا چھونا', labelEn: 'Bad Touch', emoji: '🎈', speakUrdu: 'برا چھونا!', speakEn: 'Bad Touch!' },
      { id: 7, color: 'green', labelUrdu: 'اچھا چھونا', labelEn: 'Good Touch', emoji: '🎈', speakUrdu: 'اچھا چھونا!', speakEn: 'Good Touch!' },
      { id: 8, color: 'red', labelUrdu: 'برا چھونا', labelEn: 'Bad Touch', emoji: '🎈', speakUrdu: 'برا چھونا!', speakEn: 'Bad Touch!' },
      { id: 9, color: 'yellow', labelUrdu: 'نہ اچھا، نہ برا', labelEn: 'Not Good Not Bad', emoji: '🎈', speakUrdu: 'نہ بہت اچھا، نہ بہت برا!', speakEn: 'Not very good, not very bad!' },
    ];

    const handlePopBalloon = (b: typeof balloonsList[0]) => {
      if (poppedBalloons.includes(b.id)) return;
      setPoppedBalloons((prev) => [...prev, b.id]);
      setToddlerScore((s) => s + 5);
      playSound.playCelebration();
      const speak = isEn ? b.speakEn : b.speakUrdu;
      speakText(speak, profile.language);
      setBalloonFeedback({ color: b.color, textUrdu: b.speakUrdu, textEn: b.speakEn });
    };

    // Game 2 Data: 7 Body Parts
    const bodyPartsData = [
      {
        id: 'hands',
        icon: '✋',
        partUrdu: 'ہاتھ ملانا یا امی ابو کا ہاتھ پکڑنا',
        partEn: 'Holding or Shaking Hands',
        correctColor: 'green',
        explainUrdu: 'بالکل درست! ہاتھ ملانا یا پکڑنا اچھا چھونا ہے! 🟢',
        explainEn: 'Correct! Holding or shaking hands is a Good Touch! 🟢',
      },
      {
        id: 'hair',
        icon: '💇',
        partUrdu: 'والدین کا سر اور بالوں پر پیار سے ہاتھ رکھنا',
        partEn: 'Parents gently patting hair or head',
        correctColor: 'green',
        explainUrdu: 'بالکل درست! امی ابو کا سر پر پیار دینا اچھا چھونا ہے! 🟢',
        explainEn: 'Correct! Parents patting head is a Good Touch! 🟢',
      },
      {
        id: 'swimsuit',
        icon: '🩲',
        partUrdu: 'سویم سوٹ کا علاقہ (پرائیویٹ حصہ)',
        partEn: 'Swimsuit Zone (Private Area)',
        correctColor: 'red',
        explainUrdu: 'بالکل درست! سویم سوٹ کا علاقہ پرائیویٹ حصہ ہے، یہاں چھونا برا چھونا ہے! 🔴',
        explainEn: 'Correct! Swimsuit area is a private zone! It is a Bad Touch! 🔴',
      },
      {
        id: 'lips',
        icon: '👄',
        partUrdu: 'ہونٹ (Lips Zone)',
        partEn: 'Lips Zone',
        correctColor: 'red',
        explainUrdu: 'بالکل درست! ہونٹوں پر چھونا پرائیویٹ حصہ ہے اور برا چھونا ہے! 🔴',
        explainEn: 'Correct! Lips zone is private and a Bad Touch! 🔴',
      },
      {
        id: 'shoulders',
        icon: '🖐️',
        partUrdu: 'دوست کے ساتھ ہائی فائیو کرنا یا کاندھے پر تھپکی',
        partEn: 'High-five or tapping shoulder with friend',
        correctColor: 'green',
        explainUrdu: 'بالکل درست! دوستوں کے ساتھ ہائی فائیو کرنا اچھا چھونا ہے! 🟢',
        explainEn: 'Correct! Giving a high-five is a Good Touch! 🟢',
      },
      {
        id: 'tickling',
        icon: '⚡',
        partUrdu: 'غیر آرام دہ گدگدی جو اچھی نہ لگے',
        partEn: 'Uncomfortable tickling that makes you feel uneasy',
        correctColor: 'yellow',
        explainUrdu: 'بالکل درست! ایسی گدگدی نہ بہت اچھی ہے نہ بہت بری، فوراً "نہیں" کہیں! 🟡',
        explainEn: 'Correct! Uncomfortable tickling is not very good, not very bad! Say stop! 🟡',
      },
      {
        id: 'chest',
        icon: '🛑',
        partUrdu: 'سینہ (Chest Private Zone)',
        partEn: 'Chest Area (Private Zone)',
        correctColor: 'red',
        explainUrdu: 'بالکل درست! سینہ پرائیویٹ زون ہے، یہاں چھونا برا چھونا ہے! 🔴',
        explainEn: 'Correct! Chest is a private zone! It is a Bad Touch! 🔴',
      },
    ];

    const currentBodyPart = bodyPartsData[bodyPartIndex] || bodyPartsData[0];

    const handleSelectBalloonForBodyPart = (color: 'green' | 'red' | 'yellow') => {
      const isMatch = color === currentBodyPart.correctColor;
      if (isMatch) {
        playSound.playCelebration();
        setToddlerScore((s) => s + 10);
        const textUrdu = currentBodyPart.explainUrdu;
        const textEn = currentBodyPart.explainEn;
        setBodyPartFeedback({ isCorrect: true, textUrdu, textEn });
        speakText(isEn ? textEn : textUrdu, profile.language);
      } else {
        playSound.playClick();
        const textUrdu = 'اوہ نہیں! یہ غلط ہے، دوبارہ کوشش کریں!';
        const textEn = "Oh no! It's wrong, try again!";
        setBodyPartFeedback({ isCorrect: false, textUrdu, textEn });
        speakText(isEn ? textEn : textUrdu, profile.language);
      }
    };

    const handleNextBodyPart = () => {
      setBodyPartFeedback(null);
      if (bodyPartIndex + 1 < bodyPartsData.length) {
        setBodyPartIndex((i) => i + 1);
      } else {
        onAwardBadge(isEn ? 'Body Protection Star ⭐' : 'جسمانی تحفظ کا ستارہ ⭐');
        speakText(
          isEn
            ? 'Superstar! You learned all 7 body parts safety!'
            : 'شاباش! آپ نے جسم کے تمام ۷ حصوں کا تحفظ سیکھ لیا!',
          profile.language
        );
      }
    };

    // Game 3 Data: Safe Friends
    const animalData = [
      {
        id: 'a1',
        titleUrdu: 'خرگوش کی امی کا پیارا پیار 🐰🤗',
        titleEn: 'Mommy Bunny Hug 🐰🤗',
        icon: '🐰',
        isSafe: true,
        textUrdu: 'یہ امی کا پیار ہے - محفوظ اور پیارا!',
        textEn: 'This is Mom hug - safe and loving!',
      },
      {
        id: 'a2',
        titleUrdu: 'اجنبی لومڑی کا ٹافی دکھانا 🦊🍬',
        titleEn: 'Stranger Fox with Candy 🦊🍬',
        icon: '🦊',
        isSafe: false,
        textUrdu: 'اوہ نہیں! اجنبی سے ٹافی کبھی نہیں لینی!',
        textEn: 'Oh no! Never take candy from a stranger!',
      },
      {
        id: 'a3',
        titleUrdu: 'ٹیچر ریچھ کا اسکول میں سبق سکھانا 🐻📚',
        titleEn: 'Teacher Bear at School 🐻📚',
        icon: '🐻',
        isSafe: true,
        textUrdu: 'ٹیچر ہمارے بھروسہ مند دوست ہیں!',
        textEn: 'Teacher is a trusted safe friend!',
      },
      {
        id: 'a4',
        titleUrdu: 'ناواقف شخص کا کار میں بیٹھنے کو کہنا 🐕🚗',
        titleEn: 'Stranger asking to enter car 🐕🚗',
        icon: '🐕',
        isSafe: false,
        textUrdu: 'اوہ نہیں! کسی اجنبی کی کار میں کبھی نہ بیٹھیں!',
        textEn: 'Oh no! Never go inside a stranger car!',
      },
    ];

    const currentAnimal = animalData[animalIndex] || animalData[0];

    const handleSelectAnimal = (choiceSafe: boolean) => {
      const isMatch = choiceSafe === currentAnimal.isSafe;
      if (isMatch) {
        playSound.playCelebration();
        setToddlerScore((s) => s + 10);
        setAnimalFeedback({ isCorrect: true, textUrdu: currentAnimal.textUrdu, textEn: currentAnimal.textEn });
        speakText(isEn ? currentAnimal.textEn : currentAnimal.textUrdu, profile.language);
      } else {
        playSound.playClick();
        const errUrdu = 'اوہ نہیں! یہ غلط ہے!';
        const errEn = "Oh no! It's wrong!";
        setAnimalFeedback({ isCorrect: false, textUrdu: errUrdu, textEn: errEn });
        speakText(isEn ? errEn : errUrdu, profile.language);
      }
    };

    const handleNextAnimal = () => {
      setAnimalFeedback(null);
      if (animalIndex + 1 < animalData.length) {
        setAnimalIndex((i) => i + 1);
      } else {
        onAwardBadge(isEn ? 'Safe Friend Badge 🐰' : 'محفوظ دوست کا بیج 🐰');
      }
    };

    const toddlerArcadeGames = [
      {
        id: 'balloons',
        title: isEn ? 'Safety Balloons (Hifazati Ghubary)' : 'حفاظتی غبارے (Safety Balloons)',
        subtitle: isEn
          ? 'Tap & pop floating balloons to learn Good Touch, Bad Touch, and Caution!'
          : 'غباروں کو پھوڑیں اور اچھا/برا چھونا اور احتیاط کے اصول سیکھیں!',
        icon: '🎈',
        tag: isEn ? 'Balloon Game' : 'غبارے گیم',
        bgColor: 'bg-gradient-to-r from-lime-500 via-amber-400 to-lime-600',
        borderColor: 'border-lime-300',
        badgeColor: 'bg-black/20 text-white border border-white/30',
      },
      {
        id: 'body_parts',
        title: isEn ? 'Body Defender (Jism Ke Hissay)' : 'جسمانی محافظ (Body Defender)',
        subtitle: isEn
          ? 'Fast reaction action game — select the right touch zone balloon!'
          : 'تیز رفتار ایکشن گیم — صحیح زون منتخب کرو!',
        icon: '🛡️',
        tag: isEn ? 'Action Reaction' : 'ایکشن ری ایکشن',
        bgColor: 'bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800',
        borderColor: 'border-teal-300',
        badgeColor: 'bg-black/20 text-white border border-white/30',
      },
      {
        id: 'animals',
        title: isEn ? 'Safe Friends (Mehfooz Dost)' : 'محفوظ دوست (Safe Friends)',
        subtitle: isEn
          ? 'Identify safe trusted friends vs stranger danger challenges!'
          : 'محفوظ دوست اور اجنبی کا فرق سیکھیں اور چیلنج جیتیں!',
        icon: '🐰',
        tag: isEn ? 'Safe Friends' : 'محفوظ دوست',
        bgColor: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-500',
        borderColor: 'border-emerald-300',
        badgeColor: 'bg-black/20 text-white border border-white/30',
      },
      {
        id: 'saying_no',
        title: isEn ? 'Saying NO Practice' : 'نہیں بولیں! (Saying NO Practice)',
        subtitle: isEn
          ? 'Hold the red button down until the line fills up while shouting NO out loud!'
          : 'سرخ لائن مکمل ہونے تک بٹن دبا کر رکھیں اور اونچی آواز میں "نہیں!" بولیں!',
        icon: '📢',
        tag: isEn ? 'Voice Action' : 'صوتی مشق',
        bgColor: 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900',
        borderColor: 'border-purple-300',
        badgeColor: 'bg-black/20 text-white border border-white/30',
      },
    ];

    return (
      <div className="space-y-6 font-sans max-w-4xl mx-auto">
        {toddlerTab === 'hub' ? (
          <div className="space-y-6">
            {/* Hero Welcome Games Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white shadow-xl border-4 border-purple-300 flex items-center justify-between gap-4">
              <div className="space-y-2 text-right flex-1">
                <h2 className="text-xl sm:text-3xl font-black text-white leading-snug drop-shadow-md">
                  {isEn ? 'Safety Games Arcade' : 'حفاظتی کھیل کی دنیا (Safety Games Arcade)'}
                </h2>

                <p className="text-purple-100 font-bold text-xs sm:text-sm leading-relaxed">
                  {isEn
                    ? 'Learn while playing, earn stars & badges, and become an Ultimate Safeguard Champion!'
                    : 'کھیل ہی کھیل میں سیکھیں، ستارے اور بیجز حاصل کریں اور الٹیمیٹ سیفگارڈ چیمپئن بنیں!'}
                </p>

                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full border border-white/30 shadow-sm">
                    🏆 {isEn ? `Total Score: ${toddlerScore}` : `کل سکور: ${toddlerScore}`}
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white text-purple-950 flex items-center justify-center text-3xl sm:text-4xl shadow-xl border-2 border-purple-200">
                  🎮
                </div>
              </div>
            </div>

            {/* Separate Game Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {toddlerArcadeGames.map((g) => (
                <motion.div
                  key={g.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-3xl ${g.bgColor} text-white border-4 ${g.borderColor} shadow-xl space-y-4 flex flex-col justify-between relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${g.badgeColor}`}>
                        {g.tag}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-sm">
                        {g.title}
                      </h3>
                    </div>
                    <div className="text-3xl sm:text-4xl p-3 bg-black/20 rounded-2xl border border-white/30 shrink-0">
                      {g.icon}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-white/90 leading-relaxed text-right">
                    {g.subtitle}
                  </p>

                  <button
                    onClick={() => setToddlerTab(g.id as any)}
                    className="w-full bg-white hover:bg-slate-100 text-slate-950 font-black py-3 px-6 rounded-full shadow-md flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-95"
                  >
                    <Play className="w-5 h-5 fill-slate-950 shrink-0" />
                    <span>{isEn ? 'Play Now' : 'کھیلیں (Play Now)'}</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Active Game View */
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-purple-100 p-3.5 rounded-2xl border-2 border-purple-300">
              <button
                onClick={() => setToddlerTab('hub')}
                className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow transition-transform active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isEn ? 'Back to Arcade' : '⬅ واپس گیم آرکیڈ (Back to Arcade)'}</span>
              </button>
              <div className="text-xs font-black text-purple-900 bg-white px-3.5 py-1.5 rounded-full border border-purple-200 shadow-sm">
                🏆 {isEn ? `Score: ${toddlerScore}` : `سکور: ${toddlerScore}`}
              </div>
            </div>

            {/* GAME 1: SAFETY BALLOONS (حفاظتی غبارے) */}
            {toddlerTab === 'balloons' && (
              <div className="bg-white rounded-3xl p-5 border-2 border-purple-300 shadow-md space-y-5 text-center">
                <div className="space-y-1">
                  <span className="bg-purple-100 text-purple-900 text-xs font-black px-3 py-1 rounded-full uppercase">
                    {isEn ? 'Game 1' : 'گیم نمبر ۱'}
                  </span>
                  <h3 className="text-xl font-black text-purple-950 flex items-center justify-center gap-2">
                    <span>🎈</span>
                    <span>{isEn ? 'Safety Balloons (Hifazati Ghubary)' : 'حفاظتی غبارے (Hifazati Ghubary)'}</span>
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-600">
                    {isEn
                      ? 'Tap the floating balloons to pop them and gently hear if it is Good Touch, Bad Touch, or Caution!'
                      : 'غباروں پر کلک کر کے پھوڑیں اور سنیں کہ یہ اچھا چھونا ہے، برا چھونا ہے، یا نہ اچھا نہ برا!'}
                  </p>
                </div>

                {/* Balloon Color Legend */}
                <div className="flex flex-wrap justify-center gap-2 text-xs font-black">
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1">
                    🟢 {isEn ? 'Green = Good Touch' : 'سبز = اچھا چھونا'}
                  </span>
                  <span className="bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full flex items-center gap-1">
                    🔴 {isEn ? 'Red = Bad Touch' : 'سرخ = برا چھونا'}
                  </span>
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1">
                    🟡 {isEn ? 'Yellow = Caution' : 'پیلا = نہ اچھا، نہ برا'}
                  </span>
                </div>

                {/* Balloons Grid */}
                <div className="grid grid-cols-3 gap-3 py-3">
                  {balloonsList.map((b) => {
                    const isPopped = poppedBalloons.includes(b.id);
                    return (
                      <motion.button
                        key={b.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => handlePopBalloon(b)}
                        disabled={isPopped}
                        className={`h-28 rounded-3xl border-4 flex flex-col items-center justify-center p-2 relative shadow-md transition-all ${
                          isPopped
                            ? 'bg-slate-100 border-dashed border-slate-300 opacity-40 scale-90'
                            : b.color === 'green'
                            ? 'bg-gradient-to-b from-emerald-400 to-teal-500 border-emerald-300 text-white'
                            : b.color === 'red'
                            ? 'bg-gradient-to-b from-rose-500 to-red-600 border-rose-300 text-white'
                            : 'bg-gradient-to-b from-amber-400 to-yellow-500 border-amber-300 text-slate-950'
                        }`}
                      >
                        {isPopped ? (
                          <span className="text-3xl animate-ping">💥</span>
                        ) : (
                          <>
                            <span className="text-4xl animate-bounce">🎈</span>
                            <span className="text-[11px] font-black mt-1 leading-tight text-center drop-shadow-sm">
                              {isEn ? b.labelEn : b.labelUrdu}
                            </span>
                          </>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Feedback Message */}
                {balloonFeedback && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-4 rounded-2xl border-2 text-center font-black text-sm ${
                      balloonFeedback.color === 'green'
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                        : balloonFeedback.color === 'red'
                        ? 'bg-rose-100 border-rose-400 text-rose-950'
                        : 'bg-amber-100 border-amber-400 text-amber-950'
                    }`}
                  >
                    <p>{isEn ? balloonFeedback.textEn : balloonFeedback.textUrdu}</p>
                  </motion.div>
                )}

                <button
                  onClick={() => {
                    setPoppedBalloons([]);
                    setBalloonFeedback(null);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-3 rounded-2xl shadow transition-transform active:scale-95 text-xs sm:text-sm"
                >
                  {isEn ? 'Inflate New Balloons 🎈' : 'دوبارہ غبارے پھلائیں 🎈'}
                </button>
              </div>
            )}

            {/* GAME 2: BODY PARTS & 3 COLOR BALLOONS (جسم اور غبارے) */}
            {toddlerTab === 'body_parts' && (
              <div className="bg-white rounded-3xl p-5 border-2 border-purple-300 shadow-md space-y-5 text-center">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black bg-purple-100 text-purple-900 px-3 py-1 rounded-full uppercase">
                    {isEn ? `Part ${bodyPartIndex + 1} of ${bodyPartsData.length}` : `حصہ ${bodyPartIndex + 1} از ۷`}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {isEn ? 'Body & Balloons Game' : 'گیم ۲: جسم اور غبارے'}
                  </span>
                </div>

                {/* Current Body Part Display */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentBodyPart.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-purple-50 rounded-3xl p-6 border-2 border-purple-200 space-y-3 shadow-inner"
                  >
                    <div className="text-7xl animate-bounce">{currentBodyPart.icon}</div>
                    <h3 className="text-xl font-black text-purple-950">
                      {isEn ? currentBodyPart.partEn : currentBodyPart.partUrdu}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-slate-600">
                      {isEn
                        ? 'Click the matching color balloon below: Green (Good), Red (Bad), or Yellow (Caution)'
                        : 'نیچے دیے گئے صحیح غبارے پر کلک کریں: سبز (اچھا چھونا)، سرخ (برا چھونا)، یا پیلا (محتاط رہیں)'}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* 3 Large Color Balloon Buttons at Bottom */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectBalloonForBodyPart('green')}
                    className="p-4 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 border-4 border-emerald-300 text-white font-black shadow-lg flex flex-col items-center gap-1 active:scale-95"
                  >
                    <span className="text-4xl">🎈</span>
                    <span className="text-xs sm:text-sm drop-shadow-sm">
                      {isEn ? 'Green (Good Touch)' : 'سبز غبارہ (اچھا چھونا)'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectBalloonForBodyPart('red')}
                    className="p-4 rounded-2xl bg-gradient-to-b from-rose-500 to-red-600 border-4 border-rose-300 text-white font-black shadow-lg flex flex-col items-center gap-1 active:scale-95"
                  >
                    <span className="text-4xl">🎈</span>
                    <span className="text-xs sm:text-sm drop-shadow-sm">
                      {isEn ? 'Red (Bad Touch)' : 'سرخ غبارہ (برا چھونا)'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectBalloonForBodyPart('yellow')}
                    className="p-4 rounded-2xl bg-gradient-to-b from-amber-400 to-yellow-500 border-4 border-amber-300 text-slate-950 font-black shadow-lg flex flex-col items-center gap-1 active:scale-95"
                  >
                    <span className="text-4xl">🎈</span>
                    <span className="text-xs sm:text-sm drop-shadow-sm">
                      {isEn ? 'Yellow (Caution)' : 'پیلا غبارہ (نہ اچھا، نہ برا)'}
                    </span>
                  </motion.button>
                </div>

                {/* Feedback Message */}
                {bodyPartFeedback && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-4 rounded-2xl border-2 text-center font-black text-sm ${
                      bodyPartFeedback.isCorrect
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-md'
                        : 'bg-rose-100 border-rose-400 text-rose-950 shadow-md animate-pulse'
                    }`}
                  >
                    <p>{isEn ? bodyPartFeedback.textEn : bodyPartFeedback.textUrdu}</p>

                    {bodyPartFeedback.isCorrect ? (
                      <button
                        onClick={handleNextBodyPart}
                        className="mt-3 bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-2 rounded-xl text-xs shadow-md transition-transform active:scale-95"
                      >
                        {isEn ? 'Next Body Part ➡' : 'اگلا حصہ ➡'}
                      </button>
                    ) : (
                      <p className="text-xs text-rose-800 font-black mt-2">
                        {isEn ? 'Try clicking another balloon!' : 'دوبارہ سوچ کر دوسرے غبارے پر کلک کریں!'}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* GAME 3: SAFE FRIENDS (محفوظ دوست) */}
            {toddlerTab === 'animals' && (
              <div className="bg-white rounded-3xl p-5 border-2 border-purple-300 shadow-md space-y-5 text-center">
                <div className="space-y-1">
                  <span className="bg-purple-100 text-purple-900 text-xs font-black px-3 py-1 rounded-full uppercase">
                    {isEn ? 'Game 3' : 'گیم نمبر ۳'}
                  </span>
                  <h3 className="text-xl font-black text-purple-950 flex items-center justify-center gap-2">
                    <span>🐰</span>
                    <span>{isEn ? 'Safe Friends (Mehfooz Dost)' : 'محفوظ دوست (Mehfooz Dost)'}</span>
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-600">
                    {isEn ? 'Is this friend Safe or Stranger Danger?' : 'کیا یہ دوست آپ کے لیے محفوظ ہے یا اجنبی کا خطرہ؟'}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-3xl p-6 border-2 border-purple-200 space-y-3">
                  <div className="text-7xl animate-bounce">{currentAnimal.icon}</div>
                  <h4 className="text-lg font-black text-purple-950">
                    {isEn ? currentAnimal.titleEn : currentAnimal.titleUrdu}
                  </h4>
                </div>

                {/* Safe / Unsafe Tap Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSelectAnimal(true)}
                    className="p-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-lg text-sm border-2 border-emerald-300 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>🟢</span>
                    <span>{isEn ? 'Safe Friend' : 'محفوظ دوست 🟢'}</span>
                  </button>

                  <button
                    onClick={() => handleSelectAnimal(false)}
                    className="p-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black shadow-lg text-sm border-2 border-rose-300 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>🔴</span>
                    <span>{isEn ? 'Stranger Danger' : 'اجنبی کا خطرہ 🔴'}</span>
                  </button>
                </div>

                {animalFeedback && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-4 rounded-2xl border-2 text-center font-black text-sm ${
                      animalFeedback.isCorrect
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-md'
                        : 'bg-rose-100 border-rose-400 text-rose-950 shadow-md animate-pulse'
                    }`}
                  >
                    <p>{isEn ? animalFeedback.textEn : animalFeedback.textUrdu}</p>
                    {animalFeedback.isCorrect ? (
                      <button
                        onClick={handleNextAnimal}
                        className="mt-3 bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-2 rounded-xl text-xs shadow"
                      >
                        {isEn ? 'Next Friend ➡' : 'اگلا دوست ➡'}
                      </button>
                    ) : (
                      <p className="text-xs text-rose-800 font-black mt-2">
                        {isEn ? 'Try again!' : 'دوبارہ کوشش کریں!'}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* GAME 4: SAYING NO PRACTICE */}
            {toddlerTab === 'saying_no' && (
              <SayingNoGame
                onEarnBadge={onAwardBadge}
                language={profile.language}
                ageBracket={profile.ageBracket}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  /* ============================================================
     JUNIOR GAMES ARCADE (5-8 Years) - 4 Interactive Mini-Games
     ============================================================ */
  if (ageBracket === '5-8') {
    const juniorGames = [
      {
        id: 'safe_adventure',
        titleEn: 'GAME 1 — Safe Adventure',
        titleUrdu: 'گیم ۱ — سیف ایڈونچر',
        descEn: 'Explore Home, School, Park & Mall! Find the safest choices in realistic situations.',
        descUrdu: 'گھر، اسکول، پارک اور مال کی سیر کریں! روزمرہ کے حالات میں محفوظ راستہ چنیں۔',
        icon: '🧭',
        gradient: 'from-amber-400 via-orange-500 to-amber-600',
        badge: 'Safe Explorer Badge 🛡️',
      },
      {
        id: 'body_hero',
        titleEn: 'GAME 2 — Body Safety Hero',
        titleUrdu: 'گیم ۲ — باڈی سیفٹی ہیرو',
        descEn: 'Learn safe greetings, practice saying NO loudly, and discover private swimsuit boundaries.',
        descUrdu: 'سلام کے طریقے، "نہیں!" کہنا اور سوئم سوٹ کا حفاظتی قانون سیکھیں۔',
        icon: '🦸‍♂️',
        gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
        badge: 'Hero Shield Badge 🛡️',
      },
      {
        id: 'find_adult',
        titleEn: 'GAME 3 — Find My Safe Adult',
        titleUrdu: 'گیم ۳ — سیف ایڈلٹ نیویگیٹر',
        descEn: 'Identify police, security, and info desk staff if lost, and practice phone numbers!',
        descUrdu: 'گمشدگی کی صورت میں گارڈ، پولیس اور انفارمیشن ڈیسک والوں سے مدد مانگنا سیکھیں۔',
        icon: '🔎',
        gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
        badge: 'Safe Lost Patrol Badge 📜',
      },
      {
        id: 'secret_detective',
        titleEn: 'GAME 4 — Secret Detective',
        titleUrdu: 'گیم ۴ — راز کا جاسوس',
        descEn: 'Help Detective Owl sort Safe Secrets vs Unsafe Secrets and earn magnifying glasses!',
        descUrdu: 'جاسوس الّو کے ساتھ مل کر محفوظ اور غیر محفوظ رازوں کا فرق پہچانیں۔',
        icon: '🦉',
        gradient: 'from-fuchsia-400 via-purple-500 to-indigo-600',
        badge: 'Master Detective Badge 🔍',
      },
    ];

    return (
      <div className="space-y-6 max-w-4xl mx-auto font-sans">
        {juniorActiveGame === 'hub' ? (
          /* JUNIOR ARCADE HUB */
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl text-white space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="space-y-1 text-center sm:text-right">
                <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black px-3.5 py-1 rounded-full text-xs shadow">
                  <Sparkles className="w-4 h-4" />
                  <span>{isEn ? 'Junior Safety Arcade (Ages 5–8)' : 'جونئیر سیفٹی آرکیڈ (عمر ۵ تا ۸ سال)'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow">
                  🎮 {isEn ? 'Safeguard Buddy Games' : 'سیف گار ڈ بڈی کے چار محفوظ گیمز'}
                </h2>
                <p className="text-purple-200 font-bold text-xs sm:text-sm">
                  {isEn
                    ? 'Interactive educational safety adventures with stars, badges, and cheerful audio!'
                    : 'خوبصورت اینیمیشنز، صوتی رہنمائی اور انعامات کے ساتھ بچوں کی حفاظت کے ۴ زبردست گیمز!'}
                </p>
              </div>

              <button
                onClick={() => speakText(
                  isEn
                    ? 'Welcome to Junior Safety Arcade! Choose any of the four games to play and earn stars!'
                    : 'جونئیر سیفٹی آرکیڈ میں خوش آمدید! کھیلنے اور ستارے جیتنے کے لیے کوئی بھی گیم چنیں!',
                  profile.language
                )}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl border border-white/20 shadow flex items-center gap-2 font-bold text-xs shrink-0"
              >
                <Volume2 className="w-4 h-4 text-amber-300" />
                <span>{isEn ? 'Listen Guide' : 'رہنمائی سنیں'}</span>
              </button>
            </div>

            {/* 4 Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {juniorGames.map((g) => (
                <motion.div
                  key={g.id}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-br ${g.gradient} rounded-3xl p-6 border-4 border-white/30 shadow-2xl flex flex-col justify-between gap-4 relative overflow-hidden text-white`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="bg-black/20 text-white/90 text-[11px] font-black px-3 py-1 rounded-full border border-white/20 inline-block">
                        {isEn ? g.titleEn : g.titleUrdu}
                      </span>
                      <h3 className="text-lg font-black text-white drop-shadow-sm pt-1">
                        {isEn ? g.titleEn.split('—')[1] : g.titleUrdu.split('—')[1]}
                      </h3>
                    </div>
                    <span className="text-5xl drop-shadow shrink-0">{g.icon}</span>
                  </div>

                  <p className="text-xs font-bold text-white/95 leading-relaxed bg-black/10 p-3 rounded-2xl border border-white/10">
                    {isEn ? g.descEn : g.descUrdu}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-black bg-amber-300 text-slate-950 px-2.5 py-1 rounded-full border border-amber-200">
                      🏅 {g.badge}
                    </span>

                    <button
                      onClick={() => {
                        setJuniorActiveGame(g.id as any);
                        playSound.playPop();
                        speakText(isEn ? `Starting ${g.titleEn}` : `${g.titleUrdu} شروع ہو رہا ہے`, profile.language);
                      }}
                      className="bg-white hover:bg-amber-300 text-purple-950 font-black px-5 py-2.5 rounded-2xl text-xs shadow-lg flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isEn ? 'Play Game Now' : 'کھیل شروع کریں'}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* ACTIVE GAME VIEW */
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white rounded-2xl p-3 px-5 shadow border border-purple-200">
              <button
                onClick={() => {
                  setJuniorActiveGame('hub');
                  playSound.playPop();
                }}
                className="inline-flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-black px-4 py-2 rounded-xl text-xs shadow transition-transform active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isEn ? 'Back to Games Arcade Hub' : 'تمام ۴ گیمز پر واپس جائیں'}</span>
              </button>

              <span className="text-xs font-black text-purple-950 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
                🎮 {isEn ? 'Child Safety Game (5-8 Years)' : 'بچوں کی حفاظت کا گیم (۵ تا ۸ سال)'}
              </span>
            </div>

            {juniorActiveGame === 'safe_adventure' && (
              <SafeAdventureGame
                onEarnBadge={onAwardBadge}
                language={profile.language}
              />
            )}

            {juniorActiveGame === 'body_hero' && (
              <BodySafetyHeroGame
                onEarnBadge={onAwardBadge}
                language={profile.language}
              />
            )}

            {juniorActiveGame === 'find_adult' && (
              <FindSafeAdultGame
                onEarnBadge={onAwardBadge}
                language={profile.language}
              />
            )}

            {juniorActiveGame === 'secret_detective' && (
              <SecretDetectiveGame
                onEarnBadge={onAwardBadge}
                language={profile.language}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  /* ============================================================
     EXPLORER VIEW (8-10+) - 5 Mini-Games Arcade
     ============================================================ */
  const games = [
    {
      id: 'quest',
      title: isEn ? 'Safeguard Quest' : 'حفاظتی مہم (Safeguard Quest)',
      subtitle: isEn
        ? 'A 10-level hero adventure with Eagle Zara!'
        : 'عقاب زارا کے ساتھ 10 لیولز کا ہیرو ایڈونچر!',
      icon: '🦅',
      tag: isEn ? 'Adventure Game' : 'ایڈونچر گیم',
      bgColor: 'bg-gradient-to-r from-lime-500 via-amber-400 to-lime-600',
      borderColor: 'border-lime-300',
      badgeColor: 'bg-black/20 text-white border border-white/30',
    },
    {
      id: 'body_defender',
      title: isEn ? 'Body Defender' : 'جسمانی محافظ (Body Defender)',
      subtitle: isEn
        ? 'Fast-paced action game — Select safe body zones!'
        : 'تیز رفتار ایکشن گیم — صحیح زون منتخب کرو!',
      icon: '🛡️',
      tag: isEn ? 'Action Reaction' : 'ایکشن ری ایکشن',
      bgColor: 'bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800',
      borderColor: 'border-teal-300',
      badgeColor: 'bg-black/20 text-white border border-white/30',
    },
    {
      id: 'safeguard_run',
      title: isEn ? 'Safeguard Run' : 'حفاظتی دوڑ (Safeguard Run)',
      subtitle: isEn
        ? 'Endless runner — Jump, dodge obstacles, collect stars!'
        : 'لامحدود دوڑ — چھلانگ لگائیں اور ستارے جمع کریں!',
      icon: '🏃',
      tag: isEn ? 'Endless Runner' : 'اینڈلیس رنر',
      bgColor: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-500',
      borderColor: 'border-emerald-300',
      badgeColor: 'bg-black/20 text-white border border-white/30',
    },
    {
      id: 'memory_kingdom',
      title: isEn ? 'Memory Kingdom' : 'یادداشت کی سلطنت (Memory Kingdom)',
      subtitle: isEn
        ? 'Help Princess Ayesha & Prince Ali remember safety rules!'
        : 'شہزادی عائشہ اور پرنس علی کو اصول یاد دلائیں!',
      icon: '🏰',
      tag: isEn ? 'Story Memory' : 'اسٹوری میموری',
      bgColor: 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900',
      borderColor: 'border-purple-300',
      badgeColor: 'bg-black/20 text-white border border-white/30',
    },
    {
      id: 'doodle_defender',
      title: isEn ? 'Doodle Defender' : 'ڈوڈل ڈیفنڈر (Doodle Defender)',
      subtitle: isEn
        ? 'Save airborne Doodle from candy trap puzzles!'
        : 'فضائی ڈوڈل کو کینڈی کے جال سے بچانے کا پزل!',
      icon: '🐱',
      tag: isEn ? 'Puzzle Adventure' : 'پزل ایڈونچر',
      bgColor: 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-800',
      borderColor: 'border-fuchsia-300',
      badgeColor: 'bg-black/20 text-white border border-white/30',
    },
  ];

  if (activeGameId === 'quest') {
    return (
      <SafeguardQuest
        profile={profile}
        onEarnBadge={onAwardBadge}
        onBackToHub={() => setActiveGameId('hub')}
      />
    );
  }

  if (activeGameId === 'body_defender') {
    return (
      <BodyDefender
        profile={profile}
        onEarnBadge={onAwardBadge}
        onBackToHub={() => setActiveGameId('hub')}
      />
    );
  }

  if (activeGameId === 'safeguard_run') {
    return (
      <SafeguardRun
        profile={profile}
        onEarnBadge={onAwardBadge}
        onBackToHub={() => setActiveGameId('hub')}
      />
    );
  }

  if (activeGameId === 'memory_kingdom') {
    return (
      <MemoryKingdom
        profile={profile}
        onEarnBadge={onAwardBadge}
        onBackToHub={() => setActiveGameId('hub')}
      />
    );
  }

  if (activeGameId === 'doodle_defender') {
    return (
      <DoodleDefender
        profile={profile}
        onEarnBadge={onAwardBadge}
        onBackToHub={() => setActiveGameId('hub')}
      />
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      {/* Hero Welcome Games Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white shadow-xl border-4 border-purple-300 flex items-center justify-between gap-4">
        <div className="space-y-2 text-right flex-1">
          <h2 className="text-xl sm:text-3xl font-black text-white leading-snug drop-shadow-md">
            {isEn ? 'Safety Games Arcade' : 'حفاظتی کھیل کی دنیا (Safety Games Arcade)'}
          </h2>

          <p className="text-purple-100 font-bold text-xs sm:text-sm leading-relaxed">
            {isEn
              ? 'Learn while playing, earn stars & badges, and become an Ultimate Safeguard Champion!'
              : 'کھیل ہی کھیل میں سیکھیں، ستارے اور بیجز حاصل کریں اور الٹیمیٹ سیفگارڈ چیمپئن بنیں!'}
          </p>
        </div>

        <div className="shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white text-purple-950 flex items-center justify-center text-4xl shadow-xl border-2 border-purple-200">
            🎮
          </div>
        </div>
      </div>

      {/* 5 Games Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {games.map((g) => (
          <motion.div
            key={g.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-3xl ${g.bgColor} text-white border-4 ${g.borderColor} shadow-xl space-y-4 flex flex-col justify-between relative overflow-hidden`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${g.badgeColor}`}>
                  {g.tag}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-sm">
                  {g.title}
                </h3>
              </div>
              <div className="text-3xl sm:text-4xl p-3 bg-black/20 rounded-2xl border border-white/30 shrink-0">
                {g.icon}
              </div>
            </div>

            <p className="text-xs sm:text-sm font-bold text-white/90 leading-relaxed text-right">
              {g.subtitle}
            </p>

            <button
              onClick={() => setActiveGameId(g.id as any)}
              className="w-full bg-white hover:bg-slate-100 text-slate-950 font-black py-3 px-6 rounded-full shadow-md flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-slate-950 shrink-0" />
              <span>{isEn ? 'Play Now' : 'کھیلیں (Play Now)'}</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
