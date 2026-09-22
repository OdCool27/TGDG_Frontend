import { GameApiClient, HttpGameApiClient } from './client';
// Explicit development preview only. Never fall back to local state in production.
const mock = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true';
const preview = mock ? (await import('./mockAdapter')).mockApiClient : undefined;
export const isMockMode = () => mock;
export function setMockMode(_forceMock: boolean) { /* Configure VITE_USE_MOCK and restart Vite. */ }
export const subscribeToPreview = (listener: () => void) => preview?.subscribe(listener) || (() => {});
export const simulatePreview = (id: string, enabled: boolean) => preview?.enableAutoSimulation(id, enabled);
const http = new HttpGameApiClient(import.meta.env.VITE_API_BASE_URL);
export function getApiClient(): GameApiClient { return preview || http; }
