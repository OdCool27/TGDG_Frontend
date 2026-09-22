import React from 'react';
import { useGame } from '../../context/GameContext';
import { BookOpen, Sparkles, Check, ArrowRight } from 'lucide-react';
import { sound } from '../../utils/sound';

export const ChapterRecapScreen: React.FC = () => {
  const { sessionState, isHost, advanceScene, loading } = useGame();
  const recap = sessionState?.chapterRecap;

  if (!recap) {
    return (
      <div className="p-8 text-center text-white">
        <div>Loading chapter transition...</div>
      </div>
    );
  }

  const isMyReady = isHost
    ? sessionState.host.readyToAdvance
    : sessionState.guest?.readyToAdvance;

  const partnerName = isHost
    ? sessionState.guest?.name || 'Partner'
    : sessionState.host.name || 'Host';

  const handleReadyClick = async () => {
    sound.playClick();
    await advanceScene();
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 sm:py-8 space-y-4 animate-in fade-in zoom-in-95 duration-300">
      {/* Chapter Transition Banner */}
      <div className="text-center space-y-1">
        <span className="text-xs font-mono font-bold text-pink-400 bg-pink-500/15 border border-pink-500/30 px-3 py-1 rounded-full uppercase tracking-widest">
          Intermission Recap
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-['Fredoka'] mt-2">
          Previously Tonight...
        </h2>
        <p className="text-xs text-[#9f96c7]">
          End of Chapter {recap.chapterNumber}: “{recap.chapterTitle}”
        </p>
      </div>

      {/* Recap Comic Parchment Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#1a143b] border-2 border-[#3c346c] shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-pink-300 border-b border-white/10 pb-3">
          <BookOpen className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider font-mono">
            Chronicles of Tonight’s Mishaps
          </span>
        </div>

        {/* Bullet points */}
        <ul className="space-y-2.5 text-xs sm:text-sm text-[#ddd8f6]">
          {recap.bulletPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="leading-snug">{point}</span>
            </li>
          ))}
        </ul>

        {/* Funny Highlight Box */}
        <div className="p-3 rounded-xl bg-[#110d29] border border-amber-500/30 text-amber-200 text-xs space-y-0.5">
          <div className="font-bold flex items-center gap-1.5 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Evening Milestone</span>
          </div>
          <p className="italic text-[#d6cbf5]">{recap.funnyHighlight}</p>
        </div>

        {/* Mutual Ready Check */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <button
            onClick={handleReadyClick}
            disabled={isMyReady || loading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              isMyReady
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 cursor-default'
                : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 active:scale-98 text-white'
            }`}
          >
            {isMyReady ? (
              <>
                <Check className="w-4 h-4" />
                <span>Ready! Waiting for {partnerName}...</span>
              </>
            ) : (
              <>
                <span>{recap.chapterNumber === 3 ? 'See Your Ending' : `Continue to Chapter ${recap.chapterNumber + 1}`}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
