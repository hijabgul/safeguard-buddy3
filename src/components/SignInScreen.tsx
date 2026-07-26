import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserCheck, Lock, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

interface SignInScreenProps {
  onChildLogin: () => void;
  onParentLogin: (pin: string) => boolean;
  onBack: () => void;
  language?: 'ur' | 'en';
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onChildLogin,
  onParentLogin,
  onBack,
  language = 'ur',
}) => {
  const isEn = language === 'en';
  const [activeTab, setActiveTab] = useState<'child' | 'parent'>('child');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const handleParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onParentLogin(pin);
    if (!success) {
      setPinError(isEn ? 'Incorrect PIN! (Default PIN: 1234)' : 'غلط پن کوڈ! (ڈیفالٹ پن: 1234)');
    } else {
      setPinError('');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0C091F] text-white flex flex-col justify-center items-center p-3 sm:p-6 relative font-sans overflow-y-auto">
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#140F33]/90 backdrop-blur-xl rounded-3xl sm:rounded-[2.5rem] shadow-[0_0_40px_rgba(147,51,234,0.35)] p-4 sm:p-8 border-2 border-purple-500/40 relative z-10 my-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          id="btn-signin-back"
          className="absolute top-3.5 left-3.5 text-purple-200 bg-[#221B4C] hover:bg-[#2D2363] p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-purple-500/40 transition-all active:scale-95 shadow-md z-20"
          title={isEn ? 'Go Back' : 'پیچھے جائیں'}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Header Icon */}
        <div className="text-center mb-5 sm:mb-6 pt-6 sm:pt-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white rounded-2xl border border-purple-300 flex items-center justify-center mx-auto mb-2.5 sm:mb-3 shadow-[0_0_20px_rgba(168,85,247,0.5)] text-xl sm:text-2xl font-black">
            👋
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase drop-shadow">
            {isEn ? 'Sign In' : 'لاگ ان (Sign In)'}
          </h2>
          <p className="text-[11px] sm:text-xs font-bold text-fuchsia-400 mt-0.5 sm:mt-1 uppercase tracking-wider">
            {isEn ? 'Please choose your role' : 'براہ کرم اپنا کردار منتخب کریں'}
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 bg-[#1D1740] p-1.5 sm:p-2 rounded-2xl mb-5 sm:mb-6 border border-purple-500/30">
          <button
            type="button"
            onClick={() => { setActiveTab('child'); setPinError(''); }}
            id="tab-signin-child"
            className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
              activeTab === 'child'
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border border-purple-300 shadow-[0_0_15px_rgba(217,70,239,0.5)]'
                : 'text-purple-300/80 hover:bg-[#251D52]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
            <span>{isEn ? 'Child' : 'بچہ (Child)'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('parent'); setPinError(''); }}
            id="tab-signin-parent"
            className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
              activeTab === 'parent'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-purple-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : 'text-purple-300/80 hover:bg-[#251D52]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
            <span>{isEn ? 'Parent' : 'والدین (Parent)'}</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'child' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="p-4 bg-[#1D1740] rounded-2xl border border-purple-500/40 text-left">
              <p className="font-extrabold text-fuchsia-300 text-base mb-1">
                {isEn ? 'Welcome to Safeguard Buddy World!' : 'سیف گارڈ بڈی کی دنیا میں خوش آمدید!'}
              </p>
              <p className="text-xs text-purple-200/90 leading-relaxed font-bold">
                {isEn
                  ? 'Children can play, practice body safety, and learn with an interactive AI friend in English.'
                  : 'یہاں بچّے بغیر کسی پیچیدہ پاسورڈ کے آسان پروفائل سیٹ اپ کے ساتھ کھیل سکتے ہیں اور سیکھ سکتے ہیں۔'}
              </p>
            </div>

            <button
              onClick={onChildLogin}
              id="btn-child-fast-start"
              className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-base py-4 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.6)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 border border-purple-300"
            >
              <span>{isEn ? 'Continue as Child' : 'بچّے کے طور پر لاگ ان کریں'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <form onSubmit={handleParentSubmit} className="space-y-4">
              <div className="text-left">
                <label className="block text-xs font-black text-purple-200 mb-1.5">
                  {isEn ? 'Security PIN for Parents' : 'والدین کا سیکیورٹی پن (Security PIN)'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="****"
                    className="w-full text-center text-2xl tracking-widest font-mono py-3 border-2 border-purple-500/50 rounded-2xl focus:border-fuchsia-400 focus:outline-none bg-[#1D1740] text-white font-extrabold"
                  />
                  <Lock className="w-5 h-5 text-fuchsia-400 absolute right-4 top-4" />
                </div>
                <p className="text-[11px] font-bold text-purple-300/80 mt-1">
                  {isEn ? 'First-time default PIN: ' : 'پہلی بار ڈیفالٹ پن: '}<span className="font-black text-fuchsia-400">1234</span>
                </p>
              </div>

              {pinError && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/80 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                id="btn-parent-login-submit"
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-black text-base py-3.5 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.5)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 border border-purple-300"
              >
                <span>{isEn ? 'Open Parents Dashboard' : 'والدین ڈیش بورڈ کھولیں'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};
