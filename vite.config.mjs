import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/* global process */

const port = Number(process.env.VITE_PORT) || 5000;

const rendererPath = resolve('./src/renderer');
const outDir = resolve('./ts-build');
const outDirRenderer = resolve(outDir, './renderer');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  root: rendererPath,
  resolve: {
    alias: {
      // Paths as defined in tsconfig
      '~main': resolve('./src/main'),
      '~renderer': resolve('./src/renderer'),
      '~shared': resolve('./src/shared'),
    },
  },
  server: {
    port,
    proxy: {
      '/preload.js.map': {
        target: `http://localhost:${port}`,
        rewrite: (path) => `/@fs${outDir}/main${path}`,
      },
    },
  },
  build: {
    outDir: outDirRenderer,
    emptyOutDir: true,
    chunkSizeWarningLimit: 2048,
  },
});
