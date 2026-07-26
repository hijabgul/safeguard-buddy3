import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Award, ArrowLeft, Phone, Search, Shield, CheckCircle2, Star, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakText } from '../../../../utils/speech';
import { playSound } from '../../../../utils/soundEffects';

interface FindSafeAdultGameProps {
  onEarnBadge: (badgeName: string) => void;
  language: 'ur' | 'en';
}

export const FindSafeAdultGame: React.FC<FindSafeAdultGameProps> = ({
  onEarnBadge,
  language,
}) => {
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState<'find_adult' | 'phone_number' | 'help_desk' | 'uniforms'>('find_adult');
  const [selectedLocation, setSelectedLocation] = useState<string>('mall');
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneSuccess, setPhoneSuccess] = useState(false);
  const [foundHelpDesk, setFoundHelpDesk] = useState(false);
  const [uniformQuizCompleted, setUniformQuizCompleted] = useState(false);
  const [stars, setStars] = useState(0);

  const locations = [
    { id: 'mall', nameEn: 'Shopping Mall', nameUrdu: 'شاپنگ مال', icon: '🛍️' },
    { id: 'park', nameEn: 'Public Park', nameUrdu: 'پبلک پارک', icon: '🌳' },
    { id: 'zoo', nameEn: 'City Zoo', nameUrdu: 'چڑیا گھر', icon: '🦁' },
    { id: 'festival', nameEn: 'Festival / Mela', nameUrdu: 'میلہ / فیسٹیول', icon: '🎪' },
    { id: 'airport', nameEn: 'Airport', nameUrdu: 'ایئرپورٹ', icon: '✈️' },
  ];

  const people = [
    {
      id: 'police',
      nameEn: 'Police Officer',
      nameUrdu: 'پولیس آفیسر',
      icon: '👮‍♂️',
      isSafe: true,
      descEn: 'Extremely Safe! Uniformed police officers are trained to help lost kids reconnect with parents!',
      descUrdu: 'مکمل محفوظ! پولیس آفیسرز بچوں کو امی ابو سے ملوانے کی تربیت رکھتے ہیں!',
    },
    {
      id: 'security',
      nameEn: 'Security Guard',
      nameUrdu: 'سیکیورٹی گارڈ',
      icon: '🛡️',
      isSafe: true,
      descEn: 'Very Safe! Security guards near gates or desks will safely guard you and call your family!',
      descUrdu: 'بہت محفوظ! سیکیورٹی گارڈ فوراً آپ کو محفوظ جگہ پر بٹھا کر امی ابو کو کال کریں گے!',
    },
    {
      id: 'info_staff',
      nameEn: 'Information Desk Staff',
      nameUrdu: 'انفارمیشن ڈیسک اسٹاف',
      icon: 'ℹ️',
      isSafe: true,
      descEn: 'Perfect Choice! Information desk staff can make a speaker announcement for your parents!',
      descUrdu: 'بہترین چائس! انفارمیشن ڈیسک والے مائیک پر اعلان کر کے امی ابو کو فوراً بلا لیں گے!',
    },
    {
      id: 'parent_kids',
      nameEn: 'Parent with Children',
      nameUrdu: 'بچوں والی امی یا ابو',
      isSafe: true,
      descEn: 'Safe Helper! A mother or father with their own kids is a great person to ask for help!',
      descUrdu: 'محفوظ مددگار! اپنے بچوں کے ساتھ موجود امی یا ابو سے مدد مانگنا بھی بہت اچھا ہے!',
    },
    {
      id: 'stranger',
      nameEn: 'Unknown Stranger',
      nameUrdu: 'تنہا اجنبی',
      isSafe: false,
      descEn: 'Not recommended first! Look for uniformed officers, help desks, or parents with kids instead!',
      descUrdu: 'پہلے مرحلے میں اجنبی کے پاس نہ جائیں! ہمیشہ گارڈ، ہیلپ ڈیسک یا بچوں والی امی کو ڈھونڈیں!',
    },
  ];

  const handleSelectPerson = (p: typeof people[0]) => {
    setSelectedPerson(p.id);
    const msg = isEn ? p.descEn : p.descUrdu;
    speakText(msg, language);
    if (p.isSafe) {
      playSound.playCelebration();
      setStars((s) => s + 1);
    }
  };

  const handleKeypadPress = (num: string) => {
    if (phoneInput.length < 11) {
      const next = phoneInput + num;
      setPhoneInput(next);
      playSound.playPop();

      if (next.length === 11) {
        setPhoneSuccess(true);
        playSound.playCelebration();
        setStars((s) => s + 3);
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
        speakText(
          isEn ? 'Awesome! Knowing your parent phone number keeps you super safe!' : 'شاباش! امی ابو کا فون نمبر یاد رکھنا آپ کو ہمیشہ محفوظ رکھتا ہے!',
          language
        );
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 rounded-3xl p-5 sm:p-7 max-w-3xl mx-auto border-4 border-cyan-200 shadow-2xl font-sans space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-800 rounded-3xl p-6 text-white shadow-xl border-4 border-cyan-300 flex items-center justify-between gap-4">
        <div className="space-y-1 text-right flex-1">
          <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-black border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>{isEn ? 'Game 3 — Find My Safe Adult' : 'گیم ۳ — سیف ایڈلٹ نیویگیٹر'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            🔎 {isEn ? 'Lost & Found Safety Patrol' : 'گمشدگی کے وقت محفوظ راستہ'}
          </h2>
          <p className="text-cyan-100 font-bold text-xs leading-relaxed">
            {isEn
              ? 'Learn who to ask for help if you get separated, practice parent phone numbers, and earn badges!'
              : 'راہ بھٹکنے پر مدد مانگنے والے محفوظ افراد کو پہچانیں اور سرٹیفکیٹ حاصل کریں!'}
          </p>
        </div>

        <div className="bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-full font-black text-xs shadow border border-amber-200 flex items-center gap-1 shrink-0">
          <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
          <span>{stars} Stars</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setActiveTab('find_adult')}
          className={`p-3 rounded-2xl font-black text-xs border-2 transition-all flex flex-col items-center gap-1 shadow-sm ${
            activeTab === 'find_adult'
              ? 'bg-cyan-700 text-white border-yellow-300 scale-105 shadow-cyan-200'
              : 'bg-white text-cyan-950 border-cyan-200 hover:bg-cyan-50'
          }`}
        >
          <span className="text-2xl">👮‍♂️</span>
          <span>{isEn ? '1. Find Safe Adult' : '۱. محفوظ لوگ'}</span>
        </button>

        <button
          onClick={() => setActiveTab('phone_number')}
          className={`p-3 rounded-2xl font-black text-xs border-2 transition-all flex flex-col items-center gap-1 shadow-sm ${
            activeTab === 'phone_number'
              ? 'bg-cyan-700 text-white border-yellow-300 scale-105 shadow-cyan-200'
              : 'bg-white text-cyan-950 border-cyan-200 hover:bg-cyan-50'
          }`}
        >
          <span className="text-2xl">📞</span>
          <span>{isEn ? '2. Phone Practice' : '۲. فون نمبر مشق'}</span>
        </button>

        <button
          onClick={() => setActiveTab('help_desk')}
          className={`p-3 rounded-2xl font-black text-xs border-2 transition-all flex flex-col items-center gap-1 shadow-sm ${
            activeTab === 'help_desk'
              ? 'bg-cyan-700 text-white border-yellow-300 scale-105 shadow-cyan-200'
              : 'bg-white text-cyan-950 border-cyan-200 hover:bg-cyan-50'
          }`}
        >
          <span className="text-2xl">ℹ️</span>
          <span>{isEn ? '3. Help Desk' : '۳. ہیلپ ڈیسک'}</span>
        </button>

        <button
          onClick={() => setActiveTab('uniforms')}
          className={`p-3 rounded-2xl font-black text-xs border-2 transition-all flex flex-col items-center gap-1 shadow-sm ${
            activeTab === 'uniforms'
              ? 'bg-cyan-700 text-white border-yellow-300 scale-105 shadow-cyan-200'
              : 'bg-white text-cyan-950 border-cyan-200 hover:bg-cyan-50'
          }`}
        >
          <span className="text-2xl">🛡️</span>
          <span>{isEn ? '4. Uniform Quiz' : '۴. یونیفارم شناختی'}</span>
        </button>
      </div>

      {/* TAB 1: FIND SAFE ADULT AT LOCATIONS */}
      {activeTab === 'find_adult' && (
        <div className="bg-white rounded-3xl p-5 border-2 border-cyan-200 shadow-md space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-base font-black text-cyan-950">
              {isEn ? 'Select Location:' : 'مقام منتخب کریں:'}
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`px-3 py-1.5 rounded-full font-black text-xs border-2 transition-all flex items-center gap-1 ${
                    selectedLocation === loc.id
                      ? 'bg-cyan-600 text-white border-cyan-300 shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-cyan-50'
                  }`}
                >
                  <span>{loc.icon}</span>
                  <span>{isEn ? loc.nameEn : loc.nameUrdu}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center space-y-1 pt-2">
            <h4 className="text-xs font-black text-slate-700">
              {isEn ? 'Who is safe to ask for help here?' : 'یہاں مدد کے لیے کون سے لوگ سب سے زیادہ محفوظ ہیں؟'}
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {people.map((p) => {
              const isSel = selectedPerson === p.id;
              return (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPerson(p)}
                  className={`p-4 rounded-2xl border-4 text-center flex flex-col items-center gap-2 transition-all ${
                    isSel
                      ? p.isSafe
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-md'
                        : 'bg-amber-100 border-amber-400 text-amber-950 shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:border-cyan-300 text-slate-900'
                  }`}
                >
                  <span className="text-4xl">{p.icon}</span>
                  <span className="text-xs font-black">{isEn ? p.nameEn : p.nameUrdu}</span>
                </motion.button>
              );
            })}
          </div>

          {selectedPerson && (
            <div className="bg-cyan-50 border-2 border-cyan-300 p-4 rounded-2xl text-center">
              <p className="text-xs font-black text-cyan-950">
                {isEn
                  ? people.find((p) => p.id === selectedPerson)?.descEn
                  : people.find((p) => p.id === selectedPerson)?.descUrdu}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PARENT PHONE NUMBER DIALER PRACTICE */}
      {activeTab === 'phone_number' && (
        <div className="bg-white rounded-3xl p-5 border-2 border-cyan-200 shadow-md space-y-4 text-center">
          <div className="space-y-1">
            <h3 className="text-base font-black text-cyan-950">
              📞 {isEn ? 'Practice Parent\'s Phone Number' : 'امی یا ابو کا فون نمبر ملائیں'}
            </h3>
            <p className="text-xs font-bold text-slate-600">
              {isEn
                ? 'Type an 11-digit mobile number on the keypad to practice memorizing your parents\' number!'
                : 'امی یا ابو کا ۱۱ ہندسوں کا نمبر کی پیڈ پر ڈائل کر کے یاد کریں!'}
            </p>
          </div>

          {/* Number Display Box */}
          <div className="bg-cyan-50 border-2 border-cyan-300 rounded-2xl p-4 max-w-xs mx-auto shadow-inner text-2xl font-mono font-black text-cyan-950 tracking-wider min-h-[60px] flex items-center justify-center">
            {phoneInput || '03__________'}
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map((key) => (
              <button
                key={key}
                onClick={() => {
                  if (key === 'C') {
                    setPhoneInput('');
                    setPhoneSuccess(false);
                  } else if (key === '✓') {
                    if (phoneInput.length >= 10) {
                      setPhoneSuccess(true);
                      playSound.playCelebration();
                      setStars((s) => s + 3);
                      onEarnBadge(isEn ? 'Safe Adult Phone Star 📞' : 'سیف ایڈلٹ فون سٹار 📞');
                    }
                  } else {
                    handleKeypadPress(key);
                  }
                }}
                className="bg-cyan-100 hover:bg-cyan-200 border-2 border-cyan-300 text-cyan-950 font-black py-3 rounded-2xl text-lg shadow active:scale-95 transition-transform"
              >
                {key}
              </button>
            ))}
          </div>

          {phoneSuccess && (
            <div className="bg-emerald-100 border-2 border-emerald-400 p-4 rounded-2xl text-xs font-black text-emerald-950 animate-bounce">
              🎉 {isEn ? 'Awesome! You successfully learned how to dial parents\' number!' : 'شاباش! آپ نے امی ابو کا فون نمبر ڈائل کرنے کا طریقہ کامیابی سے سیکھ لیا!'}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HELP DESK */}
      {activeTab === 'help_desk' && (
        <div className="bg-white rounded-3xl p-5 border-2 border-cyan-200 shadow-md space-y-4 text-center">
          <div className="space-y-1">
            <h3 className="text-base font-black text-cyan-950">
              ℹ️ {isEn ? 'Find the Help Desk / Information Sign' : 'انفارمیشن یا ہیلپ ڈیسک کا نشان ڈھونڈیں'}
            </h3>
            <p className="text-xs font-bold text-slate-600">
              {isEn
                ? 'Tap the correct Information Desk sign among these mall signs!'
                : 'شاپنگ مال کے مختلف سائن بورڈز میں سے ہیلپ ڈیسک کا نشان چنیں!'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {[
              { id: 'shoes', icon: '👟', nameEn: 'Shoe Shop', nameUrdu: 'جوتوں کی دکان', isHelp: false },
              { id: 'info', icon: 'ℹ️', nameEn: 'Information / Help Desk', nameUrdu: 'انفارمیشن / ہیلپ ڈیسک', isHelp: true },
              { id: 'food', icon: '🍕', nameEn: 'Pizza Food Court', nameUrdu: 'پیزا ہال', isHelp: false },
              { id: 'toys', icon: '🧸', nameEn: 'Toy Shop', nameUrdu: 'کھلونوں کی دکان', isHelp: false },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  if (s.isHelp) {
                    setFoundHelpDesk(true);
                    playSound.playCelebration();
                    setStars((st) => st + 2);
                    speakText(
                      isEn ? 'Correct! Information Desk is the safest spot in any mall!' : 'بالکل درست! ہیلپ ڈیسک کسی بھی مال کا سب سے محفوظ مقام ہے!',
                      language
                    );
                  } else {
                    playSound.playCorrect();
                    speakText(
                      isEn ? 'That is a shop. Look for the blue i or Help Desk sign!' : 'یہ ایک دکان ہے۔ آئی (i) یا ہیلپ ڈیسک کے نشان کو چنیں!',
                      language
                    );
                  }
                }}
                className={`p-5 rounded-2xl border-4 flex flex-col items-center gap-2 font-black text-xs transition-all shadow ${
                  s.isHelp && foundHelpDesk
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 hover:border-cyan-400 text-slate-900'
                }`}
              >
                <span className="text-4xl">{s.icon}</span>
                <span>{isEn ? s.nameEn : s.nameUrdu}</span>
              </button>
            ))}
          </div>

          {foundHelpDesk && (
            <div className="bg-emerald-100 border-2 border-emerald-400 p-4 rounded-2xl text-xs font-black text-emerald-950">
              🌟 {isEn ? 'Great job! The Information Desk staff will announce your parents\' name immediately!' : 'شاباش! ہیلپ ڈیسک اسٹاف فوراً اسپیکر پر اعلان کر کے امی ابو کو بلا لے گا!'}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: UNIFORM QUIZ */}
      {activeTab === 'uniforms' && (
        <div className="bg-white rounded-3xl p-5 border-2 border-cyan-200 shadow-md space-y-4 text-center">
          <div className="space-y-1">
            <h3 className="text-base font-black text-cyan-950">
              🛡️ {isEn ? 'Recognize Official Police & Security Uniforms' : 'سرکاری گارڈز اور پولیس کی وردی پہچانیں'}
            </h3>
            <p className="text-xs font-bold text-slate-600">
              {isEn
                ? 'Which outfit belongs to an official security guard or police officer?'
                : 'ان میں سے کون سا لباس سیکیورٹی گارڈ یا پولیس کا ہے؟'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {[
              { id: 'police_badge', icon: '👮‍♂️', titleEn: 'Police Uniform & Badge', titleUrdu: 'پولیس وردی اور بیج', isOfficial: true },
              { id: 'clown', icon: '🤡', titleEn: 'Party Clown Outfit', titleUrdu: 'کلاؤن لباس', isOfficial: false },
            ].map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  if (u.isOfficial) {
                    setUniformQuizCompleted(true);
                    playSound.playCelebration();
                    setStars((st) => st + 2);
                    speakText(
                      isEn ? 'Correct! Police uniforms and badges mean official safety helpers!' : 'بالکل درست! پولیس کا بیج اور یونیفارم سرکاری محافظوں کی نشانی ہے!',
                      language
                    );
                  } else {
                    playSound.playCorrect();
                  }
                }}
                className={`p-5 rounded-2xl border-4 flex flex-col items-center gap-2 font-black text-xs transition-all shadow ${
                  u.isOfficial && uniformQuizCompleted
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 hover:border-cyan-400 text-slate-900'
                }`}
              >
                <span className="text-4xl">{u.icon}</span>
                <span>{isEn ? u.titleEn : u.titleUrdu}</span>
              </button>
            ))}
          </div>

          {uniformQuizCompleted && (
            <div className="bg-emerald-100 border-2 border-emerald-400 p-4 rounded-2xl text-xs font-black text-emerald-950">
              📜 {isEn ? 'Official Safe Lost Patrol Certificate Earned!' : 'گمشدگی کے وقت کا سرکاری حفاظتی سند کا کارڈ مل گیا!'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
