import React, { useState } from 'react';
import { Heart, Sparkles, UserPlus, ArrowRight, BookOpen, Music, Volume2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BarnabySprite } from '../pixel/BarnabySprite';
import { sound } from '../../utils/sound';

interface LandingScreenProps {
  onStartHostSetup: () => void;
  onStartGuestSetup: (code: string) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartHostSetup,
  onStartGuestSetup,
}) => {
  const { loading, error, clearError, isMusicPlaying, toggleMusic, currentThemeName } = useGame();
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    if (/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}$/.test(joinCodeInput.trim().toUpperCase())) {
      onStartGuestSetup(joinCodeInput.trim().toUpperCase());
    }
  };

  const handleHostClick = () => {
    sound.playClick();
    onStartHostSetup();
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
      {/* Decorative Rom-Com Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-medium mb-4">
        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
        <span>A Two-Player Virtual Date Comedy</span>
      </div>

      {/* Hero Title & Pixel Artwork Showcase */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 tracking-tight font-['Fredoka'] mb-2">
          The Great Date Glitch
        </h1>
        <p className="text-sm text-[#b8b0db] leading-relaxed max-w-sm mx-auto">
          Two webcams, three chapters, and one increasingly eventful evening of secret choices, takeout mishaps, and a date worth remembering.
        </p>
      </div>

      {/* Barnaby Character Welcome Preview */}
      <div className="relative my-2 p-3 rounded-2xl bg-[#1d1838] border-2 border-[#3b3464] shadow-lg flex items-center gap-4 w-full">
        <div className="shrink-0 bg-[#29224d] p-1.5 rounded-xl border border-purple-500/30">
          <BarnabySprite size="md" isExcited={true} />
        </div>
        <div className="text-left">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <span>Special Guest: Sir Barnaby</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded">Tuxedo Frenchie</span>
          </div>
          <p className="text-[11px] text-[#9f96c7] mt-0.5 leading-snug">
            “Hop on a phone or video call together for 20–35 minutes of laughter, secret choices, and zero awkward silence.”
          </p>
        </div>
      </div>

      {/* Soundtrack Banner */}
      <button
        onClick={toggleMusic}
        className={`w-full my-2 py-2 px-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
          isMusicPlaying
            ? 'bg-pink-950/50 border-pink-500/40 text-pink-200'
            : 'bg-[#1b1638] hover:bg-[#241e4b] border-[#362e60] text-[#b4acdc]'
        }`}
      >
        <div className="flex items-center gap-2">
          <Music className={`w-4 h-4 ${isMusicPlaying ? 'text-pink-400' : 'text-[#8e85b2]'}`} />
          <span>
            {isMusicPlaying ? (
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-white">Playing Rom-Com BGM:</span>
                <span className="text-pink-300">{currentThemeName}</span>
              </span>
            ) : (
              <span>🎵 Click to play romantic comedy background music</span>
            )}
          </span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 uppercase tracking-wider">
          {isMusicPlaying ? 'Mute' : 'Play'}
        </span>
      </button>

      {/* Error Alert */}
      {error && (
        <div className="w-full mt-2 p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-400 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {/* Main Action Selection */}
      <div className="w-full space-y-3 mt-4">
        {!isJoining ? (
          <>
            {/* Host Date Button */}
            <button
              onClick={handleHostClick}
              disabled={loading}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 active:scale-[0.98] text-white font-bold text-base shadow-[0_4px_20px_rgba(244,63,94,0.35)] flex items-center justify-between transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="text-left">
                  <div className="leading-tight font-['Fredoka']">Start a Date Room</div>
                  <div className="text-xs text-white/80 font-normal">Choose male/female avatar & host</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>

            {/* Join Partner Button */}
            <button
              onClick={() => setIsJoining(true)}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#231e42] hover:bg-[#2e2857] active:scale-[0.98] text-white font-semibold text-sm border-2 border-[#3d366a] flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="leading-tight font-['Fredoka']">Join Partner's Date</div>
                  <div className="text-xs text-[#9f96c7] font-normal">Enter 5-character code</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8e85b2]" />
            </button>
          </>
        ) : (
          /* Join Code Input Form */
          <form onSubmit={handleJoinSubmit} className="w-full p-5 rounded-2xl bg-[#1d1838] border-2 border-pink-500/40 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-pink-300 uppercase tracking-wider">Enter Join Code</span>
              <button
                type="button"
                onClick={() => setIsJoining(false)}
                className="text-xs text-[#8e85b2] hover:text-white"
              >
                Back
              </button>
            </div>

            <div>
              <input
                type="text"
                maxLength={5}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="e.g. SPARK"
                className="w-full text-center text-2xl tracking-[0.3em] font-mono font-black py-3 px-4 rounded-xl bg-[#120f24] border-2 border-[#3d366a] focus:border-pink-500 text-white placeholder:text-[#524b7a] focus:outline-none focus:ring-2 focus:ring-pink-500/40"
                autoFocus
              />
              <p className="text-[11px] text-[#8e85b2] text-center mt-1.5">
                Ask your date for their 5-character room code.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}$/.test(joinCodeInput.trim().toUpperCase())}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-md transition-all disabled:opacity-40"
            >
              Choose Avatar & Join Room
            </button>
          </form>
        )}
      </div>

      {/* How To Play Accordion */}
      <div className="w-full mt-6">
        <button
          onClick={() => setShowHowToPlay(!showHowToPlay)}
          className="w-full py-2.5 px-3 rounded-xl bg-[#16122d] hover:bg-[#1f193d] border border-[#2b2552] text-xs text-[#a298cb] flex items-center justify-center gap-2 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-pink-400" />
          <span>How does it work? (2-minute guide)</span>
        </button>

        {showHowToPlay && (
          <div className="mt-3 p-4 rounded-xl bg-[#141029] border border-[#2e2756] text-xs text-[#b8b0db] space-y-3 animate-in fade-in duration-200">
            <div className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold shrink-0">1</span>
              <div>
                <strong className="text-white">Jump on a call:</strong> Start a video call or regular phone call with your date on your laptop or phone.
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold shrink-0">2</span>
              <div>
                <strong className="text-white">Pick male or female avatars:</strong> Create your cozy pixel look before entering the room.
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold shrink-0">3</span>
              <div>
                <strong className="text-white">Make secret choices:</strong> Each player secretly chooses what to do. Neither sees the choice until both submit!
              </div>
            </div>
            <div className="text-[11px] text-[#8e85b2] pt-2 border-t border-white/5">
              Not a relationship quiz, compatibility test, or date planner. Just pure romantic comedy fun!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
