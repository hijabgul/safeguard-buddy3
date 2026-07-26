import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChildProfile } from '../../../types';
import { speakText, stopSpeech } from '../../../utils/speech';
import { playSound } from '../../../utils/soundEffects';
import { triggerConfetti } from '../../../utils/confetti';
import {
  Shield,
  Star,
  Lock,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  Flame,
  Gem,
  Compass,
  UserCheck
} from 'lucide-react';

interface SafeguardQuestProps {
  profile: ChildProfile;
  onEarnBadge: (badgeName: string) => void;
  onBackToHub: () => void;
}

interface LevelInfo {
  id: number;
  landNameUrdu: string;
  landNameEng: string;
  titleUrdu: string;
  titleEng: string;
  storyUrdu: string;
  storyEng: string;
  challengeInstructionUrdu: string;
  challengeInstructionEng: string;
  scenarioType: 'stranger_candy' | 'secret_threat' | 'refuse_touch' | 'call_adult';
  unlockRewardUrdu: string;
  unlockRewardEng: string;
  unlockIcon: string;
  badgeNameUrdu?: string;
  badgeNameEng?: string;
  bgGradient: string;
}

const QUEST_LEVELS: LevelInfo[] = [
  {
    id: 1,
    landNameUrdu: 'دوستی کا جنگل',
    landNameEng: 'Forest of Friendship',
    titleUrdu: 'لیول 1: اجنبی کی ٹافی سے بچاؤ',
    titleEng: 'Level 1: Say No to Stranger Candy',
    storyUrdu: 'زارا نے دیکھا کہ ڈینجر ڈوڈل بچوں کو اجنبی کی میٹھی کینڈی دکھا کر لُبھانے کی کوشش کر رہا ہے۔ زارا کہتی ہے: "ہمیں اپنے دوستوں کی حفاظت کرنی ہے!"',
    storyEng: 'Zara noticed Danger Doodle trying to lure kids with sweet candy from a stranger. Zara says: "We must protect our friends!"',
    challengeInstructionUrdu: 'شیلڈ کا بٹن دبائیں اور لفظ "نہیں" (NO) کو اجنبی کی طرف کھینچیں!',
    challengeInstructionEng: 'Press the Shield button and use the "NO" power against the stranger!',
    scenarioType: 'stranger_candy',
    unlockRewardUrdu: 'ابتدائی پاس (Protector Pass)',
    unlockRewardEng: 'Protector Pass',
    unlockIcon: '🎫',
    bgGradient: 'from-emerald-500 to-teal-700'
  },
  {
    id: 2,
    landNameUrdu: 'دوستی کا جنگل',
    landNameEng: 'Forest of Friendship',
    titleUrdu: 'لیول 2: اجنبی کی گاڑی سے دوری',
    titleEng: 'Level 2: Stay Away from Stranger Cars',
    storyUrdu: 'ایک انجان گاڑی کا دروازہ کھلا اور ڈینجر ڈوڈل بچوں کو گاڑی میں بیٹھنے کی ترغیب دے رہا ہے۔ زارا چیخی: "فٹافٹ دور ہٹو!"',
    storyEng: 'A stranger opened their car door inviting kids inside. Zara shouts: "Step back immediately!"',
    challengeInstructionUrdu: 'بھروسہ مند بڑے (Trusted Adult) پر کلک کر کے فوراً امی کو بلاؤ!',
    challengeInstructionEng: 'Click on Trusted Adult to call Mom immediately!',
    scenarioType: 'call_adult',
    unlockRewardUrdu: 'محفوظ کیپ (Safety Cape 🦸)',
    unlockRewardEng: 'Safety Cape 🦸',
    unlockIcon: '🦸',
    badgeNameUrdu: 'دوستی کا محافظ 🌟',
    badgeNameEng: 'Friendship Protector 🌟',
    bgGradient: 'from-emerald-600 to-green-800'
  },
  {
    id: 3,
    landNameUrdu: 'سچائی کا پہاڑ',
    landNameEng: 'Mountain of Truth',
    titleUrdu: 'لیول 3: برے راز کا خاتمہ',
    titleEng: 'Level 3: Breaking Bad Secrets',
    storyUrdu: 'ڈینجر ڈوڈل نے بچوں سے کہا: "اگر یہ بات کسی کو بتائی تو میں غصہ ہوں گا، یہ ہمارا راز ہے۔" زارا بولیں: "ڈراؤنے راز کبھی چھپانے نہیں چاہئیں!"',
    storyEng: 'Danger Doodle told kids: "Keep this secret or I will be angry." Zara says: "Scary secrets should never be hidden!"',
    challengeInstructionUrdu: 'ڈراؤنے راز کا تالا توڑیں اور سچائی کی روشنی پھیلائیں!',
    challengeInstructionEng: 'Break the bad secret lock and spread the light of truth!',
    scenarioType: 'secret_threat',
    unlockRewardUrdu: 'سچائی کا کرسٹل (Crystal of Truth)',
    unlockRewardEng: 'Crystal of Truth',
    unlockIcon: '💎',
    bgGradient: 'from-cyan-600 to-blue-800'
  },
  {
    id: 4,
    landNameUrdu: 'سچائی کا پہاڑ',
    landNameEng: 'Mountain of Truth',
    titleUrdu: 'لیول 4: خوف پر فتح',
    titleEng: 'Level 4: Overcoming Fear',
    storyUrdu: 'پہاڑ کی چوٹی پر ایک دھند پھیل گئی ہے جہاں بچے ڈر رہے ہیں۔ زارا کہتی ہے: "بتا دو، ڈرو مت! امی ابو کو بتانا بہادری ہے!"',
    storyEng: 'Mist covers the mountain top making children scared. Zara says: "Speak up, don\'t be afraid! Telling parents is brave!"',
    challengeInstructionUrdu: 'محافظ شیلڈ (Protector Shield) چالو کریں!',
    challengeInstructionEng: 'Activate the Protector Shield!',
    scenarioType: 'stranger_candy',
    unlockRewardUrdu: 'محافظ شیلڈ (Protector Shield 🛡️)',
    unlockRewardEng: 'Protector Shield 🛡️',
    unlockIcon: '🛡️',
    badgeNameUrdu: 'سچائی کا ہیرو 💎',
    badgeNameEng: 'Hero of Truth 💎',
    bgGradient: 'from-blue-600 to-indigo-900'
  },
  {
    id: 5,
    landNameUrdu: 'آوازوں کی وادی',
    landNameEng: 'Valley of Voices',
    titleUrdu: 'لیول 5: "نہیں!" بولنے کی طاقت',
    titleEng: 'Level 5: The Power of Saying NO',
    storyUrdu: 'وادی میں ڈینجر ڈوڈل زبردستی بچے کا ہاتھ پکڑنے کی کوشش کر رہا ہے۔ زارا نے آواز دی: "اپنی بلند اور بہادر آواز استعمال کرو!"',
    storyEng: 'Danger Doodle tries to grab a child\'s hand in the valley. Zara calls out: "Use your loud and brave voice!"',
    challengeInstructionUrdu: 'بڑے لال "نہیں!" (NO) بٹن پر ٹیپ کر کے اونچی آواز میں انکار کریں!',
    challengeInstructionEng: 'Tap the big red "NO!" button and refuse firmly!',
    scenarioType: 'refuse_touch',
    unlockRewardUrdu: 'آواز کی گونج (Voice Wave Power)',
    unlockRewardEng: 'Voice Wave Power',
    unlockIcon: '📢',
    bgGradient: 'from-yellow-400 to-lime-600'
  },
  {
    id: 6,
    landNameUrdu: 'آوازوں کی وادی',
    landNameEng: 'Valley of Voices',
    titleUrdu: 'لیول 6: بھاگنے کا راستہ',
    titleEng: 'Level 6: Escape to Safety',
    storyUrdu: 'ڈینجر ڈوڈل نے وادی کا راستہ روکنے کی کوشش کی ہے۔ زارا کہتی ہے: "چلو تیز بھاگ کر محفوظ جگہ پر پہنچیں!"',
    storyEng: 'Danger Doodle blocked the exit. Zara says: "Run fast to a safe place!"',
    challengeInstructionUrdu: 'محفوظ راستے پر سے تیر کا نشان گھما کر راستہ صاف کریں!',
    challengeInstructionEng: 'Clear the safe path to escape!',
    scenarioType: 'stranger_candy',
    unlockRewardUrdu: 'بہادری کا تاج (Courage Crown 👑)',
    unlockRewardEng: 'Courage Crown 👑',
    unlockIcon: '👑',
    badgeNameUrdu: 'آواز کا شیر 📢',
    badgeNameEng: 'Voice Defender 📢',
    bgGradient: 'from-lime-400 to-teal-700'
  },
  {
    id: 7,
    landNameUrdu: 'آوازوں کی وادی',
    landNameEng: 'Valley of Voices',
    titleUrdu: 'لیول 7: جسمانی حدوں کی حفاظت',
    titleEng: 'Level 7: Personal Boundaries',
    storyUrdu: 'ایک اجنبی نے بچے کو گلے لگانے کی کوشش کی۔ زارا فوراً بولی: "میرا جسم میرا ہے، تمہاری اجازت کے بغیر کوئی نہیں چھو سکتا!"',
    storyEng: 'A stranger tries to hug a child. Zara immediately says: "My body belongs to me, nobody can touch without permission!"',
    challengeInstructionUrdu: 'سرخ زون کو ایکٹیویٹ کر کے اجنبی کو پیچھے دھکیلیں!',
    challengeInstructionEng: 'Activate the red safety zone to push the stranger back!',
    scenarioType: 'refuse_touch',
    unlockRewardUrdu: 'طاقتور اورا (Aura Shield)',
    unlockRewardEng: 'Aura Shield',
    unlockIcon: '✨',
    bgGradient: 'from-purple-600 to-pink-800'
  },
  {
    id: 8,
    landNameUrdu: 'بھروسے کا گاؤں',
    landNameEng: 'Village of Trust',
    titleUrdu: 'لیول 8: بھروسہ مند بڑوں کا نیٹ ورک',
    titleEng: 'Level 8: Trusted Adults Network',
    storyUrdu: 'گاؤں میں زارا نے بچوں کو اپنے 3 بھروسہ مند بڑوں (امی، ابو، ٹیچر) کے پاس جمع ہونے کی ہدایت دی۔',
    storyEng: 'Zara guides kids to gather near their 3 Trusted Adults (Mom, Dad, Teacher).',
    challengeInstructionUrdu: 'تمام تین بھروسہ مند بڑوں پر کلک کر کے حفاظتی دائرہ مکمل کریں!',
    challengeInstructionEng: 'Click all 3 trusted adults to complete the safety circle!',
    scenarioType: 'call_adult',
    unlockRewardUrdu: 'بجلی کی رفتار (Lightning Speed ⚡)',
    unlockRewardEng: 'Lightning Speed ⚡',
    unlockIcon: '⚡',
    badgeNameUrdu: 'بھروسے کا محافظ 🌟',
    badgeNameEng: 'Trust Guardian 🌟',
    bgGradient: 'from-indigo-600 to-purple-900'
  },
  {
    id: 9,
    landNameUrdu: 'بھروسے کا گاؤں',
    landNameEng: 'Village of Trust',
    titleUrdu: 'لیول 9: ڈینجر ڈوڈل کی حتمی شکست',
    titleEng: 'Level 9: Defeating Danger Doodle',
    storyUrdu: 'ڈینجر ڈوڈل آخری بار گاؤں کے امن کو خراب کرنے آیا لیکن بچوں کے تمام حفاظتی اصول تیار ہیں!',
    storyEng: 'Danger Doodle makes one final attempt, but our safety rules are ready!',
    challengeInstructionUrdu: 'تمام 3 حفاظتی اصول (شیلڈ + نہیں + امی کو بلاؤ) پر یکے بعد دیگرے ٹیپ کریں!',
    challengeInstructionEng: 'Tap all 3 safety actions (Shield + Say NO + Call Adult) in order!',
    scenarioType: 'stranger_candy',
    unlockRewardUrdu: 'الٹیمیٹ میڈل (Ultimate Guardian Badge)',
    unlockRewardEng: 'Ultimate Guardian Badge',
    unlockIcon: '🥇',
    bgGradient: 'from-rose-600 to-red-900'
  },
  {
    id: 10,
    landNameUrdu: 'بھروسے کا گاؤں',
    landNameEng: 'Village of Trust',
    titleUrdu: 'لیول 10: حتمی سیفگارڈ چیمپیئن',
    titleEng: 'Level 10: Ultimate Safeguard Champion',
    storyUrdu: 'مبارک ہو! تم نے گاؤں کو ہمیشہ کے لیے محفوظ بنا دیا۔ اب تم دنیا کے عظیم ترین حفاظتی چیمپیئن ہو!',
    storyEng: 'Congratulations! You made the village safe forever. You are now the Ultimate Safeguard Champion!',
    challengeInstructionUrdu: 'چیمپئن کا تاج پہنیں اور گاؤں کا جشن منائیں!',
    challengeInstructionEng: 'Wear the Champion Crown and celebrate!',
    scenarioType: 'call_adult',
    unlockRewardUrdu: 'الٹیمیٹ سیفگارڈ سوٹ (Ultimate Safeguard 🌟)',
    unlockRewardEng: 'Ultimate Safeguard Suit 🌟',
    unlockIcon: '🌟',
    badgeNameUrdu: 'حتمی سیفگارڈ چیمپیئن 👑',
    badgeNameEng: 'Ultimate Safeguard Champion 👑',
    bgGradient: 'from-yellow-300 via-lime-400 to-emerald-500'
  }
];

export const SafeguardQuest: React.FC<SafeguardQuestProps> = ({
  profile,
  onEarnBadge,
  onBackToHub
}) => {
  const isEn = profile.language === 'en';
  const lang = profile.language || 'ur';

  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
  const [stars, setStars] = useState<Record<number, number>>({ 1: 5 });
  const [gems, setGems] = useState(120);
  const [streakDays] = useState(3);
  const [activeCostume] = useState('Safety Cape');

  // Interactive challenge state
  const [gameState, setGameState] = useState<'story' | 'challenge' | 'success'>('story');
  const [shieldActive, setShieldActive] = useState(false);
  const [saidNo, setSaidNo] = useState(false);
  const [calledAdult, setCalledAdult] = useState(false);
  const [doodleEscaped, setDoodleEscaped] = useState(false);
  const [showShop, setShowShop] = useState(false);

  const currentLevel = QUEST_LEVELS.find((l) => l.id === currentLevelId) || QUEST_LEVELS[0];

  useEffect(() => {
    const storyText = isEn ? currentLevel.storyEng : currentLevel.storyUrdu;
    const introText = isEn ? `Zara says: ${storyText}` : `[warm] زارا کہتی ہے: ${storyText}`;
    speakText(introText, lang);

    return () => {
      stopSpeech();
    };
  }, [currentLevelId, isEn, lang]);

  const handleStartChallenge = () => {
    stopSpeech();
    setGameState('challenge');
    setShieldActive(false);
    setSaidNo(false);
    setCalledAdult(false);
    setDoodleEscaped(false);

    const inst = isEn ? currentLevel.challengeInstructionEng : currentLevel.challengeInstructionUrdu;
    speakText(isEn ? `Challenge! ${inst}` : `[excited] چیلنج! ${inst}`, lang);
  };

  const handleShieldClick = () => {
    playSound.playShieldPowerup();
    setShieldActive(true);
    speakText(isEn ? 'Protector Shield Activated!' : '[positive] محافظ شیلڈ آن ہو گئی!', lang);
    checkChallengeComplete(true, saidNo, calledAdult);
  };

  const handleSayNoClick = () => {
    playSound.playCombo();
    setSaidNo(true);
    speakText(isEn ? 'Said loudly: NO!' : '[excited] اونچی آواز میں بولا: نہیں!', lang);
    checkChallengeComplete(shieldActive, true, calledAdult);
  };

  const handleCallAdultClick = () => {
    playSound.playWinFanfare();
    setCalledAdult(true);
    speakText(isEn ? 'Called trusted adult! We are safe now.' : '[warm] امی ابو کو بلا لیا! اب ہم محفوظ ہیں۔', lang);
    checkChallengeComplete(shieldActive, saidNo, true);
  };

  const checkChallengeComplete = (s: boolean, n: boolean, a: boolean) => {
    if (currentLevel.id <= 3 && (s || n || a)) {
      triggerSuccess();
    } else if (currentLevel.id <= 7 && ((s && n) || (n && a) || (s && a))) {
      triggerSuccess();
    } else if (s && n && a) {
      triggerSuccess();
    }
  };

  const triggerSuccess = () => {
    setDoodleEscaped(true);
    playSound.playWinFanfare();
    triggerConfetti();

    setTimeout(() => {
      setGameState('success');
      setStars((prev) => ({ ...prev, [currentLevelId]: 5 }));
      setGems((prev) => prev + 25);

      if (currentLevelId < 10 && !unlockedLevels.includes(currentLevelId + 1)) {
        setUnlockedLevels((prev) => [...prev, currentLevelId + 1]);
      }

      const badgeToEarn = isEn ? currentLevel.badgeNameEng : currentLevel.badgeNameUrdu;
      if (badgeToEarn) {
        onEarnBadge(badgeToEarn);
      }

      const titleText = isEn ? currentLevel.titleEng : currentLevel.titleUrdu;
      const rewardText = isEn ? currentLevel.unlockRewardEng : currentLevel.unlockRewardUrdu;
      const winText = isEn
        ? `Bravo! You completed ${titleText}! Reward: ${rewardText}`
        : `[excited] شاباش! تم نے ${titleText} کامیابی سے مکمل کر لیا! انعام ملا: ${rewardText}`;
      speakText(winText, lang);
    }, 800);
  };

  const handleNextLevel = () => {
    if (currentLevelId < 10) {
      setCurrentLevelId(currentLevelId + 1);
      setGameState('story');
    } else {
      setGameState('story');
    }
  };

  return (
    <div className={`min-h-screen bg-slate-900 text-white font-sans pb-16 ${isEn ? 'dir-ltr' : 'dir-rtl'}`}>
      {/* Top Header */}
      <div className="bg-slate-800 border-b-4 border-amber-400 p-4 sticky top-0 z-20 flex items-center justify-between shadow-lg">
        <button
          onClick={onBackToHub}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-transform active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{isEn ? 'Games Hub' : 'گیمز ہب'}</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-amber-400/20 border-2 border-amber-400 px-3 py-1 rounded-full text-amber-300 font-black text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{(Object.values(stars) as number[]).reduce((a: number, b: number) => a + b, 0)} {isEn ? 'Stars' : 'ستارے'}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-500/20 border-2 border-emerald-400 px-3 py-1 rounded-full text-emerald-300 font-black text-sm">
            <Gem className="w-4 h-4 text-emerald-400" />
            <span>{gems} {isEn ? 'Gems' : 'زمرد'}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-rose-500/20 border-2 border-rose-400 px-3 py-1 rounded-full text-rose-300 font-black text-sm">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>{streakDays} {isEn ? 'Day Streak' : 'دن اسٹریک'}</span>
          </div>

          <button
            onClick={() => setShowShop(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-2xl border-2 border-indigo-400 shadow-md flex items-center gap-1"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline font-bold text-xs">{isEn ? 'Costumes' : 'کپڑے و شیلڈ'}</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Title Banner */}
        <div className={`p-6 rounded-[2.5rem] bg-gradient-to-r ${currentLevel.bgGradient} border-4 border-amber-400 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden`}>
          <div className="space-y-2 text-left md:text-left max-w-xl z-10">
            <div className="inline-flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full text-amber-300 text-xs font-black border border-amber-400/50">
              <Compass className="w-4 h-4" />
              <span>{isEn ? currentLevel.landNameEng : currentLevel.landNameUrdu}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
              {isEn ? 'Safeguard Quest' : 'حفاظتی مہم (Safeguard Quest)'}
            </h1>
            <p className="text-amber-100 font-bold text-sm">
              {isEn
                ? 'Team up with Eagle Zara to protect the village from Danger Doodle!'
                : 'زارا عقاب کے ساتھ مل کر گاؤں کو ڈینجر ڈوڈل کی چالوں سے محفوظ رکھیں!'}
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-900 font-black text-3xl flex items-center justify-center border-4 border-white shadow-lg">
              🦅
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border-2 border-amber-400 text-xs font-bold text-amber-200">
              {isEn ? 'Zara Guide' : 'زارا راہنما'}
            </div>
          </div>
        </div>

        {/* Level Selection Roadmap Horizontal */}
        <div className="bg-slate-800/90 p-4 rounded-3xl border-2 border-slate-700 shadow-inner overflow-x-auto">
          <div className="flex items-center gap-3 min-w-max pb-2">
            {QUEST_LEVELS.map((level) => {
              const isUnlocked = unlockedLevels.includes(level.id);
              const isCurrent = level.id === currentLevelId;
              const levelStars = stars[level.id] || 0;

              return (
                <button
                  key={level.id}
                  disabled={!isUnlocked}
                  onClick={() => {
                    setCurrentLevelId(level.id);
                    setGameState('story');
                  }}
                  className={`w-20 h-24 rounded-2xl p-2 flex flex-col items-center justify-between border-2 transition-all relative ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 border-white scale-105 shadow-[0_0_15px_rgba(251,191,36,0.6)] font-black'
                      : isUnlocked
                      ? 'bg-slate-700 text-white border-slate-500 hover:bg-slate-600 font-bold'
                      : 'bg-slate-800 text-slate-500 border-slate-700 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <span className="text-xs font-black">Lvl {level.id}</span>
                  <div className="text-2xl">
                    {isUnlocked ? level.unlockIcon : <Lock className="w-6 h-6 text-slate-500 mx-auto" />}
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= (levelStars > 0 ? 3 : 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Stage View */}
        <div className="bg-slate-800 rounded-[2.5rem] p-6 border-4 border-slate-700 shadow-2xl relative min-h-[420px] flex flex-col justify-between">
          {/* Story State */}
          {gameState === 'story' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 my-auto text-center"
            >
              <div className="bg-slate-900/90 border-2 border-amber-400 p-6 rounded-3xl max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl animate-bounce">🦅</span>
                  <span className="text-4xl">😈</span>
                </div>
                <h2 className="text-xl font-black text-amber-400">
                  {isEn ? currentLevel.titleEng : currentLevel.titleUrdu}
                </h2>
                <p className="text-base text-slate-200 leading-relaxed font-bold">
                  "{isEn ? currentLevel.storyEng : currentLevel.storyUrdu}"
                </p>
                <div className="p-3 bg-indigo-950/80 rounded-2xl border border-indigo-500 text-indigo-200 text-xs font-bold">
                  💡 {isEn ? `Zara's Advice: ${currentLevel.challengeInstructionEng}` : `زارا کی نصیحت: ${currentLevel.challengeInstructionUrdu}`}
                </div>
              </div>

              <button
                onClick={handleStartChallenge}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-lg px-8 py-4 rounded-3xl border-4 border-white shadow-[0_6px_0_#D97706] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-6 h-6 text-slate-950" />
                <span>{isEn ? 'Start Mission' : 'مہم شروع کریں'}</span>
              </button>
            </motion.div>
          )}

          {/* Interactive Challenge State */}
          {gameState === 'challenge' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 my-auto text-center max-w-2xl mx-auto w-full"
            >
              {/* Challenge Arena Scene */}
              <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-4 border-amber-400/80 p-6 rounded-3xl relative overflow-hidden space-y-6 shadow-inner min-h-[260px] flex flex-col justify-center items-center">
                {/* Villain & Guide Visual */}
                <div className="flex items-center justify-around w-full relative z-10">
                  {/* Child Hero */}
                  <div className="text-center space-y-2">
                    <div className={`w-20 h-20 rounded-3xl bg-amber-400 border-4 border-white flex items-center justify-center text-4xl shadow-lg relative ${shieldActive ? 'ring-8 ring-emerald-400 ring-offset-2 ring-offset-slate-900' : ''}`}>
                      <span>{profile.avatar.icon}</span>
                      {shieldActive && (
                        <div className="absolute -top-3 -right-3 bg-emerald-500 p-1.5 rounded-full text-white border-2 border-white">
                          <Shield className="w-4 h-4 fill-white" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-black text-amber-300">{profile.nickname}</span>
                  </div>

                  {/* VS Middle Effect */}
                  <div className="text-amber-400 font-black text-xl">
                    {doodleEscaped ? (isEn ? '✨ Escaped! ✨' : '✨ بھاگ گیا! ✨') : '⚔️'}
                  </div>

                  {/* Danger Doodle Villain */}
                  <div className="text-center space-y-2">
                    <motion.div
                      animate={doodleEscaped ? { x: 200, opacity: 0, rotate: 180 } : { y: [0, -8, 0] }}
                      transition={{ duration: 1.5, repeat: doodleEscaped ? 0 : Infinity }}
                      className="w-20 h-20 rounded-3xl bg-rose-600 border-4 border-white flex items-center justify-center text-4xl shadow-lg"
                    >
                      <span>😈</span>
                    </motion.div>
                    <span className="text-xs font-black text-rose-300">{isEn ? 'Danger Doodle' : 'ڈینجر ڈوڈل'}</span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-full text-xs font-bold text-amber-300 flex items-center gap-2">
                  <span>{isEn ? 'Steps Done:' : 'مکمل شدہ قدم:'}</span>
                  <span className={shieldActive ? 'text-emerald-400 font-black' : 'text-slate-500'}>
                    {isEn ? '🛡️ Shield' : '🛡️ شیلڈ'}
                  </span>
                  <span>•</span>
                  <span className={saidNo ? 'text-emerald-400 font-black' : 'text-slate-500'}>
                    {isEn ? '📢 "NO!"' : '📢 "نہیں!"'}
                  </span>
                  <span>•</span>
                  <span className={calledAdult ? 'text-emerald-400 font-black' : 'text-slate-500'}>
                    {isEn ? '👥 Adult' : '👥 بڑا'}
                  </span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleShieldClick}
                  className={`p-4 rounded-2xl font-black text-sm border-4 transition-all flex flex-col items-center justify-center gap-2 shadow-md ${
                    shieldActive
                      ? 'bg-emerald-500 text-white border-white scale-105'
                      : 'bg-slate-700 hover:bg-slate-600 text-white border-emerald-400'
                  }`}
                >
                  <Shield className="w-7 h-7 text-emerald-300" />
                  <span>{isEn ? '1. Activate Shield 🛡️' : '1. شیلڈ چالو کریں 🛡️'}</span>
                </button>

                <button
                  onClick={handleSayNoClick}
                  className={`p-4 rounded-2xl font-black text-sm border-4 transition-all flex flex-col items-center justify-center gap-2 shadow-md ${
                    saidNo
                      ? 'bg-rose-600 text-white border-white scale-105'
                      : 'bg-slate-700 hover:bg-slate-600 text-white border-rose-400'
                  }`}
                >
                  <span className="text-2xl">📢</span>
                  <span>{isEn ? '2. Say "NO!"' : '2. "نہیں!" بولو'}</span>
                </button>

                <button
                  onClick={handleCallAdultClick}
                  className={`p-4 rounded-2xl font-black text-sm border-4 transition-all flex flex-col items-center justify-center gap-2 shadow-md ${
                    calledAdult
                      ? 'bg-indigo-600 text-white border-white scale-105'
                      : 'bg-slate-700 hover:bg-slate-600 text-white border-indigo-400'
                  }`}
                >
                  <UserCheck className="w-7 h-7 text-indigo-300" />
                  <span>{isEn ? '3. Call Trusted Adult' : '3. امی کو بلاؤ'}</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Level Complete Success State */}
          {gameState === 'success' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6 my-auto text-center max-w-lg mx-auto bg-slate-900 border-4 border-amber-400 p-8 rounded-[2.5rem] shadow-2xl"
            >
              <div className="text-6xl animate-bounce">🏆</div>
              <h2 className="text-2xl font-black text-amber-400">
                {isEn ? 'Level Completed Successfully!' : 'لیول کامیابی سے مکمل!'}
              </h2>
              <p className="text-sm font-bold text-slate-200 leading-relaxed">
                {isEn
                  ? 'You and Zara chased Danger Doodle away! You are a true Safeguard Hero!'
                  : 'تم نے زارا کے ساتھ مل کر ڈینجر ڈوڈل کو بھگا دیا۔ تم ایک سچے سیفگارڈ ہیرو ہو!'}
              </p>

              <div className="p-4 bg-amber-400/10 rounded-2xl border-2 border-amber-400 space-y-1">
                <span className="text-xs font-black text-amber-300">
                  {isEn ? 'Reward Unlocked:' : 'حاصل کردہ انعام:'}
                </span>
                <p className="text-lg font-black text-white flex items-center justify-center gap-2">
                  <span>{currentLevel.unlockIcon}</span>
                  <span>{isEn ? currentLevel.unlockRewardEng : currentLevel.unlockRewardUrdu}</span>
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleNextLevel}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base px-6 py-3.5 rounded-2xl border-2 border-white shadow-lg flex items-center gap-2"
                >
                  <span>{isEn ? 'Next Level' : 'اگلا لیول'}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Costume Customization Shop Modal */}
      {showShop && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-4 border-amber-400 rounded-[2.5rem] p-6 max-w-lg w-full text-center space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span>{isEn ? 'Hero Costumes & Shields' : 'شیلڈ اور کپڑوں کا ہال'}</span>
              </h3>
              <button
                onClick={() => setShowShop(false)}
                className="text-slate-400 hover:text-white font-black text-xl"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-slate-300">
              {isEn
                ? 'Complete levels to unlock new outfits and powers:'
                : 'لیول مکمل کر کے نئے کپڑے اور شیلڈ کی طاقتیں ان لاک کریں:'}
            </p>

            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
              {[
                { name: 'Safety Cape', icon: '🦸', lvl: 2 },
                { name: 'Protector Shield', icon: '🛡️', lvl: 4 },
                { name: 'Courage Crown', icon: '👑', lvl: 6 },
                { name: 'Lightning Speed', icon: '⚡', lvl: 8 },
                { name: 'Ultimate Safeguard', icon: '🌟', lvl: 10 }
              ].map((item) => {
                const isUnlocked = unlockedLevels.includes(item.lvl);
                const isActive = activeCostume === item.name;

                return (
                  <div
                    key={item.name}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-3 ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 border-white font-black'
                        : isUnlocked
                        ? 'bg-slate-800 text-white border-slate-600'
                        : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <div className="text-left">
                      <div className="text-xs font-black">{item.name}</div>
                      <div className="text-[10px] opacity-80">
                        {isUnlocked ? (isEn ? 'Unlocked' : 'ان لاک شدہ') : (isEn ? `Requires Lvl ${item.lvl}` : `Lvl ${item.lvl} درکار`)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowShop(false)}
              className="w-full bg-amber-400 text-slate-950 font-black py-3 rounded-2xl text-sm border-2 border-white"
            >
              {isEn ? 'Close' : 'بند کریں'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
