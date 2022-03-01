const playwrightShooter = require('viteshot/shooters/playwright');
const playwright = require('playwright');
const { defineConfig } = require('vite');
const { resolve } = require('path');

module.exports = {
  framework: {
    type: 'react',
  },
  shooter: playwrightShooter(playwright.chromium),
  filePathPattern: 'src/renderer/**/*.screenshot.@(js|jsx|tsx|vue|svelte)',
  wrapper: {
    path: 'src/renderer/__viteshot__/ScreenshotWrapper.tsx',
    componentName: 'ScreenshotWrapper',
  },
  vite: defineConfig({
    resolve: {
      alias: {
        '@main': resolve('./src/main'),
        '@renderer': resolve('./src/renderer'),
        '@shared': resolve('./src/shared'),
      },
    },
  }),
};
