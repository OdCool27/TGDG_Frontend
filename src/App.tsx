import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { GameHeader } from './components/layout/GameHeader';
import { LandingScreen } from './components/screens/LandingScreen';
import { CharacterSetupScreen } from './components/screens/CharacterSetupScreen';
import { LobbyScreen } from './components/screens/LobbyScreen';
import { StoryScreen } from './components/screens/StoryScreen';
import { ChoiceScreen } from './components/screens/ChoiceScreen';
import { WaitingScreen } from './components/screens/WaitingScreen';
import { OutcomeScreen } from './components/screens/OutcomeScreen';
import { ChapterRecapScreen } from './components/screens/ChapterRecapScreen';
import { EndingScreen } from './components/screens/EndingScreen';

const GameRouter: React.FC = () => {
  const { sessionId, sessionState, isHost, loading } = useGame();
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [inChoiceMode, setInChoiceMode] = useState(false);
  const [setupMode, setSetupMode] = useState<'none' | 'create' | 'join'>('none');
  const [targetJoinCode, setTargetJoinCode] = useState<string>('');

  // Check URL ?join=CODE on load if not in session
  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionId) {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('join');
      if (code) {
        setTargetJoinCode(code.toUpperCase());
        setSetupMode('join');
      }
    }
  }, [sessionId]);

  // Reset inChoiceMode when scene changes
  useEffect(() => {
    setInChoiceMode(false);
  }, [sessionState?.currentScene?.id]);

  // 1. Not in a game session -> Setup or Landing
  if (!sessionId) {
    if (setupMode === 'create') {
      return (
        <CharacterSetupScreen
          mode="create"
          onBack={() => setSetupMode('none')}
          onComplete={() => setSetupMode('none')}
        />
      );
    }

    if (setupMode === 'join') {
      return (
        <CharacterSetupScreen
          mode="join"
          joinCode={targetJoinCode}
          onBack={() => setSetupMode('none')}
          onComplete={() => setSetupMode('none')}
        />
      );
    }

    return (
      <LandingScreen
        onStartHostSetup={() => setSetupMode('create')}
        onStartGuestSetup={(code) => {
          setTargetJoinCode(code);
          setSetupMode('join');
        }}
      />
    );
  }

  // Loading initial session state
  if (!sessionState) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center text-white">
        <div className="space-y-3">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#9f96c7]">Connecting to your date. The server may take a minute to wake.</p>
        </div>
      </div>
    );
  }

  // 2. Character Setup Screen in active session (editing avatar)
  const currentPlayer = isHost ? sessionState?.host : sessionState?.guest;
  const isCharacterReady = currentPlayer?.isReady ?? false;

  if (!isCharacterReady || isEditingAvatar) {
    return (
      <CharacterSetupScreen
        mode="edit"
        onBack={() => setIsEditingAvatar(false)}
        onComplete={() => {
          setIsEditingAvatar(false);
        }}
      />
    );
  }

  // 3. Routing based on Session Status
  const status = sessionState?.status || 'lobby';

  // Lobby
  if (status === 'lobby') {
    return <LobbyScreen onEditAvatar={() => setIsEditingAvatar(true)} />;
  }

  // Chapter Recap transition
  if (status === 'chapter_recap') {
    return <ChapterRecapScreen />;
  }

  // Game Ended
  if (status === 'ended' || status === 'ending_reached') {
    return <EndingScreen />;
  }

  // Outcome Revealed (Both submitted)
  if (status === 'outcome_revealed') {
    return <OutcomeScreen />;
  }

  // Choices Pending or In Story
  const hasMySubmitted = isHost
    ? sessionState?.submissionStatus.hostSubmitted
    : sessionState?.submissionStatus.guestSubmitted;

  // If already submitted choice, show waiting room
  if (hasMySubmitted) {
    return <WaitingScreen />;
  }

  // If in choice mode or status is choice_pending, show choice screen
  if (inChoiceMode) {
    return <ChoiceScreen key={sessionState?.currentScene?.id} />;
  }

  // Default: In Story Dialogue
  return (
    <StoryScreen
      key={sessionState?.currentScene?.id}
      onProceedToChoice={() => {
        setInChoiceMode(true);
      }}
    />
  );
};

export default function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-[#110e24] text-white flex flex-col font-['Plus_Jakarta_Sans'] antialiased">
        <GameHeader />
        <GameError />
        <main className="flex-1 flex flex-col justify-center items-center p-2 sm:p-4">
          <GameRouter />
        </main>
      </div>
    </GameProvider>
  );
}

function GameError() {
  const { error, clearError } = useGame();
  return error ? <div role="alert" className="mx-auto max-w-lg m-3 p-3 rounded-xl bg-red-950 text-red-100 text-sm">{error} <button className="underline ml-2" onClick={clearError}>Dismiss</button></div> : null;
}
