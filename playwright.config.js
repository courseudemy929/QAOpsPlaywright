// ✅ Azure only activates when BOTH conditions are true
const useAzure = !!(process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN?.trim()) 
&& process.env.USE_AZURE === 'true';

console.log("Azure mode:", useAzure);
//console.log("Token detected:", !!process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN);

const { defineConfig, devices } = require('@playwright/test');

/**
 * Core Local Playwright Configuration
 */
const playwrightConfig = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  testMatch: '**/*.spec.js',
  use: {
    trace: 'on-first-retry',
    actionTimeout: 60000, 
  },
  timeout: 60000,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

/**
 * Only try loading the Azure package if we are explicitly running 
 * a cloud service test execution via the terminal.
 */
if (useAzure) {
  try {
    const { createAzurePlaywrightConfig } = require('@azure/playwright');
    module.exports = createAzurePlaywrightConfig(playwrightConfig, {
      serviceAuthType: 'ACCESS_TOKEN',
      cloudWorkspaceUrl: 'https://eastus.api.playwright.microsoft.com/playwrightworkspaces/427cb6b2-2ca0-4413-a3b5-a147d5f4d01c'
    });
  } catch (e) {
    console.log("Azure config error:", e.message);
    module.exports = playwrightConfig;
  }
} else {
  module.exports = playwrightConfig;
}