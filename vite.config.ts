import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { apiOrigin } from './src/api/baseUrl';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  if (env.VITE_API_BASE_URL) apiOrigin(env.VITE_API_BASE_URL);
  else if (mode === 'production') throw new Error('Set VITE_API_BASE_URL before building.');
  return { plugins: [tailwindcss()], build: { target: 'es2022' }, server: { port: 3000, host: '0.0.0.0' } };
});
