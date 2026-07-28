import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@backend': path.resolve(__dirname, './src/backend'),
      '@frontend': path.resolve(__dirname, './src/frontend'),
      '@test': path.resolve(__dirname, './src/test')
    }
  }
});