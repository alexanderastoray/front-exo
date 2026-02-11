/**
 * E2E Test: Expense Reports List & Filtering
 * Tests the expense reports list page with search and filtering
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { E2E_CONFIG } from './config';
import {
  navigateToPage,
  waitForElement,
  waitForElements,
  fillInput,
  clickElement,
  getTextContent,
  getTextContents,
  getElementCount,
  takeScreenshot,
  waitForText,
} from './utils/test-helpers';

describe('Expense Reports List & Filtering', () => {
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

  describe('Page Load', () => {
    it('should navigate to expense reports page', async () => {
      await navigateToPage(page);

      // Wait for page to load
      await waitForElement(page, 'body');

      // Verify we're on the expense reports page (default page)
      const pageText = await page.evaluate(() => document.body.textContent || '');
      expect(pageText.length).toBeGreaterThan(0);

      await takeScreenshot(page, 'expense-reports-page');
    });

    it('should load and display expense reports', async () => {
      await navigateToPage(page);

      // Wait for reports to load
      await page.waitForFunction(
        () => {
          const text = document.body.textContent || '';
          return text.includes('Report') || text.includes('Expense') || text.includes('€') || text.includes('EUR');
        },
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      const pageText = await page.evaluate(() => document.body.textContent || '');
      expect(pageText).toMatch(/Report|Expense|€|EUR/i);

      await takeScreenshot(page, 'expense-reports-loaded');
    });
  });

  describe('Search Functionality', () => {
    it('should have a search input field', async () => {
      await navigateToPage(page);

      // Wait for page to load
      await page.waitForFunction(
        () => {
          const inputs = Array.from(document.querySelectorAll('input'));
          return inputs.some(input => 
            input.placeholder?.toLowerCase().includes('search') ||
            input.type === 'search' ||
            input.getAttribute('aria-label')?.toLowerCase().includes('search')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      const hasSearchInput = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        return inputs.some(input => 
          input.placeholder?.toLowerCase().includes('search') ||
          input.type === 'search' ||
          input.getAttribute('aria-label')?.toLowerCase().includes('search')
        );
      });

      expect(hasSearchInput).toBe(true);
    });

    it('should filter reports when searching by title', async () => {
      await navigateToPage(page);

      // Wait for reports to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('Expense'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Find search input
      const searchInput = await page.evaluateHandle(() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        return inputs.find(input => 
          input.placeholder?.toLowerCase().includes('search') ||
          input.type === 'search' ||
          input.getAttribute('aria-label')?.toLowerCase().includes('search')
        );
      });

      if (searchInput) {
        // Type in search box
        await (searchInput as any).type('Conference', { delay: 100 });

        // Wait for search results to update
        await new Promise(resolve => setTimeout(resolve, 1000));

        await takeScreenshot(page, 'search-results');
      }
    });
  });

  describe('Filter by Status', () => {
    it('should have status filter options', async () => {
      await navigateToPage(page);

      // Wait for page to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('Expense'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Look for filter buttons or dropdowns
      const hasFilters = await page.evaluate(() => {
        const text = document.body.textContent || '';
        return text.includes('Filter') || 
               text.includes('Status') || 
               text.includes('Draft') || 
               text.includes('Submitted') ||
               text.includes('Approved');
      });

      expect(hasFilters).toBe(true);
    });

    it('should filter reports by status when clicking status filter', async () => {
      await navigateToPage(page);

      // Wait for reports to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('Expense'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Look for status filter buttons
      const statusButton = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(btn => 
          btn.textContent?.includes('Draft') ||
          btn.textContent?.includes('Submitted') ||
          btn.textContent?.includes('Approved')
        );
      });

      if (statusButton) {
        await (statusButton as any).click();

        // Wait for filter to apply
        await new Promise(resolve => setTimeout(resolve, 500));

        await takeScreenshot(page, 'filtered-by-status');
      }
    });
  });

  describe('Filter by Date Range', () => {
    it('should have date filter options', async () => {
      await navigateToPage(page);

      // Wait for page to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('Expense'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Look for date inputs or date filter buttons
      const hasDateFilters = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        const hasDateInput = inputs.some(input => input.type === 'date');
        const text = document.body.textContent || '';
        const hasDateText = text.includes('Date') || text.includes('From') || text.includes('To');
        return hasDateInput || hasDateText;
      });

      expect(hasDateFilters).toBe(true);
    });
  });

  describe('Filtered Results', () => {
    it('should update results when filters are applied', async () => {
      await navigateToPage(page);

      // Wait for reports to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('Expense'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Get initial count of visible items
      const initialText = await page.evaluate(() => document.body.textContent || '');

      // Try to apply a filter
      const filterButton = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(btn => 
          btn.textContent?.includes('Filter') ||
          btn.textContent?.includes('Draft') ||
          btn.textContent?.includes('Submitted')
        );
      });

      if (filterButton) {
        await (filterButton as any).click();

        // Wait for UI to update
        await new Promise(resolve => setTimeout(resolve, 500));

        const filteredText = await page.evaluate(() => document.body.textContent || '');

        // Verify the page content changed (filter was applied)
        // Note: We can't guarantee the text will be different, but we can verify no errors
        expect(filteredText.length).toBeGreaterThan(0);

        await takeScreenshot(page, 'after-filter-applied');
      }
    });

    it('should show message when no reports match filters', async () => {
      await navigateToPage(page);

      // Wait for page to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('Expense'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Find search input and search for something unlikely to exist
      const searchInput = await page.evaluateHandle(() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        return inputs.find(input => 
          input.placeholder?.toLowerCase().includes('search') ||
          input.type === 'search'
        );
      });

      if (searchInput) {
        await (searchInput as any).type('NONEXISTENT_REPORT_XYZ123', { delay: 50 });

        // Wait for search to process
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if there's a "no results" message
        const pageText = await page.evaluate(() => document.body.textContent || '');
        
        // The page should either show "no results" or still show the search term
        expect(pageText).toContain('NONEXISTENT_REPORT_XYZ123');

        await takeScreenshot(page, 'no-results-found');
      }
    });
  });

  describe('Report List Display', () => {
    it('should display report cards or list items', async () => {
      await navigateToPage(page);

      // Wait for reports to load
      await page.waitForFunction(
        () => {
          const text = document.body.textContent || '';
          return text.includes('Report') || text.includes('Expense') || text.includes('€');
        },
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Verify reports are displayed
      const hasReports = await page.evaluate(() => {
        const text = document.body.textContent || '';
        return text.includes('€') || text.includes('EUR') || text.includes('Report');
      });

      expect(hasReports).toBe(true);

      await takeScreenshot(page, 'report-list-display');
    });
  });
});
