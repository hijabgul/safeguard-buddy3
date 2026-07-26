import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChildProfile } from '../../../types';
import { speakText } from '../../../utils/speech';
import { playSound } from '../../../utils/soundEffects';
import { triggerConfetti } from '../../../utils/confetti';
import {
  Flower2,
  ArrowLeft,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface MemoryKingdomProps {
  profile: ChildProfile;
  onEarnBadge: (badgeName: string) => void;
  onBackToHub: () => void;
}

interface KingdomScenario {
  id: number;
  locationNameUrdu: string;
  locationNameEng: string;
  speaker: 'Prince Ali' | 'Princess Ayesha';
  questionUrdu: string;
  questionEng: string;
  options: {
    id: string;
    icon: string;
    titleUrdu: string;
    titleEng: string;
    isCorrect: boolean;
    explanationUrdu: string;
    explanationEng: string;
  }[];
}

const KINGDOM_SCENARIOS: KingdomScenario[] = [
  {
    id: 1,
    locationNameUrdu: 'شاہی محل کا گیٹ',
    locationNameEng: 'Royal Palace Gate',
    speaker: 'Prince Ali',
    questionUrdu: 'شہزادے علی نے گیٹ پر ایک اجنبی کو تحفہ دیتے دیکھا، کیا اسے لینا چاہیے؟',
    questionEng: 'Prince Ali saw a stranger offering a gift at the palace gate. Should he accept it?',
    options: [
      {
        id: 'a',
        icon: '🎁',
        titleUrdu: 'تحفہ لے لیں',
        titleEng: 'Accept the Gift',
        isCorrect: false,
        explanationUrdu: 'اجنبی کا تحفہ نہیں لینا چاہیے، انکار کریں۔',
        explanationEng: 'Do not take gifts from strangers, say NO.'
      },
      {
        id: 'b',
        icon: '🛡️',
        titleUrdu: 'انکار کریں اور گارڈ کو بتائیں',
        titleEng: 'Refuse & Tell Guard',
        isCorrect: true,
        explanationUrdu: 'بالکل درست! اجنبی سے تحفہ نہ لیں اور گارڈ کو بتائیں۔',
        explanationEng: 'Exactly right! Refuse gifts from strangers and inform the guard.'
      }
    ]
  },
  {
    id: 2,
    locationNameUrdu: 'شاہی باغ',
    locationNameEng: 'Royal Garden',
    speaker: 'Princess Ayesha',
    questionUrdu: 'شہزادی عائشہ سے ایک چوکیدار نے کہا کہ یہ راز امی سے چھپانا، کیا راز چھپائیں؟',
    questionEng: 'A guard asked Princess Ayesha to keep a secret from Mom. Should she keep it?',
    options: [
      {
        id: 'a',
        icon: '🤫',
        titleUrdu: 'راز چھپا لیں',
        titleEng: 'Keep the Secret',
        isCorrect: false,
        explanationUrdu: 'ڈرانے والے برے راز کبھی امی سے نہیں چھپاتے۔',
        explanationEng: 'Scary bad secrets should never be hidden from parents.'
      },
      {
        id: 'b',
        icon: '📢',
        titleUrdu: 'ملکہ امی کو فوراً بتائیں',
        titleEng: 'Tell Queen Mom Immediately',
        isCorrect: true,
        explanationUrdu: 'زبردست! تمام باتیں ملکہ امی کو فوراً بتانی چاہئیں۔',
        explanationEng: 'Awesome! Tell Queen Mom immediately.'
      }
    ]
  },
  {
    id: 3,
    locationNameUrdu: 'بادشاہ کا دربار',
    locationNameEng: 'King\'s Court',
    speaker: 'Prince Ali',
    questionUrdu: 'اگر کوئی تمہار ڈریس کے اندر چھونے کی کوشش کرے تو کیا کرنا چاہیے؟',
    questionEng: 'If someone tries to touch under your clothes, what should you do?',
    options: [
      {
        id: 'a',
        icon: '📢',
        titleUrdu: 'اونچی آواز میں "نہیں" بولو اور بھاگو',
        titleEng: 'Yell "NO!" and Run Away',
        isCorrect: true,
        explanationUrdu: 'شاباش! اونچی آواز میں "نہیں" کہیں اور فوراً امی کے پاس جائیں!',
        explanationEng: 'Bravo! Shout "NO!" loudly and run to Mom immediately!'
      },
      {
        id: 'b',
        icon: '🤐',
        titleUrdu: 'خاموش رہیں',
        titleEng: 'Stay Silent',
        isCorrect: false,
        explanationUrdu: 'خاموش نہیں رہنا! اپنی بہادر آواز بلند کریں۔',
        explanationEng: 'Do not stay silent! Use your brave loud voice.'
      }
    ]
  }
];

export const MemoryKingdom: React.FC<MemoryKingdomProps> = ({
  profile,
  onEarnBadge,
  onBackToHub
}) => {
  const isEn = profile.language === 'en';
  const lang = profile.language || 'ur';

  const [currentIdx, setCurrentIdx] = useState(0);
  const [bloomedFlowers, setBloomedFlowers] = useState(0);
  const [, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; textUrdu: string; textEng: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const scenario = KINGDOM_SCENARIOS[currentIdx];

  const handleSelectOption = (opt: KingdomScenario['options'][0]) => {
    setSelectedOptionId(opt.id);

    if (opt.isCorrect) {
      playSound.playWinFanfare();
      triggerConfetti();
      setBloomedFlowers((prev) => prev + 1);
      setFeedback({
        isCorrect: true,
        textUrdu: opt.explanationUrdu,
        textEng: opt.explanationEng
      });

      const exp = isEn ? opt.explanationEng : opt.explanationUrdu;
      speakText(isEn ? `Bravo! ${exp}` : `[excited] شاباش! ${exp}`, lang);

      setTimeout(() => {
        if (currentIdx < KINGDOM_SCENARIOS.length - 1) {
          setCurrentIdx(currentIdx + 1);
          setSelectedOptionId(null);
          setFeedback(null);
        } else {
          setIsCompleted(true);
          const badgeName = isEn ? 'Kingdom Guardian 👑' : 'شاہی سلطنت کا محافظ 👑';
          onEarnBadge(badgeName);
        }
      }, 2200);
    } else {
      playSound.playGentleBump();
      setFeedback({
        isCorrect: false,
        textUrdu: opt.explanationUrdu,
        textEng: opt.explanationEng
      });
      const exp = isEn ? opt.explanationEng : opt.explanationUrdu;
      speakText(isEn ? exp : `[gentle] ${exp}`, lang);
    }
  };

  const restartGame = () => {
    setCurrentIdx(0);
    setBloomedFlowers(0);
    setSelectedOptionId(null);
    setFeedback(null);
    setIsCompleted(false);
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-white font-sans pb-16 ${isEn ? 'dir-ltr' : 'dir-rtl'}`}>
      {/* Header */}
      <div className="bg-slate-900 border-b-4 border-purple-400 p-4 sticky top-0 z-20 flex items-center justify-between shadow-lg">
        <button
          onClick={onBackToHub}
          className="bg-purple-500 hover:bg-purple-600 text-white font-black px-4 py-2 rounded-2xl flex items-center gap-2 shadow-md transition-transform active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{isEn ? 'Games Hub' : 'گیمز ہب'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-purple-500/20 border-2 border-purple-400 px-3 py-1 rounded-full text-purple-300 font-black text-sm">
            <Flower2 className="w-4 h-4 text-purple-400" />
            <span>{bloomedFlowers} {isEn ? 'Bloomed Flowers' : 'کھلے پھول'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-[2.5rem] bg-gradient-to-r from-purple-600 to-indigo-800 border-4 border-purple-400 shadow-xl flex justify-between items-center">
          <div className="space-y-1 text-left md:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isEn ? 'Memory Kingdom' : 'یادداشت کی سلطنت (Memory Kingdom)'}
            </h1>
            <p className="text-purple-100 font-bold text-xs sm:text-sm">
              {isEn
                ? 'Help Princess Ayesha and Prince Ali remember kingdom safety rules!'
                : 'پرنس علی اور شہزادی عائشہ کو سلطنت کے حفاظتی اصول یاد دلائیں!'}
            </p>
          </div>
          <div className="text-4xl animate-pulse">👑</div>
        </div>

        {!isCompleted ? (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border-4 border-slate-800 text-center space-y-6 max-w-xl mx-auto shadow-2xl">
            {/* Location Tag */}
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border-2 border-purple-400 px-4 py-1.5 rounded-full text-purple-300 font-black text-xs">
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? scenario.locationNameEng : scenario.locationNameUrdu}</span>
            </div>

            {/* Question Card */}
            <div className="bg-slate-800 border-2 border-purple-400/60 p-6 rounded-3xl space-y-3">
              <div className="text-4xl">{scenario.speaker === 'Prince Ali' ? '🤴' : '👸'}</div>
              <h2 className="text-lg font-black text-amber-300">
                {isEn ? scenario.questionEng : scenario.questionUrdu}
              </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scenario.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  className="p-5 bg-slate-800 hover:bg-slate-700 rounded-3xl border-4 border-slate-700 hover:border-purple-400 text-left md:text-left space-y-2 transition-all shadow-md active:scale-95"
                >
                  <span className="text-3xl block">{opt.icon}</span>
                  <div className="font-black text-sm text-white">
                    {isEn ? opt.titleEng : opt.titleUrdu}
                  </div>
                </button>
              ))}
            </div>

            {feedback && (
              <div className={`p-4 rounded-2xl font-black text-sm border-2 ${feedback.isCorrect ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-rose-500/20 border-rose-400 text-rose-300'}`}>
                {isEn ? feedback.textEng : feedback.textUrdu}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border-4 border-amber-400 text-center space-y-6 max-w-md mx-auto shadow-2xl">
            <div className="text-6xl animate-bounce">🏰</div>
            <h2 className="text-2xl font-black text-amber-400">
              {isEn ? 'Kingdom Saved!' : 'سلطنت محفوظ ہو گئی!'}
            </h2>
            <p className="text-sm font-bold text-slate-300 leading-relaxed">
              {isEn
                ? 'You successfully reminded everyone of all the safety rules! The kingdom garden is blooming with beautiful flowers!'
                : 'تم نے تمام اصول کامیابی سے یاد دلا دیے۔ سلطنت کا باغ پھولوں سے مہک اٹھا!'}
            </p>

            <button
              onClick={restartGame}
              className="bg-purple-500 hover:bg-purple-400 text-white font-black text-lg px-8 py-4 rounded-3xl border-4 border-white shadow-[0_6px_0_#7E22CE] active:translate-y-1 active:shadow-none w-full flex items-center justify-center gap-2"
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
