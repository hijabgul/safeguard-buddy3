import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChildProfile, ChatMessage } from '../../types';
import { Send, Volume2, Sparkles, Heart, AlertTriangle, Mic, MicOff } from 'lucide-react';
import { speakText, stopSpeech } from '../../utils/speech';
import { PlayableVoiceResult } from '../../services/elevenlabsVoiceService';

interface SalamChatModuleProps {
  profile: ChildProfile;
  onDistressAlert: (triggerWord: string, context: string) => void;
}

export const SalamChatModule: React.FC<SalamChatModuleProps> = ({ profile, onDistressAlert }) => {
  const isEn = profile.language === 'en';
  const activeAudioRef = useRef<PlayableVoiceResult | null>(null);

  const stopAllSpeech = () => {
    stopSpeech();
    if (activeAudioRef.current) {
      try {
        activeAudioRef.current.stop();
      } catch (err) {
        console.warn('Error stopping ElevenLabs audio:', err);
      }
      activeAudioRef.current = null;
    }
  };

  const speakAiResponse = (text: string) => {
    stopAllSpeech();

    if (profile.language === 'ur' || !isEn) {
      speakText(text, 'ur');
    } else {
      speakText(text, 'en');
    }
  };

  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
  }, []);

  const initialGreeting = isEn
    ? `[warm] Hello ${profile.nickname}! I am your friendly AI companion Safeguard Buddy. How are you today? Tap any picture button below or tap the microphone 🎙️ to talk to me!`
    : `[warm] سلام ${profile.nickname}! میں تمہارا پیارا دوست سیف گارڈ بڈی ہوں۔ تم کیسے ہو؟ نیچے دیے گئے تصویر والے بٹن دبائیں یا مائیک 🎙️ سے بول کر مجھ سے بات کریں!`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'salam',
      text: initialGreeting,
      timestamp: Date.now(),
      tone: 'warm',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [distressBanner, setDistressBanner] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = isEn
    ? [
        '👋 Hello Safeguard Buddy!',
        '📖 Safety story please',
        '🛑 Safe vs Unsafe Touch',
        '🎁 Stranger offering gifts',
        '❤️ Why say NO?',
        '🌳 My Trusted Adults',
      ]
    : [
        '👋 سلام دوست!',
        '📖 مجھے کہانی سناؤ',
        '🛑 محفوظ اور نامحفوظ چھونا',
        '🎁 اگر اجنبی تحفہ دے',
        '❤️ نہیں بولنا کیوں ضروری ہے؟',
        '🌳 میرے بھروسہ مند لوگ',
      ];

  // Speech-to-Text for children
  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isEn
          ? 'Voice mic is supported on Chrome/Edge browsers. You can tap the quick picture buttons!'
          : 'مائیک کی سہولت کروم براؤزر پر دستیاب ہے۔ آپ تصویر والے بٹن بھی دبا سکتے ہیں!'
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
          setInput(transcript);
          handleSend(transcript);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const generateClientDynamicReply = (msgText: string, isEn: boolean, nickname: string) => {
    const lower = msgText.toLowerCase().trim();

    // Calculate a hash offset using message length and message count
    let hash = 0;
    for (let i = 0; i < msgText.length; i++) {
      hash = (hash << 5) - hash + msgText.charCodeAt(i);
      hash |= 0;
    }
    const pos = Math.abs(hash + messages.length);

    // Distress triggers
    if (lower.includes('scared') || lower.includes('hurt') || lower.includes('help') || lower.includes('ڈر') || lower.includes('چوٹ') || lower.includes('مدد') || lower.includes('برا')) {
      return isEn
        ? `This is very important. Please tell your Mom or Dad right now. Can you do that? Remember, you are brave! Safeguard Buddy is always here with you.`
        : `یہ بہت اہم بات ہے۔ برائے مہربانی ابھی امی یا ابو کو بتاؤ۔ کیا تم یہ کر سکتے ہو؟ یاد رکھو، تم بہادر ہو۔ سیف گارڈ بڈی ہمیشہ تمہارے ساتھ ہے۔`;
    }

    // Story requests
    if (lower.includes('story') || lower.includes('کہانی') || lower.includes('سناؤ') || lower.includes('📖') || lower.includes('قصہ')) {
      const storiesUrdu = [
        `سلام ${nickname}! ایک خوبصورت جنگل میں پپو نامی ایک ننھا پرندہ رہتا تھا۔ پپو کو معلوم تھا کہ اس کا جسم اس کا اپنا ہے۔ وہ ہمیشہ اپنی امی ابو کی بات سنتا اور خوش رہتا تھا!`,
        `سلام ${nickname}! ایک ہرے بھرے باغ میں ٹومی نامی ایک ننھا خرگوش رہتا تھا۔ ایک دن ایک اجنبی نے اسے گاجر دی، لیکن ٹومی نے کہا "نہیں!" اور بھاگ کر اپنی امی کے پاس چلا گیا۔`,
        `سلام ${nickname}! ایک نیلی ندی میں مینو نامی ایک ننھی مچھلی تھی۔ مینو ہمیشہ اپنے والدین کے ساتھ تیرتی تھی اور کبھی کسی اجنبی مچھلی کے ساتھ اکیلی نہیں جاتی تھی!`,
        `سلام ${nickname}! ایک اونچے درخت پر چینو نامی ایک ننھی گلہری رہتی تھی۔ چینو کو اپنے بھروسہ مند لوگوں کا پتہ تھا اور وہ ہمیشہ اپنے راز امی کو بتاتی تھی!`,
        `سلام ${nickname}! ایک چمکتے جزیرے پر مانو نامی ہاتھی کا بچہ رہتا تھا۔ وہ ہمیشہ اپنے بڑوں کی بات مانتا تھا!`
      ];
      const storiesEnglish = [
        `Hello ${nickname}! Once upon a time, a brave little sparrow named Pip was flying in a park. Pip always listened to her mom and knew that her body belonged only to her!`,
        `Hello ${nickname}! Benny the Rabbit met a stranger who offered a carrot. Benny remembered his safe rules, shouted "NO!", and hopped back to his family!`,
        `Hello ${nickname}! Under the blue sea, Finny the Little Fish always stayed close to her mom. When a stranger fish asked her to come away, Finny swam straight to her mom!`,
        `Hello ${nickname}! High up in the green trees, Chino the Squirrel knew all her trusted adults!`
      ];
      const list = isEn ? storiesEnglish : storiesUrdu;
      return list[pos % list.length];
    }

    // Greetings
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('سلام') || lower.includes('کیسے') || lower.includes('کیا حال')) {
      const urduGreetings = [
        `وعلیکم السلام ${nickname}! میں بالکل ٹھیک ہوں۔ تم کیسے ہو؟ آج تم نے کیا کھیل کھیلا؟`,
        `سلام ${nickname}! تمہاری بات سن کر مجھے بہت خوشی ہوئی۔ تم ایک بہادر بچے ہو!`,
        `سلام پیارے ${nickname}! میں تمہارا سیف گارڈ بڈی ہوں۔ میں تمہارے ساتھ بات کرنے کے لیے تیار ہوں!`,
        `وعلیکم السلام! آج تم کون سی نئی محفوظ بات سیکھنا چاہتے ہو؟`
      ];
      const englishGreetings = [
        `Hello ${nickname}! I am doing great! How are you feeling today?`,
        `Hi ${nickname}! I am so happy to hear from you! What fun things did you do today?`,
        `Hello my brave friend ${nickname}! Safeguard Buddy is right here with you!`,
        `Hi there ${nickname}! You are very special and smart. How is your day going?`
      ];
      const list = isEn ? englishGreetings : urduGreetings;
      return list[pos % list.length];
    }

    // Touch safety
    if (lower.includes('touch') || lower.includes('چھونا') || lower.includes('محفوظ') || lower.includes('🛑') || lower.includes('جسم')) {
      return isEn
        ? `Safe touches make you feel happy and safe, like a high-five or a warm hug from Mom! If any touch feels confusing or uncomfortable, say NO and tell a trusted adult immediately.`
        : `محفوظ چھونا وہ ہوتا ہے جو آپ کو خوشی اور تحفظ دے، جیسے امی کا پیار یا ہاتھ ملانا۔ اگر کوئی بھی آپ کو ناگوار طریقے سے چھوئے تو فوراً نہیں کہیں اور امی یا ابو کو بتائیں۔`;
    }

    // Stranger safety
    if (lower.includes('stranger') || lower.includes('اجنبی') || lower.includes('تحفہ') || lower.includes('🎁') || lower.includes('ٹافی')) {
      return isEn
        ? `Never take gifts, candies, or rides from strangers! Always ask your parents first. If a stranger asks you to go with them, step back and shout NO!`
        : `کبھی بھی کسی اجنبی سے تحفہ، ٹافی یا ساتھ جانے کی افر قبول نہ کریں۔ ہمیشہ پہلے امی یا ابو سے پوچھیں۔ اجنبی کو صاف نہیں بولیں!`;
    }

    // Saying NO
    if (lower.includes('no') || lower.includes('نہیں') || lower.includes('❤️')) {
      return isEn
        ? `You are the boss of your own body! You always have the right to say NO if anything feels unsafe or uncomfortable.`
        : `تم اپنے جسم کے خود مالک ہو! اگر کوئی بھی بات ڈراؤنی یا ناگوار لگے تو تمہیں ہمیشہ "نہیں" کہنے کا پورا حق ہے!`;
    }

    // Trusted adults
    if (lower.includes('adult') || lower.includes('لوگ') || lower.includes('بھروسہ') || lower.includes('🌳')) {
      return isEn
        ? `Trusted adults are people like Mom, Dad, Grandma, or your Teacher who protect you and listen when you need help!`
        : `بھروسہ مند بالغ وہ لوگ ہیں جیسے امی، ابو، دادی یا ٹیچر جو آپ کی حفاظت کرتے ہیں اور آپ کی بات سنتے ہیں!`;
    }

    // Animals / Nature / General Curiosity
    if (lower.includes('animal') || lower.includes('bird') || lower.includes('cat') || lower.includes('dog') || lower.includes('بلی') || lower.includes('کتا') || lower.includes('پرندہ') || lower.includes('جانور')) {
      return isEn
        ? `Animals are wonderful! Little birds and kittens always stay close to their mothers to stay safe and sound!`
        : `جانور بہت پیارے ہوتے ہیں! پرندے جیسے طوطا اور چڑیا ہمیشہ اپنے گھونسلے میں محفوظ رہتے ہیں اور اپنے امی ابو کے ساتھ رہتے ہیں!`;
    }

    // General greeting pool
    const generalUrdu = [
      `سلام ${nickname}! میں تمہارا سیف گارڈ بڈی ہوں۔ تم ایک بہت بہادر اور ہوشیار بچے ہو! آج ہم کیا سیکھیں گے؟`,
      `سلام ${nickname}! تمہاری بات سن کر مجھے بہت خوشی ہوئی۔ یاد رکھو کہ تم ہمیشہ محفوظ اور بہادر بچے ہو!`,
      `سلام ${nickname}! سیف گارڈ بڈی ہمیشہ تمہارے ساتھ ہے! کوئی بھی سوال پوچھو، جیسے کہانی، محفوظ چھونا یا اجنبی!`,
      `واہ ${nickname}! یہ تو بہت دلچسپ بات ہے۔ کیا تم کوئی کہانی سننا چاہتے ہو؟`,
      `تم ایک سچے چیمپئن ہو ${nickname}! ہمیشہ یاد رکھو کہ تمہارا جسم تمہارا اپنا ہے!`
    ];
    const generalEnglish = [
      `Hello ${nickname}! I am Safeguard Buddy. You are very brave, smart, and safe! What would you like to talk about today?`,
      `Hello ${nickname}! I'm so happy to talk to you. Remember that you are always safe and brave!`,
      `Hello ${nickname}! Safeguard Buddy is always here with you. Ask me anything, like a story, body safety, or strangers!`,
      `Wow ${nickname}! That sounds so interesting. Would you like to hear a fun story?`,
      `You are a true champion ${nickname}! Always remember that you have the right to say NO!`
    ];
    const genList = isEn ? generalEnglish : generalUrdu;
    return genList[pos % genList.length];
  };

  const handleSend = async (textToSend?: string) => {
    const msgText = (textToSend || input).trim();
    if (!msgText || loading) return;

    setInput('');
    stopAllSpeech();

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: msgText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      let replyText = '';
      let replyTone: 'warm' | 'gentle' | 'encouraging' | 'slow' = 'warm';
      let isDistress = false;

      // 1. Try server endpoint /api/salam/chat
      try {
        const response = await fetch('/api/salam/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: msgText,
            ageBracket: profile.ageBracket,
            nickname: profile.nickname,
            avatar: profile.avatar.nameEnglish,
            language: profile.language || 'ur',
            history: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
          }),
        });

        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('application/json')) {
          const data = await response.json();
          replyText = data.reply;
          replyTone = data.tone || 'warm';
          isDistress = !!data.distressTriggered;
        }
      } catch (err) {
        console.warn('API /api/salam/chat call failed, attempting fallback...', err);
      }

      // 2. If server didn't give a response, check if client Gemini API key exists
      if (!replyText && import.meta.env.VITE_GEMINI_API_KEY) {
        try {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
          const isUrdu = profile.language === 'ur';
          const sysInst = isUrdu
            ? `You are "Safeguard Buddy" (سیف گارڈ بڈی) — a caring AI friend for Pakistani children. Teach safety ("محفوظ چھونا", "اجنبی", saying NO). Speak ONLY simple Urdu. NO MARKDOWN. Always generate a unique, non-repeating story or answer!`
            : `You are "Safeguard Buddy" — a caring AI friend for children. Teach body safety, stranger awareness, saying NO. Speak simple English. NO MARKDOWN. Always generate a unique, non-repeating story or answer!`;

          const clientRes = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: `Child nickname: ${profile.nickname}, Age: ${profile.ageBracket}. Message: "${msgText}"`,
            config: { systemInstruction: sysInst, temperature: 0.95 },
          });

          if (clientRes.text) {
            replyText = clientRes.text
              .replace(/\[(warm|gentle|encouraging|slow)\]/gi, '')
              .replace(/\*+/g, '')
              .replace(/#+/g, '')
              .replace(/_+/g, ' ')
              .trim();
          }
        } catch (clientGeminiErr) {
          console.warn('Client-side Gemini call failed:', clientGeminiErr);
        }
      }

      // 3. Fallback to smart non-repeating client generator if still empty
      if (!replyText) {
        replyText = generateClientDynamicReply(msgText, isEn, profile.nickname);
      }

      const defaultReply = isEn
        ? 'Hello! You are safe, brave, and wonderful!'
        : 'سلام! تم بالکل محفوظ ہو اور بہادر بچے ہو!';

      const finalReply = replyText || defaultReply;

      const salamMsg: ChatMessage = {
        id: `sal-${Date.now()}`,
        sender: 'salam',
        text: finalReply,
        timestamp: Date.now(),
        tone: replyTone,
        distressFlag: isDistress,
      };

      setMessages((prev) => [...prev, salamMsg]);

      // Speak Salam response
      speakAiResponse(finalReply);

      if (isDistress) {
        const bannerText = isEn
          ? 'Tell your Mom or Dad immediately! Safeguard Buddy is right here to keep you safe!'
          : 'امی یا ابو کو فوراً بتائیں۔ سیف گارڈ بڈی تمہاری حفاظت کے لیے ساتھ ہے!';
        setDistressBanner(bannerText);
        onDistressAlert('distress', msgText);
      }
    } catch (err) {
      console.error('Error talking to Salam:', err);
      const fallbackText = generateClientDynamicReply(msgText, isEn, profile.nickname);

      const fallbackMsg: ChatMessage = {
        id: `sal-err-${Date.now()}`,
        sender: 'salam',
        text: fallbackText,
        timestamp: Date.now(),
        tone: 'warm',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speakAiResponse(fallbackText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-teal-100 overflow-hidden flex flex-col h-[580px] font-sans">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-600 to-indigo-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white text-3xl flex items-center justify-center shadow">
            🦚
          </div>
          <div>
            <h3 className="font-extrabold text-lg flex items-center gap-1.5">
              <span>{isEn ? 'Safeguard Buddy AI' : 'سیف گارڈ بڈی (Safeguard Buddy)'}</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </h3>
            <p className="text-xs text-teal-100">
              {isEn ? 'Talk by tapping pictures or speaking in mic 🎙️' : 'تصویریں دبا کر یا مائیک 🎙️ میں بول کر بات کریں'}
            </p>
          </div>
        </div>

        <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold border border-white/30">
          Age {profile.ageBracket}
        </div>
      </div>

      {/* Distress Safety Alert Banner */}
      {distressBanner && (
        <div className="bg-rose-500 text-white px-4 py-2 text-xs font-extrabold flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-300 shrink-0" />
            <span>{distressBanner}</span>
          </div>
          <button
            onClick={() => setDistressBanner(null)}
            className="text-white hover:text-slate-200 text-xs underline"
          >
            {isEn ? 'Got it' : 'سمجھ گیا'}
          </button>
        </div>
      )}

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isSalam = msg.sender === 'salam';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isSalam ? 'justify-start' : 'justify-end'} gap-2.5`}
            >
              {isSalam && (
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center text-lg shrink-0 shadow">
                  🦚
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-4 shadow-sm ${
                  isSalam
                    ? msg.distressFlag
                      ? 'bg-rose-50 border-2 border-rose-300 text-slate-900'
                      : 'bg-white border border-teal-100 text-slate-900'
                    : 'bg-teal-600 text-white'
                }`}
              >
                {isSalam && msg.tone && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mb-1.5 bg-teal-50 border border-teal-200 text-teal-700">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span>
                      {isEn ? (
                        msg.tone === 'warm' ? 'Warm Caring' : msg.tone === 'gentle' ? 'Gentle Voice' : msg.tone === 'encouraging' ? 'Encouraging' : 'Important'
                      ) : (
                        msg.tone === 'warm' ? 'گرم جوشی' : msg.tone === 'gentle' ? 'پیار سے' : msg.tone === 'encouraging' ? 'حوصلہ افزائی' : 'اہم اصول'
                      )}
                    </span>
                  </div>
                )}

                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  {msg.text}
                </p>

                {isSalam && (
                  <button
                    onClick={() => speakAiResponse(msg.text)}
                    className="mt-2 text-teal-700 hover:text-teal-900 text-xs flex items-center gap-1 font-bold bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg transition-colors border border-teal-200"
                    title={isEn ? 'Listen Voice' : 'آواز میں سنیں'}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Listen Voice' : 'آواز سنیں (Listen)'}</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}

        {loading && (
          <div className="flex justify-start gap-2 items-center text-slate-500 text-xs">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-base">
              🦚
            </div>
            <div className="bg-white border border-teal-100 p-3 rounded-2xl shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-ping" />
              <span>{isEn ? 'Safeguard Buddy is thinking...' : 'سیف گارڈ بڈی سوچ رہا ہے...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-2 bg-slate-100 border-t border-slate-200 overflow-x-auto whitespace-nowrap flex gap-2">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            id={`btn-quick-prompt-${idx}`}
            className="bg-white hover:bg-teal-50 text-teal-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-teal-200 shadow-sm shrink-0 transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box with Voice Microphone */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
      >
        {/* Voice Mic Button */}
        <button
          type="button"
          onClick={startListening}
          className={`p-3 rounded-2xl text-white font-bold transition-transform active:scale-95 shadow shrink-0 flex items-center justify-center ${
            isListening ? 'bg-rose-500 animate-pulse ring-2 ring-rose-300' : 'bg-purple-600 hover:bg-purple-700'
          }`}
          title={isEn ? 'Tap to Speak' : 'بولنے کے لیے مائیک دبائیں'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isListening
              ? isEn ? 'Listening... Speak now!' : 'مائیک آن ہے... بولیں!'
              : isEn ? 'Speak mic 🎙️ or tap buttons...' : 'مائیک 🎙️ یا بٹن استعمال کریں...'
          }
          className="flex-1 py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-teal-500 focus:outline-none text-sm text-slate-800 font-medium"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          id="btn-salam-send"
          className="w-12 h-12 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-2xl flex items-center justify-center shadow transition-transform active:scale-95 shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

