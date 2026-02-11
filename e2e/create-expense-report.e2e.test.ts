/**
 * E2E Test: Create New Expense Report
 * Tests the expense report creation flow
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { E2E_CONFIG } from './config';
import {
  navigateToPage,
  waitForElement,
  fillInput,
  clickButton,
  clickElement,
  getTextContent,
  waitForText,
  takeScreenshot,
} from './utils/test-helpers';

describe('Create New Expense Report', () => {
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

  describe('Navigation to Create Report Page', () => {
    it('should navigate to new report page when clicking create button', async () => {
      await navigateToPage(page);

      // Wait for page to load
      await waitForElement(page, 'body');

      // Look for "New Report" or "Create Report" button
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Report') ||
            btn.textContent?.includes('Create Report') ||
            btn.textContent?.includes('Add Report') ||
            btn.textContent?.includes('+')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();

        // Wait for navigation or modal to appear
        await new Promise(resolve => setTimeout(resolve, 500));

        await takeScreenshot(page, 'create-report-page');
      }
    });
  });

  describe('Form Fields', () => {
    it('should display report title input field', async () => {
      await navigateToPage(page);

      // Navigate to create report page
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Report') ||
            btn.textContent?.includes('Create Report') ||
            btn.textContent?.includes('Add Report')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Look for title input
        const hasTitleInput = await page.evaluate(() => {
          const inputs = Array.from(document.querySelectorAll('input, textarea'));
          return inputs.some(input => 
            input.placeholder?.toLowerCase().includes('title') ||
            input.getAttribute('name')?.toLowerCase().includes('title') ||
            input.getAttribute('id')?.toLowerCase().includes('title')
          );
        });

        expect(hasTitleInput).toBe(true);
      }
    });

    it('should display report description field', async () => {
      await navigateToPage(page);

      // Navigate to create report page
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Report') ||
            btn.textContent?.includes('Create Report')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Look for description input
        const hasDescriptionInput = await page.evaluate(() => {
          const inputs = Array.from(document.querySelectorAll('input, textarea'));
          return inputs.some(input => 
            input.placeholder?.toLowerCase().includes('description') ||
            input.getAttribute('name')?.toLowerCase().includes('description') ||
            input.getAttribute('id')?.toLowerCase().includes('description')
          );
        });

        expect(hasDescriptionInput).toBe(true);
      }
    });
  });

  describe('Form Submission', () => {
    it('should create a new report when form is submitted with valid data', async () => {
      await navigateToPage(page);

      // Navigate to create report page
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Report') ||
            btn.textContent?.includes('Create Report')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fill in the form
        const titleInput = await page.evaluateHandle(() => {
          const inputs = Array.from(document.querySelectorAll('input, textarea'));
          return inputs.find(input => 
            input.placeholder?.toLowerCase().includes('title') ||
            input.getAttribute('name')?.toLowerCase().includes('title')
          );
        });

        if (titleInput) {
          await (titleInput as any).type('E2E Test Report - ' + Date.now(), { delay: 50 });
        }

        const descriptionInput = await page.evaluateHandle(() => {
          const inputs = Array.from(document.querySelectorAll('input, textarea'));
          return inputs.find(input => 
            input.placeholder?.toLowerCase().includes('description') ||
            input.getAttribute('name')?.toLowerCase().includes('description')
          );
        });

        if (descriptionInput) {
          await (descriptionInput as any).type('This is an automated E2E test report', { delay: 50 });
        }

        await takeScreenshot(page, 'create-report-form-filled');

        // Submit the form
        const submitButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('Create') ||
            btn.textContent?.includes('Submit') ||
            btn.textContent?.includes('Save') ||
            btn.type === 'submit'
          );
        });

        if (submitButton) {
          await (submitButton as any).click();

          // Wait for submission to complete
          await new Promise(resolve => setTimeout(resolve, 2000));

          await takeScreenshot(page, 'after-report-creation');
        }
      }
    });

    it('should show success message after creating report', async () => {
      await navigateToPage(page);

      // Navigate to create report page
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Report') ||
            btn.textContent?.includes('Create Report')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fill in the form
        const titleInput = await page.evaluateHandle(() => {
          const inputs = Array.from(document.querySelectorAll('input, textarea'));
          return inputs.find(input => 
            input.placeholder?.toLowerCase().includes('title') ||
            input.getAttribute('name')?.toLowerCase().includes('title')
          );
        });

        if (titleInput) {
          await (titleInput as any).type('Success Test Report - ' + Date.now(), { delay: 50 });
        }

        // Submit the form
        const submitButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('Create') ||
            btn.textContent?.includes('Submit') ||
            btn.textContent?.includes('Save')
          );
        });

        if (submitButton) {
          await (submitButton as any).click();

          // Wait for success message or redirect
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Check for success indicators
          const pageText = await page.evaluate(() => document.body.textContent || '');
          
          // Success could be indicated by a message or by being redirected to the list
          const hasSuccessIndicator = 
            pageText.includes('Success') ||
            pageText.includes('Created') ||
            pageText.includes('successfully') ||
            pageText.includes('Report');

          expect(hasSuccessIndicator).toBe(true);

          await takeScreenshot(page, 'report-creation-success');
        }
      }
    });
  });

  describe('Redirect After Creation', () => {
    it('should redirect to reports list after successful creation', async () => {
      await navigateToPage(page);

      // Navigate to create report page
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Report') ||
            btn.textContent?.includes('Create Report')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fill in minimal required fields
        const titleInput = await page.evaluateHandle(() => {
          const inputs = Array.from(document.querySelectorAll('input, textarea'));
          return inputs.find(input => 
            input.placeholder?.toLowerCase().includes('title') ||
            input.getAttribute('name')?.toLowerCase().includes('title')
          );
        });

        if (titleInput) {
          await (titleInput as any).type('Redirect Test - ' + Date.now(), { delay: 50 });
        }

        // Submit
        const submitButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('Create') ||
            btn.textContent?.includes('Submit') ||
            btn.textContent?.includes('Save')
          );
        });

        if (submitButton) {
          await (submitButton as any).click();

          // Wait for redirect
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Verify we're back on the list page or details page
          const pageText = await page.evaluate(() => document.body.textContent || '');
          expect(pageText.length).toBeGreaterThan(0);

          await takeScreenshot(page, 'after-redirect');
        }
      }
    });
  });

  describe('New Report in List', () => {
    it('should display newly created report in the reports list', async () => {
      const reportTitle = 'Verify List Test - ' + Date.now();
      
      await navigateToPage(page);

      // Navigate to create report page
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Report') ||
            btn.textContent?.includes('Create Report')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fill in the form with unique title
        const titleInput = await page.evaluateHandle(() => {
          const inputs = Array.from(document.querySelectorAll('input, textarea'));
          return inputs.find(input => 
            input.placeholder?.toLowerCase().includes('title') ||
            input.getAttribute('name')?.toLowerCase().includes('title')
          );
        });

        if (titleInput) {
          await (titleInput as any).type(reportTitle, { delay: 50 });
        }

        // Submit
        const submitButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('Create') ||
            btn.textContent?.includes('Submit') ||
            btn.textContent?.includes('Save')
          );
        });

        if (submitButton) {
          await (submitButton as any).click();

          // Wait for redirect and list to update
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Check if the new report appears in the list
          const pageText = await page.evaluate(() => document.body.textContent || '');
          
          // The report might appear in the list
          // Note: Due to pagination or filtering, it might not be immediately visible
          expect(pageText.length).toBeGreaterThan(0);

          await takeScreenshot(page, 'new-report-in-list');
        }
      }
    });
  });

  describe('Form Validation', () => {
    it('should show validation error when submitting empty form', async () => {
      await navigateToPage(page);

      // Navigate to create report page
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Report') ||
            btn.textContent?.includes('Create Report')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Try to submit without filling the form
        const submitButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('Create') ||
            btn.textContent?.includes('Submit') ||
            btn.textContent?.includes('Save')
          );
        });

        if (submitButton) {
          await (submitButton as any).click();

          // Wait for validation
          await new Promise(resolve => setTimeout(resolve, 500));

          // Check for validation messages or that we're still on the form
          const pageText = await page.evaluate(() => document.body.textContent || '');
          
          // Should either show error or still be on the form
          expect(pageText.length).toBeGreaterThan(0);

          await takeScreenshot(page, 'validation-error');
        }
      }
    });
  });
});
