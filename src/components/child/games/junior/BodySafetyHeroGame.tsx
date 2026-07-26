import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Award, ArrowLeft, Shield, Heart, CheckCircle2, Megaphone, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakText } from '../../../../utils/speech';
import { playSound } from '../../../../utils/soundEffects';

interface BodySafetyHeroGameProps {
  onEarnBadge: (badgeName: string) => void;
  language: 'ur' | 'en';
}

export const BodySafetyHeroGame: React.FC<BodySafetyHeroGameProps> = ({
  onEarnBadge,
  language,
}) => {
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState<'greetings' | 'shout_no' | 'trusted_adults' | 'swimsuit_rule'>('greetings');
  const [shields, setShields] = useState(0);
  const [stickers, setStickers] = useState<string[]>([]);
  const [selectedGreeting, setSelectedGreeting] = useState<string | null>(null);
  const [shoutCount, setShoutCount] = useState(0);
  const [trustedAdultSelected, setTrustedAdultSelected] = useState<string | null>(null);
  const [swimsuitPartSelected, setSwimsuitPartSelected] = useState<string | null>(null);

  // Greeting Choices
  const greetings = [
    {
      id: 'high_five',
      icon: '✋',
      nameEn: 'High Five',
      nameUrdu: 'ہائی فائیو (ہاتھ ملانا)',
      isSafe: true,
      feedbackEn: 'Awesome! High five is a super fun and safe greeting choice!',
      feedbackUrdu: 'شاباش! ہائی فائیو ایک بہت مزیدار اور محفوظ سلام ہے!',
    },
    {
      id: 'fist_bump',
      icon: '👊',
      nameEn: 'Fist Bump',
      nameUrdu: 'فِسٹ بمپ (مٹھی ملانا)',
      isSafe: true,
      feedbackEn: 'Cool! Fist bumps are totally awesome and safe!',
      feedbackUrdu: 'بہت زبردست! مٹھی ملانا بالکل محفوظ اور زبردست ہے!',
    },
    {
      id: 'wave',
      icon: '👋',
      nameEn: 'Friendly Wave',
      nameUrdu: 'ہاتھ ہلانا (Wave)',
      isSafe: true,
      feedbackEn: 'Great! Waving with a big smile is always polite and safe!',
      feedbackUrdu: 'بہت خوب! مسکرا کر ہاتھ ہلانا ہمیشہ ادب اور تحفظ کی نشانی ہے!',
    },
    {
      id: 'forced_hug',
      icon: '🫂',
      nameEn: 'Forced Hug',
      nameUrdu: 'زبردستی گلے ملنا',
      isSafe: false,
      feedbackEn: 'You do NOT have to hug if you feel uncomfortable! High-five or wave instead!',
      feedbackUrdu: 'اگر آپ کا دل نہ چاہے تو زبردستی گلے ملنا ضروری نہیں! آپ ہائی فائیو یا ہاتھ ہلا سکتے ہیں!',
    },
  ];

  // Trusted Adults Choices
  const adults = [
    {
      id: 'parents',
      icon: '👨‍👩‍👧',
      titleEn: 'Mom & Dad',
      titleUrdu: 'امی اور ابو',
      isTrusted: true,
      feedbackEn: 'Yes! Parents are your number 1 trusted adults who love and protect you!',
      feedbackUrdu: 'جی ہاں! امی ابو آپ کے سب سے بڑے اور محفوظ دوست ہیں!',
    },
    {
      id: 'teacher',
      icon: '👩‍🏫',
      titleEn: 'School Teacher',
      titleUrdu: 'اسکول کی ٹیچر',
      isTrusted: true,
      feedbackEn: 'Correct! Teachers in school are safe and always ready to help you!',
      feedbackUrdu: 'بالکل درست! اسکول کی ٹیچر آپ کی مدد کے لیے ہمیشہ تیار رہتی ہیں!',
    },
    {
      id: 'police',
      icon: '👮‍♂️',
      titleEn: 'Police Officer',
      titleUrdu: 'پولیس آفیسر',
      isTrusted: true,
      feedbackEn: 'Super! Uniformed police officers are safe helpers when you are lost or need help!',
      feedbackUrdu: 'زبردست! پولیس آفیسر آپ کو محفوظ رکھنے کے لیے ہمیشہ مدد کرتے ہیں!',
    },
    {
      id: 'stranger',
      icon: '👤',
      titleEn: 'Unknown Stranger',
      titleUrdu: 'نامعلوم اجنبی',
      isTrusted: false,
      feedbackEn: 'Strangers are not trusted adults yet. Always go to parents, teachers, or police instead!',
      feedbackUrdu: 'اجنبی پر بھروسہ نہ کریں۔ ہمیشہ والدین، ٹیچر یا پولیس گارڈ کی مدد لیں!',
    },
  ];

  // Swimsuit Rule Zones
  const swimsuitZones = [
    {
      id: 'chest',
      icon: '👕',
      titleEn: 'Chest Area',
      titleUrdu: 'سینہ کا حصہ',
      descEn: 'Private area covered by swimsuit. Nobody should touch or look at it!',
      descUrdu: 'سوئم سوٹ سے ڈھکا ہوا نجی حصہ! کسی کو دیکھنے یا چھونے کی اجازت نہیں!',
    },
    {
      id: 'bottom',
      icon: '🩳',
      titleEn: 'Private Bottoms',
      titleUrdu: 'سوئم سوٹ کا نجی حصہ',
      descEn: 'Strictly private area! If anyone tries to touch or see it, say NO loudly and tell parents!',
      descUrdu: 'مکمل نجی حصہ! اگر کوئی چھونے کی کوشش کرے تو "نہیں!" بولیں اور امی ابو کو بتائیں!',
    },
  ];

  const handleSelectGreeting = (g: typeof greetings[0]) => {
    setSelectedGreeting(g.id);
    const msg = isEn ? g.feedbackEn : g.feedbackUrdu;
    speakText(msg, language);
    if (g.isSafe) {
      playSound.playShieldPowerup();
      setShields((s) => s + 1);
    } else {
      playSound.playCorrect();
    }
  };

  const handleShoutNo = () => {
    setShoutCount((c) => c + 1);
    playSound.playJump();
    const shoutMsg = isEn ? 'NO! My Body Belongs To ME!' : 'نہیں! میرا جسم میری ملکیت ہے!';
    speakText(shoutMsg, language);

    if (shoutCount + 1 >= 3) {
      playSound.playCelebration();
      setShields((s) => s + 2);
      if (!stickers.includes('📢 Hero Loud Voice Sticker')) {
        setStickers((prev) => [...prev, '📢 Hero Loud Voice Sticker']);
        onEarnBadge(isEn ? 'Body Safety Hero Shield 🛡️' : 'باڈی سیفٹی ہیرو شیلڈ 🛡️');
      }
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleSelectAdult = (a: typeof adults[0]) => {
    setTrustedAdultSelected(a.id);
    const msg = isEn ? a.feedbackEn : a.feedbackUrdu;
    speakText(msg, language);
    if (a.isTrusted) {
      playSound.playShieldPowerup();
      setShields((s) => s + 1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-5 sm:p-7 max-w-3xl mx-auto border-4 border-emerald-200 shadow-2xl font-sans space-y-6">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 rounded-3xl p-6 text-white shadow-xl border-4 border-emerald-300 flex items-center justify-between gap-4">
        <div className="space-y-1 text-right flex-1">
          <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-black border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isEn ? 'Game 2 — Body Safety Hero' : 'گیم ۲ — باڈی سیفٹی ہیرو'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            🦸 {isEn ? 'Body Safety Superhero' : 'باڈی سیفٹی سپر ہیرو'}
          </h2>
          <p className="text-emerald-100 font-bold text-xs leading-relaxed">
            {isEn
              ? 'Learn body boundaries, practice saying NO loudly, and collect Hero Shields!'
              : 'جسم کے راز اور حدود سیکھیں، "نہیں!" کہنے کی مشق کریں، اور ہیرو شیلڈز جیتیں!'}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="bg-emerald-300 text-emerald-950 px-3.5 py-1.5 rounded-full font-black text-xs shadow border border-emerald-200 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-950" />
            <span>{shields} Shields</span>
          </div>
        </div>
      </div>

      {/* Hero Guide Character Bar */}
      <div className="bg-white rounded-3xl p-4 border-2 border-emerald-200 shadow-sm flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-300 text-3xl flex items-center justify-center shrink-0 shadow border border-amber-400">
          🦸‍♂️
        </div>
        <div className="space-y-0.5 text-right flex-1">
          <h4 className="text-xs font-black text-emerald-900">
            {isEn ? 'Hero Buddy Says:' : 'سیفگارڈ ہیرو کا پیغام:'}
          </h4>
          <p className="text-xs font-bold text-slate-700 leading-snug">
            {isEn
              ? '"Your body belongs to YOU! You have the right to feel safe and respected always!"'
              : '"آپ کا جسم آپ کی اپنی ملکیت ہے! آپ کو ہمیشہ محفوظ اور محترم محسوس کرنے کا حق حاصل ہے!"'}
          </p>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setActiveTab('greetings')}
          className={`p-3 rounded-2xl font-black text-xs border-2 transition-all flex flex-col items-center gap-1 shadow-sm ${
            activeTab === 'greetings'
              ? 'bg-emerald-600 text-white border-amber-300 shadow-emerald-200 scale-105'
              : 'bg-white text-emerald-950 border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <span className="text-2xl">🤝</span>
          <span>{isEn ? '1. Greetings' : '۱. سلام کرنے کے طریقے'}</span>
        </button>

        <button
          onClick={() => setActiveTab('shout_no')}
          className={`p-3 rounded-2xl font-black text-xs border-2 transition-all flex flex-col items-center gap-1 shadow-sm ${
            activeTab === 'shout_no'
              ? 'bg-emerald-600 text-white border-amber-300 shadow-emerald-200 scale-105'
              : 'bg-white text-emerald-950 border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <span className="text-2xl">📢</span>
          <span>{isEn ? '2. Shout NO!' : '۲. "نہیں!" کہنا'}</span>
        </button>

        <button
          onClick={() => setActiveTab('trusted_adults')}
          className={`p-3 rounded-2xl font-black text-xs border-2 transition-all flex flex-col items-center gap-1 shadow-sm ${
            activeTab === 'trusted_adults'
              ? 'bg-emerald-600 text-white border-amber-300 shadow-emerald-200 scale-105'
              : 'bg-white text-emerald-950 border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <span className="text-2xl">👮‍♂️</span>
          <span>{isEn ? '3. Safe Adults' : '۳. محفوظ لوگ'}</span>
        </button>

        <button
          onClick={() => setActiveTab('swimsuit_rule')}
          className={`p-3 rounded-2xl font-black text-xs border-2 transition-all flex flex-col items-center gap-1 shadow-sm ${
            activeTab === 'swimsuit_rule'
              ? 'bg-emerald-600 text-white border-amber-300 shadow-emerald-200 scale-105'
              : 'bg-white text-emerald-950 border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <span className="text-2xl">🩳</span>
          <span>{isEn ? '4. Swimsuit Rule' : '۴. سوئم سوٹ قانون'}</span>
        </button>
      </div>

      {/* TAB 1: GREETINGS */}
      {activeTab === 'greetings' && (
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-md space-y-4 text-center">
          <div className="space-y-1">
            <h3 className="text-base font-black text-emerald-950">
              {isEn ? 'Choose Your Comfortable Greeting:' : 'اپنا پسندیدہ اور بااعتماد طریقہ چنیں:'}
            </h3>
            <p className="text-xs font-bold text-slate-600">
              {isEn
                ? 'How do you like to greet people when you see them?'
                : 'جب آپ لوگوں سے ملتے ہیں تو آپ کو سلام کا کون سا طریقہ اچھا لگتا ہے؟'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {greetings.map((g) => {
              const isSel = selectedGreeting === g.id;
              return (
                <motion.button
                  key={g.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectGreeting(g)}
                  className={`p-4 rounded-2xl border-4 text-center flex flex-col items-center gap-2 transition-all ${
                    isSel
                      ? g.isSafe
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-md'
                        : 'bg-amber-100 border-amber-400 text-amber-950 shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-300 text-slate-900'
                  }`}
                >
                  <span className="text-4xl">{g.icon}</span>
                  <span className="text-xs font-black">{isEn ? g.nameEn : g.nameUrdu}</span>
                </motion.button>
              );
            })}
          </div>

          {selectedGreeting && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl text-center space-y-2"
            >
              <p className="text-xs font-black text-emerald-950">
                {isEn
                  ? greetings.find((g) => g.id === selectedGreeting)?.feedbackEn
                  : greetings.find((g) => g.id === selectedGreeting)?.feedbackUrdu}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* TAB 2: SHOUT NO PRACTICE */}
      {activeTab === 'shout_no' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-md space-y-5 text-center">
          <div className="space-y-1">
            <h3 className="text-base font-black text-emerald-950">
              {isEn ? 'Practice Saying "NO!" Loudly' : 'زور سے "نہیں!" بولنے کی مشق کریں'}
            </h3>
            <p className="text-xs font-bold text-slate-600">
              {isEn
                ? 'If anyone touches you in a way that feels wrong or uncomfortable, shout NO proudly!'
                : 'اگر کوئی بھی اپ کو غلط طریقے سے چھوئے تو ڈرے بغیر اونچی آواز میں "نہیں!" کہیں!'}
            </p>
          </div>

          <div className="py-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShoutNo}
              className="w-40 h-40 rounded-full bg-gradient-to-tr from-rose-500 via-red-600 to-rose-700 text-white font-black shadow-2xl border-4 border-rose-300 mx-auto flex flex-col items-center justify-center gap-1 active:scale-95 animate-pulse"
            >
              <Megaphone className="w-10 h-10 text-amber-300" />
              <span className="text-xl drop-shadow">{isEn ? 'NO!' : 'نہیں!'}</span>
              <span className="text-[10px] opacity-90">{isEn ? 'Tap to Practice' : 'مشق کے لیے دبائیں'}</span>
            </motion.button>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-xs font-black text-rose-950">
            📢 {isEn ? `Practice Count: ${shoutCount} / 3 Shouts` : `مشق کی تعداد: ${shoutCount} / ۳ مرتبہ`}
          </div>
        </div>
      )}

      {/* TAB 3: TRUSTED ADULTS */}
      {activeTab === 'trusted_adults' && (
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-md space-y-4 text-center">
          <div className="space-y-1">
            <h3 className="text-base font-black text-emerald-950">
              {isEn ? 'Identify Trusted Helpers:' : 'محفوظ مددگاروں کو پہچانیں:'}
            </h3>
            <p className="text-xs font-bold text-slate-600">
              {isEn
                ? 'Tap people to learn who you can trust when you need safety help!'
                : 'جانیں کہ ضرورت کے وقت آپ کس پر اعتماد کر سکتے ہیں!'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {adults.map((a) => {
              const isSel = trustedAdultSelected === a.id;
              return (
                <motion.button
                  key={a.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectAdult(a)}
                  className={`p-4 rounded-2xl border-4 text-center flex flex-col items-center gap-2 transition-all ${
                    isSel
                      ? a.isTrusted
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-md'
                        : 'bg-amber-100 border-amber-400 text-amber-950 shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-300 text-slate-900'
                  }`}
                >
                  <span className="text-4xl">{a.icon}</span>
                  <span className="text-xs font-black">{isEn ? a.titleEn : a.titleUrdu}</span>
                </motion.button>
              );
            })}
          </div>

          {trustedAdultSelected && (
            <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl text-center">
              <p className="text-xs font-black text-emerald-950">
                {isEn
                  ? adults.find((a) => a.id === trustedAdultSelected)?.feedbackEn
                  : adults.find((a) => a.id === trustedAdultSelected)?.feedbackUrdu}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SWIMSUIT RULE */}
      {activeTab === 'swimsuit_rule' && (
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-md space-y-5 text-center">
          <div className="space-y-1">
            <h3 className="text-base font-black text-emerald-950">
              🩳 {isEn ? 'The Swimsuit Safety Rule' : 'سوئم سوٹ کا حفاظتی قانون'}
            </h3>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              {isEn
                ? 'Parts of your body covered by a swimsuit are strictly PRIVATE. No one should touch or see them!'
                : 'جسم کے وہ حصے جو سوئم سوٹ سے ڈھکے ہوتے ہیں وہ مکمل نجی ہوتے ہیں۔ کسی کو بھی انہیں دیکھنے یا چھونے کی اجازت نہیں!'}
            </p>
          </div>

          {/* Child-Safe Cartoon Swimsuit Card */}
          <div className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-200 max-w-sm mx-auto space-y-4">
            <div className="text-6xl animate-bounce">🩱</div>
            <div className="grid grid-cols-2 gap-2">
              {swimsuitZones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => {
                    setSwimsuitPartSelected(z.id);
                    speakText(isEn ? z.descEn : z.descUrdu, language);
                  }}
                  className="bg-white hover:bg-emerald-100 p-3 rounded-2xl border-2 border-emerald-300 font-black text-xs text-emerald-950 shadow"
                >
                  {z.icon} {isEn ? z.titleEn : z.titleUrdu}
                </button>
              ))}
            </div>
          </div>

          {swimsuitPartSelected && (
            <div className="bg-emerald-100 border-2 border-emerald-400 p-4 rounded-2xl text-xs font-black text-emerald-950">
              {isEn
                ? swimsuitZones.find((z) => z.id === swimsuitPartSelected)?.descEn
                : swimsuitZones.find((z) => z.id === swimsuitPartSelected)?.descUrdu}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
