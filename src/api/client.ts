import {
  CreateSessionResponse,
  JoinSessionResponse,
  CharacterUpdateRequest,
  SubmitChoiceRequest,
  SessionResponse,
  HealthCheckResponse,
} from '../types/game';
import { apiOrigin } from './baseUrl';

export interface GameApiClient {
  createSession(): Promise<CreateSessionResponse>;
  joinSession(code: string): Promise<JoinSessionResponse>;
  updateCharacter(
    sessionId: string,
    token: string,
    character: CharacterUpdateRequest
  ): Promise<SessionResponse>;
  startGame(sessionId: string, token: string): Promise<SessionResponse>;
  getSession(sessionId: string, token: string): Promise<SessionResponse>;
  submitChoice(
    sessionId: string,
    token: string,
    choice: SubmitChoiceRequest
  ): Promise<SessionResponse>;
  advanceSession(sessionId: string, token: string, phaseId?: string): Promise<SessionResponse>;
  checkHealth(): Promise<HealthCheckResponse>;
}

export class HttpGameApiClient implements GameApiClient {
  private baseUrl: string;
  private readonly pendingJoins = new Map<string, string>();

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? import.meta.env.VITE_API_BASE_URL ?? '';
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: unknown,
    token?: string
  ): Promise<T> {
    if (!this.baseUrl) throw new Error('The game server is not configured. Set VITE_API_BASE_URL and rebuild the frontend.');
    const url = `${apiOrigin(this.baseUrl)}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson?.message) {
          errorMessage = errorJson.message;
        }
      } catch {
        // ignore json parse error
      }
      throw new ApiError(errorMessage, response.status);
    }

    return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error && ['AbortError', 'TimeoutError'].includes(error.name)) {
        throw new Error('The date server took too long to respond. Please try again. If you were joining, use the same browser and room code to recover your seat.');
      }
      if (error instanceof TypeError) {
        throw new Error('Could not reach the date server. Check your connection and try again.');
      }
      throw error;
    }
  }

  async createSession(): Promise<CreateSessionResponse> {
    return this.request<CreateSessionResponse>('/api/v1/sessions', 'POST');
  }

  async joinSession(code: string): Promise<JoinSessionResponse> {
    const joinCode = code.toUpperCase().trim();
    const key = `date_glitch_pending_join_${apiOrigin(this.baseUrl)}_${joinCode}`;
    // Keep the credential before sending: a lost response must not strand the guest seat.
    let playerToken = this.pendingJoins.get(key) || localStorage.getItem(key);
    if (!playerToken) {
      playerToken = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      localStorage.setItem(key, playerToken);
      this.pendingJoins.set(key, playerToken);
    }
    return this.request<JoinSessionResponse>('/api/v1/sessions/join', 'POST', { joinCode, playerToken });
  }

  async updateCharacter(
    sessionId: string,
    token: string,
    character: CharacterUpdateRequest
  ): Promise<SessionResponse> {
    return this.request<SessionResponse>(
      `/api/v1/sessions/${sessionId}/character`,
      'POST',
      character,
      token
    );
  }

  async startGame(sessionId: string, token: string): Promise<SessionResponse> {
    return this.request<SessionResponse>(
      `/api/v1/sessions/${sessionId}/start`,
      'POST',
      {},
      token
    );
  }

  async getSession(sessionId: string, token: string): Promise<SessionResponse> {
    return this.request<SessionResponse>(
      `/api/v1/sessions/${sessionId}`,
      'GET',
      undefined,
      token
    );
  }

  async submitChoice(
    sessionId: string,
    token: string,
    choice: SubmitChoiceRequest
  ): Promise<SessionResponse> {
    return this.request<SessionResponse>(
      `/api/v1/sessions/${sessionId}/choices`,
      'POST',
      choice,
      token
    );
  }

  async advanceSession(sessionId: string, token: string, phaseId?: string): Promise<SessionResponse> {
    return this.request<SessionResponse>(
      `/api/v1/sessions/${sessionId}/advance`,
      'POST',
      { ready: true, phaseId },
      token
    );
  }

  async checkHealth(): Promise<HealthCheckResponse> {
    return this.request<HealthCheckResponse>('/api/v1/health', 'GET');
  }
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); }
}
