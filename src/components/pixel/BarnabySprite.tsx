import React from 'react';

interface BarnabySpriteProps {
  size?: 'sm' | 'md' | 'lg';
  isExcited?: boolean;
  className?: string;
}

/**
 * Barnaby: The neighbor's prize French bulldog wearing a velvet tuxedo collar.
 */
export const BarnabySprite: React.FC<BarnabySpriteProps> = ({
  size = 'md',
  isExcited = false,
  className = '',
}) => {
  const sizeClass = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  }[size];

  return (
    <div
      className={`relative inline-block select-none ${sizeClass} ${className} ${
        isExcited ? 'animate-bounce' : ''
      }`}
      style={{ imageRendering: 'pixelated' }}
      title="Barnaby the Tuxedo French Bulldog"
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft shadow */}
        <ellipse cx="32" cy="58" rx="20" ry="4" fill="rgba(0,0,0,0.25)" />

        {/* Bat Ears */}
        <path d="M 16 10 L 24 24 L 14 24 Z" fill="#95a5a6" />
        <path d="M 18 14 L 22 22 L 16 22 Z" fill="#ffb8b8" />

        <path d="M 48 10 L 50 24 L 40 24 Z" fill="#95a5a6" />
        <path d="M 46 14 L 48 22 L 42 22 Z" fill="#ffb8b8" />

        {/* Chubby Head */}
        <rect x="16" y="20" width="32" height="24" rx="8" fill="#bdc3c7" />

        {/* Black Muzzle */}
        <ellipse cx="32" cy="34" rx="10" ry="7" fill="#2c3e50" />
        <ellipse cx="32" cy="30" rx="3.5" ry="2.5" fill="#1a252f" />

        {/* Bulldog Wrinkles & Tongue */}
        <path d="M 28 35 Q 32 37 36 35" stroke="#1a252f" strokeWidth="1.5" fill="none" />
        {isExcited && (
          <path d="M 30 36 Q 32 41 34 36 Z" fill="#ff7675" />
        )}

        {/* Big expressive round eyes */}
        <circle cx="23" cy="27" r="3.5" fill="#1a252f" />
        <circle cx="22" cy="26" r="1.5" fill="#ffffff" />

        <circle cx="41" cy="27" r="3.5" fill="#1a252f" />
        <circle cx="40" cy="26" r="1.5" fill="#ffffff" />

        {/* Stout Body */}
        <rect x="20" y="38" width="24" height="18" rx="5" fill="#bdc3c7" />

        {/* Velvet Tuxedo Collar & Red Bowtie */}
        <rect x="22" y="38" width="20" height="5" fill="#2d3436" rx="2" />
        <polygon points="30,38 34,42 30,42" fill="#e74c3c" />
        <polygon points="34,38 30,42 34,42" fill="#e74c3c" />
        <circle cx="32" cy="40" r="1.5" fill="#f1c40f" />

        {/* Paws */}
        <rect x="20" y="52" width="7" height="6" rx="3" fill="#95a5a6" />
        <rect x="37" y="52" width="7" height="6" rx="3" fill="#95a5a6" />

        {/* Tail wag */}
        <path d="M 18 45 Q 14 42 16 38" stroke="#bdc3c7" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
};
