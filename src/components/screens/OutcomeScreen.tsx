import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { PixelSceneStage } from '../pixel/PixelSceneStage';
import { TonightSituationView } from './TonightSituationView';
import {
  Sparkles,
  Check,
  ArrowRight,
  Flame,
  HeartHandshake,
  Zap,
  AlertOctagon,
  Clock,
  Shuffle,
  BookmarkCheck,
  Info,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export const OutcomeScreen: React.FC = () => {
  const { sessionState, isHost, advanceScene, loading } = useGame();
  const outcome = sessionState?.currentOutcome;
  const scene = sessionState?.currentScene;

  // Reading grace period: allow 2 seconds before encouraging ready advance
  const [hasReadPeriodPassed, setHasReadPeriodPassed] = useState(false);

  useEffect(() => {
    sound.playReveal();
    const chimeTimer = setTimeout(() => {
      sound.playChime();
    }, 450);

    const timer = setTimeout(() => {
      setHasReadPeriodPassed(true);
    }, 2000);
    return () => {
      clearTimeout(chimeTimer);
      clearTimeout(timer);
    };
  }, [scene?.id]);

  if (!outcome || !scene) {
    return (
      <div className="p-8 text-center text-white">
        <div>Revealing outcomes...</div>
      </div>
    );
  }

  const { consequence, hostChoice, guestChoice, hostReadyToAdvance, guestReadyToAdvance } = outcome;

  const isMyReady = isHost ? hostReadyToAdvance : guestReadyToAdvance;
  const isPartnerReady = isHost ? guestReadyToAdvance : hostReadyToAdvance;
  const partnerName = isHost
    ? sessionState.guest?.character.name || 'Partner'
    : sessionState.host.character.name || 'Host';

  const getAgreementBadge = () => {
    switch (consequence.agreementType) {
      case 'backfired_agreement':
        return {
          icon: <AlertOctagon className="w-4 h-4 text-rose-300" />,
          label: 'Coordinated Panic Backfired!',
          style: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
        };
      case 'accidental_harmony':
        return {
          icon: <Shuffle className="w-4 h-4 text-emerald-300" />,
          label: 'Accidental Complementary Harmony',
          style: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
        };
      case 'wild_synergy':
        return {
          icon: <Zap className="w-4 h-4 text-amber-300" />,
          label: 'Wild Rom-Com Synergy',
          style: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
        };
      case 'harmony':
        return {
          icon: <HeartHandshake className="w-4 h-4 text-pink-300" />,
          label: 'Shared Strategic Harmony',
          style: 'bg-pink-950/80 text-pink-300 border-pink-500/50',
        };
      case 'comic_mismatch':
      default:
        return {
          icon: <Flame className="w-4 h-4 text-purple-300" />,
          label: 'Hilarious Contrasting Actions',
          style: 'bg-purple-950/80 text-purple-300 border-purple-500/50',
        };
    }
  };

  const badge = getAgreementBadge();

  const handleAdvanceClick = async () => {
    sound.playClick();
    await advanceScene();
  };

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 py-3 sm:py-5 space-y-3.5 animate-in fade-in zoom-in-95 duration-300">
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
          Scene {scene.sceneNumber}/{scene.totalScenesInChapter} Outcome
        </div>
      </div>

      {/* Tonight's Situation & Story Log compact widget */}
      <TonightSituationView
        situation={sessionState.tonightSituation}
        storyLog={sessionState.storyLog}
        compact={true}
      />

      {/* Video Call Stage with outcome character reactions */}
      <PixelSceneStage
        variant={scene.backgroundVariant}
        hostCharacter={sessionState.host.character}
        guestCharacter={sessionState.guest?.character}
        hostExpression={consequence.hostReaction}
        guestExpression={consequence.guestReaction}
        showBarnaby={true}
      />

      {/* Choices Side-by-Side Comparison Card */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#14102b] border-2 border-[#332a61] shadow-lg space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#b4a9dc] uppercase tracking-wider text-[10px]">
            The Double Reveal
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 ${badge.style}`}
          >
            {badge.icon}
            <span>Both actions revealed</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Host Choice */}
          <div className="p-2.5 rounded-xl bg-[#1d173d] border border-[#3b3368] space-y-1">
            <div className="text-[10px] font-bold text-pink-400 uppercase tracking-wide truncate">
              {sessionState.host.character.name} (Host) Chose:
            </div>
            <div className="text-white font-bold text-[11px] sm:text-xs leading-snug">
              {hostChoice.label}
            </div>
            {consequence.hostActionTaken && (
              <p className="text-[10px] text-[#cfc8ee] leading-tight pt-1">
                <strong>Attempted:</strong> {consequence.hostActionTaken}
              </p>
            )}
          </div>

          {/* Guest Choice */}
          <div className="p-2.5 rounded-xl bg-[#1d173d] border border-[#3b3368] space-y-1">
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wide truncate">
              {sessionState.guest?.character.name || 'Partner'} Chose:
            </div>
            <div className="text-white font-bold text-[11px] sm:text-xs leading-snug">
              {guestChoice.label}
            </div>
            {consequence.guestActionTaken && (
              <p className="text-[10px] text-[#cfc8ee] leading-tight pt-1">
                <strong>Attempted:</strong> {consequence.guestActionTaken}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Shared Outcome Narrative Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#1a143b] border-2 border-pink-500/30 shadow-xl space-y-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
          <h3 className="text-base font-bold text-white font-['Fredoka']">
            {consequence.title}
          </h3>
        </div>

        {/* Narrative Description */}
        <p className="text-xs sm:text-sm text-[#e6e2f8] leading-relaxed">
          {consequence.description}
        </p>

        {/* Immediate Result Banner */}
        {consequence.immediateResult && (
          <div className="p-2.5 rounded-xl bg-[#120e2a] border border-pink-500/20 text-xs text-pink-100 flex items-start gap-2">
            <Info className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-pink-300 block text-[10px] uppercase tracking-wider mb-0.5">
                Immediate Result:
              </strong>
              <span>{consequence.immediateResult}</span>
            </div>
          </div>
        )}

        {/* Tangible Changes to Situation */}
        {consequence.tangibleChanges && consequence.tangibleChanges.length > 0 && (
          <div className="p-3 rounded-xl bg-[#110d26] border border-[#2d2557] space-y-1.5">
            <span className="text-[10px] font-bold text-[#b4a9dc] uppercase tracking-wider block">
              Tangible Changes Tonight:
            </span>
            <div className="space-y-1">
              {consequence.tangibleChanges.map((change, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#e4e0f7]">
                  <span className="text-pink-400 font-bold">•</span>
                  <span>{change}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Persistent Story State Updates */}
        {consequence.stateChanges && consequence.stateChanges.length > 0 && (
          <div className="p-2.5 rounded-xl bg-[#161133] border border-purple-500/30 text-xs space-y-1">
            <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
              Persistent Story Facts Updated:
            </span>
            <div className="space-y-1">
              {consequence.stateChanges.map((delta, dIdx) => (
                <div key={dIdx} className="text-[11px] text-[#cfc8ee] flex items-start gap-1.5">
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">{delta.field}: </span>
                    <span>{delta.change}</span>{' '}
                    <span className="text-[#8e85b2] italic">({delta.reason})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {consequence.comicBonus && (
          <div className="p-2 rounded-xl bg-[#0f0c22] border border-[#2d2557] text-[11px] text-amber-300 font-mono flex items-center gap-1.5">
            <span>✨ {consequence.comicBonus}</span>
          </div>
        )}

        {/* Readiness Bar & Advance Button */}
        <div className="pt-3 border-t border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-[#9f96c7]">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isMyReady ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
                }`}
              />
              <span>You: {isMyReady ? 'Ready ✓' : 'Reviewing outcome'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPartnerReady ? 'bg-emerald-400' : 'bg-[#5c5484]'
                }`}
              />
              <span>{partnerName}: {isPartnerReady ? 'Ready ✓' : 'Reading...'}</span>
            </span>
          </div>

          <button
            onClick={handleAdvanceClick}
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
                <span>You're Ready! Waiting for {partnerName}...</span>
              </>
            ) : (
              <>
                <span>I'm Ready for What's Next</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
