export function apiOrigin(value: string): string {
  const message = 'VITE_API_BASE_URL must be a server origin, e.g. https://tgdgbackend-production.up.railway.app or http://localhost:3001, without /3001 or /api/v1.';
  let url: URL;
  try { url = new URL(value.trim()); } catch { throw new Error(message); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash) throw new Error(message);
  return url.origin;
}
