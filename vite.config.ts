import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[tailwindcss()],build:{target:'es2022'},server:{port:3000,host:'0.0.0.0'}});
