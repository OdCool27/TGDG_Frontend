import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  CharacterUpdateRequest,
  PlayerRole,
  SessionResponse,
  CharacterCustomization,
} from '../types/game';
import { getApiClient, isMockMode, setMockMode, subscribeToPreview, simulatePreview } from '../api';
import { ApiError } from '../api/client';
import { sound, audioEngine, MusicTheme } from '../utils/sound';

interface GameContextType {
  sessionId: string | null;
  playerToken: string | null;
  playerRole: PlayerRole | null;
  sessionState: SessionResponse | null;
  loading: boolean;
  error: string | null;
  isMuted: boolean;
  isSoundMuted: boolean;
  isMusicMuted: boolean;
  isMusicPlaying: boolean;
  currentThemeName: string;
  isMock: boolean;
  simulatedPartner: boolean;
  createGame: (initialChar?: CharacterUpdateRequest) => Promise<boolean>;
  joinGame: (code: string, initialChar?: CharacterUpdateRequest) => Promise<boolean>;
  saveCharacter: (char: CharacterUpdateRequest) => Promise<boolean>;
  startGame: () => Promise<void>;
  submitChoice: (choiceId: string) => Promise<void>;
  advanceScene: () => Promise<void>;
  toggleSound: () => void;
  toggleMusic: () => void;
  setMusicTheme: (theme: MusicTheme) => void;
  toggleMockMode: () => void;
  toggleSimulatedPartner: () => void;
  leaveGame: () => void;
  copyJoinLink: () => Promise<boolean>;
  clearError: () => void;
  myCharacter: CharacterCustomization;
  partnerCharacter?: CharacterCustomization;
  isHost: boolean;
  hasPartnerJoined: boolean;
}

const storagePrefix = isMockMode() ? 'date_glitch_preview_' : 'date_glitch_live_';
const LOCAL_SESSION_KEY = storagePrefix + 'session_id';
const LOCAL_TOKEN_KEY = storagePrefix + 'player_token';
const LOCAL_ROLE_KEY = storagePrefix + 'player_role';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_SESSION_KEY);
  });
  const [playerToken, setPlayerToken] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_TOKEN_KEY);
  });
  const [playerRole, setPlayerRole] = useState<PlayerRole | null>(() => {
    return (localStorage.getItem(LOCAL_ROLE_KEY) as PlayerRole) || null;
  });
  const [sessionState, setSessionState] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const activeSessionRef = useRef(sessionId);
  activeSessionRef.current = sessionId;
  const fetchBusyRef = useRef(false);
  const mountedRef = useRef(true);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);
  const applySession = (data: SessionResponse) => {
    if (!mountedRef.current || activeSessionRef.current !== data.sessionId) return;
    setSessionState(previous => previous && previous.sessionId === data.sessionId && (previous.revision ?? 0) > (data.revision ?? 0) ? previous : data);
  };
  const [audioState, setAudioState] = useState(() => ({
    soundMuted: audioEngine.isMuted(),
    musicMuted: audioEngine.isMusicMuted(),
    musicPlaying: audioEngine.isMusicPlaying(),
    themeName: audioEngine.getThemeDisplayName(),
  }));
  const [simulatedPartner, setSimulatedPartner] = useState<boolean>(false);

  const pollingRef = useRef<number | null>(null);
  const lastStateHashRef = useRef<string>('');

  // Subscribe to audio engine changes
  useEffect(() => {
    return audioEngine.subscribe(() => {
      setAudioState({
        soundMuted: audioEngine.isMuted(),
        musicMuted: audioEngine.isMusicMuted(),
        musicPlaying: audioEngine.isMusicPlaying(),
        themeName: audioEngine.getThemeDisplayName(),
      });
    });
  }, []);

  // Adaptive music theme based on game progression
  useEffect(() => {
    if (!sessionState || sessionState.status === 'lobby') {
      audioEngine.switchTheme('lobby');
      return;
    }

    if (sessionState.status === 'in_story') {
      if (sessionState.currentChapter === 3) {
        audioEngine.switchTheme('midnight');
      } else {
        audioEngine.switchTheme('story');
      }
    } else if (sessionState.status === 'choice_pending') {
      audioEngine.switchTheme('choice');
    } else if (sessionState.status === 'outcome_revealed') {
      audioEngine.switchTheme('outcome');
    } else if (sessionState.status === 'chapter_recap' || sessionState.status === 'ended') {
      audioEngine.switchTheme('outcome');
    }
  }, [sessionState?.status, sessionState?.currentChapter]);

  // Sound toggle (SFX)
  const toggleSound = useCallback(() => {
    const muted = audioEngine.toggleMute();
    if (!muted) {
      audioEngine.playClick();
    }
  }, []);

  // Music toggle (BGM)
  const toggleMusic = useCallback(() => {
    audioEngine.toggleMusic();
  }, []);

  const setMusicTheme = useCallback((theme: MusicTheme) => {
    audioEngine.switchTheme(theme);
  }, []);

  const toggleMockMode = useCallback(() => {
    setMockMode(!isMockMode());
  }, []);

  const toggleSimulatedPartner = useCallback(() => {
    if (sessionId) {
      const nextVal = !simulatedPartner;
      setSimulatedPartner(nextVal);
      simulatePreview(sessionId, nextVal);
      sound.playClick();
    }
  }, [sessionId, simulatedPartner]);

  // Fetch / poll session state
  const fetchSession = useCallback(
    async (sId: string, token: string) => {
      if (fetchBusyRef.current) return;
      fetchBusyRef.current = true;
      try {
        const client = getApiClient();
        const data = await client.getSession(sId, token);
        
        // Detect state changes to play audio cues
        const hash = `${data.status}_${data.currentChapter}_${data.currentScene?.id}_${data.submissionStatus.hostSubmitted}_${data.submissionStatus.guestSubmitted}`;
        if (lastStateHashRef.current && lastStateHashRef.current !== hash) {
          if (data.status === 'outcome_revealed') {
            sound.playReveal();
          } else if (data.status === 'chapter_recap' || data.status === 'ended') {
            sound.playFanfare();
          }
        }
        lastStateHashRef.current = hash;

        if (activeSessionRef.current !== sId || !mountedRef.current) return;
        applySession(data);
        setConnectionError(null);
      } catch (err) {
        if (activeSessionRef.current !== sId || !mountedRef.current) return;
        setConnectionError(err instanceof ApiError && [401,404,410].includes(err.status)
          ? `${err.message} Use Leave to start a new date.`
          : 'Reconnecting to the date server. A sleeping server may take a minute to wake; retrying automatically.');
      } finally {
        fetchBusyRef.current = false;
      }
    },
    []
  );

  // Setup 2-second polling during active session
  useEffect(() => {
    if (!sessionId || !playerToken) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    // Initial fetch
    fetchSession(sessionId, playerToken);

    // Poll every 2 seconds
    pollingRef.current = window.setInterval(() => {
      fetchSession(sessionId, playerToken);
    }, 2000);

    // Listen to local BroadcastChannel if in mock mode for instant multi-tab sync
    const unsubscribe = subscribeToPreview(() => {
      fetchSession(sessionId, playerToken);
    });

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      unsubscribe();
    };
  }, [sessionId, playerToken, fetchSession]);

  // App routes invite links through character setup before claiming the guest seat.

  const createGame = async (initialChar?: CharacterUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      sound.playClick();
      const client = getApiClient();
      const res = await client.createSession();

      setSessionId(res.sessionId);
      activeSessionRef.current = res.sessionId;
      setPlayerToken(res.playerToken);
      setPlayerRole('host');

      localStorage.setItem(LOCAL_SESSION_KEY, res.sessionId);
      localStorage.setItem(LOCAL_TOKEN_KEY, res.playerToken);
      localStorage.setItem(LOCAL_ROLE_KEY, 'host');

      if (initialChar) {
        applySession(await client.updateCharacter(res.sessionId, res.playerToken, initialChar));
      }

      await fetchSession(res.sessionId, res.playerToken);
      sound.playChime();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create date session';
      setError(msg);
      sound.playGlitch();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const joinGame = async (code: string, initialChar?: CharacterUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      sound.playClick();
      const client = getApiClient();
      const res = await client.joinSession(code);

      setSessionId(res.sessionId);
      activeSessionRef.current = res.sessionId;
      setPlayerToken(res.playerToken);
      setPlayerRole('guest');

      localStorage.setItem(LOCAL_SESSION_KEY, res.sessionId);
      localStorage.setItem(LOCAL_TOKEN_KEY, res.playerToken);
      localStorage.setItem(LOCAL_ROLE_KEY, 'guest');

      if (initialChar) {
        applySession(await client.updateCharacter(res.sessionId, res.playerToken, initialChar));
      }

      await fetchSession(res.sessionId, res.playerToken);
      sound.playChime();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to join date session';
      setError(msg);
      sound.playGlitch();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const saveCharacter = async (char: CharacterUpdateRequest) => {
    if (!sessionId || !playerToken) return false;
    setLoading(true);
    setError(null);
    try {
      sound.playClick();
      const client = getApiClient();
      const res = await client.updateCharacter(sessionId, playerToken, char);
      applySession(res);
      sound.playChime();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save character profile';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const startGame = async () => {
    if (!sessionId || !playerToken) return;
    setLoading(true);
    setError(null);
    try {
      sound.playGlitch(); // thematic glitch click!
      const client = getApiClient();
      const res = await client.startGame(sessionId, playerToken);
      applySession(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to start date';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const submitChoice = async (choiceId: string) => {
    if (!sessionId || !playerToken || !sessionState?.currentScene) return;
    setLoading(true);
    setError(null);
    try {
      sound.playClick();
      const client = getApiClient();
      const res = await client.submitChoice(sessionId, playerToken, {
        sceneId: sessionState.currentScene.id,
        choiceId,
      });
      applySession(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit choice';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const advanceScene = async () => {
    if (!sessionId || !playerToken) return;
    setLoading(true);
    setError(null);
    try {
      sound.playClick();
      const client = getApiClient();
      const res = await client.advanceSession(sessionId, playerToken, sessionState?.phaseId);
      applySession(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to advance to next scene';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const leaveGame = () => {
    sound.playClick();
    localStorage.removeItem(LOCAL_SESSION_KEY);
    localStorage.removeItem(LOCAL_TOKEN_KEY);
    localStorage.removeItem(LOCAL_ROLE_KEY);
    setSessionId(null);
    activeSessionRef.current = null;
    setPlayerToken(null);
    setPlayerRole(null);
    setSessionState(null);
    setSimulatedPartner(false);
    setError(null);
    setConnectionError(null);
    // clear URL search
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const copyJoinLink = async (): Promise<boolean> => {
    sound.playClick();
    if (!sessionState?.joinCode) return false;
    const url = `${window.location.origin}${window.location.pathname}?join=${sessionState.joinCode}`;
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  };

  // Helper getters
  const isHost = playerRole === 'host';
  const myCharacter: CharacterCustomization = isHost
    ? sessionState?.host.character || {
        name: 'Jordan',
        gender: 'female',
        hairStyle: 'long_wavy',
        hairColor: '#3a2e39',
        skinTone: '#ffd1b3',
        outfitColor: '#ff6b8b',
        bodyStyle: 'sweater',
        glasses: true,
        roomTheme: 'cozy_plants',
        expression: 'neutral',
      }
    : sessionState?.guest?.character || {
        name: 'Taylor',
        gender: 'male',
        hairStyle: 'short_casual',
        hairColor: '#e67e22',
        skinTone: '#ffd1b3',
        outfitColor: '#6c5ce7',
        bodyStyle: 'casual_hoodie',
        glasses: false,
        roomTheme: 'neon_gamer',
        expression: 'neutral',
      };

  const partnerCharacter: CharacterCustomization | undefined = isHost
    ? sessionState?.guest?.character
    : sessionState?.host.character;

  const hasPartnerJoined = !!sessionState?.guest;

  return (
    <GameContext.Provider
      value={{
        sessionId,
        playerToken,
        playerRole,
        sessionState,
        loading,
        error: error || connectionError,
        isMuted: audioState.soundMuted,
        isSoundMuted: audioState.soundMuted,
        isMusicMuted: audioState.musicMuted,
        isMusicPlaying: audioState.musicPlaying,
        currentThemeName: audioState.themeName,
        isMock: isMockMode(),
        simulatedPartner,
        createGame,
        joinGame,
        saveCharacter,
        startGame,
        submitChoice,
        advanceScene,
        toggleSound,
        toggleMusic,
        setMusicTheme,
        toggleMockMode,
        toggleSimulatedPartner,
        leaveGame,
        copyJoinLink,
        clearError: () => setError(null),
        myCharacter,
        partnerCharacter,
        isHost,
        hasPartnerJoined,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
