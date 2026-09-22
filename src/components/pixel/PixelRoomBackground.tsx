import React from 'react';
import { RoomTheme } from '../../types/game';

interface PixelRoomBackgroundProps {
  theme: RoomTheme;
  className?: string;
  children?: React.ReactNode;
}

export const PixelRoomBackground: React.FC<PixelRoomBackgroundProps> = ({
  theme,
  className = '',
  children,
}) => {
  const getThemeStyles = () => {
    switch (theme) {
      case 'neon_gamer':
        return {
          wall: 'bg-gradient-to-b from-[#1b1429] to-[#0f0b18]',
          accent: '#8c52ff',
          elements: (
            <>
              {/* Neon LED strip glow */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-80 shadow-[0_0_12px_#8c52ff]" />
              {/* Wall Posters */}
              <div className="absolute top-4 left-4 w-10 h-14 bg-[#231b36] border-2 border-[#ff3e88]/50 rounded p-1 shadow-sm">
                <div className="w-full h-full bg-[#352554] flex flex-col justify-end p-0.5">
                  <div className="w-full h-1 bg-[#ff3e88] mb-1" />
                  <div className="w-3/4 h-1 bg-cyan-400" />
                </div>
              </div>
              {/* Headphone hook */}
              <div className="absolute top-6 right-5 w-5 h-8 border-t-2 border-r-2 border-purple-400/40" />
            </>
          ),
        };

      case 'warm_books':
        return {
          wall: 'bg-gradient-to-b from-[#2b1e19] to-[#1c130f]',
          accent: '#f39c12',
          elements: (
            <>
              {/* Bookshelf */}
              <div className="absolute top-3 right-3 w-16 h-20 bg-[#3a2519] border border-[#523524] rounded flex flex-col justify-between p-1 shadow">
                <div className="flex gap-0.5 items-end h-7 border-b border-[#523524] pb-0.5">
                  <div className="w-2.5 h-6 bg-[#c0392b] rounded-t-sm" />
                  <div className="w-2 h-5 bg-[#2980b9] rounded-t-sm" />
                  <div className="w-3 h-7 bg-[#27ae60] rounded-t-sm" />
                  <div className="w-2 h-4 bg-[#f39c12] rounded-t-sm" />
                </div>
                <div className="flex gap-0.5 items-end h-7 pb-0.5">
                  <div className="w-2 h-5 bg-[#8e44ad] rounded-t-sm" />
                  <div className="w-3 h-6 bg-[#d35400] rounded-t-sm" />
                  <div className="w-2.5 h-5 bg-[#16a085] rounded-t-sm" />
                </div>
              </div>
              {/* Desk Lamp Ambient Glow */}
              <div className="absolute bottom-10 left-3 w-8 h-8 rounded-full bg-amber-400/15 blur-md" />
            </>
          ),
        };

      case 'city_glow':
        return {
          wall: 'bg-gradient-to-b from-[#15192c] to-[#0c0e1a]',
          accent: '#4834d4',
          elements: (
            <>
              {/* Apartment Window showing pixel night skyline */}
              <div className="absolute top-3 left-4 w-20 h-24 bg-[#0a0c16] border-2 border-[#2b3353] rounded overflow-hidden shadow-inner">
                {/* Stars */}
                <div className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full opacity-80" />
                <div className="absolute top-4 right-4 w-1 h-1 bg-amber-200 rounded-full opacity-60" />
                <div className="absolute top-8 left-8 w-1 h-1 bg-white rounded-full opacity-90" />
                {/* Skyline silhouettes */}
                <div className="absolute bottom-0 inset-x-0 flex items-end justify-between px-0.5">
                  <div className="w-4 h-12 bg-[#1b2038] relative">
                    <div className="w-1 h-1 bg-yellow-300 absolute top-2 left-1" />
                    <div className="w-1 h-1 bg-yellow-100 absolute top-5 left-1" />
                  </div>
                  <div className="w-5 h-16 bg-[#161a2e] relative">
                    <div className="w-1 h-1 bg-amber-300 absolute top-3 right-1" />
                    <div className="w-1 h-1 bg-yellow-300 absolute top-7 left-1" />
                    <div className="w-1 h-1 bg-yellow-200 absolute top-10 right-1" />
                  </div>
                  <div className="w-4 h-10 bg-[#1e243e] relative">
                    <div className="w-1 h-1 bg-amber-100 absolute top-2 right-1" />
                  </div>
                </div>
                {/* Window pane cross */}
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-[#2b3353]/80" />
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-[#2b3353]/80" />
              </div>
            </>
          ),
        };

      case 'cozy_plants':
      default:
        return {
          wall: 'bg-gradient-to-b from-[#1e2b20] to-[#121c13]',
          accent: '#2ed573',
          elements: (
            <>
              {/* Hanging Vines */}
              <div className="absolute top-0 right-4 flex gap-1">
                <div className="w-1 h-12 bg-emerald-800/80 relative">
                  <div className="w-2.5 h-2 bg-emerald-500 rounded-full absolute top-3 -left-1" />
                  <div className="w-2.5 h-2 bg-emerald-600 rounded-full absolute top-7 -right-1" />
                  <div className="w-2.5 h-2 bg-emerald-400 rounded-full absolute bottom-0 -left-1" />
                </div>
                <div className="w-1 h-8 bg-emerald-800/80 relative">
                  <div className="w-2.5 h-2 bg-emerald-500 rounded-full absolute top-2 -right-1" />
                  <div className="w-2.5 h-2 bg-emerald-600 rounded-full absolute bottom-1 -left-1" />
                </div>
              </div>
              {/* Potted monstera plant on floor */}
              <div className="absolute bottom-2 left-3 flex flex-col items-center">
                <div className="w-6 h-6 flex items-end justify-center mb-0.5">
                  <div className="w-3 h-5 bg-emerald-500 rounded-tl-full" />
                  <div className="w-3 h-4 bg-emerald-400 rounded-tr-full" />
                </div>
                <div className="w-6 h-5 bg-[#c2613d] border border-[#8e391b] rounded-b-sm" />
              </div>
              {/* String fairy lights across ceiling */}
              <div className="absolute top-2 inset-x-4 flex justify-around">
                <div className="w-1.5 h-1.5 bg-amber-300 rounded-full shadow-[0_0_6px_#f1c40f]" />
                <div className="w-1.5 h-1.5 bg-amber-200 rounded-full shadow-[0_0_6px_#f1c40f]" />
                <div className="w-1.5 h-1.5 bg-amber-300 rounded-full shadow-[0_0_6px_#f1c40f]" />
              </div>
            </>
          ),
        };
    }
  };

  const themeConfig = getThemeStyles();

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${themeConfig.wall} ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Visual background details */}
      {themeConfig.elements}

      {/* Cozy floor baseboard */}
      <div className="absolute bottom-0 inset-x-0 h-4 bg-[#0a0812]/70 border-t border-white/5" />

      {/* Main content slot */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-2">
        {children}
      </div>
    </div>
  );
};
