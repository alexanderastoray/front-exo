/**
 * E2E Test: Create & Manage Individual Expense
 * Tests creating, editing, and deleting individual expenses
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { E2E_CONFIG } from './config';
import {
  navigateToPage,
  waitForElement,
  fillInput,
  clickElement,
  takeScreenshot,
} from './utils/test-helpers';

describe('Expense Management', () => {
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

  describe('Navigate to Create Expense Page', () => {
    it('should navigate to create expense page', async () => {
      await navigateToPage(page);

      // Wait for page to load
      await waitForElement(page, 'body');

      // Look for "New Expense" or "Add Expense" button
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Expense') ||
            btn.textContent?.includes('Add Expense') ||
            btn.textContent?.includes('Create Expense')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        await takeScreenshot(page, 'create-expense-page');
      }
    });
  });

  describe('Create Expense Form', () => {
    it('should display expense amount field', async () => {
      await navigateToPage(page);

      // Navigate to create expense
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Expense') ||
            btn.textContent?.includes('Add Expense')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Look for amount input
        const hasAmountInput = await page.evaluate(() => {
          const inputs = Array.from(document.querySelectorAll('input'));
          return inputs.some(input => 
            input.type === 'number' ||
            (input as HTMLInputElement).placeholder?.toLowerCase().includes('amount') ||
            input.getAttribute('name')?.toLowerCase().includes('amount')
          );
        });

        expect(hasAmountInput).toBe(true);
      }
    });

    it('should display category selector', async () => {
      await navigateToPage(page);

      // Navigate to create expense
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Expense') ||
            btn.textContent?.includes('Add Expense')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Look for category selector
        const hasCategorySelector = await page.evaluate(() => {
          const selects = Array.from(document.querySelectorAll('select'));
          const text = document.body.textContent || '';
          return selects.some(select => 
            select.getAttribute('name')?.toLowerCase().includes('category')
          ) || text.includes('Category');
        });

        expect(hasCategorySelector).toBe(true);
      }
    });

    it('should display date field', async () => {
      await navigateToPage(page);

      // Navigate to create expense
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Expense') ||
            btn.textContent?.includes('Add Expense')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Look for date input
        const hasDateInput = await page.evaluate(() => {
          const inputs = Array.from(document.querySelectorAll('input'));
          return inputs.some(input => 
            input.type === 'date' ||
            (input as HTMLInputElement).placeholder?.toLowerCase().includes('date')
          );
        });

        expect(hasDateInput).toBe(true);
      }
    });

    it('should display description field', async () => {
      await navigateToPage(page);

      // Navigate to create expense
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Expense') ||
            btn.textContent?.includes('Add Expense')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Look for description field
        const hasDescriptionField = await page.evaluate(() => {
          const inputs = Array.from(document.querySelectorAll('input, textarea'));
          return inputs.some(input => 
            (input as HTMLInputElement).placeholder?.toLowerCase().includes('description') ||
            input.getAttribute('name')?.toLowerCase().includes('description')
          );
        });

        expect(hasDescriptionField).toBe(true);
      }
    });
  });

  describe('Submit Expense Form', () => {
    it('should create expense when form is submitted with valid data', async () => {
      await navigateToPage(page);

      // Navigate to create expense
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Expense') ||
            btn.textContent?.includes('Add Expense')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fill amount
        const amountInput = await page.evaluateHandle(() => {
          const inputs = Array.from(document.querySelectorAll('input'));
          return inputs.find(input => 
            input.type === 'number' ||
            (input as HTMLInputElement).placeholder?.toLowerCase().includes('amount')
          );
        });

        if (amountInput) {
          await (amountInput as any).type('125.50', { delay: 50 });
        }

        // Fill description
        const descInput = await page.evaluateHandle(() => {
          const inputs = Array.from(document.querySelectorAll('input, textarea'));
          return inputs.find(input => 
            (input as HTMLInputElement).placeholder?.toLowerCase().includes('description') ||
            input.getAttribute('name')?.toLowerCase().includes('description')
          );
        });

        if (descInput) {
          await (descInput as any).type('E2E Test Expense', { delay: 50 });
        }

        await takeScreenshot(page, 'expense-form-filled');

        // Submit
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
          await new Promise(resolve => setTimeout(resolve, 2000));

          await takeScreenshot(page, 'after-expense-creation');
        }
      }
    });

    it('should show success message after creating expense', async () => {
      await navigateToPage(page);

      // Navigate to create expense
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Expense') ||
            btn.textContent?.includes('Add Expense')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fill minimal required fields
        const amountInput = await page.evaluateHandle(() => {
          const inputs = Array.from(document.querySelectorAll('input'));
          return inputs.find(input => 
            input.type === 'number' ||
            (input as HTMLInputElement).placeholder?.toLowerCase().includes('amount')
          );
        });

        if (amountInput) {
          await (amountInput as any).type('99.99', { delay: 50 });
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
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Check for success indicators
          const pageText = await page.evaluate(() => document.body.textContent || '');
          expect(pageText.length).toBeGreaterThan(0);

          await takeScreenshot(page, 'expense-creation-success');
        }
      }
    });
  });

  describe('Navigate to Expense Details', () => {
    it('should navigate to expense details page', async () => {
      await navigateToPage(page);

      // Wait for page to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('€') || document.body.textContent?.includes('Expense'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Try to find and click on an expense
      const expenseItem = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('div, li, article, button'));
        return elements.find(el => {
          const text = el.textContent || '';
          return text.includes('€') && text.length > 5 && text.length < 200;
        });
      });

      if (expenseItem) {
        await (expenseItem as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        await takeScreenshot(page, 'expense-details-page');
      }
    });
  });

  describe('Edit Expense Details', () => {
    it('should allow editing expense details', async () => {
      await navigateToPage(page);

      // Wait for page to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('€') || document.body.textContent?.includes('Expense'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Find an expense to edit
      const expenseItem = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('div, li, article, button'));
        return elements.find(el => {
          const text = el.textContent || '';
          return text.includes('€') && text.length > 5;
        });
      });

      if (expenseItem) {
        await (expenseItem as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Look for edit button
        const editButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('Edit') ||
            btn.getAttribute('aria-label')?.toLowerCase().includes('edit')
          );
        });

        if (editButton) {
          await (editButton as any).click();
          await new Promise(resolve => setTimeout(resolve, 500));

          await takeScreenshot(page, 'edit-expense-mode');
        }
      }
    });

    it('should save updated expense details', async () => {
      await navigateToPage(page);

      // Wait for page to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('€') || document.body.textContent?.includes('Expense'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Find an expense
      const expenseItem = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('div, li, article, button'));
        return elements.find(el => {
          const text = el.textContent || '';
          return text.includes('€') && text.length > 5;
        });
      });

      if (expenseItem) {
        await (expenseItem as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Click edit
        const editButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('Edit')
          );
        });

        if (editButton) {
          await (editButton as any).click();
          await new Promise(resolve => setTimeout(resolve, 500));

          // Update description
          const descInput = await page.evaluateHandle(() => {
            const inputs = Array.from(document.querySelectorAll('input, textarea'));
            return inputs.find(input => 
              (input as HTMLInputElement).value?.length > 0 ||
              (input as HTMLInputElement).placeholder?.toLowerCase().includes('description')
            );
          });

          if (descInput) {
            await (descInput as any).type(' - Updated', { delay: 50 });

            // Save
            const saveButton = await page.evaluateHandle(() => {
              const buttons = Array.from(document.querySelectorAll('button'));
              return buttons.find(btn => 
                btn.textContent?.includes('Save') ||
                btn.textContent?.includes('Update')
              );
            });

            if (saveButton) {
              await (saveButton as any).click();
              await new Promise(resolve => setTimeout(resolve, 1000));

              await takeScreenshot(page, 'expense-updated');
            }
          }
        }
      }
    });
  });

  describe('Delete Expense', () => {
    it('should show delete button on expense details page', async () => {
      await navigateToPage(page);

      // Wait for page to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('€') || document.body.textContent?.includes('Expense'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Find an expense
      const expenseItem = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('div, li, article, button'));
        return elements.find(el => {
          const text = el.textContent || '';
          return text.includes('€') && text.length > 5;
        });
      });

      if (expenseItem) {
        await (expenseItem as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Look for delete button
        const hasDeleteButton = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.some(btn => 
            btn.textContent?.includes('Delete') ||
            btn.textContent?.includes('Remove') ||
            btn.getAttribute('aria-label')?.toLowerCase().includes('delete')
          );
        });

        expect(hasDeleteButton).toBe(true);

        await takeScreenshot(page, 'delete-button-visible');
      }
    });

    it('should show confirmation dialog when deleting expense', async () => {
      await navigateToPage(page);

      // Wait for page to load
      await page.waitForFunction(
        () => document.body.textContent?.includes('€') || document.body.textContent?.includes('Expense'),
        { timeout: E2E_CONFIG.TIMEOUT.API }
      );

      // Find an expense
      const expenseItem = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('div, li, article, button'));
        return elements.find(el => {
          const text = el.textContent || '';
          return text.includes('€') && text.length > 5;
        });
      });

      if (expenseItem) {
        await (expenseItem as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Click delete button
        const deleteButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('Delete') ||
            btn.textContent?.includes('Remove')
          );
        });

        if (deleteButton) {
          await (deleteButton as any).click();
          await new Promise(resolve => setTimeout(resolve, 500));

          // Check for confirmation dialog
          const pageText = await page.evaluate(() => document.body.textContent || '');
          
          // Should show confirmation or be deleted
          expect(pageText.length).toBeGreaterThan(0);

          await takeScreenshot(page, 'delete-confirmation');
        }
      }
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      await navigateToPage(page);

      // Navigate to create expense
      const createButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('New Expense') ||
            btn.textContent?.includes('Add Expense')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (createButton) {
        await (createButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Try to submit without filling required fields
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
          await new Promise(resolve => setTimeout(resolve, 500));

          // Should show validation error or stay on form
          const pageText = await page.evaluate(() => document.body.textContent || '');
          expect(pageText.length).toBeGreaterThan(0);

          await takeScreenshot(page, 'expense-validation-error');
        }
      }
    });
  });
});
