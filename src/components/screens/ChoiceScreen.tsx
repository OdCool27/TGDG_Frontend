import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { PixelSceneStage } from '../pixel/PixelSceneStage';
import { TonightSituationView } from './TonightSituationView';
import { ChoiceOption } from '../../types/game';
import {
  Lock,
  Sparkles,
  CheckCircle2,
  Target,
  AlertTriangle,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export const ChoiceScreen: React.FC = () => {
  const { sessionState, isHost, submitChoice, loading } = useGame();
  const scene = sessionState?.currentScene;

  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!scene) return null;

  // Retrieve choices for player role
  const availableChoices: ChoiceOption[] = isHost
    ? scene.choices.host
    : scene.choices.guest;

  const handleSelectChoice = (choiceId: string) => {
    sound.playSelect();
    setSelectedId(choiceId);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;
    sound.playSubmit();
    await submitChoice(selectedId);
  };

  const isBarnabyPresent =
    scene.id.includes('scene_1_3') ||
    scene.id.includes('scene_1_4') ||
    scene.id.includes('scene_2') ||
    scene.id.includes('scene_3') ||
    scene.id.includes('scene_4');

  const playerName = isHost
    ? sessionState.host.character.name
    : sessionState.guest?.character.name || 'Partner';

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 py-3 sm:py-5 space-y-3.5">
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

      {/* Tonight's Situation & Story Log Widget */}
      <TonightSituationView
        situation={sessionState.tonightSituation}
        previousOutcomeSummary={sessionState.previousOutcomeSummary}
        storyLog={sessionState.storyLog}
        compact={true}
      />

      {/* Header with Secret Choice Notice */}
      <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs text-purple-200">
        <span className="flex items-center gap-1.5 font-semibold">
          <Lock className="w-3.5 h-3.5 text-purple-400" />
          <span>Secret Decision Moment</span>
        </span>
        <span className="text-[10px] text-purple-300/80">
          Partner cannot see until both submit
        </span>
      </div>

      {/* Interactive Video Call Stage */}
      <PixelSceneStage
        variant={scene.backgroundVariant}
        hostCharacter={sessionState.host.character}
        guestCharacter={sessionState.guest?.character}
        hostExpression={isHost ? 'determined' : 'neutral'}
        guestExpression={!isHost ? 'determined' : 'neutral'}
        showBarnaby={isBarnabyPresent}
      />

      {/* Decision Scene Foundation: Continuity, Goal, Stakes & Specific Prompt */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#171330] border-2 border-[#362e63] shadow-xl space-y-3.5">
        {/* Continuity & Context */}
        {scene.continuity && (
          <div className="text-xs text-[#cfc9ea] leading-relaxed italic border-l-2 border-pink-500/40 pl-3">
            {scene.continuity}
          </div>
        )}

        {/* Immediate Goal & Plausible Stakes Callout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {scene.immediateGoal && (
            <div className="p-2.5 rounded-xl bg-[#120f26] border border-[#2b2454] space-y-1">
              <div className="flex items-center gap-1 text-emerald-300 font-bold text-[10px] uppercase tracking-wider">
                <Target className="w-3 h-3 text-emerald-400" />
                <span>Immediate Goal</span>
              </div>
              <p className="text-[#e2ddf7] text-[11px] leading-snug">
                {scene.immediateGoal}
              </p>
            </div>
          )}

          {scene.stakes && (
            <div className="p-2.5 rounded-xl bg-[#1b1022] border border-[#48233b] space-y-1">
              <div className="flex items-center gap-1 text-rose-300 font-bold text-[10px] uppercase tracking-wider">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>What's at Stake</span>
              </div>
              <p className="text-[#fbd2dc] text-[11px] leading-snug">
                {scene.stakes}
              </p>
            </div>
          )}
        </div>

        {/* Specific Decision Prompt Question */}
        <div className="pt-1">
          <div className="flex items-center gap-1.5 text-pink-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5 text-pink-400" />
            <span>Decision for {playerName}</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white font-['Fredoka'] leading-snug">
            {scene.decisionPrompt || 'How do you respond to this situation?'}
          </h3>
        </div>

        {/* Choice Cards List */}
        <div className="space-y-2.5 pt-1">
          {availableChoices.map((choice) => {
            const isSelected = selectedId === choice.id;
            const descriptionText = choice.description || choice.flavorText;

            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => handleSelectChoice(choice.id)}
                className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex flex-col gap-2 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  isSelected
                    ? 'bg-pink-500/20 border-pink-500 shadow-md scale-[1.01]'
                    : 'bg-[#110e24] border-[#2c2550] hover:border-[#4a3f85] text-white/90'
                }`}
              >
                <div className="flex items-start justify-between gap-3 w-full">
                  <div className="space-y-1 pr-2">
                    {/* Short, specific action label */}
                    <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {choice.label}
                    </div>

                    {/* One-sentence concrete action description */}
                    {descriptionText && (
                      <p className="text-[11px] text-[#cfc8ee] leading-relaxed">
                        {descriptionText}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 mt-0.5">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-pink-500 border-pink-400 text-white'
                          : 'border-[#41386d] bg-[#16122d]'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>

                {/* Foreseen Immediate Risk */}
                {choice.foreseenRisk && (
                  <div className="mt-0.5 p-1.5 rounded-lg bg-[#1a1435]/80 border border-[#3b3266] text-[10px] text-amber-300 flex items-start gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-amber-200">Foreseen Risk: </strong>
                      {choice.foreseenRisk}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Submit Choice Confirmation Button */}
        <div className="pt-2">
          <button
            onClick={handleConfirm}
            disabled={!selectedId || loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 active:scale-[0.98] text-white font-bold text-sm shadow-[0_4px_16px_rgba(244,63,94,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lock In Secret Action</span>
          </button>
        </div>
      </div>
    </div>
  );
};
