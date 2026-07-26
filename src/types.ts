export type AgeBracket = '2-5' | '5-8' | '8-10';

export interface AvatarOption {
  id: string;
  nameUrdu: string;
  nameEnglish: string;
  icon: string; // Emoji or visual representation
  color: string; // Tailwind background color string
  descriptionUrdu: string;
  avatarBg: string;
}

export interface ChildProfile {
  id: string;
  nickname: string;
  ageBracket: AgeBracket;
  avatar: AvatarOption;
  trustedAdults: string[];
  completedGames: string[];
  earnedBadges: string[];
  createdAt: number;
  language: 'ur' | 'en';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'salam';
  text: string;
  timestamp: number;
  tone?: 'warm' | 'gentle' | 'encouraging' | 'slow';
  distressFlag?: boolean;
}

export interface DistressAlert {
  id: string;
  timestamp: number;
  childNickname: string;
  ageBracket: AgeBracket;
  triggerWord: string;
  contextMessage: string;
  salamResponse: string;
  status: 'active' | 'resolved';
}

export interface TouchScenario {
  id: string;
  titleUrdu: string;
  titleEnglish: string;
  descriptionUrdu: string;
  descriptionEnglish: string;
  icon: string;
  isSafe: boolean;
  explanationUrdu: string;
  explanationEnglish: string;
  category: 'family' | 'doctor' | 'stranger' | 'secret';
}

export interface StrangerScenario {
  id: string;
  titleUrdu: string;
  titleEnglish: string;
  situationUrdu: string;
  situationEnglish: string;
  options: {
    id: string;
    textUrdu: string;
    textEnglish: string;
    isCorrect: boolean;
    feedbackUrdu: string;
    feedbackEnglish?: string;
  }[];
}

export interface SecretItem {
  id: string;
  titleUrdu: string;
  titleEnglish: string;
  descriptionUrdu: string;
  descriptionEnglish?: string;
  isGoodSecret: boolean; // Good surprise vs bad scary secret
  explanationUrdu: string;
  explanationEnglish?: string;
  icon: string;
}

export interface HelplineInfo {
  nameUrdu: string;
  nameEnglish: string;
  number: string;
  descriptionUrdu: string;
  descriptionEnglish: string;
  category: 'child' | 'police' | 'rescue' | 'cyber';
  badgeColor: string;
}

export interface SafetyWord {
  id: string;
  wordUrdu: string;
  wordRoman: string;
  wordEnglish: string;
  meaningUrdu: string;
  meaningEnglish: string;
  icon: string;
  category: 'touch' | 'boundaries' | 'trusted' | 'feelings';
  badgeColor: string;
}
