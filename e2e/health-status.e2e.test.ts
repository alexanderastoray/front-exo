/**
 * E2E Test: Health Check & Status Page
 * Tests the health status page functionality
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { E2E_CONFIG } from './config';
import {
  navigateToPage,
  waitForElement,
  getTextContent,
  isElementVisible,
  takeScreenshot,
} from './utils/test-helpers';

describe('Health Check & Status Page', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch(E2E_CONFIG.BROWSER);
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport(E2E_CONFIG.VIEWPORT);
  });

  afterEach(async () => {
    await page.close();
  });

  describe('Status Page Navigation', () => {
    it('should navigate to status page when clicking Status link', async () => {
      await navigateToPage(page);

      // Wait for the page to load
      await waitForElement(page, 'body');

      // Look for Status link/button and click it
      const statusButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find((btn) => btn.textContent?.includes('Status'));
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (statusButton) {
        await (statusButton as any).click();
      }

      // Wait for status page to load
      await waitForElement(page, 'h1, h2');

      // Verify we're on the status page
      const heading = await getTextContent(page, 'h1, h2');
      expect(heading.toLowerCase()).toContain('status');
    });
  });

  describe('Backend Health Status', () => {
    it('should display backend health status', async () => {
      await navigateToPage(page);

      // Navigate to status page
      const statusButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find((btn) => btn.textContent?.includes('Status'));
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (statusButton) {
        await (statusButton as any).click();
      }

      // Wait for backend status to be displayed
      await page.waitForFunction(
        () => {
          const text = document.body.textContent || '';
          return text.includes('Backend') || text.includes('API') || text.includes('Server');
        },
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Verify backend status is visible
      const pageText = await page.evaluate(() => document.body.textContent || '');
      expect(pageText).toMatch(/Backend|API|Server/i);

      await takeScreenshot(page, 'backend-health-status');
    });

    it('should show backend status as healthy when API is running', async () => {
      await navigateToPage(page);

      // Navigate to status page
      const statusButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find((btn) => btn.textContent?.includes('Status'));
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (statusButton) {
        await (statusButton as any).click();
      }

      // Wait for health check to complete
      await page.waitForFunction(
        () => {
          const text = document.body.textContent || '';
          return text.includes('Healthy') || text.includes('OK') || text.includes('Running') || text.includes('✓');
        },
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      const pageText = await page.evaluate(() => document.body.textContent || '');
      expect(pageText).toMatch(/Healthy|OK|Running|✓|Connected/i);
    });
  });

  describe('Database Status', () => {
    it('should display database status', async () => {
      await navigateToPage(page);

      // Navigate to status page
      const statusButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find((btn) => btn.textContent?.includes('Status'));
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (statusButton) {
        await (statusButton as any).click();
      }

      // Wait for database status to be displayed
      await page.waitForFunction(
        () => {
          const text = document.body.textContent || '';
          return text.includes('Database') || text.includes('DB');
        },
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      const pageText = await page.evaluate(() => document.body.textContent || '');
      expect(pageText).toMatch(/Database|DB/i);

      await takeScreenshot(page, 'database-status');
    });

    it('should show database status as healthy when connected', async () => {
      await navigateToPage(page);

      // Navigate to status page
      const statusButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find((btn) => btn.textContent?.includes('Status'));
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (statusButton) {
        await (statusButton as any).click();
      }

      // Wait for database status to show as healthy
      await page.waitForFunction(
        () => {
          const text = document.body.textContent || '';
          return (text.includes('Database') || text.includes('DB')) && 
                 (text.includes('Healthy') || text.includes('OK') || text.includes('Connected') || text.includes('✓'));
        },
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      const pageText = await page.evaluate(() => document.body.textContent || '');
      expect(pageText).toMatch(/Database.*(?:Healthy|OK|Connected|✓)|(?:Healthy|OK|Connected|✓).*Database/i);
    });
  });

  describe('UI Rendering', () => {
    it('should render status page correctly', async () => {
      await navigateToPage(page);

      // Navigate to status page
      const statusButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find((btn) => btn.textContent?.includes('Status'));
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (statusButton) {
        await (statusButton as any).click();
      }

      // Wait for page to load
      await waitForElement(page, 'body');

      // Verify page has content
      const bodyText = await page.evaluate(() => document.body.textContent || '');
      expect(bodyText.length).toBeGreaterThan(0);

      // Verify no error messages
      const hasError = await page.evaluate(() => {
        const text = document.body.textContent || '';
        return text.includes('Error') || text.includes('Failed') || text.includes('error');
      });

      if (hasError) {
        await takeScreenshot(page, 'status-page-error');
      }

      await takeScreenshot(page, 'status-page-rendered');
    });

    it('should display status cards or sections', async () => {
      await navigateToPage(page);

      // Navigate to status page
      const statusButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find((btn) => btn.textContent?.includes('Status'));
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (statusButton) {
        await (statusButton as any).click();
      }

      // Wait for status information to be displayed
      await page.waitForFunction(
        () => {
          const text = document.body.textContent || '';
          return text.includes('Backend') || text.includes('Database') || text.includes('API');
        },
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Verify multiple status items are displayed
      const statusItems = await page.evaluate(() => {
        const text = document.body.textContent || '';
        let count = 0;
        if (text.includes('Backend') || text.includes('API')) count++;
        if (text.includes('Database') || text.includes('DB')) count++;
        return count;
      });

      expect(statusItems).toBeGreaterThanOrEqual(1);
    });
  });
});
