import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { PixelCharacter } from '../pixel/PixelCharacter';
import { BarnabySprite } from '../pixel/BarnabySprite';
import { Trophy, Sparkles, RotateCcw, Heart, Flame, ShieldAlert, Award } from 'lucide-react';
import { sound } from '../../utils/sound';

export const EndingScreen: React.FC = () => {
  const { sessionState, leaveGame } = useGame();
  const ending = sessionState?.ending;

  useEffect(() => {
    sound.playFanfare();
  }, []);

  if (!ending) {
    return (
      <div className="p-8 text-center text-white">
        <div>Calculating final date verdict...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 sm:py-8 space-y-4 animate-in fade-in duration-500">
      {/* Grand Title Banner */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold uppercase tracking-wider mb-1">
          <Trophy className="w-3.5 h-3.5 text-pink-400" />
          <span>Date Night Finale</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 font-['Fredoka']">
          {ending.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#beb6e0] font-medium">
          {ending.subtitle}
        </p>
      </div>

      {/* Characters Reunion Portrait Card */}
      <div className="p-4 rounded-2xl bg-[#171233] border-2 border-[#393166] shadow-xl flex items-center justify-center gap-4 relative overflow-hidden">
        <div className="flex items-center -space-x-4">
          <PixelCharacter
            customization={sessionState.host.character}
            overrideExpression="delighted"
            size="md"
          />
          <div className="z-20 -mb-4">
            <BarnabySprite size="sm" isExcited={true} />
          </div>
          <PixelCharacter
            customization={sessionState.guest?.character || {
              name: 'Partner',
              gender: 'male',
              hairStyle: 'short_casual',
              hairColor: '#e67e22',
              skinTone: '#ffd1b3',
              outfitColor: '#6c5ce7',
              bodyStyle: 'sweater',
              glasses: false,
              roomTheme: 'neon_gamer',
            }}
            overrideExpression="delighted"
            size="md"
          />
        </div>

        <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
          {ending.badge}
        </div>
      </div>

      {/* Narrative Epilogue */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#1a143b] border-2 border-pink-500/30 shadow-2xl space-y-3">
        <div className="flex items-center gap-2 text-pink-300">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
            How The Night Concluded
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#e5e0f9] leading-relaxed">
          {ending.narrative}
        </p>

        {/* Date Statistics Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
          <div className="p-2.5 rounded-xl bg-[#110d29] border border-white/5 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-[#8e85b2] tracking-wider">
              Chaos Classification
            </span>
            <div className="font-bold text-pink-300">{ending.chaosLevel}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#110d29] border border-white/5 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-[#8e85b2] tracking-wider">
              Signature Moment
            </span>
            <div className="font-bold text-amber-300 truncate">{ending.signatureMoment}</div>
          </div>
        </div>

        {/* Running Jokes Tally */}
        <div className="p-3 rounded-xl bg-[#110d29] border border-[#2e2658] space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-[#9e94cb] tracking-wider block">
            Running Jokes In The Relationship
          </span>
          <div className="flex flex-wrap gap-1.5">
            {ending.runningJokes.map((joke, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-[#251e47] text-white border border-[#3b3269]"
              >
                ✦ {joke}
              </span>
            ))}
          </div>
        </div>

        {/* Play Again / Replay Button */}
        <div className="pt-3 border-t border-white/10">
          <button
            onClick={leaveGame}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again with New Choices</span>
          </button>
        </div>
      </div>
    </div>
  );
};
