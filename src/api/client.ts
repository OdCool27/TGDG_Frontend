import {
  CreateSessionResponse,
  JoinSessionResponse,
  CharacterUpdateRequest,
  SubmitChoiceRequest,
  SessionResponse,
  HealthCheckResponse,
} from '../types/game';

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

  constructor(baseUrl?: string) {
    this.baseUrl = (baseUrl || (import.meta.env.VITE_API_BASE_URL as string) || '').replace(
      /\/$/,
      ''
    );
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: unknown,
    token?: string
  ): Promise<T> {
    if (!this.baseUrl) throw new Error('The game server is not configured. Set VITE_API_BASE_URL and rebuild the frontend.');
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(60000),
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

    return response.json();
  }

  async createSession(): Promise<CreateSessionResponse> {
    return this.request<CreateSessionResponse>('/api/v1/sessions', 'POST');
  }

  async joinSession(code: string): Promise<JoinSessionResponse> {
    return this.request<JoinSessionResponse>('/api/v1/sessions/join', 'POST', {
      joinCode: code.toUpperCase().trim(),
    });
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
