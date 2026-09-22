import React from 'react';
import { useGame } from '../../context/GameContext';
import { PixelSceneStage } from '../pixel/PixelSceneStage';
import { TonightSituationView } from './TonightSituationView';
import { Lock, Clock, Bot, Sparkles, MessageCircleHeart, CheckCircle2, AlertTriangle } from 'lucide-react';

export const WaitingScreen: React.FC = () => {
  const { sessionState, isHost, isMock, toggleSimulatedPartner, simulatedPartner } = useGame();
  const scene = sessionState?.currentScene;

  const partnerName = isHost
    ? sessionState?.guest?.name || 'Partner'
    : sessionState?.host.name || 'Host';

  const partnerHasSubmitted = isHost
    ? sessionState?.submissionStatus.guestSubmitted
    : sessionState?.submissionStatus.hostSubmitted;

  // Find the player's submitted choice object
  const mySubmittedId = isHost
    ? sessionState?.host.submittedChoiceId
    : sessionState?.guest?.submittedChoiceId;

  const myChoices = scene
    ? (isHost ? scene.choices.host : scene.choices.guest)
    : [];

  const mySubmittedChoice = myChoices.find((c) => c.id === mySubmittedId);

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 py-3 sm:py-5 space-y-3.5">
      {/* Chapter & Scene Header Bar */}
      {scene && (
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
      )}

      {/* Tonight's Situation & Story Log Widget */}
      <TonightSituationView
        situation={sessionState?.tonightSituation}
        previousOutcomeSummary={sessionState?.previousOutcomeSummary}
        storyLog={sessionState?.storyLog}
        compact={true}
      />

      {/* Video Stage with Anticipation Expression */}
      {scene && (
        <PixelSceneStage
          variant={scene.backgroundVariant}
          hostCharacter={sessionState.host.character}
          guestCharacter={sessionState.guest?.character}
          hostExpression="determined"
          guestExpression="determined"
          showBarnaby={true}
        />
      )}

      {/* Player's Submitted Secret Choice Card */}
      {mySubmittedChoice && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#14102b] border-2 border-pink-500/40 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
              <span>Your Submitted Secret Action</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-pink-950/60 border border-pink-500/30 text-[10px] text-pink-200 font-medium flex items-center gap-1">
              <Lock className="w-3 h-3 text-pink-400" />
              <span>Private from {partnerName}</span>
            </span>
          </div>

          <div className="text-sm font-bold text-white">
            {mySubmittedChoice.label}
          </div>

          {mySubmittedChoice.description && (
            <p className="text-xs text-[#cfc8ee] leading-relaxed">
              {mySubmittedChoice.description}
            </p>
          )}

          {mySubmittedChoice.foreseenRisk && (
            <div className="p-1.5 rounded-lg bg-[#1b1535] border border-amber-500/20 text-[10px] text-amber-300 flex items-start gap-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-amber-200">Foreseen Risk: </strong>
                {mySubmittedChoice.foreseenRisk}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Waiting for Partner Card */}
      <div className="p-5 rounded-2xl bg-[#171330] border-2 border-[#393169] text-center shadow-xl space-y-3.5">
        <div className="w-12 h-12 rounded-full bg-purple-500/10 border-2 border-purple-500/30 mx-auto flex items-center justify-center text-purple-400">
          <Clock className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-white font-['Fredoka']">
            Waiting for {partnerName}...
          </h3>
          <p className="text-xs text-[#9f96c7] max-w-xs mx-auto">
            {partnerHasSubmitted
              ? `${partnerName} just submitted! Syncing shared outcome...`
              : `${partnerName} is weighing their choices. Keep a straight face on camera!`}
          </p>
        </div>

        {/* Solo Preview / Simulation Helper */}
        {isMock && !simulatedPartner && (
          <div className="pt-2 border-t border-white/5">
            <button
              onClick={toggleSimulatedPartner}
              className="px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-xs text-purple-200 flex items-center justify-center gap-1.5 mx-auto transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-purple-300" />
              <span>Simulate Partner Choice Immediately</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
