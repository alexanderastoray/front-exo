/**
 * E2E Test Configuration
 * Central configuration for all E2E tests
 */

export const E2E_CONFIG = {
  // Base URLs
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',

  // Timeouts (in milliseconds)
  TIMEOUT: {
    DEFAULT: 30000, // 30 seconds
    NAVIGATION: 10000, // 10 seconds
    ELEMENT: 5000, // 5 seconds
    API: 10000, // 10 seconds
  },

  // Browser options
  BROWSER: {
    headless: process.env.HEADLESS !== 'false', // Default to headless
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO, 10) : 0,
    devtools: process.env.DEVTOOLS === 'true',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  },

  // Viewport settings
  VIEWPORT: {
    width: 1280,
    height: 800,
  },

  // Screenshot settings
  SCREENSHOT: {
    enabled: process.env.SCREENSHOT === 'true',
    path: './e2e/screenshots',
    fullPage: true,
  },

  // Test data
  TEST_USER: {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
};
