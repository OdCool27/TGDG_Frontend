import React from 'react';
import {
  CharacterCustomization,
  CharacterExpression,
  HairStyle,
} from '../../types/game';

interface PixelCharacterProps {
  customization: CharacterCustomization;
  overrideExpression?: CharacterExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDecorations?: boolean;
  className?: string;
}

/**
 * Procedural SVG Pixel-Art Character Renderer supporting distinct
 * Male and Female body silhouettes, facial structures, and hairstyles.
 */
export const PixelCharacter: React.FC<PixelCharacterProps> = ({
  customization,
  overrideExpression,
  size = 'md',
  showDecorations = true,
  className = '',
}) => {
  const expr = overrideExpression || customization.expression || 'neutral';
  const gender = customization.gender || 'female';
  const { skinTone, hairColor, outfitColor, hairStyle, glasses, facialHair } = customization;

  const sizeClass = {
    sm: 'w-16 h-20',
    md: 'w-24 h-32',
    lg: 'w-36 h-48',
    xl: 'w-48 h-64',
  }[size];

  // Render hairstyles for male and female
  const renderHair = (style: HairStyle | string, color: string) => {
    switch (style) {
      // Female Styles
      case 'long_wavy':
        return (
          <g fill={color}>
            <rect x="18" y="6" width="28" height="8" />
            <rect x="14" y="10" width="36" height="12" />
            <rect x="12" y="20" width="8" height="34" rx="2" />
            <rect x="44" y="20" width="8" height="34" rx="2" />
            <rect x="10" y="32" width="6" height="24" rx="2" />
            <rect x="48" y="32" width="6" height="24" rx="2" />
            <rect x="20" y="12" width="4" height="10" fill="rgba(255,255,255,0.2)" />
          </g>
        );

      case 'ponytail':
        return (
          <g fill={color}>
            <rect x="18" y="6" width="28" height="10" />
            <rect x="16" y="12" width="32" height="10" />
            {/* High pony sweeping to side */}
            <circle cx="48" cy="14" r="5" fill="#ff7675" />
            <path d="M 48 14 Q 58 20 54 42 Q 50 44 48 38 Q 52 26 48 18 Z" fill={color} />
            <rect x="16" y="20" width="4" height="10" />
            <rect x="44" y="20" width="4" height="8" />
          </g>
        );

      case 'bangs':
        return (
          <g fill={color}>
            <rect x="18" y="6" width="28" height="8" />
            <rect x="14" y="10" width="36" height="12" />
            {/* Straight cute fringe bangs */}
            <rect x="18" y="16" width="28" height="6" />
            <rect x="14" y="20" width="6" height="24" />
            <rect x="44" y="20" width="6" height="24" />
          </g>
        );

      case 'bob':
        return (
          <g fill={color}>
            <rect x="20" y="8" width="24" height="6" />
            <rect x="16" y="12" width="32" height="12" />
            <rect x="14" y="20" width="8" height="22" rx="2" />
            <rect x="42" y="20" width="8" height="22" rx="2" />
            <rect x="18" y="14" width="4" height="14" fill="rgba(255,255,255,0.2)" />
          </g>
        );

      // Male Styles
      case 'fade':
        return (
          <g fill={color}>
            {/* Textured top with faded sides */}
            <rect x="20" y="6" width="24" height="10" />
            <rect x="18" y="10" width="28" height="8" />
            {/* Fade on sides */}
            <rect x="16" y="18" width="3" height="10" opacity="0.6" />
            <rect x="45" y="18" width="3" height="10" opacity="0.6" />
            <rect x="22" y="8" width="6" height="4" fill="rgba(255,255,255,0.2)" />
          </g>
        );

      case 'short_casual':
        return (
          <g fill={color}>
            <rect x="18" y="7" width="28" height="9" />
            <rect x="16" y="12" width="32" height="8" />
            <rect x="16" y="18" width="4" height="10" />
            <rect x="44" y="18" width="4" height="10" />
            <rect x="24" y="6" width="5" height="4" />
          </g>
        );

      case 'man_bun':
        return (
          <g fill={color}>
            {/* Top Knot Bun */}
            <rect x="27" y="1" width="10" height="8" rx="2" />
            <rect x="20" y="8" width="24" height="8" />
            <rect x="16" y="14" width="32" height="8" />
            <rect x="16" y="20" width="4" height="12" />
            <rect x="44" y="20" width="4" height="12" />
          </g>
        );

      case 'beanie':
        return (
          <g>
            <rect x="18" y="3" width="28" height="15" fill="#e74c3c" rx="3" />
            <rect x="16" y="16" width="32" height="6" fill="#c0392b" />
            <rect x="30" y="0" width="4" height="4" fill="#f1c40f" />
            <rect x="16" y="22" width="4" height="12" fill={color} />
            <rect x="44" y="22" width="4" height="12" fill={color} />
          </g>
        );

      case 'curly_afro':
      case 'curly':
        return (
          <g fill={color}>
            <rect x="16" y="4" width="32" height="12" rx="4" />
            <rect x="12" y="10" width="40" height="14" rx="4" />
            <rect x="12" y="20" width="8" height="12" />
            <rect x="44" y="20" width="8" height="12" />
            <circle cx="20" cy="8" r="3" fill="rgba(255,255,255,0.2)" />
            <circle cx="44" cy="8" r="3" fill="rgba(255,255,255,0.2)" />
          </g>
        );

      case 'messy_waves':
      case 'messy':
      default:
        return (
          <g fill={color}>
            <rect x="18" y="6" width="28" height="8" />
            <rect x="14" y="10" width="36" height="10" />
            <rect x="14" y="18" width="6" height="14" />
            <rect x="44" y="18" width="6" height="14" />
            <rect x="22" y="2" width="6" height="6" />
            <rect x="34" y="3" width="6" height="5" />
          </g>
        );
    }
  };

  // Facial features based on expression & gender
  const renderFacialExpression = (expression: CharacterExpression, isFemale: boolean) => {
    switch (expression) {
      case 'delighted':
        return (
          <g>
            <path d="M 23 26 Q 26 22 29 26" stroke="#2c2a38" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 35 26 Q 38 22 41 26" stroke="#2c2a38" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {isFemale && (
              <>
                <line x1="29" y1="24" x2="31" y2="22" stroke="#2c2a38" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="35" y1="24" x2="33" y2="22" stroke="#2c2a38" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
            <rect x="19" y="30" width="7" height="3.5" fill="#ff7675" opacity="0.85" rx="1.5" />
            <rect x="38" y="30" width="7" height="3.5" fill="#ff7675" opacity="0.85" rx="1.5" />
            <path d="M 28 32 Q 32 38 36 32 Z" fill="#e84393" stroke="#2c2a38" strokeWidth="1" />
            {showDecorations && (
              <g fill="#ffeaa7">
                <polygon points="12,18 14,14 16,18 14,22" />
                <polygon points="50,14 52,10 54,14 52,18" />
              </g>
            )}
          </g>
        );

      case 'embarrassed':
        return (
          <g>
            <rect x="24" y="24" width="4" height="2" fill="#2c2a38" />
            <rect x="36" y="24" width="4" height="2" fill="#2c2a38" />
            <rect x="18" y="28" width="8" height="4" fill="#ff4757" opacity="0.85" rx="2" />
            <rect x="38" y="28" width="8" height="4" fill="#ff4757" opacity="0.85" rx="2" />
            <path d="M 27 34 Q 30 32 32 34 Q 34 36 37 34" stroke="#2c2a38" strokeWidth="2" fill="none" strokeLinecap="round" />
            {showDecorations && (
              <path d="M 48 18 Q 50 14 52 18 Q 50 24 48 18 Z" fill="#74b9ff" className="animate-bounce" />
            )}
          </g>
        );

      case 'determined':
        return (
          <g>
            <line x1="21" y1="21" x2="28" y2="24" stroke="#2c2a38" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="43" y1="21" x2="36" y2="24" stroke="#2c2a38" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="24" y="25" width="4" height="4" fill="#2c2a38" />
            <rect x="36" y="25" width="4" height="4" fill="#2c2a38" />
            <rect x="26" y="25" width="2" height="2" fill="#fff" />
            <rect x="38" y="25" width="2" height="2" fill="#fff" />
            <path d="M 28 34 Q 32 35 36 32" stroke="#2c2a38" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'shocked':
        return (
          <g>
            <line x1="22" y1="20" x2="28" y2="20" stroke="#2c2a38" strokeWidth="2" />
            <line x1="36" y1="20" x2="42" y2="20" stroke="#2c2a38" strokeWidth="2" />
            <circle cx="26" cy="25" r="3.5" fill="#fff" stroke="#2c2a38" strokeWidth="1.5" />
            <circle cx="26" cy="25" r="1.5" fill="#2c2a38" />
            <circle cx="38" cy="25" r="3.5" fill="#fff" stroke="#2c2a38" strokeWidth="1.5" />
            <circle cx="38" cy="25" r="1.5" fill="#2c2a38" />
            <ellipse cx="32" cy="34" rx="2.5" ry="4" fill="#2c2a38" />
            {showDecorations && (
              <g stroke="#ffd32a" strokeWidth="2" strokeLinecap="round">
                <line x1="14" y1="12" x2="10" y2="8" />
                <line x1="50" y1="12" x2="54" y2="8" />
              </g>
            )}
          </g>
        );

      case 'laughing':
        return (
          <g>
            <path d="M 23 23 L 27 26 L 23 29" stroke="#2c2a38" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 41 23 L 37 26 L 41 29" stroke="#2c2a38" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="18" y="28" width="6" height="3" fill="#ff7675" rx="1.5" />
            <rect x="40" y="28" width="6" height="3" fill="#ff7675" rx="1.5" />
            <path d="M 26 31 Q 32 40 38 31 Z" fill="#d63031" stroke="#2c2a38" strokeWidth="1.5" />
            <path d="M 28 32 Q 32 34 36 32" fill="#fff" />
            {showDecorations && <circle cx="16" cy="28" r="2" fill="#00cec9" />}
          </g>
        );

      case 'panicked':
        return (
          <g>
            <path d="M 22 21 Q 25 18 28 22" stroke="#2c2a38" strokeWidth="2" fill="none" />
            <path d="M 36 22 Q 39 18 42 21" stroke="#2c2a38" strokeWidth="2" fill="none" />
            <circle cx="26" cy="25" r="2.5" fill="none" stroke="#2c2a38" strokeWidth="1.5" />
            <circle cx="38" cy="25" r="2.5" fill="none" stroke="#2c2a38" strokeWidth="1.5" />
            <path d="M 26 34 Q 29 37 32 34 Q 35 31 38 34" stroke="#2c2a38" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'neutral':
      default:
        return (
          <g>
            <rect x="24" y="24" width="4" height="4" fill="#2c2a38" rx="1" />
            <rect x="36" y="24" width="4" height="4" fill="#2c2a38" rx="1" />
            <rect x="25" y="24" width="1.5" height="1.5" fill="#fff" />
            <rect x="37" y="24" width="1.5" height="1.5" fill="#fff" />
            {isFemale && (
              <>
                <line x1="28" y1="23" x2="30" y2="21" stroke="#2c2a38" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="36" y1="23" x2="34" y2="21" stroke="#2c2a38" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
            <path d="M 29 33 Q 32 36 35 33" stroke="#2c2a38" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        );
    }
  };

  const isFemale = gender === 'female';

  return (
    <div
      className={`relative inline-block select-none ${sizeClass} ${className} ${
        expr === 'laughing' || expr === 'panicked' ? 'animate-pulse' : ''
      }`}
      style={{ imageRendering: 'pixelated' }}
      aria-label={`${customization.name} (${gender}) - feeling ${expr}`}
    >
      <svg
        viewBox="0 0 64 80"
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft shadow */}
        <ellipse cx="32" cy="76" rx="20" ry="4" fill="rgba(0,0,0,0.25)" />

        {/* Neck: slightly more slender for female */}
        <rect
          x={isFemale ? '29.5' : '29'}
          y="39"
          width={isFemale ? '5' : '6'}
          height="7"
          fill={skinTone}
        />

        {/* Head Base: softer curved jaw for female, slightly square for male */}
        <rect
          x="18"
          y="16"
          width="28"
          height="26"
          fill={skinTone}
          rx={isFemale ? '6' : '3'}
        />

        {/* Ears */}
        <rect x="15" y="24" width="3" height="6" fill={skinTone} rx="1" />
        <rect x="46" y="24" width="3" height="6" fill={skinTone} rx="1" />

        {/* Hair Back Layer */}
        {renderHair(hairStyle, hairColor)}

        {/* Facial Hair (for Male option if enabled) */}
        {!isFemale && facialHair && (
          <g fill={hairColor} opacity="0.6">
            <rect x="22" y="36" width="20" height="4" rx="2" />
            <rect x="25" y="34" width="14" height="2" />
          </g>
        )}

        {/* Facial Expression */}
        {renderFacialExpression(expr, isFemale)}

        {/* Glasses Option */}
        {glasses && (
          <g stroke="#2c3e50" strokeWidth="2" fill="rgba(255,255,255,0.25)">
            <rect x="22" y="22" width="8" height="8" rx={isFemale ? '4' : '2'} />
            <rect x="34" y="22" width="8" height="8" rx={isFemale ? '4' : '2'} />
            <line x1="30" y1="26" x2="34" y2="26" stroke="#2c3e50" strokeWidth="2" />
          </g>
        )}

        {/* Body & Clothing Silhouette: Female vs Male */}
        {isFemale ? (
          <g>
            {/* Female Torso / Sweater with soft shoulder curve */}
            <path
              d="M 18 46 Q 32 44 46 46 L 50 74 L 14 74 Z"
              fill={outfitColor}
            />
            {/* Curved scoop collar */}
            <path
              d="M 25 46 Q 32 52 39 46 Z"
              fill={skinTone}
            />
            <path
              d="M 25 46 Q 32 52 39 46"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Arms & Hands */}
            <rect x="11" y="48" width="5.5" height="18" fill={outfitColor} rx="2" />
            <rect x="47.5" y="48" width="5.5" height="18" fill={outfitColor} rx="2" />
            <rect x="11" y="64" width="5.5" height="5" fill={skinTone} rx="2" />
            <rect x="47.5" y="64" width="5.5" height="5" fill={skinTone} rx="2" />
          </g>
        ) : (
          <g>
            {/* Male Torso / Broader structured shoulders */}
            <path
              d="M 15 46 L 49 46 L 53 74 L 11 74 Z"
              fill={outfitColor}
            />
            {/* Crewneck / Shirt collar */}
            <polygon points="26,46 32,52 38,46" fill="#fff" opacity="0.9" />
            {/* Broader Arms & Hands */}
            <rect x="9" y="47" width="6.5" height="18" fill={outfitColor} rx="2" />
            <rect x="48.5" y="47" width="6.5" height="18" fill={outfitColor} rx="2" />
            <rect x="9" y="64" width="6.5" height="5" fill={skinTone} rx="2" />
            <rect x="48.5" y="64" width="6.5" height="5" fill={skinTone} rx="2" />
          </g>
        )}
      </svg>
    </div>
  );
};
