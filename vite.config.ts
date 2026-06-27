import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@backend': path.resolve(__dirname, './src/backend')
    }
  }
});