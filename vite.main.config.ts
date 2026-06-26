import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '.vite/build',
    
    lib: {
      entry: './src/backend/main.ts', 
      fileName: () => 'main.js',
      formats: ['cjs'] 
    },
    
    rollupOptions: {
        external: [
          'better-sqlite3', 
          'electron', 
          'path', 
          'fs'
        ],
    },
  },
});