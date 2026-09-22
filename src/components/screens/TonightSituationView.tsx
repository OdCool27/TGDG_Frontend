import React, { useState } from 'react';
import {
  TonightSituationState,
  StoryLogItem,
} from '../../types/game';
import {
  Clock,
  UtensilsCrossed,
  UserCheck,
  AlertTriangle,
  History,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Info,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface TonightSituationViewProps {
  situation?: TonightSituationState;
  previousOutcomeSummary?: string;
  storyLog?: StoryLogItem[];
  compact?: boolean;
}

export const TonightSituationView: React.FC<TonightSituationViewProps> = ({
  situation,
  previousOutcomeSummary,
  storyLog = [],
  compact = true,
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [showRecapBanner, setShowRecapBanner] = useState(true);

  if (!situation && !previousOutcomeSummary && storyLog.length === 0) {
    return null;
  }

  const handleOpenLog = () => {
    sound.playClick();
    setShowLogModal(true);
  };

  const handleCloseLog = () => {
    sound.playClick();
    setShowLogModal(false);
  };

  const handleToggleExpand = () => {
    sound.playClick();
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="w-full space-y-2 select-none animate-in fade-in duration-200">
      {/* "Previously Tonight..." Context Callout (if outcome summary exists) */}
      {previousOutcomeSummary && showRecapBanner && (
        <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 flex items-start justify-between gap-2.5 shadow-sm">
          <div className="flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-purple-300 mr-1.5 uppercase text-[10px] tracking-wider">
                Previously tonight:
              </span>
              <span className="text-purple-100/90 leading-relaxed font-normal">
                {previousOutcomeSummary}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowRecapBanner(false)}
            aria-label="Dismiss recap"
            className="text-purple-400/60 hover:text-purple-300 p-0.5 rounded transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tonight's Situation Compact Bar */}
      {situation && (
        <div className="rounded-xl bg-[#14102b] border border-[#2e2755] p-2.5 sm:p-3 shadow-md">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-400" />
              <span className="text-[11px] font-bold text-pink-300 uppercase tracking-wider font-mono">
                Tonight's Situation
              </span>
            </div>

            <div className="flex items-center gap-2">
              {storyLog.length > 0 && (
                <button
                  onClick={handleOpenLog}
                  className="text-[11px] font-semibold text-purple-300 hover:text-white px-2 py-0.5 rounded bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 flex items-center gap-1 transition-colors"
                >
                  <History className="w-3 h-3 text-purple-400" />
                  <span>Story Log ({storyLog.length})</span>
                </button>
              )}

              <button
                onClick={handleToggleExpand}
                className="text-[#8e85b2] hover:text-white p-0.5 transition-colors"
                title={isExpanded ? 'Collapse situation view' : 'Expand situation view'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Summary Pill Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 text-[11px]">
            {/* Time Remaining */}
            {situation.timeRemaining && (
              <div className="p-2 rounded-lg bg-[#1c173d] border border-[#382f66] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[9px] text-[#8e85b2] uppercase font-bold tracking-tight">
                    Schedule
                  </div>
                  <div className="text-white font-medium truncate" title={situation.timeRemaining}>
                    {situation.timeRemaining}
                  </div>
                </div>
              </div>
            )}

            {/* Delivery / Dinner Status */}
            {situation.deliveryStatus && (
              <div className="p-2 rounded-lg bg-[#1c173d] border border-[#382f66] flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[9px] text-[#8e85b2] uppercase font-bold tracking-tight">
                    Dinner
                  </div>
                  <div className="text-white font-medium truncate" title={situation.deliveryStatus}>
                    {situation.deliveryStatus}
                  </div>
                </div>
              </div>
            )}

            {/* Helper / Neighbor Status */}
            {situation.helperStatus && (
              <div className="p-2 rounded-lg bg-[#1c173d] border border-[#382f66] flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[9px] text-[#8e85b2] uppercase font-bold tracking-tight">
                    Neighbor
                  </div>
                  <div className="text-white font-medium truncate" title={situation.helperStatus}>
                    {situation.helperStatus}
                  </div>
                </div>
              </div>
            )}

            {/* Complication */}
            {situation.activeComplication && (
              <div className="p-2 rounded-lg bg-[#1c173d] border border-[#382f66] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[9px] text-[#8e85b2] uppercase font-bold tracking-tight">
                    Complication
                  </div>
                  <div className="text-white font-medium truncate" title={situation.activeComplication}>
                    {situation.activeComplication}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Expanded Detail View */}
          {isExpanded && situation.recentUpdateReason && (
            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-start gap-2 text-xs text-[#cfc9ea] bg-[#110e25]/60 p-2 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-200">Recent consequence: </span>
                <span>{situation.recentUpdateReason}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Story Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg max-h-[85vh] bg-[#171330] border-2 border-[#3c346c] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#2e2755] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-pink-400" />
                <h3 className="text-base font-bold text-white font-['Fredoka']">
                  Tonight's Story Log
                </h3>
              </div>
              <button
                onClick={handleCloseLog}
                aria-label="Close story log"
                className="w-8 h-8 rounded-lg bg-[#251f46] hover:bg-[#342c62] text-[#9e96c4] hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: List of previous decisions & consequences */}
            <div className="p-4 overflow-y-auto space-y-3">
              {storyLog.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8e85b2]">
                  No decisions recorded yet tonight.
                </div>
              ) : (
                storyLog.map((item, idx) => (
                  <div
                    key={`${item.sceneId}-${idx}`}
                    className="p-3.5 rounded-xl bg-[#100d24] border border-[#2b2552] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-pink-400 font-bold uppercase">
                        Ch. {item.chapterNumber} · {item.sceneTitle}
                      </span>
                      <span className="text-[10px] text-[#786e9b]">#{idx + 1}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-[#181335] border border-white/5">
                        <span className="text-[9px] text-[#8e85b2] block font-semibold">
                          Host Chose:
                        </span>
                        <span className="text-white font-medium">{item.hostChoiceLabel}</span>
                      </div>
                      <div className="p-2 rounded bg-[#181335] border border-white/5">
                        <span className="text-[9px] text-[#8e85b2] block font-semibold">
                          Partner Chose:
                        </span>
                        <span className="text-white font-medium">{item.guestChoiceLabel}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="font-bold text-white block mb-0.5">{item.outcomeTitle}</span>
                      <p className="text-[#cfc9ea] leading-relaxed">{item.immediateResult}</p>
                    </div>

                    {item.tangibleChanges && item.tangibleChanges.length > 0 && (
                      <div className="pt-1 space-y-1">
                        <span className="text-[10px] text-[#9389be] font-bold uppercase tracking-wider block">
                          Tangible Consequences:
                        </span>
                        <div className="space-y-0.5">
                          {item.tangibleChanges.map((change, cIdx) => (
                            <div key={cIdx} className="text-[11px] text-[#b4a9dc] flex items-start gap-1.5">
                              <span className="text-pink-400">•</span>
                              <span>{change}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#130f28] border-t border-[#2e2755] flex justify-end">
              <button
                onClick={handleCloseLog}
                className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-colors"
              >
                Back to Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
