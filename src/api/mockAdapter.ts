/**
 * MOCK ADAPTER (FOR PROTOTYPING & PREVIEW ONLY)
 * 
 * IMPORTANT: This client is used exclusively in local preview and offline test modes.
 * In production, all game actions are driven authoritatively by the backend server API.
 */

import {
  CreateSessionResponse,
  JoinSessionResponse,
  CharacterUpdateRequest,
  SubmitChoiceRequest,
  SessionResponse,
  HealthCheckResponse,
  SessionPlayer,
  SessionGameStatus,
  TonightSituationState,
  StoryLogItem,
} from '../types/game';
import { GameApiClient } from './client';
import {
  STORY_SCENES,
  getCombinedConsequence,
  CHAPTER_RECAPS,
  calculateEnding,
  getInitialTonightSituation,
} from '../story/storyData';

interface InternalSessionState {
  sessionId: string;
  joinCode: string;
  status: SessionGameStatus;
  currentChapter: number;
  currentSceneIndex: number;
  host: SessionPlayer;
  guest?: SessionPlayer;
  hostToken: string;
  guestToken?: string;
  hostChoice?: string;
  guestChoice?: string;
  hostReadyAdvance: boolean;
  guestReadyAdvance: boolean;
  choiceHistory: Array<{ sceneId?: string; hostChoiceId: string; guestChoiceId: string }>;
  tonightSituation: TonightSituationState;
  storyLog: StoryLogItem[];
  autoSimulatePartner: boolean;
}

const STORAGE_KEY_PREFIX = 'date_glitch_mock_session_';
const CHANNEL_NAME = 'date_glitch_sync_channel';

export class MockGameApiClient implements GameApiClient {
  private channel: BroadcastChannel | null = null;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = () => {
          this.notifyListeners();
        };
      } catch {
        // Ignore BroadcastChannel errors in sandbox
      }
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }

  private broadcastChange() {
    if (this.channel) {
      this.channel.postMessage({ type: 'SESSION_UPDATED', timestamp: Date.now() });
    }
    this.notifyListeners();
  }

  private loadSession(sessionId: string): InternalSessionState | null {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${sessionId}`);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private saveSession(session: InternalSessionState) {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${session.sessionId}`, JSON.stringify(session));
      this.broadcastChange();
    } catch {
      // Storage quota or restriction
    }
  }

  private findSessionByCode(code: string): InternalSessionState | null {
    const targetCode = code.toUpperCase().trim();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        try {
          const s: InternalSessionState = JSON.parse(localStorage.getItem(key) || '{}');
          if (s.joinCode === targetCode) {
            return s;
          }
        } catch {
          // ignore corrupted key
        }
      }
    }
    return null;
  }

  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substring(2, 12);
  }

  async checkHealth(): Promise<HealthCheckResponse> {
    return {
      status: 'ok',
      version: '2.0.0-mock-adapter',
      timestamp: new Date().toISOString(),
    };
  }

  async createSession(): Promise<CreateSessionResponse> {
    const sessionId = 'sess_' + Math.random().toString(36).substring(2, 10);
    const joinCode = this.generateCode();
    const hostToken = this.generateToken();

    const newSession: InternalSessionState = {
      sessionId,
      joinCode,
      status: 'lobby',
      currentChapter: 1,
      currentSceneIndex: 0,
      hostToken,
      hostChoice: undefined,
      guestChoice: undefined,
      hostReadyAdvance: false,
      guestReadyAdvance: false,
      choiceHistory: [],
      tonightSituation: getInitialTonightSituation(),
      storyLog: [],
      autoSimulatePartner: false,
      host: {
        id: 'host_' + Math.random().toString(36).substring(2, 6),
        role: 'host',
        name: 'Jordan',
        isReady: false,
        hasSubmittedChoice: false,
        readyToAdvance: false,
        character: {
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
        },
      },
    };

    this.saveSession(newSession);

    return {
      sessionId,
      joinCode,
      playerToken: hostToken,
      playerRole: 'host',
    };
  }

  async joinSession(code: string): Promise<JoinSessionResponse> {
    const session = this.findSessionByCode(code);
    if (!session) {
      throw new Error(`Session with code "${code}" not found. Please verify the 5-character code.`);
    }

    let guestToken = session.guestToken;
    if (!guestToken) {
      guestToken = this.generateToken();
      session.guestToken = guestToken;
      session.guest = {
        id: 'guest_' + Math.random().toString(36).substring(2, 6),
        role: 'guest',
        name: 'Taylor',
        isReady: false,
        hasSubmittedChoice: false,
        readyToAdvance: false,
        character: {
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
        },
      };
      this.saveSession(session);
    }

    return {
      sessionId: session.sessionId,
      playerToken: guestToken,
      playerRole: 'guest',
    };
  }

  async updateCharacter(
    sessionId: string,
    token: string,
    character: CharacterUpdateRequest
  ): Promise<SessionResponse> {
    const session = this.loadSession(sessionId);
    if (!session) throw new Error('Session not found');

    if (token === session.hostToken) {
      session.host.name = character.name;
      session.host.character = {
        ...session.host.character,
        ...character,
      };
      session.host.isReady = true;
    } else if (token === session.guestToken && session.guest) {
      session.guest.name = character.name;
      session.guest.character = {
        ...session.guest.character,
        ...character,
      };
      session.guest.isReady = true;
    } else {
      throw new Error('Unauthorized or invalid player token');
    }

    this.saveSession(session);
    return this.buildSessionResponse(session, token);
  }

  async startGame(sessionId: string, token: string): Promise<SessionResponse> {
    const session = this.loadSession(sessionId);
    if (!session) throw new Error('Session not found');
    if (token !== session.hostToken) {
      throw new Error('Only the host can start the date');
    }

    session.status = 'in_story';
    session.currentSceneIndex = 0;
    session.currentChapter = 1;
    session.hostChoice = undefined;
    session.guestChoice = undefined;
    session.hostReadyAdvance = false;
    session.guestReadyAdvance = false;
    session.host.hasSubmittedChoice = false;
    if (session.guest) session.guest.hasSubmittedChoice = false;

    this.saveSession(session);
    return this.buildSessionResponse(session, token);
  }

  public enableAutoSimulation(sessionId: string, enabled: boolean) {
    const session = this.loadSession(sessionId);
    if (session) {
      session.autoSimulatePartner = enabled;
      if (enabled && !session.guest) {
        session.guest = {
          id: 'guest_simulated',
          role: 'guest',
          name: 'Taylor (Simulated)',
          isReady: true,
          hasSubmittedChoice: false,
          readyToAdvance: false,
          character: {
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
          },
        };
      }
      this.saveSession(session);
    }
  }

  async getSession(sessionId: string, token: string): Promise<SessionResponse> {
    const session = this.loadSession(sessionId);
    if (!session) throw new Error('Session not found');

    // Auto simulated partner logic
    if (session.autoSimulatePartner && session.status === 'choice_pending') {
      if (session.hostChoice && !session.guestChoice) {
        const currentScene = STORY_SCENES[session.currentSceneIndex];
        if (currentScene && currentScene.choices.guest.length > 0) {
          const randomGuestChoice =
            currentScene.choices.guest[
              Math.floor(Math.random() * currentScene.choices.guest.length)
            ].id;
          session.guestChoice = randomGuestChoice;
          if (session.guest) session.guest.hasSubmittedChoice = true;
          this.resolveOutcome(session);
          this.saveSession(session);
        }
      }
    }

    if (
      session.autoSimulatePartner &&
      session.status === 'outcome_revealed' &&
      session.hostReadyAdvance &&
      !session.guestReadyAdvance
    ) {
      session.guestReadyAdvance = true;
      this.advanceToNextScene(session);
      this.saveSession(session);
    }

    return this.buildSessionResponse(session, token);
  }

  async submitChoice(
    sessionId: string,
    token: string,
    choice: SubmitChoiceRequest
  ): Promise<SessionResponse> {
    const session = this.loadSession(sessionId);
    if (!session) throw new Error('Session not found');

    const isHost = token === session.hostToken;
    const isGuest = token === session.guestToken;

    if (!isHost && !isGuest) {
      throw new Error('Unauthorized');
    }

    if (isHost) {
      session.hostChoice = choice.choiceId;
      session.host.hasSubmittedChoice = true;
    } else {
      session.guestChoice = choice.choiceId;
      if (session.guest) session.guest.hasSubmittedChoice = true;
    }

    const bothSubmitted = !!session.hostChoice && !!session.guestChoice;

    if (bothSubmitted) {
      this.resolveOutcome(session);
    } else {
      session.status = 'choice_pending';

      if (session.autoSimulatePartner && isHost && !session.guestChoice) {
        setTimeout(() => {
          const reloaded = this.loadSession(sessionId);
          if (reloaded && reloaded.hostChoice && !reloaded.guestChoice) {
            const currentScene = STORY_SCENES[reloaded.currentSceneIndex];
            if (currentScene && currentScene.choices.guest.length > 0) {
              const pick =
                currentScene.choices.guest[
                  Math.floor(Math.random() * currentScene.choices.guest.length)
                ].id;
              reloaded.guestChoice = pick;
              if (reloaded.guest) reloaded.guest.hasSubmittedChoice = true;
              this.resolveOutcome(reloaded);
              this.saveSession(reloaded);
            }
          }
        }, 1200);
      }
    }

    this.saveSession(session);
    return this.buildSessionResponse(session, token);
  }

  /**
   * Authoritative outcome resolution: combines player choices,
   * derives consequences, applies state deltas, and updates the story log.
   */
  private resolveOutcome(session: InternalSessionState) {
    const currentScene = STORY_SCENES[session.currentSceneIndex] || STORY_SCENES[0];
    session.status = 'outcome_revealed';
    session.hostReadyAdvance = false;
    session.guestReadyAdvance = false;

    session.choiceHistory.push({
      sceneId: currentScene.id,
      hostChoiceId: session.hostChoice!,
      guestChoiceId: session.guestChoice!,
    });

    const hostChoiceObj = currentScene.choices.host.find((c) => c.id === session.hostChoice);
    const guestChoiceObj = currentScene.choices.guest.find((c) => c.id === session.guestChoice);

    const hostLabel = hostChoiceObj ? hostChoiceObj.label : session.hostChoice!;
    const guestLabel = guestChoiceObj ? guestChoiceObj.label : session.guestChoice!;

    const consequence = getCombinedConsequence(
      currentScene.id,
      session.hostChoice!,
      session.guestChoice!,
      session.host.character.name || 'Host',
      session.guest?.character.name || 'Partner'
    );

    // Apply persistent consequence state changes to Tonight's Situation view
    if (consequence.stateChanges && consequence.stateChanges.length > 0) {
      consequence.stateChanges.forEach((delta) => {
        if (delta.field === 'timeRemaining') {
          session.tonightSituation.timeRemaining = delta.change;
        } else if (delta.field === 'helperStatus') {
          session.tonightSituation.helperStatus = delta.change;
        } else if (delta.field === 'deliveryStatus') {
          session.tonightSituation.deliveryStatus = delta.change;
        } else if (delta.field === 'activeComplication') {
          session.tonightSituation.activeComplication = delta.change;
        }
      });
      session.tonightSituation.recentUpdateReason = consequence.immediateResult;
    }

    // Append to authoritative Story Log
    if (!session.storyLog) session.storyLog = [];
    session.storyLog.push({
      sceneId: currentScene.id,
      sceneTitle: currentScene.title,
      chapterNumber: currentScene.chapterNumber,
      hostChoiceLabel: hostLabel,
      guestChoiceLabel: guestLabel,
      outcomeTitle: consequence.title,
      immediateResult: consequence.immediateResult,
      tangibleChanges: consequence.tangibleChanges,
    });
  }

  async advanceSession(sessionId: string, token: string): Promise<SessionResponse> {
    const session = this.loadSession(sessionId);
    if (!session) throw new Error('Session not found');

    const isHost = token === session.hostToken;
    const isGuest = token === session.guestToken;

    if (!isHost && !isGuest) throw new Error('Unauthorized');

    if (isHost) {
      session.hostReadyAdvance = true;
    }
    if (isGuest) {
      session.guestReadyAdvance = true;
    }

    if (session.autoSimulatePartner) {
      session.guestReadyAdvance = true;
    }

    const partnerReady = session.guest ? session.guestReadyAdvance : true;
    if (session.hostReadyAdvance && partnerReady) {
      this.advanceToNextScene(session);
    }

    this.saveSession(session);
    return this.buildSessionResponse(session, token);
  }

  private advanceToNextScene(session: InternalSessionState) {
    const currentScene = STORY_SCENES[session.currentSceneIndex];
    const isLastSceneOfChapter =
      currentScene && currentScene.sceneNumber === currentScene.totalScenesInChapter;

    if (session.status === 'chapter_recap') {
      session.currentSceneIndex++;
      if (session.currentSceneIndex >= STORY_SCENES.length) {
        session.status = 'ended';
      } else {
        session.status = 'in_story';
        session.currentChapter = STORY_SCENES[session.currentSceneIndex].chapterNumber;
        this.resetSceneFlags(session);
      }
      return;
    }

    if (isLastSceneOfChapter && currentScene.chapterNumber < 4) {
      session.status = 'chapter_recap';
      session.hostReadyAdvance = false;
      session.guestReadyAdvance = false;
      return;
    }

    session.currentSceneIndex++;
    if (session.currentSceneIndex >= STORY_SCENES.length) {
      session.status = 'ended';
    } else {
      session.status = 'in_story';
      session.currentChapter = STORY_SCENES[session.currentSceneIndex].chapterNumber;
      this.resetSceneFlags(session);
    }
  }

  private resetSceneFlags(session: InternalSessionState) {
    session.hostChoice = undefined;
    session.guestChoice = undefined;
    session.hostReadyAdvance = false;
    session.guestReadyAdvance = false;
    session.host.hasSubmittedChoice = false;
    if (session.guest) session.guest.hasSubmittedChoice = false;
  }

  private buildSessionResponse(
    session: InternalSessionState,
    token: string
  ): SessionResponse {
    const isHost = token === session.hostToken;
    const isGuest = token === session.guestToken;
    const currentScene = STORY_SCENES[session.currentSceneIndex] || STORY_SCENES[0];

    const hostPlayer: SessionPlayer = {
      ...session.host,
      hasSubmittedChoice: !!session.hostChoice,
      submittedChoiceId:
        isHost || session.status === 'outcome_revealed'
          ? session.hostChoice
          : undefined,
      readyToAdvance: session.hostReadyAdvance,
    };

    let guestPlayer: SessionPlayer | undefined = undefined;
    if (session.guest) {
      guestPlayer = {
        ...session.guest,
        hasSubmittedChoice: !!session.guestChoice,
        submittedChoiceId:
          isGuest || session.status === 'outcome_revealed'
            ? session.guestChoice
            : undefined,
        readyToAdvance: session.guestReadyAdvance,
      };
    }

    let currentOutcome: SessionResponse['currentOutcome'] = undefined;
    if (session.status === 'outcome_revealed' && session.hostChoice && session.guestChoice) {
      const hostChoiceObj = currentScene.choices.host.find((c) => c.id === session.hostChoice);
      const guestChoiceObj = currentScene.choices.guest.find((c) => c.id === session.guestChoice);

      const hostLabel = hostChoiceObj ? hostChoiceObj.label : session.hostChoice;
      const guestLabel = guestChoiceObj ? guestChoiceObj.label : session.guestChoice;

      const consequence = getCombinedConsequence(
        currentScene.id,
        session.hostChoice,
        session.guestChoice,
        session.host.character.name || 'Host',
        session.guest?.character.name || 'Partner'
      );

      currentOutcome = {
        hostChoice: {
          id: session.hostChoice,
          label: hostLabel,
          description: hostChoiceObj?.description,
        },
        guestChoice: {
          id: session.guestChoice,
          label: guestLabel,
          description: guestChoiceObj?.description,
        },
        consequence,
        hostReadyToAdvance: session.hostReadyAdvance,
        guestReadyToAdvance: session.guestReadyAdvance,
      };
    }

    const chapterRecap =
      session.status === 'chapter_recap'
        ? CHAPTER_RECAPS[session.currentChapter] || CHAPTER_RECAPS[1]
        : undefined;

    const ending =
      session.status === 'ended' ? calculateEnding(session.choiceHistory) : undefined;

    // Build concise previous outcome summary for "Previously tonight..." recap
    const previousOutcomeSummary =
      session.storyLog && session.storyLog.length > 0
        ? session.storyLog[session.storyLog.length - 1].immediateResult
        : undefined;

    return {
      sessionId: session.sessionId,
      joinCode: session.joinCode,
      status: session.status,
      currentChapter: session.currentChapter,
      currentScene: session.status === 'ended' ? undefined : currentScene,
      host: hostPlayer,
      guest: guestPlayer,
      submissionStatus: {
        hostSubmitted: !!session.hostChoice,
        guestSubmitted: !!session.guestChoice,
      },
      currentOutcome,
      tonightSituation: session.tonightSituation,
      previousOutcomeSummary,
      storyLog: session.storyLog || [],
      chapterRecap,
      ending,
    };
  }
}

export const mockApiClient = new MockGameApiClient();
