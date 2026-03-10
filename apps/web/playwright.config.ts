import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour Adagio
 *
 * Cette configuration couvre:
 * - Tests E2E pour les pages principales (home, modes, composer, grimoire)
 * - Tests d'accessibilité (contrast, keyboard navigation)
 * - Tests responsive (mobile, tablet, desktop)
 * - Tests du panel draggable
 */
export default defineConfig({
  // Répertoire de base des tests
  testDir: './e2e',

  // Timeout global pour les tests
  timeout: 15 * 1000,

  // Timeout pour les actions (expect, etc.)
  expect: {
    timeout: 5 * 1000,
  },

  // Retarder les tests pour le debugging
  // use: { headless: false, slowMo: 1000 },

  // Nombre de workers
  workers: process.env.CI ? 2 : 4,

  // Retry en cas d'échec (plus en CI)
  retries: process.env.CI ? 2 : 0,

  // Reporter pour les résultats
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
    ['list'],
  ],

  use: {
    // Base URL pour les tests (le serveur de dev Next.js)
    baseURL: 'http://localhost:4200',

    // Capture d'écran en cas d'échec
    screenshot: 'only-on-failure',

    // Video en cas d'échec
    video: 'retain-on-failure',

    // Trace en cas d'échec
    trace: 'on-first-retry',

    // Actions par défaut
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,

    // Contexte du navigateur
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },

  // Projets pour différents navigateurs et viewports
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'] },
    },

    // Tests Mobile
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },

    // Tests Tablet
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },

    // Tests d'accessibilité (configuration spéciale)
    {
      name: 'accessibility',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  // Serveur de développement
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4200',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
