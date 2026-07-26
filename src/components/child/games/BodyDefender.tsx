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
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

interface BodyDefenderProps {
  profile: ChildProfile;
  onEarnBadge: (badgeName: string) => void;
  onBackToHub: () => void;
}

interface FlyingPart {
  id: string;
  nameUrdu: string;
  nameEng: string;
  icon: string;
  correctZone: 'green' | 'yellow' | 'red';
  x: number;
  y: number;
}

const BODY_PARTS_POOL: Omit<FlyingPart, 'id' | 'x' | 'y'>[] = [
  { nameUrdu: 'سر (Head)', nameEng: 'Head', icon: '🧠', correctZone: 'green' },
  { nameUrdu: 'ہاتھ (Hands)', nameEng: 'Hands', icon: '🖐️', correctZone: 'green' },
  { nameUrdu: 'پاؤں (Feet)', nameEng: 'Feet', icon: '👣', correctZone: 'green' },
  { nameUrdu: 'شانے (Shoulders)', nameEng: 'Shoulders', icon: '🤝', correctZone: 'green' },
  { nameUrdu: 'پیٹ (Stomach)', nameEng: 'Stomach', icon: '👕', correctZone: 'yellow' },
  { nameUrdu: 'پیٹھ (Back)', nameEng: 'Back', icon: '🔙', correctZone: 'yellow' },
  { nameUrdu: 'ٹانگیں (Legs)', nameEng: 'Legs', icon: '🦵', correctZone: 'yellow' },
  { nameUrdu: 'پرائیویٹ حصے (Underwear Zone)', nameEng: 'Private Parts', icon: '🩲', correctZone: 'red' },
  { nameUrdu: 'سینے کا حصہ (Chest Zone)', nameEng: 'Chest Zone', icon: '🎽', correctZone: 'red' },
];

export const BodyDefender: React.FC<BodyDefenderProps> = ({
  profile,
  onEarnBadge,
  onBackToHub
}) => {
  const isEn = profile.language === 'en';
  const lang = profile.language || 'ur';

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [shields, setShields] = useState(5);
  const [timeLeft, setTimeLeft] = useState(60);

  const [activePart, setActivePart] = useState<FlyingPart | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('bodydefender_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Timer loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Spawn new flying body part when needed
  useEffect(() => {
    if (gameState === 'playing' && !activePart) {
      spawnNextPart();
    }
  }, [gameState, activePart]);

  const startGame = () => {
    stopSpeech();
    setScore(0);
    setCombo(0);
    setMultiplier(1);
    setShields(5);
    setTimeLeft(60);
    setGameState('playing');
    setActivePart(null);
    setFeedback(null);

    speakText(isEn ? 'Body Defender! Start now!' : '[excited] جسمانی محافظ! شروع کرو!', lang);
  };

  const spawnNextPart = () => {
    const template = BODY_PARTS_POOL[Math.floor(Math.random() * BODY_PARTS_POOL.length)];
    const newPart: FlyingPart = {
      ...template,
      id: `part-${Date.now()}-${Math.random()}`,
      x: Math.floor(Math.random() * 60) + 20,
      y: Math.floor(Math.random() * 40) + 15
    };
    setActivePart(newPart);
  };

  const handleCategorize = (zone: 'green' | 'yellow' | 'red') => {
    if (!activePart || gameState !== 'playing') return;

    if (zone === activePart.correctZone) {
      // Correct Categorization!
      const nextCombo = combo + 1;
      setCombo(nextCombo);

      let newMult = 1;
      if (nextCombo >= 10) newMult = 5;
      else if (nextCombo >= 5) newMult = 3;
      else if (nextCombo >= 3) newMult = 2;
      setMultiplier(newMult);

      const addedPoints = 10 * newMult;
      setScore((prev) => prev + addedPoints);

      playSound.playStarCollect();
      if (nextCombo % 3 === 0) playSound.playCombo();

      setFeedback({
        text: isEn ? `Great job! +${addedPoints}` : `بہت اچھے! +${addedPoints}`,
        color: 'text-emerald-400'
      });

      setActivePart(null);
    } else {
      // Wrong Categorization
      setCombo(0);
      setMultiplier(1);
      setShields((prev) => {
        const nextShields = prev - 1;
        if (nextShields <= 0) {
          endGame();
        }
        return nextShields;
      });

      playSound.playGentleBump();
      setFeedback({
        text: isEn ? 'Try again!' : 'دوبارہ کوشش کرو!',
        color: 'text-rose-400'
      });

      speakText(isEn ? 'Try again!' : '[gentle] دوبارہ کوشش کرو!', lang);
      setActivePart(null);
    }
  };

  const endGame = () => {
    stopSpeech();
    setGameState('gameover');
    setActivePart(null);

    const badgeName = isEn ? 'Body Defender Master 🛡️' : 'جسمانی محافظ ماسٹر 🛡️';

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('bodydefender_highscore', score.toString());
      onEarnBadge(badgeName);
      triggerConfetti();
      playSound.playWinFanfare();
      speakText(isEn ? `New High Score! ${score} points! Congratulations!` : `[excited] نیا ہائی سکور! ${score} پوائنٹس! مبارک ہو!`, lang);
    } else {
      playSound.playWinFanfare();
      speakText(isEn ? `Game Over! You scored ${score} points!` : `[positive] گیم ختم! تم نے ${score} پوائنٹس حاصل کیے!`, lang);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-white font-sans pb-16 ${isEn ? 'dir-ltr' : 'dir-rtl'}`}>
      {/* Header Bar */}
      <div className="bg-slate-900 border-b-4 border-emerald-400 p-4 sticky top-0 z-20 flex items-center justify-between shadow-lg">
        <button
          onClick={onBackToHub}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-transform active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{isEn ? 'Games Hub' : 'گیمز ہب'}</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-emerald-500/20 border-2 border-emerald-400 px-3 py-1 rounded-full text-emerald-300 font-black text-sm">
            <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
            <span>{isEn ? `Score: ${score}` : `سکور: ${score}`}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-rose-500/20 border-2 border-rose-400 px-3 py-1 rounded-full text-rose-300 font-black text-sm">
            <Shield className="w-4 h-4 text-rose-400" />
            <span>{shields} {isEn ? 'Shields' : 'شیلڈز'}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-500/20 border-2 border-amber-400 px-3 py-1 rounded-full text-amber-300 font-black text-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Main Arena */}
      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-[2.5rem] bg-gradient-to-r from-emerald-600 to-teal-800 border-4 border-emerald-400 shadow-xl flex justify-between items-center">
          <div className="space-y-1 text-left md:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isEn ? 'Body Defender' : 'جسمانی محافظ (Body Defender)'}
            </h1>
            <p className="text-emerald-100 font-bold text-xs sm:text-sm">
              {isEn
                ? 'Categorize body parts into the correct zone (Safe / Ask / Never)!'
                : 'جسمانی حصوں کو صحیح زون (محفوظ / پوچھیں / کبھی نہیں) میں منتخب کریں!'}
            </p>
          </div>

          {multiplier > 1 && (
            <div className="bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-2xl border-2 border-white animate-bounce text-sm shadow-md">
              🔥 COMBO x{multiplier}!
            </div>
          )}
        </div>

        {/* Game Ready State */}
        {gameState === 'ready' && (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border-4 border-slate-800 text-center space-y-6 max-w-lg mx-auto shadow-2xl">
            <div className="text-6xl animate-pulse">🛡️</div>
            <h2 className="text-2xl font-black text-emerald-400">
              {isEn ? 'Defend Quickly!' : 'تیزی سے دفاع کریں!'}
            </h2>
            <p className="text-sm font-bold text-slate-300 leading-relaxed">
              {isEn
                ? 'Body parts will appear on screen. Categorize them into safe zones to protect your avatar:'
                : 'اسکرین پر مختلف جسمانی حصے آئیں گے، اپنے اوتار کی حفاظت کے لیے صحیح زون منتخب کریں:'}
            </p>

            <div className="grid grid-cols-3 gap-2 text-xs font-black">
              <div className="p-3 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 rounded-2xl">
                🟢 {isEn ? 'Safe' : 'محفوظ'}
              </div>
              <div className="p-3 bg-amber-500/20 border-2 border-amber-400 text-amber-300 rounded-2xl">
                🟡 {isEn ? 'Ask First' : 'پوچھیں'}
              </div>
              <div className="p-3 bg-rose-500/20 border-2 border-rose-400 text-rose-300 rounded-2xl">
                🔴 {isEn ? 'Never' : 'کبھی نہیں'}
              </div>
            </div>

            <button
              onClick={startGame}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-lg px-8 py-4 rounded-3xl border-4 border-white shadow-[0_6px_0_#059669] active:translate-y-1 active:shadow-none w-full"
            >
              {isEn ? 'Start Game' : 'کھیل شروع کریں'}
            </button>
          </div>
        )}

        {/* Playing State Action Stage */}
        {gameState === 'playing' && (
          <div className="bg-slate-900 rounded-[2.5rem] p-6 border-4 border-slate-800 relative min-h-[380px] flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Center Avatar Representation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-48 h-48 rounded-full bg-emerald-500/30 blur-2xl animate-pulse" />
            </div>

            <div className="relative z-10 text-center space-y-2">
              <div className="inline-block bg-slate-800 border-2 border-slate-700 px-4 py-1.5 rounded-full text-xs font-black text-amber-300">
                {isEn ? `High Score: ${highScore}` : `بہترین سکور: ${highScore}`}
              </div>
            </div>

            {/* Flying Part Target Box */}
            <div className="my-auto relative z-10 flex flex-col items-center justify-center min-h-[160px]">
              <AnimatePresence mode="wait">
                {activePart && (
                  <motion.div
                    key={activePart.id}
                    initial={{ scale: 0, y: -40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-amber-400 p-6 rounded-3xl text-center space-y-2 shadow-2xl min-w-[240px]"
                  >
                    <span className="text-6xl block">{activePart.icon}</span>
                    <h3 className="text-lg font-black text-white">
                      {isEn ? activePart.nameEng : activePart.nameUrdu}
                    </h3>
                    <p className="text-xs font-bold text-amber-300">
                      {isEn ? 'Which zone does this belong to?' : 'یہ کس زون میں جائے گا؟'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {feedback && (
                <div className={`mt-3 font-black text-sm ${feedback.color} animate-bounce`}>
                  {feedback.text}
                </div>
              )}
            </div>

            {/* 3 Zone Categorization Buttons */}
            <div className="grid grid-cols-3 gap-3 relative z-10">
              <button
                onClick={() => handleCategorize('green')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black p-4 rounded-3xl border-4 border-white shadow-[0_6px_0_#047857] active:translate-y-1 active:shadow-none flex flex-col items-center gap-1 text-sm"
              >
                <CheckCircle2 className="w-7 h-7 text-slate-950" />
                <span>🟢 {isEn ? 'Green Zone (Safe)' : 'سبز زون (Safe)'}</span>
              </button>

              <button
                onClick={() => handleCategorize('yellow')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black p-4 rounded-3xl border-4 border-white shadow-[0_6px_0_#D97706] active:translate-y-1 active:shadow-none flex flex-col items-center gap-1 text-sm"
              >
                <HelpCircle className="w-7 h-7 text-slate-950" />
                <span>🟡 {isEn ? 'Yellow Zone (Ask)' : 'پیلا زون (Ask)'}</span>
              </button>

              <button
                onClick={() => handleCategorize('red')}
                className="bg-rose-600 hover:bg-rose-500 text-white font-black p-4 rounded-3xl border-4 border-white shadow-[0_6px_0_#9F1239] active:translate-y-1 active:shadow-none flex flex-col items-center gap-1 text-sm"
              >
                <XCircle className="w-7 h-7 text-white" />
                <span>🔴 {isEn ? 'Red Zone (Never)' : 'سرخ زون (Never)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Game Over State */}
        {gameState === 'gameover' && (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border-4 border-amber-400 text-center space-y-6 max-w-md mx-auto shadow-2xl">
            <div className="text-6xl">🏆</div>
            <h2 className="text-2xl font-black text-amber-400">
              {isEn ? 'Game Over!' : 'کھیل ختم!'}
            </h2>
            <div className="p-4 bg-slate-800 rounded-2xl border-2 border-slate-700 space-y-2">
              <p className="text-sm font-bold text-slate-300">
                {isEn ? 'Your Final Score:' : 'تمہارا حتمی سکور:'}
              </p>
              <p className="text-3xl font-black text-emerald-400">{score} {isEn ? 'points' : 'پوائنٹس'}</p>
              <p className="text-xs text-amber-300 font-bold">
                {isEn ? `High Score: ${highScore}` : `ہائی سکور: ${highScore}`}
              </p>
            </div>

            <button
              onClick={startGame}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-lg px-8 py-4 rounded-3xl border-4 border-white shadow-[0_6px_0_#059669] active:translate-y-1 active:shadow-none w-full flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{isEn ? 'Play Again' : 'دوبارہ کھیلیں'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
