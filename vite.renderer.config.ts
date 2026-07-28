import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './src/frontend',
  base: './',
  build: {
    outDir: path.resolve(__dirname, '.vite/renderer/main_window'),
    emptyOutDir: true,
  },
});