import React, { useState } from 'react';
import { AgeBracket } from '../types';
import { ArrowLeft, ArrowRight, User, Sparkles } from 'lucide-react';

interface AgeSelectionScreenProps {
  onContinue: (nickname: string, ageBracket: AgeBracket) => void;
  onBack: () => void;
  language?: 'ur' | 'en';
}

export const AgeSelectionScreen: React.FC<AgeSelectionScreenProps> = ({
  onContinue,
  onBack,
  language = 'ur',
}) => {
  const isEn = language === 'en';
  const [nickname, setNickname] = useState(isEn ? 'Little Friend' : 'چھوٹا دوست');
  const [selectedAge, setSelectedAge] = useState<AgeBracket>('5-8');

  const ageBrackets = [
    {
      id: '2-5' as AgeBracket,
      title: isEn ? '2 to 5 Years (Toddler)' : '2 تا 5 سال (Toddler)',
      desc: isEn
        ? 'Simple animal stories and basic body touch boundaries'
        : 'سادہ جانوروں کی کہانیاں اور بنیادی محفوظ پیار',
      icon: '👶',
      badge: '2 - 5 Years'
    },
    {
      id: '5-8' as AgeBracket,
      title: isEn ? '5 to 8 Years (Junior)' : '5 تا 8 سال (Junior)',
      desc: isEn
        ? 'Role-play scenarios, stranger safety, and practicing saying NO'
        : 'رول پلے، اجنبی سے بچاؤ اور "نہیں" کہنے کی مشق',
      icon: '👦',
      badge: '5 - 8 Years'
    },
    {
      id: '8-10' as AgeBracket,
      title: isEn ? '8 to 10+ Years (Explorer)' : '8 تا 10+ سال (Explorer)',
      desc: isEn
        ? 'Real-world situations, trusted adult tree, and self-confidence'
        : 'حقیقی مثالیں، بھروسہ مند بالغ اور خود اعتمادی',
      icon: '👧',
      badge: '8 - 10+ Years'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fallbackName = isEn ? 'Little Friend' : 'چھوٹا دوست';
    onContinue(nickname.trim() || fallbackName, selectedAge);
  };

  return (
    <div className="w-full min-h-screen bg-[#0C091F] text-white flex flex-col justify-center items-center p-3 sm:p-6 relative font-sans overflow-y-auto">
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl bg-[#140F33]/90 backdrop-blur-xl rounded-3xl sm:rounded-[2.5rem] shadow-[0_0_40px_rgba(147,51,234,0.35)] p-4 sm:p-8 border-2 border-purple-500/40 relative z-10 my-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          id="btn-age-back"
          className="absolute top-3.5 left-3.5 text-purple-200 bg-[#221B4C] hover:bg-[#2D2363] p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-purple-500/40 transition-all active:scale-95 shadow-md z-20"
          title={isEn ? 'Go Back' : 'پیچھے جائیں'}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-5 sm:mb-6 pt-6 sm:pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-fuchsia-300 text-[11px] sm:text-xs font-black mb-2 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>{isEn ? 'Profile Setup' : 'پروفائل سیٹ اپ (Profile Setup)'}</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow">
            {isEn ? 'Who is playing and learning?' : 'آپ یہ کس کے لیے بنا رہے ہیں؟'}
          </h2>
          <p className="text-[11px] sm:text-xs font-bold text-purple-300/80 mt-1 uppercase tracking-wider">
            {isEn ? 'Choose a cute nickname and age bracket' : 'بچے کا پیارا نام اور عمر کا گروپ منتخب کریں'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Child Name / Nickname */}
          <div className="text-left">
            <label className="block text-xs font-black text-purple-200 mb-1.5">
              {isEn ? 'Child Nickname' : 'بچّے کا پیارا نام یا لقب (Nickname)'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={isEn ? 'e.g. Alex, Sarah, Buddy' : 'مثلاً: احمد، زہرا، چھوٹا دوست'}
                className="w-full text-left py-3 px-4 pl-10 sm:pl-11 border-2 border-purple-500/50 rounded-2xl focus:border-fuchsia-400 focus:outline-none bg-[#1D1740] text-white font-black text-sm sm:text-base"
              />
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-400 absolute left-3.5 top-3.5 sm:top-4" />
            </div>
          </div>

          {/* Age Bracket Options */}
          <div>
            <label className="block text-xs font-black text-purple-200 mb-2 sm:mb-2.5 text-left">
              {isEn ? 'Select Age Bracket:' : 'بچّے کی عمر کا گروپ چنیں (Age Bracket):'}
            </label>

            <div className="space-y-2.5 sm:space-y-3">
              {ageBrackets.map((item) => {
                const isSelected = selectedAge === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAge(item.id)}
                    id={`age-option-${item.id}`}
                    className={`p-3 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-fuchsia-400 bg-gradient-to-r from-purple-900/90 to-fuchsia-950/90 shadow-[0_0_20px_rgba(217,70,239,0.5)]'
                        : 'border-purple-900/60 bg-[#1D1740]/80 hover:bg-[#251D52] hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl shrink-0">{item.icon}</span>
                        <div className="text-left">
                          <h3 className="font-black text-sm sm:text-base text-white">
                            {item.title}
                          </h3>
                          <p className="text-[11px] sm:text-xs font-bold text-purple-300/80 mt-0.5 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 self-start sm:self-center pr-1">
                        <span className={`text-[10px] sm:text-[11px] font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border ${
                          isSelected
                            ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white border-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.5)]'
                            : 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                        }`}>
                          {item.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            id="btn-age-continue"
            className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base py-3.5 sm:py-4 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.6)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 border border-purple-300"
          >
            <span>{isEn ? 'Choose Avatar' : 'آگے چلیں (Choose Avatar)'}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
