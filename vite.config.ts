import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { join, resolve } from "path";

const rendererPath = resolve(__dirname, "./src/renderer");
const outDirRenderer = resolve(__dirname, "./ts-build/renderer")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  root: rendererPath,
  build: {
    outDir: outDirRenderer,
    emptyOutDir: true,
    chunkSizeWarningLimit: 2048,
  },
});
