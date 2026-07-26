import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PAKISTANI_HELPLINES } from '../data/safetyData';
import { DistressAlert, ChildProfile } from '../types';
import {
  ShieldAlert,
  PhoneCall,
  BookOpen,
  UserCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Award,
  Key,
} from 'lucide-react';

interface ParentDashboardProps {
  childProfile: ChildProfile;
  parentPin: string;
  onUpdatePin: (newPin: string) => void;
  onBackToChild: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  childProfile,
  parentPin,
  onUpdatePin,
  onBackToChild,
}) => {
  const [alerts, setAlerts] = useState<DistressAlert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [activeTab, setActiveTab] = useState<'alerts' | 'helplines' | 'guide' | 'progress'>('alerts');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState('');

  const fetchAlerts = async () => {
    setLoadingAlerts(true);
    try {
      const res = await fetch('/api/parent/alerts');
      const data = await res.json();
      if (data.alerts) {
        setAlerts(data.alerts);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoadingAlerts(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleClearAlert = async (alertId?: string) => {
    try {
      await fetch('/api/parent/alerts/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId }),
      });
      fetchAlerts();
    } catch (err) {
      console.error('Error clearing alert:', err);
    }
  };

  const handlePinChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length === 4 && /^\d+$/.test(newPinInput)) {
      onUpdatePin(newPinInput);
      setPinChangeMsg('سیکیورٹی پن کامیابی سے تبدیل ہو گیا!');
      setNewPinInput('');
    } else {
      setPinChangeMsg('براہ کرم 4 ہندسوں پر مشتمل پن لکھیں۔');
    }
  };

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#EDE9FE] text-[#2D3436] pb-12 font-sans">
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b-4 border-purple-300 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToChild}
              id="btn-parent-to-child"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black px-4 py-2.5 rounded-full shadow-[0_4px_0_#065F46] active:translate-y-1 active:shadow-none transition-all flex items-center gap-1.5 border-2 border-white"
            >
              <ArrowRight className="w-4 h-4 dir-rtl" />
              <span>بچّوں کے پورٹل پر جائیں</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-right dir-rtl">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white border-2 border-purple-300 flex items-center justify-center font-black text-xl shadow-md">
              👨‍👩‍👧
            </div>
            <div>
              <h1 className="font-black text-sm sm:text-base text-purple-950">
                والدین ڈیش بورڈ (Parent Control & Safety)
              </h1>
              <p className="text-[11px] font-bold text-purple-700 tracking-wide">
                Safeguard Buddy • Monitoring & Helplines
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="bg-white p-2.5 rounded-[2rem] shadow-[0_8px_0_#D8B4FE] border-4 border-purple-300 grid grid-cols-2 sm:grid-cols-4 gap-2 text-right dir-rtl">
          <button
            onClick={() => setActiveTab('alerts')}
            id="tab-parent-alerts"
            className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 border-2 relative ${
              activeTab === 'alerts'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-white shadow-[0_4px_0_#4C1D95]'
                : 'bg-purple-50/70 text-purple-950 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>تنبیہات (Distress Alerts)</span>
            {activeAlertsCount > 0 && (
              <span className="w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse border border-white">
                {activeAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('helplines')}
            id="tab-parent-helplines"
            className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 border-2 ${
              activeTab === 'helplines'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-white shadow-[0_4px_0_#1E40AF]'
                : 'bg-purple-50/70 text-purple-950 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>ہیلپ لائنز (Helplines)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            id="tab-parent-guide"
            className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 border-2 ${
              activeTab === 'guide'
                ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white border-white shadow-[0_4px_0_#831843]'
                : 'bg-purple-50/70 text-purple-950 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>رہنمائی (Safety Guide)</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            id="tab-parent-progress"
            className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 border-2 ${
              activeTab === 'progress'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-white shadow-[0_4px_0_#065F46]'
                : 'bg-purple-50/70 text-purple-950 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>بچّے کا جائزہ (Progress & PIN)</span>
          </button>
        </div>

        {/* Tab Content Panels with Entry/Exit Animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.99 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {/* Tab 1: Distress Alerts */}
            {activeTab === 'alerts' && (
              <div className="space-y-4 text-right dir-rtl">
                <div className="flex items-center justify-between bg-white p-5 rounded-3xl border-4 border-purple-300 shadow-sm">
                  <div>
                    <h2 className="text-lg font-black text-purple-950 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-rose-500" />
                      <span>بچّے کی گفتگو میں تحفظاتی الرٹس (Distress Monitoring)</span>
                    </h2>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                      اگر بچہ "چھونا"، "ڈر"، "چوٹ" یا "مدد" جیسے الفاظ بولے تو فوراً نیچے جھنڈا دکھایا جاتا ہے۔
                    </p>
                  </div>

                  <button
                    onClick={fetchAlerts}
                    className="p-2.5 bg-purple-100 hover:bg-purple-200 text-purple-950 rounded-xl text-xs font-black border-2 border-purple-300 flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ریفریش</span>
                  </button>
                </div>

                {alerts.length > 0 ? (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-5 rounded-3xl border-4 space-y-3 ${
                          alert.status === 'active'
                            ? 'bg-rose-50 border-rose-400 text-[#2D3436] shadow-[0_6px_0_#F43F5E]'
                            : 'bg-white border-purple-200 text-[#2D3436]'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                          <div className="flex items-center gap-2">
                            {alert.status === 'active' ? (
                              <span className="bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse flex items-center gap-1 border border-white">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>CONCERN: Child may be in distress</span>
                              </span>
                            ) : (
                              <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>حل ہو گیا (Resolved)</span>
                              </span>
                            )}
                          </div>

                          <span className="text-xs text-slate-500 font-mono font-bold">
                            {new Date(alert.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 text-xs">
                          <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-200">
                            <span className="text-purple-800 font-black block mb-1">
                              بچّے کا پیغام (Child Message):
                            </span>
                            <p className="text-purple-950 font-black text-sm">
                              "{alert.contextMessage}"
                            </p>
                            <span className="inline-block mt-2 text-[10px] bg-rose-500 text-white font-black px-2.5 py-0.5 rounded-full border border-white">
                              محرک لفظ (Trigger): {alert.triggerWord}
                            </span>
                          </div>

                          <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-300">
                            <span className="text-emerald-800 font-black block mb-1">
                              سیف گارڈ بڈی کا جواب (Safeguard Buddy's Guidance):
                            </span>
                            <p className="text-slate-800 font-bold text-xs leading-relaxed">
                              "{alert.salamResponse}"
                            </p>
                          </div>
                        </div>

                        {alert.status === 'active' && (
                          <div className="pt-1 flex justify-end">
                            <button
                              onClick={() => handleClearAlert(alert.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-[0_4px_0_#065F46] active:translate-y-1 active:shadow-none transition-all border border-white"
                            >
                              الرٹ کو چیک اور حل شدہ نشان زد کریں
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 bg-white rounded-3xl border-4 border-purple-300 text-center text-slate-500 shadow-sm">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                    <p className="font-black text-base text-purple-950">
                      ماشاءاللہ! کوئی تشویش ناک الرٹ نہیں ہے۔
                    </p>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                      بچّہ بالکل محفوظ گفتگو کر رہا ہے۔
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Helplines */}
            {activeTab === 'helplines' && (
              <div className="space-y-4 text-right dir-rtl">
                <div className="bg-white p-5 rounded-3xl border-4 border-purple-300 shadow-sm">
                  <h2 className="text-lg font-black text-purple-950 flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-fuchsia-600" />
                    <span>پاکستان کی قومی ایمرجنسی ہیلپ لائنز (Emergency Helplines)</span>
                  </h2>
                  <p className="text-xs font-bold text-slate-500 mt-1">
                    کسی بھی ہنگامی صورتحال یا بچوں کے تحفظ کے لیے ان نمبروں پر مفت کال کی جا سکتی ہے۔
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {PAKISTANI_HELPLINES.map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white p-5 rounded-3xl border-4 border-purple-300 flex flex-col justify-between shadow-[0_6px_0_#E9D5FF] hover:shadow-[0_8px_0_#C084FC] transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-100 text-purple-950 border-2 border-purple-300">
                            ہیلپ لائن: {line.number}
                          </span>
                          <h3 className="font-black text-purple-950 text-base">
                            {line.nameUrdu}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-bold">
                          {line.descriptionUrdu}
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t-2 border-purple-100 flex items-center justify-between">
                        <a
                          href={`tel:${line.number}`}
                          id={`btn-call-helpline-${line.number}`}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_4px_0_#065F46] active:translate-y-1 active:shadow-none transition-all border border-white"
                        >
                          <PhoneCall className="w-4 h-4" />
                          <span>فوراً کال کریں ({line.number})</span>
                        </a>

                        <span className="text-[11px] text-slate-500 font-extrabold">
                          {line.nameEnglish}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Parenting Guidance */}
            {activeTab === 'guide' && (
              <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border-4 border-purple-300 text-right dir-rtl space-y-6 shadow-[0_8px_0_#D8B4FE]">
                <div className="border-b-2 border-purple-100 pb-4">
                  <h2 className="text-xl font-black text-purple-950 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-fuchsia-600" />
                    <span>والدین کے لیے جسمانی تحفظ کی اہم رہنمائی</span>
                  </h2>
                  <p className="text-xs font-bold text-slate-500 mt-1">
                    Body Safety Guidelines for Pakistani Parents
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-sm leading-relaxed">
                  <div className="space-y-3 bg-purple-50/80 p-5 rounded-2xl border-2 border-purple-200">
                    <h3 className="font-black text-purple-900 text-base">
                      1. سوٹ سوئم پارٹس اور حد بندی (Private Boundaries)
                    </h3>
                    <p className="text-slate-800 text-xs font-bold">
                      بچّوں کو سکھائیں کہ کپڑوں کے اندر موجود حصے (ان کے سوٹ سوئم پارٹس) صرف ان کی اپنی ملکیت ہیں۔ بغیر اجازت یا بغیر امی ابو کی موجودگی کے کوئی انہیں وہاں نہیں چھو سکتا۔
                    </p>
                  </div>

                  <div className="space-y-3 bg-purple-50/80 p-5 rounded-2xl border-2 border-purple-200">
                    <h3 className="font-black text-purple-900 text-base">
                      2. "نہیں" کہنے کا حق (Permission to Say NO)
                    </h3>
                    <p className="text-slate-800 text-xs font-bold">
                      بچوں پر یہ واضح کریں کہ اگر کوئی بالغ یا رشتے دار بھی ایسا رویہ اپنائے جس سے بچہ غیر محفوظ محسوس کرے، تو بچہ باادب لیکن مضبوطی سے "نہیں!" کہہ سکتا ہے۔
                    </p>
                  </div>

                  <div className="space-y-3 bg-purple-50/80 p-5 rounded-2xl border-2 border-purple-200">
                    <h3 className="font-black text-purple-900 text-base">
                      3. راز نہ چھپانے کی تربیت (No Bad Secrets)
                    </h3>
                    <p className="text-slate-800 text-xs font-bold">
                      سرپرائز تحائف جیسے اچھے راز جائز ہیں، لیکن کوئی بھی ایسا راز جو ڈرائے یا پریشان کرے — بچہ اسے کبھی نہ چھپائے۔ بچّے کو یقین دلائیں کہ سچ بتانے پر اسے ڈانٹ نہیں پڑے گی۔
                    </p>
                  </div>

                  <div className="space-y-3 bg-purple-50/80 p-5 rounded-2xl border-2 border-purple-200">
                    <h3 className="font-black text-purple-900 text-base">
                      4. بچّے پر اعتماد کی اہمیت (Believing the Child)
                    </h3>
                    <p className="text-slate-800 text-xs font-bold">
                      اگر بچہ کبھی بھی کسی رویے یا چھونے کی شکایت کرے، تو بغیر غصہ کیے اس پر پورا اعتماد کریں اور سکون سے سنیں۔ آپ کا رویہ ہی بچے کی سب سے بڑی ڈھال ہے۔
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Child Progress & Security PIN */}
            {activeTab === 'progress' && (
              <div className="grid md:grid-cols-2 gap-6 text-right dir-rtl">
                {/* Profile Overview */}
                <div className="bg-white p-6 rounded-[2.5rem] border-4 border-purple-300 space-y-4 shadow-sm">
                  <h2 className="text-lg font-black text-purple-950 flex items-center gap-2 border-b-2 border-purple-100 pb-3">
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                    <span>بچّے کی پروفائل اور کارکردگی</span>
                  </h2>

                  <div className="flex items-center gap-4 bg-purple-50 p-4 rounded-2xl border-2 border-purple-200">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white border-2 border-purple-300 flex items-center justify-center text-4xl shadow-sm">
                      {childProfile.avatar.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-purple-950 text-base">
                        {childProfile.nickname} ({childProfile.avatar.nameUrdu})
                      </h3>
                      <p className="text-xs font-bold text-slate-500">
                        عمر کا گروپ: <span className="font-black text-purple-800">{childProfile.ageBracket} سال</span>
                      </p>
                    </div>
                  </div>

                  {/* Earned Badges */}
                  <div>
                    <label className="block text-xs font-black text-purple-950 mb-2">
                      حاصل کردہ بیجز ({childProfile.earnedBadges.length}):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {childProfile.earnedBadges.length > 0 ? (
                        childProfile.earnedBadges.map((badge, idx) => (
                          <span
                            key={idx}
                            className="bg-purple-100 border-2 border-purple-300 text-purple-950 text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm"
                          >
                            <Award className="w-3.5 h-3.5 text-fuchsia-600" />
                            <span>{badge}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs font-bold text-slate-500">ابھی تک کوئی بیج نہیں ملا۔</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Change Security PIN */}
                <div className="bg-white p-6 rounded-[2.5rem] border-4 border-purple-300 space-y-4 shadow-sm">
                  <h2 className="text-lg font-black text-purple-950 flex items-center gap-2 border-b-2 border-purple-100 pb-3">
                    <Key className="w-5 h-5 text-fuchsia-600" />
                    <span>والدین کا سیکیورٹی پن تبدیل کریں</span>
                  </h2>

                  <form onSubmit={handlePinChangeSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-purple-950 mb-1.5">
                        نیا 4 ہندسوں والا پن (4-Digit PIN)
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        placeholder="****"
                        className="w-full text-center text-xl font-mono font-black py-3 border-4 border-purple-300 rounded-2xl bg-purple-50 text-purple-950 focus:border-purple-600 focus:outline-none"
                      />
                    </div>

                    {pinChangeMsg && (
                      <p className="text-xs font-black text-emerald-800 p-3 bg-emerald-50 rounded-2xl border-2 border-emerald-300">
                        {pinChangeMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      id="btn-update-pin-submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black py-3.5 rounded-2xl text-xs shadow-[0_4px_0_#4C1D95] active:translate-y-1 active:shadow-none transition-all border border-white"
                    >
                      نیا پن محفوظ کریں
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

