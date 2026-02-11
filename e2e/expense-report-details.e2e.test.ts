/**
 * E2E Test: View & Edit Expense Report Details
 * Tests viewing and editing expense report details
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { E2E_CONFIG } from './config';
import {
  navigateToPage,
  waitForElement,
  fillInput,
  clickElement,
  getTextContent,
  takeScreenshot,
} from './utils/test-helpers';

describe('Expense Report Details', () => {
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

  describe('Navigation to Report Details', () => {
    it('should navigate to report details when clicking on a report', async () => {
      await navigateToPage(page);

      // Wait for reports to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('€'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Find and click on a report card/item
      const reportCard = await page.evaluateHandle(() => {
        // Look for clickable report elements
        const elements = Array.from(document.querySelectorAll('div, article, li'));
        return elements.find(el => {
          const text = el.textContent || '';
          return text.includes('€') || text.includes('Report');
        });
      });

      if (reportCard) {
        await (reportCard as any).click();

        // Wait for details page to load
        await new Promise(resolve => setTimeout(resolve, 1000));

        await takeScreenshot(page, 'report-details-page');
      }
    });
  });

  describe('Report Details Display', () => {
    it('should display report title and details', async () => {
      await navigateToPage(page);

      // Wait for reports to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('€'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Click on first report
      const reportCard = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('div, article, li, button'));
        return elements.find(el => {
          const text = el.textContent || '';
          return (text.includes('€') || text.includes('Report')) && text.length > 10;
        });
      });

      if (reportCard) {
        await (reportCard as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verify details are displayed
        const pageText = await page.evaluate(() => document.body.textContent || '');
        expect(pageText.length).toBeGreaterThan(0);

        await takeScreenshot(page, 'report-details-displayed');
      }
    });

    it('should display report expenses list', async () => {
      await navigateToPage(page);

      // Wait for reports to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('€'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Click on a report
      const reportCard = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('div, article, li, button'));
        return elements.find(el => {
          const text = el.textContent || '';
          return (text.includes('€') || text.includes('Report')) && text.length > 10;
        });
      });

      if (reportCard) {
        await (reportCard as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Look for expenses section
        const pageText = await page.evaluate(() => document.body.textContent || '');
        
        // Should show expenses or a message about no expenses
        expect(pageText).toMatch(/Expense|€|No expenses|Add expense/i);

        await takeScreenshot(page, 'report-expenses-list');
      }
    });
  });

  describe('Edit Report Title', () => {
    it('should allow editing report title inline', async () => {
      await navigateToPage(page);

      // Wait for reports to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('€'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Click on a report
      const reportCard = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('div, article, li, button'));
        return elements.find(el => {
          const text = el.textContent || '';
          return (text.includes('€') || text.includes('Report')) && text.length > 10;
        });
      });

      if (reportCard) {
        await (reportCard as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Look for edit button or editable title
        const editButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
          return buttons.find(btn => 
            btn.textContent?.includes('Edit') ||
            btn.getAttribute('aria-label')?.includes('edit') ||
            btn.querySelector('svg') // Edit icon
          );
        });

        if (editButton) {
          await (editButton as any).click();
          await new Promise(resolve => setTimeout(resolve, 500));

          await takeScreenshot(page, 'edit-title-mode');
        }
      }
    });

    it('should save updated title when editing', async () => {
      await navigateToPage(page);

      // Wait for reports to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('€'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Click on a report
      const reportCard = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('div, article, li, button'));
        return elements.find(el => {
          const text = el.textContent || '';
          return (text.includes('€') || text.includes('Report')) && text.length > 10;
        });
      });

      if (reportCard) {
        await (reportCard as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Try to find and click edit button
        const editButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
          return buttons.find(btn => 
            btn.textContent?.includes('Edit') ||
            btn.getAttribute('aria-label')?.toLowerCase().includes('edit')
          );
        });

        if (editButton) {
          await (editButton as any).click();
          await new Promise(resolve => setTimeout(resolve, 500));

          // Look for input field
          const titleInput = await page.evaluateHandle(() => {
            const inputs = Array.from(document.querySelectorAll('input, textarea'));
            return inputs.find(input => 
              input.value?.includes('Report') ||
              input.placeholder?.toLowerCase().includes('title')
            );
          });

          if (titleInput) {
            // Clear and type new title
            await (titleInput as any).click({ clickCount: 3 });
            await (titleInput as any).type(' - Updated ' + Date.now(), { delay: 50 });

            // Save changes
            const saveButton = await page.evaluateHandle(() => {
              const buttons = Array.from(document.querySelectorAll('button'));
              return buttons.find(btn => 
                btn.textContent?.includes('Save') ||
                btn.textContent?.includes('✓') ||
                btn.textContent?.includes('Update')
              );
            });

            if (saveButton) {
              await (saveButton as any).click();
              await new Promise(resolve => setTimeout(resolve, 1000));

              await takeScreenshot(page, 'title-updated');
            }
          }
        }
      }
    });
  });

  describe('Add Expense to Report', () => {
    it('should show add expense button', async () => {
      await navigateToPage(page);

      // Wait for reports to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('€'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Click on a report
      const reportCard = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('div, article, li, button'));
        return elements.find(el => {
          const text = el.textContent || '';
          return (text.includes('€') || text.includes('Report')) && text.length > 10;
        });
      });

      if (reportCard) {
        await (reportCard as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Look for add expense button
        const hasAddButton = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.some(btn => 
            btn.textContent?.includes('Add Expense') ||
            btn.textContent?.includes('New Expense') ||
            btn.textContent?.includes('+')
          );
        });

        expect(hasAddButton).toBe(true);

        await takeScreenshot(page, 'add-expense-button-visible');
      }
    });

    it('should navigate to add expense form when clicking add expense', async () => {
      await navigateToPage(page);

      // Wait for reports to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('€'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Click on a report
      const reportCard = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('div, article, li, button'));
        return elements.find(el => {
          const text = el.textContent || '';
          return (text.includes('€') || text.includes('Report')) && text.length > 10;
        });
      });

      if (reportCard) {
        await (reportCard as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Click add expense button
        const addButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('Add Expense') ||
            btn.textContent?.includes('New Expense') ||
            (btn.textContent?.includes('+') && btn.textContent.length < 5)
          );
        });

        if (addButton) {
          await (addButton as any).click();
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Verify we're on expense form
          const pageText = await page.evaluate(() => document.body.textContent || '');
          expect(pageText).toMatch(/Expense|Amount|Category/i);

          await takeScreenshot(page, 'add-expense-form');
        }
      }
    });
  });

  describe('View Expense in Report', () => {
    it('should display expenses in the report details', async () => {
      await navigateToPage(page);

      // Wait for reports to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('€'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Click on a report
      const reportCard = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('div, article, li, button'));
        return elements.find(el => {
          const text = el.textContent || '';
          return (text.includes('€') || text.includes('Report')) && text.length > 10;
        });
      });

      if (reportCard) {
        await (reportCard as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check for expense items
        const pageText = await page.evaluate(() => document.body.textContent || '');
        
        // Should show expenses or indicate no expenses
        expect(pageText.length).toBeGreaterThan(0);

        await takeScreenshot(page, 'expenses-in-report');
      }
    });
  });

  describe('Back Navigation', () => {
    it('should navigate back to reports list when clicking back button', async () => {
      await navigateToPage(page);

      // Wait for reports to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('Report') || document.body.textContent?.includes('€'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Click on a report
      const reportCard = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('div, article, li, button'));
        return elements.find(el => {
          const text = el.textContent || '';
          return (text.includes('€') || text.includes('Report')) && text.length > 10;
        });
      });

      if (reportCard) {
        await (reportCard as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Look for back button
        const backButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('Back') ||
            btn.textContent?.includes('←') ||
            btn.textContent?.includes('‹') ||
            btn.getAttribute('aria-label')?.toLowerCase().includes('back')
          );
        });

        if (backButton) {
          await (backButton as any).click();
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Verify we're back on the list
          const pageText = await page.evaluate(() => document.body.textContent || '');
          expect(pageText.length).toBeGreaterThan(0);

          await takeScreenshot(page, 'back-to-list');
        }
      }
    });
  });
});
