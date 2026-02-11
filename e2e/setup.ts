/**
 * E2E Test Setup
 * Global setup and teardown for E2E tests
 */

import { E2E_CONFIG } from './config';

// Extend Jest timeout for E2E tests
jest.setTimeout(E2E_CONFIG.TIMEOUT.DEFAULT);

// Global setup
beforeAll(async () => {
  console.log('🚀 Starting E2E test suite...');
  console.log(`Frontend URL: ${E2E_CONFIG.FRONTEND_URL}`);
  console.log(`Backend URL: ${E2E_CONFIG.BACKEND_URL}`);
});

// Global teardown
afterAll(async () => {
  console.log('✅ E2E test suite completed');
});
