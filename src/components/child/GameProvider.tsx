import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChildProfile } from '../../types';
import { Sparkles, Trophy, Flame, Star, Globe } from 'lucide-react';

export interface GameState {
  score: number;
  streak: number;
  activeGameId: string;
  completedGames: string[];
  earnedBadges: string[];
  levelProgress: Record<string, number>;
  language: 'ur' | 'en';
}

export interface GameContextType {
  gameState: GameState;
  language: 'ur' | 'en';
  score: number;
  streak: number;
  activeGameId: string;
  earnedBadges: string[];
  completedGames: string[];
  addScore: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  awardBadge: (badgeName: string) => void;
  markGameCompleted: (gameId: string) => void;
  setActiveGameId: (gameId: string) => void;
  updateLevelProgress: (gameKey: string, level: number) => void;
  resetAllProgress: () => void;
  t: (englishText: string, urduText: string) => string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export interface GameProviderProps {
  profile: ChildProfile;
  onUpdateProfile?: (updatedProfile: ChildProfile) => void;
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({
  profile,
  onUpdateProfile,
  children,
}) => {
  const language = profile.language || 'ur';

  const [score, setScore] = useState<number>(() => {
    return (profile.earnedBadges?.length || 0) * 50 + (profile.completedGames?.length || 0) * 100;
  });

  const [streak, setStreak] = useState<number>(1);
  const [activeGameId, setActiveGameId] = useState<string>('hub');
  const [earnedBadges, setEarnedBadges] = useState<string[]>(profile.earnedBadges || []);
  const [completedGames, setCompletedGames] = useState<string[]>(profile.completedGames || []);
  const [levelProgress, setLevelProgress] = useState<Record<string, number>>({
    questLevel: 1,
    bodyDefender: 1,
    safeguardRun: 0,
    memoryKingdom: 1,
    doodleDefender: 1,
  });

  // Sync when profile prop changes
  useEffect(() => {
    if (profile.earnedBadges) {
      setEarnedBadges(profile.earnedBadges);
    }
    if (profile.completedGames) {
      setCompletedGames(profile.completedGames);
    }
  }, [profile.earnedBadges, profile.completedGames]);

  const addScore = (points: number) => {
    setScore((prev) => prev + points);
  };

  const incrementStreak = () => {
    setStreak((prev) => prev + 1);
  };

  const resetStreak = () => {
    setStreak(0);
  };

  const awardBadge = (badgeName: string) => {
    if (!earnedBadges.includes(badgeName)) {
      const updated = [...earnedBadges, badgeName];
      setEarnedBadges(updated);
      addScore(50);
      if (onUpdateProfile) {
        onUpdateProfile({
          ...profile,
          earnedBadges: updated,
        });
      }
    }
  };

  const markGameCompleted = (gameId: string) => {
    if (!completedGames.includes(gameId)) {
      const updated = [...completedGames, gameId];
      setCompletedGames(updated);
      addScore(100);
      if (onUpdateProfile) {
        onUpdateProfile({
          ...profile,
          completedGames: updated,
        });
      }
    }
  };

  const updateLevelProgress = (gameKey: string, level: number) => {
    setLevelProgress((prev) => ({
      ...prev,
      [gameKey]: level,
    }));
  };

  const resetAllProgress = () => {
    setScore(0);
    setStreak(0);
    setLevelProgress({
      questLevel: 1,
      bodyDefender: 1,
      safeguardRun: 0,
      memoryKingdom: 1,
      doodleDefender: 1,
    });
  };

  // Helper translation function based on child profile language state
  const t = (englishText: string, urduText: string): string => {
    return language === 'en' ? englishText : urduText;
  };

  const gameState: GameState = {
    score,
    streak,
    activeGameId,
    completedGames,
    earnedBadges,
    levelProgress,
    language,
  };

  const value: GameContextType = {
    gameState,
    language,
    score,
    streak,
    activeGameId,
    earnedBadges,
    completedGames,
    addScore,
    incrementStreak,
    resetStreak,
    awardBadge,
    markGameCompleted,
    setActiveGameId,
    updateLevelProgress,
    resetAllProgress,
    t,
  };

  return (
    <GameContext.Provider value={value}>
      <div className="game-provider-wrapper w-full">
        {/* Game State Header Bar / HUD Banner */}
        <div className="bg-gradient-to-r from-yellow-300 via-lime-400 to-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl shadow-md border-2 border-lime-300 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-black">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-black/15 backdrop-blur-md px-3 py-1 rounded-full border border-black/10">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
              <span>
                {language === 'en' ? 'Score' : 'اسکور'}: {score}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/15 backdrop-blur-md px-3 py-1 rounded-full border border-black/10">
              <Flame className="w-4 h-4 text-lime-800 fill-lime-400" />
              <span>
                {language === 'en' ? 'Streak' : 'تسلسل'}: {streak} 🔥
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
              <Trophy className="w-4 h-4 text-yellow-200" />
              <span>
                {language === 'en' ? 'Badges' : 'بیجز'}: {earnedBadges.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/30 px-2.5 py-1 rounded-full border border-white/40 text-[11px] uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'English Mode 🇬🇧' : 'اردو موڈ 🇵🇰'}</span>
            </div>
          </div>
        </div>

        {children}
      </div>
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
