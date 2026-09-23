import React, { useState } from 'react';
import {
  CharacterCustomization,
  BodyStyle,
  CharacterGender,
  CharacterUpdateRequest,
  HairStyle,
  RoomTheme,
} from '../../types/game';
import { useGame } from '../../context/GameContext';
import { PixelCharacter } from '../pixel/PixelCharacter';
import { PixelRoomBackground } from '../pixel/PixelRoomBackground';
import { Sparkles, Check, Glasses, Home, User, Smile, ArrowLeft } from 'lucide-react';

export interface CharacterSetupScreenProps {
  mode?: 'create' | 'join' | 'edit';
  joinCode?: string;
  onBack?: () => void;
  onComplete?: () => void;
}

const FEMALE_HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: 'long_wavy', label: 'Long Wavy' },
  { id: 'ponytail', label: 'High Pony' },
  { id: 'bangs', label: 'Cute Bangs' },
  { id: 'bob', label: 'Chic Bob' },
  { id: 'curly_afro', label: 'Soft Curls' },
  { id: 'beanie', label: 'Knit Beanie' },
];

const MALE_HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: 'fade', label: 'Clean Fade' },
  { id: 'short_casual', label: 'Short Casual' },
  { id: 'messy_waves', label: 'Messy Flow' },
  { id: 'man_bun', label: 'Man Bun' },
  { id: 'curly_afro', label: 'Curly Afro' },
  { id: 'beanie', label: 'Knit Beanie' },
];

const HAIR_COLORS = [
  { id: '#3a2e39', label: 'Espresso' },
  { id: '#e67e22', label: 'Copper' },
  { id: '#f1c40f', label: 'Honey Blonde' },
  { id: '#9b59b6', label: 'Lavender' },
  { id: '#e74c3c', label: 'Crimson' },
  { id: '#1a1a24', label: 'Midnight' },
];

const SKIN_TONES = [
  { id: '#ffd1b3', label: 'Fair Warm' },
  { id: '#f0b68a', label: 'Golden Peach' },
  { id: '#bb8056', label: 'Rich Tan' },
  { id: '#7a4933', label: 'Deep Cocoa' },
];

const OUTFIT_COLORS = [
  { id: '#ff6b8b', label: 'Coral' },
  { id: '#6c5ce7', label: 'Lavender' },
  { id: '#00b894', label: 'Mint' },
  { id: '#fdcb6e', label: 'Marigold' },
  { id: '#e17055', label: 'Terracotta' },
  { id: '#2d3436', label: 'Charcoal' },
];

const ROOM_THEMES: { id: RoomTheme; label: string; desc: string }[] = [
  { id: 'cozy_plants', label: 'Plant Sanctuary', desc: 'Monstera, hanging vines & fairy lights' },
  { id: 'neon_gamer', label: 'Neon Studio', desc: 'Ambient LED strip & cozy desk setup' },
  { id: 'warm_books', label: 'Antique Library', desc: 'Stacked paperbacks & warm reading lamp' },
  { id: 'city_glow', label: 'City Skylight', desc: 'Panoramic apartment window & stars' },
];

export const CharacterSetupScreen: React.FC<CharacterSetupScreenProps> = ({
  mode = 'edit',
  joinCode,
  onBack,
  onComplete,
}) => {
  const { myCharacter, saveCharacter, createGame, joinGame, loading, isHost } = useGame();

  const [gender, setGender] = useState<CharacterGender>(
    myCharacter.gender || (mode === 'create' ? 'female' : 'male')
  );
  const [name, setName] = useState<string>(
    myCharacter.name || (gender === 'female' ? 'Maya' : 'Liam')
  );
  const [hairStyle, setHairStyle] = useState<HairStyle>(
    myCharacter.hairStyle || (gender === 'female' ? 'long_wavy' : 'short_casual')
  );
  const [hairColor, setHairColor] = useState<string>(myCharacter.hairColor || '#3a2e39');
  const [skinTone, setSkinTone] = useState<string>(myCharacter.skinTone || '#ffd1b3');
  const [outfitColor, setOutfitColor] = useState<string>(
    myCharacter.outfitColor || (gender === 'female' ? '#ff6b8b' : '#6c5ce7')
  );
  const [glasses, setGlasses] = useState<boolean>(myCharacter.glasses ?? false);
  const [bodyStyle, setBodyStyle] = useState<BodyStyle>(myCharacter.bodyStyle || 'sweater');
  const [facialHair, setFacialHair] = useState<boolean>(myCharacter.facialHair ?? false);
  const [roomTheme, setRoomTheme] = useState<RoomTheme>(myCharacter.roomTheme || 'cozy_plants');

  // When switching gender, set a default matching hairstyle
  const handleGenderChange = (newGender: CharacterGender) => {
    setGender(newGender);
    if (newGender === 'female') {
      setHairStyle('long_wavy');
      setFacialHair(false);
      if (name === 'Liam') setName('Maya');
    } else {
      setHairStyle('short_casual');
      if (name === 'Maya') setName('Liam');
    }
  };

  const previewCustomization: CharacterCustomization = {
    name: name.trim() || (gender === 'female' ? 'Maya' : 'Liam'),
    gender,
    hairStyle,
    hairColor,
    skinTone,
    outfitColor,
    bodyStyle,
    glasses,
    facialHair,
    roomTheme,
    expression: 'delighted',
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updateData: CharacterUpdateRequest = {
      name: name.trim() || (gender === 'female' ? 'Maya' : 'Liam'),
      gender,
      hairStyle,
      hairColor,
      skinTone,
      outfitColor,
      bodyStyle,
      glasses,
      facialHair,
      roomTheme,
    };

    if (mode === 'create') {
      if (await createGame(updateData)) onComplete?.();
    } else if (mode === 'join' && joinCode) {
      if (await joinGame(joinCode, updateData)) onComplete?.();
    } else {
      if (await saveCharacter(updateData)) onComplete?.();
    }
  };

  const activeHairStyles = gender === 'female' ? FEMALE_HAIR_STYLES : MALE_HAIR_STYLES;

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4 sm:py-6 animate-in fade-in duration-300">
      {/* Top Header / Back Button */}
      <div className="flex items-center justify-between mb-3">
        {onBack ? (
          <button
            onClick={onBack}
            className="text-xs text-[#9f96c7] hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <span />
        )}
        <span className="text-[11px] font-mono uppercase tracking-widest text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2.5 py-0.5 rounded-full">
          {mode === 'create'
            ? 'Host Room Setup'
            : mode === 'join'
            ? `Joining ${joinCode || 'Room'}`
            : 'Customize Look'}
        </span>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-white font-['Fredoka']">
          {mode === 'create'
            ? 'Create Your Date Profile'
            : mode === 'join'
            ? 'Set Up Your Look to Join'
            : 'Customize Your Date Avatar'}
        </h2>
        <p className="text-xs text-[#9f96c7] mt-0.5">
          Select your character sprite base, style, and webcam room backdrop.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
        {/* Gender Selection Bar: Male / Female */}
        <div className="p-1 rounded-2xl bg-[#171333] border-2 border-[#362e63] grid grid-cols-2 gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => handleGenderChange('female')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              gender === 'female'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                : 'text-[#9f96c7] hover:text-white'
            }`}
          >
            <span>👩 Female Sprite</span>
          </button>
          <button
            type="button"
            onClick={() => handleGenderChange('male')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              gender === 'male'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-[#9f96c7] hover:text-white'
            }`}
          >
            <span>👨 Male Sprite</span>
          </button>
        </div>

        {/* Live Interactive Pixel Preview Card */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-[#3b3464] shadow-lg flex items-center justify-center">
          <PixelRoomBackground theme={roomTheme}>
            <div className="flex flex-col items-center">
              <PixelCharacter
                customization={previewCustomization}
                size="lg"
                overrideExpression="delighted"
              />
            </div>
          </PixelRoomBackground>

          {/* Floating name badge */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-xs font-bold text-white flex items-center gap-1.5">
            <span>{previewCustomization.name}</span>
            <span className="text-[10px] text-pink-300 font-normal">
              ({gender === 'female' ? 'Female' : 'Male'})
            </span>
          </div>
        </div>

        {/* Character Name Input */}
        <div className="bg-[#191533] p-3.5 rounded-xl border border-[#2e2754]">
          <label className="block text-xs font-semibold text-[#b8b0db] mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-pink-400" />
            <span>Character Name</span>
          </label>
          <input
            type="text"
            maxLength={18}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full py-2 px-3 rounded-lg bg-[#0e0c1e] border border-[#3d366a] focus:border-pink-500 text-white text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            required
          />
        </div>

        {/* Hair Styles & Colors */}
        <div className="bg-[#191533] p-3.5 rounded-xl border border-[#2e2754] space-y-3">
          <label className="block text-xs font-semibold text-[#b8b0db] flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-pink-400" />
            <span>{gender === 'female' ? 'Female Hair Styles' : 'Male Hair Styles'} & Color</span>
          </label>

          {/* Hair Style Selector */}
          <div className="grid grid-cols-3 gap-1.5">
            {activeHairStyles.map((style) => (
              <button
                type="button"
                key={style.id}
                onClick={() => setHairStyle(style.id)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors border ${
                  hairStyle === style.id
                    ? 'bg-pink-500/20 border-pink-500 text-white'
                    : 'bg-[#120f26] border-[#2c264f] text-[#8e85b2] hover:text-white'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>

          {/* Hair Color Circles */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-[#7b729f]">Hair Color:</span>
            <div className="flex gap-2">
              {HAIR_COLORS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setHairColor(c.id)}
                  style={{ backgroundColor: c.id }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    hairColor === c.id ? 'scale-125 border-white shadow-md' : 'border-black/40'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Skin Tone & Outfit Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Skin Tone */}
          <div className="bg-[#191533] p-3 rounded-xl border border-[#2e2754]">
            <span className="block text-xs font-semibold text-[#b8b0db] mb-2">Skin Tone</span>
            <div className="flex gap-2">
              {SKIN_TONES.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setSkinTone(s.id)}
                  style={{ backgroundColor: s.id }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    skinTone === s.id ? 'scale-125 border-white shadow-md' : 'border-black/40'
                  }`}
                  title={s.label}
                />
              ))}
            </div>
          </div>

          {/* Outfit Color */}
          <div className="bg-[#191533] p-3 rounded-xl border border-[#2e2754]">
            <span className="block text-xs font-semibold text-[#b8b0db] mb-2">Sweater Outfit</span>
            <div className="flex gap-2">
              {OUTFIT_COLORS.map((o) => (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => setOutfitColor(o.id)}
                  style={{ backgroundColor: o.id }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    outfitColor === o.id ? 'scale-125 border-white shadow-md' : 'border-black/40'
                  }`}
                  title={o.label}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#191533] p-3 rounded-xl border border-[#2e2754]">
          <label htmlFor="body-style" className="block text-xs text-[#b8b0db] mb-2">Outfit style</label>
          <select id="body-style" value={bodyStyle} onChange={e => setBodyStyle(e.target.value as BodyStyle)} className="w-full bg-[#120f26] p-2 rounded-lg text-sm">
            <option value="casual_hoodie">Casual hoodie</option><option value="sweater">Sweater</option><option value="collared">Collared shirt</option><option value="tee">T-shirt</option>
          </select>
        </div>
        {/* Accessories: Glasses & Facial Hair (if male) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Glasses */}
          <div className="bg-[#191533] p-3 rounded-xl border border-[#2e2754] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Glasses className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-semibold text-white">Wire Glasses</span>
            </div>
            <button
              type="button"
              onClick={() => setGlasses(!glasses)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${
                glasses
                  ? 'bg-pink-500 text-white border-pink-400'
                  : 'bg-[#120f26] text-[#8e85b2] border-[#2c264f]'
              }`}
            >
              {glasses ? 'On ✓' : 'Off'}
            </button>
          </div>

          {/* Facial Hair (Male only) */}
          {gender === 'male' && (
            <div className="bg-[#191533] p-3 rounded-xl border border-[#2e2754] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🧔</span>
                <span className="text-xs font-semibold text-white">Neat Stubble</span>
              </div>
              <button
                type="button"
                onClick={() => setFacialHair(!facialHair)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${
                  facialHair
                    ? 'bg-indigo-600 text-white border-indigo-400'
                    : 'bg-[#120f26] text-[#8e85b2] border-[#2c264f]'
                }`}
              >
                {facialHair ? 'Yes ✓' : 'Clean'}
              </button>
            </div>
          )}
        </div>

        {/* Webcam Room Backdrop Theme */}
        <div className="bg-[#191533] p-3.5 rounded-xl border border-[#2e2754] space-y-2">
          <label className="block text-xs font-semibold text-[#b8b0db] flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-pink-400" />
            <span>Apartment Webcam Backdrop</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ROOM_THEMES.map((theme) => (
              <button
                type="button"
                key={theme.id}
                onClick={() => setRoomTheme(theme.id)}
                className={`p-2.5 rounded-xl text-left transition-all border ${
                  roomTheme === theme.id
                    ? 'bg-purple-900/40 border-pink-500 shadow-sm'
                    : 'bg-[#120f26] border-[#2c264f] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="text-xs font-bold text-white">{theme.label}</div>
                <div className="text-[10px] text-[#8e85b2] mt-0.5 leading-snug">{theme.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-[0_4px_16px_rgba(244,63,94,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>
            {mode === 'create'
              ? 'Create Date Room'
              : mode === 'join'
              ? `Join Room (${joinCode})`
              : 'Save Profile & Enter Room'}
          </span>
        </button>
      </form>
    </div>
  );
};
