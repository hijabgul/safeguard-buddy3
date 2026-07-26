import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChildProfile } from '../../../types';
import { speakText, stopSpeech } from '../../../utils/speech';
import { playSound } from '../../../utils/soundEffects';
import { triggerConfetti } from '../../../utils/confetti';
import {
  Shield,
  Star,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';

interface SafeguardRunProps {
  profile: ChildProfile;
  onEarnBadge: (badgeName: string) => void;
  onBackToHub: () => void;
}

type Lane = 0 | 1 | 2; // 0 = Left, 1 = Center, 2 = Right

interface RunnerEntity {
  id: string;
  type: 'star' | 'shield' | 'boost' | 'car' | 'dog' | 'candy' | 'stranger';
  lane: Lane;
  yPosition: number; // 0% top to 100% bottom
}

export const SafeguardRun: React.FC<SafeguardRunProps> = ({
  profile,
  onEarnBadge,
  onBackToHub
}) => {
  const isEn = profile.language === 'en';
  const lang = profile.language || 'ur';

  const [gameState, setGameState] = useState<'ready' | 'running' | 'gameover'>('ready');
  const [lane, setLane] = useState<Lane>(1);
  const [isJumping, setIsJumping] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hasShield, setHasShield] = useState(false);
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [distance, setDistance] = useState(0);

  const [entities, setEntities] = useState<RunnerEntity[]>([]);
  const [tipMessage, setTipMessage] = useState<string | null>(null);

  // Refs to prevent stale closure bugs in intervals & callbacks
  const laneRef = React.useRef<Lane>(lane);
  useEffect(() => { laneRef.current = lane; }, [lane]);

  const isJumpingRef = React.useRef(isJumping);
  useEffect(() => { isJumpingRef.current = isJumping; }, [isJumping]);

  const isSlidingRef = React.useRef(isSliding);
  useEffect(() => { isSlidingRef.current = isSliding; }, [isSliding]);

  const hasShieldRef = React.useRef(hasShield);
  useEffect(() => { hasShieldRef.current = hasShield; }, [hasShield]);

  const isBoostActiveRef = React.useRef(isBoostActive);
  useEffect(() => { isBoostActiveRef.current = isBoostActive; }, [isBoostActive]);

  const scoreRef = React.useRef(0);
  const itemsScoreRef = React.useRef(0);
  const distanceRef = React.useRef(0);
  const processedEntitiesRef = React.useRef<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('safeguardrun_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (gameState !== 'running') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLaneLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveLaneRight();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        handleJump();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        handleSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, lane]);

  // Main Runner Loop
  useEffect(() => {
    if (gameState !== 'running') return;

    const gameInterval = setInterval(() => {
      distanceRef.current += 1;
      setDistance(distanceRef.current);

      // Only give distance points if items have been collected
      if (itemsScoreRef.current > 0) {
        scoreRef.current = itemsScoreRef.current + Math.floor(distanceRef.current / 10);
        setScore(scoreRef.current);
      }

      setEntities((prevEntities) => {
        const next: RunnerEntity[] = [];

        prevEntities.forEach((ent) => {
          const newY = ent.yPosition + (isBoostActiveRef.current ? 12 : 8);
          
          // Check collision zone
          if (
            newY >= 75 &&
            newY <= 90 &&
            ent.lane === laneRef.current &&
            !processedEntitiesRef.current.has(ent.id)
          ) {
            processedEntitiesRef.current.add(ent.id);
            handleCollision(ent);
            // Collectible items disappear on collision
            if (ent.type === 'star' || ent.type === 'shield' || ent.type === 'boost') {
              return;
            }
          }

          if (newY <= 100) {
            next.push({ ...ent, yPosition: newY });
          }
        });

        return next;
      });

      if (Math.random() < 0.22) {
        spawnRandomEntity();
      }
    }, 150);

    return () => clearInterval(gameInterval);
  }, [gameState]);

  const startGame = () => {
    stopSpeech();
    scoreRef.current = 0;
    itemsScoreRef.current = 0;
    distanceRef.current = 0;
    processedEntitiesRef.current.clear();

    setScore(0);
    setDistance(0);
    setLane(1);
    setHasShield(false);
    setIsBoostActive(false);
    setEntities([]);
    setTipMessage(null);
    setGameState('running');

    speakText(isEn ? 'Run started! Collect stars and dodge danger!' : '[excited] دوڑ شروع ہو گئی! ستارے جمع کرو اور خطرات سے بچو!', lang);
  };

  const spawnRandomEntity = () => {
    const randomLane: Lane = (Math.floor(Math.random() * 3)) as Lane;
    const types: RunnerEntity['type'][] = ['star', 'star', 'shield', 'car', 'dog', 'candy', 'stranger'];
    const selectedType = types[Math.floor(Math.random() * types.length)];

    const newEnt: RunnerEntity = {
      id: `ent-${Date.now()}-${Math.random()}`,
      type: selectedType,
      lane: randomLane,
      yPosition: 0
    };

    setEntities((prev) => [...prev.slice(-7), newEnt]);
  };

  const handleCollision = (ent: RunnerEntity) => {
    if (ent.type === 'star') {
      playSound.playStarCollect();
      itemsScoreRef.current += 25;
      scoreRef.current = itemsScoreRef.current + Math.floor(distanceRef.current / 10);
      setScore(scoreRef.current);
      showTip(isEn ? '🌟 Star collected! Safety comes first!' : '🌟 ستارہ جمع ہوا! اپنی حفاظت سب سے اہم ہے!');
    } else if (ent.type === 'shield') {
      playSound.playShieldPowerup();
      itemsScoreRef.current += 10;
      scoreRef.current = itemsScoreRef.current + Math.floor(distanceRef.current / 10);
      setScore(scoreRef.current);
      hasShieldRef.current = true;
      setHasShield(true);
      showTip(isEn ? '🛡️ Protector Shield active!' : '🛡️ محافظ شیلڈ آن ہو گئی!');
    } else if (ent.type === 'boost') {
      playSound.playCombo();
      itemsScoreRef.current += 15;
      scoreRef.current = itemsScoreRef.current + Math.floor(distanceRef.current / 10);
      setScore(scoreRef.current);
      isBoostActiveRef.current = true;
      setIsBoostActive(true);
      setTimeout(() => {
        isBoostActiveRef.current = false;
        setIsBoostActive(false);
      }, 3000);
      showTip(isEn ? '🚀 Speed Boost!' : '🚀 سپیڈ بوسٹ!');
    } else {
      // Danger / Obstacle (car, dog, stranger, candy)
      if (isJumpingRef.current || isSlidingRef.current) {
        playSound.playJump();
        showTip(isEn ? '✨ Awesome! Jumped over danger!' : '✨ زبردست! خطرے کے اوپر سے چھلانگ لگائی!');
        return;
      }

      if (hasShieldRef.current) {
        playSound.playGentleBump();
        hasShieldRef.current = false;
        setHasShield(false);
        showTip(isEn ? '🛡️ Shield saved you from danger!' : '🛡️ شیلڈ نے تمہیں خطرے سے بچا لیا!');
      } else {
        // Crashed without shield
        const finalScore = itemsScoreRef.current === 0 ? 0 : scoreRef.current;
        endGame(finalScore);
      }
    }
  };

  const showTip = (text: string) => {
    setTipMessage(text);
    setTimeout(() => setTipMessage(null), 2500);
  };

  const handleJump = () => {
    if (isJumpingRef.current) return;
    playSound.playJump();
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
  };

  const handleSlide = () => {
    if (isSlidingRef.current) return;
    setIsSliding(true);
    setTimeout(() => setIsSliding(false), 500);
  };

  const moveLaneLeft = () => {
    if (laneRef.current > 0) setLane((prev) => (prev - 1) as Lane);
  };

  const moveLaneRight = () => {
    if (laneRef.current < 2) setLane((prev) => (prev + 1) as Lane);
  };

  const endGame = (finalScore: number) => {
    stopSpeech();
    setGameState('gameover');
    setScore(finalScore);
    scoreRef.current = finalScore;

    const badgeName = isEn ? 'Run Champion 🏃' : 'دوڑ کا چیمپئن 🏃';

    if (finalScore > 0 && finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('safeguardrun_highscore', finalScore.toString());
      onEarnBadge(badgeName);
      triggerConfetti();
      playSound.playWinFanfare();
      const msg = isEn
        ? `New High Score! You scored ${finalScore} points! Congratulations!`
        : `نیا ہائی سکور! آپ نے ${finalScore} پوائنٹس بنائے! مبارک ہو!`;
      speakText(msg, lang);
    } else if (finalScore > 0) {
      playSound.playWinFanfare();
      const msg = isEn
        ? `Run finished! You scored ${finalScore} points!`
        : `دوڑ ختم! آپ نے ${finalScore} پوائنٹس بنائے!`;
      speakText(msg, lang);
    } else {
      playSound.playGentleBump();
      const msg = isEn
        ? `Watch out for obstacles! You scored 0 points. Collect stars and try again!`
        : `گاڑی سے ٹکر ہو گئی! احتیاط کریں، ستارے جمع کریں اور دوبارہ کوشش کریں!`;
      speakText(msg, lang);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-white font-sans pb-16 ${isEn ? 'dir-ltr' : 'dir-rtl'}`}>
      {/* Header Bar */}
      <div className="bg-slate-900 border-b-4 border-amber-400 p-4 sticky top-0 z-20 flex items-center justify-between shadow-lg">
        <button
          onClick={onBackToHub}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-transform active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{isEn ? 'Games Hub' : 'گیمز ہب'}</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-amber-500/20 border-2 border-amber-400 px-3 py-1 rounded-full text-amber-300 font-black text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{isEn ? `Score: ${score}` : `سکور: ${score}`}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-cyan-500/20 border-2 border-cyan-400 px-3 py-1 rounded-full text-cyan-300 font-black text-sm">
            <span>{distance}m {isEn ? 'run' : 'دوڑ'}</span>
          </div>
        </div>
      </div>

      {/* Main Track Arena */}
      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-[2.5rem] bg-gradient-to-r from-lime-400 via-emerald-500 to-teal-600 border-4 border-lime-300 shadow-xl flex justify-between items-center text-slate-950">
          <div className="space-y-1 text-left md:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isEn ? 'Safeguard Run' : 'حفاظتی دوڑ (Safeguard Run)'}
            </h1>
            <p className="text-amber-100 font-bold text-xs sm:text-sm">
              {isEn
                ? 'Run fast, collect stars, and jump over obstacles!'
                : 'تیز بھاگیں، ستارے جمع کریں اور خطرات کے اوپر سے چھلانگ لگائیں!'}
            </p>
          </div>

          {hasShield && (
            <div className="bg-emerald-500 text-white font-black px-3 py-1.5 rounded-2xl border-2 border-white flex items-center gap-1 text-xs">
              <Shield className="w-4 h-4 fill-white" />
              <span>{isEn ? 'Shield Active' : 'شیلڈ آن'}</span>
            </div>
          )}
        </div>

        {/* Ready State */}
        {gameState === 'ready' && (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border-4 border-slate-800 text-center space-y-6 max-w-lg mx-auto shadow-2xl">
            <div className="text-6xl animate-bounce">🏃</div>
            <h2 className="text-2xl font-black text-amber-400">
              {isEn ? 'Ready? Let\'s Go!' : 'تیار ہو؟ چلو!'}
            </h2>
            <p className="text-sm font-bold text-slate-300 leading-relaxed">
              {isEn
                ? 'Collect stars across all 3 lanes, dodge cars and stranger candy!'
                : 'تمام 3 راستوں پر ستارے جمع کریں، گاڑیوں اور اجنبی کینڈی سے بچ کر دوڑیں!'}
            </p>

            <button
              onClick={startGame}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-lg px-8 py-4 rounded-3xl border-4 border-white shadow-[0_6px_0_#D97706] active:translate-y-1 active:shadow-none w-full"
            >
              {isEn ? 'Start Running' : 'دوڑ شروع کریں'}
            </button>
          </div>
        )}

        {/* Running Track View */}
        {gameState === 'running' && (
          <div className="bg-slate-900 rounded-[2.5rem] p-4 border-4 border-slate-800 relative min-h-[420px] flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* 3 Lane Grid Background */}
            <div className="absolute inset-0 grid grid-cols-3 divide-x divide-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
              <div className="h-full border-r border-dashed border-amber-400/20" />
              <div className="h-full border-r border-dashed border-amber-400/20" />
              <div className="h-full" />
            </div>

            {/* Tip Message Pop-up */}
            {tipMessage && (
              <div className="relative z-20 bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-full text-center text-xs border-2 border-white shadow-md animate-bounce max-w-sm mx-auto">
                {tipMessage}
              </div>
            )}

            {/* Entity Rendering */}
            <div className="relative z-10 h-72 w-full my-auto">
              {entities.map((ent) => {
                const laneLeftPct = ent.lane === 0 ? '16%' : ent.lane === 1 ? '50%' : '83%';
                return (
                  <div
                    key={ent.id}
                    style={{
                      left: laneLeftPct,
                      top: `${ent.yPosition}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="absolute text-3xl font-black transition-all"
                  >
                    {ent.type === 'star' && '⭐'}
                    {ent.type === 'shield' && '🛡️'}
                    {ent.type === 'boost' && '🚀'}
                    {ent.type === 'car' && '🚗'}
                    {ent.type === 'dog' && '🐕'}
                    {ent.type === 'candy' && '🍬'}
                    {ent.type === 'stranger' && '👤'}
                  </div>
                );
              })}

              {/* Player Runner Avatar */}
              <motion.div
                animate={{
                  left: lane === 0 ? '16%' : lane === 1 ? '50%' : '83%',
                  y: isJumping ? -40 : isSliding ? 20 : 0
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="absolute top-[82%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-amber-400 border-4 border-white flex items-center justify-center text-3xl shadow-2xl z-20"
              >
                <span>{profile.avatar.icon}</span>
              </motion.div>
            </div>

            {/* Controls Bar */}
            <div className="relative z-20 grid grid-cols-4 gap-2 pt-2">
              <button
                onClick={moveLaneLeft}
                className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl font-black border-2 border-slate-600 shadow-md active:bg-amber-500 text-xs sm:text-sm"
              >
                ◀️ {isEn ? 'Left Lane' : 'بایاں راستہ'}
              </button>

              <button
                onClick={handleJump}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 p-4 rounded-2xl font-black border-2 border-white shadow-md active:bg-amber-500 text-xs sm:text-sm"
              >
                ⬆️ {isEn ? 'Jump' : 'چھلانگ'}
              </button>

              <button
                onClick={handleSlide}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 p-4 rounded-2xl font-black border-2 border-white shadow-md active:bg-amber-500 text-xs sm:text-sm"
              >
                ⬇️ {isEn ? 'Slide' : 'سلائیڈ'}
              </button>

              <button
                onClick={moveLaneRight}
                className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl font-black border-2 border-slate-600 shadow-md active:bg-amber-500 text-xs sm:text-sm"
              >
                {isEn ? 'Right Lane' : 'داہنا راستہ'} ▶️
              </button>
            </div>
          </div>
        )}

        {/* Game Over */}
        {gameState === 'gameover' && (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border-4 border-amber-400 text-center space-y-6 max-w-md mx-auto shadow-2xl">
            <div className="text-6xl">🏆</div>
            <h2 className="text-2xl font-black text-amber-400">
              {isEn ? 'Run Complete!' : 'دوڑ مکمل!'}
            </h2>
            <div className="p-4 bg-slate-800 rounded-2xl border-2 border-slate-700 space-y-2">
              <p className="text-sm font-bold text-slate-300">
                {isEn ? 'Score Earned:' : 'حاصل کردہ سکور:'}
              </p>
              <p className="text-3xl font-black text-amber-400">{score} {isEn ? 'points' : 'پوائنٹس'}</p>
              <p className="text-xs text-slate-400 font-bold">
                {isEn ? `High Score: ${highScore}` : `ہائی سکور: ${highScore}`}
              </p>
            </div>

            <button
              onClick={startGame}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-lg px-8 py-4 rounded-3xl border-4 border-white shadow-[0_6px_0_#D97706] active:translate-y-1 active:shadow-none w-full flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{isEn ? 'Run Again' : 'دوبارہ دوڑیں'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
