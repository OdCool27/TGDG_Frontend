import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { PixelSceneStage } from '../pixel/PixelSceneStage';
import { DialogueLine, CharacterExpression } from '../../types/game';
import { TonightSituationView } from './TonightSituationView';
import { ArrowRight, MessageSquare, Lock, FastForward, Heart } from 'lucide-react';
import { sound } from '../../utils/sound';

interface StoryScreenProps {
  onProceedToChoice: () => void;
}

export const StoryScreen: React.FC<StoryScreenProps> = ({ onProceedToChoice }) => {
  const { sessionState, isHost, myCharacter, partnerCharacter } = useGame();
  const scene = sessionState?.currentScene;

  const [dialogueIndex, setDialogueIndex] = useState(0);

  if (!scene) {
    return (
      <div className="p-8 text-center text-white">
        <div>Loading date scene...</div>
      </div>
    );
  }

  const dialogueList: DialogueLine[] = scene.dialogue || [];
  const currentLine: DialogueLine | undefined = dialogueList[dialogueIndex];

  // Current speaker info
  const getSpeakerLabel = (speaker: DialogueLine['speaker']) => {
    switch (speaker) {
      case 'host':
        return sessionState?.host.character.name || 'Host';
      case 'guest':
        return sessionState?.guest?.character.name || 'Partner';
      case 'courier':
        return 'Delivery Courier';
      case 'announcer':
        return 'Keynote Moderator';
      case 'neighbor':
        return 'Mr. Henderson (3B)';
      case 'glitch_bot':
        return 'HeartSync System';
      case 'narrator':
      default:
        return 'Narrator';
    }
  };

  const getSpeakerBadgeStyle = (speaker: DialogueLine['speaker']) => {
    switch (speaker) {
      case 'host':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'guest':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'glitch_bot':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'announcer':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'neighbor':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'courier':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-white/10 text-white/80 border-white/10';
    }
  };

  // Determine current expressions
  const hostExpr: CharacterExpression =
    currentLine?.hostExpression || sessionState?.host.character.expression || 'neutral';
  const guestExpr: CharacterExpression =
    currentLine?.guestExpression || sessionState?.guest?.character.expression || 'neutral';

  const isBarnabyPresent =
    scene.id.includes('scene_1_3') ||
    scene.id.includes('scene_1_4') ||
    scene.id.includes('scene_2') ||
    scene.id.includes('scene_3') ||
    scene.id.includes('scene_4');

  // Private inner thought check
  const privateThought = isHost
    ? currentLine?.hostPrivateThought
    : currentLine?.guestPrivateThought;

  const handleNextLine = () => {
    if (dialogueIndex < dialogueList.length - 1) {
      const nextIndex = dialogueIndex + 1;
      const nextLine = dialogueList[nextIndex];
      if (nextLine?.speaker === 'courier' || nextLine?.speaker === 'neighbor') {
        sound.playBuzzer();
      } else if (nextLine?.text.toLowerCase().includes('barnaby')) {
        sound.playBark();
      } else {
        sound.playType();
      }
      setDialogueIndex(nextIndex);
    } else {
      sound.playClick();
      onProceedToChoice();
    }
  };

  const handleSkipToChoice = () => {
    sound.playClick();
    onProceedToChoice();
  };

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 py-3 sm:py-5 flex flex-col gap-3">
      {/* Chapter & Scene Header Bar */}
      <div className="flex items-center justify-between text-xs text-[#9f96c7] px-1">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="text-pink-400 font-bold">Ch. {scene.chapterNumber}</span>
          <span>·</span>
          <span className="text-white/90 truncate max-w-[180px] sm:max-w-[240px]">
            {scene.title}
          </span>
        </div>
        <div className="text-[11px] font-mono text-[#8e85b2]">
          Scene {scene.sceneNumber}/{scene.totalScenesInChapter}
        </div>
      </div>

      {/* Tonight's Situation & Story Log compact widget */}
      <TonightSituationView
        situation={sessionState?.tonightSituation}
        previousOutcomeSummary={sessionState?.previousOutcomeSummary}
        storyLog={sessionState?.storyLog}
        compact={true}
      />

      {/* Interactive Pixel Stage (Dual Video Call View) */}
      <PixelSceneStage
        variant={scene.backgroundVariant}
        hostCharacter={sessionState.host.character}
        guestCharacter={sessionState.guest?.character}
        hostExpression={hostExpr}
        guestExpression={guestExpr}
        showBarnaby={isBarnabyPresent}
      />

      {/* Asymmetric Private Thought Bubble (Visible only to the caller!) */}
      {privateThought && (
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-pink-950/60 to-purple-950/60 border border-pink-500/40 text-xs text-pink-200 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 shadow-md">
          <Lock className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-pink-300">Your Private Inner Thought: </span>
            <span className="italic">{privateThought}</span>
          </div>
        </div>
      )}

      {/* Main Dialogue Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#171330] border-2 border-[#332b5d] shadow-xl relative min-h-[140px] flex flex-col justify-between">
        <div>
          {/* Speaker Badge */}
          {currentLine && (
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getSpeakerBadgeStyle(
                  currentLine.speaker
                )}`}
              >
                {getSpeakerLabel(currentLine.speaker)}
              </span>
              <span className="text-[10px] text-[#786e9b]">
                {dialogueIndex + 1} / {dialogueList.length}
              </span>
            </div>
          )}

          {/* Dialogue Text */}
          <p className="text-sm sm:text-base text-white/95 leading-relaxed font-['Plus_Jakarta_Sans'] font-medium">
            {currentLine ? currentLine.text : '...'}
          </p>
        </div>

        {/* Dialogue Navigation Controls */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <button
            onClick={handleSkipToChoice}
            className="text-[11px] text-[#7d74a4] hover:text-white flex items-center gap-1 transition-colors"
          >
            <FastForward className="w-3 h-3" />
            <span>Skip to Decision</span>
          </button>

          <button
            onClick={handleNextLine}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 active:scale-95 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
          >
            <span>
              {dialogueIndex < dialogueList.length - 1 ? 'Next Line' : 'Make Decision'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
