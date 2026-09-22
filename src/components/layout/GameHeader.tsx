import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Heart,
  LogOut,
  Bot,
  Sliders,
  X,
  Play,
  Pause,
  Disc,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { MusicTheme } from '../../utils/sound';

export const GameHeader: React.FC = () => {
  const {
    sessionId,
    sessionState,
    isSoundMuted,
    isMusicMuted,
    isMusicPlaying,
    currentThemeName,
    toggleSound,
    toggleMusic,
    setMusicTheme,
    leaveGame,
    isMock,
    toggleMockMode,
    simulatedPartner,
    toggleSimulatedPartner,
  } = useGame();

  const [showAudioMenu, setShowAudioMenu] = useState(false);

  const THEMES: Array<{ id: MusicTheme; label: string; desc: string }> = [
    { id: 'lobby', label: 'First Spark', desc: 'Upbeat rom-com intro swing' },
    { id: 'story', label: 'Virtual Bistro', desc: 'Cozy lo-fi date atmosphere' },
    { id: 'choice', label: 'Glitch in Motion', desc: 'Playful comedic suspense' },
    { id: 'outcome', label: 'Cannoli Harmony', desc: 'Sweet romantic celebration' },
    { id: 'midnight', label: 'Midnight Frequency', desc: 'Intimate late-night talk' },
  ];

  return (
    <header className="w-full bg-[#16132b]/95 backdrop-blur-md border-b border-[#2e2952] py-2 px-3 sm:px-6 sticky top-0 z-50 flex items-center justify-between shadow-md">
      {/* Title & Brand */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center shadow-[0_0_10px_rgba(244,63,94,0.4)]">
          <Heart className="w-4 h-4 text-white fill-white" />
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5 font-['Fredoka']">
            <span>The Great Date Glitch</span>
            {sessionState?.currentChapter && sessionState.status !== 'ended' && (
              <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                Ch. {sessionState.currentChapter}
              </span>
            )}
          </h1>
          <p className="text-[10px] text-[#8e85b2] hidden sm:block">A Two-Player Rom-Com Interactive Game</p>
        </div>
      </div>

      {/* Header Utilities */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Mock / Live Adapter Mode Badge */}
        {import.meta.env.DEV && <button
          onClick={toggleMockMode}
          title={isMock ? 'Running in Preview / Mock mode (Click to switch to Render API)' : 'Connected to Render API'}
          className="text-[10px] font-mono px-2 py-1 rounded bg-[#231f40] hover:bg-[#2e2954] text-[#b4acdc] border border-[#3c3668] transition-colors flex items-center gap-1"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isMock ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <span className="hidden xs:inline">{isMock ? 'Mock Preview' : 'Live API'}</span>
        </button>}

        {/* Solo Partner Simulation Toggle if in session */}
        {sessionId && isMock && sessionState?.status !== 'ended' && (
          <button
            onClick={toggleSimulatedPartner}
            title="Toggle automated partner responses for solo preview testing"
            className={`text-[10px] px-2 py-1 rounded border transition-colors flex items-center gap-1 ${
              simulatedPartner
                ? 'bg-purple-900/60 border-purple-400 text-purple-200'
                : 'bg-[#231f40] border-[#3c3668] text-[#8e85b2] hover:text-white'
            }`}
          >
            <Bot className="w-3 h-3" />
            <span className="hidden sm:inline">Auto-Partner</span>
          </button>
        )}

        {/* BGM Music Toggle with Equalizer */}
        <div className="relative">
          <button
            onClick={toggleMusic}
            title={isMusicMuted ? 'Play romantic comedy background music' : 'Mute music'}
            className={`h-8 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 ${
              isMusicPlaying
                ? 'bg-pink-950/60 border-pink-500/50 text-pink-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                : 'bg-[#231f40] border-[#3c3668] text-[#8e85b2] hover:text-white'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'text-pink-400' : ''}`} />
            
            {/* Equalizer animation bars */}
            {isMusicPlaying ? (
              <span className="flex items-end gap-[2px] h-3 w-3">
                <span className="w-[2px] h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDuration: '0.4s' }} />
                <span className="w-[2px] h-2 bg-pink-300 rounded-full animate-pulse" style={{ animationDuration: '0.6s' }} />
                <span className="w-[2px] h-2.5 bg-rose-400 rounded-full animate-pulse" style={{ animationDuration: '0.5s' }} />
              </span>
            ) : (
              <span className="text-[10px] hidden xs:inline">BGM</span>
            )}
          </button>
        </div>

        {/* Sound FX Toggle Button */}
        <button
          onClick={toggleSound}
          title={isSoundMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          aria-label={isSoundMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 ${
            !isSoundMuted
              ? 'bg-[#231f40] hover:bg-[#2f2956] text-pink-400 border-[#3c3668]'
              : 'bg-[#1b1733] text-[#6d6490] border-[#2f2952]'
          }`}
        >
          {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Audio Menu Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowAudioMenu((prev) => !prev)}
            title="Audio & Music Jukebox"
            className="w-8 h-8 rounded-lg bg-[#231f40] hover:bg-[#2f2956] text-[#b4acdc] hover:text-white border border-[#3c3668] flex items-center justify-center transition-colors"
          >
            <Disc className="w-3.5 h-3.5" />
          </button>

          {/* Audio Dropdown Popover */}
          {showAudioMenu && (
            <div className="absolute right-0 top-10 w-64 p-3 rounded-xl bg-[#171333] border-2 border-[#3d346b] shadow-2xl z-50 text-xs space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-pink-400" />
                  <span>Audio & Jukebox</span>
                </span>
                <button
                  onClick={() => setShowAudioMenu(false)}
                  className="text-[#8e85b2] hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Master Switches */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  onClick={toggleMusic}
                  className={`p-2 rounded-lg border flex items-center justify-center gap-1.5 font-semibold ${
                    !isMusicMuted
                      ? 'bg-pink-500/20 border-pink-500/40 text-pink-200'
                      : 'bg-[#201a40] border-[#362e60] text-[#8e85b2]'
                  }`}
                >
                  <Music className="w-3 h-3" />
                  <span>Music: {!isMusicMuted ? 'On' : 'Muted'}</span>
                </button>

                <button
                  onClick={toggleSound}
                  className={`p-2 rounded-lg border flex items-center justify-center gap-1.5 font-semibold ${
                    !isSoundMuted
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-200'
                      : 'bg-[#201a40] border-[#362e60] text-[#8e85b2]'
                  }`}
                >
                  <Volume2 className="w-3 h-3" />
                  <span>SFX: {!isSoundMuted ? 'On' : 'Muted'}</span>
                </button>
              </div>

              {/* Theme Picker */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-[#8e85b2] font-bold uppercase tracking-wider block">
                  Select Theme Track:
                </span>
                <div className="space-y-1">
                  {THEMES.map((theme) => {
                    const isSelected = currentThemeName.includes(theme.label);
                    return (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setMusicTheme(theme.id);
                          if (isMusicMuted) {
                            toggleMusic();
                          }
                        }}
                        className={`w-full text-left p-1.5 rounded-lg border transition-all flex items-center justify-between text-[11px] ${
                          isSelected
                            ? 'bg-pink-500/20 border-pink-500/50 text-white font-bold'
                            : 'bg-[#1b163a] border-transparent hover:border-[#3c346c] text-[#cfc8ee]'
                        }`}
                      >
                        <div>
                          <div>{theme.label}</div>
                          <div className="text-[9px] text-[#8e85b2] font-normal">{theme.desc}</div>
                        </div>
                        {isSelected && isMusicPlaying && (
                          <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Leave session button if in game */}
        {sessionId && (
          <button
            onClick={leaveGame}
            title="Leave date session"
            className="w-8 h-8 rounded-lg bg-[#231f40] hover:bg-red-950/50 text-[#8e85b2] hover:text-red-400 border border-[#3c3668] hover:border-red-500/40 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
