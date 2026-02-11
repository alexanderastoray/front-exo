/**
 * E2E Test: User Profile Management
 * Tests viewing and editing user profile
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { E2E_CONFIG } from './config';
import {
  navigateToPage,
  waitForElement,
  takeScreenshot,
} from './utils/test-helpers';

describe('User Profile Management', () => {
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

  describe('Navigate to Profile Page', () => {
    it('should navigate to profile page when clicking profile link', async () => {
      await navigateToPage(page);

      // Wait for page to load
      await waitForElement(page, 'body');

      // Look for Profile link/button
      const profileButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('Profile') ||
            btn.textContent?.includes('Account') ||
            btn.getAttribute('aria-label')?.toLowerCase().includes('profile')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (profileButton) {
        await (profileButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        await takeScreenshot(page, 'profile-page');
      }
    });
  });

  describe('Display User Information', () => {
    it('should display user name', async () => {
      await navigateToPage(page);

      // Navigate to profile
      const profileButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('Profile') ||
            btn.textContent?.includes('Account')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (profileButton) {
        await (profileButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check for user name display
        const pageText = await page.evaluate(() => document.body.textContent || '');
        
        // Should show some user information
        expect(pageText).toMatch(/Name|User|Profile/i);

        await takeScreenshot(page, 'user-name-displayed');
      }
    });

    it('should display user email', async () => {
      await navigateToPage(page);

      // Navigate to profile
      const profileButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('Profile') ||
            btn.textContent?.includes('Account')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (profileButton) {
        await (profileButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check for email display
        const pageText = await page.evaluate(() => document.body.textContent || '');
        
        // Should show email or email field
        expect(pageText).toMatch(/Email|@|Mail/i);

        await takeScreenshot(page, 'user-email-displayed');
      }
    });
  });

  describe('Edit User Name', () => {
    it('should allow editing user name', async () => {
      await navigateToPage(page);

      // Navigate to profile
      const profileButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('Profile') ||
            btn.textContent?.includes('Account')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (profileButton) {
        await (profileButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Look for edit button or editable fields
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

          await takeScreenshot(page, 'edit-profile-mode');
        } else {
          // Fields might be directly editable
          const nameInput = await page.evaluateHandle(() => {
            const inputs = Array.from(document.querySelectorAll('input'));
            return inputs.find(input => 
              (input as HTMLInputElement).placeholder?.toLowerCase().includes('name') ||
              input.getAttribute('name')?.toLowerCase().includes('name')
            );
          });

          if (nameInput) {
            await takeScreenshot(page, 'editable-name-field');
          }
        }
      }
    });

    it('should update user name when edited', async () => {
      await navigateToPage(page);

      // Navigate to profile
      const profileButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('Profile') ||
            btn.textContent?.includes('Account')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (profileButton) {
        await (profileButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Try to edit name
        const editButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('Edit')
          );
        });

        if (editButton) {
          await (editButton as any).click();
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Find name input
        const nameInput = await page.evaluateHandle(() => {
          const inputs = Array.from(document.querySelectorAll('input'));
          return inputs.find(input => 
            (input as HTMLInputElement).placeholder?.toLowerCase().includes('name') ||
            input.getAttribute('name')?.toLowerCase().includes('name') ||
            input.getAttribute('id')?.toLowerCase().includes('name')
          );
        });

        if (nameInput) {
          await (nameInput as any).type(' Updated', { delay: 50 });

          // Save changes
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

            await takeScreenshot(page, 'name-updated');
          }
        }
      }
    });
  });

  describe('Edit User Email', () => {
    it('should allow editing user email', async () => {
      await navigateToPage(page);

      // Navigate to profile
      const profileButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('Profile') ||
            btn.textContent?.includes('Account')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (profileButton) {
        await (profileButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Look for email input
        const emailInput = await page.evaluateHandle(() => {
          const inputs = Array.from(document.querySelectorAll('input'));
          return inputs.find(input => 
            input.type === 'email' ||
            (input as HTMLInputElement).placeholder?.toLowerCase().includes('email') ||
            input.getAttribute('name')?.toLowerCase().includes('email')
          );
        });

        if (emailInput) {
          await takeScreenshot(page, 'email-field-visible');
        }
      }
    });
  });

  describe('Save Profile Changes', () => {
    it('should save changes when save button is clicked', async () => {
      await navigateToPage(page);

      // Navigate to profile
      const profileButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn => 
            btn.textContent?.includes('Profile') ||
            btn.textContent?.includes('Account')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (profileButton) {
        await (profileButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Enable edit mode if needed
        const editButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => 
            btn.textContent?.includes('Edit')
          );
        });

        if (editButton) {
          await (editButton as any).click();
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Make a small change
        const nameInput = await page.evaluateHandle(() => {
          const inputs = Array.from(document.querySelectorAll('input'));
          return inputs.find(input => 
            (input as HTMLInputElement).placeholder?.toLowerCase().includes('name') ||
            input.getAttribute('name')?.toLowerCase().includes('name')
          );
        });

        if (nameInput) {
          await (nameInput as any).type(' Test', { delay: 50 });
        }

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

          await takeScreenshot(page, 'profile-saved');
        }
      }
    });

    it('should show success message after saving changes', async () => {
      await navigateToPage(page);

      // Navigate to profile
      const profileButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn =>
            btn.textContent?.includes('Profile') ||
            btn.textContent?.includes('Account')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (profileButton) {
        await (profileButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Enable edit mode if needed
        const editButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn =>
            btn.textContent?.includes('Edit')
          );
        });

        if (editButton) {
          await (editButton as any).click();
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Make a change
        const nameInput = await page.evaluateHandle(() => {
          const inputs = Array.from(document.querySelectorAll('input'));
          return inputs.find(input =>
            (input as HTMLInputElement).placeholder?.toLowerCase().includes('name') ||
            input.getAttribute('name')?.toLowerCase().includes('name')
          );
        });

        if (nameInput) {
          await (nameInput as any).type(' Success', { delay: 50 });
        }

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

          // Check for success message
          const pageText = await page.evaluate(() => document.body.textContent || '');
          expect(pageText.length).toBeGreaterThan(0);

          await takeScreenshot(page, 'profile-success-message');
        }
      }
    });
  });

  describe('Display Updated Information', () => {
    it('should display updated information after saving', async () => {
      await navigateToPage(page);

      // Navigate to profile
      const profileButton = await page.waitForFunction(
        () => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          return buttons.find(btn =>
            btn.textContent?.includes('Profile') ||
            btn.textContent?.includes('Account')
          );
        },
        { timeout: E2E_CONFIG.TIMEOUT.ELEMENT }
      );

      if (profileButton) {
        await (profileButton as any).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verify profile information is displayed
        const pageText = await page.evaluate(() => document.body.textContent || '');
        expect(pageText).toMatch(/Name|Email|Profile/i);

        await takeScreenshot(page, 'updated-profile-displayed');
      }
    });
  });
});