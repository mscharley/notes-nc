import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const rendererPath = resolve('./src/renderer');
const outDirRenderer = resolve('./ts-build/renderer');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  root: rendererPath,
  resolve: {
    alias: {
      '@main': resolve('./src/main'),
      '@renderer': resolve('./src/renderer'),
      '@shared': resolve('./src/shared'),
    },
  },
  build: {
    outDir: outDirRenderer,
    emptyOutDir: true,
    chunkSizeWarningLimit: 2048,
  },
});
