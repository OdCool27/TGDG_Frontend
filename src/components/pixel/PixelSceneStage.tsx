import React from 'react';
import {
  CharacterCustomization,
  CharacterExpression,
} from '../../types/game';
import { PixelCharacter } from './PixelCharacter';
import { PixelRoomBackground } from './PixelRoomBackground';
import { BarnabySprite } from './BarnabySprite';

interface PixelSceneStageProps {
  variant: 'split_date' | 'webinar_chaos' | 'street_swap' | 'room_alarm' | 'rooftop_glow';
  hostCharacter: CharacterCustomization;
  guestCharacter?: CharacterCustomization;
  hostExpression?: CharacterExpression;
  guestExpression?: CharacterExpression;
  showBarnaby?: boolean;
  barnabyLocation?: 'guest' | 'center';
  className?: string;
}

export const PixelSceneStage: React.FC<PixelSceneStageProps> = ({
  variant,
  hostCharacter,
  guestCharacter,
  hostExpression,
  guestExpression,
  showBarnaby = false,
  barnabyLocation = 'guest',
  className = '',
}) => {
  // Default guest placeholder if not joined yet
  const effectiveGuest: CharacterCustomization = guestCharacter || {
    name: 'Partner',
    gender: 'male',
    hairStyle: 'short_casual',
    hairColor: '#e67e22',
    skinTone: '#ffd1b3',
    outfitColor: '#6c5ce7',
    bodyStyle: 'sweater',
    glasses: false,
    roomTheme: 'neon_gamer',
    expression: 'neutral',
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border-2 border-[#2b274c] bg-[#0c0a17] shadow-xl ${className}`}
    >
      {/* Video Call Window Header Bar */}
      <div className="bg-[#191530] px-3 py-1.5 border-b border-[#2b274c] flex items-center justify-between text-[11px] text-[#9b94bc] select-none">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <span className="font-semibold text-white/90 ml-1 tracking-tight">HeartSync Connect v2.4</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            Live HD
          </span>
          <span className="hidden sm:inline text-xs text-[#7b749d]">Bitrate: 100% Romance</span>
        </div>
      </div>

      {/* Dynamic Background Stage Overlay (e.g., Webinar, Strobe, Fort) */}
      {variant === 'webinar_chaos' && (
        <div className="bg-gradient-to-r from-purple-900/90 via-indigo-950/90 to-purple-900/90 px-3 py-1 text-center border-b border-purple-500/30 flex items-center justify-between text-xs text-purple-200">
          <span className="font-bold text-amber-300">🎙️ SYNAPSECON 2026 LIVE</span>
          <span className="animate-pulse">Audience: 3,241 attendees</span>
          <span className="text-[10px] bg-purple-800/80 px-2 py-0.5 rounded">Q&A: OPEN</span>
        </div>
      )}

      {variant === 'room_alarm' && (
        <div className="absolute inset-0 z-30 pointer-events-none bg-red-500/10 mix-blend-color-burn animate-pulse" />
      )}

      {/* Main Dual Video Feed Layout */}
      <div className="p-2 sm:p-3 grid grid-cols-2 gap-2 sm:gap-3 bg-[#0a0814]">
        {/* HOST SCREEN TILE */}
        <div className="relative rounded-xl overflow-hidden border border-[#3b3563] shadow-inner aspect-[4/5] sm:aspect-square flex flex-col justify-between">
          <PixelRoomBackground theme={hostCharacter.roomTheme}>
            <div className="relative flex flex-col items-center">
              <PixelCharacter
                customization={hostCharacter}
                overrideExpression={hostExpression}
                size="md"
              />
            </div>
          </PixelRoomBackground>

          {/* Video Tile Name Badge */}
          <div className="absolute bottom-1.5 left-1.5 right-1.5 z-20 flex items-center justify-between px-2 py-1 rounded bg-[#0f0b1ebb]/90 backdrop-blur-sm border border-white/10 text-[11px]">
            <span className="font-semibold text-white truncate max-w-[80px] sm:max-w-[120px]">
              {hostCharacter.name || 'Host'}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-coral-400 font-mono text-pink-400">
              Host
            </span>
          </div>

          {/* Delivery Box Item Overlay in Street Swap */}
          {variant === 'street_swap' && (
            <div className="absolute top-2 left-2 z-20 bg-amber-900/90 border border-amber-500 text-[10px] text-amber-200 px-1.5 py-0.5 rounded shadow flex items-center gap-1">
              <span>🍗 Ghost Wings (10 lbs)</span>
            </div>
          )}
        </div>

        {/* GUEST SCREEN TILE */}
        <div className="relative rounded-xl overflow-hidden border border-[#3b3563] shadow-inner aspect-[4/5] sm:aspect-square flex flex-col justify-between">
          <PixelRoomBackground theme={effectiveGuest.roomTheme}>
            <div className="relative flex flex-col items-center">
              <PixelCharacter
                customization={effectiveGuest}
                overrideExpression={guestExpression}
                size="md"
              />
              {/* Barnaby sitting beside Guest on couch */}
              {showBarnaby && (
                <div className="absolute -right-5 bottom-0 z-10">
                  <BarnabySprite size="sm" isExcited={guestExpression === 'laughing' || guestExpression === 'panicked'} />
                </div>
              )}
            </div>
          </PixelRoomBackground>

          {/* Video Tile Name Badge */}
          <div className="absolute bottom-1.5 left-1.5 right-1.5 z-20 flex items-center justify-between px-2 py-1 rounded bg-[#0f0b1ebb]/90 backdrop-blur-sm border border-white/10 text-[11px]">
            <span className="font-semibold text-white truncate max-w-[80px] sm:max-w-[120px]">
              {effectiveGuest.name || 'Partner'}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-purple-300 font-mono">
              Partner
            </span>
          </div>

          {/* Delivery Box Item Overlay in Street Swap */}
          {variant === 'street_swap' && (
            <div className="absolute top-2 left-2 z-20 bg-rose-900/90 border border-rose-500 text-[10px] text-rose-200 px-1.5 py-0.5 rounded shadow flex items-center gap-1">
              <span>🍕 Hotdog Heart Pizza</span>
            </div>
          )}
        </div>
      </div>

      {/* Blanket fort string lights in Rooftop / Fort mode */}
      {variant === 'rooftop_glow' && (
        <div className="bg-[#181533] px-3 py-1.5 border-t border-[#312a5a] flex items-center justify-center gap-2 text-xs text-amber-200">
          <span>✨ Fort Sanctuary Mode: Active</span>
          <span className="text-white/40">·</span>
          <span>Cozy Index: 100%</span>
        </div>
      )}
    </div>
  );
};
