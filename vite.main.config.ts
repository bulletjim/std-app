import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

function copyNativeModules() {
  return {
    name: 'copy-native-modules',
    closeBundle() {
      // AGGIUNTO: 'file-uri-to-path' e 'bindings'
      const modulesToCopy = ['better-sqlite3', 'bindings', 'file-uri-to-path'];
      const srcNodeModules = path.resolve(__dirname, 'node_modules');
      const destNodeModules = path.resolve(__dirname, '.vite/build/node_modules');

      modulesToCopy.forEach((mod) => {
        const src = path.join(srcNodeModules, mod);
        const dest = path.join(destNodeModules, mod);
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true });
        }
      });
    },
  };
}

export default defineConfig({
  build: {
    outDir: '.vite/build',
    
    lib: {
      entry: './src/backend/main.ts', 
      fileName: () => 'main.js',
      formats: ['cjs'] 
    },
    
    rollupOptions: {
        // AGGIUNTO: 'bindings' e 'file-uri-to-path' agli esterni
        external: [
          'better-sqlite3', 
          'bindings',
          'file-uri-to-path',
          'electron', 
          'path', 
          'fs'
        ],
    },
  },
  plugins: [copyNativeModules()],
});