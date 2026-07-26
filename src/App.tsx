import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LanguageSelectionScreen } from './components/LanguageSelectionScreen';
import { SignInScreen } from './components/SignInScreen';
import { AgeSelectionScreen } from './components/AgeSelectionScreen';
import { AvatarSelectionScreen } from './components/AvatarSelectionScreen';
import { ChildrenDashboard } from './components/ChildrenDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { ChildProfile, AgeBracket, AvatarOption } from './types';
import { AVATARS } from './data/avatars';

export default function App() {
  // Screen views: 'welcome' | 'language_selection' | 'signin' | 'age_setup' | 'avatar_setup' | 'child_dashboard' | 'parent_dashboard'
  const [currentScreen, setCurrentScreen] = useState<string>('welcome');

  // Child Profile State
  const [childProfile, setChildProfile] = useState<ChildProfile>({
    id: 'child-1',
    nickname: 'چھوٹا دوست',
    ageBracket: '5-8',
    avatar: AVATARS[0],
    trustedAdults: ['ammi', 'abbu', 'teacher'],
    completedGames: [],
    earnedBadges: ['خوش آمدید بیج 🌟'],
    createdAt: Date.now(),
    language: 'ur', // Default Urdu, selected after welcome page
  });

  // Parent PIN State (default 1234)
  const [parentPin, setParentPin] = useState('1234');

  // Handlers for Navigation Flow
  const handleStartFromWelcome = () => {
    setCurrentScreen('language_selection');
  };

  const handleParentFromWelcome = () => {
    setCurrentScreen('language_selection');
  };

  const handleLanguageSelect = (lang: 'ur' | 'en') => {
    setChildProfile((prev) => ({
      ...prev,
      language: lang,
      nickname: lang === 'en' ? (prev.nickname === 'چھوٹا دوست' ? 'Little Friend' : prev.nickname) : (prev.nickname === 'Little Friend' ? 'چھوٹا دوست' : prev.nickname),
    }));
  };

  const handleLanguageConfirm = () => {
    setCurrentScreen('signin');
  };

  const handleChildLogin = () => {
    setCurrentScreen('age_setup');
  };

  const handleParentLogin = (inputPin: string): boolean => {
    if (inputPin === parentPin) {
      setCurrentScreen('parent_dashboard');
      return true;
    }
    return false;
  };

  const handleAgeConfirm = (nickname: string, ageBracket: AgeBracket) => {
    setChildProfile((prev) => ({
      ...prev,
      nickname,
      ageBracket,
    }));
    setCurrentScreen('avatar_setup');
  };

  const handleAvatarConfirm = (avatar: AvatarOption) => {
    setChildProfile((prev) => ({
      ...prev,
      avatar,
    }));
    setCurrentScreen('child_dashboard');
  };

  const handleDistressAlert = (triggerWord: string, context: string) => {
    console.warn(`Distress triggered by child [${triggerWord}]: "${context}"`);
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans selection:bg-teal-500 selection:text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full min-h-screen"
        >
          {currentScreen === 'welcome' && (
            <WelcomeScreen
              onStart={handleStartFromWelcome}
              onParentClick={handleParentFromWelcome}
            />
          )}

          {currentScreen === 'language_selection' && (
            <LanguageSelectionScreen
              selectedLanguage={childProfile.language}
              onSelectLanguage={handleLanguageSelect}
              onContinue={handleLanguageConfirm}
              onBack={() => setCurrentScreen('welcome')}
            />
          )}

          {currentScreen === 'signin' && (
            <SignInScreen
              onChildLogin={handleChildLogin}
              onParentLogin={handleParentLogin}
              onBack={() => setCurrentScreen('language_selection')}
              language={childProfile.language}
            />
          )}

          {currentScreen === 'age_setup' && (
            <AgeSelectionScreen
              onContinue={handleAgeConfirm}
              onBack={() => setCurrentScreen('signin')}
              language={childProfile.language}
            />
          )}

          {currentScreen === 'avatar_setup' && (
            <AvatarSelectionScreen
              nickname={childProfile.nickname}
              onSelectAvatar={handleAvatarConfirm}
              onBack={() => setCurrentScreen('age_setup')}
              language={childProfile.language}
            />
          )}

          {currentScreen === 'child_dashboard' && (
            <ChildrenDashboard
              profile={childProfile}
              onUpdateProfile={(updated) => setChildProfile(updated)}
              onSwitchToParent={() => setCurrentScreen('signin')}
              onDistressAlert={handleDistressAlert}
              onChangeAvatar={() => setCurrentScreen('avatar_setup')}
              onChangeLanguage={() => setCurrentScreen('language_selection')}
            />
          )}

          {currentScreen === 'parent_dashboard' && (
            <ParentDashboard
              childProfile={childProfile}
              parentPin={parentPin}
              onUpdatePin={(newPin) => setParentPin(newPin)}
              onBackToChild={() => setCurrentScreen('child_dashboard')}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

