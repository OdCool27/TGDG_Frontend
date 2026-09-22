import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { PixelCharacter } from '../pixel/PixelCharacter';
import { PixelRoomBackground } from '../pixel/PixelRoomBackground';
import {
  Copy,
  Check,
  Share2,
  Play,
  Settings,
  Bot,
  Sparkles,
  Users,
  Clock,
} from 'lucide-react';

interface LobbyScreenProps {
  onEditAvatar: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ onEditAvatar }) => {
  const {
    sessionState,
    isHost,
    startGame,
    loading,
    copyJoinLink,
    simulatedPartner,
    toggleSimulatedPartner,
    isMock,
  } = useGame();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const joinCode = sessionState?.joinCode || 'GLITCH';
  const hasPartner = !!sessionState?.guest;
  const partnerReady = sessionState?.guest?.isReady ?? false;
  const canStart = isHost && (hasPartner || simulatedPartner);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const handleCopyLink = async () => {
    const success = await copyJoinLink();
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4 sm:py-6 space-y-5">
      {/* Title & Status */}
      <div className="text-center">
        <span className="text-[11px] font-mono uppercase tracking-widest text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-full">
          Pre-Date Waiting Room
        </span>
        <h2 className="text-2xl font-black text-white font-['Fredoka'] mt-2">
          {hasPartner ? 'Both Ready for the Date!' : 'Invite Your Date Partner'}
        </h2>
        <p className="text-xs text-[#9f96c7] mt-1 max-w-sm mx-auto">
          Share the 5-character code or link. The host can start once both players finish character setup.
        </p>
      </div>

      {/* Join Code Card with Copy Buttons */}
      <div className="p-4 rounded-2xl bg-[#1a1636] border-2 border-[#3b3464] text-center shadow-lg space-y-3">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8e85b2]">
          Your Private Date Code
        </span>

        <div className="flex items-center justify-center gap-3">
          <div className="px-6 py-2 rounded-xl bg-[#0f0b1f] border-2 border-pink-500/60 text-3xl font-black tracking-[0.25em] font-mono text-pink-300 shadow-inner">
            {joinCode}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            onClick={handleCopyCode}
            className="px-3.5 py-1.5 rounded-lg bg-[#252047] hover:bg-[#312b5d] text-xs font-semibold text-white border border-[#3e3770] flex items-center gap-1.5 transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Code Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-lg bg-pink-600/30 hover:bg-pink-600/40 text-xs font-semibold text-pink-200 border border-pink-500/40 flex items-center gap-1.5 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
          </button>
        </div>
      </div>

      {/* Dual Player Preview Stage */}
      <div className="p-3.5 rounded-2xl bg-[#141029] border border-[#2b2552] space-y-2">
        <div className="flex items-center justify-between text-xs text-[#8e85b2] px-1">
          <span className="flex items-center gap-1.5 font-semibold text-white">
            <Users className="w-4 h-4 text-pink-400" />
            <span>Virtual Table</span>
          </span>
          <button
            onClick={onEditAvatar}
            className="text-[11px] text-pink-300 hover:text-white flex items-center gap-1 font-medium"
          >
            <Settings className="w-3 h-3" />
            <span>Customize Avatar</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Host Card */}
          <div className="relative rounded-xl overflow-hidden border border-[#3c366a] bg-[#0c0919] aspect-[4/5] flex flex-col justify-between">
            <PixelRoomBackground theme={sessionState?.host.character.roomTheme || 'cozy_plants'}>
              <PixelCharacter
                customization={sessionState?.host.character || {
                  name: 'Jordan',
                  gender: 'female',
                  hairStyle: 'long_wavy',
                  hairColor: '#3a2e39',
                  skinTone: '#ffd1b3',
                  outfitColor: '#ff6b8b',
                  bodyStyle: 'sweater',
                  glasses: true,
                  roomTheme: 'cozy_plants',
                }}
                size="md"
                overrideExpression="delighted"
              />
            </PixelRoomBackground>

            <div className="p-2 bg-[#120f26]/90 backdrop-blur-sm border-t border-white/10 text-center">
              <div className="text-xs font-bold text-white truncate">
                {sessionState?.host.character.name || 'Host'}
              </div>
              <div className="text-[10px] text-emerald-400 font-medium flex items-center justify-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Host Ready</span>
              </div>
            </div>
          </div>

          {/* Partner Card */}
          <div className="relative rounded-xl overflow-hidden border border-[#3c366a] bg-[#0c0919] aspect-[4/5] flex flex-col justify-between">
            {sessionState?.guest ? (
              <>
                <PixelRoomBackground theme={sessionState.guest.character.roomTheme}>
                  <PixelCharacter
                    customization={sessionState.guest.character}
                    size="md"
                    overrideExpression="delighted"
                  />
                </PixelRoomBackground>

                <div className="p-2 bg-[#120f26]/90 backdrop-blur-sm border-t border-white/10 text-center">
                  <div className="text-xs font-bold text-white truncate">
                    {sessionState.guest.character.name}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium flex items-center justify-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Partner Joined</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#100d24]">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-2 animate-pulse">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-white">Awaiting Partner</div>
                <p className="text-[10px] text-[#7d74a4] mt-1 leading-snug">
                  Waiting for date to enter code on their phone or PC...
                </p>

                {/* Solo simulation test trigger */}
                {isMock && (
                  <button
                    onClick={toggleSimulatedPartner}
                    className="mt-3 px-2 py-1 rounded-md bg-purple-900/40 hover:bg-purple-900/60 border border-purple-400/40 text-[10px] text-purple-200 flex items-center gap-1"
                  >
                    <Bot className="w-3 h-3 text-purple-300" />
                    <span>Simulate Partner</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Start Button or Waiting Info */}
      <div className="pt-2">
        {isHost ? (
          <button
            onClick={startGame}
            disabled={!canStart || loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-base shadow-[0_4px_20px_rgba(244,63,94,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98]"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{hasPartner ? 'Begin Date Call' : 'Start Date (Waiting for Partner)'}</span>
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-[#1a1636] border border-[#2e2754] text-center">
            <div className="text-xs font-bold text-pink-300 animate-pulse">
              You are all set!
            </div>
            <p className="text-xs text-[#8e85b2] mt-1">
              Waiting for the host to click "Begin Date Call"...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
