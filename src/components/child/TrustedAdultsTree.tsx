import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TRUSTED_ADULT_OPTIONS, TODDLER_TRUSTED_ADULTS, JUNIOR_TRUSTED_ADULTS } from '../../data/safetyData';
import { Check, Volume2, Award, RotateCcw, Trees, ShieldCheck } from 'lucide-react';
import { speakText } from '../../utils/speech';
import { AgeBracket } from '../../types';

interface TrustedAdultsTreeProps {
  selectedAdults: string[];
  onSaveTrustedAdults: (adults: string[]) => void;
  onEarnBadge: (badgeName: string) => void;
  language?: 'ur' | 'en';
  ageBracket?: AgeBracket;
}

export const TrustedAdultsTree: React.FC<TrustedAdultsTreeProps> = ({
  selectedAdults: initialSelected,
  onSaveTrustedAdults,
  onEarnBadge,
  language = 'ur',
  ageBracket = '8-10',
}) => {
  const isEn = language === 'en';

  // Toddler State
  const [toddlerSel, setToddlerSel] = useState<string[]>([]);
  const [toddlerSaved, setToddlerSaved] = useState(false);

  // Junior State
  const [juniorSel, setJuniorSel] = useState<string[]>([]);
  const [juniorSaved, setJuniorSaved] = useState(false);

  // Explorer State
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [hasSaved, setHasSaved] = useState(false);

  /* ============================================================
     TODDLER VIEW (2-5) - Picture-driven Animal Trusted Tree
     ============================================================ */
  if (ageBracket === '2-5') {
    const toggleToddlerAdult = (id: string, name: string) => {
      let updated: string[];
      if (toddlerSel.includes(id)) {
        updated = toddlerSel.filter((i) => i !== id);
      } else {
        if (toddlerSel.length >= 3) {
          speakText(isEn ? '3 helpers selected already!' : '3 مددگار چن لیے گئے!', language);
          return;
        }
        updated = [...toddlerSel, id];
        speakText(isEn ? `${name} selected!` : `${name} چنا گیا!`, language);
      }
      setToddlerSel(updated);
    };

    const handleSaveToddler = () => {
      if (toddlerSel.length < 2) {
        speakText(isEn ? 'Tap at least 2 safe helpers!' : 'کم از کم 2 مددگار چنیں!', language);
        return;
      }
      onSaveTrustedAdults(toddlerSel);
      setToddlerSaved(true);
      onEarnBadge(isEn ? 'Little Tree Defender 🌳' : 'ننھا درخت محافظ 🌳');
      speakText(
        isEn
          ? 'Yay! Your safe helpers tree is growing big and strong!'
          : 'واہ! آپ کا حفاظتی درخت بہت بڑا ہو گیا!',
        language
      );
    };

    return (
      <div className="bg-gradient-to-b from-emerald-50 to-teal-50 rounded-3xl p-6 max-w-xl mx-auto border-4 border-emerald-200 shadow-xl font-sans">
        <div className="text-center mb-4">
          <span className="inline-block bg-emerald-200 text-emerald-900 text-xs font-black px-4 py-1 rounded-full uppercase mb-2">
            {isEn ? 'Toddler Safe Tree (2-5 Years)' : 'بچوں کا حفاظتی درخت (۲ تا ۵ سال)'}
          </span>
          <h2 className="text-2xl font-black text-emerald-950 flex items-center justify-center gap-2">
            <Trees className="w-7 h-7 text-emerald-600" />
            <span>{isEn ? 'My Safe Helper Tree' : 'میرا حفاظتی درخت'}</span>
          </h2>
        </div>

        {!toddlerSaved ? (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-4 border-2 border-emerald-300 text-center shadow-sm">
              <p className="text-base font-bold text-slate-800">
                {isEn
                  ? 'Tap 2 or 3 grown-ups who love and keep you safe!'
                  : 'ان ۲ یا ۳ بڑوں کو ٹیپ کریں جو آپ سے پیار کرتے ہیں!'}
              </p>
              <button
                onClick={() =>
                  speakText(
                    isEn
                      ? 'Tap your Mama, Papa, or teacher to put them on your tree!'
                      : 'اپنی امی، ابو، یا ٹیچر کو اپنے درخت پر شامل کریں!',
                    language
                  )
                }
                className="mt-2 inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 font-black px-3 py-1.5 rounded-full text-xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isEn ? 'Listen Helper Guide' : 'رہنمائی سنیں'}</span>
              </button>
            </div>

            {/* Grid of Toddler Helpers */}
            <div className="grid grid-cols-2 gap-3">
              {TODDLER_TRUSTED_ADULTS.map((adult) => {
                const isSelected = toddlerSel.includes(adult.id);
                const name = isEn ? adult.nameEnglish : adult.nameUrdu;
                return (
                  <button
                    key={adult.id}
                    onClick={() => toggleToddlerAdult(adult.id, name)}
                    className={`p-4 rounded-3xl border-4 flex flex-col items-center text-center transition-transform active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-100 border-emerald-500 shadow-md scale-105'
                        : 'bg-white border-emerald-200 hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-5xl mb-2">{adult.icon}</span>
                    <span className="font-extrabold text-slate-900 text-sm leading-tight">{name}</span>
                    <span className="text-xs text-slate-500 mt-1">{adult.role}</span>
                    {isSelected && (
                      <span className="mt-2 bg-emerald-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>{isEn ? 'Added' : 'شامل'}</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSaveToddler}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg text-lg transition-transform active:scale-95"
            >
              {isEn ? 'Grow My Safe Tree 🌳' : 'درخت مکمل کریں 🌳'}
            </button>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4 bg-white rounded-3xl p-6 border-2 border-emerald-300">
            <div className="text-6xl animate-bounce">🌳🌟❤️</div>
            <h3 className="text-2xl font-black text-emerald-950">
              {isEn ? 'Your Safe Tree is Full! 🌳' : 'آپ کا حفاظتی درخت تیار ہے! 🌳'}
            </h3>
            <p className="text-sm font-bold text-slate-700">
              {isEn ? 'Always go to your trusted grown-ups when you need help!' : 'کسی بھی ضرورت میں اپنے ان سچے بالغوں کے پاس جائیں!'}
            </p>
            <button
              onClick={() => {
                setToddlerSel([]);
                setToddlerSaved(false);
              }}
              className="bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl shadow hover:bg-emerald-700"
            >
              {isEn ? 'Build Tree Again' : 'دوبارہ درخت بنائیں'}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ============================================================
     JUNIOR VIEW (5-8) - Junior Trusted Adult Circle
     ============================================================ */
  if (ageBracket === '5-8') {
    const toggleJuniorAdult = (id: string, name: string) => {
      let updated: string[];
      if (juniorSel.includes(id)) {
        updated = juniorSel.filter((i) => i !== id);
      } else {
        if (juniorSel.length >= 3) {
          speakText(isEn ? 'You already picked 3 trusted adults.' : 'آپ ۳ بھروسہ مند بالغ منتخب کر چکے ہیں۔', language);
          return;
        }
        updated = [...juniorSel, id];
        speakText(isEn ? `${name} selected!` : `${name} منتخب ہو گئے!`, language);
      }
      setJuniorSel(updated);
    };

    const handleSaveJunior = () => {
      if (juniorSel.length < 3) {
        speakText(isEn ? 'Please choose 3 trusted adults for your tree!' : 'درخت مکمل کرنے کے لیے ۳ لوگ چنیں!', language);
        return;
      }
      onSaveTrustedAdults(juniorSel);
      setJuniorSaved(true);
      onEarnBadge(isEn ? 'Junior Shield Network 🛡️' : 'جونئیر شیلڈ نیٹ ورک 🛡️');
      speakText(
        isEn
          ? 'Great job! Your trusted 3-adult circle is saved and ready to help you!'
          : 'بہت خوب! آپ کا ۳ لوگوں کا بھروسہ مند دائرہ محفوظ ہو گیا!',
        language
      );
    };

    return (
      <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl p-6 max-w-2xl mx-auto border-2 border-emerald-200 shadow-xl font-sans">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3 mb-4">
          <div>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              {isEn ? 'Junior Safety Circle (5-8 Years)' : 'جونئیر حفاظتی دائرہ (۵ تا ۸ سال)'}
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <span>{isEn ? 'My 3 Trusted Grown-Ups' : 'میرے ۳ بھروسہ مند بالغ'}</span>
            </h2>
          </div>
          <div className="text-xs font-black text-emerald-900 bg-white px-3 py-1.5 rounded-full border border-emerald-200">
            {isEn ? `Picked: ${juniorSel.length} / 3` : `منتخب: ${juniorSel.length} / ۳`}
          </div>
        </div>

        {!juniorSaved ? (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-4 border border-emerald-200 shadow-sm">
              <p className="text-sm font-bold text-slate-800 leading-relaxed">
                {isEn
                  ? 'Pick 3 grown-ups who will listen without getting angry, believe you, and protect you.'
                  : 'ان ۳ بالغوں کا انتخاب کریں جو غصہ کیے بغیر بات سنیں، آپ پر یقین کریں اور آپ کی حفاظت کریں۔'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {JUNIOR_TRUSTED_ADULTS.map((adult) => {
                const isSelected = juniorSel.includes(adult.id);
                const name = isEn ? adult.nameEnglish : adult.nameUrdu;
                return (
                  <div
                    key={adult.id}
                    onClick={() => toggleJuniorAdult(adult.id, name)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-950 shadow'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-4xl shrink-0">{adult.icon}</span>
                    <div className="flex-1">
                      <p className="font-extrabold text-sm text-slate-900">{name}</p>
                      <p className="text-xs text-slate-500 font-medium">{adult.role}</p>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-emerald-700 shrink-0" />}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleSaveJunior}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl shadow transition-transform active:scale-95"
            >
              {isEn ? 'Save My 3 Trusted Adults Circle 🛡️' : 'دائرہ محفوظ کریں (Save Circle) 🛡️'}
            </button>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4 bg-white rounded-3xl p-6 border-2 border-emerald-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              {isEn ? 'Junior Shield Network Badge Unlocked! 🛡️' : 'مبارک ہو! جونئیر شیلڈ نیٹ ورک بیج حاصل ہوا! 🛡️'}
            </h3>
            <p className="text-sm font-bold text-slate-600">
              {isEn ? 'You identified 3 trusted adults you can always rely on.' : 'آپ نے ان ۳ لوگوں کی شناخت کر لی جن پر آپ ہمیشہ بھروسہ کر سکتے ہیں۔'}
            </p>
            <button
              onClick={() => {
                setJuniorSel([]);
                setJuniorSaved(false);
              }}
              className="bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl shadow hover:bg-emerald-700"
            >
              {isEn ? 'Update My Circle' : 'دوبارہ انتخاب کریں'}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ============================================================
     EXPLORER VIEW (8-10+) - Original Untouched Code
     ============================================================ */

  const toggleAdult = (id: string, name: string) => {
    let updated: string[];
    if (selected.includes(id)) {
      updated = selected.filter((item) => item !== id);
    } else {
      if (selected.length >= 3) {
        speakText(
          isEn ? 'You have already selected 3 trusted adults.' : 'آپ پہلے ہی 3 بھروسہ مند بالغ چن چکے ہیں۔',
          language
        );
        return;
      }
      updated = [...selected, id];
      speakText(isEn ? `${name} selected!` : `${name} چنا گیا!`, language);
    }
    setSelected(updated);
  };

  const handleSave = () => {
    if (selected.length < 3) {
      speakText(
        isEn ? 'Please select at least 3 trusted adults!' : 'براہ کرم کم از کم 3 بھروسہ مند بالغ منتخب کریں!',
        language
      );
      return;
    }
    onSaveTrustedAdults(selected);
    setHasSaved(true);
    onEarnBadge(isEn ? 'Trusted Tree 🌳' : 'بھروسہ مند درخت 🌳');
    speakText(
      isEn
        ? 'Awesome! Your trusted network is saved! You can always talk to these 3 adults if anything bothers you.'
        : 'بہت اعلیٰ! آپ کا بھروسہ مند نیٹ ورک مکمل ہو گیا۔ کسی بھی پریشانی میں ان 3 بالغوں سے مدد لیں۔',
      language
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-teal-100 p-6 max-w-2xl mx-auto font-sans">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>{isEn ? 'My 3 Trusted Adults' : 'میرے 3 بھروسہ مند بالغ (Trusted Adults)'}</span>
            <Trees className="w-6 h-6 text-emerald-600" />
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEn
              ? 'Identify 3 grown-ups you can ALWAYS talk to if you feel scared'
              : 'Identify 3 grown-ups you can ALWAYS talk to if you feel scared'}
          </p>
        </div>

        <div className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
          {isEn ? `Selected: ${selected.length} / 3` : `منتخب: ${selected.length} / 3`}
        </div>
      </div>

      {!hasSaved ? (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-emerald-950 text-left">
            <p className="font-extrabold text-base mb-1">
              {isEn ? 'Who are Trusted Adults?' : 'بھروسہ مند بالغ کون ہیں؟'}
            </p>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              {isEn
                ? 'Grown-ups who listen carefully, believe you, and keep you safe. If anything makes you feel scared or confused, tell one of these 3 adults right away!'
                : 'وہ 3 بڑے جو آپ کی بات غور سے سنیں، آپ پر یقین کریں، اور آپ کو کبھی نقصان نہ پہنچائیں۔ کسی بھی ڈر یا پریشانی کی صورت میں ان 3 میں سے کسی کو فوراً بتائیں!'}
            </p>

            <button
              onClick={() =>
                speakText(
                  isEn
                    ? 'Trusted adults are grown-ups who keep you safe and believe the truth!'
                    : 'بھروسہ مند بالغ وہ ہیں جو آپ کی حفاظت کرتے ہیں اور سچ پر یقین کرتے ہیں!',
                  language
                )
              }
              className="mt-3 inline-flex items-center gap-1.5 bg-white text-emerald-800 hover:bg-emerald-100 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-300 shadow-sm"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isEn ? 'Listen Rule' : 'اصول سنیں'}</span>
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TRUSTED_ADULT_OPTIONS.map((item) => {
              const isSelected = selected.includes(item.id);
              const displayName = isEn ? item.nameEnglish : item.nameUrdu;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleAdult(item.id, displayName)}
                  id={`adult-card-${item.id}`}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center relative ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/80 ring-4 ring-emerald-300/40 shadow-md'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="text-4xl mb-2">{item.icon}</div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {displayName}
                  </h4>
                </div>
              );
            })}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={selected.length < 3}
            id="btn-save-trusted-tree"
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold py-4 rounded-2xl shadow-lg transition-transform active:scale-[0.98]"
          >
            {isEn ? 'Save 3 Trusted Adults' : 'بھروسہ مند درخت محفوظ کریں (Save 3 Adults)'}
          </button>
        </div>
      ) : (
        /* Victory View */
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 py-6"
        >
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-12 h-12" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {isEn ? 'Awesome! Trusted Network Ready! 🌳' : 'مبارک ہو! آپ کا بھروسہ مند نیٹ ورک تیار ہو گیا! 🌳'}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {isEn ? 'You selected your 3 most trusted grown-ups.' : 'آپ نے اپنے 3 سب سے زیادہ قابلِ بھروسہ بڑوں کا انتخاب کر لیا ہے۔'}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-left">
            <p className="text-xs font-bold text-emerald-800 mb-2">
              {isEn ? 'Your Selected Adults:' : 'آپ کے منتخب کردہ بالغ:'}
            </p>
            <div className="flex gap-2 flex-wrap justify-start">
              {selected.map((id) => {
                const adult = TRUSTED_ADULT_OPTIONS.find((a) => a.id === id);
                return (
                  <span
                    key={id}
                    className="bg-white border border-emerald-300 text-emerald-950 font-bold text-xs px-3 py-1.5 rounded-full shadow-sm"
                  >
                    {adult?.icon} {isEn ? adult?.nameEnglish : adult?.nameUrdu}
                  </span>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setHasSaved(false)}
            id="btn-edit-trusted-adults"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-2xl shadow transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isEn ? 'Edit Network' : 'تبدیل کریں (Edit Network)'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
