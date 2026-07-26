import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChildProfile } from '../../types';
import {
  Sparkles,
  Heart,
  Smile,
  Volume2,
  Send,
  Award,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  MessageCircle,
  RefreshCw,
  Sun,
  Star,
  Mic,
  MicOff,
} from 'lucide-react';
import { speakText } from '../../utils/speech';
import { playSound } from '../../utils/soundEffects';

interface DailyReflectionModuleProps {
  profile: ChildProfile;
  onAwardBadge: (badgeName: string) => void;
  onDistressAlert?: (triggerWord: string, context: string) => void;
  language?: 'ur' | 'en';
}

interface ReflectionEntry {
  id: string;
  date: string;
  promptUrdu: string;
  promptEnglish: string;
  mood: string;
  moodIcon: string;
  userText: string;
  salamReplyUrdu: string;
  salamReplyEnglish: string;
}

const DAILY_PROMPTS = [
  {
    id: 'p1',
    urdu: 'آج کا دن کیسا رہا؟ کیا آج کسی بات نے آپ کو بہت خوش، پیارا یا محفوظ محسوس کرایا؟',
    english: 'How was your day today? Did anything make you feel happy, loved, or extra safe?',
  },
  {
    id: 'p2',
    urdu: 'آج آپ نے کون سا اہم حفاظتی اصول سیکھا یا استعمال کیا؟',
    english: 'What is one important body safety rule you remembered or practiced today?',
  },
  {
    id: 'p3',
    urdu: 'کیا آج آپ کو کسی بات پر پریشانی ہوئی؟ یا سیف گارڈ بڈی سے کچھ شیئر کرنا چاہتے ہیں؟',
    english: 'Did anything confuse or worry you today? Is there anything you want to share with Safeguard Buddy?',
  },
  {
    id: 'p4',
    urdu: 'آج آپ کے بھروسہ مند درخت میں سے کس بڑے نے آپ کی مدد کی یا خیال رکھا؟',
    english: 'Which trusted adult from your tree helped or took good care of you today?',
  },
];

const MOOD_OPTIONS = [
  { id: 'happy', icon: '😊', labelUrdu: 'محفوظ اور خوش', labelEnglish: 'Safe & Happy', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'calm', icon: '😇', labelUrdu: 'پرسکون', labelEnglish: 'Calm & Peaceful', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  { id: 'brave', icon: '🌟', labelUrdu: 'بہادر اور پرعزم', labelEnglish: 'Brave & Strong', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'worried', icon: '😟', labelUrdu: 'تھوڑا پریشان', labelEnglish: 'A Little Worried', color: 'bg-lime-200 text-lime-950 border-lime-400' },
  { id: 'sad', icon: '😢', labelUrdu: 'مدد کی ضرورت', labelEnglish: 'Need to Talk', color: 'bg-rose-100 text-rose-800 border-rose-300' },
];

// One-tap visual stickers for kids who cannot type!
const KID_STICKERS = [
  { icon: '🫂', urdu: 'پیار بھرا پیار ملا', english: 'Got a warm hug' },
  { icon: '🧸', urdu: 'کھلونوں سے کھیلا', english: 'Played with toys' },
  { icon: '🛑', urdu: 'نہیں (NO) بولنا یاد رکھا', english: 'Remembered NO rule' },
  { icon: '👩‍👧', urdu: 'امی ابو سے بات کی', english: 'Talked to Mom or Dad' },
  { icon: '🛡️', urdu: 'اپنے آپ کو محفوظ رکھا', english: 'Kept myself safe' },
  { icon: '😨', urdu: 'کوئی بات ڈراؤنی لگی', english: 'Felt a bit scared' },
  { icon: '🎁', urdu: 'سرپرائز تحفہ ملا', english: 'Got a happy surprise' },
  { icon: '⚠️', urdu: 'کسی کا چھونا برا لگا', english: 'Felt uncomfortable' },
];

export const DailyReflectionModule: React.FC<DailyReflectionModuleProps> = ({
  profile,
  onAwardBadge,
  onDistressAlert,
  language = profile.language,
}) => {
  const isEn = language === 'en';
  const [promptIndex, setPromptIndex] = useState(0);
  const [selectedMood, setSelectedMood] = useState(MOOD_OPTIONS[0]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSalamReply, setLastSalamReply] = useState<{ urdu: string; english: string } | null>(null);

  const currentPrompt = DAILY_PROMPTS[promptIndex];

  // Speech Recognition setup for kids
  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isEn
          ? 'Voice mic is supported on Chrome/Edge browsers. You can also tap the picture buttons below!'
          : 'مائیک کی سہولت کروم براؤزر پر دستیاب ہے۔ آپ نیچے دیے گئے تصویر والے بٹن بھی دبا سکتے ہیں!'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isEn ? 'en-US' : 'ur-PK';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const handleStickerClick = (sticker: { icon: string; urdu: string; english: string }) => {
    const textToAdd = `${sticker.icon} ${isEn ? sticker.english : sticker.urdu}`;
    setInputText((prev) => (prev ? `${prev}, ${textToAdd}` : textToAdd));
    playSound.playPop();
  };

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % DAILY_PROMPTS.length);
    setIsSubmitted(false);
    setInputText('');
  };

  const handleSpeakPrompt = () => {
    const textToSpeak = isEn ? currentPrompt.english : currentPrompt.urdu;
    speakText(textToSpeak, language);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Check for distress words
    const lower = inputText.toLowerCase();
    const distressTriggers = ['touch', 'hurt', 'secret', 'scared', 'scare', 'hit', 'pain', 'bad', 'ڈر', 'چوٹ', 'چھونا', 'راز', 'درد', 'تکلیف', 'مارا', 'uncomfortable'];
    const matchedTrigger = distressTriggers.find((t) => lower.includes(t));

    if (matchedTrigger && onDistressAlert) {
      onDistressAlert(matchedTrigger, inputText);
    }

    // Generate supportive Safeguard Buddy Reply
    let salamReplyUrdu = 'آپ کا بہت شکریہ پیارے دوست! اپنے احساسات سیف گارڈ بڈی سے شیئر کرنے کا شکریہ۔ آپ بہت بہادر اور محتاط بچے ہیں! 🌟';
    let salamReplyEnglish = 'Thank you so much for sharing your feelings with me! You are very brave, smart, and loved! 🌟';

    if (selectedMood.id === 'worried' || selectedMood.id === 'sad' || matchedTrigger) {
      salamReplyUrdu = 'پیارے دوست! اگر کوئی بھی بات آپ کو پریشان کر رہی ہے تو یاد رکھیں کہ آپ کبھی تنہا نہیں ہیں۔ اپنے امی، ابو یا کسی بھروسہ مند بڑے کو ضرور بتائیں! 💖';
      salamReplyEnglish = 'Dear friend, if anything is worrying you, remember you are never alone. Always share your thoughts with Mom or Dad right away! 💖';
    } else if (selectedMood.id === 'brave') {
      salamReplyUrdu = 'زبردست! آپ کی بہادری اور عقل مندی پر سیف گارڈ بڈی کو بہت فخر ہے۔ اسی طرح ہمیشہ محفوظ اور ہوشیار رہیں! ⭐';
      salamReplyEnglish = 'Awesome! Safeguard Buddy is so proud of your bravery and wisdom. Always stay safe and confident! ⭐';
    }

    setLastSalamReply({ urdu: salamReplyUrdu, english: salamReplyEnglish });
    setIsSubmitted(true);

    // Play celebration sound
    playSound.playCelebration();

    // Award reflection badge
    const badgeName = isEn ? 'Daily Reflection Star 🌟' : 'احساسات کا ستارہ 🌟';
    onAwardBadge(badgeName);

    // Voice response
    speakText(isEn ? salamReplyEnglish : salamReplyUrdu, language);

    // Store in history
    const newEntry: ReflectionEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(isEn ? 'en-US' : 'ur-PK', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      promptUrdu: currentPrompt.urdu,
      promptEnglish: currentPrompt.english,
      mood: isEn ? selectedMood.labelEnglish : selectedMood.labelUrdu,
      moodIcon: selectedMood.icon,
      userText: inputText,
      salamReplyUrdu,
      salamReplyEnglish,
    };

    setReflections([newEntry, ...reflections]);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-4 sm:p-6 max-w-2xl mx-auto font-sans relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-100 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white shadow-md text-2xl">
            ☀️
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>{isEn ? 'Daily Reflection Journal' : 'روزمرہ احساسات ڈائری (Daily Reflection)'}</span>
              <Sparkles className="w-5 h-5 text-fuchsia-500 shrink-0" />
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {isEn
                ? 'Tap pictures or mic to share feelings without typing!'
                : 'تصویریں دبائیں یا مائیک میں بولیں — ٹائپ کرنے کی ضرورت نہیں!'}
            </p>
          </div>
        </div>

        <button
          onClick={handleNextPrompt}
          className="p-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors text-xs font-extrabold flex items-center gap-1 shrink-0"
          title={isEn ? 'Change Prompt' : 'نیا سوال'}
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
          <span className="hidden sm:inline">{isEn ? 'New Question' : 'نیا سوال'}</span>
        </button>
      </div>

      {/* Main Form or Response Area */}
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Salam Prompt Banner */}
          <div className="bg-gradient-to-br from-purple-50 via-fuchsia-50 to-indigo-50 border-2 border-purple-200 rounded-3xl p-4 sm:p-5 relative shadow-inner">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-fuchsia-600 to-purple-600 rounded-2xl text-white flex items-center justify-center text-2xl shadow-md shrink-0 border-2 border-white">
                🤖
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200 inline-block mb-1">
                  {isEn ? "Safeguard Buddy's Question for Today" : 'سیف گارڈ بڈی کا آج کا سوال'}
                </span>
                <p className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                  "{isEn ? currentPrompt.english : currentPrompt.urdu}"
                </p>
              </div>

              <button
                type="button"
                onClick={handleSpeakPrompt}
                className="p-2.5 bg-white text-purple-700 hover:bg-purple-100 rounded-2xl border border-purple-200 shadow-sm transition-transform active:scale-95 shrink-0"
                title={isEn ? 'Listen Question' : 'سوال سنیں'}
              >
                <Volume2 className="w-5 h-5 text-purple-600" />
              </button>
            </div>
          </div>

          {/* Mood Selector (1-Tap Visual Emotion Buttons) */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-2">
              {isEn ? '1. Tap how you feel:' : '۱. اپنا احساس منتخب کریں (Tap Feeling):'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = selectedMood.id === mood.id;
                return (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setSelectedMood(mood)}
                    className={`p-2.5 rounded-2xl border-2 text-xs font-black transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? `${mood.color} ring-2 ring-purple-500 scale-105 shadow-md`
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-2xl">{mood.icon}</span>
                    <span className="text-[10px] text-center leading-tight">
                      {isEn ? mood.labelEnglish : mood.labelUrdu}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kid-Friendly Picture Stickers (One-Tap Answer Chips) */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-2">
              {isEn
                ? '2. Tap picture cards to tell your story (No typing needed!):'
                : '۲. تصویر والے بٹن دبا کر اپنی بات بتائیں (ٹائپ کی ضرورت نہیں!):'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {KID_STICKERS.map((sticker, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleStickerClick(sticker)}
                  className="p-2.5 bg-purple-50/70 hover:bg-purple-100 text-purple-950 border-2 border-purple-200 rounded-2xl flex items-center gap-2 text-xs font-extrabold text-left transition-transform active:scale-95 shadow-sm hover:border-purple-400"
                >
                  <span className="text-2xl shrink-0">{sticker.icon}</span>
                  <span className="text-[11px] leading-tight font-bold">
                    {isEn ? sticker.english : sticker.urdu}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mic Voice Input & Box */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-black text-slate-700">
                {isEn ? '3. Speak or view your selected story:' : '۳. بول کر بتائیں یا منتخب شدہ بات دیکھیں:'}
              </label>

              {/* Speech-to-Text Mic Button */}
              <button
                type="button"
                onClick={startListening}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all border shadow-sm ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-300 animate-pulse'
                    : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-300'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Listening... Speak now!' : 'مائیک آن ہے... بولیں!'}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isEn ? 'Tap Mic & Speak 🎙️' : 'مائیک دبا کر بولیں 🎙️'}</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isEn
                  ? 'Tap pictures above or tap mic 🎙️ to talk...'
                  : 'اوپر والی تصویریں دبائیں یا مائیک 🎙️ دبا کر بولیں...'
              }
              className="w-full p-3.5 border-2 border-purple-200 rounded-2xl bg-purple-50/50 text-slate-900 text-sm font-semibold focus:border-purple-500 focus:bg-white focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`w-full py-3.5 rounded-2xl text-sm font-black shadow-lg flex items-center justify-center gap-2 transition-all border ${
              inputText.trim()
                ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-purple-300 shadow-purple-200 active:scale-98'
                : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isEn ? 'Send to Safeguard Buddy' : 'سیف گارڈ بڈی کو بھیجیں'}</span>
          </button>
        </form>
      ) : (
        /* Submitted AI Response Display */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-5"
        >
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-purple-50 border-2 border-emerald-300 rounded-3xl p-5 text-center shadow-md space-y-3">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg border-2 border-white">
              🌟
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {isEn ? 'Thank you for reflecting!' : 'شیئر کرنے کا بہت شکریہ!'}
            </h3>

            {lastSalamReply && (
              <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-slate-800 text-xs sm:text-sm font-extrabold leading-relaxed text-right dir-rtl shadow-sm">
                "{isEn ? lastSalamReply.english : lastSalamReply.urdu}"
              </div>
            )}

            <button
              onClick={handleNextPrompt}
              className="bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3 rounded-2xl text-xs shadow-md transition-transform active:scale-95 inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isEn ? 'Reflect Again' : 'ایک اور بات شیئر کریں'}</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* History Log */}
      {reflections.length > 0 && (
        <div className="mt-8 border-t border-purple-100 pt-5">
          <h3 className="text-xs font-black text-slate-700 mb-3 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span>{isEn ? 'My Reflection Journal Entries' : 'میری پچھلی ڈائری کی تحریریں'}</span>
          </h3>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {reflections.map((entry) => (
              <div
                key={entry.id}
                className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-start gap-3 text-xs"
              >
                <div className="text-2xl shrink-0 p-1 bg-white rounded-xl border border-purple-200 shadow-sm">
                  {entry.moodIcon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-purple-900 text-[11px]">
                      {entry.mood}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{entry.date}</span>
                  </div>
                  <p className="text-slate-800 font-semibold text-xs leading-snug">
                    "{entry.userText}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

