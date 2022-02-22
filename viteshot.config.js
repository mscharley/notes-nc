const playwrightShooter = require('viteshot/shooters/playwright');
const playwright = require('playwright');

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
};
